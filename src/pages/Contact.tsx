import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MessageCircle, Zap,
  User, Building2, Wrench, ChevronDown,
  Facebook, Send, Linkedin, MapPin, Clock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────── LOTUS SVG ───────────────────── */
function LotusIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 4C18 4 12 12 12 18C12 24 18 30 18 30C18 30 24 24 24 18C24 12 18 4 18 4Z" fill="#D4AF37" opacity="0.9"/>
      <path d="M18 30C18 30 10 24 8 18C6 12 10 6 10 6C10 6 14 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
      <path d="M18 30C18 30 26 24 28 18C30 12 26 6 26 6C26 6 22 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
      <path d="M18 30C18 30 6 22 4 16C2 10 8 6 8 6C8 6 12 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
      <path d="M18 30C18 30 30 22 32 16C34 10 28 6 28 6C28 6 24 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
    </svg>
  );
}

/* ───────────────────── CONTACT PAGE ───────────────────── */
export default function Contact() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    iam: '',
    subject: '',
    message: '',
    language: 'en',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Data arrays (defined inside component to use t) ── */
  const faqCategories = [
    {
      icon: User,
      color: 'gold' as const,
      title: t('contact.faq.forJobSeekers'),
      links: [
        { label: t('contact.faq.howCreateResume'), to: '/resume' },
        { label: t('contact.faq.howApplyJob'), to: '/jobs' },
        { label: t('contact.faq.isFree'), to: '/pricing' },
      ],
    },
    {
      icon: Building2,
      color: 'emerald' as const,
      title: t('contact.faq.forEmployers'),
      links: [
        { label: t('contact.faq.howPostJob'), to: '/employers' },
        { label: t('contact.faq.verificationProcess'), to: '/employers' },
        { label: t('contact.faq.howPricingWorks'), to: '/pricing' },
      ],
    },
    {
      icon: Wrench,
      color: 'coral' as const,
      title: t('contact.faq.technicalSupport'),
      links: [
        { label: t('contact.faq.cantLogin'), action: 'contact' },
        { label: t('contact.faq.changeLanguage'), action: 'language' },
        { label: t('contact.faq.reportBug'), action: 'contact' },
      ],
    },
  ];

  const socialButtons = [
    { name: 'Facebook', bg: '#1877F2', icon: Facebook },
    { name: 'Messenger', bg: '#0084FF', icon: MessageCircle },
    { name: 'Telegram', bg: '#26A5E4', icon: Send },
    { name: 'LinkedIn', bg: '#0A66C2', icon: Linkedin },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('errors.required');
    if (!formData.email.trim()) newErrors.email = t('errors.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('errors.invalidEmail');
    if (!formData.subject) newErrors.subject = t('contact.selectSubject');
    if (!formData.message.trim()) newErrors.message = t('errors.required');
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormState('error');
      return;
    }
    setFormState('loading');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', iam: '', subject: '', message: '', language: 'en' });
    setErrors({});
    setFormState('idle');
  };

  useGSAP(() => {
    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .from('.contact-breadcrumb', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' })
      .from('.contact-eyebrow', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .from('.contact-title span', { opacity: 0, y: 40, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.2')
      .from('.contact-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .from('.contact-badge', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)' }, '-=0.2');

    /* Form + Info panel */
    gsap.from('.contact-form-panel', {
      scrollTrigger: { trigger: '.contact-form-section', start: 'top 85%' },
      x: -30, opacity: 0, duration: 0.7, ease: 'expo.out',
    });
    gsap.from('.contact-info-panel', {
      scrollTrigger: { trigger: '.contact-form-section', start: 'top 85%' },
      x: 30, opacity: 0, duration: 0.7, delay: 0.2, ease: 'expo.out',
    });

    /* Form fields stagger */
    gsap.from('.form-field', {
      scrollTrigger: { trigger: '.contact-form-section', start: 'top 80%' },
      y: 15, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.3,
    });

    /* Office locations */
    gsap.from('.office-card', {
      scrollTrigger: { trigger: '.offices-section', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
    });

    /* FAQ cards */
    gsap.from('.faq-card', {
      scrollTrigger: { trigger: '.faq-section', start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
    });

    /* Social buttons */
    gsap.from('.social-btn', {
      scrollTrigger: { trigger: '.social-section', start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
    });
  }, { scope: containerRef });

  const inputClasses = (error?: string) =>
    `w-full bg-white border-2 ${error ? 'border-error' : 'border-sand'} rounded-xl px-5 py-3 text-body text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all duration-200 min-h-[56px]`;

  return (
    <div ref={containerRef}>
      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section
        className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden"
        style={{ background: '#1A1714' }}
      >
        <div className="relative z-10 max-w-[700px] mx-auto px-4 md:px-8 text-center">
          {/* Breadcrumb */}
          <p className="contact-breadcrumb text-caption text-warm-gray mb-4">
            <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
            <span className="mx-2">/</span>
            <span>{t('contact.title')}</span>
          </p>

          {/* Eyebrow */}
          <p className="contact-eyebrow text-caption uppercase tracking-[0.15em] text-gold mb-6">
            {t('contact.title')}
          </p>

          {/* Title */}
          <h1 className="contact-title text-hero-title font-display text-[#FAF8F3] mb-6">
            <span className="inline-block">{t('contact.title')}</span>
          </h1>

          {/* Subtitle */}
          <p className="contact-subtitle text-body-large text-[rgba(250,248,243,0.7)] max-w-[560px] mx-auto mb-6">
            {t('contact.description')}
          </p>

          {/* Response time badge */}
          <div className="contact-badge inline-flex items-center gap-2 px-4 py-2 rounded-lg animate-pulse-glow" style={{ background: 'rgba(5,150,105,0.15)' }}>
            <Zap size={16} className="text-emerald" />
            <span className="text-caption text-emerald font-medium">{t('contact.responseTime')}</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: CONTACT FORM + INFO ═══════════════ */}
      <section className="contact-form-section bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column — Form (60%) */}
            <div className="contact-form-panel lg:w-[60%]">
              <div className="bg-white border border-sand rounded-2xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                {formState === 'success' ? (
                  /* Success State */
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
                      <svg width={40} height={40} viewBox="0 0 24 24" fill="none" className="text-emerald">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check"/>
                      </svg>
                    </div>
                    <h3 className="text-h3 font-display text-charcoal mb-2">{t('contact.successTitle')}</h3>
                    <p className="text-body text-warm-gray mb-6">{t('contact.successDesc')}</p>
                    <button
                      onClick={handleReset}
                      className="text-gold hover:text-gold-dark text-body font-medium transition-colors"
                    >
                      {t('contact.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-h3 font-display text-charcoal mb-1">{t('contact.formTitle')}</h3>
                    <p className="text-body-small text-warm-gray mb-6">
                      {t('contact.formSubtitle')}
                    </p>

                    {formState === 'error' && Object.keys(errors).length > 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-error/5 border border-error/20">
                        <p className="text-body-small text-error font-medium">{t('contact.fixErrors')}</p>
                        <ul className="mt-1 space-y-1">
                          {Object.values(errors).map((err, i) => (
                            <li key={i} className="text-caption text-error">{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">
                          {t('contact.form.name')} <span className="text-coral">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder={t('contact.namePlaceholder')}
                          className={inputClasses(errors.name)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">
                          {t('contact.form.email')} <span className="text-coral">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder={t('contact.emailPlaceholder')}
                          className={inputClasses(errors.email)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">
                          {t('contact.form.phone')} <span className="text-warm-gray">{t('contact.optional')}</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder={t('contact.phonePlaceholder')}
                          className={inputClasses()}
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">{t('contact.iAmA')}</label>
                        <div className="relative">
                          <select
                            value={formData.iam}
                            onChange={(e) => handleChange('iam', e.target.value)}
                            className={inputClasses() + ' appearance-none cursor-pointer'}
                          >
                            <option value="">{t('contact.select')}</option>
                            <option value="seeker">{t('contact.jobSeeker')}</option>
                            <option value="employer">{t('contact.employer')}</option>
                            <option value="other">{t('contact.other')}</option>
                          </select>
                          <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">
                          {t('contact.form.subject')} <span className="text-coral">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            className={inputClasses(errors.subject) + ' appearance-none cursor-pointer'}
                          >
                            <option value="">{t('contact.selectSubject')}</option>
                            <option value="general">{t('contact.generalQuestion')}</option>
                            <option value="technical">{t('contact.technicalSupport')}</option>
                            <option value="billing">{t('contact.billing')}</option>
                            <option value="partnership">{t('contact.partnership')}</option>
                            <option value="issue">{t('contact.reportIssue')}</option>
                          </select>
                          <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-1.5">
                          {t('contact.form.message')} <span className="text-coral">*</span>
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          placeholder={t('contact.messagePlaceholder')}
                          rows={5}
                          className={inputClasses(errors.message) + ' resize-none pt-4'}
                        />
                      </div>

                      <div className="form-field">
                        <label className="block text-body-small font-medium text-charcoal mb-2">
                          {t('contact.preferredLanguage')}
                        </label>
                        <div className="flex items-center gap-3">
                          {[
                            { code: 'km', label: '\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17B6\u179A' },
                            { code: 'zh', label: '\u4E2D\u6587' },
                            { code: 'en', label: 'English' },
                          ].map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => handleChange('language', lang.code)}
                              className={`px-5 py-2.5 rounded-full text-body-small font-medium transition-all duration-200 ${
                                formData.language === lang.code
                                  ? 'bg-gold text-deep-brown shadow-gold'
                                  : 'bg-sand/50 text-warm-gray hover:bg-sand hover:text-charcoal'
                              }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={formState === 'loading'}
                        className="w-full bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.02] hover:shadow-gold-hover transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                      >
                        {formState === 'loading' ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {t('contact.form.sending')}
                          </span>
                        ) : (
                          t('contact.form.submit')
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Right Column — Contact Info (40%) */}
            <div className="contact-info-panel lg:w-[40%] flex flex-col gap-6">
              <div className="bg-deep-brown rounded-2xl p-6 md:p-8">
                {/* Phone */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={20} className="text-gold" />
                    <h4 className="text-h4 text-[#FAF8F3]">{t('contact.info.callUs')}</h4>
                  </div>
                  <a href="tel:+85523XXXXXX" className="text-body text-gold hover:text-gold-light transition-colors block mb-1">
                    +855 23 XXX XXX
                  </a>
                  <p className="text-caption text-[rgba(250,248,243,0.5)]">
                    {t('contact.info.hours')}
                  </p>
                  <p className="text-caption text-emerald mt-1">
                    {t('contact.info.tollFree')}
                  </p>
                </div>

                {/* Email */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={20} className="text-gold" />
                    <h4 className="text-h4 text-[#FAF8F3]">{t('contact.info.emailUs')}</h4>
                  </div>
                  <a href="mailto:support@khmerhr.com" className="text-body text-gold hover:text-gold-light transition-colors block mb-1">
                    support@khmerhr.com
                  </a>
                  <a href="mailto:enterprise@khmerhr.com" className="text-body text-gold hover:text-gold-light transition-colors block mb-1">
                    enterprise@khmerhr.com
                  </a>
                  <p className="text-caption text-[rgba(250,248,243,0.5)]">
                    {t('contact.info.emailNote')}
                  </p>
                </div>

                {/* Messenger */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={20} className="text-gold" />
                    <h4 className="text-h4 text-[#FAF8F3]">{t('contact.info.chatMessenger')}</h4>
                  </div>
                  <a href="#" className="text-body text-gold hover:text-gold-light transition-colors block mb-1">
                    {t('contact.info.facebook')}
                  </a>
                  <div className="flex items-center gap-1 mb-1">
                    <Zap size={14} className="text-emerald" />
                    <span className="text-caption text-emerald">{t('contact.info.fastestResponse')}</span>
                  </div>
                  <p className="text-caption text-[rgba(250,248,243,0.5)]">
                    {t('contact.info.messengerNote')}
                  </p>
                </div>

                {/* Response time badge */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: 'rgba(5,150,105,0.15)' }}>
                  <Zap size={16} className="text-emerald" />
                  <span className="text-caption text-emerald font-medium">{t('contact.responseTime')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: OFFICE LOCATIONS ═══════════════ */}
      <section className="offices-section bg-cream py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <h2 className="text-h2 font-display text-charcoal text-center mb-10">
            {t('contact.offices.title')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phnom Penh */}
            <div className="office-card bg-white border border-sand rounded-2xl p-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold-dark text-caption font-medium rounded-full mb-4">
                <MapPin size={14} /> {t('contact.offices.phnomPenh')}
              </span>
              <p className="text-body text-charcoal mb-4">
                {t('contact.offices.phnomPenhAddress')}
              </p>
              {/* Map placeholder */}
              <div className="w-full h-[250px] rounded-xl bg-sand/50 flex items-center justify-center mb-4 overflow-hidden relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=104.92%2C11.55%2C104.93%2C11.56&layer=mapnik&marker=11.555%2C104.925"
                  className="absolute inset-0 w-full h-full border-0"
                  title={t('contact.offices.phnomPenh')}
                />
              </div>
              <div className="space-y-1">
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhHours')}
                </p>
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhSaturday')}
                </p>
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhSunday')}
                </p>
              </div>
              <p className="text-caption text-warm-gray mt-3">
                {t('contact.offices.phnomPenhNote')}
              </p>
            </div>

            {/* Siem Reap */}
            <div className="office-card bg-white border border-sand rounded-2xl p-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold-dark text-caption font-medium rounded-full mb-4">
                <MapPin size={14} /> {t('contact.offices.siemReap')}
              </span>
              <p className="text-body text-charcoal mb-4">
                {t('contact.offices.siemReapAddress')}
              </p>
              {/* Map placeholder */}
              <div className="w-full h-[250px] rounded-xl bg-sand/50 flex items-center justify-center mb-4 overflow-hidden relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=103.85%2C13.35%2C103.86%2C13.37&layer=mapnik&marker=13.36%2C103.855"
                  className="absolute inset-0 w-full h-full border-0"
                  title={t('contact.offices.siemReap')}
                />
              </div>
              <div className="space-y-1">
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhHours')}
                </p>
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhSaturday')}
                </p>
                <p className="text-body-small text-warm-gray flex items-center gap-2">
                  <Clock size={14} /> {t('contact.offices.phnomPenhSunday')}
                </p>
              </div>
              <p className="text-caption text-gold mt-3">
                {t('contact.offices.siemReapNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: FAQ QUICK LINKS ═══════════════ */}
      <section className="faq-section bg-warm-white py-10 md:py-12">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-8">
            <h3 className="text-h3 font-display text-charcoal mb-2">{t('contact.faq.title')}</h3>
            <p className="text-body-small text-warm-gray">
              {t('contact.faq.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqCategories.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={i}
                  className="faq-card bg-white border border-sand rounded-2xl p-6 hover:shadow-card transition-all duration-300"
                >
                  <IconComp size={32} className={cat.color === 'emerald' ? 'text-emerald' : cat.color === 'coral' ? 'text-coral' : 'text-gold'} />
                  <h4 className="text-h4 font-display text-charcoal mt-3 mb-3">{cat.title}</h4>
                  <ul className="space-y-2">
                    {cat.links.map((link, j) => (
                      <li key={j}>
                        {'to' in link ? (
                          <Link
                            to={link.to}
                            className="text-body-small text-gold hover:underline transition-all"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              if (link.action === 'contact') {
                                document.querySelector('.contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
                              } else if (link.action === 'language') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="text-body-small text-gold hover:underline transition-all text-left"
                          >
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: SOCIAL CONNECT ═══════════════ */}
      <section
        className="social-section py-12 md:py-16"
        style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}
      >
        <div className="mx-auto px-4 md:px-8 max-w-[600px] text-center">
          <div className="flex justify-center mb-4 animate-lotus-pulse">
            <LotusIcon size={56} />
          </div>

          <h2 className="text-h2 font-display text-[#FAF8F3] mb-3">{t('contact.social.title')}</h2>
          <p className="text-body text-[rgba(250,248,243,0.7)] mb-8">
            {t('contact.social.subtitle')}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {socialButtons.map((btn) => {
              const IconComp = btn.icon;
              return (
                <button
                  key={btn.name}
                  className="social-btn h-20 rounded-2xl flex items-center justify-center gap-2 text-white font-medium text-body-small transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
                  style={{ background: btn.bg }}
                >
                  <IconComp size={24} />
                  <span>{btn.name}</span>
                </button>
              );
            })}
          </div>

          <p className="text-caption text-[rgba(250,248,243,0.5)]">
            {t('contact.social.followers')}
          </p>
        </div>
      </section>
    </div>
  );
}
