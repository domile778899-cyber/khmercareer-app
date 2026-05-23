// @ts-nocheck
import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Megaphone,
  TrendingUp,
  Users,
  Briefcase,
  Globe,
  Share2,
  FileText,
  Search,
  Eye,
  Copy,
  Check,
  Download,
  Image,
  Calendar,
  Building,
  MapPin,
  ChevronDown,
  RefreshCw,
  Sparkles,
  BarChart3,
  Target,
  Zap,
} from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

/* ─────────── Types ─────────── */
interface Template {
  id: string;
  name: string;
  type: 'job' | 'event' | 'brand';
  icon: React.ReactNode;
  bgClass: string;
}

interface PosterData {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  company: string;
  contact: string;
  description: string;
  cta: string;
  accentColor: string;
}

/* ─────────── Constants ─────────── */
const templates: Template[] = [
  {
    id: 'job',
    name: '招聘海报',
    type: 'job',
    icon: <Briefcase size={20} />,
    bgClass: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'event',
    name: '活动推广',
    type: 'event',
    icon: <Calendar size={20} />,
    bgClass: 'from-purple-500 to-pink-600',
  },
  {
    id: 'brand',
    name: '品牌宣传',
    type: 'brand',
    icon: <Sparkles size={20} />,
    bgClass: 'from-emerald-500 to-teal-600',
  },
];

const posterPresets: Record<string, PosterData> = {
  job: {
    title: '高薪诚聘制衣技工',
    subtitle: '月薪 $500-$1200，包食宿',
    date: '长期招聘',
    location: '金边经济特区',
    company: 'KhmerCareer 合作企业',
    contact: 'Tel: 012 345 678',
    description: '诚招平车工、冚车工、打边车工，有无经验均可，提供专业培训',
    cta: '立即申请',
    accentColor: 'blue',
  },
  event: {
    title: '大型招聘会',
    subtitle: '500+ 岗位等你来',
    date: '2026年2月15日 09:00-17:00',
    location: '金边会展中心 Hall A',
    company: 'KhmerCareer 主办',
    contact: '报名: www.khmercareer.com',
    description: '汇集制衣、酒店、IT、建筑等行业优质企业，现场面试，当场录用',
    cta: '免费参加',
    accentColor: 'purple',
  },
  brand: {
    title: 'KhmerCareer',
    subtitle: '柬埔寨领先的求职招聘平台',
    date: '服务超过 10,000+ 求职者',
    location: '覆盖全柬埔寨',
    company: 'www.khmercareer.com',
    contact: 'Tel: 012 345 678',
    description: '免费提供职位搜索、简历制作、面试培训、职业规划等一站式求职服务',
    cta: '立即注册',
    accentColor: 'emerald',
  },
};

const keywords = [
  '柬埔寨招聘',
  '制衣厂招工',
  '金边工作',
  '高薪职位',
  '求职平台',
  '免费培训',
  '简历制作',
  '面试技巧',
];

const stats = [
  { label: '注册用户', value: '12,580+', icon: <Users size={20} />, color: 'text-blue-600 bg-blue-50' },
  { label: '职位发布', value: '3,420+', icon: <Briefcase size={20} />, color: 'text-emerald-600 bg-emerald-50' },
  { label: '成功入职', value: '8,960+', icon: <Target size={20} />, color: 'text-purple-600 bg-purple-50' },
  { label: '合作伙伴', value: '860+', icon: <Building size={20} />, color: 'text-amber-600 bg-amber-50' },
];

