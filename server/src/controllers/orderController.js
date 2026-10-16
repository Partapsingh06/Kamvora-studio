import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import StoreSettings from '../models/StoreSettings.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../config/razorpay.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Optional User Auth)
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      customerInfo,
      shippingAddress,
      paymentMethod,
      couponCode,
      orderNotes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full contact details (name, email, phone)' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery shipping address' });
    }

    let itemsPrice = 0;
    const validatedItems = [];

    // Calculate prices and validate stock
    if (isMongoConnected()) {
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product "${item.name}" is no longer available.` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`
          });
        }
        const activePrice = product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : product.price;
        itemsPrice += activePrice * item.quantity;
        validatedItems.push({
          product: product._id,
          name: product.name,
          price: activePrice,
          quantity: item.quantity,
          image: item.image || product.images[0],
          customizationNote: item.customizationNote || ''
        });
      }
    } else {
      for (const item of items) {
        const result = await dbAdapter.getProductByIdOrSlug(item.product);
        const product = result?.product;
        const activePrice = product?.discountPrice || product?.price || item.price || 999;
        itemsPrice += activePrice * item.quantity;
        validatedItems.push({
          product: product?._id || item.product,
          name: product?.name || item.name,
          price: activePrice,
          quantity: item.quantity,
          image: item.image || product?.images?.[0] || '',
          customizationNote: item.customizationNote || ''
        });
      }
    }

    // Coupon calculation
    let discountAmount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      const coupon = isMongoConnected()
        ? await Coupon.findOne({ code, isActive: true })
        : await dbAdapter.getCouponByCode(code);

      if (coupon) {
        const notExpired = !coupon.expiryDate || new Date(coupon.expiryDate) > new Date();
        const meetsMin = itemsPrice >= (coupon.minOrderAmount || 0);

        if (notExpired && meetsMin) {
          if (coupon.discountType === 'percentage') {
            discountAmount = (itemsPrice * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
              discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
          } else {
            discountAmount = Math.min(coupon.discountValue, itemsPrice);
          }
          validCouponCode = coupon.code;
        }
      }
    }

    const freeThreshold = 999;
    const shippingPrice = itemsPrice >= freeThreshold ? 0 : 80;
    const totalPrice = Math.max(0, Math.round(itemsPrice - discountAmount + shippingPrice));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KAM-ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const orderData = {
      orderNumber,
      user: req.user ? req.user._id : null,
      customerInfo,
      shippingAddress,
      items: validatedItems,
      itemsPrice,
      shippingPrice,
      discountAmount,
      couponApplied: { code: validCouponCode, discount: discountAmount },
      totalPrice,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'Pending',
      orderStatus: paymentMethod === 'COD' ? 'Confirmed' : 'Pending',
      orderNotes: orderNotes || ''
    };

    if (isMongoConnected()) {
      const order = await Order.create(orderData);
      if (paymentMethod === 'COD') {
        for (const item of validatedItems) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
      }
      return res.status(201).json({ success: true, message: 'Order created successfully', data: order });
    }

    const order = await dbAdapter.createOrder(orderData);
    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate Razorpay payment order
// @route   POST /api/orders/:id/pay-razorpay
// @access  Public
export const initiateRazorpayPayment = async (req, res, next) => {
  try {
    const order = isMongoConnected()
      ? await Order.findById(req.params.id)
      : await dbAdapter.getOrderByIdOrNumber(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const rzpOrder = await createRazorpayOrder(order.totalPrice, order.orderNumber);

    if (isMongoConnected()) {
      order.paymentDetails.razorpayOrderId = rzpOrder.id;
      await order.save();
    } else {
      await dbAdapter.updateOrder(order._id, {
        paymentDetails: { ...order.paymentDetails, razorpayOrderId: rzpOrder.id }
      });
    }

    res.json({
      success: true,
      data: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: rzpOrder.keyId,
        isTestMode: rzpOrder.isTestMode,
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment and confirm order
// @route   POST /api/orders/:id/verify-payment
// @access  Public
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = isMongoConnected()
      ? await Order.findById(req.params.id)
      : await dbAdapter.getOrderByIdOrNumber(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      if (isMongoConnected()) {
        order.paymentStatus = 'Failed';
        await order.save();
      } else {
        await dbAdapter.updateOrder(order._id, { paymentStatus: 'Failed' });
      }
      return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
    }

    const paymentUpdate = {
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      paymentDetails: {
        razorpayOrderId: razorpayOrderId || order.paymentDetails?.razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || '',
        razorpaySignature: razorpaySignature || ''
      }
    };

    if (isMongoConnected()) {
      Object.assign(order, paymentUpdate);
      await order.save();
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
      return res.json({ success: true, message: 'Payment verified and order confirmed', data: order });
    }

    const updated = await dbAdapter.updateOrder(order._id, paymentUpdate);
    res.json({ success: true, message: 'Payment verified and order confirmed', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const orders = await dbAdapter.getOrders({ user: req.user._id });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:identifier
// @access  Public
export const getOrderByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    if (isMongoConnected()) {
      let order;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(identifier).populate('items.product', 'name slug images');
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: identifier.toUpperCase() }).populate('items.product', 'name slug images');
      }
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = await dbAdapter.getOrderByIdOrNumber(identifier);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
export const adminGetAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (status && status !== 'all') filter.orderStatus = status;
      if (search && search.trim() !== '') {
        filter.$or = [
          { orderNumber: { $regex: search.trim(), $options: 'i' } },
          { 'customerInfo.name': { $regex: search.trim(), $options: 'i' } },
          { 'customerInfo.email': { $regex: search.trim(), $options: 'i' } }
        ];
      }
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const orders = await dbAdapter.getOrders({ status, search });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update order status & tracking info
// @route   PUT /api/orders/admin/:id/status
// @access  Private (Admin)
export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingDetails } = req.body;

    if (isMongoConnected()) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (trackingDetails) order.trackingDetails = { ...order.trackingDetails, ...trackingDetails };

      const updated = await order.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateOrder(req.params.id, {
      ...(orderStatus && { orderStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(trackingDetails && { trackingDetails })
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
