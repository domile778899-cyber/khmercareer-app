import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  UserCircle,
  Sparkles,
  Shield,
  Globe,
  Zap,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useTranslation } from 'react-i18next';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const STORAGE_KEY = 'khmer_login_form';

function loadSavedEmail(): string | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && typeof parsed.email === 'string') {
        return parsed.email;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

function saveEmail(email: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
  } catch {
    // ignore
  }
}

function clearSavedForm() {
  localStorage.removeItem(STORAGE_KEY);
}

function sanitizeOldStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.password) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {
    // ignore
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const { t } = useTranslation();

  sanitizeOldStorage();

  const savedEmail = loadSavedEmail();
  const [email, setEmail] = useState(savedEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Persist email to localStorage (never persist password)
  useEffect(() => {
    if (rememberMe && email) {
      saveEmail(email);
    } else if (!rememberMe) {
      clearSavedForm();
    }
  }, [email, rememberMe]);

  const validateEmail = useCallback((value: string): string | undefined => {
    if (!value || !value.trim()) return t('login.error.emailRequired');
    if (!EMAIL_REGEX.test(value.trim())) return t('login.error.validEmail');
    return undefined;
  }, [t]);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) return t('login.error.passwordRequired');
    if (value.length < 6) return t('login.error.passwordLength');
    return undefined;
  }, [t]);

  const validateField = useCallback(
    (field: 'email' | 'password', value: string) => {
      const validator = field === 'email' ? validateEmail : validatePassword;
      const error = validator(value);
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
    [validateEmail, validatePassword],
  );

  const validateAll = useCallback(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors: FormErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  }, [email, password, validateEmail, validatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const successLogin = await login(email.trim(), password);
      if (successLogin) {
        clearSavedForm();
        success(t('login.toast.welcomeBack'));
        setTimeout(() => navigate('/'), 800);
      } else {
        showError(t('login.error.invalidCredentials'));
        setErrors({
          email: t('login.error.invalidCredentials'),
          password: t('login.error.invalidCredentials'),
        });
      }
    } catch (err) {
      showError(t('login.error.invalidCredentials'));
      setErrors({
        email: t('login.error.invalidCredentials'),
        password: t('login.error.invalidCredentials'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@khmerjob.com');
    setPassword('demo123');
    setErrors({});
    setIsLoading(true);

    try {
      const successLogin = await login('demo@khmerjob.com', 'demo123');
      if (successLogin) {
        clearSavedForm();
        success(t('login.toast.demoLogin'));
        setTimeout(() => navigate('/'), 800);
      } else {
        showError('Demo login failed. Please try registering first.');
      }
    } catch {
      showError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Briefcase, text: t('login.accessJobs') },
    { icon: GraduationCap, text: t('login.freeCourses') },
    { icon: Heart, text: t('login.saveFavorites') },
    { icon: Star, text: t('login.aiResume') },
  ];

  const stats = [
    { icon: UserCircle, value: '50K+', label: t('login.activeUsers') },
    { icon: Globe, value: '200+', label: t('login.partnerCompanies') },
    { icon: Zap, value: '98%', label: t('login.successRate') },
    { icon: Shield, value: '100%', label: t('login.secure') },
  ];

  return (
    <div className="min-h-screen bg-warm-white overflow-x-hidden">
      
      {/* Hero banner */}
      <div className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-container-desktop mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-warm-white mb-3">
              {t('login.welcomeBack')}
            </h1>
            <p className="text-warm-gray text-base md:text-lg max-w-md mx-auto">
              {t('login.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-container-desktop mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 xl:gap-16">
          {/* Login form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-warm-white border border-sand rounded-2xl p-6 md:p-10 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal">{t('login.signIn')}</h2>
                  <p className="text-warm-gray text-sm">{t('login.enterCredentials')}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <FormField
                  label={t('login.emailAddress')}
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  validate={validateEmail}
                  required
                  placeholder={t('login.placeholder.email')}
                  error={touched.email ? errors.email : undefined}
                  touched={touched.email}
                  icon={<Mail className="w-[18px] h-[18px]" />}
                  autoComplete="email"
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {t('login.password')}
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
                        }
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, password: true }));
                        validateField('password', password);
                      }}
                      placeholder={t('login.placeholder.password')}
                      autoComplete="current-password"
                      aria-invalid={touched.password && !!errors.password ? 'true' : 'false'}
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
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-sand text-gold focus:ring-gold/30"
                    />
                    <span className="text-sm text-charcoal">{t('login.rememberMe')}</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gold hover:text-gold-dark transition-colors"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-deep-brown/30 border-t-deep-brown rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('login.signIn')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sand" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-warm-white text-warm-gray">{t('login.or')}</span>
                  </div>
                </div>

                {/* Google Sign-In */}
                <GoogleSignInButton
                  onSuccess={(user) => {
                    success(t('login.toast.googleLogin'));
                    localStorage.setItem(
                      'khmer_auth_user',
                      JSON.stringify({
                        id: user.id,
                        email: user.email,
                        fullName: user.name,
                        role: 'jobseeker',
                        avatar: user.imageUrl,
                      })
                    );
                    setTimeout(() => navigate('/'), 800);
                  }}
                  onError={(err) => {
                    showError(err || 'Google login failed');
                  }}
                />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sand" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-warm-white text-warm-gray">{t('login.orTryDemo')}</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 border-2 border-emerald text-emerald hover:bg-emerald/5 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('login.tryDemoAccount')}
                </motion.button>
              </form>

              <p className="text-center text-sm text-warm-gray mt-6">
                {t('login.noAccount')}{' '}
                <Link
                  to="/register"
                  className="text-gold hover:text-gold-dark font-medium transition-colors"
                >
                  {t('login.createAccount')}
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Features */}
            <div className="bg-cream rounded-2xl p-6 border border-sand">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                {t('login.memberBenefits')}
              </h3>
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-emerald" />
                    </div>
                    <span className="text-sm text-charcoal flex-1 min-w-0 break-words">{feature.text}</span>
                    <CheckCircle className="w-4 h-4 text-emerald ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-charcoal rounded-xl p-4 text-center"
                >
                  <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                  <div className="text-xl font-bold text-warm-white">{stat.value}</div>
                  <div className="text-xs text-warm-gray mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-gold/10 to-emerald/10 rounded-2xl p-6 border border-gold/20"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-charcoal italic mb-4">
                &ldquo;{t('login.testimonial.quote')}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-gold-dark">SK</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{t('login.testimonial.name')}</p>
                  <p className="text-xs text-warm-gray">{t('login.testimonial.role')}</p>
                </div>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="text-center space-y-2">
              <p className="text-xs text-warm-gray uppercase tracking-wide">
                {t('login.trustedBy')}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {['ACB', 'ABA', 'Wing', 'Pi Pay'].map((name) => (
                  <div
                    key={name}
                    className="px-3 py-1.5 bg-sand/50 rounded-md text-xs text-warm-gray font-medium"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
