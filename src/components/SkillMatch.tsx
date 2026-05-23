import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Target,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Zap,
  ChevronRight,
  Star,
  Clock,
  Award,
  Lock,
  Loader2,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: easeSmooth }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Types ─── */
interface UserSkill {
  name: string;
  level: number; // 0-100
  category: string;
}

interface SkillGap {
  skill: string;
  requiredLevel: number;
  userLevel: number;
  gap: number;
}

interface RecommendedCourse {
  id: number;
  title: string;
  titleKey: string;
  teacher: string;
  category: string;
  categoryKey: string;
  duration: string;
  students: number;
  rating: number;
  relevance: number; // 0-100
  coversGaps: string[];
  price: number | null;
  isFree?: boolean;
}

interface LearningPath {
  id: number;
  nameKey: string;
  descriptionKey: string;
  steps: { courseId: number; titleKey: string }[];
  estimatedWeeks: number;
  category: string;
}

/* ─── Mock Data ─── */
const mockUserSkills: UserSkill[] = [
  { name: 'skillMatch.sewingBasic', level: 75, category: 'factory' },
  { name: 'skillMatch.qualityControl', level: 40, category: 'factory' },
  { name: 'skillMatch.basicComputer', level: 30, category: 'digital' },
  { name: 'skillMatch.englishBasic', level: 20, category: 'language' },
  { name: 'skillMatch.chineseBasic', level: 10, category: 'language' },
  { name: 'skillMatch.teamManagement', level: 50, category: 'management' },
  { name: 'skillMatch.safetyProcedures', level: 60, category: 'factory' },
  { name: 'skillMatch.excelBasic', level: 25, category: 'digital' },
];

const mockSkillGaps: SkillGap[] = [
  { skill: 'skillMatch.qualityControlAdvanced', requiredLevel: 80, userLevel: 40, gap: 40 },
  { skill: 'skillMatch.productionPlanning', requiredLevel: 70, userLevel: 20, gap: 50 },
  { skill: 'skillMatch.businessChinese', requiredLevel: 65, userLevel: 10, gap: 55 },
  { skill: 'skillMatch.excelAdvanced', requiredLevel: 75, userLevel: 25, gap: 50 },
  { skill: 'skillMatch.workplaceEnglish', requiredLevel: 60, userLevel: 20, gap: 40 },
  { skill: 'skillMatch.leadership', requiredLevel: 70, userLevel: 50, gap: 20 },
];

const mockRecommendedCourses: RecommendedCourse[] = [
  {
    id: 1, title: 'skillMatch.courseQC', titleKey: 'skillMatch.courseQCTitle',
    teacher: 'Ming Zhang', category: 'factory', categoryKey: 'courses.categories.factorySkills',
    duration: '8h', students: 3102, rating: 4.6, relevance: 95,
    coversGaps: ['skillMatch.qualityControlAdvanced'], price: null, isFree: true,
  },
  {
    id: 2, title: 'skillMatch.courseChinese', titleKey: 'skillMatch.courseChineseTitle',
    teacher: '李老师', category: 'language', categoryKey: 'courses.categories.chinese',
    duration: '15h', students: 892, rating: 4.8, relevance: 90,
    coversGaps: ['skillMatch.businessChinese'], price: 15.99,
  },
  {
    id: 3, title: 'skillMatch.courseExcel', titleKey: 'skillMatch.courseExcelTitle',
    teacher: 'Sopheap Rith', category: 'digital', categoryKey: 'courses.categories.itSkills',
    duration: '10h', students: 2340, rating: 4.7, relevance: 88,
    coversGaps: ['skillMatch.excelAdvanced'], price: 8.99,
  },
  {
    id: 4, title: 'skillMatch.courseEnglish', titleKey: 'skillMatch.courseEnglishTitle',
    teacher: 'John Smith', category: 'language', categoryKey: 'courses.categories.english',
    duration: '18h', students: 1245, rating: 4.9, relevance: 82,
    coversGaps: ['skillMatch.workplaceEnglish'], price: 19.99,
  },
  {
    id: 5, title: 'skillMatch.courseLeadership', titleKey: 'skillMatch.courseLeadershipTitle',
    teacher: 'David Chen', category: 'management', categoryKey: 'courses.categories.business',
    duration: '16h', students: 423, rating: 4.8, relevance: 75,
    coversGaps: ['skillMatch.leadership', 'skillMatch.productionPlanning'], price: 29.99,
  },
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 1, nameKey: 'skillMatch.pathQCSupervisor', descriptionKey: 'skillMatch.pathQCSupervisorDesc',
    category: 'factory',
    steps: [
      { courseId: 1, titleKey: 'skillMatch.pathStepQC' },
      { courseId: 3, titleKey: 'skillMatch.pathStepExcel' },
      { courseId: 5, titleKey: 'skillMatch.pathStepLeadership' },
    ],
    estimatedWeeks: 12,
  },
  {
    id: 2, nameKey: 'skillMatch.pathFactoryManager', descriptionKey: 'skillMatch.pathFactoryManagerDesc',
    category: 'management',
    steps: [
      { courseId: 2, titleKey: 'skillMatch.pathStepChinese' },
      { courseId: 3, titleKey: 'skillMatch.pathStepExcel' },
      { courseId: 5, titleKey: 'skillMatch.pathStepLeadership' },
    ],
    estimatedWeeks: 16,
  },
  {
    id: 3, nameKey: 'skillMatch.pathBilingualPro', descriptionKey: 'skillMatch.pathBilingualProDesc',
    category: 'language',
    steps: [
      { courseId: 4, titleKey: 'skillMatch.pathStepEnglish' },
      { courseId: 2, titleKey: 'skillMatch.pathStepChinese' },
    ],
    estimatedWeeks: 20,
  },
];

