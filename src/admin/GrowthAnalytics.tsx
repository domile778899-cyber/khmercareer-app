import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  UserCheck,
  Wallet,
  BarChart3,
  Funnel,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  MousePointer,
  Share2,
  CircleDot,
  ChevronRight,
  Rocket,
  Target,
  Layers,
  Globe,
  Coins,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════ */

// Overview stats (top cards)
const overviewStats = [
  {
    label: "总裂变人数",
    value: "14,820",
    change: "+28.5%",
    changeType: "up" as const,
    icon: Users,
    color: "#D4AF37",
    bg: "rgba(212,175,55,0.12)",
    sub: "本月新增 1,240",
  },
  {
    label: "总转化人数",
    value: "3,658",
    change: "+22.3%",
    changeType: "up" as const,
    icon: UserCheck,
    color: "#059669",
    bg: "rgba(5,150,105,0.12)",
    sub: "转化率 24.7%",
  },
  {
    label: "平均裂变系数",
    value: "2.54",
    change: "+0.32",
    changeType: "up" as const,
    icon: TrendingUp,
    color: "#E85D3E",
    bg: "rgba(232,93,62,0.12)",
    sub: "目标 3.0",
  },
  {
    label: "累计奖励发放",
    value: "$18,240",
    change: "+15.8%",
    changeType: "up" as const,
    icon: Wallet,
    color: "#8B7355",
    bg: "rgba(139,115,85,0.12)",
    sub: "含积分折合",
  },
];

// Funnel data
const funnelData = [
  { name: "展示", value: 45000, color: "#D4AF37" },
  { name: "点击", value: 18500, color: "#059669" },
  { name: "注册", value: 8200, color: "#2563EB" },
  { name: "激活", value: 5420, color: "#8B7355" },
  { name: "转化", value: 3658, color: "#E85D3E" },
];

// Campaign comparison data
const campaignCompareData = [
  { name: "邀请得现金", participants: 1250, converted: 380, viral: 2.3 },
  { name: "企业入驻", participants: 85, converted: 23, viral: 1.8 },
  { name: "分享职位", participants: 3200, converted: 890, viral: 3.1 },
  { name: "社群加入", participants: 560, converted: 210, viral: 1.5 },
  { name: "春节大作战", participants: 2890, converted: 1120, viral: 3.8 },
  { name: "课程分享", participants: 780, converted: 195, viral: 2.1 },
  { name: "VIP推荐", participants: 156, converted: 67, viral: 1.9 },
  { name: "每日签到", participants: 5430, converted: 1200, viral: 2.7 },
];

// Referral chain depth distribution
const depthDistribution = [
  { name: "1级裂变", value: 5240, color: "#D4AF37" },
  { name: "2级裂变", value: 3120, color: "#059669" },
  { name: "3级裂变", value: 1280, color: "#E85D3E" },
  { name: "4级+裂变", value: 420, color: "#8B7355" },
  { name: "自然流量", value: 5760, color: "#A39E99" },
];

// User growth trend (6 months)
const growthTrendData = [
  { month: "Oct", organic: 3200, viral: 1800 },
  { month: "Nov", organic: 3500, viral: 2200 },
  { month: "Dec", organic: 3800, viral: 3100 },
  { month: "Jan", organic: 4100, viral: 4200 },
  { month: "Feb", organic: 3900, viral: 5800 },
  { month: "Mar", organic: 4500, viral: 7100 },
];

// Daily growth trend (14 days)
const dailyGrowthData = [
  { day: "03/01", organic: 145, viral: 98 },
  { day: "03/02", organic: 132, viral: 112 },
  { day: "03/03", organic: 158, viral: 135 },
  { day: "03/04", organic: 167, viral: 128 },
  { day: "03/05", organic: 142, viral: 156 },
  { day: "03/06", organic: 155, viral: 189 },
  { day: "03/07", organic: 178, viral: 210 },
  { day: "03/08", organic: 165, viral: 195 },
  { day: "03/09", organic: 190, viral: 178 },
  { day: "03/10", organic: 182, viral: 245 },
  { day: "03/11", organic: 170, viral: 267 },
  { day: "03/12", organic: 188, viral: 298 },
  { day: "03/13", organic: 195, viral: 312 },
  { day: "03/14", organic: 178, viral: 289 },
];

