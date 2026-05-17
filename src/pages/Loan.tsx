import { useState, useRef } from 'react';
import {
  Briefcase, TrendingUp, FileText, Wallet, Sprout,
  Banknote, GraduationCap, Truck, ChevronDown, ChevronUp,
  Landmark, Smartphone, CircleDollarSign, Building,
  Star, ArrowRight, Calculator, Shield, Clock, CheckCircle,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

/* ───────────────────── TYPES ───────────────────── */
interface CreditTier {
  name: string;
  minScore: number;
  rate: number;
  color: string;
  bgColor: string;
}

interface LoanProduct {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  titleKm: string;
  amount: string;
  term: string;
  rate: string;
  forDescription: string;
  requires: string;
  featured?: boolean;
}

interface BankPartner {
  name: string;
  description: string;
  products: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface Testimonial {
  name: string;
  role: string;
  story: string;
  loanAmount: string;
  outcome: string;
  initial: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

/* ───────────────────── DATA ───────────────────── */

const heroStats = [
  { value: '$500-5,000', label: 'Loan Range', labelKm: 'ជួរកម្ចី' },
  { value: '6-24', label: 'Month Terms', labelKm: 'រយៈពេលខែ' },
  { value: 'From 1.5%', label: 'Monthly Rate', labelKm: 'ត្រាប្រចាំខែ' },
  { value: '48hr', label: 'Approval', labelKm: 'អនុម័ត' },
];

const steps = [
  {
    num: '01',
    icon: Briefcase,
    title: 'Get Hired',
    titleKm: 'ទទួល​បាន​ការងារ',
    description: 'Secure a job through 高棉职通车. Verified employment is the first step to loan eligibility.',
  },
  {
    num: '02',
    icon: TrendingUp,
    title: 'Build Credit',
    titleKm: 'បង្កើត​ឥណទាន',
    description: 'Earn a trust score through consistent work performance, on-time attendance, and employer ratings.',
  },
  {
    num: '03',
    icon: FileText,
    title: 'Apply for Loan',
    titleKm: 'ដាក់​ពាក្យ​សុំ​កម្ចី',
    description: 'Submit your loan application in-app. No paperwork, no bank visits. Get a decision within 48 hours.',
  },
  {
    num: '04',
    icon: Wallet,
    title: 'Receive Funds',
    titleKm: 'ទទួល​ប្រាក់',
    description: 'Get money directly in your ABA or Wing account. Start using it for your goals immediately.',
  },
];

const creditTiers: CreditTier[] = [
  { name: 'Platinum', minScore: 800, rate: 1.5, color: '#7C3AED', bgColor: '#EDE9FE' },
  { name: 'Gold', minScore: 600, rate: 2.0, color: '#D4AF37', bgColor: '#FEF9C3' },
  { name: 'Silver', minScore: 300, rate: 2.5, color: '#6B7280', bgColor: '#F3F4F6' },
  { name: 'Bronze', minScore: 0, rate: 3.5, color: '#B45309', bgColor: '#FEF3C7' },
];

const loanProducts: LoanProduct[] = [
  {
    icon: Sprout,
    title: 'Starter Loan',
    titleKm: 'កម្ចី​ចាប់ផ្ដើម',
    amount: '$100 - $500',
    term: '3-6 months',
    rate: '3.5%/month',
    forDescription: 'New workers, first loan',
    requires: 'No credit score required',
  },
  {
    icon: Banknote,
    title: 'Salary Advance',
    titleKm: 'ទឹកប្រាក់​ជាមុន',
    amount: '50% of monthly salary',
    term: '1-3 months',
    rate: '1.5%/month',
    forDescription: 'Employed workers with verified income',
    requires: 'Active job + 3 months employment',
    featured: true,
  },
  {
    icon: GraduationCap,
    title: 'Skill Development Loan',
    titleKm: 'កម្ចី​អភិវឌ្ឍន៍​ជំនាញ',
    amount: '$200 - $2,000',
    term: '6-18 months',
    rate: '2.0%/month',
    forDescription: 'Training course fees, equipment purchase',
    requires: 'Silver+ credit score',
  },
  {
    icon: Truck,
    title: 'Relocation Loan',
    titleKm: 'កម្ចី​ផ្លាស់ប្ដូរ​ទីលំនៅ',
    amount: '$500 - $5,000',
    term: '12-24 months',
    rate: '1.5-2.5%/month',
    forDescription: 'Moving costs for new job',
    requires: 'Job offer letter + Gold+ credit',
  },
];

const bankPartners: BankPartner[] = [
  {
    name: 'ABA Bank',
    description: 'Quick disbursement to ABA accounts. Same-day fund transfer for approved loans.',
    products: ['Starter Loan', 'Salary Advance'],
    icon: Building,
  },
  {
    name: 'ACLEDA Bank',
    description: 'Microfinance partnership with flexible repayment options for garment workers.',
    products: ['Skill Development Loan'],
    icon: Landmark,
  },
  {
    name: 'Wing Bank',
    description: 'Mobile wallet integration. Receive loans directly to your Wing account instantly.',
    products: ['Starter Loan', 'Salary Advance'],
    icon: Smartphone,
  },
  {
    name: 'LOLC Cambodia',
    description: 'Low-interest salary loans with extended terms up to 24 months.',
    products: ['Relocation Loan', 'Skill Development Loan'],
    icon: CircleDollarSign,
  },
];

const testimonials: Testimonial[] = [
  {
    name: 'Sreyneang Chhim',
    role: 'Garment Worker → Business Owner',
    story: 'I used a $500 Starter Loan to buy my own sewing machine. Within 6 months, I started a small tailoring business from home and now earn double my factory salary.',
    loanAmount: '$500',
    outcome: 'Started own tailoring business, income doubled',
    initial: 'SC',
  },
  {
    name: 'Vannak Meas',
    role: 'Line Worker → Supervisor',
    story: 'The Skill Development Loan covered my supervisor training course. After completing it, I got promoted to line supervisor with a 40% salary increase.',
    loanAmount: '$800',
    outcome: 'Promoted to supervisor, 40% salary increase',
    initial: 'VM',
  },
  {
    name: 'Bopha Duong',
    role: 'Province Worker → City Professional',
    story: 'I took a $2,000 Relocation Loan to move from Kampong Cham to Phnom Penh for a better hotel job. The loan covered my move and 2 months of rent.',
    loanAmount: '$2,000',
    outcome: 'Moved to Phnom Penh, salary tripled',
    initial: 'BD',
  },
];

const faqItems: FAQItem[] = [
  {
    question: 'Do I need a bank account?',
    answer: 'Yes, you need either an ABA Bank account or Wing mobile wallet to receive loan funds. If you don\'t have one, we can help you open an account during the application process.',
  },
  {
    question: 'What happens if I lose my job?',
    answer: 'We understand that circumstances change. If you lose your job, contact us immediately. We offer a 3-month grace period where you only pay interest. Our job placement team will also help you find new employment quickly.',
  },
  {
    question: 'How is my interest rate determined?',
    answer: 'Your rate is based on your KhmerHR Credit Score, which considers your work history, employer ratings, attendance record, and previous loan repayment. Platinum (800+) gets 1.5%, Gold (600-800) gets 2%, Silver (300-600) gets 2.5%, and Bronze (0-300) gets 3.5% monthly.',
  },
  {
    question: 'Can I pay off early?',
    answer: 'Absolutely! Early repayment is always allowed with no penalties. In fact, early repayment improves your credit score and may qualify you for better rates on future loans.',
  },
  {
    question: 'What documents do I need?',
    answer: 'For most loans, you only need your KhmerHR verified employment profile. For larger loans (over $1,000), we may ask for a copy of your ID card and one payslip. Everything is uploaded in-app.',
  },
  {
    question: 'How long does approval take?',
    answer: 'Most applications are approved within 48 hours. Starter Loans and Salary Advances are often approved within 24 hours. Once approved, funds are transferred to your account within 2 hours.',
  },
];

/* ───────────────────── HELPERS ───────────────────── */

function getRateForScore(score: number): number {
  if (score >= 800) return 1.5;
  if (score >= 600) return 2.0;
  if (score >= 300) return 2.5;
  return 3.5;
}

function getTierForScore(score: number): CreditTier {
  if (score >= 800) return creditTiers[0];
  if (score >= 600) return creditTiers[1];
  if (score >= 300) return creditTiers[2];
  return creditTiers[3];
}

/* ───────────────────── COMPONENTS ───────────────────── */

function SectionReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-sand rounded-xl bg-white overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
            >
              <span className="font-semibold text-charcoal text-body pr-4">{item.question}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gold flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="px-5 pb-5"
              >
                <p className="text-warm-gray text-body leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */

export default function Loan() {
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [creditScore, setCreditScore] = useState<number>(500);
  const [checkScore, setCheckScore] = useState<string>('');
  const [checkResult, setCheckResult] = useState<CreditTier | null>(null);

  const interestRate = getRateForScore(creditScore);
  const monthlyInterest = interestRate / 100;
  const monthlyPayment =
    loanAmount > 0 && loanTerm > 0
      ? (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -loanTerm))
      : 0;
  const totalRepayment = monthlyPayment * loanTerm;
  const totalInterest = totalRepayment - loanAmount;

  const handleCheckEligibility = () => {
    const score = parseInt(checkScore, 10);
    if (!isNaN(score) && score >= 0 && score <= 1000) {
      setCheckResult(getTierForScore(score));
    } else {
      setCheckResult(null);
    }
  };

  return (
    <div className="w-full">
      {/* ═══════════ SECTION 1: HERO ═══════════ */}
      <section className="relative min-h-[100dvh] bg-deep-brown overflow-hidden flex items-center">
        {/* Gold gradient overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.2) 0%, transparent 50%)',
        }} />
        <div className="absolute top-0 left-0 w-full h-full" style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 40%, rgba(212,175,55,0.05) 100%)',
        }} />

        <div className="relative z-10 max-w-container-desktop mx-auto px-4 md:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-gold" />
                <span className="text-gold text-caption font-medium tracking-wider uppercase">Financial Inclusion</span>
              </div>

              <h1 className="text-hero-title text-white font-display mb-2">
                Employment Loan
              </h1>
              <p className="text-h3 text-gold font-khmer mb-6">
                កម្ចីការងារ
              </p>
              <p className="text-h4 text-gold/80 font-chinese mb-8">
                就业贷款
              </p>

              <p className="text-body-large text-warm-gray max-w-xl mb-10 leading-relaxed">
                Access fair loans based on your job and credit score. No collateral needed for trusted workers.
                We partner with Cambodia&apos;s leading banks to bring financial access to every worker.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-gold text-deep-brown font-semibold px-8 py-4 rounded-xl shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover active:scale-[0.98] transition-all duration-200 text-button">
                  Check Eligibility
                </button>
                <button className="border-2 border-gold text-gold font-semibold px-8 py-4 rounded-xl hover:bg-gold/10 active:bg-gold/20 transition-all duration-200 text-button">
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
              className="grid grid-cols-2 gap-4"
            >
              {heroStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="bg-white/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 text-center hover:border-gold/40 hover:bg-white/10 transition-all duration-300"
                >
                  <p className="text-stat-number text-gold mb-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {stat.value}
                  </p>
                  <p className="text-body-small text-warm-gray">{stat.label}</p>
                  <p className="text-caption text-warm-gray/60 font-khmer">{stat.labelKm}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 2: HOW IT WORKS ═══════════ */}
      <section className="bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12 lg:mb-16">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">Process</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">How It Works</h2>
            <p className="text-h4 text-gold font-khmer">របៀបដែលវាដំណើរការ</p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)', opacity: 0.3 }} />

            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <SectionReveal key={idx} delay={idx * 0.12} className="relative">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    className="bg-white border border-sand rounded-2xl p-6 lg:p-8 text-center relative z-10 hover:shadow-card-hover hover:border-gold/50 transition-all duration-300 h-full"
                  >
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-deep-brown text-xs font-bold px-3 py-1 rounded-full">
                      {step.num}
                    </div>

                    <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2">
                      <IconComp className="w-7 h-7 text-gold" />
                    </div>

                    <h3 className="text-h4 text-charcoal mb-1">{step.title}</h3>
                    <p className="text-caption text-gold font-khmer mb-3">{step.titleKm}</p>
                    <p className="text-body-small text-warm-gray leading-relaxed">{step.description}</p>
                  </motion.div>

                  {/* Arrow between steps (mobile only) */}
                  {idx < steps.length - 1 && (
                    <div className="flex justify-center my-2 lg:hidden">
                      <ArrowRight className="w-5 h-5 text-gold/40 rotate-90" />
                    </div>
                  )}
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 3: LOAN CALCULATOR ═══════════ */}
      <section className="bg-cream py-16 md:py-20 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">Calculator</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">Loan Calculator</h2>
            <p className="text-h4 text-gold font-khmer">ឧបករណ៍គណនាកម្ចី</p>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Controls */}
            <SectionReveal>
              <div className="bg-white border border-sand rounded-2xl p-6 lg:p-8 space-y-8">
                {/* Loan Amount Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-body font-medium text-charcoal flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-gold" />
                      Loan Amount
                    </label>
                    <span className="text-h4 text-gold font-mono">${loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={100}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-sand rounded-full appearance-none cursor-pointer accent-gold"
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-caption text-warm-gray">$100</span>
                    <span className="text-caption text-warm-gray">$5,000</span>
                  </div>
                </div>

                {/* Loan Term Selector */}
                <div>
                  <label className="text-body font-medium text-charcoal mb-3 block">Loan Term (Months)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 18, 24].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`py-3 px-4 rounded-xl text-center font-medium text-body-small transition-all duration-200 ${
                          loanTerm === term
                            ? 'bg-gold text-deep-brown shadow-gold'
                            : 'bg-cream text-warm-gray hover:bg-gold/10 hover:text-charcoal'
                        }`}
                      >
                        {term} mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credit Score Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-body font-medium text-charcoal">Your Credit Score</label>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-caption font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: getTierForScore(creditScore).bgColor,
                          color: getTierForScore(creditScore).color,
                        }}
                      >
                        {getTierForScore(creditScore).name}
                      </span>
                      <span className="text-h4 text-gold font-mono">{creditScore}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={10}
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}
                    className="w-full h-2 bg-sand rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-caption text-warm-gray">0</span>
                    <span className="text-caption text-warm-gray">500</span>
                    <span className="text-caption text-warm-gray">1000</span>
                  </div>
                </div>

                {/* Credit Tier Legend */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {creditTiers.map((tier) => (
                    <div key={tier.name} className="flex items-center gap-1.5 text-caption">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="text-warm-gray">{tier.name} ({tier.minScore}+) • {tier.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            {/* Calculation Results */}
            <SectionReveal delay={0.1}>
              <div className="bg-deep-brown rounded-2xl p-6 lg:p-8 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-h3 text-gold mb-6">Your Estimate</h3>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-body text-warm-gray">Loan Amount</span>
                      <span className="text-h4 text-white font-mono">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-body text-warm-gray">Term</span>
                      <span className="text-h4 text-white">{loanTerm} months</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-body text-warm-gray">Interest Rate</span>
                      <span className="text-h4 font-mono" style={{ color: getTierForScore(creditScore).color }}>
                        {interestRate}%/month
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-body text-warm-gray">Total Interest</span>
                      <span className="text-h4 text-white font-mono">${totalInterest.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white/5 border border-gold/30 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body text-warm-gray">Monthly Payment</span>
                    <span className="text-stat-number text-gold font-mono" style={{ fontSize: '2rem' }}>
                      ${isFinite(monthlyPayment) && monthlyPayment > 0 ? monthlyPayment.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-warm-gray">Total Repayment</span>
                    <span className="text-body font-mono text-white/80">
                      ${isFinite(totalRepayment) ? totalRepayment.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-gold/10 border border-gold/20 rounded-lg p-3 text-center">
                  <p className="text-body-small text-gold">
                    ${loanAmount.toLocaleString()} × {loanTerm} months × {interestRate}% = ${isFinite(monthlyPayment) && monthlyPayment > 0 ? monthlyPayment.toFixed(2) : '0.00'}/month
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 4: LOAN PRODUCTS ═══════════ */}
      <section className="bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12 lg:mb-16">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">Products</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">Loan Products</h2>
            <p className="text-h4 text-gold font-khmer">ផលិតផលកម្ចី</p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {loanProducts.map((product, idx) => {
              const ProductIcon = product.icon;
              return (
                <SectionReveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    className={`bg-white border rounded-2xl p-6 lg:p-8 h-full flex flex-col hover:shadow-feature transition-all duration-300 ${
                      product.featured ? 'border-gold border-2' : 'border-sand hover:border-gold/50'
                    }`}
                  >
                    {product.featured && (
                      <div className="mb-3">
                        <span className="bg-gradient-to-r from-coral to-warning text-white text-caption font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ProductIcon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-h4 text-charcoal">{product.title}</h3>
                        <p className="text-caption text-gold font-khmer">{product.titleKm}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-cream rounded-lg p-3 text-center">
                        <p className="text-caption text-warm-gray mb-1">Amount</p>
                        <p className="text-body-small font-semibold text-charcoal font-mono">{product.amount}</p>
                      </div>
                      <div className="bg-cream rounded-lg p-3 text-center">
                        <p className="text-caption text-warm-gray mb-1">Term</p>
                        <p className="text-body-small font-semibold text-charcoal">{product.term}</p>
                      </div>
                      <div className="bg-cream rounded-lg p-3 text-center">
                        <p className="text-caption text-warm-gray mb-1">Rate</p>
                        <p className="text-body-small font-semibold text-gold font-mono">{product.rate}</p>
                      </div>
                    </div>

                    <p className="text-body-small text-warm-gray mb-2">{product.forDescription}</p>

                    <div className="flex items-center gap-2 mb-5">
                      <Shield className="w-4 h-4 text-emerald flex-shrink-0" />
                      <p className="text-caption text-emerald">{product.requires}</p>
                    </div>

                    <div className="mt-auto">
                      <button className={`w-full py-3 px-6 rounded-xl font-semibold text-button-small transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        product.featured
                          ? 'bg-gold text-deep-brown shadow-gold hover:bg-gold-dark hover:shadow-gold-hover'
                          : 'border-2 border-gold text-gold hover:bg-gold/10'
                      }`}>
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 5: PARTNER BANKS ═══════════ */}
      <section className="bg-cream py-16 md:py-20 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12 lg:mb-16">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">Partners</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">Partner Banks</h2>
            <p className="text-h4 text-gold font-khmer">ធនាគារដៃគូ</p>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bankPartners.map((bank, idx) => {
              const BankIcon = bank.icon;
              return (
                <SectionReveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    className="bg-white border border-sand rounded-2xl p-6 text-center hover:border-gold/50 hover:shadow-card-hover transition-all duration-300 h-full"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BankIcon className="w-8 h-8 text-gold" />
                    </div>

                    <h3 className="text-h4 text-charcoal mb-2">{bank.name}</h3>
                    <p className="text-body-small text-warm-gray mb-4 leading-relaxed">{bank.description}</p>

                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {bank.products.map((p, pIdx) => (
                        <span key={pIdx} className="bg-cream text-charcoal text-caption px-2 py-1 rounded-full">
                          {p}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 6: SUCCESS STORIES ═══════════ */}
      <section className="bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="max-w-container-desktop mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12 lg:mb-16">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">Stories</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">Success Stories</h2>
            <p className="text-h4 text-gold font-khmer">រឿងរ៉ាវជោគជ័យ</p>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((story, idx) => (
              <SectionReveal key={idx} delay={idx * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="bg-cream rounded-2xl p-6 lg:p-8 h-full flex flex-col hover:shadow-feature transition-all duration-300"
                >
                  {/* Quote mark */}
                  <div className="text-gold text-5xl font-display leading-none mb-2">&ldquo;</div>

                  <p className="text-body text-charcoal leading-relaxed mb-6 flex-1">{story.story}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-deep-brown font-bold">
                      {story.initial}
                    </div>
                    <div>
                      <p className="text-body font-semibold text-charcoal">{story.name}</p>
                      <p className="text-caption text-warm-gray">{story.role}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-sand">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-caption text-warm-gray">Loan Amount</span>
                      <span className="text-body font-bold text-gold font-mono">{story.loanAmount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                      <span className="text-caption text-emerald">{story.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 7: FAQ ═══════════ */}
      <section className="bg-cream py-16 md:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <SectionReveal className="text-center mb-12">
            <span className="text-gold text-caption font-medium tracking-wider uppercase">FAQ</span>
            <h2 className="text-h2 text-charcoal mt-2 mb-2">Frequently Asked Questions</h2>
            <p className="text-h4 text-gold font-khmer">សំណួរញឹកញាប់</p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <FAQAccordion items={faqItems} />
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════ SECTION 8: CTA ═══════════ */}
      <section className="bg-deep-brown py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <SectionReveal>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-gold" />
              </div>

              <h2 className="text-h2 text-white mb-2">Check Your Loan Eligibility</h2>
              <p className="text-h4 text-gold font-khmer mb-6">ពិនិត្យលក្ខខណ្ឌកម្ចីរបស់អ្នក</p>

              <p className="text-body-large text-warm-gray mb-8 max-w-lg mx-auto">
                Enter your KhmerHR Credit Score to see which loan products you qualify for and what rate you&apos;ll receive.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="number"
                  min={0}
                  max={1000}
                  placeholder="Enter credit score (0-1000)"
                  value={checkScore}
                  onChange={(e) => setCheckScore(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 text-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  onClick={handleCheckEligibility}
                  className="bg-gold text-deep-brown font-semibold px-8 py-4 rounded-xl shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover active:scale-[0.98] transition-all duration-200 text-button whitespace-nowrap"
                >
                  Check Now
                </button>
              </div>

              {checkResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="mt-8 bg-white/5 border border-gold/30 rounded-2xl p-6 text-left"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: checkResult.color }}
                    />
                    <span className="text-h3 text-white">{checkResult.name} Tier</span>
                    <span className="text-h4 font-mono" style={{ color: checkResult.color }}>
                      {checkResult.rate}%/month
                    </span>
                  </div>

                  <p className="text-body text-warm-gray mb-4">
                    With a credit score of <strong className="text-white">{checkScore}</strong>, you qualify for the{' '}
                    <strong style={{ color: checkResult.color }}>{checkResult.name}</strong> tier with a monthly interest rate of{' '}
                    <strong className="text-gold">{checkResult.rate}%</strong>.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {loanProducts
                      .filter((_, i) => {
                        if (checkResult.name === 'Platinum') return true;
                        if (checkResult.name === 'Gold') return i !== 0;
                        if (checkResult.name === 'Silver') return i === 0 || i === 2;
                        return i === 0;
                      })
                      .map((product, pIdx) => {
                        const MiniIcon = product.icon;
                        return (
                          <div key={pIdx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                            <MiniIcon className="w-5 h-5 text-gold flex-shrink-0" />
                            <div>
                              <p className="text-body-small text-white font-medium">{product.title}</p>
                              <p className="text-caption text-warm-gray">{product.amount}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              <div className="mt-8 flex items-center justify-center gap-2 text-warm-gray">
                <Clock className="w-4 h-4" />
                <span className="text-body-small">Approval in as fast as 48 hours</span>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
