import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Globe,
  Users,
  ShieldCheck,
  Headphones,
  Briefcase,
  ChevronRight,
  Check,
  Star,
  Building2,
  FileText,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Factory,
  Languages,
  Landmark,
  BarChart3,
  Award,
  ArrowRight,
  X,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Types ─── */
interface PricingTier {
  name: string;
  nameKey: string;
  price: string;
  priceKey: string;
  period: string;
  periodKey: string;
  description: string;
  descriptionKey: string;
  features: { textKey: string; included: boolean }[];
  cta: string;
  ctaKey: string;
  ctaStyle: 'primary' | 'outline' | 'gold';
  featured?: boolean;
}

/* ─── Pricing Data ─── */
const pricingTiers: PricingTier[] = [
  {
    name: 'Starter', nameKey: 'chineseEnterprise.starter',
    price: '$199', priceKey: 'chineseEnterprise.starterPrice',
    period: '/month', periodKey: 'chineseEnterprise.perMonth',
    description: 'For small Chinese businesses entering Cambodia', descriptionKey: 'chineseEnterprise.starterDesc',
    features: [
      { textKey: 'chineseEnterprise.feature5Jobs', included: true },
      { textKey: 'chineseEnterprise.featureBasicProfiles', included: true },
      { textKey: 'chineseEnterprise.featureKhmerSupport', included: true },
      { textKey: 'chineseEnterprise.featureResumeAccess', included: false },
      { textKey: 'chineseEnterprise.featureCompliance', included: false },
      { textKey: 'chineseEnterprise.featureDedicatedAM', included: false },
    ],
    cta: 'Get Started', ctaKey: 'chineseEnterprise.getStarted', ctaStyle: 'outline',
  },
  {
    name: 'Professional', nameKey: 'chineseEnterprise.professional',
    price: '$499', priceKey: 'chineseEnterprise.proPrice',
    period: '/month', periodKey: 'chineseEnterprise.perMonth',
    description: 'For growing Chinese enterprises with regular hiring', descriptionKey: 'chineseEnterprise.proDesc',
    features: [
      { textKey: 'chineseEnterprise.feature20Jobs', included: true },
      { textKey: 'chineseEnterprise.featureFullProfiles', included: true },
      { textKey: 'chineseEnterprise.featureBilingualSupport', included: true },
      { textKey: 'chineseEnterprise.featureResumeAccess', included: true },
      { textKey: 'chineseEnterprise.featureCompliance', included: true },
      { textKey: 'chineseEnterprise.featureDedicatedAM', included: false },
    ],
    cta: 'Start Hiring', ctaKey: 'chineseEnterprise.startHiring', ctaStyle: 'primary', featured: true,
  },
  {
    name: 'Enterprise', nameKey: 'chineseEnterprise.enterprise',
    price: 'Custom', priceKey: 'chineseEnterprise.customPrice',
    period: 'Contact us', periodKey: 'chineseEnterprise.contactUsPeriod',
    description: 'For large Chinese groups and SEZ tenants', descriptionKey: 'chineseEnterprise.enterpriseDesc',
    features: [
      { textKey: 'chineseEnterprise.featureUnlimitedJobs', included: true },
      { textKey: 'chineseEnterprise.featureFullProfiles', included: true },
      { textKey: 'chineseEnterprise.featureTrilingualSupport', included: true },
      { textKey: 'chineseEnterprise.featureFullDatabase', included: true },
      { textKey: 'chineseEnterprise.featureFullCompliance', included: true },
      { textKey: 'chineseEnterprise.featureDedicatedAM', included: true },
    ],
    cta: 'Contact Sales', ctaKey: 'chineseEnterprise.contactSales', ctaStyle: 'gold',
  },
];

