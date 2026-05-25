import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAIAgent } from '@/stores/AIAgentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Bot,
  FileText,
  UserCheck,
  Video,
  Megaphone,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Terminal,
  TrendingUp,
  BarChart3,
  Sparkles,
  Settings,
  Plus,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AgentStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error'

export type AgentType = 'jd' | 'resume' | 'interview' | 'promo'

export interface HubAgentLog {
  id: string
  agentId: AgentType
  message: string
  level: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

export interface AgentDef {
  id: AgentType
  nameKey: string
  descKey: string
  icon: React.ElementType
  steps: string[]
  color: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AGENTS: AgentDef[] = [
  {
    id: 'jd',
    nameKey: 'agentHub.jd.name',
    descKey: 'agentHub.jd.desc',
    icon: FileText,
    color: '#D4AF37',
    steps: [
      'step.analyzeReq',
      'step.generateJD',
      'step.optimizeSEO',
      'step.publishMulti',
      'step.confirm',
    ],
  },
  {
    id: 'resume',
    nameKey: 'agentHub.resume.name',
    descKey: 'agentHub.resume.desc',
    icon: UserCheck,
    color: '#10B981',
    steps: [
      'step.receiveResume',
      'step.aiParse',
      'step.scoreMatch',
      'step.filterRank',
      'step.notifyCandidate',
    ],
  },
  {
    id: 'interview',
    nameKey: 'agentHub.interview.name',
    descKey: 'agentHub.interview.desc',
    icon: Video,
    color: '#3B82F6',
    steps: [
      'step.scheduleAuto',
      'step.sendInvite',
      'step.aiInterview',
      'step.scoreReport',
      'step.notifyResult',
    ],
  },
  {
    id: 'promo',
    nameKey: 'agentHub.promo.name',
    descKey: 'agentHub.promo.desc',
    icon: Megaphone,
    color: '#F59E0B',
    steps: [
      'step.genContent',
      'step.designVisual',
      'step.createVideo',
      'step.publishChannels',
      'step.trackData',
    ],
  },
]

const STATUS_CONFIG: Record<
  AgentStatus,
  { labelKey: string; color: string; bg: string; Icon: React.ElementType }
> = {
  idle: {
    labelKey: 'status.idle',
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    Icon: Clock,
  },
  running: {
    labelKey: 'status.running',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    Icon: Activity,
  },
  paused: {
    labelKey: 'status.paused',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    Icon: Pause,
  },
  completed: {
    labelKey: 'status.completed',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    Icon: CheckCircle2,
  },
  error: {
    labelKey: 'status.error',
    color: 'text-red-600',
    bg: 'bg-red-50',
    Icon: AlertCircle,
  },
}

/* ------------------------------------------------------------------ */
/*  AgentCard Component                                                */
/* ------------------------------------------------------------------ */

function AgentCard({
  agent,
  status,
  progress,
  currentStep,
  onStart,
  onPause,
  onStop,
  onReset,
  isAnyRunning,
}: {
  agent: AgentDef
  status: AgentStatus
  progress: number
  currentStep: number
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onReset: () => void
  isAnyRunning: boolean
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const Icon = agent.icon
  const cfg = STATUS_CONFIG[status]
  const StatusIcon = cfg.Icon

  const statusText: Record<AgentStatus, string> = {
    idle: t('status.idle'),
    running: t('status.running'),
    paused: t('status.paused'),
    completed: t('status.completed'),
    error: t('status.error'),
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-2 border-transparent hover:border-[#D4AF37]/30 transition-all duration-300 shadow-sm hover:shadow-lg">
        {/* Status strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            backgroundColor:
              status === 'running'
                ? '#10B981'
                : status === 'paused'
                ? '#F59E0B'
                : status === 'completed'
                ? '#3B82F6'
                : status === 'error'
                ? '#EF4444'
                : '#E5E7EB',
          }}
        />

        <CardHeader className="pb-3 pt-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: agent.color }}
              >
                <Icon size={22} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  {t(agent.nameKey)}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t(agent.descKey)}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`${cfg.color} ${cfg.bg} border-0 text-xs font-medium px-2.5 py-1 flex items-center gap-1`}
            >
              <StatusIcon size={12} />
              {statusText[status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {status === 'running' && currentStep < agent.steps.length
                  ? t(agent.steps[currentStep])
                  : status === 'completed'
                  ? t('allStepsDone')
                  : t('ready')}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-gray-100"
            />
          </div>

          {/* Step indicators */}
          <div className="flex gap-1.5">
            {agent.steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx < currentStep
                    ? 'bg-[#D4AF37]'
                    : idx === currentStep && status === 'running'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pt-1">
            {status === 'idle' || status === 'error' ? (
              <Button
                size="sm"
                onClick={onStart}
                disabled={isAnyRunning}
                className="bg-[#D4AF37] hover:bg-[#B8962E] text-white text-xs h-8 px-4"
              >
                <Play size={14} className="mr-1" />
                {t('start')}
              </Button>
            ) : status === 'running' ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onPause}
                  className="text-amber-600 border-amber-200 hover:bg-amber-50 text-xs h-8 px-3"
                >
                  <Pause size={14} className="mr-1" />
                  {t('pause')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onStop}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8 px-3"
                >
                  <Square size={14} className="mr-1" />
                  {t('stop')}
                </Button>
              </>
            ) : status === 'paused' ? (
              <>
                <Button
                  size="sm"
                  onClick={onStart}
                  className="bg-[#D4AF37] hover:bg-[#B8962E] text-white text-xs h-8 px-4"
                >
                  <Play size={14} className="mr-1" />
                  {t('resume')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onStop}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8 px-3"
                >
                  <Square size={14} className="mr-1" />
                  {t('stop')}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
                className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs h-8 px-3"
              >
                <RotateCcw size={14} className="mr-1" />
                {t('reset')}
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          {/* Expanded step list */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 space-y-2 border-t border-gray-100 mt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('workflowSteps')}
                  </p>
                  {agent.steps.map((stepKey, idx) => {
                    const done = idx < currentStep
                    const active = idx === currentStep && status === 'running'
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs ${
                          done
                            ? 'text-[#D4AF37]'
                            : active
                            ? 'text-emerald-600 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 size={14} />
                        ) : active ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: 'linear',
                            }}
                          >
                            <Zap size={14} />
                          </motion.div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        {t(stepKey)}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  LogPanel Component                                                 */
/* ------------------------------------------------------------------ */

function LogPanel({ logs }: { logs: AgentLog[] }) {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const levelColors: Record<string, string> = {
    info: 'text-blue-600 bg-blue-50',
    success: 'text-emerald-600 bg-emerald-50',
    warning: 'text-amber-600 bg-amber-50',
    error: 'text-red-600 bg-red-50',
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[#D4AF37]" />
          <CardTitle className="text-sm font-bold text-gray-900">
            {t('executionLog')}
          </CardTitle>
          <Badge variant="outline" className="ml-auto text-xs font-normal">
            {logs.length} {t('entries')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={scrollRef}
          className="h-72 overflow-y-auto rounded-lg bg-gray-950 p-3 space-y-1.5 font-mono text-xs"
        >
          {logs.length === 0 && (
            <div className="text-gray-600 text-center py-8 italic">
              {t('noLogsYet')}
            </div>
          )}
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2"
              >
                <span className="text-gray-600 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <Badge
                  variant="secondary"
                  className={`${levelColors[log.level]} border-0 text-[10px] px-1.5 py-0 shrink-0`}
                >
                  {t(`logLevel.${log.level}`)}
                </Badge>
                <span
                  className={`${
                    log.level === 'error'
                      ? 'text-red-400'
                      : log.level === 'success'
                      ? 'text-emerald-400'
                      : 'text-gray-300'
                  }`}
                >
                  [{t(`agent.${log.agentId}`)}] {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  StatsPanel Component                                               */
/* ------------------------------------------------------------------ */

function StatsPanel() {
  const { t } = useTranslation()
  const { agents } = useAIAgent()
  const stats = {
    totalRuns: agents.filter((a: any) => a.status === 'running' || a.status === 'completed').length,
    successCount: agents.filter((a: any) => a.status === 'completed').length,
    failCount: agents.filter((a: any) => a.status === 'error').length,
    avgTime: agents.length > 0 ? Math.round(agents.reduce((s: number, a: any) => s + a.progress, 0) / agents.length) : 0
  }

  const items = [
    { label: t('totalRuns'), value: stats.totalRuns, icon: TrendingUp, color: '#D4AF37' },
    { label: t('successCount'), value: stats.successCount, icon: CheckCircle2, color: '#10B981' },
    { label: t('failCount'), value: stats.failCount, icon: AlertCircle, color: '#EF4444' },
    { label: t('avgTime'), value: `${stats.avgTime}s`, icon: Clock, color: '#3B82F6' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ y: -2 }}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon size={16} style={{ color: item.color }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{item.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIAgentHub() {
  const { t } = useTranslation()
  const {
    logs,
    stats,
    startAgent,
    pauseAgent,
    stopAgent,
    resetAgent,
    startAll,
    pauseAll,
    stopAll,
    resetAll,
  } = useAIAgent()

  const [activeTab, setActiveTab] = useState('agents')
  const isAnyRunning = Object.values(agents).some((a: any) => a.status === 'running')
  const isAllIdle = Object.values(agents).every(
    (a: any) => a.status === 'idle' || a.status === 'error'
  )

  /* Refresh stats from localStorage on mount */
  useEffect(() => {
    // loadFromStorage handled by Provider
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ========== Hero ========== */}
      <section className="relative bg-charcoal text-white overflow-hidden">
        {/* Gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#D4AF37]/20"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-5">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-medium">
                {t('agentHub.badge')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent">
                {t('agentHub.title')}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('agentHub.subtitle')}
            </p>
          </motion.div>

          {/* Global Controls */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <Button
              onClick={startAll}
              disabled={!isAllIdle}
              className="bg-[#D4AF37] hover:bg-[#B8962E] text-white h-10 px-6"
            >
              <Play size={16} className="mr-2" />
              {t('startAll')}
            </Button>
            <Button
              onClick={pauseAll}
              variant="outline"
              disabled={!isAnyRunning}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 h-10 px-5"
            >
              <Pause size={16} className="mr-2" />
              {t('pauseAll')}
            </Button>
            <Button
              onClick={stopAll}
              variant="outline"
              disabled={!isAnyRunning}
              className="border-red-300 text-red-700 hover:bg-red-50 h-10 px-5"
            >
              <Square size={16} className="mr-2" />
              {t('stopAll')}
            </Button>
            <Button
              onClick={resetAll}
              variant="outline"
              disabled={isAnyRunning}
              className="border-gray-500 text-gray-300 hover:bg-gray-800 h-10 px-5"
            >
              <RotateCcw size={16} className="mr-2" />
              {t('resetAll')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ========== Main Content ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <StatsPanel />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="agents" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs">
              <Bot size={14} className="mr-1.5" />
              {t('tab.agents')}
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs">
              <Terminal size={14} className="mr-1.5" />
              {t('tab.logs')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs">
              <BarChart3 size={14} className="mr-1.5" />
              {t('tab.analytics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AGENTS.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  status={agents[agent.id]?.status ?? 'idle'}
                  progress={agents[agent.id]?.progress ?? 0}
                  currentStep={agents[agent.id]?.currentStep ?? 0}
                  onStart={() => startAgent(agent.id)}
                  onPause={() => pauseAgent(agent.id)}
                  onStop={() => stopAgent(agent.id)}
                  onReset={() => resetAgent(agent.id)}
                  isAnyRunning={isAnyRunning}
                />
              ))}
            </div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-[#D4AF37]/10 to-amber-50 rounded-xl p-5 border border-[#D4AF37]/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t('agentHub.tipsTitle')}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {t('agentHub.tipsDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <LogPanel logs={logs} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  AnalyticsPanel Component                                           */
/* ------------------------------------------------------------------ */

function AnalyticsPanel() {
  const { t } = useTranslation()
  const { agents, stats } = useAIAgent()

  const agentList = [
    { id: 'jd' as AgentType, name: t('agentHub.jd.name'), color: '#D4AF37' },
    { id: 'resume' as AgentType, name: t('agentHub.resume.name'), color: '#10B981' },
    { id: 'interview' as AgentType, name: t('agentHub.interview.name'), color: '#3B82F6' },
    { id: 'promo' as AgentType, name: t('agentHub.promo.name'), color: '#F59E0B' },
  ]

  return (
    <div className="space-y-5">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Activity size={16} className="text-[#D4AF37]" />
            {t('agentStatusOverview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentList.map((ag) => {
              const st = agents[ag.id]?.status ?? 'idle'
              const prog = agents[ag.id]?.progress ?? 0
              const cfg = (STATUS_CONFIG as any)[st]
              const CIcon = cfg.Icon
              return (
                <div key={ag.id} className="flex items-center gap-4">
                  <div className="w-28 text-xs font-medium text-gray-700 truncate">
                    {ag.name}
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: ag.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${prog}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${cfg.color} ${cfg.bg} border-0 text-[10px] px-2 py-0.5 flex items-center gap-1 shrink-0`}
                  >
                    <CIcon size={10} />
                    {t(cfg.labelKey)}
                  </Badge>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {prog}%
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-gray-200 text-center py-6">
          <div className="text-3xl font-extrabold text-[#D4AF37]">
            {stats.totalRuns}
          </div>
          <div className="text-xs text-gray-500 mt-1">{t('totalRuns')}</div>
        </Card>
        <Card className="border border-gray-200 text-center py-6">
          <div className="text-3xl font-extrabold text-emerald-600">
            {stats.successRate}%
          </div>
          <div className="text-xs text-gray-500 mt-1">{t('successRate')}</div>
        </Card>
        <Card className="border border-gray-200 text-center py-6">
          <div className="text-3xl font-extrabold text-blue-600">
            {stats.avgTime}s
          </div>
          <div className="text-xs text-gray-500 mt-1">{t('avgDuration')}</div>
        </Card>
      </div>
    </div>
  )
}
