import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp,
  MessageSquareText, ClipboardList, BarChart3, Clock,
  ChevronRight, ChevronLeft, Sparkles, Brain, Award,
  ThumbsUp, AlertCircle, Send, X, CircleDot, Pause, Play,
  ScreenShare, StopCircle, RefreshCw, Volume2, VolumeX,
  MoreVertical, Minimize2, Maximize2, User, Bot,
  FileText, Star, TrendingUp, CheckCircle2, Timer,
  Settings, HelpCircle, PanelLeftClose, PanelLeftOpen,
  Signal, SignalHigh, SignalLow, NotebookPen, Phone,
  WifiOff, Loader2, StickyNote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiClient } from '../api/client'

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface InterviewQuestion {
  id: number
  category: string
  question: string
  tips: string[]
  difficulty: 'easy' | 'medium' | 'hard'
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
}

/* ── WebRTC Signaling Types ── */
interface CallStatus {
  state: 'idle' | 'connecting' | 'ringing' | 'connected' | 'reconnecting' | 'ended' | 'error'
  message: string
}

interface WebRTCSignalPayload {
  type: 'offer' | 'answer' | 'ice-candidate'
  sdp?: string
  candidate?: RTCIceCandidateInit
  roomId: string
  fromUserId: string
  toUserId?: string
}

interface InterviewNote {
  id: string
  questionId: number
  note: string
  score: number
  createdAt: string
}

/* ═══════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════ */
const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    category: '自我介绍',
    question: '请您用1-2分钟做一个简短的自我介绍。',
    tips: ['突出核心技能和工作经验', '控制在2分钟以内', '与应聘岗位相关'],
    difficulty: 'easy',
  },
  {
    id: 2,
    category: '工作经历',
    question: '请描述一下您过往工作中最具挑战性的项目，以及您是如何解决的？',
    tips: ['使用STAR法则回答', '强调您的贡献和成果', '展示问题解决能力'],
    difficulty: 'medium',
  },
  {
    id: 3,
    category: '专业技能',
    question: '您在技术栈中最擅长的领域是什么？能否举例说明？',
    tips: ['结合具体项目案例', '展示深度和广度', '提及学习新技术的能力'],
    difficulty: 'medium',
  },
  {
    id: 4,
    category: '团队协作',
    question: '请分享一次您与团队成员产生分歧的经历，您是如何处理的？',
    tips: ['强调沟通和妥协', '聚焦共同目标', '展示情商和领导力'],
    difficulty: 'medium',
  },
  {
    id: 5,
    category: '职业规划',
    question: '您对未来3-5年的职业规划是怎样的？',
    tips: ['展示上进心和目标感', '与公司发展方向结合', '体现稳定性'],
    difficulty: 'easy',
  },
  {
    id: 6,
    category: '应变能力',
    question: '如果您的项目突然需要提前一周交付，您会如何应对？',
    tips: ['展示优先级管理能力', '提及团队协作', '强调质量保障'],
    difficulty: 'hard',
  },
  {
    id: 7,
    category: '压力测试',
    question: '您在过去的工作中遇到过最大的失败是什么？从中学习到了什么？',
    tips: ['诚实但积极', '强调成长和反思', '避免推卸责任'],
    difficulty: 'hard',
  },
  {
    id: 8,
    category: '岗位理解',
    question: '您对我们公司和这个岗位有什么了解？为什么认为自己适合？',
    tips: ['展示事前准备', '将个人优势与岗位需求匹配', '表现真诚兴趣'],
    difficulty: 'medium',
  },
]

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

