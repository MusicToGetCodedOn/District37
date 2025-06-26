import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Validierung: Datum im Format YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} ist kein gültiges Datum (YYYY-MM-DD erforderlich)!`
    }
  },
  time: {
    type: String,
    required: true,
    enum: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
    message: props => `${props.value} ist keine gültige Uhrzeit!`
  },
  participants: { type: Number, default: 1, min: 1 },
  isGroup: { type: Boolean, default: false },
  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }
});

export default mongoose.model('Appointment', appointmentSchema);