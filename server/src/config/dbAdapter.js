import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getStoreData, saveStoreData } from './dataStore.js';

export const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to generate simulated IDs
const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export const dbAdapter = {
  // --- CATEGORIES ---
  async getCategories(onlyActive = true) {
    const data = getStoreData();
    let cats = data.categories || [];
    if (onlyActive) cats = cats.filter(c => c.isActive !== false);
    return cats;
  },

  async getCategoryBySlug(slug) {
    const data = getStoreData();
    return (data.categories || []).find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  async getCategoryById(id) {
    const data = getStoreData();
    return (data.categories || []).find(c => String(c._id) === String(id)) || null;
  },

  async createCategory(catData) {
    const data = getStoreData();
    const newCat = {
      _id: genId('cat'),
      ...catData,
      createdAt: new Date().toISOString()
    };
    data.categories.push(newCat);
    saveStoreData(data);
    return newCat;
  },

  async updateCategory(id, updates) {
    const data = getStoreData();
    const idx = data.categories.findIndex(c => String(c._id) === String(id));
    if (idx === -1) return null;
    data.categories[idx] = { ...data.categories[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.categories[idx];
  },

  async deleteCategory(id) {
    const data = getStoreData();
    data.categories = data.categories.filter(c => String(c._id) !== String(id));
    saveStoreData(data);
    return true;
  },

  // --- PRODUCTS ---
  async getProducts(filter = {}, sort = 'newest', page = 1, limit = 12) {
    const data = getStoreData();
    let prods = [...(data.products || [])];

    // Availability
    if (filter.isAvailable !== undefined) {
      prods = prods.filter(p => p.isAvailable === filter.isAvailable);
    }

    // Featured
    if (filter.isFeatured) {
      prods = prods.filter(p => p.isFeatured === true);
    }

    // Category
    if (filter.category) {
      prods = prods.filter(p => {
        const catId = p.category?._id || p.category;
        const catSlug = p.category?.slug;
        return String(catId) === String(filter.category) || catSlug === filter.category;
      });
    }

    // Search
    if (filter.search) {
      const q = filter.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Price range
    if (filter.minPrice !== undefined) {
      prods = prods.filter(p => p.price >= filter.minPrice);
    }
    if (filter.maxPrice !== undefined) {
      prods = prods.filter(p => p.price <= filter.maxPrice);
    }

    // In stock
    if (filter.inStock) {
      prods = prods.filter(p => p.stock > 0);
    }

    // Sorting
    if (sort === 'price-asc') prods.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') prods.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') prods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else prods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = prods.length;
    const skip = (page - 1) * limit;
    const paginated = prods.slice(skip, skip + limit);

    return {
      products: paginated,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  async getProductByIdOrSlug(idOrSlug) {
    const data = getStoreData();
    const product = (data.products || []).find(
      p => String(p._id) === String(idOrSlug) || p.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!product) return null;

    // Find related
    const catId = product.category?._id || product.category;
    const related = (data.products || [])
      .filter(p => String(p._id) !== String(product._id) && (String(p.category?._id || p.category) === String(catId)))
      .slice(0, 4);

    return { product, related };
  },

  async createProduct(prodData) {
    const data = getStoreData();
    const newProd = {
      _id: genId('prod'),
      ...prodData,
      rating: 5.0,
      numReviews: 0,
      createdAt: new Date().toISOString()
    };
    data.products.push(newProd);
    saveStoreData(data);
    return newProd;
  },

  async updateProduct(id, updates) {
    const data = getStoreData();
    const idx = data.products.findIndex(p => String(p._id) === String(id));
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.products[idx];
  },

  async deleteProduct(id) {
    const data = getStoreData();
    data.products = data.products.filter(p => String(p._id) !== String(id));
    saveStoreData(data);
    return true;
  },

  // --- USERS ---
  async getUserByEmail(email) {
    const data = getStoreData();
    return (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id) {
    const data = getStoreData();
    const user = (data.users || []).find(u => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    const data = getStoreData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const isFirstUser = (data.users || []).length === 0;
    const assignedRole = userData.role === 'admin' ? 'admin' : 'customer';
    const newUser = {
      _id: genId('user'),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      phone: userData.phone || '',
      role: assignedRole,
      addresses: userData.addresses || [],
      wishlist: [],
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    saveStoreData(data);
    return newUser;
  },

  async updateUser(id, updates) {
    const data = getStoreData();
    const idx = data.users.findIndex(u => String(u._id) === String(id));
    if (idx === -1) return null;

    // Disallow role tampering via profile update
    const { role: _ignoredRole, ...safeUpdates } = updates;

    if (safeUpdates.password) {
      const salt = await bcrypt.genSalt(10);
      safeUpdates.password = await bcrypt.hash(safeUpdates.password, salt);
    }

    data.users[idx] = { ...data.users[idx], ...safeUpdates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.users[idx];
  },

  async getAllUsers() {
    const data = getStoreData();
    return (data.users || []).map(({ password, ...u }) => u);
  },

  // --- ORDERS ---
  async createOrder(orderData) {
    const data = getStoreData();
    const newOrder = {
      _id: genId('ord'),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    data.orders.unshift(newOrder);

    // Decrement stock if confirmed/COD
    if (orderData.paymentMethod === 'COD' || orderData.paymentStatus === 'Paid') {
      for (const item of orderData.items || []) {
        const prod = data.products.find(p => String(p._id) === String(item.product));
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }
    }

    saveStoreData(data);
    return newOrder;
  },

  async getOrders(filter = {}) {
    const data = getStoreData();
    let orders = [...(data.orders || [])];

    if (filter.user) {
      orders = orders.filter(o => String(o.user) === String(filter.user));
    }
    if (filter.status && filter.status !== 'all') {
      orders = orders.filter(o => o.orderStatus === filter.status);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerInfo?.name?.toLowerCase().includes(s) ||
        o.customerInfo?.email?.toLowerCase().includes(s) ||
        o.customerInfo?.phone?.includes(s)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  },

  async getOrderByIdOrNumber(idOrNumber) {
    const data = getStoreData();
    return (data.orders || []).find(
      o => String(o._id) === String(idOrNumber) || o.orderNumber.toUpperCase() === idOrNumber.toUpperCase()
    ) || null;
  },

  async updateOrder(id, updates) {
    const data = getStoreData();
    const idx = data.orders.findIndex(o => String(o._id) === String(id));
    if (idx === -1) return null;
    data.orders[idx] = { ...data.orders[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.orders[idx];
  },

  // --- CUSTOM ORDERS ---
  async createCustomRequest(reqData) {
    const data = getStoreData();
    const newReq = {
      _id: genId('cust'),
      ...reqData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    data.customRequests.unshift(newReq);
    saveStoreData(data);
    return newReq;
  },

  async getCustomRequests(filter = {}) {
    const data = getStoreData();
    let reqs = [...(data.customRequests || [])];

    if (filter.user) {
      reqs = reqs.filter(r => String(r.user) === String(filter.user) || r.email === filter.email);
    }
    if (filter.status && filter.status !== 'all') {
      reqs = reqs.filter(r => r.status === filter.status);
    }

    reqs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return reqs;
  },

  async getCustomRequestByRef(ref) {
    const data = getStoreData();
    return (data.customRequests || []).find(r => r.referenceNumber.toUpperCase() === ref.toUpperCase()) || null;
  },

  async updateCustomRequest(id, updates) {
    const data = getStoreData();
    const idx = data.customRequests.findIndex(r => String(r._id) === String(id));
    if (idx === -1) return null;
    data.customRequests[idx] = { ...data.customRequests[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.customRequests[idx];
  },

  // --- COUPONS ---
  async getCoupons() {
    const data = getStoreData();
    return data.coupons || [];
  },

  async getCouponByCode(code) {
    const data = getStoreData();
    return (data.coupons || []).find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive) || null;
  },

  async createCoupon(cData) {
    const data = getStoreData();
    const newC = {
      _id: genId('coup'),
      ...cData,
      timesUsed: 0,
      createdAt: new Date().toISOString()
    };
    data.coupons.push(newC);
    saveStoreData(data);
    return newC;
  },

  async updateCoupon(id, updates) {
    const data = getStoreData();
    const idx = data.coupons.findIndex(c => String(c._id) === String(id));
    if (idx === -1) return null;
    data.coupons[idx] = { ...data.coupons[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    return data.coupons[idx];
  },

  async deleteCoupon(id) {
    const data = getStoreData();
    data.coupons = data.coupons.filter(c => String(c._id) !== String(id));
    saveStoreData(data);
    return true;
  },

  // --- STORE SETTINGS ---
  async getSettings() {
    const data = getStoreData();
    return data.settings;
  },

  async updateSettings(updates) {
    const data = getStoreData();
    data.settings = {
      announcement: { ...data.settings.announcement, ...(updates.announcement || {}) },
      contact: { ...data.settings.contact, ...(updates.contact || {}) },
      shipping: { ...data.settings.shipping, ...(updates.shipping || {}) },
      hero: { ...data.settings.hero, ...(updates.hero || {}) }
    };
    saveStoreData(data);
    return data.settings;
  },

  // --- REVIEWS ---
  async addReview(revData) {
    const data = getStoreData();
    const newRev = {
      _id: genId('rev'),
      ...revData,
      createdAt: new Date().toISOString()
    };
    data.reviews.push(newRev);

    // Update product rating
    const prodReviews = data.reviews.filter(r => String(r.product) === String(revData.product));
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = data.products.find(p => String(p._id) === String(revData.product));
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.numReviews = prodReviews.length;
    }

    saveStoreData(data);
    return newRev;
  },

  async getReviewsForProduct(productId) {
    const data = getStoreData();
    return (data.reviews || []).filter(r => String(r.product) === String(productId));
  },

  // --- NEWSLETTER ---
  async addSubscriber(email) {
    const data = getStoreData();
    if (!data.subscribers) data.subscribers = [];
    const existing = data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return { existing: true };
    const sub = { _id: genId('sub'), email: email.toLowerCase(), subscribedAt: new Date().toISOString() };
    data.subscribers.push(sub);
    saveStoreData(data);
    return { existing: false, subscriber: sub };
  },

  async getSubscribers() {
    const data = getStoreData();
    return data.subscribers || [];
  }
};
