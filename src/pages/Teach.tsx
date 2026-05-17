import { useState, useRef } from 'react';
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
  const stats = [
    { icon: Users, label: 'Teachers', value: '50+' },
    { icon: DollarSign, label: 'Avg Monthly Income', value: '$500' },
    { icon: GraduationCap, label: 'Students', value: '15K+' },
    { icon: Award, label: 'Satisfaction', value: '95%' },
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
            ចែករំលែកចំណេះដឹង &middot; Share Knowledge &middot; 分享您的知识
          </motion.p>

          <motion.h1
            variants={childFadeUp}
            className="text-hero-title font-display text-warm-white mb-6"
          >
            Share Your
            <span className="text-gold"> Knowledge</span>
          </motion.h1>

          <motion.p
            variants={childFadeUp}
            className="text-body-large text-warm-gray mb-4 max-w-[650px] mx-auto"
          >
            Teach what you love. Earn money. Impact thousands of students in Cambodia.
          </motion.p>

          <motion.p
            variants={childFadeUp}
            className="text-body text-warm-gray/70 mb-10 max-w-[600px] mx-auto"
            style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
          >
            教你所爱。赚取收入。影响柬埔寨数千名学生。
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
              Start Teaching
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <button
              onClick={() => alert('Demo video coming soon!')}
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center hover:bg-gold/10 transition-all duration-200"
            >
              <Play size={18} className="mr-2" />
              Watch Demo
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
  title: string;
  description: string;
}

const valueProps: ValueProp[] = [
  {
    icon: DollarSign,
    title: 'Earn Money',
    description: 'Set your own price. Earn 70% of every sale. Get paid monthly directly to your bank account.',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedule',
    description: 'Teach on your own time. Pre-record and upload videos whenever it suits you.',
  },
  {
    icon: TrendingUp,
    title: 'Build Your Brand',
    description: 'Grow your personal brand and following. Become a recognized expert in your field.',
  },
  {
    icon: Heart,
    title: 'Impact Lives',
    description: 'Help Cambodian workers upskill and earn better. Make a real difference in your community.',
  },
];

function WhyTeachSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Why Teach Here
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            The Best Place to Teach Online
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Join Cambodia&apos;s fastest growing education platform. We provide everything you need to succeed.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => (
            <ScrollReveal key={prop.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white border border-sand rounded-2xl p-8 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
                  <prop.icon size={28} className="text-gold" />
                </div>
                <h3 className="text-h4 font-display text-charcoal mb-3">
                  {prop.title}
                </h3>
                <p className="text-body-small text-warm-gray flex-1">
                  {prop.description}
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
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FileText,
    title: 'Apply',
    description: 'Submit your teacher application with your expertise and qualifications.',
  },
  {
    icon: Video,
    title: 'Create',
    description: 'Record and upload your course videos using our simple tools.',
  },
  {
    icon: Globe,
    title: 'Publish',
    description: 'We review your course and publish it to thousands of students.',
  },
  {
    icon: Wallet,
    title: 'Earn',
    description: 'Students buy your course. You earn 70% of every sale.',
  },
];

function HowItWorksSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            Start Teaching in 4 Easy Steps
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            From application to your first student — it&apos;s simple and straightforward.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-sand" />
                )}

                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-5 shadow-gold relative z-10">
                  <step.icon size={28} className="text-deep-brown" />
                </div>

                <span className="text-caption font-semibold text-gold mb-2">
                  Step {i + 1}
                </span>
                <h3 className="text-h4 font-display text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-body-small text-warm-gray max-w-[240px]">
                  {step.description}
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
            Earning Calculator
          </p>
          <h2 className="text-h2 font-display text-warm-white mb-4">
            See How Much You Can Earn
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Adjust the sliders to estimate your monthly teaching income.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-[#2D2926] border border-sand/20 rounded-3xl p-6 md:p-10 max-w-[800px] mx-auto">
            {/* Price Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-body font-medium text-warm-white">
                  Course Price
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
                  Students per Month
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
                You earn 70% commission on every sale
              </span>
            </div>

            {/* Result */}
            <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 text-center">
              <p className="text-body-small text-warm-gray mb-2">
                Your estimated monthly income
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
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Teacher Stories
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            What Our Teachers Say
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Real teachers earning real money and making a real impact.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-cream border border-sand rounded-2xl p-6 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col"
              >
                {/* Quote icon */}
                <Quote size={32} className="text-gold mb-4" />

                {/* Quote */}
                <p className="text-body text-charcoal mb-6 flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Person */}
                <div className="flex items-center gap-3 pt-4 border-t border-sand">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{
                      backgroundColor: t.bgColor,
                      fontFamily: t.flag === '中文' ? 'Noto Sans SC, sans-serif' : 'Inter, sans-serif',
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">
                      {t.name}
                    </p>
                    <p className="text-caption text-warm-gray">{t.role}</p>
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
  title: string;
  description: string;
}

const requirements: Requirement[] = [
  {
    icon: CheckCircle2,
    title: 'Expertise in Your Subject',
    description: 'You should have deep knowledge and real-world experience in what you teach. Whether it\'s a language, a skill, or a profession — expertise matters.',
  },
  {
    icon: Camera,
    title: 'Basic Video Recording',
    description: 'A smartphone is enough to get started. Good lighting and clear audio are more important than expensive equipment.',
  },
  {
    icon: Flame,
    title: 'Passion for Teaching',
    description: 'The best teachers are those who genuinely care about helping others learn. Bring your enthusiasm and patience.',
  },
];

function RequirementsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Requirements
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            What You Need to Get Started
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            We keep the barriers low. If you have expertise and passion, you can teach.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {requirements.map((req, i) => (
            <ScrollReveal key={req.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white border border-sand rounded-2xl p-8 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                  <req.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-h4 font-display text-charcoal mb-3">
                  {req.title}
                </h3>
                <p className="text-body-small text-warm-gray">
                  {req.description}
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
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-emerald/5 border border-gold/20 rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="text-h2 font-display text-charcoal mb-4">
              Ready to Start?
            </h2>
            <p className="text-body-large text-warm-gray mb-4 max-w-[500px] mx-auto">
              Join our community of teachers and start earning while making a difference.
            </p>
            <p
              className="text-body text-warm-gray/70 mb-8 max-w-[500px] mx-auto"
              style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
            >
              加入我们的教师社区，开始赚取收入，同时产生影响。
            </p>

            <Link
              to="/course-upload"
              className="inline-flex items-center justify-center bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
            >
              Apply Now
              <ArrowRight size={20} className="ml-2" />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                Free to apply
              </div>
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                70% commission
              </div>
              <div className="flex items-center gap-1.5 text-body-small text-warm-gray">
                <CheckCircle2 size={14} className="text-emerald" />
                Monthly payouts
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
