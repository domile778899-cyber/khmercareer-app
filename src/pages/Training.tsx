import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Users,
  Star,
  Clock,
  CheckCircle2,
  Search,
  TrendingUp,
  ArrowRight,
  Zap,
  BarChart3,
  Globe,
  HeartHandshake,
  Utensils,
  Monitor,
  Shirt,
  ShieldCheck,
  Building2,
  Mail,
  StarIcon,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────
const learningPaths = [
  {
    id: 1,
    title: 'Smartphone Repair',
    category: 'IT & Digital',
    courses: 3,
    duration: '12 weeks',
    salary: '$300-$600/mo',
    icon: Monitor,
    color: 'bg-blue-500',
    description: 'Learn to diagnose and repair common smartphone issues. Start your own repair business.',
    coursesList: ['Phone Repair Basics', 'Advanced Diagnostics', 'Business Setup'],
    inDemand: true,
  },
  {
    id: 2,
    title: 'Garment Quality Control',
    category: 'Garment & Textile',
    courses: 4,
    duration: '8 weeks',
    salary: '$400-$700/mo',
    icon: Shirt,
    color: 'bg-emerald-500',
    description: 'Master quality inspection standards used by international brands.',
    coursesList: ['QC Fundamentals', 'AQL Standards', 'Defect Classification', 'Reporting'],
    inDemand: true,
  },
  {
    id: 3,
    title: 'Hotel Reception English',
    category: 'Languages',
    courses: 5,
    duration: '16 weeks',
    salary: '$350-$550/mo',
    icon: Globe,
    color: 'bg-amber-500',
    description: 'Professional English for hotel front desk staff. Boost your hospitality career.',
    coursesList: ['Greetings & Check-in', 'Room Service', 'Complaint Handling', 'VIP Service', 'Emergency English'],
    inDemand: true,
  },
  {
    id: 4,
    title: 'Basic Excel for Factory',
    category: 'Management',
    courses: 3,
    duration: '6 weeks',
    salary: '$400-$650/mo',
    icon: BarChart3,
    color: 'bg-purple-500',
    description: 'From data entry to production reports. Excel skills that factories actually want.',
    coursesList: ['Excel Basics', 'Production Reports', 'Inventory Tracking'],
    inDemand: false,
  },
  {
    id: 5,
    title: 'Restaurant Service',
    category: 'Hospitality',
    courses: 4,
    duration: '8 weeks',
    salary: '$350-$500/mo',
    icon: Utensils,
    color: 'bg-rose-500',
    description: 'Table service, customer care, and upselling techniques for restaurants.',
    coursesList: ['Table Setup', 'Service Standards', 'Customer Care', 'Upselling'],
    inDemand: true,
  },
  {
    id: 6,
    title: 'Workplace Safety',
    category: 'Safety',
    courses: 3,
    duration: '6 weeks',
    salary: '$400-$600/mo',
    icon: ShieldCheck,
    color: 'bg-cyan-600',
    description: 'Fire safety, first aid, and hazard identification. Required for factory supervisors.',
    coursesList: ['Fire Safety', 'First Aid Basics', 'Hazard Identification'],
    inDemand: false,
  },
];

