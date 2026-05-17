import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ShieldCheck, Star, Award, Heart, FileCheck,
  Upload, Clock, BadgeCheck, User,
  Building2, AlertTriangle, ThumbsUp, TrendingUp, Users,
  CheckCircle, XCircle, Trophy,
  Target, Zap, Sparkles, FileText, CreditCard
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/* ───────────────────── CONSTANTS ───────────────────── */
const GOLD = '#D4AF37';
const EMERALD = '#059669';
const CORAL = '#E85D3E';
const WARM_WHITE = '#FAF8F3';
const CREAM = '#F5F0E8';
const CHARCOAL = '#2D2926';
const DEEP_BROWN = '#1A1714';
const SAND = '#E8E0D0';
const WARM_GRAY = '#9C9588';

const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

/* ───────────────────── TYPE DEFINITIONS ───────────────────── */
interface ScoreItem {
  label: string;
  labelZh: string;
  points: number;
  icon: React.ElementType;
}

interface PenaltyItem {
  label: string;
  labelZh: string;
  points: number;
  icon: React.ElementType;
}

interface TierBenefit {
  name: string;
  nameZh: string;
  range: string;
  color: string;
  benefits: string[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
  badgeColor: string;
}

interface TrustBadge {
  label: string;
  labelZh: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

/* ───────────────────── DATA: JOB SEEKER ───────────────────── */
const seekerEarningItems: ScoreItem[] = [
  { label: 'Complete profile', labelZh: '完善个人资料', points: 50, icon: FileCheck },
  { label: 'Upload verified ID', labelZh: '上传认证身份证', points: 100, icon: ShieldCheck },
  { label: 'Complete training course', labelZh: '完成培训课程', points: 75, icon: Award },
  { label: 'Successful job placement', labelZh: '成功就业', points: 200, icon: Target },
  { label: 'Employer positive review', labelZh: '雇主好评', points: 150, icon: ThumbsUp },
  { label: 'On-time attendance (30 days)', labelZh: '30天全勤', points: 100, icon: Clock },
  { label: 'Refer a friend who gets hired', labelZh: '推荐好友入职', points: 100, icon: Users },
  { label: 'Complete interview feedback', labelZh: '完成面试反馈', points: 25, icon: FileText },
];

const seekerPenaltyItems: PenaltyItem[] = [
  { label: 'No-show to interview', labelZh: '面试缺席', points: 100, icon: XCircle },
  { label: 'Fake resume information', labelZh: '简历造假', points: 300, icon: AlertTriangle },
  { label: 'Employer complaint', labelZh: '雇主投诉', points: 150, icon: AlertTriangle },
  { label: 'Repeated job abandonment', labelZh: '多次放弃工作', points: 200, icon: AlertTriangle },
];

const seekerTiers: TierBenefit[] = [
  {
    name: 'Bronze', nameZh: '青铜', range: '0-300',
    color: '#B45309', benefits: ['Basic job search access', 'Standard job recommendations'],
  },
  {
    name: 'Silver', nameZh: '白银', range: '300-600',
    color: WARM_GRAY, benefits: ['Priority job recommendations', 'Early access to new listings'],
  },
  {
    name: 'Gold', nameZh: '黄金', range: '600-800',
    color: GOLD, benefits: ['Featured candidate badge', 'Fast-track applications', 'Profile highlight'],
  },
  {
    name: 'Platinum', nameZh: '铂金', range: '800-1000',
    color: '#7C3AED', benefits: ['VIP status', 'Personal career advisor', 'Access to exclusive jobs'],
  },
];

/* ───────────────────── DATA: EMPLOYER ───────────────────── */
const employerEarningItems: ScoreItem[] = [
  { label: 'Complete company verification', labelZh: '完成企业认证', points: 200, icon: ShieldCheck },
  { label: 'Post accurate job descriptions', labelZh: '发布真实职位', points: 50, icon: FileText },
  { label: 'Respond within 48 hours', labelZh: '48小时内回复', points: 75, icon: Clock },
  { label: 'Successful hire + positive feedback', labelZh: '成功招聘+好评', points: 150, icon: ThumbsUp },
  { label: 'Complete payment on time', labelZh: '按时付款', points: 100, icon: CreditCard },
  { label: 'Host live recruitment event', labelZh: '举办直播招聘会', points: 100, icon: Zap },
  { label: 'Provide training to employees', labelZh: '为员工提供培训', points: 75, icon: Award },
];

const employerPenaltyItems: PenaltyItem[] = [
  { label: 'Fake job posting', labelZh: '虚假职位', points: 300, icon: AlertTriangle },
  { label: 'Salary not as advertised', labelZh: '薪资不符', points: 250, icon: XCircle },
  { label: 'No response to candidates', labelZh: '不回复求职者', points: 100, icon: AlertTriangle },
  { label: 'Delayed payment', labelZh: '延迟付款', points: 150, icon: AlertTriangle },
];

const employerTiers: TierBenefit[] = [
  {
    name: 'Bronze', nameZh: '青铜', range: '0-300',
    color: '#B45309', benefits: ['Basic job posting', 'Standard listing position'],
  },
  {
    name: 'Silver', nameZh: '白银', range: '300-600',
    color: WARM_GRAY, benefits: ['Verified badge displayed', 'Priority listing in search'],
  },
  {
    name: 'Gold', nameZh: '黄金', range: '600-800',
    color: GOLD, benefits: ['Featured employer badge', 'Analytics dashboard', 'Promoted listings'],
  },
  {
    name: 'Platinum', nameZh: '铂金', range: '800-1000',
    color: '#7C3AED', benefits: ['Homepage spotlight', 'Dedicated account manager', 'Exclusive hiring events'],
  },
];

/* ───────────────────── DATA: LEADERBOARD ───────────────────── */
const topJobSeekers: LeaderboardEntry[] = [
  { rank: 1, name: 'Sokunthea Prak', score: 980, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 2, name: 'Visal Chea', score: 945, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 3, name: 'Sreyleak Dim', score: 920, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 4, name: 'Dara Seng', score: 880, badge: 'Gold', badgeColor: GOLD },
  { rank: 5, name: 'Chanthy Sao', score: 855, badge: 'Gold', badgeColor: GOLD },
  { rank: 6, name: 'Ratanak Phan', score: 820, badge: 'Gold', badgeColor: GOLD },
  { rank: 7, name: 'Kunthea Sin', score: 780, badge: 'Gold', badgeColor: GOLD },
  { rank: 8, name: 'Makara Heng', score: 740, badge: 'Silver', badgeColor: WARM_GRAY },
  { rank: 9, name: 'Pisey Nhem', score: 710, badge: 'Silver', badgeColor: WARM_GRAY },
  { rank: 10, name: 'Vuthy Taing', score: 680, badge: 'Silver', badgeColor: WARM_GRAY },
];

const topEmployers: LeaderboardEntry[] = [
  { rank: 1, name: 'CamKo Textile Group', score: 960, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 2, name: 'Sokha Hotels Co.', score: 940, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 3, name: 'Tech Cambodia Ltd.', score: 915, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 4, name: 'Chip Mong Group', score: 890, badge: 'Platinum', badgeColor: '#7C3AED' },
  { rank: 5, name: 'SinoLink Trading', score: 860, badge: 'Gold', badgeColor: GOLD },
  { rank: 6, name: 'AEON Cambodia', score: 840, badge: 'Gold', badgeColor: GOLD },
  { rank: 7, name: 'Canadia Bank', score: 810, badge: 'Gold', badgeColor: GOLD },
  { rank: 8, name: 'Prince Holding', score: 770, badge: 'Gold', badgeColor: GOLD },
  { rank: 9, name: 'SMART Axiata', score: 730, badge: 'Silver', badgeColor: WARM_GRAY },
  { rank: 10, name: 'ABA Bank', score: 700, badge: 'Silver', badgeColor: WARM_GRAY },
];

/* ───────────────────── DATA: TRUST BADGES ───────────────────── */
const trustBadges: TrustBadge[] = [
  {
    label: 'Verified ID', labelZh: '实名认证', desc: 'Identity verified through official documentation',
    icon: Shield, color: '#2563EB', bgColor: 'rgba(37,99,235,0.12)',
  },
  {
    label: 'Top Performer', labelZh: '优秀表现者', desc: 'Consistently high ratings from employers',
    icon: Star, color: GOLD, bgColor: 'rgba(212,175,55,0.12)',
  },
  {
    label: 'Reliable Employer', labelZh: '可信企业', desc: 'Pays on time, accurate job descriptions',
    icon: CheckCircle, color: EMERALD, bgColor: 'rgba(5,150,105,0.12)',
  },
  {
    label: 'Skill Certified', labelZh: '技能认证', desc: 'Completed professional training courses',
    icon: Award, color: CORAL, bgColor: 'rgba(232,93,62,0.12)',
  },
  {
    label: 'Community Contributor', labelZh: '社区贡献者', desc: 'Helps others, refers quality candidates',
    icon: Heart, color: '#7C3AED', bgColor: 'rgba(124,58,237,0.12)',
  },
];

const demoPieData = [
  { name: 'Profile', value: 150, color: CORAL },
  { name: 'Verification', value: 200, color: '#F59E0B' },
  { name: 'Reviews', value: 250, color: GOLD },
  { name: 'Activity', value: 150, color: EMERALD },
];

/* ───────────────────── ANIMATION VARIANTS ───────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: easeOutExpo },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

/* ───────────────────── SECTION 1: HERO ───────────────────── */
function HeroSection() {
  const [needleAngle, setNeedleAngle] = useState(-90);

  useEffect(() => {
    const t = setTimeout(() => setNeedleAngle(54), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-[72px]"
      style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}
    >
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)' }} />

      <div className="relative z-10 max-w-[1000px] mx-auto px-4 md:px-8 py-12 text-center">
        {/* Trilingual title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-caption uppercase tracking-[0.15em] mb-4" style={{ color: GOLD }}
        >
          Trust Score System
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
          className="text-hero-title font-display mb-3" style={{ color: WARM_WHITE, textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
        >
          ប្រព័ន្ធពិន្ទុទំនុកចិត្ត
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
          className="text-h3 font-body mb-6" style={{ color: 'rgba(212,175,55,0.7)' }}
        >
          信用积分体系
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: easeOutExpo }}
          className="text-body-large max-w-[600px] mx-auto mb-10" style={{ color: WARM_GRAY }}
        >
          Building a trustworthy ecosystem where every action builds your reputation
        </motion.p>

        {/* Animated Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: easeOutExpo }}
          className="relative w-[280px] h-[160px] mx-auto mb-10"
        >
          <svg viewBox="0 0 280 160" className="w-full h-full">
            {/* Gauge background arc */}
            <path d="M 20 140 A 120 120 0 0 1 260 140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="24" strokeLinecap="round" />
            {/* Red zone */}
            <path d="M 20 140 A 120 120 0 0 1 80 36.8" fill="none" stroke={CORAL} strokeWidth="24" strokeLinecap="round" opacity="0.8" />
            {/* Orange zone */}
            <path d="M 82 35.5 A 120 120 0 0 1 152 21.5" fill="none" stroke="#F59E0B" strokeWidth="24" strokeLinecap="round" opacity="0.8" />
            {/* Gold zone */}
            <path d="M 154 21.5 A 120 120 0 0 1 210 40" fill="none" stroke={GOLD} strokeWidth="24" strokeLinecap="round" opacity="0.8" />
            {/* Emerald zone */}
            <path d="M 212 41.5 A 120 120 0 0 1 260 140" fill="none" stroke={EMERALD} strokeWidth="24" strokeLinecap="round" opacity="0.8" />

            {/* Ticks */}
            {[0, 200, 400, 600, 800, 1000].map((v, i) => {
              const angle = -90 + (i / 5) * 180;
              const rad = (angle * Math.PI) / 180;
              const x1 = 140 + 96 * Math.cos(rad);
              const y1 = 140 + 96 * Math.sin(rad);
              const x2 = 140 + 106 * Math.cos(rad);
              const y2 = 140 + 106 * Math.sin(rad);
              const tx = 140 + 118 * Math.cos(rad);
              const ty = 140 + 118 * Math.sin(rad);
              return (
                <g key={v}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill={WARM_GRAY} fontSize="9" fontFamily="Inter, sans-serif">{v}</text>
                </g>
              );
            })}

            {/* Animated needle */}
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: needleAngle }}
              transition={{ duration: 1.5, delay: 0.8, ease: easeOutExpo }}
              style={{ transformOrigin: '140px 140px' }}
            >
              <line x1="140" y1="140" x2="245" y2="140" stroke={WARM_WHITE} strokeWidth="3" strokeLinecap="round" />
              <circle cx="140" cy="140" r="8" fill={GOLD} />
            </motion.g>

