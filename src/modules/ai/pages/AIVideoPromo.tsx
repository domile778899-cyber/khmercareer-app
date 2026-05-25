import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { askAI } from '@/utils/aiApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
import { logger } from '@/shared/logger'
  Video,
  Wand2,
  Copy,
  Check,
  Sparkles,
  Clock,
  Type,
  ImageIcon,
  Languages,
  Hash,
  Share2,
  Play,
  Download,
  Palette,
  Music,
  Film,
  Globe,
  FileText,
  ChevronRight,
  Lightbulb,
  Star,
  Zap,
  Loader2,
  Smartphone,
  MessageCircle,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type VideoStyle = 'professional' | 'lively' | 'tech' | 'warm' | 'premium'
export type ScriptDuration = 15 | 30 | 60
export type LanguageCode = 'zh' | 'en' | 'km' | 'th' | 'vi'

export interface StoryboardScene {
  id: number
  timestamp: string
  duration: string
  description: string
  visualPrompt: string
  narration: string
  subtitle: string
}

export interface GeneratedScript {
  duration: ScriptDuration
  hook: string
  scenes: StoryboardScene[]
  cta: string
}

export interface SocialCopy {
  platform: string
  copy: string
  hashtags: string[]
}

export interface PromoState {
  jobTitle: string
  company: string
  requirements: string
  salary: string
  location: string
  benefits: string
  style: VideoStyle
  duration: ScriptDuration
  languages: LanguageCode[]
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const VIDEO_STYLES: {
  id: VideoStyle
  nameKey: string
  descKey: string
  icon: React.ElementType
  color: string
  bg: string
}[] = [
  {
    id: 'professional',
    nameKey: 'videoStyle.professional',
    descKey: 'videoStyle.professionalDesc',
    icon: FileText,
    color: '#1E40AF',
    bg: '#DBEAFE',
  },
  {
    id: 'lively',
    nameKey: 'videoStyle.lively',
    descKey: 'videoStyle.livelyDesc',
    icon: Zap,
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    id: 'tech',
    nameKey: 'videoStyle.tech',
    descKey: 'videoStyle.techDesc',
    icon: Sparkles,
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    id: 'warm',
    nameKey: 'videoStyle.warm',
    descKey: 'videoStyle.warmDesc',
    icon: Star,
    color: '#DC2626',
    bg: '#FEE2E2',
  },
  {
    id: 'premium',
    nameKey: 'videoStyle.premium',
    descKey: 'videoStyle.premiumDesc',
    icon: CrownIcon,
    color: '#D4AF37',
    bg: '#FEF9E7',
  },
]

const SCRIPT_DURATIONS: { value: ScriptDuration; label: string }[] = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
]

const LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

const PLATFORMS = ['TikTok', 'Facebook', 'Telegram', 'WeChat']

function CrownIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: build system prompt for script generation                  */
/* ------------------------------------------------------------------ */

function buildScriptPrompt(state: PromoState): string {
  const styleDesc: Record<VideoStyle, string> = {
    professional: '专业商务风格，稳重正式，适合高端职位',
    lively: '活泼轻快风格，节奏明快，适合年轻求职者',
    tech: '科技感风格，未来感，适合IT/科技职位',
    warm: '温暖亲切风格，人文关怀，适合教育/医疗职位',
    premium: '高端奢华风格，精致大气，适合高管/精英职位',
  }

  return `你是一个专业的短视频广告脚本创作专家。请根据以下职位信息，创作一个${state.duration}秒的招聘短视频脚本。

【职位信息】
- 职位名称: ${state.jobTitle}
- 公司名称: ${state.company}
- 工作地点: ${state.location}
- 薪资范围: ${state.salary}
- 岗位要求: ${state.requirements}
- 福利待遇: ${state.benefits}

【创作要求】
- 视频风格: ${styleDesc[state.style]}
- 时长: ${state.duration}秒
- 需要包含: 吸引人的开头hook、5-8个分镜场景、行动号召CTA
- 每个分镜需要: 时间戳、画面描述、旁白文案、字幕文案
- 同时生成AI配图提示词(Midjourney/DALL-E风格)
- 以及适合各社交平台的推广文案和hashtags

请以JSON格式返回，包含以下结构:
{
  "hook": "开头hook文案",
  "scenes": [
    {
      "id": 1,
      "timestamp": "0:00-0:03",
      "duration": "3s",
      "description": "画面描述",
      "visualPrompt": "AI配图英文提示词",
      "narration": "旁白文案",
      "subtitle": "字幕文案"
    }
  ],
  "cta": "行动号召文案",
  "socialCopies": [
    { "platform": "TikTok", "copy": "文案", "hashtags": ["tag1", "tag2"] }
  ]
}`
}

