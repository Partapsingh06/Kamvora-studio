import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import InstagramIcon from '../components/icons/InstagramIcon.jsx';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';

const Contact = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Art Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please complete all mandatory fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/settings/contact', formData);
      if (data.success) {
        setSubmitted(true);
        addToast(data.message || 'Message sent successfully!', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Art Inquiry',
          message: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
          Get in Touch
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          We’d Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62]">
          Have questions about a customized gift, delivery timelines, or bulk wedding orders? Reach out directly to artist Komal Kang.
        </p>
      </div>

      {/* Main Grid: Contact Info Cards & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Studio Address Card */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C26D53]/15 text-[#C26D53] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-art text-lg font-bold text-[#24211E]">Studio & Store Location</h4>
            <p className="text-xs sm:text-sm text-[#665E56] leading-relaxed">
              Shop Number 399, Janta Market, Mohali, Punjab, India
            </p>
            <div className="text-[11px] text-[#A67C52] font-semibold flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Studio Hours: Mon - Sat: 10:00 AM - 7:30 PM IST</span>
            </div>
          </div>

          {/* Direct Phone / Call Card */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8A261]/20 text-[#C8A261] flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-art text-lg font-bold text-[#24211E]">Call & WhatsApp Direct</h4>
            <p className="text-xs text-[#736A62]">
              Call artist Komal directly for instant custom craft discussions and bulk orders.
            </p>
            <a
              href="tel:+919915088706"
              className="inline-block text-base font-bold text-[#C26D53] hover:underline"
            >
              +91 99150-88706
            </a>
          </div>

          {/* Email Card */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#24211E]/10 text-[#24211E] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-art text-lg font-bold text-[#24211E]">Email Communications</h4>
            <p className="text-xs text-[#736A62]">
              Send us high-res reference photos, bulk gifting RFPs, or collaborative proposals.
            </p>
            <a
              href="mailto:Kamvorastudio@gmail.com"
              className="inline-block text-xs sm:text-sm font-bold text-[#24211E] hover:text-[#C26D53] transition-colors"
            >
              Kamvorastudio@gmail.com
            </a>
          </div>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-[#24201D] text-white hover:bg-[#C26D53] transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <InstagramIcon className="w-5 h-5 text-[#E8C27B] group-hover:text-white" />
              <div>
                <p className="text-xs font-bold">Follow on Instagram</p>
                <p className="text-[11px] text-[#A89F95] group-hover:text-white/80">@iamkomalkang</p>
              </div>
            </div>
            <span className="text-xs text-[#E8C27B] group-hover:text-white font-semibold">Connect &rarr;</span>
          </a>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-[#EAE2D5] pb-4">
            <h3 className="font-art text-2xl font-bold text-[#24211E]">
              Send a Studio Message
            </h3>
            <p className="text-xs text-[#736A62] mt-1">
              We usually respond within 24 business hours.
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Thank you! Your message has been sent. We look forward to connecting with you.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Komal Sharma"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="komal@example.com"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99150-88706"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Inquiry Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                >
                  <option value="General Art Inquiry">General Art Inquiry</option>
                  <option value="Custom Gift Commission">Custom Gift Commission</option>
                  <option value="Wedding / Bulk Order">Wedding / Bulk Order</option>
                  <option value="Courier Tracking Help">Courier Tracking Help</option>
                  <option value="Studio Visit Appointment">Studio Visit Appointment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                Your Message *
              </label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your questions, requirements, or craft thoughts here..."
                className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Embedded Google Map (Janta Market, Mohali, Punjab) */}
      <div className="rounded-3xl overflow-hidden border border-[#EDE5D8] shadow-sm bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#A67C52] tracking-wider px-2">
          <MapPin className="w-4 h-4 text-[#C26D53]" />
          <span>Interactive Location: Shop 399, Janta Market, Mohali, Punjab</span>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-[21/9] w-full bg-[#EFE9DF]">
          <iframe
            title="Kamvora Studio Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13721.267683935212!2d76.702082!3d30.709945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef4d4d293f77%3A0x6b772421382944b0!2sJanta%20Market%2C%20Sector%2070%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
