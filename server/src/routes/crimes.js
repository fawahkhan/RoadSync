import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
import {
  submitReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
} from '../controllers/crimeController.js';

const router = express.Router();

router.post('/report', protect, upload.array('attachments', 5), submitReport);
router.get('/my-reports', protect, getMyReports);
router.get('/all', protect, adminOnly, getAllReports);
router.put('/:id/status', protect, adminOnly, updateReportStatus);

export default router;
