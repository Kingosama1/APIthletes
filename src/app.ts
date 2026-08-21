import bookingRoutes from './routes/booking.routes';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookingRoutes from './routes/booking.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
    app.use('/api/bookings', bookingRoutes);