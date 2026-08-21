import { Router } from 'express';
import { createBooking, getBookings, cancelBooking } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id/cancel', cancelBooking);

export default router;