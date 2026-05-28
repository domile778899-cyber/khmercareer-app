import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  TrendingUp, Users, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Target, Zap, Globe, Calendar, Download, Filter, RefreshCw,
  Activity, UserPlus, UserMinus, Repeat, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}

const growthData = [
  { date: 'Jan 1', users: 1200, newUsers: 180, churned: 45, active: 980 },
  { date: 'Jan 5', users: 1350, newUsers: 220, churned: 70, active: 1100 },
  { date: 'Jan 10', users: 1520, newUsers: 250, churned: 80, active: 1250 },
  { date: 'Jan 15', users: 1680, newUsers: 280, churned: 120, active: 1380 },
  { date: 'Jan 20', users: 1890, newUsers: 310, churned: 100, active: 1560 },
  { date: 'Jan 25', users: 2100, newUsers: 350, churned: 140, active: 1720 },
  { date: 'Jan 30', users: 2340, newUsers: 380, churned: 130, active: 1920 },
];

const channelData = [
  { name: 'Organic Search', value: 35, color: '#D4AF37' },
  { name: 'Social Media', value: 28, color: '#3B82F6' },
  { name: 'Referral', value: 18, color: '#059669' },
  { name: 'Direct', value: 12, color: '#8B5CF6' },
  { name: 'Email', value: 7, color: '#F59E0B' },
];

const cohortData = [
  { week: 'W1', retention: [100, 85, 72, 65, 58, 52, 48] },
  { week: 'W2', retention: [100, 82, 70, 62, 55, 50] },
  { week: 'W3', retention: [100, 88, 75, 68, 60] },
  { week: 'W4', retention: [100, 80, 68, 60] },
];

const abTests = [
  { id: '1', name: 'Homepage Hero CTA', variant: 'A: "Find Jobs" vs B: "Get Hired"', status: 'running', winner: null, uplift: '+12%' },
  { id: '2', name: 'Signup Form Length', variant: 'A: 2-step vs B: 1-step', status: 'completed', winner: 'B', uplift: '+18%' },
  { id: '3', name: 'Push Notification Time', variant: 'A: 9AM vs B: 6PM', status: 'running', winner: null, uplift: '+7%' },
];

export default function GrowthEngine() {
  const [timeRange, setTimeRange] = useState('30d');
  const ranges = ['7d', '30d', '90d', '1y'];
  const COLORS = ['#D4AF37', '#3B82F6', '#059669', '#8B5CF6', '#F59E0B'];
  return <div className="min-h-screen bg-[#0D0B09] text-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <AnimatedSection><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-gold" /></div><div><h1 className="text-2xl font-bold">Growth Engine</h1><p className="text-white/40 text-sm">User growth analysis, A/B testing, and retention analytics</p></div></div></AnimatedSection>
      <div className="flex gap-2 mt-6">{ranges.map(r => <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeRange === r ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{r}</button>)}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-emerald-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +24%</span></div><p className="text-white text-2xl font-bold">12,450</p><p className="text-white/40 text-xs mt-1">Total Users</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><UserPlus className="w-5 h-5 text-blue-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +18%</span></div><p className="text-white text-2xl font-bold">2,340</p><p className="text-white/40 text-xs mt-1">New Users</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Repeat className="w-5 h-5 text-amber-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +5%</span></div><p className="text-white text-2xl font-bold">48%</p><p className="text-white/40 text-xs mt-1">7-Day Retention</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center"><UserMinus className="w-5 h-5 text-red-400" /></div><span className="text-red-400 text-xs flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" /> -2%</span></div><p className="text-white text-2xl font-bold">5.2%</p><p className="text-white/40 text-xs mt-1">Churn Rate</p></motion.div>
      </div>
      <AnimatedSection className="mt-8" delay={0.1}>
        <div className="bg-[#1A1714] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-gold" /> Growth Trends</h2>
          <ResponsiveContainer width="100%" height={280}><AreaChart data={growthData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="date" stroke="#666" fontSize={11} /><YAxis stroke="#666" fontSize={11} /><Tooltip contentStyle={{ backgroundColor: '#1A1714', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} /><Area type="monotone" dataKey="users" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.1} strokeWidth={2} /><Area type="monotone" dataKey="active" stroke="#059669" fill="#059669" fillOpacity={0.05} strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </div>
      </AnimatedSection>
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <AnimatedSection delay={0.15}><div className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-gold" /> Acquisition Channels</h2><ResponsiveContainer width="100%" height={240}><RePieChart><Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">{channelData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1A1714', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} /><Legend fontSize={11} /></RePieChart></ResponsiveContainer></div></AnimatedSection>
        <AnimatedSection delay={0.2}><div className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-gold" /> Cohort Retention</h2><div className="space-y-2">{cohortData.map(c => <div key={c.week} className="flex items-center gap-3"><span className="text-white/40 text-xs w-8">{c.week}</span><div className="flex-1 flex gap-1">{c.retention.map((r, i) => <div key={i} className="flex-1 h-6 rounded-sm flex items-center justify-center text-[9px] font-medium" style={{ backgroundColor: i === 0 ? '#D4AF37' : r > 60 ? '#059669' : r > 40 ? '#3B82F6' : '#666', color: 'white', opacity: 0.7 + (r / 300) }}>{r}%</div>)}</div></div>)}</div><div className="flex gap-4 mt-3 text-[10px] text-white/30"><span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#D4AF37]" /> W1</span><span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#059669]" /> &gt;60%</span><span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#3B82F6]" /> 40-60%</span></div></div></AnimatedSection>
      </div>
      <AnimatedSection className="mt-6" delay={0.25}>
        <div className="bg-[#1A1714] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-gold" /> A/B Tests</h2>
          <div className="space-y-3">{abTests.map(t => <div key={t.id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4"><div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold shrink-0">{t.id}</div><div className="flex-1 min-w-0"><h3 className="text-white text-sm font-medium">{t.name}</h3><p className="text-white/40 text-xs">{t.variant}</p></div><span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${t.status === 'running' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{t.status}</span>{t.winner && <span className="text-xs text-gold font-medium shrink-0">Winner: {t.winner}</span>}<span className="text-emerald-400 text-xs font-medium shrink-0">{t.uplift}</span></div>)}</div>
        </div>
      </AnimatedSection>
    </div>
  </div>;
}
