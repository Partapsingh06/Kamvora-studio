import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Shared Components
import Navbar from './components/Navbar.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Public Customer Pages
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CategoryProducts from './pages/CategoryProducts.jsx';
import CustomOrder from './pages/CustomOrder.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import {
  PrivacyPolicy,
  TermsAndConditions,
  ShippingPolicy,
  RefundPolicy
} from './pages/LegalPages.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminCustomRequests from './pages/admin/AdminCustomRequests.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminCoupons from './pages/admin/AdminCoupons.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

// Customer Layout Wrapper (Navbar + Content + Footer)
const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#24211E]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route
                  path="/"
                  element={
                    <CustomerLayout>
                      <Home />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <CustomerLayout>
                      <Shop />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/product/:identifier"
                  element={
                    <CustomerLayout>
                      <ProductDetails />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/category/:slug"
                  element={
                    <CustomerLayout>
                      <CategoryProducts />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/custom-order"
                  element={
                    <CustomerLayout>
                      <CustomOrder />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <CustomerLayout>
                      <Cart />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <CustomerLayout>
                      <Checkout />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <CustomerLayout>
                      <OrderConfirmation />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/order-tracking"
                  element={
                    <CustomerLayout>
                      <OrderTracking />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <CustomerLayout>
                      <Wishlist />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <CustomerLayout>
                      <Login />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <CustomerLayout>
                      <Register />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <CustomerLayout>
                      <Account />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <CustomerLayout>
                      <About />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <CustomerLayout>
                      <Contact />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <CustomerLayout>
                      <FAQ />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <CustomerLayout>
                      <PrivacyPolicy />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <CustomerLayout>
                      <TermsAndConditions />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/shipping-policy"
                  element={
                    <CustomerLayout>
                      <ShippingPolicy />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/refund-policy"
                  element={
                    <CustomerLayout>
                      <RefundPolicy />
                    </CustomerLayout>
                  }
                />

                {/* Protected Admin Management Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="custom-requests" element={<AdminCustomRequests />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* 404 Catch-All */}
                <Route
                  path="*"
                  element={
                    <CustomerLayout>
                      <NotFound />
                    </CustomerLayout>
                  }
                />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
