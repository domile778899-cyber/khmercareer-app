import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Lightbulb,
  FileText,
  UserCircle,
  Play,
  Pause,
  Download,
  Save,
  Globe,
  Clock,
  Monitor,
  Smartphone,
  BarChart3,
  CheckCircle,
  X,
  Volume2,
  ArrowRight,
} from "lucide-react";

/* ── mock data ── */
interface Avatar {
  id: string;
  name: string;
  gender: "female" | "male";
}
const AVATARS: Avatar[] = [
  { id: "sarah", name: "Sarah", gender: "female" },
  { id: "david", name: "David", gender: "male" },
  { id: "mei", name: "Mei", gender: "female" },
  { id: "james", name: "James", gender: "male" },
  { id: "srey", name: "Srey", gender: "female" },
  { id: "sokha", name: "Sokha", gender: "male" },
];

interface Template {
  id: string;
  name: string;
  color: string;
}
const TEMPLATES: Template[] = [
  { id: "modern", name: "Modern Clean", color: "from-blue-500 to-indigo-600" },
  { id: "warm", name: "Warm & Friendly", color: "from-orange-400 to-red-500" },
  { id: "professional", name: "Professional", color: "from-gray-700 to-gray-900" },
  { id: "vibrant", name: "Vibrant", color: "from-purple-500 to-pink-500" },
];

interface ExampleCourse {
  title: string;
  duration: string;
  views: number;
  color: string;
}
const EXAMPLE_COURSES: ExampleCourse[] = [
  { title: "English Greetings for Hotel Staff", duration: "8 min", views: 1240, color: "from-amber-500 to-orange-600" },
  { title: "Factory Safety Basics in Khmer", duration: "12 min", views: 3560, color: "from-emerald-500 to-teal-600" },
  { title: "Excel Formulas for Beginners", duration: "15 min", views: 890, color: "from-blue-500 to-indigo-600" },
];

