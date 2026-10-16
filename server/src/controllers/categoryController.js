import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const onlyActive = req.query.all !== 'true';

    if (isMongoConnected()) {
      const filter = onlyActive ? { isActive: true } : {};
      const categories = await Category.find(filter).sort({ name: 1 });
      return res.json({ success: true, count: categories.length, data: categories });
    }

    const categories = await dbAdapter.getCategories(onlyActive);
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();

    if (isMongoConnected()) {
      const category = await Category.findOne({ slug });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      return res.json({ success: true, data: category });
    }

    const category = await dbAdapter.getCategoryBySlug(slug);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Please provide category name and image' });
    }

    const slug = slugify(name);

    if (isMongoConnected()) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A category with this name already exists' });
      }

      const category = await Category.create({
        name,
        slug,
        description: description || '',
        image,
        isActive: isActive !== undefined ? isActive : true
      });
      return res.status(201).json({ success: true, data: category });
    }

    const existing = await dbAdapter.getCategoryBySlug(slug);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }

    const category = await dbAdapter.createCategory({
      name,
      slug,
      description: description || '',
      image,
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.name) updates.slug = slugify(updates.name);

    if (isMongoConnected()) {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

      Object.assign(category, updates);
      const updated = await category.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateCategory(req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Safe check for products)
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

      const productCount = await Product.countDocuments({ category: category._id });
      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category: ${productCount} product(s) are currently assigned to it.`
        });
      }

      await Category.findByIdAndDelete(category._id);
      return res.json({ success: true, message: 'Category deleted successfully' });
    }

    const category = await dbAdapter.getCategoryById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await dbAdapter.deleteCategory(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
