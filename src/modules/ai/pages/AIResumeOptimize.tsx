import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, CheckCircle, AlertCircle, Lightbulb, Star,
  Download, User, Phone, Mail, Briefcase, GraduationCap, Wrench,
  FileEdit, Award, TrendingUp, LayoutTemplate, RefreshCw, Loader2,
  Globe, ChevronDown, Zap, Target, BookOpen, Languages, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { callAI, parseAIJSON } from '@/utils/aiApi';
import type { AIResponse } from '@/utils/aiApi';
import { logger } from '@/shared/logger'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface ResumeFormData {
  name: string;
  phone: string;
  email: string;
  targetPosition: string;
  experience: string;
  education: string;
  skills: string;
  selfIntro: string;
}

interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
  icon: string;
}

interface KeywordItem {
  keyword: string;
  found: boolean;
  importance: string;
}

interface AIAnalysisResult {
  total: number;
  dimensions: DimensionScore[];
  suggestions: string[];
  keywords: KeywordItem[];
  optimizedResume: string;
  skillGaps: string[];
  language: string;
}

type Language = 'zh' | 'en' | 'km';

const LANGUAGES: { code: Language; label: string; labelNative: string; flag: string }[] = [
  { code: 'zh', label: '中文', labelNative: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', labelNative: 'English', flag: '🇬🇧' },
  { code: 'km', label: 'Khmer', labelNative: 'ភាសាខ្មែរ', flag: '🇰🇭' },
];

/* ═══════════════════════════════════════════
   Color helpers
   ═══════════════════════════════════════════ */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-yellow-500';
  return 'stroke-red-500';
}

function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

/* ═══════════════════════════════════════════
   System Prompt for Resume Analysis
   ═══════════════════════════════════════════ */
