import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  Award,
  Calendar,
  Megaphone,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  CreditCard,
  Activity,
  Target,
  Globe,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

// ─── Revenue Model Data from Business Model Screenshot ─────────────────
const REVENUE_MODELS = [
  { id: 'commission', title: '第一年薪资佣金', titleEn: 'First Year Salary Commission', rate: '25%', unit: '每单', icon: Target, color: '#D4AF37', bgColor: 'rgba(212,175,55,0.1)', desc: '成功入职后收取第一年薪资的25%作为佣金' },
  { id: 'subscription', title: '专业计划订阅', titleEn: 'Pro Plan Subscription', rate: '$99', unit: '/月', icon: CreditCard, color: '#6B8E6B', bgColor: 'rgba(107,142,107,0.1)', desc: '企业月度订阅专业招聘服务' },
  { id: 'event', title: '现场招聘活动', titleEn: 'On-site Recruitment Event', rate: '$200+', unit: '/次', icon: Calendar, color: '#C75B3F', bgColor: 'rgba(199,91,63,0.1)', desc: '举办线下招聘会和人才对接活动' },
  { id: 'course', title: '培训课程费用', titleEn: 'Training Course Fee', rate: '$50', unit: '/节', icon: BookOpen, color: '#5B8DB8', bgColor: 'rgba(91,141,184,0.1)', desc: '职业技能培训课程收费' },
  { id: 'advertising', title: '精选广告位', titleEn: 'Featured Ad Placement', rate: '$50', unit: '/周', icon: Megaphone, color: '#9B7EC8', bgColor: 'rgba(155,126,200,0.1)', desc: '首页精选职位和广告展示位' },
]

// ─── Mock Dashboard Data ───────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: '1月', commission: 4200, subscription: 1980, event: 800, course: 1200, advertising: 600 },
  { month: '2月', commission: 3800, subscription: 2970, event: 400, course: 950, advertising: 750 },
  { month: '3月', commission: 5100, subscription: 3960, event: 1200, course: 1400, advertising: 800 },
  { month: '4月', commission: 4600, subscription: 4950, event: 600, course: 1100, advertising: 900 },
  { month: '5月', commission: 6200, subscription: 5940, event: 1000, course: 1800, advertising: 1000 },
  { month: '6月', commission: 5800, subscription: 6930, event: 1400, course: 2100, advertising: 1100 },
]

const REVENUE_BY_SOURCE = [
  { name: '佣金收入', value: 30100, color: '#D4AF37' },
  { name: '订阅收入', value: 26730, color: '#6B8E6B' },
  { name: '课程收入', value: 8550, color: '#5B8DB8' },
  { name: '广告收入', value: 5150, color: '#9B7EC8' },
  { name: '活动收入', value: 5400, color: '#C75B3F' },
]

const RECENT_TRANSACTIONS = [
  { id: 'TRX-001', type: 'commission', desc: 'CamKo Textile - 缝纫工招聘佣金', amount: 875, date: '2026-05-22', status: 'completed' },
  { id: 'TRX-002', type: 'subscription', desc: '专业计划月度订阅 - Evergreen Garment', amount: 99, date: '2026-05-22', status: 'completed' },
  { id: 'TRX-003', type: 'event', desc: '金边线下招聘会收入', amount: 350, date: '2026-05-21', status: 'completed' },
  { id: 'TRX-004', type: 'course', desc: '商务英语培训课程 x 12人', amount: 600, date: '2026-05-21', status: 'completed' },
  { id: 'TRX-005', type: 'advertising', desc: '首页精选广告位 - SinoLink Tech', amount: 50, date: '2026-05-20', status: 'completed' },
  { id: 'TRX-006', type: 'commission', desc: 'Raffles Hotel - 前台招聘佣金', amount: 1200, date: '2026-05-20', status: 'pending' },
  { id: 'TRX-007', type: 'course', desc: 'Excel工厂管理课程 x 8人', amount: 400, date: '2026-05-19', status: 'completed' },
]

