import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  HandCoins,
  CreditCard,
  Radio,
  GraduationCap,
  Sparkles,
  BarChart3,
  ArrowRight,
  Check,
  X,
  Building2,
  Landmark,
  Users,
  Globe,
  HeartHandshake,
  TrendingUp,
  Layers,
  Network,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import type { ReactNode } from 'react'

/* ─────────────────────── easing token ─────────────────────── */
const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ─────────────────────── Revenue streams data ─────────────────────── */
interface RevenueStream {
  icon: typeof HandCoins
  title: string
  titleKm: string
  description: string
  pricing: string
  features: string[]
}

const revenueStreams: RevenueStream[] = [
  {
    icon: HandCoins,
    title: 'Commission on Placements',
    titleKm: 'កម្រៃលើការបំពេញការងារ',
    description: 'Earn commission on every successful hire. Our performance-based model ensures you only pay for results.',
    pricing: '15-25% of first-year salary',
    features: [
      'Volume discounts for bulk hiring',
      'Example: $250 commission on $1,500/mo hire',
      'Sliding scale for high-volume employers',
    ],
  },
  {
    icon: CreditCard,
    title: 'Subscription Plans',
    titleKm: 'គម្រោងជាវ',
    description: 'Tiered monthly plans unlock premium features. From free basic access to enterprise-grade solutions.',
    pricing: 'Free / $99/mo / Custom',
    features: [
      'Free: 3 job posts, basic search',
      'Pro ($99/mo): 15 jobs, analytics',
      'Enterprise: unlimited, API access',
    ],
  },
  {
    icon: Radio,
    title: 'Live Recruitment Events',
    titleKm: 'ព្រឹត្តិការណ៍ជ្រើសរើសបុគ្គលិកផ្សាយផ្ទាល់',
    description: 'Host live streaming recruitment sessions and virtual job fairs with pay-per-session pricing.',
    pricing: '$50-200 per session',
    features: [
      'Sponsored job fairs & branded events',
      'Live Q&A and instant applications',
      'Replay access for 30 days',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Skills Training Courses',
    titleKm: 'វគ្គបណ្តុះបណ្តាលជំនាញ',
    description: 'Revenue from course fees, corporate training packages, and certification programs.',
    pricing: 'Free to $50 per course',
    features: [
      'Corporate training packages',
      'Certification exam fees',
      'Revenue share with training partners',
    ],
  },
  {
    icon: Sparkles,
    title: 'Featured & Promoted Listings',
    titleKm: 'បញ្ជីផ្សាយពាណិជ្ជកម្ម',
    description: 'Premium visibility options for employers who want top placement and maximum exposure.',
    pricing: '$5-50 per day/week',
    features: [
      'Top placement: $10/day',
      'Highlighted listings: $5/day',
      'Homepage featured employer: $50/week',
    ],
  },
  {
    icon: BarChart3,
    title: 'Data & Analytics Services',
    titleKm: 'សេវាកម្មទិន្នន័យ និងវិភាគ',
    description: 'Sell aggregated market insights, salary reports, and custom research to enterprise clients.',
    pricing: 'Custom pricing',
    features: [
      'Salary reports & market insights',
      'Talent pool analytics',
      'Custom research reports',
    ],
  },
]

/* ─────────────────────── Pricing tiers data ─────────────────────── */
interface PricingTier {
  name: string
  nameKm: string
  price: string
  period: string
  description: string
  features: { text: string; included: boolean }[]
  featured: boolean
  cta: string
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    nameKm: 'ឥតគិតថ្លៃ',
    price: '$0',
    period: 'forever',
    description: 'Perfect for small businesses just getting started.',
    features: [
      { text: '3 active job postings', included: true },
      { text: 'Basic candidate search', included: true },
      { text: 'Standard support', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Company profile page', included: true },
      { text: 'Priority listing', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Interview scheduling', included: false },
      { text: 'Resume database access', included: false },
      { text: 'API access', included: false },
      { text: 'Dedicated account manager', included: false },
      { text: 'White-label options', included: false },
      { text: 'Custom integrations', included: false },
      { text: 'Bulk import tools', included: false },
      { text: 'SSO authentication', included: false },
    ],
    featured: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    nameKm: 'ប្រូ',
    price: '$99',
    period: '/month',
    description: 'Best for growing companies with regular hiring needs.',
    features: [
      { text: '15 active job postings', included: true },
      { text: 'Advanced candidate search', included: true },
      { text: 'Priority support (24h)', included: true },
      { text: 'Email + SMS notifications', included: true },
      { text: 'Enhanced company profile', included: true },
      { text: 'Priority listing placement', included: true },
      { text: 'Full analytics dashboard', included: true },
      { text: 'Interview scheduling tools', included: true },
      { text: 'Resume database access', included: true },
      { text: 'API access (limited)', included: false },
      { text: 'Dedicated account manager', included: false },
      { text: 'White-label options', included: false },
      { text: 'Custom integrations', included: false },
      { text: 'Bulk import tools', included: true },
      { text: 'SSO authentication', included: false },
    ],
    featured: true,
    cta: 'Start Pro Trial',
  },
  {
    name: 'Enterprise',
    nameKm: 'សហគ្រាស',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations with complex hiring workflows.',
    features: [
      { text: 'Unlimited job postings', included: true },
      { text: 'AI-powered candidate matching', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Full API access', included: true },
      { text: 'White-label career portal', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Advanced analytics & reports', included: true },
      { text: 'SSO & SAML authentication', included: true },
      { text: 'Bulk import & data migration', included: true },
      { text: 'On-premise deployment option', included: true },
      { text: 'SLA guarantee (99.9% uptime)', included: true },
      { text: 'Custom contract terms', included: true },
      { text: 'Quarterly business reviews', included: true },
      { text: 'Priority feature requests', included: true },
      { text: 'Training & onboarding sessions', included: true },
    ],
    featured: false,
    cta: 'Contact Sales',
  },
]

/* ─────────────────────── Partner types ─────────────────────── */
interface Partner {
  icon: typeof Building2
  title: string
  description: string
  revenueModel: string
}

const partners: Partner[] = [
  {
    icon: Landmark,
    title: 'Banking Partners',
    description: 'Partner with banks to offer salary-backed loan referrals to placed candidates.',
    revenueModel: 'Referral commission per approved loan',
  },
  {
    icon: GraduationCap,
    title: 'Training Institutes',
    description: 'Collaborate with vocational schools and training centers for upskilling candidates.',
    revenueModel: 'Revenue share on course enrollments',
  },
  {
    icon: Globe,
    title: 'Government',
    description: 'Support the Digital Cambodia initiative by connecting talent with digital economy jobs.',
    revenueModel: 'Funded placement programs',
  },
  {
    icon: HeartHandshake,
    title: 'NGOs',
    description: 'Work with NGOs on workforce development and youth employment programs.',
    revenueModel: 'Per-placement program fees',
  },
  {
    icon: Building2,
    title: 'Corporate Sponsors',
    description: 'Enable brands to sponsor events, job fairs, and featured employer spots.',
    revenueModel: 'Sponsorship & branded event fees',
  },
]

/* ─────────────────────── Revenue projections data ─────────────────────── */
const revenueData = [
  { year: 'Year 1', revenue: 120, phase: 'Startup' },
  { year: 'Year 2', revenue: 480, phase: 'Growth' },
  { year: 'Year 3', revenue: 1200, phase: 'Scale' },
]

const barColors = ['#D4AF37', '#059669', '#E85D3E']

/* ─────────────────────── Value props data ─────────────────────── */
interface ValueProp {
  icon: typeof TrendingUp
  title: string
  description: string
}

const valueProps: ValueProp[] = [
  {
    icon: ShieldCheck,
    title: 'Win-Win Model',
    description: 'Employers only pay for successful placements. Job seekers access opportunities for free. A true zero-risk partnership.',
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Digital platform with near-zero marginal cost per transaction. Every new user increases value without proportional cost increases.',
  },
  {
    icon: Network,
    title: 'Network Effects',
    description: 'More employers attract more job seekers. More job seekers attract more employers. Data improves matching quality over time.',
  },
  {
    icon: TrendingUp,
    title: 'Multiple Revenue Streams',
    description: 'Six distinct income sources mean the business is never dependent on a single revenue channel. Diversified and resilient.',
  },
]

/* ─────────────────────── Animated Counter ─────────────────────── */
function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
}: {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ─────────────────────── Section Wrapper ─────────────────────── */
function Section({
  children,
  className = '',
  id = '',
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}

/* ─────────────────────── Main Page Component ─────────────────────── */
export default function Business() {
  return (
    <main className="min-h-[100dvh]">
      <HeroSection />
      <RevenueStreamsSection />
      <PricingTiersSection />
      <PartnersSection />
      <RevenueProjectionsSection />
      <WhyItWorksSection />
      <CTASection />
    </main>
  )
}

/* ═══════════════ Section 1: Hero ═══════════════ */
function HeroSection() {
  return (
    <Section className="relative overflow-hidden bg-[#1A1714] min-h-[100dvh] flex items-center">
      {/* Gold gradient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1714] via-[#2D2926] to-[#1A1714]" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-4">
            Our Commercial Model
          </span>
          <h1 className="text-hero-title font-display text-white mb-4">
            Business Model
          </h1>
          <p className="font-khmer text-[#F5E6A3] text-lg lg:text-xl mb-3 opacity-80">
            ម៉ូដែលអាជីវកម្ម
          </p>
          <p className="font-chinese text-[#D4AF37] text-lg mb-8 opacity-60">
            商业模式
          </p>
          <p className="text-body-large text-[#9C9588] max-w-2xl mx-auto">
            Our sustainable multi-revenue ecosystem powering Cambodia&apos;s recruitment revolution
          </p>
        </motion.div>

        {/* Revenue Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 mb-16 lg:mb-20"
        >
          {[
            { label: 'Employers', labelKm: 'និយោជក', icon: Building2 },
            { label: 'Job Seekers', labelKm: 'អ្នកស្វែងរកការងារ', icon: Users },
            { label: 'Training', labelKm: 'ការបណ្តុះបណ្តាល', icon: GraduationCap },
            { label: 'Partners', labelKm: 'ដៃគូ', icon: HeartHandshake },
            { label: 'Platform', labelKm: 'វេទិកា', icon: Sparkles },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[#2D2926] border border-[#D4AF37]/30 flex items-center justify-center mb-2">
                  <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-[#D4AF37]" />
                </div>
                <span className="text-white text-xs lg:text-sm font-medium">{item.label}</span>
                <span className="font-khmer text-[#9C9588] text-[10px]">{item.labelKm}</span>
              </div>
              {i < 4 && (
                <ChevronRight className="w-5 h-5 text-[#D4AF37]/50 hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* 5 Core Revenue Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6"
        >
          {[
            { label: 'Commission', value: 25, suffix: '%', sub: 'of first-year salary' },
            { label: 'Pro Plan', value: 99, prefix: '$', suffix: '/mo', sub: 'monthly subscription' },
            { label: 'Live Events', value: 200, prefix: '$', suffix: '+', sub: 'per session revenue' },
            { label: 'Course Fees', value: 50, prefix: '$', suffix: '', sub: 'per training course' },
            { label: 'Featured Ads', value: 50, prefix: '$', suffix: '/wk', sub: 'homepage placement' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 lg:p-5 rounded-xl bg-[#2D2926]/60 border border-[#D4AF37]/15"
            >
              <div className="text-stat-number font-mono text-[#D4AF37] mb-1">
                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-white text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-[#9C9588] text-caption">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

/* ═══════════════ Section 2: Revenue Streams ═══════════════ */
function RevenueStreamsSection() {
  return (
    <Section className="bg-[#FAF8F3] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-3">
            Revenue Streams
          </span>
          <h2 className="text-h2 font-display text-[#2D2926] mb-2">
            How We Generate Revenue
          </h2>
          <p className="font-khmer text-[#9C9588] text-sm mb-2">
            របៀបដែលយើងបង្កើតចំណូល
          </p>
          <p className="text-body text-[#9C9588] max-w-2xl mx-auto">
            Six diversified revenue streams create a sustainable, scalable business model
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {revenueStreams.map((stream, index) => (
            <RevenueStreamCard key={stream.title} stream={stream} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function RevenueStreamCard({
  stream,
  index,
}: {
  stream: RevenueStream
  index: number
}) {
  const Icon = stream.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="group bg-white rounded-2xl border border-[#E8E0D0] p-6 lg:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)] hover:border-[#D4AF37]/50"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#F5E6A3]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-[#D4AF37]" />
      </div>

      <h3 className="text-h4 font-display text-[#2D2926] mb-1">{stream.title}</h3>
      <p className="font-khmer text-caption text-[#9C9588] mb-3">{stream.titleKm}</p>
      <p className="text-body-small text-[#9C9588] mb-4">{stream.description}</p>

      <div className="inline-block px-3 py-1.5 rounded-lg bg-[#F5F0E8] text-[#B8941F] text-sm font-mono font-medium mb-4">
        {stream.pricing}
      </div>

      <ul className="space-y-2 mb-5">
        {stream.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
            <span className="text-body-small text-[#2D2926]">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="inline-flex items-center gap-1 text-[#D4AF37] text-sm font-medium hover:gap-2 transition-all duration-200"
      >
        Learn More
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

/* ═══════════════ Section 3: Pricing Tiers Deep Dive ═══════════════ */
function PricingTiersSection() {
  return (
    <Section className="bg-[#F5F0E8] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-3">
            Pricing Plans
          </span>
          <h2 className="text-h2 font-display text-[#2D2926] mb-2">
            Choose Your Plan
          </h2>
          <p className="font-khmer text-[#9C9588] text-sm mb-2">
            ជ្រើសរើសគម្រោងរបស់អ្នក
          </p>
          <p className="text-body text-[#9C9588] max-w-2xl mx-auto">
            From free basic access to fully customized enterprise solutions
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease }}
          className="bg-white rounded-2xl border border-[#E8E0D0] overflow-hidden"
        >
          <div className="p-4 lg:p-6 border-b border-[#E8E0D0] bg-[#FAF8F3]">
            <h3 className="text-h4 font-display text-[#2D2926]">Full Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E8E0D0]">
                  <th className="text-left p-4 text-sm font-semibold text-[#2D2926]">Feature</th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.name} className="text-center p-4 text-sm font-semibold text-[#2D2926]">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingTiers[0].features.map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]/50'}
                  >
                    <td className="p-4 text-body-small text-[#2D2926]">
                      {pricingTiers[0].features[rowIndex].text}
                    </td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.name} className="text-center p-4">
                        {tier.features[rowIndex].included ? (
                          <Check className="w-5 h-5 text-[#059669] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#9C9588]/40 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease }}
      className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-2 ${
        tier.featured
          ? 'bg-white border-2 border-[#D4AF37] shadow-[0_24px_48px_rgba(212,175,55,0.15)]'
          : 'bg-white border-2 border-[#E8E0D0] hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)]'
      }`}
    >
      {tier.featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-[#1A1714] text-caption font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {tier.featured && (
        <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37] rounded-full mb-6 -mt-2" />
      )}

      <h3 className="text-h3 font-display text-[#2D2926] mb-1">{tier.name}</h3>
      <p className="font-khmer text-caption text-[#9C9588] mb-3">{tier.nameKm}</p>
      <p className="text-body-small text-[#9C9588] mb-4">{tier.description}</p>

      <div className="mb-6">
        <span className="text-3xl lg:text-4xl font-bold font-mono text-[#2D2926]">{tier.price}</span>
        <span className="text-[#9C9588] text-sm ml-1">{tier.period}</span>
      </div>

      <ul className="space-y-2.5 mb-6">
        {tier.features.slice(0, 6).map((feature) => (
          <li key={feature.text} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-[#9C9588]/30 mt-0.5 flex-shrink-0" />
            )}
            <span className={`text-body-small ${feature.included ? 'text-[#2D2926]' : 'text-[#9C9588]/50'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`w-full py-3 px-6 rounded-xl font-semibold text-button-small transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
          tier.featured
            ? 'bg-[#D4AF37] text-[#1A1714] shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:bg-[#B8941F] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)]'
            : 'bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10'
        }`}
      >
        {tier.cta}
      </button>
    </motion.div>
  )
}

/* ═══════════════ Section 4: Ecosystem Partners ═══════════════ */
function PartnersSection() {
  return (
    <Section className="bg-[#FAF8F3] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-3">
            Ecosystem
          </span>
          <h2 className="text-h2 font-display text-[#2D2926] mb-2">
            Our Partner Network
          </h2>
          <p className="font-khmer text-[#9C9588] text-sm mb-2">
            បណ្តាញដៃគូរបស់យើង
          </p>
          <p className="text-body text-[#9C9588] max-w-2xl mx-auto">
            Strategic partnerships that expand our value proposition and revenue potential
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease }}
              className="group bg-white rounded-2xl border border-[#E8E0D0] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)] hover:border-[#D4AF37]/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#059669]/10 to-[#34D399]/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <partner.icon className="w-7 h-7 text-[#059669]" />
              </div>
              <h3 className="text-h4 font-display text-[#2D2926] mb-2">{partner.title}</h3>
              <p className="text-body-small text-[#9C9588] mb-3">{partner.description}</p>
              <div className="pt-3 border-t border-[#E8E0D0]">
                <span className="text-caption text-[#059669] font-medium">{partner.revenueModel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════ Section 5: Revenue Projections ═══════════════ */
function RevenueProjectionsSection() {
  const CustomTooltip = useCallback(
    ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { year: string; phase: string } }> }) => {
      if (active && payload && payload.length) {
        const data = payload[0]
        return (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-[#E8E0D0]">
            <p className="font-semibold text-[#2D2926]">{data.payload.year}</p>
            <p className="text-[#D4AF37] font-mono text-lg font-bold">
              ${data.value.toLocaleString()}K
            </p>
            <p className="text-[#9C9588] text-caption">{data.payload.phase} Phase</p>
          </div>
        )
      }
      return null
    },
    [],
  )

  return (
    <Section className="bg-[#1A1714] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-3">
            Projections
          </span>
          <h2 className="text-h2 font-display text-white mb-2">
            Revenue Projections
          </h2>
          <p className="font-khmer text-[#9C9588] text-sm mb-2">
            ការព្យាករណ៍ចំណូល
          </p>
          <p className="text-body text-[#9C9588] max-w-2xl mx-auto">
            Conservative growth forecast based on Cambodia&apos;s expanding digital economy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="bg-[#2D2926] rounded-2xl border border-[#D4AF37]/15 p-6 lg:p-10"
        >
          <div className="h-[320px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={80} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3936" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#FAF8F3', fontSize: 14 }}
                  axisLine={{ stroke: '#3D3936' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9C9588', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `$${value}K`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.05)' }} />
                <Bar dataKey="revenue" radius={[12, 12, 0, 0]}>
                  {revenueData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index]} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Phase labels */}
          <div className="flex justify-center gap-8 lg:gap-16 mt-8">
            {revenueData.map((item, i) => (
              <div key={item.year} className="text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: barColors[i] }}
                />
                <p className="text-white text-sm font-medium">{item.year}</p>
                <p className="text-[#9C9588] text-caption">{item.phase}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

/* ═══════════════ Section 6: Why It Works ═══════════════ */
function WhyItWorksSection() {
  return (
    <Section className="bg-[#F5F0E8] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="inline-block text-[#D4AF37] text-caption uppercase tracking-[0.15em] mb-3">
            Competitive Edge
          </span>
          <h2 className="text-h2 font-display text-[#2D2926] mb-2">
            Why Our Model Works
          </h2>
          <p className="font-khmer text-[#9C9588] text-sm mb-2">
            ហេតុអ្វីបានជាម៉ូដែលរបស់យើងដំណើរការ
          </p>
          <p className="text-body text-[#9C9588] max-w-2xl mx-auto">
            Four structural advantages that make this business model defensible and scalable
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease }}
              className="group bg-white rounded-2xl border border-[#E8E0D0] p-6 lg:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)] hover:border-[#D4AF37]/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#F5E6A3]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <prop.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-h4 font-display text-[#2D2926] mb-3">{prop.title}</h3>
              <p className="text-body-small text-[#9C9588]">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════ Section 7: CTA ═══════════════ */
function CTASection() {
  return (
    <Section className="bg-[#1A1714] py-16 lg:py-24 xl:py-32">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-h1 font-display text-white mb-4">
            Partner With Us
          </h2>
          <p className="font-khmer text-[#F5E6A3] text-lg mb-3 opacity-80">
            ចូលរួមជាដៃគូជាមួយយើង
          </p>
          <p className="font-chinese text-[#D4AF37] mb-8 opacity-60">
            加入我们
          </p>
          <p className="text-body-large text-[#9C9588] mb-10">
            Join Cambodia&apos;s fastest-growing recruitment ecosystem. Whether you are an employer,
            training institute, financial institution, or potential investor — there is a place for
            you in our network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-[#D4AF37] text-[#1A1714] rounded-xl font-semibold text-button shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:bg-[#B8941F] hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all duration-200"
            >
              Become a Partner
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold text-button hover:bg-[#D4AF37]/10 active:scale-[0.98] transition-all duration-200"
            >
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
