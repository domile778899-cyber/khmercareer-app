import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Plus,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Link,
  ExternalLink,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

interface SocialAccount {
  id: number;
  platform: string;
  name: string;
  followers: number;
  posts: number;
  engagement: number;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

const mockAccounts: SocialAccount[] = [
  { id: 1, platform: 'facebook', name: 'KhmerCareer Official', followers: 15200, posts: 328, engagement: 4.5, status: 'connected', lastSync: '2分钟前' },
  { id: 2, platform: 'tiktok', name: '@khmercareer', followers: 28900, posts: 156, engagement: 8.2, status: 'connected', lastSync: '5分钟前' },
  { id: 3, platform: 'youtube', name: 'KhmerCareer Channel', followers: 8400, posts: 89, engagement: 3.1, status: 'connected', lastSync: '10分钟前' },
  { id: 4, platform: 'instagram', name: '@khmercareer', followers: 12300, posts: 245, engagement: 5.8, status: 'connected', lastSync: '8分钟前' },
  { id: 5, platform: 'twitter', name: '@khmercareer', followers: 5600, posts: 412, engagement: 2.3, status: 'error', lastSync: '1小时前' },
];

interface ScheduledPost {
  id: number;
  content: string;
  platforms: string[];
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
}

const mockScheduledPosts: ScheduledPost[] = [
  { id: 1, content: '每日职位精选 - 今日推荐10个高薪职位', platforms: ['facebook', 'tiktok'], scheduledTime: '2025-01-21 10:00', status: 'scheduled' },
  { id: 2, content: '企业招聘宣传片发布', platforms: ['youtube', 'tiktok'], scheduledTime: '2025-01-21 14:00', status: 'scheduled' },
  { id: 3, content: '求职技巧分享 - 如何写出完美简历', platforms: ['facebook', 'instagram'], scheduledTime: '2025-01-20 09:00', status: 'published' },
  { id: 4, content: '周末招聘会预告', platforms: ['facebook', 'twitter'], scheduledTime: '2025-01-20 16:00', status: 'published' },
];

const platformIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  tiktok: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  telegram: Send,
};

const platformColors: Record<string, string> = {
  facebook: '#1877F2',
  tiktok: '#000000',
  youtube: '#FF0000',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  telegram: '#0088CC',
};

const platformNames: Record<string, string> = {
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'Twitter',
  telegram: 'Telegram',
};

