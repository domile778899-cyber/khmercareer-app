import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { coursesApi } from '../api/coursesApi';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Play,
  ChevronRight,
  Cpu,
  ArrowRight,
  User,
  GraduationCap,
  HeartHandshake,
  Filter,
  Globe,
  Code,
  Briefcase,
  Palette,
  Megaphone,
  Sparkles,
  Factory,
  Hotel,
} from 'lucide-react';

/* ──────────────────────── Animation helpers ──────────────────────── */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

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
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────── Types ──────────────────────── */

interface Course {
  id: number;
  title: string;
  teacher: string;
  category: string;
  price: number | null;
  rating: number;
  reviews: number;
  students: number;
  duration: string;
  isAiGenerated?: boolean;
}

interface Teacher {
  id: number;
  name: string;
  specialty: string;
  courses: number;
  students: number;
  rating: number;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const categories = [
  { label: 'All', icon: BookOpen },
  { label: 'English', icon: Globe },
  { label: 'Chinese', icon: Globe },
  { label: 'Khmer', icon: BookOpen },
  { label: 'IT Skills', icon: Code },
  { label: 'Business', icon: Briefcase },
  { label: 'Design', icon: Palette },
  { label: 'Marketing', icon: Megaphone },
  { label: 'Personal Development', icon: Sparkles },
  { label: 'Factory Skills', icon: Factory },
  { label: 'Hospitality', icon: Hotel },
];

const courses: Course[] = [
  { id: 1, title: 'Business English Mastery', teacher: 'John Smith', category: 'English', price: 19.99, rating: 4.9, reviews: 245, students: 1245, duration: '18h' },
  { id: 2, title: '中文商务沟通', teacher: '李老师', category: 'Chinese', price: 15.99, rating: 4.8, reviews: 156, students: 892, duration: '15h' },
  { id: 3, title: 'Excel for Factory Management', teacher: 'Sopheap Rith', category: 'Factory Skills', price: 8.99, rating: 4.7, reviews: 340, students: 2340, duration: '10h' },
  { id: 4, title: 'Introduction to Digital Marketing', teacher: 'Sarah Johnson', category: 'Marketing', price: 12.99, rating: 4.8, reviews: 128, students: 756, duration: '12h' },
  { id: 5, title: 'Garment Quality Control', teacher: 'Ming Zhang', category: 'Factory Skills', price: null, rating: 4.6, reviews: 512, students: 3102, duration: '8h' },
  { id: 6, title: 'Hotel Service Excellence', teacher: 'Sopheap Rith', category: 'Hospitality', price: null, rating: 4.9, reviews: 198, students: 1890, duration: '10h' },
  { id: 7, title: 'Python Programming Basics', teacher: 'Kimly Chea', category: 'IT Skills', price: 24.99, rating: 4.7, reviews: 89, students: 567, duration: '20h' },
  { id: 8, title: '中文口语速成', teacher: '王老师', category: 'Chinese', price: 9.99, rating: 4.5, reviews: 203, students: 1123, duration: '8h' },
  { id: 9, title: 'Leadership & Team Management', teacher: 'David Chen', category: 'Business', price: 29.99, rating: 4.8, reviews: 67, students: 423, duration: '16h' },
  { id: 10, title: 'Photoshop for Beginners', teacher: 'Lisa Wong', category: 'Design', price: 14.99, rating: 4.6, reviews: 145, students: 678, duration: '12h' },
  { id: 11, title: 'Workplace Safety Fundamentals', teacher: 'Ming Zhang', category: 'Factory Skills', price: null, rating: 4.7, reviews: 420, students: 2560, duration: '6h' },
  { id: 12, title: 'Customer Service English', teacher: 'John Smith', category: 'English', price: 11.99, rating: 4.8, reviews: 176, students: 987, duration: '9h' },
];

const teachers: Teacher[] = [
  { id: 1, name: 'John Smith', specialty: 'English Language', courses: 8, students: 4500, rating: 4.9 },
  { id: 2, name: '李老师', specialty: 'Chinese Business', courses: 5, students: 3200, rating: 4.8 },
  { id: 3, name: 'Sopheap Rith', specialty: 'Factory & Hospitality', courses: 6, students: 5800, rating: 4.8 },
  { id: 4, name: 'Ming Zhang', specialty: 'Quality & Safety', courses: 4, students: 4100, rating: 4.7 },
];

const aiCourses: Course[] = [
  { id: 101, title: 'AI-Powered English Conversation', teacher: 'AI Tutor', category: 'English', price: 5.99, rating: 4.7, reviews: 89, students: 1200, duration: '10h', isAiGenerated: true },
  { id: 102, title: 'Smart Resume Builder Workshop', teacher: 'AI Tutor', category: 'Personal Development', price: 3.99, rating: 4.8, reviews: 56, students: 890, duration: '6h', isAiGenerated: true },
  { id: 103, title: 'AI Interview Preparation', teacher: 'AI Tutor', category: 'Personal Development', price: 7.99, rating: 4.6, reviews: 42, students: 650, duration: '8h', isAiGenerated: true },
];

const categoryTranslationMap: Record<string, string> = {
  'All': 'courses.categories.all',
  'English': 'courses.categories.english',
  'Chinese': 'courses.categories.chinese',
  'Khmer': 'courses.categories.khmer',
  'IT Skills': 'courses.categories.itSkills',
  'Business': 'courses.categories.business',
  'Design': 'courses.categories.design',
  'Marketing': 'courses.categories.marketing',
  'Personal Development': 'courses.categories.personalDevelopment',
  'Factory Skills': 'courses.categories.factorySkills',
  'Hospitality': 'courses.categories.hospitality',
};

/* ──────────────────────── Section 1: Hero ──────────────────────── */

function HeroSection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const stats = [
    { value: '120+', label: t('courses.courses') },
    { value: '50+', label: t('courses.teachers') },
    { value: '15K+', label: t('courses.students') },
    { value: '95%', label: t('courses.satisfaction') },
  ];