/* ------------------------------------------------------------------ */
/*  CopyButton Component                                               */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className="h-7 px-2 text-gray-400 hover:text-[#D4AF37]"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </Button>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIVideoPromo() {
  const { t } = useTranslation()

  const [state, setState] = useState<PromoState>({
    jobTitle: '',
    company: '高棉职通车',
    requirements: '',
    salary: '',
    location: '金边',
    benefits: '',
    style: 'professional',
    duration: 30,
    languages: ['zh', 'km'],
  })

  const [generated, setGenerated] = useState<{
    hook: string
    scenes: StoryboardScene[]
    cta: string
    socialCopies: SocialCopy[]
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('input')

  const updateField = useCallback(
    <K extends keyof PromoState>(key: K, value: PromoState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleLanguage = useCallback((code: LanguageCode) => {
    setState((prev) => {
      const has = prev.languages.includes(code)
      return {
        ...prev,
        languages: has
          ? prev.languages.filter((c) => c !== code)
          : [...prev.languages, code],
      }
    })
  }, [])

  const generateAll = useCallback(async () => {
    if (!state.jobTitle || !state.requirements) return
    setIsGenerating(true)
    setProgress(0)

    try {
      const prompt = buildScriptPrompt(state)
      const response = await askAI(prompt)

      setProgress(60)

      /* Parse JSON from response */
      let parsed: any
      const responseText = response.success ? response.content : ''
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
      } catch (err) {
        logger.error('Parse video promo JSON failed', { error: err, component: 'AIVideoPromo' });
        /* Fallback: create structure from text */
        parsed = createFallbackResult(responseText, state)
      }

      setProgress(90)

      setGenerated({
        hook: parsed.hook || t('defaultHook'),
        scenes: (parsed.scenes || []).map((s: any, idx: number) => ({
          id: s.id || idx + 1,
          timestamp: s.timestamp || `${idx * 5}s`,
          duration: s.duration || '5s',
          description: s.description || '',
          visualPrompt: s.visualPrompt || '',
          narration: s.narration || '',
          subtitle: s.subtitle || '',
        })),
        cta: parsed.cta || t('defaultCTA'),
        socialCopies: parsed.socialCopies || generateDefaultSocialCopies(state, t),
      })

      setProgress(100)
      setActiveTab('script')
    } catch (err) {
      logger.error('Generation error', { error: err, component: 'AIVideoPromo' })
      /* Use fallback */
      setGenerated(createFallbackResult('', state) as any)
      setActiveTab('script')
    } finally {
      setIsGenerating(false)
    }
  }, [state, t])

  const copyAllMaterials = useCallback(() => {
    if (!generated) return
    const text = `
🎬 招聘短视频全套素材

📌 开头Hook:
${generated.hook}

🎞️ 分镜脚本:
${generated.scenes
  .map(
    (s) => `
【场景${s.id}】${s.timestamp} (${s.duration})
画面: ${s.description}
旁白: ${s.narration}
字幕: ${s.subtitle}
AI配图提示词: ${s.visualPrompt}
`
  )
  .join('\n')}

📢 行动号召:
${generated.cta}

📱 社交文案:
${generated.socialCopies
  .map((sc) => `\n【${sc.platform}】\n${sc.copy}\n${sc.hashtags.join(' ')}`)
  .join('\n')}
`.trim()
    navigator.clipboard.writeText(text)
  }, [generated])

  const styleInfo = VIDEO_STYLES.find((s) => s.id === state.style)

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Hero */}
      <section className="relative bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 50%)',
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-4">
              <Video size={14} className="text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-medium">
                {t('videoPromo.badge')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
                {t('videoPromo.title')}
              </span>
            </h1>
            <p className="text-base text-gray-400 max-w-xl mx-auto">
              {t('videoPromo.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 shadow-sm mb-6">
            <TabsTrigger
              value="input"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <FileText size={14} className="mr-1.5" />
              {t('tab.jobInput')}
            </TabsTrigger>
            <TabsTrigger
              value="script"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <Film size={14} className="mr-1.5" />
              {t('tab.script')}
            </TabsTrigger>
            <TabsTrigger
              value="storyboard"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <ImageIcon size={14} className="mr-1.5" />
              {t('tab.storyboard')}
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <Share2 size={14} className="mr-1.5" />
              {t('tab.social')}
            </TabsTrigger>
          </TabsList>

          {/* ===== Tab: Job Input ===== */}
          <TabsContent value="input" className="space-y-5">
            {/* Job Info Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText size={16} className="text-[#D4AF37]" />
                  {t('jobInfoTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('jobTitle')} *
                  </label>
                  <input
                    type="text"
                    value={state.jobTitle}
                    onChange={(e) => updateField('jobTitle', e.target.value)}
                    placeholder={t('placeholder.jobTitle')}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('company')}
                  </label>
                  <input
                    type="text"
                    value={state.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('salary')}
                  </label>
                  <input
                    type="text"
                    value={state.salary}
                    onChange={(e) => updateField('salary', e.target.value)}
                    placeholder={t('placeholder.salary')}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    value={state.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('requirements')} *
                  </label>
                  <textarea
                    value={state.requirements}
                    onChange={(e) => updateField('requirements', e.target.value)}
                    placeholder={t('placeholder.requirements')}
                    rows={3}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">
                    {t('benefits')}
                  </label>
                  <textarea
                    value={state.benefits}
                    onChange={(e) => updateField('benefits', e.target.value)}
                    placeholder={t('placeholder.benefits')}
                    rows={2}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Style Selection */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Palette size={16} className="text-[#D4AF37]" />
                  {t('videoStyleTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {VIDEO_STYLES.map((s) => (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateField('style', s.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                        state.style === s.id
                          ? 'border-[#D4AF37] shadow-md'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      style={{
                        backgroundColor:
                          state.style === s.id ? s.bg : '#FAFAFA',
                      }}
                    >
                      {state.style === s.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      <s.icon
                        size={24}
                        style={{ color: s.color }}
                        className="mx-auto mb-2"
                      />
                      <p className="text-xs font-semibold text-gray-800">
                        {t(s.nameKey)}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                        {t(s.descKey)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duration & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock size={16} className="text-[#D4AF37]" />
                    {t('durationTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {SCRIPT_DURATIONS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => updateField('duration', d.value)}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          state.duration === d.value
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#B8962E]'
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Globe size={16} className="text-[#D4AF37]" />
                    {t('languageTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => {
                      const active = state.languages.includes(lang.code)
                      return (
                        <button
                          key={lang.code}
                          onClick={() => toggleLanguage(lang.code)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            active
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#B8962E]'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          {lang.name}
                          {active && <Check size={12} />}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={generateAll}
                disabled={isGenerating || !state.jobTitle || !state.requirements}
                className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#B8962E] hover:to-[#D4AF37] text-white font-bold text-sm shadow-lg shadow-[#D4AF37]/25 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {t('generating')} {progress}%
                  </>
                ) : (
                  <>
                    <Wand2 size={18} className="mr-2" />
                    {t('generateScript')}
                  </>
                )}
              </Button>
            </motion.div>

            {isGenerating && (
              <Progress value={progress} className="h-1.5 bg-gray-100" />
            )}
          </TabsContent>

          {/* ===== Tab: Script ===== */}
          <TabsContent value="script" className="space-y-5">
            {generated ? (
              <>
                {/* Hook */}
                <Card className="border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/5 to-transparent">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Zap size={16} className="text-[#D4AF37]" />
                        {t('hookTitle')}
                      </CardTitle>
                      <CopyButton text={generated.hook} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                      {generated.hook}
                    </p>
                  </CardContent>
                </Card>

                {/* Scenes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Film size={16} className="text-[#D4AF37]" />
                    {t('sceneScript')}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      ({generated.scenes.length} {t('scenes')})
                    </span>
                  </h3>

                  {generated.scenes.map((scene, idx) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Card className="border border-gray-200 hover:border-[#D4AF37]/30 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-xs font-bold text-[#D4AF37]">
                              {scene.id}
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] bg-gray-100 text-gray-600"
                                >
                                  <Clock size={10} className="mr-1" />
                                  {scene.timestamp}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-gray-400"
                                >
                                  {scene.duration}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-700">
                                  {t('sceneVisual')}:
                                </span>{' '}
                                {scene.description}
                              </p>
                              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                                <p className="text-xs text-gray-800">
                                  <span className="text-[#D4AF37] font-medium">
                                    🎙️ {t('narration')}:
                                  </span>{' '}
                                  {scene.narration}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="text-blue-500 font-medium">
                                    💬 {t('subtitle')}:
                                  </span>{' '}
                                  {scene.subtitle}
                                </p>
                              </div>
                            </div>
                            <CopyButton
                              text={`【场景${scene.id}】${scene.timestamp}\n画面: ${scene.description}\n旁白: ${scene.narration}\n字幕: ${scene.subtitle}`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Card className="border border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                        <Smartphone size={16} />
                        {t('ctaTitle')}
                      </CardTitle>
                      <CopyButton text={generated.cta} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800 font-medium">
                      {generated.cta}
                    </p>
                  </CardContent>
                </Card>

                {/* Copy All */}
                <Button
                  onClick={copyAllMaterials}
                  className="w-full h-10 bg-[#D4AF37] hover:bg-[#B8962E] text-white text-xs font-bold"
                >
                  <Copy size={16} className="mr-2" />
                  {t('copyAllMaterials')}
                </Button>
              </>
            ) : (
              <EmptyState message={t('generateFirst')} />
            )}
          </TabsContent>

          {/* ===== Tab: Storyboard ===== */}
          <TabsContent value="storyboard" className="space-y-5">
            {generated ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#D4AF37]" />
                    {t('storyboardTitle')}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {state.style} · {state.duration}s
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generated.scenes.map((scene, idx) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Card className="border border-gray-200 overflow-hidden">
                        {/* Placeholder for AI image */}
                        <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                          <div className="text-center">
                            <ImageIcon
                              size={28}
                              className="text-gray-400 mx-auto mb-1"
                            />
                            <p className="text-[10px] text-gray-400">
                              {t('aiImagePlaceholder')}
                            </p>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                            {scene.timestamp}
                          </div>
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-[10px] font-bold">
                            {scene.id}
                          </div>
                        </div>
                        <CardContent className="p-3 space-y-2">
                          <p className="text-xs font-medium text-gray-800">
                            {scene.description}
                          </p>
                          <div className="bg-amber-50 rounded-md p-2 border border-amber-100">
                            <p className="text-[10px] text-amber-700 font-medium mb-0.5">
                              🎨 {t('aiPrompt')}
                            </p>
                            <p className="text-[10px] text-amber-800 leading-relaxed font-mono">
                              {scene.visualPrompt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CopyButton text={scene.visualPrompt} />
                            <span className="text-[10px] text-gray-400">
                              {t('copyToMidjourney')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Bulk Copy Prompts */}
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      generated.scenes.map((s) => s.visualPrompt).join('\n\n')
                    )
                  }
                  variant="outline"
                  className="w-full h-10 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 text-xs font-bold"
                >
                  <Download size={16} className="mr-2" />
                  {t('copyAllPrompts')}
                </Button>
              </>
            ) : (
              <EmptyState message={t('generateFirst')} />
            )}
          </TabsContent>

          {/* ===== Tab: Social ===== */}
          <TabsContent value="social" className="space-y-5">
            {generated ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Share2 size={16} className="text-[#D4AF37]" />
                    {t('socialCopyTitle')}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {generated.socialCopies.length} {t('platforms')}
                  </Badge>
                </div>

                {generated.socialCopies.map((sc, idx) => (
                  <motion.div
                    key={sc.platform}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                                sc.platform === 'TikTok'
                                  ? 'bg-black'
                                  : sc.platform === 'Facebook'
                                  ? 'bg-blue-600'
                                  : sc.platform === 'Telegram'
                                  ? 'bg-sky-500'
                                  : 'bg-green-500'
                              }`}
                            >
                              {sc.platform[0]}
                            </div>
                            <CardTitle className="text-sm font-bold">
                              {sc.platform}
                            </CardTitle>
                          </div>
                          <CopyButton
                            text={`${sc.copy}\n${sc.hashtags.join(' ')}`}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                          {sc.copy}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sc.hashtags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] bg-[#D4AF37]/10 text-[#B8962E] border-0"
                            >
                              <Hash size={10} className="mr-0.5" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* All Hashtags */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Hash size={16} className="text-[#D4AF37]" />
                      {t('allHashtags')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(
                          generated.socialCopies.flatMap((sc) => sc.hashtags)
                        )
                      ).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-2.5 py-1 cursor-pointer hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-colors"
                          onClick={() => navigator.clipboard.writeText(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Copy All Social */}
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      generated.socialCopies
                        .map(
                          (sc) =>
                            `【${sc.platform}】\n${sc.copy}\n${sc.hashtags.join(' ')}`
                        )
                        .join('\n\n---\n\n')
                    )
                  }
                  className="w-full h-10 bg-[#D4AF37] hover:bg-[#B8962E] text-white text-xs font-bold"
                >
                  <Copy size={16} className="mr-2" />
                  {t('copyAllSocial')}
                </Button>
              </>
            ) : (
              <EmptyState message={t('generateFirst')} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  EmptyState                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <Lightbulb size={40} className="text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Fallback Generators                                                */
/* ------------------------------------------------------------------ */

function generateDefaultSocialCopies(
  state: PromoState,
  t: (key: string) => string
): SocialCopy[] {
  const base = `${state.company} 正在招聘 ${state.jobTitle}！📍${state.location} 💰${state.salary}`
  return [
    {
      platform: 'TikTok',
      copy: `🎬 ${base}\n\n✨ ${state.requirements.slice(0, 80)}...\n\n🚀 快来加入我们！#招聘 #求职`,
      hashtags: ['#招聘', '#求职', '#柬埔寨工作', `#${state.jobTitle}`, '#KhmerCareer'],
    },
    {
      platform: 'Facebook',
      copy: `📢 ${base}\n\n📝 岗位要求:\n${state.requirements}\n\n🎁 ${state.benefits}\n\n👉 立即申请！`,
      hashtags: ['#CambodiaJobs', '#Hiring', '#PhnomPenh', '#Career'],
    },
    {
      platform: 'Telegram',
      copy: `🔥 ${state.company}招聘${state.jobTitle}\n📍地点: ${state.location}\n💰薪资: ${state.salary}\n📋要求: ${state.requirements.slice(0, 100)}...\n\n👉 联系我们了解更多！`,
      hashtags: ['#柬埔寨招聘', '#金边工作', '#KhmerCareer'],
    },
    {
      platform: 'WeChat',
      copy: `🌟【招聘信息】🌟\n\n🏢 ${state.company}\n💼 ${state.jobTitle}\n📍 ${state.location}\n💰 ${state.salary}\n\n📋 任职要求:\n${state.requirements}\n\n🎁 ${state.benefits}\n\n欢迎推荐或自荐！`,
      hashtags: ['#柬埔寨招聘', '#高棉职通车', '#金边求职'],
    },
  ]
}

function createFallbackResult(responseText: string, state: PromoState): any {
  const scenes: StoryboardScene[] = []
  const sceneCount = state.duration <= 15 ? 5 : state.duration <= 30 ? 6 : 8
  const secPerScene = Math.floor(state.duration / sceneCount)

  for (let i = 0; i < sceneCount; i++) {
    const start = i * secPerScene
    const end = start + secPerScene
    scenes.push({
      id: i + 1,
      timestamp: `${start}s-${end}s`,
      duration: `${secPerScene}s`,
      description: getSceneDesc(i, state),
      visualPrompt: getVisualPrompt(i, state),
      narration: getNarration(i, state),
      subtitle: getSubtitle(i, state),
    })
  }

  return {
    hook: `🌟 梦想工作就在${state.company}！我们正在寻找优秀的${state.jobTitle}，薪资${state.salary}，等你来挑战！`,
    scenes,
    cta: `👉 立即投递简历，加入${state.company}！联系高棉职通车获取更多详情。📲`,
    socialCopies: null,
  }
}

function getSceneDesc(idx: number, state: PromoState): string {
  const descs = [
    `公司大楼/办公环境全景，展示${state.company}的专业形象`,
    `团队合影/员工工作场景，展现活力团队氛围`,
    `${state.jobTitle}岗位工作画面，展示具体工作内容`,
    `办公设施/福利展示，现代化办公环境`,
    `员工访谈/成功案例，分享成长故事`,
    `薪资福利图表展示，${state.salary}吸引目光`,
    `申请流程动画，简单三步完成投递`,
    `${state.company} Logo + 联系方式，呼吁行动`,
  ]
  return descs[idx % descs.length]
}

function getVisualPrompt(idx: number, state: PromoState): string {
  const prompts = [
    `Modern office building exterior, golden hour lighting, professional corporate architecture, ${state.style} style, cinematic wide shot --ar 16:9 --v 6`,
    `Diverse team collaborating in modern open office, warm natural lighting, candid professional photography, ${state.style} style --ar 16:9 --v 6`,
    `Professional workspace close-up, computer screens, focused employee working, soft bokeh background, ${state.style} style --ar 16:9 --v 6`,
    `Premium office amenities, coffee bar, lounge area, plants, modern interior design, ${state.style} style --ar 16:9 --v 6`,
    `Smiling professional giving thumbs up, portrait shot, blurred office background, warm tones, ${state.style} style --ar 16:9 --v 6`,
    `Animated salary chart rising, gold coins and growth arrows, data visualization, ${state.style} style --ar 16:9 --v 6`,
    `Smartphone screen showing job application, clean UI mockup, finger tapping apply button, ${state.style} style --ar 16:9 --v 6`,
    `Company logo on dark background with golden accents, call-to-action text overlay, ${state.style} style --ar 16:9 --v 6`,
  ]
  return prompts[idx % prompts.length]
}

function getNarration(idx: number, state: PromoState): string {
  const narrations = [
    `欢迎来到${state.company}，柬埔寨领先的职业发展平台。`,
    `我们拥有一支充满激情的专业团队，致力于为每一位员工创造最好的发展环境。`,
    `现在，我们正在招聘${state.jobTitle}岗位。`,
    `我们提供${state.benefits || '完善的福利体系'}，让你工作无忧。`,
    `加入我们，你将获得专业的培训和广阔的职业发展空间。`,
    `薪资待遇优厚，${state.salary}，让你的付出得到应有的回报。`,
    `申请非常简单，只需要三步就能完成投递。`,
    `机会难得，赶快行动吧！${state.company}期待你的加入。`,
  ]
  return narrations[idx % narrations.length]
}

function getSubtitle(idx: number, state: PromoState): string {
  const subtitles = [
    `${state.company} · 你的职业伙伴`,
    `优秀团队 · 共同成长`,
    `诚聘 ${state.jobTitle}`,
    `${state.benefits || '完善福利 · 优厚待遇'}`,
    `专业培训 · 晋升通道`,
    `薪资: ${state.salary}`,
    `三步投递 · 快速入职`,
    `立即申请 · 开启新篇章`,
  ]
  return subtitles[idx % subtitles.length]
}
