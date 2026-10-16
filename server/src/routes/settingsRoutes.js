import express from 'express';
import {
  getSettings,
  updateSettings,
  getDashboardAnalytics,
  submitContactForm
} from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.post('/contact', submitContactForm);

// Admin endpoints (strictly protected)
router.put('/admin', protect, adminOnly, updateSettings);
router.get('/admin/dashboard', protect, adminOnly, getDashboardAnalytics);
router.put('/', protect, adminOnly, updateSettings);
router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);

export default router;