const featuredCourses = [
  {
    id: 1,
    title: 'Factory Safety Fundamentals',
    instructor: 'Ministry of Labour Certified Trainer',
    category: 'Safety',
    duration: '4 weeks',
    students: 3420,
    rating: 4.8,
    icon: ShieldCheck,
    color: 'bg-cyan-500',
    price: 'FREE',
    isFree: true,
    description: 'Essential safety training for factory workers. Learn fire safety, first aid, and hazard identification.',
  },
  {
    id: 2,
    title: 'Garment Sewing - Advanced',
    instructor: 'Vathana Kim, 20yr Garment Expert',
    category: 'Garment & Textile',
    duration: '6 weeks',
    students: 2850,
    rating: 4.7,
    icon: Shirt,
    color: 'bg-emerald-500',
    price: '$12',
    isFree: false,
    description: 'Advanced stitching techniques, pattern reading, and quality standards for garment workers.',
  },
  {
    id: 3,
    title: 'Basic English for Hospitality',
    instructor: 'Sopheap Meas, English Teacher',
    category: 'Languages',
    duration: '8 weeks',
    students: 5200,
    rating: 4.9,
    icon: Globe,
    color: 'bg-amber-500',
    price: 'FREE',
    isFree: true,
    description: 'Greetings, room service, check-in/out vocabulary for hotel and restaurant workers.',
  },
  {
    id: 4,
    title: 'Excel for Production Reports',
    instructor: 'Dara Chhin, Data Analyst',
    category: 'Management',
    duration: '4 weeks',
    students: 1890,
    rating: 4.6,
    icon: BarChart3,
    color: 'bg-purple-500',
    price: '$15',
    isFree: false,
    description: 'Learn Excel formulas, pivot tables, and charts specifically for factory production reports.',
  },
  {
    id: 5,
    title: 'Chinese for Business',
    instructor: 'Li Wei, Business Chinese Expert',
    category: 'Languages',
    duration: '12 weeks',
    students: 1240,
    rating: 4.8,
    icon: Globe,
    color: 'bg-red-500',
    price: '$25',
    isFree: false,
    description: 'Business Chinese for working with Chinese employers and suppliers.',
  },
  {
    id: 6,
    title: 'Food Safety & Hygiene',
    instructor: 'Chenda Phan, Food Safety Expert',
    category: 'Hospitality',
    duration: '3 weeks',
    students: 4100,
    rating: 4.7,
    icon: Utensils,
    color: 'bg-rose-500',
    price: 'FREE',
    isFree: true,
    description: 'Food handling, hygiene standards, and safety certification for restaurant workers.',
  },
];

const certifications = [
  {
    id: 1,
    title: 'National Occupational Safety Certificate',
    organization: 'Ministry of Labour',
    validity: '3 years',
    howToEarn: 'Complete Factory Safety Fundamentals course + pass exam',
    icon: ShieldCheck,
    color: 'bg-cyan-500',
  },
  {
    id: 2,
    title: 'Garment QC Inspector Certificate',
    organization: 'GMAC',
    validity: '2 years',
    howToEarn: 'Complete Garment QC Pathway + 6 months experience',
    icon: Award,
    color: 'bg-emerald-500',
  },
  {
    id: 3,
    title: 'Hotel Service Professional',
    organization: 'Ministry of Tourism',
    validity: '2 years',
    howToEarn: 'Complete Hospitality Pathway + practical assessment',
    icon: HeartHandshake,
    color: 'bg-amber-500',
  },
  {
    id: 4,
    title: 'Excel Data Analysis Certificate',
    organization: 'Khmer Skills Academy',
    validity: 'Lifetime',
    howToEarn: 'Complete all 3 Excel courses + final project',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'Chinese Language Proficiency - HSK 2',
    organization: 'Hanban/Confucius Institute',
    validity: 'Lifetime',
    howToEarn: 'Complete Chinese for Business course + HSK exam',
    icon: Globe,
    color: 'bg-red-500',
  },
  {
    id: 6,
    title: 'First Aid & CPR Certified',
    organization: 'Cambodian Red Cross',
    validity: '2 years',
    howToEarn: 'Complete First Aid course + practical assessment',
    icon: HeartHandshake,
    color: 'bg-rose-500',
  },
];

