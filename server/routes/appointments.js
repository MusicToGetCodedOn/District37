import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Services.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();


router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Ungültiges Datumsformat (YYYY-MM-DD erforderlich)' });
    }

    const appointments = await Appointment.find({ date });
    const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
    const bookedSlots = appointments.map(appt => appt.time);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { date, time, participants, isGroup, service } = req.body;
    const userId = req.user._id; 

 
    const serviceDoc = await Service.findById(service.id);
    if (!serviceDoc) return res.status(404).json({ error: 'Service nicht gefunden' });


    const appointments = [];
    if (isGroup && participants > 1) {
      const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
      const startIndex = timeSlots.indexOf(time);
      if (startIndex === -1) {
        return res.status(400).json({ error: 'Ungültige Startzeit' });
      }


      for (let i = 0; i < participants; i++) {
        const slotTime = timeSlots[startIndex + i];
        if (!slotTime) {
          return res.status(400).json({ error: 'Nicht genügend aufeinanderfolgende Slots verfügbar' });
        }
        const existing = await Appointment.findOne({ date, time: slotTime });
        if (existing) {
          return res.status(400).json({ error: `Zeitfenster ${slotTime} bereits gebucht` });
        }
      }


      for (let i = 0; i < participants; i++) {
        const slotTime = timeSlots[startIndex + i];
        const newAppointment = new Appointment({
          userId,
          date,
          time: slotTime,
          participants: 1,
          isGroup: true,
          service: { id: serviceDoc._id, name: serviceDoc.name, price: serviceDoc.price }
        });
        appointments.push(await newAppointment.save());
      }
    } else {

      const existing = await Appointment.findOne({ date, time });
      if (existing) {
        return res.status(400).json({ error: `Zeitfenster ${time} bereits gebucht` });
      }
      const newAppointment = new Appointment({
        userId,
        date,
        time,
        participants,
        isGroup,
        service: { id: serviceDoc._id, name: serviceDoc.name, price: serviceDoc.price }
      });
      appointments.push(await newAppointment.save());
    }

    res.status(201).json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/:id', [auth, requireRole('admin')], async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, participants, isGroup, service } = req.body;


    const serviceDoc = await Service.findById(service?.id);
    if (!serviceDoc) return res.status(404).json({ error: 'Service nicht gefunden' });


    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) return res.status(404).json({ error: 'Termin nicht gefunden' });


    if (isGroup && participants > 1) {
      const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
      const startIndex = timeSlots.indexOf(time);
      if (startIndex === -1) {
        return res.status(400).json({ error: 'Ungültige Startzeit' });
      }


      for (let i = 0; i < participants; i++) {
        const slotTime = timeSlots[startIndex + i];
        if (!slotTime) {
          return res.status(400).json({ error: 'Nicht genügend aufeinanderfolgende Slots verfügbar' });
        }
        const existing = await Appointment.findOne({
          date,
          time: slotTime,
          _id: { $ne: id }
        });
        if (existing) {
          return res.status(400).json({ error: `Zeitfenster ${slotTime} bereits gebucht` });
        }
      }


      if (existingAppointment.isGroup) {
        await Appointment.deleteMany({
          date: existingAppointment.date,
          isGroup: true,
          userId: existingAppointment.userId
        });
      }


      const appointments = [];
      for (let i = 0; i < participants; i++) {
        const slotTime = timeSlots[startIndex + i];
        const newAppointment = new Appointment({
          userId: existingAppointment.userId,
          date,
          time: slotTime,
          participants: 1,
          isGroup: true,
          service: { id: serviceDoc._id, name: serviceDoc.name, price: serviceDoc.price }
        });
        appointments.push(await newAppointment.save());
      }
      res.json(appointments);
    } else {

      const existing = await Appointment.findOne({
        date,
        time,
        _id: { $ne: id } 
      });
      if (existing) {
        return res.status(400).json({ error: `Zeitfenster ${time} bereits gebucht` });
      }


      if (existingAppointment.isGroup) {
        await Appointment.deleteMany({
          date: existingAppointment.date,
          isGroup: true,
          userId: existingAppointment.userId
        });
      }


      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        {
          date,
          time,
          participants,
          isGroup,
          service: { id: serviceDoc._id, name: serviceDoc.name, price: serviceDoc.price }
        },
        { new: true, runValidators: true }
      );
      res.json(updatedAppointment);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', [auth, requireRole(['admin', 'superuser'])], async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ error: 'Termin nicht gefunden' });
    res.json({ message: 'Termin gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;