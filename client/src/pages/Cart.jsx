import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  CheckCircle2,
  X,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/currency.js';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    subtotal,
    shippingCharge,
    freeShippingThreshold,
    discountAmount,
    totalPrice,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    setApplyingCoupon(true);
    await applyCoupon(couponInput);
    setApplyingCoupon(false);
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#C26D53] border border-[#E5DAC8] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-art text-3xl font-bold text-[#24211E]">
          Your Craft Bag is Empty
        </h2>
        <p className="text-xs sm:text-sm text-[#736A62] max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any handcrafted treasures to your bag yet. Explore our latest embroidery and resin art pieces!
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold rounded-full transition-all shadow-md"
          >
            <span>Explore Studio Creations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="border-b border-[#EDE5D8] pb-4 flex items-center justify-between">
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
          Your Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-[#8C8276] hover:text-rose-600 font-medium transition-colors"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free Shipping Progress Alert */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-[#24211E]">
            <Truck className="w-4 h-4 text-[#C26D53]" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You have unlocked Free Standard Shipping across India!
              </span>
            ) : (
              <span>
                Add <span className="text-[#C26D53] font-bold">{formatPrice(amountNeededForFreeShipping)}</span> more of handcrafted art for <span className="font-bold">FREE Shipping</span>!
              </span>
            )}
          </div>
          <span className="text-[#736A62]">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#EAE2D5] overflow-hidden">
          <div
            className="h-full bg-[#C26D53] transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Split Grid: Left Items List, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items Table/Cards */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Link
                  to={`/product/${item.slug || item.product}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF5ED] border border-[#EAE2D5] shrink-0"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="space-y-1">
                  <Link
                    to={`/product/${item.slug || item.product}`}
                    className="font-art text-base sm:text-lg font-bold text-[#24211E] hover:text-[#C26D53] transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  <div className="text-xs font-bold text-[#24211E]">
                    {formatPrice(item.price)}
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ml-2 text-[11px] text-[#8C8276] line-through font-normal">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  {item.customizationNote && (
                    <p className="text-[11px] text-[#A67C52] italic bg-[#FAF6EE] px-2 py-0.5 rounded-md inline-block">
                      Note: "{item.customizationNote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Subtotal & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F2ECE3]">
                <div className="flex items-center border border-[#DED4C5] rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-3 py-1.5 text-xs text-[#4A443E] hover:bg-[#F5EFE6]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="px-3 py-1.5 text-xs text-[#4A443E] hover:bg-[#F5EFE6]"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-bold text-[#24211E] min-w-[5rem] text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-[#8C8276] hover:text-rose-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#C26D53] hover:underline flex items-center gap-1"
            >
              &larr; Continue Exploring Kamvora Crafts
            </Link>
          </div>
        </div>

        {/* Right: Summary Card & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Card */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A67C52]">
              <Tag className="w-3.5 h-3.5" />
              <span>Promo or Gift Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    Saved {formatPrice(discountAmount)} on this order
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:text-emerald-900"
                  aria-label="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-[#DED4C5] rounded-xl focus:outline-none focus:border-[#C26D53]"
                />
                <button
                  type="submit"
                  disabled={applyingCoupon}
                  className="px-4 py-2 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  {applyingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            <div className="text-[10px] text-[#8C8276] flex gap-2">
              <span>Try: <b>WELCOME10</b> (10% off) or <b>ARTLOVER</b> (₹200 off)</span>
            </div>
          </div>

          {/* Order Totals Summary */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-4">
            <h3 className="font-art text-xl font-bold text-[#24211E] border-b border-[#EAE2D5] pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#736A62]">
                <span>Artworks Subtotal</span>
                <span className="font-semibold text-[#24211E]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
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

              <div className="pt-3 border-t border-[#EAE2D5] flex justify-between items-baseline text-base font-bold text-[#24211E]">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold text-[#C26D53]">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-full bg-[#24211E] hover:bg-[#C26D53] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-[#8C8276] leading-relaxed">
              Safe & Encrypted 256-bit Checkout. Verified Razorpay Gateway & Cash on Delivery Available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
