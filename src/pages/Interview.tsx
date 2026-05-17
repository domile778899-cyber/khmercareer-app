import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video, Brain, Users, Code, Calendar, MessageSquare,
  Play, Square, Monitor, FileText, CheckCircle, Clock,
  Star, ChevronRight, Mic, Cloud, BarChart3,
  Smartphone, Zap, Shield, Radio,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

/* ───────────────────── DATA ───────────────────── */

const stats = [
  { value: '500+', label: 'Interviews Conducted', labelKm: 'បរិច្ចាគ​សម្ភាស​ការងារ', labelZh: '场面试已完成' },
  { value: '98%', label: 'Satisfaction Rate', labelKm: 'អត្រា​ពេញចិត្ត', labelZh: '满意度' },
  { value: '45min', label: 'Average Duration', labelKm: 'រយៈពេល​មធ្យម', labelZh: '平均时长' },
  { value: '3', label: 'Languages', labelKm: 'ភាសា', labelZh: '种语言' },
];

const interviewTypes = [
  {
    icon: Video,
    title: 'One-on-One Video Interview',
    titleKm: 'សម្ភាស​វីដេអូ​មួយ​នឹង​មួយ',
    titleZh: '一对一视频面试',
    description: 'Standard video call with HD quality recording. Perfect for initial screenings and follow-up conversations.',
    features: ['HD Video & Audio', 'Auto-recording', 'Screen sharing', 'Virtual background'],
  },
  {
    icon: Brain,
    title: 'AI-Assisted Interview',
    titleKm: 'សម្ភាស​ជំនួយ​ដោយ​សមត្ថភាព',
    titleZh: 'AI辅助面试',
    description: 'AI generates tailored questions based on the role and analyzes candidate responses in real-time.',
    features: ['AI-generated questions', 'Sentiment analysis', 'Skill assessment', 'Bias detection'],
  },
  {
    icon: Users,
    title: 'Group Panel Interview',
    titleKm: 'សម្ភាស​ក្រុម​បន្ទះ',
    titleZh: '小组 Panel 面试',
    description: 'Multiple interviewers can join with breakout rooms for team-based evaluation and consensus scoring.',
    features: ['Up to 6 interviewers', 'Breakout rooms', 'Collaborative notes', 'Consensus scoring'],
  },
  {
    icon: Code,
    title: 'Technical Coding Interview',
    titleKm: 'សម្ភាស​សរសេរ​កូដបច្ចេកទេស',
    titleZh: '技术编程面试',
    description: 'Live coding environment with syntax highlighting, compiler, and real-time collaboration for tech roles.',
    features: ['Live code editor', '30+ languages', 'Syntax highlighting', 'Auto-evaluation'],
  },
];

const steps = [
  {
    number: '01',
    title: 'Schedule',
    titleKm: 'កំណត់​កាលបរិច្ឆេទ',
    titleZh: '安排',
    description: 'Pick a time slot that works for everyone. Auto-invites sent via email, SMS, and Messenger with reminders.',
    icon: Calendar,
  },
  {
    number: '02',
    title: 'Interview',
    titleKm: 'សម្ភាសការងារ',
    titleZh: '面试',
    description: 'Join directly from your browser — no downloads needed. Auto-recording starts, take real-time notes collaboratively.',
    icon: Play,
  },
  {
    number: '03',
    title: 'Evaluate',
    titleKm: 'ប្រឹក្សា',
    titleZh: '评估',
    description: 'Use structured scorecards, team feedback, and auto-generated transcripts to make informed hiring decisions.',
    icon: Star,
  },
];

