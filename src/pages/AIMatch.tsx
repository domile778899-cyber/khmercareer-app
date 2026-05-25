/**
 * AIMatch - AI智能职位匹配页面
 *
 * Features:
 * - 多维度匹配算法（技能40% + 地点25% + 薪资20% + 经验15%）
 * - 用户技能标签选择
 * - 期望薪资范围滑块
 * - 期望地点选择
 * - 经验级别选择
 * - 匹配结果卡片展示
 * - 匹配度百分比显示
 * - 一键申请匹配职位
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  DollarSign,
  Briefcase,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  TrendingUp,
  Zap,
  Target,
  Loader2,
  ChevronDown,
  Award,
  Building2,
  Heart,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockJobs, type MockJob } from '../data/mockJobs';
import { useApply } from '../stores/ApplyContext';
import { useFavorites } from '../context/FavoritesContext';
import MatchCard, { type MatchResult, type MatchDimension } from '../components/MatchCard';

// ─── Animation Helpers ───────────────────────────────────────────

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

// ─── Skill Tags Library ──────────────────────────────────────────

interface SkillTag {
  id: string;
  label: string;
  labelZh: string;
  labelEn: string;
  category: string;
  keywords: string[];
}

const SKILL_TAGS: SkillTag[] = [
  // 服装纺织
  { id: 'sewing', label: '缝纫', labelZh: '缝纫', labelEn: 'Sewing', category: 'Garment & Textile', keywords: ['sewing', 'sew', 'stitch', 'garment', 'textile', 'pattern', 'sample', 'cutting', 'fabric', 'khmer', 'កាត់ដេ', 'ថតខារ៉ូ', 'ដេរ'] },
  { id: 'qc', label: '质检QC', labelZh: '质检QC', labelEn: 'Quality Control', category: 'Garment & Textile', keywords: ['quality', 'qc', 'inspect', 'aql', 'standard', 'test', 'ត្រួតពិនិត្យ'] },
  { id: 'ie', label: '工业工程IE', labelZh: '工业工程IE', labelEn: 'Industrial Engineering', category: 'Garment & Textile', keywords: ['ie', 'engineer', 'industrial', 'efficiency', 'gst', 'gsd', 'time study', 'optimization'] },
  // 酒店旅游
  { id: 'hotel', label: '酒店服务', labelZh: '酒店服务', labelEn: 'Hospitality', category: 'Tourism & Hospitality', keywords: ['hotel', 'reception', 'front desk', 'guest', 'room', 'housekeeping', 'resort', 'សណ្ឋាគារ', 'ទទួលភ្ញៀវ'] },
  { id: 'food', label: '餐饮服务', labelZh: '餐饮服务', labelEn: 'Food Service', category: 'Tourism & Hospitality', keywords: ['restaurant', 'server', 'chef', 'cook', 'kitchen', 'food', 'dining', 'waiter', 'waitress', 'ចុងភៅ', 'បម្រើតុ'] },
  { id: 'tour', label: '导游', labelZh: '导游', labelEn: 'Tour Guide', category: 'Tourism & Hospitality', keywords: ['tour', 'guide', 'travel', 'angkor', 'sightseeing', 'ដឹកនាំភ្ញៀវ'] },
  // ICT与科技
  { id: 'programming', label: '编程开发', labelZh: '编程开发', labelEn: 'Programming', category: 'ICT & Technology', keywords: ['software', 'developer', 'programming', 'web', 'app', 'code', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'javascript', 'python', 'mobile', 'កម្មវិធី'] },
  { id: 'design', label: 'UI/UX设计', labelZh: 'UI/UX设计', labelEn: 'UI/UX Design', category: 'ICT & Technology', keywords: ['design', 'ui', 'ux', 'figma', 'sketch', 'graphic', 'creative', 'art', 'photoshop', 'illustrator', 'រចនា'] },
  { id: 'data', label: '数据分析', labelZh: '数据分析', labelEn: 'Data Analysis', category: 'ICT & Technology', keywords: ['data', 'analyst', 'analytics', 'sql', 'excel', 'report', 'statistics', 'database', 'ទិន្នន័យ'] },
  { id: 'it_support', label: 'IT技术支持', labelZh: 'IT技术支持', labelEn: 'IT Support', category: 'ICT & Technology', keywords: ['it', 'support', 'technical', 'helpdesk', 'troubleshoot', 'system', 'network', 'server', 'linux', 'windows', 'គាំទ្របច្ចេកទេស'] },
  // 通用技能
  { id: 'english', label: '英语', labelZh: '英语', labelEn: 'English', category: 'Language', keywords: ['english', 'fluent', 'conversation', 'speak', 'write', 'read'] },
  { id: 'chinese', label: '中文', labelZh: '中文', labelEn: 'Chinese', category: 'Language', keywords: ['chinese', 'mandarin', 'cantonese', '中文', '汉语'] },
  { id: 'management', label: '管理', labelZh: '管理', labelEn: 'Management', category: 'General', keywords: ['manage', 'manager', 'supervisor', 'lead', 'director', 'team lead', 'management', 'administration', 'coordinator', 'គ្រប់គ្រង'] },
  { id: 'sales', label: '销售', labelZh: '销售', labelEn: 'Sales', category: 'General', keywords: ['sales', 'sell', 'marketing', 'promote', 'business development', 'client', 'customer', 'account', 'លក់'] },
  { id: 'accounting', label: '会计', labelZh: '会计', labelEn: 'Accounting', category: 'General', keywords: ['account', 'finance', 'audit', 'tax', 'bookkeeping', 'ledger', 'invoice', 'budget', 'គណនេយ្យ'] },
  { id: 'driving', label: '驾驶', labelZh: '驾驶', labelEn: 'Driving', category: 'General', keywords: ['drive', 'driver', 'license', 'delivery', 'transport', 'vehicle', 'truck', 'motorcycle', 'បើករថយន្ត'] },
  { id: 'safety', label: '安全管理', labelZh: '安全管理', labelEn: 'Safety', category: 'General', keywords: ['safety', 'security', 'guard', 'protect', 'fire', 'emergency', 'health', 'hse', 'សន្តិសុខ'] },
  { id: 'warehouse', label: '仓库管理', labelZh: '仓库管理', labelEn: 'Warehouse', category: 'General', keywords: ['warehouse', 'store', 'inventory', 'stock', 'logistics', 'supply chain', 'shipping', 'receiving', 'storekeeper', 'ស្តុក'] },
  { id: 'construction', label: '建筑', labelZh: '建筑', labelEn: 'Construction', category: 'General', keywords: ['construction', 'builder', 'carpenter', 'mason', 'electrician', 'plumber', 'welder', 'engineer', 'site', 'វិស្សនករ', 'សំណង់'] },
  { id: 'translation', label: '翻译', labelZh: '翻译', labelEn: 'Translation', category: 'Language', keywords: ['translate', 'interpreter', 'translator', 'bilingual', 'trilingual', 'communication', 'បកប្រែ'] },
  { id: 'computer', label: '电脑操作', labelZh: '电脑操作', labelEn: 'Computer Skills', category: 'General', keywords: ['computer', 'microsoft', 'office', 'word', 'excel', 'email', 'typing', 'digital'] },
  { id: 'factory', label: '工厂作业', labelZh: '工厂作业', labelEn: 'Factory Operations', category: 'General', keywords: ['factory', 'production', 'assembly', 'machine', 'operator', 'manufacturing', 'line worker', 'operator', 'រោងចក្រ'] },
];

// ─── Location Options ────────────────────────────────────────────

const LOCATIONS = [
  'Phnom Penh',
  'Siem Reap',
  'Sihanoukville',
  'Kandal',
  'Kampong Speu',
  'Battambang',
  'Kampot',
  'Kep',
  'Takeo',
  'Preah Sihanouk',
];

// ─── Experience Levels ───────────────────────────────────────────

interface ExperienceLevel {
  id: string;
  label: string;
  labelZh: string;
  labelEn: string;
  matchLevels: string[];
  minYears: number;
  maxYears: number;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { id: 'entry', label: '入门级', labelZh: '入门级', labelEn: 'Entry Level', matchLevels: ['Entry Level', 'entry', '0-1 years', 'No Experience'], minYears: 0, maxYears: 1 },
  { id: 'junior', label: '初级', labelZh: '初级', labelEn: 'Junior', matchLevels: ['1-2 years', '1+ years', '2+ years', 'junior'], minYears: 1, maxYears: 3 },
  { id: 'mid', label: '中级', labelZh: '中级', labelEn: 'Mid-level', matchLevels: ['2-3 years', '2-4 years', '3-5 years', 'mid'], minYears: 2, maxYears: 5 },
  { id: 'senior', label: '高级', labelZh: '高级', labelEn: 'Senior', matchLevels: ['3+ years', '3-5 years', '5+ years', 'senior'], minYears: 3, maxYears: 10 },
  { id: 'manager', label: '管理级', labelZh: '管理级', labelEn: 'Manager', matchLevels: ['5+ years', 'manager', 'director', 'head'], minYears: 5, maxYears: 99 },
];

// ─── Match Algorithm ─────────────────────────────────────────────

/** Parse experience text to years */
function parseExperienceYears(exp: string): { min: number; max: number } {
  const text = exp.toLowerCase();
  if (text.includes('entry') || text.includes('no experience')) return { min: 0, max: 1 };
  const plusMatch = text.match(/(\d+)\+?\s*years?/);
  const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)\s*years?/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }
  if (plusMatch) {
    const years = parseInt(plusMatch[1]);
    return { min: years, max: years + 3 };
  }
  if (text.includes('1-2')) return { min: 1, max: 2 };
  if (text.includes('2-3')) return { min: 2, max: 3 };
  if (text.includes('2-4')) return { min: 2, max: 4 };
  if (text.includes('3-5')) return { min: 3, max: 5 };
  return { min: 0, max: 5 };
}

