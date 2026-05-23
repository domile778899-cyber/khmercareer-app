import { useState } from 'react';
import {
  Smartphone,
  Bell,
  MessageCircle,
  Zap,
  Calculator,
  Calendar,
  FileText,
  BookOpen,
  Globe,
  ChevronDown,
  ChevronUp,
  Star,
  Download,
  Users,
  TrendingUp,
  Check,
  QrCode,
  Apple,
  Play,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  MessageSquare,
  ExternalLink,
  Shield,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/* ─── DATA (static, non-user-facing) ─── */
const appFeatures = [
  { icon: Bell, titleKey: 'appDownload.features.realTimeAlerts' },
  { icon: MessageCircle, titleKey: 'appDownload.features.instantMessaging' },
  { icon: Zap, titleKey: 'appDownload.features.oneClickApply' },
  { icon: Calculator, titleKey: 'appDownload.features.salaryCalculator' },
  { icon: Calendar, titleKey: 'appDownload.features.interviewReminder' },
  { icon: FileText, titleKey: 'appDownload.features.resumeManager' },
  { icon: BookOpen, titleKey: 'appDownload.features.trainingCourses' },
  { icon: Globe, titleKey: 'appDownload.features.multilingual' },
];

const stats = [
  { value: '100K+', labelKey: 'appDownload.stats.downloads' },
  { value: '4.8', labelKey: 'appDownload.stats.rating' },
  { value: '35K+', labelKey: 'appDownload.stats.dailyUsers' },
  { value: '92%', labelKey: 'appDownload.stats.positiveReviews' },
];

const reviews = [
  {
    name: 'Sokha Chhin',
    role: 'Garment Worker',
    avatar: 'SC',
    rating: 5,
    textKey: 'review_sokha',
    date: '2025-01-15',
  },
  {
    name: 'Wei Liang',
    role: 'Factory Supervisor',
    avatar: 'WL',
    rating: 5,
    textKey: 'review_weiliang',
    date: '2025-01-10',
  },
  {
    name: 'Dara Kim',
    avatar: 'DK',
    role: 'Hotel Receptionist',
    rating: 4,
    textKey: 'review_dara',
    date: '2025-01-05',
  },
  {
    name: 'Maria Santos',
    avatar: 'MS',
    role: 'Restaurant Manager',
    rating: 5,
    textKey: 'review_maria',
    date: '2024-12-28',
  },
  {
    name: 'Rithy Pich',
    avatar: 'RP',
    role: 'Construction Worker',
    rating: 5,
    textKey: 'review_rithy',
    date: '2024-12-20',
  },
  {
    name: 'Lin Chen',
    avatar: 'LC',
    role: 'Translator',
    rating: 4,
    textKey: 'review_linchen',
    date: '2024-12-15',
  },
];

const faqKeys = [
  'isFree',
  'iosAndroid',
  'whySlow',
  'howToUpdate',
  'dataUsage',
  'notWorking',
] as const;

const installStepKeys = ['step1', 'step2', 'step3', 'step4', 'step5'] as const;

/* ─── SKELETON CARD ─── */
function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-sand overflow-hidden ${className}`}>
      <div className="animate-pulse">
        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 bg-gray-200 rounded-full w-20" />
            <div className="h-8 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── QR-CODE POPUP ─── */
function QRCodePopup({
  isOpen,
  onClose,
  os,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  os: string;
  title: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-8 max-w-sm w-full mx-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-warm-gray hover:text-charcoal"
            >
              <X size={20} />
            </button>
            <h3 className="text-h4 font-display text-charcoal mb-4">{title}</h3>
            <div className="aspect-square bg-cream rounded-xl flex items-center justify-center mb-4">
              <QrCode size={160} className="text-charcoal" />
            </div>
            <p className="text-body-small text-warm-gray text-center">
              {os === 'ios'
                ? 'App Store'
                : 'Google Play'}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── PHONE MOCKUP ─── */
function PhoneMockup({ t }: { t: (key: string) => string }) {
  return (
    <div className="relative mx-auto w-[280px] h-[560px] bg-charcoal rounded-[40px] p-3 shadow-2xl border-4 border-gray-700">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-charcoal rounded-b-2xl z-10" />
      {/* Screen */}
      <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
        {/* Status bar */}
        <div className="h-8 bg-deep-brown flex items-center justify-between px-5 pt-1">
          <span className="text-[10px] text-white/80 font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
        </div>

        {/* App header */}
        <div className="bg-deep-brown px-4 pt-3 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="font-display text-deep-brown font-bold text-xs">HR</span>
            </div>
            <span className="text-white/80 text-xs font-medium">Khmer Career</span>
          </div>
          <p className="text-white text-sm font-semibold">{t('appDownload.subtitle').split('。')[0].split(' — ')[0]}</p>
        </div>

        {/* Search bar */}
        <div className="mx-4 -mt-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-sand">
          <div className="w-4 h-4 rounded-full bg-gray-200" />
          <span className="text-gray-400 text-xs">{t('hero.searchPlaceholder')}</span>
        </div>

        {/* Stats row */}
        <div className="px-4 py-3 flex justify-between">
          {[
            { n: '2.9K+', l: t('hero.stats.jobs') },
            { n: '850+', l: t('hero.stats.employers') },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-sm font-bold text-charcoal">{s.n}</p>
              <p className="text-[9px] text-warm-gray">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Job cards */}
        <div className="px-4 space-y-2">
          {[
            { c: 'bg-coral/10 border-coral/20', t: t('jobs.jobTitle'), l: 'Phnom Penh' },
            { c: 'bg-blue-50 border-blue-100', t: t('jobs.company'), l: 'Siem Reap' },
          ].map((j, i) => (
            <div key={i} className={`${j.c} border rounded-lg p-2.5`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-white shadow-sm" />
                <div>
                  <p className="text-[10px] font-semibold text-charcoal">{j.t}</p>
                  <p className="text-[8px] text-warm-gray">{j.l}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <span className="text-[7px] bg-white px-1.5 py-0.5 rounded-full">{t('jobs.fullTime')}</span>
                <span className="text-[7px] bg-white px-1.5 py-0.5 rounded-full">$300-500</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-sand flex items-center justify-around">
          {[
            { icon: Globe, label: t('nav.jobs') },
            { icon: Bell, label: t('nav.training') },
            { icon: MessageSquare, label: t('nav.interview') },
            { icon: FileText, label: t('nav.resume') },
            { icon: Smartphone, label: t('nav.app') },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <item.icon size={16} className="text-warm-gray" />
              <span className="text-[7px] text-warm-gray">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN PAGE COMPONENT ══════════ */
/* ═══════════════════════════════════════════ */
export default function AppDownload() {
  const { t } = useTranslation();
  const [os, setOs] = useState<'ios' | 'android'>('android');
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  /* Localised review texts */
  const reviewTexts: Record<string, string> = {
    review_sokha: t('review_sokha'),
    review_weiliang: t('review_weiliang'),
    review_dara: t('review_dara'),
    review_maria: t('review_maria'),
    review_rithy: t('review_rithy'),
    review_linchen: t('review_linchen'),
  };

  return (
    <div className="min-h-[100dvh]">
      {/* ════════ SECTION 1: HERO ════════ */}
      <section className="bg-gradient-to-br from-deep-brown via-[#2D2926] to-deep-brown pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left content */}
            <motion.div
              className="flex-1 max-w-[600px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
                <Smartphone className="w-4 h-4 text-gold" />
                <span className="text-gold text-caption font-semibold">iOS & Android</span>
              </div>

              <h1 className="text-hero-title font-display text-warm-white mb-4">
                {t('appDownload.title')}
              </h1>
              <p className="text-body-large text-warm-white/70 mb-8 leading-relaxed">
                {t('appDownload.subtitle')}
              </p>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gold text-deep-brown px-6 py-4 rounded-2xl font-semibold hover:bg-gold-dark hover:scale-[1.02] transition-all shadow-gold"
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-80 leading-none">{t('appDownload.appStore')}</div>
                    <div className="text-button leading-tight">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-charcoal px-6 py-4 rounded-2xl font-semibold hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-card"
                >
                  <Play className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-60 leading-none">{t('appDownload.googlePlay')}</div>
                    <div className="text-button leading-tight">Google Play</div>
                  </div>
                </a>
              </div>

              {/* QR code button */}
              <button
                onClick={() => setIsQRCodeOpen(true)}
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
              >
                <QrCode className="w-5 h-5" />
                <span className="text-body-small font-medium">{t('appDownload.scanQR')}</span>
              </button>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.labelKey} className="text-center">
                    <p className="text-h3 font-display text-gold">{stat.value}</p>
                    <p className="text-caption text-warm-white/60">{t(stat.labelKey)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <PhoneMockup t={t} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 2: FEATURES ════════ */}
      <section className="bg-warm-white py-12 md:py-20">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('nav.app')}</p>
            <h2 className="text-h2 text-charcoal">{t('appDownload.title')}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="bg-white border border-sand rounded-2xl p-6 text-center hover:border-gold/50 hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <p className="text-body-small font-medium text-charcoal">{t(feature.titleKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 3: INSTALLATION GUIDE ════════ */}
      <section className="bg-cream py-12 md:py-20">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('common.learnMore')}</p>
            <h2 className="text-h2 text-charcoal">
              {os === 'ios' ? t('appDownload.iosGuide') : t('appDownload.androidGuide')}
            </h2>
          </motion.div>

          {/* OS Toggle */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setOs('ios')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                os === 'ios'
                  ? 'bg-charcoal text-white shadow-card'
                  : 'bg-white text-warm-gray border border-sand hover:border-gold/50'
              }`}
            >
              <Apple className="w-5 h-5" />
              iOS
            </button>
            <button
              onClick={() => setOs('android')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                os === 'android'
                  ? 'bg-gold text-deep-brown shadow-gold'
                  : 'bg-white text-warm-gray border border-sand hover:border-gold/50'
              }`}
            >
              <Play className="w-5 h-5" />
              Android
            </button>
          </div>

          {/* Steps */}
          <div className="max-w-2xl mx-auto space-y-4">
            {installStepKeys.map((stepKey, index) => (
              <motion.div
                key={stepKey}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 bg-white rounded-xl p-5 border border-sand"
              >
                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-body text-charcoal">{t(`appDownload.${stepKey}`)}</p>
              </motion.div>
            ))}
          </div>

          {/* Requirements */}
          <motion.div
            className="max-w-2xl mx-auto mt-8 bg-white rounded-xl p-6 border border-sand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-body-small text-warm-gray">
              {os === 'ios' ? t('appDownload.iosRequirements') : t('appDownload.androidRequirements')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 4: REVIEWS ════════ */}
      <section className="bg-warm-white py-12 md:py-20">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('appDownload.userReviews')}</p>
            <h2 className="text-h2 text-charcoal">{t('home.testimonials')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-sand hover:border-gold/50 hover:shadow-card transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-sand'}`}
                    />
                  ))}
                </div>
                {/* Review text */}
                <p className="text-body text-charcoal mb-4">
                  {reviewTexts[review.textKey] || review.textKey}
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-sand">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold text-sm font-bold">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">{review.name}</p>
                    <p className="text-caption text-warm-gray">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 5: FAQ ════════ */}
      <section className="bg-cream py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">FAQ</p>
            <h2 className="text-h2 text-charcoal">{t('footer.faq')}</h2>
          </motion.div>

          <div className="space-y-3">
            {faqKeys.map((faqKey, index) => (
              <FAQItemComponent key={faqKey} faqKey={faqKey} index={index} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 6: CTA ════════ */}
      <section className="bg-gradient-to-br from-deep-brown to-charcoal py-16 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h1 font-display text-warm-white mb-4">{t('appDownload.ctaTitle')}</h2>
            <p className="text-body-large text-warm-white/70 mb-8 max-w-xl mx-auto">{t('appDownload.ctaSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gold text-deep-brown px-8 py-4 rounded-2xl font-semibold hover:bg-gold-dark hover:scale-[1.02] transition-all shadow-gold"
              >
                <Download className="w-5 h-5" />
                {t('appDownload.appStore')}
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-charcoal px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-card"
              >
                <Download className="w-5 h-5" />
                {t('appDownload.googlePlay')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QR Code Popup */}
      <QRCodePopup
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
        os={os}
        title={t('appDownload.scanQR')}
      />
    </div>
  );
}

/* ─── FAQ ITEM COMPONENT ─── */
function FAQItemComponent({
  faqKey,
  index,
  t,
}: {
  faqKey: typeof faqKeys[number];
  index: number;
  t: (key: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white rounded-xl border border-sand overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
      >
        <span className="text-body font-medium text-charcoal pr-4">
          {t(`appDownload.faq.${faqKey}.q`)}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-warm-gray flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5"
          >
            <p className="text-body-small text-warm-gray">
              {t(`appDownload.faq.${faqKey}.a`)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
