import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Users, TrendingUp, Building2, Code,
  Shirt, Hotel, Laptop, CheckCircle, UserPlus, Bookmark,
  Star, ChevronDown, CheckCircle2, Facebook, MessageCircle, Send, Link as LinkIcon,
  Briefcase, Clock, DollarSign
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────── DATA ───────────────────── */
const trustStats = [
  { value: 990, suffix: 'K+', labelKey: 'hero.stats.workers', label: 'Active Workforce', labelKm: 'កម្លាំង​ពលកម្ម​សកម្ម', labelZh: '活跃劳动力', icon: Users, color: 'gold' as const },
  { value: 74, suffix: '%', labelKey: 'hero.stats.employers', label: 'Employers Report Hiring Difficulty', labelKm: 'និយោជក 74% ប្រឈម​ការ​ជ្រើសរើស', labelZh: '企业招聘困难', icon: TrendingUp, color: 'coral' as const },
  { value: 2900, suffix: '+', labelKey: 'hero.stats.workers', label: 'Chinese Enterprises in Cambodia', labelKm: 'ធុរកិច្ច​ចិន​នៅ​កម្ពុជា', labelZh: '在柬中资企业', icon: Building2, color: 'gold' as const },
  { value: 600, suffix: 'K', labelKey: 'hero.stats.workers', label: 'IT Talent Gap to Fill', labelKm: 'ចន្លោះ​ប្រហោង​ព័ត៌មានវិទ្យា', labelZh: 'IT人才缺口', icon: Code, color: 'emerald' as const },
];

const sectors = [
  {
    image: '/garment-factory.jpg',
    icon: Shirt,
    title: 'Garment & Textile',
    titleKm: 'ក្រណាត់​និង​វាយនភ័ណ្ឌ',
    titleZh: '服装纺织',
    description: "Cambodia's largest employer. We connect factories with skilled sewing operators, QC inspectors, line supervisors, and management.",
    stat: '850,000+ workers employed',
    tags: ['Sewing Operator', 'QC Inspector', 'Line Supervisor', 'Factory Manager'],
  },
  {
    image: '/tourism-hotel.jpg',
    icon: Hotel,
    title: 'Tourism & Hospitality',
    titleKm: 'ទេសចរណ៍​និង​បដិសណ្ឋារកម្ម',
    titleZh: '旅游酒店',
    description: 'From boutique hotels to international chains. Find front desk staff, chefs, tour guides, and hospitality managers.',
    stat: '2.3M tourists in 2024',
    tags: ['Front Desk', 'Chef', 'Tour Guide', 'Hotel Manager'],
  },
  {
    image: '/ict-office.jpg',
    icon: Laptop,
    title: 'ICT & Technology',
    titleKm: 'បច្ចេកវិទ្យា​ព័ត៌មាន',
    titleZh: '信息技术',
    description: "Cambodia's fastest-growing sector. 600,000 IT positions to fill. Developers, designers, digital marketers, and tech leads.",
    stat: '600K IT talent gap',
    tags: ['Web Developer', 'UI Designer', 'Digital Marketing', 'IT Manager'],
  },
];

const featuredJobs = [
  { title: 'Senior Sewing Operator', company: 'Cambodia Garment Ltd.', location: 'Phnom Penh', salary: '$300-450/month', tags: ['Garment', '1-3 Years'], posted: '2 days ago', isNew: true },
  { title: 'Front Desk Receptionist', company: 'Sokha Hotels', location: 'Siem Reap', salary: '$250-350/month', tags: ['Tourism', 'Entry Level'], posted: '1 day ago', isNew: true },
  { title: 'React Developer', company: 'Tech Cambodia', location: 'Phnom Penh', salary: '$800-1500/month', tags: ['ICT', '3-5 Years'], posted: '3 days ago', isNew: false },
  { title: 'Factory HR Manager', company: 'CamKo Garment', location: 'Kandal', salary: '$600-900/month', tags: ['Garment', '5+ Years'], posted: '5 days ago', isNew: false },
  { title: 'Chinese-Khmer Translator', company: 'SinoLink Group', location: 'Phnom Penh', salary: '$500-800/month', tags: ['Translation', '2-4 Years'], posted: '1 day ago', isNew: true },
  { title: 'Restaurant Supervisor', company: 'Angkor Dining Co.', location: 'Siem Reap', salary: '$400-600/month', tags: ['Tourism', '2-3 Years'], posted: '4 days ago', isNew: false },
];

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    titleKm: 'បង្កើត​ប្រវត្តិរូប',
    titleZh: '创建简历',
    description: 'Build your resume in 3 simple steps. Choose from industry templates — garment, tourism, or tech. No experience needed.',
    highlight: 'Takes 3 minutes',
  },
  {
    num: '02',
    icon: Search,
    title: 'Find Your Match',
    titleKm: 'ស្វែងរក​ការងារ',
    titleZh: '智能匹配',
    description: 'Browse jobs by industry, location, and salary. Our system recommends positions that match your skills and experience.',
    highlight: 'AI-powered matching',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Get Hired',
    titleKm: 'ទទួល​បាន​ការងារ',
    titleZh: '快速入职',
    description: 'Apply with one click. Chat with employers via Messenger. Get verified job offers and start your new career.',
    highlight: null,
  },
];

