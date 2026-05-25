import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  Target,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── types ── */
interface AnalyticsData {
  campaign: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roi: number;
}

/* ── mock trend data ── */
const trendData7d = [
  { date: "6/19", impressions: 3200, clicks: 280, conversions: 32 },
  { date: "6/20", impressions: 4100, clicks: 350, conversions: 41 },
  { date: "6/21", impressions: 3800, clicks: 310, conversions: 35 },
  { date: "6/22", impressions: 5200, clicks: 450, conversions: 52 },
  { date: "6/23", impressions: 4800, clicks: 390, conversions: 45 },
  { date: "6/24", impressions: 6100, clicks: 520, conversions: 61 },
  { date: "6/25", impressions: 5500, clicks: 480, conversions: 55 },
];

const trendData30d = [
  { date: "5/27", impressions: 2800, clicks: 220, conversions: 25 },
  { date: "5/30", impressions: 3200, clicks: 260, conversions: 29 },
  { date: "6/02", impressions: 3600, clicks: 300, conversions: 34 },
  { date: "6/05", impressions: 4100, clicks: 340, conversions: 38 },
  { date: "6/08", impressions: 4500, clicks: 380, conversions: 42 },
  { date: "6/11", impressions: 5200, clicks: 430, conversions: 49 },
  { date: "6/14", impressions: 5800, clicks: 490, conversions: 55 },
  { date: "6/17", impressions: 6400, clicks: 540, conversions: 62 },
  { date: "6/20", impressions: 7100, clicks: 600, conversions: 68 },
  { date: "6/23", impressions: 7800, clicks: 660, conversions: 75 },
];

const trendData90d = [
  { date: "3/27", impressions: 1200, clicks: 95, conversions: 10 },
  { date: "4/03", impressions: 1800, clicks: 140, conversions: 15 },
  { date: "4/10", impressions: 2400, clicks: 190, conversions: 21 },
  { date: "4/17", impressions: 3100, clicks: 250, conversions: 28 },
  { date: "4/24", impressions: 3800, clicks: 310, conversions: 35 },
  { date: "5/01", impressions: 4500, clicks: 370, conversions: 42 },
  { date: "5/08", impressions: 5200, clicks: 430, conversions: 49 },
  { date: "5/15", impressions: 6100, clicks: 510, conversions: 58 },
  { date: "5/22", impressions: 7200, clicks: 600, conversions: 68 },
  { date: "5/29", impressions: 8500, clicks: 710, conversions: 80 },
  { date: "6/05", impressions: 9800, clicks: 820, conversions: 93 },
  { date: "6/12", impressions: 11200, clicks: 940, conversions: 106 },
  { date: "6/19", impressions: 12800, clicks: 1080, conversions: 122 },
  { date: "6/25", impressions: 14500, clicks: 1220, conversions: 138 },
];

/* ── mock pie data ── */
const platformPieData = [
  { name: "Facebook", value: 35, color: "#1877F2" },
  { name: "TikTok", value: 25, color: "#000000" },
  { name: "Telegram", value: 15, color: "#0088CC" },
  { name: "Instagram", value: 10, color: "#E4405F" },
  { name: "YouTube", value: 8, color: "#FF0000" },
  { name: "Email", value: 5, color: "#EA4335" },
  { name: "SMS", value: 2, color: "#34A853" },
];

/* ── mock bar data ── */
const campaignBarData = [
  { name: "服装厂招聘", impressions: 45200, clicks: 3850, conversions: 420 },
  { name: "中资专场", impressions: 28300, clicks: 2100, conversions: 186 },
  { name: "暹粒旅游", impressions: 32100, clicks: 2680, conversions: 312 },
  { name: "建筑技工", impressions: 18600, clicks: 1240, conversions: 158 },
  { name: "IT人才", impressions: 12400, clicks: 980, conversions: 86 },
  { name: "西港特区", impressions: 38700, clicks: 3100, conversions: 278 },
  { name: "英语培训", impressions: 15200, clicks: 890, conversions: 65 },
  { name: "成功故事", impressions: 56800, clicks: 4520, conversions: 234 },
];

/* ── mock table data ── */
const tableData: AnalyticsData[] = [
  { campaign: "金边服装厂大规模招聘", platform: "Facebook", impressions: 28500, clicks: 2420, conversions: 268, spend: 320, roi: 3.8 },
  { campaign: "金边服装厂大规模招聘", platform: "TikTok", impressions: 16700, clicks: 1430, conversions: 152, spend: 180, roi: 4.2 },
  { campaign: "中资企业专场招聘月", platform: "Facebook", impressions: 18200, clicks: 1350, conversions: 112, spend: 280, roi: 2.5 },
  { campaign: "中资企业专场招聘月", platform: "Telegram", impressions: 10100, clicks: 750, conversions: 74, spend: 170, roi: 2.9 },
  { campaign: "暹粒旅游业招聘季", platform: "Instagram", impressions: 19800, clicks: 1680, conversions: 198, spend: 230, roi: 5.1 },
  { campaign: "暹粒旅游业招聘季", platform: "TikTok", impressions: 12300, clicks: 1000, conversions: 114, spend: 150, roi: 5.6 },
  { campaign: "建筑工地技工招募", platform: "SMS", impressions: 18600, clicks: 1240, conversions: 158, spend: 200, roi: 2.2 },
  { campaign: "IT技术人才专场", platform: "Email", impressions: 8900, clicks: 560, conversions: 42, spend: 80, roi: 1.8 },
  { campaign: "西港经济特区招聘", platform: "Facebook", impressions: 21500, clicks: 1720, conversions: 158, spend: 250, roi: 2.6 },
  { campaign: "西港经济特区招聘", platform: "TikTok", impressions: 10200, clicks: 860, conversions: 86, spend: 120, roi: 3.2 },
  { campaign: "西港经济特区招聘", platform: "Telegram", impressions: 7000, clicks: 520, conversions: 34, spend: 50, roi: 3.0 },
  { campaign: "英语培训课程推广", platform: "Email", impressions: 15200, clicks: 890, conversions: 65, spend: 120, roi: 2.0 },
  { campaign: "成功求职故事系列", platform: "Facebook", impressions: 34200, clicks: 2710, conversions: 142, spend: 200, roi: 4.5 },
  { campaign: "成功求职故事系列", platform: "Telegram", impressions: 12800, clicks: 1020, conversions: 58, spend: 50, roi: 6.2 },
  { campaign: "成功求职故事系列", platform: "YouTube", impressions: 9800, clicks: 790, conversions: 34, spend: 30, roi: 7.1 },
];

