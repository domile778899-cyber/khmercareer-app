import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Plus, Search, Filter, Edit3, Trash2, Eye,
  Calendar, BarChart3, Mic, Film, Image, Music, Type,
  Sparkles, ChevronRight, Clock, Globe, CheckCircle2,
  AlertCircle, MoreHorizontal, Copy, Download, Share2,
  TrendingUp, Users, Heart, MessageCircle, Layers, Zap,
  Smartphone, Monitor, Tablet, X, Upload, Video, FileText,
  Scissors, Volume2, Subtitles, Palette, Settings, Save,
  RefreshCw, ArrowRight, Star, Bookmark, ChevronDown,
  SquarePlay, Clapperboard, Lightbulb, Award, Megaphone,
  Hash, ExternalLink, Linkedin, Twitter, Instagram, Facebook,
  Youtube, GripVertical, Trash, Move, Wand2, Timer, Frame,
  AudioLines, Headphones, MousePointerClick, QrCode,
  AreaChart, PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface PlatformData {
  name: string;
  status: string;
  views: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface VideoProject {
  id: string;
  title: string;
  type: string;
  status: string;
  duration: number;
  platforms: PlatformData[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  language: string;
  description?: string;
}

interface ScriptScene {
  id: number;
  shot: number;
  visual: string;
  narration: string;
  duration: number;
  transition: string;
}

interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'subtitle' | 'transition';
  thumbnail: string;
  duration?: number;
  size: string;
  uploadDate: string;
  tags: string[];
}

interface ScheduledPost {
  id: string;
  videoTitle: string;
  platform: string;
  scheduledTime: string;
  status: string;
  thumbnail: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────

const videoProjects: VideoProject[] = [
  {
    id: 'v1', title: '金边服装厂招聘实拍', type: 'job_highlight',
    status: 'published', duration: 45, language: 'km',
    description: '走进金边最大服装厂，展示真实工作环境',
    platforms: [
      { name: 'TikTok', status: 'published', views: 12500, likes: 890, comments: 45, shares: 123 },
      { name: 'YouTube Shorts', status: 'published', views: 8300, likes: 567, comments: 34, shares: 89 },
      { name: 'FB Reels', status: 'published', views: 6200, likes: 445, comments: 28, shares: 67 },
    ],
    thumbnail: '🏭', createdAt: '2024-01-10', updatedAt: '2024-01-12'
  },
  {
    id: 'v2', title: '如何在柬埔寨找到好工作-求职指南',
    type: 'tips', status: 'video_editing', duration: 60, language: 'zh',
    description: '资深HR分享柬埔寨求职秘籍',
    platforms: [],
    thumbnail: '💼', createdAt: '2024-01-14', updatedAt: '2024-01-15'
  },
  {
    id: 'v3', title: '高棉职通车平台介绍', type: 'platform_intro',
    status: 'script_writing', duration: 30, language: 'km',
    description: '快速了解高棉职通车平台功能',
    platforms: [],
    thumbnail: '📱', createdAt: '2024-01-15', updatedAt: '2024-01-15'
  },
  {
    id: 'v4', title: '从服务员到店长-索皮娅的成功故事',
    type: 'success_story', status: 'voiceover', duration: 90, language: 'km',
    description: '真实用户成功求职并晋升的励志故事',
    platforms: [],
    thumbnail: '⭐', createdAt: '2024-01-08', updatedAt: '2024-01-13'
  },
  {
    id: 'v5', title: '2024年柬埔寨热门职业排行', type: 'trending',
    status: 'review', duration: 45, language: 'zh',
    description: '最新热门职业趋势分析',
    platforms: [
      { name: 'TikTok', status: 'pending', views: 0 },
      { name: 'YouTube Shorts', status: 'pending', views: 0 },
    ],
    thumbnail: '🔥', createdAt: '2024-01-13', updatedAt: '2024-01-14'
  },
  {
    id: 'v6', title: '西港酒店业招聘热潮', type: 'job_highlight',
    status: 'scheduled', duration: 35, language: 'km',
    description: '西港旅游业复苏带来大量就业机会',
    platforms: [
      { name: 'TikTok', status: 'scheduled', views: 0 },
      { name: 'FB Reels', status: 'scheduled', views: 0 },
    ],
    thumbnail: '🏨', createdAt: '2024-01-11', updatedAt: '2024-01-14'
  },
  {
    id: 'v7', title: '面试穿搭指南-柬埔寨职场版', type: 'tips',
    status: 'published', duration: 40, language: 'km',
    description: '柬埔寨职场面试着装建议',
    platforms: [
      { name: 'TikTok', status: 'published', views: 18900, likes: 1200, comments: 89, shares: 234 },
      { name: 'Instagram Reels', status: 'published', views: 5400, likes: 380, comments: 22, shares: 56 },
    ],
    thumbnail: '👔', createdAt: '2024-01-05', updatedAt: '2024-01-09'
  },
  {
    id: 'v8', title: '暹粒旅游业工作机会一览', type: 'job_highlight',
    status: 'published', duration: 50, language: 'km',
    description: '吴哥窟周边旅游相关工作汇总',
    platforms: [
      { name: 'TikTok', status: 'published', views: 22100, likes: 1560, comments: 112, shares: 445 },
      { name: 'YouTube Shorts', status: 'published', views: 12400, likes: 890, comments: 67, shares: 234 },
      { name: 'FB Reels', status: 'published', views: 9800, likes: 678, comments: 45, shares: 189 },
      { name: 'Instagram Reels', status: 'published', views: 7600, likes: 543, comments: 38, shares: 156 },
    ],
    thumbnail: '🏛️', createdAt: '2024-01-02', updatedAt: '2024-01-07'
  },
];

const mockAIScript: ScriptScene[] = [
  { id: 1, shot: 1, visual: '黑色背景+金色Logo淡入，品牌色渐变光效', narration: '想在柬埔寨找到好工作？', duration: 3, transition: 'fade' },
  { id: 2, shot: 2, visual: '手机打开高棉职通车APP，流畅手势操作', narration: '用高棉职通车，一键申请！', duration: 4, transition: 'slide' },
  { id: 3, shot: 3, visual: '展示职位列表滑动，热门职位高亮标记', narration: '超过2400个职位等你挑选', duration: 5, transition: 'swipe' },
  { id: 4, shot: 4, visual: '点击申请按钮动画，表单自动填充效果', narration: '30秒完成申请，超简单！', duration: 4, transition: 'zoom' },
  { id: 5, shot: 5, visual: '展示视频面试场景，分屏对话效果', narration: '还能视频面试，不用跑腿', duration: 5, transition: 'cut' },
  { id: 6, shot: 6, visual: '成功案例笑脸轮播，数据动画增长', narration: '已经有50,000+人找到理想工作', duration: 4, transition: 'fade' },
  { id: 7, shot: 7, visual: 'CTA行动号召+二维码+下载按钮动效', narration: '扫码立即下载，开启新职业！', duration: 5, transition: 'fade' },
];

const mockFullNarration = `想在柬埔寨找到好工作？用高棉职通车，一键申请！超过2400个职位等你挑选。30秒完成申请，超简单！还能视频面试，不用跑腿。已经有50,000+人找到理想工作。扫码立即下载，开启新职业！`;

const mockAssets: MediaAsset[] = [
  { id: 'a1', name: '金边工厂航拍', type: 'video', thumbnail: '🚁', duration: 15, size: '45MB', uploadDate: '2024-01-10', tags: ['工厂', '航拍', '金边'] },
  { id: 'a2', name: 'APP操作录屏', type: 'video', thumbnail: '📱', duration: 20, size: '32MB', uploadDate: '2024-01-11', tags: ['APP', '教程'] },
  { id: 'a3', name: '面试场景A', type: 'video', thumbnail: '🤝', duration: 12, size: '28MB', uploadDate: '2024-01-12', tags: ['面试', '职场'] },
  { id: 'a4', name: '柬埔寨城市风光', type: 'image', thumbnail: '🌆', size: '4.2MB', uploadDate: '2024-01-09', tags: ['风景', '城市'] },
  { id: 'a5', name: '金色粒子背景', type: 'image', thumbnail: '✨', size: '2.1MB', uploadDate: '2024-01-08', tags: ['背景', '粒子'] },
  { id: 'a6', name: '高棉传统纹样', type: 'image', thumbnail: '🎭', size: '3.5MB', uploadDate: '2024-01-07', tags: ['高棉', '传统'] },
  { id: 'a7', name: '轻快电子乐', type: 'audio', thumbnail: '🎵', duration: 180, size: '7.2MB', uploadDate: '2024-01-10', tags: ['BGM', '电子'] },
  { id: 'a8', name: '温暖钢琴曲', type: 'audio', thumbnail: '🎹', duration: 240, size: '9.1MB', uploadDate: '2024-01-09', tags: ['BGM', '钢琴'] },
  { id: 'a9', name: '金色字幕条', type: 'subtitle', thumbnail: '📝', size: '0.5MB', uploadDate: '2024-01-11', tags: ['字幕', '金色'] },
  { id: 'a10', name: '渐变转场包', type: 'transition', thumbnail: '🎬', size: '12MB', uploadDate: '2024-01-08', tags: ['转场', '渐变'] },
  { id: 'a11', name: '员工笑脸合集', type: 'video', thumbnail: '😊', duration: 18, size: '38MB', uploadDate: '2024-01-13', tags: ['人物', '笑脸'] },
  { id: 'a12', name: '办公室场景B', type: 'video', thumbnail: '🏢', duration: 25, size: '52MB', uploadDate: '2024-01-14', tags: ['办公室', '职场'] },
];

const scheduledPosts: ScheduledPost[] = [
  { id: 's1', videoTitle: '西港酒店业招聘热潮', platform: 'TikTok', scheduledTime: '2024-01-16 18:00', status: 'ready', thumbnail: '🏨' },
  { id: 's2', videoTitle: '西港酒店业招聘热潮', platform: 'FB Reels', scheduledTime: '2024-01-16 19:00', status: 'ready', thumbnail: '🏨' },
  { id: 's3', videoTitle: '2024年柬埔寨热门职业排行', platform: 'TikTok', scheduledTime: '2024-01-17 12:00', status: 'pending', thumbnail: '🔥' },
  { id: 's4', videoTitle: '2024年柬埔寨热门职业排行', platform: 'YouTube Shorts', scheduledTime: '2024-01-17 14:00', status: 'pending', thumbnail: '🔥' },
  { id: 's5', videoTitle: '从服务员到店长-索皮娅的成功故事', platform: 'TikTok', scheduledTime: '2024-01-18 20:00', status: 'draft', thumbnail: '⭐' },
];

// ─── Helpers ─────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  script_writing: { label: '脚本编写中', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: <FileText size={12} /> },
  voiceover: { label: '配音中', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: <Mic size={12} /> },
  video_editing: { label: '剪辑中', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <Scissors size={12} /> },
  review: { label: '审核中', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', icon: <AlertCircle size={12} /> },
  published: { label: '已发布', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={12} /> },
  scheduled: { label: '已排期', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200', icon: <Calendar size={12} /> },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  job_highlight: { label: '职位亮点', icon: <BriefcaseIcon size={14} />, color: 'text-blue-500' },
  tips: { label: '求职技巧', icon: <Lightbulb size={14} />, color: 'text-amber-500' },
  success_story: { label: '成功故事', icon: <Award size={14} />, color: 'text-purple-500' },
  platform_intro: { label: '平台介绍', icon: <Smartphone size={14} />, color: 'text-emerald-500' },
  trending: { label: '热门趋势', icon: <TrendingUp size={14} />, color: 'text-red-500' },
};

const platformIcons: Record<string, React.ReactNode> = {
  'TikTok': <span className="text-lg font-bold">T</span>,
  'YouTube Shorts': <Youtube size={16} />,
  'FB Reels': <Facebook size={16} />,
  'Instagram Reels': <Instagram size={16} />,
};

const transitionLabels: Record<string, string> = {
  fade: '淡入淡出', slide: '滑动', swipe: '滑动擦除', zoom: '缩放', cut: '硬切',
  dissolve: '溶解', wipe: '擦除', flip: '翻转',
};

const videoTypeOptions = [
  { value: 'job_highlight', label: '职位亮点', icon: <BriefcaseIcon size={16} /> },
  { value: 'tips', label: '求职技巧', icon: <Lightbulb size={16} /> },
  { value: 'success_story', label: '成功故事', icon: <Award size={16} /> },
  { value: 'platform_intro', label: '平台介绍', icon: <Smartphone size={16} /> },
  { value: 'trending', label: '热门趋势', icon: <TrendingUp size={16} /> },
];

const durationOptions = [
  { value: 15, label: '15秒' },
  { value: 30, label: '30秒' },
  { value: 45, label: '45秒' },
  { value: 60, label: '60秒' },
  { value: 90, label: '90秒' },
];

const languageOptions = [
  { value: 'km', label: '高棉语' },
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'th', label: '泰语' },
  { value: 'vi', label: '越南语' },
];

const platformOptions = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube_shorts', label: 'YouTube Shorts' },
  { value: 'fb_reels', label: 'FB Reels' },
  { value: 'ig_reels', label: 'Instagram Reels' },
];

// ─── Mini Icons ──────────────────────────────────────────────────────

function BriefcaseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.script_writing;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const cfg = typeConfig[type] || typeConfig.job_highlight;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StatCard({ icon, label, value, change, positive }: {
  icon: React.ReactNode; label: string; value: string; change: string; positive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg text-amber-600">
          {icon}
        </div>
        <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 1: VIDEO PROJECTS
// ═══════════════════════════════════════════════════════════════════════

function VideoProjectsTab() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [projects] = useState<VideoProject[]>(videoProjects);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '进行中' },
    { key: 'published', label: '已发布' },
    { key: 'scheduled', label: '已排期' },
  ];

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchSearch;
    if (filter === 'active') return matchSearch && ['script_writing', 'voiceover', 'video_editing', 'review'].includes(p.status);
    if (filter === 'published') return matchSearch && p.status === 'published';
    if (filter === 'scheduled') return matchSearch && p.status === 'scheduled';
    return matchSearch;
  });

  const totalViews = projects.reduce((sum, p) =>
    sum + p.platforms.reduce((s, pl) => s + pl.views, 0), 0
  );
  const publishedCount = projects.filter(p => p.status === 'published').length;
  const activeCount = projects.filter(p => ['script_writing', 'voiceover', 'video_editing'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Film size={20} />} label="总视频项目" value={String(projects.length)} change="+12%" positive />
        <StatCard icon={<Play size={20} />} label="已发布" value={String(publishedCount)} change="+8%" positive />
        <StatCard icon={<Zap size={20} />} label="进行中" value={String(activeCount)} change="+3" positive />
        <StatCard icon={<BarChart3 size={20} />} label="总播放量" value={totalViews >= 10000 ? `${(totalViews / 10000).toFixed(1)}万` : String(totalViews)} change="+23%" positive />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索视频项目..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-64"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm hover:shadow">
            <Plus size={16} />
            新建项目
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 group-hover:opacity-50 transition-opacity">
                  {project.thumbnail}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={project.status} />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                    <Clock size={10} />
                    {project.duration}秒
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <TypeBadge type={project.type} />
                  <h3 className="text-white font-semibold text-sm mt-1 truncate">{project.title}</h3>
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {project.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>
                )}

                {/* Platform Stats */}
                {project.platforms.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                      <Share2 size={12} />
                      已发布到 {project.platforms.length} 个平台
                    </div>
                    {project.platforms.map(pl => (
                      <div key={pl.name} className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-gray-400">{platformIcons[pl.name]}</span>
                          {pl.name}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Eye size={12} />
                            {pl.views >= 10000 ? `${(pl.views / 10000).toFixed(1)}万` : pl.views}
                          </span>
                          {pl.likes && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Heart size={12} />
                              {pl.likes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {project.platforms.length === 0 && (
                  <div className="py-4 text-center text-xs text-gray-400 mb-3 bg-gray-50 rounded-lg">
                    尚未发布到任何平台
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <Edit3 size={13} />
                    编辑
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye size={13} />
                    预览
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Share2 size={13} />
                    发布
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-20">🎬</div>
          <p className="text-gray-400 text-sm">没有找到匹配的视频项目</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 2: AI SCRIPT GENERATION
// ═══════════════════════════════════════════════════════════════════════

function AIScriptTab() {
  const [videoType, setVideoType] = useState('tips');
  const [topic, setTopic] = useState('柬埔寨求职');
  const [targetDuration, setTargetDuration] = useState(30);
  const [targetLanguage, setTargetLanguage] = useState('km');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['tiktok', 'youtube_shorts']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptGenerated, setScriptGenerated] = useState(true);
  const [scenes] = useState<ScriptScene[]>(mockAIScript);
  const [fullNarration] = useState(mockFullNarration);
  const [bgmSuggestion] = useState({ genre: '轻快电子/流行', tempo: '120-128 BPM', mood: '积极、激励、快节奏' });
  const [subtitleStyle] = useState({ font: 'Noto Sans Khmer / 思源黑体', color: '金色渐变 (#D4AF37 → #FFD700)', position: '底部居中', animation: '逐字淡入 + 关键词高亮' });

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setScriptGenerated(true);
    }, 2500);
  };

  const togglePlatform = (val: string) => {
    setTargetPlatforms(prev =>
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="col-span-4 space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              AI 脚本生成器
            </h3>

            <div className="space-y-4">
              {/* Video Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">视频类型</label>
                <div className="grid grid-cols-1 gap-2">
                  {videoTypeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setVideoType(opt.value)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                        videoType === opt.value
                          ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className={videoType === opt.value ? 'text-amber-500' : 'text-gray-400'}>
                        {opt.icon}
                      </span>
                      {opt.label}
                      {videoType === opt.value && <CheckCircle2 size={14} className="ml-auto text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">主题 / 关键词</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="输入视频主题..."
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['求职技巧', '工厂招聘', '面试指南', '薪资谈判', '简历优化', '职业规划'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setTopic(tag)}
                      className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">目标时长</label>
                <div className="flex gap-2">
                  {durationOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTargetDuration(opt.value)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                        targetDuration === opt.value
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">目标语言</label>
                <select
                  value={targetLanguage}
                  onChange={e => setTargetLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  {languageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">目标平台（多选）</label>
                <div className="space-y-2">
                  {platformOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => togglePlatform(opt.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                        targetPlatforms.includes(opt.value)
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        targetPlatforms.includes(opt.value)
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-gray-300'
                      }`}>
                        {targetPlatforms.includes(opt.value) && <CheckCircle2 size={12} className="text-white" />}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    AI 正在创作中...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    AI 生成脚本
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Preview */}
        <div className="col-span-8 space-y-5">
          <AnimatePresence>
            {scriptGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Script Scenes Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Clapperboard size={18} className="text-amber-500" />
                      分镜脚本
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Timer size={13} />
                        总时长: <strong className="text-amber-600">{totalDuration}秒</strong> / 目标 {targetDuration}秒
                      </span>
                      <span className="flex items-center gap-1">
                        <Frame size={13} />
                        {scenes.length} 个镜头
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 w-14">镜号</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">画面描述</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">旁白文字</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 w-20">时长</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 w-24">转场</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {scenes.map((scene, idx) => (
                          <motion.tr
                            key={scene.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-amber-50/30 transition-colors group"
                          >
                            <td className="px-4 py-3">
                              <span className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-400 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                                {scene.shot}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 max-w-xs">
                              <p className="line-clamp-2">{scene.visual}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-800 font-medium">
                              <span className="text-amber-600">"</span>{scene.narration}<span className="text-amber-600">"</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                                <Clock size={10} />
                                {scene.duration}s
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-500">
                                {transitionLabels[scene.transition] || scene.transition}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Voiceover Script */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Mic size={18} className="text-amber-500" />
                    完整配音脚本
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 rounded-lg border border-amber-100">
                    <p className="text-gray-700 leading-relaxed text-sm font-medium">
                      {fullNarration}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                      <Copy size={12} />
                      复制
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Volume2 size={12} />
                      试听配音
                    </button>
                  </div>
                </div>

                {/* BGM & Subtitle Suggestions */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Music size={18} className="text-amber-500" />
                      BGM 建议
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">风格</span>
                        <span className="text-xs font-medium text-gray-700">{bgmSuggestion.genre}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500"> tempo</span>
                        <span className="text-xs font-medium text-gray-700">{bgmSuggestion.tempo}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">情绪</span>
                        <span className="text-xs font-medium text-gray-700">{bgmSuggestion.mood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Subtitles size={18} className="text-amber-500" />
                      字幕样式建议
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">字体</span>
                        <span className="text-xs font-medium text-gray-700">{subtitleStyle.font}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">颜色</span>
                        <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 inline-block" />
                          {subtitleStyle.color}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">动画</span>
                        <span className="text-xs font-medium text-gray-700">{subtitleStyle.animation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end gap-3">
                  <button className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    导出脚本
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <Scissors size={16} />
                    开始制作
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!scriptGenerated && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-amber-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">填写左侧表单，点击「AI 生成脚本」开始创作</p>
              <p className="text-xs text-gray-400 mt-1">AI 将根据您的输入智能生成专业短视频脚本</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 3: MEDIA LIBRARY
// ═══════════════════════════════════════════════════════════════════════

function MediaLibraryTab() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [assets] = useState<MediaAsset[]>(mockAssets);
  const [showUpload, setShowUpload] = useState(false);

  const categories = [
    { key: 'all', label: '全部', icon: <Layers size={14} />, count: assets.length },
    { key: 'video', label: '视频片段', icon: <Film size={14} />, count: assets.filter(a => a.type === 'video').length },
    { key: 'image', label: '图片', icon: <Image size={14} />, count: assets.filter(a => a.type === 'image').length },
    { key: 'audio', label: '音乐', icon: <Music size={14} />, count: assets.filter(a => a.type === 'audio').length },
    { key: 'subtitle', label: '字幕模板', icon: <Type size={14} />, count: assets.filter(a => a.type === 'subtitle').length },
    { key: 'transition', label: '转场效果', icon: <Zap size={14} />, count: assets.filter(a => a.type === 'transition').length },
  ];

  const filtered = assets.filter(a => {
    const matchCat = activeCategory === 'all' || a.type === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.includes(search));
    return matchCat && matchSearch;
  });

  const typeColors: Record<string, string> = {
    video: 'bg-blue-50 text-blue-600 border-blue-200',
    image: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    audio: 'bg-purple-50 text-purple-600 border-purple-200',
    subtitle: 'bg-amber-50 text-amber-600 border-amber-200',
    transition: 'bg-pink-50 text-pink-600 border-pink-200',
  };

  const typeLabels: Record<string, string> = {
    video: '视频', image: '图片', audio: '音频', subtitle: '字幕', transition: '转场',
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.icon}
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索素材..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-56"
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm hover:shadow"
          >
            <Upload size={16} />
            上传素材
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              {/* Thumbnail */}
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 relative flex items-center justify-center">
                <span className="text-4xl opacity-40 group-hover:opacity-70 transition-opacity">
                  {asset.thumbnail}
                </span>
                {asset.type === 'video' && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                    <Clock size={10} />
                    {asset.duration}s
                  </div>
                )}
                {asset.type === 'audio' && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                    <AudioLines size={10} />
                    {Math.floor((asset.duration || 0) / 60)}:{String((asset.duration || 0) % 60).padStart(2, '0')}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-amber-600 shadow-md">
                      <Eye size={14} />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 shadow-md">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-800 truncate pr-2">{asset.name}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${typeColors[asset.type]}`}>
                    {typeLabels[asset.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{asset.size}</span>
                  <span>·</span>
                  <span>{asset.uploadDate}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-20">📁</div>
          <p className="text-gray-400 text-sm">没有找到匹配的素材</p>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800 text-lg">上传新素材</h3>
                <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-amber-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">点击或拖拽文件到此处</p>
                <p className="text-xs text-gray-400">支持视频、图片、音频文件，最大 500MB</p>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                  取消
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600">
                  开始上传
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 4: PUBLISH MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

function PublishManagementTab() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [schedules] = useState<ScheduledPost[]>(scheduledPosts);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const publishedProjects = videoProjects.filter(p => p.status === 'published');

  const generateCalendar = () => {
    const now = new Date();
    now.setMonth(now.getMonth() + selectedMonth);
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; events: ScheduledPost[] }[] = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: 0, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const events = schedules.filter(s => s.scheduledTime.startsWith(dateStr));
      days.push({ day: d, events });
    }
    return { year, month, days };
  };

  const calendar = generateCalendar();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const platformColors: Record<string, string> = {
    'TikTok': 'bg-black text-white',
    'YouTube Shorts': 'bg-red-600 text-white',
    'FB Reels': 'bg-blue-600 text-white',
    'Instagram Reels': 'bg-gradient-to-br from-purple-600 to-pink-500 text-white',
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={20} />} label="已排期" value={String(schedules.filter(s => s.status === 'ready').length)} change="+2" positive />
        <StatCard icon={<CheckCircle2 size={20} />} label="已发布" value={String(publishedProjects.length)} change="+5" positive />
        <StatCard icon={<Eye size={20} />} label="本周播放" value="10.5万" change="+18%" positive />
        <StatCard icon={<Heart size={20} />} label="本周互动" value="3,240" change="+12%" positive />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              view === 'calendar' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={14} />
            日历视图
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              view === 'list' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Layers size={14} />
            列表视图
          </button>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all shadow-sm hover:shadow">
          <Share2 size={16} />
          一键发布
        </button>
      </div>

      {view === 'calendar' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              {calendar.year}年 {monthNames[calendar.month]}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedMonth(m => m - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight size={16} className="rotate-180 text-gray-500" />
              </button>
              <button onClick={() => setSelectedMonth(0)} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                今天
              </button>
              <button onClick={() => setSelectedMonth(m => m + 1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-medium text-gray-400">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {calendar.days.map((d, idx) => (
              <div
                key={idx}
                className={`min-h-[100px] p-2 border-b border-r border-gray-50 ${
                  d.day === 0 ? 'bg-gray-50/30' : 'hover:bg-amber-50/20 transition-colors'
                }`}
              >
                {d.day > 0 && (
                  <>
                    <span className={`text-xs font-medium ${
                      new Date().getDate() === d.day && selectedMonth === 0
                        ? 'w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center'
                        : 'text-gray-600'
                    }`}>
                      {d.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {d.events.map(e => (
                        <div
                          key={e.id}
                          className={`text-[10px] px-1.5 py-1 rounded ${platformColors[e.platform] || 'bg-gray-100 text-gray-600'} truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {e.videoTitle}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Scheduled List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" />
                待发布列表
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">视频</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">平台</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">排期时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schedules.map(s => (
                  <tr key={s.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{s.thumbnail}</span>
                        <span className="font-medium text-gray-700">{s.videoTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${platformColors[s.platform] || 'bg-gray-100'}`}>
                        {s.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.scheduledTime}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                        s.status === 'ready' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                        s.status === 'pending' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                        'text-gray-600 bg-gray-50 border-gray-200'
                      }`}>
                        {s.status === 'ready' ? <CheckCircle2 size={10} /> : s.status === 'pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
                        {s.status === 'ready' ? '就绪' : s.status === 'pending' ? '等待中' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">编辑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Published List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                已发布列表
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">视频</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">平台</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">播放量</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">点赞</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">评论</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">分享</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {publishedProjects.flatMap(p =>
                  p.platforms.map((pl, idx) => (
                    <tr key={`${p.id}-${idx}`} className="hover:bg-amber-50/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{p.thumbnail}</span>
                          <span className="font-medium text-gray-700">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${platformColors[pl.name] || 'bg-gray-100'}`}>
                          {pl.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {pl.views >= 10000 ? `${(pl.views / 10000).toFixed(1)}万` : pl.views}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{pl.likes || 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{pl.comments || 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{pl.shares || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 5: DATA ANALYTICS (INLINE MINI VERSION)
// ═══════════════════════════════════════════════════════════════════════

function DataAnalyticsTab() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const platformBarData = [
    { platform: 'TikTok', views: 45200, likes: 3210, shares: 890 },
    { platform: 'YouTube Shorts', views: 20700, likes: 1457, shares: 323 },
    { platform: 'FB Reels', views: 16000, likes: 1123, shares: 256 },
    { platform: 'Instagram Reels', views: 13000, likes: 923, shares: 212 },
  ];

  const typePieData = [
    { type: '职位亮点', count: 12, color: '#F59E0B' },
    { type: '求职技巧', count: 8, color: '#3B82F6' },
    { type: '成功故事', count: 5, color: '#8B5CF6' },
    { type: '平台介绍', count: 4, color: '#10B981' },
    { type: '热门趋势', count: 3, color: '#EF4444' },
  ];

  const trendData7d = [
    { date: '01/09', views: 3200 },
    { date: '01/10', views: 4500 },
    { date: '01/11', views: 3800 },
    { date: '01/12', views: 5200 },
    { date: '01/13', views: 6100 },
    { date: '01/14', views: 7800 },
    { date: '01/15', views: 9200 },
  ];

  const trendData30d = [
    { date: '12/17', views: 1200 }, { date: '12/19', views: 1800 },
    { date: '12/21', views: 1500 }, { date: '12/23', views: 2200 },
    { date: '12/25', views: 3100 }, { date: '12/27', views: 2800 },
    { date: '12/29', views: 3600 }, { date: '12/31', views: 4200 },
    { date: '01/02', views: 5800 }, { date: '01/04', views: 4900 },
    { date: '01/06', views: 6500 }, { date: '01/08', views: 7200 },
    { date: '01/10', views: 8100 }, { date: '01/12', views: 9400 },
    { date: '01/14', views: 11200 },
  ];

  const topVideos = videoProjects
    .filter(p => p.status === 'published')
    .map(p => ({
      ...p,
      totalViews: p.platforms.reduce((s, pl) => s + pl.views, 0),
      totalLikes: p.platforms.reduce((s, pl) => s + (pl.likes || 0), 0),
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5);

  // Heatmap data (hour x day)
  const heatmapDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const heatmapHours = ['6时', '9时', '12时', '15时', '18时', '21时'];
  const heatmapData = [
    [15, 35, 55, 42, 68, 45],
    [12, 42, 60, 48, 75, 52],
    [18, 38, 58, 45, 70, 48],
    [20, 45, 65, 50, 82, 55],
    [25, 50, 72, 58, 88, 62],
    [30, 55, 78, 65, 95, 70],
    [28, 52, 75, 60, 90, 65],
  ];

  const maxHeat = Math.max(...heatmapData.flat());

  const SimpleBarChart = ({ data }: { data: { platform: string; views: number }[] }) => {
    const max = Math.max(...data.map(d => d.views));
    return (
      <div className="space-y-3">
        {data.map(d => (
          <div key={d.platform} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 text-right shrink-0">{d.platform}</span>
            <div className="flex-1 h-7 bg-gray-50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.views / max) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-end px-2"
              >
                <span className="text-[10px] text-white font-medium">
                  {d.views >= 10000 ? `${(d.views / 10000).toFixed(1)}万` : d.views}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SimplePieChart = ({ data }: { data: { type: string; count: number; color: string }[] }) => {
    const total = data.reduce((s, d) => s + d.count, 0);
    let cumulative = 0;
    return (
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((d, idx) => {
            const startAngle = (cumulative / total) * 360;
            const sliceAngle = (d.count / total) * 360;
            cumulative += d.count;
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (startAngle + sliceAngle - 90) * Math.PI / 180;
            const x1 = 60 + 50 * Math.cos(startRad);
            const y1 = 60 + 50 * Math.sin(startRad);
            const x2 = 60 + 50 * Math.cos(endRad);
            const y2 = 60 + 50 * Math.sin(endRad);
            const largeArc = sliceAngle > 180 ? 1 : 0;
            return (
              <path
                key={idx}
                d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="60" cy="60" r="25" fill="white" />
          <text x="60" y="56" textAnchor="middle" className="text-[10px] fill-gray-500">总计</text>
          <text x="60" y="70" textAnchor="middle" className="text-xs font-bold fill-gray-800">{total}</text>
        </svg>
        <div className="space-y-2">
          {data.map(d => (
            <div key={d.type} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-gray-600">{d.type}</span>
              <span className="text-xs font-medium text-gray-800">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimpleLineChart = ({ data }: { data: { date: string; views: number }[] }) => {
    const max = Math.max(...data.map(d => d.views));
    const width = 600;
    const height = 200;
    const padding = 30;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const points = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * chartW,
      y: padding + chartH - (d.views / max) * chartH,
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding + chartH} L ${points[0].x} ${padding + chartH} Z`;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={padding} y1={padding + (chartH / 3) * i} x2={width - padding} y2={padding + (chartH / 3) * i} stroke="#f0f0f0" strokeWidth="1" />
        ))}
        <path d={areaD} fill="url(#gradient)" opacity="0.2" />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#F59E0B" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[8px] fill-gray-500">{data[i].views >= 1000 ? `${(data[i].views / 1000).toFixed(1)}k` : data[i].views}</text>
          </g>
        ))}
        {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0).map((d, i) => {
          const idx = i * Math.ceil(data.length / 7);
          return <text key={i} x={points[Math.min(idx, points.length - 1)].x} y={height - 5} textAnchor="middle" className="text-[8px] fill-gray-400">{d.date}</text>;
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Film size={20} />} label="总视频数" value="32" change="+4" positive />
        <StatCard icon={<Play size={20} />} label="总播放量" value="9.49万" change="+28%" positive />
        <StatCard icon={<Heart size={20} />} label="总互动" value="6,713" change="+15%" positive />
        <StatCard icon={<Users size={20} />} label="新增粉丝" value="1,240" change="+32%" positive />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Platform Comparison */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Monitor size={18} className="text-amber-500" />
            各平台播放量对比
          </h3>
          <SimpleBarChart data={platformBarData} />
        </div>

        {/* Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-amber-500" />
            视频类型分布
          </h3>
          <SimplePieChart data={typePieData} />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" />
            播放量趋势
          </h3>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === '7d' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              近7天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === '30d' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              近30天
            </button>
          </div>
        </div>
        <SimpleLineChart data={timeRange === '7d' ? trendData7d : trendData30d} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Top Videos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star size={18} className="text-amber-500" />
            热门视频排行
          </h3>
          <div className="space-y-3">
            {topVideos.map((v, idx) => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  idx < 3 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xl">{v.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{v.title}</p>
                  <p className="text-xs text-gray-400">{v.platforms.length} 个平台</p>
                </div>
                <span className="text-sm font-semibold text-amber-600">
                  {v.totalViews >= 10000 ? `${(v.totalViews / 10000).toFixed(1)}万` : v.totalViews}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Time Heatmap */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            最佳发布时间热力图
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {heatmapDays.map(d => (
                  <div key={d} className="text-center text-[10px] text-gray-500 py-1">{d}</div>
                ))}
              </div>
              {/* Rows */}
              {heatmapHours.map((hour, hIdx) => (
                <div key={hour} className="grid grid-cols-7 gap-1 mb-1">
                  {heatmapDays.map((_, dIdx) => {
                    const value = heatmapData[dIdx][hIdx];
                    const intensity = value / maxHeat;
                    return (
                      <div
                        key={`${dIdx}-${hIdx}`}
                        className="h-8 rounded flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-105 cursor-pointer"
                        style={{
                          backgroundColor: `rgba(245, 158, 11, ${0.1 + intensity * 0.85})`,
                          color: intensity > 0.5 ? 'white' : '#92400E',
                        }}
                        title={`${heatmapDays[dIdx]} ${hour}: ${value} 互动`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
              {/* Hour labels */}
              <div className="grid grid-cols-7 gap-1 mt-1">
                {heatmapDays.map((_, i) => (
                  <div key={i} className="text-center text-[9px] text-gray-400">
                    {i === 3 && '← 互动量'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const tabs = [
  { key: 'projects', label: '视频项目', icon: <Film size={16} /> },
  { key: 'ai_script', label: 'AI脚本生成', icon: <Sparkles size={16} /> },
  { key: 'media', label: '素材库', icon: <Image size={16} /> },
  { key: 'publish', label: '发布管理', icon: <Share2 size={16} /> },
  { key: 'analytics', label: '数据分析', icon: <BarChart3 size={16} /> },
];

export default function VideoFactory() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clapperboard size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">短视频全自动工厂</h1>
                <p className="text-xs text-gray-400">AI 驱动的短视频创作、制作与分发平台</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full">
                <Zap size={12} className="text-amber-400" />
                AI 引擎运行中
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full">
                <Globe size={12} className="text-emerald-400" />
                4 平台已连接
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-5 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-sm font-medium flex items-center gap-2 transition-all rounded-t-lg ${
                  activeTab === tab.key
                    ? 'text-amber-400 bg-gray-800/80'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'projects' && <VideoProjectsTab />}
            {activeTab === 'ai_script' && <AIScriptTab />}
            {activeTab === 'media' && <MediaLibraryTab />}
            {activeTab === 'publish' && <PublishManagementTab />}
            {activeTab === 'analytics' && <DataAnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