            {/* Score display */}
            <text x="140" y="115" textAnchor="middle" fill={WARM_WHITE} fontSize="32" fontWeight="700" fontFamily="Inter, sans-serif">
              <motion.tspan
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                750
              </motion.tspan>
            </text>
            <text x="140" y="132" textAnchor="middle" fill={WARM_GRAY} fontSize="10" fontFamily="Inter, sans-serif">TRUST SCORE</text>
          </svg>
        </motion.div>

        {/* Score range legend */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          {[
            { label: '0-300', color: CORAL, name: 'Bronze' },
            { label: '300-600', color: '#F59E0B', name: 'Silver' },
            { label: '600-800', color: GOLD, name: 'Gold' },
            { label: '800-1000', color: EMERALD, name: 'Platinum' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span className="text-caption" style={{ color: WARM_GRAY }}>{item.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 2: TWO SCORE TYPES (TABS) ───────────────────── */
function ScoreTypeTabs() {
  const [activeTab, setActiveTab] = useState<'seeker' | 'employer'>('seeker');
  const [expandedTier, setExpandedTier] = useState<number | null>(2);

  const earnings = activeTab === 'seeker' ? seekerEarningItems : employerEarningItems;
  const penalties = activeTab === 'seeker' ? seekerPenaltyItems : employerPenaltyItems;
  const tiers = activeTab === 'seeker' ? seekerTiers : employerTiers;

  const maxEarningPoints = Math.max(...earnings.map((e) => e.points));

  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: CREAM }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer} className="text-center mb-12"
        >
          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: CHARCOAL }}>
            How Trust Scores Work
          </motion.h2>
          <motion.p variants={staggerItem} className="text-body-large" style={{ color: WARM_GRAY }}>
            Every action counts. Build your reputation and unlock exclusive benefits.
          </motion.p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border" style={{ borderColor: SAND }}>
            <button
              onClick={() => setActiveTab('seeker')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-button-small font-semibold transition-all duration-300 min-h-[48px] ${
                activeTab === 'seeker'
                  ? 'text-white shadow-md'
                  : 'text-charcoal hover:text-gold'
              }`}
              style={activeTab === 'seeker' ? { background: GOLD } : {}}
            >
              <User size={18} /> Job Seeker
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-button-small font-semibold transition-all duration-300 min-h-[48px] ${
                activeTab === 'employer'
                  ? 'text-white shadow-md'
                  : 'text-charcoal hover:text-gold'
              }`}
              style={activeTab === 'employer' ? { background: CHARCOAL, color: WARM_WHITE } : {}}
            >
              <Building2 size={18} /> Employer
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: easeSmooth }}
          >
            {/* How to Earn */}
            <div className="mb-10">
              <h3 className="text-h3 font-body font-semibold mb-5 flex items-center gap-2" style={{ color: EMERALD }}>
                <TrendingUp size={22} /> How to Earn Points
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {earnings.map((item, i) => {
                  const Icon = item.icon;
                  const pct = (item.points / maxEarningPoints) * 100;
                  return (
                    <motion.div
                      key={item.label}
                      custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      className="flex items-center gap-3 bg-white rounded-xl p-4 border shadow-sm"
                      style={{ borderColor: SAND }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${EMERALD}18` }}>
                        <Icon size={20} style={{ color: EMERALD }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-body-small font-medium truncate" style={{ color: CHARCOAL }}>{item.label}</span>
                          <span className="text-caption font-bold ml-2 shrink-0" style={{ color: EMERALD }}>+{item.points} pts</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: CREAM }}>
                          <motion.div
                            initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: easeOutExpo }}
                            viewport={{ once: true }}
                            className="h-full rounded-full" style={{ background: EMERALD }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Penalties */}
            <div className="mb-10">
              <h3 className="text-h3 font-body font-semibold mb-5 flex items-center gap-2" style={{ color: CORAL }}>
                <AlertTriangle size={22} /> Penalties (Lose Points)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {penalties.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      className="flex items-center gap-3 rounded-xl p-4 border"
                      style={{ background: 'rgba(232,93,62,0.06)', borderColor: 'rgba(232,93,62,0.15)' }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(232,93,62,0.12)' }}>
                        <Icon size={20} style={{ color: CORAL }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-body-small font-medium truncate" style={{ color: CHARCOAL }}>{item.label}</span>
                          <span className="text-caption font-bold ml-2 shrink-0" style={{ color: CORAL }}>-{item.points} pts</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tier Benefits */}
            <div>
              <h3 className="text-h3 font-body font-semibold mb-5 flex items-center gap-2" style={{ color: GOLD }}>
                <Award size={22} /> Benefits by Tier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {tiers.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    onClick={() => setExpandedTier(expandedTier === i ? null : i)}
                    className="rounded-xl p-5 border cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: expandedTier === i ? 'white' : CREAM,
                      borderColor: expandedTier === i ? tier.color : SAND,
                      boxShadow: expandedTier === i ? `0 4px 16px ${tier.color}20` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: tier.color }} />
                      <span className="text-body-small font-bold" style={{ color: tier.color }}>{tier.name}</span>
                      <span className="text-caption ml-auto" style={{ color: WARM_GRAY }}>{tier.range}</span>
                    </div>
                    <p className="text-caption mb-2" style={{ color: WARM_GRAY }}>{tier.nameZh}</p>
                    <ul className="space-y-1.5">
                      {tier.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-1.5">
                          <CheckCircle size={12} className="shrink-0 mt-0.5" style={{ color: tier.color }} />
                          <span className="text-caption" style={{ color: CHARCOAL }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 3: SCORE VISUALIZATION ───────────────────── */
function ScoreVisualization() {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 2000;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * 750));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 800) return EMERALD;
    if (score >= 600) return GOLD;
    if (score >= 300) return '#F59E0B';
    return CORAL;
  };

  const scoreColor = getScoreColor(animatedScore);
  const needleRotation = -90 + (animatedScore / 1000) * 180;

  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: DEEP_BROWN }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer} className="text-center mb-12"
        >
          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: WARM_WHITE }}>
            Score Visualization
          </motion.h2>
          <motion.p variants={staggerItem} className="text-body-large" style={{ color: WARM_GRAY }}>
            See how your trust score breaks down and what it represents.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-[900px] mx-auto">
          {/* Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOutExpo }} viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="relative w-[300px] h-[170px]">
              <svg viewBox="0 0 300 170" className="w-full h-full">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={CORAL} />
                    <stop offset="33%" stopColor="#F59E0B" />
                    <stop offset="66%" stopColor={GOLD} />
                    <stop offset="100%" stopColor={EMERALD} />
                  </linearGradient>
                </defs>
                <path d="M 25 155 A 125 125 0 0 1 275 155" fill="none" stroke="url(#gaugeGrad)" strokeWidth="28" strokeLinecap="round" />
                <path d="M 25 155 A 125 125 0 0 1 275 155" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="28" strokeLinecap="round" strokeDasharray="4 8" />

                <motion.g
                  initial={{ rotate: -90 }}
                  animate={{ rotate: needleRotation }}
                  transition={{ duration: 2, ease: easeOutExpo }}
                  style={{ transformOrigin: '150px 155px' }}
                >
                  <polygon points="150,155 265,149 265,161" fill={WARM_WHITE} />
                  <circle cx="150" cy="155" r="10" fill={GOLD} />
                </motion.g>

                <text x="150" y="120" textAnchor="middle" fill={WARM_WHITE} fontSize="40" fontWeight="700" fontFamily="Inter, sans-serif">
                  {animatedScore}
                </text>
                <text x="150" y="142" textAnchor="middle" fill={WARM_GRAY} fontSize="11" fontFamily="Inter, sans-serif">
                  / 1000 TRUST SCORE
                </text>
              </svg>
            </div>

            {/* Score pill */}
            <div
              className="mt-4 px-5 py-2 rounded-full text-button-small font-semibold"
              style={{ background: `${scoreColor}25`, color: scoreColor, border: `2px solid ${scoreColor}40` }}
            >
              {animatedScore >= 800 ? 'Platinum Tier' : animatedScore >= 600 ? 'Gold Tier' : animatedScore >= 300 ? 'Silver Tier' : 'Bronze Tier'}
            </div>
          </motion.div>

          {/* Ring Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }} viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-body-small font-semibold mb-3" style={{ color: WARM_GRAY }}>Score Breakdown</p>
            <div className="w-[240px] h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demoPieData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                    onMouseLeave={() => setActiveSlice(null)}
                  >
                    {demoPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeSlice === null || activeSlice === index ? 1 : 0.5}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
              {demoPieData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                  style={{ opacity: activeSlice === null || activeSlice === i ? 1 : 0.4 }}
                  onMouseEnter={() => setActiveSlice(i)}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: item.color }} />
                  <span className="text-caption" style={{ color: WARM_WHITE }}>{item.name}</span>
                  <span className="text-caption font-bold ml-auto" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 4: VERIFICATION PROCESS ───────────────────── */
function VerificationProcess() {
  const steps = [
    {
      num: '01', icon: Upload,
      title: 'Document Upload', titleZh: '上传证件',
      desc: 'Upload your ID, certificates, or business license securely.',
      color: CORAL,
    },
    {
      num: '02', icon: FileCheck,
      title: 'AI + Human Review', titleZh: 'AI+人工审核',
      desc: 'Our AI scans documents in seconds, then a human reviews within 24-48 hours.',
      color: GOLD,
    },
    {
      num: '03', icon: BadgeCheck,
      title: 'Score Awarded + Badge', titleZh: '积分授予+徽章',
      desc: 'Your trust score is updated and a verified badge appears on your profile.',
      color: EMERALD,
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: CREAM }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer} className="text-center mb-12"
        >
          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: CHARCOAL }}>
            Verification Process
          </motion.h2>
          <motion.p variants={staggerItem} className="text-body-large" style={{ color: WARM_GRAY }}>
            Three simple steps to build your trusted profile.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px]" style={{ background: SAND }} />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5 border-4"
                  style={{ background: WARM_WHITE, borderColor: step.color }}
                >
                  <Icon size={40} style={{ color: step.color }} />
                  <div
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold text-white"
                    style={{ background: step.color }}
                  >
                    {step.num}
                  </div>
                </motion.div>

                <h3 className="text-h4 font-semibold mb-1" style={{ color: CHARCOAL }}>{step.title}</h3>
                <p className="text-caption mb-2" style={{ color: WARM_GRAY }}>{step.titleZh}</p>
                <p className="text-body-small max-w-[280px]" style={{ color: WARM_GRAY }}>{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 5: LEADERBOARD ───────────────────── */
function Leaderboard() {
  const [leaderboardTab, setLeaderboardTab] = useState<'seekers' | 'employers'>('seekers');
  const data = leaderboardTab === 'seekers' ? topJobSeekers : topEmployers;

  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: WARM_WHITE }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer} className="text-center mb-10"
        >
          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: CHARCOAL }}>
            Trust Leaderboard
          </motion.h2>
          <motion.p variants={staggerItem} className="text-body-large" style={{ color: WARM_GRAY }}>
            Top trusted members of the KhmerHR community.
          </motion.p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#F5F0E8] rounded-xl p-1">
            <button
              onClick={() => setLeaderboardTab('seekers')}
              className={`px-5 py-2.5 rounded-lg text-button-small font-semibold transition-all duration-200 ${
                leaderboardTab === 'seekers' ? 'bg-white shadow-sm text-charcoal' : 'text-warm-gray'
              }`}
            >
              <span className="flex items-center gap-1.5"><User size={16} /> Job Seekers</span>
            </button>
            <button
              onClick={() => setLeaderboardTab('employers')}
              className={`px-5 py-2.5 rounded-lg text-button-small font-semibold transition-all duration-200 ${
                leaderboardTab === 'employers' ? 'bg-white shadow-sm text-charcoal' : 'text-warm-gray'
              }`}
            >
              <span className="flex items-center gap-1.5"><Building2 size={16} /> Employers</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={leaderboardTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="max-w-[600px] mx-auto"
          >
            {data.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: easeOutExpo }}
                className="flex items-center gap-3 py-3 px-4 border-b rounded-lg transition-colors duration-200 hover:bg-[#F5F0E8]"
                style={{ borderColor: SAND }}
              >
                {/* Rank */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  {entry.rank <= 3 ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: entry.rank === 1 ? `${GOLD}20` : entry.rank === 2 ? `${WARM_GRAY}20` : '#B4530920',
                      }}
                    >
                      <Trophy size={14} style={{
                        color: entry.rank === 1 ? GOLD : entry.rank === 2 ? WARM_GRAY : '#B45309',
                      }} />
                    </div>
                  ) : (
                    <span className="text-caption font-bold text-center w-full" style={{ color: WARM_GRAY }}>{entry.rank}</span>
                  )}
                </div>

                {/* Name */}
                <span className="text-body-small font-medium flex-1 truncate" style={{ color: CHARCOAL }}>{entry.name}</span>

                {/* Score */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <TrendingUp size={14} style={{ color: EMERALD }} />
                  <span className="text-body-small font-bold" style={{ color: EMERALD }}>{entry.score}</span>
                </div>

                {/* Badge */}
                <span
                  className="px-2.5 py-0.5 rounded-full text-caption font-medium shrink-0"
                  style={{ background: `${entry.badgeColor}18`, color: entry.badgeColor }}
                >
                  {entry.badge}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 6: TRUST BADGES ───────────────────── */
function TrustBadgesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: DEEP_BROWN }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer} className="text-center mb-12"
        >
          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: WARM_WHITE }}>
            Trust Badges
          </motion.h2>
          <motion.p variants={staggerItem} className="text-body-large" style={{ color: WARM_GRAY }}>
            Earn badges that showcase your credibility across the platform.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="flex flex-col items-center text-center rounded-xl p-6 border transition-shadow duration-300 hover:shadow-lg"
                style={{ background: badge.bgColor, borderColor: `${badge.color}25` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${badge.color}20` }}
                >
                  <Icon size={28} style={{ color: badge.color }} />
                </div>
                <h4 className="text-body-small font-bold mb-0.5" style={{ color: WARM_WHITE }}>{badge.label}</h4>
                <p className="text-caption mb-2" style={{ color: WARM_GRAY }}>{badge.labelZh}</p>
                <p className="text-caption" style={{ color: WARM_GRAY }}>{badge.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── SECTION 7: CTA ───────────────────── */
function CTASection() {
  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: `linear-gradient(135deg, ${GOLD}15 0%, ${EMERALD}10 50%, ${CORAL}08 100%)` }}>
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center max-w-[600px] mx-auto"
        >
          <motion.div variants={staggerItem} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${GOLD}20` }}>
            <Sparkles size={32} style={{ color: GOLD }} />
          </motion.div>

          <motion.h2 variants={staggerItem} className="text-h2 font-display mb-3" style={{ color: CHARCOAL }}>
            Check Your Score
          </motion.h2>

          <motion.p variants={staggerItem} className="text-body-large mb-4" style={{ color: WARM_GRAY }}>
            Start building your trust profile today. Every positive action strengthens your reputation in Cambodia's job market.
          </motion.p>

          <motion.p variants={staggerItem} className="text-h3 mb-8" style={{ color: GOLD }}>
            ចាប់ផ្តើមបង្កើតប្រវត្តិទំនុកចិត្ត / 开始建立信任档案
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/resume"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] transition-all duration-200 hover:scale-[1.03]"
              style={{ background: GOLD, color: DEEP_BROWN, boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}
            >
              <ShieldCheck size={20} /> Build Your Profile
            </Link>
            <Link
              to="/employers"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] transition-all duration-200 hover:scale-[1.03]"
              style={{ background: CHARCOAL, color: WARM_WHITE }}
            >
              <Building2 size={20} /> Verify as Employer
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── MAIN PAGE COMPONENT ───────────────────── */
export default function Credit() {
  return (
    <div>
      <HeroSection />
      <ScoreTypeTabs />
      <ScoreVisualization />
      <VerificationProcess />
      <Leaderboard />
      <TrustBadgesSection />
      <CTASection />
    </div>
  );
}