const LANGUAGES = ["English", "Khmer", "Chinese", "Thai", "Vietnamese"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DURATIONS = [3, 5, 10, 15, 20];
const VOICES = ["Natural Female", "Natural Male", "Professional Female", "Professional Male", "Friendly Female", "Friendly Male"];

/* ── component ── */
export default function AIGenerate() {
  const { t } = useTranslation();
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState(5);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [voice, setVoice] = useState(VOICES[0]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{ title: string; duration: string; language: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicePreviewing, setVoicePreviewing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    setGenerating(true);
    setCompleted(false);
    setProgress(0);
    setGeneratedVideo(null);
    setIsPlaying(false);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 11) + 10;
        const next = prev + increment;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            setGenerating(false);
            setCompleted(true);
            setGeneratedVideo({
              title: topic,
              duration: `${duration} min`,
              language,
            });
          }, 400);
          return 100;
        }
        return next;
      });
    }, 800);
  }, [topic, duration, language]);

  const handleCancel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGenerating(false);
    setProgress(0);
  }, []);

  const handleReset = useCallback(() => {
    setCompleted(false);
    setGeneratedVideo(null);
    setProgress(0);
    setTopic("");
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const steps = [
    { icon: Lightbulb, label: t('ai.chooseTopic'), desc: t('ai.chooseTopicDesc') },
    { icon: FileText, label: t('ai.aiWritesScript'), desc: t('ai.aiWritesScriptDesc') },
    { icon: UserCircle, label: t('ai.selectAvatarVoice'), desc: t('ai.selectAvatarVoiceDesc') },
    { icon: Sparkles, label: t('ai.generateVideoStep'), desc: t('ai.generateVideoStepDesc') },
  ];

  const generationSteps = [
    t('ai.analyzingTopic'),
    t('ai.generatingScript'),
    t('ai.creatingVisuals'),
    t('ai.renderingVideo'),
  ];

  const formatViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);

  return (
    <div className="min-h-screen bg-[#1A1714] text-[#FAF8F3]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-sm text-[#A78BFA]">{t('ai.poweredByAI')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('ai.videoGenerator')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-[#D4AF37] mb-2"
          >
            {t('ai.subtitleKm')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-[#FAF8F3]/60 mb-10"
          >
            {t('ai.subtitleZh')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Globe, label: t('ai.languages10'), color: "text-blue-400" },
              { icon: Clock, label: t('ai.generation5min'), color: "text-emerald-400" },
              { icon: Monitor, label: t('ai.templates100'), color: "text-purple-400" },
              { icon: Smartphone, label: t('ai.hdQuality'), color: "text-[#D4AF37]" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#2D2926] border border-[#D4AF37]/20 rounded-xl p-4 flex flex-col items-center gap-2"
              >
                <s.icon className={`w-6 h-6 ${s.color}`} />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2D2926]/50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('ai.howItWorks')} <span className="text-[#D4AF37]">{t('ai.works')}</span>
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-3">
                    <step.icon className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold text-[#FAF8F3] mb-1">{step.label}</h3>
                  <p className="text-sm text-[#FAF8F3]/50 max-w-[140px]">{step.desc}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block w-5 h-5 text-[#D4AF37]/40 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Generation Interface ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="generation-interface">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('ai.createYour')} <span className="text-[#D4AF37]">{t('ai.aiVideo')}</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2926] border border-[#D4AF37]/20 rounded-2xl p-6 space-y-6"
            >
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  {t('ai.topicSubject')}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('ai.topicPlaceholder')}
                  className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl p-3 text-sm text-[#FAF8F3] placeholder-[#FAF8F3]/30 focus:outline-none focus:border-[#D4AF37] min-h-[80px] resize-none"
                />
                <button
                  onClick={() => setTopic("English Greetings for Hotel Staff")}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('ai.generateIdeas')}
                </button>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  {t('ai.language')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl p-3 text-sm text-[#FAF8F3] focus:outline-none focus:border-[#D4AF37]"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  {t('ai.difficultyLevel')}
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                        difficulty === d
                          ? "bg-[#D4AF37] text-[#1A1714]"
                          : "bg-[#1A1714] border border-[#D4AF37]/20 text-[#FAF8F3]/70 hover:border-[#D4AF37]/50"
                      }`}
                    >
                      {d === 'Beginner' ? t('ai.beginner') : d === 'Intermediate' ? t('ai.intermediate') : t('ai.advanced')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {t('ai.duration')}: <span className="text-[#D4AF37]">{duration} {t('ai.min')}</span>
                </label>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === d
                          ? "bg-[#D4AF37] text-[#1A1714]"
                          : "bg-[#1A1714] border border-[#D4AF37]/20 text-[#FAF8F3]/60 hover:border-[#D4AF37]/40"
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatars */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <UserCircle className="w-4 h-4 inline mr-1" />
                  {t('ai.avatar')}
                </label>
                <div className="flex gap-3 flex-wrap">
                  {AVATARS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAvatar(a.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        selectedAvatar === a.id
                          ? "bg-[#D4AF37]/20 border border-[#D4AF37]"
                          : "bg-[#1A1714] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          a.gender === "female"
                            ? "bg-pink-500/20 text-pink-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {a.name[0]}
                      </div>
                      <span className="text-xs text-[#FAF8F3]/70">{a.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <Volume2 className="w-4 h-4 inline mr-1" />
                  {t('ai.voice')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="flex-1 bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl p-3 text-sm text-[#FAF8F3] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {VOICES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setVoicePreviewing(true);
                      setTimeout(() => setVoicePreviewing(false), 2000);
                    }}
                    className="px-4 py-2 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-xl text-sm text-[#A78BFA] hover:bg-[#7C3AED]/30 transition-colors flex items-center gap-1.5"
                  >
                    {voicePreviewing ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-[#A78BFA] rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-[#A78BFA] rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                        <span className="w-1 h-2 bg-[#A78BFA] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                      </span>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        {t('ai.preview')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Templates */}
              <div>
                <label className="block text-sm font-medium text-[#FAF8F3]/70 mb-2">
                  <Monitor className="w-4 h-4 inline mr-1" />
                  {t('ai.templateStyle')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`relative p-3 rounded-xl border transition-all overflow-hidden ${
                        selectedTemplate === tmpl.id
                          ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
                          : "border-[#D4AF37]/10 hover:border-[#D4AF37]/30"
                      }`}
                    >
                      <div className={`h-16 rounded-lg bg-gradient-to-br ${tmpl.color} mb-2`} />
                      <span className="text-sm text-[#FAF8F3]/80">{tmpl.name}</span>
                      {selectedTemplate === tmpl.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-[#1A1714]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#C4A030] disabled:opacity-50 disabled:cursor-not-allowed text-[#1A1714] font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {generating ? t('ai.generating') : t('ai.generateVideo')}
              </button>
            </motion.div>

            {/* Right: Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2D2926] border border-[#D4AF37]/20 rounded-2xl p-6 min-h-[600px] flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#D4AF37]" />
                {t('ai.preview')}
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {/* BEFORE state */}
                  {!generating && !completed && (
                    <motion.div
                      key="before"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center text-center py-12"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-6">
                        <Cpu className="w-12 h-12 text-[#7C3AED]" />
                      </div>
                      <p className="text-lg font-medium text-[#FAF8F3]/80 mb-2">
                        {t('ai.yourVideoWillAppearHere')}
                      </p>
                      <p className="text-sm text-[#FAF8F3]/50 max-w-xs mb-8">
                        {t('ai.configureSettings')}
                      </p>
                      <div className="space-y-2 text-left bg-[#1A1714] rounded-xl p-4 border border-[#D4AF37]/10">
                        <p className="text-xs text-[#FAF8F3]/40 uppercase tracking-wider mb-2">{t('ai.tipsForBestResults')}</p>
                        {[
                          t('ai.tipSpecific'),
                          t('ai.tipDifficulty'),
                          t('ai.tipAvatar'),
                        ].map((tip) => (
                          <div key={tip} className="flex items-start gap-2 text-sm text-[#FAF8F3]/60">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* DURING state */}
                  {generating && (
                    <motion.div
                      key="during"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-sm py-8"
                    >
                      {/* Progress bar */}
                      <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#FAF8F3]/70">{t('ai.generatingYourVideo')}</span>
                          <span className="text-[#D4AF37] font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-[#1A1714] rounded-full overflow-hidden border border-[#D4AF37]/10">
                          <motion.div
                            className="h-full bg-[#D4AF37] rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-3 mb-8">
                        {generationSteps.map((step, i) => {
                          const stepThreshold = (i + 1) * 25;
                          const isActive = progress >= stepThreshold;
                          const isCurrent = progress >= stepThreshold - 12 && progress < stepThreshold;
                          return (
                            <div
                              key={step}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                isActive
                                  ? "bg-[#D4AF37]/10 border border-[#D4AF37]/20"
                                  : "bg-[#1A1714] border border-transparent"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  isActive
                                    ? "bg-[#D4AF37] text-[#1A1714]"
                                    : "bg-[#2D2926] text-[#FAF8F3]/30"
                                }`}
                              >
                                {isActive ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs">{i + 1}</span>
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  isActive ? "text-[#FAF8F3]" : "text-[#FAF8F3]/30"
                                }`}
                              >
                                {step}
                              </span>
                              {isCurrent && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="ml-auto"
                                >
                                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-[#FAF8F3]/50 mb-4">
                        <Clock className="w-4 h-4" />
                        {t('ai.estimatedTime')}
                      </div>

                      <button
                        onClick={handleCancel}
                        className="w-full py-2.5 border border-[#E85D3E]/40 text-[#E85D3E] rounded-xl hover:bg-[#E85D3E]/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        {t('ai.cancelGeneration')}
                      </button>
                    </motion.div>
                  )}

                  {/* AFTER state */}
                  {completed && generatedVideo && (
                    <motion.div
                      key="after"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full py-4"
                    >
                      {/* Video Player Placeholder */}
                      <div className="relative bg-[#1A1714] rounded-xl border border-[#D4AF37]/20 aspect-video flex items-center justify-center mb-6 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#7C3AED]/5" />
                        {isPlaying ? (
                          <div className="text-center z-10">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Pause className="w-16 h-16 text-[#D4AF37] mx-auto mb-2" />
                            </motion.div>
                            <p className="text-sm text-[#FAF8F3]/60">{t('ai.playingPreview')}</p>
                          </div>
                        ) : (
                          <div className="text-center z-10">
                            <button
                              onClick={() => setIsPlaying(true)}
                              className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#C4A030] flex items-center justify-center mx-auto mb-2 transition-colors"
                            >
                              <Play className="w-7 h-7 text-[#1A1714] ml-1" />
                            </button>
                            <p className="text-sm text-[#FAF8F3]/60">{t('ai.clickToPlayPreview')}</p>
                          </div>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="bg-[#1A1714] rounded-xl p-4 border border-[#D4AF37]/10 mb-4">
                        <h4 className="font-semibold text-[#FAF8F3] mb-2">{generatedVideo.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-[#FAF8F3]/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {generatedVideo.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {generatedVideo.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            {t('ai.hdQualityLabel')}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="py-2.5 bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714] font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isPlaying ? t('ai.pause') : t('ai.playPreview')}
                        </button>
                        <button className="py-2.5 bg-[#1A1714] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#FAF8F3] rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          {t('ai.download')}
                        </button>
                        <button className="py-2.5 bg-[#1A1714] border border-[#059669]/30 hover:border-[#059669]/60 text-[#FAF8F3] rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Save className="w-4 h-4" />
                          {t('ai.saveToMyCourses')}
                        </button>
                        <button
                          onClick={handleReset}
                          className="py-2.5 bg-[#1A1714] border border-[#7C3AED]/30 hover:border-[#7C3AED]/60 text-[#FAF8F3] rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          {t('ai.generateAnother')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI Course Examples ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2D2926]/50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('ai.aiGeneratedCourseExamples')}
          </h2>
          <p className="text-center text-[#FAF8F3]/50 mb-10">
            {t('ai.seeWhatOthersCreating')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLE_COURSES.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#2D2926] border border-[#D4AF37]/15 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                  <Play className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#FAF8F3] mb-3">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-[#FAF8F3]/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      {formatViews(course.views)} {t('common.search').toLowerCase() === 'search' ? 'views' : 'views'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('ai.chooseYourPlan')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: t('ai.free'),
                price: "$0",
                period: t('ai.perMonth'),
                features: [
                  t('ai.videosPerMonth', { count: 3 }),
                  t('ai.upToMinDuration', { count: 5 }),
                  t('ai.watermarkedOutput'),
                  t('ai.basicTemplates'),
                ],
                cta: t('ai.getStarted'),
                popular: false,
              },
              {
                name: t('ai.pro'),
                price: "$29",
                period: t('ai.perMonth'),
                features: [
                  t('ai.videosPerMonth', { count: 20 }),
                  t('ai.upToMinDuration', { count: 20 }),
                  t('ai.hdQuality'),
                  t('ai.allTemplates'),
                  t('ai.noWatermark'),
                ],
                cta: t('ai.startProTrial'),
                popular: true,
              },
              {
                name: t('ai.enterprise'),
                price: "$99",
                period: t('ai.perMonth'),
                features: [
                  t('ai.unlimitedVideos'),
                  t('ai.upTo30Min'),
                  t('ai.quality4k'),
                  t('ai.customAvatar'),
                  t('ai.prioritySupport'),
                ],
                cta: t('ai.contactSales'),
                popular: false,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-6 border ${
                  plan.popular
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] ring-1 ring-[#D4AF37]"
                    : "bg-[#2D2926] border-[#D4AF37]/15"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#1A1714] text-xs font-bold px-3 py-1 rounded-full">
                    {t('ai.mostPopular')}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-[#FAF8F3] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{plan.price}</span>
                  <span className="text-sm text-[#FAF8F3]/50">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#FAF8F3]/70">
                      <CheckCircle className="w-4 h-4 text-[#059669] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                    plan.popular
                      ? "bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714]"
                      : "bg-[#1A1714] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#FAF8F3]"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 border border-[#D4AF37]/20 rounded-2xl p-8 sm:p-12"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('ai.readyToCreate')}
            </h2>
            <p className="text-[#FAF8F3]/60 mb-8">
              {t('ai.transformLessons')}
            </p>
            <button
              onClick={() => {
                const el = document.getElementById("generation-interface");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714] font-bold rounded-xl transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              {t('ai.startCreatingWithAI')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
