const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware.verifyToken);

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/my-bookings', bookingController.getUserBookings); // Alias for clarity
router.get('/owner-bookings', bookingController.getOwnerBookings);
router.delete('/:id', bookingController.cancelBooking);
router.get('/check-availability', bookingController.checkAvailability);
router.post('/:id/verify', bookingController.verifyBooking);
router.post('/:id/reject', bookingController.rejectBooking);
router.post('/confirm-payment', bookingController.confirmBookingPayment);

module.exports = router;
