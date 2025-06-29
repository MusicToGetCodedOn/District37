import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Services.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Verfügbare Termine abrufen (ohne Authentifizierung)
router.get('/available/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const appointments = await Appointment.find({ date });
    const bookedTimes = appointments.map(appointment => appointment.time);
    const allTimeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    const available = allTimeSlots.filter(time => !bookedTimes.includes(time));
    res.json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('userId', 'username email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Termin erstellen (ohne Login-Pflicht)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, date, time, isGroup, persons, userId } = req.body;

    // Validiere Services für alle Personen
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
        servicePrice: serviceDoc.price
      });
    }

    // Prüfe verfügbare Zeitslots
    const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    const slotsNeeded = isGroup ? persons.length : 1;
    const startIndex = timeSlots.indexOf(time);
    
    if (startIndex === -1) {
      return res.status(400).json({ error: 'Ungültige Startzeit' });
    }

    // Prüfe verfügbare Slots
    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = timeSlots[startIndex + i];
      if (!slotTime) {
        return res.status(400).json({ error: 'Nicht genügend aufeinanderfolgende Slots verfügbar' });
      }
      const existing = await Appointment.findOne({ date, time: slotTime });
      if (existing) {
        return res.status(400).json({ error: `Zeitfenster ${slotTime} bereits gebucht` });
      }
    }

    // Erstelle Termine
    const appointments = [];
    if (isGroup) {
      for (let i = 0; i < persons.length; i++) {
        const slotTime = timeSlots[startIndex + i];
        const newAppointment = new Appointment({
          userId: userId || null,
          customerName,
          customerEmail,
          date,
          time: slotTime,
          isGroup: true,
          persons: [validatedPersons[i]]
        });
        appointments.push(await newAppointment.save());
      }
    } else {
      const newAppointment = new Appointment({
        userId: userId || null,
        customerName,
        customerEmail,
        date,
        time,
        isGroup: false,
        persons: validatedPersons
      });
      appointments.push(await newAppointment.save());
    }

    res.status(201).json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Termin aktualisieren (Admin-Route)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).send();
    }
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
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