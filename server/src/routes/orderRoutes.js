import express from 'express';
import {
  createOrder,
  initiateRazorpayPayment,
  verifyPayment,
  getMyOrders,
  getOrderByIdentifier,
  adminGetAllOrders,
  adminUpdateOrderStatus
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin endpoints (strictly protected with protect, adminOnly)
router.get('/admin/all', protect, adminOnly, adminGetAllOrders);
router.put('/admin/:id/status', protect, adminOnly, adminUpdateOrderStatus);
router.get('/admin', protect, adminOnly, adminGetAllOrders);
router.get('/all', protect, adminOnly, adminGetAllOrders);
router.put('/:id/status', protect, adminOnly, adminUpdateOrderStatus);
router.get('/', protect, adminOnly, adminGetAllOrders);

// Payment & Tracking endpoints
router.post('/:id/pay-razorpay', initiateRazorpayPayment);
router.post('/:id/verify-payment', verifyPayment);
router.get('/:identifier', getOrderByIdentifier);

export default router;
