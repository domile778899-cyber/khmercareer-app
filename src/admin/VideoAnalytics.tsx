import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  Film, Play, Heart, Users, BarChart3, TrendingUp, Star,
  Clock, ArrowUpRight, ArrowDownRight, Eye, Share2, MessageCircle,
  ThumbsUp, Calendar, Monitor, Smartphone, Globe, Zap, Target,
  Award, Flame, Bookmark, ChevronRight, Activity, MousePointerClick,
  Timer, Hash
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────

// Overview stats
const overviewStats = [
  { label: '总视频数', value: 32, change: '+4', positive: true, icon: <Film size={22} />, color: 'from-amber-400 to-yellow-500' },
  { label: '总播放量', value: '9.49万', change: '+28%', positive: true, icon: <Play size={22} />, color: 'from-blue-400 to-blue-600' },
  { label: '总互动数', value: '6,713', change: '+15%', positive: true, icon: <Heart size={22} />, color: 'from-rose-400 to-rose-600' },
  { label: '新增粉丝', value: '1,240', change: '+32%', positive: true, icon: <Users size={22} />, color: 'from-emerald-400 to-emerald-600' },
];

// Platform comparison bar chart
const platformData = [
  { name: 'TikTok', views: 45200, likes: 3210, comments: 445, shares: 890, color: '#000000' },
  { name: 'YouTube Shorts', views: 20700, likes: 1457, comments: 234, shares: 323, color: '#FF0000' },
  { name: 'FB Reels', views: 16000, likes: 1123, comments: 189, shares: 256, color: '#1877F2' },
  { name: 'Instagram Reels', views: 13000, likes: 923, comments: 156, shares: 212, color: '#E4405F' },
];

// Type distribution pie chart
const typeData = [
  { name: '职位亮点', value: 12, color: '#F59E0B' },
  { name: '求职技巧', value: 8, color: '#3B82F6' },
  { name: '成功故事', value: 5, color: '#8B5CF6' },
  { name: '平台介绍', value: 4, color: '#10B981' },
  { name: '热门趋势', value: 3, color: '#EF4444' },
];

// Type performance radar data
const typePerformanceData = [
  { metric: '播放量', '职位亮点': 85, '求职技巧': 92, '成功故事': 78, '平台介绍': 65, '热门趋势': 88 },
  { metric: '点赞率', '职位亮点': 75, '求职技巧': 88, '成功故事': 95, '平台介绍': 55, '热门趋势': 82 },
  { metric: '分享率', '职位亮点': 70, '求职技巧': 80, '成功故事': 90, '平台介绍': 45, '热门趋势': 85 },
  { metric: '完播率', '职位亮点': 80, '求职技巧': 85, '成功故事': 88, '平台介绍': 60, '热门趋势': 75 },
  { metric: '评论数', '职位亮点': 65, '求职技巧': 90, '成功故事': 85, '平台介绍': 40, '热门趋势': 80 },
  { metric: '涨粉数', '职位亮点': 60, '求职技巧': 75, '成功故事': 92, '平台介绍': 70, '热门趋势': 78 },
];

// 7-day trend
const trend7Data = [
  { date: '01/09', views: 3200, likes: 280, comments: 45 },
  { date: '01/10', views: 4500, likes: 390, comments: 62 },
  { date: '01/11', views: 3800, likes: 310, comments: 50 },
  { date: '01/12', views: 5200, likes: 460, comments: 78 },
  { date: '01/13', views: 6100, likes: 540, comments: 91 },
  { date: '01/14', views: 7800, likes: 680, comments: 112 },
  { date: '01/15', views: 9200, likes: 810, comments: 135 },
];

// 30-day trend
const trend30Data = [
  { date: '12/17', views: 1200 }, { date: '12/19', views: 1800 },
  { date: '12/21', views: 1500 }, { date: '12/23', views: 2200 },
  { date: '12/25', views: 3100 }, { date: '12/27', views: 2800 },
  { date: '12/29', views: 3600 }, { date: '12/31', views: 4200 },
  { date: '01/02', views: 5800 }, { date: '01/04', views: 4900 },
  { date: '01/06', views: 6500 }, { date: '01/08', views: 7200 },
  { date: '01/10', views: 8100 }, { date: '01/12', views: 9400 },
  { date: '01/14', views: 11200 },
];