/** Call Status Badge */
function CallStatusBadge({ status }: { status: CallStatus }) {
  const iconMap = {
    idle: <Signal className="w-3.5 h-3.5 text-white/60" />,
    connecting: <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
    ringing: <SignalLow className="w-3.5 h-3.5 text-amber-400" />,
    connected: <SignalHigh className="w-3.5 h-3.5 text-emerald-400" />,
    reconnecting: <WifiOff className="w-3.5 h-3.5 text-amber-400" />,
    ended: <WifiOff className="w-3.5 h-3.5 text-white/40" />,
    error: <WifiOff className="w-3.5 h-3.5 text-red-400" />,
  }
  const bgMap = {
    idle: 'bg-white/10',
    connecting: 'bg-amber-500/20',
    ringing: 'bg-amber-500/20',
    connected: 'bg-emerald-500/20',
    reconnecting: 'bg-amber-500/20',
    ended: 'bg-white/10',
    error: 'bg-red-500/20',
  }
  return (
    <motion.div
      className={`flex items-center gap-1.5 ${bgMap[status.state]} backdrop-blur-md rounded-full px-3 py-1.5 text-white`}
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      key={status.state}
    >
      {iconMap[status.state]}
      <span className="text-[11px] font-medium">{status.message}</span>
    </motion.div>
  )
}

/** Call Duration Badge */
function CallDurationBadge({ duration }: { duration: number }) {
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return (
    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 text-white">
      <Phone className="w-3.5 h-3.5 text-gold" />
      <span className="font-mono text-[11px] font-semibold tracking-wider">{fmt(duration)}</span>
    </div>
  )
}

