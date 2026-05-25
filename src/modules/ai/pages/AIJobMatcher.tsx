import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Briefcase, MapPin, DollarSign, Search, Target, Zap,
  TrendingUp, Award, AlertCircle, Loader2, ChevronRight, Building2,
  Star, BookOpen, Lightbulb, CheckCircle, XCircle, BarChart3,
  GraduationCap, Wrench, Heart, SlidersHorizontal, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { callAI, parseAIJSON } from '@/utils/aiApi';
import type { AIResponse } from '@/utils/aiApi';
import { logger } from '@/shared/logger'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface UserProfile {
  skills: string[];
  experience: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  education: string;
  languages: string[];
  targetIndustry: string;
}

interface MatchedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryRange: [number, number];
  matchScore: number;
  skillMatch: number;
  experienceMatch: number;
  salaryMatch: number;
  locationMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  requirements: string[];
  industry: string;
  logo: string;
}

interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  reason: string;
  resources: string[];
}

interface AIMatchResult {
  jobs: MatchedJob[];
  skillGaps: SkillGap[];
  careerAdvice: string;
  topIndustries: string[];
}

/* ═══════════════════════════════════════════
   Mock Jobs Database
   ═══════════════════════════════════════════ */
const MOCK_JOBS: Omit<MatchedJob, 'matchScore' | 'skillMatch' | 'experienceMatch' | 'salaryMatch' | 'locationMatch' | 'matchedSkills' | 'missingSkills'>[] = [
  {
    id: '1', title: '生产主管', company: '金边制衣有限公司', location: '金边', salary: '$800-1200',
    salaryRange: [800, 1200], description: '负责生产线管理和团队协调', requirements: ['生产管理', '团队领导', '质量控制', '排产计划'], industry: '制造业',
    logo: '👔',
  },
  {
    id: '2', title: '酒店前台经理', company: '暹粒度假酒店', location: '暹粒', salary: '$600-900',
    salaryRange: [600, 900], description: '管理前台团队，提供高端客户服务', requirements: ['客户服务', '英语沟通', '酒店管理', '预订系统'], industry: '酒店旅游',
    logo: '🏨',
  },
  {
    id: '3', title: 'QC质检员', company: '西港纺织厂', location: '西港', salary: '$400-600',
    salaryRange: [400, 600], description: '产品质量检验和报告', requirements: ['质量检测', 'AQL标准', '报表制作', '细节关注'], industry: '制造业',
    logo: '🔍',
  },
  {
    id: '4', title: '中文翻译', company: '中资企业联合会', location: '金边', salary: '$700-1100',
    salaryRange: [700, 1100], description: '商务翻译和文件翻译', requirements: ['中文流利', '商务翻译', '办公软件', '文化理解'], industry: '专业服务',
    logo: '🌐',
  },
  {
    id: '5', title: '餐厅经理', company: '中柬餐厅集团', location: '金边', salary: '$500-800',
    salaryRange: [500, 800], description: '餐厅日常运营和团队管理', requirements: ['餐饮管理', '成本控制', '人员培训', '客户服务'], industry: '餐饮',
    logo: '🍽️',
  },
  {
    id: '6', title: 'IE工业工程师', company: '金牌制衣厂', location: '金边', salary: '$1000-1500',
    salaryRange: [1000, 1500], description: '生产线优化和效率提升', requirements: ['工业工程', 'GST/GSD', '时间管理', '流程优化'], industry: '制造业',
    logo: '⚙️',
  },
  {
    id: '7', title: 'IT技术支持', company: 'Digital Cambodia', location: '金边', salary: '$500-900',
    salaryRange: [500, 900], description: 'IT基础设施维护和支持', requirements: ['网络管理', '硬件维护', '问题解决', '客户服务'], industry: '科技',
    logo: '💻',
  },
  {
    id: '8', title: '导游领队', company: '吴哥旅游公司', location: '暹粒', salary: '$400-700',
    salaryRange: [400, 700], description: '带领游客参观吴哥窟等景点', requirements: ['导游证', '英语/中文', '历史文化', '沟通能力'], industry: '酒店旅游',
    logo: '🗺️',
  },
];

const SKILL_OPTIONS = [
  '生产管理', '团队领导', '质量控制', '英语沟通', '中文流利', '酒店管理',
  '客户服务', '工业工程', '编程开发', '数据分析', '财务管理', '销售推广',
  '人力资源', '供应链', '设备维护', '安全管理', '项目管理', '营销策划',
];

