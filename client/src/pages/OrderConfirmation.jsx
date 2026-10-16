import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Printer,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../utils/api.js';
import { formatPrice } from '../utils/currency.js';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        if (data.success && data.data) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#8C8276] uppercase font-semibold">Generating Your Receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-art text-2xl font-bold text-[#24211E]">Order Receipt Not Found</h2>
        <p className="text-xs text-[#736A62]">
          We couldn’t find an order matching reference "{orderId}".
        </p>
        <Link to="/" className="inline-block px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full">
          Return to Studio Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9 text-emerald-700" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
          Thank You For Supporting Handmade
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62] max-w-md mx-auto">
          We have received your order. A confirmation notice has been recorded and our Mohali studio artisans are preparing your pieces.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] p-6 sm:p-10 space-y-8 shadow-sm">
        {/* Top Details Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
          <div>
            <span className="text-xs text-[#8C8276]">Order Number</span>
            <div className="font-mono text-lg font-bold text-[#24211E]">
              {order.orderNumber}
            </div>
            <span className="text-[11px] text-[#A89F95]">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              order.orderStatus === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-[#FAF0ED] text-[#C26D53] border border-[#E8C0B7]'
            }`}>
              Status: {order.orderStatus}
            </span>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white border border-[#DED4C5] text-[#4A443E] hover:text-[#24211E] text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-4">
          <h3 className="font-art text-lg font-bold text-[#24211E]">
            Ordered Artworks
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white border border-[#EDE5D8] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#FAF5ED] border border-[#EAE2D5] shrink-0"
                  />
                  <div>
                    <h5 className="font-art text-base font-bold text-[#24211E]">{item.name}</h5>
                    <p className="text-xs text-[#8C8276]">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {item.customizationNote && (
                      <p className="text-[11px] text-[#A67C52] italic">
                        Custom Note: "{item.customizationNote}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-[#24211E]">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#EAE2D5] text-xs">
          {/* Shipping Address */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Shipping Address
            </span>
            <p className="font-bold text-[#24211E]">{order.shippingAddress?.fullName}</p>
            <p className="text-[#665E56] leading-relaxed">
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-[#665E56]">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Payment & Delivery
            </span>
            <p className="text-[#24211E]">
              Payment Method: <span className="font-bold">{order.paymentMethod}</span> ({order.paymentStatus})
            </p>
            <p className="text-[#665E56]">
              Delivery Mode: Standard Insured Transit (Pan-India)
            </p>
            {order.orderNotes && (
              <p className="text-[#665E56] italic">Notes: "{order.orderNotes}"</p>
            )}
          </div>
        </div>

        {/* Calculations Breakdown */}
        <div className="pt-6 border-t border-[#EAE2D5] space-y-2 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-[#736A62]">
            <span>Subtotal:</span>
            <span className="font-semibold text-[#24211E]">{formatPrice(order.itemsPrice)}</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount:</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-[#736A62]">
            <span>Shipping Charge:</span>
            <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
          </div>

          <div className="pt-2 border-t border-[#EAE2D5] flex justify-between text-base font-bold text-[#24211E]">
            <span>Total Paid/Payable:</span>
            <span className="text-xl font-extrabold text-[#C26D53]">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link
          to={`/order-tracking?orderNumber=${order.orderNumber}`}
          className="px-8 py-3.5 rounded-full bg-[#24211E] hover:bg-[#C26D53] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md text-center"
        >
          Track Shipment Progress
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded-full bg-white border border-[#DED4C5] text-[#24211E] hover:bg-[#FAF5ED] text-xs sm:text-sm font-semibold transition-all text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
