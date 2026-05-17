import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  FileText,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  User,
  ThumbsUp,
  Flag,
  Circle,
  ArrowLeft,
  Plus,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

/* ──────────────────────── Animation helpers ──────────────────────── */

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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: easeSmooth }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────── Types ──────────────────────── */

type LessonType = 'video' | 'quiz' | 'document';
type VideoQuality = '360p' | '480p' | '720p';
type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

interface Lesson {
  id: number;
  title: string;
  type: LessonType;
  duration: string;
  isFree: boolean;
  isLocked: boolean;
  isCompleted: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
}

interface QAItem {
  id: number;
  question: string;
  author: string;
  date: string;
  answers: { author: string; text: string; date: string }[];
}

interface Note {
  id: number;
  text: string;
  timestamp: string;
  timeLabel: string;
}

/* ──────────────────────── Mock Data ──────────────────────── */

const courseData = {
  id: 1,
  title: 'Business English Mastery',
  teacher: 'John Smith',
  teacherTitle: 'Senior English Instructor',
  rating: 4.9,
  reviews: 245,
  students: 1245,
  lastUpdated: 'January 2025',
  totalDuration: '18h 30m',
  totalLessons: 17,
  description:
    'Master Business English for the modern workplace. This comprehensive course covers professional communication, email writing, presentation skills, meeting vocabulary, and negotiation techniques tailored for Cambodian professionals working in international companies.',
  learning: [
    'Write professional business emails with confidence',
    'Deliver impactful presentations in English',
    'Participate effectively in meetings and discussions',
    'Master negotiation vocabulary and phrases',
    'Build professional networking skills',
    'Understand cross-cultural business communication',
  ],
  requirements: [
    'Basic English proficiency (pre-intermediate)',
    'A computer or mobile device',
    'Dedication to practice 30 minutes daily',
  ],
};

const sections: Section[] = [
  {
    id: 1,
    title: 'Section 1: Introduction & Foundations',
    lessons: [
      { id: 101, title: 'Course Overview', type: 'video', duration: '5:30', isFree: true, isLocked: false, isCompleted: true },
      { id: 102, title: 'Setting Your Learning Goals', type: 'video', duration: '8:15', isFree: true, isLocked: false, isCompleted: true },
      { id: 103, title: 'Business English vs General English', type: 'video', duration: '12:00', isFree: true, isLocked: false, isCompleted: false },
      { id: 104, title: 'Section 1 Quiz', type: 'quiz', duration: '10 questions', isFree: false, isLocked: false, isCompleted: false },
    ],
  },
  {
    id: 2,
    title: 'Section 2: Professional Email Writing',
    lessons: [
      { id: 201, title: 'Email Structure & Format', type: 'video', duration: '15:20', isFree: false, isLocked: true, isCompleted: false },
      { id: 202, title: 'Common Email Phrases', type: 'video', duration: '18:45', isFree: false, isLocked: true, isCompleted: false },
      { id: 203, title: 'Email Templates Handbook', type: 'document', duration: '25 pages', isFree: false, isLocked: true, isCompleted: false },
      { id: 204, title: 'Email Writing Practice Quiz', type: 'quiz', duration: '15 questions', isFree: false, isLocked: true, isCompleted: false },
    ],
  },
  {
    id: 3,
    title: 'Section 3: Meeting & Presentation Skills',
    lessons: [
      { id: 301, title: 'Meeting Vocabulary', type: 'video', duration: '20:10', isFree: false, isLocked: true, isCompleted: false },
      { id: 302, title: 'Running Effective Meetings', type: 'video', duration: '22:30', isFree: false, isLocked: true, isCompleted: false },
      { id: 303, title: 'Presentation Structure', type: 'video', duration: '25:00', isFree: false, isLocked: true, isCompleted: false },
    ],
  },
  {
    id: 4,
    title: 'Section 4: Negotiation & Networking',
    lessons: [
      { id: 401, title: 'Negotiation Basics', type: 'video', duration: '18:00', isFree: false, isLocked: true, isCompleted: false },
      { id: 402, title: 'Key Negotiation Phrases', type: 'document', duration: '12 pages', isFree: false, isLocked: true, isCompleted: false },
      { id: 403, title: 'Networking Skills', type: 'video', duration: '16:30', isFree: false, isLocked: true, isCompleted: false },
    ],
  },
  {
    id: 5,
    title: 'Section 5: Final Assessment & Review',
    lessons: [
      { id: 501, title: 'Course Review Session', type: 'video', duration: '30:00', isFree: false, isLocked: true, isCompleted: false },
      { id: 502, title: 'Final Assessment', type: 'quiz', duration: '30 questions', isFree: false, isLocked: true, isCompleted: false },
      { id: 503, title: 'Certificate of Completion', type: 'document', duration: '1 page', isFree: false, isLocked: true, isCompleted: false },
    ],
  },
];