const successStories = [
  {
    name: 'Srey Nith',
    initial: 'SN',
    previousRole: 'Sewing Machine Operator',
    newRole: 'QC Supervisor',
    salaryIncrease: '2.3x',
    course: 'Garment QC Pathway',
    quote: 'I was earning $200/month as a sewing operator. After completing the QC training, I got promoted to QC Supervisor at $450/month. The skills I learned were exactly what my factory needed.',
    bgColor: '#059669',
  },
  {
    name: 'Chenda Mao',
    initial: 'CM',
    previousRole: 'Waitress',
    newRole: 'Restaurant Manager',
    salaryIncrease: '2.5x',
    course: 'Restaurant Service Pathway',
    quote: 'The hospitality courses gave me confidence and skills. Within 8 months of completing the training, I was promoted to manager. My English improved so much!',
    bgColor: '#D97706',
  },
  {
    name: 'Sophea Lim',
    initial: 'SL',
    previousRole: 'Factory Line Worker',
    newRole: 'Production Line Leader',
    salaryIncrease: '2.2x',
    course: 'Excel for Production Reports',
    quote: 'Learning Excel changed everything. I can now create production reports that help my manager make better decisions. They promoted me to Line Leader!',
    bgColor: '#7C3AED',
  },
];

const categories = [
  { label: 'all', icon: Zap, color: 'bg-gold' },
  { label: 'garmentTextile', icon: Shirt, color: 'bg-emerald' },
  { label: 'hospitality', icon: Utensils, color: 'bg-rose' },
  { label: 'itDigital', icon: Monitor, color: 'bg-blue' },
  { label: 'languages', icon: Globe, color: 'bg-amber' },
  { label: 'management', icon: BarChart3, color: 'bg-purple' },
  { label: 'safety', icon: ShieldCheck, color: 'bg-cyan' },
];

const partnerCompanies = [
  { name: 'Chip Mong', count: '2,400+' },
  { name: 'Angkor Beer', count: '1,800+' },
  { name: 'ACLEDA Bank', count: '1,200+' },
];

// ─── Animation ───────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

