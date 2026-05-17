import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck,
  Check,
  X,
  ChevronDown,
  Upload,
  Users,
  HandCoins,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
} from 'lucide-react';

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

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.7, ease: easeOutExpo } },
});

/* ─── Feature data ─── */
const featureCategories = [
  {
    name: 'Job Posting',
    features: [
      { name: 'Job Postings', basic: '3 active', pro: '15 active', enterprise: 'Unlimited' },
      { name: 'Listing Duration', basic: '7 days', pro: '30 days', enterprise: 'Unlimited' },
      { name: 'Bulk Job Upload', basic: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Visibility',
    features: [
      { name: 'Verified Badge', basic: false, pro: true, enterprise: true },
      { name: 'Priority Placement', basic: false, pro: true, enterprise: 'Top' },
      { name: 'Social Sharing', basic: 'Basic', pro: 'Enhanced', enterprise: 'Custom branded' },
      { name: 'Custom Branding', basic: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Candidate Access',
    features: [
      { name: 'Resume Database', basic: false, pro: '50 views/mo', enterprise: 'Unlimited' },
      { name: 'Candidate Messaging', basic: 'Email only', pro: '+ Messenger', enterprise: '+ All channels' },
      { name: 'Candidate Notes', basic: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Analytics & Tools',
    features: [
      { name: 'Analytics Dashboard', basic: false, pro: 'Basic', enterprise: 'Advanced' },
      { name: 'API Access', basic: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Support',
    features: [
      { name: 'Account Manager', basic: false, pro: false, enterprise: 'Dedicated' },
      { name: 'Customer Support', basic: 'Email', pro: 'Email + Chat', enterprise: '24/7 Priority' },
      { name: 'Success Commission', basic: '15%', pro: '10%', enterprise: '5-8%' },
    ],
  },
];

/* ─── FAQ data ─── */
const faqData = [
  {
    q: 'Is KhmerHR really free to start?',
    a: "Yes! You can post up to 3 jobs and browse candidate profiles completely free. You only pay when you successfully hire through our platform.",
  },
  {
    q: 'How does the success fee work?',
    a: "Our success fee is a percentage of the hired candidate's first-month salary. For Basic it's 15%, Professional 10%, and Enterprise 5-8%. This fee is only charged after the candidate starts working.",
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Absolutely. Upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle. We\'ll prorate any difference.',
  },
  {
    q: 'Do you offer support in Chinese?',
    a: 'Yes. Our Enterprise plan includes bilingual account managers who speak Khmer, Chinese, and English. Professional plans have email support in all three languages.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept ABA Bank transfers, Wing payments, credit/debit cards, and Alipay for Chinese enterprises. Enterprise clients can also request invoicing.',
  },
  {
    q: 'How long does employer verification take?',
    a: 'Most verifications are completed within 24-48 hours after you submit your business documents. Enterprise clients get priority review within 12 hours.',
  },
  {
    q: 'Is there a contract or minimum commitment?',
    a: 'No long-term contracts. Monthly plans can be cancelled anytime. Annual plans offer a 20% discount but can be cancelled with 30 days notice.',
  },
  {
    q: 'What if a hired candidate leaves quickly?',
    a: 'We offer a 30-day replacement guarantee. If a candidate leaves within 30 days of joining, we\'ll help you find a replacement at no additional success fee.',
  },
];

/* ─── Cell value renderer ─── */
function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={20} className="text-emerald mx-auto" />;
  if (value === false) return <X size={20} className="text-warm-gray/30 mx-auto" />;
  return <span className="text-body-small text-charcoal">{value}</span>;
}

/* ─── Accordion Item ─── */
function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: easeSmooth }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isOpen ? 'border-gold bg-[#FFFBF5]' : 'border-sand bg-white'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-h4 text-charcoal pr-4">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: easeSmooth }}>
          <ChevronDown size={20} className={`shrink-0 transition-colors ${isOpen ? 'text-gold' : 'text-warm-gray'}`} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: easeSmooth }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="px-4 pb-4 text-body text-warm-gray">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN PAGE COMPONENT ══════════ */
/* ═══════════════════════════════════════════ */
export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    yourName: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    annualHires: '',
    message: '',
  });
  const savingsRef = useRef(null);
  const savingsInView = useInView(savingsRef, { once: true, amount: 0.5 });

  const proPrice = isAnnual ? '$79' : '$99';

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo submission
    alert('Thank you! Our team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-[100dvh]">
      {/* ════════ SECTION 1: HERO ════════ */}
      <section className="bg-deep-brown pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="mx-auto px-4 md:px-8 max-w-[700px] text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-caption text-warm-gray mb-2"
          >
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">Pricing</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
            className="text-caption text-gold tracking-[0.15em] uppercase mb-4"
          >
            PRICING
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
            className="text-hero-title font-display text-warm-white mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easeSmooth }}
            className="text-body-large text-warm-white/70 mb-4"
          >
            Choose the plan that fits your hiring needs. No hidden fees. Pay for results, not promises.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-body-small text-emerald"
          >
            <ShieldCheck size={16} />
            30-day money-back guarantee
          </motion.p>
        </div>
      </section>

      {/* ════════ SECTION 2: PRICING TIERS ════════ */}
      <section className="bg-warm-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          {/* Toggle */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={`text-body-small ${!isAnnual ? 'text-charcoal font-semibold' : 'text-warm-gray'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full transition-colors duration-200"
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
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Basic */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -6 }}
              className="rounded-[1.25rem] p-10 bg-white border border-sand shadow-card"
            >
              <h3 className="text-h3 text-charcoal mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-stat-number text-charcoal">$0</span>
                <span className="text-body-small text-warm-gray">/ month</span>
              </div>
              <div className="bg-gold/10 rounded-lg px-3 py-2 mb-4 inline-block">
                <span className="text-caption text-[#B8941F]">Success fee: 15%</span>
              </div>
              <p className="text-body-small text-warm-gray mb-6">Post jobs for free. Pay only when you successfully hire.</p>
              <ul className="space-y-3 mb-8">
                {[
                  '3 active job postings',
                  'Basic candidate profiles',
                  'Email notifications',
                  '7-day listing duration',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-small text-charcoal">
                    <Check size={18} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
                {[
                  'Verified badge',
                  'Priority placement',
                  'Resume database',
                  'Analytics',
                ].map((f, i) => (
                  <li key={`x-${i}`} className="flex items-center gap-2 text-body-small text-warm-gray/50">
                    <X size={18} className="text-warm-gray/30 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/employers"
                className="block w-full text-center py-3.5 rounded-xl font-semibold min-h-[56px] flex items-center justify-center border-2 border-gold text-gold hover:bg-gold/10 transition-all duration-200"
              >
                Start Free
              </Link>
            </motion.div>

            {/* Professional (Featured) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo, delay: 0.15 } },
              }}
              whileHover={{ y: -8 }}
              className="relative rounded-[1.25rem] p-10 bg-[#FFFBF5] border-2 border-gold shadow-[0_8px_32px_rgba(212,175,55,0.15)]"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-deep-brown text-caption font-semibold px-4 py-1.5 rounded-full">
                Most Popular
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-[1.25rem]" />
              <h3 className="text-h3 text-charcoal mb-2">Professional</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <motion.span
                  key={proPrice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-stat-number text-gold"
                >
                  {proPrice}
                </motion.span>
                <span className="text-body-small text-warm-gray">/ month</span>
              </div>
              <div className="bg-gold/10 rounded-lg px-3 py-2 mb-4 inline-block">
                <span className="text-caption text-[#B8941F]">Success fee: 10%</span>
              </div>
              <p className="text-body-small text-warm-gray mb-6">For growing businesses. Lower commission, more features.</p>
              <ul className="space-y-3 mb-8">
                {[
                  '15 active job postings',
                  'Full candidate profiles',
                  'Verified badge',
                  'Priority placement',
                  '30-day listing duration',
                  'Resume DB (50/month)',
                  'Messenger integration',
                  'Basic analytics',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-small text-charcoal">
                    <Check size={18} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-body-small text-warm-gray/50">
                  <X size={18} className="text-warm-gray/30 shrink-0" />
                  Dedicated account manager
                </li>
              </ul>
              <Link
                to="/employers"
                className="block w-full text-center py-3.5 rounded-xl font-semibold min-h-[56px] flex items-center justify-center bg-gold text-deep-brown shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
              >
                Start Professional
              </Link>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={staggerChild}
              whileHover={{ y: -6 }}
              className="rounded-[1.25rem] p-10 bg-white border border-sand shadow-card"
            >
              <h3 className="text-h3 text-charcoal mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-stat-number text-charcoal">Custom</span>
              </div>
              <div className="bg-gold/10 rounded-lg px-3 py-2 mb-4 inline-block">
                <span className="text-caption text-[#B8941F]">Success fee: 5-8%</span>
              </div>
              <p className="text-body-small text-warm-gray mb-6">For large organizations. Full-service recruitment.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited job postings',
                  'Full candidate profiles + notes',
                  'Verified badge',
                  'Top priority placement',
                  'Unlimited listing duration',
                  'Full resume database access',
                  'All messaging integrations',
                  'Advanced analytics dashboard',
                  'Dedicated account manager',
                  'Custom branding + API access',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-small text-charcoal">
                    <Check size={18} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center py-3.5 rounded-xl font-semibold min-h-[56px] flex items-center justify-center bg-coral text-white shadow-coral hover:bg-coral-dark hover:scale-[1.03] transition-all duration-200"
              >
                Contact Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 3: FEATURE COMPARISON TABLE ════════ */}
      <section className="bg-cream py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <h2 className="text-h2 text-charcoal mb-2">Compare All Features</h2>
            <p className="text-body text-warm-gray">See exactly what you get with each plan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-charcoal text-warm-white">
                  <th className="text-left text-h4 font-semibold p-4 rounded-tl-xl w-[35%]">Feature</th>
                  <th className="text-center text-h4 font-semibold p-4 w-[22%]">Basic</th>
                  <th className="text-center text-h4 font-semibold p-4 w-[22%]">Professional</th>
                  <th className="text-center text-h4 font-semibold p-4 rounded-tr-xl w-[22%]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    <tr>
                      <td
                        colSpan={4}
                        className="text-caption text-gold font-semibold uppercase tracking-wider pt-5 pb-2 px-4"
                      >
                        {cat.name}
                      </td>
                    </tr>
                    {cat.features.map((f, fi) => {
                      const rowIdx = ci * 10 + fi;
                      return (
                        <motion.tr
                          key={fi}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: fi * 0.03, duration: 0.4 }}
                          className={`border-b border-sand transition-colors duration-150 hover:bg-warm-white/60 ${
                            fi % 2 === 0 ? 'bg-white' : 'bg-warm-white/40'
                      }`}
                        >
                          <td className="p-4 text-body-small text-charcoal font-medium">{f.name}</td>
                          <td className="p-4 text-center">
                            <CellValue value={f.basic} />
                          </td>
                          <td className="p-4 text-center">
                            <CellValue value={f.pro} />
                          </td>
                          <td className="p-4 text-center">
                            <CellValue value={f.enterprise} />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 4: EFFECT-BASED MODEL EXPLAINER ════════ */}
      <section className="bg-deep-brown py-12 md:py-16 lg:py-20" ref={savingsRef}>
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">PAY FOR RESULTS</p>
            <h2 className="text-h2 text-warm-white mb-3">You Win, We Win</h2>
            <p className="text-body text-warm-white/70 max-w-[600px] mx-auto">
              Our success-based pricing means we&apos;re invested in your hiring success. No hire, no fee.
            </p>
          </motion.div>

          {/* 3-step flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
            {/* Arrows - desktop */}
            <div className="hidden md:flex absolute top-16 left-[30%] right-[30%] justify-between z-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <ArrowRight size={24} className="text-gold" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <ArrowRight size={24} className="text-gold" />
              </motion.div>
            </div>

            {[
              {
                icon: Upload,
                title: 'Post Your Job',
                desc: 'List your position at no cost. Describe the role, requirements, and salary.',
                badge: '$0',
                color: 'gold',
              },
              {
                icon: Users,
                title: 'Review Applicants',
                desc: 'Browse verified candidate profiles. Filter by experience, skills, and language.',
                badge: 'Verified',
                color: 'gold',
              },
              {
                icon: HandCoins,
                title: 'Pay When You Hire',
                desc: 'Only pay our success fee when a candidate joins your team. No hidden charges.',
                badge: '5-15%',
                color: 'emerald',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: easeOutExpo }}
                className="text-center"
              >
                <motion.div
                  className={`w-14 h-14 ${step.color === 'emerald' ? 'bg-emerald/10' : 'bg-gold/10'} rounded-full flex items-center justify-center mx-auto mb-4`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.4, ease: easeBounce }}
                >
                  <step.icon size={28} className={step.color === 'emerald' ? 'text-emerald' : 'text-gold'} />
                </motion.div>
                <h3 className="text-h3 text-warm-white mb-2">{step.title}</h3>
                <p className="text-body-small text-warm-white/60 max-w-[280px] mx-auto mb-3">{step.desc}</p>
                <span
                  className={`inline-block text-caption font-semibold px-3 py-1 rounded-full ${
                    step.color === 'emerald' ? 'bg-emerald/10 text-emerald' : 'bg-gold/10 text-gold'
                  }`}
                >
                  {step.badge}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Example Calculation Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="max-w-[600px] mx-auto rounded-2xl p-8"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <h4 className="text-h4 text-gold mb-5 text-center">Example: Hiring a $500/month garment worker</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-body-small">
                <span className="text-warm-white/80">Professional plan</span>
                <motion.span
                  className="text-warm-white font-mono"
                  initial={{ opacity: 0 }}
                  animate={savingsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  $99
                </motion.span>
              </div>
              <div className="flex justify-between items-center text-body-small">
                <span className="text-warm-white/80">Success fee (10% of $500)</span>
                <motion.span
                  className="text-warm-white font-mono"
                  initial={{ opacity: 0 }}
                  animate={savingsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  $50
                </motion.span>
              </div>
              <div className="h-px bg-gold/20 my-2" />
              <div className="flex justify-between items-center text-body font-semibold">
                <span className="text-gold">Total first month</span>
                <motion.span
                  className="text-gold font-mono text-lg"
                  initial={{ opacity: 0 }}
                  animate={savingsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.0 }}
                >
                  $149
                </motion.span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={savingsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-5 pt-4 border-t border-gold/20 flex items-center justify-between"
            >
              <span className="text-body-small text-warm-white/60">
                vs. traditional recruiter: $500-750
              </span>
              <span className="text-body font-bold text-emerald animate-pulse-glow rounded-lg px-3 py-1 bg-emerald/10">
                Save 70-80%
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════ SECTION 5: FAQ ACCORDION ════════ */}
      <section className="bg-warm-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 md:px-8 max-w-[800px]">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
          >
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">FAQ</p>
            <h2 className="text-h2 text-charcoal">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 6: CTA / CUSTOM QUOTE FORM ════════ */}
      <section className="py-12 md:py-16 lg:py-20" style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}>
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Text */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              <h2 className="text-h2 text-warm-white mb-4">Need a Custom Solution?</h2>
              <p className="text-body text-warm-white/80 mb-8">
                Large enterprise or special requirements? Our team will build a package that fits your exact hiring needs.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Volume discounts for 50+ annual hires',
                  'Custom integration with your HR system',
                  'Dedicated bilingual account manager',
                  'On-site recruitment support',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-body-small text-warm-white/90"
                  >
                    <CheckCircle size={18} className="text-gold shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-body-small text-gold">
                  <Phone size={16} />
                  <span>+855 23 999 888</span>
                </div>
                <div className="flex items-center gap-2 text-body-small text-gold">
                  <Mail size={16} />
                  <span>enterprise@khmerhr.com</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Company Name</label>
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="Your company"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Your Name</label>
                    <input
                      name="yourName"
                      value={formData.yourName}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="Full name"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="you@company.com"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="+855 XX XXX XXXX"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Company Size</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all appearance-none"
                    >
                      <option value="" className="bg-deep-brown">Select size</option>
                      <option value="1-10" className="bg-deep-brown">1-10</option>
                      <option value="11-50" className="bg-deep-brown">11-50</option>
                      <option value="51-200" className="bg-deep-brown">51-200</option>
                      <option value="201-500" className="bg-deep-brown">201-500</option>
                      <option value="500+" className="bg-deep-brown">500+</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all appearance-none"
                    >
                      <option value="" className="bg-deep-brown">Select industry</option>
                      <option value="garment" className="bg-deep-brown">Garment</option>
                      <option value="tourism" className="bg-deep-brown">Tourism</option>
                      <option value="ict" className="bg-deep-brown">ICT</option>
                      <option value="manufacturing" className="bg-deep-brown">Manufacturing</option>
                      <option value="other" className="bg-deep-brown">Other</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-caption text-warm-white/60 mb-1.5">Est. Annual Hires</label>
                    <select
                      name="annualHires"
                      value={formData.annualHires}
                      onChange={handleFormChange}
                      className="w-full min-h-[56px] px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all appearance-none"
                    >
                      <option value="" className="bg-deep-brown">Select range</option>
                      <option value="1-10" className="bg-deep-brown">1-10</option>
                      <option value="11-50" className="bg-deep-brown">11-50</option>
                      <option value="51-100" className="bg-deep-brown">51-100</option>
                      <option value="100+" className="bg-deep-brown">100+</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.65 }}
                >
                  <label className="block text-caption text-warm-white/60 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-deep-brown/50 border border-white/10 rounded-xl text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                    placeholder="Tell us about your hiring needs..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gold text-deep-brown text-button font-semibold min-h-[56px] shadow-gold hover:bg-gold-dark hover:scale-[1.02] hover:shadow-gold-hover transition-all duration-200"
                  >
                    Request Custom Quote
                  </button>
                </motion.div>

                <p className="text-caption text-warm-white/40 text-center">
                  Your information is secure and will never be shared.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
