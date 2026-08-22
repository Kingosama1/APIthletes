import express, { Application } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth';
import sessionRoutes from './routes/session.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'APIthletes API is running' });
});

export default app;