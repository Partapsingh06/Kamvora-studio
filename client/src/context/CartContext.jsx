import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kamvora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('kamvora_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('kamvora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('kamvora_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('kamvora_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, customizationNote = '') => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product === product._id);
      const activePrice =
        product.discountPrice !== null && product.discountPrice !== undefined
          ? product.discountPrice
          : product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;

        // Stock guard
        if (product.stock && newQty > product.stock) {
          addToast(`Only ${product.stock} pieces available in studio stock`, 'error');
          return prev;
        }

        updated[existingIndex].quantity = newQty;
        if (customizationNote) {
          updated[existingIndex].customizationNote = customizationNote;
        }
        addToast(`Updated quantity for "${product.name}" in your bag`);
        return updated;
      }

      // Add new item
      addToast(`Added "${product.name}" to your craft bag`);
      return [
        ...prev,
        {
          product: product._id,
          slug: product.slug,
          name: product.name,
          price: activePrice,
          originalPrice: product.price,
          image: product.images?.[0] || '',
          quantity,
          customizationNote,
          maxStock: product.stock || 10
        }
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          if (item.maxStock && newQuantity > item.maxStock) {
            addToast(`Only ${item.maxStock} units currently available`, 'error');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const removed = prev.find((i) => i.product === productId);
      if (removed) {
        addToast(`Removed "${removed.name}" from your bag`, 'info');
      }
      return prev.filter((item) => item.product !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('kamvora_cart');
    localStorage.removeItem('kamvora_coupon');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const freeShippingThreshold = 999;
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 80;

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
    discountAmount = Math.round(discountAmount);
  }

  const totalPrice = Math.max(0, subtotal - discountAmount + shippingCharge);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a coupon code', 'error');
      return false;
    }

    try {
      const { data } = await api.post('/coupons/validate', {
        code: code.trim(),
        cartTotal: subtotal
      });

      if (data.success && data.data) {
        setAppliedCoupon(data.data);
        addToast(data.message, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shippingCharge,
        freeShippingThreshold,
        discountAmount,
        totalPrice,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
