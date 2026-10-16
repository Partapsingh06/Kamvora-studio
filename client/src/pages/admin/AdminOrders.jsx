import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import api from '../../utils/api.js';
import { formatPrice } from '../../utils/currency.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminOrders = () => {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Status & Tracking update form
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await api.get(`/orders/admin/all?${params.toString()}`);
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm]);

  const openOrderModal = (ord) => {
    setSelectedOrder(ord);
    setOrderStatus(ord.orderStatus);
    setPaymentStatus(ord.paymentStatus);
    setCourier(ord.trackingDetails?.courier || '');
    setTrackingNumber(ord.trackingDetails?.trackingNumber || '');
    setTrackingUrl(ord.trackingDetails?.trackingUrl || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const payload = {
        orderStatus,
        paymentStatus,
        trackingDetails: {
          courier,
          trackingNumber,
          trackingUrl,
          estimatedDelivery: '3 to 5 business days'
        }
      };

      const { data } = await api.put(`/orders/admin/${selectedOrder._id}/status`, payload);
      if (data.success) {
        addToast(`Order ${selectedOrder.orderNumber} updated to ${orderStatus}!`, 'success');
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Fulfillment & Shipments
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Order Management
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE5D8] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order no, customer, phone..."
            className="w-full text-xs p-2.5 pl-10 bg-[#FAF6EE] rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 bg-[#FAF6EE] rounded-xl border border-[#DED4C5] focus:outline-none font-semibold text-[#4A443E]"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EE] text-[#736A62] uppercase tracking-wider font-bold border-b border-[#EDE5D8]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    Loading orders feed...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#24211E] block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#8C8276]">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-[#24211E]">{ord.customerInfo?.name}</p>
                      <p className="text-[11px] text-[#736A62]">{ord.customerInfo?.phone}</p>
                      <p className="text-[10px] text-[#8C8276] truncate max-w-[150px]">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#24211E]">{formatPrice(ord.totalPrice)}</div>
                      <span className="text-[10px] text-[#8C8276]">
                        {ord.items?.length || 0} artwork items
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-[#4A443E]">{ord.paymentMethod}</div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#FAF0ED] text-[#C26D53] border border-[#E8C0B7]'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => openOrderModal(ord)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#24211E] hover:text-white border border-[#DED4C5] font-semibold text-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8C8276]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#ECE5D8]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-[#8C8276] hover:text-[#24211E]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#EDE5D8] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C26D53]">
                Order Management
              </span>
              <h3 className="font-art text-2xl font-bold text-[#24211E]">
                {selectedOrder.orderNumber}
              </h3>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] mb-6 text-xs">
              <div>
                <span className="font-bold text-[#A67C52] uppercase text-[10px] block mb-1">
                  Customer Information
                </span>
                <p className="font-bold text-[#24211E]">{selectedOrder.customerInfo?.name}</p>
                <p className="text-[#665E56]">{selectedOrder.customerInfo?.phone}</p>
                <p className="text-[#665E56]">{selectedOrder.customerInfo?.email}</p>
              </div>

              <div>
                <span className="font-bold text-[#A67C52] uppercase text-[10px] block mb-1">
                  Delivery Destination
                </span>
                <p className="text-[#24211E] leading-relaxed">
                  {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-6">
              <span className="font-bold text-xs text-[#24211E] block">Items in Parcel:</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EDE5D8] text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-[#24211E]">{item.name}</p>
                        {item.customizationNote && (
                          <p className="text-[10px] text-[#A67C52] italic">Note: "{item.customizationNote}"</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold">{item.quantity} × {formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs pt-4 border-t border-[#EDE5D8]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">
                    Update Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5] font-semibold text-[#24211E]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5] font-semibold text-[#24211E]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Courier info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    placeholder="e.g. Bluedart / DTDC"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Tracking AWB #</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BLU982141"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A443E] mb-1">Courier Tracking URL</label>
                  <input
                    type="url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE5D8]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#DED4C5] text-[#4A443E]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-[#C26D53] hover:bg-[#AD5940] text-white font-bold rounded-xl"
                >
                  {updating ? 'Updating...' : 'Save Order Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
