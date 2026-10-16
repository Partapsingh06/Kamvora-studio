import express from 'express';
import { subscribeNewsletter, adminGetSubscribers } from '../controllers/newsletterController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/admin/all', protect, adminOnly, adminGetSubscribers);
router.get('/all', protect, adminOnly, adminGetSubscribers);
router.get('/', protect, adminOnly, adminGetSubscribers);

export default router;
