import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles, TrendingUp, Target, Share2, BarChart3, Copy,
  CheckCircle2, Zap, FileText, Video, Megaphone,
  Palette, Trash2, Eye, RefreshCw,
  Bot, X
} from 'lucide-react';
import { apiClient } from '../../api/client';

interface PromotionContent {
  id: string; title: string; type: 'social' | 'email' | 'ad' | 'blog' | 'video_script';
  content: string; platform?: string; status: 'draft' | 'published' | 'scheduled';
  createdAt: string; metrics?: { views: number; clicks: number; shares: number }; aiGenerated: boolean;
}
interface ContentTemplate { id: string; name: string; type: string; description: string; icon: typeof FileText; }

const templates: ContentTemplate[] = [
  { id: '1', name: 'Job Post Social', type: 'social', description: 'Generate social media posts for job listings', icon: Share2 },
  { id: '2', name: 'Email Campaign', type: 'email', description: 'Newsletter and recruitment email templates', icon: FileText },
  { id: '3', name: 'Ad Copy Generator', type: 'ad', description: 'Google/Facebook ad copy optimized for conversions', icon: Megaphone },
  { id: '4', name: 'Blog Article', type: 'blog', description: 'SEO-optimized blog content', icon: FileText },
  { id: '5', name: 'Video Script', type: 'video_script', description: 'Video scripts for TikTok/YouTube', icon: Video },
  { id: '6', name: 'Brand Kit', type: 'brand', description: 'Brand colors, fonts, and guidelines', icon: Palette },
];

const mockContents: PromotionContent[] = [
  { id: '1', title: 'Hiring 500 Garment Workers', type: 'social', content: 'We are hiring 500 garment workers! Competitive salary, free accommodation. Apply now!', platform: 'Facebook', status: 'published', createdAt: '2025-01-15T10:00:00Z', metrics: { views: 12500, clicks: 3400, shares: 890 }, aiGenerated: true },
  { id: '2', title: 'Weekly Newsletter Issue #24', type: 'email', content: 'Dear subscribers, this week we have 1,200 new job openings...', status: 'published', createdAt: '2025-01-14T08:00:00Z', metrics: { views: 8900, clicks: 2100, shares: 120 }, aiGenerated: true },
  { id: '3', title: 'Google Ad — IT Jobs', type: 'ad', content: 'Hire Top IT Talent | 500+ Developers | Post in 5 Minutes', platform: 'Google', status: 'published', createdAt: '2025-01-13T14:00:00Z', metrics: { views: 23400, clicks: 5600, shares: 0 }, aiGenerated: true },
  { id: '4', title: 'Find Your Dream Job', type: 'blog', content: 'Finding the right job can be challenging...', status: 'published', createdAt: '2025-01-10T09:00:00Z', metrics: { views: 6700, clicks: 1200, shares: 340 }, aiGenerated: true },
];

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}
function StatCard({ icon: Icon, label, value, change, color }: { icon: typeof BarChart3; label: string; value: string; change: string; color: string }) {
  return <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5">
    <div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}><Icon className="w-5 h-5" style={{ color }} /></div><span className="text-emerald-400 text-xs font-medium">{change}</span></div>
    <p className="text-white text-2xl font-bold">{value}</p><p className="text-white/40 text-xs mt-1">{label}</p>
  </motion.div>;
}

function GenerateModal({ template, onClose, onGenerated }: { template: ContentTemplate; onClose: () => void; onGenerated: (c: PromotionContent) => void }) {
  const [topic, setTopic] = useState(''); const [audience, setAudience] = useState(''); const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(''); const [title, setTitle] = useState('');
  const handleGenerate = async () => { if (!topic.trim()) return; setGenerating(true); try { const r = await apiClient.post('/ai/generate', { template: template.type, topic, audience, language: 'zh' }); const d = r.data as { content: string; title: string }; setResult(d.content); setTitle(d.title); } catch { setTitle(`${template.name} — ${topic}`); setResult(`[AI Generated ${template.name}]\n\nTopic: ${topic}\n\nThis is AI-generated ${template.type} content optimized for your target audience${audience ? ' (' + audience + ')' : ''}.`); } setGenerating(false); };
  const handlePublish = () => { const c: PromotionContent = { id: crypto.randomUUID(), title: title || `${template.name} — ${topic}`, type: template.type as PromotionContent['type'], content: result, status: 'draft', createdAt: new Date().toISOString(), aiGenerated: true }; onGenerated(c); onClose(); };
  return <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div className="bg-[#1A1714] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6"><h3 className="text-white text-lg font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-gold" /> AI — {template.name}</h3><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white/60" /></button></div>
      {!result ? <div className="space-y-4">
        <div><label className="text-white/60 text-sm mb-1 block">Topic</label><input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Hiring 500 garment workers" className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" /></div>
        <div><label className="text-white/60 text-sm mb-1 block">Audience</label><input type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. 18-35 job seekers" className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" /></div>
        <button onClick={handleGenerate} disabled={!topic.trim() || generating} className="w-full bg-gold hover:bg-[#B8941F] text-[#1A1714] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}</button>
      </div> : <div className="space-y-4">
        <div><label className="text-white/60 text-sm mb-1 block">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" /></div>
        <div><label className="text-white/60 text-sm mb-1 block">Content</label><textarea value={result} onChange={e => setResult(e.target.value)} rows={10} className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50 resize-none" /></div>
        <div className="flex gap-3"><button onClick={() => setResult('')} className="flex-1 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/5 text-sm">Regenerate</button><button onClick={handlePublish} className="flex-1 bg-gold hover:bg-[#B8941F] text-[#1A1714] font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Save</button></div>
      </div>}
    </motion.div>
  </motion.div>;
}