/* ─────────── Poster Preview Component ─────────── */
function PosterPreview({
  template,
  data,
}: {
  template: Template;
  data: PosterData;
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    emerald: 'from-emerald-500 to-teal-600',
    red: 'from-red-500 to-rose-600',
    orange: 'from-orange-500 to-amber-600',
  };

  const bgGradient = colorMap[data.accentColor] || template.bgClass;

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Poster Canvas */}
      <div className={`bg-gradient-to-br ${bgGradient} p-6 text-white min-h-[360px] flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                {template.icon}
              </div>
              <span className="text-xs font-medium text-white/80">{template.name}</span>
            </div>
            <span className="text-xs text-white/60">KhmerCareer</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">{data.title || '标题'}</h2>
          <p className="text-sm text-white/80 mb-4">{data.subtitle || '副标题'}</p>

          <div className="space-y-2 text-sm text-white/70">
            {data.date && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{data.date}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{data.location}</span>
              </div>
            )}
            {data.company && (
              <div className="flex items-center gap-2">
                <Building size={14} />
                <span>{data.company}</span>
              </div>
            )}
            {data.contact && (
              <div className="flex items-center gap-2">
                <Globe size={14} />
                <span>{data.contact}</span>
              </div>
            )}
          </div>

          {data.description && (
            <p className="mt-4 text-sm text-white/70 leading-relaxed">{data.description}</p>
          )}
        </div>

        {data.cta && (
          <div className="mt-4">
            <div className="inline-block px-5 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-semibold">
              {data.cta}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 flex items-center justify-between border-t border-gray-100">
        <span className="text-xs text-gray-400">预览效果</span>
        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
          <Download size={14} />
          下载海报
        </button>
      </div>
    </div>
  );
}

/* ─────────── Main Component ─────────── */
export default function MarketingPromo() {
  const [activeTemplate, setActiveTemplate] = useState<string>('job');
  const [posterData, setPosterData] = useState<PosterData>(posterPresets.job);
  const [seoTitle, setSeoTitle] = useState('KhmerCareer - 柬埔寨领先的求职招聘平台');
  const [seoDesc, setSeoDesc] = useState(
    '在KhmerCareer发现柬埔寨最好的工作机会。免费创建简历、获取面试技巧、参加职业培训。制衣、酒店、IT等行业高薪职位等你来！'
  );
  const [seoKeywords, setSeoKeywords] = useState<string[]>(['柬埔寨招聘', '求职平台', '金边工作']);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescRef = useRef<HTMLTextAreaElement>(null);

  const currentTemplate = templates.find((t) => t.id === activeTemplate)!;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://khmercareer.com';

  const handleTemplateChange = useCallback((id: string) => {
    setActiveTemplate(id);
    setPosterData(posterPresets[id] || posterPresets.job);
  }, []);

  const updatePosterField = useCallback(
    (field: keyof PosterData, value: string) => {
      setPosterData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const toggleKeyword = useCallback((kw: string) => {
    setSeoKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }, []);

  const seoScore = useMemo(() => {
    let score = 0;
    if (seoTitle.length >= 20 && seoTitle.length <= 60) score += 30;
    else if (seoTitle.length > 0) score += 15;
    if (seoDesc.length >= 80 && seoDesc.length <= 160) score += 30;
    else if (seoDesc.length > 0) score += 15;
    if (seoKeywords.length >= 3) score += 25;
    else if (seoKeywords.length > 0) score += 10;
    score += 15; // base
    return Math.min(score, 100);
  }, [seoTitle, seoDesc, seoKeywords]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <span className="text-purple-100 text-sm font-medium">营销推广中心</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">推广你的品牌与职位</h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            一站式营销工具，助力企业高效招聘，让优质职位触达更多求职者
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ──── Section: Poster Generator ──── */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Image size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">推广素材生成器</h2>
            <span className="text-xs text-gray-400 ml-2">快速生成专业海报</span>
          </div>

          <div className="p-5">
            {/* Template Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-500 whitespace-nowrap">选择模板：</span>
              <div className="flex items-center gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateChange(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTemplate === t.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t.icon}
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">标题</label>
                  <input
                    type="text"
                    value={posterData.title}
                    onChange={(e) => updatePosterField('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">副标题</label>
                  <input
                    type="text"
                    value={posterData.subtitle}
                    onChange={(e) => updatePosterField('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">日期</label>
                    <input
                      type="text"
                      value={posterData.date}
                      onChange={(e) => updatePosterField('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">地点</label>
                    <input
                      type="text"
                      value={posterData.location}
                      onChange={(e) => updatePosterField('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">公司/主办</label>
                  <input
                    type="text"
                    value={posterData.company}
                    onChange={(e) => updatePosterField('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">联系方式</label>
                  <input
                    type="text"
                    value={posterData.contact}
                    onChange={(e) => updatePosterField('contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">描述</label>
                  <textarea
                    value={posterData.description}
                    onChange={(e) => updatePosterField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">按钮文字</label>
                    <input
                      type="text"
                      value={posterData.cta}
                      onChange={(e) => updatePosterField('cta', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">主题色</label>
                    <select
                      value={posterData.accentColor}
                      onChange={(e) => updatePosterField('accentColor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="blue">蓝色</option>
                      <option value="purple">紫色</option>
                      <option value="emerald">绿色</option>
                      <option value="red">红色</option>
                      <option value="orange">橙色</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">实时预览</label>
                <PosterPreview template={currentTemplate} data={posterData} />
              </div>
            </div>
          </div>
        </section>

        {/* ──── Section: Share ──── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Share2 size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">分享推广</h2>
          </div>
          <ShareButtons
            url={currentUrl}
            title={seoTitle}
            showLabel={true}
          />
        </section>

        {/* ──── Section: SEO Optimizer ──── */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">SEO 优化工具</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">优化评分</span>
              <div
                className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                  seoScore >= 80
                    ? 'bg-green-100 text-green-700'
                    : seoScore >= 50
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {seoScore}/100
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Score Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  seoScore >= 80 ? 'bg-green-500' : seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${seoScore}%` }}
              />
            </div>

            {/* Title Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">页面标题 (Title)</label>
                <span
                  className={`text-xs ${
                    seoTitle.length > 60 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {seoTitle.length}/60
                </span>
              </div>
              <div className="relative">
                <input
                  ref={seoTitleRef}
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  maxLength={80}
                />
                <button
                  onClick={() => handleCopy(seoTitle, 'title')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {copiedField === 'title' ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Description Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">页面描述 (Meta Description)</label>
                <span
                  className={`text-xs ${
                    seoDesc.length > 160 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {seoDesc.length}/160
                </span>
              </div>
              <div className="relative">
                <textarea
                  ref={seoDescRef}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  maxLength={200}
                />
                <button
                  onClick={() => handleCopy(seoDesc, 'desc')}
                  className="absolute right-2 top-2 p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {copiedField === 'desc' ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                关键词建议
              </label>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      seoKeywords.includes(kw)
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {seoKeywords.includes(kw) && <Check size={12} className="inline mr-1" />}
                    {kw}
                  </button>
                ))}
              </div>
              {seoKeywords.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  已选择 {seoKeywords.length} 个关键词
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">搜索结果预览</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">khmercareer.com</span>
                </div>
                <h3 className="text-base text-blue-700 font-medium mb-1 hover:underline cursor-pointer line-clamp-1">
                  {seoTitle || '页面标题'}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {seoDesc || '页面描述内容...'}
                </p>
              </div>
            </div>

            {/* SEO Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  icon: <FileText size={16} />,
                  title: '标题优化',
                  desc: '标题长度控制在30-60个字符，包含核心关键词',
                },
                {
                  icon: <Search size={16} />,
                  title: '描述优化',
                  desc: '描述长度80-160字符，吸引用户点击',
                },
                {
                  icon: <Zap size={16} />,
                  title: '关键词布局',
                  desc: '选择3-5个核心关键词，自然融入内容',
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tip.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──── Section: Marketing Tips ──── */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            营销小贴士
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Target size={18} />,
                title: '精准定位目标人群',
                desc: '根据职位类型选择合适的推广渠道，制衣类侧重工厂周边，IT类侧重线上社区。',
              },
              {
                icon: <BarChart3 size={18} />,
                title: '数据分析驱动决策',
                desc: '定期分析推广数据，了解哪些渠道带来的求职者质量最高，优化推广策略。',
              },
              {
                icon: <Users size={18} />,
                title: '利用社交网络传播',
                desc: '鼓励员工分享职位信息，利用Facebook、Telegram等社交平台扩大传播范围。',
              },
              {
                icon: <Megaphone size={18} />,
                title: '突出职位亮点',
                desc: '在推广内容中突出薪资福利、工作环境、晋升空间等求职者最关心的信息。',
              },
              {
                icon: <Zap size={18} />,
                title: '限时活动制造紧迫感',
                desc: '设置招聘截止日期或限时福利，促使求职者尽快投递简历。',
              },
              {
                icon: <Globe size={18} />,
                title: '多语言推广覆盖更广',
                desc: '针对柬埔寨本地求职者使用柬语和中文双语推广，提升覆盖范围。',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  {tip.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
