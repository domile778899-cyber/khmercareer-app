import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Users,
  Star,
  Globe,
  Award,
  Smartphone,
  CheckCircle,
  Heart,
  Share2,
  Facebook,
  ChevronDown,
  ChevronUp,
  Lock,
  HelpCircle,
  BookOpen,
  MessageCircle,
  FileText,
} from "lucide-react";

/* ── types ── */
interface Lesson {
  title: string;
  duration: string;
  type: "video" | "document" | "quiz";
  free: boolean;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

interface Review {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

interface RelatedCourse {
  title: string;
  teacher: string;
  price: string;
  rating: number;
  color: string;
}

/* ── mock data ── */
const WHAT_YOU_LEARN = [
  "Master 200+ business phrases used in professional settings",
  "Confident email writing for workplace communication",
  "Professional presentations and public speaking skills",
  "Negotiation vocabulary and persuasion techniques",
  "Meeting facilitation and agenda management",
  "Cross-cultural communication best practices",
];

const CURRICULUM: Section[] = [
  {
    title: "Section 1: Introduction to Business English",
    lessons: [
      { title: "Course Overview", duration: "3:20", type: "video", free: true },
      { title: "Setting Your Learning Goals", duration: "5:45", type: "video", free: true },
      { title: "Common Business Terms", duration: "12:10", type: "video", free: false },
      { title: "Vocabulary Worksheet", duration: "10 min", type: "document", free: false },
    ],
  },
  {
    title: "Section 2: Email Communication",
    lessons: [
      { title: "Email Structure and Format", duration: "8:30", type: "video", free: false },
      { title: "Writing Professional Subject Lines", duration: "6:15", type: "video", free: false },
      { title: "Common Email Phrases", duration: "9:40", type: "video", free: false },
      { title: "Email Practice Quiz", duration: "5 min", type: "quiz", free: false },
    ],
  },
  {
    title: "Section 3: Meetings & Presentations",
    lessons: [
      { title: "Opening a Meeting", duration: "7:20", type: "video", free: false },
      { title: "Giving Updates and Reports", duration: "10:05", type: "video", free: false },
      { title: "Presentation Structure", duration: "14:30", type: "video", free: false },
      { title: "Presentation Slides Template", duration: "15 min", type: "document", free: false },
    ],
  },
  {
    title: "Section 4: Negotiation Skills",
    lessons: [
      { title: "Negotiation Basics", duration: "9:10", type: "video", free: false },
      { title: "Making Offers and Counteroffers", duration: "11:25", type: "video", free: false },
      { title: "Dealing with Objections", duration: "8:50", type: "video", free: false },
    ],
  },
  {
    title: "Section 5: Cross-Cultural Communication",
    lessons: [
      { title: "Understanding Cultural Differences", duration: "10:15", type: "video", free: false },
      { title: "Communication Styles Around the World", duration: "12:40", type: "video", free: false },
      { title: "Final Assessment", duration: "20 min", type: "quiz", free: false },
    ],
  },
];

const REQUIREMENTS = [
  "Basic English knowledge (A2 level recommended)",
  "Internet connection for video streaming",
  "Phone or computer to access course materials",
];

const REVIEWS: Review[] = [
  { name: "Sarah Johnson", initials: "SJ", rating: 5, comment: "This course completely transformed how I communicate at work. The business phrases section alone was worth the price. Highly recommend for anyone working in an international company.", date: "Jun 14, 2024" },
  { name: "Michael Chen", initials: "MC", rating: 5, comment: "John is an excellent instructor. His explanations are clear and the practice exercises are very practical. I use what I learned every day in my job.", date: "Jun 10, 2024" },
  { name: "Srey Pov", initials: "SP", rating: 4, comment: "Great course content! I especially loved the email writing module. Would appreciate more advanced topics in a follow-up course.", date: "Jun 5, 2024" },
  { name: "David Kim", initials: "DK", rating: 5, comment: "The cross-cultural communication section was eye-opening. Helped me understand my international colleagues so much better.", date: "May 28, 2024" },
];

const REVIEW_DISTRIBUTION = [
  { stars: 5, count: 280 },
  { stars: 4, count: 32 },
  { stars: 3, count: 8 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

const RELATED_COURSES: RelatedCourse[] = [
  { title: "Advanced Business Writing", teacher: "Emily Wong", price: "$24.99", rating: 4.7, color: "from-[#059669] to-[#34D399]" },
  { title: "English for Hospitality", teacher: "Sarah Lee", price: "$17.99", rating: 4.9, color: "from-[#7C3AED] to-[#A78BFA]" },
  { title: "Interview Skills Masterclass", teacher: "David Park", price: "$14.99", rating: 4.6, color: "from-[#D4AF37] to-[#E85D3E]" },
];

const TOTAL_LESSONS = CURRICULUM.reduce((a, s) => a + s.lessons.length, 0);
const TOTAL_HOURS = "18";

/* ── component ── */
export default function CourseDetail() {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [wishlisted, setWishlisted] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showAllSections, setShowAllSections] = useState(false);

  const toggleSection = (index: number) => {
    const next = new Set(expandedSections);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setExpandedSections(next);
  };

  const renderStars = (rating: number, size = "w-4 h-4") => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${size} ${s <= Math.round(rating) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#FAF8F3]/20"}`}
        />
      ))}
    </div>
  );

