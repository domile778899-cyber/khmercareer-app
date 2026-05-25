import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowLeft, Upload, FileText, UserCheck, Loader2,
  Copy, CheckCircle, AlertCircle, Star, Target,
  Zap, Shield, ChevronRight, RotateCcw, Download, Lightbulb,
  Award, BarChart3, X, CheckCircle2
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
interface ResumeEntry {
  id: string;
  name: string;
  content: string;
  score: number;
  category: 'high' | 'medium' | 'low';
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  educationMatch: string;
  languageMatch: string;
}

interface JobRequirement {
  title: string;
  requiredSkills: string;
  experienceLevel: string;
  educationLevel: string;
  languages: string[];
  location: string;
  salaryMin: string;
  salaryMax: string;
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const EXPERIENCE_OPTIONS = ['不限', '应届生', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'];
const EDUCATION_OPTIONS = ['不限', '高中', '大专', '本科', '硕士', '博士'];
const LANGUAGE_OPTIONS = ['中文', '英语', '高棉语'];
const LOCATIONS = ['不限', '金边', '暹粒', '西港', '马德望', '贡布', '实居'];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function EmployerAIScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [requirement, setRequirement] = useState<JobRequirement>({
    title: '',
    requiredSkills: '',
    experienceLevel: '不限',
    educationLevel: '不限',
    languages: [],
    location: '不限',
    salaryMin: '',
    salaryMax: '',
  });

  const [resumeText, setResumeText] = useState('');
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [dragActive, setDragActive] = useState(false);

  const updateReq = useCallback(<K extends keyof JobRequirement>(key: K, value: JobRequirement[K]) => {
    setRequirement(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleLanguage = (lang: string) => {
    setRequirement(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await readFiles(files);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await readFiles(e.target.files);
    }
  };

  const readFiles = async (files: FileList) => {
    setError(null);
    const newResumes: ResumeEntry[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'text/plain') {
        try {
          const text = await file.text();
          newResumes.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            content: text,
            score: 0, category: 'low', matchReason: '',
            matchedSkills: [], missingSkills: [],
            experienceMatch: '', educationMatch: '', languageMatch: '',
          });
        } catch (err) {
          logger.error('Read file failed', { error: err, component: 'EmployerAIScreen' });
        }
      }
    }
    if (newResumes.length === 0) {
      setError(t('employerAI.uploadTextOnly', '请上传.txt格式的简历文件'));
      return;
    }
    // Auto-fill resume text for first file if textarea empty
    if (!resumeText && newResumes.length === 1) {
      setResumeText(newResumes[0].content);
    }
  };

  const parseResume = async () => {
    if (!resumeText.trim()) {
      setError(t('employerAI.enterResume', '请粘贴或上传简历内容'));
      return;
    }
    if (!requirement.title || !requirement.requiredSkills) {
      setError(t('employerAI.fillJobReq', '请填写职位名称和技能要求'));
      return;
    }

    setLoading(true);
    setError(null);

    const prompt = `请根据以下职位要求和候选人简历，评估匹配度并给出详细分析。

【职位要求】
职位名称：${requirement.title}
技能要求：${requirement.requiredSkills}
经验要求：${requirement.experienceLevel}
学历要求：${requirement.educationLevel}
语言要求：${requirement.languages.join('、') || '不限'}
工作地点：${requirement.location}
薪资范围：$${requirement.salaryMin || '面议'} - $${requirement.salaryMax || '面议'}

【候选人简历】
${resumeText}

请按以下格式输出（严格使用标记分隔）：

|SCORE|
[0-100的匹配度分数]

|CATEGORY|
[high/medium/low]

|REASON|
[匹配/不匹配的详细理由，200字以内]

|MATCHED_SKILLS|
- [匹配的技能1]
- [匹配的技能2]

|MISSING_SKILLS|
- [缺少的技能1]
- [缺少的技能2]

|EXPERIENCE|
[经验匹配分析]

|EDUCATION|
[学历匹配分析]

|LANGUAGE|
[语言匹配分析]`;

    try {
      const result: AIResponse = await callAI([
        {
          role: 'system',
          content: '你是一位专业的HR简历筛选专家，擅长评估候选人与职位的匹配度。请客观、公正地分析。',
        },
        { role: 'user', content: prompt },
      ], { temperature: 0.5, max_tokens: 1500 });

      if (result.success) {
        const parsed = parseScreenResult(result.content);
        setResumes([{
          id: Math.random().toString(36).substring(2, 9),
          ...parsed,
          name: parsed.name || '候选人',
          content: resumeText,
        }]);
        setSelectedResume(null);
      } else {
        // Fallback to local scoring
        const localScore = calculateLocalScore();
        setResumes([{
          id: Math.random().toString(36).substring(2, 9),
          name: '候选人',
          content: resumeText,
          score: localScore,
          category: localScore >= 70 ? 'high' : localScore >= 40 ? 'medium' : 'low',
          matchReason: t('employerAI.localScoreFallback', '基于关键词匹配的初步评估'),
          matchedSkills: [],
          missingSkills: [],
          experienceMatch: '',
          educationMatch: '',
          languageMatch: '',
        }]);
      }
    } catch (err) {
      logger.error('Parse resume failed', { error: err, component: 'EmployerAIScreen' });
      const localScore = calculateLocalScore();
      setResumes([{
        id: Math.random().toString(36).substring(2, 9),
        name: '候选人',
        content: resumeText,
        score: localScore,
        category: localScore >= 70 ? 'high' : localScore >= 40 ? 'medium' : 'low',
        matchReason: t('employerAI.localScoreFallback', '基于关键词匹配的初步评估'),
        matchedSkills: [],
        missingSkills: [],
        experienceMatch: '',
        educationMatch: '',
        languageMatch: '',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const parseScreenResult = (content: string) => {
    const score = parseInt(content.match(/\|SCORE\|\s*(\d+)/)?.[1] || '50');
    const category = (content.match(/\|CATEGORY\|\s*(high|medium|low)/)?.[1] || 'medium') as 'high' | 'medium' | 'low';
    const matchReason = content.match(/\|REASON\|([\s\S]*?)(?=\|MATCHED_SKILLS\||$)/)?.[1]?.trim() || '';
    const matchedSkills = (content.match(/\|MATCHED_SKILLS\|([\s\S]*?)(?=\|MISSING_SKILLS\||$)/)?.[1] || '')
      .split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().substring(1).trim());
    const missingSkills = (content.match(/\|MISSING_SKILLS\|([\s\S]*?)(?=\|EXPERIENCE\||$)/)?.[1] || '')
      .split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().substring(1).trim());
    const experienceMatch = content.match(/\|EXPERIENCE\|([\s\S]*?)(?=\|EDUCATION\||$)/)?.[1]?.trim() || '';
    const educationMatch = content.match(/\|EDUCATION\|([\s\S]*?)(?=\|LANGUAGE\||$)/)?.[1]?.trim() || '';
    const languageMatch = content.match(/\|LANGUAGE\|([\s\S]*)/)?.[1]?.trim() || '';

    const nameMatch = resumeText.match(/^姓名[：:]\s*(.+)/m)?.[1] ||
                      resumeText.match(/^Name[：:]\s*(.+)/m)?.[1] ||
                      content.match(/^(.+?)(?:\||\n)/m)?.[1]?.trim() || '候选人';

    return { name: nameMatch, score, category, matchReason, matchedSkills, missingSkills, experienceMatch, educationMatch, languageMatch };
  };

  const calculateLocalScore = (): number => {
    let score = 30;
    const reqSkills = requirement.requiredSkills.split(/[,，、\s]+/).filter(Boolean);
    const lowerResume = resumeText.toLowerCase();
    let matched = 0;
    reqSkills.forEach(skill => {
      if (lowerResume.includes(skill.toLowerCase())) matched++;
    });
    if (reqSkills.length > 0) score += Math.round((matched / reqSkills.length) * 50);
    else score += 25;
    if (lowerResume.includes(requirement.title.toLowerCase())) score += 10;
    if (requirement.languages.some(l => lowerResume.includes(l.toLowerCase()))) score += 10;
    return Math.min(100, Math.max(0, score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald';
    if (score >= 40) return 'text-yellow-600';
    return 'text-coral';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-emerald';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-coral';
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'high': return <Badge className="bg-emerald/10 text-emerald border-emerald/20">{t('employerAI.highMatch', '高匹配')}</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">{t('employerAI.mediumMatch', '中匹配')}</Badge>;
      case 'low': return <Badge className="bg-coral/10 text-coral border-coral/20">{t('employerAI.lowMatch', '低匹配')}</Badge>;
    }
  };

  const filteredResumes = resumes.filter(r => activeFilter === 'all' || r.category === activeFilter);

  const handleReset = () => {
    setResumeText('');
    setResumes([]);
    setSelectedResume(null);
    setError(null);
    setActiveFilter('all');
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ═══════ Hero ═══════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-64 h-64 bg-emerald rounded-full blur-3xl" />
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
              <Badge className="bg-emerald/20 text-emerald border-emerald/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
              <h1 className="text-h1 text-white">
                {t('employerAI.screenTitle', 'AI简历筛选')}
              </h1>
            </div>
            <p className="text-body text-warm-gray max-w-xl">
              {t('employerAI.screenSubtitle', '上传简历，AI自动评估与职位要求的匹配度')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ═══════ Left Panel: Job Req + Resume Input ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Job Requirements */}
            <Card className="p-6 bg-white border-0 shadow-card rounded-2xl">
              <h2 className="text-h3 mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald" />
                {t('employerAI.jobRequirements', '职位要求')}
              </h2>

              {error && (
                <div className="flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('employerAI.jobTitle', '职位名称')}
                    <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={requirement.title}
                    onChange={(e) => updateReq('title', e.target.value)}
                    placeholder={t('employerAI.jobTitlePlaceholder', '如：生产主管')}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('employerAI.requiredSkills', '技能要求')}
                    <span className="text-coral">*</span>
                  </label>
                  <textarea
                    value={requirement.requiredSkills}
                    onChange={(e) => updateReq('requiredSkills', e.target.value)}
                    placeholder={t('employerAI.skillsPlaceholder', '如：生产管理、团队领导、质量控制')}
                    rows={2}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('employerAI.experienceLevel', '经验要求')}</label>
                    <select
                      value={requirement.experienceLevel}
                      onChange={(e) => updateReq('experienceLevel', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 transition-all appearance-none"
                    >
                      {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('employerAI.educationLevel', '学历要求')}</label>
                    <select
                      value={requirement.educationLevel}
                      onChange={(e) => updateReq('educationLevel', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 transition-all appearance-none"
                    >
                      {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('employerAI.languageRequirements', '语言要求')}</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          requirement.languages.includes(lang)
                            ? 'bg-emerald/10 border-emerald text-emerald'
                            : 'bg-cream border-sand text-warm-gray hover:border-emerald/30'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('employerAI.location', '工作地点')}</label>
                    <select
                      value={requirement.location}
                      onChange={(e) => updateReq('location', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 transition-all appearance-none"
                    >
                      {LOCATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('employerAI.salaryRange', '薪资范围')} ($)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={requirement.salaryMin}
                        onChange={(e) => updateReq('salaryMin', e.target.value)}
                        placeholder="Min"
                        className="w-full bg-cream border border-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                      />
                      <span className="text-warm-gray">-</span>
                      <input
                        type="number"
                        value={requirement.salaryMax}
                        onChange={(e) => updateReq('salaryMax', e.target.value)}
                        placeholder="Max"
                        className="w-full bg-cream border border-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resume Input */}
            <Card className="p-6 bg-white border-0 shadow-card rounded-2xl">
              <h2 className="text-h3 mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald" />
                {t('employerAI.resumeInput', '简历内容')}
              </h2>

              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-all ${
                  dragActive ? 'border-emerald bg-emerald/5' : 'border-sand bg-cream'
                }`}
              >
                <Upload className="w-8 h-8 text-warm-gray mx-auto mb-2" />
                <p className="text-sm text-warm-gray mb-2">
                  {t('employerAI.dragDrop', '拖拽简历到此处，或')}
                  <label className="text-emerald cursor-pointer hover:underline mx-1">
                    {t('employerAI.clickUpload', '点击上传')}
                    <input
                      type="file"
                      accept=".txt"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-warm-gray">{t('employerAI.supportFormat', '支持 .txt 格式')}</p>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={t('employerAI.pasteResume', '粘贴简历内容到这里...')}
                rows={10}
                className="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald transition-all resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={parseResume}
                  disabled={loading}
                  className="flex-1 bg-emerald hover:bg-emerald/80 text-white rounded-xl py-2.5 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('employerAI.analyzing', 'AI分析中...')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('employerAI.analyzeResume', '分析匹配度')}
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} variant="outline" className="rounded-xl border-sand hover:bg-cream">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* ═══════ Right Panel: Results ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {resumes.length === 0 && !loading && (
              <Card className="bg-white border-0 shadow-card rounded-2xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <UserCheck className="w-16 h-16 text-sand mx-auto mb-4" />
                  <p className="text-warm-gray text-sm mb-2">
                    {t('employerAI.noResumes', '暂无分析结果')}
                  </p>
                  <p className="text-warm-gray text-xs">
                    {t('employerAI.uploadToStart', '上传简历并点击分析开始AI筛选')}
                  </p>
                </div>
              </Card>
            )}

            {loading && resumes.length === 0 && (
              <Card className="bg-white border-0 shadow-card rounded-2xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-sand rounded-full" />
                    <div className="absolute inset-0 border-4 border-emerald border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-sm text-warm-gray">{t('employerAI.aiAnalyzing', 'AI正在分析简历匹配度...')}</p>
                </div>
              </Card>
            )}

            {resumes.length > 0 && (
              <div className="space-y-4">
                {/* Filter Tabs */}
                <div className="flex gap-2">
                  {[
                    { key: 'all' as const, label: t('employerAI.allResumes', '全部'), count: resumes.length },
                    { key: 'high' as const, label: t('employerAI.highMatch', '高匹配'), count: resumes.filter(r => r.category === 'high').length },
                    { key: 'medium' as const, label: t('employerAI.mediumMatch', '中匹配'), count: resumes.filter(r => r.category === 'medium').length },
                    { key: 'low' as const, label: t('employerAI.lowMatch', '低匹配'), count: resumes.filter(r => r.category === 'low').length },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === tab.key
                          ? 'bg-emerald text-white'
                          : 'bg-cream text-warm-gray hover:bg-emerald/10'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Resume Cards */}
                <AnimatePresence mode="popLayout">
                  {filteredResumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card
                        className={`bg-white border-0 shadow-card rounded-2xl p-5 cursor-pointer hover:shadow-card-hover transition-all ${
                          selectedResume === resume.id ? 'ring-2 ring-emerald/40' : ''
                        }`}
                        onClick={() => setSelectedResume(
                          selectedResume === resume.id ? null : resume.id
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-charcoal flex items-center gap-2">
                              <FileText className="w-4 h-4 text-warm-gray" />
                              {resume.name}
                            </h3>
                          </div>
                          {getCategoryBadge(resume.category)}
                        </div>

                        {/* Score */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-warm-gray">{t('employerAI.matchScore', '匹配度')}</span>
                            <span className={`text-lg font-bold ${getScoreColor(resume.score)}`}>
                              {resume.score}%
                            </span>
                          </div>
                          <div className="w-full bg-sand rounded-full h-2.5">
                            <div
                              className={`${getScoreBg(resume.score)} h-2.5 rounded-full transition-all duration-700`}
                              style={{ width: `${resume.score}%` }}
                            />
                          </div>
                        </div>

                        {/* Match Reason */}
                        <p className="text-sm text-charcoal bg-cream rounded-lg p-3 mb-3">
                          {resume.matchReason}
                        </p>

                        {/* Matched Skills */}
                        {resume.matchedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {resume.matchedSkills.map((skill, i) => (
                              <Badge key={i} className="bg-emerald/10 text-emerald border-emerald/20 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Expand Detail */}
                        <AnimatePresence>
                          {selectedResume === resume.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-sand pt-4 mt-3 space-y-3">
                                {resume.missingSkills.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-coral mb-1.5 flex items-center gap-1">
                                      <X className="w-3.5 h-3.5" />
                                      {t('employerAI.missingSkills', '缺少技能')}
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {resume.missingSkills.map((skill, i) => (
                                        <Badge key={i} className="bg-coral/10 text-coral border-coral/20 text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {resume.experienceMatch && (
                                  <div className="bg-cream rounded-lg p-3">
                                    <h4 className="text-sm font-medium mb-1">{t('employerAI.experienceAnalysis', '经验分析')}</h4>
                                    <p className="text-sm text-warm-gray">{resume.experienceMatch}</p>
                                  </div>
                                )}
                                {resume.educationMatch && (
                                  <div className="bg-cream rounded-lg p-3">
                                    <h4 className="text-sm font-medium mb-1">{t('employerAI.educationAnalysis', '学历分析')}</h4>
                                    <p className="text-sm text-warm-gray">{resume.educationMatch}</p>
                                  </div>
                                )}
                                {resume.languageMatch && (
                                  <div className="bg-cream rounded-lg p-3">
                                    <h4 className="text-sm font-medium mb-1">{t('employerAI.languageAnalysis', '语言分析')}</h4>
                                    <p className="text-sm text-warm-gray">{resume.languageMatch}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center text-xs text-warm-gray mt-2">
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            selectedResume === resume.id ? 'rotate-90' : ''
                          }`} />
                          {selectedResume === resume.id ? t('common.collapse', '收起') : t('common.viewDetail', '查看详情')}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredResumes.length === 0 && (
                  <div className="text-center py-12 text-warm-gray text-sm">
                    {t('employerAI.noFilteredResumes', '该分类下暂无简历')}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
