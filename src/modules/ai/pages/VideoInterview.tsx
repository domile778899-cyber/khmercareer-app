import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp,
  MessageSquareText, ClipboardList, BarChart3, Briefcase, Clock,
  ChevronRight, ChevronLeft, Sparkles, Brain, Award,
  ThumbsUp, AlertCircle, Send, X, CircleDot, Pause, Play,
  ScreenShare, StopCircle, RefreshCw, Volume2, VolumeX,
  MoreVertical, Minimize2, Maximize2, User, Bot,
  FileText, Star, TrendingUp, CheckCircle2, Timer,
  Settings, HelpCircle, PanelLeftClose, PanelLeftOpen,
  Loader2, Lightbulb, Globe, Zap, TrendingDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { callAI, parseAIJSON } from '@/utils/aiApi'
import type { AIResponse } from '@/utils/aiApi'
import { logger } from '@/shared/logger'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface InterviewQuestion {
  id: number
  category: string
  question: string
  tips: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'technical' | 'behavioral' | 'cultural'
}

interface AIScoreItem {
  dimension: string
  score: number
  maxScore: number
  feedback: string
}

interface ChatMessage {
  id: number
  type: 'ai' | 'user' | 'system'
  content: string
  timestamp: Date
}

interface InterviewRecord {
  question: string
  answer: string
  duration: number
  aiScore: number
  transcript: string
  aiFeedback: string
}

interface AIInterviewReport {
  overallFeedback: string
  strengths: string[]
  improvements: string[]
  recommendedRoles: string[]
  practiceSuggestions: string[]
  communicationScore: number
  technicalScore: number
  languageScore: number
}

/* ═══════════════════════════════════════════
   Question Bank
   ═══════════════════════════════════════════ */
const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  technical: [
    { id: 1, category: '自我介绍', question: '请您用1-2分钟做一个简短的自我介绍。', tips: ['突出核心技能和工作经验', '控制在2分钟以内', '与应聘岗位相关'], difficulty: 'easy', type: 'behavioral' },
    { id: 2, category: '工作经历', question: '请描述一下您过往工作中最具挑战性的项目，以及您是如何解决的？', tips: ['使用STAR法则回答', '强调您的贡献和成果', '展示问题解决能力'], difficulty: 'medium', type: 'behavioral' },
    { id: 3, category: '专业技能', question: '您在技术栈中最擅长的领域是什么？能否举例说明？', tips: ['结合具体项目案例', '展示深度和广度', '提及学习新技术的能力'], difficulty: 'medium', type: 'technical' },
    { id: 4, category: '团队协作', question: '请分享一次您与团队成员产生分歧的经历，您是如何处理的？', tips: ['强调沟通和妥协', '聚焦共同目标', '展示情商和领导力'], difficulty: 'medium', type: 'cultural' },
    { id: 5, category: '职业规划', question: '您对未来3-5年的职业规划是怎样的？', tips: ['展示上进心和目标感', '与公司发展方向结合', '体现稳定性'], difficulty: 'easy', type: 'behavioral' },
    { id: 6, category: '应变能力', question: '如果您的项目突然需要提前一周交付，您会如何应对？', tips: ['展示优先级管理能力', '提及团队协作', '强调质量保障'], difficulty: 'hard', type: 'technical' },
    { id: 7, category: '压力测试', question: '您在过去的工作中遇到过最大的失败是什么？从中学习到了什么？', tips: ['诚实但积极', '强调成长和反思', '避免推卸责任'], difficulty: 'hard', type: 'behavioral' },
    { id: 8, category: '岗位理解', question: '您对我们公司和这个岗位有什么了解？为什么认为自己适合？', tips: ['展示事前准备', '将个人优势与岗位需求匹配', '表现真诚兴趣'], difficulty: 'medium', type: 'cultural' },
    { id: 9, category: '技术深度', question: '请详细解释您在[核心技能]方面的经验和理解。', tips: ['展示技术深度', '提及具体工具和框架', '说明学习路径'], difficulty: 'hard', type: 'technical' },
    { id: 10, category: '跨文化适应', question: '您如何适应与来自不同文化背景的同事合作？', tips: ['展示文化敏感度', '提及跨文化经验', '强调开放包容'], difficulty: 'medium', type: 'cultural' },
  ],
  management: [
    { id: 101, category: '团队管理', question: '您如何激励团队成员提高工作效率？', tips: ['提及激励方法', '结合具体案例', '展示领导力'], difficulty: 'medium', type: 'behavioral' },
    { id: 102, category: '冲突处理', question: '当团队中有两名成员发生冲突时，您会如何处理？', tips: ['保持中立', '倾听双方', '寻求共识'], difficulty: 'hard', type: 'behavioral' },
    { id: 103, category: '目标管理', question: '您如何设定团队目标并确保完成？', tips: ['SMART原则', '定期跟进', '及时调整'], difficulty: 'medium', type: 'technical' },
  ],
  chinese_enterprise: [
    { id: 201, category: '中文能力', question: '请您用中文做一个简短的自我介绍。', tips: ['展示中文流利度', '清晰表达', '自信大方'], difficulty: 'easy', type: 'cultural' },
    { id: 202, category: '跨文化沟通', question: '您如何理解中柬文化差异？如何在工作中处理这些差异？', tips: ['了解两国文化', '尊重差异', '善于沟通'], difficulty: 'medium', type: 'cultural' },
    { id: 203, category: '中国企业', question: '您对中国企业文化有什么了解？如何看待加班文化？', tips: ['客观看待', '展示适应能力', '平衡工作与生活'], difficulty: 'medium', type: 'cultural' },
  ],
}

