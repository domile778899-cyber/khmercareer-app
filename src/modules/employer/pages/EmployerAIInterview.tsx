import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowLeft, MessageSquare, Loader2, Copy,
  CheckCircle, AlertCircle, Star, Target, Zap, Lightbulb,
  RotateCcw, Download, ChevronRight, CheckCircle2, Clock,
  Award, BarChart3, Users, FileText, BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { callAI } from '@/utils/aiApi';
import type { AIResponse } from '@/utils/aiApi';
import { logger } from '@/shared/logger'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface InterviewConfig {
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  interviewType: string;
  questionCount: number;
  languages: string[];
  focusAreas: string[];
}

interface InterviewQuestion {
  id: string;
  question: string;
  type: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAnswer: string;
  scoringCriteria: string;
  followUpQuestions: string[];
}

interface GeneratedInterview {
  questions: InterviewQuestion[];
  overview: string;
  tips: string[];
  estimatedTime: string;
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

const INTERVIEW_TYPES = [
  { value: 'technical', label: 'employerAI.technical', icon: <BrainCircuit className="w-4 h-4" />, desc: 'employerAI.technicalDesc' },
  { value: 'behavioral', label: 'employerAI.behavioral', icon: <Users className="w-4 h-4" />, desc: 'employerAI.behavioralDesc' },
  { value: 'cultural', label: 'employerAI.cultural', icon: <Award className="w-4 h-4" />, desc: 'employerAI.culturalDesc' },
  { value: 'mixed', label: 'employerAI.mixed', icon: <Target className="w-4 h-4" />, desc: 'employerAI.mixedDesc' },
];

const FOCUS_AREAS = [
  { value: 'leadership', label: 'employerAI.leadership' },
  { value: 'communication', label: 'employerAI.communication' },
  { value: 'problem_solving', label: 'employerAI.problemSolving' },
  { value: 'teamwork', label: 'employerAI.teamwork' },
  { value: 'technical_skills', label: 'employerAI.technicalSkills' },
  { value: 'adaptability', label: 'employerAI.adaptability' },
  { value: 'cultural_fit', label: 'employerAI.culturalFit' },
  { value: 'language', label: 'employerAI.languageAbility' },
];

const LANGUAGE_OPTIONS = ['中文', '英语', '高棉语'];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function EmployerAIInterview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [config, setConfig] = useState<InterviewConfig>({
    jobTitle: '',
    industry: '',
    experienceLevel: 'mid',
    interviewType: 'mixed',
    questionCount: 8,
    languages: ['中文'],
    focusAreas: ['technical_skills', 'communication'],
  });