const TOP_EMPLOYERS = [
  { name: 'CamKo Textile Co.', jobs: 15, hires: 42, spent: 12500, trend: '+12%' },
  { name: 'SinoLink Technology', jobs: 8, hires: 23, spent: 8900, trend: '+8%' },
  { name: 'Evergreen Garment', jobs: 12, hires: 35, spent: 7200, trend: '+15%' },
  { name: 'Raffles Hotel', jobs: 6, hires: 18, spent: 6500, trend: '+5%' },
  { name: 'OCIC Group', jobs: 4, hires: 11, spent: 4800, trend: '+20%' },
]

const PLATFORM_STATS = {
  totalUsers: 12480,
  userGrowth: '+18.5%',
  activeJobs: 113,
  jobsGrowth: '+156',
  totalApplications: 3842,
  appGrowth: '+23.1%',
  monthlyRevenue: 15730,
  revenueGrowth: '+31.2%',
  verifiedEmployers: 186,
  employerGrowth: '+12.4%',
}

// ─── Animation ─────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
}

const COLORS = ['#D4AF37', '#6B8E6B', '#5B8DB8', '#9B7EC8', '#C75B3F']

// ─── Components ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, growth, growthUp, delay }: {
  icon: React.ElementType; label: string; value: string; growth: string; growthUp: boolean; delay: number
}) {
  return (
    <motion.div
      custom={delay}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold" />
        </div>
        <span className={`inline-flex items-center gap-1 text-caption font-medium ${growthUp ? 'text-emerald' : 'text-coral'}`}>
          {growthUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {growth}
        </span>
      </div>
      <p className="text-h3 text-charcoal font-display mb-1">{value}</p>
      <p className="text-body-small text-warm-gray">{label}</p>
    </motion.div>
  )
}

function RevenueModelCard({ model, index }: { model: typeof REVENUE_MODELS[0]; index: number }) {
  const Icon = model.icon
  return (
    <motion.div
      custom={index + 3}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: model.bgColor }}>
          <Icon className="w-7 h-7" style={{ color: model.color }} />
        </div>
        <span className="text-caption font-mono px-3 py-1 rounded-full" style={{ backgroundColor: model.bgColor, color: model.color }}>
          {model.unit}
        </span>
      </div>
      <h3 className="text-h3 font-display mb-1" style={{ color: model.color }}>{model.rate}</h3>
      <p className="text-body font-semibold text-charcoal mb-1">{model.title}</p>
      <p className="text-body-small text-warm-gray">{model.desc}</p>
    </motion.div>
  )
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'transactions' | 'employers'>('overview')

  // Check admin auth
  useEffect(() => {
    const isAdmin = localStorage.getItem('khmercareer-admin-auth')
    if (!isAdmin) {
      // For demo, auto-set admin
      localStorage.setItem('khmercareer-admin-auth', 'true')
    }
  }, [])

  const totalRevenue = REVENUE_BY_SOURCE.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="min-h-[100dvh] bg-warm-white">
      {/* Header */}
      <section className="bg-deep-brown pt-[72px] pb-8">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gold hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-h1 font-display text-[#FAF8F3]">管理后台</h1>
              <p className="text-body text-[rgba(250,248,243,0.6)]">KhmerCareer 运营数据中心</p>
            </div>
          </div>

          {/* Revenue Model Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            {REVENUE_MODELS.map((model) => {
              const Icon = model.icon
              return (
                <div
                  key={model.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10"
                >
                  <Icon className="w-4 h-4" style={{ color: model.color }} />
                  <span className="text-body-small text-[#FAF8F3]">{model.title}</span>
                  <span className="text-caption font-mono font-semibold" style={{ color: model.color }}>{model.rate}{model.unit}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Users} label="总用户" value={PLATFORM_STATS.totalUsers.toLocaleString()} growth={PLATFORM_STATS.userGrowth} growthUp delay={0} />
          <StatCard icon={Briefcase} label="活跃职位" value={PLATFORM_STATS.activeJobs.toString()} growth={PLATFORM_STATS.jobsGrowth} growthUp delay={1} />
          <StatCard icon={Activity} label="总申请数" value={PLATFORM_STATS.totalApplications.toLocaleString()} growth={PLATFORM_STATS.appGrowth} growthUp delay={2} />
          <StatCard icon={DollarSign} label="本月收入" value={`$${PLATFORM_STATS.monthlyRevenue.toLocaleString()}`} growth={PLATFORM_STATS.revenueGrowth} growthUp delay={3} />
          <StatCard icon={Award} label="认证企业" value={PLATFORM_STATS.verifiedEmployers.toString()} growth={PLATFORM_STATS.employerGrowth} growthUp delay={4} />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-sand">
          {[
            { key: 'overview' as const, label: '总览', icon: LayoutDashboard },
            { key: 'revenue' as const, label: '收入分析', icon: BarChart3 },
            { key: 'transactions' as const, label: '交易记录', icon: CreditCard },
            { key: 'employers' as const, label: '企业客户', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-body font-medium border-b-2 transition-all ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-warm-gray hover:text-charcoal'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ─── Overview Tab ─────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Business Model Revenue Cards */}
            <div>
              <h2 className="text-h3 font-display text-charcoal mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-gold" />
                商业模式 - 五大收入来源
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {REVENUE_MODELS.map((model, i) => (
                  <RevenueModelCard key={model.id} model={model} index={i} />
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue Trend */}
              <motion.div
                custom={8}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 bg-white border border-sand rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-h4 font-display text-charcoal mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold" />
                  月收入趋势
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={MONTHLY_REVENUE}>
                    <defs>
                      <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B8E6B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6B8E6B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C8279' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#8C8279' }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E8E4DE', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                      formatter={(value: number) => [`$${value}`, '']}
                    />
                    <Area type="monotone" dataKey="commission" name="佣金" stackId="1" stroke="#D4AF37" fill="url(#colorCommission)" strokeWidth={2} />
                    <Area type="monotone" dataKey="subscription" name="订阅" stackId="1" stroke="#6B8E6B" fill="url(#colorSub)" strokeWidth={2} />
                    <Area type="monotone" dataKey="event" name="活动" stackId="1" stroke="#C75B3F" fill="rgba(199,91,63,0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Revenue by Source Pie */}
              <motion.div
                custom={9}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white border border-sand rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-h4 font-display text-charcoal mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-gold" />
                  收入构成
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={REVENUE_BY_SOURCE}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {REVENUE_BY_SOURCE.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {REVENUE_BY_SOURCE.map((source, i) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-body-small text-charcoal">{source.name}</span>
                      </div>
                      <span className="text-body-small font-mono font-medium">${source.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-sand">
                  <div className="flex items-center justify-between">
                    <span className="text-body font-semibold text-charcoal">总收入</span>
                    <span className="text-h4 font-display text-gold">${totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ─── Revenue Tab ──────────────────────────────────────── */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white border border-sand rounded-2xl p-6 shadow-card"
            >
              <h3 className="text-h4 font-display text-charcoal mb-6">各收入来源月度对比</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={MONTHLY_REVENUE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C8279' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#8C8279' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #E8E4DE' }}
                    formatter={(value: number) => [`$${value}`, '']}
                  />
                  <Bar dataKey="commission" name="佣金" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="subscription" name="订阅" fill="#6B8E6B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="event" name="活动" fill="#C75B3F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="course" name="课程" fill="#5B8DB8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="advertising" name="广告" fill="#9B7EC8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue Model Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {REVENUE_MODELS.map((model, i) => (
                <motion.div
                  key={model.id}
                  custom={i + 1}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-white border border-sand rounded-2xl p-6 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: model.bgColor }}>
                      <model.icon className="w-6 h-6" style={{ color: model.color }} />
                    </div>
                    <div>
                      <h4 className="text-body font-semibold text-charcoal">{model.title}</h4>
                      <p className="text-caption text-warm-gray">{model.titleEn}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-h2 font-display" style={{ color: model.color }}>{model.rate}</span>
                    <span className="text-body text-warm-gray">{model.unit}</span>
                  </div>
                  <p className="text-body-small text-warm-gray mb-4">{model.desc}</p>
                  <div className="pt-4 border-t border-sand flex items-center justify-between">
                    <span className="text-caption text-warm-gray">本月收入</span>
                    <span className="text-body font-semibold font-mono" style={{ color: model.color }}>
                      ${REVENUE_BY_SOURCE.find(s => {
                        const map: Record<string, string> = { commission: '佣金收入', subscription: '订阅收入', event: '活动收入', course: '课程收入', advertising: '广告收入' }
                        return s.name === map[model.id]
                      })?.value.toLocaleString() || '0'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Transactions Tab ─────────────────────────────────── */}
        {activeTab === 'transactions' && (
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden"
          >
            <div className="p-6 border-b border-sand">
              <h3 className="text-h4 font-display text-charcoal flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                近期交易记录
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">交易ID</th>
                    <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">类型</th>
                    <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">描述</th>
                    <th className="text-right text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">金额</th>
                    <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">日期</th>
                    <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {RECENT_TRANSACTIONS.map((trx) => {
                    const typeMap: Record<string, { label: string; color: string }> = {
                      commission: { label: '佣金', color: '#D4AF37' },
                      subscription: { label: '订阅', color: '#6B8E6B' },
                      event: { label: '活动', color: '#C75B3F' },
                      course: { label: '课程', color: '#5B8DB8' },
                      advertising: { label: '广告', color: '#9B7EC8' },
                    }
                    const typeInfo = typeMap[trx.type]
                    return (
                      <tr key={trx.id} className="hover:bg-cream/30 transition-colors">
                        <td className="px-6 py-4 text-body-small font-mono text-charcoal">{trx.id}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption font-medium" style={{ backgroundColor: typeInfo.color + '18', color: typeInfo.color }}>
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-body-small text-charcoal max-w-[300px] truncate">{trx.desc}</td>
                        <td className="px-6 py-4 text-body-small font-mono font-semibold text-charcoal text-right">${trx.amount}</td>
                        <td className="px-6 py-4 text-caption text-warm-gray">{trx.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-caption font-medium ${trx.status === 'completed' ? 'text-emerald' : 'text-warning'}`}>
                            <div className={`w-2 h-2 rounded-full ${trx.status === 'completed' ? 'bg-emerald' : 'bg-warning'}`} />
                            {trx.status === 'completed' ? '已完成' : '处理中'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── Employers Tab ────────────────────────────────────── */}
        {activeTab === 'employers' && (
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-sand">
                <h3 className="text-h4 font-display text-charcoal flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold" />
                  头部企业客户
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cream/50">
                      <th className="text-left text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">企业名称</th>
                      <th className="text-center text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">发布职位</th>
                      <th className="text-center text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">成功入职</th>
                      <th className="text-right text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">累计消费</th>
                      <th className="text-right text-caption font-semibold text-warm-gray uppercase tracking-wider px-6 py-3">增长趋势</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand">
                    {TOP_EMPLOYERS.map((emp, i) => (
                      <motion.tr
                        key={emp.name}
                        custom={i + 1}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-cream/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-gold font-bold text-sm">
                              {emp.name.charAt(0)}
                            </div>
                            <span className="text-body-small font-semibold text-charcoal">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-body-small font-mono text-charcoal">{emp.jobs}</td>
                        <td className="px-6 py-4 text-center text-body-small font-mono text-emerald">{emp.hires}</td>
                        <td className="px-6 py-4 text-right text-body-small font-mono font-semibold text-gold">${emp.spent.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-body-small font-medium text-emerald">
                            <ArrowUpRight className="w-3 h-3" />
                            {emp.trend}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Business Ecosystem */}
            <motion.div
              custom={6}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white border border-sand rounded-2xl p-6 shadow-card"
            >
              <h3 className="text-h4 font-display text-charcoal mb-6 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-gold" />
                商业生态系统
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { icon: Users, label: '雇主', sub: '发布职位\n招聘人才', count: '186家' },
                  { icon: Users, label: '求职者', sub: '投递简历\n获取机会', count: '12,480人' },
                  { icon: BookOpen, label: '培训', sub: '技能提升\n职业成长', count: '2,340人' },
                  { icon: Award, label: '合作伙伴', sub: '企业合作\n资源共享', count: '45家' },
                  { icon: Globe, label: '平台', sub: '数据驱动\n智能匹配', count: '100%' },
                ].map((item, i) => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-cream/50 border border-sand">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <p className="text-body font-semibold text-charcoal mb-1">{item.label}</p>
                    <p className="text-caption text-warm-gray whitespace-pre-line mb-2">{item.sub}</p>
                    <p className="text-body-small font-mono font-semibold text-gold">{item.count}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
