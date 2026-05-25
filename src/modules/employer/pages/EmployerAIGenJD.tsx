import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, FileText, ArrowLeft, Loader2, Copy, CheckCircle,
  Globe, Building2, Briefcase, GraduationCap, Wrench, Star,
  Send, RotateCcw, Download, Languages,
  AlertCircle, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { callAI } from '@/utils/aiApi';
import type { AIResponse } from '@/utils/aiApi';
import { logger } from '@/shared/logger'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface JDFormData {
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  skills: string;
  languages: string[];
  salaryMin: string;
  salaryMax: string;
  location: string;
  department: string;
  reportsTo: string;
  companyName: string;
  workType: string;
  benefits: string;
}

interface GeneratedJD {
  chinese: string;
  english: string;
  khmer: string;
  highlights: string[];
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const INDUSTRIES = [
  '制造业', '服装/纺织', '酒店/旅游', '餐饮', 'IT/科技',
  '建筑', '贸易/物流', '金融', '教育', '医疗', '农业', '其他',
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'employerAI.entryLevel' },
  { value: 'mid', label: 'employerAI.midLevel' },
  { value: 'senior', label: 'employerAI.seniorLevel' },
  { value: 'expert', label: 'employerAI.expertLevel' },
];

const LANGUAGE_OPTIONS = ['中文', '英语', '高棉语'];

const WORK_TYPES = [
  { value: 'fulltime', label: 'employerAI.fullTime' },
  { value: 'parttime', label: 'employerAI.partTime' },
  { value: 'contract', label: 'employerAI.contract' },
];

