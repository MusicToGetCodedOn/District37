import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authroutes.js';
import serviceRoutes from './routes/serviceRoutes.js'




const app = express();
dotenv.config();

app.use(cors(
     {origin: "http://localhost:5173",
  credentials: true,}
));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes)





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
