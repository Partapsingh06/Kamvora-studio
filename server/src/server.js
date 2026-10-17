import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';
import { initAdmin } from './scripts/initAdmin.js';
import Category from './models/Category.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customOrderRoutes from './routes/customOrderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists and is statically served with CORS & cross-origin headers
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  })
);

// Health Check & Discovery APIs
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Kamvora Studio',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'resilient_local_fallback',
    services: {
      database: mongoose.connection.readyState === 1 ? 'mongodb_atlas' : 'resilient_local_storage',
      cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ? 'configured' : 'local_storage_fallback',
      razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) ? 'live_gateway' : 'safe_test_mode'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    brand: 'Kamvora Studio',
    version: '1.0.0',
    message: 'Kamvora Studio API is operational',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'resilient_local_fallback',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      orders: '/api/orders',
      customOrders: '/api/custom-orders',
      coupons: '/api/coupons',
      reviews: '/api/reviews',
      newsletter: '/api/newsletter',
      settings: '/api/settings',
      upload: '/api/upload'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    brand: 'Kamvora Studio',
    status: 'online',
    message: 'Kamvora Studio API Server is running. Visit /api for endpoint documentation.',
    healthCheck: '/api/health'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect DB & Launch Server
const startServer = async () => {
  const isConnected = await connectDB();

  if (isConnected) {
    try {
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        console.log('Database is empty. Automatically seeding initial Kamvora Studio collection...');
        await seedDatabase();
      }
      // Ensure admin account exists with valid credentials
      await initAdmin();
    } catch (err) {
      console.warn('Initial setup check error:', err.message);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  KAMVORA STUDIO API SERVER`);
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  API Root:   http://localhost:${PORT}/api`);
    console.log(`  Health:     http://localhost:${PORT}/api/health`);
    console.log(`  Database:   ${mongoose.connection.readyState === 1 ? '✓ MongoDB Atlas Connected' : '! Resilient Local Fallback Active'}`);
    console.log(`  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : 'Local Storage Fallback'}`);
    console.log(`  Razorpay:   ${process.env.RAZORPAY_KEY_ID ? '✓ Configured' : 'Safe Test Mode'}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n======================================================`);
      console.error(`  [SERVER ERROR] Port ${PORT} is already in use (EADDRINUSE).`);
      console.error(`  An existing instance of the backend is already running on port ${PORT},`);
      console.error(`  or another application is occupying this port.`);
      console.error(`  To resolve:`);
      console.error(`    1. Close the running backend terminal/process, or`);
      console.error(`    2. Change PORT in server/.env (e.g., PORT=5001).`);
      console.error(`======================================================\n`);
      process.exit(1);
    } else {
      console.error('[Server Error]', err);
    }
  });
};

startServer();