const LOCATIONS = ['金边', '暹粒', '西港', '马德望', '贡布', '实居', '磅湛', '其他'];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function EmployerAIGenJD() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<JDFormData>({
    jobTitle: '',
    industry: '',
    experienceLevel: 'mid',
    skills: '',
    languages: ['中文'],
    salaryMin: '',
    salaryMax: '',
    location: '金边',
    department: '',
    reportsTo: '',
    companyName: '',
    workType: 'fulltime',
    benefits: '',
  });

  const [generated, setGenerated] = useState<GeneratedJD | null>(null);
  const [activeTab, setActiveTab] = useState<'chinese' | 'english' | 'khmer'>('chinese');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const updateForm = useCallback(<K extends keyof JDFormData>(key: K, value: JDFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleLanguage = (lang: string) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const filledFields = [
    form.jobTitle, form.industry, form.experienceLevel, form.skills,
    form.salaryMin, form.location, form.companyName,
  ].filter(Boolean).length;

  const formProgress = Math.round((filledFields / 7) * 100);

  const handleGenerate = async () => {
    if (!form.jobTitle || !form.industry || !form.skills) {
      setError(t('employerAI.fillRequired', '请填写职位名称、行业和技能要求'));
      return;
    }

    setLoading(true);
    setError(null);
    setGenerated(null);
    setProgress(20);

    const prompt = `请根据以下信息生成一份专业的职位描述（JD），需要同时输出中文、英文和高棉语三个版本。

职位信息：
- 职位名称：${form.jobTitle}
- 所属行业：${form.industry}
- 公司名称：${form.companyName || '待定'}
- 工作地点：${form.location}
- 经验要求：${form.experienceLevel}
- 部门：${form.department || '待定'}
- 汇报对象：${form.reportsTo || '待定'}
- 工作类型：${form.workType}
- 技能要求：${form.skills}
- 语言能力：${form.languages.join('、')}
- 薪资范围：$${form.salaryMin || '面议'} - $${form.salaryMax || '面议'}
- 福利待遇：${form.benefits || '按公司标准'}

请按以下格式输出（严格使用 |LANG| 标记分隔）：

|CHINESE|
[中文职位描述]

|ENGLISH|
[English Job Description]

|KHMER|
[ការបរិយាយការងារជាភាសាខ្មែរ]

|HIGHLIGHTS|
- 亮点1
- 亮点2
- 亮点3

要求：
1. 每个版本都要完整、专业、有吸引力
2. 包含：职位概述、岗位职责、任职要求、薪资福利、公司介绍
3. 高棉语使用正式书面语
4. 根据柬埔寨当地市场调整内容`;

    try {
      setProgress(50);
      const result: AIResponse = await callAI([
        {
          role: 'system',
          content: '你是一位专业的招聘顾问，擅长为在柬埔寨运营的企业撰写多语言职位描述。你熟悉柬埔寨劳动市场和文化背景。',
        },
        { role: 'user', content: prompt },
      ], { temperature: 0.7, max_tokens: 3000 });

      setProgress(80);

      if (result.success) {
        const parsed = parseJDResponse(result.content);
        setGenerated(parsed);
      } else {
        setError(result.error || t('employerAI.genError', '生成失败，请重试'));
      }
    } catch (err) {
      logger.error('Generate JD failed', { error: err, component: 'EmployerAIGenJD' });
      setError(t('employerAI.genError', '生成失败，请重试'));
    } finally {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }
  };

  const parseJDResponse = (content: string): GeneratedJD => {
    const chinese = content.match(/\|CHINESE\|([\s\S]*?)(?=\|ENGLISH\||\|KHMER\||\|HIGHLIGHTS\||$)/i)?.[1]?.trim() || '';
    const english = content.match(/\|ENGLISH\|([\s\S]*?)(?=\|KHMER\||\|HIGHLIGHTS\||$)/i)?.[1]?.trim() || '';
    const khmer = content.match(/\|KHMER\|([\s\S]*?)(?=\|HIGHLIGHTS\||$)/i)?.[1]?.trim() || '';
    const highlightsMatch = content.match(/\|HIGHLIGHTS\|([\s\S]*)/i)?.[1]?.trim() || '';
    const highlights = highlightsMatch
      ? highlightsMatch.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().substring(1).trim())
      : [];

    return { chinese, english, khmer, highlights };
  };

  const handleCopy = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    }
  };

  const getTabContent = () => {
    if (!generated) return '';
    return generated[activeTab] || '';
  };

  const handleReset = () => {
    setForm({
      jobTitle: '', industry: '', experienceLevel: 'mid',
      skills: '', languages: ['中文'], salaryMin: '', salaryMax: '',
      location: '金边', department: '', reportsTo: '', companyName: '',
      workType: 'fulltime', benefits: '',
    });
    setGenerated(null);
    setError(null);
  };

  const tabConfig = [
    { key: 'chinese' as const, label: '中文', icon: <Languages className="w-4 h-4" /> },
    { key: 'english' as const, label: 'English', icon: <Globe className="w-4 h-4" /> },
    { key: 'khmer' as const, label: 'ខ្មែរ', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ═══════ Hero ═══════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              onClick={() => navigate('/employer-ai')}
              className="flex items-center gap-1 text-warm-gray hover:text-gold transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back', '返回')}
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className="bg-gold/20 text-gold border-gold/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
              <h1 className="text-h1 text-white">
                {t('employerAI.genJDPageTitle', 'AI职位描述生成')}
              </h1>
            </div>
            <p className="text-body text-warm-gray max-w-xl">
              {t('employerAI.genJDPageSubtitle', '填写职位信息，AI自动生成中文、英文、高棉语三语职位描述')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-warm-gray">{t('employerAI.formProgress', '表单完成度')}</span>
            <span className="text-sm font-medium text-gold">{formProgress}%</span>
          </div>
          <div className="w-full bg-sand rounded-full h-2">
            <div
              className="bg-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${formProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ═══════ Form ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-card rounded-2xl">
              <h2 className="text-h3 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                {t('employerAI.jobInfo', '职位信息')}
              </h2>

              {error && (
                <div className="flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                    {t('employerAI.jobTitle', '职位名称')}
                    <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => updateForm('jobTitle', e.target.value)}
                    placeholder={t('employerAI.jobTitlePlaceholder', '如：生产主管')}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      <Building2 className="w-3.5 h-3.5 inline mr-1" />
                      {t('employerAI.industry', '所属行业')}
                      <span className="text-coral">*</span>
                    </label>
                    <select
                      value={form.industry}
                      onChange={(e) => updateForm('industry', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all appearance-none"
                    >
                      <option value="">{t('common.select', '请选择')}</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                      {t('employerAI.experienceLevel', '经验要求')}
                    </label>
                    <select
                      value={form.experienceLevel}
                      onChange={(e) => updateForm('experienceLevel', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all appearance-none"
                    >
                      {EXPERIENCE_LEVELS.map(exp => (
                        <option key={exp.value} value={exp.value}>{t(exp.label)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Building2 className="w-3.5 h-3.5 inline mr-1" />
                    {t('employerAI.companyName', '公司名称')}
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => updateForm('companyName', e.target.value)}
                    placeholder={t('employerAI.companyNamePlaceholder', '您的公司名称')}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      <Globe className="w-3.5 h-3.5 inline mr-1" />
                      {t('employerAI.location', '工作地点')}
                    </label>
                    <select
                      value={form.location}
                      onChange={(e) => updateForm('location', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all appearance-none"
                    >
                      {LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.workType', '工作类型')}
                    </label>
                    <select
                      value={form.workType}
                      onChange={(e) => updateForm('workType', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all appearance-none"
                    >
                      {WORK_TYPES.map(wt => (
                        <option key={wt.value} value={wt.value}>{t(wt.label)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Department & Reports To */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.department', '所属部门')}
                    </label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => updateForm('department', e.target.value)}
                      placeholder={t('employerAI.departmentPlaceholder', '如：生产部')}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.reportsTo', '汇报对象')}
                    </label>
                    <input
                      type="text"
                      value={form.reportsTo}
                      onChange={(e) => updateForm('reportsTo', e.target.value)}
                      placeholder={t('employerAI.reportsToPlaceholder', '如：生产经理')}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Wrench className="w-3.5 h-3.5 inline mr-1" />
                    {t('employerAI.requiredSkills', '技能要求')}
                    <span className="text-coral">*</span>
                  </label>
                  <textarea
                    value={form.skills}
                    onChange={(e) => updateForm('skills', e.target.value)}
                    placeholder={t('employerAI.skillsPlaceholder', '如：生产管理、团队领导、质量控制、排产计划，用逗号分隔')}
                    rows={3}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Languages className="w-3.5 h-3.5 inline mr-1" />
                    {t('employerAI.languageRequirements', '语言要求')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          form.languages.includes(lang)
                            ? 'bg-gold/10 border-gold text-gold'
                            : 'bg-cream border-sand text-warm-gray hover:border-gold/30'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Salary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.salaryMin', '最低薪资')} ($)
                    </label>
                    <input
                      type="number"
                      value={form.salaryMin}
                      onChange={(e) => updateForm('salaryMin', e.target.value)}
                      placeholder="500"
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.salaryMax', '最高薪资')} ($)
                    </label>
                    <input
                      type="number"
                      value={form.salaryMax}
                      onChange={(e) => updateForm('salaryMax', e.target.value)}
                      placeholder="1500"
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Star className="w-3.5 h-3.5 inline mr-1" />
                    {t('employerAI.benefits', '福利待遇')}
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={(e) => updateForm('benefits', e.target.value)}
                    placeholder={t('employerAI.benefitsPlaceholder', '如：免费食宿、交通补贴、年终奖金、健康保险')}
                    rows={2}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-gold hover:bg-gold-dark text-charcoal rounded-xl py-2.5 font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('employerAI.generating', '生成中')} {progress > 0 && `${progress}%`}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t('employerAI.generateJD', '生成职位描述')}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="rounded-xl border-sand hover:bg-cream"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ═══════ Preview ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white border-0 shadow-card rounded-2xl overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-sand flex items-center justify-between">
                <h2 className="text-h4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  {t('employerAI.preview', '预览')}
                </h2>
                {generated && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(getTabContent(), activeTab)}
                      className="rounded-lg border-sand hover:bg-cream text-xs"
                    >
                      {copiedTab === activeTab ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald mr-1" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1" />
                      )}
                      {copiedTab === activeTab ? t('common.copied', '已复制') : t('common.copy', '复制')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Tabs */}
              {generated && (
                <div className="flex border-b border-sand">
                  {tabConfig.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                        activeTab === tab.key
                          ? 'border-gold text-gold bg-gold/5'
                          : 'border-transparent text-warm-gray hover:text-charcoal'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {!generated && !loading && (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <FileText className="w-16 h-16 text-sand mx-auto mb-4" />
                      <p className="text-warm-gray text-sm">
                        {t('employerAI.emptyPreview', '填写左侧表单并点击生成，AI将为您创建三语职位描述')}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-3 text-xs text-warm-gray">
                        <Lightbulb className="w-3 h-3" />
                        {t('employerAI.tip', '越详细的信息会产生越专业的JD')}
                      </div>
                    </div>
                  </div>
                )}

                {loading && !generated && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-sand rounded-full" />
                        <div
                          className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"
                        />
                      </div>
                      <p className="text-sm text-warm-gray">
                        {t('employerAI.aiGenerating', 'AI正在生成职位描述...')}
                      </p>
                      {progress > 0 && (
                        <div className="w-48 mx-auto mt-3">
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {generated && (
                  <div className="space-y-4">
                    {generated.highlights.length > 0 && (
                      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gold mb-2 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {t('employerAI.jdHighlights', '职位亮点')}
                        </h4>
                        <ul className="space-y-1">
                          {generated.highlights.map((h, i) => (
                            <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald flex-shrink-0 mt-0.5" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none">
                      <div className="bg-cream rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
                        {getTabContent() || t('employerAI.noContent', '暂无内容')}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(getTabContent(), 'action-' + activeTab)}
                        className="rounded-lg border-sand hover:bg-cream"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        {t('employerAI.copyJD', '复制')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-sand hover:bg-cream"
                        onClick={() => {
                          const blob = new Blob([getTabContent()], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${form.jobTitle || 'job'}_JD_${activeTab}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        {t('employerAI.download', '下载')}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-lg bg-gold hover:bg-gold-dark text-charcoal"
                        onClick={() => alert(t('employerAI.publishComingSoon', '发布功能即将上线'))}
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        {t('employerAI.publish', '发布职位')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