export default function AIPromotionCenter() {
  const [contents, setContents] = useState<PromotionContent[]>(mockContents);
  const [activeTab, setActiveTab] = useState<'all' | 'social' | 'email' | 'ad' | 'blog' | 'video_script'>('all');
  const [generateTemplate, setGenerateTemplate] = useState<ContentTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filtered = activeTab === 'all' ? contents : contents.filter(c => c.type === activeTab);
  const handleCopy = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const totalViews = contents.reduce((s, c) => s + (c.metrics?.views || 0), 0);
  const totalClicks = contents.reduce((s, c) => s + (c.metrics?.clicks || 0), 0);
  return <div className="min-h-screen bg-[#0D0B09] text-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <AnimatedSection><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-gold" /></div><div><h1 className="text-2xl font-bold">AI Promotion Center</h1><p className="text-white/40 text-sm">AI content generation and promotion management</p></div></div></AnimatedSection>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard icon={FileText} label="Content" value={String(contents.length)} change="+12%" color="#D4AF37" />
        <StatCard icon={Eye} label="Views" value={totalViews.toLocaleString()} change="+28%" color="#059669" />
        <StatCard icon={TrendingUp} label="Clicks" value={totalClicks.toLocaleString()} change="+15%" color="#3B82F6" />
        <StatCard icon={Bot} label="AI Gen" value={String(contents.filter(c => c.aiGenerated).length)} change="100%" color="#D4AF37" />
      </div>
      <AnimatedSection className="mt-10" delay={0.1}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-gold" /> Templates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => <motion.button key={t.id} whileHover={{ y: -2 }} onClick={() => setGenerateTemplate(t)} className="bg-[#1A1714] border border-white/10 rounded-xl p-5 text-left hover:border-gold/40 transition-colors"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><t.icon className="w-5 h-5 text-gold" /></div><h3 className="text-white font-semibold text-sm">{t.name}</h3></div><p className="text-white/40 text-xs">{t.description}</p></motion.button>)}
        </div>
      </AnimatedSection>
      <AnimatedSection className="mt-10" delay={0.2}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-gold" /> Content</h2>
          <div className="flex gap-2 flex-wrap">{([['all', 'All'], ['social', 'Social'], ['email', 'Email'], ['ad', 'Ad'], ['blog', 'Blog'], ['video_script', 'Video']] as const).map(([k, l]) => <button key={k} onClick={() => setActiveTab(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === k ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{l}</button>)}</div>
        </div>
        <div className="space-y-3">{filtered.map(c => <motion.div key={c.id} layout className="bg-[#1A1714] border border-white/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.type === 'social' ? 'bg-blue-500/20 text-blue-400' : c.type === 'email' ? 'bg-purple-500/20 text-purple-400' : c.type === 'ad' ? 'bg-red-500/20 text-red-400' : c.type === 'blog' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.type}</span>
                {c.aiGenerated && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold font-medium">AI</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>{c.status}</span>
              </div>
              <h3 className="text-white font-medium text-sm">{c.title}</h3>
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{c.content}</p>
              {c.metrics && <div className="flex gap-4 mt-2"><span className="text-white/30 text-[11px] flex items-center gap-1"><Eye className="w-3 h-3" /> {c.metrics.views.toLocaleString()}</span><span className="text-white/30 text-[11px] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {c.metrics.clicks.toLocaleString()}</span><span className="text-white/30 text-[11px] flex items-center gap-1"><Share2 className="w-3 h-3" /> {c.metrics.shares.toLocaleString()}</span></div>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleCopy(c.id, c.content)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Copy">{copiedId === c.id ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4 text-white/40" />}</button>
              <button onClick={() => setContents(p => p.filter(x => x.id !== c.id))} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-white/40" /></button>
            </div>
          </div>
        </motion.div>)}</div>
      </AnimatedSection>
    </div>
    {generateTemplate && <GenerateModal template={generateTemplate} onClose={() => setGenerateTemplate(null)} onGenerated={c => setContents(p => [c, ...p])} />}
  </div>;
}