// Top videos
const topVideos = [
  { id: 1, title: '暹粒旅游业工作机会一览', type: '职位亮点', emoji: '🏛️', views: 51900, likes: 3701, comments: 262, shares: 1024, platforms: 4, ctr: 4.8 },
  { id: 2, title: '面试穿搭指南-柬埔寨职场版', type: '求职技巧', emoji: '👔', views: 24300, likes: 1580, comments: 111, shares: 290, platforms: 2, ctr: 5.2 },
  { id: 3, title: '金边服装厂招聘实拍', type: '职位亮点', emoji: '🏭', views: 27000, likes: 1902, comments: 107, shares: 279, platforms: 3, ctr: 4.5 },
  { id: 4, title: '从服务员到店长-索皮娅的成功故事', type: '成功故事', emoji: '⭐', views: 0, likes: 0, comments: 0, shares: 0, platforms: 0, ctr: 0, status: 'upcoming' },
  { id: 5, title: '2024年柬埔寨热门职业排行', type: '热门趋势', emoji: '🔥', views: 0, likes: 0, comments: 0, shares: 0, platforms: 0, ctr: 0, status: 'upcoming' },
];

// Heatmap data (7 days × 6 time slots)
const heatmapDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const heatmapHours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const heatmapData = [
  [15, 35, 55, 42, 68, 45],
  [12, 42, 60, 48, 75, 52],
  [18, 38, 58, 45, 70, 48],
  [20, 45, 65, 50, 82, 55],
  [25, 50, 72, 58, 88, 62],
  [30, 55, 78, 65, 95, 70],
  [28, 52, 75, 60, 90, 65],
];

