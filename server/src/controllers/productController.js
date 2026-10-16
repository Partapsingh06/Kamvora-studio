import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { dbAdapter, isMongoConnected } from '../config/dbAdapter.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      inStock,
      isFeatured,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));

    if (isMongoConnected()) {
      const query = {};
      if (req.query.all !== 'true') query.isAvailable = true;

      if (search && search.trim() !== '') {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { tags: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      if (category && category !== 'all') {
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
          query.category = category;
        } else {
          const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
          if (foundCategory) {
            query.category = foundCategory._id;
          } else {
            return res.json({ success: true, count: 0, total: 0, page: pageNum, pages: 0, data: [] });
          }
        }
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
      }

      if (inStock === 'true') query.stock = { $gt: 0 };
      if (isFeatured === 'true') query.isFeatured = true;

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      else if (sort === 'price-desc') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };

      const total = await Product.countDocuments(query);
      const skip = (pageNum - 1) * pageSize;
      const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      return res.json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        data: products
      });
    }

    // Fallback mode
    const filter = {
      isAvailable: req.query.all === 'true' ? undefined : true,
      search: search ? search.trim() : undefined,
      category: category && category !== 'all' ? category : undefined,
      minPrice: minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      isFeatured: isFeatured === 'true'
    };

    const result = await dbAdapter.getProducts(filter, sort, pageNum, pageSize);
    res.json({
      success: true,
      count: result.products.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: result.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const products = await Product.find({ isFeatured: true, isAvailable: true })
        .populate('category', 'name slug')
        .limit(8)
        .sort({ createdAt: -1 });
      return res.json({ success: true, count: products.length, data: products });
    }

    const result = await dbAdapter.getProducts({ isFeatured: true, isAvailable: true }, 'newest', 1, 8);
    res.json({ success: true, count: result.products.length, data: result.products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID with related items
// @route   GET /api/products/:identifier
// @access  Public
export const getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    if (isMongoConnected()) {
      let product;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(identifier).populate('category', 'name slug');
      }
      if (!product) {
        product = await Product.findOne({ slug: identifier.toLowerCase() }).populate('category', 'name slug');
      }
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const relatedProducts = await Product.find({
        category: product.category._id || product.category,
        _id: { $ne: product._id },
        isAvailable: true
      })
        .limit(4)
        .select('name slug price discountPrice images rating category');

      return res.json({ success: true, data: product, related: relatedProducts });
    }

    const result = await dbAdapter.getProductByIdOrSlug(identifier);
    if (!result || !result.product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: result.product, related: result.related });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      stock,
      images,
      isFeatured,
      isAvailable,
      tags,
      specifications,
      customizationAvailable,
      customizationGuide
    } = req.body;

    if (!name || !description || price === undefined || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, and images'
      });
    }

    let slug = slugify(name);

    if (isMongoConnected()) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ success: false, message: 'Selected category does not exist' });
      }

      const slugExists = await Product.findOne({ slug });
      if (slugExists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

      const product = await Product.create({
        name,
        slug,
        description,
        shortDescription: shortDescription || description.slice(0, 140) + '...',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        category: categoryDoc._id,
        categoryName: categoryDoc.name,
        stock: stock !== undefined ? Number(stock) : 5,
        images: Array.isArray(images) ? images : [images],
        isFeatured: Boolean(isFeatured),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        tags: tags || [],
        specifications: specifications || {},
        customizationAvailable: Boolean(customizationAvailable),
        customizationGuide: customizationGuide || ''
      });

      return res.status(201).json({ success: true, data: product });
    }

    const catDoc = await dbAdapter.getCategoryById(category) || await dbAdapter.getCategoryBySlug(category);
    const categoryName = catDoc ? catDoc.name : 'Handmade Craft';
    const categoryId = catDoc ? catDoc._id : category;

    const product = await dbAdapter.createProduct({
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      shortDescription: shortDescription || description.slice(0, 140) + '...',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category: { _id: categoryId, name: categoryName, slug: catDoc?.slug || 'craft' },
      categoryName,
      stock: stock !== undefined ? Number(stock) : 5,
      images: Array.isArray(images) ? images : [images],
      isFeatured: Boolean(isFeatured),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      tags: tags || [],
      specifications: specifications || {},
      customizationAvailable: Boolean(customizationAvailable),
      customizationGuide: customizationGuide || ''
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.name) updates.slug = slugify(updates.name);

    if (isMongoConnected()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      Object.assign(product, updates);
      const updated = await product.save();
      return res.json({ success: true, data: updated });
    }

    const updated = await dbAdapter.updateProduct(id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      await Product.findByIdAndDelete(product._id);
      return res.json({ success: true, message: 'Product permanently deleted' });
    }

    await dbAdapter.deleteProduct(id);
    res.json({ success: true, message: 'Product permanently deleted' });
  } catch (error) {
    next(error);
  }
};
