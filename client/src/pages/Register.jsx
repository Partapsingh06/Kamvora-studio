import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.phone);
      addToast(`Welcome to Kamvora Studio, ${user.name}!`, 'success');
      const dest = redirect && !redirect.startsWith('/admin') && redirect !== '/register' && redirect !== '/login'
        ? redirect
        : '/account';
      navigate(dest);
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#FAF6EE] p-8 sm:p-10 rounded-3xl border border-[#EDE5D8] shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#C26D53] border border-[#E5DAC8] flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
            Join The Studio
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24211E]">
            Create an Account
          </h2>
          <p className="text-xs text-[#736A62]">
            Enjoy personalized ordering, order status tracking, and exclusive discounts.
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
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Komal Sharma"
                className="w-full text-xs sm:text-sm p-3 pl-10 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443E] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm p-3 pl-10 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A443E] mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 99150-88706"
                className="w-full text-xs sm:text-sm p-3 pl-10 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-[#736A62]">
          <span>Already have an account? </span>
          <Link to={`/login?redirect=${redirect}`} className="font-bold text-[#C26D53] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
