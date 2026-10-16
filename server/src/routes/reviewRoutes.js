import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/:productId')
  .get(getProductReviews)
  .post(optionalAuth, createReview);

export default router;
