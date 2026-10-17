import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
  ShieldCheck,
  LogOut,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import api from '../utils/api.js';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Fetch categories for mega-dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch {
        // Fallback
      }
    };
    fetchCats();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoriesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header shadow-sm border-b border-[#ECE5D8]'
          : 'bg-[#FDFBF7] border-b border-[#F0EAE1]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#4A443E] hover:text-[#C26D53] focus:outline-none"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 ml-1 text-[#4A443E] hover:text-[#C26D53]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Creative Artistic Emblem */}
              <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#E8DCCB] flex items-center justify-center shadow-xs group-hover:border-[#C8A261] transition-all">
                <svg
                  className="w-5 h-5 text-[#C26D53] group-hover:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="12" cy="12" r="9" stroke="#C8A261" />
                  <path d="M12 3v6m0 6v6M3 12h6m6 0h6" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2.5" fill="#C26D53" stroke="none" />
                </svg>
              </div>

              <div className="flex flex-col text-left">
                <span className="font-editorial text-xl sm:text-2xl tracking-[0.14em] text-[#24211E] font-medium leading-tight uppercase group-hover:text-[#C26D53] transition-colors">
                  Kamvora
                </span>
                <span className="text-[10px] tracking-[0.24em] uppercase text-[#8C8276] font-medium">
                  Studio & Craft
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm tracking-wide font-medium transition-colors ${
                  isActive ? 'text-[#C26D53]' : 'text-[#3E3832] hover:text-[#C26D53]'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-sm tracking-wide font-medium transition-colors ${
                  isActive ? 'text-[#C26D53]' : 'text-[#3E3832] hover:text-[#C26D53]'
                }`
              }
            >
              Shop All
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setCategoriesDropdown(!categoriesDropdown)}
                className="flex items-center gap-1 text-sm tracking-wide font-medium text-[#3E3832] hover:text-[#C26D53] transition-colors focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdown ? 'rotate-180 text-[#C26D53]' : ''
                  }`}
                />
              </button>

              {categoriesDropdown && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-[#FDFBF7] rounded-2xl shadow-xl border border-[#ECE5D8] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#F0EAE1]">
                    <span className="text-xs font-semibold tracking-wider text-[#A89F95] uppercase">
                      Art & Craft Collections
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setCategoriesDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3E3832] hover:bg-[#F5EFE6] hover:text-[#C26D53] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#EFE9DF]">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#F0EAE1] bg-[#FAF6EE] rounded-b-2xl">
                    <Link
                      to="/shop"
                      onClick={() => setCategoriesDropdown(false)}
                      className="block text-center text-xs font-semibold text-[#C26D53] hover:underline"
                    >
                      View All Products &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/custom-order"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm tracking-wide font-medium transition-colors px-3 py-1.5 rounded-full border ${
                  isActive
                    ? 'bg-[#C26D53] text-white border-[#C26D53]'
                    : 'bg-[#F7F2EA] text-[#C26D53] border-[#E8DCCB] hover:bg-[#C26D53] hover:text-white hover:border-[#C26D53]'
                }`
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>Custom Order</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm tracking-wide font-medium transition-colors ${
                  isActive ? 'text-[#C26D53]' : 'text-[#3E3832] hover:text-[#C26D53]'
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm tracking-wide font-medium transition-colors ${
                  isActive ? 'text-[#C26D53]' : 'text-[#3E3832] hover:text-[#C26D53]'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex p-2.5 text-[#4A443E] hover:text-[#C26D53] hover:bg-[#F5EFE6] rounded-full transition-all"
              aria-label="Search store"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2.5 text-[#4A443E] hover:text-[#C26D53] hover:bg-[#F5EFE6] rounded-full transition-all relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C26D53] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              className="p-2.5 text-[#4A443E] hover:text-[#C26D53] hover:bg-[#F5EFE6] rounded-full transition-all relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C26D53] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-full hover:bg-[#F5EFE6] transition-all border border-[#E8DCCB]"
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C26D53] text-white flex items-center justify-center text-xs font-semibold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-[#3E3832] max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C8276]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-[#3E3832] hover:text-[#C26D53] hover:bg-[#F5EFE6] rounded-full transition-all border border-[#E8DCCB]"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdown && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#FDFBF7] rounded-2xl shadow-xl border border-[#ECE5D8] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-[#F0EAE1]">
                    <p className="text-xs text-[#8C8276]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#24211E] truncate">{user.name}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8D8B8] text-[#875B1F]">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#875B1F] font-semibold hover:bg-[#F5EFE6]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C8A261]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#3E3832] hover:bg-[#F5EFE6]"
                    >
                      <UserIcon className="w-4 h-4 text-[#8C8276]" />
                      <span>My Account & Orders</span>
                    </Link>

                    <Link
                      to="/order-tracking"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#3E3832] hover:bg-[#F5EFE6]"
                    >
                      <Package className="w-4 h-4 text-[#8C8276]" />
                      <span>Track Live Order</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#F0EAE1] pt-1 mt-1">
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-[#B33E30] hover:bg-[#FDF0EE]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-[#F0EAE1] animate-in fade-in slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#8C8276]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handmade embroidery, ocean resin art, custom portraits..."
                autoFocus
                className="w-full bg-[#FAF5ED] border border-[#E8DCCB] rounded-full py-3 pl-12 pr-28 text-sm focus:outline-none focus:border-[#C26D53] focus:ring-1 focus:ring-[#C26D53] text-[#24211E]"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 bg-[#C26D53] text-white text-xs font-semibold rounded-full hover:bg-[#AD5940] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#FDFBF7] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold tracking-wider text-[#24211E]">
                  KAMVORA STUDIO
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#8C8276] hover:text-[#24211E]"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="p-5 flex-1 space-y-4">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#24211E] hover:text-[#C26D53]"
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#24211E] hover:text-[#C26D53]"
              >
                Shop All Collections
              </NavLink>

              <div className="pt-2 pb-2">
                <p className="text-xs uppercase font-semibold text-[#8C8276] tracking-wider mb-2">
                  Featured Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-[#3E3832] bg-[#FAF5ED] p-2.5 rounded-xl border border-[#ECE5D8] hover:text-[#C26D53] truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink
                to="/custom-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#C26D53] text-white text-sm font-semibold shadow-sm hover:bg-[#AD5940]"
              >
                <Sparkles className="w-4 h-4 text-[#C8A261]" />
                <span>Request Custom Art Order</span>
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#24211E] hover:text-[#C26D53]"
              >
                About Kamvora Studio
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#24211E] hover:text-[#C26D53]"
              >
                Contact & Studio Visit
              </NavLink>

              <NavLink
                to="/order-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#24211E] hover:text-[#C26D53]"
              >
                Track Live Order
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-bold text-[#875B1F] bg-[#FAF3E6] p-2.5 rounded-xl border border-[#E8D8B8]"
                >
                  Admin Management Portal
                </NavLink>
              )}
            </div>

            {/* Footer with Contact Link */}
            <div className="p-5 border-t border-[#F0EAE1] bg-[#FAF6EE] text-xs space-y-2 text-[#6B635B]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C26D53]" />
                <a href="tel:+919915088706" className="font-semibold text-[#24211E] hover:underline">
                  +91 99150-88706
                </a>
              </div>
              <p className="text-[11px] leading-relaxed">
                Shop No 399, Janta Market, Mohali, Punjab
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
