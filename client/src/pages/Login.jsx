import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Lock, Mail, ShieldCheck, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(trimmedEmail, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'admin') {
        // Admin: go to intended destination or admin dashboard
        const dest = redirect && redirect !== '/' && redirect !== '/login' ? redirect : '/admin';
        navigate(dest);
      } else {
        // Customer: NEVER redirect to /admin routes
        const dest = redirect && !redirect.startsWith('/admin') && redirect !== '/login'
          ? redirect
          : '/account';
        navigate(dest);
      }
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demo testing
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FAF6EE] p-8 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#C26D53] border border-[#E5DAC8] flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
            Studio Portal
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24211E]">
            Sign In to Kamvora
          </h2>
          <p className="text-xs text-[#736A62]">
            Access your orders, custom request quotes, and saved wishlist items.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A443E] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm p-3 pl-10 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443E] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm p-3 pl-10 pr-10 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8276] hover:text-[#24211E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>



        {/* Register Link */}
        <div className="text-center text-xs text-[#736A62]">
          <span>Don’t have an account yet? </span>
          <Link to={`/register?redirect=${redirect}`} className="font-bold text-[#C26D53] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