function buildSystemPrompt(lang: Language): string {
  const prompts: Record<Language, string> = {
    zh: `你是一位专业的简历优化顾问，擅长帮助求职者优化简历。请对用户的简历进行全面分析，并以JSON格式返回以下结构：
{
  "total": 综合评分(1-100),
  "dimensions": [
    {"name": "完整性", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "CheckCircle"},
    {"name": "关键词匹配", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "Target"},
    {"name": "格式规范", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "LayoutTemplate"},
    {"name": "内容质量", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "FileText"},
    {"name": "语言专业度", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "Languages"},
    {"name": "职业匹配度", "score": 分数, "maxScore": 100, "feedback": "反馈", "icon": "Briefcase"}
  ],
  "suggestions": ["建议1", "建议2", ...],
  "keywords": [{"keyword": "关键词1", "found": true/false, "importance": "high/medium/low"}, ...],
  "optimizedResume": "优化后的完整简历文本",
  "skillGaps": ["需要补充的技能1", "需要补充的技能2"]
}`,
    en: `You are a professional resume optimization consultant. Analyze the user's resume comprehensively and return JSON with:
{
  "total": overall score(1-100),
  "dimensions": [
    {"name": "Completeness", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "CheckCircle"},
    {"name": "Keyword Match", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "Target"},
    {"name": "Format", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "LayoutTemplate"},
    {"name": "Content Quality", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "FileText"},
    {"name": "Language", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "Languages"},
    {"name": "Job Match", "score": score, "maxScore": 100, "feedback": "feedback", "icon": "Briefcase"}
  ],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "keywords": [{"keyword": "keyword1", "found": true/false, "importance": "high/medium/low"}, ...],
  "optimizedResume": "optimized resume text",
  "skillGaps": ["skill gap 1", "skill gap 2"]
}`,
    km: `អ្នកគឺជាអ្នកប្រឹក្សារជំនាញខាងកែលម្អប្រវត្តិរូបសង្ខេប សូមវិភាគប្រវត្តិរូបសង្ខេបរបស់អ្នកប្រើប្រាស់ និងត្រឡប់ JSON:`,
  };
  return prompts[lang] || prompts.zh;
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function AIResumeOptimizer() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ResumeFormData>({
    name: '', phone: '', email: '', targetPosition: '',
    experience: '', education: '', skills: '', selfIntro: '',
  });
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'optimized' | 'keywords'>('analysis');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysis]);

  const handleChange = (field: keyof ResumeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const buildUserPrompt = (): string => {
    return `请分析以下${lang === 'km' ? '高棉语' : lang === 'en' ? '英文' : '中文'}简历：

【求职意向】${formData.targetPosition}
【工作经历】
${formData.experience}
【教育背景】
${formData.education}
【技能特长】
${formData.skills}
【自我评价】
${formData.selfIntro}

请以JSON格式返回分析结果。`;
  };

  const handleAnalyze = async () => {
    // Validation
    const requiredFields: (keyof ResumeFormData)[] = ['name', 'targetPosition', 'experience', 'skills'];
    const missing = requiredFields.filter(f => !formData[f]?.trim());
    if (missing.length > 0) {
      setError(t('resumeOptimizer.fillRequired', '请填写必填项：姓名、求职意向、工作经历、技能特长'));
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result: AIResponse = await callAI(
        [
          { role: 'system', content: buildSystemPrompt(lang) },
          { role: 'user', content: buildUserPrompt() },
        ],
        { temperature: 0.5, max_tokens: 3000 }
      );

      if (!result.success) {
        setError(result.error || t('resumeOptimizer.analysisFailed', '分析失败，请重试'));
        // Fallback: use local analysis
        runLocalAnalysis();
        return;
      }

      const parsed = parseAIJSON<AIAnalysisResult>(result.content, getLocalAnalysis());
      setAnalysis(parsed);
    } catch (err) {
      logger.error('Resume optimize failed', { error: err, component: 'AIResumeOptimize' });
      setError(t('resumeOptimizer.networkError', '网络错误，使用本地分析'));
      runLocalAnalysis();
    } finally {
      setLoading(false);
    }
  };

  const getLocalAnalysis = (): AIAnalysisResult => {
    const content = `${formData.experience} ${formData.skills} ${formData.selfIntro}`;
    const jobKeywords = ['经验', '技能', '团队', '管理', '沟通', '协调', '负责', '完成', 'project', 'team', 'lead', 'manage'];
    const matchedKeywords = jobKeywords.filter(k => content.toLowerCase().includes(k.toLowerCase()));
    const keywordScore = Math.round((matchedKeywords.length / jobKeywords.length) * 100);
    const completenessScore = ['name', 'phone', 'email', 'targetPosition', 'experience', 'education', 'skills']
      .filter(f => formData[f as keyof ResumeFormData]?.trim()).length * 14;

    return {
      total: Math.round((keywordScore + completenessScore + 70 + 60) / 4),
      dimensions: [
        { name: '完整性', score: Math.min(100, completenessScore), maxScore: 100, feedback: '基本信息填写完整', icon: 'CheckCircle' },
        { name: '关键词匹配', score: keywordScore, maxScore: 100, feedback: `匹配到${matchedKeywords.length}个关键词`, icon: 'Target' },
        { name: '格式规范', score: 70, maxScore: 100, feedback: '建议使用更清晰的格式', icon: 'LayoutTemplate' },
        { name: '内容质量', score: 60, maxScore: 100, feedback: '内容可以更详细', icon: 'FileText' },
        { name: '语言专业度', score: 75, maxScore: 100, feedback: '语言较为专业', icon: 'Languages' },
        { name: '职业匹配度', score: 65, maxScore: 100, feedback: '技能与目标职位基本匹配', icon: 'Briefcase' },
      ],
      suggestions: [
        '增加更多行业关键词到工作经历描述中',
        '使用STAR法则描述项目经验',
        '补充量化成果数据（如提升了XX%效率）',
        '添加专业技能证书信息',
      ],
      keywords: jobKeywords.map(k => ({ keyword: k, found: matchedKeywords.includes(k), importance: 'high' as const })),
      optimizedResume: content,
      skillGaps: ['数据分析', '项目管理', '英语沟通'],
      language: lang,
    };
  };

  const runLocalAnalysis = () => {
    setAnalysis(getLocalAnalysis());
  };

  const handleExport = () => {
    const resumeText = analysis?.optimizedResume || `${formData.name}\n${formData.experience}\n${formData.education}\n${formData.skills}`;
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'resume'}_optimized_${lang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = analysis ? circumference - (analysis.total / 100) * circumference : circumference;

  const iconMap: Record<string, React.ReactNode> = {
    CheckCircle: <CheckCircle className="w-4 h-4" />,
    Target: <Target className="w-4 h-4" />,
    LayoutTemplate: <LayoutTemplate className="w-4 h-4" />,
    FileText: <FileText className="w-4 h-4" />,
    Languages: <Languages className="w-4 h-4" />,
    Briefcase: <Briefcase className="w-4 h-4" />,
    Star: <Star className="w-4 h-4" />,
    Award: <Award className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ═══════ Hero ═══════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-warm-white">
                  {t('resumeOptimizer.title', 'AI简历优化')}
                </h1>
                <p className="text-warm-gray text-sm mt-1">
                  {t('resumeOptimizer.subtitle', 'AI智能分析简历，提供多语言优化建议')}
                </p>
              </div>
            </div>
            {/* Language Selector */}
            <div className="relative sm:ml-auto">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-warm-white hover:bg-white/20 transition-colors"
              >
                <Globe className="w-4 h-4 text-gold" />
                <span>{LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.labelNative}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 min-w-[160px]"
                    >
                      {LANGUAGES.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${lang === l.code ? 'text-gold font-medium bg-gold/5' : 'text-charcoal'}`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.labelNative}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Error Banner ═══════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 mt-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={() => setError(null)} className="ml-auto hover:bg-red-100 rounded-full p-1">
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ Main Content ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left: Form (5 cols) ── */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-charcoal">{t('resumeOptimizer.resumeInfo', '简历信息')}</h2>
                  <Badge variant="outline" className="ml-auto text-xs border-gold/30 text-gold">
                    {LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.label}
                  </Badge>
                </div>

                <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" /> {t('resumeOptimizer.basicInfo', '基本信息')}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-charcoal mb-1">{t('resumeOptimizer.name', '姓名')} <span className="text-coral">*</span></label>
                        <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)}
                          placeholder={t('resumeOptimizer.namePlaceholder', '请输入姓名')}
                          className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all text-sm bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-charcoal mb-1">{t('resumeOptimizer.phone', '电话')}</label>
                          <input type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)}
                            placeholder={t('resumeOptimizer.phonePlaceholder', '电话')}
                            className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-charcoal mb-1">{t('resumeOptimizer.email', '邮箱')}</label>
                          <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                            placeholder={t('resumeOptimizer.emailPlaceholder', '邮箱')}
                            className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <Briefcase className="w-3.5 h-3.5" /> {t('resumeOptimizer.targetPosition', '求职意向')}
                    </h3>
                    <label className="block text-sm text-charcoal mb-1">{t('resumeOptimizer.targetPosition', '目标职位')} <span className="text-coral">*</span></label>
                    <input type="text" value={formData.targetPosition} onChange={e => handleChange('targetPosition', e.target.value)}
                      placeholder={t('resumeOptimizer.positionPlaceholder', '例如：生产主管、酒店经理')}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm bg-white"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <FileEdit className="w-3.5 h-3.5" /> {t('resumeOptimizer.experience', '工作经历')} <span className="text-coral">*</span>
                    </h3>
                    <textarea value={formData.experience} onChange={e => handleChange('experience', e.target.value)}
                      placeholder={t('resumeOptimizer.experiencePlaceholder', '请描述工作经历\n例如：2019-2023 制衣厂生产主管\n- 负责30人团队管理\n- 完成年度目标120%')}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none text-sm bg-white"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <GraduationCap className="w-3.5 h-3.5" /> {t('resumeOptimizer.education', '教育背景')}
                    </h3>
                    <textarea value={formData.education} onChange={e => handleChange('education', e.target.value)}
                      placeholder={t('resumeOptimizer.educationPlaceholder', '请填写教育经历')}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none text-sm bg-white"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5" /> {t('resumeOptimizer.skills', '技能特长')} <span className="text-coral">*</span>
                    </h3>
                    <textarea value={formData.skills} onChange={e => handleChange('skills', e.target.value)}
                      placeholder={t('resumeOptimizer.skillsPlaceholder', '例如：生产管理、质量控制、团队培训、Excel')}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none text-sm bg-white"
                    />
                  </div>

                  {/* Self Intro */}
                  <div>
                    <h3 className="text-xs font-medium text-warm-gray mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" /> {t('resumeOptimizer.selfIntro', '自我评价（选填）')}
                    </h3>
                    <textarea value={formData.selfIntro} onChange={e => handleChange('selfIntro', e.target.value)}
                      placeholder={t('resumeOptimizer.selfIntroPlaceholder', '简要描述您的优势和特点')}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none text-sm bg-white"
                    />
                  </div>

                  {/* Analyze Button */}
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-xl shadow-lg shadow-gold/25 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('resumeOptimizer.analyzing', 'AI分析中...')}</>
                    ) : (
                      <><Sparkles className="w-5 h-5 mr-2" /> {t('resumeOptimizer.analyzeBtn', 'AI智能分析')}</>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ── Right: Analysis Results (7 cols) ── */}
          <div className="lg:col-span-7" ref={resultRef}>
            {!analysis ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-warm-gray"
              >
                <div className="w-24 h-24 rounded-3xl bg-gold/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-gold/40" />
                </div>
                <p className="text-center text-lg font-medium">{t('resumeOptimizer.emptyState', '请填写简历信息')}</p>
                <p className="text-center text-sm mt-2 text-warm-gray/70">{t('resumeOptimizer.emptyDesc', '点击「AI智能分析」查看AI优化报告')}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {[
                    { key: 'analysis' as const, label: t('resumeOptimizer.tabAnalysis', '分析报告'), icon: BarChart3 },
                    { key: 'optimized' as const, label: t('resumeOptimizer.tabOptimized', '优化简历'), icon: FileText },
                    { key: 'keywords' as const, label: t('resumeOptimizer.tabKeywords', '关键词'), icon: Target },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                        activeTab === tab.key ? 'bg-gold text-charcoal shadow-md' : 'bg-white text-warm-gray hover:bg-cream'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Analysis Report */}
                {activeTab === 'analysis' && (
                  <div className="space-y-4">
                    {/* Score Card */}
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Circular Score */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#E8E0D0" strokeWidth="8" />
                            <motion.circle
                              cx="60" cy="60" r="54" fill="none"
                              className={getScoreRingColor(analysis.total)}
                              strokeWidth="8" strokeLinecap="round"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span className={`text-3xl font-bold ${getScoreColor(analysis.total)}`}
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                            >
                              {analysis.total}
                            </motion.span>
                            <span className="text-xs text-warm-gray">{t('resumeOptimizer.score', '综合评分')}</span>
                          </div>
                        </div>

                        {/* Stars & Summary */}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`w-6 h-6 ${s <= Math.round(analysis.total / 20) ? 'text-gold fill-gold' : 'text-sand'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-warm-gray">
                            {analysis.total >= 80 ? t('resumeOptimizer.scoreExcellent', '简历质量优秀！') :
                             analysis.total >= 60 ? t('resumeOptimizer.scoreGood', '简历质量不错，还有提升空间') :
                             t('resumeOptimizer.scoreNeedImprove', '简历需要优化，查看下方建议')}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                            {analysis.skillGaps.map((gap, i) => (
                              <Badge key={i} variant="secondary" className="bg-coral/10 text-coral border-0">
                                <Zap className="w-3 h-3 mr-1" /> {gap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Dimension Scores */}
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gold" /> {t('resumeOptimizer.dimensionScores', '各维度评分')}
                      </h3>
                      <div className="space-y-3">
                        {analysis.dimensions.map((dim, i) => (
                          <motion.div
                            key={dim.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            <div className="flex items-center gap-3 mb-1">
                              <div className="text-gold">{iconMap[dim.icon] || <Award className="w-4 h-4" />}</div>
                              <span className="text-sm text-charcoal flex-1">{dim.name}</span>
                              <span className={`text-sm font-semibold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                            </div>
                            <div className="ml-7">
                              <Progress value={dim.score} className="h-2 bg-sand" />
                            </div>
                            <p className="ml-7 text-xs text-warm-gray mt-1">{dim.feedback}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>

                    {/* Suggestions */}
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-gold" /> {t('resumeOptimizer.suggestions', 'AI优化建议')}
                      </h3>
                      <div className="space-y-3">
                        {analysis.suggestions.map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-cream/50"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              i === 0 ? 'bg-gold/20' : i === 1 ? 'bg-emerald/20' : 'bg-blue-500/20'
                            }`}>
                              <span className={`text-xs font-bold ${i === 0 ? 'text-gold' : i === 1 ? 'text-emerald' : 'text-blue-500'}`}>{i + 1}</span>
                            </div>
                            <p className="text-sm text-charcoal leading-relaxed">{s}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Tab: Optimized Resume */}
                {activeTab === 'optimized' && (
                  <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold" /> {t('resumeOptimizer.optimizedResume', 'AI优化后的简历')}
                      </h3>
                      <Button onClick={handleExport} variant="outline" size="sm" className="text-xs border-gold/30 text-gold hover:bg-gold/10">
                        <Download className="w-3.5 h-3.5 mr-1" /> {t('resumeOptimizer.export', '导出')}
                      </Button>
                    </div>
                    <div className="bg-charcoal/5 rounded-xl p-4 sm:p-5 whitespace-pre-wrap text-sm text-charcoal leading-relaxed font-mono">
                      {analysis.optimizedResume}
                    </div>
                  </Card>
                )}

                {/* Tab: Keywords */}
                {activeTab === 'keywords' && (
                  <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                    <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-gold" /> {t('resumeOptimizer.keywordAnalysis', '关键词分析')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((kw, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Badge
                            className={`px-3 py-1.5 text-sm ${
                              kw.found
                                ? 'bg-emerald/10 text-emerald border-emerald/30 hover:bg-emerald/20'
                                : 'bg-sand/50 text-warm-gray border-sand hover:bg-sand'
                            }`}
                            variant="outline"
                          >
                            {kw.found ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            {kw.keyword}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                              kw.importance === 'high' ? 'bg-coral/20 text-coral' :
                              kw.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-gray-200 text-gray-500'
                            }`}>
                              {kw.importance === 'high' ? '高' : kw.importance === 'medium' ? '中' : '低'}
                            </span>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-gold/10 rounded-xl">
                      <p className="text-xs text-charcoal">
                        <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-gold" />
                        {t('resumeOptimizer.keywordTip', '建议在简历中补充未匹配的高优先级关键词，以提高ATS系统通过率')}
                      </p>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
