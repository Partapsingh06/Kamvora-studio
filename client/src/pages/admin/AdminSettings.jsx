import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, Truck, Phone, Mail, MapPin } from 'lucide-react';
import api from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminSettings = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    announcement: {
      text: '',
      isActive: true,
      link: '/shop'
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      instagram: '',
      workingHours: ''
    },
    shipping: {
      shippingFee: 80,
      freeShippingThreshold: 999,
      codAvailable: true
    },
    hero: {
      heading: '',
      subheading: '',
      badgeText: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch (e) {
        addToast('Failed to load store settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/settings/admin', settings);
      if (data.success) {
        addToast('Store settings updated successfully across website!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#8C8276]">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
          Global Studio Configuration
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
          Store Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Announcement Bar */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE5D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
            <h3 className="font-art text-lg font-bold text-[#24211E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A261]" />
              <span>Announcement Top Bar</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={settings.announcement?.isActive}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, isActive: e.target.checked }
                  })
                }
                className="accent-[#C26D53] w-4 h-4"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Announcement Message</label>
            <input
              type="text"
              value={settings.announcement?.text || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: { ...settings.announcement, text: e.target.value }
                })
              }
              placeholder="e.g. Handcrafted with Love | Discover Something Unique | Free Shipping on Orders Over ₹999"
              className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
            />
          </div>
        </div>

        {/* 2. Shipping Rules */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE5D8] space-y-4 shadow-xs">
          <h3 className="font-art text-lg font-bold text-[#24211E] border-b border-[#F0EAE1] pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C26D53]" />
            <span>Shipping & Fulfillment Fees</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shipping?.shippingFee || 0}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, shippingFee: Number(e.target.value) }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.shipping?.freeShippingThreshold || 0}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      freeShippingThreshold: Number(e.target.value)
                    }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>
          </div>
        </div>

        {/* 3. Studio Contact & Address */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE5D8] space-y-4 shadow-xs">
          <h3 className="font-art text-lg font-bold text-[#24211E] border-b border-[#F0EAE1] pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C26D53]" />
            <span>Studio Contact & Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact?.phone || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Business Physical Address</label>
              <input
                type="text"
                value={settings.contact?.address || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Working Hours</label>
              <input
                type="text"
                value={settings.contact?.workingHours || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, workingHours: e.target.value }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.contact?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, instagram: e.target.value }
                  })
                }
                className="w-full p-3 bg-[#FAF6EE] rounded-xl border border-[#DED4C5]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Global Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