// Top inviters
const topInviters = [
  { rank: 1, name: "Sophea Kim", avatar: "SK", invites: 156, converted: 48, earnings: 480, chain: 23, trend: "up" },
  { rank: 2, name: "John Smith", avatar: "JS", invites: 134, converted: 42, earnings: 420, chain: 19, trend: "up" },
  { rank: 3, name: "Meng Li", avatar: "ML", invites: 89, converted: 23, earnings: 230, chain: 12, trend: "down" },
  { rank: 4, name: "Chantrea Sovann", avatar: "CS", invites: 78, converted: 19, earnings: 190, chain: 10, trend: "up" },
  { rank: 5, name: "Srey Mao", avatar: "SM", invites: 67, converted: 18, earnings: 180, chain: 9, trend: "up" },
  { rank: 6, name: "Wei Zhang", avatar: "WZ", invites: 56, converted: 15, earnings: 150, chain: 7, trend: "down" },
  { rank: 7, name: "David Chen", avatar: "DC", invites: 45, converted: 12, earnings: 120, chain: 6, trend: "up" },
  { rank: 8, name: "Pich Rithy", avatar: "PR", invites: 38, converted: 11, earnings: 110, chain: 5, trend: "down" },
  { rank: 9, name: "Kosal Ly", avatar: "KL", invites: 32, converted: 9, earnings: 95, chain: 4, trend: "up" },
  { rank: 10, name: "Nary Phan", avatar: "NP", invites: 28, converted: 8, earnings: 80, chain: 4, trend: "down" },
];

// Viral feed
const viralFeed = [
  { id: 1, user: "Sophea Kim", action: "邀请了 Meng Li", reward: "+$5", time: "刚刚", type: "invite" },
  { id: 2, user: "Meng Li", action: "完成企业注册", reward: "+$15", time: "1分钟前", type: "convert" },
  { id: 3, user: "John Smith", action: "分享了职位到FB", reward: "+50积分", time: "2分钟前", type: "share" },
  { id: 4, user: "David Chen", action: "邀请了 Srey Mao", reward: "+$5", time: "3分钟前", type: "invite" },
  { id: 5, user: "Srey Mao", action: "完善简历", reward: "+100积分", time: "4分钟前", type: "credit" },
  { id: 6, user: "Chantrea S.", action: "邀请企业入驻", reward: "+$20", time: "5分钟前", type: "convert" },
  { id: 7, user: "Wei Zhang", action: "加入电报群", reward: "+25积分", time: "6分钟前", type: "community" },
  { id: 8, user: "Kosal Ly", action: "分享了课程", reward: "+100积分", time: "7分钟前", type: "share" },
  { id: 9, user: "Pich Rithy", action: "邀请了 Nary Phan", reward: "+$5", time: "8分钟前", type: "invite" },
  { id: 10, user: "Nary Phan", action: "每日签到", reward: "+10积分", time: "9分钟前", type: "credit" },
];

// Channel breakdown
const channelData = [
  { name: "Facebook", users: 5200, color: "#1877F2" },
  { name: "Telegram", users: 3800, color: "#38A1F3" },
  { name: "微信", users: 2100, color: "#07C160" },
  { name: "直接访问", users: 1850, color: "#D4AF37" },
  { name: "其他", users: 870, color: "#A39E99" },
];

/* ═══════════════════════════════════════════════
   Custom Tooltips
   ═══════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-sand bg-white px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-charcoal mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-warm-gray">{p.name}:</span>
            <span className="font-semibold text-charcoal">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function FunnelTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; color: string } }> }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    const idx = funnelData.findIndex((f) => f.name === item.payload.name);
    const prevValue = idx > 0 ? funnelData[idx - 1].value : item.value;
    const conversion = idx > 0 ? ((item.value / prevValue) * 100).toFixed(1) : "100.0";
    return (
      <div className="rounded-lg border border-sand bg-white px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-charcoal">{item.payload.name}</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: item.payload.color }}>
          {item.value.toLocaleString()}
        </p>
        {idx > 0 && <p className="text-[10px] text-warm-gray mt-0.5">转化率: {conversion}%</p>}
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════
   Animation Helpers
   ═══════════════════════════════════════════════ */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

/* ═══════════════════════════════════════════════
   Sub Components
   ═══════════════════════════════════════════════ */

