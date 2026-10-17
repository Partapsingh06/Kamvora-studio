import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  Lock,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/currency.js';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    cartItems,
    subtotal,
    shippingCharge,
    discountAmount,
    totalPrice,
    appliedCoupon,
    clearCart
  } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.addresses?.[0]?.fullName || user?.name || '',
    phone: user?.addresses?.[0]?.phone || user?.phone || '',
    addressLine: user?.addresses?.[0]?.addressLine || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Punjab',
    postalCode: user?.addresses?.[0]?.postalCode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Guard against empty cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-art text-2xl font-bold text-[#24211E]">Your Cart is Empty</h2>
        <p className="text-xs text-[#736A62]">Please add some items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full">
          Explore Artworks
        </Link>
      </div>
    );
  }

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !shippingAddress.fullName ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      addToast('Please fill in all mandatory contact and shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend
      const payload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          customizationNote: item.customizationNote || ''
        })),
        customerInfo,
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        orderNotes
      };

      const { data } = await api.post('/orders', payload);
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to initialize order');
      }

      const createdOrder = data.data;

      // 2. If COD, we are done!
      if (paymentMethod === 'COD') {
        clearCart();
        addToast('Order placed successfully via Cash on Delivery!', 'success');
        navigate(`/order-confirmation/${createdOrder.orderNumber}`);
        return;
      }

      // 3. Online Razorpay Flow
      const rzpInit = await api.post(`/orders/${createdOrder._id}/pay-razorpay`);
      const { orderId, amount, currency, keyId, isTestMode } = rzpInit.data.data;

      // Check if real Razorpay Checkout is loaded and configured
      if (!isTestMode && window.Razorpay && keyId && !keyId.includes('Demo')) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'Kamvora Studio',
          description: `Order ${createdOrder.orderNumber}`,
          order_id: orderId,
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          theme: {
            color: '#C26D53'
          },
          handler: async (response) => {
            try {
              // Verify on backend
              const verifyRes = await api.post(`/orders/${createdOrder._id}/verify-payment`, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                clearCart();
                addToast('Payment verified successfully!', 'success');
                navigate(`/order-confirmation/${createdOrder.orderNumber}`);
              }
            } catch (verErr) {
              addToast(verErr.message || 'Payment verification failed', 'error');
            }
          },
          modal: {
            ondismiss: () => {
              addToast('Payment window closed. Order status remains pending.', 'info');
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Safe Sandbox / Test Mode Simulation
        // Simulates verified online payment and calls backend verification endpoint
        const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const testSignature = `sig_test_verified_${Date.now()}`;

        const verifyRes = await api.post(`/orders/${createdOrder._id}/verify-payment`, {
          razorpayOrderId: orderId,
          razorpayPaymentId: testPaymentId,
          razorpaySignature: testSignature
        });

        if (verifyRes.data.success) {
          clearCart();
          addToast('Online test payment verified and order confirmed!', 'success');
          navigate(`/order-confirmation/${createdOrder.orderNumber}`);
        }
      }
    } catch (err) {
      setCheckoutError(err.message || 'Error processing your checkout');
      addToast(err.message || 'Error processing checkout', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Title */}
      <div className="border-b border-[#EDE5D8] pb-4">
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62]">
          Complete your details to finalize your handcrafted Kamvora Studio order.
        </p>
      </div>

      {checkoutError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Shipping & Customer Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contact */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-4">
            <h3 className="font-art text-xl font-bold text-[#24211E] border-b border-[#EAE2D5] pb-2">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={customerInfo.name}
                  onChange={handleInfoChange}
                  placeholder="e.g. Komal Kang"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={customerInfo.phone}
                  onChange={handleInfoChange}
                  placeholder="+91 99150-88706"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Email Address * (For order receipts and courier tracking updates)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={customerInfo.email}
                  onChange={handleInfoChange}
                  placeholder="name@example.com"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-4">
            <h3 className="font-art text-xl font-bold text-[#24211E] border-b border-[#EAE2D5] pb-2">
              2. Shipping Delivery Address
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    placeholder="Recipient name"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    Recipient Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Delivery contact"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Street Address & House / Flat No *
                </label>
                <input
                  type="text"
                  name="addressLine"
                  required
                  value={shippingAddress.addressLine}
                  onChange={handleAddressChange}
                  placeholder="e.g. Shop 399, Janta Market / Flat 402, Green Avenue"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Mohali"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. Punjab"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 160055"
                    className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                  Delivery Notes or Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Near Gurudwara, leave at door, call before delivery..."
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-4">
            <h3 className="font-art text-xl font-bold text-[#24211E] border-b border-[#EAE2D5] pb-2">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#C26D53] bg-white shadow-xs'
                    : 'border-[#EAE2D5] bg-[#FAF5ED] opacity-80 hover:opacity-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-[#C26D53]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#24211E] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C26D53]" /> Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-[#736A62] mt-1">
                    Pay securely in cash or UPI at your doorstep upon parcel handover.
                  </p>
                </div>
              </label>

              {/* Online Payment / Razorpay */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#C26D53] bg-white shadow-xs'
                    : 'border-[#EAE2D5] bg-[#FAF5ED] opacity-80 hover:opacity-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-1 accent-[#C26D53]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#24211E] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#C26D53]" /> Razorpay Online Gateway
                  </span>
                  <p className="text-[11px] text-[#736A62] mt-1">
                    Cards, UPI (GPay, PhonePe, Paytm), NetBanking & Wallets.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-5 sticky top-28">
            <h3 className="font-art text-xl font-bold text-[#24211E] border-b border-[#EAE2D5] pb-3">
              Order Items ({cartItems.length})
            </h3>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-[#EAE2D5] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#24211E] truncate">{item.name}</p>
                    <p className="text-[#8C8276]">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-[#24211E]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#EAE2D5] space-y-2 text-xs">
              <div className="flex justify-between text-[#736A62]">
                <span>Artworks Subtotal</span>
                <span className="font-semibold text-[#24211E]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#736A62]">
                <span>Shipping Fee</span>
                <span>
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    formatPrice(shippingCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAE2D5] flex justify-between items-baseline text-lg font-bold text-[#24211E]">
                <span>Total Payable</span>
                <span className="text-2xl font-extrabold text-[#C26D53]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : paymentMethod === 'COD'
                  ? `Place Order (${formatPrice(totalPrice)})`
                  : `Pay with Razorpay (${formatPrice(totalPrice)})`}
              </span>
            </button>

            <div className="text-[10px] text-center text-[#8C8276] space-y-1">
              <p>Pan-India Dispatched from Shop 399, Janta Market, Mohali.</p>
              <p className="text-emerald-800 font-medium">
                Direct WhatsApp artist support available at +91 99150-88706
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