const reviews: Review[] = [
  { id: 1, author: 'Sokha Dara', rating: 5, date: '2 weeks ago', text: 'Excellent course! The email writing section helped me communicate better with my factory manager. Highly recommend for anyone working in international business.', likes: 24 },
  { id: 2, author: 'Meng Lee', rating: 5, date: '1 month ago', text: 'Very practical and well-structured. John explains everything clearly. The quiz sections are great for testing what you learned.', likes: 18 },
  { id: 3, author: 'Ratanak Pich', rating: 4, date: '1 month ago', text: 'Good content overall. I wish there were more examples for garment industry specifically, but the general business English is very helpful.', likes: 12 },
  { id: 4, author: ' Sophea Chan', rating: 5, date: '2 months ago', text: 'The presentation skills section alone is worth the price. My confidence in meetings has improved dramatically.', likes: 31 },
];

const qaItems: QAItem[] = [
  {
    id: 1,
    question: 'Is this course suitable for beginners?',
    author: 'Dara Kim',
    date: '3 days ago',
    answers: [
      { author: 'John Smith', text: 'This course is designed for pre-intermediate to intermediate English learners. You should know basic English grammar and vocabulary. If you can read and understand this reply, you are ready for the course!', date: '3 days ago' },
      { author: 'Meng Lee', text: 'I started with basic English and it was challenging but manageable. The instructor speaks clearly.', date: '2 days ago' },
    ],
  },
  {
    id: 2,
    question: 'Can I download the video lessons?',
    author: 'Ravy Sok',
    date: '1 week ago',
    answers: [
      { author: 'John Smith', text: 'Videos are available for streaming only, but you can download all documents and templates for offline use.', date: '1 week ago' },
    ],
  },
];

/* ──────────────────────── Video Player Component ──────────────────────── */

