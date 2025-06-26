// migration.js
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';

mongoose.connect('mongodb://localhost:27017/District37').then(async () => {
  const appointments = await Appointment.find();
  for (const appt of appointments) {
    const date = new Date(appt.date);
    appt.expireAt = new Date(date.setDate(date.getDate() + 30));
    await appt.save();
  }
  console.log('Migration abgeschlossen');
  mongoose.connection.close();
});