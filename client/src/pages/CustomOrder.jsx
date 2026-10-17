import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  ShieldCheck,
  X
} from 'lucide-react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const CustomOrder = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    productType: 'Handmade Embroidery',
    designDescription: '',
    preferredColors: '',
    budget: '₹1,500 - ₹3,000',
    requiredDate: '',
    additionalInstructions: ''
  });

  const [referenceImages, setReferenceImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const productTypes = [
    'Handmade Embroidery',
    'Resin Art',
    'Fabric Painting',
    'Portraits',
    'Handmade Gifts',
    'Customized Gifts',
    'Home Decor',
    'Personalized Accessories',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast('Image size should be less than 10MB', 'error');
      return;
    }

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'kamvora_studio/custom_orders');

    try {
      const res = await api.post('/custom-orders/upload-reference', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.url) {
        setReferenceImages((prev) => [...prev, res.data.url]);
        addToast('Reference image uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.email || !formData.phone || !formData.designDescription) {
      addToast('Please complete all mandatory fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        referenceImages
      };

      const { data } = await api.post('/custom-orders', payload);
      if (data.success) {
        setSubmittedRequest(data);
        addToast('Your custom craft inquiry has been submitted!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit custom inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FAF5ED] border border-[#E5DAC8] text-[#935938] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A261]" />
          <span>Bespoke Handcrafted Creations</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          Your Idea. <span className="italic text-[#C26D53]">Our Creativity.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62] leading-relaxed">
          Request personalized embroidery hoops, couple charcoal sketches, wedding resin keepsakes, or bespoke fabric paintings handcrafted specially for you.
        </p>
      </div>

      {submittedRequest ? (
        /* Submission Success Screen */
        <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#FAF6EE] border border-[#E5DAC8] text-center space-y-6 shadow-sm animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <h2 className="font-art text-2xl sm:text-3xl font-bold text-[#24211E]">
              Custom Request Received!
            </h2>
            <p className="text-xs sm:text-sm text-[#665E56]">
              Thank you, <span className="font-semibold text-[#24211E]">{formData.customerName}</span>. Our lead artisan Komal Kang will personally review your ideas and reach out via phone or email within 24 hours.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#DED4C5] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8C8276] tracking-wider">
              Your Reference Tracking Number
            </span>
            <div className="font-mono text-lg font-bold text-[#C26D53] tracking-wide">
              {submittedRequest.referenceNumber}
            </div>
            <p className="text-[11px] text-[#A89F95]">
              Please save this reference number for all future inquiries.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/order-tracking"
              className="px-6 py-2.5 rounded-full bg-[#24211E] text-white text-xs font-semibold hover:bg-[#C26D53] transition-colors"
            >
              Track Request Status
            </Link>
            <button
              onClick={() => {
                setSubmittedRequest(null);
                setFormData({
                  customerName: '',
                  email: '',
                  phone: '',
                  productType: 'Handmade Embroidery',
                  designDescription: '',
                  preferredColors: '',
                  budget: '₹1,500 - ₹3,000',
                  requiredDate: '',
                  additionalInstructions: ''
                });
                setReferenceImages([]);
              }}
              className="px-6 py-2.5 rounded-full bg-white border border-[#DED4C5] text-xs font-semibold text-[#4A443E] hover:bg-[#F5EFE6]"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* The Custom Order Request Form */
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#E5DAC8] p-6 sm:p-12 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Contact Information */}
            <div className="space-y-4">
              <h3 className="font-art text-xl font-bold text-[#24211E] flex items-center gap-2 border-b border-[#EAE2D5] pb-2">
                <span>1. Your Contact Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Komal Sharma"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="komal@example.com"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765-43210"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Craft & Design Preferences */}
            <div className="space-y-4">
              <h3 className="font-art text-xl font-bold text-[#24211E] flex items-center gap-2 border-b border-[#EAE2D5] pb-2">
                <span>2. Art & Design Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Craft / Artwork Type *
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  >
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Estimated Budget Preference
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  >
                    <option value="Under ₹1,500">Under ₹1,500 (Small Keepsakes)</option>
                    <option value="₹1,500 - ₹3,000">₹1,500 - ₹3,000 (Standard Hoops & Lamps)</option>
                    <option value="₹3,000 - ₹5,000">₹3,000 - ₹5,000 (Large Resin Clocks & Portraits)</option>
                    <option value="Above ₹5,000">Above ₹5,000 (Luxury Multi-layer Masterpiece)</option>
                    <option value="Flexible">Flexible / Discuss with Artist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                  Detailed Description of Your Idea *
                </label>
                <textarea
                  name="designDescription"
                  rows={4}
                  required
                  value={formData.designDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your creative vision in detail: names to include, floral themes, aesthetic style (e.g. vintage, bohemian, modern luxury), size preference, or emotional story behind this gift..."
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Preferred Color Palette
                  </label>
                  <input
                    type="text"
                    name="preferredColors"
                    value={formData.preferredColors}
                    onChange={handleInputChange}
                    placeholder="e.g. Sage green, cream, gold accents, dusty rose"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                    Required Delivery By Date
                  </label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleInputChange}
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                  />
                  <span className="text-[10px] text-[#8C8276] mt-0.5 block">
                    *Handcrafted commissions typically require 4 to 10 days for meticulous creation and drying.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Reference Image Upload */}
            <div className="space-y-4">
              <h3 className="font-art text-xl font-bold text-[#24211E] flex items-center gap-2 border-b border-[#EAE2D5] pb-2">
                <span>3. Reference Photo or Sketch (Optional)</span>
              </h3>

              <div className="border-2 border-dashed border-[#DED4C5] rounded-2xl p-6 text-center bg-white hover:bg-[#FAF6EE] transition-colors">
                <input
                  type="file"
                  id="refImageUpload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <label
                  htmlFor="refImageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#C26D53] flex items-center justify-center border border-[#E5DAC8]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#24211E]">
                      {uploadingImage ? 'Uploading to Permanent Storage...' : 'Click to Upload Reference Photo'}
                    </span>
                    <p className="text-[11px] text-[#8C8276] mt-0.5">
                      Upload your portrait photo, room interior, or inspiration image (PNG, JPG, WEBP up to 10MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Uploaded Previews */}
              {referenceImages.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {referenceImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#DED4C5] shadow-xs">
                      <img src={img} alt={`ref-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Additional Instructions */}
            <div>
              <label className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                Special Delivery or Packaging Instructions (Optional)
              </label>
              <textarea
                name="additionalInstructions"
                rows={2}
                value={formData.additionalInstructions}
                onChange={handleInputChange}
                placeholder="e.g. Include handwritten birthday card message, wrap with jute ribbon..."
                className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#736A62] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4E6B4F]" />
                <span>No upfront payment required until design & quote is finalized</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-9 py-4 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C8A261]" />
                <span>{submitting ? 'Submitting Request...' : 'Send Custom Order Request'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomOrder;
