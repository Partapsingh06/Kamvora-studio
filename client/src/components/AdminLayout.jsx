import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sparkles,
  Users,
  Tag,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#C26D53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#ECE5D8] text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-art text-2xl font-bold text-[#24211E] mb-2">
            Admin Access Restricted
          </h2>
          <p className="text-sm text-[#736A62] mb-6 leading-relaxed">
            You must be logged in with an administrator account to access the Kamvora Studio Management Portal.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login?redirect=/admin"
              className="w-full py-3 bg-[#C26D53] hover:bg-[#AD5940] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              Sign In as Administrator
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 text-xs text-[#736A62] hover:text-[#24211E] font-medium"
            >
              Return to Kamvora Studio Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
    { to: '/admin/custom-requests', label: 'Custom Requests', icon: Sparkles },
    { to: '/admin/customers', label: 'Customer Accounts', icon: Users },
    { to: '/admin/coupons', label: 'Discount Coupons', icon: Tag },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#211E1C] text-[#EDE7DE] shrink-0 hidden md:flex flex-col justify-between border-r border-[#38332E]">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-[#332E2A]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C26D53] text-white flex items-center justify-center font-bold text-sm">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-lg tracking-wider font-semibold text-white">
                  KAMVORA
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#C8A261] uppercase font-semibold">
                  Studio Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C26D53] text-white shadow-xs'
                      : 'text-[#A89F95] hover:bg-[#2C2724] hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#332E2A] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C8A261] hover:text-white hover:bg-[#2C2724] rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-200 hover:bg-[#2C2724] rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Mobile Bar */}
        <div className="md:hidden bg-[#211E1C] text-white p-4 flex items-center justify-between border-b border-[#38332E]">
          <span className="font-editorial text-lg tracking-wider font-semibold">
            KAMVORA ADMIN
          </span>
          <Link to="/" className="text-xs text-[#C8A261] flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Store
          </Link>
        </div>

        {/* Mobile Horizontal Sub-nav */}
        <div className="md:hidden bg-[#2C2724] p-2 flex overflow-x-auto gap-2 border-b border-[#38332E]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  isActive ? 'bg-[#C26D53] text-white' : 'text-[#A89F95]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Page Outlet */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
