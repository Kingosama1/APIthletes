import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.log('MONGO_URI is missing');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    })
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection failed');
        console.log(error.message);
    });