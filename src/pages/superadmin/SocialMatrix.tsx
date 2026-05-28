import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Share2, Globe, Calendar, BarChart3, Clock, CheckCircle2, Zap,
  MessageSquare, AtSign, Bookmark, Rss, PlayCircle, MessageCircle,
  TrendingUp, Eye, ThumbsUp, Plus, Trash2, Edit3, Play, Pause,
  FileText, Image, Video, Hash, Send
} from 'lucide-react';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}

interface ScheduledPost { id: string; content: string; platform: string; scheduledAt: string; status: 'draft' | 'scheduled' | 'published' | 'failed'; type: 'text' | 'image' | 'video'; engagement?: { likes: number; shares: number; comments: number }; }

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Globe, color: '#1877F2', followers: '12.5K' },
  { id: 'instagram', name: 'Instagram', icon: MessageSquare, color: '#E4405F', followers: '8.2K' },
  { id: 'linkedin', name: 'LinkedIn', icon: AtSign, color: '#0A66C2', followers: '5.1K' },
  { id: 'twitter', name: 'Twitter/X', icon: Rss, color: '#1DA1F2', followers: '3.8K' },
  { id: 'youtube', name: 'YouTube', icon: PlayCircle, color: '#FF0000', followers: '2.4K' },
  { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: '#0088CC', followers: '6.7K' },
];

const mockPosts: ScheduledPost[] = [
  { id: '1', content: 'Hiring 500 garment workers in Phnom Penh! Apply now via KhmerCareer.', platform: 'facebook', scheduledAt: '2025-01-20T09:00:00Z', status: 'published', type: 'text', engagement: { likes: 245, shares: 89, comments: 34 } },
  { id: '2', content: 'Top 10 skills employers are looking for in 2025. Check out our latest blog!', platform: 'linkedin', scheduledAt: '2025-01-21T10:00:00Z', status: 'scheduled', type: 'image' },
  { id: '3', content: 'New training courses available! Upskill yourself today.', platform: 'instagram', scheduledAt: '2025-01-22T14:00:00Z', status: 'scheduled', type: 'video' },
  { id: '4', content: 'Live recruitment event tomorrow at 9AM. Don't miss it!', platform: 'twitter', scheduledAt: '2025-01-23T08:00:00Z', status: 'draft', type: 'text' },
];

export default function SocialMatrix() {
  const [posts, setPosts] = useState<ScheduledPost[]>(mockPosts);
  const [activePlatform, setActivePlatform] = useState('all');
  const [showCalendar, setShowCalendar] = useState(true);
  const filtered = activePlatform === 'all' ? posts : posts.filter(p => p.platform === activePlatform);
  const totalEngagement = posts.reduce((s, p) => s + (p.engagement?.likes || 0) + (p.engagement?.shares || 0) + (p.engagement?.comments || 0), 0);
  return <div className="min-h-screen bg-[#0D0B09] text-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <AnimatedSection><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><Share2 className="w-5 h-5 text-gold" /></div><div><h1 className="text-2xl font-bold">Social Matrix</h1><p className="text-white/40 text-sm">Multi-platform publishing, content calendar, and analytics</p></div></div></AnimatedSection>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
        {platforms.map(p => <motion.div key={p.id} whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-4 text-center"><p.icon className="w-6 h-6 mx-auto mb-2" style={{ color: p.color }} /><p className="text-white text-sm font-medium">{p.name}</p><p className="text-white/40 text-xs">{p.followers}</p></motion.div>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Send className="w-5 h-5 text-emerald-400" /></div><span className="text-emerald-400 text-xs">+15%</span></div><p className="text-white text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p><p className="text-white/40 text-xs mt-1">Published</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-400" /></div></div><p className="text-white text-2xl font-bold">{posts.filter(p => p.status === 'scheduled').length}</p><p className="text-white/40 text-xs mt-1">Scheduled</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><ThumbsUp className="w-5 h-5 text-blue-400" /></div><span className="text-emerald-400 text-xs">+22%</span></div><p className="text-white text-2xl font-bold">{totalEngagement.toLocaleString()}</p><p className="text-white/40 text-xs mt-1">Engagements</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Eye className="w-5 h-5 text-purple-400" /></div><span className="text-emerald-400 text-xs">+30%</span></div><p className="text-white text-2xl font-bold">45.2K</p><p className="text-white/40 text-xs mt-1">Reach</p></motion.div>
      </div>
      <AnimatedSection className="mt-8" delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-gold" /> Content Calendar</h2>
          <div className="flex gap-2 flex-wrap">{['all', ...platforms.map(p => p.id)].map(pid => <button key={pid} onClick={() => setActivePlatform(pid)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${activePlatform === pid ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{pid === 'all' ? 'All' : platforms.find(p => p.id === pid)?.name}</button>)}</div>
        </div>
        <div className="bg-[#1A1714] border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-white/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="bg-[#1A1714] px-3 py-2 text-[11px] text-white/40 font-medium">{d}</div>)}
            {Array.from({ length: 31 }, (_, i) => {
              const dayPosts = posts.filter(p => new Date(p.scheduledAt).getDate() === i + 1);
              return <div key={i} className="bg-[#1A1714] min-h-[80px] p-2 border-t border-white/5">
                <span className="text-white/30 text-[11px]">{i + 1}</span>
                {dayPosts.map(p => <div key={p.id} className={`mt-1 px-1.5 py-0.5 rounded text-[9px] truncate ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/40'}`}>{p.platform}: {p.content.slice(0, 15)}...</div>)}
              </div>;
            })}
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="mt-6" delay={0.2}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gold" /> Scheduled Posts</h2>
        <div className="space-y-3">{filtered.map(p => <div key={p.id} className="bg-[#1A1714] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{p.type === 'video' ? <Video className="w-5 h-5 text-red-400" /> : p.type === 'image' ? <Image className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-white/40" />}</div>
          <div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{p.content}</p><div className="flex gap-3 mt-1"><span className="text-white/30 text-[10px] capitalize">{p.platform}</span><span className="text-white/30 text-[10px]">{new Date(p.scheduledAt).toLocaleDateString()}</span><span className={`text-[10px] px-1.5 rounded ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/40'}`}>{p.status}</span></div></div>
          {p.engagement && <div className="flex gap-3 shrink-0 text-white/30 text-xs"><span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {p.engagement.likes}</span><span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {p.engagement.shares}</span></div>}
          <button onClick={() => setPosts(x => x.filter(y => y.id !== p.id))} className="p-2 hover:bg-red-500/20 rounded-lg shrink-0"><Trash2 className="w-4 h-4 text-white/40" /></button>
        </div>)}</div>
      </AnimatedSection>
    </div>
  </div>;
}
