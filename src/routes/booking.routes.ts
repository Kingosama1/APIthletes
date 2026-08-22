import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/booking.controller';
import auth from '../middleware/auth';
import role from '../middleware/role';

const router = Router();

/**
 * @swagger
 * /getMyBookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "64abc123..."
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error or session started
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Member only)
 *       409:
 *         description: Session full or duplicate booking
 *   get:
 *     summary: Get logged-in member bookings
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Member only)
 * 
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking (Soft cancellation)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not booking owner or not member)
 *       404:
 *         description: Booking not found
 */
router.post('/', auth, role('Member'), createBooking);
router.get('/', auth, role('Member'), getMyBookings);
router.patch('/:id/cancel', auth, role('Member'), cancelBooking);

export default router;