  const totalReviews = REVIEW_DISTRIBUTION.reduce((a, b) => a + b.count, 0);

  const visibleSections = showAllSections ? CURRICULUM : CURRICULUM.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1A1714]">
      {/* ── Hero Section ── */}
      <section className="bg-[#1A1714] text-[#FAF8F3] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Thumbnail */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#E85D3E] to-[#7C3AED] flex items-center justify-center border border-[#D4AF37]/20 overflow-hidden">
                <BookOpen className="w-24 h-24 text-white/40" />
              </div>
              {/* Play overlay */}
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37] group-hover:bg-[#C4A030] flex items-center justify-center transition-colors shadow-lg">
                  <Play className="w-7 h-7 text-[#1A1714] ml-1" />
                </div>
              </button>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h1
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Business English Mastery
              </h1>
              <p className="text-lg text-[#FAF8F3]/60">
                Master professional English for the workplace
              </p>

              {/* Teacher */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1A1714] text-sm font-bold">
                  J
                </div>
                <div>
                  <span className="text-[#FAF8F3]/80">John Smith</span>
                  <span className="text-[#FAF8F3]/30 mx-2">|</span>
                  <span className="text-[#FAF8F3]/50 text-sm">Senior English Instructor</span>
                </div>
                <button className="ml-auto text-xs bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 px-3 py-1 rounded-full transition-colors">
                  Follow
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {renderStars(4.8, "w-5 h-5")}
                  <span className="font-bold text-[#D4AF37]">4.8</span>
                  <span className="text-[#FAF8F3]/50">(324 reviews)</span>
                </div>
                <span className="text-[#FAF8F3]/30">|</span>
                <span className="flex items-center gap-1.5 text-[#FAF8F3]/60">
                  <Users className="w-4 h-4" />
                  1,245 students enrolled
                </span>
                <span className="text-[#FAF8F3]/30">|</span>
                <span className="flex items-center gap-1.5 text-[#FAF8F3]/60">
                  <Globe className="w-4 h-4" />
                  English
                </span>
              </div>

              {/* Price & CTA */}
              <div className="pt-2">
                <p className="text-3xl font-bold text-[#D4AF37] mb-4">$19.99</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEnrolled(!enrolled)}
                    className={`flex-1 py-3.5 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      enrolled
                        ? "bg-[#059669] hover:bg-[#047857] text-white"
                        : "bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714]"
                    }`}
                  >
                    {enrolled ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Enrolled
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Enroll Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      wishlisted
                        ? "bg-red-500/10 border-red-500/40 text-red-400"
                        : "border-[#FAF8F3]/20 text-[#FAF8F3]/60 hover:border-[#FAF8F3]/40"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button className="p-3.5 rounded-xl border border-[#FAF8F3]/20 text-[#FAF8F3]/60 hover:border-[#FAF8F3]/40 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: Award, label: "Certificate" },
                  { icon: Smartphone, label: "Lifetime Access" },
                  { icon: Smartphone, label: "Mobile Friendly" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 bg-[#FAF8F3]/5 border border-[#FAF8F3]/10 rounded-full px-3 py-1.5 text-xs text-[#FAF8F3]/70"
                  >
                    <badge.icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ── What You'll Learn ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What You&apos;ll <span className="text-[#D4AF37]">Learn</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_YOU_LEARN.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 bg-white border border-[#D4AF37]/10 rounded-xl p-4 shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <span className="text-sm text-[#2D2926]/80">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Curriculum ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Course <span className="text-[#D4AF37]">Curriculum</span>
          </h2>
          <div className="bg-white border border-[#D4AF37]/10 rounded-xl shadow-sm overflow-hidden divide-y divide-[#F5F0E8]">
            {visibleSections.map((section, si) => (
              <div key={si}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(si)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#FAF8F3] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {expandedSections.has(si) ? (
                      <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
                    )}
                    <h3 className="font-semibold text-[#1A1714]">{section.title}</h3>
                  </div>
                  <span className="text-sm text-[#2D2926]/50 shrink-0 ml-4">
                    {section.lessons.length} lessons
                  </span>
                </button>

                {/* Section Lessons */}
                <AnimatePresence>
                  {expandedSections.has(si) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-[#F5F0E8]">
                        {section.lessons.map((lesson, li) => (
                          <div
                            key={li}
                            className="flex items-center gap-3 px-4 sm:px-5 py-3 pl-12 sm:pl-14 hover:bg-[#FAF8F3] transition-colors"
                          >
                            {lesson.type === "video" && <Play className="w-4 h-4 text-[#7C3AED] shrink-0" />}
                            {lesson.type === "document" && <FileText className="w-4 h-4 text-[#059669] shrink-0" />}
                            {lesson.type === "quiz" && <HelpCircle className="w-4 h-4 text-[#E85D3E] shrink-0" />}
                            <span className="text-sm text-[#2D2926]/80 flex-1">{lesson.title}</span>
                            <span className="text-xs text-[#2D2926]/40 shrink-0">{lesson.duration}</span>
                            {lesson.free ? (
                              <span className="text-xs bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded-full shrink-0">
                                Free
                              </span>
                            ) : (
                              <Lock className="w-4 h-4 text-[#2D2926]/25 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Show Full Curriculum */}
          {!showAllSections && (
            <button
              onClick={() => {
                setShowAllSections(true);
                setExpandedSections(new Set([0, 1, 2, 3, 4]));
              }}
              className="mt-4 w-full py-3 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#D4AF37] rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Show Full Curriculum
            </button>
          )}

          <p className="mt-4 text-sm text-[#2D2926]/50">
            {TOTAL_LESSONS} lessons &bull; {TOTAL_HOURS} hours total
          </p>
        </section>

        {/* ── Requirements ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-[#D4AF37]">Requirements</span>
          </h2>
          <div className="space-y-3">
            {REQUIREMENTS.map((req, i) => (
              <div key={i} className="flex items-center gap-3 text-[#2D2926]/70">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Teacher Profile ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your <span className="text-[#D4AF37]">Instructor</span>
          </h2>
          <div className="bg-white border border-[#D4AF37]/10 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1A1714] text-2xl font-bold shrink-0">
                J
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1A1714] mb-0.5">John Smith</h3>
                <p className="text-sm text-[#D4AF37] mb-3">Senior English Instructor</p>
                <p className="text-sm text-[#2D2926]/60 mb-4">
                  John has 10+ years teaching Business English to professionals across Asia. He specializes in workplace communication, presentation skills, and cross-cultural business interactions. His practical approach combines real-world scenarios with interactive exercises.
                </p>
                <div className="flex gap-6 mb-4">
                  {[
                    { label: "Courses", value: "5" },
                    { label: "Students", value: "3,400" },
                    { label: "Rating", value: "4.9" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-lg font-bold text-[#1A1714]">{stat.value}</p>
                      <p className="text-xs text-[#2D2926]/40">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-sm transition-colors">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#0958a8] text-white rounded-lg text-sm transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Student <span className="text-[#D4AF37]">Reviews</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Rating Summary */}
            <div className="bg-white border border-[#D4AF37]/10 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold text-[#1A1714]">4.8</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#2D2926]/50">{totalReviews} reviews</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {REVIEW_DISTRIBUTION.map((d) => {
                  const pct = ((d.count / totalReviews) * 100).toFixed(0);
                  return (
                    <div key={d.stars} className="flex items-center gap-3">
                      <span className="text-sm text-[#2D2926]/60 w-8 shrink-0">{d.stars}★</span>
                      <div className="flex-1 h-2.5 bg-[#F5F0E8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#2D2926]/40 w-10 text-right">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {REVIEWS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-[#D4AF37]/10 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        {r.initials}
                      </div>
                      <p className="font-medium text-sm text-[#1A1714]">{r.name}</p>
                    </div>
                    <span className="text-xs text-[#2D2926]/40">{r.date}</span>
                  </div>
                  <div className="mb-2">{renderStars(r.rating)}</div>
                  <p className="text-sm text-[#2D2926]/70">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Courses ── */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Related <span className="text-[#D4AF37]">Courses</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RELATED_COURSES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#D4AF37]/10 rounded-xl shadow-sm overflow-hidden hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className={`h-28 bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <BookOpen className="w-10 h-10 text-white/50 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1A1714] mb-1 text-sm">{c.title}</h3>
                  <p className="text-xs text-[#2D2926]/50 mb-3">{c.teacher}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#D4AF37]">{c.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-xs text-[#2D2926]/60">{c.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