// Weekly platform breakdown
const weeklyPlatformData = [
  { day: '周一', TikTok: 5200, YouTube: 3100, FB: 2400, Instagram: 1800 },
  { day: '周二', TikTok: 5800, YouTube: 3400, FB: 2600, Instagram: 2100 },
  { day: '周三', TikTok: 4900, YouTube: 2800, FB: 2200, Instagram: 1700 },
  { day: '周四', TikTok: 6100, YouTube: 3600, FB: 2800, Instagram: 2200 },
  { day: '周五', TikTok: 7200, YouTube: 4200, FB: 3300, Instagram: 2600 },
  { day: '周六', TikTok: 8500, YouTube: 5100, FB: 3900, Instagram: 3100 },
  { day: '周日', TikTok: 7800, YouTube: 4500, FB: 3500, Instagram: 2800 },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function StatCard({ stat, index }: { stat: typeof overviewStats[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
          {stat.icon}
        </div>
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
          stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {stat.change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
    </motion.div>
  );
}

function HeatmapChart() {
  const maxVal = Math.max(...heatmapData.flat());
  const minVal = Math.min(...heatmapData.flat());

  const getColor = (value: number) => {
    const ratio = (value - minVal) / (maxVal - minVal);
    // Gold/amber color scale
    const h = 38; // amber hue
    const s = 90;
    const l = 85 - ratio * 50; // from light to dark
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const getTextColor = (value: number) => {
    const ratio = (value - minVal) / (maxVal - minVal);
    return ratio > 0.5 ? '#fff' : '#92400E';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Header row */}
        <div className="flex">
          <div className="w-14 shrink-0" />
          {heatmapDays.map(day => (
            <div key={day} className="flex-1 text-center py-2 text-[11px] font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {/* Data rows */}
        {heatmapHours.map((hour, hIdx) => (
          <div key={hour} className="flex items-center">
            <div className="w-14 shrink-0 text-right pr-2 text-[11px] text-gray-400 font-mono">
              {hour}
            </div>
            {heatmapDays.map((_, dIdx) => {
              const value = heatmapData[dIdx][hIdx];
              return (
                <div
                  key={`${dIdx}-${hIdx}`}
                  className="flex-1 p-1"
                >
                  <div
                    className="h-10 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                    style={{
                      backgroundColor: getColor(value),
                      color: getTextColor(value),
                    }}
                    title={`${heatmapDays[dIdx]} ${hour}: ${value} 次互动`}
                  >
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3 pr-2">
          <span className="text-[10px] text-gray-400">低</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="w-4 h-3 rounded-sm"
                style={{ backgroundColor: `hsl(38, 90%, ${85 - (i / 7) * 50}%)` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">高</span>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
      <p className="text-xs font-medium text-gray-600 mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-medium text-gray-800">
            {typeof entry.value === 'number' && entry.value >= 1000
              ? `${(entry.value / 1000).toFixed(1)}k`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function VideoAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [activePlatformMetric, setActivePlatformMetric] = useState<'views' | 'likes' | 'shares'>('views');

  const platformMetrics = {
    views: { label: '播放量', color: '#F59E0B' },
    likes: { label: '点赞', color: '#EF4444' },
    shares: { label: '分享', color: '#3B82F6' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">视频数据分析</h1>
                <p className="text-xs text-gray-400">全面了解短视频运营表现</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  timeRange === '7d' ? 'bg-white/10 text-amber-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                近7天
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  timeRange === '30d' ? 'bg-white/10 text-amber-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                近30天
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Row 1: Overview Stats */}
        <div className="grid grid-cols-4 gap-4">
          {overviewStats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} index={idx} />
          ))}
        </div>

        {/* Row 2: Platform Bar Chart + Type Pie Chart */}
        <div className="grid grid-cols-2 gap-5">
          {/* Platform Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Monitor size={18} className="text-amber-500" />
                各平台数据对比
              </h3>
              <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
                {(Object.keys(platformMetrics) as Array<keyof typeof platformMetrics>).map(key => (
                  <button
                    key={key}
                    onClick={() => setActivePlatformMetric(key)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                      activePlatformMetric === key ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    {platformMetrics[key].label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={platformData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey={activePlatformMetric}
                  fill={platformMetrics[activePlatformMetric].color}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            {/* Mini stats */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
              {platformData.map(pl => (
                <div key={pl.name} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pl.color }} />
                    <span className="text-[10px] text-gray-500">{pl.name.split(' ')[0]}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {(pl.views / 10000).toFixed(1)}万
                  </p>
                  <p className="text-[10px] text-gray-400">总播放</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Type Distribution + Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Target size={18} className="text-amber-500" />
              视频类型效果分析
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Pie Chart */}
              <div>
                <p className="text-xs text-gray-500 mb-2 text-center">类型分布</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {typeData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {typeData.map(t => (
                    <div key={t.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-[10px] text-gray-600">{t.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">{t.value}个</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart */}
              <div>
                <p className="text-xs text-gray-500 mb-2 text-center">综合表现</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={typePerformanceData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: '#D1D5DB' }} />
                    <Radar name="求职技巧" dataKey="求职技巧" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={1.5} />
                    <Radar name="成功故事" dataKey="成功故事" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="热门趋势" dataKey="热门趋势" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={1.5} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-500" />
              播放量趋势
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 rounded" />
                <span className="text-gray-500">播放量</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-400 rounded" />
                <span className="text-gray-500">点赞</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-400 rounded" />
                <span className="text-gray-500">评论</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timeRange === '7d' ? trend7Data : trend30Data}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2.5} fill="url(#viewsGradient)" dot={{ fill: '#F59E0B', r: 3 }} activeDot={{ r: 5 }} />
              {timeRange === '7d' && (
                <>
                  <Area type="monotone" dataKey="likes" stroke="#F87171" strokeWidth={2} fill="url(#likesGradient)" dot={{ fill: '#F87171', r: 2 }} />
                  <Line type="monotone" dataKey="comments" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 2 }} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Row 4: Top Videos + Best Time Heatmap */}
        <div className="grid grid-cols-12 gap-5">
          {/* Top Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Flame size={18} className="text-amber-500" />
                热门视频排行
              </h3>
              <button className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                查看全部
                <ChevronRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 w-10">排名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">视频</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">播放量</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">点赞</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">评论</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">分享</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topVideos.map((video, idx) => (
                    <motion.tr
                      key={video.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          idx < 3 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{video.emoji}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">{video.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{video.type}</span>
                              <span className="text-[10px] text-gray-400">{video.platforms} 平台</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          {video.views >= 10000 ? `${(video.views / 10000).toFixed(1)}万` : video.views || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-600">{video.likes || '-'}</td>
                      <td className="px-4 py-3.5 text-right text-gray-600">{video.comments || '-'}</td>
                      <td className="px-4 py-3.5 text-right text-gray-600">{video.shares || '-'}</td>
                      <td className="px-4 py-3.5 text-center">
                        {video.ctr ? (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            {video.ctr}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Best Time Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-5 bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              最佳发布时间热力图
            </h3>
            <p className="text-xs text-gray-400 mb-4">颜色越深表示该时段的互动量越高</p>
            <HeatmapChart />

            {/* Best time recommendation */}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-700">最佳发布时段推荐</p>
                  <p className="text-[11px] text-amber-600 mt-1">
                    根据数据分析，<strong>周六 21:00</strong> 是互动量最高的时段，建议优先排期。周五 18:00 和周日 21:00 也是不错的选择。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 5: Weekly Platform Breakdown + Engagement Funnel */}
        <div className="grid grid-cols-2 gap-5">
          {/* Weekly Stacked Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Activity size={18} className="text-amber-500" />
              本周各平台日播放量
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyPlatformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="TikTok" stackId="a" fill="#000000" radius={[0, 0, 0, 0]} />
                <Bar dataKey="YouTube" stackId="a" fill="#FF0000" radius={[0, 0, 0, 0]} />
                <Bar dataKey="FB" stackId="a" fill="#1877F2" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Instagram" stackId="a" fill="#E4405F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Engagement Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <MousePointerClick size={18} className="text-amber-500" />
              用户转化漏斗
            </h3>
            <div className="space-y-3">
              {[
                { label: '视频曝光', value: 125000, max: 125000, color: 'from-gray-600 to-gray-700', icon: <Eye size={16} /> },
                { label: '点击播放', value: 94900, max: 125000, color: 'from-blue-500 to-blue-600', icon: <Play size={16} /> },
                { label: '完播', value: 51200, max: 125000, color: 'from-emerald-500 to-emerald-600', icon: <CheckIcon size={16} /> },
                { label: '点赞', value: 6713, max: 125000, color: 'from-rose-500 to-rose-600', icon: <Heart size={16} /> },
                { label: '评论/分享', value: 2890, max: 125000, color: 'from-amber-500 to-yellow-500', icon: <Share2 size={16} /> },
                { label: '访问网站', value: 1240, max: 125000, color: 'from-purple-500 to-purple-600', icon: <MousePointerClick size={16} /> },
              ].map((item, idx) => {
                const rate = ((item.value / item.max) * 100).toFixed(1);
                const prevValue = idx > 0 ? [
                  125000, 94900, 51200, 6713, 2890, 1240
                ][idx - 1] : item.max;
                const conversionRate = idx > 0 ? ((item.value / prevValue) * 100).toFixed(1) : '100';
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{item.icon}</span>
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-800">
                          {item.value >= 10000 ? `${(item.value / 10000).toFixed(1)}万` : item.value.toLocaleString()}
                        </span>
                        {idx > 0 && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {conversionRate}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / item.max) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-end px-2`}
                      >
                        <span className="text-[10px] text-white font-medium">{rate}%</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Row 6: Platform Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {platformData.map((pl, idx) => (
            <motion.div
              key={pl.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: pl.color + '15' }}>
                  <Monitor size={16} style={{ color: pl.color }} />
                </span>
                <span className="text-sm font-medium text-gray-700">{pl.name}</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">播放量</span>
                  <span className="font-medium text-gray-700">{(pl.views / 10000).toFixed(1)}万</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">点赞</span>
                  <span className="font-medium text-gray-700">{pl.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">评论</span>
                  <span className="font-medium text-gray-700">{pl.comments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">分享</span>
                  <span className="font-medium text-gray-700">{pl.shares.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">互动率</span>
                    <span className="font-semibold text-emerald-600">
                      {((pl.likes + pl.comments + pl.shares) / pl.views * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Icons ──────────────────────────────────────────────────────

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
