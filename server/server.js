import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';



const app = express();
dotenv.config();

app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


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