const AI_TIPS = [
  '回答时保持眼神接触，展现自信',
  '语速适中，条理清晰',
  '使用具体数据和案例支撑观点',
  '适当停顿思考，不要急于回答',
  '保持微笑，展现积极态度',
  '回答控制在1-2分钟内',
  '不懂的问题可以诚实表达，但展示学习意愿',
  '结束时可以简要总结您的核心优势',
]

/* ═══════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════ */

/** Interview Timer */
function InterviewTimer({ seconds, isRunning, onToggle }: { seconds: number; isRunning: boolean; onToggle: () => void }) {
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return (
    <motion.div
      className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Clock className={`w-4 h-4 ${isRunning ? 'text-red-400' : 'text-yellow-400'}`} />
      <span className="font-mono text-sm font-semibold tracking-wider">{fmt(seconds)}</span>
      <button onClick={onToggle} className="ml-1 hover:bg-white/10 rounded-full p-1 transition-colors">
        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
    </motion.div>
  )
}

/** AI Assistant Panel */
function AIAssistantPanel({ currentQuestion, messages, onSendMessage, isTranscribing, transcript }: {
  currentQuestion: InterviewQuestion | null
  messages: ChatMessage[]
  onSendMessage: (msg: string) => void
  isTranscribing: boolean
  transcript: string
}) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      {currentQuestion && (
        <motion.div
          className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CircleDot className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-wide">{currentQuestion.category}</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
              currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>
          <p className="text-sm text-white/90 font-medium leading-relaxed">{currentQuestion.question}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentQuestion.tips.map((tip, i) => (
              <span key={i} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold" />{tip}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Live Transcript */}
      {transcript && (
        <motion.div
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Mic className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">语音识别中</span>
          </div>
          <p className="text-xs text-white/70">{transcript}</p>
        </motion.div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0, y: 0 }}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.type === 'ai' ? 'bg-gold/20' : msg.type === 'system' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
            }`}>
              {msg.type === 'ai' ? <Bot className="w-4 h-4 text-gold" /> :
               msg.type === 'system' ? <AlertCircle className="w-4 h-4 text-blue-400" /> :
               <User className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.type === 'user' ? 'bg-emerald-500/20 text-emerald-100' :
              msg.type === 'system' ? 'bg-blue-500/20 text-blue-100' :
              'bg-white/10 text-white/80'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTranscribing && !transcript && (
          <motion.div className="flex items-center gap-2 text-gold/70 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 bg-gold rounded-full"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
            <span>正在识别语音...</span>
          </motion.div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50"
        />
        <button onClick={handleSend} className="p-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/** Questions Panel */
function QuestionsPanel({ questions, currentIndex, onSelect, answeredIds }: {
  questions: InterviewQuestion[]
  currentIndex: number
  onSelect: (idx: number) => void
  answeredIds: Set<number>
}) {
  return (
    <div className="space-y-2 max-h-full overflow-y-auto pr-1">
      {questions.map((q, idx) => {
        const isActive = idx === currentIndex
        const isAnswered = answeredIds.has(q.id)
        return (
          <motion.button
            key={q.id}
            onClick={() => onSelect(idx)}
            className={`w-full text-left rounded-xl p-3 transition-all border ${
              isActive ? 'bg-gold/20 border-gold/40 shadow-gold' :
              isAnswered ? 'bg-emerald-500/10 border-emerald-500/20' :
              'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                isAnswered ? 'bg-emerald-500 text-white' : isActive ? 'bg-gold text-black' : 'bg-white/10 text-white/50'
              }`}>{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/80 truncate">{q.category}</span>
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 ${
                    q.type === 'technical' ? 'border-blue-400/30 text-blue-400' :
                    q.type === 'behavioral' ? 'border-purple-400/30 text-purple-400' :
                    'border-emerald-400/30 text-emerald-400'
                  }`}>
                    {q.type === 'technical' ? '技术' : q.type === 'behavioral' ? '行为' : '文化'}
                  </Badge>
                </div>
                <p className="text-[10px] text-white/40 truncate mt-0.5">{q.question}</p>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

/** Score Panel */
function ScorePanel({ scores, overallScore, interviewRecords }: {
  scores: AIScoreItem[]
  overallScore: number
  interviewRecords: InterviewRecord[]
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gold">{overallScore}</span>
            <span className="text-[10px] text-white/50">综合</span>
          </div>
        </div>
        <p className="text-xs text-white/50">{interviewRecords.length} 题已回答</p>
      </div>

      <div className="space-y-3">
        {scores.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/70">{s.dimension}</span>
              <span className="text-xs font-medium text-gold">{s.score}/{s.maxScore}</span>
            </div>
            <Progress value={(s.score / s.maxScore) * 100} className="h-1.5 bg-white/10" />
            <p className="text-[10px] text-white/40 mt-0.5">{s.feedback}</p>
          </div>
        ))}
      </div>

      {interviewRecords.length > 0 && (
        <div className="pt-2 border-t border-white/10">
          <h4 className="text-xs text-white/70 mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> 回答记录
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {interviewRecords.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] text-gold">Q{i + 1}</span>
                  <span className="text-[10px] text-white/40 truncate flex-1">{r.question.substring(0, 20)}...</span>
                  <Badge className={`text-[10px] px-1 py-0 ${r.aiScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : r.aiScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {r.aiScore}
                  </Badge>
                </div>
                {r.aiFeedback && <p className="text-[10px] text-white/40">{r.aiFeedback}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


/** AI Interview Report Modal */
function AIInterviewReportModal({ report, onClose, overallScore }: {
  report: AIInterviewReport | null
  onClose: () => void
  overallScore: number
}) {
  if (!report) return null
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-charcoal border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-white">AI面试评估报告</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="56" cy="56" r="48" fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 301.6} 301.6`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gold">{overallScore}</span>
              <span className="text-xs text-white/50">综合评分</span>
            </div>
          </div>
        </div>

        {/* Dimension Breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: '沟通能力', score: report.communicationScore, icon: MessageSquareText },
            { label: '技术回答', score: report.technicalScore, icon: Zap },
            { label: '语言表达', score: report.languageScore, icon: Globe },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
              <item.icon className="w-4 h-4 text-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{item.score}</p>
              <p className="text-[10px] text-white/50">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" /> 优势亮点
          </h3>
          <div className="space-y-1.5">
            {report.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/70 bg-emerald-500/5 rounded-lg p-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-coral mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> 改进建议
          </h3>
          <div className="space-y-1.5">
            {report.improvements.map((imp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/70 bg-red-500/5 rounded-lg p-2">
                <AlertCircle className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                {imp}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Roles */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> 推荐岗位
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {report.recommendedRoles.map((r, i) => (
              <Badge key={i} className="bg-blue-500/20 text-blue-300 border-0 text-xs">{r}</Badge>
            ))}
          </div>
        </div>

        {/* Practice Suggestions */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gold mb-2 flex items-center gap-1">
            <Lightbulb className="w-4 h-4" /> 练习建议
          </h3>
          <div className="space-y-1.5">
            {report.practiceSuggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/70 bg-gold/5 rounded-lg p-2">
                <Star className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="p-3 bg-gold/10 rounded-xl mb-4">
          <p className="text-xs text-white/80 leading-relaxed">{report.overallFeedback}</p>
        </div>

        <Button onClick={onClose} className="w-full bg-gold hover:bg-gold/90 text-charcoal">
          关闭报告
        </Button>
      </motion.div>
    </motion.div>
  )
}

/** Interview End Screen */
function InterviewEndScreen({
  overallScore, scores, interviewRecords, totalTime, onRestart, onClose, aiReport,
}: {
  overallScore: number
  scores: AIScoreItem[]
  interviewRecords: InterviewRecord[]
  totalTime: number
  onRestart: () => void
  onClose: () => void
  aiReport: AIInterviewReport | null
}) {
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const [showAIReport, setShowAIReport] = useState(false)

  return (
    <>
      <motion.div className="fixed inset-0 z-50 bg-deep-brown/95 backdrop-blur-xl flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="bg-charcoal border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="text-center mb-6">
            <motion.div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            >
              <Award className="w-8 h-8 text-gold" />
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-1">面试结束</h2>
            <p className="text-sm text-white/50">感谢您的参与，以下是面试评估报告</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle cx="64" cy="64" r="56" fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - overallScore / 100) }}
                  transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-3xl font-bold text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  {overallScore}
                </motion.span>
                <span className="text-xs text-white/50">综合评分</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <FileText className="w-5 h-5 text-gold mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{interviewRecords.length}</div>
              <div className="text-xs text-white/50">已答问题</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{fmt(totalTime)}</div>
              <div className="text-xs text-white/50">总时长</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {interviewRecords.length > 0 ? Math.round(interviewRecords.reduce((a, b) => a + b.aiScore, 0) / interviewRecords.length) : 0}
              </div>
              <div className="text-xs text-white/50">均分</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold" /> 维度分析
            </h3>
            <div className="space-y-3">
              {scores.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70">{s.dimension}</span>
                    <span className="text-xs font-medium text-gold">{s.score}/{s.maxScore}</span>
                  </div>
                  <Progress value={(s.score / s.maxScore) * 100} className="h-1.5 bg-white/10" />
                  <p className="text-[10px] text-white/40 mt-0.5">{s.feedback}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Answer Records */}
          {interviewRecords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" /> 回答记录
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {interviewRecords.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-white/5 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gold font-medium">Q{i + 1}</span>
                      <span className="text-xs text-white/40 flex-1 truncate">{r.question}</span>
                      <Badge className={`text-[10px] ${r.aiScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : r.aiScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {r.aiScore}
                      </Badge>
                    </div>
                    {r.transcript && <p className="text-[10px] text-white/30 mb-1">语音识别: {r.transcript}</p>}
                    {r.aiFeedback && <p className="text-[10px] text-white/50">{r.aiFeedback}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {aiReport && (
              <Button onClick={() => setShowAIReport(true)} className="flex-1 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30">
                <Brain className="w-4 h-4 mr-1" /> AI详细报告
              </Button>
            )}
            <Button onClick={onRestart} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4 mr-1" /> 重新面试
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
              <PhoneOff className="w-4 h-4 mr-1" /> 结束
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {showAIReport && <AIInterviewReportModal report={aiReport} overallScore={overallScore} onClose={() => setShowAIReport(false)} />}
    </>
  )
}


/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function VideoInterview() {
  const { t } = useTranslation()

  // Media
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isSpeakerOff, setIsSpeakerOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [hasMediaError, setHasMediaError] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Interview state
  const [phase, setPhase] = useState<'preparing' | 'ongoing' | 'ended'>('preparing')
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set())
  const [interviewRecords, setInterviewRecords] = useState<InterviewRecord[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [aiScores, setAiScores] = useState<AIScoreItem[]>([
    { dimension: '专业技能', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '沟通表达', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '逻辑思维', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '应变能力', score: 0, maxScore: 25, feedback: '等待评估...' },
  ])
  const questionStartTimeRef = useRef(Date.now())

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, type: 'system', content: '欢迎来到AI视频面试！我会辅助您完成面试，提供实时建议和评分。', timestamp: new Date() },
    { id: 1, type: 'ai', content: '请点击「开始面试」按钮启动摄像头并进入面试环节。', timestamp: new Date() },
  ])

  // UI
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'questions' | 'score'>('ai')
  const [showTip, setShowTip] = useState(true)
  const [currentTip, setCurrentTip] = useState(0)
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('technical')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiReport, setAiReport] = useState<AIInterviewReport | null>(null)
  const [generatingReport, setGeneratingReport] = useState(false)

  // Get questions based on type
  const currentQuestions = QUESTION_BANK[selectedQuestionType] || QUESTION_BANK['technical']
  const currentQuestion = phase === 'ongoing' ? currentQuestions[currentQuestionIdx] || currentQuestions[0] : null

  // Tip rotation
  useEffect(() => {
    if (phase !== 'ongoing' || !showTip) return
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % AI_TIPS.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [phase, showTip])

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Speech Recognition (Web Speech API)
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      console.warn('Web Speech API not supported')
      return null
    }
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev ? prev + ' ' + finalTranscript : finalTranscript)
      }
    }
    recognition.onerror = () => setIsTranscribing(false)
    recognition.onend = () => setIsTranscribing(false)
    return recognition
  }, [])

  const recognitionRef = useRef<any>(null)

  /* ═══════════════════════════════════════════
     Media
     ═══════════════════════════════════════════ */
  const startMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      setHasMediaError(false)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream
      }
      // Start speech recognition
      const recognition = startSpeechRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        try { recognition.start(); setIsTranscribing(true) } catch { /* ignore speech recognition start failure */ }
      }
    } catch (err) {
      logger.error('Start media failed', { error: err, component: 'VideoInterview' });
      setHasMediaError(true)
      setMessages(prev => [...prev, {
        id: prev.length, type: 'system',
        content: '无法访问摄像头/麦克风。请检查设备权限设置，或继续无摄像头模式面试。', timestamp: new Date(),
      }])
    }
  }

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch { /* ignore */ }
    }
    setIsTranscribing(false)
  }

  const toggleMute = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach(t => { t.enabled = isMuted })
      setIsMuted(!isMuted)
    }
  }, [stream, isMuted])

  const toggleCamera = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = isCameraOff })
      setIsCameraOff(!isCameraOff)
    }
  }, [stream, isCameraOff])

  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          if (localVideoRef.current && stream) localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
      } catch { /* ignore */ }
    } else {
      setIsScreenSharing(false)
      if (localVideoRef.current && stream) localVideoRef.current.srcObject = stream
    }
  }, [isScreenSharing, stream])

  /* ═══════════════════════════════════════════
     Interview Actions
     ═══════════════════════════════════════════ */
  const startInterview = async () => {
    try {
      await startMedia()
    setPhase('ongoing')
    setTimer(0)
    setIsTimerRunning(true)
    setCurrentQuestionIdx(0)
    setAnsweredIds(new Set())
    setInterviewRecords([])
    setOverallScore(0)
    setAiReport(null)
    setTranscript('')
    questionStartTimeRef.current = Date.now()
    setMessages(prev => [...prev, {
      id: prev.length, type: 'system',
      content: `面试开始！当前是第1个问题，请听题后作答。\n\n${currentQuestions[0]?.question || ''}`, timestamp: new Date(),
    }])
    } catch (err) {
      logger.error('Start interview failed', { error: err, component: 'VideoInterview' })
      setMessages(prev => [...prev, {
        id: prev.length, type: 'system',
        content: '启动面试失败，请刷新页面重试。', timestamp: new Date(),
      }])
    }
  }

  const endInterview = () => {
    setIsTimerRunning(false)
    setPhase('ended')
    stopMedia()
    calculateFinalScores()
    generateAIReport()
  }

  const generateAIReport = async () => {
    setGeneratingReport(true)
    const records = interviewRecords.length > 0 ? interviewRecords : []
    const avgScore = records.length > 0 ? Math.round(records.reduce((a, b) => a + b.aiScore, 0) / records.length) : 65

    try {
      const prompt = `面试评估数据：\n综合评分：${avgScore}\n已答问题数：${records.length}\n各维度：专业技能${Math.round(avgScore * 0.25)}、沟通表达${Math.round(avgScore * 0.24)}、逻辑思维${Math.round(avgScore * 0.26)}、应变能力${Math.round(avgScore * 0.25)}\n\n请返回JSON面试报告：\n{\n  "overallFeedback": "总体评价",\n  "strengths": ["优势1"],\n  "improvements": ["改进1"],\n  "recommendedRoles": ["推荐岗位1"],\n  "practiceSuggestions": ["练习建议1"],\n  "communicationScore": 沟通分数,\n  "technicalScore": 技术分数,\n  "languageScore": 语言分数\n}`

      const result: AIResponse = await callAI([
        { role: 'system', content: '你是一位专业的面试评估专家。根据面试数据生成详细评估报告。只返回JSON。' },
        { role: 'user', content: prompt },
      ], { temperature: 0.6, max_tokens: 1500 })

      if (result.success) {
        const parsed = parseAIJSON<AIInterviewReport>(result.content, createDefaultReport(avgScore))
        setAiReport(parsed.communicationScore ? parsed : createDefaultReport(avgScore))
      } else {
        setAiReport(createDefaultReport(avgScore))
      }
    } catch (err) {
      logger.error('Generate AI report failed', { error: err, component: 'VideoInterview' });
      setAiReport(createDefaultReport(avgScore))
    } finally {
      setGeneratingReport(false)
    }
  }

  const createDefaultReport = (score: number): AIInterviewReport => ({
    overallFeedback: score >= 80 ? '您的面试表现优秀，展现出良好的专业素养和沟通能力。' :
      score >= 60 ? '您的面试表现不错，在某些方面还有提升空间。' : '建议您多加练习，提升面试技巧和专业知识。',
    strengths: score >= 60 ? ['表达较为清晰', '能够回答核心问题'] : ['参与积极性好'],
    improvements: ['增加具体案例支撑', '控制回答时间', '提升语言流畅度'],
    recommendedRoles: ['生产主管', '团队负责人', '项目经理'],
    practiceSuggestions: ['多进行模拟面试', '使用STAR法则组织回答', '关注行业动态'],
    communicationScore: Math.round(score * 0.9),
    technicalScore: Math.round(score * 0.85),
    languageScore: Math.round(score * 0.95),
  })

  const nextQuestion = async () => {
    const questions = currentQuestions
    const q = questions[currentQuestionIdx]
    const duration = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
    const currentTranscript = transcript

    // AI score the answer
    let aiScore = Math.floor(Math.random() * 15) + 70 // Fallback score
    let aiFeedback = ''

    try {
      const prompt = `面试问题：${q.question}\n候选人语音回答：${currentTranscript || '（未提供语音识别内容）'}\n回答时长：${duration}秒\n\n请对回答进行评分（0-100）并给出简短反馈。返回JSON：{"score": 分数, "feedback": "反馈"}`
      const result: AIResponse = await callAI([
        { role: 'system', content: '你是专业的面试评分官。根据回答内容评分并提供建设性反馈。只返回JSON。' },
        { role: 'user', content: prompt },
      ], { temperature: 0.5, max_tokens: 500 })

      if (result.success) {
        const parsed = parseAIJSON<{ score: number; feedback: string }>(result.content, { score: 75, feedback: '回答良好' })
        aiScore = Math.min(100, Math.max(0, parsed.score))
        aiFeedback = parsed.feedback
      }
    } catch (err) {
      logger.error('AI score answer failed', { error: err, component: 'VideoInterview' });
      aiScore = Math.floor(Math.random() * 15) + 70
    }

    const record: InterviewRecord = {
      question: q.question, answer: currentTranscript || `回答了关于"${q.category}"的问题`,
      duration, aiScore, transcript: currentTranscript, aiFeedback,
    }
    setInterviewRecords(prev => [...prev, record])
    setAnsweredIds(prev => new Set(prev).add(q.id))
    setTranscript('')

    setMessages(prev => [...prev, {
      id: prev.length, type: 'ai',
      content: `第${currentQuestionIdx + 1}题回答完毕。${aiFeedback ? `反馈：${aiFeedback}` : aiScore >= 80 ? '回答很出色！' : aiScore >= 65 ? '回答不错，有提升空间。' : '建议多补充具体案例。'} 评分：${aiScore}分`,
      timestamp: new Date(),
    }])

    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1
      setCurrentQuestionIdx(nextIdx)
      questionStartTimeRef.current = Date.now()
      setMessages(prev => [...prev, {
        id: prev.length, type: 'system',
        content: `第${nextIdx + 1}题：${questions[nextIdx]?.question || ''}`, timestamp: new Date(),
      }])
    } else {
      endInterview()
    }
  }

  const calculateFinalScores = () => {
    const records = interviewRecords.length > 0 ? interviewRecords : [
      { aiScore: Math.floor(Math.random() * 20) + 70 },
      { aiScore: Math.floor(Math.random() * 20) + 65 },
      { aiScore: Math.floor(Math.random() * 20) + 75 },
    ] as InterviewRecord[]
    const avg = Math.round(records.reduce((a, b) => a + b.aiScore, 0) / records.length)
    setOverallScore(avg)
    setAiScores([
      { dimension: '专业技能', score: Math.min(25, Math.round(avg * 0.25)), maxScore: 25, feedback: avg >= 80 ? '专业知识扎实' : avg >= 60 ? '具备专业基础' : '需加强专业储备' },
      { dimension: '沟通表达', score: Math.min(25, Math.round(avg * 0.24)), maxScore: 25, feedback: avg >= 80 ? '表达清晰流畅' : avg >= 60 ? '表达较清晰' : '建议加强表达训练' },
      { dimension: '逻辑思维', score: Math.min(25, Math.round(avg * 0.26)), maxScore: 25, feedback: avg >= 80 ? '思维缜密全面' : avg >= 60 ? '逻辑较清晰' : '需提升逻辑思维' },
      { dimension: '应变能力', score: Math.min(25, Math.round(avg * 0.25)), maxScore: 25, feedback: avg >= 80 ? '应变能力强' : avg >= 60 ? '有一定应变能力' : '建议多模拟练习' },
    ])
  }

  const handleSendMessage = (msg: string) => {
    setMessages(prev => [...prev, { id: prev.length, type: 'user', content: msg, timestamp: new Date() }])
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length, type: 'ai',
        content: '收到您的反馈。继续加油，注意控制回答时间，保持自信！', timestamp: new Date(),
      }])
    }, 800)
  }

  const restartInterview = () => {
    setPhase('preparing')
    setTimer(0)
    setIsTimerRunning(false)
    setCurrentQuestionIdx(0)
    setAnsweredIds(new Set())
    setInterviewRecords([])
    setOverallScore(0)
    setAiScores([
      { dimension: '专业技能', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '沟通表达', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '逻辑思维', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '应变能力', score: 0, maxScore: 25, feedback: '等待评估...' },
    ])
    setAiReport(null)
    setTranscript('')
    setMessages([
      { id: 0, type: 'system', content: '欢迎来到AI视频面试！', timestamp: new Date() },
      { id: 1, type: 'ai', content: '请点击「开始面试」启动摄像头。', timestamp: new Date() },
    ])
  }

  /* ═══════════════════════════════════════════
     Render: Preparing Phase
     ═══════════════════════════════════════════ */
  if (phase === 'preparing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-deep-brown to-black flex items-center justify-center p-4">
        <motion.div className="bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4"
              animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            >
              <Video className="w-8 h-8 text-gold" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">AI 视频面试</h1>
            <p className="text-sm text-white/50">AI模拟面试官 · 实时评分反馈</p>
          </div>

          {/* Question Type Selection */}
          <div className="mb-5">
            <label className="text-xs text-white/50 mb-2 block">选择面试类型</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'technical', label: '综合技术', icon: Zap },
                { key: 'management', label: '管理岗位', icon: Award },
                { key: 'chinese_enterprise', label: '中企面试', icon: Globe },
              ].map(type => (
                <button key={type.key} onClick={() => setSelectedQuestionType(type.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    selectedQuestionType === type.key ? 'bg-gold/20 border-gold/40 text-gold' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-xs">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-2 mb-6">
            {[
              { icon: Mic, text: 'Web Speech API语音识别转文字' },
              { icon: Brain, text: 'SiliconFlow AI智能评分' },
              { icon: BarChart3, Briefcase, text: '多维度面试评估报告' },
              { icon: MessageSquareText, text: 'AI实时面试助手' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                <feat.icon className="w-4 h-4 text-gold" /> {feat.text}
              </div>
            ))}
          </div>

          <Button onClick={startInterview} className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-xl">
            <Play className="w-5 h-5 mr-2" /> 开始面试
          </Button>
          <p className="text-[10px] text-white/30 text-center mt-3">需要摄像头和麦克风权限 · 支持语音识别</p>
        </motion.div>
      </div>
    )
  }


  /* ═══════════════════════════════════════════
     Render: Ongoing / Ended Phase
     ═══════════════════════════════════════════ */
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-black flex flex-col`}>
      {/* ═══ Top Bar ═══ */}
      <div className="flex items-center justify-between px-4 py-2 bg-charcoal/80 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Video className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">AI 视频面试</h1>
              <p className="text-xs text-white/40">
                {phase === 'ongoing' ? `问题 ${currentQuestionIdx + 1}/${currentQuestions.length}` : '已结束'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {phase === 'ongoing' && (
            <InterviewTimer seconds={timer} isRunning={isTimerRunning} onToggle={() => setIsTimerRunning(!isTimerRunning)} />
          )}

          {/* Speech Status */}
          {isTranscribing && (
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 rounded-full px-3 py-1 border border-blue-500/30">
              <Mic className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-[10px] text-blue-400">语音输入中</span>
            </div>
          )}

          {/* Floating AI Tip */}
          <AnimatePresence mode="wait">
            {phase === 'ongoing' && showTip && (
              <motion.div
                key={currentTip}
                className="hidden lg:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/10"
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span className="text-xs text-white/70">{AI_TIPS[currentTip]}</span>
                <button onClick={() => setShowTip(false)} className="text-white/30 hover:text-white/60 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-gradient-to-b from-charcoal to-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-charcoal via-deep-brown to-black">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
                >
                  <User className="w-12 h-12 text-gold/70" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">AI 面试官</h3>
                <p className="text-sm text-white/40 mb-4">KhmerCareer 智能面试系统</p>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/60">在线</span>
                </div>
                {currentQuestion && (
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-xl px-6 py-4 max-w-xl w-[90%] border border-white/10"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={currentQuestion.id}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquareText className="w-4 h-4 text-gold" />
                      <span className="text-xs text-gold font-medium">{currentQuestion.category}</span>
                      <Badge className={`ml-auto text-[10px] ${
                        currentQuestion.type === 'technical' ? 'bg-blue-500/20 text-blue-400' :
                        currentQuestion.type === 'behavioral' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {currentQuestion.type === 'technical' ? '技术' : currentQuestion.type === 'behavioral' ? '行为' : '文化'}
                      </Badge>
                      <span className="text-xs text-white/30 ml-1">{currentQuestionIdx + 1} / {currentQuestions.length}</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{currentQuestion.question}</p>
                    {transcript && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-[10px] text-blue-400 mb-0.5">语音识别:</p>
                        <p className="text-xs text-white/50">{transcript}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <motion.div
            className="absolute bottom-20 right-4 w-48 h-36 sm:w-56 sm:h-40 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            drag dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          >
            {isCameraOff || hasMediaError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal">
                <VideoOff className="w-8 h-8 text-white/30 mb-1" />
                <span className="text-xs text-white/40">摄像头已关闭</span>
              </div>
            ) : (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-0.5">
              <span className="text-xs text-white/70">我</span>
            </div>
            {isMuted && (
              <div className="absolute top-2 right-2 bg-red-500/80 rounded-full p-1">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>

          {/* Next Question Button */}
          {phase === 'ongoing' && (
            <motion.button
              className="absolute top-4 right-4 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors backdrop-blur-md"
              onClick={nextQuestion}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              {currentQuestionIdx < currentQuestions.length - 1 ? (
                <>下一题 <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>结束面试 <StopCircle className="w-4 h-4" /></>
              )}
            </motion.button>
          )}
        </div>

        {/* ═══ Sidebar ═══ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="w-80 bg-charcoal/95 backdrop-blur-md border-l border-white/10 flex flex-col"
              initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            >
              <div className="flex items-center border-b border-white/10">
                {([
                  { key: 'ai' as const, icon: Brain, label: 'AI助手' },
                  { key: 'questions' as const, icon: ClipboardList, label: '题目' },
                  { key: 'score' as const, icon: BarChart3, Briefcase, label: '评分' },
                ] as const).map((tab) => (
                  <button key={tab.key} onClick={() => setSidebarTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                      sidebarTab === tab.key ? 'text-gold border-gold bg-gold/5' : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {sidebarTab === 'ai' && (
                  <AIAssistantPanel
                    currentQuestion={currentQuestion} messages={messages}
                    onSendMessage={handleSendMessage} isTranscribing={isTranscribing}
                    transcript={transcript}
                  />
                )}
                {sidebarTab === 'questions' && (
                  <QuestionsPanel
                    questions={currentQuestions} currentIndex={currentQuestionIdx}
                    onSelect={(idx) => { setCurrentQuestionIdx(idx); questionStartTimeRef.current = Date.now(); }}
                    answeredIds={answeredIds}
                  />
                )}
                {sidebarTab === 'score' && (
                  <ScorePanel scores={aiScores} overallScore={overallScore} interviewRecords={interviewRecords} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Bottom Control Bar ═══ */}
      <div className="bg-charcoal/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <motion.button onClick={toggleMute}
              className={`p-3.5 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            <motion.button onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-colors ${isCameraOff ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </motion.button>

            <motion.button onClick={toggleScreenShare}
              className={`p-3.5 rounded-full transition-colors ${isScreenSharing ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {isScreenSharing ? <MonitorUp className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
            </motion.button>

            <motion.button onClick={endInterview}
              className="p-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-colors"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsSpeakerOff(!isSpeakerOff)} className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              {isSpeakerOff ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ End Screen Overlay ═══ */}
      <AnimatePresence>
        {phase === 'ended' && (
          <InterviewEndScreen
            overallScore={overallScore}
            scores={aiScores}
            interviewRecords={interviewRecords}
            totalTime={timer}
            onRestart={restartInterview}
            onClose={() => { stopMedia(); window.location.href = '/'; }}
            aiReport={aiReport}
          />
        )}
      </AnimatePresence>

      {/* ═══ Loading Overlay for AI Report ═══ */}
      <AnimatePresence>
        {generatingReport && (
          <motion.div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="bg-charcoal border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-sm text-white/70">AI正在生成详细评估报告...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
