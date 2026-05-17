import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Factory,
  Languages,
  TrendingUp,
  Upload,
  Search,
  BadgeCheck,
  Check,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

/* ─── Animation helpers ─── */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];
const easeBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSmooth } },
};

/* ─── Mock data ─── */
const barData = [
  { month: 'Jan', apps: 32 },
  { month: 'Feb', apps: 45 },
  { month: 'Mar', apps: 38 },
  { month: 'Apr', apps: 56 },
  { month: 'May', apps: 48 },
  { month: 'Jun', apps: 72 },
];

const pieData = [
  { name: 'Facebook', value: 45, color: '#D4AF37' },
  { name: 'Direct', value: 30, color: '#059669' },
  { name: 'Search', value: 25, color: '#E85D3E' },
];

const lineData = [
  { day: 'Mon', views: 120 },
  { day: 'Tue', views: 180 },
  { day: 'Wed', views: 150 },
  { day: 'Thu', views: 220 },
  { day: 'Fri', views: 280 },
  { day: 'Sat', views: 190 },
  { day: 'Sun', views: 140 },
];

const testimonials = [
  {
    quote:
      "KhmerHR reduced our time-to-hire by 60%. We used to post jobs at the factory gate. Now we get qualified applicants directly to our inbox.",
    name: 'Sopheap Chhun',
    role: 'HR Director, CamKo Textile — 500+ employees',
    tag: 'Garment Industry',
    initial: 'SC',
  },
  {
    quote:
      "As a Chinese-funded enterprise, finding bilingual talent was our biggest challenge. KhmerHR's language filtering solved this completely.",
    name: 'Li Wei',
    role: 'GM, SinoLink Group — Chinese-Cambodian JV',
    tag: 'Manufacturing',
    initial: 'LW',
  },
  {
    quote:
      "The verification process gave us credibility. Job seekers trust our postings now. Our application rate tripled after getting verified.",
    name: 'Ratana Chea',
    role: 'Owner, Angkor Dining Co. — 3 locations',
    tag: 'Hospitality',
    initial: 'RC',
  },
];

/* ─── Floating Card (isolated perpetual animation) ─── */
const FloatingCard = React.memo(function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: easeBounce }}
      style={{ willChange: 'transform' }}
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4 + delay, ease: 'easeInOut', repeat: Infinity }}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

/* ─── Lotus Icon SVG ─── */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32 8C28 16 20 22 12 24C16 32 24 36 32 36C40 36 48 32 52 24C44 22 36 16 32 8Z" />
      <path d="M32 36C24 36 16 40 12 48C20 50 28 54 32 56C36 54 44 50 52 48C48 40 40 36 32 36Z" opacity="0.6" />
      <path d="M32 36V56" opacity="0.3" />
    </svg>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
  statColor,
  delay,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  stat: string;
  statColor: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={staggerChild}
      whileHover={{ y: -6, borderColor: '#D4AF37' }}
      transition={{ duration: 0.3, ease: easeSmooth }}
      className="bg-white border border-sand rounded-2xl p-8 shadow-card hover:shadow-feature transition-shadow duration-300"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 0.4, ease: easeBounce }}
      >
        <Icon size={48} className="text-gold mb-4" />
      </motion.div>
      <h3 className="text-h3 text-charcoal mb-2">{title}</h3>
      <p className="text-body-small text-warm-gray mb-3">{description}</p>
      <span className={`text-caption font-medium ${statColor}`}>{stat}</span>
    </motion.div>
  );
}

