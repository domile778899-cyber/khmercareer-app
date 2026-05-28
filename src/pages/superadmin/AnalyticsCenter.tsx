import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Eye, MousePointer, Clock,
  Globe, Smartphone, Monitor, Download, RefreshCw, Activity,
  Zap, ArrowUpRight, FileText, Calendar, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}

const realtimeData = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, users: Math.floor(Math.random() * 200) + 50, pageViews: Math.floor(Math.random() * 500) + 100 }));
const deviceData = [
  { name: 'Mobile', value: 62, color: '#D4AF37' },
  { name: 'Desktop', value: 28, color: '#3B82F6' },
  { name: 'Tablet', value: 10, color: '#059669' },
];
const topPages = [
  { path: '/jobs', views: 15200, avgTime: '2:34' },
  { path: '/', views: 12800, avgTime: '1:45' },
  { path: '/live', views: 8900, avgTime: '8:12' },
  { path: '/courses', views: 6700, avgTime: '4:20' },
  { path: '/employers', views: 5400, avgTime: '3:15' },
];
const conversionData = [
  { stage: 'Visit', count: 25000 },
  { stage: 'Sign Up', count: 8200 },
  { stage: 'Apply', count: 4500 },
  { stage: 'Interview', count: 2100 },
  { stage: 'Hired', count: 890 },
];

export default function AnalyticsCenter() {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  const COLORS = ['#D4AF37', '#3B82F6', '#059669', '#8B5CF6'];
  return <div className="min-h-screen bg-[#0D0B09] text-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-gold" /></div><div><h1 className="text-2xl font-bold">Analytics Center</h1><p className="text-white/40 text-sm">Real-time data, charts, and report export</p></div></div>
          <div className="flex gap-2">
            <button onClick={handleRefresh} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><RefreshCw className={`w-4 h-4 text-white/60 ${refreshing ? 'animate-spin' : ''}`} /></button>
            <button className="px-4 py-2.5 bg-gold hover:bg-[#B8941F] text-[#1A1714] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
          </div>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-blue-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +8%</span></div><p className="text-white text-2xl font-bold">1,247</p><p className="text-white/40 text-xs mt-1">Online Now</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Eye className="w-5 h-5 text-purple-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +12%</span></div><p className="text-white text-2xl font-bold">48.5K</p><p className="text-white/40 text-xs mt-1">Page Views Today</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><MousePointer className="w-5 h-5 text-emerald-400" /></div><span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +5%</span></div><p className="text-white text-2xl font-bold">3.2%</p><p className="text-white/40 text-xs mt-1">Conversion Rate</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-400" /></div></div><p className="text-white text-2xl font-bold">4:32</p><p className="text-white/40 text-xs mt-1">Avg Session</p></motion.div>
      </div>
      <AnimatedSection className="mt-8" delay={0.1}>
        <div className="bg-[#1A1714] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-gold" /> Real-time Visitors (24h)</h2>
          <ResponsiveContainer width="100%" height={300}><AreaChart data={realtimeData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="time" stroke="#666" fontSize={10} /><YAxis stroke="#666" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#1A1714', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} /><Area type="monotone" dataKey="users" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.1} strokeWidth={2} name="Active Users" /><Area type="monotone" dataKey="pageViews" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.05} strokeWidth={2} name="Page Views" /></AreaChart></ResponsiveContainer>
        </div>
      </AnimatedSection>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <AnimatedSection delay={0.15}><div className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4 text-gold" /> Device Breakdown</h2><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">{deviceData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1A1714', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} /><Legend fontSize={11} /></PieChart></ResponsiveContainer></div></AnimatedSection>
        <AnimatedSection delay={0.2} className="lg:col-span-2"><div className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gold" /> Conversion Funnel</h2><ResponsiveContainer width="100%" height={200}><BarChart data={conversionData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis type="number" stroke="#666" fontSize={10} /><YAxis dataKey="stage" type="category" stroke="#666" fontSize={11} width={80} /><Tooltip contentStyle={{ backgroundColor: '#1A1714', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} /><Bar dataKey="count" fill="#D4AF37" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></AnimatedSection>
      </div>
      <AnimatedSection className="mt-6" delay={0.25}>
        <div className="bg-[#1A1714] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-gold" /> Top Pages</h2>
          <div className="space-y-2">{topPages.map((p, i) => <div key={p.path} className="flex items-center gap-4 bg-white/5 rounded-lg p-3"><span className="text-gold text-xs font-bold w-5">{i + 1}</span><span className="text-white text-sm flex-1">{p.path}</span><span className="text-white/40 text-xs">{p.views.toLocaleString()} views</span><span className="text-white/40 text-xs">{p.avgTime}</span><div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gold" style={{ width: `${(p.views / 15200) * 100}%` }} /></div></div>)}</div>
        </div>
      </AnimatedSection>
    </div>
  </div>;
}