const features = [
  {
    icon: Cloud,
    title: 'Auto-recording & Cloud Storage',
    titleKm: 'ថតស្វ័យប្រវត្តិ & ឃ្លាំងទុកក្នុងពពក',
    titleZh: '自动录制与云存储',
    description: 'Every interview is automatically recorded and securely stored in the cloud with easy playback and sharing.',
  },
  {
    icon: Mic,
    title: 'Real-time AI Transcription',
    titleKm: 'ការបកប្រែសម្ភាសការងារ AI ក្នុងពេលវេលាពិត',
    titleZh: '实时AI转录',
    description: 'Get accurate transcripts in Khmer, Chinese, and English. Searchable and exportable for compliance.',
  },
  {
    icon: FileText,
    title: 'Collaborative Scorecards',
    titleKm: 'ប័ណ្ណពិន្ទុធ្វើការជាមួយគ្នា',
    titleZh: '协作评分卡',
    description: 'Structured evaluation forms that let interviewers score candidates independently and compare notes.',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    titleKm: 'ការរួមបញ្ចូលប្រតិទិន',
    titleZh: '日历集成',
    description: 'Seamlessly sync with Google Calendar and Outlook. Send invites, track responses, and manage availability.',
  },
  {
    icon: Smartphone,
    title: 'One-click Join',
    titleKm: 'ចូលបានភ្លាមៗ',
    titleZh: '一键加入',
    description: 'No app installation required. Candidates and interviewers join directly from their browser in one click.',
  },
  {
    icon: BarChart3,
    title: 'Interview Analytics Dashboard',
    titleKm: 'ផ្ទាំងបង្ហាញការវិភាគសម្ភាសការងារ',
    titleZh: '面试分析仪表板',
    description: 'Track interview completion rates, average scores, time-to-hire metrics, and team performance.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    nameKm: 'ឥតគិតថ្លៃ',
    nameZh: '免费',
    price: '$0',
    period: '/month',
    description: 'Perfect for small teams getting started',
    features: ['5 interviews/month', '1 interviewer', 'Basic recording', 'Email invites'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro',
    nameKm: 'ប្រូ',
    nameZh: '专业版',
    price: '$49',
    period: '/month',
    description: 'For growing teams with active hiring',
    features: ['Unlimited interviews', 'Up to 10 interviewers', 'AI transcription', 'Collaborative scorecards', 'Analytics dashboard', 'Priority support'],
    cta: 'Start Pro Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    nameKm: 'សហគ្រាស',
    nameZh: '企业版',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs',
    features: ['Everything in Pro', 'Unlimited interviewers', 'SSO & SAML', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const testimonials = [
  {
    name: 'Sopheap Lim',
    role: 'HR Director',
    company: 'Camko Manufacturing',
    avatar: 'SL',
    quote: 'The AI-assisted interview feature has cut our screening time by 60%. The multi-language support is essential for our diverse workforce.',
    rating: 5,
  },
  {
    name: 'Rathanak Chea',
    role: 'Tech Lead',
    company: 'Phnom Penh Digital',
    avatar: 'RC',
    quote: 'The coding interview environment is excellent. Syntax highlighting and auto-evaluation make technical screening so much easier.',
    rating: 5,
  },
  {
    name: 'Mealea Sor',
    role: 'Recruitment Manager',
    company: 'Grand Hotel Group',
    avatar: 'MS',
    quote: 'We conduct 50+ interviews monthly across 3 languages. KhmerHR\'s platform handles everything seamlessly. Highly recommended!',
    rating: 5,
  },
];

const mockQuestions = [
  { id: 1, text: 'Tell us about your background and experience', checked: true },
  { id: 2, text: 'Why are you interested in this position?', checked: true },
  { id: 3, text: 'Describe a challenging project you worked on', checked: false },
  { id: 4, text: 'How do you handle tight deadlines?', checked: false },
  { id: 5, text: 'What are your salary expectations?', checked: false },
];

/* ───────────────────── ANIMATION VARIANTS ───────────────────── */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

/* ───────────────────── COMPONENTS ───────────────────── */

function AnimatedCounter({ value }: { value: string }) {
  return (
    <span className="font-mono text-stat-number text-gold">{value}</span>
  );
}

function SectionTitle({ title, titleKm, titleZh, subtitle, light = false }: { title: string; titleKm?: string; titleZh?: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <p className={`text-caption font-medium mb-3 ${light ? 'text-gold-light/70' : 'text-gold'}`}>
        {titleKm && <span className="font-khmer mr-2">{titleKm}</span>}
        {titleZh && <span className="font-chinese mr-2">{titleZh}</span>}
      </p>
      <h2 className={`text-h2 font-display ${light ? 'text-white' : 'text-charcoal'}`}>{title}</h2>
      {subtitle && (
        <p className={`text-body-large mt-4 max-w-2xl mx-auto ${light ? 'text-white/70' : 'text-warm-gray'}`}>{subtitle}</p>
      )}
    </div>
  );
}

/* ───────────────────── SECTIONS ───────────────────── */

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-deep-brown">
      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px] py-32 text-center">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={staggerChild} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-caption font-medium">
              <Radio size={14} className="animate-pulse" />
              Live Interview Platform
            </span>
          </motion.div>

          <motion.h1 variants={staggerChild} className="text-hero-title font-display text-white mb-4">
            Smart Interview
            <span className="block bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Platform
            </span>
          </motion.h1>

          <motion.p variants={staggerChild} className="font-khmer text-gold-light/80 text-lg mb-2">
            វេទិកាសម្ភាសការងារឆ្លាតវៃ
          </motion.p>

          <motion.p variants={staggerChild} className="font-chinese text-white/60 text-base mb-8">
            智能面试平台 — 让招聘更高效
          </motion.p>

          <motion.p variants={staggerChild} className="text-body-large text-white/70 max-w-2xl mx-auto mb-10">
            Streamline your recruitment process with video interviews, AI-powered assessments,
            and real-time collaboration — all in one platform supporting Khmer, Chinese, and English.
          </motion.p>

          <motion.div variants={staggerChild} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] transition-all duration-200">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Interview
            </button>
            <button className="border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center hover:bg-gold/10 hover:scale-[1.03] transition-all duration-200">
              <Play className="w-5 h-5 mr-2" />
              View Demo
            </button>
          </motion.div>

          <motion.div variants={staggerChild} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <AnimatedCounter value={stat.value} />
                <p className="text-body-small text-white/60 mt-1">{stat.label}</p>
                <p className="text-caption font-khmer text-white/40">{stat.labelKm}</p>
                <p className="text-caption font-chinese text-white/40">{stat.labelZh}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function InterviewTypesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="Interview Types"
          titleKm="ប្រភេទ​សម្ភាសការងារ"
          titleZh="面试类型"
          subtitle="Choose the right interview format for every stage of your hiring process"
        />

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {interviewTypes.map((type) => (
            <motion.div
              key={type.title}
              variants={staggerChild}
              className="group bg-white border border-sand rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                  <type.icon className="w-6 h-6 lg:w-7 lg:h-7 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-h4 font-display text-charcoal mb-1">{type.title}</h3>
                  <p className="text-caption font-khmer text-warm-gray mb-1">{type.titleKm}</p>
                  <p className="text-caption font-chinese text-warm-gray mb-3">{type.titleZh}</p>
                  <p className="text-body-small text-warm-gray mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-body-small text-charcoal">
                        <CheckCircle size={16} className="text-emerald flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 inline-flex items-center text-gold text-body-small font-medium hover:text-gold-dark transition-colors">
                    Learn more
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="How It Works"
          titleKm="វិធី​ប្រើប្រាស់"
          titleZh="使用流程"
          subtitle="Three simple steps to conduct professional interviews"
        />

        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />

          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={staggerChild} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold mb-6 relative z-10">
                    <step.icon className="w-8 h-8 text-deep-brown" />
                  </div>
                  <span className="text-caption font-mono text-gold mb-2">Step {step.number}</span>
                  <h3 className="text-h3 font-display text-charcoal mb-1">{step.title}</h3>
                  <p className="text-caption font-khmer text-warm-gray mb-1">{step.titleKm}</p>
                  <p className="text-caption font-chinese text-warm-gray mb-4">{step.titleZh}</p>
                  <p className="text-body-small text-warm-gray max-w-xs mx-auto">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MockInterviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [elapsedTime, setElapsedTime] = useState('14:32');
  const [questions, setQuestions] = useState(mockQuestions);
  const [ratings, setRatings] = useState({ communication: 4, technical: 3, cultureFit: 5, language: 4 });
  const [notes, setNotes] = useState('');

  const toggleQuestion = (id: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, checked: !q.checked } : q)));
  };

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  // Simulate timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const [m, s] = prev.split(':').map(Number);
        const totalSeconds = m * 60 + s + 1;
        const newM = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const newS = (totalSeconds % 60).toString().padStart(2, '0');
        return `${newM}:${newS}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="Live Interview Interface"
          titleKm="ចំណុចប្រទាក់​សម្ភាសការងារ​ផ្ទាល់"
          titleZh="面试界面演示"
          subtitle="A realistic view of our interview platform in action"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-sand bg-deep-brown"
        >
          {/* Top bar */}
          <div className="bg-charcoal px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-body-small text-white/60 ml-2">KhmerHR Interview</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-caption font-mono text-gold bg-gold/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Clock size={12} />
                {elapsedTime}
              </span>
              <span className="text-caption text-white/40">Recording</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row">
            {/* Left: Video area */}
            <div className="flex-1 bg-[#12100e] p-4 lg:p-6">
              {/* Main video */}
              <div className="aspect-video bg-gradient-to-br from-charcoal to-deep-brown rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-display text-gold">SL</span>
                  </div>
                  <p className="text-body-small text-white/60">Sopheap Lim (Candidate)</p>
                </div>
                {/* Connection quality indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-emerald rounded-sm" />
                    <div className="w-1 h-3 bg-emerald rounded-sm" />
                    <div className="w-1 h-3 bg-emerald rounded-sm" />
                    <div className="w-1 h-3 bg-white/20 rounded-sm" />
                  </div>
                  <span className="text-caption text-white/60">HD</span>
                </div>
              </div>

              {/* Self view */}
              <div className="w-32 h-24 lg:w-40 lg:h-28 bg-charcoal rounded-lg flex items-center justify-center border border-white/10 ml-auto -mt-16 mr-4 lg:mr-6 relative z-10">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-1">
                    <Users size={14} className="text-emerald" />
                  </div>
                  <p className="text-caption text-white/40">You</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Mic size={18} className="text-white" />
                </button>
                <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Video size={18} className="text-white" />
                </button>
                <button className="w-14 h-11 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
                  <Square size={18} className="text-white" />
                </button>
                <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Monitor size={18} className="text-white" />
                </button>
                <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <MessageSquare size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-[360px] bg-charcoal border-l border-white/10 p-4 lg:p-5 flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {/* Candidate info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-h4 text-white mb-3">Candidate Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-body-small">
                    <span className="text-white/50">Name</span>
                    <span className="text-white">Sopheap Lim</span>
                  </div>
                  <div className="flex justify-between text-body-small">
                    <span className="text-white/50">Position</span>
                    <span className="text-white">Senior Developer</span>
                  </div>
                  <div className="flex justify-between text-body-small">
                    <span className="text-white/50">Experience</span>
                    <span className="text-white">5 years</span>
                  </div>
                  <div className="flex justify-between text-body-small">
                    <span className="text-white/50">Applied</span>
                    <span className="text-white">2 days ago</span>
                  </div>
                </div>
              </div>

              {/* Questions checklist */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-h4 text-white mb-3">Questions</h4>
                <div className="space-y-2">
                  {questions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full flex items-start gap-2.5 text-left group"
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${q.checked ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-gold/50'}`}>
                        {q.checked && <CheckCircle size={14} className="text-deep-brown" />}
                      </div>
                      <span className={`text-body-small ${q.checked ? 'text-white/60 line-through' : 'text-white/80'}`}>
                        {q.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-h4 text-white mb-3">Ratings</h4>
                <div className="space-y-3">
                  {[
                    { key: 'communication', label: 'Communication' },
                    { key: 'technical', label: 'Technical Skills' },
                    { key: 'cultureFit', label: 'Culture Fit' },
                    { key: 'language', label: 'Language' },
                  ].map((r) => (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-body-small text-white/60">{r.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(r.key, star)}
                            className="p-0.5"
                          >
                            <Star
                              size={16}
                              className={star <= (ratings as Record<string, number>)[r.key] ? 'text-gold fill-gold' : 'text-white/20'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-h4 text-white mb-3">Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-body-small text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-charcoal border-t border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-caption text-white/60">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption text-white/40 font-khmer">កំពុង​ផ្សាយបន្តផ្ទាល់</span>
              <span className="text-caption text-white/40">Live</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="Platform Features"
          titleKm="លក្ខណងារ​វេទិកា"
          titleZh="平台功能"
          subtitle="Everything you need to conduct professional interviews at scale"
        />

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerChild}
              className="group bg-white border border-sand rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-feature hover:-translate-y-1.5 hover:border-gold/30 transition-all duration-300"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-5 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                <f.icon className="w-6 h-6 lg:w-7 lg:h-7 text-gold" />
              </div>
              <h3 className="text-h4 font-display text-charcoal mb-1">{f.title}</h3>
              <p className="text-caption font-khmer text-warm-gray mb-1">{f.titleKm}</p>
              <p className="text-caption font-chinese text-warm-gray mb-3">{f.titleZh}</p>
              <p className="text-body-small text-warm-gray">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="Interview Pricing"
          titleKm="តម្លៃ​សម្ភាសការងារ"
          titleZh="面试定价"
          subtitle="Flexible plans for teams of all sizes"
        />

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerChild}
              className={`relative bg-white rounded-2xl p-6 lg:p-8 border-2 transition-all duration-300 ${
                plan.featured
                  ? 'border-gold shadow-[0_24px_48px_rgba(212,175,55,0.15)] scale-[1.02] lg:scale-[1.03]'
                  : 'border-sand hover:border-gold/30'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-px left-6 right-6 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-b-full" />
              )}
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-deep-brown text-caption font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-6 pt-2">
                <h3 className="text-h3 font-display text-charcoal">{plan.name}</h3>
                <p className="text-caption font-khmer text-warm-gray">{plan.nameKm}</p>
                <p className="text-caption font-chinese text-warm-gray">{plan.nameZh}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-mono text-3xl lg:text-4xl font-bold text-charcoal">{plan.price}</span>
                  <span className="text-body-small text-warm-gray">{plan.period}</span>
                </div>
                <p className="text-body-small text-warm-gray mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-body-small text-charcoal">
                    <CheckCircle size={16} className="text-emerald flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/pricing"
                className={`block text-center w-full py-3.5 rounded-xl text-button-small font-semibold min-h-[48px] flex items-center justify-center transition-all duration-200 hover:scale-[1.03] ${
                  plan.featured
                    ? 'bg-gold text-deep-brown shadow-gold hover:bg-gold-dark'
                    : 'border-2 border-gold text-gold hover:bg-gold/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-body-small text-warm-gray mt-8">
          Compare all features on our{' '}
          <Link to="/pricing" className="text-gold hover:text-gold-dark transition-colors font-medium">
            full pricing page
          </Link>
        </p>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-warm-white">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <SectionTitle
          title="What Employers Say"
          titleKm="អ្វី​ដែល​និយោជក​និយាយ"
          titleZh="客户评价"
          subtitle="Trusted by companies across Cambodia"
        />

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerChild}
              className="bg-cream rounded-2xl p-6 lg:p-8 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-4 left-6 text-6xl font-display text-gold/20 leading-none select-none">
                &ldquo;
              </div>

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>

                <p className="text-body text-charcoal mb-6 leading-relaxed">{t.quote}</p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-deep-brown font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-charcoal">{t.name}</p>
                    <p className="text-caption text-warm-gray">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-deep-brown relative overflow-hidden">
      {/* Gold gradient accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.12)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="relative z-10 mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px] text-center"
      >
        <h2 className="text-h1 font-display text-white mb-3">
          Ready to Transform Your Hiring?
        </h2>
        <p className="font-khmer text-gold-light/70 text-lg mb-2">
          តើ​អ្នក​រួច​រាល់​ដើម្បី​ផ្លាស់ប្ដូរ​ការ​ជ្រើសរើស​របស់​អ្នក​ឬ​នៅ?
        </p>
        <p className="font-chinese text-white/50 text-base mb-8">
          准备好改变您的招聘流程了吗？
        </p>

        <p className="text-body-large text-white/60 max-w-2xl mx-auto mb-10">
          Join hundreds of employers who have streamlined their interview process with KhmerHR.
          Start for free today — no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pricing"
            className="bg-gold text-deep-brown px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-gold hover:bg-gold-dark hover:scale-[1.03] transition-all duration-200"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started Free
          </Link>
          <Link
            to="/contact"
            className="border-2 border-gold text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center hover:bg-gold/10 hover:scale-[1.03] transition-all duration-200"
          >
            <Shield className="w-5 h-5 mr-2" />
            Contact Sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */

export default function Interview() {
  return (
    <div>
      <HeroSection />
      <InterviewTypesSection />
      <HowItWorksSection />
      <MockInterviewSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
