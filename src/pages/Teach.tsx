import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Heart,
  FileText,
  Video,
  Globe,
  Wallet,
  ArrowRight,
  Play,
  CheckCircle2,
  Quote,
  Camera,
  Flame,
  Users,
  GraduationCap,
  Award,
} from 'lucide-react';

/* ──────────────────────── Animation helpers ──────────────────────── */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

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

/* ──────────────────────── Section 1: Hero ──────────────────────── */

function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, label: t('teach.stats.teachers'), value: '50+' },
    { icon: DollarSign, label: t('teach.stats.avgIncome'), value: '$500' },
    { icon: GraduationCap, label: t('teach.stats.students'), value: '15K+' },
    { icon: Award, label: t('teach.stats.satisfaction'), value: '95%' },
  ];

  return (
    <section className="relative bg-deep-brown pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          className="text-center max-w-[850px] mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={childFadeUp}
            className="text-gold text-caption font-semibold tracking-widest uppercase mb-4"
          >
            {t('teach.shareKnowledge')}
          </motion.p>

          <motion.h1
            variants={childFadeUp}
            className="text-hero-title font-display text-warm-white mb-6"
          >
            {t('teach.heroTitle').split(' ').slice(0, -1).join(' ')}
            <span className="text-gold"> {t('teach.heroTitle').split(' ').slice(-1)}</span>
          </motion.h1>

          <motion.p
            variants={childFadeUp}
            className="text-body-large text-warm-gray mb-4 max-w-[650px] mx-auto"
          >
            {t('teach.subtitle')}
          </motion.p>

          <motion.p
            variants={childFadeUp}
            className="text-body text-warm-gray/70 mb-10 max-w-[600px] mx-auto"
            style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
          >
            {t('teach.subtitleZh')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={childFadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/course-upload"
              className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
            >
              {t('teach.startTeaching')}
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <button
              onClick={() => alert(t('teach.demoComingSoon'))}
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center hover:bg-gold/10 transition-all duration-200"
            >
              <Play size={18} className="mr-2" />
              {t('teach.watchDemo')}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={childFadeUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <stat.icon size={28} className="text-gold" />
                <span className="text-stat-number font-display text-warm-white">
                  {stat.value}
                </span>
                <span className="text-body-small text-warm-gray">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 2: Why Teach Here ──────────────────────── */

interface ValueProp {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  descKey: string;
}

const getValueProps = (_t: (key: string) => string): ValueProp[] => [
  {
    icon: DollarSign,
    titleKey: 'teach.earnMoney',
    descKey: 'teach.earnMoneyDesc',
  },
  {
    icon: Calendar,
    titleKey: 'teach.flexibleSchedule',
    descKey: 'teach.flexibleDesc',
  },
  {
    icon: TrendingUp,
    titleKey: 'teach.buildBrand',
    descKey: 'teach.buildBrandDesc',
  },
  {
    icon: Heart,
    titleKey: 'teach.impactLives',
    descKey: 'teach.impactDesc',
  },
];

function WhyTeachSection() {
  const { t } = useTranslation();
  const valueProps = getValueProps(t);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            {t('teach.whyTeach')}
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            {t('teach.bestPlace')}
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            {t('teach.whySubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => (
            <ScrollReveal key={prop.titleKey} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white border border-sand rounded-2xl p-8 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
                  <prop.icon size={28} className="text-gold" />
                </div>
                <h3 className="text-h4 font-display text-charcoal mb-3">
                  {t(prop.titleKey)}
                </h3>
                <p className="text-body-small text-warm-gray flex-1">
                  {t(prop.descKey)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 3: How It Works ──────────────────────── */

interface Step {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  descKey: string;
}

const getSteps = (_t: (key: string) => string): Step[] => [
  {
    icon: FileText,
    titleKey: 'teach.apply',
    descKey: 'teach.applyDesc',
  },
  {
    icon: Video,
    titleKey: 'teach.create',
    descKey: 'teach.createDesc',
  },
  {
    icon: Globe,
    titleKey: 'teach.publish',
    descKey: 'teach.publishDesc',
  },
  {
    icon: Wallet,
    titleKey: 'teach.earn',
    descKey: 'teach.earnDesc',
  },
];

function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = getSteps(t);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            {t('teach.howItWorks')}
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            {t('teach.fourSteps')}
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            {t('teach.howSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.titleKey} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-sand" />
                )}

                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-5 shadow-gold relative z-10">
                  <step.icon size={28} className="text-deep-brown" />
                </div>

                <span className="text-caption font-semibold text-gold mb-2">
                  {t('teach.step')} {i + 1}
                </span>
                <h3 className="text-h4 font-display text-charcoal mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-body-small text-warm-gray max-w-[240px]">
                  {t(step.descKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 4: Earning Calculator ──────────────────────── */

function EarningCalculator() {
  const { t } = useTranslation();
  const [price, setPrice] = useState(19.99);
  const [students, setStudents] = useState(100);
  const commission = 0.7;
  const monthlyIncome = price * students * commission;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleStudentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudents(Number(e.target.value));
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-deep-brown">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            {t('teach.earningCalculator')}
          </p>
          <h2 className="text-h2 font-display text-warm-white mb-4">
            {t('teach.seeEarnings')}
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            {t('teach.calculatorSubtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-[#2D2926] border border-sand/20 rounded-3xl p-6 md:p-10 max-w-[800px] mx-auto">
            {/* Price Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-body font-medium text-warm-white">
                  {t('teach.coursePrice')}
                </label>
                <span className="text-h3 font-display text-gold">
                  ${price.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.99"
                value={price}
                onChange={handlePriceChange}
                className="w-full h-2 bg-sand/30 rounded-full appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-caption text-warm-gray">$1</span>
                <span className="text-caption text-warm-gray">$100</span>
              </div>
            </div>

            {/* Students Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-body font-medium text-warm-white">
                  {t('teach.studentsPerMonth')}
                </label>
                <span className="text-h3 font-display text-gold">
                  {students}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={students}
                onChange={handleStudentsChange}
                className="w-full h-2 bg-sand/30 rounded-full appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-caption text-warm-gray">10</span>
                <span className="text-caption text-warm-gray">1000</span>
              </div>
            </div>

            {/* Commission Note */}
            <div className="flex items-center justify-center gap-2 mb-6 text-emerald">
              <CheckCircle2 size={18} />
              <span className="text-body-small font-medium">
                {t('teach.commission')}
              </span>
            </div>

            {/* Result */}
            <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 text-center">
              <p className="text-body-small text-warm-gray mb-2">
                {t('teach.monthlyIncome')}
              </p>
              <p className="text-stat-number font-display text-gold mb-3">
                ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-body-small text-warm-gray">
                ${price.toFixed(2)} &times; {students} students &times; 70% ={' '}
                <span className="text-gold font-semibold">
                  ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                </span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 5: Teacher Testimonials ──────────────────────── */

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initial: string;
  bgColor: string;
  flag: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "I've earned $2,400 in my first 3 months teaching English. The platform made it so easy to reach students across Cambodia.",
    name: 'John Smith',
    role: 'English Teacher',
    initial: 'J',
    bgColor: '#D4AF37',
    flag: 'EN',
  },
  {
    quote: "平台处理了一切——支付、学生、支持。我可以专注于教学，其他事情不用担心。The platform handles everything — payments, students, support.",
    name: '李老师',
    role: 'Chinese Teacher',
    initial: '李',
    bgColor: '#E85D3E',
    flag: '中文',
  },
  {
    quote: "My factory safety course reached 3,000+ workers. It's incredibly rewarding to see my knowledge help so many people stay safe at work.",
    name: 'Ming Zhang',
    role: 'Safety Expert',
    initial: 'M',
    bgColor: '#059669',
    flag: 'EN',
  },
];

function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            {t('teach.teacherStories')}
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            {t('teach.whatTeachersSay')}
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            {t('teach.testimonialsSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <ScrollReveal key={testimonial.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-cream border border-sand rounded-2xl p-6 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col"
              >
                {/* Quote icon */}
                <Quote size={32} className="text-gold mb-4" />

                {/* Quote */}
                <p className="text-body text-charcoal mb-6 flex-1 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Person */}
                <div className="flex items-center gap-3 pt-4 border-t border-sand">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{
                      backgroundColor: testimonial.bgColor,
                      fontFamily: testimonial.flag === '中文' ? 'Noto Sans SC, sans-serif' : 'Inter, sans-serif',
                    }}
                  >
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">
                      {testimonial.name}
                    </p>
                    <p className="text-caption text-warm-gray">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 6: Requirements ──────────────────────── */

interface Requirement {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  descKey: string;
}

const getRequirements = (_t: (key: string) => string): Requirement[] => [
  {
    icon: CheckCircle2,
    titleKey: 'teach.expertise',
    descKey: 'teach.expertiseDesc',
  },
  {
    icon: Camera,
    titleKey: 'teach.videoRecording',
    descKey: 'teach.videoDesc',
  },
  {
    icon: Flame,
    titleKey: 'teach.passion',
    descKey: 'teach.passionDesc',
  },
];

function RequirementsSection() {
  const { t } = useTranslation();
  const requirements = getRequirements(t);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            {t('teach.requirements')}
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            {t('teach.whatYouNeed')}
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            {t('teach.requirementsSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {requirements.map((req, i) => (
            <ScrollReveal key={req.titleKey} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white border border-sand rounded-2xl p-8 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                  <req.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-h4 font-display text-charcoal mb-3">
                  {t(req.titleKey)}
                </h3>
                <p className="text-body-small text-warm-gray">
                  {t(req.descKey)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 7: CTA ──────────────────────── */

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-emerald/5 border border-gold/20 rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="text-h2 font-display text-charcoal mb-4">
              {t('teach.ready')}
            </h2>
            <p className="text-body-large text-warm-gray mb-4 max-w-[500px] mx-auto">
              {t('teach.joinCommunity')}
            </p>
            <p
              className="text-body text-warm-gray/70 mb-8 max-w-[500px] mx-auto"
              style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
            >
              {t('teach.joinCommunityZh')}
            </p>

            <Link
              to="/course-upload"
              className="inline-flex items-center justify-center bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
            >
              {t('teach.applyNow')}
              <ArrowRight size={20} className="ml-2" />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                {t('teach.freeToApply')}
              </div>
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                {t('teach.seventyCommission')}
              </div>
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                {t('teach.monthlyPayouts')}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────── Main Page ──────────────────────── */

export default function Teach() {
  return (
    <div>
      <HeroSection />
      <WhyTeachSection />
      <HowItWorksSection />
      <EarningCalculator />
      <TestimonialsSection />
      <RequirementsSection />
      <CTASection />
    </div>
  );
}
