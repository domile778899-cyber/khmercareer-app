import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      if (rememberMe) {
        localStorage.setItem('khmerhr_remember_email', email);
      } else {
        localStorage.removeItem('khmerhr_remember_email');
      }
      navigate('/');
    } else {
      setErrors({ general: 'Invalid email or password. Try demo account with any email and password "demo123"' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-warm-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="inline-block mb-6">
              <span
                className="text-[28px] text-gold tracking-tight font-bold"
                style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
              >
                高棉职通车
              </span>
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-h1 font-bold text-charcoal mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="text-warm-gray text-body">
            <span className="block">សូមស្វាគមន៍ការត្រឡប់មកវិញ</span>
            <span className="block">欢迎回来</span>
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="bg-white rounded-2xl border border-sand p-6 sm:p-8 shadow-[0_2px_16px_rgba(26,23,20,0.06)]"
        >
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-error text-body-small text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-body-small font-medium text-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => { const n = { ...prev }; delete n.email; return n; }); }}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-sand focus:border-gold'
                  } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                  style={{ minHeight: '56px' }}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-caption text-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-body-small font-medium text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => { const n = { ...prev }; delete n.password; return n; }); }}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 ${
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-sand focus:border-gold'
                  } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                  style={{ minHeight: '56px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-caption text-error">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md border-2 border-sand checked:bg-gold checked:border-gold accent-gold cursor-pointer"
                />
                <span className="text-body-small text-charcoal">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-body-small text-gold hover:text-gold-dark transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gold text-deep-brown py-3.5 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:bg-gold-dark hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-deep-brown/30 border-t-deep-brown rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sand" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-warm-gray">or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setErrors({ general: 'Facebook login coming soon' }); }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-sand hover:border-gold hover:bg-gold/5 transition-all duration-200 text-charcoal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-caption font-medium hidden sm:inline">Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => { setErrors({ general: 'Google login coming soon' }); }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-sand hover:border-gold hover:bg-gold/5 transition-all duration-200 text-charcoal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-caption font-medium hidden sm:inline">Google</span>
              </button>
              <button
                type="button"
                onClick={() => { setErrors({ general: 'Apple login coming soon' }); }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-sand hover:border-gold hover:bg-gold/5 transition-all duration-200 text-charcoal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-caption font-medium hidden sm:inline">Apple</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-body text-warm-gray"
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-gold hover:text-gold-dark font-semibold transition-colors"
          >
            Register
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
