import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Services.js';
import { auth, requireRole } from '../middleware/auth.js';
import { generateICS } from '../utils/generateICS.js';

const router = express.Router();



// Neue Route für öffentliche Zugriffe
router.get('/public', async (req, res) => {
  try {
    const appointments = await Appointment.find().select('date time'); // Nur relevante Felder
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alle Termine abrufen (nur Admin)
router.get('/', auth, requireRole(['admin', 'superuser']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .select('date time persons') // nur die Felder, die wir brauchen
      .lean();

    // Wir bauen ein Array mit gewünschten Infos: pro Termin, pro Person
    const result = appointments.map(app => {
      return app.persons.map(person => ({
        name: person.name,
        date: app.date,
        time: app.time,
        service: person.serviceName,
        price: person.servicePrice,
      }));
    }).flat(); // flatten, weil map ein Array von Arrays erzeugt

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Termin per ID abrufen (nur Admin)
router.get('/appointment/:id', auth, requireRole(['admin', 'superuser']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Termin nicht gefunden' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Termin erstellen (ohne Login-Pflicht)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, date, time, isGroup, persons, userId } = req.body;

    // Anzahl der benötigten Slots (Anzahl Personen)
    const numberOfPersons = persons.length;

    // Liste aller möglichen Slots (ggf. aus config oder DB)
    const allSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

    // Index des Start-Slots
    const startIndex = allSlots.indexOf(time);
    if (startIndex === -1) {
      return res.status(400).json({ error: 'Ungültiger Startzeitpunkt' });
    }

    // Prüfe, ob genügend Slots hintereinander verfügbar sind
    if (startIndex + numberOfPersons > allSlots.length) {
      return res.status(400).json({ error: 'Nicht genügend Slots verfügbar ab der gewählten Zeit' });
    }

    // Lade bestehende Termine am Datum, um Slots zu prüfen
    const existingAppointments = await Appointment.find({ date });

    // Funktion, um zu prüfen, ob Slot frei ist
    function isSlotFree(slotTime) {
      return !existingAppointments.some(app => app.time === slotTime);
    }

    // Prüfe alle benötigten Slots
    for (let i = startIndex; i < startIndex + numberOfPersons; i++) {
      if (!isSlotFree(allSlots[i])) {
        return res.status(400).json({ error: `Slot ${allSlots[i]} ist bereits vergeben` });
      }
    }

    // Alle Slots frei, jetzt Termine für jede Person anlegen
    // Optional: Hier kannst du entscheiden, ob du für jede Person einen einzelnen Termin speicherst
    // oder einen Sammeltermin mit mehreren Slots. Hier als Einzeltermine:

    // Validierte Personen mit Service prüfen
    const validatedPersons = [];
    for (const person of persons) {
      const serviceDoc = await Service.findById(person.serviceId);
      if (!serviceDoc) {
        return res.status(404).json({ error: `Service für ${person.name} nicht gefunden` });
      }
      validatedPersons.push({
        name: person.name,
        serviceId: serviceDoc._id,
        serviceName: serviceDoc.name,
        servicePrice: serviceDoc.price,
        notes: person.notes || ''
      });
    }

    // Termine speichern (ein Termin pro Person, jeweils mit eigenem Slot)
    const savedAppointments = [];
    for (let i = 0; i < numberOfPersons; i++) {
      const newAppointment = new Appointment({
        userId: userId || null,
        customerName: customerName,
        customerEmail: customerEmail,
        date,
        time: allSlots[startIndex + i],
        isGroup,
        persons: [validatedPersons[i]],
        numberOfPersons: 1
      });
      const saved = await newAppointment.save();
      savedAppointments.push(saved);
    }

    // Optional: ICS Datei generieren für den ersten Termin (oder alle zusammen)
    const icsContent = generateICS({
      customerName,
      date,
      time: allSlots[startIndex],
      persons: validatedPersons,
      isGroup
    });

    res.setHeader('Content-Disposition', 'attachment; filename=termin.ics');
    res.setHeader('Content-Type', 'text/calendar');
    res.status(201).send(icsContent);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




router.get('/available/day/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // Alle Slots des Tages (konfiguriert oder fest definiert)
    const allSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

    // Alle Termine an diesem Tag laden
    const appointments = await Appointment.find({ date });

    // Für jeden Slot prüfen, ob schon gebucht wurde (1 Buchung pro Slot möglich)
    const slotsAvailability = allSlots.map(slotTime => {
      const isBooked = appointments.some(app => app.time === slotTime);
      return {
        time: slotTime,
        availableSpots: isBooked ? 0 : 1
      };
    });

    res.json(slotsAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verfügbarkeit für einen Monat
router.get('/available/month/:yearMonth', async (req, res) => {
  try {
    const { yearMonth } = req.params;
    const [year, month] = yearMonth.split('-').map(Number);

    const daysInMonth = new Date(year, month, 0).getDate();

    // Max. Plätze pro Slot (z.B. 1 pro Slot, wie gewünscht)
    const maxSlotsPerTime = 1;

    const allTimeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

    // Lade alle Termine im Monat
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const result = {};

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month -1, d);
      const dayOfWeek = dateObj.getDay(); // 0=So, 1=Mo, ..., 6=Sa
      const dayStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Montag bis Freitag
        const dayAppointments = appointments.filter(app => app.date === dayStr);

        result[dayStr] = allTimeSlots.map(slot => {
          // Summe der belegten Plätze für diesen Slot
          const bookedCount = dayAppointments
            .filter(app => app.time === slot)
            .reduce((sum, app) => sum + (app.numberOfPersons || 1), 0);

          const availableSpots = Math.max(0, maxSlotsPerTime - bookedCount);
          return { time: slot, availableSpots };
        });
      } else {
        // Wochenende: keine Slots
        result[dayStr] = [];
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Termin löschen (Admin-Route)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).send();
    }
    res.json({ message: 'Termin gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
