import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Megaphone,
  DollarSign,
  Video,
  Rocket,
  Share2,
  Bot,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Plus,
  Play,
  ChevronRight,
  Activity,
  Eye,
  MousePointer,
  UserPlus,
  BarChart3,
  RefreshCw,
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ── animation variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

/* ── mock data ── */
const userGrowthData = [
  { day: '12/01', users: 120, enterprises: 8 },
  { day: '12/05', users: 180, enterprises: 12 },
  { day: '12/10', users: 250, enterprises: 18 },
  { day: '12/15', users: 340, enterprises: 25 },
  { day: '12/20', users: 420, enterprises: 30 },
  { day: '12/25', users: 510, enterprises: 38 },
  { day: '12/30', users: 680, enterprises: 45 },
];

const promotionChannelData = [
  { channel: 'AI推广', leads: 450, conversion: 12.5 },
  { channel: '短视频', leads: 380, conversion: 8.3 },
  { channel: '裂变', leads: 520, conversion: 15.2 },
  { channel: '社媒', leads: 290, conversion: 6.8 },
  { channel: '广告', leads: 210, conversion: 4.5 },
];

const contentTypeData = [
  { name: 'AI文案', value: 342, color: '#D4AF37' },
  { name: '短视频', value: 186, color: '#E85D3E' },
  { name: '裂变海报', value: 248, color: '#059669' },
  { name: '社媒图文', value: 165, color: '#2563EB' },
];

const activityLogs = [
  { id: 1, action: 'AI推广活动创建', detail: '"春节招聘大促" 已启动', time: '2分钟前', type: 'ai', icon: Bot },
  { id: 2, action: '视频渲染完成', detail: '"企业宣传片 #128" 已发布', time: '8分钟前', type: 'video', icon: Video },
  { id: 3, action: '裂变活动触发', detail: '用户 "张明" 分享了职位给3位好友', time: '15分钟前', type: 'growth', icon: Rocket },
  { id: 4, action: '社媒内容发布', detail: 'Facebook 发布了每日职位精选', time: '23分钟前', type: 'social', icon: Share2 },
  { id: 5, action: '新企业入驻', detail: '"金边科技有限公司" 完成认证', time: '35分钟前', type: 'user', icon: Building2 },
  { id: 6, action: 'AI文案生成', detail: '为 "IT行业" 生成了12条招聘文案', time: '42分钟前', type: 'ai', icon: Bot },
  { id: 7, action: '视频审核通过', detail: '"工厂招聘视频 #89" 已审核通过', time: '1小时前', type: 'video', icon: Video },
  { id: 8, action: '裂变奖励发放', detail: '向15位用户发放了推广积分', time: '1小时前', type: 'growth', icon: Rocket },
  { id: 9, action: '数据分析报告', detail: '周度数据报告已生成', time: '2小时前', type: 'analytics', icon: BarChart3 },
  { id: 10, action: '社媒互动', detail: 'TikTok 视频获得1.2k点赞', time: '2小时前', type: 'social', icon: Share2 },
];

/* ── stat cards data ── */
const statCards = [
  { label: '今日新增用户', value: '128', change: '+12.5%', up: true, icon: Users, color: '#D4AF37' },
  { label: '本周新增企业', value: '24', change: '+8.2%', up: true, icon: Building2, color: '#059669' },
  { label: '活跃推广活动', value: '18', change: '+3', up: true, icon: Megaphone, color: '#2563EB' },
  { label: '本月收入', value: '$12.8K', change: '+23.1%', up: true, icon: DollarSign, color: '#D4AF37' },
  { label: '待审核视频', value: '7', change: '-2', up: true, icon: Video, color: '#E85D3E' },
  { label: '进行中的裂变', value: '5', change: '+1', up: true, icon: Rocket, color: '#059669' },
  { label: '社媒总粉丝', value: '45.2K', change: '+5.8%', up: true, icon: Share2, color: '#2563EB' },
  { label: 'AI生成内容', value: '941', change: '+18.3%', up: true, icon: Bot, color: '#D4AF37' },
];

/* ── quick actions ── */
const quickActions = [
  { label: '新建AI推广', desc: '创建智能推广活动', icon: Bot, path: '/superadmin/promotion', color: '#D4AF37' },
  { label: '开始视频制作', desc: '进入短视频工厂', icon: Video, path: '/superadmin/video-factory', color: '#E85D3E' },
  { label: '启动裂变活动', desc: '设置裂变增长规则', icon: Rocket, path: '/superadmin/growth', color: '#059669' },
  { label: '发布社媒内容', desc: '管理社媒矩阵', icon: Share2, path: '/superadmin/social', color: '#2563EB' },
];

