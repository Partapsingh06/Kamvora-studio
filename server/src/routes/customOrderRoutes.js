import express from 'express';
import {
  createCustomOrderRequest,
  getMyCustomRequests,
  trackCustomRequest,
  adminGetAllCustomRequests,
  adminUpdateCustomRequest
} from '../controllers/customOrderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

import { uploadSingleImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Customer reference image upload for custom handcrafted requests
router.post('/upload-reference', optionalAuth, upload.single('image'), uploadSingleImage);

router.post('/', optionalAuth, createCustomOrderRequest);
router.get('/my-requests', protect, getMyCustomRequests);
router.get('/track/:referenceNumber', trackCustomRequest);

// Admin endpoints (strictly protected)
router.get('/admin/all', protect, adminOnly, adminGetAllCustomRequests);
router.put('/admin/:id', protect, adminOnly, adminUpdateCustomRequest);
router.get('/', protect, adminOnly, adminGetAllCustomRequests);
router.get('/all', protect, adminOnly, adminGetAllCustomRequests);
router.put('/:id', protect, adminOnly, adminUpdateCustomRequest);

export default router;