function StatCard({
  stat,
  index,
}: {
  stat: (typeof overviewStats)[0];
  index: number;
}) {
  const Icon = stat.icon;
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: stat.bg }}
        >
          <Icon size={18} style={{ color: stat.color }} />
        </div>
        <div className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: stat.bg, color: stat.color }}>
          {stat.changeType === "up" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {stat.change}
        </div>
      </div>
      <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
      <p className="text-xs text-warm-gray mt-0.5">{stat.label}</p>
      <p className="text-[10px] text-warm-gray mt-1">{stat.sub}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
export default function GrowthAnalytics() {
  const [period, setPeriod] = useState<"14d" | "30d" | "6m" | "1y">("14d");

  const periodButtons: Array<{ key: typeof period; label: string }> = [
    { key: "14d", label: "14天" },
    { key: "30d", label: "30天" },
    { key: "6m", label: "6个月" },
    { key: "1y", label: "1年" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <BarChart3 size={22} style={{ color: "#D4AF37" }} />
            增长数据分析
          </h2>
          <p className="text-sm text-warm-gray mt-1">裂变增长引擎的核心数据指标与趋势分析</p>
        </div>
        <div className="flex rounded-lg border border-sand bg-white p-0.5 shadow-sm">
          {periodButtons.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: period === p.key ? "#D4AF37" : "transparent",
                color: period === p.key ? "#fff" : "#2D2926",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {overviewStats.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>

      {/* Row: Funnel + Depth Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Funnel Chart */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
                <Funnel size={16} style={{ color: "#D4AF37" }} />
                裂变漏斗
              </h3>
              <p className="text-xs text-warm-gray mt-0.5">从展示到转化的各环节转化数据</p>
            </div>
          </div>
          <div className="space-y-3">
            {funnelData.map((item, i) => {
              const maxVal = funnelData[0].value;
              const width = (item.value / maxVal) * 100;
              const prevVal = i > 0 ? funnelData[i - 1].value : item.value;
              const conversion = i > 0 ? ((item.value / prevVal) * 100).toFixed(1) : "100.0";
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-12 text-xs font-medium text-warm-gray text-right shrink-0">{item.name}</span>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      className="h-8 rounded-lg flex items-center px-3 relative overflow-hidden"
                      style={{ backgroundColor: item.color + "18" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        className="absolute inset-0 rounded-lg opacity-20"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="relative z-10 text-xs font-bold" style={{ color: item.color }}>
                        {item.value.toLocaleString()}
                      </span>
                    </motion.div>
                  </div>
                  {i > 0 && (
                    <span className="w-14 text-[10px] font-medium text-emerald shrink-0 text-right">
                      {conversion}%
                    </span>
                  )}
                  {i === 0 && <span className="w-14 text-[10px] text-warm-gray shrink-0 text-right">基准</span>}
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-sand flex items-center justify-around">
            {[
              { label: "总展示", value: "45,000" },
              { label: "总点击", value: "18,500" },
              { label: "注册率", value: "41.1%" },
              { label: "最终转化", value: "8.1%" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs font-medium text-charcoal">{item.value}</p>
                <p className="text-[10px] text-warm-gray">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Depth Distribution Pie */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <Layers size={16} style={{ color: "#D4AF37" }} />
              用户来源分布
            </h3>
            <p className="text-xs text-warm-gray mt-0.5">自然流量 vs 各级裂变流量占比</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[180px] h-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={depthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {depthDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {depthDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-warm-gray flex-1">{item.name}</span>
                  <span className="text-xs font-semibold text-charcoal">{item.value.toLocaleString()}</span>
                  <span className="text-[10px] text-warm-gray w-10 text-right">
                    {((item.value / depthDistribution.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row: Campaign Comparison Bar Chart */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <Rocket size={16} style={{ color: "#D4AF37" }} />
              各活动效果对比
            </h3>
            <p className="text-xs text-warm-gray mt-0.5">参与人数 vs 转化人数</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={campaignCompareData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1714" opacity={0.04} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#2D2926", opacity: 0.6 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#2D2926", opacity: 0.6 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="participants" name="参与人数" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            <Bar dataKey="converted" name="转化人数" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Row: Growth Trend + Top Inviters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Growth Trend Line Chart */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
                <TrendingUp size={16} style={{ color: "#D4AF37" }} />
                用户增长趋势
              </h3>
              <p className="text-xs text-warm-gray mt-0.5">自然流量 vs 裂变流量对比</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={period === "14d" ? dailyGrowthData : growthTrendData}>
              <defs>
                <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B7355" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B7355" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="viralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1714" opacity={0.04} vertical={false} />
              <XAxis
                dataKey={period === "14d" ? "day" : "month"}
                tick={{ fontSize: 11, fill: "#2D2926", opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#2D2926", opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="organic" name="自然流量" stroke="#8B7355" strokeWidth={2} fill="url(#organicGrad)" dot={{ r: 3, fill: "#8B7355" }} />
              <Area type="monotone" dataKey="viral" name="裂变流量" stroke="#D4AF37" strokeWidth={2} fill="url(#viralGrad)" dot={{ r: 3, fill: "#D4AF37" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Channel Breakdown */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <Globe size={16} style={{ color: "#D4AF37" }} />
              渠道来源
            </h3>
            <p className="text-xs text-warm-gray mt-0.5">各渠道带来用户分布</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="users">
                  {channelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {channelData.map((ch) => (
              <div key={ch.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                <span className="text-xs text-warm-gray flex-1">{ch.name}</span>
                <span className="text-xs font-semibold text-charcoal">{ch.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row: Top Inviters Table + Viral Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Inviters */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <Crown size={16} style={{ color: "#D4AF37" }} />
              Top邀请者排行榜
            </h3>
            <Button variant="outline" size="sm" className="h-7 text-[11px] border-sand">
              查看全部 <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand">
                  <th className="text-left py-2 px-2 text-[10px] font-medium text-warm-gray uppercase">排名</th>
                  <th className="text-left py-2 px-2 text-[10px] font-medium text-warm-gray uppercase">用户</th>
                  <th className="text-right py-2 px-2 text-[10px] font-medium text-warm-gray uppercase">邀请</th>
                  <th className="text-right py-2 px-2 text-[10px] font-medium text-warm-gray uppercase">转化</th>
                  <th className="text-right py-2 px-2 text-[10px] font-medium text-warm-gray uppercase">收益</th>
                </tr>
              </thead>
              <tbody>
                {topInviters.map((user, i) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-sand/50 hover:bg-cream/30 transition-colors"
                  >
                    <td className="py-2.5 px-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: i < 3 ? "#D4AF3720" : "transparent",
                          color: i < 3 ? "#D4AF37" : "#9C9588",
                        }}
                      >
                        {user.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                          {user.avatar}
                        </div>
                        <span className="text-xs font-medium text-charcoal">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-xs text-charcoal">{user.invites}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-emerald">{user.converted}</td>
                    <td className="py-2.5 px-2 text-right text-xs font-medium" style={{ color: "#D4AF37" }}>
                      ${user.earnings}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Real-time Viral Feed */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <CircleDot size={16} className="text-emerald animate-pulse" />
              实时裂变动态
            </h3>
            <span className="text-[10px] text-warm-gray">实时更新</span>
          </div>
          <div className="space-y-0 max-h-[360px] overflow-y-auto pr-1">
            {viralFeed.map((item, i) => {
              const typeConfig: Record<string, { icon: typeof Share2; color: string; bg: string }> = {
                invite: { icon: Users, color: "#D4AF37", bg: "rgba(212,175,55,0.1)" },
                convert: { icon: Target, color: "#059669", bg: "rgba(5,150,105,0.1)" },
                share: { icon: Share2, color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
                credit: { icon: Coins, color: "#8B7355", bg: "rgba(139,115,85,0.1)" },
                community: { icon: Globe, color: "#38A1F3", bg: "rgba(56,161,243,0.1)" },
              };
              const cfg = typeConfig[item.type] || typeConfig.invite;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2.5 border-b border-sand/50 last:border-0"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal truncate">
                      <span className="font-medium">{item.user}</span>{" "}
                      <span className="text-warm-gray">{item.action}</span>
                    </p>
                    <p className="text-[10px] text-warm-gray">{item.time}</p>
                  </div>
                  <span className="text-xs font-semibold shrink-0" style={{ color: cfg.color }}>
                    {item.reward}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom: Viral Coefficient by Campaign */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "#D4AF37" }} />
              各活动裂变系数
            </h3>
            <p className="text-xs text-warm-gray mt-0.5">每个活动的病毒传播系数（K值）</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {campaignCompareData.map((c, i) => {
            const k = c.viral;
            const isGood = k >= 2.5;
            const isOk = k >= 1.5;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-sand bg-cream/20 p-3 text-center hover:bg-cream/40 transition-colors"
              >
                <div className="flex items-center justify-center mb-2">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#E8E0D0" strokeWidth="4" />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke={isGood ? "#059669" : isOk ? "#D4AF37" : "#E85D3E"}
                      strokeWidth="4"
                      strokeDasharray={`${(k / 4) * 125.6} 125.6`}
                      strokeLinecap="round"
                      transform="rotate(-90 24 24)"
                    />
                    <text x="24" y="26" textAnchor="middle" className="text-[12px] font-bold" fill="#2D2926">
                      {k}
                    </text>
                  </svg>
                </div>
                <p className="text-[11px] font-medium text-charcoal truncate">{c.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: isGood ? "#059669" : isOk ? "#D4AF37" : "#E85D3E",
                    }}
                  />
                  <span className="text-[10px] text-warm-gray">
                    {isGood ? "优秀" : isOk ? "良好" : "需优化"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
