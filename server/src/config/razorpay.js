import Razorpay from 'razorpay';
import crypto from 'crypto';

const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

let razorpayInstance = null;

if (isRazorpayConfigured) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✓ Razorpay live merchant gateway configured.');
} else {
  console.log('! Razorpay keys not provided. Safe test mode enabled for payment checkout.');
}

/**
 * Create Razorpay Order
 * @param {number} amountInINR Amount in Indian Rupees
 * @param {string} receipt Unique receipt reference
 * @returns {Promise<object>} Razorpay order payload
 */
export const createRazorpayOrder = async (amountInINR, receipt) => {
  const amountInPaise = Math.round(amountInINR * 100);

  if (isRazorpayConfigured && razorpayInstance) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt.slice(0, 40),
        notes: {
          brand: 'Kamvora Studio',
          receipt
        }
      });
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        isTestMode: false,
        keyId: process.env.RAZORPAY_KEY_ID
      };
    } catch (err) {
      console.error('Razorpay order creation failed:', err);
      throw new Error(`Razorpay gateway error: ${err.message}`);
    }
  }

  // Safe Mock/Test Gateway Order
  const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency: 'INR',
    isTestMode: true,
    keyId: 'rzp_test_KamvoraStudioDemo'
  };
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 * @returns {boolean} Whether payment is verified
 */
export const verifyRazorpaySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  if (!razorpayOrderId || !razorpayPaymentId) {
    return false;
  }

  if (isRazorpayConfigured) {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  // In test mode without live keys, verify paymentId format and presence
  if (razorpayOrderId.startsWith('order_test_') || razorpayPaymentId.startsWith('pay_test_')) {
    return true;
  }

  return Boolean(razorpaySignature);
};
