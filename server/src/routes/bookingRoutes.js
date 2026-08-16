import express from 'express';
import {
  createBooking,
  checkAvailability,
  lookupBooking,
  getAdminBookings,
  getAdminBookingById,
  updateAdminBooking,
  exportBookingsCSV,
  getAdminStats
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';
import { bookingValidationRules, validateRequest } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.post('/', bookingLimiter, bookingValidationRules, validateRequest, createBooking);
router.post('/check-availability', checkAvailability);
router.get('/lookup/:reference', lookupBooking);

// Admin protected routes
router.get('/admin/stats', protect, getAdminStats);
router.get('/admin/export/csv', protect, exportBookingsCSV);
router.get('/admin/all', protect, getAdminBookings);
router.get('/admin/:id', protect, getAdminBookingById);
router.put('/admin/:id', protect, updateAdminBooking);

export default router;