  return (
    <section className="relative bg-deep-brown overflow-hidden">
      {/* Gold accent pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide py-16 md:py-24 lg:py-32">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          {/* Trilingual title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mb-3">
            {t('courses.title')}
          </h1>
          <p className="font-khmer text-xl sm:text-2xl text-gold mb-1">{t('courses.titleKm')}</p>
          <p className="font-chinese text-lg sm:text-xl text-gold-light mb-6">{t('courses.titleZh')}</p>

          <p className="text-warm-gray text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('courses.subtitle')}
          </p>

          {/* Search bar + Category filter */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('courses.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 bg-charcoal border-2 border-sand/20 rounded-xl text-warm-white placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
            <div className="relative sm:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-charcoal border-2 border-sand/20 rounded-xl text-warm-white appearance-none focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {t(categoryTranslationMap[cat.label] || 'courses.categories.all')}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-charcoal/60 border border-sand/10 rounded-xl px-4 py-5"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-warm-gray text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 2: Category Filters ──────────────────────── */

function CategoryFilters({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <ScrollReveal>
      <section className="bg-warm-white py-8 border-b border-sand">
        <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => onCategoryChange(cat.label)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap snap-start transition-all duration-300 flex-shrink-0 ${
                    isActive
                      ? 'bg-gold text-deep-brown font-semibold shadow-gold'
                      : 'bg-cream text-charcoal hover:bg-sand border border-sand'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t(categoryTranslationMap[cat.label] || 'courses.categories.all')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

/* ──────────────────────── Section 3: Featured Courses ──────────────────────── */

function CourseCard({ course, index }: { course: Course; index: number }) {
  const { t } = useTranslation();

  const categoryColors: Record<string, string> = {
    English: 'bg-blue-50 text-blue-700',
    Chinese: 'bg-red-50 text-red-700',
    Khmer: 'bg-purple-50 text-purple-700',
    'IT Skills': 'bg-indigo-50 text-indigo-700',
    Business: 'bg-amber-50 text-amber-700',
    Design: 'bg-pink-50 text-pink-700',
    Marketing: 'bg-orange-50 text-orange-700',
    'Personal Development': 'bg-teal-50 text-teal-700',
    'Factory Skills': 'bg-gray-100 text-gray-700',
    Hospitality: 'bg-cyan-50 text-cyan-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: easeSmooth }}
    >
      <Link to={`/courses/${course.id}`}>
        <motion.div
          className="bg-white border border-sand rounded-2xl overflow-hidden shadow-card cursor-pointer h-full flex flex-col"
          whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(26,23,20,0.12)', borderColor: '#D4AF37' }}
          transition={{ duration: 0.3, ease: easeSmooth }}
        >
          {/* Thumbnail */}
          <div className="relative h-44 bg-gradient-to-br from-charcoal via-deep-brown to-charcoal flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gold blur-2xl" />
            </div>
            <Play className="w-12 h-12 text-gold/80 relative z-10" />
            {course.price === null && (
              <span className="absolute top-3 left-3 bg-emerald text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t('common.free')}
              </span>
            )}
            {course.isAiGenerated && (
              <span className="absolute top-3 right-3 bg-gold/90 text-deep-brown text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                AI
              </span>
            )}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <span
              className={`inline-block self-start text-xs font-medium px-3 py-1 rounded-full mb-3 ${
                categoryColors[course.category] || 'bg-cream text-charcoal'
              }`}
            >
              {t(categoryTranslationMap[course.category] || course.category)}
            </span>

            <h3 className="font-display text-lg font-semibold text-charcoal mb-2 line-clamp-2 leading-snug">
              {course.title}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center">
                <User className="w-4 h-4 text-warm-gray" />
              </div>
              <span className="text-sm text-warm-gray">{course.teacher}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-semibold text-charcoal">{course.rating}</span>
              </div>
              <span className="text-xs text-warm-gray">({course.reviews} {t('courses.reviews')})</span>
              <span className="text-warm-gray mx-1">·</span>
              <span className="text-xs text-warm-gray">{course.students.toLocaleString()} {t('courses.students')}</span>
            </div>

            <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
              {course.price !== null ? (
                <span className="text-xl font-bold text-charcoal font-display">
                  ${course.price.toFixed(2)}
                </span>
              ) : (
                <span className="text-lg font-bold text-emerald font-display">{t('common.free')}</span>
              )}
              <span className="text-xs text-warm-gray flex items-center gap-1">
                <Play className="w-3 h-3" />
                {course.duration}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function FeaturedCourses({
  activeCategory,
  searchQuery,
}: {
  activeCategory: string;
  searchQuery: string;
}) {
  const { t } = useTranslation();
  const [apiCourses, setApiCourses] = useState<typeof courses>(courses);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    setIsLoadingCourses(true);
    coursesApi.getCourses({ limit: 100 } as any)
      .then((res) => {
        const fetched = (res.courses || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          teacher: c.instructor?.name || c.instructorName || c.teacher || 'Instructor',
          category: c.category || 'General',
          price: c.price ?? null,
          rating: c.rating || 4.5,
          reviews: c.reviewCount || c.reviews || 0,
          students: c.enrollmentCount || c.students || 0,
          duration: c.duration || '—',
        }));
        if (fetched.length > 0) setApiCourses(fetched);
      })
      .catch(() => { /* keep static data */ })
      .finally(() => setIsLoadingCourses(false));
  }, []);

  const filtered = apiCourses.filter((c) => {
    const matchCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">
                {t('courses.featured')}
              </h2>
              <p className="text-warm-gray text-sm sm:text-base">
                {t('courses.featuredSubtitle')}
              </p>
            </div>
            <span className="text-sm text-warm-gray bg-cream px-4 py-2 rounded-full">
              {filtered.length} {t('courses.coursesCount')}
            </span>
          </div>
        </ScrollReveal>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">{t('courses.noCourses')}</h3>
            <p className="text-warm-gray">{t('courses.noCoursesDesc')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────── Section 4: Top Teachers ──────────────────────── */

function TeachersSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              {t('courses.topTeachers')}
            </h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              {t('courses.topTeachersSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeSmooth }}
              className="bg-white border border-sand rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover hover:border-gold transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-9 h-9 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal mb-1">
                {teacher.name}
              </h3>
              <p className="text-sm text-warm-gray mb-4">{teacher.specialty}</p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-charcoal">{teacher.courses}</div>
                  <div className="text-xs text-warm-gray">{t('courses.courses')}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-charcoal">
                    {(teacher.students / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-warm-gray">{t('courses.students')}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="text-sm font-bold text-charcoal">{teacher.rating}</span>
                  </div>
                  <div className="text-xs text-warm-gray">{t('courses.satisfaction')}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 5: AI Generated Courses Banner ──────────────────────── */

function AiCoursesSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-deep-brown py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Cpu className="w-4 h-4" />
                {t('courses.aiLearning')}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warm-white mb-2">
                {t('courses.aiCourses')}
              </h2>
              <p className="text-warm-gray max-w-xl">
                {t('courses.aiSubtitle')}
              </p>
            </div>
            <Link
              to="/ai-generate"
              className="inline-flex items-center gap-2 bg-gold text-deep-brown px-6 py-3 rounded-xl font-semibold shadow-gold hover:bg-gold-dark hover:shadow-gold-hover transition-all duration-300 hover:scale-103 flex-shrink-0"
            >
              <Sparkles className="w-5 h-5" />
              {t('courses.tryAIGenerator')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeSmooth }}
            >
              <Link to={`/courses/${course.id}`}>
                <motion.div
                  className="bg-charcoal/80 border border-gold/20 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
                  whileHover={{ y: -6, borderColor: '#D4AF37' }}
                  transition={{ duration: 0.3, ease: easeSmooth }}
                >
                  <div className="relative h-40 bg-gradient-to-br from-charcoal via-deep-brown to-charcoal flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gold blur-xl" />
                    </div>
                    <Cpu className="w-10 h-10 text-gold relative z-10" />
                    <span className="absolute top-3 right-3 bg-gold text-deep-brown text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <span className="inline-block self-start text-xs font-medium px-3 py-1 rounded-full bg-gold/10 text-gold mb-3">
                      {t(categoryTranslationMap[course.category] || course.category)}
                    </span>
                    <h3 className="font-display text-base font-semibold text-warm-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-4 h-4 text-gold" />
                      <span className="text-sm text-warm-gray">{course.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-sm font-semibold text-warm-white">{course.rating}</span>
                      <span className="text-xs text-warm-gray">({course.reviews})</span>
                      <span className="text-warm-gray mx-1">·</span>
                      <span className="text-xs text-warm-gray">{course.students.toLocaleString()} {t('courses.students')}</span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-sand/20 flex items-center justify-between">
                      <span className="text-lg font-bold text-gold font-display">
                        ${course.price?.toFixed(2)}
                      </span>
                      <span className="text-xs text-gold/70 flex items-center gap-1">
                        {t('courses.aiGenerated')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 6: CTA ──────────────────────── */

function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <motion.div
            className="bg-gradient-to-br from-emerald to-emerald/80 rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3, ease: easeSmooth }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <HeartHandshake className="w-14 h-14 text-white mx-auto mb-6" />
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('courses.ctaTitle')}
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8">
                {t('courses.ctaSubtitle')}
              </p>
              <Link
                to="/teach"
                className="inline-flex items-center gap-2 bg-white text-emerald px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-cream transition-all duration-300 hover:scale-103"
              >
                <GraduationCap className="w-5 h-5" />
                {t('courses.becomeTeacher')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 7: Pagination ──────────────────────── */

function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <section className="bg-warm-white pb-12 md:pb-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-sand text-charcoal hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {t('courses.previous')}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                page === currentPage
                  ? 'bg-gold text-deep-brown shadow-gold'
                  : 'border border-sand text-charcoal hover:bg-cream'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-sand text-charcoal hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {t('courses.next')}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Main Page Component ──────────────────────── */

export default function CourseMarket() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-warm-white">
      <HeroSection />
      <CategoryFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <FeaturedCourses activeCategory={activeCategory} searchQuery={searchQuery} />
      <TeachersSection />
      <AiCoursesSection />
      <CtaSection />
      <Pagination totalPages={2} currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}
