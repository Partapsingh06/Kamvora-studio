import express from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin-only image upload routes for products, categories, and studio catalog
router.post('/single', protect, adminOnly, upload.single('image'), uploadSingleImage);
router.post('/multiple', protect, adminOnly, upload.array('images', 8), uploadMultipleImages);
router.post('/', protect, adminOnly, upload.single('image'), uploadSingleImage);

export default router;
