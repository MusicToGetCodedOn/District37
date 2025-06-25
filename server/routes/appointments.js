const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');
const services = require('../config/services');

const MAX_SLOTS_PER_DAY = 7;

router.post('/', auth, async (req, res) => {
  const { date, time, participants, isGroup, serviceId } = req.body;

  const service = services.find(s => s.id === serviceId);
  if (!service) return res.status(400).json({ message: 'Ungültiger Service' });

  const appointments = await Appointment.find({ date });
  const usedSlots = appointments.reduce((sum, a) => sum + a.participants, 0);

  if (usedSlots + participants > MAX_SLOTS_PER_DAY) {
    return res.status(400).json({ message: 'Nicht genügend Slots verfügbar' });
  }

  const appointment = new Appointment({
    userId: req.user.id,
    date,
    time,
    participants,
    isGroup,
    service: {
      id: service.id,
      name: service.name,
      price: service.price
    }
  });

  await appointment.save();
  res.status(201).json({ message: 'Termin erfolgreich gebucht' });
});

module.exports = router;
