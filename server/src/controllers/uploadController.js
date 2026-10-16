import { uploadImage } from '../config/cloudinary.js';

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private (or Public for custom order reference image)
export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const folder = req.body.folder || 'kamvora_studio/products';
    const permanentUrl = await uploadImage(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: permanentUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images (for product gallery)
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one image file to upload' });
    }

    const folder = req.body.folder || 'kamvora_studio/products';
    const uploadPromises = req.files.map((file) => uploadImage(file.buffer, folder));
    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${urls.length} images uploaded successfully`,
      urls
    });
  } catch (error) {
    next(error);
  }
};
