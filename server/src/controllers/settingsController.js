import StoreSettings from '../models/StoreSettings.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import CustomOrderRequest from '../models/CustomOrderRequest.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

// @desc    Get store public settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      let settings = await StoreSettings.findOne();
      if (!settings) settings = await StoreSettings.create({});
      return res.json({ success: true, data: settings });
    }

    const settings = await dbAdapter.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update store settings
// @route   PUT /api/settings/admin
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      let settings = await StoreSettings.findOne();
      if (!settings) settings = new StoreSettings();

      if (req.body.announcement) settings.announcement = { ...settings.announcement, ...req.body.announcement };
      if (req.body.contact) settings.contact = { ...settings.contact, ...req.body.contact };
      if (req.body.shipping) settings.shipping = { ...settings.shipping, ...req.body.shipping };
      if (req.body.hero) settings.hero = { ...settings.hero, ...req.body.hero };

      const updated = await settings.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get real-time dashboard analytics & metrics
// @route   GET /api/settings/admin/dashboard
// @access  Private (Admin)
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalCustomers = await User.countDocuments({ role: 'customer' });
      const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
      const pendingCustomRequests = await CustomOrderRequest.countDocuments({ status: 'Pending' });

      const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
      const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber customerInfo totalPrice orderStatus paymentStatus paymentMethod createdAt');

      const recentRequests = await CustomOrderRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('referenceNumber customerName productType status budget requiredDate createdAt');

      return res.json({
        success: true,
        data: {
          totalProducts,
          totalOrders,
          totalCustomers,
          pendingOrders,
          pendingCustomRequests,
          totalRevenue,
          recentOrders,
          recentRequests
        }
      });
    }

    const prods = (await dbAdapter.getProducts({}, 'newest', 1, 1000)).total;
    const allOrders = await dbAdapter.getOrders();
    const users = await dbAdapter.getAllUsers();
    const custCount = users.filter(u => u.role !== 'admin').length;
    const pendingOrders = allOrders.filter(o => o.orderStatus === 'Pending').length;
    const allCustReqs = await dbAdapter.getCustomRequests();
    const pendingReqs = allCustReqs.filter(r => r.status === 'Pending').length;
    const totalRev = allOrders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    res.json({
      success: true,
      data: {
        totalProducts: prods,
        totalOrders: allOrders.length,
        totalCustomers: custCount,
        pendingOrders,
        pendingCustomRequests: pendingReqs,
        totalRevenue: totalRev,
        recentOrders: allOrders.slice(0, 5),
        recentRequests: allCustReqs.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Contact Us message
// @route   POST /api/settings/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    console.log(`[Contact Form Received] From: ${name} (${email}, ${phone || 'N/A'}) - Subject: ${subject || 'General Inquiry'}`);
    console.log(`Message: ${message}`);

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out to Kamvora Studio! Our team will get back to you within 24 hours.'
    });
  } catch (error) {
    next(error);
  }
};
