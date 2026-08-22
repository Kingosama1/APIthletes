import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { ClassSession } from '../models/ClassSession';
import mongoose from 'mongoose';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    const dbSession = await mongoose.startSession();

    try {
        const { sessionId } = req.body;
        const memberId = (req as any).user?.id;

        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            res.status(400).json({ message: 'Invalid or missing session ID' });
            return;
        }

        const session = await ClassSession.findById(sessionId);

        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }

        const now = new Date();

        if (now >= session.startTime) {
            res.status(400).json({
                message: 'Cannot book a session that has already started'
            });
            return;
        }

        const existingBooking = await Booking.findOne({
            member: memberId,
            session: sessionId,
            status: 'confirmed'
        });

        if (existingBooking) {
            res.status(409).json({
                message: 'You already have a confirmed booking for this session'
            });
            return;
        }

        let booking;

        await dbSession.withTransaction(async () => {
            const updatedSession = await ClassSession.findOneAndUpdate(
                {
                    _id: sessionId,
                    bookedSeats: { $lt: session.capacity }
                },
                {
                    $inc: { bookedSeats: 1 }
                },
                {
                    new: true,
                    session: dbSession
                }
            );

            if (!updatedSession) {
                throw new Error('SESSION_FULL');
            }

            booking = new Booking({
                member: memberId,
                session: sessionId,
                status: 'confirmed'
            });

            await booking.save({ session: dbSession });
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_FULL') {
            res.status(409).json({
                message: 'Session is full'
            });
            return;
        }

        if (
            error instanceof mongoose.Error &&
            'code' in error &&
            error.code === 11000
        ) {
            res.status(409).json({
                message: 'You already have a confirmed booking for this session'
            });
            return;
        }

        res.status(500).json({
            message: 'Server error',
            error
        });
    } finally {
        await dbSession.endSession();
    }
};
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const memberId = (req as any).user?.id;

        const bookings = await Booking.find({ member: memberId })
            .populate({
                path: 'session',
                select: 'title startTime endTime capacity bookedSeats'
            });

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const memberId = (req as any).user?.id;

        const booking = await Booking.findById(id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        if (booking.member.toString() !== memberId) {
            res.status(403).json({ message: 'Forbidden: You do not own this booking' });
            return;
        }

        if (booking.status === 'cancelled') {
            res.status(400).json({ message: 'Booking is already cancelled' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        await ClassSession.findByIdAndUpdate(booking.session, {
            $inc: { bookedSeats: -1 }
        });

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};