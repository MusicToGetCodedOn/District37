import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  notes: { type: String, required: false },  // NEW: notes field optional
});

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
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
  isGroup: { type: Boolean, default: false },
  persons: [personSchema],
  numberOfPersons: { type: Number, required: true, min: 1 },  // NEU
  expireAt: { type: Date, index: { expires: '0s' } }
},
{
  timestamps: true
});

{
  timestamps: true
};

appointmentSchema.pre('save', function(next) {
  this.expireAt = new Date(this.date);
  this.expireAt.setMonth(this.expireAt.getMonth() + 1); // Einen Monat hinzufügen
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