/* ── type colors for activity log ── */
const typeColors: Record<string, string> = {
  ai: '#D4AF37',
  video: '#E85D3E',
  growth: '#059669',
  social: '#2563EB',
  user: '#8B5CF6',
  analytics: '#9C9588',
};

/* ── custom tooltip for charts ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-deep-brown/10 bg-white px-3 py-2 shadow-lg">
        <p className="mb-1 text-xs font-medium text-warm-gray">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/* ── activity log component ── */
function ActivityLog() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    if (!isAutoScroll || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 1;
        if (
          scrollRef.current.scrollTop >=
          scrollRef.current.scrollHeight - scrollRef.current.clientHeight
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoScroll]);

  return (
    <motion.div
      custom={3}
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-gold" />
          <h3 className="text-base font-semibold text-charcoal">实时活动日志</h3>
        </div>
        <button
          onClick={() => setIsAutoScroll(!isAutoScroll)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-warm-gray transition-colors hover:bg-cream"
        >
          <RefreshCw size={12} className={isAutoScroll ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
          {isAutoScroll ? '自动滚动中' : '已暂停'}
        </button>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-thin h-[360px] overflow-y-auto pr-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {activityLogs.map((log, index) => {
            const Icon = log.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group mb-2 flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-cream"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${typeColors[log.type]}15` }}
                >
                  <Icon size={14} style={{ color: typeColors[log.type] }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal">{log.action}</p>
                  <p className="truncate text-xs text-warm-gray">{log.detail}</p>
                </div>
                <span className="shrink-0 text-[10px] text-warm-gray">{log.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── viral tree diagram (decorative) ── */
function ViralTreeMap() {
  const nodes = [
    { id: 'root', label: '活动起点', x: 50, y: 8, size: 36, color: '#D4AF37' },
    { id: 'l1a', label: 'KOL A', x: 20, y: 35, size: 28, color: '#059669' },
    { id: 'l1b', label: 'KOL B', x: 50, y: 35, size: 28, color: '#059669' },
    { id: 'l1c', label: 'KOL C', x: 80, y: 35, size: 28, color: '#059669' },
    { id: 'l2a', label: '用户群A', x: 10, y: 65, size: 22, color: '#2563EB' },
    { id: 'l2b', label: '用户群B', x: 30, y: 65, size: 22, color: '#2563EB' },
    { id: 'l2c', label: '用户群C', x: 45, y: 65, size: 22, color: '#2563EB' },
    { id: 'l2d', label: '用户群D', x: 60, y: 65, size: 22, color: '#2563EB' },
    { id: 'l2e', label: '用户群E', x: 75, y: 65, size: 22, color: '#2563EB' },
    { id: 'l2f', label: '用户群F', x: 90, y: 65, size: 22, color: '#2563EB' },
    { id: 'l3a', label: '扩散', x: 25, y: 88, size: 16, color: '#E85D3E' },
    { id: 'l3b', label: '扩散', x: 50, y: 88, size: 16, color: '#E85D3E' },
    { id: 'l3c', label: '扩散', x: 75, y: 88, size: 16, color: '#E85D3E' },
  ];

  const connections = [
    ['root', 'l1a'], ['root', 'l1b'], ['root', 'l1c'],
    ['l1a', 'l2a'], ['l1a', 'l2b'], ['l1b', 'l2c'], ['l1b', 'l2d'],
    ['l1c', 'l2e'], ['l1c', 'l2f'],
    ['l2b', 'l3a'], ['l2d', 'l3b'], ['l2e', 'l3c'],
  ];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <motion.div
      custom={2}
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 size={18} className="text-emerald" />
          <h3 className="text-base font-semibold text-charcoal">裂变传播图谱</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-warm-gray">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" />起点</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" />KOL</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />用户</span>
        </div>
      </div>
      <div className="relative h-[200px] w-full overflow-hidden rounded-lg bg-cream/50">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map(([from, to], i) => {
            const start = nodeMap.get(from)!;
            const end = nodeMap.get(to)!;
            return (
              <motion.line
                key={i}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke={`${start.color}30`}
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              />
            );
          })}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size / 8}
                fill={`${node.color}20`}
                stroke={node.color}
                strokeWidth="0.5"
              />
              <text
                x={node.x}
                y={node.y + node.size / 8 + 4}
                textAnchor="middle"
                fill="#2D2926"
                fontSize="3"
                fontWeight="500"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-emerald/5 px-3 py-2 text-center">
          <p className="text-lg font-bold text-emerald">3,420</p>
          <p className="text-[10px] text-warm-gray">总传播人数</p>
        </div>
        <div className="rounded-lg bg-gold/5 px-3 py-2 text-center">
          <p className="text-lg font-bold text-gold">5.8</p>
          <p className="text-[10px] text-warm-gray">平均裂变层级</p>
        </div>
        <div className="rounded-lg bg-blue-500/5 px-3 py-2 text-center">
          <p className="text-lg font-bold text-blue-500">12.5%</p>
          <p className="text-[10px] text-warm-gray">转化率</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── main dashboard ── */
export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Welcome bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-xl font-bold text-charcoal sm:text-2xl">超级管理总览</h1>
          <p className="mt-0.5 text-sm text-warm-gray">
            实时监控平台运营数据，管理AI推广、视频制作、裂变增长等核心业务
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
            </span>
            系统运行正常
          </span>
          <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {new Date().toLocaleDateString('zh-CN')}
          </span>
        </div>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,23,20,0.12)' }}
              className="group relative overflow-hidden rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-warm-gray">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-charcoal">{stat.value}</p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {stat.up ? (
                  <ArrowUpRight size={14} className="text-emerald" />
                ) : (
                  <ArrowDownRight size={14} className="text-coral" />
                )}
                <span className={`text-xs font-medium ${stat.up ? 'text-emerald' : 'text-coral'}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-warm-gray">较上周</span>
              </div>
              {/* Decorative background circle */}
              <div
                className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-[0.03]"
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="initial"
        animate="animate"
      >
        <h3 className="mb-3 text-sm font-semibold text-charcoal">快捷操作</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.path}
                whileHover={{ y: -3, boxShadow: `0 8px 24px ${action.color}25` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 rounded-xl border border-deep-brown/5 bg-white p-4 text-left shadow-card transition-all hover:border-gold/20"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-charcoal">{action.label}</p>
                  <p className="text-[11px] text-warm-gray">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-warm-gray/40 transition-colors group-hover:text-gold" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* User growth chart */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" />
              <h3 className="text-base font-semibold text-charcoal">用户增长趋势</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] text-warm-gray">
                <span className="h-2 w-2 rounded-full bg-gold" />
                用户
              </span>
              <span className="flex items-center gap-1 text-[10px] text-warm-gray">
                <span className="h-2 w-2 rounded-full bg-emerald" />
                企业
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEnterprises" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="新增用户" stroke="#D4AF37" strokeWidth={2} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="enterprises" name="新增企业" stroke="#059669" strokeWidth={2} fill="url(#colorEnterprises)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Content type pie chart */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card"
        >
          <div className="mb-4 flex items-center gap-2">
            <Zap size={18} className="text-coral" />
            <h3 className="text-base font-semibold text-charcoal">AI内容生成分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {contentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {contentTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-warm-gray">{item.name}</span>
                <span className="ml-auto font-semibold text-charcoal">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Promotion channel comparison */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-blue-500" />
              <h3 className="text-base font-semibold text-charcoal">推广渠道效果对比</h3>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-warm-gray">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" />线索数</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" />转化率(%)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={promotionChannelData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
              <XAxis dataKey="channel" tick={{ fontSize: 12, fill: '#9C9588' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9C9588' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="leads" name="线索数" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversion" name="转化率(%)" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity log */}
        <ActivityLog />
      </div>

      {/* Viral tree map */}
      <ViralTreeMap />

      {/* Bottom metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '总浏览量', value: '128.5K', icon: Eye, change: '+18.2%' },
          { label: '点击率', value: '4.8%', icon: MousePointer, change: '+0.6%' },
          { label: '新增注册', value: '1,284', icon: UserPlus, change: '+22.4%' },
          { label: '平均停留', value: '4m32s', icon: Clock, change: '+12.1%' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              custom={index + 5}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              className="flex items-center gap-3 rounded-xl border border-deep-brown/5 bg-white p-4 shadow-card"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream">
                <Icon size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-charcoal">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-warm-gray">{metric.label}</p>
                  <span className="text-[10px] text-emerald">{metric.change}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
