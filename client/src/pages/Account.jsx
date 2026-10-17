import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Sparkles,
  LogOut,
  ShieldCheck,
  Package
} from 'lucide-react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/currency.js';

const Account = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }

    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (err) {
        console.warn('Orders fetch note:', err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    // Fetch user's custom requests
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/custom-orders/my-requests');
        if (data.success) {
          setCustomRequests(data.data || []);
        }
      } catch (err) {
        console.warn('Custom requests fetch note:', err.message);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchOrders();
    fetchRequests();
  }, [user, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const payload = {
        name: profileName,
        phone: profilePhone
      };
      if (newPassword && newPassword.length >= 6) {
        payload.password = newPassword;
      }

      await updateProfile(payload);
      addToast('Profile updated successfully!', 'success');
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Account Hero Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#C26D53] text-white flex items-center justify-center font-editorial text-2xl font-bold uppercase shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-art text-2xl font-bold text-[#24211E]">{user.name}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8D8B8] text-[#875B1F] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#736A62] mt-0.5">{user.email}</p>
            {user.phone && <p className="text-xs text-[#736A62]">{user.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-[#FAF0DC] hover:bg-[#F2E5C9] text-[#875B1F] border border-[#E8D8B8] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2 bg-white hover:bg-[#FAF5ED] text-rose-700 border border-[#DED4C5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Tabs & Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Tab Buttons */}
        <aside className="lg:col-span-3 bg-[#FAF6EE] p-3 rounded-2xl border border-[#EDE5D8] space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'orders'
                ? 'bg-[#24211E] text-white shadow-xs'
                : 'text-[#4A443E] hover:bg-[#F2ECE1]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'requests'
                ? 'bg-[#24211E] text-white shadow-xs'
                : 'text-[#4A443E] hover:bg-[#F2ECE1]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Requests ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-[#24211E] text-white shadow-xs'
                : 'text-[#4A443E] hover:bg-[#F2ECE1]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </aside>

        {/* Right Content Panels */}
        <main className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-art text-2xl font-bold text-[#24211E]">
                Order History
              </h2>

              {loadingOrders ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[#8C8276]">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE2D5]">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#24211E]">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-[#8C8276] block">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0ED] text-[#C26D53] border border-[#E8C0B7]">
                            {ord.orderStatus}
                          </span>
                          <span className="text-sm font-bold text-[#24211E]">
                            {formatPrice(ord.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-white"
                              />
                              <div>
                                <p className="font-semibold text-[#24211E]">{item.name}</p>
                                <p className="text-[11px] text-[#8C8276]">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#24211E]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Track Link */}
                      <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between text-xs">
                        <span className="text-[#736A62]">
                          Payment: <b>{ord.paymentMethod}</b> ({ord.paymentStatus})
                        </span>
                        <Link
                          to={`/order-tracking?orderNumber=${ord.orderNumber}`}
                          className="font-bold text-[#C26D53] hover:underline"
                        >
                          Track Package &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] space-y-3">
                  <Package className="w-8 h-8 text-[#C8A261] mx-auto opacity-70" />
                  <p className="text-sm font-bold text-[#24211E]">No Orders Yet</p>
                  <p className="text-xs text-[#736A62]">When you place orders, their real-time progress will appear here.</p>
                  <Link
                    to="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-art text-2xl font-bold text-[#24211E]">
                  My Custom Order Inquiries
                </h2>
                <Link
                  to="/custom-order"
                  className="px-4 py-2 bg-[#C26D53] text-white text-xs font-bold rounded-xl hover:bg-[#AD5940]"
                >
                  New Request
                </Link>
              </div>

              {loadingRequests ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[#8C8276]">Loading custom inquiries...</p>
                </div>
              ) : customRequests.length > 0 ? (
                <div className="space-y-4">
                  {customRequests.map((req) => (
                    <div
                      key={req._id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE2D5]">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#24211E]">
                            {req.referenceNumber}
                          </span>
                          <span className="text-xs text-[#A67C52] font-semibold block">
                            Craft: {req.productType}
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF5ED] text-[#935938] border border-[#E5DAC8] self-start sm:self-auto">
                          Status: {req.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#665E56] leading-relaxed">
                        <b>Description:</b> {req.designDescription}
                      </p>

                      {/* Reference photos */}
                      {req.referenceImages && req.referenceImages.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {req.referenceImages.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="reference"
                              className="w-12 h-12 rounded-lg object-cover border border-[#DED4C5]"
                            />
                          ))}
                        </div>
                      )}

                      {/* Admin quote if provided */}
                      {req.adminQuote?.amount > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                          <b>Artisan Quote:</b> {formatPrice(req.adminQuote.amount)}
                          {req.adminQuote.note && <span> - {req.adminQuote.note}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] space-y-3">
                  <Sparkles className="w-8 h-8 text-[#C8A261] mx-auto opacity-70" />
                  <p className="text-sm font-bold text-[#24211E]">No Custom Inquiries</p>
                  <p className="text-xs text-[#736A62]">Have an idea for personalized embroidery or resin art?</p>
                  <Link
                    to="/custom-order"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full"
                  >
                    Submit a Request
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] space-y-6">
              <h2 className="font-art text-2xl font-bold text-[#24211E]">
                Profile & Security
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full text-xs sm:text-sm p-3 bg-[#EAE4DC] text-[#736A62] rounded-xl border border-[#DED4C5] cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#8C8276]">Email address cannot be changed.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 99150-88706"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EAE2D5]">
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Change Password (Leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-7 py-3 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs"
                >
                  {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
