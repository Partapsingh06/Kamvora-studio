import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X, Check, Calendar } from 'lucide-react';
import api from '../../utils/api.js';
import { formatPrice } from '../../utils/currency.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminCoupons = () => {
  const { addToast } = useToast();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    expiryDate: '',
    usageLimit: 100,
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coupons/admin');
      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch (e) {
      addToast(e.message || 'Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      addToast('Code and discount value are required', 'error');
      return;
    }

    try {
      const { data } = await api.post('/coupons/admin', formData);
      if (data.success) {
        addToast(`Coupon "${data.data.code}" created successfully!`, 'success');
        setModalOpen(false);
        setFormData({
          code: '',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 500,
          maxDiscountAmount: 500,
          expiryDate: '',
          usageLimit: 100,
          isActive: true
        });
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      const { data } = await api.delete(`/coupons/admin/${id}`);
      if (data.success) {
        addToast('Coupon deleted', 'info');
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Promotions & Discounts
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Coupon Management
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EE] text-[#736A62] uppercase tracking-wider font-bold border-b border-[#EDE5D8]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Used / Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF6EE]/50">
                    <td className="p-4 font-mono font-bold text-sm text-[#24211E]">
                      {c.code}
                    </td>
                    <td className="p-4 font-semibold text-[#C26D53]">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `${formatPrice(c.discountValue)} Flat`}
                    </td>
                    <td className="p-4">{formatPrice(c.minOrderAmount || 0)}</td>
                    <td className="p-4 text-[#665E56]">
                      {c.timesUsed || 0} / {c.usageLimit || '∞'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="p-1.5 text-[#8C8276] hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    No coupons created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-[#ECE5D8]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#8C8276]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-2xl font-bold text-[#24211E] mb-4">
              Create Promotional Code
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE25"
                  className="w-full p-2.5 uppercase font-mono bg-white rounded-xl border border-[#DED4C5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="15"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="999"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="500"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE5D8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C26D53] text-white font-bold rounded-xl"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