const employers = [
  'CGMA', 'Canadia Bank', 'ABA Bank', 'Smart Axiata',
  'Chip Mong Group', 'Vattanac Bank', 'Prince Group',
  'TK Central', 'AEON Cambodia', 'Sorya Group',
];

const testimonials = [
  {
    quote: 'We hired 45 garment workers through 高棉职通车 (Khmer Career Express) in just two weeks. The verified badge system gives us confidence, and the candidates actually show up for interviews.',
    avatar: '/employer-camko.jpg',
    name: 'Sopheap Chhun',
    nameZh: '春索帕',
    role: 'HR Director, CamKo Textile',
    roleZh: '人力资源总监, CamKo纺织',
    industry: 'Garment',
  },
  {
    quote: 'As a Chinese investor, I need bilingual staff. 高棉职通车 helped us find Khmer-Chinese translators and operations managers who understand both cultures.',
    avatar: '/employer-sokha.jpg',
    name: 'Li Wei',
    nameZh: '李伟',
    role: 'General Manager, SinoLink Group',
    roleZh: '总经理, 华联集团',
    industry: 'Manufacturing',
  },
  {
    quote: 'I created my resume in Khmer and got 3 interview calls in one week. The process was so simple — I did it all on my phone during my break at the factory.',
    avatar: '/employer-lyly.jpg',
    name: 'Lyly Chem',
    nameZh: '林丽丽',
    role: 'Former Factory Worker, now Office Admin',
    roleZh: '前工厂工人, 现办公室管理员',
    industry: 'Career Change',
  },
];