/* ─── Skill Radar / Gap Visualization ─── */
function SkillGapAnalysis({
  skills,
  gaps,
}: {
  skills: UserSkill[];
  gaps: SkillGap[];
}) {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const overallScore = Math.round(
    skills.reduce((sum, s) => sum + s.level, 0) / skills.length
  );

  const getLevelColor = (level: number) => {
    if (level >= 70) return 'bg-emerald';
    if (level >= 40) return 'bg-gold';
    return 'bg-coral';
  };

  const getLevelLabel = (level: number) => {
    if (level >= 70) return t('skillMatch.proficient');
    if (level >= 40) return t('skillMatch.intermediate');
    return t('skillMatch.beginner');
  };

  return (
    <div className="bg-white border border-sand rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-charcoal">
              {t('skillMatch.skillAnalysis')}
            </h3>
            <p className="text-xs text-warm-gray">{t('skillMatch.aiPoweredAnalysis')}</p>
          </div>
        </div>
        {!showAnalysis ? (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-gold text-deep-brown px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-all disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('skillMatch.analyzing')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t('skillMatch.analyzeSkills')}
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-1 text-emerald text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {t('skillMatch.analysisComplete')}
          </div>
        )}
      </div>

      {/* Overall Score */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-cream rounded-xl">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E8E0D0" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28" fill="none" stroke={overallScore >= 70 ? '#059669' : overallScore >= 40 ? '#D4AF37' : '#E85D3E'}
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallScore / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-charcoal">
            {overallScore}
          </span>
        </div>
        <div>
          <p className="font-semibold text-charcoal">{t('skillMatch.overallSkillScore')}</p>
          <p className="text-xs text-warm-gray">
            {overallScore >= 70
              ? t('skillMatch.scoreGood')
              : overallScore >= 40
              ? t('skillMatch.scoreAverage')
              : t('skillMatch.scoreNeedsWork')}
          </p>
        </div>
      </div>

      {/* Current Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-charcoal mb-3">{t('skillMatch.currentSkills')}</h4>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-charcoal">{t(skill.name)}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    skill.level >= 70 ? 'text-emerald' : skill.level >= 40 ? 'text-gold' : 'text-coral'
                  }`}>
                    {getLevelLabel(skill.level)}
                  </span>
                  <span className="text-xs text-warm-gray w-8 text-right">{skill.level}%</span>
                </div>
              </div>
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getLevelColor(skill.level)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: easeSmooth }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border-t border-sand pt-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-coral" />
                <h4 className="text-sm font-semibold text-charcoal">{t('skillMatch.skillGaps')}</h4>
              </div>
              <div className="space-y-3">
                {gaps
                  .sort((a, b) => b.gap - a.gap)
                  .map((gap) => (
                    <div
                      key={gap.skill}
                      className="flex items-center gap-3 p-3 bg-coral/5 border border-coral/10 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-coral" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {t(gap.skill)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
                            <div
                              className="h-full bg-coral rounded-full"
                              style={{ width: `${gap.gap}%` }}
                            />
                          </div>
                          <span className="text-xs text-coral font-medium whitespace-nowrap">
                            -{gap.gap}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Recommended Courses ─── */
function RecommendedCourses({
  courses,
}: {
  courses: RecommendedCourse[];
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-sand rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald/10 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {t('skillMatch.recommendedCourses')}
          </h3>
          <p className="text-xs text-warm-gray">{t('skillMatch.basedOnSkillGaps')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {courses
          .sort((a, b) => b.relevance - a.relevance)
          .map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link to={`/courses/${course.id}`}>
                <motion.div
                  className="flex items-start gap-3 p-3 rounded-xl border border-sand hover:border-gold hover:bg-[#FFFBF5] transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-sm">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-charcoal truncate">
                        {t(course.titleKey)}
                      </h4>
                      {course.isFree && (
                        <span className="text-[10px] bg-emerald/10 text-emerald px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {t('common.free')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-warm-gray mb-1.5">
                      {course.teacher} · {t(course.categoryKey)}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-0.5 text-gold">
                        <Star className="w-3 h-3 fill-gold" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-0.5 text-warm-gray">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-0.5 text-warm-gray">
                        <Award className="w-3 h-3" />
                        {course.relevance}% {t('skillMatch.match')}
                      </span>
                    </div>
                    {/* Gap tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.coversGaps.map((gap) => (
                        <span
                          key={gap}
                          className="text-[10px] bg-coral/10 text-coral px-1.5 py-0.5 rounded-full"
                        >
                          {t(gap)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-warm-gray flex-shrink-0 mt-1" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
      </div>

      <Link
        to="/courses"
        className="flex items-center justify-center gap-2 mt-4 text-sm text-gold font-medium hover:text-gold-dark transition-colors"
      >
        {t('skillMatch.viewAllCourses')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ─── Learning Paths ─── */
function LearningPathsSection({
  paths,
}: {
  paths: LearningPath[];
}) {
  const { t } = useTranslation();
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'factory': return 'text-emerald bg-emerald/10';
      case 'management': return 'text-gold bg-gold/10';
      case 'language': return 'text-blue-600 bg-blue-50';
      default: return 'text-charcoal bg-cream';
    }
  };

  return (
    <div className="bg-white border border-sand rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald/10 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-emerald" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {t('skillMatch.learningPaths')}
          </h3>
          <p className="text-xs text-warm-gray">{t('skillMatch.curatedRoadmaps')}</p>
        </div>
      </div>

      <div className="space-y-3">
        {paths.map((path) => (
          <div
            key={path.id}
            className="border border-sand rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-cream/50 transition-colors text-left"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(path.category)}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-charcoal">{t(path.nameKey)}</h4>
                <p className="text-xs text-warm-gray truncate">{t(path.descriptionKey)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-warm-gray flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {path.estimatedWeeks}{t('skillMatch.weeks')}
                </span>
                <motion.div
                  animate={{ rotate: expandedPath === path.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-warm-gray" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {expandedPath === path.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="relative pl-4 border-l-2 border-sand space-y-3">
                      {path.steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-gold border-2 border-white" />
                          <Link to={`/courses/${step.courseId}`}>
                            <div className="flex items-center gap-2 text-sm text-charcoal hover:text-gold transition-colors cursor-pointer">
                              <span className="text-xs text-warm-gray w-5">{idx + 1}</span>
                              {t(step.titleKey)}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/courses"
                      className="flex items-center justify-center gap-1 mt-3 text-xs text-gold font-medium hover:text-gold-dark transition-colors"
                    >
                      <Lock className="w-3 h-3" />
                      {t('skillMatch.startThisPath')}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN COMPONENT ═══════════════ */
/* ═══════════════════════════════════════════ */
interface SkillMatchProps {
  variant?: 'profile' | 'course' | 'full';
}

export default function SkillMatch({ variant = 'full' }: SkillMatchProps) {
  const { t } = useTranslation();

  if (variant === 'profile') {
    return (
      <div className="space-y-6">
        <SkillGapAnalysis skills={mockUserSkills} gaps={mockSkillGaps} />
        <RecommendedCourses courses={mockRecommendedCourses} />
      </div>
    );
  }

  if (variant === 'course') {
    return (
      <div className="space-y-6">
        <SkillGapAnalysis skills={mockUserSkills} gaps={mockSkillGaps} />
        <LearningPathsSection paths={mockLearningPaths} />
      </div>
    );
  }

  return (
    <section className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t('skillMatch.aiSkillMatch')}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              {t('skillMatch.title')}
            </h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              {t('skillMatch.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillGapAnalysis skills={mockUserSkills} gaps={mockSkillGaps} />
          <div className="space-y-6">
            <RecommendedCourses courses={mockRecommendedCourses} />
            <LearningPathsSection paths={mockLearningPaths} />
          </div>
        </div>
      </div>
    </section>
  );
}
