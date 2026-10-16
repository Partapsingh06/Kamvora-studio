import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'kamvora_studio_jwt_secret_2026_super_secure',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (isMongoConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email address' });
      }

      // Public registration is strictly for customer accounts. Administrator privileges can never be granted via public registration.
      const user = await User.create({
        name,
        email,
        password,
        phone: phone || '',
        role: 'customer'
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }

    // Fallback mode
    const userExists = await dbAdapter.getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    const newUser = await dbAdapter.createUser({ name, email, password, phone, role: 'customer' });
    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    email = String(email).trim().toLowerCase();

    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Fallback mode
    const user = await dbAdapter.getUserByEmail(email);
    if (user) {
      let isMatch = false;
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = user.password === password;
      }

      if (isMatch) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id)
          }
        });
      }
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: user });
    }

    const user = await dbAdapter.getUserById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & addresses
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      if (req.body.addresses) user.addresses = req.body.addresses;
      if (req.body.password) user.password = req.body.password;

      const updatedUser = await user.save();
      return res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          addresses: updatedUser.addresses,
          token: generateToken(updatedUser._id)
        }
      });
    }

    const updated = await dbAdapter.updateUser(req.user._id, req.body);
    res.json({
      success: true,
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        addresses: updated.addresses,
        token: generateToken(updated._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all registered customers
// @route   GET /api/auth/admin/users
// @access  Private (Admin)
export const adminGetUsers = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    }

    const users = await dbAdapter.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};