// ─── ScrollReveal ────────────────────────────────────────
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section: Hero ───────────────────────────────────────
function HeroSection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <section className="relative bg-deep-brown overflow-hidden pt-[72px] pb-space-16">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h1 className="text-h1 font-display text-[#FAF8F3] mb-4">
            {t('training.learnSkills')}{' '}
            <span className="text-gold">{t('training.getYouHired')}</span>
          </h1>
          <p className="text-body-large text-[#FAF8F3]/70 max-w-[600px] mb-space-6">
            {t('training.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal className="max-w-[720px] mb-space-10">
          <div className="bg-white/95 rounded-2xl p-3 shadow-gold-hover">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('training.searchPlaceholder')}
                  className="w-full h-14 pl-12 pr-4 border-2 border-sand rounded-xl text-body-large text-charcoal placeholder:text-warm-gray focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none transition-all"
                />
              </div>
              <button className="h-14 px-8 bg-gold text-deep-brown font-semibold rounded-xl shadow-gold hover:bg-gold-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-button">
                {t('training.searchPlaceholder')}
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap gap-3">
          <button className="h-12 px-6 bg-gold text-deep-brown font-semibold rounded-xl shadow-gold hover:bg-gold-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-button">
            {t('training.browseCourses')}
          </button>
          <button className="h-12 px-6 border-2 border-gold/50 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-all text-button">
            {t('training.myLearning')}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Learning Paths ─────────────────────────────
function LearningPathsSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-cream py-space-16">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-space-10">
          <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-space-2">
            {t('training.careerTracks')}
          </span>
          <h2 className="text-h2 font-display text-charcoal mb-space-4">
            {t('training.chooseYourPath')}
          </h2>
          <p className="text-body-large text-warm-gray max-w-[600px] mx-auto">
            {t('training.pathSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path, i) => (
            <ScrollReveal key={path.id}>
              <motion.div
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-warm-white border border-sand rounded-2xl p-6 hover:border-gold hover:shadow-card-hover transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${path.color} text-white flex items-center justify-center`}>
                    <path.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-h6 font-display text-charcoal">{path.title}</h3>
                    <span className="text-caption text-warm-gray">{path.category}</span>
                  </div>
                </div>
                <p className="text-body-small text-charcoal mb-4">{path.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {path.coursesList.map((c) => (
                    <span key={c} className="text-caption bg-cream text-charcoal px-2 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-caption text-warm-gray mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.courses} {t('training.coursesCount', { count: path.courses })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-body-small text-emerald font-mono">{path.salary}</span>
                  {path.inDemand && (
                    <span className="text-caption text-coral font-semibold">{t('jobs.urgentHiring')}</span>
                  )}
                </div>
                <button className="w-full h-12 bg-gold/10 text-gold font-semibold rounded-xl hover:bg-gold hover:text-deep-brown transition-all text-button flex items-center justify-center gap-2">
                  {t('training.startPath')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Category Pills ─────────────────────────────
function CategoryPills() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  return (
    <section className="bg-warm-white py-space-8">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-body-small font-medium transition-all ${
                  activeCategory === cat.label
                    ? 'bg-gold text-deep-brown shadow-gold'
                    : 'bg-cream text-charcoal border border-sand hover:border-gold'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {t(`training.${cat.label}`)}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Section: Featured Courses ───────────────────────────
function FeaturedCoursesSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-warm-white py-space-16">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-space-10">
          <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-space-2">
            {t('training.popularCourses')}
          </span>
          <h2 className="text-h2 font-display text-charcoal mb-space-4">
            {t('training.featuredCourses')}
          </h2>
          <p className="text-body-large text-warm-gray max-w-[600px] mx-auto">
            {t('training.featuredSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, i) => (
            <ScrollReveal key={course.id}>
              <motion.div
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-warm-white border border-sand rounded-2xl overflow-hidden hover:border-gold hover:shadow-card-hover transition-all group"
              >
                <div className={`h-48 ${course.color} flex items-center justify-center`}>
                  <course.icon className="w-16 h-16 text-white/80" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-caption text-warm-gray">{course.category}</span>
                    {course.isFree && (
                      <span className="text-caption text-emerald font-semibold bg-emerald/10 px-2 py-0.5 rounded-full">
                        {t('training.free')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-h6 font-display text-charcoal mb-2">{course.title}</h3>
                  <p className="text-body-small text-charcoal mb-4">{course.description}</p>
                  <p className="text-caption text-warm-gray mb-4">{course.instructor}</p>
                  <div className="flex items-center gap-4 text-caption text-warm-gray mb-5">
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-gold" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-h6 font-mono text-emerald">
                      {course.isFree ? t('training.free') : course.price}
                    </span>
                    <button className="h-10 px-5 bg-gold text-deep-brown font-semibold rounded-lg hover:bg-gold-dark transition-all text-button-small">
                      {t('training.enrollNow')}
                    </button>
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

// ─── Section: Certifications ─────────────────────────────
function CertificationsSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-cream py-space-16">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-space-10">
          <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-space-2">
            {t('training.credentials')}
          </span>
          <h2 className="text-h2 font-display text-charcoal mb-space-4">
            {t('training.earnCertificates')}
          </h2>
          <p className="text-body-large text-warm-gray max-w-[600px] mx-auto">
            {t('training.certSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.id}>
              <motion.div
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-warm-white border border-sand rounded-2xl p-6 hover:border-gold hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${cert.color} text-white flex items-center justify-center`}>
                    <cert.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-h6 font-display text-charcoal">{cert.title}</h3>
                    <span className="text-caption text-warm-gray">{cert.organization}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-body-small text-charcoal">
                    <span className="text-warm-gray">{t('training.recognizedBy', { org: cert.organization })}</span>
                  </p>
                  <p className="text-body-small text-charcoal">
                    <span className="text-warm-gray">{t('training.validity', { period: cert.validity })}</span>
                  </p>
                  <p className="text-body-small text-charcoal">
                    <span className="text-warm-gray">{t('training.howToEarn', { desc: cert.howToEarn })}</span>
                  </p>
                </div>
                <button className="w-full h-12 border-2 border-gold text-gold font-semibold rounded-xl hover:bg-gold hover:text-deep-brown transition-all text-button flex items-center justify-center gap-2">
                  <Award className="w-4 h-4" />
                  {t('training.viewRequirements')}
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Corporate Training ─────────────────────────
function CorporateTrainingSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-warm-white py-space-16">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-space-2">
              {t('training.forEmployers')}
            </span>
            <h2 className="text-h2 font-display text-charcoal mb-space-4">
              {t('training.corporateTraining')}
            </h2>
            <p className="text-body-large text-warm-gray mb-space-6">
              {t('training.corporateSubtitle')}
            </p>
            <ul className="space-y-4 mb-space-8">
              {[
                t('training.bulkEnrollment'),
                t('training.customCurriculum'),
                t('training.progressTracking'),
                t('training.brandedCertificates'),
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-body text-charcoal">
                  <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="h-14 px-8 bg-gold text-deep-brown font-semibold rounded-xl shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 text-button">
              {t('training.requestCorporateTraining')}
            </button>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-4">
              {partnerCompanies.map((company) => (
                <div
                  key={company.name}
                  className="bg-cream border border-sand rounded-2xl p-6 text-center hover:border-gold hover:shadow-card-hover transition-all"
                >
                  <Building2 className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-h6 font-display text-charcoal">{company.name}</p>
                  <p className="text-caption text-warm-gray">{company.count} {t('training.employeesTrained')}</p>
                </div>
              ))}
              <div className="bg-cream border border-sand rounded-2xl p-6 text-center hover:border-gold hover:shadow-card-hover transition-all">
                <Users className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-h6 font-display text-charcoal">8,400+</p>
                <p className="text-caption text-warm-gray">{t('training.employeesTrained')}</p>
              </div>
              <div className="bg-cream border border-sand rounded-2xl p-6 text-center hover:border-gold hover:shadow-card-hover transition-all">
                <Star className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-h6 font-display text-charcoal">4.7/5</p>
                <p className="text-caption text-warm-gray">{t('training.satisfaction')}</p>
              </div>
              <div className="bg-cream border border-sand rounded-2xl p-6 text-center hover:border-gold hover:shadow-card-hover transition-all">
                <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-h6 font-display text-charcoal">28+</p>
                <p className="text-caption text-warm-gray">{t('training.partnerCompanies')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Success Stories ────────────────────────────
function SuccessStoriesSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-cream py-space-16">
      <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-space-10">
          <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-space-2">
            {t('training.testimonials')}
          </span>
          <h2 className="text-h2 font-display text-charcoal mb-space-4">
            {t('training.successStories')}
          </h2>
          <p className="text-body-large text-warm-gray max-w-[600px] mx-auto">
            {t('training.successSubtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, i) => (
            <ScrollReveal key={story.name}>
              <motion.div
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-warm-white border border-sand rounded-2xl p-6 hover:border-gold hover:shadow-card-hover transition-all flex flex-col h-full"
              >
                <div className="mb-4">
                  <span className="inline-block text-gold text-caption font-semibold uppercase tracking-widest mb-2">
                    {story.course}
                  </span>
                  <div className="inline-flex items-center gap-1.5 bg-emerald/10 text-emerald px-3 py-1.5 rounded-full text-caption font-semibold">
                    <TrendingUp size={14} />
                    {t('training.salaryIncrease', { percent: story.salaryIncrease })}
                  </div>
                </div>

                <p className="text-body text-charcoal mb-6 flex-1 italic">
                  &ldquo;{story.quote}&rdquo;
                </p>

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

// ─── Section: CTA ────────────────────────────────────────
function CTASection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-emerald/5 border border-gold/20 rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="text-h2 font-display text-charcoal mb-4">
              {t('training.startLearningToday')}
            </h2>
            <p className="text-body-large text-warm-gray mb-8 max-w-[500px] mx-auto">
              {t('training.joinWorkers')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto mb-8">
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
                />
                <input
                  type="email"
                  placeholder={t('training.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body"
                />
              </div>
              <button className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 shrink-0">
                {t('training.getUpdates')}
              </button>
            </div>

            <p className="text-caption text-warm-gray">
              {t('training.noSpam')}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────
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
