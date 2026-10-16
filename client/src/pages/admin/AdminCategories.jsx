import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import api from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminCategories = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories?all=true');
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (e) {
      addToast(e.message || 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image,
      isActive: cat.isActive !== false
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'kamvora_studio/categories');

    try {
      const res = await api.post('/upload/single', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        addToast('Category banner uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      addToast('Name and image are required', 'error');
      return;
    }

    try {
      if (editingCategory) {
        const { data } = await api.put(`/categories/admin/${editingCategory._id}`, formData);
        if (data.success) {
          addToast(`Category "${formData.name}" updated!`, 'success');
          setModalOpen(false);
          fetchCategories();
        }
      } else {
        const { data } = await api.post('/categories', formData);
        if (data.success) {
          addToast(`Category "${formData.name}" created!`, 'success');
          setModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this craft category?')) return;

    try {
      const { data } = await api.delete(`/categories/admin/${id}`);
      if (data.success) {
        addToast('Category deleted successfully', 'info');
        fetchCategories();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Catalog Taxonomies
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Category Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-video overflow-hidden bg-[#FAF5ED]">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-art text-lg font-bold text-[#24211E]">{cat.name}</h4>
                <p className="text-xs text-[#736A62] line-clamp-2 mt-1">
                  {cat.description || 'Artisan handcrafted collection'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#A67C52]">
                  Slug: /{cat.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-[#4A443E] hover:text-[#C26D53] hover:bg-[#FAF6EE]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 rounded-lg text-[#4A443E] hover:text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-[#ECE5D8]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#8C8276] hover:text-[#24211E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-2xl font-bold text-[#24211E] mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Craft Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A443E] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Resin Art Clocks"
                  className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A443E] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of this craft technique..."
                  className="w-full p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A443E] mb-1">Category Image Banner *</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#DED4C5]"
                    />
                  )}
                  <label className="px-4 py-2.5 rounded-xl border border-[#DED4C5] bg-white cursor-pointer hover:bg-[#FAF6EE] text-[#4A443E] font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#C26D53]" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDE5D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DED4C5] text-[#4A443E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-[#C26D53] text-white font-bold hover:bg-[#AD5940]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
