import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

// @desc    Add review for product
// @route   POST /api/reviews/:productId
// @access  Public (Optional Auth)
export const createReview = async (req, res, next) => {
  try {
    const { name, rating, comment } = req.body;
    const { productId } = req.params;

    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and review comment' });
    }

    if (isMongoConnected()) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      const review = await Review.create({
        product: product._id,
        user: req.user ? req.user._id : null,
        name,
        rating: Number(rating),
        comment
      });

      const allReviews = await Review.find({ product: product._id });
      const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
      product.rating = Number(avgRating.toFixed(1));
      product.numReviews = allReviews.length;
      await product.save();

      return res.status(201).json({ success: true, data: review });
    }

    const review = await dbAdapter.addReview({
      product: productId,
      user: req.user ? req.user._id : null,
      name,
      rating: Number(rating),
      comment
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: reviews.length, data: reviews });
    }

    const reviews = await dbAdapter.getReviewsForProduct(req.params.productId);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
