import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Save, Plus, Trash2, GripVertical,
  Clock, FileText, Scissors, Mic, Type, Music, Play, Pause,
  Square, Download, Share2, Film, Image, Volume2, Subtitles,
  Palette, Settings, CheckCircle2, AlertCircle, RefreshCw,
  Sparkles, Wand2, Eye, Layers, Video, AudioLines, Headphones,
  Monitor, Smartphone, Tablet, Star, Zap, ArrowRight, Copy,
  Check, MoreHorizontal, Upload, X, Maximize2, Minimize2,
  SkipBack, SkipForward, RotateCcw, Hash, Sliders, Globe,
  Sun, Moon, Contrast, Crop, Aperture, MousePointerClick
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface TimelineClip {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'subtitle';
  duration: number;
  thumbnail: string;
  color: string;
  track: number;
  startTime: number;
}

interface ScriptScene {
  id: number;
  shot: number;
  visual: string;
  narration: string;
  duration: number;
  transition: string;
}

interface SubtitleStyle {
  id: string;
  name: string;
  font: string;
  color: string;
  bgColor: string;
  animation: string;
  preview: string;
}

interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: string;
  sample: string;
  popular?: boolean;
}

interface BgmOption {
  id: string;
  name: string;
  genre: string;
  duration: number;
  tempo: string;
  mood: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────

const initialScript: ScriptScene[] = [
  { id: 1, shot: 1, visual: '黑色背景+金色Logo淡入，品牌色渐变光效', narration: '想在柬埔寨找到好工作？', duration: 3, transition: 'fade' },
  { id: 2, shot: 2, visual: '手机打开高棉职通车APP，流畅手势操作', narration: '用高棉职通车，一键申请！', duration: 4, transition: 'slide' },
  { id: 3, shot: 3, visual: '展示职位列表滑动，热门职位高亮标记', narration: '超过2400个职位等你挑选', duration: 5, transition: 'swipe' },
  { id: 4, shot: 4, visual: '点击申请按钮动画，表单自动填充效果', narration: '30秒完成申请，超简单！', duration: 4, transition: 'zoom' },
  { id: 5, shot: 5, visual: '展示视频面试场景，分屏对话效果', narration: '还能视频面试，不用跑腿', duration: 5, transition: 'cut' },
  { id: 6, shot: 6, visual: '成功案例笑脸轮播，数据动画增长', narration: '已经有50,000+人找到理想工作', duration: 4, transition: 'fade' },
  { id: 7, shot: 7, visual: 'CTA行动号召+二维码+下载按钮动效', narration: '扫码立即下载，开启新职业！', duration: 5, transition: 'fade' },
];

const mediaAssets = [
  { id: 'm1', name: '金边航拍.mp4', type: 'video' as const, duration: 15, thumbnail: '🚁', color: '#3B82F6', size: '45MB' },
  { id: 'm2', name: 'APP录屏.mp4', type: 'video' as const, duration: 20, thumbnail: '📱', color: '#3B82F6', size: '32MB' },
  { id: 'm3', name: '面试场景.mp4', type: 'video' as const, duration: 12, thumbnail: '🤝', color: '#3B82F6', size: '28MB' },
  { id: 'm4', name: '笑脸合集.mp4', type: 'video' as const, duration: 18, thumbnail: '😊', color: '#3B82F6', size: '38MB' },
  { id: 'm5', name: '办公室B.mp4', type: 'video' as const, duration: 25, thumbnail: '🏢', color: '#3B82F6', size: '52MB' },
  { id: 'm6', name: '城市风光.jpg', type: 'image' as const, duration: 5, thumbnail: '🌆', color: '#10B981', size: '4.2MB' },
  { id: 'm7', name: '金色粒子.jpg', type: 'image' as const, duration: 5, thumbnail: '✨', color: '#10B981', size: '2.1MB' },
  { id: 'm8', name: '高棉纹样.jpg', type: 'image' as const, duration: 5, thumbnail: '🎭', color: '#10B981', size: '3.5MB' },
  { id: 'm9', name: '轻快电子.mp3', type: 'audio' as const, duration: 30, thumbnail: '🎵', color: '#8B5CF6', size: '7.2MB' },
  { id: 'm10', name: '温暖钢琴.mp3', type: 'audio' as const, duration: 30, thumbnail: '🎹', color: '#8B5CF6', size: '9.1MB' },
  { id: 'm11', name: '动感节拍.mp3', type: 'audio' as const, duration: 30, thumbnail: '🥁', color: '#8B5CF6', size: '6.5MB' },
  { id: 'm12', name: '开场字幕.srt', type: 'subtitle' as const, duration: 5, thumbnail: '📝', color: '#F59E0B', size: '0.5MB' },
];

const initialTimeline: TimelineClip[] = [
  { id: 't1', name: '金色粒子背景', type: 'image', duration: 3, thumbnail: '✨', color: '#10B981', track: 0, startTime: 0 },
  { id: 't2', name: 'APP录屏', type: 'video', duration: 9, thumbnail: '📱', color: '#3B82F6', track: 0, startTime: 3 },
  { id: 't3', name: '职位列表', type: 'video', duration: 5, thumbnail: '📋', color: '#3B82F6', track: 0, startTime: 12 },
  { id: 't4', name: '申请动画', type: 'video', duration: 4, thumbnail: '👆', color: '#3B82F6', track: 0, startTime: 17 },
  { id: 't5', name: '面试场景', type: 'video', duration: 5, thumbnail: '🤝', color: '#3B82F6', track: 0, startTime: 21 },
  { id: 't6', name: '笑脸合集', type: 'video', duration: 4, thumbnail: '😊', color: '#3B82F6', track: 0, startTime: 26 },
  { id: 't7', name: 'CTA结尾', type: 'image', duration: 5, thumbnail: '🎯', color: '#10B981', track: 0, startTime: 30 },
  { id: 't8', name: '轻快电子BGM', type: 'audio', duration: 35, thumbnail: '🎵', color: '#8B5CF6', track: 1, startTime: 0 },
];

const subtitleStyles: SubtitleStyle[] = [
  { id: 's1', name: '金色高亮', font: 'Noto Sans Khmer', color: '#FFD700', bgColor: 'rgba(0,0,0,0.6)', animation: '逐字淡入', preview: '高棉职通车' },
  { id: 's2', name: '白色简洁', font: 'Source Han Sans', color: '#FFFFFF', bgColor: 'rgba(0,0,0,0.5)', animation: '滑动进入', preview: '一键申请工作' },
  { id: 's3', name: '高棉传统', font: 'Khmer OS', color: '#D4AF37', bgColor: 'rgba(60,30,0,0.7)', animation: '渐显', preview: '50,000+ 职位' },
  { id: 's4', name: '现代活力', font: 'Montserrat', color: '#F59E0B', bgColor: 'transparent', animation: '弹跳进入', preview: '立即下载!' },
  { id: 's5', name: '商务专业', font: 'Roboto', color: '#E5E7EB', bgColor: 'rgba(17,24,39,0.8)', animation: '平滑淡入', preview: '视频面试功能' },
];

const voiceOptions: VoiceOption[] = [
  { id: 'v1', name: ' Sopheap (柔美女声)', language: '高棉语', gender: '女', sample: 'សួស្តី', popular: true },
  { id: 'v2', name: ' Dara (温暖男声)', language: '高棉语', gender: '男', sample: 'សួស្តី', popular: true },
  { id: 'v3', name: ' Sophea (活泼女声)', language: '高棉语', gender: '女', sample: 'សួស្តី' },
  { id: 'v4', name: ' Nara (专业女声)', language: '中文', gender: '女', sample: '你好', popular: true },
  { id: 'v5', name: ' Li Ming (沉稳男声)', language: '中文', gender: '男', sample: '你好' },
  { id: 'v6', name: ' Emily (清新女声)', language: '英语', gender: '女', sample: 'Hello' },
  { id: 'v7', name: ' James (磁性男声)', language: '英语', gender: '男', sample: 'Hello' },
];

const bgmOptions: BgmOption[] = [
  { id: 'b1', name: '轻快电子乐', genre: '电子', duration: 180, tempo: '128 BPM', mood: '积极、活力' },
  { id: 'b2', name: '温暖钢琴曲', genre: '钢琴', duration: 240, tempo: '90 BPM', mood: '温馨、专业' },
  { id: 'b3', name: '动感流行', genre: '流行', duration: 200, tempo: '120 BPM', mood: '时尚、动感' },
  { id: 'b4', name: '企业宣传', genre: '商业', duration: 150, tempo: '110 BPM', mood: '正式、大气' },
  { id: 'b5', name: '高棉传统节拍', genre: '传统', duration: 160, tempo: '100 BPM', mood: '文化、传统' },
];

const transitions = [
  { key: 'fade', label: '淡入淡出', icon: <Sun size={14} /> },
  { key: 'slide', label: '滑动', icon: <ChevronRight size={14} /> },
  { key: 'swipe', label: '滑动擦除', icon: <ArrowRight size={14} /> },
  { key: 'zoom', label: '缩放', icon: <Aperture size={14} /> },
  { key: 'cut', label: '硬切', icon: <Scissors size={14} /> },
  { key: 'dissolve', label: '溶解', icon: <Aperture size={14} /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════
//  STEP 1: SCRIPT EDITING
// ═══════════════════════════════════════════════════════════════════════

function ScriptEditStep({ scenes, setScenes }: { scenes: ScriptScene[]; setScenes: React.Dispatch<React.SetStateAction<ScriptScene[]>> }) {
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const handleSceneChange = (id: number, field: keyof ScriptScene, value: string | number) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addScene = (afterId: number) => {
    const idx = scenes.findIndex(s => s.id === afterId);
    const newScene: ScriptScene = {
      id: Math.max(...scenes.map(s => s.id)) + 1,
      shot: scenes.length + 1,
      visual: '',
      narration: '',
      duration: 3,
      transition: 'fade',
    };
    const newScenes = [...scenes];
    newScenes.splice(idx + 1, 0, newScene);
    // Renumber shots
    newScenes.forEach((s, i) => { s.shot = i + 1; });
    setScenes(newScenes);
  };

  const removeScene = (id: number) => {
    if (scenes.length <= 1) return;
    const newScenes = scenes.filter(s => s.id !== id);
    newScenes.forEach((s, i) => { s.shot = i + 1; });
    setScenes(newScenes);
  };

  return (
    <div className="space-y-5">
      {/* Info Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash size={16} className="text-amber-500" />
            <span><strong className="text-gray-800">{scenes.length}</strong> 个镜头</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-amber-500" />
            <span>总时长 <strong className="text-amber-600">{totalDuration}秒</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Monitor size={16} className="text-amber-500" />
            <span>目标 <strong className="text-gray-800">30秒</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <RefreshCw size={13} />
            重置
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
            <Sparkles size={13} />
            AI 优化
          </button>
        </div>
      </div>

      {/* Scenes Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 w-10">#</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 min-w-[200px]">画面描述</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 min-w-[200px]">旁白文字</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 w-28">时长</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 w-32">转场</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {scenes.map((scene, idx) => (
                  <motion.tr
                    key={scene.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-amber-50/20 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <GripVertical size={14} className="text-gray-300 cursor-grab" />
                        <span className="w-7 h-7 bg-gradient-to-br from-amber-500 to-yellow-400 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                          {scene.shot}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={scene.visual}
                        onChange={e => handleSceneChange(scene.id, 'visual', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-transparent"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={scene.narration}
                        onChange={e => handleSceneChange(scene.id, 'narration', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-transparent"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          value={scene.duration}
                          onChange={e => handleSceneChange(scene.id, 'duration', parseInt(e.target.value) || 1)}
                          min={1}
                          max={60}
                          className="w-16 px-2 py-1.5 border border-gray-200 rounded-md text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                        <span className="text-xs text-gray-400 ml-1">秒</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={scene.transition}
                        onChange={e => handleSceneChange(scene.id, 'transition', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      >
                        {transitions.map(t => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => addScene(scene.id)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="在下方添加镜头"
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          onClick={() => removeScene(scene.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="删除镜头"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Sliders size={16} className="text-amber-500" />
          镜头时长分布
        </h4>
        <div className="flex gap-1 h-10 rounded-lg overflow-hidden bg-gray-50">
          {scenes.map((scene, idx) => {
            const pct = (scene.duration / totalDuration) * 100;
            return (
              <motion.div
                key={scene.id}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="h-full flex items-center justify-center text-[10px] text-white font-medium cursor-pointer hover:brightness-110 transition-all relative group"
                style={{ backgroundColor: `hsl(${40 + idx * 25}, 75%, 55%)` }}
              >
                <span className="truncate px-1">{scene.shot}</span>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  镜头 {scene.shot}: {scene.duration}秒 - {scene.narration.slice(0, 15)}...
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
          <span>0秒</span>
          <span>{Math.floor(totalDuration / 2)}秒</span>
          <span>{totalDuration}秒</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  STEP 2: MEDIA ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════

function MediaAssemblyStep({ timeline, setTimeline }: {
  timeline: TimelineClip[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineClip[]>>;
}) {
  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const filteredAssets = activeAssetFilter === 'all'
    ? mediaAssets
    : mediaAssets.filter(a => a.type === activeAssetFilter);

  const addToTimeline = (asset: typeof mediaAssets[0]) => {
    const lastClip = timeline.filter(t => t.track === 0).sort((a, b) => b.startTime + b.duration - (a.startTime + a.duration))[0];
    const startTime = lastClip ? lastClip.startTime + lastClip.duration : 0;
    const newClip: TimelineClip = {
      id: `t${Date.now()}`,
      name: asset.name,
      type: asset.type,
      duration: asset.duration,
      thumbnail: asset.thumbnail,
      color: asset.color,
      track: asset.type === 'audio' ? 1 : 0,
      startTime,
    };
    setTimeline(prev => [...prev, newClip]);
  };

  const removeFromTimeline = (clipId: string) => {
    setTimeline(prev => prev.filter(t => t.id !== clipId));
  };

  const totalDuration = Math.max(...timeline.map(t => t.startTime + t.duration), 0);
  const videoTrack = timeline.filter(t => t.track === 0);
  const audioTrack = timeline.filter(t => t.track === 1);

  const assetFilters = [
    { key: 'all', label: '全部', icon: <Layers size={14} /> },
    { key: 'video', label: '视频', icon: <Film size={14} /> },
    { key: 'image', label: '图片', icon: <Image size={14} /> },
    { key: 'audio', label: '音频', icon: <Music size={14} /> },
    { key: 'subtitle', label: '字幕', icon: <Type size={14} /> },
  ];

  return (
    <div className="grid grid-cols-12 gap-5" style={{ minHeight: '600px' }}>
      {/* Left: Asset Library */}
      <div className="col-span-3 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Layers size={16} className="text-amber-500" />
              素材库
            </h3>
          </div>
          {/* Filters */}
          <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
            {assetFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveAssetFilter(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 shrink-0 ${
                  activeAssetFilter === f.key
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          {/* Asset List */}
          <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="flex items-center gap-3 p-3 hover:bg-amber-50/30 transition-colors cursor-pointer group"
                onClick={() => addToTimeline(asset)}
              >
                <span className="text-2xl">{asset.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: asset.color + '20', color: asset.color }}>
                      {asset.type === 'video' ? '视频' : asset.type === 'image' ? '图片' : asset.type === 'audio' ? '音频' : '字幕'}
                    </span>
                    <span className="text-[10px] text-gray-400">{asset.size}</span>
                    {asset.duration > 0 && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock size={8} />
                        {asset.duration}s
                      </span>
                    )}
                  </div>
                </div>
                <Plus size={14} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Timeline */}
      <div className="col-span-9 space-y-4">
        {/* Preview */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          <div className="aspect-video relative flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-3 opacity-50">🎬</div>
              <p className="text-gray-400 text-sm">视频预览区域</p>
              <p className="text-gray-500 text-xs mt-1">点击播放按钮预览</p>
            </div>
            {/* Play button overlay */}
            <button
              onClick={() => setPlaying(!playing)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                {playing ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
              </div>
            </button>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: `${progress}%` }} />
            </div>
            {/* Time display */}
            <div className="absolute bottom-3 left-3 text-xs text-white/70 font-mono bg-black/50 px-2 py-0.5 rounded">
              {formatTime(progress * totalDuration / 100)} / {formatTime(totalDuration)}
            </div>
          </div>
        </div>

        {/* Timeline Editor */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Scissors size={16} className="text-amber-500" />
              时间线
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <SkipBack size={14} />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <SkipForward size={14} />
              </button>
              <span className="text-xs text-gray-400 font-mono ml-2">
                {formatTime(totalDuration)}
              </span>
            </div>
          </div>

          {/* Track Labels */}
          <div className="flex">
            {/* Track names */}
            <div className="w-24 shrink-0 border-r border-gray-100">
              <div className="h-14 flex items-center px-3 text-xs font-medium text-gray-500 border-b border-gray-50">
                <Film size={12} className="mr-1.5" />
                视频轨
              </div>
              <div className="h-14 flex items-center px-3 text-xs font-medium text-gray-500">
                <Music size={12} className="mr-1.5" />
                音频轨
              </div>
            </div>

            {/* Clips area */}
            <div className="flex-1 overflow-x-auto relative" style={{ minHeight: '112px' }}>
              {/* Time ruler */}
              <div className="h-5 border-b border-gray-100 flex relative">
                {Array.from({ length: Math.ceil(totalDuration / 5) + 1 }, (_, i) => (
                  <div key={i} className="absolute text-[9px] text-gray-300 font-mono" style={{ left: `${(i * 5 / Math.max(totalDuration, 1)) * 100}%` }}>
                    {i * 5}s
                  </div>
                ))}
              </div>

              {/* Video Track */}
              <div className="h-14 border-b border-gray-50 relative bg-gray-50/30">
                {videoTrack.map(clip => {
                  const left = totalDuration > 0 ? (clip.startTime / totalDuration) * 100 : 0;
                  const width = totalDuration > 0 ? (clip.duration / totalDuration) * 100 : 0;
                  return (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      className="absolute top-2 bottom-2 rounded-lg flex items-center px-2 gap-1.5 overflow-hidden shadow-sm cursor-pointer hover:brightness-110 transition-all group border border-white/20"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: clip.color + 'DD',
                        transformOrigin: 'left',
                      }}
                    >
                      <span className="text-sm">{clip.thumbnail}</span>
                      <span className="text-[10px] text-white font-medium truncate">{clip.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromTimeline(clip.id); }}
                        className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded transition-all"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Audio Track */}
              <div className="h-14 relative bg-gray-50/30">
                {audioTrack.map(clip => {
                  const left = totalDuration > 0 ? (clip.startTime / totalDuration) * 100 : 0;
                  const width = totalDuration > 0 ? (clip.duration / totalDuration) * 100 : 0;
                  return (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      className="absolute top-2 bottom-2 rounded-lg flex items-center px-2 gap-1.5 overflow-hidden shadow-sm cursor-pointer hover:brightness-110 transition-all group border border-white/20"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: clip.color + 'CC',
                        transformOrigin: 'left',
                      }}
                    >
                      <span className="text-sm">{clip.thumbnail}</span>
                      <span className="text-[10px] text-white font-medium truncate">{clip.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromTimeline(clip.id); }}
                        className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded transition-all"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Playhead */}
              {playing && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
                  style={{ left: `${progress}%` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-red-500 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  STEP 3: SUBTITLES & VOICEOVER
// ═══════════════════════════════════════════════════════════════════════

function SubtitleVoiceStep() {
  const [selectedSubtitleStyle, setSelectedSubtitleStyle] = useState('s1');
  const [selectedVoice, setSelectedVoice] = useState('v1');
  const [selectedBgm, setSelectedBgm] = useState('b1');
  const [bgmVolume, setBgmVolume] = useState(40);
  const [voiceVolume, setVoiceVolume] = useState(85);
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [generatingVoice, setGeneratingVoice] = useState(false);

  const handleGenerateVoice = () => {
    setGeneratingVoice(true);
    setTimeout(() => setGeneratingVoice(false), 2000);
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Subtitle Styles */}
      <div className="col-span-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Subtitles size={18} className="text-amber-500" />
              字幕样式
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={subtitleEnabled}
                onChange={e => setSubtitleEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div className="space-y-3">
            {subtitleStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedSubtitleStyle(style.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  selectedSubtitleStyle === style.id
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{style.name}</span>
                  {selectedSubtitleStyle === style.id && (
                    <Check size={14} className="text-amber-500" />
                  )}
                </div>
                {/* Preview */}
                <div
                  className="px-3 py-2 rounded-lg text-center text-sm font-medium"
                  style={{
                    color: style.color,
                    backgroundColor: style.bgColor,
                  }}
                >
                  {style.preview}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                  <span>{style.font}</span>
                  <span>·</span>
                  <span>{style.animation}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Options */}
      <div className="col-span-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Mic size={18} className="text-amber-500" />
              配音语音
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceoverEnabled}
                onChange={e => setVoiceoverEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div className="space-y-2 mb-5">
            {voiceOptions.map(voice => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedVoice === voice.id
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedVoice === voice.id
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Headphones size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 truncate">{voice.name}</span>
                    {voice.popular && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded font-medium shrink-0">热门</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                    <span>{voice.language}</span>
                    <span>·</span>
                    <span>{voice.gender}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors shrink-0"
                  title="试听"
                >
                  <Volume2 size={14} />
                </button>
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateVoice}
            disabled={generatingVoice}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {generatingVoice ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                生成配音中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成配音
              </>
            )}
          </button>

          {/* Voice Volume */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">配音音量</span>
              <span className="text-xs text-gray-700 font-medium">{voiceVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={voiceVolume}
              onChange={e => setVoiceVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* BGM Options */}
      <div className="col-span-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Music size={18} className="text-amber-500" />
            背景音乐
          </h3>

          <div className="space-y-2 mb-5">
            {bgmOptions.map(bgm => (
              <button
                key={bgm.id}
                onClick={() => setSelectedBgm(bgm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedBgm === bgm.id
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedBgm === bgm.id
                    ? 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <AudioLines size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700">{bgm.name}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                    <span>{bgm.genre}</span>
                    <span>·</span>
                    <span>{bgm.tempo}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors shrink-0"
                  title="试听"
                >
                  <Volume2 size={14} />
                </button>
              </button>
            ))}
          </div>

          {/* BGM Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">BGM 音量</span>
              <span className="text-xs text-gray-700 font-medium">{bgmVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={bgmVolume}
              onChange={e => setBgmVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Audio mix preview */}
          <div className="mt-5 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <Sliders size={12} />
              混音预览
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic size={12} className="text-amber-500" />
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${voiceVolume}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Music size={12} className="text-purple-500" />
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${bgmVolume}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  STEP 4: PREVIEW & EXPORT
// ═══════════════════════════════════════════════════════════════════════

function PreviewExportStep() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('high');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'youtube_shorts', 'fb_reels']);

  const platforms = [
    { key: 'tiktok', label: 'TikTok', icon: <Smartphone size={14} />, ratio: '9:16' },
    { key: 'youtube_shorts', label: 'YouTube Shorts', icon: <Monitor size={14} />, ratio: '9:16' },
    { key: 'fb_reels', label: 'FB Reels', icon: <Monitor size={14} />, ratio: '9:16' },
    { key: 'ig_reels', label: 'Instagram Reels', icon: <Smartphone size={14} />, ratio: '9:16' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const togglePlatform = (key: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Preview Area */}
      <div className="col-span-7 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye size={18} className="text-amber-500" />
            视频预览
          </h3>

          {/* Video Preview */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-[9/16] max-w-[320px] mx-auto relative flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
              {/* Mock video content */}
              <div className="absolute inset-0 flex flex-col">
                {/* Frame 1 */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                  <div className="text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <p className="text-white/80 text-lg font-medium px-8 leading-relaxed">
                      想在柬埔寨找到好工作？
                    </p>
                  </div>
                </div>
                {/* Subtitle bar */}
                <div className="absolute bottom-16 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <p className="text-amber-300 text-sm font-medium">想在柬埔寨找到好工作？</p>
                  </div>
                </div>
                {/* Progress */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: '35%' }} />
                </div>
                {/* Controls overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <SkipBack size={20} className="text-white" />
                    </button>
                    <button className="w-16 h-16 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/35 transition-colors">
                      <Pause size={28} className="text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <SkipForward size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline mini */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">00:00</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
              {[30, 25, 35, 20, 28, 22, 32].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-white/50 hover:brightness-110 transition-all cursor-pointer"
                  style={{
                    backgroundColor: `hsl(${40 + i * 25}, 70%, 55%)`,
                    height: `${h}%`,
                    alignSelf: 'center',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-mono">00:30</span>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="col-span-5 space-y-4">
        {/* Export Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings size={18} className="text-amber-500" />
            导出设置
          </h3>

          {/* Resolution */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">分辨率</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: '720p', label: 'HD 720p', desc: '1280×720' },
                { key: '1080p', label: 'FHD 1080p', desc: '1920×1080' },
                { key: '4k', label: '4K UHD', desc: '3840×2160' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setResolution(opt.key)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    resolution === opt.key
                      ? 'border-amber-300 bg-amber-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs font-medium ${resolution === opt.key ? 'text-amber-700' : 'text-gray-700'}`}>{opt.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">格式</label>
            <div className="flex gap-2">
              {[
                { key: 'mp4', label: 'MP4' },
                { key: 'mov', label: 'MOV' },
                { key: 'webm', label: 'WebM' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setFormat(opt.key)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    format === opt.key
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-2">质量</label>
            <div className="flex gap-2">
              {[
                { key: 'medium', label: '标准', desc: '较小文件' },
                { key: 'high', label: '高质量', desc: '推荐' },
                { key: 'ultra', label: '无损', desc: '最大文件' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setQuality(opt.key)}
                  className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                    quality === opt.key
                      ? 'border-amber-300 bg-amber-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs font-medium ${quality === opt.key ? 'text-amber-700' : 'text-gray-700'}`}>{opt.label}</p>
                  <p className="text-[10px] text-gray-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Export Progress / Button */}
          {isExporting ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">导出中...</span>
                <span className="text-amber-600 font-medium">{exportProgress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">正在渲染 1080p MP4 高质量视频...</p>
            </div>
          ) : exportComplete ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">导出成功！</p>
              <p className="text-xs text-gray-400 mt-1">文件大小: 45.2 MB</p>
              <div className="flex gap-2 mt-3 justify-center">
                <button className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                  <Download size={12} />
                  下载
                </button>
                <button className="px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1">
                  <Share2 size={12} />
                  发布
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleExport}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Download size={18} />
              导出视频
            </button>
          )}
        </div>

        {/* Platform Publishing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Share2 size={18} className="text-amber-500" />
            发布到平台
          </h3>
          <div className="space-y-2">
            {platforms.map(pl => (
              <button
                key={pl.key}
                onClick={() => togglePlatform(pl.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedPlatforms.includes(pl.key)
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedPlatforms.includes(pl.key)
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {pl.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{pl.label}</p>
                  <p className="text-[10px] text-gray-400">比例 {pl.ratio}</p>
                </div>
                {selectedPlatforms.includes(pl.key) && (
                  <Check size={16} className="text-amber-500" />
                )}
              </button>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
            <MousePointerClick size={16} />
            一键发布
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const steps = [
  { key: 'script', label: '脚本编辑', icon: <FileText size={18} />, description: '编辑分镜脚本' },
  { key: 'media', label: '素材组装', icon: <Scissors size={18} />, description: '拖拽素材到时间线' },
  { key: 'subtitle', label: '字幕和配音', icon: <Mic size={18} />, description: '添加字幕与配音' },
  { key: 'export', label: '预览和导出', icon: <CheckCircle2 size={18} />, description: '导出与发布' },
];

export default function VideoEditor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenes, setScenes] = useState<ScriptScene[]>(initialScript);
  const [timeline, setTimeline] = useState<TimelineClip[]>(initialTimeline);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                <Scissors size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-800">视频制作工作台</h1>
                <p className="text-xs text-gray-400">金边服装厂招聘实拍 - 剪辑中</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {saved ? <Check size={14} className="text-emerald-500" /> : <Save size={14} />}
                {saved ? '已保存' : '保存'}
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm">
                <Eye size={14} />
                预览
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center">
            {steps.map((step, idx) => (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => setCurrentStep(idx)}
                  className="relative flex items-center gap-3 py-4 group"
                >
                  {/* Step indicator */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    idx < currentStep
                      ? 'bg-emerald-500 text-white'
                      : idx === currentStep
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {idx < currentStep ? <Check size={16} /> : step.icon}
                  </div>
                  {/* Step label */}
                  <div className="text-left">
                    <p className={`text-sm font-medium transition-colors ${
                      idx === currentStep ? 'text-gray-800' : idx < currentStep ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400">{step.description}</p>
                  </div>
                </button>
                {/* Connector */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-100 relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: idx < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 0 && <ScriptEditStep scenes={scenes} setScenes={setScenes} />}
            {currentStep === 1 && <MediaAssemblyStep timeline={timeline} setTimeline={setTimeline} />}
            {currentStep === 2 && <SubtitleVoiceStep />}
            {currentStep === 3 && <PreviewExportStep />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-200">
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            上一步
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: steps.length }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'bg-amber-500 w-6' : i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentStep === steps.length - 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentStep === steps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg'
            }`}
          >
            {currentStep === steps.length - 1 ? '完成' : '下一步'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