/* ───────────────────── HOME COMPONENT ───────────────────── */
export default function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'km';
  const containerRef = useRef<HTMLDivElement>(null);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const toggleSave = (idx: number) => {
    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  useGSAP(() => {
    /* Hero entrance animations */
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' })
      .from('.hero-headline span', { opacity: 0, y: 40, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.1')
      .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .from('.hero-search', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' }, '-=0.2')
      .from('.hero-stats-item', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3');

    /* Section reveals */
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.from(section.querySelectorAll('.reveal-item'), {
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'power2.out',
      });
    });

    /* Stat counters */
    trustStats.forEach((stat, i) => {
      const el = document.querySelector(`.stat-num-${i}`);
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        scrollTrigger: { trigger: '.trust-section', start: 'top 80%' },
        duration: 2,
        delay: i * 0.15,
        ease: 'power2.out',
        onUpdate: () => {
          const v = Math.round(obj.val);
          el.textContent = v.toLocaleString();
        },
        onComplete: () => {
          gsap.from(`.stat-suffix-${i}`, { scale: 0.8, duration: 0.3, ease: 'back.out(2)' });
        },
      });
    });

    /* Sector cards */
    gsap.from('.sector-card', {
      scrollTrigger: { trigger: '.sectors-section', start: 'top 85%' },
      opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'expo.out',
    });

    /* Job cards */
    gsap.from('.job-card', {
      scrollTrigger: { trigger: '.jobs-section', start: 'top 85%' },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: 'power2.out',
    });

    /* Steps */
    gsap.from('.step-item', {
      scrollTrigger: { trigger: '.steps-section', start: 'top 85%' },
      opacity: 0, x: -30, duration: 0.7, stagger: 0.2, ease: 'expo.out',
    });

    /* Employer logos */
    gsap.from('.employer-logo', {
      scrollTrigger: { trigger: '.employers-section', start: 'top 85%' },
      opacity: 0, duration: 0.4, stagger: { amount: 0.5, from: 'random' }, ease: 'power2.out',
    });

    /* Testimonial cards */
    gsap.from('.testimonial-card', {
      scrollTrigger: { trigger: '.testimonials-section', start: 'top 85%' },
      opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power2.out',
    });

    /* CTA section */
    gsap.from('.cta-content > *', {
      scrollTrigger: { trigger: '.cta-section', start: 'top 85%' },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1A1714 0%, #2D2926 40%, #1A1714 100%)',
        }}
      >
        {/* Fallback background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/hero-fallback.jpg)' }}
        />
        {/* Gold gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(26,23,20,0.6) 50%, rgba(212,175,55,0.1) 100%)' }} />

        <div className="relative z-10 max-w-[800px] mx-auto px-4 md:px-8 pt-20 pb-12 text-center">
          {/* Tagline */}
          <p className="hero-tagline text-caption uppercase tracking-[0.15em] text-gold mb-6">
            {t('hero.tagline')}
          </p>

          {/* Headline */}
          <h1 className="hero-headline text-hero-title font-display text-[#FAF8F3] mb-6" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            {t('hero.headline')}
          </h1>

          {/* Subheadline */}
          <p className="hero-sub text-body-large text-[rgba(250,248,243,0.85)] max-w-[560px] mx-auto mb-8">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="hero-search flex flex-col md:flex-row gap-2 md:gap-0 p-2 rounded-2xl max-w-[640px] mx-auto mb-8"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              minHeight: '64px',
            }}
          >
            <div className="flex-1 flex items-center gap-2 px-4 min-h-[48px]">
              <Search size={20} className="text-warm-gray shrink-0" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                className="w-full bg-transparent text-charcoal text-body placeholder:text-warm-gray focus:outline-none"
              />
            </div>
            <div className="hidden md:block w-px bg-sand self-stretch my-2" />
            <div className="flex items-center gap-2 px-4 min-h-[48px] md:w-[180px]">
              <MapPin size={20} className="text-warm-gray shrink-0" />
              <select className="bg-transparent text-charcoal text-body focus:outline-none w-full cursor-pointer appearance-none">
                <option>{t('hero.allLocations')}</option>
                <option>Phnom Penh</option>
                <option>Siem Reap</option>
                <option>Kandal</option>
                <option>Sihanoukville</option>
              </select>
            </div>
            <Link
              to="/jobs"
              className="bg-gold text-deep-brown px-6 py-3 rounded-xl text-button font-semibold min-h-[48px] md:min-h-[48px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 shrink-0"
            >
              {t('hero.searchJobs')}
            </Link>
          </div>

          {/* Quick Stats Row */}
          <div className="hero-stats flex items-center justify-center gap-3 md:gap-6 flex-wrap mb-6">
            {[
              { value: '2,400+', label: t('hero.stats.jobs') },
              { value: '850+', label: t('hero.stats.employers') },
              { value: '50,000+', label: t('hero.stats.jobSeekers') },
            ].map((s, i) => (
              <div key={i} className="hero-stats-item flex items-center gap-2 md:gap-6">
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />}
                <span className="text-body-small text-[rgba(250,248,243,0.7)]">
                  {s.value} {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <p className="hero-stats-item text-caption text-[rgba(250,248,243,0.5)]">
            {t('hero.trust')}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={28} className="text-gold animate-bounce-gentle" style={{ opacity: 0.6 }} />
        </div>
      </section>

      {/* ═══════════════ SECTION 2: TRUST STATS ═══════════════ */}
      <section className="trust-section bg-warm-white py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {trustStats.map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div key={i} className={`flex flex-col items-center text-center relative ${i < trustStats.length - 1 ? 'lg:border-r lg:border-sand' : ''}`}>
                  <IconComp size={24} className={stat.color === 'coral' ? 'text-coral' : stat.color === 'emerald' ? 'text-emerald' : 'text-gold'} />
                  <div className="flex items-baseline gap-0.5 mt-3">
                    <span className={`stat-num-${i} text-stat-number font-mono ${stat.color === 'coral' ? 'text-coral' : stat.color === 'emerald' ? 'text-emerald' : 'text-gold'}`}>
                      {stat.value}
                    </span>
                    <span className={`stat-suffix-${i} text-stat-number font-mono ${stat.color === 'coral' ? 'text-coral' : stat.color === 'emerald' ? 'text-emerald' : 'text-gold'}`}>
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-body-small text-warm-gray max-w-[160px] mt-2">
                    {currentLang === 'km' ? stat.labelKm : currentLang === 'zh' ? stat.labelZh : stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: INDUSTRY SECTORS ═══════════════ */}
      <section className="sectors-section bg-cream py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              {t('home.industries')}
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal mb-3">
              {t('home.industries')}
            </h2>
            <p className="reveal-item text-body text-warm-gray max-w-[520px] mx-auto">
              {t('home.industriesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, i) => {
              const IconComp = sector.icon;
              return (
                <div
                  key={i}
                  className="sector-card bg-white rounded-2xl border border-sand overflow-hidden shadow-card hover:shadow-feature hover:-translate-y-1.5 hover:border-gold transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-gold group-hover:-translate-y-1 transition-transform duration-300">
                      <IconComp size={24} className="text-deep-brown" />
                    </div>
                  </div>
                  <div className="pt-10 pb-6 px-6 text-center">
                    <h3 className="text-h3 font-display text-charcoal mb-2">{sector.title}</h3>
                    <p className="text-body-small text-warm-gray mb-3 leading-relaxed">{sector.description}</p>
                    <p className="text-caption text-gold font-medium mb-4">{sector.stat}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {sector.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-cream text-charcoal text-caption rounded-full border border-sand hover:bg-gold hover:text-deep-brown transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link to="/jobs" className="text-body-small font-medium text-gold hover:underline inline-flex items-center gap-1">
                      {t('home.browseJobs')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: FEATURED JOBS ═══════════════ */}
      <section className="jobs-section bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 reveal-section">
            <div>
              <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
                {t('home.featuredJobs')}
              </p>
              <h2 className="reveal-item text-h2 font-display text-charcoal">
                {t('home.latestOpportunities')}
              </h2>
            </div>
            <Link to="/jobs" className="reveal-item text-body font-medium text-gold hover:underline mt-3 sm:mt-0 inline-flex items-center gap-1">
              {t('home.viewAllJobs')}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredJobs.map((job, i) => (
              <div
                key={i}
                className="job-card bg-white rounded-2xl border border-sand p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-h4 text-charcoal font-semibold">{job.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-body-small text-charcoal font-medium">{job.company}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-br from-emerald to-emerald-light text-white text-[11px] font-medium rounded-full animate-pulse-glow">
                            <CheckCircle size={10} /> {t('home.verified')}
                          </span>
                          {job.isNew && (
                            <span className="px-2 py-0.5 bg-gradient-to-br from-coral to-[#F59E0B] text-white text-[11px] font-medium rounded-full">
                              {t('home.new')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1 text-body-small text-warm-gray">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gold/10 text-gold-dark text-caption font-mono rounded-md">
                        <DollarSign size={12} /> {job.salary}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-cream text-charcoal text-caption rounded-full border border-sand">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand/50">
                      <span className="text-caption text-warm-gray flex items-center gap-1">
                        <Clock size={12} /> {job.posted}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSave(i); }}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-warm-gray hover:text-gold hover:bg-gold/10 transition-all"
                          aria-label={t('home.saveJob')}
                        >
                          <Bookmark size={18} className={savedJobs.has(i) ? 'fill-gold text-gold' : ''} />
                        </button>
                        <Link
                          to={`/jobs/${i + 1}`}
                          className="bg-coral text-white px-4 py-2 rounded-lg text-button-small font-semibold min-h-[36px] flex items-center shadow-coral hover:bg-coral-dark hover:scale-[1.03] transition-all duration-200"
                        >
                          {t('home.apply')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: HOW IT WORKS ═══════════════ */}
      <section className="steps-section bg-cream py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              {t('home.howItWorks')}
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal mb-3">
              {t('home.threeSteps')}
            </h2>
            <p className="reveal-item text-body text-warm-gray">
              {t('home.stepsSubtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 border-t-2 border-dashed border-gold/40 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {steps.map((step, i) => {
                const IconComp = step.icon;
                return (
                  <div key={i} className="step-item flex flex-col items-center text-center">
                    <span className="text-stat-number text-gold opacity-30 font-mono mb-2 select-none">
                      {step.num}
                    </span>
                    <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-gold mb-4">
                      <IconComp size={32} className="text-deep-brown" />
                    </div>
                    <h3 className="text-h3 font-display text-charcoal mb-2">{step.title}</h3>
                    <p className="text-body-small text-warm-gray max-w-[280px] leading-relaxed">{step.description}</p>
                    {step.highlight && (
                      <span className={`mt-3 px-3 py-1 rounded-full text-caption font-medium ${
                        step.highlight === 'AI-powered matching'
                          ? 'bg-emerald-light text-emerald'
                          : 'bg-gold/10 text-gold-dark'
                      }`}>
                        {step.highlight === 'Takes 3 minutes' && '⏱ '}
                        {step.highlight}
                      </span>
                    )}
                    {i === 2 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Facebook size={16} className="text-[#1877F2]" />
                        <MessageCircle size={16} className="text-[#0084FF]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6: TRUSTED EMPLOYERS ═══════════════ */}
      <section className="employers-section bg-warm-white py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-10 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              {t('home.partners')}
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal">
              {t('home.trustedEmployers')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-6">
            {employers.map((name, i) => (
              <div
                key={i}
                className="employer-logo h-20 rounded-xl bg-cream border border-sand flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
              >
                <span className="text-body-small font-semibold text-charcoal text-center px-2">{name}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/employers"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold text-gold rounded-xl text-button-small font-semibold hover:bg-gold/10 transition-colors duration-200"
            >
              {t('home.becomeEmployer')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: RESUME BUILDER PROMO ═══════════════ */}
      <section
        className="py-16 md:py-20 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 100%)' }}
      >
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="reveal-section order-2 lg:order-1">
              <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
                {t('home.resumeBuilder')}
              </p>
              <h2 className="reveal-item text-h2 font-display text-[#FAF8F3] mb-4">
                {t('home.buildResume')}
              </h2>
              <p className="reveal-item text-body text-[rgba(250,248,243,0.8)] mb-6">
                {t('home.resumeDesc')}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t('home.resumeTemplates'),
                  t('home.resumeAutoFill'),
                  t('home.resumeShare'),
                ].map((item, i) => (
                  <li key={i} className="reveal-item flex items-start gap-3 text-body text-[rgba(250,248,243,0.8)]">
                    <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="reveal-item flex flex-col sm:flex-row gap-3">
                <Link
                  to="/resume"
                  className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
                >
                  {t('home.createMyResume')}
                </Link>
                <Link
                  to="/resume"
                  className="px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center text-gold hover:bg-gold/10 transition-colors duration-200 border border-transparent hover:border-gold/20"
                >
                  {t('home.seeHowItWorks')}
                </Link>
              </div>
            </div>

            {/* Right Column - Phone Mockup */}
            <div className="reveal-section order-1 lg:order-2 flex items-center justify-center">
              <div
                className="relative w-[260px] h-[480px] rounded-[2.5rem] border-4 border-gold/30 bg-gradient-to-b from-charcoal to-deep-brown flex items-center justify-center animate-float"
                style={{
                  boxShadow: '0 20px 60px rgba(212,175,55,0.2)',
                  transform: 'rotate(3deg)',
                }}
              >
                {/* Phone notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gold/30 rounded-full" />
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <UserPlus size={32} className="text-gold" />
                  </div>
                  <p className="text-warm-white font-semibold text-h4 mb-1">{t('home.resumeBuilder')}</p>
                  <p className="text-warm-gray text-caption">{t('home.threeSteps')}</p>
                  <div className="mt-6 space-y-2">
                    <div className="w-40 h-3 bg-gold/20 rounded-full mx-auto" />
                    <div className="w-32 h-3 bg-gold/15 rounded-full mx-auto" />
                    <div className="w-36 h-3 bg-gold/20 rounded-full mx-auto" />
                  </div>
                  <div className="mt-6 w-32 h-8 bg-gold rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-deep-brown text-caption font-semibold">{t('home.searchJobsBtn')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8: TESTIMONIALS ═══════════════ */}
      <section className="testimonials-section bg-cream py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              {t('home.testimonials')}
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal">
              {t('home.successStories')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="testimonial-card bg-cream rounded-2xl p-6 border border-sand relative"
              >
                {/* Quote mark */}
                <span className="absolute top-4 left-4 text-gold/30 font-display text-[4rem] leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-body text-charcoal leading-relaxed mb-6 relative z-10 pt-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-small font-semibold text-charcoal truncate">{testimonial.name}</p>
                    <p className="text-caption text-warm-gray truncate">{testimonial.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className="text-gold fill-gold" />
                      ))}
                    </div>
                    <span className="text-[11px] text-warm-gray bg-sand/50 px-2 py-0.5 rounded-full">
                      {testimonial.industry}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: CTA / NEWSLETTER ═══════════════ */}
      <section
        className="cta-section relative py-16 md:py-20 lg:py-24"
        style={{
          background: 'linear-gradient(135deg, #1A1714 0%, #2D2926 40%, #1A1714 100%)',
        }}
      >
        {/* Subtle overlay for lighter gold tones */}
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(245,230,163,0.1) 50%, rgba(212,175,55,0.15) 100%)' }} />

        <div className="relative z-10 mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="cta-content max-w-[640px] mx-auto text-center">
            {/* Lotus icon placeholder (SVG) */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center animate-lotus-pulse">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4C18 4 12 12 12 18C12 24 18 30 18 30C18 30 24 24 24 18C24 12 18 4 18 4Z" fill="#D4AF37" opacity="0.9"/>
                <path d="M18 30C18 30 10 24 8 18C6 12 10 6 10 6C10 6 14 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
                <path d="M18 30C18 30 26 24 28 18C30 12 26 6 26 6C26 6 22 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
                <path d="M18 30C18 30 6 22 4 16C2 10 8 6 8 6C8 6 12 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
                <path d="M18 30C18 30 30 22 32 16C34 10 28 6 28 6C28 6 24 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
              </svg>
            </div>

            <h2 className="text-h2 font-display text-[#FAF8F3] mb-4" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              {t('home.ready')}
            </h2>
            <p className="text-body-large text-[rgba(250,248,243,0.8)] mb-8">
              {t('home.joinPlatform')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                to="/jobs"
                className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] sm:min-h-[64px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 sm:w-[240px]"
              >
                <Search size={20} className="mr-2" /> {t('home.searchJobsBtn')}
              </Link>
              <Link
                to="/employers"
                className="px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] sm:min-h-[64px] flex items-center justify-center border-2 border-gold text-gold hover:bg-gold/10 transition-all duration-200 sm:w-[240px]"
              >
                <Briefcase size={20} className="mr-2" /> {t('home.postAJob')}
              </Link>
            </div>

            {/* Newsletter */}
            <div className="mb-8">
              <p className="text-body-small text-[rgba(250,248,243,0.6)] mb-3">
                {t('home.newsletter')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-[480px] mx-auto">
                <input
                  type="email"
                  placeholder={t('home.newsletterPlaceholder')}
                  className="flex-1 min-h-[48px] px-4 py-3 rounded-xl text-body text-white placeholder:text-[rgba(250,248,243,0.4)] focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                <button className="bg-gold text-deep-brown px-6 py-3 rounded-xl text-button-small font-semibold min-h-[48px] hover:bg-gold-dark transition-colors shrink-0">
                  {t('home.subscribe')}
                </button>
              </div>
              <p className="text-caption text-[rgba(250,248,243,0.4)] mt-2">
                {t('home.privacyNote')}
              </p>
            </div>

            {/* Social Share */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-caption text-[rgba(250,248,243,0.6)]">{t('home.shareWithFriends')}</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: MessageCircle, label: 'Messenger' },
                  { icon: Send, label: 'Telegram' },
                  { icon: LinkIcon, label: t('home.copyLink') },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-deep-brown transition-all duration-200 hover:scale-110"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
