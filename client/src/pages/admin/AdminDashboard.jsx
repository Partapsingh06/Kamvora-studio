import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import api from '../../utils/api.js';
import { formatPrice } from '../../utils/currency.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/admin/dashboard');
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-[#8C8276] uppercase font-bold tracking-wider">
          Aggregating Studio Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Studio Operations
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardStats}
            className="p-2.5 rounded-xl bg-white border border-[#DED4C5] hover:bg-[#FAF6EE] text-[#4A443E] shadow-2xs transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#8C8276] text-xs font-semibold mb-2">
            <span>Recorded Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF0ED] text-[#C26D53] flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#24211E]">
            {formatPrice(stats?.totalRevenue || 0)}
          </div>
          <span className="text-[10px] text-[#8C8276] block mt-1">Based on confirmed orders</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C8276] text-xs font-semibold mb-2">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] text-[#875B1F] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#24211E]">
            {stats?.totalOrders || 0}
          </div>
          <span className="text-[10px] text-amber-800 font-bold block mt-1">
            {stats?.pendingOrders || 0} pending dispatch
          </span>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C8276] text-xs font-semibold mb-2">
            <span>Catalog Items</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] text-[#4A443E] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#24211E]">
            {stats?.totalProducts || 0}
          </div>
          <span className="text-[10px] text-[#8C8276] block mt-1">Active craft products</span>
        </div>

        {/* Custom Requests */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C8276] text-xs font-semibold mb-2">
            <span>Custom Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F5F0] text-[#4E6B4F] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-[#C8A261]" />
            </div>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#24211E]">
            {stats?.recentRequests?.length || 0}
          </div>
          <span className="text-[10px] text-emerald-800 font-bold block mt-1">
            {stats?.pendingCustomRequests || 0} need review
          </span>
        </div>

        {/* Registered Customers */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#8C8276] text-xs font-semibold mb-2">
            <span>Customers</span>
            <div className="w-8 h-8 rounded-xl bg-[#F7F2EA] text-[#6B5A4B] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#24211E]">
            {stats?.totalCustomers || 0}
          </div>
          <span className="text-[10px] text-[#8C8276] block mt-1">Registered patron accounts</span>
        </div>
      </div>

      {/* Split Tables: Recent Orders & Recent Custom Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl border border-[#EDE5D8] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
            <h3 className="font-art text-lg font-bold text-[#24211E] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C26D53]" />
              <span>Recent Studio Orders</span>
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#C26D53] hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#EDE5D8] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-[#24211E]">{ord.orderNumber}</span>
                    <p className="text-[#736A62]">{ord.customerInfo?.name || 'Customer'}</p>
                    <span className="text-[10px] text-[#8C8276]">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')} | {ord.paymentMethod}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold text-[#24211E] block">
                      {formatPrice(ord.totalPrice)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8C8276] text-center py-6">No orders recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Custom Order Inquiries */}
        <div className="bg-white rounded-3xl border border-[#EDE5D8] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
            <h3 className="font-art text-lg font-bold text-[#24211E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A261]" />
              <span>Custom Order Requests</span>
            </h3>
            <Link to="/admin/custom-requests" className="text-xs font-bold text-[#C26D53] hover:underline">
              Manage Inquiries &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentRequests && stats.recentRequests.length > 0 ? (
              stats.recentRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#EDE5D8] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-[#24211E]">{req.referenceNumber}</span>
                    <p className="text-[#24211E] font-semibold">{req.customerName}</p>
                    <span className="text-[10px] text-[#A67C52] font-medium block">
                      {req.productType} (Budget: {req.budget})
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0ED] text-[#C26D53] border border-[#E8C0B7] block">
                      {req.status}
                    </span>
                    <Link
                      to="/admin/custom-requests"
                      className="text-[11px] text-[#C26D53] font-semibold hover:underline"
                    >
                      Inspect & Quote
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8C8276] text-center py-6">No custom inquiries received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
