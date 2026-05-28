import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  UserCircle,
  Phone,
  Building2,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Shield,
  FileText,
  Award,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../context/AuthContext';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import ReCaptcha, { useReCaptcha } from '../components/ReCaptcha';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+]{9,15}$/;

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  industry: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  companyName?: string;
  industry?: string;
  agreed?: string;
}

const STORAGE_KEY = 'khmer_register_form';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

/** Sanitized form data — never includes password */
interface SavedFormData {
  role?: UserRole;
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  industry?: string;
}

function loadSavedForm(): SavedFormData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we never restore password fields
      delete parsed.password;
      delete parsed.confirmPassword;
      return parsed as SavedFormData;
    }
  } catch {
    // ignore
  }
  return {};
}

function saveForm(data: SavedFormData) {
  try {
    // Strip any accidentally-passed password fields
    const safe: SavedFormData = { ...data };
    delete (safe as Record<string, unknown>).password;
    delete (safe as Record<string, unknown>).confirmPassword;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

function clearSavedForm() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: showError } = useToast();
  const { t } = useTranslation();

  const saved = loadSavedForm();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(saved.role || 'jobseeker');
  const [fullName, setFullName] = useState(saved.fullName || '');
  const [email, setEmail] = useState(saved.email || '');
  const [phone, setPhone] = useState(saved.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState(saved.companyName || '');
  const [industry, setIndustry] = useState(saved.industry || '');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { verifyWithBackend } = useReCaptcha(RECAPTCHA_SITE_KEY);

  // Persist form data to localStorage (NEVER password fields)
  useEffect(() => {
    saveForm({ fullName, email, phone, companyName, industry, role });
  }, [fullName, email, phone, companyName, industry, role]);

  // Validation functions
  const validateFullName = useCallback(
    (value: string): string | undefined => {
      if (!value || !value.trim()) return t('register.error.nameRequired');
      if (value.trim().length < 2) return t('register.error.nameLength');
      return undefined;
    },
    [t],
  );

  const validateEmail = useCallback((value: string): string | undefined => {
    if (!value || !value.trim()) return t('register.error.emailRequired');
    if (!EMAIL_REGEX.test(value.trim())) return t('register.error.validEmail');
    return undefined;
  }, [t]);

  const validatePhone = useCallback((value: string): string | undefined => {
    if (!value || !value.trim()) return t('register.error.phoneRequired');
    if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) return t('register.error.validPhone');
    return undefined;
  }, [t]);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) return t('register.error.passwordRequired');
    if (value.length < 6) return t('register.error.passwordLength');
    return undefined;
  }, [t]);

  const validateConfirmPassword = useCallback(
    (value: string, pwd: string = password): string | undefined => {
      if (!value) return t('register.error.confirmRequired');
      if (value !== pwd) return t('register.error.passwordsMismatch');
      return undefined;
    },
    [password, t],
  );

  const validateCompanyName = useCallback(
    (value: string, isEmployer: boolean = role === 'employer'): string | undefined => {
      if (isEmployer && (!value || !value.trim())) return t('register.error.companyRequired');
      return undefined;
    },
    [role, t],
  );

  const validateField = useCallback(
    (field: keyof FormErrors, value: string, extraArg?: string) => {
      let error: string | undefined;
      switch (field) {
        case 'fullName':
          error = validateFullName(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'password':
          error = validatePassword(value);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value, extraArg || password);
          break;
        case 'companyName':
          error = validateCompanyName(value);
          break;
        default:
          break;
      }
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
      return error;
    },
    [validateFullName, validateEmail, validatePhone, validatePassword, validateConfirmPassword, validateCompanyName, password],
  );

  const validateStep1 = useCallback(() => {
    const newErrors: FormErrors = {};
    const fnError = validateFullName(fullName);
    const emError = validateEmail(email);
    const phError = validatePhone(phone);
    const cnError = validateCompanyName(companyName);
    if (fnError) newErrors.fullName = fnError;
    if (emError) newErrors.email = emError;
    if (phError) newErrors.phone = phError;
    if (cnError) newErrors.companyName = cnError;
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, phone: true, companyName: true });
    return Object.keys(newErrors).length === 0;
  }, [fullName, email, phone, companyName, validateFullName, validateEmail, validatePhone, validateCompanyName]);

  const validateStep2 = useCallback(() => {
    const newErrors: FormErrors = {};
    const pwError = validatePassword(password);
    const cpError = validateConfirmPassword(confirmPassword);
    if (pwError) newErrors.password = pwError;
    if (cpError) newErrors.confirmPassword = cpError;
    if (!agreed) newErrors.agreed = t('register.error.termsRequired');
    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true, agreed: true });
    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword, agreed, validatePassword, validateConfirmPassword, t]);

  const handleNext = () => {
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    // Verify reCAPTCHA if site key is configured
    if (RECAPTCHA_SITE_KEY) {
      try {
        const result = await verifyWithBackend('register');
        if (!result || !result.success) {
          showError('Security verification failed. Please try again.');
          setIsLoading(false);
          return;
        }
      } catch {
        // Continue in local mode
      }
    }

    try {
      const successReg = await register({
        email,
        fullName,
        role,
        phone,
        companyName,
        industry,
        password,
      });

      if (successReg) {
        clearSavedForm();
        success(t('register.toast.registerSuccess'));
        setTimeout(() => navigate('/'), 800);
      } else {
        showError(t('register.error.registerFailed'));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('register.error.registerFailed');
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Hospitality',
    'Retail',
    'Construction',
    'Agriculture',
    'Other',
  ];

  const benefits = [
    { icon: FileText, title: t('register.aiResumeBuilder'), desc: t('register.aiResumeBuilder') },
    { icon: Award, title: t('register.skillsAssessments'), desc: t('register.skillsAssessments') },
    { icon: Users, title: t('register.careerGuidance'), desc: t('register.careerGuidance') },
    { icon: Shield, title: t('register.verified'), desc: t('register.verified') },
  ];

  const steps = [
    { num: 1, label: t('register.step1') },
    { num: 2, label: t('register.step2') },
  ];

  return (
    <div className="min-h-screen bg-warm-white overflow-x-hidden">
      
      {/* Header */}
      <div className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-container-desktop mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-warm-white mb-3">
              {t('register.createAccount')}
            </h1>
            <p className="text-warm-gray text-base md:text-lg max-w-lg mx-auto">
              {t('register.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-container-desktop mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 xl:gap-16">
          {/* Registration form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-warm-white border border-sand rounded-2xl p-6 md:p-10 shadow-card">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                        step >= s.num
                          ? 'bg-gold text-deep-brown'
                          : 'bg-sand text-warm-gray',
                      )}
                    >
                      {s.num}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium hidden sm:block',
                        step >= s.num ? 'text-charcoal' : 'text-warm-gray',
                      )}
                    >
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div
                        className={cn(
                          'flex-1 h-0.5 rounded',
                          step > s.num ? 'bg-gold' : 'bg-sand',
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-emerald" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal">
                    {step === 1 ? t('register.personalInfo') : t('register.createPassword')}
                  </h2>
                  <p className="text-warm-gray text-sm">
                    {step === 1 ? t('register.tellAboutYourself') : t('register.secureAccount')}
                  </p>
                </div>
              </div>

              {/* Role selection - always visible */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">{t('register.iAmA')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                      role === 'jobseeker'
                        ? 'border-gold bg-gold/5'
                        : 'border-sand hover:border-gold/30',
                    )}
                  >
                    <UserCircle
                      className={cn(
                        'w-6 h-6',
                        role === 'jobseeker' ? 'text-gold' : 'text-warm-gray',
                      )}
                    />
                    <div>
                      <p className="font-medium text-charcoal text-sm">{t('register.jobSeeker')}</p>
                      <p className="text-xs text-warm-gray">{t('register.jobSeekerDesc')}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                      role === 'employer'
                        ? 'border-gold bg-gold/5'
                        : 'border-sand hover:border-gold/30',
                    )}
                  >
                    <Building2
                      className={cn(
                        'w-6 h-6',
                        role === 'employer' ? 'text-gold' : 'text-warm-gray',
                      )}
                    />
                    <div>
                      <p className="font-medium text-charcoal text-sm">{t('register.employer')}</p>
                      <p className="text-xs text-warm-gray">{t('register.employerDesc')}</p>
                    </div>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <FormField
                      label={t('register.fullName')}
                      name="fullName"
                      type="text"
                      value={fullName}
                      onChange={setFullName}
                      validate={validateFullName}
                      required
                      placeholder={t('register.fullName')}
                      error={touched.fullName ? errors.fullName : undefined}
                      touched={touched.fullName}
                      icon={<UserCircle className="w-[18px] h-[18px]" />}
                      autoComplete="name"
                    />

                    <FormField
                      label={t('register.email')}
                      name="email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      validate={validateEmail}
                      required
                      placeholder={t('register.email')}
                      error={touched.email ? errors.email : undefined}
                      touched={touched.email}
                      icon={<Mail className="w-[18px] h-[18px]" />}
                      autoComplete="email"
                    />

                    <FormField
                      label={t('register.phone')}
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      validate={validatePhone}
                      required
                      placeholder="+855 12 345 678"
                      error={touched.phone ? errors.phone : undefined}
                      touched={touched.phone}
                      icon={<Phone className="w-[18px] h-[18px]" />}
                      autoComplete="tel"
                    />

                    {role === 'employer' && (
                      <FormField
                        label={t('register.companyName')}
                        name="companyName"
                        type="text"
                        value={companyName}
                        onChange={setCompanyName}
                        validate={(v) => validateCompanyName(v)}
                        required
                        placeholder={t('register.companyName')}
                        error={touched.companyName ? errors.companyName : undefined}
                        touched={touched.companyName}
                        icon={<Building2 className="w-[18px] h-[18px]" />}
                      />
                    )}

                    {role === 'employer' && (
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">
                          {t('register.industry')}
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full px-4 py-3 border border-sand rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all bg-cream/50"
                        >
                          <option value="">{t('register.selectIndustry')}</option>
                          {industries.map((ind) => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {t('register.continue')}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Password field with show/hide toggle */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        {t('register.password')}
                        <span className="text-coral ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-warm-gray" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (touched.password) {
                              validateField('password', e.target.value);
                              if (confirmPassword) {
                                validateField('confirmPassword', confirmPassword, e.target.value);
                              }
                            }
                          }}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, password: true }));
                            validateField('password', password);
                            if (confirmPassword) {
                              validateField('confirmPassword', confirmPassword);
                            }
                          }}
                          placeholder={t('register.minChars')}
                          autoComplete="new-password"
                          className={`
                            w-full pl-11 pr-11 py-3 rounded-lg text-charcoal
                            placeholder:text-warm-gray/60 transition-all duration-200 outline-none
                            border bg-cream/50
                            ${
                              touched.password && errors.password
                                ? 'border-coral focus:border-coral focus:ring-coral/20'
                                : touched.password && password && !errors.password
                                ? 'border-emerald focus:border-emerald focus:ring-emerald/20'
                                : 'border-sand focus:border-gold focus:ring-gold/30'
                            }
                            focus:ring-2
                          `}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-[18px] h-[18px]" />
                          ) : (
                            <Eye className="w-[18px] h-[18px]" />
                          )}
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-coral text-xs mt-1.5 flex items-center gap-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                      {touched.password && password && !errors.password && password.length >= 6 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-emerald text-xs mt-1.5 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> {t('register.passwordLooksGood')}
                        </motion.p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        {t('register.confirmPassword')}
                        <span className="text-coral ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-warm-gray" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (touched.confirmPassword) {
                              validateField('confirmPassword', e.target.value);
                            }
                          }}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, confirmPassword: true }));
                            validateField('confirmPassword', confirmPassword);
                          }}
                          placeholder={t('register.repeatPassword')}
                          autoComplete="new-password"
                          className={`
                            w-full pl-11 pr-10 py-3 rounded-lg text-charcoal
                            placeholder:text-warm-gray/60 transition-all duration-200 outline-none
                            border bg-cream/50
                            ${
                              touched.confirmPassword && errors.confirmPassword
                                ? 'border-coral focus:border-coral focus:ring-coral/20'
                                : touched.confirmPassword && confirmPassword && password === confirmPassword && !errors.confirmPassword
                                ? 'border-emerald focus:border-emerald focus:ring-emerald/20'
                                : 'border-sand focus:border-gold focus:ring-gold/30'
                            }
                            focus:ring-2
                          `}
                        />
                        {touched.confirmPassword && confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-coral text-xs mt-1.5 flex items-center gap-1"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                      {password && confirmPassword && password === confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-emerald text-xs mt-1.5 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> {t('register.passwordsMatch')}
                        </motion.p>
                      )}
                    </div>

                    {/* Terms agreement */}
                    <div className="flex items-start gap-2 py-2">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => {
                          setAgreed(e.target.checked);
                          if (errors.agreed) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.agreed;
                              return next;
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-sand text-gold focus:ring-gold/30 mt-0.5"
                      />
                      <label className="text-sm text-charcoal leading-relaxed">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          className="text-gold hover:text-gold-dark underline"
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="text-gold hover:text-gold-dark underline"
                        >
                          Privacy Policy
                        </Link>
                        . {t('register.consent')}
                      </label>
                    </div>
                    {errors.agreed && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-coral text-xs flex items-center gap-1 -mt-3"
                      >
                        {errors.agreed}
                      </motion.p>
                    )}

                    {/* reCAPTCHA Protection */}
                    {RECAPTCHA_SITE_KEY && (
                      <div className="py-2">
                        <ReCaptcha
                          siteKey={RECAPTCHA_SITE_KEY}
                          action="register"
                          onVerify={(token) => setCaptchaToken(token)}
                        />
                        <p className="text-warm-gray/50 text-[10px] mt-1">Protected by Google reCAPTCHA</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={handleBack}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1 py-3.5 border-2 border-sand text-charcoal hover:border-charcoal font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-[2] py-3.5 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-deep-brown/30 border-t-deep-brown rounded-full animate-spin" />
                        ) : (
                          <>
                            {t('register.createAccountBtn')}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="text-center text-sm text-warm-gray mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-gold hover:text-gold-dark font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-cream rounded-2xl p-6 border border-sand">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                {t('register.whyJoinUs')}
              </h3>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex gap-3 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-5 h-5 text-emerald" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-charcoal text-sm break-words">{b.title}</p>
                      <p className="text-xs text-warm-gray break-words">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-charcoal to-deep-brown rounded-2xl p-6 text-center"
            >
              <div className="text-4xl font-display font-bold text-gold mb-1">{t('common.free')}</div>
              <p className="text-warm-white text-sm mb-4">{t('register.freeForever')}</p>
              <ul className="text-left space-y-2 mb-6">
                {[
                  'Unlimited job applications',
                  'AI resume builder',
                  'Interview coaching',
                  'Skills assessments',
                  'Career guidance',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-warm-gray">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-warm-white/10">
                <p className="text-xs text-warm-gray">
                  Need employer features?{' '}
                  <Link
                    to="/pricing"
                    className="text-gold hover:text-gold-light underline"
                  >
                    View pricing
                  </Link>
                </p>
              </div>
            </motion.div>

            <div className="bg-sand/30 rounded-xl p-4">
              <p className="text-xs text-warm-gray text-center">
                {t('register.dataProcessing')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
