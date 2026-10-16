import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { uploadImage } from '../config/cloudinary.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateImages() {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Failed to connect to MongoDB Atlas. Aborting image migration.');
    process.exit(1);
  }

  const urlCache = new Map();

  async function getOrUpload(url, folder) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('cloudinary.com')) return url; // Already on Cloudinary
    if (urlCache.has(url)) return urlCache.get(url);

    try {
      console.log(`  -> Uploading to Cloudinary [${folder}]: ${url.substring(0, 70)}...`);
      const secureUrl = await uploadImage(url, folder);
      console.log(`  ✓ Uploaded: ${secureUrl}`);
      urlCache.set(url, secureUrl);
      return secureUrl;
    } catch (err) {
      console.error(`  ! Upload failed for ${url}:`, err.message);
      return url; // Keep existing if upload fails
    }
  }

  // 1. Migrate Categories
  console.log('\n--- 1. Migrating Category Images to Cloudinary ---');
  const categories = await Category.find();
  for (const cat of categories) {
    if (cat.image && !cat.image.includes('cloudinary.com')) {
      console.log(`Processing category: ${cat.name}`);
      const newUrl = await getOrUpload(cat.image, 'kamvora_studio/categories');
      if (newUrl !== cat.image) {
        cat.image = newUrl;
        await cat.save();
        console.log(`  Saved category [${cat.name}] with Cloudinary image.`);
      }
    } else {
      console.log(`Category [${cat.name}] already on Cloudinary.`);
    }
  }

  // 2. Migrate Products
  console.log('\n--- 2. Migrating Product Images to Cloudinary ---');
  const products = await Product.find();
  for (const prod of products) {
    let changed = false;
    const newImages = [];
    console.log(`Processing product: ${prod.name}`);
    for (const imgUrl of prod.images) {
      if (imgUrl && !imgUrl.includes('cloudinary.com')) {
        const newUrl = await getOrUpload(imgUrl, 'kamvora_studio/products');
        newImages.push(newUrl);
        if (newUrl !== imgUrl) changed = true;
      } else {
        newImages.push(imgUrl);
      }
    }

    if (changed) {
      prod.images = newImages;
      await prod.save();
      console.log(`  Saved product [${prod.name}] with Cloudinary images.`);
    } else {
      console.log(`  All images for [${prod.name}] already on Cloudinary.`);
    }
  }

  // 3. Update local fallback JSON (kamvora_db.json) with Cloudinary URLs
  console.log('\n--- 3. Updating Resilient Fallback Storage (kamvora_db.json) ---');
  const jsonPath = path.resolve(__dirname, '../../data/kamvora_db.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const dbData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Update categories in JSON
      if (Array.isArray(dbData.categories)) {
        for (const cat of dbData.categories) {
          if (urlCache.has(cat.image)) {
            cat.image = urlCache.get(cat.image);
          }
        }
      }

      // Update products in JSON
      if (Array.isArray(dbData.products)) {
        for (const prod of dbData.products) {
          if (Array.isArray(prod.images)) {
            prod.images = prod.images.map((img) => urlCache.get(img) || img);
          }
        }
      }

      fs.writeFileSync(jsonPath, JSON.stringify(dbData, null, 2), 'utf8');
      console.log('✓ Successfully synchronized kamvora_db.json with Cloudinary URLs.');
    } catch (e) {
      console.warn('Warning syncing JSON file:', e.message);
    }
  }

  console.log('\n======================================================');
  console.log('  IMAGE MIGRATION COMPLETED SUCCESSFULLY');
  console.log(`  Total unique images permanently archived to Cloudinary: ${urlCache.size}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

migrateImages().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
