import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary from environment
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('✓ Cloudinary configured for permanent media storage.');
} else {
  console.log('! Cloudinary credentials not detected in .env. Local storage fallback enabled for development.');
}

/**
 * Upload an image buffer or local file path to Cloudinary
 * @param {string|Buffer} fileInput File path or buffer
 * @param {string} folder Destination folder
 * @returns {Promise<string>} Permanent image URL
 */
export const uploadImage = async (fileInput, folder = 'kamvora_studio/products') => {
  if (isConfigured) {
    try {
      let uploadRes;
      if (typeof fileInput === 'string') {
        uploadRes = await cloudinary.uploader.upload(fileInput, {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto'
        });
      } else {
        // Buffer upload using base64
        const b64 = Buffer.from(fileInput).toString('base64');
        const dataURI = `data:image/jpeg;base64,${b64}`;
        uploadRes = await cloudinary.uploader.upload(dataURI, {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto'
        });
      }
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
  }

  // Fallback if Cloudinary is not configured in local environment
  // If file is already a path in uploads or an external URL, return it
  if (typeof fileInput === 'string' && (fileInput.startsWith('http') || fileInput.startsWith('/uploads/'))) {
    return fileInput;
  }

  // If buffer, write to server/uploads
  const uploadDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filename = `craft-${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, fileInput);
  return `/uploads/${filename}`;
};

export default cloudinary;