function VideoPlayer({
  currentLesson,
  isPlaying,
  onTogglePlay,
  progress,
  volume,
  isMuted,
  playbackSpeed,
  videoQuality,
  onProgressChange,
  onVolumeChange,
  onToggleMute,
  onSpeedChange,
  onQualityChange,
  currentTime,
  totalTime,
}: {
  currentLesson: Lesson;
  isPlaying: boolean;
  onTogglePlay: () => void;
  progress: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: PlaybackSpeed;
  videoQuality: VideoQuality;
  onProgressChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onQualityChange: (quality: VideoQuality) => void;
  currentTime: string;
  totalTime: string;
}) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const speeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities: VideoQuality[] = ['360p', '480p', '720p'];

  const lessonTypeIcon = (type: LessonType) => {
    switch (type) {
      case 'video': return <Play className="w-16 h-16 text-gold/70" />;
      case 'quiz': return <HelpCircle className="w-16 h-16 text-gold/70" />;
      case 'document': return <FileText className="w-16 h-16 text-gold/70" />;
    }
  };

  return (
    <div className="relative bg-deep-brown rounded-2xl overflow-hidden group">
      {/* Video display area */}
      <div
        className="aspect-video flex items-center justify-center relative cursor-pointer"
        onClick={onTogglePlay}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-deep-brown to-charcoal" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gold blur-3xl" />
        </div>

        {isPlaying ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <Pause className="w-16 h-16 text-gold/70 mx-auto" />
            <p className="text-warm-gray mt-3 text-sm">Playing: {currentLesson.title}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 text-center"
          >
            {lessonTypeIcon(currentLesson.type)}
            <p className="text-warm-gray mt-3 text-sm">Click to {currentLesson.type === 'video' ? 'play' : 'start'}</p>
          </motion.div>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-charcoal/95 border-t border-sand/10 px-4 py-3">
        {/* Progress bar */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full h-1.5 bg-sand/30 rounded-full appearance-none cursor-pointer accent-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={onTogglePlay} className="text-warm-white hover:text-gold transition-colors p-1">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Time */}
            <span className="text-xs text-warm-gray font-mono">
              {currentTime} / {totalTime}
            </span>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={onToggleMute} className="text-warm-white hover:text-gold transition-colors p-1">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-16 h-1 bg-sand/30 rounded-full appearance-none cursor-pointer accent-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed selector */}
            <div className="relative">
              <button
                onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}
                className="text-xs text-warm-white hover:text-gold transition-colors px-2 py-1 rounded border border-sand/20 hover:border-gold/50"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-charcoal border border-sand/20 rounded-lg shadow-lg overflow-hidden z-50">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => { onSpeedChange(s); setShowSpeedMenu(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        playbackSpeed === s ? 'bg-gold/20 text-gold' : 'text-warm-white hover:bg-sand/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality selector */}
            <div className="relative">
              <button
                onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }}
                className="text-xs text-warm-white hover:text-gold transition-colors px-2 py-1 rounded border border-sand/20 hover:border-gold/50"
              >
                <Settings className="w-4 h-4 inline mr-1" />
                {videoQuality}
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-charcoal border border-sand/20 rounded-lg shadow-lg overflow-hidden z-50">
                  {qualities.map((q) => (
                    <button
                      key={q}
                      onClick={() => { onQualityChange(q); setShowQualityMenu(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        videoQuality === q ? 'bg-gold/20 text-gold' : 'text-warm-white hover:bg-sand/10'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="text-warm-white hover:text-gold transition-colors p-1" onClick={() => toast('Fullscreen mode')}>
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Lesson Icon ──────────────────────── */

function LessonIcon({ type, isCompleted, isLocked }: { type: LessonType; isCompleted: boolean; isLocked: boolean }) {
  if (isCompleted) return <CheckCircle2 className="w-4 h-4 text-emerald" />;
  if (isLocked) return <Lock className="w-4 h-4 text-warm-gray" />;
  switch (type) {
    case 'video': return <Play className="w-4 h-4 text-gold" />;
    case 'quiz': return <HelpCircle className="w-4 h-4 text-coral" />;
    case 'document': return <FileText className="w-4 h-4 text-blue-600" />;
  }
}

/* ──────────────────────── Sidebar Component ──────────────────────── */

function CourseSidebar({
  sections,
  currentLessonId,
  onLessonSelect,
  progressPercent,
}: {
  sections: Section[];
  currentLessonId: number;
  onLessonSelect: (lesson: Lesson) => void;
  progressPercent: number;
}) {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.isCompleted).length,
    0
  );

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const allLessons = sections.flatMap((s) => s.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="bg-white border border-sand rounded-2xl overflow-hidden shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-sand bg-cream/50">
        <h3 className="font-display text-lg font-semibold text-charcoal mb-1 line-clamp-2">
          {courseData.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-warm-gray mb-4">
          <BookOpen className="w-4 h-4" />
          <span>{totalLessons} lessons</span>
          <span>·</span>
          <Clock className="w-4 h-4" />
          <span>{courseData.totalDuration}</span>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-warm-gray">{completedLessons}/{totalLessons} completed</span>
            <span className="font-semibold text-gold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-sand rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={() => {
            const nextIncomplete = allLessons.find((l) => !l.isCompleted);
            if (nextIncomplete) onLessonSelect(nextIncomplete);
          }}
          className="w-full bg-gold text-deep-brown font-semibold py-2.5 rounded-xl shadow-gold hover:bg-gold-dark hover:shadow-gold-hover transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Continue Learning
        </button>
      </div>

      {/* Curriculum list */}
      <div className="flex-1 overflow-y-auto max-h-[500px]">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const sectionCompleted = section.lessons.filter((l) => l.isCompleted).length;
          return (
            <div key={section.id} className="border-b border-sand/50 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-cream/50 transition-colors"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-charcoal line-clamp-1">{section.title}</p>
                  <p className="text-xs text-warm-gray">
                    {sectionCompleted}/{section.lessons.length} lessons
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-warm-gray flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-warm-gray flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-2">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson)}
                        disabled={lesson.isLocked}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-gold/10 border-l-2 border-gold'
                            : lesson.isLocked
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-cream/50 border-l-2 border-transparent'
                        }`}
                      >
                        <LessonIcon
                          type={lesson.type}
                          isCompleted={lesson.isCompleted}
                          isLocked={lesson.isLocked}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              isActive ? 'font-semibold text-gold' : 'text-charcoal'
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <p className="text-xs text-warm-gray">{lesson.duration}</p>
                        </div>
                        {lesson.isFree && !lesson.isLocked && (
                          <span className="text-xs font-medium text-emerald bg-emerald-light px-2 py-0.5 rounded-full flex-shrink-0">
                            FREE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev / Next */}
      <div className="p-4 border-t border-sand flex gap-3">
        <button
          onClick={() => prevLesson && onLessonSelect(prevLesson)}
          disabled={!prevLesson}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-sand text-charcoal hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <button
          onClick={() => nextLesson && onLessonSelect(nextLesson)}
          disabled={!nextLesson}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-gold text-deep-brown hover:bg-gold-dark transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────── Tab: Overview ──────────────────────── */

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl font-semibold text-charcoal mb-3">About This Course</h3>
        <p className="text-charcoal/80 leading-relaxed">{courseData.description}</p>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-charcoal mb-4">What You Will Learn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courseData.learning.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-cream/50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
              <span className="text-sm text-charcoal">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-charcoal mb-4">Requirements</h3>
        <ul className="space-y-2">
          {courseData.requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-3 text-charcoal/80">
              <Circle className="w-2 h-2 text-gold fill-gold" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ──────────────────────── Tab: Curriculum ──────────────────────── */

function CurriculumTab({
  sections,
  currentLessonId,
  onLessonSelect,
}: {
  sections: Section[];
  currentLessonId: number;
  onLessonSelect: (lesson: Lesson) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<number[]>(sections.map((s) => s.id));

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isExpanded = expandedSections.includes(section.id);
        const completedCount = section.lessons.filter((l) => l.isCompleted).length;
        return (
          <div key={section.id} className="border border-sand rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-cream/30 hover:bg-cream/60 transition-colors"
            >
              <div className="text-left">
                <h4 className="font-semibold text-charcoal text-sm sm:text-base">{section.title}</h4>
                <p className="text-xs text-warm-gray mt-0.5">
                  {completedCount}/{section.lessons.length} lessons ·{' '}
                  {section.lessons.reduce((acc, l) => acc + parseInt(l.duration), 0)} min
                </p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-warm-gray" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray" />
              )}
            </button>

            {isExpanded && (
              <div>
                {section.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !lesson.isLocked && onLessonSelect(lesson)}
                      disabled={lesson.isLocked}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left border-t border-sand/50 transition-colors ${
                        isActive
                          ? 'bg-gold/10'
                          : lesson.isLocked
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-cream/30'
                      }`}
                    >
                      <LessonIcon
                        type={lesson.type}
                        isCompleted={lesson.isCompleted}
                        isLocked={lesson.isLocked}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isActive ? 'font-semibold text-gold' : 'text-charcoal'}`}>
                          {lesson.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.isFree && (
                          <span className="text-xs text-emerald font-medium">FREE</span>
                        )}
                        <span className="text-xs text-warm-gray">{lesson.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────── Tab: Reviews ──────────────────────── */

function ReviewsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-4 bg-cream/50 rounded-xl">
        <div className="text-center">
          <div className="font-display text-4xl font-bold text-charcoal">{courseData.rating}</div>
          <div className="flex items-center gap-0.5 my-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(courseData.rating) ? 'text-gold fill-gold' : 'text-sand'}`}
              />
            ))}
          </div>
          <div className="text-xs text-warm-gray">{courseData.reviews} reviews</div>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 mb-1">
              <span className="text-xs text-warm-gray w-3">{star}</span>
              <Star className="w-3 h-3 text-gold fill-gold" />
              <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full"
                  style={{ width: `${star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="border-b border-sand pb-6 last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-warm-gray" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-charcoal text-sm">{review.author}</span>
                <span className="text-xs text-warm-gray">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-gold fill-gold' : 'text-sand'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed mb-3">{review.text}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs text-warm-gray hover:text-gold transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.likes})
                </button>
                <button className="flex items-center gap-1 text-xs text-warm-gray hover:text-coral transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────── Tab: Notes ──────────────────────── */

function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: 'Remember to use formal greetings in business emails. "Dear Mr./Ms." is the standard opening.', timestamp: '0:05:30', timeLabel: '5:30' },
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newNote,
        timestamp: '0:08:15',
        timeLabel: '8:15',
      },
    ]);
    setNewNote('');
    toast('Note saved!');
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Add note */}
      <div className="bg-cream/50 rounded-xl p-4">
        <label className="block text-sm font-semibold text-charcoal mb-2">Add a note at current time</label>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type your note here..."
          className="w-full px-4 py-3 bg-white border border-sand rounded-xl text-sm text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none h-24"
        />
        <button
          onClick={addNote}
          className="mt-3 inline-flex items-center gap-2 bg-gold text-deep-brown px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          Save Note
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="w-12 h-12 text-sand mx-auto mb-3" />
          <p className="text-warm-gray text-sm">No notes yet. Start taking notes while learning!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white border border-sand rounded-xl p-4 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                  {note.timeLabel}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-warm-gray hover:text-coral transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-charcoal/80">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Tab: Q&A ──────────────────────── */

function QaTab() {
  const [expandedQa, setExpandedQa] = useState<number[]>([]);

  const toggleQa = (id: number) => {
    setExpandedQa((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Questions & Answers
        </h3>
        <button
          onClick={() => toast('Ask a question feature coming soon!')}
          className="inline-flex items-center gap-2 bg-gold text-deep-brown px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      {qaItems.map((qa) => {
        const isExpanded = expandedQa.includes(qa.id);
        return (
          <div key={qa.id} className="border border-sand rounded-xl overflow-hidden">
            <button
              onClick={() => toggleQa(qa.id)}
              className="w-full flex items-start gap-3 p-4 text-left hover:bg-cream/30 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-charcoal">{qa.question}</p>
                <p className="text-xs text-warm-gray mt-1">
                  {qa.author} · {qa.date} · {qa.answers.length} answer{qa.answers.length !== 1 ? 's' : ''}
                </p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-warm-gray flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray flex-shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-sand/50 bg-cream/20">
                {qa.answers.map((ans, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-sand/30 last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-charcoal">{ans.author}</span>
                        {ans.author === courseData.teacher && (
                          <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
                            Instructor
                          </span>
                        )}
                        <span className="text-xs text-warm-gray">{ans.date}</span>
                      </div>
                      <p className="text-sm text-charcoal/80">{ans.text}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <button className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────── Main Page Component ──────────────────────── */

export default function CoursePlayer() {
  const { id: _courseId } = useParams<{ id: string }>();
  void _courseId;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const allLessons = sections.flatMap((s) => s.lessons);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(allLessons[2]); // Lesson 103 as current

  const completedLessons = allLessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedLessons / allLessons.length) * 100);

  const currentTime = '8:15';
  const totalTime = currentLesson.duration;

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    if (lesson.isLocked) {
      toast('This lesson is locked. Upgrade to access.');
      return;
    }
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'curriculum', label: 'Curriculum' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'notes', label: 'Notes' },
    { key: 'qa', label: 'Q&A' },
  ];

  return (
    <main className="min-h-screen bg-warm-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-sand">
        <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/courses" className="text-warm-gray hover:text-gold transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Video + Info (70%) */}
          <div className="flex-1 lg:w-[70%] min-w-0">
            {/* Video Player */}
            <ScrollReveal>
              <VideoPlayer
                currentLesson={currentLesson}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                progress={progress}
                volume={volume}
                isMuted={isMuted}
                playbackSpeed={playbackSpeed}
                videoQuality={videoQuality}
                onProgressChange={setProgress}
                onVolumeChange={setVolume}
                onToggleMute={() => setIsMuted(!isMuted)}
                onSpeedChange={setPlaybackSpeed}
                onQualityChange={setVideoQuality}
                currentTime={currentTime}
                totalTime={totalTime}
              />
            </ScrollReveal>

            {/* Course info */}
            <div className="mt-6">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-4">
                {courseData.title}
              </h1>

              {/* Teacher info */}
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{courseData.teacher}</p>
                    <p className="text-xs text-warm-gray">{courseData.teacherTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsFollowing(!isFollowing); toast(isFollowing ? 'Unfollowed' : 'Following!'); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    isFollowing
                      ? 'bg-cream text-charcoal border-sand hover:border-coral hover:text-coral'
                      : 'bg-gold text-deep-brown border-gold hover:bg-gold-dark'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="font-semibold text-charcoal">{courseData.rating}</span>
                  <span>({courseData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {courseData.lastUpdated}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => { setIsSaved(!isSaved); toast(isSaved ? 'Removed from My Learning' : 'Added to My Learning!'); }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    isSaved
                      ? 'bg-coral text-white border-coral hover:bg-coral-dark'
                      : 'bg-white text-charcoal border-sand hover:border-gold hover:text-gold'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  {isSaved ? 'Saved' : 'Add to My Learning'}
                </button>
                <button
                  onClick={() => toast('Share options: Facebook, Messenger, Telegram')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-sand text-charcoal hover:border-gold hover:text-gold transition-all bg-white"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => toast('Download started!')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-sand text-charcoal hover:border-gold hover:text-gold transition-all bg-white"
                >
                  <Download className="w-4 h-4" />
                  Download Materials
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-sand mb-6">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                        activeTab === tab.key
                          ? 'border-gold text-gold'
                          : 'border-transparent text-warm-gray hover:text-charcoal'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'curriculum' && (
                  <CurriculumTab
                    sections={sections}
                    currentLessonId={currentLesson.id}
                    onLessonSelect={handleLessonSelect}
                  />
                )}
                {activeTab === 'reviews' && <ReviewsTab />}
                {activeTab === 'notes' && <NotesTab />}
                {activeTab === 'qa' && <QaTab />}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (30%) */}
          <div className="lg:w-[30%] min-w-0">
            <div className="lg:sticky lg:top-6">
              <ScrollReveal delay={0.2}>
                <CourseSidebar
                  sections={sections}
                  currentLessonId={currentLesson.id}
                  onLessonSelect={handleLessonSelect}
                  progressPercent={progressPercent}
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