/* ─── Section: Hero ─── */
function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Building2, value: '10,000+', label: 'chineseEnterprise.chineseCompanies' },
    { icon: Users, value: '50,000+', label: 'chineseEnterprise.bilingualTalent' },
    { icon: Factory, value: '217', label: 'chineseEnterprise.sezEnterprises' },
    { icon: TrendingUp, value: '$54.2B', label: 'chineseEnterprise.investment2025' },
  ];

  return (
    <section className="relative bg-deep-brown overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-red-500 blur-3xl" />
      </div>

      <div className="relative max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide py-16 md:py-24 lg:py-28">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            {t('chineseEnterprise.chinaCambodiaBridge')}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mb-4 leading-tight">
            {t('chineseEnterprise.heroTitle')}
          </h1>
          <p className="text-warm-gray text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            {t('chineseEnterprise.heroSubtitle')}
          </p>
          <p className="text-gold text-sm sm:text-base max-w-xl mx-auto mb-8">
            {t('chineseEnterprise.heroSubtext')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-gold text-deep-brown px-8 py-4 rounded-xl font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] transition-all duration-200"
            >
              <Briefcase className="w-5 h-5" />
              {t('chineseEnterprise.startRecruiting')}
            </Link>
            <Link
              to="#contact-form"
              className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold px-8 py-4 rounded-xl font-semibold min-h-[56px] hover:bg-gold/10 transition-all duration-200"
            >
              <Headphones className="w-5 h-5" />
              {t('chineseEnterprise.talkToExpert')}
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-charcoal/60 border border-sand/10 rounded-xl px-4 py-5"
              >
                <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-warm-gray text-sm">{t(stat.label)}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section: Services ─── */
function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Languages,
      title: 'chineseEnterprise.bilingualTalentPool',
      desc: 'chineseEnterprise.bilingualTalentPoolDesc',
      stat: '50,000+',
      statLabel: 'chineseEnterprise.chineseKhmerBilingual',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: Users,
      title: 'chineseEnterprise.bulkRecruitment',
      desc: 'chineseEnterprise.bulkRecruitmentDesc',
      stat: '500+',
      statLabel: 'chineseEnterprise.workersPerBatch',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      icon: ShieldCheck,
      title: 'chineseEnterprise.complianceSupport',
      desc: 'chineseEnterprise.complianceSupportDesc',
      stat: '100%',
      statLabel: 'chineseEnterprise.legalCompliance',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: Headphones,
      title: 'chineseEnterprise.chineseCustomerService',
      desc: 'chineseEnterprise.chineseCustomerServiceDesc',
      stat: '24/7',
      statLabel: 'chineseEnterprise.supportHours',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      icon: FileText,
      title: 'chineseEnterprise.documentAssistance',
      desc: 'chineseEnterprise.documentAssistanceDesc',
      stat: '3-5',
      statLabel: 'chineseEnterprise.workingDays',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: BarChart3,
      title: 'chineseEnterprise.marketInsights',
      desc: 'chineseEnterprise.marketInsightsDesc',
      stat: '98%',
      statLabel: 'chineseEnterprise.dataAccuracy',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
  ];

  return (
    <section className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('chineseEnterprise.ourServices')}</p>
            <h2 className="text-h2 text-charcoal mb-3">{t('chineseEnterprise.servicesForChinese')}</h2>
            <p className="text-body text-warm-gray max-w-xl mx-auto">
              {t('chineseEnterprise.servicesSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1}>
              <motion.div
                className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-feature transition-all duration-300 h-full"
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  {t(service.title)}
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed mb-4">
                  {t(service.desc)}
                </p>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className={`text-xl font-bold ${service.color} font-display`}>{service.stat}</span>
                  <span className="text-xs text-warm-gray">{t(service.statLabel)}</span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Success Cases ─── */
function SuccessCasesSection() {
  const { t } = useTranslation();

  const cases = [
    {
      company: 'chineseEnterprise.caseTireCo',
      industry: 'chineseEnterprise.tireManufacturing',
      result: 'chineseEnterprise.caseTireResult',
      detail: 'chineseEnterprise.caseTireDetail',
      icon: Factory,
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      company: 'chineseEnterprise.caseTextileCo',
      industry: 'chineseEnterprise.textileManufacturing',
      result: 'chineseEnterprise.caseTextileResult',
      detail: 'chineseEnterprise.caseTextileDetail',
      icon: Landmark,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      company: 'chineseEnterprise.caseHotelCo',
      industry: 'chineseEnterprise.hospitality',
      result: 'chineseEnterprise.caseHotelResult',
      detail: 'chineseEnterprise.caseHotelDetail',
      icon: Building2,
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
  ];

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('chineseEnterprise.successCases')}</p>
            <h2 className="text-h2 text-charcoal mb-3">{t('chineseEnterprise.trustedByChinese')}</h2>
            <p className="text-body text-warm-gray max-w-xl mx-auto">
              {t('chineseEnterprise.successSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <ScrollReveal key={c.company} delay={i * 0.15}>
              <motion.div
                className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-feature transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <c.icon className={`w-6 h-6 ${c.color}`} />
                </div>
                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">{t(c.industry)}</p>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-3">
                  {t(c.company)}
                </h3>
                <div className={`text-2xl font-bold ${c.color} font-display mb-2`}>
                  {t(c.result)}
                </div>
                <p className="text-sm text-warm-gray leading-relaxed">
                  {t(c.detail)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Pricing ─── */
function PricingSection() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('chineseEnterprise.pricing')}</p>
            <h2 className="text-h2 text-charcoal mb-3">{t('chineseEnterprise.flexiblePricing')}</h2>
            <p className="text-body text-warm-gray max-w-xl mx-auto">
              {t('chineseEnterprise.pricingSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pricingTiers.map((tier, i) => (
            <ScrollReveal key={tier.nameKey} delay={i * 0.1}>
              <motion.div
                className={`relative rounded-[1.25rem] p-8 h-full flex flex-col ${
                  tier.featured
                    ? 'border-2 border-gold shadow-[0_8px_32px_rgba(212,175,55,0.15)] bg-[#FFFBF5]'
                    : 'border border-sand bg-white shadow-card'
                }`}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: easeSmooth }}
              >
                {tier.featured && (
                  <>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-deep-brown text-caption font-semibold px-4 py-1.5 rounded-full">
                      {t('chineseEnterprise.mostPopular')}
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-[1.25rem]" />
                  </>
                )}
                <h3 className="text-h3 text-charcoal mb-2">{t(tier.nameKey)}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-stat-number ${tier.featured ? 'text-gold' : 'text-charcoal'}`}>
                    {t(tier.priceKey)}
                  </span>
                  {tier.period && (
                    <span className="text-body-small text-warm-gray">{t(tier.periodKey)}</span>
                  )}
                </div>
                <p className="text-body-small text-warm-gray mb-6">{t(tier.descriptionKey)}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-2"
                    >
                      {f.included ? (
                        <Check size={18} className="text-emerald shrink-0" />
                      ) : (
                        <X size={18} className="text-warm-gray/40 shrink-0" />
                      )}
                      <span className={`text-body-small ${f.included ? 'text-charcoal' : 'text-warm-gray/50'}`}>
                        {t(f.textKey)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
                <button
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-200 min-h-[56px] flex items-center justify-center mt-auto ${
                    tier.ctaStyle === 'primary'
                      ? 'bg-gold text-deep-brown shadow-gold hover:bg-gold-dark hover:scale-[1.03]'
                      : tier.ctaStyle === 'gold'
                      ? 'bg-charcoal text-gold border-2 border-gold hover:bg-gold hover:text-deep-brown transition-all'
                      : 'border-2 border-gold text-gold hover:bg-gold/10'
                  }`}
                >
                  {t(tier.ctaKey)}
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Contact Form ─── */
function ContactFormSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact-form" className="bg-cream py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <ScrollReveal>
            <div>
              <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('chineseEnterprise.contactUs')}</p>
              <h2 className="text-h2 text-charcoal mb-4">{t('chineseEnterprise.readyToAssist')}</h2>
              <p className="text-body text-warm-gray mb-8">
                {t('chineseEnterprise.contactSubtitle')}
              </p>

              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'chineseEnterprise.hotline', value: '+855 23 999 888', sub: 'chineseEnterprise.hotlineHours' },
                  { icon: MessageCircle, label: 'chineseEnterprise.wechat', value: 'KhmerCareerCN', sub: 'chineseEnterprise.scanQR' },
                  { icon: Mail, label: 'chineseEnterprise.email', value: 'china@khmercareer.com', sub: 'chineseEnterprise.chineseSupport' },
                  { icon: MapPin, label: 'chineseEnterprise.address', value: t('chineseEnterprise.ppOffice'), sub: 'chineseEnterprise.visitUs' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray uppercase tracking-wider">{t(item.label)}</p>
                      <p className="text-body font-semibold text-charcoal">{item.value}</p>
                      <p className="text-caption text-warm-gray">{t(item.sub)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white border border-sand rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-gold" />
                  <span className="font-semibold text-charcoal text-sm">{t('chineseEnterprise.whyChooseUs')}</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'chineseEnterprise.reason1',
                    'chineseEnterprise.reason2',
                    'chineseEnterprise.reason3',
                    'chineseEnterprise.reason4',
                  ].map((reason) => (
                    <li key={reason} className="flex items-center gap-2 text-sm text-warm-gray">
                      <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                      {t(reason)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal delay={0.2}>
            <div className="bg-white border border-sand rounded-2xl p-6 md:p-8 shadow-card">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                    {t('chineseEnterprise.formSuccess')}
                  </h3>
                  <p className="text-warm-gray text-sm">{t('chineseEnterprise.formSuccessDesc')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
                    {t('chineseEnterprise.inquiryForm')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.companyName')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder={t('chineseEnterprise.companyNamePlaceholder')}
                        className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.contactPerson')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder={t('chineseEnterprise.contactPersonPlaceholder')}
                        className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.email')} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@company.com"
                        className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.phone')} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+86 138 0000 0000"
                        className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.employeeCount')}</label>
                    <select
                      value={formData.employees}
                      onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                      className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                    >
                      <option value="">{t('chineseEnterprise.selectCount')}</option>
                      <option value="1-50">1-50 {t('chineseEnterprise.people')}</option>
                      <option value="50-200">50-200 {t('chineseEnterprise.people')}</option>
                      <option value="200-1000">200-1,000 {t('chineseEnterprise.people')}</option>
                      <option value="1000+">1,000+ {t('chineseEnterprise.people')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-warm-gray mb-1.5">{t('chineseEnterprise.message')}</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('chineseEnterprise.messagePlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gold text-deep-brown py-4 rounded-xl font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.02] transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                    {t('chineseEnterprise.submitInquiry')}
                  </button>

                  <p className="text-xs text-warm-gray text-center">
                    {t('chineseEnterprise.formNote')}
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: CTA ─── */
function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-deep-brown py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide text-center">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <Globe className="w-14 h-14 text-gold mx-auto mb-6" />
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-warm-white mb-4">
              {t('chineseEnterprise.buildYourTeam')}
            </h2>
            <p className="text-warm-white/70 text-base sm:text-lg mb-8">
              {t('chineseEnterprise.buildYourTeamDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+85523999888"
                className="inline-flex items-center justify-center gap-2 bg-gold text-deep-brown px-8 py-4 rounded-xl font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                {t('chineseEnterprise.callNow')}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold px-8 py-4 rounded-xl font-semibold min-h-[56px] hover:bg-gold/10 transition-all duration-200"
              >
                {t('chineseEnterprise.onlineConsult')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN PAGE COMPONENT ══════════ */
/* ═══════════════════════════════════════════ */
export default function ChineseEnterprise() {
  return (
    <main className="min-h-screen bg-warm-white">
      <HeroSection />
      <ServicesSection />
      <SuccessCasesSection />
      <PricingSection />
      <ContactFormSection />
      <CtaSection />
    </main>
  );
}
