import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';


dotenv.config({ path:'var.env' });

const app = express();
app.use('/api/students', studentRoutes);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); // Adjust frontend URL if needed

console.log("MONGO_URI from .env:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
