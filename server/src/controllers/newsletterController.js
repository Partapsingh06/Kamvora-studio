import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
      if (existing) {
        return res.json({
          success: true,
          message: 'You are already subscribed to the Kamvora Studio Inner Circle! Use coupon ARTLOVER for ₹200 off your next art piece.'
        });
      }
      await NewsletterSubscriber.create({ email: cleanEmail });
      return res.status(201).json({
        success: true,
        message: 'Thank you for joining our Studio Inner Circle! Use welcome coupon WELCOME10 for 10% off your first handcrafted creation.',
        welcomeCoupon: 'WELCOME10'
      });
    }

    const result = await dbAdapter.addSubscriber(cleanEmail);
    if (result.existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to the Kamvora Studio Inner Circle! Use coupon ARTLOVER for ₹200 off your next art piece.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for joining our Studio Inner Circle! Use welcome coupon WELCOME10 for 10% off your first handcrafted creation.',
      welcomeCoupon: 'WELCOME10'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all newsletter subscribers
// @route   GET /api/newsletter/admin/all
// @access  Private (Admin)
export const adminGetSubscribers = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: subscribers.length, data: subscribers });
    }

    const subscribers = await dbAdapter.getSubscribers();
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    next(error);
  }
};
