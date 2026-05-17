import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../context/AuthContext';

const cities = [
  'Phnom Penh',
  'Siem Reap',
  'Battambang',
  'Sihanoukville',
  'Kampong Cham',
  'Kampot',
  'Kep',
  'Takeo',
  'Other',
];

const industries = [
  'Garment & Textile',
  'Tourism & Hospitality',
  'ICT & Technology',
  'Agriculture',
  'Construction',
  'Finance & Banking',
  'Education',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Other',
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'Khmer' },
  { code: 'zh', label: 'Chinese' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>('jobseeker');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    city: '',
    industry: '',
    companySize: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (role === 'jobseeker') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    } else {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'jobseeker') {
      if (!formData.city) newErrors.city = 'Please select a city';
    } else {
      if (!formData.industry) newErrors.industry = 'Please select an industry';
      if (!formData.companySize) newErrors.companySize = 'Please select company size';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    const userData =
      role === 'jobseeker'
        ? {
            email: formData.email,
            fullName: formData.fullName,
            role: 'jobseeker' as UserRole,
            phone: formData.phone,
            language: formData.language,
            city: formData.city,
            trustScore: 50,
            password: formData.password,
          }
        : {
            email: formData.email,
            fullName: formData.companyName,
            role: 'employer' as UserRole,
            phone: formData.phone,
            companyName: formData.companyName,
            industry: formData.industry,
            companySize: formData.companySize,
            trustScore: 50,
            password: formData.password,
          };

    const success = await register(userData);
    setIsSubmitting(false);

    if (success) {
      navigate('/profile');
    } else {
      setErrors({ general: 'An account with this email already exists' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] } },
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-warm-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Header */}
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
          <motion.h1 variants={itemVariants} className="text-h1 font-bold text-charcoal mb-2">
            Join <span style={{ fontFamily: 'Noto Sans SC, sans-serif' }}>高棉职通车</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-warm-gray text-body">
            ចូលរួមជាមួយយើងខ្ញុំ &middot; 加入我们
          </motion.p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-caption font-bold ${
            step === 1 ? 'bg-gold text-deep-brown' : 'bg-emerald text-white'
          }`}>
            {step === 1 ? '1' : <Check size={16} />}
          </div>
          <div className={`w-16 h-1 rounded-full ${step === 2 ? 'bg-gold' : 'bg-sand'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-caption font-bold ${
            step === 2 ? 'bg-gold text-deep-brown' : 'bg-sand text-warm-gray'
          }`}>
            2
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="bg-white rounded-2xl border border-sand p-6 sm:p-8 shadow-[0_2px_16px_rgba(26,23,20,0.06)]"
        >
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-error text-body-small text-center">
              {errors.general}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-h3 font-semibold text-charcoal mb-6 text-center">
                  I am a...
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setRole('jobseeker'); setStep(2); }}
                    className={`group flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                      role === 'jobseeker'
                        ? 'border-gold bg-gold/5'
                        : 'border-sand hover:border-gold/50 hover:bg-gold/[0.02]'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      role === 'jobseeker' ? 'bg-gold text-deep-brown' : 'bg-sand/50 text-warm-gray group-hover:bg-gold/20 group-hover:text-gold'
                    }`}>
                      <User size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-body font-semibold text-charcoal">Job Seeker</p>
                      <p className="text-caption text-warm-gray mt-1">Find your dream job</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRole('employer'); setStep(2); }}
                    className={`group flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                      role === 'employer'
                        ? 'border-gold bg-gold/5'
                        : 'border-sand hover:border-gold/50 hover:bg-gold/[0.02]'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      role === 'employer' ? 'bg-gold text-deep-brown' : 'bg-sand/50 text-warm-gray group-hover:bg-gold/20 group-hover:text-gold'
                    }`}>
                      <Building2 size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-body font-semibold text-charcoal">Employer</p>
                      <p className="text-caption text-warm-gray mt-1">Post jobs &amp; hire talent</p>
                    </div>
                  </button>
                </div>

                <p className="mt-6 text-center text-body-small text-warm-gray">
                  Already have an account?{' '}
                  <Link to="/login" className="text-gold hover:text-gold-dark font-semibold transition-colors">
                    Login
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <h2 className="text-h3 font-semibold text-charcoal mb-4 text-center">
                  {role === 'jobseeker' ? 'Create Job Seeker Account' : 'Create Employer Account'}
                </h2>

                {/* Role-specific name field */}
                {role === 'jobseeker' ? (
                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.fullName ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-caption text-error">{errors.fullName}</p>}
                  </div>
                ) : (
                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        placeholder="Your Company Ltd."
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.companyName ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.companyName && <p className="mt-1 text-caption text-error">{errors.companyName}</p>}
                  </div>
                )}

                {/* Email & Phone - side by side on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.email ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-caption text-error">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+855 XX XXX XXXX"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.phone ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-caption text-error">{errors.phone}</p>}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="Min 6 characters"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.password ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-caption text-error">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-body-small font-medium text-charcoal mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                          errors.confirmPassword ? 'border-red-400' : 'border-sand focus:border-gold'
                        } bg-white text-charcoal placeholder:text-warm-gray outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]`}
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-caption text-error">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Role-specific fields */}
                {role === 'jobseeker' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-small font-medium text-charcoal mb-1.5">
                        Preferred Language
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                        <select
                          value={formData.language}
                          onChange={(e) => updateField('language', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sand focus:border-gold bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] appearance-none"
                          style={{ minHeight: '48px' }}
                        >
                          {languages.map((l) => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-body-small font-medium text-charcoal mb-1.5">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                        <select
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                            errors.city ? 'border-red-400' : 'border-sand focus:border-gold'
                          } bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] appearance-none`}
                          style={{ minHeight: '48px' }}
                        >
                          <option value="">Select city</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      {errors.city && <p className="mt-1 text-caption text-error">{errors.city}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-small font-medium text-charcoal mb-1.5">
                        Industry
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                        <select
                          value={formData.industry}
                          onChange={(e) => updateField('industry', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                            errors.industry ? 'border-red-400' : 'border-sand focus:border-gold'
                          } bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] appearance-none`}
                          style={{ minHeight: '48px' }}
                        >
                          <option value="">Select industry</option>
                          {industries.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      {errors.industry && <p className="mt-1 text-caption text-error">{errors.industry}</p>}
                    </div>

                    <div>
                      <label className="block text-body-small font-medium text-charcoal mb-1.5">
                        Company Size
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                        <select
                          value={formData.companySize}
                          onChange={(e) => updateField('companySize', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                            errors.companySize ? 'border-red-400' : 'border-sand focus:border-gold'
                          } bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] appearance-none`}
                          style={{ minHeight: '48px' }}
                        >
                          <option value="">Select size</option>
                          {companySizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      {errors.companySize && <p className="mt-1 text-caption text-error">{errors.companySize}</p>}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField('agreeTerms', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded-md border-2 border-sand checked:bg-gold checked:border-gold accent-gold cursor-pointer"
                  />
                  <span className="text-body-small text-charcoal">
                    I agree to the{' '}
                    <Link to="/terms" className="text-gold hover:text-gold-dark font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-gold hover:text-gold-dark font-medium">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-caption text-error -mt-2">{errors.agreeTerms}</p>}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3.5 rounded-xl border-2 border-sand text-charcoal text-button-small font-semibold min-h-[48px] flex items-center justify-center gap-2 hover:bg-sand/30 transition-all duration-200"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[2] bg-gold text-deep-brown py-3.5 rounded-xl text-button-small font-semibold min-h-[48px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:bg-gold-dark hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-deep-brown/30 border-t-deep-brown rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-center text-body-small text-warm-gray pt-1">
                  Already have an account?{' '}
                  <Link to="/login" className="text-gold hover:text-gold-dark font-semibold transition-colors">
                    Login
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
