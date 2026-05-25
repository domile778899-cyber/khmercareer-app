import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAIAgent } from '@/stores/AIAgentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GitBranch,
  Play,
  Pause,
  Square,
  Plus,
  Trash2,
  Copy,
  Zap,
  MousePointerClick,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Workflow,
  Layers,
  Save,
  Download,
  ChevronRight,
  Timer,
  Settings2,
  GripVertical,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type NodeType = 'trigger' | 'ai-process' | 'condition' | 'action' | 'end'

export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  x: number
  y: number
  config?: Record<string, string>
  status?: 'pending' | 'running' | 'completed' | 'error'
}

export interface WorkflowEdge {
  id: string
  from: string
  to: string
  label?: string
}

export interface WorkflowTemplate {
  id: string
  nameKey: string
  descKey: string
  icon: React.ElementType
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  status: 'draft' | 'running' | 'paused' | 'completed'
  createdAt: Date
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NODE_COLORS: Record<NodeType, { bg: string; border: string; icon: React.ElementType }> = {
  trigger:   { bg: '#FEF3C7', border: '#F59E0B', icon: MousePointerClick },
  'ai-process': { bg: '#DBEAFE', border: '#3B82F6', icon: BrainCircuit },
  condition: { bg: '#F3E8FF', border: '#A855F7', icon: GitBranch },
  action:    { bg: '#D1FAE5', border: '#10B981', icon: Zap },
  end:       { bg: '#FEE2E2', border: '#EF4444', icon: CheckCircle2 },
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'full-recruit',
    nameKey: 'workflow.tmplFullRecruit',
    descKey: 'workflow.tmplFullRecruitDesc',
    icon: Workflow,
    nodes: [
      { id: 't1', type: 'trigger',   label: '触发器: 新职位需求', x: 60,  y: 50, status: 'pending' },
      { id: 'a1', type: 'ai-process', label: 'AI: 生成职位描述', x: 60,  y: 150, status: 'pending' },
      { id: 'c1', type: 'condition', label: '条件: JD审核通过?', x: 60,  y: 250, status: 'pending' },
      { id: 'a2', type: 'action',    label: '动作: 发布到多平台', x: 200, y: 350, status: 'pending' },
      { id: 'a3', type: 'ai-process', label: 'AI: 筛选简历',     x: 200, y: 450, status: 'pending' },
      { id: 'c2', type: 'condition', label: '条件: 匹配度>80?',  x: 200, y: 550, status: 'pending' },
      { id: 'a4', type: 'action',    label: '动作: 发送面试邀请', x: 340, y: 650, status: 'pending' },
      { id: 'e1', type: 'end',       label: '结束: 入职完成',    x: 340, y: 750, status: 'pending' },
    ],
    edges: [
      { id: 'e1', from: 't1', to: 'a1' },
      { id: 'e2', from: 'a1', to: 'c1' },
      { id: 'e3', from: 'c1', to: 'a2', label: '是' },
      { id: 'e4', from: 'a2', to: 'a3' },
      { id: 'e5', from: 'a3', to: 'c2' },
      { id: 'e6', from: 'c2', to: 'a4', label: '是' },
      { id: 'e7', from: 'a4', to: 'e1' },
    ],
  },
  {
    id: 'resume-filter',
    nameKey: 'workflow.tmplResumeFilter',
    descKey: 'workflow.tmplResumeFilterDesc',
    icon: Layers,
    nodes: [
      { id: 't1', type: 'trigger',   label: '触发器: 收到新简历', x: 60, y: 50, status: 'pending' },
      { id: 'a1', type: 'ai-process', label: 'AI: 解析简历信息', x: 60, y: 150, status: 'pending' },
      { id: 'a2', type: 'ai-process', label: 'AI: 技能匹配评分', x: 60, y: 250, status: 'pending' },
      { id: 'c1', type: 'condition', label: '条件: 评分>75?',   x: 60, y: 350, status: 'pending' },
      { id: 'a3', type: 'action',    label: '动作: 通知HR',     x: 200, y: 450, status: 'pending', config: { channel: 'email' } },
      { id: 'a4', type: 'action',    label: '动作: 发送拒信',   x: 20, y: 450, status: 'pending', config: { channel: 'email' } },
      { id: 'e1', type: 'end',       label: '结束',            x: 200, y: 550, status: 'pending' },
    ],
    edges: [
      { id: 'e1', from: 't1', to: 'a1' },
      { id: 'e2', from: 'a1', to: 'a2' },
      { id: 'e3', from: 'a2', to: 'c1' },
      { id: 'e4', from: 'c1', to: 'a3', label: '是' },
      { id: 'e5', from: 'c1', to: 'a4', label: '否' },
      { id: 'e6', from: 'a3', to: 'e1' },
      { id: 'e7', from: 'a4', to: 'e1' },
    ],
  },
  {
    id: 'interview-schedule',
    nameKey: 'workflow.tmplInterview',
    descKey: 'workflow.tmplInterviewDesc',
    icon: Timer,
    nodes: [
      { id: 't1', type: 'trigger',   label: '触发器: 候选人通过初筛', x: 60, y: 50, status: 'pending' },
      { id: 'a1', type: 'ai-process', label: 'AI: 智能排期',       x: 60, y: 150, status: 'pending' },
      { id: 'a2', type: 'action',    label: '动作: 发送面试邀请',   x: 60, y: 250, status: 'pending' },
      { id: 'c1', type: 'condition', label: '条件: 候选人确认?',    x: 60, y: 350, status: 'pending' },
      { id: 'a3', type: 'ai-process', label: 'AI: 进行AI面试',     x: 200, y: 450, status: 'pending' },
      { id: 'a4', type: 'ai-process', label: 'AI: 生成评分报告',   x: 200, y: 550, status: 'pending' },
      { id: 'e1', type: 'end',       label: '结束',              x: 200, y: 650, status: 'pending' },
    ],
    edges: [
      { id: 'e1', from: 't1', to: 'a1' },
      { id: 'e2', from: 'a1', to: 'a2' },
      { id: 'e3', from: 'a2', to: 'c1' },
      { id: 'e4', from: 'c1', to: 'a3', label: '确认' },
      { id: 'e5', from: 'a3', to: 'a4' },
      { id: 'e6', from: 'a4', to: 'e1' },
    ],
  },
  {
    id: 'promo-publish',
    nameKey: 'workflow.tmplPromo',
    descKey: 'workflow.tmplPromoDesc',
    icon: Zap,
    nodes: [
      { id: 't1', type: 'trigger',   label: '触发器: 新职位发布',   x: 60, y: 50, status: 'pending' },
      { id: 'a1', type: 'ai-process', label: 'AI: 生成推广文案',    x: 60, y: 150, status: 'pending' },
      { id: 'a2', type: 'ai-process', label: 'AI: 生成短视频脚本',  x: 60, y: 250, status: 'pending' },
      { id: 'a3', type: 'ai-process', label: 'AI: 生成配图提示词',  x: 60, y: 350, status: 'pending' },
      { id: 'a4', type: 'action',    label: '动作: 发布到TikTok',  x: 200, y: 450, status: 'pending' },
      { id: 'a5', type: 'action',    label: '动作: 发布到Facebook', x: 200, y: 530, status: 'pending' },
      { id: 'a6', type: 'action',    label: '动作: 发布到Telegram', x: 200, y: 610, status: 'pending' },
      { id: 'e1', type: 'end',       label: '结束',              x: 200, y: 700, status: 'pending' },
    ],
    edges: [
      { id: 'e1', from: 't1', to: 'a1' },
      { id: 'e2', from: 'a1', to: 'a2' },
      { id: 'e3', from: 'a2', to: 'a3' },
      { id: 'e4', from: 'a3', to: 'a4' },
      { id: 'e5', from: 'a4', to: 'a5' },
      { id: 'e6', from: 'a5', to: 'a6' },
      { id: 'e7', from: 'a6', to: 'e1' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  WorkflowCanvas Component                                           */
/* ------------------------------------------------------------------ */

function WorkflowCanvas({
  workflow,
  onNodeClick,
  selectedNodeId,
}: {
  workflow: Workflow
  onNodeClick: (node: WorkflowNode) => void
  selectedNodeId: string | null
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  const getNodePos = (nodeId: string) => {
    const n = workflow.nodes.find((nd) => nd.id === nodeId)
    return n ? { x: n.x + 64, y: n.y + 28 } : { x: 0, y: 0 }
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, #D4AF37 0.8px, transparent 0.8px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* SVG edges */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
          </marker>
        </defs>
        {workflow.edges.map((edge) => {
          const from = getNodePos(edge.from)
          const to = getNodePos(edge.to)
          return (
            <g key={edge.id}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#D1D5DB"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <g>
                  <rect
                    x={(from.x + to.x) / 2 - 14}
                    y={(from.y + to.y) / 2 - 10}
                    width={28}
                    height={18}
                    rx={4}
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth={1}
                  />
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 + 3}
                    textAnchor="middle"
                    className="text-[10px] fill-gray-500"
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {workflow.nodes.map((node) => {
        const colors = NODE_COLORS[node.type]
        const Icon = colors.icon
        const isSelected = selectedNodeId === node.id
        const isRunning = node.status === 'running'

        return (
          <motion.div
            key={node.id}
            className="absolute z-20 cursor-pointer"
            style={{ left: node.x, top: node.y }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNodeClick(node)}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 shadow-sm min-w-[140px] transition-all ${
                isSelected
                  ? 'ring-2 ring-[#D4AF37] ring-offset-2'
                  : ''
              } ${isRunning ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: colors.bg,
                borderColor: isSelected ? '#D4AF37' : colors.border,
              }}
            >
              <Icon size={16} style={{ color: colors.border }} />
              <span className="text-xs font-medium text-gray-800 truncate">
                {node.label}
              </span>
              {node.status === 'completed' && (
                <CheckCircle2 size={14} className="text-emerald-500 ml-auto shrink-0" />
              )}
              {node.status === 'error' && (
                <XCircle size={14} className="text-red-500 ml-auto shrink-0" />
              )}
              {node.status === 'running' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-emerald-400 ml-auto shrink-0"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  NodePanel Component                                                */
/* ------------------------------------------------------------------ */

function NodePanel({
  node,
  onUpdate,
  onDelete,
}: {
  node: WorkflowNode
  onUpdate: (id: string, updates: Partial<WorkflowNode>) => void
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()
  const colors = NODE_COLORS[node.type]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <colors.icon size={16} style={{ color: colors.border }} />
            </div>
            <CardTitle className="text-sm font-bold">{node.label}</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(node.id)}
            className="text-red-400 hover:text-red-600 h-8 w-8 p-0"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">
            {t('nodeLabel')}
          </label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
          />
        </div>
        {node.config && (
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              {t('nodeConfig')}
            </label>
            <textarea
              value={JSON.stringify(node.config, null, 2)}
              onChange={(e) => {
                try {
                  const cfg = JSON.parse(e.target.value)
                  onUpdate(node.id, { config: cfg })
                } catch {
                  /* ignore invalid JSON */
                }
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono h-20 resize-none"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">
            {t('nodeStatus')}
          </label>
          <Badge
            variant="secondary"
            className={`text-[10px] ${
              node.status === 'running'
                ? 'text-emerald-600 bg-emerald-50'
                : node.status === 'completed'
                ? 'text-blue-600 bg-blue-50'
                : node.status === 'error'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-500 bg-gray-100'
            }`}
          >
            {t(`status.${node.status ?? 'pending'}`)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIAgentWorkflow() {
  const { t } = useTranslation()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('designer')

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId)
  const selectedNode = activeWorkflow?.nodes.find((n) => n.id === selectedNodeId)

  const loadTemplate = useCallback((tmpl: WorkflowTemplate) => {
    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: t(tmpl.nameKey),
      nodes: tmpl.nodes.map((n) => ({ ...n })),
      edges: tmpl.edges.map((e) => ({ ...e })),
      status: 'draft',
      createdAt: new Date(),
    }
    setWorkflows((prev) => [...prev, newWf])
    setActiveWorkflowId(newWf.id)
    setActiveTab('designer')
  }, [t])

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      if (!activeWorkflowId) return
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === activeWorkflowId
            ? {
                ...w,
                nodes: w.nodes.map((n) =>
                  n.id === nodeId ? { ...n, ...updates } : n
                ),
              }
            : w
        )
      )
    },
    [activeWorkflowId]
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (!activeWorkflowId) return
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === activeWorkflowId
            ? {
                ...w,
                nodes: w.nodes.filter((n) => n.id !== nodeId),
                edges: w.edges.filter(
                  (e) => e.from !== nodeId && e.to !== nodeId
                ),
              }
            : w
        )
      )
      setSelectedNodeId(null)
    },
    [activeWorkflowId]
  )

  const runWorkflow = useCallback(() => {
    if (!activeWorkflowId) return
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === activeWorkflowId ? { ...w, status: 'running' as const } : w
      )
    )

    /* Simulate step execution */
    const wf = workflows.find((w) => w.id === activeWorkflowId)
    if (!wf) return

    wf.nodes.forEach((node, idx) => {
      setTimeout(() => {
        setWorkflows((prev) =>
          prev.map((w) =>
            w.id === activeWorkflowId
              ? {
                  ...w,
                  nodes: w.nodes.map((n) =>
                    n.id === node.id ? { ...n, status: 'running' as const } : n
                  ),
                }
              : w
          )
        )

        setTimeout(() => {
          setWorkflows((prev) =>
            prev.map((w) =>
              w.id === activeWorkflowId
                ? {
                    ...w,
                    nodes: w.nodes.map((n) =>
                      n.id === node.id
                        ? {
                            ...n,
                            status:
                              Math.random() > 0.1
                                ? ('completed' as const)
                                : ('error' as const),
                          }
                        : n
                    ),
                  }
                : w
            )
          )
        }, 800)
      }, idx * 1200)
    })

    setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === activeWorkflowId
            ? { ...w, status: 'completed' as const }
            : w
        )
      )
    }, wf.nodes.length * 1200 + 1000)
  }, [activeWorkflowId, workflows])

  const pauseWorkflow = useCallback(() => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === activeWorkflowId ? { ...w, status: 'paused' as const } : w
      )
    )
  }, [activeWorkflowId])

  const stopWorkflow = useCallback(() => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === activeWorkflowId ? { ...w, status: 'draft' as const } : w
      )
    )
  }, [activeWorkflowId])

  const duplicateWorkflow = useCallback(() => {
    if (!activeWorkflow) return
    const copy: Workflow = {
      ...activeWorkflow,
      id: `wf-${Date.now()}`,
      name: `${activeWorkflow.name} ${t('copy')}`,
      status: 'draft',
      nodes: activeWorkflow.nodes.map((n) => ({
        ...n,
        status: 'pending' as const,
      })),
      createdAt: new Date(),
    }
    setWorkflows((prev) => [...prev, copy])
    setActiveWorkflowId(copy.id)
  }, [activeWorkflow, t])

  /* Load a default template on first mount */
  useEffect(() => {
    if (workflows.length === 0) {
      loadTemplate(TEMPLATES[0])
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
              <Workflow size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{t('workflow.title')}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {t('workflow.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 shadow-sm mb-6">
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <Layers size={14} className="mr-1.5" />
              {t('tab.templates')}
            </TabsTrigger>
            <TabsTrigger
              value="designer"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <Workflow size={14} className="mr-1.5" />
              {t('tab.designer')}
            </TabsTrigger>
            <TabsTrigger
              value="workflows"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white text-xs"
            >
              <Save size={14} className="mr-1.5" />
              {t('tab.workflows')}
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {TEMPLATES.map((tmpl) => (
                <motion.div
                  key={tmpl.id}
                  whileHover={{ y: -3 }}
                  className="cursor-pointer"
                  onClick={() => loadTemplate(tmpl)}
                >
                  <Card className="border-2 border-transparent hover:border-[#D4AF37]/40 transition-all shadow-sm hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                          <tmpl.icon size={24} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm">
                            {t(tmpl.nameKey)}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {t(tmpl.descKey)}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-[10px]">
                              {tmpl.nodes.length} {t('nodes')}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {tmpl.edges.length} {t('connections')}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-300 shrink-0 mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Designer Tab */}
          <TabsContent value="designer">
            {activeWorkflow && (
              <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900 text-sm">
                      {activeWorkflow.name}
                    </h2>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        activeWorkflow.status === 'running'
                          ? 'text-emerald-600 bg-emerald-50'
                          : activeWorkflow.status === 'paused'
                          ? 'text-amber-600 bg-amber-50'
                          : activeWorkflow.status === 'completed'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-500 bg-gray-100'
                      }`}
                    >
                      {t(`status.${activeWorkflow.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={runWorkflow}
                      disabled={activeWorkflow.status === 'running'}
                      className="bg-[#D4AF37] hover:bg-[#B8962E] text-white h-8 text-xs px-4"
                    >
                      <Play size={14} className="mr-1.5" />
                      {t('run')}
                    </Button>
                    {activeWorkflow.status === 'running' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={pauseWorkflow}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 h-8 text-xs px-3"
                      >
                        <Pause size={14} className="mr-1.5" />
                        {t('pause')}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={stopWorkflow}
                      disabled={activeWorkflow.status === 'draft'}
                      className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs px-3"
                    >
                      <Square size={14} className="mr-1.5" />
                      {t('stop')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={duplicateWorkflow}
                      className="text-gray-600 border-gray-200 hover:bg-gray-50 h-8 text-xs px-3"
                    >
                      <Copy size={14} className="mr-1.5" />
                      {t('duplicate')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Canvas */}
                  <div className="lg:col-span-2">
                    <WorkflowCanvas
                      workflow={activeWorkflow}
                      onNodeClick={(node) => setSelectedNodeId(node.id)}
                      selectedNodeId={selectedNodeId}
                    />
                  </div>

                  {/* Properties Panel */}
                  <div className="space-y-4">
                    {selectedNode ? (
                      <NodePanel
                        key={selectedNode.id}
                        node={selectedNode}
                        onUpdate={updateNode}
                        onDelete={deleteNode}
                      />
                    ) : (
                      <Card className="border border-gray-200 border-dashed">
                        <CardContent className="py-12 text-center">
                          <Settings2
                            size={32}
                            className="text-gray-300 mx-auto mb-3"
                          />
                          <p className="text-sm text-gray-500">
                            {t('selectNodeHint')}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Node Palette */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold flex items-center gap-2">
                          <Plus size={14} className="text-[#D4AF37]" />
                          {t('nodePalette')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(
                          Object.keys(NODE_COLORS) as NodeType[]
                        ).map((type) => {
                          const c = NODE_COLORS[type]
                          const I = c.icon
                          return (
                            <div
                              key={type}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-grab transition-colors border border-transparent hover:border-gray-200"
                            >
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: c.bg }}
                              >
                                <I size={14} style={{ color: c.border }} />
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {t(`nodeType.${type}`)}
                              </span>
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            {workflows.length === 0 ? (
              <div className="text-center py-16">
                <Workflow size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">{t('noWorkflows')}</p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab('templates')}
                  className="mt-4 bg-[#D4AF37] hover:bg-[#B8962E] text-white text-xs"
                >
                  <Plus size={14} className="mr-1.5" />
                  {t('createFromTemplate')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {workflows.map((wf) => (
                  <motion.div
                    key={wf.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      wf.id === activeWorkflowId
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => {
                      setActiveWorkflowId(wf.id)
                      setActiveTab('designer')
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Workflow
                          size={18}
                          className={
                            wf.id === activeWorkflowId
                              ? 'text-[#D4AF37]'
                              : 'text-gray-400'
                          }
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {wf.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {wf.nodes.length} {t('nodes')} · {wf.edges.length}{' '}
                            {t('connections')} ·{' '}
                            {new Date(wf.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          wf.status === 'running'
                            ? 'text-emerald-600 bg-emerald-50'
                            : wf.status === 'completed'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-500 bg-gray-100'
                        }`}
                      >
                        {t(`status.${wf.status}`)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
