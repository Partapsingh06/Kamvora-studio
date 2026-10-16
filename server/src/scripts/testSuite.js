import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kamvorastudio.com').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'KamvoraAdmin@2026';

const results = {
  passed: [],
  failed: []
};

function pass(testName, details = '') {
  console.log(`  ✓ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
  results.passed.push({ name: testName, details });
}

function fail(testName, error) {
  console.error(`  ✗ FAIL: ${testName} - ${error}`);
  results.failed.push({ name: testName, error });
}

async function runTests() {
  console.log('======================================================');
  console.log(`  KAMVORA STUDIO - COMPREHENSIVE AUDIT & ROUTE TESTS`);
  console.log(`  Testing endpoint: ${BASE_URL}`);
  console.log('======================================================\n');

  let adminToken = null;
  let customerToken = null;
  let customerId = null;
  let sampleProduct = null;
  let createdOrderId = null;
  let createdOrderNumber = null;
  let customOrderRef = null;

  // 1. Health & Discovery API
  console.log('\n--- Test Group 1: Server Health & Status ---');
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status === 'online' && res.data.services) {
      pass('Health Check Endpoint (/api/health)', `Status: ${res.data.status}, DB: ${res.data.database}, Cloudinary: ${res.data.services.cloudinary}, Razorpay: ${res.data.services.razorpay}`);
    } else {
      fail('Health Check Endpoint (/api/health)', 'Invalid response payload');
    }
  } catch (e) {
    fail('Health Check Endpoint (/api/health)', e.message);
  }

  // 2. Auth: Admin Login
  console.log('\n--- Test Group 2: Authentication & Token Generation ---');
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminEmail,
      password: adminPassword
    });
    if (res.data.success && res.data.data.token && res.data.data.role === 'admin') {
      adminToken = res.data.data.token;
      pass('Admin Login (/api/auth/login)', `Verified role: ${res.data.data.role}, Name: ${res.data.data.name}`);
    } else {
      fail('Admin Login (/api/auth/login)', 'Failed to authenticate or role is not admin');
    }
  } catch (e) {
    fail('Admin Login (/api/auth/login)', e.response?.data?.message || e.message);
  }

  // 3. Auth: Customer Registration with attempted privilege escalation
  const testCustomerEmail = `audit_customer_${Date.now()}@example.com`;
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Audit Customer',
      email: testCustomerEmail,
      password: 'CustomerPassword@2026',
      phone: '+91 98765-43210',
      role: 'admin' // Attempt privilege escalation
    });
    if (res.data.success && res.data.data.token) {
      customerToken = res.data.data.token;
      customerId = res.data.data._id;
      if (res.data.data.role === 'customer') {
        pass('Customer Registration & Anti-Escalation Check', 'Privilege escalation prevented: role remains strictly customer');
      } else {
        fail('Customer Registration & Anti-Escalation Check', `Vulnerability detected: user assigned role ${res.data.data.role}`);
      }
    } else {
      fail('Customer Registration', 'Registration unsuccessful');
    }
  } catch (e) {
    fail('Customer Registration', e.response?.data?.message || e.message);
  }

  // 4. Auth: Customer Login
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testCustomerEmail,
      password: 'CustomerPassword@2026'
    });
    if (res.data.success && res.data.data.token && res.data.data.role === 'customer') {
      pass('Customer Login (/api/auth/login)', `Logged in as customer: ${res.data.data.email}`);
    } else {
      fail('Customer Login (/api/auth/login)', 'Failed to login');
    }
  } catch (e) {
    fail('Customer Login (/api/auth/login)', e.response?.data?.message || e.message);
  }

  // 5. Auth: Login Rejection on bad password
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: adminEmail,
      password: 'WrongPassword123!'
    });
    fail('Bad Password Rejection', 'Expected 401 but request succeeded');
  } catch (e) {
    if (e.response?.status === 401) {
      pass('Bad Password Rejection', 'Correctly rejected invalid credentials with 401 Unauthorized');
    } else {
      fail('Bad Password Rejection', `Unexpected status: ${e.response?.status}`);
    }
  }

  // 6. Server-Side Protection: Unauthenticated access to admin endpoints
  console.log('\n--- Test Group 3: Server-Side API Protection (Unauthenticated) ---');
  const adminEndpoints = [
    { method: 'get', url: `${BASE_URL}/orders/admin/all`, name: 'Admin Orders List' },
    { method: 'get', url: `${BASE_URL}/settings/admin/dashboard`, name: 'Admin Dashboard Metrics' },
    { method: 'get', url: `${BASE_URL}/auth/admin/users`, name: 'Admin Customers List' },
    { method: 'get', url: `${BASE_URL}/coupons/admin`, name: 'Admin Coupons List' },
    { method: 'get', url: `${BASE_URL}/custom-orders/admin/all`, name: 'Admin Custom Requests List' },
    { method: 'post', url: `${BASE_URL}/products`, name: 'Product Creation Endpoint' },
    { method: 'post', url: `${BASE_URL}/categories`, name: 'Category Creation Endpoint' }
  ];

  for (const ep of adminEndpoints) {
    try {
      await axios[ep.method](ep.url);
      fail(`Unauthenticated Protection: ${ep.name}`, 'Vulnerability: Endpoint returned success without token');
    } catch (e) {
      if (e.response?.status === 401) {
        pass(`Unauthenticated Protection: ${ep.name}`, 'Correctly denied with 401 Not Authorized');
      } else {
        fail(`Unauthenticated Protection: ${ep.name}`, `Returned unexpected status: ${e.response?.status}`);
      }
    }
  }

  // 7. Server-Side Protection: Customer access to admin endpoints (Role Authorization)
  console.log('\n--- Test Group 4: Server-Side API Protection (Customer Role Forbidden) ---');
  for (const ep of adminEndpoints) {
    try {
      await axios[ep.method](ep.url, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      fail(`Customer Access Denied: ${ep.name}`, 'Vulnerability: Customer token was permitted access to admin API');
    } catch (e) {
      if (e.response?.status === 403) {
        pass(`Customer Access Denied: ${ep.name}`, 'Correctly denied with 403 Forbidden');
      } else if (e.response?.status === 401) {
        pass(`Customer Access Denied: ${ep.name}`, 'Denied with 401');
      } else {
        fail(`Customer Access Denied: ${ep.name}`, `Returned unexpected status: ${e.response?.status}`);
      }
    }
  }

  // 8. Server-Side Success: Admin token on admin endpoints
  console.log('\n--- Test Group 5: Server-Side API Access (Admin Authorized) ---');
  for (const ep of adminEndpoints.slice(0, 5)) {
    try {
      const res = await axios[ep.method](ep.url, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status === 200 && res.data.success) {
        pass(`Admin Access Allowed: ${ep.name}`, 'Authorized with 200 OK');
      } else {
        fail(`Admin Access Allowed: ${ep.name}`, 'Status not 200 or success false');
      }
    } catch (e) {
      fail(`Admin Access Allowed: ${ep.name}`, e.response?.data?.message || e.message);
    }
  }

  // 9. Categories & Cloudinary Image Verification
  console.log('\n--- Test Group 6: Catalog & Cloudinary Image Verification ---');
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const allCloudinary = res.data.data.every(c => c.image && c.image.includes('cloudinary.com'));
      if (allCloudinary) {
        pass('Category Images Cloudinary Verification', `All ${res.data.data.length} categories have permanent Cloudinary URLs`);
      } else {
        fail('Category Images Cloudinary Verification', 'Some category images are not on Cloudinary');
      }
    } else {
      fail('Categories Endpoint (/api/categories)', 'No categories returned');
    }
  } catch (e) {
    fail('Categories Endpoint (/api/categories)', e.message);
  }

  // 10. Products & Cloudinary Image Verification
  try {
    const res = await axios.get(`${BASE_URL}/products?limit=50`);
    if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      sampleProduct = res.data.data[0];
      const allCloudinary = res.data.data.every(p => p.images.every(img => img.includes('cloudinary.com')));
      if (allCloudinary) {
        pass('Product Images Cloudinary Verification', `All ${res.data.data.length} products have permanent Cloudinary URLs`);
      } else {
        fail('Product Images Cloudinary Verification', 'Some product images are not on Cloudinary');
      }
    } else {
      fail('Products Endpoint (/api/products)', 'No products returned');
    }
  } catch (e) {
    fail('Products Endpoint (/api/products)', e.message);
  }

  // 11. Cart, Order Creation & Checkout
  console.log('\n--- Test Group 7: Cart, Checkout & Razorpay Order Verification ---');
  try {
    const orderPayload = {
      items: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          quantity: 1,
          image: sampleProduct.images[0]
        }
      ],
      customerInfo: {
        name: 'Audit Customer',
        email: testCustomerEmail,
        phone: '+91 98765-43210'
      },
      shippingAddress: {
        fullName: 'Audit Customer',
        phone: '+91 98765-43210',
        addressLine: 'House 42, Sector 70',
        city: 'Mohali',
        state: 'Punjab',
        postalCode: '160071'
      },
      paymentMethod: 'Razorpay',
      orderNotes: 'Automated test suite order'
    };

    const res = await axios.post(`${BASE_URL}/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });

    if (res.data.success && res.data.data) {
      createdOrderId = res.data.data._id;
      createdOrderNumber = res.data.data.orderNumber;
      pass('Order Creation (/api/orders)', `Order created: ${createdOrderNumber}, Total: ₹${res.data.data.totalPrice}`);
    } else {
      fail('Order Creation (/api/orders)', 'Failed to create order');
    }
  } catch (e) {
    fail('Order Creation (/api/orders)', e.response?.data?.message || e.message);
  }

  // 12. Razorpay Order Initiation (Test Mode)
  let rzpOrderId = null;
  try {
    const res = await axios.post(`${BASE_URL}/orders/${createdOrderId}/pay-razorpay`);
    if (res.data.success && res.data.data.orderId && res.data.data.isTestMode === true) {
      rzpOrderId = res.data.data.orderId;
      pass('Razorpay Order Initiation (Safe Test Mode)', `Generated Test Order ID: ${rzpOrderId}, isTestMode: true`);
    } else {
      fail('Razorpay Order Initiation', `Unexpected payload: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    fail('Razorpay Order Initiation', e.response?.data?.message || e.message);
  }

  // 13. Razorpay Payment Verification
  try {
    const testPaymentId = `pay_test_${Date.now()}`;
    const testSignature = `sig_test_verified_${Date.now()}`;
    const res = await axios.post(`${BASE_URL}/orders/${createdOrderId}/verify-payment`, {
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: testPaymentId,
      razorpaySignature: testSignature
    });

    if (res.data.success && res.data.data.paymentStatus === 'Paid' && res.data.data.orderStatus === 'Confirmed') {
      pass('Razorpay Payment Verification (/api/orders/:id/verify-payment)', 'Payment marked as Paid and order Confirmed');
    } else {
      fail('Razorpay Payment Verification', `Order not confirmed or payment not paid: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    fail('Razorpay Payment Verification', e.response?.data?.message || e.message);
  }

  // 14. Order Tracking
  try {
    const res = await axios.get(`${BASE_URL}/orders/${createdOrderNumber}`);
    if (res.data.success && res.data.data.orderNumber === createdOrderNumber) {
      pass('Order Tracking (/api/orders/:orderNumber)', `Retrieved order ${createdOrderNumber} status: ${res.data.data.orderStatus}`);
    } else {
      fail('Order Tracking', 'Order not retrieved');
    }
  } catch (e) {
    fail('Order Tracking', e.message);
  }

  // 15. Customer Custom Order Submission & Tracking
  console.log('\n--- Test Group 8: Custom Orders & Tracking ---');
  try {
    const customPayload = {
      customerName: 'Art Collector',
      email: testCustomerEmail,
      phone: '+91 99150-88706',
      productType: 'Handmade Embroidery',
      designDescription: 'Custom 12-inch botanical wedding bouquet with gold threads',
      budget: '₹2,500 - ₹5,000'
    };
    const res = await axios.post(`${BASE_URL}/custom-orders`, customPayload);
    if (res.data.success && res.data.referenceNumber) {
      customOrderRef = res.data.referenceNumber;
      pass('Custom Order Request Submission', `Reference: ${customOrderRef}`);
    } else {
      fail('Custom Order Request Submission', 'Failed to submit request');
    }
  } catch (e) {
    fail('Custom Order Request Submission', e.message);
  }

  try {
    const res = await axios.get(`${BASE_URL}/custom-orders/track/${customOrderRef}`);
    if (res.data.success && res.data.data.referenceNumber === customOrderRef) {
      pass('Custom Order Tracking (/api/custom-orders/track/:ref)', `Tracked status: ${res.data.data.status}`);
    } else {
      fail('Custom Order Tracking', 'Failed to track custom order');
    }
  } catch (e) {
    fail('Custom Order Tracking', e.message);
  }

  // 16. Coupons Validation
  console.log('\n--- Test Group 9: Coupons & Engagement Routes ---');
  try {
    const res = await axios.post(`${BASE_URL}/coupons/validate`, {
      code: 'WELCOME10',
      cartTotal: 1500,
      orderAmount: 1500
    });
    if (res.data.success && res.data.data.code === 'WELCOME10') {
      pass('Coupon Validation (/api/coupons/validate)', `Validated coupon WELCOME10 discount: ${res.data.data.discountValue}%`);
    } else {
      fail('Coupon Validation', 'Coupon validation failed');
    }
  } catch (e) {
    fail('Coupon Validation', e.response?.data?.message || e.message);
  }

  // 17. Newsletter Subscription
  try {
    const res = await axios.post(`${BASE_URL}/newsletter/subscribe`, {
      email: `subscriber_${Date.now()}@example.com`
    });
    if (res.data.success) {
      pass('Newsletter Subscription (/api/newsletter/subscribe)', res.data.message);
    } else {
      fail('Newsletter Subscription', 'Failed to subscribe');
    }
  } catch (e) {
    fail('Newsletter Subscription', e.message);
  }

  // 18. Contact Form
  try {
    const res = await axios.post(`${BASE_URL}/settings/contact`, {
      name: 'Studio Visitor',
      email: 'visitor@example.com',
      phone: '+91 99150-88706',
      subject: 'Custom Artwork Inquiry',
      message: 'Hello, looking forward to commissioning a personalized portrait.'
    });
    if (res.data.success) {
      pass('Contact Form (/api/settings/contact)', 'Contact submission acknowledged');
    } else {
      fail('Contact Form', 'Failed to submit contact form');
    }
  } catch (e) {
    fail('Contact Form', e.message);
  }

  console.log('\n======================================================');
  console.log(`  TEST RESULTS SUMMARY:`);
  console.log(`  Passed: ${results.passed.length}`);
  console.log(`  Failed: ${results.failed.length}`);
  console.log('======================================================\n');

  return results;
}

runTests().then((res) => {
  if (res.failed.length > 0) {
    process.exit(1);
  }
  process.exit(0);
});
