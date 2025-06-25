import express from 'express';
const router = express.Router();
import Appointment from '../models/Appointment'


router.post('/', async (req, res) => {
  try {
  const {userId, date, time, participants, isgroup, service} = req.body;
  const newAppointment = new Appointment({userId, date, time, participants, isgroup, service});
  const savedAppointment= await newAppointment.save();
  res.status(201).json(savedAppointment);
} catch (err) {
  res.status(400).json({ error: err.message});
}
});


router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true}
  );
  if (!updatedAppointment) return res.status(404).json({ error: 'Appointment not found'});
  res.json(updatedAppointment);
} catch (err) {
  res.status(400).json({ error: err.message})
}
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedAppointment = await Service.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ error : err.message})
  } catch (err) {
res.status(500).json({ error: err.message})
}
});

export default router