/** Calculate skill match score (40%) */
function calculateSkillMatch(job: MockJob, selectedSkills: SkillTag[]): number {
  if (selectedSkills.length === 0) return 60; // Default neutral score

  let matchCount = 0;
  const jobText = `${job.title} ${job.titleEn} ${job.titleZh} ${job.industry} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();

  for (const skill of selectedSkills) {
    for (const keyword of skill.keywords) {
      if (jobText.includes(keyword.toLowerCase())) {
        matchCount++;
        break;
      }
    }
  }

  // Also check if job's industry matches any selected skill category
  const industryMatch = selectedSkills.filter((s) => s.category === job.industry).length;

  const totalPossible = selectedSkills.length;
  const skillMatch = Math.min(100, (matchCount / Math.max(1, totalPossible)) * 100);
  const categoryBonus = industryMatch > 0 ? 10 : 0;

  return Math.min(100, skillMatch + categoryBonus);
}

/** Calculate location match score (25%) */
function calculateLocationMatch(job: MockJob, selectedLocations: string[]): number {
  if (selectedLocations.length === 0) return 60; // Default neutral score

  const jobLoc = job.location.toLowerCase();
  for (const loc of selectedLocations) {
    if (jobLoc.includes(loc.toLowerCase()) || loc.toLowerCase().includes(jobLoc)) {
      return 100;
    }
  }
  return 0;
}

/** Calculate salary match score (20%) */
function calculateSalaryMatch(job: MockJob, salaryMin: number, salaryMax: number): number {
  if (salaryMin === 0 && salaryMax === 3000) return 60; // Default (full range)

  const jobAvg = (job.salaryMin + job.salaryMax) / 2;
  const userAvg = (salaryMin + salaryMax) / 2;
  const userRange = salaryMax - salaryMin;

  // Check overlap
  const overlapMin = Math.max(job.salaryMin, salaryMin);
  const overlapMax = Math.min(job.salaryMax, salaryMax);

  if (overlapMax >= overlapMin) {
    // There is overlap - good match
    const overlapRatio = (overlapMax - overlapMin) / Math.max(1, Math.max(job.salaryMax - job.salaryMin, userRange));
    return 70 + overlapRatio * 30;
  }

  // No overlap - calculate distance
  const distance = job.salaryMin > salaryMax
    ? job.salaryMin - salaryMax
    : salaryMin - job.salaryMax;
  const maxDistance = 1000;
  return Math.max(0, 60 - (distance / maxDistance) * 60);
}

/** Calculate experience match score (15%) */
function calculateExperienceMatch(job: MockJob, selectedLevel: ExperienceLevel | null): number {
  if (!selectedLevel) return 60; // Default neutral score

  const jobExp = parseExperienceYears(job.experience);
  const selMin = selectedLevel.minYears;
  const selMax = selectedLevel.maxYears;

  // Check direct level match
  if (selectedLevel.matchLevels.some((l) => job.experience.toLowerCase().includes(l.toLowerCase()))) {
    return 95;
  }
  if (selectedLevel.matchLevels.some((l) => job.level.toLowerCase().includes(l.toLowerCase()))) {
    return 90;
  }

  // Check year range overlap
  const overlapMin = Math.max(jobExp.min, selMin);
  const overlapMax = Math.min(jobExp.max, selMax);

  if (overlapMax >= overlapMin) {
    return 80;
  }

  // Calculate distance
  const distance = jobExp.min > selMax
    ? jobExp.min - selMax
    : selMin - jobExp.max;

  return Math.max(0, 70 - distance * 15);
}

/** Main match algorithm */
function calculateMatch(
  job: MockJob,
  selectedSkills: SkillTag[],
  selectedLocations: string[],
  salaryMin: number,
  salaryMax: number,
  selectedExpLevel: ExperienceLevel | null
): MatchResult {
  const skillScore = calculateSkillMatch(job, selectedSkills);
  const locationScore = calculateLocationMatch(job, selectedLocations);
  const salaryScore = calculateSalaryMatch(job, salaryMin, salaryMax);
  const experienceScore = calculateExperienceMatch(job, selectedExpLevel);

  const overallScore = Math.round(
    skillScore * 0.40 +
    locationScore * 0.25 +
    salaryScore * 0.20 +
    experienceScore * 0.15
  );

  const dimensions: MatchDimension[] = [
    {
      name: 'Skills',
      key: 'skill',
      score: Math.round(skillScore),
      weight: 0.40,
      color: '#D4AF37',
      icon: <Zap className="w-3 h-3" />,
    },
    {
      name: 'Location',
      key: 'location',
      score: Math.round(locationScore),
      weight: 0.25,
      color: '#059669',
      icon: <MapPin className="w-3 h-3" />,
    },
    {
      name: 'Salary',
      key: 'salary',
      score: Math.round(salaryScore),
      weight: 0.20,
      color: '#2563EB',
      icon: <DollarSign className="w-3 h-3" />,
    },
    {
      name: 'Exp.',
      key: 'experience',
      score: Math.round(experienceScore),
      weight: 0.15,
      color: '#E85D3E',
      icon: <Briefcase className="w-3 h-3" />,
    },
  ];

  return {
    job,
    overallScore,
    dimensions,
  };
}

// ─── Filter Panel Component ──────────────────────────────────────

interface FiltersState {
  selectedSkills: string[];
  selectedLocations: string[];
  salaryRange: [number, number];
  selectedExpId: string | null;
}

function FilterPanel({
  filters,
  onFiltersChange,
  onSearch,
  isAnalyzing,
}: {
  filters: FiltersState;
  onFiltersChange: (f: FiltersState) => void;
  onSearch: () => void;
  isAnalyzing: boolean;
}) {
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const toggleSkill = (skillId: string) => {
    const next = filters.selectedSkills.includes(skillId)
      ? filters.selectedSkills.filter((id) => id !== skillId)
      : [...filters.selectedSkills, skillId];
    onFiltersChange({ ...filters, selectedSkills: next });
  };

  const toggleLocation = (loc: string) => {
    const next = filters.selectedLocations.includes(loc)
      ? filters.selectedLocations.filter((l) => l !== loc)
      : [...filters.selectedLocations, loc];
    onFiltersChange({ ...filters, selectedLocations: next });
  };

  const setExpLevel = (id: string | null) => {
    onFiltersChange({ ...filters, selectedExpId: id });
  };

  const handleSalaryMin = (val: number) => {
    onFiltersChange({
      ...filters,
      salaryRange: [Math.min(val, filters.salaryRange[1]), filters.salaryRange[1]],
    });
  };

  const handleSalaryMax = (val: number) => {
    onFiltersChange({
      ...filters,
      salaryRange: [filters.salaryRange[0], Math.max(val, filters.salaryRange[0])],
    });
  };

  const selectedSkillTags = SKILL_TAGS.filter((s) => filters.selectedSkills.includes(s.id));
  const displayedSkills = showMoreSkills ? SKILL_TAGS : SKILL_TAGS.slice(0, 12);

  const hasActiveFilters =
    filters.selectedSkills.length > 0 ||
    filters.selectedLocations.length > 0 ||
    filters.selectedExpId !== null ||
    filters.salaryRange[0] > 0 ||
    filters.salaryRange[1] < 3000;

  const resetFilters = () => {
    onFiltersChange({
      selectedSkills: [],
      selectedLocations: [],
      salaryRange: [0, 3000],
      selectedExpId: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-sand shadow-card overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-5 hover:bg-cream/30 transition-colors"
        onClick={() => setShowFilters(!showFilters)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-gold" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-base font-semibold text-charcoal">
              AI Matching Filters
            </h2>
            <p className="text-xs text-warm-gray">
              Skills 40% · Location 25% · Salary 20% · Experience 15%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <motion.button
              className="text-xs text-coral hover:text-coral-dark font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-coral/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: showFilters ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-warm-gray" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeSmooth }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5">
              {/* ── Skills ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold" />
                    <span className="text-sm font-semibold text-charcoal">Your Skills</span>
                    {filters.selectedSkills.length > 0 && (
                      <span className="text-[10px] bg-gold/10 text-gold-dark px-1.5 py-0.5 rounded-full font-medium">
                        {filters.selectedSkills.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected skills pills */}
                <AnimatePresence>
                  {selectedSkillTags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-1.5 mb-3"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {selectedSkillTags.map((tag) => (
                        <motion.span
                          key={tag.id}
                          className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold-dark px-2.5 py-1 rounded-full font-medium"
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          {tag.label}
                          <button
                            onClick={() => toggleSkill(tag.id)}
                            className="hover:text-coral transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skill tag grid */}
                <div className="flex flex-wrap gap-1.5">
                  {displayedSkills.map((tag) => {
                    const isSelected = filters.selectedSkills.includes(tag.id);
                    return (
                      <motion.button
                        key={tag.id}
                        onClick={() => toggleSkill(tag.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                          isSelected
                            ? 'bg-gold text-deep-brown shadow-gold'
                            : 'bg-cream text-charcoal hover:bg-gold/10 hover:text-gold-dark border border-sand'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        layout
                      >
                        {tag.label}
                      </motion.button>
                    );
                  })}
                </div>
                {SKILL_TAGS.length > 12 && (
                  <button
                    onClick={() => setShowMoreSkills(!showMoreSkills)}
                    className="text-xs text-gold hover:text-gold-dark font-medium mt-2 flex items-center gap-1"
                  >
                    {showMoreSkills ? 'Show Less' : `Show All (${SKILL_TAGS.length})`}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${showMoreSkills ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-sand" />

              {/* ── Location ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-emerald" />
                  <span className="text-sm font-semibold text-charcoal">Preferred Location</span>
                  {filters.selectedLocations.length > 0 && (
                    <span className="text-[10px] bg-emerald/10 text-emerald px-1.5 py-0.5 rounded-full font-medium">
                      {filters.selectedLocations.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATIONS.map((loc) => {
                    const isSelected = filters.selectedLocations.includes(loc);
                    return (
                      <motion.button
                        key={loc}
                        onClick={() => toggleLocation(loc)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald text-white shadow-sm'
                            : 'bg-cream text-charcoal hover:bg-emerald/10 hover:text-emerald border border-sand'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loc}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-sand" />

              {/* ── Salary Range ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-charcoal">Expected Salary</span>
                </div>
                <div className="bg-cream rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <span className="text-[10px] text-warm-gray">Min</span>
                      <p className="text-sm font-bold text-charcoal">${filters.salaryRange[0]}</p>
                    </div>
                    <div className="flex-1 mx-4 h-px bg-sand" />
                    <div className="text-center">
                      <span className="text-[10px] text-warm-gray">Max</span>
                      <p className="text-sm font-bold text-charcoal">${filters.salaryRange[1]}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-warm-gray mb-1 block">Minimum</label>
                      <input
                        type="range"
                        min={0}
                        max={3000}
                        step={50}
                        value={filters.salaryRange[0]}
                        onChange={(e) => handleSalaryMin(Number(e.target.value))}
                        className="w-full h-1.5 bg-sand rounded-full appearance-none cursor-pointer accent-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-warm-gray mb-1 block">Maximum</label>
                      <input
                        type="range"
                        min={0}
                        max={3000}
                        step={50}
                        value={filters.salaryRange[1]}
                        onChange={(e) => handleSalaryMax(Number(e.target.value))}
                        className="w-full h-1.5 bg-sand rounded-full appearance-none cursor-pointer accent-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-sand" />

              {/* ── Experience Level ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-coral" />
                  <span className="text-sm font-semibold text-charcoal">Experience Level</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => {
                    const isSelected = filters.selectedExpId === level.id;
                    return (
                      <motion.button
                        key={level.id}
                        onClick={() => setExpLevel(isSelected ? null : level.id)}
                        className={`text-xs px-3 py-2.5 rounded-xl font-medium transition-all text-left ${
                          isSelected
                            ? 'bg-coral text-white shadow-sm'
                            : 'bg-cream text-charcoal hover:bg-coral/10 hover:text-coral border border-sand'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="font-semibold">{level.labelEn}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          {level.minYears === 0 ? '<1' : level.minYears}+
                          {' '}years
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ── Search Button ── */}
              <motion.button
                onClick={onSearch}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 bg-gold text-deep-brown text-sm font-bold py-3.5 rounded-xl hover:bg-gold-dark transition-colors disabled:opacity-60 shadow-gold hover:shadow-gold-hover"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Find Matching Jobs
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stats Overview ──────────────────────────────────────────────

function MatchStats({ matches }: { matches: MatchResult[] }) {
  if (matches.length === 0) return null;

  const avgScore = Math.round(matches.reduce((s, m) => s + m.overallScore, 0) / matches.length);
  const perfectMatches = matches.filter((m) => m.overallScore >= 85).length;
  const goodMatches = matches.filter((m) => m.overallScore >= 70 && m.overallScore < 85).length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Avg Score', value: `${avgScore}%`, color: 'text-gold', bg: 'bg-gold/10', icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Perfect', value: String(perfectMatches), color: 'text-emerald', bg: 'bg-emerald/10', icon: <Star className="w-4 h-4" /> },
        { label: 'Good', value: String(goodMatches), color: 'text-blue-600', bg: 'bg-blue-50', icon: <Award className="w-4 h-4" /> },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          className="bg-white rounded-xl border border-sand p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
            {stat.icon}
          </div>
          <p className="text-lg font-bold text-charcoal">{stat.value}</p>
          <p className="text-[10px] text-warm-gray">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────

function EmptyState({ onConfigure }: { onConfigure: () => void }) {
  return (
    <motion.div
      className="text-center py-16 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <Sparkles className="w-10 h-10 text-gold" />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
        AI Smart Matching
      </h3>
      <p className="text-warm-gray text-sm max-w-sm mx-auto mb-6">
        Select your skills, preferred location, expected salary, and experience level.
        Our AI algorithm will find the best matching jobs for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
        <div className="flex items-center gap-2 text-xs text-warm-gray bg-cream px-3 py-2 rounded-lg">
          <Zap className="w-4 h-4 text-gold" />
          <span>Skill Match 40%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-gray bg-cream px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-emerald" />
          <span>Location 25%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-gray bg-cream px-3 py-2 rounded-lg">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span>Salary 20%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-gray bg-cream px-3 py-2 rounded-lg">
          <Briefcase className="w-4 h-4 text-coral" />
          <span>Experience 15%</span>
        </div>
      </div>
      <motion.button
        onClick={onConfigure}
        className="mt-6 inline-flex items-center gap-2 bg-gold text-deep-brown px-6 py-3 rounded-xl text-sm font-bold hover:bg-gold-dark transition-colors shadow-gold"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Configure Matching Preferences
      </motion.button>
    </motion.div>
  );
}

// ─── Sort & Filter Bar ───────────────────────────────────────────

function SortBar({
  total,
  sortBy,
  onSortChange,
  filterScore,
  onFilterScoreChange,
}: {
  total: number;
  sortBy: string;
  onSortChange: (s: string) => void;
  filterScore: number;
  onFilterScoreChange: (s: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-sand p-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-charcoal">{total} jobs matched</span>
        <span className="text-xs text-warm-gray">| Sorted by relevance</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-gray">Min Score:</span>
          <select
            value={filterScore}
            onChange={(e) => onFilterScoreChange(Number(e.target.value))}
            className="text-xs bg-cream border border-sand rounded-lg px-2 py-1.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value={0}>All</option>
            <option value={50}>50%+</option>
            <option value={60}>60%+</option>
            <option value={70}>70%+</option>
            <option value={80}>80%+</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5">
          {[
            { value: 'score', label: 'Score' },
            { value: 'salary', label: 'Salary' },
            { value: 'recent', label: 'Recent' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
                sortBy === opt.value
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main AIMatch Component ──────────────────────────────────────

export default function AIMatch() {
  const navigate = useNavigate();
  const { applyJob, hasApplied } = useApply();

  const [filters, setFilters] = useState<FiltersState>({
    selectedSkills: [],
    selectedLocations: [],
    salaryRange: [0, 3000],
    selectedExpId: null,
  });

  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  // Get selected experience level object
  const selectedExpLevel = useMemo(
    () => EXPERIENCE_LEVELS.find((e) => e.id === filters.selectedExpId) || null,
    [filters.selectedExpId]
  );

  // Get selected skill tag objects
  const selectedSkillTags = useMemo(
    () => SKILL_TAGS.filter((s) => filters.selectedSkills.includes(s.id)),
    [filters.selectedSkills]
  );

  // Run matching algorithm
  const runMatching = useCallback(() => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay for UX
    setTimeout(() => {
      const results = mockJobs
        .filter((job) => job.status === 'active')
        .map((job) =>
          calculateMatch(
            job,
            selectedSkillTags,
            filters.selectedLocations,
            filters.salaryRange[0],
            filters.salaryRange[1],
            selectedExpLevel
          )
        );

      // Sort by score descending
      results.sort((a, b) => b.overallScore - a.overallScore);

      setMatchResults(results);
      setIsAnalyzing(false);
    }, 800);
  }, [selectedSkillTags, filters.selectedLocations, filters.salaryRange, selectedExpLevel]);

  // Auto-run on first load with default values
  useEffect(() => {
    runMatching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort results
  const filteredResults = useMemo(() => {
    if (!matchResults) return [];

    let results = matchResults.filter((r) => r.overallScore >= minScoreFilter);

    switch (sortBy) {
      case 'salary':
        results = [...results].sort((a, b) => b.job.salaryMax - a.job.salaryMax);
        break;
      case 'recent':
        results = [...results].sort(
          (a, b) => new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime()
        );
        break;
      default:
        // Already sorted by score
        break;
    }

    return results;
  }, [matchResults, sortBy, minScoreFilter]);

  // Handle quick apply
  const handleApply = useCallback(
    (jobId: string) => {
      applyJob(jobId);
    },
    [applyJob]
  );

  return (
    <section className="bg-warm-white min-h-screen py-6 md:py-10">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        {/* ── Hero Header ── */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-gold/15 border border-gold/25 text-gold-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4" />
              AI Smart Matching
            </motion.div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              Find Your Perfect Job Match
            </h1>
            <p className="text-warm-gray max-w-2xl mx-auto text-sm leading-relaxed">
              Our intelligent algorithm analyzes 113 job postings across 14 industries,
              matching your skills, location preference, salary expectation, and experience
              to find the most suitable opportunities for you.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Stats (when results exist) ── */}
        {matchResults && (
          <ScrollReveal delay={0.1}>
            <div className="mb-6">
              <MatchStats matches={matchResults} />
            </div>
          </ScrollReveal>
        )}

        {/* ── Filter Panel ── */}
        <ScrollReveal delay={0.15}>
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={runMatching}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </ScrollReveal>

        {/* ── Sort Bar ── */}
        {matchResults && filteredResults.length > 0 && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SortBar
              total={filteredResults.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterScore={minScoreFilter}
              onFilterScoreChange={setMinScoreFilter}
            />
          </motion.div>
        )}

        {/* ── Results Grid ── */}
        {isAnalyzing ? (
          <div className="text-center py-20">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-gold/20"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
            </div>
            <p className="text-charcoal font-semibold mb-1">AI Analyzing Jobs...</p>
            <p className="text-warm-gray text-sm">Matching your profile with 113 positions</p>
            {/* Progress animation */}
            <div className="max-w-xs mx-auto mt-4 h-1.5 bg-cream rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredResults.map((match, i) => (
              <MatchCard
                key={match.job.id}
                match={match}
                index={i}
                onApply={handleApply}
              />
            ))}
          </div>
        ) : matchResults ? (
          /* No results after filtering */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-warm-gray" />
            </div>
            <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
              No matching jobs found
            </h3>
            <p className="text-warm-gray text-sm mb-4">
              Try adjusting your filters or lowering the minimum score threshold.
            </p>
            <button
              onClick={() => {
                setMinScoreFilter(0);
                setFilters({
                  selectedSkills: [],
                  selectedLocations: [],
                  salaryRange: [0, 3000],
                  selectedExpId: null,
                });
              }}
              className="text-sm text-gold hover:text-gold-dark font-semibold flex items-center gap-1 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          /* Initial empty state */
          <EmptyState onConfigure={() => setShowFilters(true)} />
        )}

        {/* ── Algorithm Explanation ── */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 bg-white rounded-2xl border border-sand p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  How AI Matching Works
                </h3>
                <p className="text-xs text-warm-gray">Multi-dimensional scoring algorithm</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Skill Match',
                  weight: '40%',
                  desc: 'Analyzes job titles, descriptions, and requirements against your selected skills. Supports semantic matching across industries.',
                  color: 'bg-gold/10 text-gold',
                  barColor: 'bg-gold',
                  icon: <Zap className="w-5 h-5" />,
                },
                {
                  title: 'Location Match',
                  weight: '25%',
                  desc: 'Matches your preferred work locations with job postings. Exact city matches score highest.',
                  color: 'bg-emerald/10 text-emerald',
                  barColor: 'bg-emerald',
                  icon: <MapPin className="w-5 h-5" />,
                },
                {
                  title: 'Salary Match',
                  weight: '20%',
                  desc: 'Compares your expected salary range with job offerings. Overlapping ranges score highest.',
                  color: 'bg-blue-100 text-blue-600',
                  barColor: 'bg-blue-500',
                  icon: <DollarSign className="w-5 h-5" />,
                },
                {
                  title: 'Experience Match',
                  weight: '15%',
                  desc: 'Aligns your experience level with job requirements. Parses year ranges and level labels.',
                  color: 'bg-coral/10 text-coral',
                  barColor: 'bg-coral',
                  icon: <Award className="w-5 h-5" />,
                },
              ].map((dim) => (
                <div
                  key={dim.title}
                  className="bg-warm-white rounded-xl p-4 border border-sand/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 ${dim.color} rounded-lg flex items-center justify-center`}>
                      {dim.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal">{dim.title}</h4>
                      <span className={`text-xs font-bold ${dim.color.split(' ')[1]}`}>
                        {dim.weight}
                      </span>
                    </div>
                  </div>
                  <div className={`h-1.5 ${dim.barColor} rounded-full mb-2`} style={{
                    width: dim.weight.replace('%', '') + '%',
                  }} />
                  <p className="text-[11px] text-warm-gray leading-relaxed">{dim.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-cream rounded-lg border border-sand">
              <p className="text-[11px] text-warm-gray leading-relaxed">
                <span className="font-semibold text-charcoal">Formula: </span>
                Overall Score = (Skill × 0.40) + (Location × 0.25) + (Salary × 0.20) + (Experience × 0.15)
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
