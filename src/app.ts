import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth';
dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });