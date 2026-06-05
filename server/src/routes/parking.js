import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllSpots,
  getNearbySpots,
  getSpotById,
  createBooking,
  getMyBookings,
  cancelBooking,
} from '../controllers/parkingController.js';

const router = express.Router();

router.get('/spots', protect, getAllSpots);
router.get('/nearby', protect, getNearbySpots);
router.get('/spots/:id', protect, getSpotById);
router.post('/book', protect, createBooking);
router.get('/bookings', protect, getMyBookings);
router.put('/bookings/:id', protect, cancelBooking);

export default router;
