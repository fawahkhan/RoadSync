import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  calculateEmission,
  getHistory,
  getMonthlySummary,
} from '../controllers/emissionController.js';

const router = express.Router();

router.post('/calculate', protect, calculateEmission);
router.get('/history', protect, getHistory);
router.get('/summary', protect, getMonthlySummary);

export default router;