export default function SocialMatrix() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'posts' | 'analytics'>('accounts');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal sm:text-2xl">社媒矩阵</h1>
          <p className="mt-0.5 text-sm text-warm-gray">统一管理所有社交媒体账号，发布内容，查看数据</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-deep-brown shadow-gold transition-all hover:shadow-gold-hover"
        >
          <Plus size={16} />
          发布内容
        </motion.button>
      </motion.div>

      {/* Platform overview cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {mockAccounts.map((account, index) => {
          const Icon = platformIcons[account.platform] || MessageCircle;
          return (
            <motion.div
              key={account.id}
              custom={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -3 }}
              className="rounded-xl border border-deep-brown/5 bg-white p-4 text-center shadow-card transition-all hover:border-gold/20"
            >
              <div
                className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${platformColors[account.platform]}15` }}
              >
                <Icon size={20} style={{ color: platformColors[account.platform] }} />
              </div>
              <p className="text-xs font-medium text-charcoal">{platformNames[account.platform]}</p>
              <p className="mt-1 text-lg font-bold text-charcoal">{(account.followers / 1000).toFixed(1)}K</p>
              <p className="text-[10px] text-warm-gray">粉丝</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${account.status === 'connected' ? 'bg-emerald' : account.status === 'error' ? 'bg-coral' : 'bg-warm-gray'}`} />
                <span className="text-[9px] text-warm-gray">{account.lastSync}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '总粉丝数', value: '70.4K', icon: Users, color: '#D4AF37' },
          { label: '总发布内容', value: '1,230', icon: Share2, color: '#059669' },
          { label: '平均互动率', value: '4.8%', icon: TrendingUp, color: '#2563EB' },
          { label: '今日互动', value: '3,420', icon: Heart, color: '#E4405F' },
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

      {/* Tabs */}
      <motion.div custom={4} variants={fadeUp} initial="initial" animate="animate">
        <div className="mb-4 flex gap-1 rounded-lg bg-cream p-0.5 w-fit">
          {([
            { key: 'accounts', label: '账号管理' },
            { key: 'posts', label: '发布计划' },
            { key: 'analytics', label: '数据分析' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-4 py-2 text-xs font-medium transition-all ${
                activeTab === tab.key ? 'bg-white text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'accounts' && (
          <div className="rounded-xl border border-deep-brown/5 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-deep-brown/5 text-xs text-warm-gray">
                    <th className="px-5 py-3 font-medium">平台</th>
                    <th className="px-5 py-3 font-medium">账号名称</th>
                    <th className="px-5 py-3 font-medium text-right">粉丝数</th>
                    <th className="px-5 py-3 font-medium text-right">发布数</th>
                    <th className="px-5 py-3 font-medium text-right">互动率</th>
                    <th className="px-5 py-3 font-medium">状态</th>
                    <th className="px-5 py-3 font-medium">最后同步</th>
                    <th className="px-5 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAccounts.map((account) => {
                    const Icon = platformIcons[account.platform] || MessageCircle;
                    return (
                      <tr key={account.id} className="border-b border-deep-brown/5 transition-colors hover:bg-cream/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Icon size={16} style={{ color: platformColors[account.platform] }} />
                            <span className="text-sm text-charcoal">{platformNames[account.platform]}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium text-charcoal">{account.name}</td>
                        <td className="px-5 py-3 text-right text-charcoal">{account.followers.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-charcoal">{account.posts}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-sm font-medium text-emerald">{account.engagement}%</span>
                        </td>
                        <td className="px-5 py-3">
                          {account.status === 'connected' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-emerald">
                              <CheckCircle size={10} /> 已连接
                            </span>
                          ) : account.status === 'error' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-semibold text-coral">
                              <AlertCircle size={10} /> 异常
                            </span>
                          ) : (
                            <span className="rounded-full bg-warm-gray/10 px-2 py-0.5 text-[10px] font-semibold text-warm-gray">未连接</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-warm-gray">{account.lastSync}</td>
                        <td className="px-5 py-3">
                          <button className="text-xs text-gold hover:underline">管理</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold text-charcoal">发布计划</h3>
            <div className="space-y-3">
              {mockScheduledPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ x: 2 }}
                  className="flex flex-col gap-3 rounded-xl border border-deep-brown/5 p-4 transition-all hover:border-gold/20 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{post.content}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {post.platforms.map((p) => {
                        const PIcon = platformIcons[p] || MessageCircle;
                        return (
                          <span key={p} className="flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10px] text-warm-gray">
                            <PIcon size={10} style={{ color: platformColors[p] }} />
                            {platformNames[p]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-warm-gray">
                      <Calendar size={12} />
                      {post.scheduledTime}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        post.status === 'scheduled'
                          ? 'bg-gold/10 text-gold'
                          : post.status === 'published'
                            ? 'bg-emerald/10 text-emerald'
                            : 'bg-coral/10 text-coral'
                      }`}
                    >
                      {post.status === 'scheduled' ? '待发布' : post.status === 'published' ? '已发布' : '失败'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAccounts.slice(0, 3).map((account, index) => {
              const Icon = platformIcons[account.platform] || MessageCircle;
              return (
                <motion.div
                  key={account.id}
                  custom={index}
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  className="rounded-xl border border-deep-brown/5 bg-white p-5 shadow-card"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Icon size={18} style={{ color: platformColors[account.platform] }} />
                    <span className="text-sm font-semibold text-charcoal">{platformNames[account.platform]}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-warm-gray"><Users size={12} /> 粉丝增长</span>
                      <span className="text-sm font-medium text-emerald">+{(account.followers * 0.05 / 1000).toFixed(1)}K/周</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-warm-gray"><Eye size={12} /> 平均曝光</span>
                      <span className="text-sm font-medium text-charcoal">{Math.round(account.followers * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-warm-gray"><Heart size={12} /> 互动率</span>
                      <span className="text-sm font-medium text-gold">{account.engagement}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-warm-gray"><MessageSquare size={12} /> 评论/私信</span>
                      <span className="text-sm font-medium text-charcoal">{Math.round(account.followers * account.engagement / 100)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
