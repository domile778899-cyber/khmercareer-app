import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  Sparkles,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  MousePointer,
  ArrowRight,
  Wand2,
  FileText,
  Image,
  Megaphone,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

interface Campaign {
  id: number;
  name: string;
  status: 'running' | 'paused' | 'completed';
  type: string;
  audience: string;
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  { id: 1, name: '春节招聘大促', status: 'running', type: 'AI文案推广', audience: 'IT行业求职者', impressions: 12500, clicks: 840, conversions: 126, createdAt: '2025-01-15' },
  { id: 2, name: '工厂直招推广', status: 'running', type: '智能投放', audience: '制造业工人', impressions: 8900, clicks: 620, conversions: 89, createdAt: '2025-01-14' },
  { id: 3, name: '企业品牌宣传', status: 'paused', type: 'AI内容生成', audience: '全行业', impressions: 5600, clicks: 310, conversions: 45, createdAt: '2025-01-12' },
  { id: 4, name: '海外人才招募', status: 'completed', type: '多语言推广', audience: '海外华人', impressions: 15200, clicks: 1100, conversions: 168, createdAt: '2025-01-10' },
  { id: 5, name: '应届生专区', status: 'running', type: 'AI文案推广', audience: '应届毕业生', impressions: 7800, clicks: 560, conversions: 92, createdAt: '2025-01-08' },
];

const statusConfig = {
  running: { label: '进行中', color: '#059669', bg: '#D1FAE5', icon: Play },
  paused: { label: '已暂停', color: '#F59E0B', bg: '#FEF3C7', icon: Pause },
  completed: { label: '已完成', color: '#2563EB', bg: '#DBEAFE', icon: CheckCircle },
};

const aiTemplates = [
  { id: 1, name: '招聘文案生成', desc: '根据职位信息生成吸引人的招聘文案', icon: FileText, color: '#D4AF37' },
  { id: 2, name: '广告创意生成', desc: 'AI生成多版本广告创意A/B测试', icon: Image, color: '#E85D3E' },
  { id: 3, name: '智能投放优化', desc: '自动优化投放时间和受众定位', icon: Megaphone, color: '#059669' },
  { id: 4, name: '营销邮件生成', desc: '批量生成个性化营销邮件', icon: Sparkles, color: '#2563EB' },
];

export default function AIPromotionCenter() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const toggleStatus = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'running' ? 'paused' : 'running' as 'running' | 'paused' } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal sm:text-2xl">AI推广中心</h1>
          <p className="mt-0.5 text-sm text-warm-gray">利用AI技术智能创建、优化和管理推广活动</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-deep-brown shadow-gold transition-all hover:shadow-gold-hover"
        >
          <Plus size={16} />
          新建AI推广
        </motion.button>
      </motion.div>

      {/* AI Templates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {aiTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.id}
              custom={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -3, boxShadow: `0 8px 24px ${template.color}20` }}
              onClick={() => setSelectedTemplate(template.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selectedTemplate === template.id
                  ? 'border-gold/40 bg-gold/5'
                  : 'border-deep-brown/5 bg-white shadow-card hover:border-gold/20'
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${template.color}15` }}>
                <Icon size={20} style={{ color: template.color }} />
              </div>
              <p className="text-sm font-semibold text-charcoal">{template.name}</p>
              <p className="mt-0.5 text-[11px] text-warm-gray">{template.desc}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '活跃活动', value: '12', icon: Play, color: '#059669' },
          { label: '总曝光量', value: '50K+', icon: Eye, color: '#D4AF37' },
          { label: '总点击', value: '3,430', icon: MousePointer, color: '#2563EB' },
          { label: '转化率', value: '12.8%', icon: TrendingUp, color: '#E85D3E' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              className="rounded-xl border border-deep-brown/5 bg-white p-4 shadow-card"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon size={16} style={{ color: stat.color }} />
                <span className="text-xs text-warm-gray">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-charcoal">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Campaigns Table */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="overflow-hidden rounded-xl border border-deep-brown/5 bg-white shadow-card"
      >
        <div className="flex items-center justify-between border-b border-deep-brown/5 px-5 py-4">
          <h3 className="text-sm font-semibold text-charcoal">推广活动列表</h3>
          <span className="text-xs text-warm-gray">共 {campaigns.length} 个活动</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-deep-brown/5 text-xs text-warm-gray">
                <th className="px-5 py-3 font-medium">活动名称</th>
                <th className="px-5 py-3 font-medium">状态</th>
                <th className="px-5 py-3 font-medium">类型</th>
                <th className="px-5 py-3 font-medium">受众</th>
                <th className="px-5 py-3 font-medium text-right">曝光</th>
                <th className="px-5 py-3 font-medium text-right">点击</th>
                <th className="px-5 py-3 font-medium text-right">转化</th>
                <th className="px-5 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const status = statusConfig[campaign.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={campaign.id} className="group border-b border-deep-brown/5 transition-colors hover:bg-cream/50">
                    <td className="px-5 py-3 font-medium text-charcoal">{campaign.name}</td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        <StatusIcon size={10} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-warm-gray">{campaign.type}</td>
                    <td className="px-5 py-3 text-warm-gray">{campaign.audience}</td>
                    <td className="px-5 py-3 text-right font-medium text-charcoal">{campaign.impressions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-medium text-charcoal">{campaign.clicks.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium text-emerald">{campaign.conversions}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleStatus(campaign.id)} className="rounded p-1 text-warm-gray hover:bg-cream hover:text-gold">
                          {campaign.status === 'running' ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button className="rounded p-1 text-warm-gray hover:bg-cream hover:text-gold">
                          <Edit3 size={14} />
                        </button>
                        <button className="rounded p-1 text-warm-gray hover:bg-cream hover:text-coral">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Generation Demo */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-xl border border-gold/20 bg-gold/5 p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Wand2 size={18} className="text-gold" />
            <h3 className="text-sm font-semibold text-charcoal">AI生成助手</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-warm-gray">输入关键词或描述</label>
              <input
                type="text"
                placeholder="例如：招聘Java开发工程师，要求3年以上经验..."
                className="w-full rounded-lg border border-deep-brown/10 bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-deep-brown"
              >
                <Sparkles size={14} />
                开始生成
              </motion.button>
              <button className="rounded-lg border border-deep-brown/10 px-5 py-2.5 text-sm text-warm-gray hover:bg-white">
                重置
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
