import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Video,
  Radio,
  Clock,
  Play,
  Heart,
  Share2,
  Home,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Calendar,
  Bell,
  Zap,
  Globe,
  DollarSign,
  Smartphone,
  FileText,
  UserCheck,
  Eye,
  Send,
  Bookmark,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Easing constants                                                    */
/* ------------------------------------------------------------------ */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  AnimatedSection helper                                              */
/* ------------------------------------------------------------------ */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      className={className}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE Badge (pulsing red dot)                                        */
/* ------------------------------------------------------------------ */
function LiveBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-red-600 text-white font-bold rounded-md ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      LIVE
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Counter                                                        */
/* ------------------------------------------------------------------ */
function StatCounter({
  end,
  suffix = '',
  label,
  delay = 0,
}: {
  end: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-3xl md:text-4xl font-bold text-gold">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-warm-gray mt-1">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                           */
/* ------------------------------------------------------------------ */
const liveStreams = [
  {
    id: 1,
    company: 'CamKo Textile Group',
    verified: true,
    industry: 'Manufacturing',
    title: 'Garment Factory Hiring 500 Workers',
    viewers: 1247,
    positions: ['Sewing Operator', 'Quality Inspector', 'Line Supervisor'],
    thumbnail: 'garment',
  },
  {
    id: 2,
    company: 'Angkor Paradise Hotel',
    verified: true,
    industry: 'Tourism',
    title: 'Tourism Staff Recruitment 2025',
    viewers: 856,
    positions: ['Front Desk', 'Housekeeping', 'Restaurant Staff'],
    thumbnail: 'tourism',
  },
  {
    id: 3,
    company: 'SinoLink Technology',
    verified: true,
    industry: 'ICT',
    title: 'Hiring IT Developers & Engineers',
    viewers: 2103,
    positions: ['React Developer', 'Mobile App Dev', 'IT Support'],
    thumbnail: 'tech',
  },
];

const upcomingStreams = [
  {
    id: 4,
    company: 'Mekong Logistics',
    verified: true,
    industry: 'Logistics',
    title: 'Drivers & Warehouse Staff Hiring',
    date: 'Tomorrow, 9:00 AM',
    positions: ['Truck Driver', 'Warehouse Staff', 'Delivery Rider'],
  },
  {
    id: 5,
    company: 'Golden Rice Cambodia',
    verified: true,
    industry: 'Food Processing',
    title: 'Food Processing Workers Needed',
    date: 'Jan 18, 2:00 PM',
    positions: ['Machine Operator', 'Packaging Staff', 'Quality Control'],
  },
  {
    id: 6,
    company: 'CamKo Textile Group',
    verified: true,
    industry: 'Manufacturing',
    title: 'Second Shift Workers Recruitment',
    date: 'Jan 19, 10:00 AM',
    positions: ['Night Shift Operator', 'Security Guard', 'Cleaner'],
  },
];

const replayStreams = [
  {
    id: 7,
    company: 'Angkor Paradise Hotel',
    verified: true,
    title: 'Hotel Management Recruitment Q1',
    duration: '45 min',
    views: 5820,
    hired: 32,
  },
  {
    id: 8,
    company: 'SinoLink Technology',
    verified: true,
    title: 'Senior Developer Tech Interview',
    duration: '62 min',
    views: 3410,
    hired: 8,
  },
  {
    id: 9,
    company: 'CamKo Textile Group',
    verified: true,
    title: 'Factory Worker Hiring Event Dec',
    duration: '38 min',
    views: 9200,
    hired: 156,
  },
];

const chatMessages = [
  { user: 'user1', text: 'Is accommodation provided?', isHR: false },
  { user: 'HR_Mary', text: 'Yes! Free dormitory for all workers', isHR: true, icon: 'home' as const },
  { user: 'user2', text: 'What is the salary?', isHR: false },
  { user: 'HR_Mary', text: '$250-350/month + overtime pay', isHR: true },
  { user: 'user3', text: 'How to apply?', isHR: false },
  { user: 'user4', text: 'Do you need experience?', isHR: false },
  { user: 'HR_Mary', text: 'No experience needed! Training provided', isHR: true },
  { user: 'user5', text: 'Is there free lunch?', isHR: false },
];

const successStories = [
  {
    company: 'CamKo Textile Group',
    industry: 'Manufacturing',
    hired: 342,
    days: 14,
    previous: '45 days',
    quote: 'Live recruitment changed everything. We filled all positions in 2 weeks instead of 2 months.',
  },
  {
    company: 'Angkor Paradise Hotel',
    industry: 'Tourism & Hospitality',
    hired: 56,
    days: 21,
    previous: '60 days',
    quote: 'We connected with talented hospitality graduates in real-time. Quality hires, faster.',
  },
  {
    company: 'SinoLink Technology',
    industry: 'ICT',
    hired: 18,
    days: 10,
    previous: '30 days',
    quote: 'Found senior developers through live technical interviews. Saved 80% on recruitment costs.',
  },
];

/* ------------------------------------------------------------------ */
/*  Thumbnail Color Helper                                              */
/* ------------------------------------------------------------------ */
function getThumbnailBg(type: string) {
  switch (type) {
    case 'garment':
      return 'bg-amber-800';
    case 'tourism':
      return 'bg-teal-700';
    case 'tech':
      return 'bg-indigo-700';
    default:
      return 'bg-charcoal';
  }
}

/* ================================================================== */
/*  SECTION 1: Hero                                                   */
/* ================================================================== */
function HeroSection() {
  return (
    <section className="relative bg-[#1A1714] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />

      <div className="relative mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          {/* LIVE Badge */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          >
            <LiveBadge size="lg" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold text-[#FAF8F3] leading-[1.05] tracking-[-0.03em] mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
          >
            Live Recruitment
          </motion.h1>

          {/* Trilingual subtitle */}
          <motion.p
            className="text-warm-gray text-lg md:text-xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: easeOutExpo }}
            style={{ fontFamily: 'Noto Sans Khmer, sans-serif' }}
          >
            ជ្រើសរើសបុគ្គលិកតាមផ្សាយផ្ទាល់
          </motion.p>
          <motion.p
            className="text-gold text-base md:text-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: easeOutExpo }}
            style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
          >
            直播招聘
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-[#FAF8F3]/70 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: easeOutExpo }}
          >
            Connect with candidates in real-time. Stream job openings, answer questions, hire on
            the spot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: easeOutExpo }}
          >
            <Link
              to="#schedule"
              className="bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] inline-flex items-center justify-center gap-2 hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
              style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}
            >
              <Radio size={20} />
              Start Live Session
            </Link>
            <Link
              to="#schedule"
              className="border-2 border-gold/50 text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-all duration-200"
            >
              <Calendar size={20} />
              View Schedule
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto pt-8 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: easeOutExpo }}
          >
            <StatCounter end={50} suffix="+" label="Live Sessions" />
            <StatCounter end={10000} suffix="+" label="Candidates Reached" delay={200} />
            <StatCounter end={3} suffix="x" label="Faster Hiring" delay={400} />
          </motion.div>
        </motion.div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 27C1200 24 1320 18 1380 15L1440 12V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#FAF8F3"
          />
        </svg>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  SECTION 2: Live Now / Upcoming / Replays (Tabbed)                 */
/* ================================================================== */
function StreamsSection() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'replays'>('live');

  const tabs = [
    { key: 'live' as const, label: 'Live Now', icon: Radio },
    { key: 'upcoming' as const, label: 'Upcoming', icon: Calendar },
    { key: 'replays' as const, label: 'Replays', icon: Play },
  ];

  return (
    <AnimatedSection className="bg-[#FAF8F3] py-12 md:py-20" id="schedule">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">
            Live Sessions
          </h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">
            Watch, interact, and apply in real-time. Join live recruitment sessions from top
            employers in Cambodia.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#F5F0E8] rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gold text-[#1A1714]'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: easeSmooth }}
          >
            {/* --- LIVE NOW TAB --- */}
            {activeTab === 'live' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveStreams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: easeSmooth }}
                    className="bg-white border border-[#E8E0D0] rounded-2xl overflow-hidden hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative h-44 ${getThumbnailBg(stream.thumbnail)} flex items-center justify-center`}
                    >
                      <div className="absolute top-3 left-3">
                        <LiveBadge size="sm" />
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
                        <Eye size={12} className="text-white" />
                        <span className="text-white text-xs font-medium">
                          {stream.viewers.toLocaleString()}
                        </span>
                      </div>
                      <Play
                        size={48}
                        className="text-white/80 drop-shadow-lg"
                        fill="white"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-[#2D2926]">
                          {stream.company}
                        </span>
                        {stream.verified && (
                          <CheckCircle2 size={14} className="text-emerald" />
                        )}
                      </div>
                      <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">
                        {stream.title}
                      </h3>

                      {/* Positions */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {stream.positions.map((pos) => (
                          <span
                            key={pos}
                            className="text-[11px] font-medium bg-[#F5F0E8] text-[#2D2926] px-2.5 py-1 rounded-full"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>

                      <button className="w-full bg-coral text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#C44B2F] hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                        <Video size={16} />
                        Join Stream
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* --- UPCOMING TAB --- */}
            {activeTab === 'upcoming' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingStreams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: easeSmooth }}
                    className="bg-white border border-[#E8E0D0] rounded-2xl p-5 hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-[#2D2926]">
                        {stream.company}
                      </span>
                      {stream.verified && (
                        <CheckCircle2 size={14} className="text-emerald" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-coral text-sm font-medium mb-3">
                      <Clock size={14} />
                      {stream.date}
                    </div>

                    <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">
                      {stream.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {stream.positions.map((pos) => (
                        <span
                          key={pos}
                          className="text-[11px] font-medium bg-[#F5F0E8] text-[#2D2926] px-2.5 py-1 rounded-full"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>

                    <button className="w-full border-2 border-gold text-gold py-2.5 rounded-xl text-sm font-semibold hover:bg-gold/10 transition-all duration-200 flex items-center justify-center gap-2">
                      <Bell size={16} />
                      Remind Me
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* --- REPLAYS TAB --- */}
            {activeTab === 'replays' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {replayStreams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: easeSmooth }}
                    className="bg-white border border-[#E8E0D0] rounded-2xl overflow-hidden hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300"
                  >
                    <div className="relative h-40 bg-[#2D2926] flex items-center justify-center">
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
                        <Play size={10} className="text-white" />
                        <span className="text-white text-xs">{stream.duration}</span>
                      </div>
                      <Play
                        size={40}
                        className="text-white/70 drop-shadow-lg"
                        fill="white"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-[#2D2926]">
                          {stream.company}
                        </span>
                        {stream.verified && (
                          <CheckCircle2 size={14} className="text-emerald" />
                        )}
                      </div>

                      <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">
                        {stream.title}
                      </h3>

                      <div className="flex items-center justify-between text-warm-gray text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {stream.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1 text-emerald">
                          <UserCheck size={14} />
                          {stream.hired} hired
                        </span>
                      </div>

                      <button className="w-full bg-[#F5F0E8] text-[#2D2926] py-2.5 rounded-xl text-sm font-semibold hover:bg-gold/20 transition-all duration-200 flex items-center justify-center gap-2">
                        <Play size={16} />
                        Watch Replay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  SECTION 3: Simulated Live Room                                      */
/* ================================================================== */
function LiveRoomSection() {
  const [likeCount, setLikeCount] = useState(342);
  const [followed, setFollowed] = useState(false);
  const [chatInput, setChatInput] = useState('');

  return (
    <AnimatedSection className="bg-[#F5F0E8] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">
            Experience a Live Session
          </h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">
            See how live recruitment works. Watch the demo, interact with HR, and apply on the
            spot.
          </p>
        </div>

        {/* Live Room UI */}
        <div className="bg-[#1A1714] rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Main Video Area (70%) */}
            <div className="lg:w-[70%] relative">
              {/* Video placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-[#2D2926] to-[#1A1714] flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 40%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 70% 60%, #D4AF37 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                </div>

                <div className="absolute top-4 left-4">
                  <LiveBadge />
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <Eye size={16} className="text-white" />
                  <span className="text-white text-sm font-medium">1,247 watching</span>
                </div>

                {/* Play button in center */}
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-200">
                  <Play size={36} className="text-white ml-1" fill="white" />
                </div>

                {/* Stream title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">
                    Garment Factory Hiring 500 Workers — CamKo Textile Group
                  </h3>
                  <p className="text-white/60 text-sm">Live from Phnom Penh Special Economic Zone</p>
                </div>
              </div>

              {/* Bottom interaction bar */}
              <div className="bg-[#2D2926] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLikeCount((c) => c + 1)}
                    className="flex items-center gap-1.5 text-white/70 hover:text-red-400 transition-colors"
                  >
                    <Heart size={20} className={likeCount > 342 ? 'fill-red-500 text-red-500' : ''} />
                    <span className="text-sm">{likeCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white/70 hover:text-gold transition-colors">
                    <Share2 size={20} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                <button className="bg-gold text-[#1A1714] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#B8941F] transition-all duration-200 flex items-center gap-1.5">
                  <FileText size={16} />
                  Apply Now
                </button>
              </div>
            </div>

            {/* Right Sidebar (30%) */}
            <div className="lg:w-[30%] bg-[#1A1714] border-l border-white/10 flex flex-col max-h-[500px] lg:max-h-auto">
              {/* Company Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-amber-800 flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-semibold text-sm truncate">
                        CamKo Textile
                      </span>
                      <CheckCircle2 size={14} className="text-emerald shrink-0" />
                    </div>
                    <p className="text-white/50 text-xs">12,450 followers</p>
                  </div>
                  <button
                    onClick={() => setFollowed(!followed)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      followed
                        ? 'bg-white/10 text-white/70'
                        : 'bg-gold text-[#1A1714] hover:bg-[#B8941F]'
                    }`}
                  >
                    {followed ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Currently Hiring */}
                <p className="text-white/50 text-xs mb-2">Currently Hiring</p>
                <div className="space-y-2">
                  {[
                    { title: 'Sewing Operator', salary: '$250-300/mo' },
                    { title: 'Quality Inspector', salary: '$280-320/mo' },
                    { title: 'Line Supervisor', salary: '$350-450/mo' },
                  ].map((job) => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-white text-xs font-medium">{job.title}</p>
                        <p className="text-gold text-[11px]">{job.salary}</p>
                      </div>
                      <button className="text-coral text-[11px] font-semibold hover:underline">
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.isHR ? 'flex-row' : 'flex-row'}`}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        msg.isHR ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {msg.user[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-semibold ${
                          msg.isHR ? 'text-gold' : 'text-white/50'
                        }`}
                      >
                        @{msg.user}
                      </span>
                      <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                        {msg.text}
                        {msg.icon === 'home' && <Home size={12} className="text-gold" />}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none"
                  />
                  <button className="text-gold hover:text-[#B8941F] transition-colors">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  SECTION 4: Why Live Recruitment                                     */
/* ================================================================== */
const valueProps = [
  {
    icon: MessageCircle,
    title: 'Real-time Interaction',
    description:
      'Answer candidate questions instantly during the live stream. No more back-and-forth emails or missed calls.',
    color: 'text-emerald',
    bg: 'bg-emerald/10',
  },
  {
    icon: Globe,
    title: 'Wider Reach',
    description:
      'Connect with 1,000+ candidates simultaneously. Reach job seekers across all 25 provinces of Cambodia.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    title: 'Faster Hiring',
    description:
      'Reduce your hiring cycle from weeks to days. Interview, screen, and hire candidates in a single session.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: DollarSign,
    title: 'Cost Effective',
    description:
      'Save up to 80% compared to traditional job fairs. No booth rental, no travel costs, no printed materials.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
];

function WhyLiveSection() {
  return (
    <AnimatedSection className="bg-[#FAF8F3] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">
            Why Live Recruitment?
          </h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">
            The future of hiring is here. See why top employers in Cambodia are going live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: easeSmooth }}
                className="bg-white border border-[#E8E0D0] rounded-2xl p-6 hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${prop.bg} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} className={prop.color} />
                </div>
                <h3 className="font-semibold text-[#1A1714] text-lg mb-2">{prop.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{prop.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  SECTION 5: How to Go Live (3 Steps)                                 */
/* ================================================================== */
const steps = [
  {
    step: '01',
    title: 'Prepare',
    description: 'Upload your job details, set your stream schedule, and customize your company profile.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Go Live',
    description: 'One-click streaming from your phone or computer. No special equipment needed.',
    icon: Radio,
  },
  {
    step: '03',
    title: 'Hire',
    description: 'Review applications in real-time, schedule follow-up interviews, and make offers.',
    icon: UserCheck,
  },
];

function HowToGoLiveSection() {
  return (
    <AnimatedSection className="bg-[#1A1714] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#FAF8F3] leading-[1.15] tracking-[-0.01em]">
            For Employers — How to Go Live
          </h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">
            Three simple steps to start your live recruitment journey on KhmerHR.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute top-1/4 left-[30%] right-[30%] h-px bg-gold/20" />

          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: easeSmooth }}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} className="text-gold" />
                </div>
                <span className="text-gold/40 font-mono text-sm font-bold">{s.step}</span>
                <h3 className="font-semibold text-[#FAF8F3] text-xl mt-2 mb-3">{s.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>

                {/* Arrow connector on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-gold/20">
                    <ChevronRight size={24} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: easeSmooth }}
        >
          <Link
            to="/employers"
            className="inline-flex items-center gap-2 bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}
          >
            <Smartphone size={20} />
            Get Started as an Employer
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  SECTION 6: Success Stories                                          */
/* ================================================================== */
function SuccessStoriesSection() {
  return (
    <AnimatedSection className="bg-[#F5F0E8] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">
            Success Stories
          </h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">
            See how leading Cambodian companies transformed their hiring with live recruitment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: easeSmooth }}
              className="bg-white border border-[#E8E0D0] rounded-2xl p-6 hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)] hover:border-gold transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                  {story.company[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1714] text-sm">{story.company}</h3>
                  <p className="text-warm-gray text-xs">{story.industry}</p>
                </div>
              </div>

              {/* Results */}
              <div className="flex gap-4 mb-4">
                <div className="bg-emerald/10 rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-emerald font-bold text-lg">{story.hired}</p>
                  <p className="text-emerald/70 text-[11px]">Hired</p>
                </div>
                <div className="bg-gold/10 rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-gold font-bold text-lg">{story.days}</p>
                  <p className="text-gold/70 text-[11px]">Days</p>
                </div>
                <div className="bg-coral/10 rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-coral font-bold text-lg line-through">{story.previous}</p>
                  <p className="text-coral/70 text-[11px]">Before</p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Bookmark
                  size={20}
                  className="absolute -top-1 -left-1 text-gold/20"
                  fill="currentColor"
                />
                <p className="text-warm-gray text-sm leading-relaxed pl-4 italic">
                  {story.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  SECTION 7: CTA                                                      */
/* ================================================================== */
function CTASection() {
  return (
    <AnimatedSection className="bg-[#1A1714] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/8 blur-[100px]" />

      <div className="relative mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeSmooth }}
        >
          <h2 className="font-display text-[2rem] md:text-[3rem] font-bold text-[#FAF8F3] leading-[1.1] tracking-[-0.02em] mb-4">
            Ready to Go Live?
          </h2>
          <p className="text-warm-gray text-base md:text-lg max-w-xl mx-auto mb-8">
            Join the recruitment revolution. Start streaming your job openings and connect with
            candidates in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/employers"
              className="inline-flex items-center gap-2 bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
              style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}
            >
              <Radio size={20} />
              Start Your First Live Session — Free
            </Link>
          </div>

          <p className="text-warm-gray/60 text-sm mt-4">
            No credit card required. Free for first 3 sessions.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                 */
/* ================================================================== */
export default function Live() {
  return (
    <div className="flex-1">
      <HeroSection />
      <StreamsSection />
      <LiveRoomSection />
      <WhyLiveSection />
      <HowToGoLiveSection />
      <SuccessStoriesSection />
      <CTASection />
    </div>
  );
}
