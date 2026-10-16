import express from 'express';
import {
  validateCoupon,
  adminGetAllCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin endpoints (strictly protected)
router.route('/admin')
  .get(protect, adminOnly, adminGetAllCoupons)
  .post(protect, adminOnly, adminCreateCoupon);

router.route('/admin/:id')
  .put(protect, adminOnly, adminUpdateCoupon)
  .delete(protect, adminOnly, adminDeleteCoupon);

router.route('/')
  .get(protect, adminOnly, adminGetAllCoupons)
  .post(protect, adminOnly, adminCreateCoupon);

router.route('/:id')
  .put(protect, adminOnly, adminUpdateCoupon)
  .delete(protect, adminOnly, adminDeleteCoupon);

export default router;