/* ─── Pricing Card ─── */
function PricingCard({
  tier,
  featured = false,
}: {
  tier: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: { text: string; included: boolean }[];
    cta: string;
    ctaStyle: 'primary' | 'outline' | 'coral';
  };
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={staggerChild}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: easeSmooth }}
      className={`relative rounded-[1.25rem] p-10 bg-white ${
        featured
          ? 'border-2 border-gold shadow-[0_8px_32px_rgba(212,175,55,0.15)] bg-[#FFFBF5]'
          : 'border border-sand shadow-card'
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-deep-brown text-caption font-semibold px-4 py-1.5 rounded-full">
          Most Popular
        </div>
      )}
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-[1.25rem]" />
      )}
      <h3 className="text-h3 text-charcoal mb-2">{tier.name}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-stat-number ${featured ? 'text-gold' : 'text-charcoal'}`}>
          {tier.price}
        </span>
        {tier.period && <span className="text-body-small text-warm-gray">{tier.period}</span>}
      </div>
      <p className="text-body-small text-warm-gray mb-6">{tier.description}</p>
      <ul className="space-y-3 mb-8">
        {tier.features.map((f, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2"
          >
            {f.included ? (
              <Check size={18} className="text-gold shrink-0" />
            ) : (
              <X size={18} className="text-warm-gray/40 shrink-0" />
            )}
            <span className={`text-body-small ${f.included ? 'text-charcoal' : 'text-warm-gray/50'}`}>
              {f.text}
            </span>
          </motion.li>
        ))}
      </ul>
      <Link
        to={tier.ctaStyle === 'coral' ? '/contact' : '/employers'}
        className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-200 min-h-[56px] flex items-center justify-center ${
          tier.ctaStyle === 'primary'
            ? 'bg-gold text-deep-brown shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover'
            : tier.ctaStyle === 'coral'
            ? 'bg-coral text-white shadow-coral hover:bg-coral-dark hover:scale-[1.03]'
            : 'border-2 border-gold text-gold hover:bg-gold/10'
        }`}
      >
        {tier.cta}
      </Link>
    </motion.div>
  );
}

/* ─── Stat Card for Analytics ─── */
const StatCard = React.memo(function StatCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: easeSmooth }}
      className="bg-warm-white border border-sand rounded-xl p-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-gold" />
      </div>
      <div>
        <p className="text-stat-number text-charcoal text-xl lg:text-2xl">{value}</p>
        <p className="text-caption text-warm-gray">{label}</p>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN PAGE COMPONENT ══════════ */
/* ═══════════════════════════════════════════ */
export default function Employers() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const chartRef = useRef(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.3 });

  /* Auto-rotate testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const basicFeatures = [
    { text: '3 active job postings', included: true },
    { text: 'Basic candidate profiles', included: true },
    { text: 'Email notifications', included: true },
    { text: '7-day listing duration', included: true },
    { text: 'Verified badge', included: false },
    { text: 'Priority placement', included: false },
    { text: 'Resume database access', included: false },
    { text: 'Dedicated support', included: false },
  ];

  const proFeatures = [
    { text: '15 active job postings', included: true },
    { text: 'Full candidate profiles', included: true },
    { text: 'Verified badge', included: true },
    { text: 'Priority job placement', included: true },
    { text: '30-day listing duration', included: true },
    { text: 'Resume database (50/month)', included: true },
    { text: 'Messenger integration', included: true },
    { text: 'Basic analytics', included: true },
    { text: 'Dedicated account manager', included: false },
  ];

  const enterpriseFeatures = [
    { text: 'Unlimited job postings', included: true },
    { text: 'Full candidate profiles + notes', included: true },
    { text: 'Verified badge', included: true },
    { text: 'Top priority placement', included: true },
    { text: 'Unlimited listing duration', included: true },
    { text: 'Full resume database access', included: true },
    { text: 'All messaging integrations', included: true },
    { text: 'Advanced analytics dashboard', included: true },
    { text: 'Dedicated account manager', included: true },
    { text: 'Custom branding', included: true },
  ];

  const proPrice = isAnnual ? '$79' : '$99';

  return (
    <div className="min-h-[100dvh]">
      {/* ════════ SECTION 1: HERO ════════ */}
      <section className="bg-deep-brown pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left: Text */}
            <div className="flex-1 max-w-[600px]">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeSmooth }}
                className="text-caption text-gold tracking-[0.15em] uppercase mb-4"
              >
                FOR EMPLOYERS
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
                className="text-hero-title font-display text-warm-white mb-6"
              >
                Hire Smarter, Hire Faster
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: easeSmooth }}
                className="text-body-large text-warm-white/80 max-w-[500px] mb-8"
              >
                Connect with Cambodia&apos;s largest pool of verified job seekers. From factory floors to tech offices, find talent that fits your business.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: easeSmooth }}
                className="flex flex-wrap gap-4 mb-6"
              >
                <Link
                  to="/employers"
                  className="inline-flex items-center justify-center bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[64px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
                >
                  Post a Job — Free
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[64px] hover:bg-gold/10 transition-all duration-200"
                >
                  View Pricing
                </Link>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center gap-2 text-body-small text-emerald"
              >
                <ShieldCheck size={16} />
                Every employer is verified. 850+ companies trust us.
              </motion.p>
            </div>

            {/* Right: Floating Cards */}
            <div className="flex-1 relative h-[400px] w-full max-w-[500px] hidden lg:block">
              <FloatingCard
                className="absolute top-4 left-4 bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-sand"
                delay={0.3}
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-warm-gray" />
                  <span className="text-body font-semibold text-charcoal">45 Applicants</span>
                </div>
              </FloatingCard>

              <FloatingCard
                className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(212,175,55,0.2)] border border-gold/30"
                delay={0.5}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold font-semibold text-sm">LC</span>
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">New Application</p>
                    <p className="text-caption text-warm-gray">Lyly Chem — Garment Worker</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                className="absolute bottom-8 right-4 bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(5,150,105,0.2)] border border-emerald/30"
                delay={0.7}
              >
                <div className="flex items-center gap-3">
                  <BadgeCheck size={24} className="text-emerald" />
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">Verified Hire</p>
                    <p className="text-caption text-emerald">Successfully placed</p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 2: WHY KHMERHR ════════ */}
      <section className="bg-warm-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">WHY KHMERHR</p>
            <h2 className="text-h2 text-charcoal">Built for Cambodia&apos;s Employers</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <FeatureCard
              icon={ShieldCheck}
              title="Verified Talent Pool"
              description="Every job seeker profile is verified. Know who you're hiring before the first interview."
              stat="98% verification rate"
              statColor="text-emerald"
              delay={0}
            />
            <FeatureCard
              icon={Factory}
              title="Industry Specialization"
              description="Deep expertise in garment, tourism, and ICT. We understand the unique hiring needs of each sector."
              stat="3 core industries"
              statColor="text-gold"
              delay={0.1}
            />
            <FeatureCard
              icon={Languages}
              title="Bilingual Support"
              description="Full Khmer and Chinese language support. Communicate with candidates in their preferred language."
              stat="Khmer · Chinese · English"
              statColor="text-gold"
              delay={0.2}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Pay for Results"
              description="No upfront costs. Pay only when you successfully hire. From 0% for basic listings to 15-25% for full recruitment service."
              stat="0% upfront"
              statColor="text-coral"
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 3: VERIFICATION PROCESS ════════ */}
      <section className="py-12 md:py-16 lg:py-20" style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}>
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">VERIFICATION</p>
            <h2 className="text-h2 text-warm-white mb-3">Become a Trusted Employer</h2>
            <p className="text-body text-warm-white/70 max-w-[600px] mx-auto">
              Build trust with candidates. Verified employers get 3x more applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* SVG Connector - desktop only */}
            <svg className="hidden md:block absolute top-16 left-[20%] right-[20%] w-[60%] h-4 z-0" viewBox="0 0 600 20">
              <motion.line
                x1="0"
                y1="10"
                x2="600"
                y2="10"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray="8 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: easeSmooth, delay: 0.5 }}
              />
            </svg>

            {[
              {
                num: '01',
                icon: Upload,
                title: 'Submit Documents',
                desc: 'Upload your business license, tax certificate, and company information. Takes 5 minutes.',
                detail: 'Business License · Tax ID · Company Profile',
                circleColor: 'bg-gold/10',
              },
              {
                num: '02',
                icon: Search,
                title: 'We Review',
                desc: 'Our team verifies your documents within 24-48 hours. We check business registration, tax compliance, and company reputation.',
                detail: null,
                circleColor: 'bg-gold/10',
              },
              {
                num: '03',
                icon: BadgeCheck,
                title: 'Get Verified',
                desc: 'Display the verified badge on your profile and job listings. Start receiving more qualified applicants immediately.',
                detail: 'Verified Employer badge active',
                circleColor: 'bg-emerald/10',
                isLast: true,
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.2, duration: 0.7, ease: easeOutExpo }}
                className="relative z-10 text-center"
              >
                <motion.div
                  className={`w-16 h-16 ${step.circleColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.4, ease: easeBounce }}
                >
                  <step.icon size={32} className={step.isLast ? 'text-emerald' : 'text-gold'} />
                </motion.div>
                <span className="text-caption text-gold font-mono">{step.num}</span>
                <h3 className="text-h3 text-warm-white mt-1 mb-2">{step.title}</h3>
                <p className="text-body-small text-warm-white/60 max-w-[280px] mx-auto mb-2">
                  {step.desc}
                </p>
                {step.detail && (
                  <span className={`text-caption ${step.isLast ? 'text-emerald' : 'text-gold'}`}>
                    {step.isLast && <Check size={12} className="inline mr-1" />}
                    {step.detail}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 4: PRICING TIERS ════════ */}
      <section className="bg-warm-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">PRICING</p>
            <h2 className="text-h2 text-charcoal mb-3">Simple, Transparent Pricing</h2>
            <p className="text-body text-warm-gray mb-8">Choose the plan that fits your hiring needs. No hidden fees.</p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-body-small ${!isAnnual ? 'text-charcoal font-semibold' : 'text-warm-gray'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 bg-sand rounded-full transition-colors duration-200"
                style={{ backgroundColor: isAnnual ? '#D4AF37' : '#E8E0D0' }}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow"
                  animate={{ x: isAnnual ? 28 : 0 }}
                  transition={{ duration: 0.3, ease: easeBounce }}
                />
              </button>
              <span className={`text-body-small ${isAnnual ? 'text-charcoal font-semibold' : 'text-warm-gray'}`}>
                Annual <span className="text-emerald">(Save 20%)</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <PricingCard
              tier={{
                name: 'Basic',
                price: '$0',
                period: '/ month',
                description: 'For small businesses just getting started',
                features: basicFeatures,
                cta: 'Get Started Free',
                ctaStyle: 'outline',
              }}
            />
            <PricingCard
              tier={{
                name: 'Professional',
                price: proPrice,
                period: '/ month',
                description: 'For growing businesses with regular hiring needs',
                features: proFeatures,
                cta: 'Start Professional',
                ctaStyle: 'primary',
              }}
              featured
            />
            <PricingCard
              tier={{
                name: 'Enterprise',
                price: 'Custom',
                period: 'Contact us',
                description: 'For large organizations with high-volume hiring',
                features: enterpriseFeatures,
                cta: 'Contact Sales',
                ctaStyle: 'coral',
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 5: ANALYTICS PREVIEW ════════ */}
      <section className="bg-cream py-12 md:py-16 lg:py-20" ref={chartRef}>
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Left: Text */}
            <motion.div
              className="flex-1 max-w-[480px]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">ANALYTICS</p>
              <h2 className="text-h2 text-charcoal mb-4">Know Your Hiring Performance</h2>
              <p className="text-body text-warm-gray mb-6">
                Track applications, view rates, and hire success. Make data-driven decisions to improve your recruitment.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Application tracking in real-time',
                  'Candidate source analytics',
                  'Time-to-hire metrics',
                  'Industry benchmarking',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 text-body-small text-charcoal"
                  >
                    <CheckCircle size={18} className="text-emerald shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className="inline-flex items-center border-2 border-gold text-gold px-6 py-3 rounded-xl text-button-small font-semibold hover:bg-gold/10 transition-all duration-200"
              >
                Explore Analytics
                <span className="ml-1">&rarr;</span>
              </Link>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              className="flex-[1.5] w-full"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
            >
              <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] p-6 space-y-5">
                {/* Stat Row */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Total Views" value="1,240" icon={Globe} delay={0} />
                  <StatCard label="Applications" value="89" icon={Users} delay={0.1} />
                  <StatCard label="Hires" value="12" icon={BadgeCheck} delay={0.2} />
                </div>

                {/* Bar Chart */}
                <div>
                  <p className="text-caption text-warm-gray mb-2">Monthly Applications</p>
                  <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: '1px solid #E8E0D0', fontSize: 12 }}
                          cursor={{ fill: 'rgba(212,175,55,0.08)' }}
                        />
                        <Bar dataKey="apps" fill="#D4AF37" radius={[4, 4, 0, 0]}>
                          {barData.map((_, i) => (
                            <Cell key={i} fill={chartInView ? '#D4AF37' : '#E8E0D0'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pie Chart */}
                  <div>
                    <p className="text-caption text-warm-gray mb-2">Traffic Source</p>
                    <div className="h-[130px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" stroke="none">
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E0D0', fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pieData.map((d) => (
                        <span key={d.name} className="flex items-center gap-1 text-caption text-warm-gray">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Line Chart */}
                  <div>
                    <p className="text-caption text-warm-gray mb-2">Views (Last 7 Days)</p>
                    <div className="h-[130px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9C9588' }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{ borderRadius: 8, border: '1px solid #E8E0D0', fontSize: 12 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#D4AF37' }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 6: TESTIMONIAL CAROUSEL ════════ */}
      <section className="bg-warm-white py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 max-w-[900px]">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">SUCCESS STORIES</p>
            <h2 className="text-h2 text-charcoal">Employers Who Trust Us</h2>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: easeSmooth }}
                  className="bg-cream rounded-2xl p-8 relative"
                >
                  {/* Quote mark */}
                  <span className="absolute top-4 left-6 text-[4rem] leading-none text-gold/20 font-display select-none">
                    &ldquo;
                  </span>
                  <p className="text-body text-charcoal mb-6 relative z-10 leading-relaxed">
                    {testimonials[testimonialIdx].quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold font-semibold">{testimonials[testimonialIdx].initial}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-body-small font-semibold text-charcoal">
                        {testimonials[testimonialIdx].name}
                      </p>
                      <p className="text-caption text-warm-gray">{testimonials[testimonialIdx].role}</p>
                    </div>
                    <span className="text-caption bg-gold/10 text-gold px-3 py-1 rounded-full hidden sm:inline-block">
                      {testimonials[testimonialIdx].tag}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-sand flex items-center justify-center text-warm-gray hover:border-gold hover:text-gold transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialIdx ? 'bg-gold scale-125' : 'bg-sand'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-sand flex items-center justify-center text-warm-gray hover:border-gold hover:text-gold transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 7: CTA / GET STARTED ════════ */}
      <section className="py-12 md:py-16 lg:py-20" style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}>
        <div className="mx-auto px-4 md:px-8 max-w-[700px] text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={staggerChild} className="mb-6">
              <LotusIcon className="w-20 h-20 text-gold mx-auto animate-lotus-pulse" />
            </motion.div>
            <motion.h2 variants={staggerChild} className="text-h2 text-warm-white mb-4">
              Start Hiring Today
            </motion.h2>
            <motion.p variants={staggerChild} className="text-body-large text-warm-white/80 mb-8">
              Join 850+ verified employers. Post your first job for free.
            </motion.p>
            <motion.div variants={staggerChild} className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/employers"
                className="inline-flex items-center justify-center bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[64px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
              >
                Create Employer Account &rarr;
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[64px] hover:bg-gold/10 transition-all duration-200"
              >
                Talk to Our Team
              </Link>
            </motion.div>
            <motion.div
              variants={staggerChild}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-caption text-warm-white/60"
            >
              <span>
                <Check size={12} className="inline text-emerald mr-1" /> Free to start
              </span>
              <span>
                <Check size={12} className="inline text-emerald mr-1" /> 24h verification
              </span>
              <span>
                <Check size={12} className="inline text-emerald mr-1" /> No credit card required
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
