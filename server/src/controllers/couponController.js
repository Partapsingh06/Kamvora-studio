import Coupon from '../models/Coupon.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = isMongoConnected()
      ? await Coupon.findOne({ code: cleanCode, isActive: true })
      : await dbAdapter.getCouponByCode(cleanCode);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired' });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    const total = Number(cartTotal !== undefined ? cartTotal : orderAmount) || 0;
    if (coupon.minOrderAmount && total < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum purchase order of ₹${coupon.minOrderAmount}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (total * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(coupon.discountValue, total);
    }

    discount = Math.round(discount);

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discount}`,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons/admin/all
// @access  Private (Admin)
export const adminGetAllCoupons = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: coupons.length, data: coupons });
    }

    const coupons = await dbAdapter.getCoupons();
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons/admin
// @access  Private (Admin)
export const adminCreateCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Code and discount value are required' });
    }

    const cleanCode = code.toUpperCase().trim();

    if (isMongoConnected()) {
      const existing = await Coupon.findOne({ code: cleanCode });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
      }

      const coupon = await Coupon.create({
        code: cleanCode,
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: Number(usageLimit) || 100,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      });
      return res.status(201).json({ success: true, data: coupon });
    }

    const existing = await dbAdapter.getCouponByCode(cleanCode);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
    }

    const coupon = await dbAdapter.createCoupon({
      code: cleanCode,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      usageLimit: Number(usageLimit) || 100,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/admin/:id
// @access  Private (Admin)
export const adminUpdateCoupon = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase().trim();

    if (isMongoConnected()) {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

      Object.assign(coupon, updates);
      const updated = await coupon.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateCoupon(req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/admin/:id
// @access  Private (Admin)
export const adminDeleteCoupon = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

      await Coupon.findByIdAndDelete(coupon._id);
      return res.json({ success: true, message: 'Coupon deleted successfully' });
    }

    await dbAdapter.deleteCoupon(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};