/** Interview Notes Panel */
function InterviewNotesPanel({ notes, onDelete }: { notes: InterviewNote[]; onDelete: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <NotebookPen className="w-3.5 h-3.5" /> 面试笔记
      </h4>
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 pr-1">
        {notes.length === 0 && (
          <p className="text-white/30 text-xs text-center py-8">暂无笔记，请在面试中添加</p>
        )}
        {notes.map(note => (
          <motion.div
            key={note.id}
            className="bg-white/5 border border-white/10 rounded-lg p-3"
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gold text-[10px] font-medium">Q{note.questionId} · {note.score}分</span>
              <button onClick={() => onDelete(note.id)} className="text-white/20 hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">{note.note}</p>
            <span className="text-white/20 text-[10px] mt-1.5 block">
              {new Date(note.createdAt).toLocaleTimeString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

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
function AIAssistantPanel({ currentQuestion, messages, onSendMessage, isTranscribing }: {
  currentQuestion: InterviewQuestion | null
  messages: ChatMessage[]
  onSendMessage: (msg: string) => void
  isTranscribing: boolean
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
      {/* Current Question Card */}
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.type === 'ai' ? 'bg-gold/20' : msg.type === 'system' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
            }`}>
              {msg.type === 'ai' ? <Bot className="w-4 h-4 text-gold" /> :
               msg.type === 'system' ? <AlertCircle className="w-4 h-4 text-blue-400" /> :
               <User className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.type === 'user'
                ? 'bg-emerald-500/20 text-emerald-100'
                : msg.type === 'system'
                ? 'bg-blue-500/20 text-blue-100'
                : 'bg-white/10 text-white/80'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Transcribing Indicator */}
        {isTranscribing && (
          <motion.div
            className="flex items-center gap-2 text-gold/70 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-gold rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span>正在识别语音...</span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/** Questions Panel */
function QuestionsPanel({
  questions,
  currentIndex,
  onSelect,
  answeredIds,
}: {
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
              isActive
                ? 'bg-gold/20 border-gold/40 shadow-gold'
                : isAnswered
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                isActive ? 'bg-gold text-black' : isAnswered ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'
              }`}>
                {isAnswered ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </span>
              <span className={`text-xs font-medium flex-1 line-clamp-1 ${isActive ? 'text-gold' : 'text-white/80'}`}>
                {q.category}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {q.difficulty === 'easy' ? '简' : q.difficulty === 'medium' ? '中' : '难'}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1.5 line-clamp-2 pl-7">{q.question}</p>
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
    <div className="space-y-4 overflow-y-auto pr-1">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-xl p-4 text-center">
        <div className="relative inline-block">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="34" fill="none" stroke="#D4AF37" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - overallScore / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gold">{overallScore}</span>
            <span className="text-xs text-white/50">总分</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1">
          {overallScore >= 80 ? <Award className="w-4 h-4 text-gold" /> :
           overallScore >= 60 ? <ThumbsUp className="w-4 h-4 text-emerald-400" /> :
           <AlertCircle className="w-4 h-4 text-yellow-400" />}
          <span className="text-xs text-white/70">
            {overallScore >= 80 ? '表现优秀' : overallScore >= 60 ? '表现良好' : '有待提升'}
          </span>
        </div>
      </div>

      {/* Dimension Scores */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" /> 维度评分
        </h4>
        <div className="space-y-2.5">
          {scores.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/70">{s.dimension}</span>
                <span className="text-xs font-medium text-gold">{s.score}/{s.maxScore}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.score / s.maxScore) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              <p className="text-xs text-white/40 mt-0.5">{s.feedback}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interview Records */}
      {interviewRecords.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> 面试记录
          </h4>
          <div className="space-y-2">
            {interviewRecords.map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white/80 line-clamp-1 flex-1">Q{i + 1}: {r.question}</span>
                  <span className="text-xs text-gold ml-2">{r.aiScore}分</span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{r.answer}</p>
                <div className="flex items-center gap-1 mt-1 text-white/30">
                  <Timer className="w-3 h-3" />
                  <span className="text-xs">{Math.floor(r.duration / 60)}分{r.duration % 60}秒</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Interview End Screen */
function InterviewEndScreen({
  overallScore,
  scores,
  interviewRecords,
  totalTime,
  onRestart,
  onClose,
}: {
  overallScore: number
  scores: AIScoreItem[]
  interviewRecords: InterviewRecord[]
  totalTime: number
  onRestart: () => void
  onClose: () => void
}) {
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-deep-brown/95 backdrop-blur-xl flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-charcoal border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="text-center mb-6">
          <motion.div
            className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Award className="w-8 h-8 text-gold" />
          </motion.div>
          <h2 className="text-xl font-bold text-white mb-1">面试结束</h2>
          <p className="text-sm text-white/50">感谢您的参与，以下是面试评估报告</p>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <motion.circle
                cx="64" cy="64" r="56" fill="none" stroke="#D4AF37" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - overallScore / 100) }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-bold text-gold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {overallScore}
              </motion.span>
              <span className="text-xs text-white/50">综合评分</span>
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Dimension Breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gold" /> 维度分析
          </h3>
          <div className="space-y-3">
            {scores.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">{s.dimension}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.score / s.maxScore) * 100}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-gold font-medium w-10 text-right">{s.score}分</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 pl-0">{s.feedback}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gold mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI 综合评价
          </h3>
          <p className="text-xs text-white/70 leading-relaxed">
            {overallScore >= 85
              ? '您在本次面试中表现出色，展现了扎实的专业技能和良好的沟通能力。建议继续保持，并可以考虑在团队协作案例方面补充更多细节。'
              : overallScore >= 70
              ? '您在本次面试中表现良好，具备岗位所需的核心能力。建议在回答问题时更加注重结构化表达，并多准备一些具体的项目案例。'
              : overallScore >= 60
              ? '您展现了一定的潜力，但在专业深度和表达能力方面还有提升空间。建议针对岗位核心技能加强准备，并练习清晰简洁地表达观点。'
              : '本次面试表现有待提升。建议系统复习岗位相关知识，加强模拟面试练习，提高应答的条理性和针对性。'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onRestart}
            className="flex-1 bg-gold hover:bg-gold-dark text-deep-brown font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> 重新开始
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" /> 退出
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
type SidebarTab = 'ai' | 'questions' | 'score' | 'notes'
type InterviewPhase = 'preparing' | 'ongoing' | 'ended'

export default function VideoInterview() {
  /* ── Phase & Timer ── */
  const [phase, setPhase] = useState<InterviewPhase>('preparing')
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Media ── */
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [hasMediaError, setHasMediaError] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isSpeakerOff, setIsSpeakerOff] = useState(false)

  /* ── Sidebar ── */
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('questions')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  /* ── Interview State ── */
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set())
  const [interviewRecords, setInterviewRecords] = useState<InterviewRecord[]>([])
  const questionStartTimeRef = useRef<number>(0)

  /* ── AI Chat ── */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: 'system',
      content: '欢迎来到AI视频面试！我会辅助您完成面试，提供实时建议和评分。',
      timestamp: new Date(),
    },
    {
      id: 1,
      type: 'ai',
      content: '请点击「开始面试」按钮启动摄像头并进入面试环节。准备好后，我们将从第一个问题开始。',
      timestamp: new Date(),
    },
  ])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const [currentTip, setCurrentTip] = useState(0)

  /* ── Scores ── */
  const [aiScores, setAiScores] = useState<AIScoreItem[]>([
    { dimension: '专业技能', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '沟通表达', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '逻辑思维', score: 0, maxScore: 25, feedback: '等待评估...' },
    { dimension: '应变能力', score: 0, maxScore: 25, feedback: '等待评估...' },
  ])
  const [overallScore, setOverallScore] = useState(0)

  /* ═══════════════════════════════════════════
     Timer Logic
     ═══════════════════════════════════════════ */
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isTimerRunning])

  /* ═══════════════════════════════════════════
     AI Tip Rotation
     ═══════════════════════════════════════════ */
  useEffect(() => {
    if (phase !== 'ongoing') return
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % AI_TIPS.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [phase])

  /* ═══════════════════════════════════════════
     Media: getUserMedia + WebRTC Signaling
     ═══════════════════════════════════════════ */
  const [callStatus, setCallStatus] = useState<CallStatus>({ state: 'idle', message: '准备就绪' })
  const [callDuration, setCallDuration] = useState(0)
  const [callTimerRunning, setCallTimerRunning] = useState(false)
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([])
  const [noteInput, setNoteInput] = useState('')
  const [noteScore, setNoteScore] = useState(5)
  const [showNotesPanel, setShowNotesPanel] = useState(false)
  const [roomId, setRoomId] = useState<string>('')
  const signalingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Call Duration Timer ── */
  useEffect(() => {
    if (callTimerRunning) {
      callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
    } else if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current) }
  }, [callTimerRunning])

  /* ── Format duration ── */
  const fmtDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  /* ── WebRTC Signaling: Create Room ── */
  const createSignalRoom = useCallback(async (rid: string) => {
    try {
      await apiClient.post('/webrtc/rooms', { roomId: rid, type: 'interview' })
    } catch {
      // Local mode - continue without signaling server
    }
  }, [])

  /* ── Send Signal ── */
  const sendSignal = useCallback(async (payload: Omit<WebRTCSignalPayload, 'fromUserId'>) => {
    try {
      await apiClient.post('/webrtc/signal', { ...payload, fromUserId: userId.current })
    } catch {
      // Local mode
    }
  }, [])

  /* ── Poll for Remote Signals ── */
  const startSignalingPolling = useCallback((rid: string, pc: RTCPeerConnection) => {
    if (signalingIntervalRef.current) clearInterval(signalingIntervalRef.current)
    signalingIntervalRef.current = setInterval(async () => {
      try {
        const response = await apiClient.get(`/webrtc/signals/${rid}?userId=${userId.current}`)
        const signals: WebRTCSignalPayload[] = response.data || []
        for (const sig of signals) {
          if (sig.type === 'answer' && sig.sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sig.sdp }))
          } else if (sig.type === 'ice-candidate' && sig.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(sig.candidate))
          }
        }
      } catch {
        // No signals available
      }
    }, 3000)
  }, [])

  /* ── Stop Signaling Polling ── */
  const stopSignalingPolling = useCallback(() => {
    if (signalingIntervalRef.current) {
      clearInterval(signalingIntervalRef.current)
      signalingIntervalRef.current = null
    }
  }, [])

  /* ── Save Interview Note ── */
  const saveNote = useCallback(() => {
    if (!noteInput.trim() || !currentQuestion) return
    const note: InterviewNote = {
      id: crypto.randomUUID(),
      questionId: currentQuestion.id,
      note: noteInput.trim(),
      score: noteScore,
      createdAt: new Date().toISOString(),
    }
    setInterviewNotes(prev => [...prev, note])
    setNoteInput('')
    setNoteScore(5)
  }, [noteInput, noteScore, currentQuestion])

  /* ── Delete Note ── */
  const deleteNote = useCallback((id: string) => {
    setInterviewNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  /* ═══════════════════════════════════════════
     Media: getUserMedia with WebRTC Signaling
     ═══════════════════════════════════════════ */
  const userId = useRef(`user_${Math.random().toString(36).slice(2, 8)}`)

  const startMedia = useCallback(async () => {
    try {
      setCallStatus({ state: 'connecting', message: '正在连接...' })
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true,
      })
      setStream(mediaStream)
      setHasMediaError(false)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream
      }

      /* ── Setup WebRTC PeerConnection with Signaling ── */
      const rid = `interview_${crypto.randomUUID()}`
      setRoomId(rid)
      await createSignalRoom(rid)

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      })
      pcRef.current = pc

      mediaStream.getTracks().forEach(track => pc.addTrack(track, mediaStream))

      /* ── Handle remote stream ── */
      const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement
      pc.ontrack = (event) => {
        if (remoteVideo && event.streams[0]) {
          remoteVideo.srcObject = event.streams[0]
        }
      }

      /* ── Connection state changes ── */
      pc.onconnectionstatechange = () => {
        switch (pc.connectionState) {
          case 'connecting':
            setCallStatus({ state: 'connecting', message: '正在建立连接...' })
            break
          case 'connected':
            setCallStatus({ state: 'connected', message: '已连接' })
            setCallTimerRunning(true)
            break
          case 'disconnected':
            setCallStatus({ state: 'reconnecting', message: '连接断开，正在重连...' })
            break
          case 'failed':
            setCallStatus({ state: 'error', message: '连接失败' })
            setCallTimerRunning(false)
            break
          case 'closed':
            setCallStatus({ state: 'ended', message: '通话已结束' })
            setCallTimerRunning(false)
            break
        }
      }

      /* ── ICE candidates ── */
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await sendSignal({
            type: 'ice-candidate',
            candidate: event.candidate.toJSON(),
            roomId: rid,
          })
        }
      }

      /* ── Create and send offer ── */
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      await sendSignal({ type: 'offer', sdp: offer.sdp, roomId: rid })

      /* ── Start polling for remote signals ── */
      startSignalingPolling(rid, pc)

      /* ── Show local preview in remote area for demo ── */
      if (remoteVideo) {
        /* In demo mode, show local preview as remote (mirror effect) */
        setTimeout(() => {
          setCallStatus({ state: 'connected', message: '已连接（演示模式）' })
          setCallTimerRunning(true)
        }, 2000)
      }

      return mediaStream
    } catch (err) {
      console.error('Failed to access camera:', err)
      setHasMediaError(true)
      setCallStatus({ state: 'error', message: '无法访问摄像头/麦克风' })
      return null
    }
  }, [createSignalRoom, sendSignal, startSignalingPolling])

  const pcRef = useRef<RTCPeerConnection | null>(null)

  const stopMedia = useCallback(() => {
    stopSignalingPolling()
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    setCallStatus({ state: 'ended', message: '通话已结束' })
    setCallTimerRunning(false)
  }, [stream, stopSignalingPolling])

  /* Toggle mute */
  const toggleMute = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => { track.enabled = isMuted })
      setIsMuted(!isMuted)
    }
  }, [stream, isMuted])

  /* Toggle camera */
  const toggleCamera = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => { track.enabled = isCameraOff })
      setIsCameraOff(!isCameraOff)
    }
  }, [stream, isCameraOff])

  /* Toggle screen share (mock) */
  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          if (localVideoRef.current && stream) {
            localVideoRef.current.srcObject = stream
          }
        }
        setIsScreenSharing(true)
      } catch {
        // User cancelled
      }
    } else {
      setIsScreenSharing(false)
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream
      }
    }
  }, [isScreenSharing, stream])

  /* ═══════════════════════════════════════════
     Interview Actions
     ═══════════════════════════════════════════ */
  const startInterview = async () => {
    await startMedia()
    setPhase('ongoing')
    setTimer(0)
    setIsTimerRunning(true)
    questionStartTimeRef.current = Date.now()
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        type: 'system',
        content: '面试开始！当前是第1个问题，请听题后作答。',
        timestamp: new Date(),
      },
    ])
  }

  const endInterview = () => {
    setIsTimerRunning(false)
    setPhase('ended')
    setCallStatus({ state: 'ended', message: '面试已结束' })
    setCallTimerRunning(false)
    stopMedia()
    // Calculate final scores based on records
    calculateFinalScores()
    // Save interview notes to backend
    try {
      apiClient.post('/interview/notes', {
        roomId,
        notes: interviewNotes,
        duration: callDuration,
        overallScore,
        records: interviewRecords,
      })
    } catch { /* local mode */ }
  }

  const nextQuestion = () => {
    const q = INTERVIEW_QUESTIONS[currentQuestionIdx]
    const duration = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)

    // Record current answer
    const record: InterviewRecord = {
      question: q.question,
      answer: `候选人回答了关于"${q.category}"的问题...`,
      duration,
      aiScore: Math.floor(Math.random() * 15) + 70, // Simulated score
    }
    setInterviewRecords((prev) => [...prev, record])
    setAnsweredIds((prev) => new Set(prev).add(q.id))

    // AI feedback
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        type: 'ai',
        content: `第${currentQuestionIdx + 1}题回答完毕。${record.aiScore >= 80 ? '回答很出色！' : record.aiScore >= 65 ? '回答不错，有提升空间。' : '建议多补充具体案例。'} 评分：${record.aiScore}分`,
        timestamp: new Date(),
      },
    ])

    // Move to next
    if (currentQuestionIdx < INTERVIEW_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIdx + 1
      setCurrentQuestionIdx(nextIdx)
      questionStartTimeRef.current = Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          type: 'system',
          content: `第${nextIdx + 1}题：${INTERVIEW_QUESTIONS[nextIdx].question}`,
          timestamp: new Date(),
        },
      ])
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
      { dimension: '专业技能', score: Math.min(25, Math.round(avg * 0.25)), maxScore: 25, feedback: avg >= 80 ? '专业知识扎实，回答深入' : avg >= 60 ? '具备一定的专业基础' : '需要加强专业知识储备' },
      { dimension: '沟通表达', score: Math.min(25, Math.round(avg * 0.24)), maxScore: 25, feedback: avg >= 80 ? '表达清晰流畅，逻辑性强' : avg >= 60 ? '表达较为清晰' : '建议加强表达能力训练' },
      { dimension: '逻辑思维', score: Math.min(25, Math.round(avg * 0.26)), maxScore: 25, feedback: avg >= 80 ? '思维缜密，分析全面' : avg >= 60 ? '逻辑较为清晰' : '需要提升逻辑思维能力' },
      { dimension: '应变能力', score: Math.min(25, Math.round(avg * 0.25)), maxScore: 25, feedback: avg >= 80 ? '应变能力强，反应迅速' : avg >= 60 ? '有一定的应变能力' : '建议多进行模拟练习' },
    ])
  }

  const handleSendMessage = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length, type: 'user', content: msg, timestamp: new Date() },
    ])
    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          type: 'ai',
          content: '收到您的反馈。继续加油，注意控制回答时间，保持自信！',
          timestamp: new Date(),
        },
      ])
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
    setCallStatus({ state: 'idle', message: '准备就绪' })
    setCallDuration(0)
    setCallTimerRunning(false)
    setInterviewNotes([])
    setNoteInput('')
    setNoteScore(5)
    setRoomId('')
    setAiScores([
      { dimension: '专业技能', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '沟通表达', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '逻辑思维', score: 0, maxScore: 25, feedback: '等待评估...' },
      { dimension: '应变能力', score: 0, maxScore: 25, feedback: '等待评估...' },
    ])
    setMessages([
      {
        id: 0,
        type: 'system',
        content: '欢迎来到AI视频面试！我会辅助您完成面试，提供实时建议和评分。',
        timestamp: new Date(),
      },
      {
        id: 1,
        type: 'ai',
        content: '请点击「开始面试」按钮启动摄像头并进入面试环节。',
        timestamp: new Date(),
      },
    ])
  }

  const currentQuestion = phase === 'ongoing' ? INTERVIEW_QUESTIONS[currentQuestionIdx] : null

  /* ═══════════════════════════════════════════
     Render: Preparing Phase
     ═══════════════════════════════════════════ */
  if (phase === 'preparing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-deep-brown to-black flex items-center justify-center p-4">
        <motion.div
          className="bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Video className="w-10 h-10 text-gold" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">AI 视频面试</h1>
            <p className="text-sm text-white/50">模拟真实面试场景，AI智能辅助评估</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Clock, title: '预计时长', desc: '15-20 分钟' },
              { icon: ClipboardList, title: '题目数量', desc: `${INTERVIEW_QUESTIONS.length} 道问题` },
              { icon: Brain, title: 'AI 评估', desc: '4 个维度' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <item.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="text-xs text-white/50 mt-1">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Interview Flow */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" /> 面试流程
            </h3>
            <div className="space-y-3">
              {[
                { step: '01', title: '启动摄像头', desc: '允许浏览器访问摄像头和麦克风' },
                { step: '02', title: '回答问题', desc: '共8道面试题，涵盖多个维度' },
                { step: '03', title: 'AI 实时辅助', desc: '语音识别、建议提示、时间提醒' },
                { step: '04', title: '生成报告', desc: '面试结束后获得详细评分报告' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 rounded-lg p-3 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="text-lg font-bold text-gold/50 w-8">{s.step}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{s.title}</div>
                    <div className="text-xs text-white/50">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Camera Preview */}
          <div className="mb-6">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video max-h-64">
              {hasMediaError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <VideoOff className="w-12 h-12 mb-2" />
                  <p className="text-sm">无法访问摄像头</p>
                  <p className="text-xs mt-1">请检查设备权限设置</p>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              {!stream && !hasMediaError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <Video className="w-10 h-10 text-white/30 mb-2" />
                  <p className="text-sm text-white/50">点击开始预览摄像头</p>
                  <Button
                    onClick={startMedia}
                    className="mt-3 bg-gold hover:bg-gold-dark text-deep-brown text-xs"
                    size="sm"
                  >
                    <Video className="w-4 h-4 mr-1" /> 开启预览
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={startInterview}
            className="w-full bg-gold hover:bg-gold-dark text-deep-brown font-bold py-6 text-base"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" /> 开始面试
          </Button>

          <p className="text-xs text-white/30 text-center mt-4">
            点击开始即表示您同意使用摄像头和麦克风进行面试录制
          </p>
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
                {phase === 'ongoing' ? `问题 ${currentQuestionIdx + 1}/${INTERVIEW_QUESTIONS.length}` : '已结束'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Status Indicator */}
          {phase === 'ongoing' && (
            <div className="flex items-center gap-2">
              <CallStatusBadge status={callStatus} />
              <CallDurationBadge duration={callDuration} />
              <InterviewTimer
                seconds={timer}
                isRunning={isTimerRunning}
                onToggle={() => setIsTimerRunning(!isTimerRunning)}
              />
            </div>
          )}

          {/* Floating AI Tip */}
          <AnimatePresence mode="wait">
            {phase === 'ongoing' && showTip && (
              <motion.div
                key={currentTip}
                className="hidden lg:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/10"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span className="text-xs text-white/70">{AI_TIPS[currentTip]}</span>
                <button onClick={() => setShowTip(false)} className="text-white/30 hover:text-white/60 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-gradient-to-b from-charcoal to-black">
          {/* Remote Video Placeholder (Interviewer) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Remote Video */}
              <video
                id="remote-video"
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Interviewer Avatar Placeholder Overlay - hides when connected */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-charcoal via-deep-brown to-black z-10 transition-opacity duration-500 ${callStatus.state === 'connected' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                id="interviewer-overlay"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <User className="w-12 h-12 text-gold/70" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">AI 面试官</h3>
                <p className="text-sm text-white/40 mb-4">KhmerCareer 智能面试系统</p>

                {/* Simulated Interviewer Status */}
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/60">在线</span>
                </div>

                {/* Call Status Overlay */}
                {callStatus.state !== 'connected' && callStatus.state !== 'idle' && (
                  <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2 flex items-center gap-2">
                    {callStatus.state === 'connecting' && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                    {callStatus.state === 'error' && <WifiOff className="w-3.5 h-3.5 text-red-400" />}
                    <span className="text-xs text-white/80">{callStatus.message}</span>
                  </div>
                )}

                {/* Current Question Display on Main Screen */}
                {currentQuestion && (
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-xl px-6 py-4 max-w-xl w-[90%] border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentQuestion.id}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquareText className="w-4 h-4 text-gold" />
                      <span className="text-xs text-gold font-medium">{currentQuestion.category}</span>
                      <span className="text-xs text-white/30 ml-auto">
                        {currentQuestionIdx + 1} / {INTERVIEW_QUESTIONS.length}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{currentQuestion.question}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <motion.div
            className="absolute bottom-20 right-4 w-48 h-36 sm:w-56 sm:h-40 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          >
            {isCameraOff || hasMediaError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal">
                <VideoOff className="w-8 h-8 text-white/30 mb-1" />
                <span className="text-xs text-white/40">摄像头已关闭</span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            {/* Local label */}
            <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-0.5">
              <span className="text-xs text-white/70">我</span>
            </div>
            {isMuted && (
              <div className="absolute top-2 right-2 bg-red-500/80 rounded-full p-1">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>

          {/* Next Question Button (when ongoing) */}
          {phase === 'ongoing' && (
            <motion.button
              className="absolute top-4 right-4 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors backdrop-blur-md"
              onClick={nextQuestion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentQuestionIdx < INTERVIEW_QUESTIONS.length - 1 ? (
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
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sidebar Tabs */}
              <div className="flex items-center border-b border-white/10">
                {([
                  { key: 'ai', icon: Brain, label: 'AI助手' },
                  { key: 'questions', icon: ClipboardList, label: '题目' },
                  { key: 'score', icon: BarChart3, label: '评分' },
                  { key: 'notes', icon: StickyNote, label: '笔记' },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSidebarTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                      sidebarTab === tab.key
                        ? 'text-gold border-gold bg-gold/5'
                        : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {sidebarTab === 'ai' && (
                  <AIAssistantPanel
                    currentQuestion={currentQuestion}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isTranscribing={isTranscribing}
                  />
                )}
                {sidebarTab === 'questions' && (
                  <QuestionsPanel
                    questions={INTERVIEW_QUESTIONS}
                    currentIndex={currentQuestionIdx}
                    onSelect={(idx) => {
                      setCurrentQuestionIdx(idx)
                      questionStartTimeRef.current = Date.now()
                    }}
                    answeredIds={answeredIds}
                  />
                )}
                {sidebarTab === 'score' && (
                  <ScorePanel
                    scores={aiScores}
                    overallScore={overallScore}
                    interviewRecords={interviewRecords}
                  />
                )}
                {sidebarTab === 'notes' && (
                  <div className="flex flex-col h-full">
                    <InterviewNotesPanel notes={interviewNotes} onDelete={deleteNote} />
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <textarea
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        placeholder="添加面试笔记..."
                        rows={2}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-gold/50 resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-gold" />
                          <input
                            type="number" min={1} max={10} value={noteScore}
                            onChange={e => setNoteScore(Math.min(10, Math.max(1, Number(e.target.value))))}
                            className="w-12 bg-white/10 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-center"
                          />
                        </div>
                        <button
                          onClick={saveNote}
                          disabled={!noteInput.trim()}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-colors disabled:opacity-30 text-xs"
                        >
                          <NotebookPen className="w-3 h-3" /> 保存笔记
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Bottom Control Bar ═══ */}
      <div className="bg-charcoal/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left: Toggle Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          {/* Center: Media Controls */}
          <div className="flex items-center gap-3">
            {/* Mute */}
            <motion.button
              onClick={toggleMute}
              className={`p-3.5 rounded-full transition-colors ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            {/* Camera */}
            <motion.button
              onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-colors ${
                isCameraOff
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </motion.button>

            {/* Screen Share */}
            <motion.button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-full transition-colors ${
                isScreenSharing
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isScreenSharing ? <MonitorUp className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
            </motion.button>

            {/* End Call */}
            <motion.button
              onClick={endInterview}
              className="p-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Right: Extra Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSpeakerOff(!isSpeakerOff)}
              className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              {isSpeakerOff ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
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
            onClose={() => { restartInterview(); window.location.href = '/interview' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
