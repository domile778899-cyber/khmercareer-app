import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Eye, Shield, Smartphone, GraduationCap,
  Users, Building2, CheckCircle, Languages,
  Linkedin, TrendingUp, Zap, Search, Briefcase,
  ChevronLeft, ChevronRight, Quote
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────── DATA ───────────────────── */

const impactStats = [
  { value: 50000, suffix: '+', label: 'Job Seekers Helped', labelKm: 'អ្នកស្វែងរកការងារ', labelZh: '帮助的求职者', icon: Users, color: 'gold' as const },
  { value: 850, suffix: '+', label: 'Verified Employers', labelKm: 'និយោជកបានផ្ទៀងផ្ទាត់', labelZh: '认证雇主', icon: Building2, color: 'emerald' as const },
  { value: 12000, suffix: '+', label: 'Successful Placements', labelKm: 'ការងារបានជោគជ័យ', labelZh: '成功入职', icon: CheckCircle, color: 'gold' as const },
  { value: 3, suffix: '', label: 'Languages Supported', labelKm: 'ភាសាដែលគាំទ្រ', labelZh: '支持语言', icon: Languages, color: 'coral' as const },
];

const cultureCards = [
  {
    icon: Shield,
    color: 'emerald' as const,
    title: 'Trust Comes First',
    titleKm: 'ទុកចិត្តមកមុន',
    titleZh: '信任至上',
    description: "In Cambodia's low-trust online environment, we verify every employer and highlight verified companies. The green shield badge isn't decoration \u2014 it's a promise.",
    highlight: null,
  },
  {
    icon: Smartphone,
    color: 'gold' as const,
    title: 'Mobile Is Everything',
    titleKm: 'ទូរសព្ទចល័តគឺអស្ចារ្យ',
    titleZh: '移动优先',
    description: 'With 60.7% internet penetration and most users on smartphones, every feature is designed for thumb-friendly interaction. Large buttons, simple flows, offline support.',
    stat: '60.7% internet penetration \u00B7 $0.12/GB data',
  },
  {
    icon: GraduationCap,
    color: 'coral' as const,
    title: 'Simplicity for Everyone',
    titleKm: 'សាមញ្ញសម្រាប់គ្រប់គ្នា',
    titleZh: '人人可用',
    description: 'With only 5% having basic digital skills, our 3-step processes, visual icons, and large touch targets ensure everyone can use KhmerHR \u2014 from factory floors to university campuses.',
    stat: 'Khmer default language \u00B7 Visual icons \u00B7 Voice input support',
  },
];

const teamMembers = [
  {
    initials: 'SC', color: '#D4AF37',
    name: 'Sokha Chhim', nameZh: '\u5E86\u7D22\u5361',
    role: 'Co-Founder & CEO', roleZh: '\u8054\u5408\u521B\u59CB\u4EBA\u517CEO',
    bio: 'Former HR director at Canadia Bank. 15 years connecting talent with opportunity across Southeast Asia.',
  },
  {
    initials: 'LP', color: '#059669',
    name: 'Li Peng', nameZh: '\u674E\u9E4F',
    role: 'Co-Founder & CTO', roleZh: '\u8054\u5408\u521B\u59CB\u4EBA\u517ECTO',
    bio: 'Tech entrepreneur with experience building recruitment platforms in China and Southeast Asia. Bridges technology and local needs.',
  },
  {
    initials: 'SR', color: '#E85D3E',
    name: 'Sopheap Rith', nameZh: 'Sopheap',
    role: 'Head of Operations', roleZh: '\u8FD0\u8425\u603B\u76D1',
    bio: "Deep expertise in Cambodia's garment and manufacturing sectors. Former factory operations manager.",
  },
  {
    initials: 'KC', color: '#2563EB',
    name: 'Kimly Chea', nameZh: '\u91D1\u51E4',
    role: 'Head of Partnerships', roleZh: '\u5408\u4F5C\u603B\u76D1',
    bio: 'Builds bridges between Chinese enterprises and Cambodian talent. Fluent in Khmer, Mandarin, and English.',
  },
];

const pressQuotes = [
  {
    quote: "KhmerHR is addressing a critical gap in Cambodia's labor market by connecting informal workers with formal employment opportunities through an easy-to-use mobile platform.",
    source: 'The Phnom Penh Post',
  },
  {
    quote: 'The most promising recruitment platform for connecting Chinese investment with local talent. KhmerHR understands both cultures and bridges the gap effectively.',
    source: 'ASEAN Briefing',
  },
];

