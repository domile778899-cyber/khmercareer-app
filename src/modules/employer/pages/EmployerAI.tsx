import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, FileText, UserCheck, MessageSquare, Users,
  Send, Bot, User, Loader2, ArrowRight, Star, Zap, Shield,
  Clock, Globe, ChevronRight, Lightbulb, Copy, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { callAI } from '@/utils/aiApi';
import type { AIResponse, AIMessage } from '@/utils/aiApi';
import { logger } from '@/shared/logger';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  badge?: string;
}

/* ═══════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function EmployerAI() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('employerAI.welcomeMessage', '您好！我是AI招聘助手，专为在柬埔寨招聘的中国企业设计。我可以帮您生成职位描述、筛选简历、准备面试问题，或推荐合适的候选人。请问有什么可以帮助您的？'),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const features: FeatureCard[] = [
    {
      id: 'gen-jd',
      title: t('employerAI.genJDTitle', 'AI职位描述生成'),
      description: t('employerAI.genJDDesc', '输入关键词，AI自动生成完整三语职位描述'),
      icon: <FileText className="w-6 h-6" />,
      path: '/employer-ai/gen-jd',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      badge: t('employerAI.hot', '热门'),
    },
    {
      id: 'screen',
      title: t('employerAI.screenTitle', 'AI简历筛选'),
      description: t('employerAI.screenDesc', '上传简历，AI自动匹配评分并分类'),
      icon: <UserCheck className="w-6 h-6" />,
      path: '/employer-ai/screen',
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
      badge: t('employerAI.new', '新功能'),
    },
    {
      id: 'interview',
      title: t('employerAI.interviewTitle', 'AI面试问题生成'),
      description: t('employerAI.interviewDesc', '根据职位类型智能生成面试题库'),
      icon: <MessageSquare className="w-6 h-6" />,
      path: '/employer-ai/interview',
      color: 'text-coral',
      bgColor: 'bg-coral/10',
    },
    {
      id: 'recommend',
      title: t('employerAI.recommendTitle', 'AI候选人推荐'),
      description: t('employerAI.recommendDesc', '基于职位需求智能推荐匹配候选人'),
      icon: <Users className="w-6 h-6" />,
      path: '/employer-ai',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      badge: t('employerAI.aiPowered', 'AI驱动'),
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const aiMessages: AIMessage[] = [
      {
        role: 'system',
        content: `你是高棉职通车(KhmerCareer)的AI企业招聘助手，专门为在柬埔寨招聘的中国企业提供专业招聘建议。

你的能力包括：
1. 帮助企业撰写和优化职位描述（JD）
2. 分析简历匹配度
3. 生成面试问题
4. 提供柬埔寨当地招聘市场信息
5. 劳动法规和薪资建议

回复要求：
- 使用专业但友好的语气
- 考虑柬埔寨当地文化背景
- 可以中英双语回复
- 提供具体可操作的建议
- 回复简洁，控制在300字以内`,
      },
      ...messages.filter(m => m.id !== 'welcome').map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: text },
    ];

    try {
      const result: AIResponse = await callAI(aiMessages, {
        temperature: 0.7,
        max_tokens: 1024,
      });

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: result.success
          ? result.content
          : t('employerAI.aiError', '抱歉，AI服务暂时不可用，请稍后重试。'),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      logger.error('AI chat failed', { error: err, component: 'EmployerAI' });
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: t('employerAI.aiError', '抱歉，AI服务暂时不可用，请稍后重试。'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      logger.error('Copy to clipboard failed', { error: err, component: 'EmployerAI' });
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const suggestedQuestions = [
    t('employerAI.q1', '如何写一份吸引柬埔寨人才的JD？'),
    t('employerAI.q2', '在柬埔寨招聘生产主管，薪资范围多少合适？'),
    t('employerAI.q3', '推荐一些面试中文翻译的技巧'),
    t('employerAI.q4', '柬埔寨劳动法规定的试用期是多久？'),
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ═══════ Hero Section ═══════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              {t('employerAI.aiPowered', 'AI驱动')}
            </Badge>
            <h1 className="text-hero-title text-white mb-4">
              {t('employerAI.heroTitle', 'AI企业招聘助手')}
            </h1>
            <p className="text-body-large text-warm-gray max-w-2xl mx-auto mb-6">
              {t('employerAI.heroSubtitle', '专为在柬埔寨招聘的中国企业打造，让AI帮您高效完成招聘全流程')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-warm-gray">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-gold" />
                {t('employerAI.feature1', '智能生成')}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-gold" />
                {t('employerAI.feature2', '精准匹配')}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-gold" />
                {t('employerAI.feature3', '三语支持')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gold" />
                {t('employerAI.feature4', '节省时间')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Feature Cards ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <motion.div
          variants={staggerContainer as any}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              custom={i}
              variants={fadeInUp as any}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-card rounded-2xl"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/20">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-h4 mb-2">{feature.title}</h3>
                <p className="text-body-small text-warm-gray mb-4">{feature.description}</p>
                <div className="flex items-center text-gold text-sm font-medium">
                  {t('employerAI.tryNow', '立即体验')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════ AI Chat Interface ═══════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-h2 mb-2">
              {t('employerAI.chatTitle', 'AI招聘顾问')}
            </h2>
            <p className="text-body text-warm-gray">
              {t('employerAI.chatSubtitle', '有任何招聘问题？随时向AI助手咨询')}
            </p>
          </div>

          <Card className="bg-white border-0 shadow-card rounded-2xl overflow-hidden">
            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-gold text-charcoal'
                        : 'bg-charcoal text-gold'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`relative group ${
                      msg.role === 'user'
                        ? 'bg-gold text-charcoal'
                        : 'bg-cream text-charcoal'
                    } rounded-2xl px-4 py-3`}>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="absolute -right-2 -top-2 w-7 h-7 bg-white border border-sand rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title={t('common.copy', '复制')}
                        >
                          {copiedId === msg.id ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-warm-gray" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-charcoal text-gold flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-cream rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        <span className="text-sm text-warm-gray">
                          {t('employerAI.thinking', 'AI思考中...')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 sm:px-6 pb-3">
                <p className="text-xs text-warm-gray mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  {t('employerAI.suggestedQuestions', '推荐问题：')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(q);
                        inputRef.current?.focus();
                      }}
                      className="text-xs bg-cream hover:bg-gold/10 text-charcoal border border-sand hover:border-gold/30 rounded-full px-3 py-1.5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-sand">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('employerAI.inputPlaceholder', '输入您的问题...')}
                  className="flex-1 bg-cream border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gold hover:bg-gold-dark text-charcoal rounded-xl px-5 py-3 disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* ═══════ Stats Section ═══════ */}
      <section className="bg-charcoal py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: '10,000+', label: t('employerAI.stat1', '已生成JD') },
              { value: '50,000+', label: t('employerAI.stat2', '已筛选简历') },
              { value: '98%', label: t('employerAI.stat3', '企业满意度') },
              { value: '3x', label: t('employerAI.stat4', '效率提升') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="text-stat-number text-gold mb-1">{stat.value}</div>
                <div className="text-body-small text-warm-gray">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Tips Section ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10">
          <h2 className="text-h2 mb-3">
            {t('employerAI.tipsTitle', '招聘小贴士')}
          </h2>
          <p className="text-body text-warm-gray max-w-xl mx-auto">
            {t('employerAI.tipsSubtitle', '在柬埔寨成功招聘的实用建议')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Star className="w-5 h-5 text-gold" />,
              title: t('employerAI.tip1Title', '明确职位要求'),
              desc: t('employerAI.tip1Desc', '清晰的职位描述能吸引更多合适的候选人，建议使用中英高棉三语发布。'),
            },
            {
              icon: <Zap className="w-5 h-5 text-emerald" />,
              title: t('employerAI.tip2Title', '快速响应候选人'),
              desc: t('employerAI.tip2Desc', '在柬埔寨市场，响应速度是关键。建议在24小时内回复求职者。'),
            },
            {
              icon: <Shield className="w-5 h-5 text-coral" />,
              title: t('employerAI.tip3Title', '了解当地法规'),
              desc: t('employerAI.tip3Desc', '熟悉柬埔寨劳动法，包括试用期、工时和最低工资标准，确保合规招聘。'),
            },
          ].map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <Card className="p-6 bg-white border-0 shadow-card rounded-2xl h-full hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-h4 mb-2">{tip.title}</h3>
                <p className="text-body-small text-warm-gray">{tip.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
