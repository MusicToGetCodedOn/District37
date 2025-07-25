import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authroutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointments.js';

const app = express();
dotenv.config();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 20 // Max. 20 Anfragen pro IP
});
app.use(limiter);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use('/uploads', express.static(path.join(process.cwd(), 'Uploads')));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('api/auth:id', authRoutes)

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