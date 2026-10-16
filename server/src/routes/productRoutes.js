import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.post('/admin', protect, adminOnly, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/:identifier', getProductByIdentifier);

// Admin-only modification endpoints
router.route('/admin/:id')
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.route('/:id')
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