  const [generated, setGenerated] = useState<GeneratedInterview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const updateConfig = useCallback(<K extends keyof InterviewConfig>(key: K, value: InterviewConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleLanguage = (lang: string) => {
    setConfig(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleFocusArea = (area: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  const handleGenerate = async () => {
    if (!config.jobTitle || !config.industry) {
      setError(t('employerAI.fillRequired', '请填写职位名称和行业'));
      return;
    }

    setLoading(true);
    setError(null);
    setGenerated(null);

    const prompt = `请为以下职位生成专业的面试问题列表。

【职位信息】
职位名称：${config.jobTitle}
所属行业：${config.industry}
经验要求：${config.experienceLevel}
面试类型：${config.interviewType}
面试语言：${config.languages.join('、')}
重点关注：${config.focusAreas.map(a => {
    const found = FOCUS_AREAS.find(f => f.value === a);
    return found ? t(found.label) : a;
  }).join('、')}
问题数量：${config.questionCount}道

请按以下JSON格式输出：

{
  "overview": "面试概述和建议",
  "estimatedTime": "预计面试时长",
  "tips": ["面试官提示1", "面试官提示2"],
  "questions": [
    {
      "id": "1",
      "question": "面试问题",
      "type": "问题类型",
      "category": "分类",
      "difficulty": "easy/medium/hard",
      "suggestedAnswer": "建议的参考答案要点",
      "scoringCriteria": "评分标准",
      "followUpQuestions": ["追问问题1"]
    }
  ]
}

要求：
1. 问题设计要针对柬埔寨当地求职者
2. 考虑中资企业实际场景
3. 问题要分层，有简单、中等、困难
4. 包含追问问题
5. 提供具体评分标准
6. 主要语言为${config.languages.join('和')}`;

    try {
      const result: AIResponse = await callAI([
        {
          role: 'system',
          content: '你是一位资深HR面试专家，擅长为在柬埔寨招聘的中国企业设计面试题库。你了解柬埔寨文化背景和求职者特点。',
        },
        { role: 'user', content: prompt },
      ], { temperature: 0.7, max_tokens: 4000 });

      if (result.success) {
        try {
          const jsonMatch = result.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setGenerated({
              questions: parsed.questions || [],
              overview: parsed.overview || '',
              tips: parsed.tips || [],
              estimatedTime: parsed.estimatedTime || '',
            });
          } else {
            throw new Error('No JSON found');
          }
        } catch (err) {
          logger.error('Parse interview JSON failed', { error: err, component: 'EmployerAIInterview' });
          setGenerated(generateFallbackQuestions());
        }
      } else {
        setGenerated(generateFallbackQuestions());
      }
    } catch (err) {
      logger.error('Generate interview questions failed', { error: err, component: 'EmployerAIInterview' });
      setGenerated(generateFallbackQuestions());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackQuestions = (): GeneratedInterview => {
    const typeLabels: Record<string, string> = {
      technical: t('employerAI.technical', '技术面试'),
      behavioral: t('employerAI.behavioral', '行为面试'),
      cultural: t('employerAI.cultural', '文化匹配'),
      mixed: t('employerAI.mixed', '综合面试'),
    };
    return {
      overview: t('employerAI.fallbackOverview', `为${config.jobTitle}职位生成的${typeLabels[config.interviewType]}问题列表。请根据实际情况调整问题。`),
      estimatedTime: `${config.questionCount * 3}-${config.questionCount * 5}分钟`,
      tips: [
        t('employerAI.tipListen', '认真倾听候选人的回答'),
        t('employerAI.tipFollowUp', '根据回答进行追问'),
        t('employerAI.tipNotes', '做好面试记录'),
        t('employerAI.tipConsistent', '对所有候选人使用相同标准'),
      ],
      questions: Array.from({ length: Math.min(config.questionCount, 10) }, (_, i) => ({
        id: String(i + 1),
        question: t('employerAI.fallbackQuestion', `问题 ${i + 1}：请描述您在${config.industry}领域的相关经验。`),
        type: config.interviewType === 'mixed'
          ? (i % 3 === 0 ? 'technical' : i % 3 === 1 ? 'behavioral' : 'cultural')
          : config.interviewType,
        category: 'general',
        difficulty: (i < 3 ? 'easy' : i < 6 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        suggestedAnswer: t('employerAI.fallbackAnswer', '候选人应展示与职位相关的技能和经验。'),
        scoringCriteria: t('employerAI.fallbackCriteria', '5分：优秀回答，展示丰富经验\n3分：一般回答，有一定相关经验\n1分：回答不充分，缺乏相关经验'),
        followUpQuestions: [t('employerAI.fallbackFollowUp', '能否举例说明？')],
      })),
    };
  };

  const getDifficultyBadge = (d: string) => {
    switch (d) {
      case 'easy': return <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-xs">{t('employerAI.easy', '简单')}</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">{t('employerAI.medium', '中等')}</Badge>;
      case 'hard': return <Badge className="bg-coral/10 text-coral border-coral/20 text-xs">{t('employerAI.hard', '困难')}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'technical': return <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">{t('employerAI.technical', '技术')}</Badge>;
      case 'behavioral': return <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">{t('employerAI.behavioral', '行为')}</Badge>;
      case 'cultural': return <Badge className="bg-pink-100 text-pink-700 border-pink-300 text-xs">{t('employerAI.cultural', '文化')}</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs">{t('employerAI.general', '通用')}</Badge>;
    }
  };

  const handleCopyQuestion = async (q: InterviewQuestion) => {
    const text = `${q.question}\n\n${t('employerAI.suggestedAnswer', '参考答案')}：\n${q.suggestedAnswer}\n\n${t('employerAI.scoringCriteria', '评分标准')}：\n${q.scoringCriteria}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuestion(q.id);
      setTimeout(() => setCopiedQuestion(null), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedQuestion(q.id);
      setTimeout(() => setCopiedQuestion(null), 2000);
    }
  };

  const handleExportAll = () => {
    if (!generated) return;
    let content = `# ${config.jobTitle} - ${t('employerAI.interviewQuestions', '面试题库')}\n\n`;
    content += `## ${t('employerAI.overview', '面试概述')}\n${generated.overview}\n\n`;
    content += `**${t('employerAI.estimatedTime', '预计时长')}**：${generated.estimatedTime}\n\n`;
    content += `## ${t('employerAI.interviewerTips', '面试官提示')}\n`;
    generated.tips.forEach((tip, i) => { content += `${i + 1}. ${tip}\n`; });
    content += `\n## ${t('employerAI.questions', '面试问题')}\n\n`;
    generated.questions.forEach((q, i) => {
      content += `### ${i + 1}. [${q.difficulty}] ${q.question}\n`;
      content += `- ${t('employerAI.type', '类型')}：${q.type}\n`;
      content += `- ${t('employerAI.suggestedAnswer', '参考答案')}：${q.suggestedAnswer}\n`;
      content += `- ${t('employerAI.scoringCriteria', '评分标准')}：${q.scoringCriteria}\n`;
      if (q.followUpQuestions.length > 0) {
        content += `- ${t('employerAI.followUpQuestions', '追问问题')}：${q.followUpQuestions.join('；')}\n`;
      }
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.jobTitle || 'interview'}_questions.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setConfig({
      jobTitle: '', industry: '', experienceLevel: 'mid',
      interviewType: 'mixed', questionCount: 8,
      languages: ['中文'], focusAreas: ['technical_skills', 'communication'],
    });
    setGenerated(null);
    setError(null);
    setExpandedQuestion(null);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ═══════ Hero ═══════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-64 h-64 bg-coral rounded-full blur-3xl" />
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
              <Badge className="bg-coral/20 text-coral border-coral/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
              <h1 className="text-h1 text-white">
                {t('employerAI.interviewTitle', 'AI面试问题生成')}
              </h1>
            </div>
            <p className="text-body text-warm-gray max-w-xl">
              {t('employerAI.interviewSubtitle', '根据职位需求智能生成专业面试题库和评分标准')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ═══════ Config Panel ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-card rounded-2xl">
              <h2 className="text-h3 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-coral" />
                {t('employerAI.interviewConfig', '面试配置')}
              </h2>

              {error && (
                <div className="flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('employerAI.jobTitle', '职位名称')}
                    <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={config.jobTitle}
                    onChange={(e) => updateConfig('jobTitle', e.target.value)}
                    placeholder={t('employerAI.jobTitlePlaceholder', '如：生产主管')}
                    className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t('employerAI.industry', '所属行业')}
                      <span className="text-coral">*</span>
                    </label>
                    <select
                      value={config.industry}
                      onChange={(e) => updateConfig('industry', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all appearance-none"
                    >
                      <option value="">{t('common.select', '请选择')}</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('employerAI.experienceLevel', '经验要求')}</label>
                    <select
                      value={config.experienceLevel}
                      onChange={(e) => updateConfig('experienceLevel', e.target.value)}
                      className="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all appearance-none"
                    >
                      {EXPERIENCE_LEVELS.map(exp => <option key={exp.value} value={exp.value}>{t(exp.label)}</option>)}
                    </select>
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('employerAI.interviewType', '面试类型')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {INTERVIEW_TYPES.map(it => (
                      <button
                        key={it.value}
                        onClick={() => updateConfig('interviewType', it.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                          config.interviewType === it.value
                            ? 'border-coral bg-coral/5 text-coral'
                            : 'border-sand bg-cream text-charcoal hover:border-coral/30'
                        }`}
                      >
                        {it.icon}
                        <div>
                          <div className="text-sm font-medium">{t(it.label)}</div>
                          <div className="text-xs text-warm-gray">{t(it.desc)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('employerAI.questionCount', '问题数量')}: {config.questionCount}
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    value={config.questionCount}
                    onChange={(e) => updateConfig('questionCount', parseInt(e.target.value))}
                    className="w-full accent-coral"
                  />
                  <div className="flex justify-between text-xs text-warm-gray">
                    <span>3</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('employerAI.interviewLanguage', '面试语言')}</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          config.languages.includes(lang)
                            ? 'bg-coral/10 border-coral text-coral'
                            : 'bg-cream border-sand text-warm-gray hover:border-coral/30'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('employerAI.focusAreas', '重点关注')}</label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_AREAS.map(area => (
                      <button
                        key={area.value}
                        onClick={() => toggleFocusArea(area.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          config.focusAreas.includes(area.value)
                            ? 'bg-coral/10 border-coral text-coral'
                            : 'bg-cream border-sand text-warm-gray hover:border-coral/30'
                        }`}
                      >
                        {t(area.label)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-coral hover:bg-coral-dark text-white rounded-xl py-2.5 font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('employerAI.generating', '生成中...')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t('employerAI.generateQuestions', '生成面试题')}
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="rounded-xl border-sand hover:bg-cream">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ═══════ Results Panel ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!generated && !loading && (
              <Card className="bg-white border-0 shadow-card rounded-2xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-sand mx-auto mb-4" />
                  <p className="text-warm-gray text-sm mb-2">
                    {t('employerAI.noQuestions', '暂无面试题')}
                  </p>
                  <p className="text-warm-gray text-xs">
                    {t('employerAI.configureToGenerate', '配置面试参数并点击生成')}
                  </p>
                </div>
              </Card>
            )}

            {loading && !generated && (
              <Card className="bg-white border-0 shadow-card rounded-2xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-sand rounded-full" />
                    <div className="absolute inset-0 border-4 border-coral border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-sm text-warm-gray">{t('employerAI.aiGenerating', 'AI正在生成面试题...')}</p>
                </div>
              </Card>
            )}

            {generated && (
              <div className="space-y-4">
                {/* Overview Card */}
                <Card className="bg-white border-0 shadow-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-h4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-coral" />
                      {t('employerAI.interviewOverview', '面试概述')}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportAll}
                        className="rounded-lg border-sand hover:bg-cream"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        {t('common.export', '导出')}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal mb-3">{generated.overview}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-warm-gray">
                    <span className="flex items-center gap-1 bg-cream rounded-lg px-2 py-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t('employerAI.estimatedTime', '预计时长')}：{generated.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1 bg-cream rounded-lg px-2 py-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {generated.questions.length} {t('employerAI.questions', '道题')}
                    </span>
                  </div>
                </Card>

                {/* Tips */}
                {generated.tips.length > 0 && (
                  <Card className="bg-coral/5 border-0 shadow-card rounded-2xl p-5">
                    <h4 className="text-sm font-medium text-coral mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      {t('employerAI.interviewerTips', '面试官提示')}
                    </h4>
                    <ul className="space-y-1.5">
                      {generated.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                          <Star className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Questions */}
                <div className="space-y-3">
                  {generated.questions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`bg-white border-0 shadow-card rounded-2xl overflow-hidden transition-all ${
                          expandedQuestion === q.id ? 'ring-2 ring-coral/20' : ''
                        }`}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedQuestion(
                            expandedQuestion === q.id ? null : q.id
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-warm-gray">#{index + 1}</span>
                              {getTypeBadge(q.type)}
                              {getDifficultyBadge(q.difficulty)}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyQuestion(q);
                              }}
                              className="text-warm-gray hover:text-coral transition-colors"
                            >
                              {copiedQuestion === q.id ? (
                                <CheckCircle className="w-4 h-4 text-emerald" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm font-medium text-charcoal">{q.question}</p>
                        </div>

                        <AnimatePresence>
                          {expandedQuestion === q.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3 border-t border-sand pt-3">
                                {/* Suggested Answer */}
                                <div>
                                  <h5 className="text-xs font-medium text-warm-gray mb-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {t('employerAI.suggestedAnswer', '参考答案')}
                                  </h5>
                                  <p className="text-sm text-charcoal bg-cream rounded-lg p-3">{q.suggestedAnswer}</p>
                                </div>

                                {/* Scoring Criteria */}
                                <div>
                                  <h5 className="text-xs font-medium text-warm-gray mb-1 flex items-center gap-1">
                                    <BarChart3 className="w-3 h-3" />
                                    {t('employerAI.scoringCriteria', '评分标准')}
                                  </h5>
                                  <p className="text-sm text-charcoal bg-cream rounded-lg p-3 whitespace-pre-line">{q.scoringCriteria}</p>
                                </div>

                                {/* Follow-up Questions */}
                                {q.followUpQuestions.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-warm-gray mb-1 flex items-center gap-1">
                                      <Zap className="w-3 h-3" />
                                      {t('employerAI.followUpQuestions', '追问问题')}
                                    </h5>
                                    <ul className="space-y-1">
                                      {q.followUpQuestions.map((fq, i) => (
                                        <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                                          <ChevronRight className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                                          {fq}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
