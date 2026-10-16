import CustomOrderRequest from '../models/CustomOrderRequest.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

// @desc    Submit a custom craft order request
// @route   POST /api/custom-orders
// @access  Public (Optional User Auth)
export const createCustomOrderRequest = async (req, res, next) => {
  try {
    const {
      customerName,
      email,
      phone,
      productType,
      designDescription,
      preferredColors,
      budget,
      requiredDate,
      referenceImages,
      additionalInstructions
    } = req.body;

    if (!customerName || !email || !phone || !productType || !designDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields: name, email, phone, craft type, and design description'
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `KAM-CUST-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const requestData = {
      referenceNumber,
      user: req.user ? req.user._id : null,
      customerName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      productType,
      designDescription,
      preferredColors: preferredColors || '',
      budget: budget || 'Flexible',
      requiredDate: requiredDate ? new Date(requiredDate) : null,
      referenceImages: referenceImages || [],
      additionalInstructions: additionalInstructions || '',
      status: 'Pending'
    };

    if (isMongoConnected()) {
      const request = await CustomOrderRequest.create(requestData);
      return res.status(201).json({
        success: true,
        message: 'Custom order request received successfully! Our master artisans will review and get back to you shortly.',
        referenceNumber: request.referenceNumber,
        data: request
      });
    }

    const request = await dbAdapter.createCustomRequest(requestData);
    res.status(201).json({
      success: true,
      message: 'Custom order request received successfully! Our master artisans will review and get back to you shortly.',
      referenceNumber: request.referenceNumber,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom requests for logged-in user
// @route   GET /api/custom-orders/my-requests
// @access  Private
export const getMyCustomRequests = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const requests = await CustomOrderRequest.find({
        $or: [{ user: req.user._id }, { email: req.user.email }]
      }).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    }

    const requests = await dbAdapter.getCustomRequests({ user: req.user._id, email: req.user.email });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Look up custom request status by reference number
// @route   GET /api/custom-orders/track/:referenceNumber
// @access  Public
export const trackCustomRequest = async (req, res, next) => {
  try {
    const ref = req.params.referenceNumber.toUpperCase().trim();
    let request;

    if (isMongoConnected()) {
      request = await CustomOrderRequest.findOne({ referenceNumber: ref });
    } else {
      request = await dbAdapter.getCustomRequestByRef(ref);
    }

    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom order request not found' });
    }

    const sanitized = {
      referenceNumber: request.referenceNumber,
      customerName: request.customerName,
      productType: request.productType,
      status: request.status,
      adminQuote: request.adminQuote,
      requiredDate: request.requiredDate,
      createdAt: request.createdAt
    };

    res.json({ success: true, data: sanitized });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all custom order requests
// @route   GET /api/custom-orders/admin/all
// @access  Private (Admin)
export const adminGetAllCustomRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      const requests = await CustomOrderRequest.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    }

    const requests = await dbAdapter.getCustomRequests({ status });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update custom request status & quote
// @route   PUT /api/custom-orders/admin/:id
// @access  Private (Admin)
export const adminUpdateCustomRequest = async (req, res, next) => {
  try {
    const { status, adminQuote, internalNotes } = req.body;

    if (isMongoConnected()) {
      const request = await CustomOrderRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ success: false, message: 'Custom request not found' });

      if (status) request.status = status;
      if (internalNotes !== undefined) request.internalNotes = internalNotes;
      if (adminQuote) {
        request.adminQuote = {
          amount: adminQuote.amount || request.adminQuote.amount,
          note: adminQuote.note || request.adminQuote.note,
          quotedAt: new Date()
        };
      }

      const updated = await request.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateCustomRequest(req.params.id, {
      ...(status && { status }),
      ...(internalNotes !== undefined && { internalNotes }),
      ...(adminQuote && {
        adminQuote: {
          amount: adminQuote.amount || 0,
          note: adminQuote.note || '',
          quotedAt: new Date().toISOString()
        }
      })
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Custom request not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
