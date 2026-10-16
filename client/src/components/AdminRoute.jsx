import React from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Protected Admin Route
 * - If session is loading, displays a branded verification spinner.
 * - If user is not authenticated (visitor), redirects to /login with redirect query param.
 * - If user is authenticated but not an admin (customer), shows a 403 Forbidden Unauthorized view.
 * - If user is an authorized administrator, renders the admin layout and child pages.
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Session verification in progress
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-[#24211E]">
        <div className="w-10 h-10 border-3 border-[#C26D53] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-[#8C8276] font-semibold">
          Verifying Administrator Permissions...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated visitor -> Redirect to login page with return parameter
  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // 3. Authenticated customer, but lacks administrator role -> 403 Forbidden
  if (!isAdmin) {
    const handleSwitchAccount = () => {
      logout();
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    };

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 text-[#24211E]">
        <div className="max-w-md w-full bg-[#FAF6EE] p-8 sm:p-10 rounded-3xl border border-[#EDE5D8] text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-5 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-rose-700 bg-rose-100/70 border border-rose-200 px-3 py-1 rounded-full mb-3">
            403 &bull; Access Forbidden
          </span>

          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24211E] mb-2">
            Administrator Access Required
          </h2>

          <p className="text-xs sm:text-sm text-[#736A62] mb-6 leading-relaxed">
            You are signed in as <strong className="text-[#24211E] font-semibold">{user.email}</strong>, which is a customer account. The Kamvora Studio Admin Panel is strictly reserved for authorized administrators.
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              to="/"
              className="w-full py-3 bg-[#24211E] hover:bg-[#3E3832] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>

            <Link
              to="/account"
              className="w-full py-2.5 bg-white hover:bg-[#F2ECE1] text-[#3E3832] border border-[#DED4C5] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#8C8276]" />
              <span>Go to My Customer Account</span>
            </Link>

            <button
              onClick={handleSwitchAccount}
              className="w-full py-2.5 text-xs text-rose-700 hover:text-rose-900 font-medium hover:underline flex items-center justify-center gap-1.5 pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign In with Administrator Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized administrator -> Allow access
  return children;
};

export default AdminRoute;