const pressLogos = [
  'The Phnom Penh Post', 'Khmer Times', 'ASEAN Briefing', 'TechInAsia', 'Cambodia Daily',
];

/* ───────────────────── LOTUS SVG ───────────────────── */
function LotusIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 4C18 4 12 12 12 18C12 24 18 30 18 30C18 30 24 24 24 18C24 12 18 4 18 4Z" fill="#D4AF37" opacity="0.9"/>
      <path d="M18 30C18 30 10 24 8 18C6 12 10 6 10 6C10 6 14 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
      <path d="M18 30C18 30 26 24 28 18C30 12 26 6 26 6C26 6 22 12 18 30Z" fill="#D4AF37" opacity="0.7"/>
      <path d="M18 30C18 30 6 22 4 16C2 10 8 6 8 6C8 6 12 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
      <path d="M18 30C18 30 30 22 32 16C34 10 28 6 28 6C28 6 24 14 18 30Z" fill="#D4AF37" opacity="0.5"/>
    </svg>
  );
}

/* ───────────────────── ABOUT PAGE ───────────────────── */
export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentQuote, setCurrentQuote] = useState(0);

  const nextQuote = useCallback(() => {
    setCurrentQuote((prev) => (prev + 1) % pressQuotes.length);
  }, []);

  const prevQuote = useCallback(() => {
    setCurrentQuote((prev) => (prev - 1 + pressQuotes.length) % pressQuotes.length);
  }, []);

  /* Auto-advance carousel */
  useEffect(() => {
    const timer = setInterval(nextQuote, 8000);
    return () => clearInterval(timer);
  }, [nextQuote]);

  useGSAP(() => {
    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .from('.about-breadcrumb', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' })
      .from('.about-eyebrow', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .from('.about-title span', { opacity: 0, y: 40, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.2')
      .from('.about-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .from('.about-lotus', { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');

    /* Section reveals */
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.from(section.querySelectorAll('.reveal-item'), {
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'power2.out',
      });
    });

    /* Mission/Vision cards - slide from sides */
    gsap.from('.mission-card', {
      scrollTrigger: { trigger: '.mission-vision-section', start: 'top 85%' },
      x: -40, opacity: 0, duration: 0.7, ease: 'expo.out',
    });
    gsap.from('.vision-card', {
      scrollTrigger: { trigger: '.mission-vision-section', start: 'top 85%' },
      x: 40, opacity: 0, duration: 0.7, delay: 0.2, ease: 'expo.out',
    });

    /* Culture cards */
    gsap.from('.culture-card', {
      scrollTrigger: { trigger: '.culture-section', start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
    });

    /* Impact stats - counter animation */
    impactStats.forEach((stat, i) => {
      const el = document.querySelector(`.impact-num-${i}`);
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        scrollTrigger: { trigger: '.impact-section', start: 'top 80%' },
        duration: 2.5,
        delay: i * 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          const v = Math.round(obj.val);
          el.textContent = v.toLocaleString();
        },
      });
    });
    gsap.from('.impact-stat-item', {
      scrollTrigger: { trigger: '.impact-section', start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
    });

    /* Team cards */
    gsap.from('.team-card', {
      scrollTrigger: { trigger: '.team-section', start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    });

    /* Press logos */
    gsap.from('.press-logo', {
      scrollTrigger: { trigger: '.press-section', start: 'top 85%' },
      opacity: 0, duration: 0.5, stagger: { amount: 0.5, from: 'random' }, ease: 'power2.out',
    });

    /* CTA section */
    gsap.from('.cta-about > *', {
      scrollTrigger: { trigger: '.cta-about-section', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    });
  }, { scope: containerRef });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald';
      case 'coral': return 'text-coral';
      case 'gold': default: return 'text-gold';
    }
  };

  return (
    <div ref={containerRef}>
      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section
        className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1714 0%, #2D2926 40%, #1A1714 100%)' }}
      >
        {/* Subtle angkor pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url(/angkor-pattern.svg)',
            backgroundSize: '300px',
            animation: 'panPattern 60s linear infinite',
          }}
        />

        <div className="relative z-10 max-w-[800px] mx-auto px-4 md:px-8 text-center">
          {/* Breadcrumb */}
          <p className="about-breadcrumb text-caption text-warm-gray mb-4">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </p>

          {/* Eyebrow */}
          <p className="about-eyebrow text-caption uppercase tracking-[0.15em] text-gold mb-6">
            អ្ពី / 关于 / ABOUT
          </p>

          {/* Title */}
          <h1 className="about-title text-hero-title font-display text-[#FAF8F3] mb-6" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <span className="inline-block">Building</span>{' '}
            <span className="inline-block">Cambodia&apos;s</span>{' '}
            <span className="inline-block">Future,</span>{' '}
            <span className="inline-block">One</span>{' '}
            <span className="inline-block">Job</span>{' '}
            <span className="inline-block">at</span>{' '}
            <span className="inline-block">a</span>{' '}
            <span className="inline-block">Time</span>
          </h1>

          {/* Subtitle */}
          <p className="about-subtitle text-body-large text-[rgba(250,248,243,0.8)] max-w-[600px] mx-auto mb-8">
            KhmerHR was founded on a simple belief: every Cambodian deserves access to dignified employment, and every employer deserves access to great talent.
          </p>

          {/* Lotus icon */}
          <div className="about-lotus flex justify-center animate-lotus-pulse">
            <LotusIcon size={48} />
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: MISSION & VISION ═══════════════ */}
      <section className="mission-vision-section bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="mission-card bg-white border border-sand rounded-2xl p-8 lg:p-10" style={{ borderLeft: '4px solid #D4AF37' }}>
              <Target size={40} className="text-gold mb-4" />
              <h2 className="text-h2 font-display text-charcoal mb-4">Our Mission</h2>
              <p className="text-body text-warm-gray leading-relaxed mb-6">
                To transform Cambodia&apos;s informal employment landscape by connecting 700,000+ workers with formal, dignified job opportunities. We bridge the gap between talent and employers through technology that respects local culture and meets people where they are.
              </p>
              <div className="flex items-center gap-2 text-body-small text-coral">
                <TrendingUp size={16} />
                <span>88.3% of Cambodians work informally — we&apos;re here to change that.</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="vision-card bg-white border border-sand rounded-2xl p-8 lg:p-10" style={{ borderLeft: '4px solid #059669' }}>
              <Eye size={40} className="text-emerald mb-4" />
              <h2 className="text-h2 font-display text-charcoal mb-4">Our Vision</h2>
              <p className="text-body text-warm-gray leading-relaxed mb-6">
                By 2030, KhmerHR will be the platform where 1 million Cambodians find formal employment annually. We envision a Cambodia where every worker has a digital identity, every employer finds talent effortlessly, and the gap between informal and formal work is closed.
              </p>
              <div className="flex items-center gap-2 text-body-small text-emerald">
                <TrendingUp size={16} />
                <span>Population under 30: 65% — the time to act is now.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: CULTURAL CONTEXT ═══════════════ */}
      <section className="culture-section bg-cream py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              វប្បធម្រ / 文化 / CULTURE
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal mb-3">
              Designed for Cambodia
            </h2>
            <p className="reveal-item text-body text-warm-gray max-w-[520px] mx-auto">
              Our platform is built on deep understanding of Cambodian culture, values, and daily realities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cultureCards.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div
                  key={i}
                  className="culture-card bg-white rounded-2xl border border-sand p-8 hover:shadow-feature hover:-translate-y-1.5 hover:border-gold transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                >
                  <IconComp size={48} className={getColorClasses(card.color)} />
                  <h3 className="text-h3 font-display text-charcoal mt-4 mb-3">{card.title}</h3>
                  <p className="text-body-small text-warm-gray leading-relaxed mb-4">{card.description}</p>
                  {card.stat && (
                    <p className={`text-caption ${getColorClasses(card.color)}`}>
                      {card.stat}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: IMPACT STATISTICS ═══════════════ */}
      <section
        className="impact-section py-16 md:py-20 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}
      >
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-display text-[#FAF8F3]">Our Impact</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {impactStats.map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={i}
                  className={`impact-stat-item flex flex-col items-center text-center relative ${i < impactStats.length - 1 ? 'lg:border-r lg:border-sand/30' : ''}`}
                >
                  <IconComp
                    size={32}
                    className={stat.color === 'coral' ? 'text-coral' : stat.color === 'emerald' ? 'text-emerald' : 'text-gold'}
                  />
                  <div className="flex items-baseline gap-0.5 mt-4">
                    <span className={`impact-num-${i} text-stat-number font-mono text-gold`}>0</span>
                    <span className="text-stat-number font-mono text-gold">{stat.suffix}</span>
                  </div>
                  <p className="text-body text-[rgba(250,248,243,0.7)] mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: TEAM ═══════════════ */}
      <section className="team-section bg-warm-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="text-center mb-12 reveal-section">
            <p className="reveal-item text-caption uppercase tracking-[0.1em] text-gold mb-2">
              ក្រុម / 团队 / TEAM
            </p>
            <h2 className="reveal-item text-h2 font-display text-charcoal">
              The People Behind KhmerHR
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="team-card bg-white border border-sand rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-card-hover hover:border-gold transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                {/* Avatar placeholder */}
                <div
                  className="w-[120px] h-[120px] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <h4 className="text-h4 font-display text-charcoal mb-1">{member.name}</h4>
                <p className="text-body-small text-gold mb-3">{member.role}</p>
                <p className="text-body-small text-warm-gray leading-relaxed mb-4">{member.bio}</p>
                <button
                  className="w-10 h-10 rounded-full bg-sand/50 flex items-center justify-center text-warm-gray hover:text-gold hover:bg-gold/10 transition-all mx-auto"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6: MEDIA & PRESS ═══════════════ */}
      <section className="press-section bg-cream py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <h3 className="text-h3 font-display text-charcoal text-center mb-8">In the News</h3>

          {/* Press Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
            {pressLogos.map((name, i) => (
              <div
                key={i}
                className="press-logo h-12 px-6 rounded-xl bg-white border border-sand flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <span className="text-body-small font-semibold text-charcoal">{name}</span>
              </div>
            ))}
          </div>

          {/* Quote Carousel */}
          <div className="max-w-[700px] mx-auto relative">
            <div className="bg-white border border-sand rounded-2xl p-8 md:p-10 relative overflow-hidden min-h-[200px]">
              {/* Quote marks */}
              <Quote size={40} className="text-gold/20 absolute top-4 left-4 rotate-180" />

              <div className="relative z-10">
                {pressQuotes.map((quote, i) => (
                  <div
                    key={i}
                    className={`transition-opacity duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                      i === currentQuote ? 'opacity-100 block' : 'opacity-0 hidden'
                    }`}
                  >
                    <p className="text-body-large text-charcoal italic leading-relaxed mb-4">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <p className="text-body-small text-warm-gray font-medium">
                      — {quote.source}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-sand">
                <button
                  onClick={prevQuote}
                  className="w-9 h-9 rounded-full border border-sand flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-colors"
                  aria-label="Previous quote"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  {pressQuotes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuote(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentQuote ? 'bg-gold w-6' : 'bg-sand hover:bg-gold/50'
                      }`}
                      aria-label={`Go to quote ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextQuote}
                  className="w-9 h-9 rounded-full border border-sand flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-colors"
                  aria-label="Next quote"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: CTA / JOIN US ═══════════════ */}
      <section
        className="cta-about-section py-16 md:py-20 lg:py-24"
        style={{ background: 'linear-gradient(135deg, #1A1714 0%, #2D2926 40%, #1A1714 100%)' }}
      >
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="cta-about max-w-[700px] mx-auto text-center">
            {/* Lotus */}
            <div className="flex justify-center mb-6 animate-lotus-pulse">
              <LotusIcon size={64} />
            </div>

            <h2 className="text-h2 font-display text-[#FAF8F3] mb-4">
              Be Part of Cambodia&apos;s Employment Revolution
            </h2>
            <p className="text-body-large text-[rgba(250,248,243,0.8)] mb-8">
              Whether you&apos;re looking for work or looking to hire, KhmerHR is your partner in building a better future.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                to="/jobs"
                className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200"
              >
                <Search size={20} className="mr-2" /> Find a Job
              </Link>
              <Link
                to="/employers"
                className="px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center border-2 border-gold text-gold hover:bg-gold/10 transition-all duration-200"
              >
                <Briefcase size={20} className="mr-2" /> Hire Talent
              </Link>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: () => <span className="font-bold text-sm">f</span>, label: 'Facebook' },
                { icon: () => <Zap size={20} />, label: 'Messenger' },
                { icon: () => <span className="font-bold text-sm">T</span>, label: 'Telegram' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-deep-brown transition-all duration-200 hover:scale-110"
                  aria-label={label}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
