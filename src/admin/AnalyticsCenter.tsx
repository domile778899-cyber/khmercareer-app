import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const trafficData = [
  { date: '01/15', pv: 4200, uv: 1800, jobs: 320 },
  { date: '01/16', pv: 4800, uv: 2100, jobs: 380 },
  { date: '01/17', pv: 3900, uv: 1600, jobs: 290 },
  { date: '01/18', pv: 5600, uv: 2400, jobs: 450 },
  { date: '01/19', pv: 6200, uv: 2800, jobs: 520 },
  { date: '01/20', pv: 5800, uv: 2500, jobs: 480 },
  { date: '01/21', pv: 7100, uv: 3200, jobs: 610 },
];

const sourceData = [
  { name: '搜索引擎', value: 35, color: '#D4AF37' },
  { name: '社媒引流', value: 25, color: '#2563EB' },
  { name: '直接访问', value: 20, color: '#059669' },
  { name: '推荐链接', value: 12, color: '#E85D3E' },
  { name: '广告投放', value: 8, color: '#8B5CF6' },
];

const deviceData = [
  { name: '移动端', value: 68, icon: Smartphone, color: '#D4AF37' },
  { name: '桌面端', value: 24, icon: Monitor, color: '#2563EB' },
  { name: '平板', value: 8, icon: Tablet, color: '#059669' },
];

const topPages = [
  { path: '/jobs', views: 45200, avgTime: '3m12s', bounce: '32%' },
  { path: '/', views: 38400, avgTime: '2m45s', bounce: '28%' },
  { path: '/courses', views: 21800, avgTime: '4m20s', bounce: '24%' },
  { path: '/employers', views: 15600, avgTime: '2m30s', bounce: '38%' },
  { path: '/resume', views: 12300, avgTime: '5m10s', bounce: '18%' },
];

const conversionFunnel = [
  { stage: '访问首页', count: 32000, rate: '100%' },
  { stage: '浏览职位', count: 21800, rate: '68.1%' },
  { stage: '查看详情', count: 12500, rate: '39.1%' },
  { stage: '开始申请', count: 6800, rate: '21.3%' },
  { stage: '完成申请', count: 4200, rate: '13.1%' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-deep-brown/10 bg-white px-3 py-2 shadow-lg">
        <p className="mb-1 text-xs font-medium text-warm-gray">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsCenter() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal sm:text-2xl">数据分析中心</h1>
          <p className="mt-0.5 text-sm text-warm-gray">全面分析平台流量、用户行为和转化数据</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-cream p-0.5">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  timeRange === range ? 'bg-white text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
                }`}
              >
                {range === '7d' ? '近7天' : range === '30d' ? '近30天' : '近90天'}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 rounded-lg border border-deep-brown/10 bg-white px-3 py-2 text-xs font-medium text-charcoal hover:bg-cream"
          >
            <Download size={14} />
            导出
          </motion.button>
        </div>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '总访问量(PV)', value: '37,600', change: '+18.5%', up: true, icon: Eye, color: '#D4AF37' },
          { label: '独立访客(UV)', value: '16,400', change: '+22.1%', up: true, icon: Users, color: '#059669' },
          { label: '平均停留时长', value: '3m42s', change: '+8.3%', up: true, icon: Clock, color: '#2563EB' },
          { label: '跳出率', value: '28.5%', change: '-3.2%', up: false, icon: TrendingDown, color: '#E85D3E' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -3 }}
              className="rounded-xl border border-deep-brown/5 bg-white p-4 shadow-card transition-all"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon size={16} style={{ color: stat.color }} />
                <span className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.up ? 'text-emerald' : 'text-coral'}`}>
                  {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-charcoal">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-warm-gray">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Traffic chart */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-gold" />
            <h3 className="text-base font-semibold text-charcoal">流量趋势</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-warm-gray">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> 页面浏览</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> 独立访客</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-coral" /> 职位查看</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trafficData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E85D3E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E85D3E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="pv" name="页面浏览" stroke="#D4AF37" strokeWidth={2} fill="url(#colorPv)" />
            <Area type="monotone" dataKey="uv" name="独立访客" stroke="#059669" strokeWidth={2} fill="url(#colorUv)" />
            <Area type="monotone" dataKey="jobs" name="职位查看" stroke="#E85D3E" strokeWidth={2} fill="url(#colorJobs)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Source & Device */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Traffic source */}
        <motion.div custom={5} variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">流量来源</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {sourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-warm-gray">{item.name}</span>
                </div>
                <span className="font-semibold text-charcoal">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device breakdown */}
        <motion.div custom={6} variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">设备分布</h3>
          <div className="space-y-4">
            {deviceData.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={16} style={{ color: device.color }} />
                      <span className="text-sm text-charcoal">{device.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">{device.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg bg-cream p-3">
            <p className="text-[11px] text-warm-gray">
              <Globe size={12} className="mr-1 inline" />
              移动端用户占比最高，建议优先优化移动端体验
            </p>
          </div>
        </motion.div>

        {/* Conversion funnel */}
        <motion.div custom={7} variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">转化漏斗</h3>
          <div className="space-y-2">
            {conversionFunnel.map((step, index) => (
              <div key={step.stage}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-warm-gray">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">{step.count.toLocaleString()}</span>
                    <span className="text-[10px] text-gold">{step.rate}</span>
                  </div>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-md bg-cream">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.count / conversionFunnel[0].count) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex h-full items-center rounded-md px-2"
                    style={{
                      backgroundColor: index === 0 ? '#D4AF37' : index === conversionFunnel.length - 1 ? '#059669' : `rgba(212,175,55,${1 - index * 0.15})`,
                    }}
                  >
                    <span className="text-[10px] font-medium text-white">{step.rate}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top pages */}
      <motion.div
        custom={8}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-deep-brown/5 bg-white shadow-card"
      >
        <div className="flex items-center justify-between border-b border-deep-brown/5 px-5 py-4">
          <h3 className="text-sm font-semibold text-charcoal">热门页面</h3>
          <button className="text-xs text-gold hover:underline">查看全部</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-deep-brown/5 text-xs text-warm-gray">
                <th className="px-5 py-3 font-medium">页面路径</th>
                <th className="px-5 py-3 font-medium text-right">浏览量</th>
                <th className="px-5 py-3 font-medium text-right">平均停留</th>
                <th className="px-5 py-3 font-medium text-right">跳出率</th>
                <th className="px-5 py-3 font-medium">趋势</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, index) => (
                <tr key={page.path} className="border-b border-deep-brown/5 transition-colors hover:bg-cream/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold">
                        {index + 1}
                      </span>
                      <span className="font-mono text-sm text-charcoal">{page.path}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-charcoal">{page.views.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-warm-gray">{page.avgTime}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-medium ${parseInt(page.bounce) < 30 ? 'text-emerald' : 'text-coral'}`}>
                      {page.bounce}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <TrendingUp size={14} className="text-emerald" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
