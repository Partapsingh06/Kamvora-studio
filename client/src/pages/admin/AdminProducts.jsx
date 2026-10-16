import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Upload,
  X,
  Check,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import api from '../../utils/api.js';
import { formatPrice } from '../../utils/currency.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminProducts = () => {
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: 10,
    description: '',
    shortDescription: '',
    isFeatured: false,
    isAvailable: true,
    customizationAvailable: false,
    customizationGuide: 'Enter custom names, initials, or colors in order notes',
    images: []
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.get('/products?all=true&limit=100'),
        api.get('/categories?all=true')
      ]);

      if (prodsRes.data.success) {
        setProducts(prodsRes.data.data || []);
      }
      if (catsRes.data.success) {
        setCategories(catsRes.data.data || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      description: product.description,
      shortDescription: product.shortDescription || '',
      isFeatured: Boolean(product.isFeatured),
      isAvailable: product.isAvailable !== false,
      customizationAvailable: Boolean(product.customizationAvailable),
      customizationGuide: product.customizationGuide || '',
      images: product.images || []
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'kamvora_studio/products');

    try {
      const res = await api.post('/upload/single', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.data.url]
        }));
        addToast('Image uploaded permanently to Cloudinary!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      addToast('Please provide name, category, price, and at least one image', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock)
      };

      if (editingProduct) {
        // Update product
        const { data } = await api.put(`/products/admin/${editingProduct._id}`, payload);
        if (data.success) {
          addToast(`"${payload.name}" updated successfully!`, 'success');
          setModalOpen(false);
          fetchData();
        }
      } else {
        // Create product
        const { data } = await api.post('/products', payload);
        if (data.success) {
          addToast(`"${payload.name}" published to store!`, 'success');
          setModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const { data } = await api.delete(`/products/admin/${id}`);
      if (data.success) {
        addToast('Product permanently deleted from catalog', 'info');
        setDeleteConfirmId(null);
        fetchData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCat === 'all' ||
      p.category?.slug === selectedCat ||
      p.category?._id === selectedCat ||
      p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Inventory & Catalog
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Product Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE5D8] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full text-xs p-2.5 pl-10 bg-[#FAF6EE] rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 bg-[#FAF6EE] rounded-xl border border-[#DED4C5] focus:outline-none font-semibold text-[#4A443E]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EE] text-[#736A62] uppercase tracking-wider font-bold border-b border-[#EDE5D8]">
              <tr>
                <th className="p-4">Artwork</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    Loading catalog items...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    {/* Image & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FAF5ED] border border-[#EAE2D5] shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-art text-sm font-bold text-[#24211E] truncate">{p.name}</p>
                          <span className="text-[10px] text-[#8C8276]">
                            {p.customizationAvailable ? 'Customizable' : 'Standard Edition'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-medium text-[#4A443E]">
                      {p.categoryName || p.category?.name || 'Craft'}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-bold text-[#24211E]">
                        {formatPrice(p.discountPrice || p.price)}
                      </div>
                      {p.discountPrice && (
                        <div className="text-[10px] text-[#8C8276] line-through">
                          {formatPrice(p.price)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stock < 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock <= 0 ? 'Out of Stock' : `${p.stock} units`}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="p-4">
                      {p.isFeatured ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#8C8276]">No</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-[#4A443E] hover:text-[#C26D53] hover:bg-[#FAF6EE]"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p._id)}
                          className="p-1.5 rounded-lg text-[#4A443E] hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    No products found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#8C8276] hover:text-[#24211E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-2xl font-bold text-[#24211E] mb-6">
              {editingProduct ? 'Edit Handcrafted Product' : 'Add New Handcrafted Artwork'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A443E] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Azure Coastline Ocean Wave Resin Clock"
                  className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2499"
                    className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="1999"
                    className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#C26D53] w-4 h-4"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="flex items-center pt-6 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.customizationAvailable}
                      onChange={(e) => setFormData({ ...formData, customizationAvailable: e.target.checked })}
                      className="accent-[#C26D53] w-4 h-4"
                    />
                    <span>Customizable</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A443E] mb-1">Full Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the craft process, materials used, size, and packaging..."
                  className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none"
                />
              </div>

              {/* Cloudinary Image Uploads */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#4A443E]">
                  Product Images (Permanent Cloudinary Storage) *
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DED4C5]">
                      <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#DED4C5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF6EE] text-[#C26D53]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] mt-1 font-semibold">{uploadingImage ? '...' : '+ Upload'}</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#EDE5D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DED4C5] hover:bg-[#FAF5ED] font-semibold text-[#4A443E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-[#C26D53] hover:bg-[#AD5940] text-white font-bold"
                >
                  {saving ? 'Publishing...' : editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 text-center border border-[#EDE5D8]">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-art text-xl font-bold text-[#24211E]">Confirm Product Deletion</h4>
            <p className="text-xs text-[#736A62]">
              Are you sure you want to permanently delete this artwork from the studio catalog? This action cannot be reversed.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#DED4C5] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
