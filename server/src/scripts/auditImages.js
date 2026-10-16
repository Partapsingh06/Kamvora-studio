import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

async function audit() {
  await connectDB();
  const categories = await Category.find();
  const products = await Product.find();

  console.log(`Found ${categories.length} categories.`);
  console.log(`Found ${products.length} products.`);

  let cloudinaryCats = 0;
  let nonCloudinaryCats = 0;
  for (const cat of categories) {
    if (cat.image && cat.image.includes('cloudinary.com')) {
      cloudinaryCats++;
    } else {
      nonCloudinaryCats++;
      console.log(`Category non-Cloudinary image: [${cat.name}] ${cat.image}`);
    }
  }

  let cloudinaryProds = 0;
  let nonCloudinaryProds = 0;
  for (const prod of products) {
    const hasNonCloudinary = prod.images.some(img => !img.includes('cloudinary.com'));
    if (hasNonCloudinary) {
      nonCloudinaryProds++;
      console.log(`Product non-Cloudinary images: [${prod.name}] count: ${prod.images.length}`);
    } else {
      cloudinaryProds++;
    }
  }

  console.log(`Categories: ${cloudinaryCats} Cloudinary, ${nonCloudinaryCats} non-Cloudinary`);
  console.log(`Products: ${cloudinaryProds} Cloudinary, ${nonCloudinaryProds} non-Cloudinary`);

  await mongoose.disconnect();
}

audit();