const LOCATIONS = ['金边', '暹粒', '西港', '马德望', '贡布', '不限'];
const INDUSTRIES = ['制造业', '酒店旅游', '科技', '餐饮', '专业服务', '建筑', '贸易', '不限'];
const LANGUAGES_OPTIONS = ['高棉语', '中文', '英语', '泰语', '越南语'];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function AIJobMatcher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    skills: [], experience: '3-5', salaryMin: 400, salaryMax: 1200,
    location: '不限', education: '本科', languages: ['高棉语'], targetIndustry: '不限',
  });
  const [result, setResult] = useState<AIMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showSkillPanel, setShowSkillPanel] = useState(false);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const toggleSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const calculateMatch = useCallback((): AIMatchResult => {
    const jobs: MatchedJob[] = MOCK_JOBS.map(job => {
      const matchedSkills = job.requirements.filter(r =>
        profile.skills.some(s => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );
      const missingSkills = job.requirements.filter(r => !matchedSkills.includes(r));
      const skillMatch = job.requirements.length > 0 ? Math.round((matchedSkills.length / job.requirements.length) * 100) : 50;

      const expYears = parseInt(profile.experience) || 3;
      const expMatch = Math.min(100, 50 + expYears * 10);

      const avgSalary = (job.salaryRange[0] + job.salaryRange[1]) / 2;
      const userAvgSalary = (profile.salaryMin + profile.salaryMax) / 2;
      const salaryDiff = Math.abs(avgSalary - userAvgSalary) / userAvgSalary;
      const salaryMatch = Math.max(0, Math.round(100 - salaryDiff * 100));

      const locationMatch = profile.location === '不限' || job.location === profile.location ? 100 : 50;

      const matchScore = Math.round(skillMatch * 0.4 + expMatch * 0.25 + salaryMatch * 0.2 + locationMatch * 0.15);

      return {
        ...job, matchScore, skillMatch, experienceMatch: expMatch, salaryMatch, locationMatch,
        matchedSkills, missingSkills,
      };
    });

    jobs.sort((a, b) => b.matchScore - a.matchScore);

    // Determine skill gaps
    const allRequired = new Set<string>();
    jobs.slice(0, 3).forEach(j => j.missingSkills.forEach(s => allRequired.add(s)));
    const skillGaps: SkillGap[] = Array.from(allRequired).slice(0, 5).map((skill, i) => ({
      skill,
      importance: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
      reason: `匹配职位中${(i % 3) + 2}个职位要求此技能`,
      resources: ['在线课程', '实践项目', '导师指导'],
    }));

    return {
      jobs: jobs.filter(j => j.matchScore > 20),
      skillGaps,
      careerAdvice: `根据您的技能组合，建议重点提升${skillGaps[0]?.skill || '核心技能'}，这将显著提高您的就业竞争力。`,
      topIndustries: [...new Set(jobs.slice(0, 4).map(j => j.industry))],
    };
  }, [profile]);

  const handleMatch = async () => {
    if (profile.skills.length === 0) {
      setError(t('jobMatcher.selectSkills', '请至少选择一个技能'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const localResult = calculateMatch();

    try {
      const prompt = `用户求职信息：\n技能：${profile.skills.join('、')}\n经验：${profile.experience}年\n期望薪资：$${profile.salaryMin}-$${profile.salaryMax}\n地点：${profile.location}\n学历：${profile.education}\n语言：${profile.languages.join('、')}\n目标行业：${profile.targetIndustry}\n\n请分析并返回JSON：\n{\n  "careerAdvice": "职业发展建议",\n  "skillGaps": [{"skill": "技能名", "importance": "high/medium/low", "reason": "原因", "resources": ["学习资源1"]}],\n  "topIndustries": ["推荐行业1", "推荐行业2"]\n}`;

      const aiResult: AIResponse = await callAI([
        { role: 'system', content: '你是一位专业的职业规划师，擅长根据求职者信息提供匹配分析和建议。请只返回JSON格式。' },
        { role: 'user', content: prompt },
      ], { temperature: 0.6, max_tokens: 1500 });

      if (aiResult.success) {
        const parsed = parseAIJSON<{ careerAdvice: string; skillGaps: SkillGap[]; topIndustries: string[] }>(
          aiResult.content,
          { careerAdvice: localResult.careerAdvice, skillGaps: localResult.skillGaps, topIndustries: localResult.topIndustries }
        );
        setResult({
          ...localResult,
          careerAdvice: parsed.careerAdvice,
          skillGaps: parsed.skillGaps.length > 0 ? parsed.skillGaps : localResult.skillGaps,
          topIndustries: parsed.topIndustries.length > 0 ? parsed.topIndustries : localResult.topIndustries,
        });
      } else {
        setResult(localResult);
      }
    } catch (err) {
      logger.error('Job match AI call failed', { error: err, component: 'AIJobMatcher' });
      setResult(localResult);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-coral';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-coral';
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-warm-white">{t('jobMatcher.title', 'AI岗位智能匹配')}</h1>
                <p className="text-warm-gray text-sm mt-1">{t('jobMatcher.subtitle', 'AI分析您的技能，推荐最适合的职位')}</p>
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
              <button onClick={() => setError(null)} className="ml-auto"><XCircle className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ Main ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-5">
                  <SlidersHorizontal className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-charcoal">{t('jobMatcher.yourProfile', '您的求职档案')}</h2>
                </div>

                <div className="space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <Wrench className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.yourSkills', '您的技能')} <span className="text-coral">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_OPTIONS.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            profile.skills.includes(skill)
                              ? 'bg-gold text-charcoal shadow-sm'
                              : 'bg-cream text-warm-gray hover:bg-sand border border-sand'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {profile.skills.length > 0 && (
                      <p className="text-xs text-warm-gray mt-1.5">{t('jobMatcher.selectedSkills', '已选')}: {profile.skills.length} {t('jobMatcher.skillsCount', '个技能')}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.experience', '工作经验')}
                    </label>
                    <select value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      <option value="0">应届生/无经验</option>
                      <option value="1-2">1-2年</option>
                      <option value="3-5">3-5年</option>
                      <option value="5-10">5-10年</option>
                      <option value="10+">10年以上</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.salaryRange', '期望薪资范围')}: ${profile.salaryMin} - ${profile.salaryMax}
                    </label>
                    <div className="px-2">
                      <Slider
                        value={[profile.salaryMin, profile.salaryMax]}
                        onValueChange={([min, max]) => setProfile(p => ({ ...p, salaryMin: min, salaryMax: max }))}
                        min={200} max={3000} step={100}
                        className="my-4"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <MapPin className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.preferredLocation', '期望地点')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCATIONS.map(loc => (
                        <button key={loc} onClick={() => setProfile(p => ({ ...p, location: loc }))}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            profile.location === loc ? 'bg-gold text-charcoal' : 'bg-cream text-warm-gray hover:bg-sand'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <Building2 className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.targetIndustry', '目标行业')}
                    </label>
                    <select value={profile.targetIndustry} onChange={e => setProfile(p => ({ ...p, targetIndustry: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm bg-white"
                    >
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      <Star className="w-4 h-4 inline mr-1 text-gold" />
                      {t('jobMatcher.languages', '语言能力')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {LANGUAGES_OPTIONS.map(lang => (
                        <button key={lang} onClick={() => setProfile(p => ({
                          ...p, languages: p.languages.includes(lang) ? p.languages.filter(l => l !== lang) : [...p.languages, lang],
                        }))}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            profile.languages.includes(lang) ? 'bg-gold text-charcoal' : 'bg-cream text-warm-gray hover:bg-sand'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Match Button */}
                  <Button
                    onClick={handleMatch}
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-xl shadow-lg shadow-gold/25 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('jobMatcher.matching', 'AI智能匹配中...')}</>
                    ) : (
                      <><Sparkles className="w-5 h-5 mr-2" /> {t('jobMatcher.matchBtn', '开始AI匹配')}</>
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
                  <Target className="w-12 h-12 text-gold/40" />
                </div>
                <p className="text-lg font-medium">{t('jobMatcher.emptyTitle', '填写您的求职档案')}</p>
                <p className="text-sm mt-2 text-warm-gray/70">{t('jobMatcher.emptyDesc', 'AI将为您推荐最匹配的职位')}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Summary Bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="rounded-2xl shadow-card border-0 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-gold" />
                          {t('jobMatcher.matchResult', '匹配结果')}
                        </h3>
                        <p className="text-sm text-warm-gray mt-1">
                          {t('jobMatcher.foundJobs', '找到')} <span className="font-semibold text-gold">{result.jobs.length}</span> {t('jobMatcher.matchingJobs', '个匹配职位')}
                          {result.topIndustries.length > 0 && ` · ${t('jobMatcher.topIndustries', '推荐行业')}: ${result.topIndustries.join('、')}`}
                        </p>
                      </div>
                      <Button onClick={() => setShowSkillPanel(!showSkillPanel)} variant="outline" size="sm"
                        className="border-gold/30 text-gold hover:bg-gold/10"
                      >
                        <BookOpen className="w-4 h-4 mr-1" /> {t('jobMatcher.skillGap', '技能缺口')}
                      </Button>
                    </div>

                    {/* Skill Gaps Panel */}
                    <AnimatePresence>
                      {showSkillPanel && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-4 p-4 bg-cream/50 rounded-xl">
                            <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4 text-gold" /> {t('jobMatcher.recommendedSkills', '建议提升的技能')}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {result.skillGaps.map((gap, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                  className="p-3 bg-white rounded-xl border border-sand"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      gap.importance === 'high' ? 'bg-coral/10 text-coral' :
                                      gap.importance === 'medium' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {gap.importance === 'high' ? '高' : gap.importance === 'medium' ? '中' : '低'}
                                    </span>
                                    <span className="text-sm font-medium text-charcoal">{gap.skill}</span>
                                  </div>
                                  <p className="text-xs text-warm-gray mt-1">{gap.reason}</p>
                                </motion.div>
                              ))}
                            </div>
                            <p className="text-xs text-warm-gray mt-3 bg-gold/10 p-3 rounded-lg">
                              <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-gold" />
                              {result.careerAdvice}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>

                {/* Job Cards */}
                {result.jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <Card className={`rounded-2xl shadow-card border-0 p-5 sm:p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedJob === job.id ? 'ring-2 ring-gold' : ''
                    }`}
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        {/* Match Score Circle */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                              <circle cx="30" cy="30" r="26" fill="none" stroke="#E8E0D0" strokeWidth="4" />
                              <circle cx="30" cy="30" r="26" fill="none" className={getScoreBg(job.matchScore)} strokeWidth="4"
                                strokeLinecap="round" strokeDasharray={`${job.matchScore * 1.63} 200`} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-sm font-bold ${getScoreColor(job.matchScore)}`}>{job.matchScore}%</span>
                            </div>
                          </div>
                          <span className="text-xs text-warm-gray mt-1">{t('jobMatcher.match', '匹配度')}</span>
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <h4 className="text-base font-semibold text-charcoal">{job.title}</h4>
                            <Badge variant="outline" className="border-gold/30 text-gold text-xs w-fit">
                              {job.industry}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-warm-gray">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}/月</span>
                          </div>

                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.matchedSkills.map(s => (
                              <Badge key={s} className="bg-emerald/10 text-emerald border-0 text-xs">
                                <CheckCircle className="w-3 h-3 mr-0.5" /> {s}
                              </Badge>
                            ))}
                            {job.missingSkills.map(s => (
                              <Badge key={s} variant="outline" className="border-sand text-warm-gray text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>

                          {/* Expanded Detail */}
                          <AnimatePresence>
                            {selectedJob === job.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-sand space-y-3">
                                  <p className="text-sm text-charcoal">{job.description}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="text-center p-2 bg-cream rounded-lg">
                                      <p className="text-xs text-warm-gray">{t('jobMatcher.skillMatch', '技能匹配')}</p>
                                      <p className={`text-sm font-bold ${getScoreColor(job.skillMatch)}`}>{job.skillMatch}%</p>
                                    </div>
                                    <div className="text-center p-2 bg-cream rounded-lg">
                                      <p className="text-xs text-warm-gray">{t('jobMatcher.expMatch', '经验匹配')}</p>
                                      <p className={`text-sm font-bold ${getScoreColor(job.experienceMatch)}`}>{job.experienceMatch}%</p>
                                    </div>
                                    <div className="text-center p-2 bg-cream rounded-lg">
                                      <p className="text-xs text-warm-gray">{t('jobMatcher.salaryMatch', '薪资匹配')}</p>
                                      <p className={`text-sm font-bold ${getScoreColor(job.salaryMatch)}`}>{job.salaryMatch}%</p>
                                    </div>
                                    <div className="text-center p-2 bg-cream rounded-lg">
                                      <p className="text-xs text-warm-gray">{t('jobMatcher.locMatch', '地点匹配')}</p>
                                      <p className={`text-sm font-bold ${getScoreColor(job.locationMatch)}`}>{job.locationMatch}%</p>
                                    </div>
                                  </div>
                                  <Button onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}
                                    className="w-full bg-gold hover:bg-gold/90 text-charcoal"
                                  >
                                    <ChevronRight className="w-4 h-4 mr-1" /> {t('jobMatcher.viewJob', '查看职位详情')}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