/* ── helpers ── */
const platformIconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-3.5 h-3.5" />,
  Instagram: <Instagram className="w-3.5 h-3.5" />,
  TikTok: <Smartphone className="w-3.5 h-3.5" />,
  Telegram: <Send className="w-3.5 h-3.5" />,
  YouTube: <Youtube className="w-3.5 h-3.5" />,
  Email: <Mail className="w-3.5 h-3.5" />,
  SMS: <MessageSquare className="w-3.5 h-3.5" />,
  Push: <Zap className="w-3.5 h-3.5" />,
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/* ── custom tooltip ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-sand shadow-card p-3">
      <p className="text-sm font-medium text-charcoal mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-warm-gray">{p.name}:</span>
          <span className="font-medium text-charcoal">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   Stat Card
   ═══════════════════════════════════ */
function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: typeof TrendingUp;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl border border-sand p-4 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-warm-gray">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-gold" />
        </div>
      </div>
      <div className="text-2xl font-bold text-charcoal mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-xs ${changeType === "up" ? "text-emerald" : "text-coral"}`}>
        {changeType === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        <span>{change}</span>
        <span className="text-warm-gray ml-0.5">vs 上期</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   Main Component
   ═══════════════════════════════════ */
export function PromotionAnalytics() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const trendData = period === "7d" ? trendData7d : period === "30d" ? trendData30d : trendData90d;

  return (
    <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.06 }}>
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold" />
          推广效果分析
        </h2>
        <div className="flex gap-1.5">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? "bg-deep-brown text-white shadow-gold"
                  : "bg-white text-warm-gray hover:bg-cream border border-sand"
              }`}
            >
              {p === "7d" ? "7天" : p === "30d" ? "30天" : "90天"}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="总展示量" value="287.4K" change="+12.5%" changeType="up" icon={Eye} />
        <StatCard label="总点击量" value="24.1K" change="+8.3%" changeType="up" icon={MousePointer} />
        <StatCard label="总转化数" value="2,847" change="+15.2%" changeType="up" icon={Users} />
        <StatCard label="总花费" value="$2,450" change="-3.1%" changeType="down" icon={DollarSign} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trend Line Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-xl border border-sand p-5">
          <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            趋势分析
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E85D3E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E85D3E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9C9588" }} axisLine={{ stroke: "#E8E0D0" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9C9588" }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                name="展示"
                stroke="#D4AF37"
                fillOpacity={1}
                fill="url(#colorImpressions)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="点击"
                stroke="#059669"
                fillOpacity={1}
                fill="url(#colorClicks)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="conversions"
                name="转化"
                stroke="#E85D3E"
                fillOpacity={1}
                fill="url(#colorConversions)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-sand p-5">
          <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-gold" />
            平台流量占比
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={platformPieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {platformPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {platformPieData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-warm-gray">{p.name}</span>
                </div>
                <span className="font-medium text-charcoal">{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-sand p-5 mb-6">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gold" />
          各活动效果对比
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={campaignBarData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9C9588" }} axisLine={{ stroke: "#E8E0D0" }} />
            <YAxis tick={{ fontSize: 12, fill: "#9C9588" }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} iconType="circle" iconSize={8} />
            <Bar dataKey="impressions" name="展示" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicks" name="点击" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" name="转化" fill="#E85D3E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-sand overflow-hidden">
        <div className="px-5 py-4 border-b border-sand flex items-center justify-between">
          <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            详细数据
          </h3>
          <span className="text-xs text-warm-gray">共 {tableData.length} 条记录</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">活动名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">平台</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">展示</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">点击</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">转化</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">CTR</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">花费</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-gray uppercase tracking-wider">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {tableData.map((row, i) => {
                const ctr = ((row.clicks / row.impressions) * 100).toFixed(2);
                return (
                  <tr key={i} className="hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3 text-charcoal font-medium max-w-[200px] truncate">{row.campaign}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-warm-gray">
                        {platformIconMap[row.platform]}
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-charcoal">{row.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-charcoal">{row.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-emerald font-medium">{row.conversions.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-warm-gray">{ctr}%</td>
                    <td className="px-4 py-3 text-right text-warm-gray">${row.spend}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className={`text-[10px] ${row.roi >= 4 ? "bg-emerald-50 text-emerald-700" : row.roi >= 3 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {row.roi}x
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
