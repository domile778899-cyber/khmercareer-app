import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Video, Film, Music, Type, Image, Play, Pause,
  Download, Trash2, Copy, CheckCircle2, Wand2, Layers, Clock,
  FileVideo, Settings, Sparkles, Plus, X, ChevronRight, Eye
} from 'lucide-react';
import { apiClient } from '../../api/client';

interface VideoProject { id: string; name: string; status: 'draft' | 'rendering' | 'done'; template: string; duration: number; createdAt: string; thumbnail?: string; }
interface VideoTemplate { id: string; name: string; category: string; duration: number; previewUrl?: string; description: string; }

const templates: VideoTemplate[] = [
  { id: '1', name: 'Job Posting Promo', category: 'recruitment', duration: 15, description: 'Quick job posting video with animated text and logo' },
  { id: '2', name: 'Company Intro', category: 'branding', duration: 30, description: 'Professional company introduction with B-roll placeholders' },
  { id: '3', name: 'Event Highlight', category: 'event', duration: 60, description: 'Event recap with dynamic transitions' },
  { id: '4', name: 'Training Teaser', category: 'education', duration: 20, description: 'Short training course promotional video' },
  { id: '5', name: 'Testimonial', category: 'social', duration: 45, description: 'Employee/customer testimonial format' },
  { id: '6', name: 'Daily Vlog', category: 'social', duration: 30, description: 'Casual daily vlog style for TikTok/Reels' },
];

const mockProjects: VideoProject[] = [
  { id: '1', name: 'Garment Factory Hiring Q1', status: 'done', template: 'Job Posting Promo', duration: 15, createdAt: '2025-01-10T08:00:00Z' },
  { id: '2', name: 'Angkor Hotel Brand Video', status: 'done', template: 'Company Intro', duration: 30, createdAt: '2025-01-12T10:00:00Z' },
  { id: '3', name: 'IT Jobs Campaign', status: 'rendering', template: 'Job Posting Promo', duration: 15, createdAt: '2025-01-15T14:00:00Z' },
  { id: '4', name: 'Training Center Promo', status: 'draft', template: 'Training Teaser', duration: 20, createdAt: '2025-01-16T09:00:00Z' },
];

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay }}>{children}</motion.div>;
}

function CreateProjectModal({ template, onClose, onCreated }: { template: VideoTemplate; onClose: () => void; onCreated: (p: VideoProject) => void }) {
  const [name, setName] = useState(''); const [generating, setGenerating] = useState(false);
  const handleCreate = async () => { if (!name.trim()) return; setGenerating(true); try { await apiClient.post('/video/projects', { name, templateId: template.id }); } catch {} onCreated({ id: crypto.randomUUID(), name: name.trim(), status: 'draft', template: template.name, duration: template.duration, createdAt: new Date().toISOString() }); setGenerating(false); onClose(); };
  return <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div className="bg-[#1A1714] border border-white/10 rounded-2xl p-6 w-full max-w-lg" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
      <div className="flex items-center justify-between mb-6"><h3 className="text-white text-lg font-semibold flex items-center gap-2"><Film className="w-5 h-5 text-gold" /> New Project</h3><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white/60" /></button></div>
      <div className="space-y-4">
        <div><label className="text-white/60 text-sm mb-1 block">Project Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. January Hiring Campaign" className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" /></div>
        <div className="bg-white/5 rounded-lg p-3"><p className="text-white/60 text-xs">Template: <span className="text-gold">{template.name}</span></p><p className="text-white/40 text-xs mt-1">{template.description}</p><p className="text-white/40 text-xs mt-1">Duration: {template.duration}s</p></div>
        <button onClick={handleCreate} disabled={!name.trim() || generating} className="w-full bg-gold hover:bg-[#B8941F] text-[#1A1714] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{generating ? 'Creating...' : <><Plus className="w-4 h-4" /> Create Project</>}</button>
      </div>
    </motion.div>
  </motion.div>;
}

export default function VideoFactory() {
  const [projects, setProjects] = useState<VideoProject[]>(mockProjects);
  const [activeCategory, setActiveCategory] = useState('all');
  const [createTemplate, setCreateTemplate] = useState<VideoTemplate | null>(null);
  const categories = ['all', 'recruitment', 'branding', 'event', 'education', 'social'];
  const filteredTemplates = activeCategory === 'all' ? templates : templates.filter(t => t.category === activeCategory);
  const doneCount = projects.filter(p => p.status === 'done').length;
  return <div className="min-h-screen bg-[#0D0B09] text-white">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <AnimatedSection><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><Film className="w-5 h-5 text-gold" /></div><div><h1 className="text-2xl font-bold">Video Factory</h1><p className="text-white/40 text-sm">Video templates, batch generation, editing, and publishing</p></div></div></AnimatedSection>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Video className="w-5 h-5 text-purple-400" /></div></div><p className="text-white text-2xl font-bold">{projects.length}</p><p className="text-white/40 text-xs mt-1">Total Projects</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div></div><p className="text-white text-2xl font-bold">{doneCount}</p><p className="text-white/40 text-xs mt-1">Completed</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-400" /></div></div><p className="text-white text-2xl font-bold">{projects.filter(p => p.status === 'rendering').length}</p><p className="text-white/40 text-xs mt-1">Rendering</p></motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Layers className="w-5 h-5 text-blue-400" /></div></div><p className="text-white text-2xl font-bold">{templates.length}</p><p className="text-white/40 text-xs mt-1">Templates</p></motion.div>
      </div>
      <AnimatedSection className="mt-10" delay={0.1}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Film className="w-5 h-5 text-gold" /> Templates</h2>
        <div className="flex gap-2 mb-4 flex-wrap">{categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${activeCategory === c ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{c}</button>)}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredTemplates.map(t => <motion.div key={t.id} whileHover={{ y: -2 }} className="bg-[#1A1714] border border-white/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
          <div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center"><Film className="w-6 h-6 text-gold" /></div><div><h3 className="text-white font-semibold text-sm">{t.name}</h3><p className="text-white/40 text-[10px] capitalize">{t.category} · {t.duration}s</p></div></div>
          <p className="text-white/40 text-xs mb-4">{t.description}</p>
          <button onClick={() => setCreateTemplate(t)} className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5" /> Use Template</button>
        </motion.div>)}</div>
      </AnimatedSection>
      <AnimatedSection className="mt-10" delay={0.2}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileVideo className="w-5 h-5 text-gold" /> Projects</h2>
        <div className="space-y-3">{projects.map(p => <div key={p.id} className="bg-[#1A1714] border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-gold/30 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{p.status === 'rendering' ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Settings className="w-5 h-5 text-amber-400" /></motion.div> : p.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <FileVideo className="w-5 h-5 text-white/40" />}</div>
          <div className="flex-1 min-w-0"><h3 className="text-white text-sm font-medium truncate">{p.name}</h3><p className="text-white/40 text-xs">{p.template} · {p.duration}s · {p.status}</p></div>
          <div className="flex gap-1 shrink-0">{p.status === 'done' && <button className="p-2 hover:bg-white/10 rounded-lg" title="Download"><Download className="w-4 h-4 text-white/40" /></button>}<button onClick={() => setProjects(x => x.filter(y => y.id !== p.id))} className="p-2 hover:bg-red-500/20 rounded-lg" title="Delete"><Trash2 className="w-4 h-4 text-white/40" /></button></div>
        </div>)}</div>
      </AnimatedSection>
    </div>
    {createTemplate && <CreateProjectModal template={createTemplate} onClose={() => setCreateTemplate(null)} onCreated={p => setProjects(x => [p, ...x])} />}
  </div>;
}
