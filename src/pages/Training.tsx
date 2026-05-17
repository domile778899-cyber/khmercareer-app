import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Languages,
  Scissors,
  UtensilsCrossed,
  Monitor,
  GraduationCap,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Award,
  Building2,
  ChevronRight,
  Play,
  Mail,
  Shield,
  FileSpreadsheet,
  Globe,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

/* ──────────────────────── Animation helpers ──────────────────────── */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

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

/* ──────────────────────── Section 1: Hero ──────────────────────── */

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { icon: BookOpen, label: 'Courses', value: '120+' },
    { icon: Users, label: 'Learners', value: '50K+' },
    { icon: TrendingUp, label: 'Job Placement', value: '85%' },
    { icon: Languages, label: 'Languages', value: '3' },
  ];

  return (
    <section className="relative bg-deep-brown pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <motion.div
          className="text-center max-w-[800px] mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={childFadeUp}
            className="text-gold text-caption font-semibold tracking-widest uppercase mb-4"
          >
            វិទ្យាស្ថានជំនាញ &middot; Skills Academy &middot; 技能学院
          </motion.p>

          <motion.h1
            variants={childFadeUp}
            className="text-hero-title font-display text-warm-white mb-6"
          >
            Learn Skills That
            <span className="text-gold"> Get You Hired</span>
          </motion.h1>

          <motion.p
            variants={childFadeUp}
            className="text-body-large text-warm-gray mb-8 max-w-[600px] mx-auto"
          >
            Free and affordable vocational training to help you land better jobs. Learn from industry experts in garment, hospitality, IT, and languages.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={childFadeUp}
            className="relative max-w-[600px] mx-auto mb-10"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-warm-gray" size={20} />
              <input
                type="text"
                placeholder="Search for courses (e.g. Sewing, Excel, English...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#2D2926] border-2 border-sand/30 text-warm-white placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body"
              />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={childFadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="#courses"
              className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
            >
              Browse Courses
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              to="#learning-paths"
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center hover:bg-gold/10 transition-all duration-200"
            >
              My Learning
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={childFadeUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon size={28} className="text-gold" />
                <span className="text-stat-number font-display text-warm-white">
                  {stat.value}
                </span>
                <span className="text-body-small text-warm-gray">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 2: Learning Paths ──────────────────────── */

interface PathStep {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

interface LearningPath {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  steps: PathStep[];
  courseCount: number;
  duration: string;
}

const learningPaths: LearningPath[] = [
  {
    id: 'garment',
    title: 'Garment Manufacturing',
    icon: Scissors,
    color: '#D4AF37',
    steps: [
      { title: 'Sewing', icon: Scissors },
      { title: 'Quality Control', icon: CheckCircle2 },
      { title: 'Production Supervisor', icon: Users },
      { title: 'Factory Manager', icon: Building2 },
    ],
    courseCount: 28,
    duration: '6 months',
  },
  {
    id: 'hospitality',
    title: 'Hospitality & Tourism',
    icon: UtensilsCrossed,
    color: '#E85D3E',
    steps: [
      { title: 'Service Basics', icon: HeartHandshake },
      { title: 'Front Desk', icon: Building2 },
      { title: 'Restaurant Management', icon: UtensilsCrossed },
      { title: 'Hotel Operations', icon: Sparkles },
    ],
    courseCount: 24,
    duration: '8 months',
  },
  {
    id: 'digital',
    title: 'Digital Skills',
    icon: Monitor,
    color: '#059669',
    steps: [
      { title: 'Computer Basics', icon: Monitor },
      { title: 'Excel / Office', icon: FileSpreadsheet },
      { title: 'Digital Marketing', icon: TrendingUp },
      { title: 'Data Analysis', icon: Globe },
    ],
    courseCount: 32,
    duration: '5 months',
  },
  {
    id: 'language',
    title: 'Language Skills',
    icon: Languages,
    color: '#2563EB',
    steps: [
      { title: 'Basic English', icon: BookOpen },
      { title: 'Business English', icon: BriefcaseIcon },
      { title: 'Basic Chinese', icon: Languages },
      { title: 'Business Chinese', icon: BriefcaseIcon },
    ],
    courseCount: 20,
    duration: '12 months',
  },
];

function BriefcaseIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function LearningPathCard({ path, index }: { path: LearningPath; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: easeSmooth }}
      className="bg-white border border-sand rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 hover:border-gold/40 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${path.color}15` }}
        >
          <path.icon size={24} style={{ color: path.color }} />
        </div>
        <div>
          <h3 className="text-h4 font-display text-charcoal">{path.title}</h3>
          <p className="text-caption text-warm-gray">
            {path.courseCount} courses &middot; {path.duration}
          </p>
        </div>
      </div>

      {/* Steps Roadmap */}
      <div className="relative pl-4 mb-5">
        <div
          className="absolute left-[19px] top-2 bottom-2 w-0.5 rounded-full"
          style={{ backgroundColor: `${path.color}30` }}
        />
        {path.steps.map((step) => (
          <div key={step.title} className="relative flex items-center gap-3 mb-4 last:mb-0">
            <div
              className="w-3 h-3 rounded-full border-2 bg-white z-10 shrink-0"
              style={{ borderColor: path.color }}
            />
            <div className="flex items-center gap-2">
              <step.icon size={14} style={{ color: path.color }} />
              <span className="text-body-small text-charcoal">{step.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3 rounded-xl text-button-small font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          backgroundColor: `${path.color}10`,
          color: path.color,
          border: `1.5px solid ${path.color}30`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = path.color;
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${path.color}10`;
          e.currentTarget.style.color = path.color;
        }}
      >
        Start Path
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

function LearningPathsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white" id="learning-paths">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Career Tracks
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Follow a structured curriculum designed by industry experts. Each path takes you from beginner to job-ready.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path, i) => (
            <LearningPathCard key={path.id} path={path} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 3: Featured Courses ──────────────────────── */

type CourseCategory = 'Garment' | 'Tourism' | 'IT' | 'Language';

interface Course {
  id: number;
  title: string;
  category: CourseCategory;
  instructor: string;
  instructorInitial: string;
  rating: number;
  reviews: number;
  duration: string;
  price: string;
  learners: number;
  enrolled?: boolean;
  progress?: number;
  gradient: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Basic Sewing for Garment Workers',
    category: 'Garment',
    instructor: 'Sopheap Meas',
    instructorInitial: 'S',
    rating: 4.8,
    reviews: 2341,
    duration: '8 hrs',
    price: 'FREE',
    learners: 2341,
    gradient: 'from-amber-500 to-yellow-600',
    icon: Scissors,
  },
  {
    id: 2,
    title: 'Hotel Service Excellence',
    category: 'Tourism',
    instructor: 'Ratanak Seng',
    instructorInitial: 'R',
    rating: 4.9,
    reviews: 1892,
    duration: '10 hrs',
    price: 'FREE',
    learners: 1892,
    gradient: 'from-rose-500 to-red-600',
    icon: UtensilsCrossed,
  },
  {
    id: 3,
    title: 'Computer Basics for Beginners',
    category: 'IT',
    instructor: 'Dara Chhin',
    instructorInitial: 'D',
    rating: 4.7,
    reviews: 5102,
    duration: '6 hrs',
    price: 'FREE',
    learners: 5102,
    gradient: 'from-emerald-500 to-green-600',
    icon: Monitor,
  },
  {
    id: 4,
    title: 'Business English Communication',
    category: 'Language',
    instructor: 'Emma Wilson',
    instructorInitial: 'E',
    rating: 4.6,
    reviews: 890,
    duration: '15 hrs',
    price: '$12',
    learners: 890,
    gradient: 'from-blue-500 to-indigo-600',
    icon: Languages,
  },
  {
    id: 5,
    title: 'Excel for Factory Administration',
    category: 'IT',
    instructor: 'Chhaya Sok',
    instructorInitial: 'C',
    rating: 4.8,
    reviews: 1456,
    duration: '8 hrs',
    price: '$8',
    learners: 1456,
    gradient: 'from-teal-500 to-cyan-600',
    icon: FileSpreadsheet,
  },
  {
    id: 6,
    title: 'Chinese Language for Workplace',
    category: 'Language',
    instructor: 'Li Wei Zhang',
    instructorInitial: 'L',
    rating: 4.5,
    reviews: 723,
    duration: '20 hrs',
    price: '$15',
    learners: 723,
    enrolled: true,
    progress: 35,
    gradient: 'from-red-500 to-orange-600',
    icon: Globe,
  },
];

const categoryColors: Record<CourseCategory, string> = {
  Garment: 'bg-amber-100 text-amber-800',
  Tourism: 'bg-rose-100 text-rose-800',
  IT: 'bg-emerald-100 text-emerald-800',
  Language: 'bg-blue-100 text-blue-800',
};

function CourseCard({ course, index }: { course: Course; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: easeSmooth }}
      whileHover={{ y: -4 }}
      className="bg-white border border-sand rounded-2xl overflow-hidden hover:shadow-card-hover hover:border-gold/40 transition-all duration-300 group"
    >
      {/* Thumbnail */}
      <div
        className={`h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center relative`}
      >
        <course.icon
          size={48}
          className="text-white/80 group-hover:scale-110 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-caption font-medium ${categoryColors[course.category]}`}
        >
          {course.category}
        </span>
        {course.price === 'FREE' ? (
          <span className="absolute top-3 right-3 bg-emerald text-white px-3 py-1 rounded-full text-caption font-medium">
            FREE
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-gold text-deep-brown px-3 py-1 rounded-full text-caption font-semibold">
            {course.price}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-h4 font-display text-charcoal mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-caption font-bold text-gold-dark">
            {course.instructorInitial}
          </div>
          <span className="text-body-small text-warm-gray">
            {course.instructor}
          </span>
        </div>

        {/* Rating & Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-gold fill-gold" />
            <span className="text-body-small font-medium text-charcoal">
              {course.rating}
            </span>
            <span className="text-body-small text-warm-gray">
              ({course.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-1 text-warm-gray">
            <Clock size={14} />
            <span className="text-body-small">{course.duration}</span>
          </div>
        </div>

        {/* Enrolled Progress OR Enroll Button */}
        {course.enrolled && course.progress !== undefined ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption text-warm-gray">
                {course.progress}% complete
              </span>
              <span className="text-caption text-gold font-medium">
                Continue
              </span>
            </div>
            <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button className="w-full py-3 bg-cream text-charcoal rounded-xl text-button-small font-semibold hover:bg-gold hover:text-deep-brown transition-all duration-200 flex items-center justify-center gap-2">
            <Play size={16} />
            Enroll Now
          </button>
        )}
      </div>
    </motion.div>
  );
}

function FeaturedCoursesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream" id="courses">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Popular Courses
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            Featured Courses
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Start learning today with our most popular courses, designed for Cambodian job seekers.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 4: Course Categories ──────────────────────── */

const categories = [
  { label: 'All', count: 120 },
  { label: 'Garment & Textile', count: 28 },
  { label: 'Hospitality', count: 24 },
  { label: 'IT & Digital', count: 32 },
  { label: 'Languages', count: 20 },
  { label: 'Management', count: 10 },
  { label: 'Safety', count: 4 },
  { label: 'Soft Skills', count: 2 },
];

function CategoryPills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8 bg-warm-white border-y border-sand">
      <div className="relative mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        {/* Scroll buttons */}
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-sand rounded-full shadow-card flex items-center justify-center text-charcoal hover:text-gold hover:border-gold transition-colors"
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
        )}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-sand rounded-full shadow-card flex items-center justify-center text-charcoal hover:text-gold hover:border-gold transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-body-small font-medium transition-all duration-200 border ${
                activeCategory === cat.label
                  ? 'bg-gold text-deep-brown border-gold shadow-gold'
                  : 'bg-white text-charcoal border-sand hover:border-gold hover:text-gold'
              }`}
            >
              {cat.label}
              <span
                className={`ml-1.5 text-caption ${
                  activeCategory === cat.label
                    ? 'text-deep-brown/60'
                    : 'text-warm-gray'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 5: Certifications ──────────────────────── */

interface CertInfo {
  title: string;
  org: string;
  orgShort: string;
  description: string;
  validity: string;
  howToEarn: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  bgLight: string;
}

const certifications: CertInfo[] = [
  {
    title: 'Garment Skill Certificate',
    org: 'Garment Manufacturers Association in Cambodia',
    orgShort: 'GMAC',
    description:
      'Industry-recognized certification for garment production skills including sewing, quality control, and production management.',
    validity: 'Valid for 3 years',
    howToEarn: 'Complete 5 core garment courses + practical assessment',
    icon: Scissors,
    color: '#D4AF37',
    bgLight: '#FEF9E7',
  },
  {
    title: 'Hospitality Service Certificate',
    org: 'Cambodia Tourism and Hospitality Association',
    orgShort: 'CTHA',
    description:
      'Recognized by hotels and restaurants across Cambodia for front desk, housekeeping, and food service skills.',
    validity: 'Valid for 2 years',
    howToEarn: 'Complete 4 hospitality courses + 40-hour internship',
    icon: UtensilsCrossed,
    color: '#E85D3E',
    bgLight: '#FDF2EF',
  },
  {
    title: 'Digital Literacy Certificate',
    org: 'Ministry of Education, Youth and Sports',
    orgShort: 'MoEYS',
    description:
      'Government-backed certification proving competency in computer skills, office applications, and internet usage.',
    validity: 'Lifetime validity',
    howToEarn: 'Pass the digital literacy assessment test',
    icon: Monitor,
    color: '#059669',
    bgLight: '#ECFDF5',
  },
];

function CertificationsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Credentials
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            Earn Industry-Recognized Certificates
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Complete courses and earn certificates recognised by top employers in Cambodia.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white border border-sand rounded-2xl p-6 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col"
              >
                {/* Header */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: cert.bgLight }}
                >
                  <cert.icon size={28} style={{ color: cert.color }} />
                </div>

                <h3 className="text-h4 font-display text-charcoal mb-1">
                  {cert.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <Shield size={14} style={{ color: cert.color }} />
                  <span className="text-caption font-medium" style={{ color: cert.color }}>
                    Recognised by {cert.orgShort}
                  </span>
                </div>

                <p className="text-body-small text-warm-gray mb-4 flex-1">
                  {cert.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-5 pt-4 border-t border-sand">
                  <div className="flex items-start gap-2">
                    <Award size={14} className="text-warm-gray mt-0.5 shrink-0" />
                    <span className="text-caption text-charcoal">
                      {cert.validity}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-warm-gray mt-0.5 shrink-0" />
                    <span className="text-caption text-charcoal">
                      {cert.howToEarn}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-xl text-button-small font-semibold border transition-all duration-200"
                  style={{
                    borderColor: cert.color,
                    color: cert.color,
                    backgroundColor: `${cert.color}08`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = cert.color;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${cert.color}08`;
                    e.currentTarget.style.color = cert.color;
                  }}
                >
                  View Requirements
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 6: Corporate Training ──────────────────────── */

function CorporateTrainingSection() {
  const features = [
    { icon: Users, text: 'Bulk enrollment for your entire team' },
    { icon: BookOpen, text: 'Custom curriculum tailored to your industry' },
    { icon: TrendingUp, text: 'Real-time progress tracking & reporting' },
    { icon: Award, text: 'Company-branded certificates' },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <div className="bg-deep-brown rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content */}
            <ScrollReveal className="p-8 lg:p-12 flex flex-col justify-center">
              <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
                For Employers
              </p>
              <h2 className="text-h2 font-display text-warm-white mb-4">
                Corporate Training Solutions
              </h2>
              <p className="text-body-large text-warm-gray mb-8">
                Upskill your workforce with our tailored corporate training programs. From garment factories to hotels, we help you build a skilled team.
              </p>

              <div className="space-y-4 mb-8">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <f.icon size={18} className="text-gold" />
                    </div>
                    <span className="text-body text-warm-white/90">{f.text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] inline-flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 w-fit"
              >
                Request Corporate Training
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </ScrollReveal>

            {/* Decorative visual */}
            <div className="hidden lg:flex items-center justify-center relative bg-[#2D2926] p-12">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gold rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald rounded-full blur-[80px]" />
              </div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="bg-[#1A1714] border border-sand/20 rounded-2xl p-6 text-center">
                  <Building2 size={32} className="text-gold mx-auto mb-3" />
                  <span className="text-stat-number font-display text-warm-white block">200+</span>
                  <span className="text-body-small text-warm-gray">Partner Companies</span>
                </div>
                <div className="bg-[#1A1714] border border-sand/20 rounded-2xl p-6 text-center">
                  <GraduationCap size={32} className="text-emerald mx-auto mb-3" />
                  <span className="text-stat-number font-display text-warm-white block">15K</span>
                  <span className="text-body-small text-warm-gray">Employees Trained</span>
                </div>
                <div className="bg-[#1A1714] border border-sand/20 rounded-2xl p-6 text-center col-span-2">
                  <div className="flex items-center justify-center gap-4">
                    <Award size={32} className="text-gold" />
                    <div className="text-left">
                      <span className="text-h3 font-display text-warm-white block">98% Satisfaction</span>
                      <span className="text-body-small text-warm-gray">From corporate clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 7: Success Stories ──────────────────────── */

interface SuccessStory {
  name: string;
  previousRole: string;
  newRole: string;
  salaryIncrease: string;
  quote: string;
  initial: string;
  bgColor: string;
}

const successStories: SuccessStory[] = [
  {
    name: 'Srey Mao',
    previousRole: 'Garment Sewing Operator',
    newRole: 'Quality Control Supervisor',
    salaryIncrease: '+65%',
    quote:
      'The garment training courses changed my life. I learned quality control techniques that helped me get promoted within 3 months. Now I earn much more and have better working conditions.',
    initial: 'S',
    bgColor: '#D4AF37',
  },
  {
    name: 'Vannak Pen',
    previousRole: 'Hotel Cleaner',
    newRole: 'Front Desk Manager',
    salaryIncrease: '+120%',
    quote:
      'I started with the basic hospitality course and kept going. The certificates I earned made my CV stand out. KhmerHR training gave me confidence to apply for management positions.',
    initial: 'V',
    bgColor: '#E85D3E',
  },
  {
    name: 'Chandara Heng',
    previousRole: 'Unemployed',
    newRole: 'Data Entry Specialist',
    salaryIncrease: '+200%',
    quote:
      'After finishing the computer basics and Excel courses, I got hired at an NGO. The skills are practical and the instructors explain everything clearly in Khmer.',
    initial: 'C',
    bgColor: '#059669',
  },
];

function SuccessStoriesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal className="text-center mb-12">
          <p className="text-gold text-caption font-semibold tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-h2 font-display text-charcoal mb-4">
            Success Stories
          </h2>
          <p className="text-body text-warm-gray max-w-[600px] mx-auto">
            Real Cambodian workers who transformed their careers through our training programs.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, i) => (
            <ScrollReveal key={story.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-cream border border-sand rounded-2xl p-6 hover:shadow-feature hover:border-gold/30 transition-all duration-300 h-full flex flex-col"
              >
                {/* Quote mark */}
                <span className="text-gold text-4xl font-display leading-none mb-4">
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="text-body text-charcoal mb-6 flex-1 italic">
                  {story.quote}
                </p>

                {/* Salary badge */}
                <div className="inline-flex items-center gap-1.5 bg-emerald/10 text-emerald px-3 py-1.5 rounded-full text-caption font-semibold mb-5 w-fit">
                  <TrendingUp size={14} />
                  {story.salaryIncrease} salary increase
                </div>

                {/* Person */}
                <div className="flex items-center gap-3 pt-4 border-t border-sand">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: story.bgColor }}
                  >
                    {story.initial}
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">
                      {story.name}
                    </p>
                    <p className="text-caption text-warm-gray">
                      {story.previousRole} &rarr; {story.newRole}
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Section 8: CTA ──────────────────────── */

function CTASection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-emerald/5 border border-gold/20 rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="text-h2 font-display text-charcoal mb-4">
              Start Learning Today — It&apos;s Free!
            </h2>
            <p className="text-body-large text-warm-gray mb-8 max-w-[500px] mx-auto">
              Join 50,000+ Cambodian workers already learning new skills. Get free course updates and career tips.
            </p>

            {/* Email signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto mb-8">
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body"
                />
              </div>
              <button className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 shrink-0">
                Get Updates
              </button>
            </div>

            <p className="text-caption text-warm-gray">
              No spam, unsubscribe anytime. Join 12,000+ subscribers.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────── Main Page ──────────────────────── */

export default function Training() {
  return (
    <div>
      <HeroSection />
      <LearningPathsSection />
      <CategoryPills />
      <FeaturedCoursesSection />
      <CertificationsSection />
      <CorporateTrainingSection />
      <SuccessStoriesSection />
      <CTASection />
    </div>
  );
}
