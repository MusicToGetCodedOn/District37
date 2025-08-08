import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointments.js';
import Appointment from './models/Appointment.js';


const app = express();
dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 20 // Max. 20 Anfragen pro IP
});
//app.use(limiter);

app.use(cors({
  origin: "http://localhost:5173",
}));


// Parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads (check folder name case!)
app.use('/uploads', express.static(path.join(process.cwd(), 'Uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// Optional: Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/District37';

mongoose.connect(MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  mongoose.model('Appointment').createIndexes().then(() => {
    console.log('Indexes for Appointment model created or verified');
  }).catch(err => {
    console.error('Error creating indexes:', err);
  });
});
