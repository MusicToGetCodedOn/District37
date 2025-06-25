import mongoose from 'mongoose';


const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  participants: { type: Number, default: 1 },
  isGroup: { type: Boolean, default: false },
  service: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);