import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, BarChart3, Building2, Award, AlertCircle,
  Loader2, ChevronDown, Globe, Target, Lightbulb, ArrowUp,
  ArrowDown, Minus, Star, Briefcase, GraduationCap, MapPin,
  Settings, Zap, TrendingDown
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
interface SalaryForm {
  industry: string;
  position: string;
  experience: string;
  location: string;
  education: string;
  chineseLevel: string;
}

interface SalaryRange {
  min: number;
  avg: number;
  max: number;
  median: number;
}

interface IndustryComparison {
  industry: string;
  avgSalary: number;
  growthRate: number;
  demandLevel: 'high' | 'medium' | 'low';
}

interface SalaryTrend {
  year: string;
  salary: number;
  growth: number;
}

interface ChinesePremium {
  hasChinese: boolean;
  premiumPercent: number;
  premiumAmount: number;
  reason: string;
}

interface AISalaryResult {
  salaryRange: SalaryRange;
  industryComparisons: IndustryComparison[];
  trends: SalaryTrend[];
  chinesePremium: ChinesePremium;
  growthPrediction: {
    nextYear: number;
    threeYears: number;
    fiveYears: number;
  };
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  advice: string[];
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const INDUSTRIES = [
  { id: 'manufacturing', label: '制造业', labelEn: 'Manufacturing', icon: '⚙️' },
  { id: 'tourism', label: '酒店旅游', labelEn: 'Tourism', icon: '🏨' },
  { id: 'ict', label: 'ICT科技', labelEn: 'ICT', icon: '💻' },
  { id: 'construction', label: '建筑工程', labelEn: 'Construction', icon: '🏗️' },
  { id: 'finance', label: '金融服务', labelEn: 'Finance', icon: '💰' },
  { id: 'agriculture', label: '农业', labelEn: 'Agriculture', icon: '🌾' },
  { id: 'retail', label: '零售贸易', labelEn: 'Retail', icon: '🛒' },
  { id: 'logistics', label: '物流运输', labelEn: 'Logistics', icon: '🚚' },
  { id: 'healthcare', label: '医疗健康', labelEn: 'Healthcare', icon: '🏥' },
  { id: 'education', label: '教育培训', labelEn: 'Education', icon: '📚' },
];

const EXPERIENCE_LEVELS = [
  { value: '0', label: '应届生/无经验', years: 0 },
  { value: '1-2', label: '1-2年', years: 1.5 },
  { value: '3-5', label: '3-5年', years: 4 },
  { value: '5-10', label: '5-10年', years: 7 },
  { value: '10+', label: '10年以上', years: 12 },
];

const LOCATIONS = [
  { value: 'phnompenh', label: '金边', labelEn: 'Phnom Penh', costIndex: 100 },
  { value: 'siemreap', label: '暹粒', labelEn: 'Siem Reap', costIndex: 85 },
  { value: 'sihanouk', label: '西港', labelEn: 'Sihanoukville', costIndex: 90 },
  { value: 'battambang', label: '马德望', labelEn: 'Battambang', costIndex: 70 },
  { value: 'kampot', label: '贡布', labelEn: 'Kampot', costIndex: 65 },
];

const EDUCATION_LEVELS = [
  { value: 'highschool', label: '高中/中专', factor: 0.7 },
  { value: 'college', label: '大专', factor: 0.85 },
  { value: 'bachelor', label: '本科', factor: 1.0 },
  { value: 'master', label: '硕士', factor: 1.25 },
  { value: 'phd', label: '博士', factor: 1.5 },
];

const CHINESE_LEVELS = [
  { value: 'none', label: '不会', premium: 0 },
  { value: 'basic', label: '基础', premium: 10 },
  { value: 'intermediate', label: '中级', premium: 25 },
  { value: 'fluent', label: '流利', premium: 45 },
  { value: 'native', label: '母语', premium: 60 },
];

/* ═══════════════════════════════════════════
   Color Helpers
   ═══════════════════════════════════════════ */
function getTrendIcon(growth: number) {
  if (growth > 5) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
  if (growth > 0) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (growth === 0) return <Minus className="w-4 h-4 text-warm-gray" />;
  return <TrendingDown className="w-4 h-4 text-coral" />;
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function AISalaryAnalyzer() {
  const { t } = useTranslation();
  const resultRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<SalaryForm>({
    industry: 'manufacturing', position: '', experience: '3-5', location: 'phnompenh', education: 'bachelor', chineseLevel: 'intermediate',
  });
  const [result, setResult] = useState<AISalaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'compare' | 'trend'>('overview');

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const updateForm = (field: keyof SalaryForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const calculateLocalResult = (): AISalaryResult => {
    const industry = INDUSTRIES.find(i => i.id === form.industry);
    const exp = EXPERIENCE_LEVELS.find(e => e.value === form.experience);
    const loc = LOCATIONS.find(l => l.value === form.location);
    const edu = EDUCATION_LEVELS.find(e => e.value === form.education);
    const chinese = CHINESE_LEVELS.find(c => c.value === form.chineseLevel);

    const baseSalary = 400;
    const industryMultipliers: Record<string, number> = {
      manufacturing: 1.0, tourism: 0.9, ict: 1.6, construction: 1.2, finance: 1.5,
      agriculture: 0.7, retail: 0.8, logistics: 0.9, healthcare: 1.1, education: 0.85,
    };
    const indMult = industryMultipliers[form.industry] || 1;
    const expMult = 1 + (exp?.years || 0) * 0.08;
    const locMult = (loc?.costIndex || 100) / 100;
    const eduMult = edu?.factor || 1;

    const avgSalary = Math.round(baseSalary * indMult * expMult * locMult * eduMult);
    const chinesePremium = chinese?.premium || 0;
    const premiumAmount = Math.round(avgSalary * chinesePremium / 100);

    return {
      salaryRange: {
        min: Math.round(avgSalary * 0.7),
        avg: avgSalary,
        max: Math.round(avgSalary * 1.4),
        median: Math.round(avgSalary * 0.95),
      },
      industryComparisons: INDUSTRIES.filter(i => i.id !== form.industry).slice(0, 5).map(i => {
        const m = industryMultipliers[i.id] || 1;
        return {
          industry: i.label,
          avgSalary: Math.round(baseSalary * m * expMult * locMult * eduMult),
          growthRate: Math.round((m - 1) * 20 + Math.random() * 10),
          demandLevel: m > 1.3 ? 'high' : m > 0.9 ? 'medium' : 'low',
        };
      }),
      trends: [
        { year: '2021', salary: Math.round(avgSalary * 0.82), growth: -5 },
        { year: '2022', salary: Math.round(avgSalary * 0.88), growth: 7 },
        { year: '2023', salary: Math.round(avgSalary * 0.94), growth: 7 },
        { year: '2024', salary: avgSalary, growth: 6 },
        { year: '2025', salary: Math.round(avgSalary * 1.05), growth: 5 },
      ],
      chinesePremium: {
        hasChinese: chinesePremium > 0,
        premiumPercent: chinesePremium,
        premiumAmount,
        reason: chinesePremium > 30
          ? '流利的中文能力在柬埔寨就业市场具有很高的溢价，特别是在中资企业'
          : '中文能力可以为您带来额外的薪资优势',
      },
      growthPrediction: {
        nextYear: Math.round(avgSalary * 1.08),
        threeYears: Math.round(avgSalary * 1.25),
        fiveYears: Math.round(avgSalary * 1.45),
      },
      factors: [
        { factor: '行业需求', impact: indMult > 1.2 ? 'positive' : 'neutral', description: `${industry?.label}行业${indMult > 1.2 ? '需求旺盛' : '稳定发展'}` },
        { factor: '经验水平', impact: (exp?.years || 0) > 3 ? 'positive' : 'neutral', description: `${exp?.label}经验${(exp?.years || 0) > 3 ? '，具备竞争力' : ''}` },
        { factor: '学历背景', impact: (edu?.factor || 1) >= 1 ? 'positive' : 'negative', description: `${edu?.label}学历` },
        { factor: '语言能力', impact: chinesePremium > 20 ? 'positive' : 'neutral', description: `中文${chinese?.label}水平` },
      ],
      advice: [
        chinesePremium < 20 ? '提升中文能力可以显著提高薪资水平' : '您的中文能力是重要竞争优势',
        (exp?.years || 0) < 5 ? '积累更多行业经验将有助于薪资增长' : '您的丰富经验是重要资产',
        '考虑获取行业相关认证以提升竞争力',
      ],
    };
  };

  const handleAnalyze = async () => {
    if (!form.position.trim()) {
      setError(t('salaryAnalyzer.enterPosition', '请输入职位名称'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const localResult = calculateLocalResult();

    try {
      const prompt = `分析柬埔寨薪资市场：\n行业：${INDUSTRIES.find(i => i.id === form.industry)?.label}\n职位：${form.position}\n经验：${EXPERIENCE_LEVELS.find(e => e.value === form.experience)?.label}\n地点：${LOCATIONS.find(l => l.value === form.location)?.label}\n学历：${EDUCATION_LEVELS.find(e => e.value === form.education)?.label}\n中文水平：${CHINESE_LEVELS.find(c => c.value === form.chineseLevel)?.label}\n\n请返回JSON：{\n  "salaryRange": {"min": 最低, "avg": 平均, "max": 最高, "median": 中位数},\n  "industryComparisons": [{"industry": "行业", "avgSalary": 平均薪资, "growthRate": 增长率, "demandLevel": "high/medium/low"}],\n  "trends": [{"year": "年份", "salary": 薪资, "growth": 增长率}],\n  "chinesePremium": {"hasChinese": true, "premiumPercent": 溢价百分比, "premiumAmount": 溢价金额, "reason": "原因"},\n  "growthPrediction": {"nextYear": 明年, "threeYears": 三年, "fiveYears": 五年},\n  "factors": [{"factor": "因素", "impact": "positive/negative/neutral", "description": "描述"}],\n  "advice": ["建议1", "建议2"]\n}`;

      const aiResult: AIResponse = await callAI([
        { role: 'system', content: '你是一位专业的柬埔寨薪资分析师，熟悉当地就业市场。请只返回JSON格式。' },
        { role: 'user', content: prompt },
      ], { temperature: 0.5, max_tokens: 2000 });

      if (aiResult.success) {
        const parsed = parseAIJSON<AISalaryResult>(aiResult.content, localResult);
        setResult(parsed.salaryRange ? parsed : localResult);
      } else {
        setResult(localResult);
      }
    } catch (err) {
      logger.error('Salary analysis failed', { error: err, component: 'AISalaryAnalyzer' });
      setResult(localResult);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (amount: number) => `$${amount.toLocaleString()}`;

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-warm-white">{t('salaryAnalyzer.title', 'AI薪资分析')}</h1>
                <p className="text-warm-gray text-sm mt-1">{t('salaryAnalyzer.subtitle', '智能分析柬埔寨市场薪资，预测薪资增长')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 mt-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ Main ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-5">
                  <Settings className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-charcoal">{t('salaryAnalyzer.yourProfile', '您的档案')}</h2>
                </div>

                <div className="space-y-4">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <Building2 className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.industry', '行业')}
                    </label>
                    <select value={form.industry} onChange={e => updateForm('industry', e.target.value)}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.icon} {i.label}</option>)}
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <Briefcase className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.position', '职位')} <span className="text-coral">*</span>
                    </label>
                    <input type="text" value={form.position} onChange={e => updateForm('position', e.target.value)}
                      placeholder={t('salaryAnalyzer.positionPlaceholder', '例如：生产主管、酒店经理')}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <Award className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.experience', '工作年限')}
                    </label>
                    <select value={form.experience} onChange={e => updateForm('experience', e.target.value)}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      {EXPERIENCE_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <MapPin className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.location', '工作地点')}
                    </label>
                    <select value={form.location} onChange={e => updateForm('location', e.target.value)}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <GraduationCap className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.education', '学历')}
                    </label>
                    <select value={form.education} onChange={e => updateForm('education', e.target.value)}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>

                  {/* Chinese Level */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      <Globe className="w-4 h-4 inline mr-1 text-gold" />{t('salaryAnalyzer.chineseLevel', '中文水平')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CHINESE_LEVELS.map(l => (
                        <button key={l.value} onClick={() => updateForm('chineseLevel', l.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            form.chineseLevel === l.value ? 'bg-gold text-charcoal' : 'bg-cream text-warm-gray hover:bg-sand'
                          }`}
                        >
                          {l.label} {l.premium > 0 && <span className="opacity-70">+{l.premium}%</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-xl shadow-lg shadow-gold/25 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('salaryAnalyzer.analyzing', 'AI分析中...')}</>
                    ) : (
                      <><BarChart3 className="w-5 h-5 mr-2" />{t('salaryAnalyzer.analyzeBtn', 'AI薪资分析')}</>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8" ref={resultRef}>
            {!result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-warm-gray">
                <div className="w-24 h-24 rounded-3xl bg-gold/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-12 h-12 text-gold/40" />
                </div>
                <p className="text-lg font-medium">{t('salaryAnalyzer.emptyTitle', '填写您的职业信息')}</p>
                <p className="text-sm mt-2 text-warm-gray/70">{t('salaryAnalyzer.emptyDesc', 'AI将分析柬埔寨市场薪资数据')}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { key: 'overview' as const, label: t('salaryAnalyzer.overview', '薪资概览'), icon: DollarSign },
                    { key: 'compare' as const, label: t('salaryAnalyzer.compare', '行业对比'), icon: Building2 },
                    { key: 'trend' as const, label: t('salaryAnalyzer.trend', '趋势预测'), icon: TrendingUp },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                        activeTab === tab.key ? 'bg-gold text-charcoal shadow-md' : 'bg-white text-warm-gray hover:bg-cream'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Salary Range Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: t('salaryAnalyzer.min', '最低'), value: result.salaryRange.min, color: 'text-coral', bg: 'bg-coral/5' },
                        { label: t('salaryAnalyzer.avg', '平均'), value: result.salaryRange.avg, color: 'text-gold', bg: 'bg-gold/10' },
                        { label: t('salaryAnalyzer.median', '中位'), value: result.salaryRange.median, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: t('salaryAnalyzer.max', '最高'), value: result.salaryRange.max, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      ].map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <Card className={`${item.bg} rounded-2xl border-0 p-4 text-center`}>
                            <p className="text-xs text-warm-gray mb-1">{item.label}</p>
                            <p className={`text-xl sm:text-2xl font-bold ${item.color}`}>{formatSalary(item.value)}</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chinese Premium */}
                    {result.chinesePremium.hasChinese && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6 bg-gradient-to-r from-red-50 to-gold/10 border border-gold/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <Globe className="w-6 h-6 text-gold" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
                                {t('salaryAnalyzer.chinesePremium', '中文能力薪资溢价')}
                                <Badge className="bg-gold text-charcoal border-0">+{result.chinesePremium.premiumPercent}%</Badge>
                              </h3>
                              <p className="text-sm text-warm-gray mt-1">{result.chinesePremium.reason}</p>
                              <p className="text-sm font-medium text-gold mt-2">
                                {t('salaryAnalyzer.premiumAmount', '预估月溢价')}: +{formatSalary(result.chinesePremium.premiumAmount)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* Growth Prediction */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                        <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gold" />{t('salaryAnalyzer.growthPrediction', '薪资增长预测')}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: t('salaryAnalyzer.nextYear', '1年后'), value: result.growthPrediction.nextYear, growth: 8 },
                            { label: t('salaryAnalyzer.threeYears', '3年后'), value: result.growthPrediction.threeYears, growth: 25 },
                            { label: t('salaryAnalyzer.fiveYears', '5年后'), value: result.growthPrediction.fiveYears, growth: 45 },
                          ].map(item => (
                            <div key={item.label} className="text-center p-3 bg-cream/50 rounded-xl">
                              <p className="text-xs text-warm-gray">{item.label}</p>
                              <p className="text-lg font-bold text-charcoal">{formatSalary(item.value)}</p>
                              <div className="flex items-center justify-center gap-0.5 mt-1">
                                {getTrendIcon(item.growth)}
                                <span className="text-xs text-emerald-600">+{item.growth}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>

                    {/* Factors */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                        <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                          <Target className="w-4 h-4 text-gold" />{t('salaryAnalyzer.influenceFactors', '影响因素分析')}
                        </h3>
                        <div className="space-y-3">
                          {result.factors.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-cream/30 rounded-xl">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                f.impact === 'positive' ? 'bg-emerald-500' : f.impact === 'negative' ? 'bg-coral' : 'bg-warm-gray'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-charcoal">{f.factor}</span>
                                  <Badge variant="outline" className={`text-xs ${
                                    f.impact === 'positive' ? 'border-emerald-300 text-emerald-600' :
                                    f.impact === 'negative' ? 'border-coral text-coral' : 'border-sand text-warm-gray'
                                  }`}>
                                    {f.impact === 'positive' ? '正面' : f.impact === 'negative' ? '负面' : '中性'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-warm-gray mt-0.5">{f.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>

                    {/* Advice */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                      <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                        <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-gold" />{t('salaryAnalyzer.advice', 'AI建议')}
                        </h3>
                        <div className="space-y-2">
                          {result.advice.map((a, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-charcoal">
                              <Star className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              <span>{a}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                )}

                {/* Tab: Compare */}
                {activeTab === 'compare' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gold" />{t('salaryAnalyzer.industryComparison', '行业薪资对比')}
                      </h3>
                      <div className="space-y-4">
                        {result.industryComparisons.map((comp, i) => {
                          const maxSalary = Math.max(...result.industryComparisons.map(c => c.avgSalary), result.salaryRange.avg);
                          const barWidth = maxSalary > 0 ? (comp.avgSalary / maxSalary) * 100 : 0;
                          return (
                            <motion.div key={comp.industry} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-charcoal w-20 flex-shrink-0">{comp.industry}</span>
                                <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                      comp.avgSalary > result.salaryRange.avg ? 'bg-emerald-400' : 'bg-gold'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-charcoal w-20 text-right">{formatSalary(comp.avgSalary)}</span>
                                <Badge variant="outline" className={`text-xs flex-shrink-0 ${
                                  comp.demandLevel === 'high' ? 'border-emerald-300 text-emerald-600' :
                                  comp.demandLevel === 'medium' ? 'border-yellow-300 text-yellow-600' : 'border-sand text-warm-gray'
                                }`}>
                                  {comp.demandLevel === 'high' ? '高需求' : comp.demandLevel === 'medium' ? '中需求' : '低需求'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 ml-23 mt-1">
                                {getTrendIcon(comp.growthRate)}
                                <span className="text-xs text-warm-gray">{comp.growthRate > 0 ? '+' : ''}{comp.growthRate}% {t('salaryAnalyzer.yearlyGrowth', '年增长')}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-gold/10 rounded-xl">
                        <p className="text-xs text-charcoal">
                          <Zap className="w-3.5 h-3.5 inline mr-1 text-gold" />
                          {t('salaryAnalyzer.compareTip', '对比基于相同经验和学历水平的平均薪资，实际薪资可能因公司规模和个人能力而有所不同')}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Tab: Trend */}
                {activeTab === 'trend' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gold" />{t('salaryAnalyzer.salaryTrend', '薪资趋势（近5年）')}
                      </h3>
                      <div className="space-y-3">
                        {result.trends.map((trend, i) => (
                          <motion.div key={trend.year} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-warm-gray w-12">{trend.year}</span>
                              <div className="flex-1 h-8 bg-cream rounded-full overflow-hidden relative">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(trend.salary / (result.salaryRange.max * 1.1)) * 100}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 }}
                                />
                                <span className="absolute inset-0 flex items-center pl-3 text-xs font-medium text-charcoal">
                                  {formatSalary(trend.salary)}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 w-16 justify-end">
                                {getTrendIcon(trend.growth)}
                                <span className={`text-xs ${trend.growth > 0 ? 'text-emerald-600' : 'text-coral'}`}>
                                  {trend.growth > 0 ? '+' : ''}{trend.growth}%
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>

                    {/* Prediction Chart */}
                    <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                      <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gold" />{t('salaryAnalyzer.prediction', '未来薪资预测')}
                      </h3>
                      <div className="flex items-end gap-2 h-48">
                        {[
                          { label: t('salaryAnalyzer.current', '当前'), value: result.salaryRange.avg, color: 'bg-gold' },
                          { label: t('salaryAnalyzer.nextYear', '1年'), value: result.growthPrediction.nextYear, color: 'bg-emerald-400' },
                          { label: t('salaryAnalyzer.threeYears', '3年'), value: result.growthPrediction.threeYears, color: 'bg-emerald-500' },
                          { label: t('salaryAnalyzer.fiveYears', '5年'), value: result.growthPrediction.fiveYears, color: 'bg-emerald-600' },
                        ].map((item, i) => {
                          const maxVal = result.growthPrediction.fiveYears * 1.1;
                          const height = maxVal > 0 ? (item.value / maxVal) * 100 : 20;
                          return (
                            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                              <span className="text-xs font-medium text-charcoal">{formatSalary(item.value)}</span>
                              <motion.div
                                className={`w-full ${item.color} rounded-t-xl`}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                              />
                              <span className="text-xs text-warm-gray">{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
