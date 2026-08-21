import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { member, session } = req.body;

        const existingBooking = await Booking.findOne({ member, session, status: 'confirmed' });
        if (existingBooking) {
            res.status(400).json({ message: 'You have already booked this session' });
            return;
        }

        const booking = new Booking({
            member,
            session,
            status: 'confirmed'
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find().populate('member session');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};