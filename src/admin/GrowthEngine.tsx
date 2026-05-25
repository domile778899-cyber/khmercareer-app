import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GrowthCampaignModal } from "./GrowthCampaignModal";
import {
  Rocket,
  Users,
  Link2,
  Coins,
  MessageCircle,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Edit3,
  Trash2,
  TrendingUp,
  Target,
  Award,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  Gift,
  Star,
  Zap,
  BarChart3,
  MousePointer,
  UserPlus,
  ArrowRightLeft,
  Settings,
  Bell,
  Send,
  Image,
  Type,
  Smartphone,
  Facebook,
  Globe,
  RefreshCw,
  Eye,
  Layers,
  Crown,
  CircleDot,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */
interface Campaign {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "ended";
  participants: number;
  converted: number;
  rewardType: "cash" | "credit" | "premium" | "discount";
  rewardAmount: number;
  targetGoal: number;
  currentProgress: number;
  viralCoefficient: number;
  estimatedReach?: number;
  startDate: string;
  endDate: string;
}

interface ReferralUser {
  id: string;
  name: string;
  avatar: string;
  invites: number;
  converted: number;
  earnings: number;
  children: ReferralUser[];
}

interface InviteCode {
  id: string;
  user: string;
  code: string;
  sent: number;
  converted: number;
  totalReward: number;
  status: "active" | "inactive";
}

interface CreditRule {
  action: string;
  points: number;
  dailyLimit: number;
  enabled: boolean;
}

interface CreditRedeem {
  id: string;
  name: string;
  points: number;
  value: string;
  icon: typeof Star;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  invites: number;
  converted: number;
  earnings: number;
}

interface CommunityGroup {
  id: string;
  name: string;
  platform: "telegram" | "facebook";
  members: number;
  dailyActive: number;
  weeklyActive: number;
  messageCount: number;
  leaveRate: number;
  status: "active" | "inactive";
}

interface ViralFeedItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  reward: string;
}

/* ═══════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════ */
const campaigns: Campaign[] = [
  { id: "g1", name: "邀请好友得现金", type: "jobseeker_invite", status: "active", participants: 1250, converted: 380, rewardType: "cash", rewardAmount: 5, targetGoal: 500, currentProgress: 380, viralCoefficient: 2.3, estimatedReach: 5000, startDate: "2025-01-01", endDate: "2025-03-31" },
  { id: "g2", name: "企业入驻奖励计划", type: "employer_invite", status: "active", participants: 85, converted: 23, rewardType: "premium", rewardAmount: 99, targetGoal: 100, currentProgress: 23, viralCoefficient: 1.8, startDate: "2025-01-15", endDate: "2025-06-30" },
  { id: "g3", name: "分享职位赚积分", type: "share_job", status: "active", participants: 3200, converted: 890, rewardType: "credit", rewardAmount: 50, targetGoal: 2000, currentProgress: 890, viralCoefficient: 3.1, estimatedReach: 15000, startDate: "2025-02-01", endDate: "2025-04-30" },
  { id: "g4", name: "加入电报群组得福利", type: "community_join", status: "paused", participants: 560, converted: 210, rewardType: "discount", rewardAmount: 20, targetGoal: 1000, currentProgress: 210, viralCoefficient: 1.5, startDate: "2025-01-10", endDate: "2025-05-31" },
  { id: "g5", name: "春节招聘大作战", type: "jobseeker_invite", status: "ended", participants: 2890, converted: 1120, rewardType: "cash", rewardAmount: 10, targetGoal: 1000, currentProgress: 1120, viralCoefficient: 3.8, estimatedReach: 22000, startDate: "2025-01-20", endDate: "2025-02-15" },
  { id: "g6", name: "课程分享达人", type: "share_course", status: "active", participants: 780, converted: 195, rewardType: "credit", rewardAmount: 100, targetGoal: 300, currentProgress: 195, viralCoefficient: 2.1, estimatedReach: 3500, startDate: "2025-02-10", endDate: "2025-05-10" },
  { id: "g7", name: "VIP会员推荐计划", type: "employer_invite", status: "active", participants: 156, converted: 67, rewardType: "premium", rewardAmount: 199, targetGoal: 200, currentProgress: 67, viralCoefficient: 1.9, startDate: "2025-02-15", endDate: "2025-08-15" },
  { id: "g8", name: "每日签到裂变", type: "daily_checkin", status: "active", participants: 5430, converted: 1200, rewardType: "credit", rewardAmount: 10, targetGoal: 3000, currentProgress: 1200, viralCoefficient: 2.7, estimatedReach: 18000, startDate: "2025-03-01", endDate: "2025-12-31" },
];

const referralTree: ReferralUser = {
  id: "root", name: "平台", avatar: "PT", invites: 0, converted: 0, earnings: 0,
  children: [
    {
      id: "u1", name: "Sophea Kim", avatar: "SK", invites: 15, converted: 8, earnings: 45,
      children: [
        {
          id: "u2", name: "Meng Li", avatar: "ML", invites: 8, converted: 5, earnings: 28,
          children: [
            { id: "u4", name: "David Chen", avatar: "DC", invites: 3, converted: 2, earnings: 15, children: [] },
            { id: "u5", name: "Nary Phan", avatar: "NP", invites: 1, converted: 1, earnings: 8, children: [] },
          ],
        },
        {
          id: "u3", name: "Chantrea Sovann", avatar: "CS", invites: 5, converted: 3, earnings: 22,
          children: [
            { id: "u6", name: "Wei Zhang", avatar: "WZ", invites: 2, converted: 1, earnings: 12, children: [] },
          ],
        },
      ],
    },
    {
      id: "u7", name: "John Smith", avatar: "JS", invites: 12, converted: 7, earnings: 38,
      children: [
        {
          id: "u8", name: "Srey Mao", avatar: "SM", invites: 6, converted: 4, earnings: 25,
          children: [
            { id: "u10", name: "Kosal Ly", avatar: "KL", invites: 4, converted: 3, earnings: 20, children: [] },
          ],
        },
        {
          id: "u9", name: "Pich Rithy", avatar: "PR", invites: 3, converted: 2, earnings: 18,
          children: [],
        },
      ],
    },
  ],
};

const inviteCodes: InviteCode[] = [
  { id: "c1", user: "Sophea Kim", code: "KM2025SK", sent: 156, converted: 48, totalReward: 240, status: "active" },
  { id: "c2", user: "Meng Li", code: "KM2025ML", sent: 89, converted: 23, totalReward: 115, status: "active" },
  { id: "c3", user: "David Chen", code: "KM2025DC", sent: 45, converted: 12, totalReward: 60, status: "active" },
  { id: "c4", user: "Nary Phan", code: "KM2025NP", sent: 34, converted: 8, totalReward: 40, status: "inactive" },
  { id: "c5", user: "Chantrea Sovann", code: "KM2025CS", sent: 78, converted: 19, totalReward: 95, status: "active" },
  { id: "c6", user: "Wei Zhang", code: "KM2025WZ", sent: 56, converted: 15, totalReward: 75, status: "active" },
  { id: "c7", user: "John Smith", code: "KM2025JS", sent: 134, converted: 42, totalReward: 210, status: "active" },
  { id: "c8", user: "Srey Mao", code: "KM2025SM", sent: 67, converted: 18, totalReward: 90, status: "active" },
];

const creditRules: CreditRule[] = [
  { action: "注册账户", points: 50, dailyLimit: 50, enabled: true },
  { action: "完善简历", points: 100, dailyLimit: 100, enabled: true },
  { action: "申请职位", points: 20, dailyLimit: 100, enabled: true },
  { action: "分享职位", points: 30, dailyLimit: 150, enabled: true },
  { action: "被邀请注册", points: 25, dailyLimit: 125, enabled: true },
  { action: "每日签到", points: 10, dailyLimit: 10, enabled: true },
  { action: "发布评价", points: 15, dailyLimit: 75, enabled: true },
  { action: "完成课程", points: 200, dailyLimit: 200, enabled: true },
];

const creditRedeems: CreditRedeem[] = [
  { id: "r1", name: "简历置顶1天", points: 100, value: "$2", icon: Star },
  { id: "r2", name: "简历置顶7天", points: 500, value: "$10", icon: Crown },
  { id: "r3", name: "专业版1周", points: 500, value: "$15", icon: Sparkles },
  { id: "r4", name: "专业版1月", points: 1500, value: "$49", icon: Zap },
  { id: "r5", name: "$10提现", points: 1000, value: "$10", icon: Wallet },
  { id: "r6", name: "面试辅导1次", points: 800, value: "$25", icon: Target },
];

const leaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Sophea Kim", avatar: "SK", invites: 156, converted: 48, earnings: 480 },
  { rank: 2, name: "John Smith", avatar: "JS", invites: 134, converted: 42, earnings: 420 },
  { rank: 3, name: "Meng Li", avatar: "ML", invites: 89, converted: 23, earnings: 230 },
  { rank: 4, name: "Chantrea Sovann", avatar: "CS", invites: 78, converted: 19, earnings: 190 },
  { rank: 5, name: "Srey Mao", avatar: "SM", invites: 67, converted: 18, earnings: 180 },
  { rank: 6, name: "Wei Zhang", avatar: "WZ", invites: 56, converted: 15, earnings: 150 },
  { rank: 7, name: "David Chen", avatar: "DC", invites: 45, converted: 12, earnings: 120 },
  { rank: 8, name: "Pich Rithy", avatar: "PR", invites: 38, converted: 11, earnings: 110 },
];

const communities: CommunityGroup[] = [
  { id: "cm1", name: "KhmerCareer 求职交流群", platform: "telegram", members: 3240, dailyActive: 890, weeklyActive: 2100, messageCount: 12500, leaveRate: 2.1, status: "active" },
  { id: "cm2", name: "金边招聘快车道", platform: "telegram", members: 1850, dailyActive: 520, weeklyActive: 1300, messageCount: 7800, leaveRate: 1.8, status: "active" },
  { id: "cm3", name: "西港工作信息群", platform: "telegram", members: 980, dailyActive: 210, weeklyActive: 560, messageCount: 3400, leaveRate: 3.2, status: "active" },
  { id: "cm4", name: "KhmerCareer Facebook", platform: "facebook", members: 5620, dailyActive: 1200, weeklyActive: 3400, messageCount: 8900, leaveRate: 1.5, status: "active" },
  { id: "cm5", name: "中企招聘信息群", platform: "telegram", members: 1450, dailyActive: 380, weeklyActive: 920, messageCount: 5600, leaveRate: 2.5, status: "active" },
];

const viralFeed: ViralFeedItem[] = [
  { id: "v1", user: "Sophea Kim", action: "邀请了好友", target: "Meng Li", time: "刚刚", reward: "+$5" },
  { id: "v2", user: "John Smith", action: "分享了职位", target: "服装厂技工", time: "1分钟前", reward: "+50积分" },
  { id: "v3", user: "Chantrea S.", action: "邀请的企业完成首单", target: "Sinolink Tech", time: "3分钟前", reward: "+$20" },
  { id: "v4", user: "Wei Zhang", action: "完成每日签到", target: "", time: "5分钟前", reward: "+10积分" },
  { id: "v5", user: "David Chen", action: "完善简历", target: "", time: "6分钟前", reward: "+100积分" },
  { id: "v6", user: "Nary Phan", action: "邀请了好友", target: "Srey Mao", time: "8分钟前", reward: "+$5" },
  { id: "v7", user: "Kosal Ly", action: "分享课程", target: "商务英语", time: "10分钟前", reward: "+100积分" },
  { id: "v8", user: "Pich Rithy", action: "邀请的企业入驻", target: "Golden Hotel", time: "12分钟前", reward: "+$15" },
];

const creditHistory = [
  { id: "h1", user: "Sophea Kim", action: "邀请好友", points: 50, balance: 2450, time: "2025-03-15 14:32" },
  { id: "h2", user: "Meng Li", action: "完善简历", points: 100, balance: 1890, time: "2025-03-15 14:28" },
  { id: "h3", user: "David Chen", action: "每日签到", points: 10, balance: 1200, time: "2025-03-15 14:25" },
  { id: "h4", user: "Nary Phan", action: "分享职位", points: 30, balance: 980, time: "2025-03-15 14:20" },
  { id: "h5", user: "Chantrea S.", action: "兑换提现", points: -1000, balance: 1560, time: "2025-03-15 14:15" },
  { id: "h6", user: "Wei Zhang", action: "完成课程", points: 200, balance: 2340, time: "2025-03-15 14:10" },
  { id: "h7", user: "John Smith", action: "邀请企业", points: 75, balance: 3120, time: "2025-03-15 14:05" },
  { id: "h8", user: "Srey Mao", action: "发布评价", points: 15, balance: 890, time: "2025-03-15 14:00" },
];

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */
const typeLabelMap: Record<string, string> = {
  jobseeker_invite: "求职者邀请",
  employer_invite: "企业邀请",
  share_job: "分享职位",
  share_course: "分享课程",
  community_join: "社群加入",
  daily_checkin: "每日签到",
};

const rewardLabelMap: Record<string, string> = {
  cash: "现金",
  credit: "积分",
  premium: "会员",
  discount: "折扣",
};

const statusConfig = {
  active: { label: "进行中", color: "#059669", bg: "rgba(5,150,105,0.12)" },
  paused: { label: "已暂停", color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
  ended: { label: "已结束", color: "#9C9588", bg: "rgba(156,149,136,0.12)" },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

/* ═══════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════ */

/* ── Campaign Card ── */
function CampaignCard({ campaign, index }: { campaign: Campaign; index: number }) {
  const status = statusConfig[campaign.status];
  const progress = Math.min(100, Math.round((campaign.currentProgress / campaign.targetGoal) * 100));

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(26,23,20,0.12)" }}
      className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-charcoal truncate group-hover:text-gold transition-colors">
            {campaign.name}
          </h3>
          <p className="text-xs text-warm-gray mt-0.5">{typeLabelMap[campaign.type] || campaign.type}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ml-2"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
            <Users size={13} style={{ color: "#D4AF37" }} />
          </div>
          <div>
            <p className="text-xs text-warm-gray">参与</p>
            <p className="text-sm font-semibold text-charcoal">{campaign.participants.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(5,150,105,0.1)" }}>
            <CheckCircle2 size={13} style={{ color: "#059669" }} />
          </div>
          <div>
            <p className="text-xs text-warm-gray">转化</p>
            <p className="text-sm font-semibold text-charcoal">{campaign.converted.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(232,93,62,0.1)" }}>
            <TrendingUp size={13} style={{ color: "#E85D3E" }} />
          </div>
          <div>
            <p className="text-xs text-warm-gray">裂变系数</p>
            <p className="text-sm font-semibold text-charcoal">{campaign.viralCoefficient}x</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(139,115,85,0.1)" }}>
            <Gift size={13} style={{ color: "#8B7355" }} />
          </div>
          <div>
            <p className="text-xs text-warm-gray">奖励</p>
            <p className="text-sm font-semibold text-charcoal">
              {campaign.rewardType === "cash" ? "$" : ""}{campaign.rewardAmount}
              {rewardLabelMap[campaign.rewardType]}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-warm-gray">目标完成度</span>
          <span className="text-[11px] font-semibold" style={{ color: progress >= 100 ? "#059669" : "#D4AF37" }}>
            {progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-cream overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-full rounded-full"
            style={{
              background: progress >= 100
                ? "linear-gradient(90deg, #059669, #34D399)"
                : "linear-gradient(90deg, #D4AF37, #F5E6A3)",
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-warm-gray">{campaign.currentProgress.toLocaleString()}</span>
          <span className="text-[10px] text-warm-gray">{campaign.targetGoal.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-sand">
        {campaign.status === "active" ? (
          <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-[#D4AF37] hover:bg-[#D4AF3710] transition-colors">
            <Pause size={12} /> 暂停
          </button>
        ) : campaign.status === "paused" ? (
          <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-[#059669] hover:bg-[#05966910] transition-colors">
            <Play size={12} /> 恢复
          </button>
        ) : null}
        <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-warm-gray hover:bg-cream transition-colors ml-auto">
          <Edit3 size={12} /> 编辑
        </button>
        <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-coral hover:bg-coral/5 transition-colors">
          <Trash2 size={12} /> 删除
        </button>
      </div>
    </motion.div>
  );
}

/* ── Referral Tree Visualizer ── */
function ReferralTreeNode({
  node,
  depth = 0,
  isLast = true,
  parentX = 0,
}: {
  node: ReferralUser;
  depth?: number;
  isLast?: boolean;
  parentX?: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showDetail, setShowDetail] = useState(false);
  const hasChildren = node.children.length > 0;

  const nodeColors = ["#D4AF37", "#059669", "#8B7355", "#E85D3E"];
  const nodeColor = depth === 0 ? "#D4AF37" : nodeColors[depth % nodeColors.length];

  return (
    <div className="relative">
      {/* Node */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.1 }}
        className="flex items-center gap-3 mb-2"
        style={{ marginLeft: `${depth * 40}px` }}
      >
        {/* Expand toggle */}
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-sand hover:border-gold transition-colors"
          >
            {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Avatar + Info */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowDetail(!showDetail)}
          className="flex items-center gap-3 rounded-xl border border-sand bg-white px-4 py-2.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: nodeColor }}
          >
            {node.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{node.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-warm-gray">邀请 {node.invites}</span>
              <span className="text-[10px] text-warm-gray">·</span>
              <span className="text-[10px] text-warm-gray">转化 {node.converted}</span>
              {depth > 0 && (
                <>
                  <span className="text-[10px] text-warm-gray">·</span>
                  <span className="text-[10px] font-medium" style={{ color: "#059669" }}>
                    ${node.earnings}
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {showDetail && depth > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            style={{ marginLeft: `${depth * 40 + 60}px` }}
          >
            <div className="rounded-lg border border-sand bg-cream/50 p-3 mb-2 text-xs space-y-1.5 max-w-xs">
              <div className="flex justify-between">
                <span className="text-warm-gray">总邀请</span>
                <span className="font-medium text-charcoal">{node.invites} 人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">成功转化</span>
                <span className="font-medium text-charcoal">{node.converted} 人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">转化率</span>
                <span className="font-medium" style={{ color: "#059669" }}>
                  {node.invites > 0 ? ((node.converted / node.invites) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">累计收益</span>
                <span className="font-medium" style={{ color: "#D4AF37" }}>${node.earnings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">下级裂变</span>
                <span className="font-medium text-charcoal">{node.children.length} 人</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connector line */}
      {hasChildren && expanded && (
        <div
          className="absolute w-px bg-sand"
          style={{
            left: `${depth * 40 + 10}px`,
            top: "38px",
            bottom: 0,
          }}
        />
      )}

      {/* Children */}
      <AnimatePresence>
        {expanded &&
          hasChildren &&
          node.children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative"
            >
              {/* Horizontal connector */}
              <div
                className="absolute h-px bg-sand"
                style={{
                  left: `${depth * 40 + 10}px`,
                  top: "19px",
                  width: "30px",
                }}
              />
              <ReferralTreeNode
                node={child}
                depth={depth + 1}
                isLast={i === node.children.length - 1}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Tab Contents
   ═══════════════════════════════════════════════ */

/* ── Tab 1: Campaigns ── */
function CampaignsTab({ onCreate }: { onCreate: () => void }) {
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "ended">("all");
  const [search, setSearch] = useState("");

  const filtered = campaigns.filter((c) => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["all", "active", "paused", "ended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === s
                  ? "bg-deep-brown text-white shadow-gold"
                  : "bg-white text-warm-gray border border-sand hover:bg-cream"
              }`}
            >
              {s === "all" ? "全部" : s === "active" ? "进行中" : s === "paused" ? "已暂停" : "已结束"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
            <Input
              placeholder="搜索活动..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm bg-white border-sand w-52"
            />
          </div>
          <Button
            onClick={onCreate}
            className="h-9 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-gold text-xs"
          >
            <Plus size={14} className="mr-1" /> 新建活动
          </Button>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <CampaignCard key={c.id} campaign={c} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-warm-gray">
          <Rocket size={40} className="mx-auto mb-3 opacity-30" />
          <p>没有找到符合条件的活动</p>
        </div>
      )}
    </div>
  );
}

/* ── Tab 2: Invite Rewards ── */
function InviteRewardsTab() {
  const [tier1Inviter, setTier1Inviter] = useState(5);
  const [tier1Invitee, setTier1Invitee] = useState(3);
  const [tier2Enabled, setTier2Enabled] = useState(true);
  const [tier2Reward, setTier2Reward] = useState(2);
  const [tier3Enabled, setTier3Enabled] = useState(false);
  const [tier3Reward, setTier3Reward] = useState(1);
  const [withdrawThreshold, setWithdrawThreshold] = useState(10);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [weeklyLimit, setWeeklyLimit] = useState(500);
  const [monthlyLimit, setMonthlyLimit] = useState(2000);

  return (
    <div className="space-y-5">
      {/* Reward Settings */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Award size={18} style={{ color: "#D4AF37" }} />
          返利规则设置
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tier 1 */}
          <div className="space-y-4 rounded-xl border border-sand bg-cream/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-gold/10 text-gold-dark border-gold/30">一级邀请</Badge>
              <span className="text-xs text-warm-gray">直接邀请</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-gray mb-1.5">邀请人奖励 ($)</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier1Inviter(Math.max(0, tier1Inviter - 1))}>-</Button>
                <Input value={tier1Inviter} onChange={(e) => setTier1Inviter(Number(e.target.value))} className="h-8 text-center bg-white border-sand" />
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier1Inviter(tier1Inviter + 1)}>+</Button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-gray mb-1.5">被邀请人奖励 ($)</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier1Invitee(Math.max(0, tier1Invitee - 1))}>-</Button>
                <Input value={tier1Invitee} onChange={(e) => setTier1Invitee(Number(e.target.value))} className="h-8 text-center bg-white border-sand" />
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier1Invitee(tier1Invitee + 1)}>+</Button>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="space-y-4 rounded-xl border border-sand bg-cream/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald/10 text-emerald border-emerald/30">二级邀请</Badge>
                <span className="text-xs text-warm-gray">间接邀请</span>
              </div>
              <Switch checked={tier2Enabled} onCheckedChange={setTier2Enabled} />
            </div>
            {tier2Enabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">邀请人奖励 ($)</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier2Reward(Math.max(0, tier2Reward - 1))}>-</Button>
                  <Input value={tier2Reward} onChange={(e) => setTier2Reward(Number(e.target.value))} className="h-8 text-center bg-white border-sand" />
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier2Reward(tier2Reward + 1)}>+</Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Tier 3 */}
          <div className="space-y-4 rounded-xl border border-sand bg-cream/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-coral/10 text-coral border-coral/30">三级邀请</Badge>
                <span className="text-xs text-warm-gray">深层裂变</span>
              </div>
              <Switch checked={tier3Enabled} onCheckedChange={setTier3Enabled} />
            </div>
            {tier3Enabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">邀请人奖励 ($)</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier3Reward(Math.max(0, tier3Reward - 1))}>-</Button>
                  <Input value={tier3Reward} onChange={(e) => setTier3Reward(Number(e.target.value))} className="h-8 text-center bg-white border-sand" />
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-sand" onClick={() => setTier3Reward(tier3Reward + 1)}>+</Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Limits */}
          <div className="space-y-4 rounded-xl border border-sand bg-cream/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#8B7355]/10 text-[#8B7355] border-[#8B7355]/30">提现与限额</Badge>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-gray mb-1.5">提现门槛 ($)</label>
              <Input value={withdrawThreshold} onChange={(e) => setWithdrawThreshold(Number(e.target.value))} className="h-8 bg-white border-sand" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">日上限</label>
                <Input value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} className="h-8 text-center bg-white border-sand text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">周上限</label>
                <Input value={weeklyLimit} onChange={(e) => setWeeklyLimit(Number(e.target.value))} className="h-8 text-center bg-white border-sand text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">月上限</label>
                <Input value={monthlyLimit} onChange={(e) => setMonthlyLimit(Number(e.target.value))} className="h-8 text-center bg-white border-sand text-xs" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-gold">
            <CheckCircle2 size={14} className="mr-1.5" /> 保存设置
          </Button>
        </div>
      </motion.div>

      {/* Invite Code Table */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Link2 size={18} style={{ color: "#D4AF37" }} />
          邀请码管理
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-warm-gray">用户</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-warm-gray">邀请码</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">发送次数</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">成功转化</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">累计奖励</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-warm-gray">状态</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-warm-gray">操作</th>
              </tr>
            </thead>
            <tbody>
              {inviteCodes.map((code, i) => (
                <motion.tr
                  key={code.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-sand/50 hover:bg-cream/30 transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white bg-gold">
                        {(code as any).avatar}
                      </div>
                      <span className="font-medium text-charcoal">{code.user}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <code className="rounded bg-cream px-2 py-0.5 text-xs font-mono text-charcoal">{code.code}</code>
                  </td>
                  <td className="py-2.5 px-3 text-right text-charcoal">{code.sent}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-emerald font-medium">{code.converted}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium" style={{ color: "#D4AF37" }}>
                    ${code.totalReward}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: code.status === "active" ? "rgba(5,150,105,0.12)" : "rgba(156,149,136,0.12)",
                        color: code.status === "active" ? "#059669" : "#9C9588",
                      }}
                    >
                      {code.status === "active" ? "正常" : "停用"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button className="rounded p-1 hover:bg-cream transition-colors text-warm-gray">
                      <Copy size={13} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Tab 3: Referral Chain ── */
function ReferralChainTab() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "总邀请人", value: "2,156", icon: Users, color: "#D4AF37" },
          { label: "总被邀请", value: "8,420", icon: UserPlus, color: "#059669" },
          { label: "平均裂变深度", value: "2.4层", icon: Layers, color: "#E85D3E" },
          { label: "总奖励发放", value: "$12,580", icon: Wallet, color: "#8B7355" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-lg font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-warm-gray">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tree */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
            <Share2 size={18} style={{ color: "#D4AF37" }} />
            推荐链可视化
          </h3>
          <span className="text-xs text-warm-gray">点击节点查看详情，点击箭头展开/收起</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <ReferralTreeNode node={referralTree} />
        </div>
      </motion.div>

      {/* Top Inviters */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Crown size={18} style={{ color: "#D4AF37" }} />
          邀请达人榜
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leaderboard.slice(0, 6).map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl border border-sand bg-cream/20 p-3 hover:bg-cream/50 transition-colors"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0"
                style={{
                  backgroundColor: i < 3 ? "#D4AF3720" : "#F5F0E8",
                  color: i < 3 ? "#D4AF37" : "#9C9588",
                }}
              >
                {user.rank}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white bg-gold shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{user.name}</p>
                <p className="text-[10px] text-warm-gray">邀请 {user.invites} · 转化 {user.converted}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: "#D4AF37" }}>${user.earnings}</p>
                <p className="text-[10px] text-warm-gray">累计收益</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Tab 4: Credit Fission ── */
function CreditFissionTab() {
  const [rules, setRules] = useState(creditRules);
  const toggleRule = (idx: number) => {
    const next = [...rules];
    next[idx] = { ...next[idx], enabled: !next[idx].enabled };
    setRules(next);
  };

  return (
    <div className="space-y-5">
      {/* Credit Rule Config */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Settings size={18} style={{ color: "#D4AF37" }} />
          积分规则配置
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-warm-gray">行为</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">获得积分</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">日限</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-warm-gray">启用</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <motion.tr
                  key={rule.action}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-sand/50 hover:bg-cream/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-charcoal">{rule.action}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-semibold" style={{ color: "#059669" }}>+{rule.points}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-warm-gray">{rule.dailyLimit}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(i)} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Redeem Settings */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Gift size={18} style={{ color: "#D4AF37" }} />
            积分兑换设置
          </h3>
          <div className="space-y-3">
            {creditRedeems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-sand bg-cream/20 p-3 hover:bg-cream/40 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                    <Icon size={18} style={{ color: "#D4AF37" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{item.name}</p>
                    <p className="text-[11px] text-warm-gray">价值 {item.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "#059669" }}>{item.points}</p>
                    <p className="text-[10px] text-warm-gray">积分</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Credit History */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Clock size={18} style={{ color: "#D4AF37" }} />
            积分流水
          </h3>
          <div className="space-y-0 max-h-[340px] overflow-y-auto pr-1">
            {creditHistory.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 py-2.5 border-b border-sand/50 last:border-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 shrink-0">
                  <Coins size={13} style={{ color: "#D4AF37" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal truncate">{item.user} · {item.action}</p>
                  <p className="text-[10px] text-warm-gray">{item.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${item.points > 0 ? "text-emerald" : "text-coral"}`}>
                    {item.points > 0 ? "+" : ""}{item.points}
                  </p>
                  <p className="text-[10px] text-warm-gray">余{item.balance}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Tab 5: Community Ops ── */
function CommunityOpsTab() {
  const [autoWelcome, setAutoWelcome] = useState(true);
  const [autoJobPush, setAutoJobPush] = useState(true);
  const [autoHotTopic, setAutoHotTopic] = useState(false);
  const [autoReply, setAutoReply] = useState(true);

  return (
    <div className="space-y-5">
      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "总群组", value: "5", icon: Globe, color: "#D4AF37" },
          { label: "总成员", value: "13,140", icon: Users, color: "#059669" },
          { label: "日活用户", value: "3,100", icon: Eye, color: "#E85D3E" },
          { label: "日均消息", value: "38,200", icon: MessageCircle, color: "#8B7355" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-lg font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-warm-gray">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Group Management */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Globe size={18} style={{ color: "#D4AF37" }} />
          群组管理
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-warm-gray">群组名称</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-warm-gray">平台</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">成员</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">日活</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">周活</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">消息量</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-warm-gray">退群率</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-warm-gray">状态</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((cm, i) => (
                <motion.tr
                  key={cm.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-sand/50 hover:bg-cream/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-charcoal">{cm.name}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: cm.platform === "telegram" ? "rgba(56,161,243,0.1)" : "rgba(59,89,152,0.1)",
                        color: cm.platform === "telegram" ? "#38A1F3" : "#3B5998",
                      }}
                    >
                      {cm.platform === "telegram" ? <Send size={10} /> : <Facebook size={10} />}
                      {cm.platform === "telegram" ? "Telegram" : "Facebook"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-charcoal">{cm.members.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald">{cm.dailyActive.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-charcoal">{cm.weeklyActive.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-charcoal">{cm.messageCount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span style={{ color: cm.leaveRate > 3 ? "#E85D3E" : "#059669" }}>
                      {cm.leaveRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: cm.status === "active" ? "rgba(5,150,105,0.12)" : "rgba(156,149,136,0.12)",
                        color: cm.status === "active" ? "#059669" : "#9C9588",
                      }}
                    >
                      {cm.status === "active" ? "运行中" : "已停用"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Auto Message Settings */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Zap size={18} style={{ color: "#D4AF37" }} />
          自动消息设置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: "welcome",
              title: "欢迎消息",
              desc: "新成员入群时自动发送欢迎语和引导",
              enabled: autoWelcome,
              setEnabled: setAutoWelcome,
              icon: Users,
            },
            {
              key: "jobPush",
              title: "每日职位推送",
              desc: "每天早上8点自动推送热门职位",
              enabled: autoJobPush,
              setEnabled: setAutoJobPush,
              icon: Briefcase,
            },
            {
              key: "hotTopic",
              title: "热门话题自动发布",
              desc: "自动发布行业热点和求职技巧",
              enabled: autoHotTopic,
              setEnabled: setAutoHotTopic,
              icon: TrendingUp,
            },
            {
              key: "autoReply",
              title: "用户提问自动回复",
              desc: "基于关键词自动回复常见问题",
              enabled: autoReply,
              setEnabled: setAutoReply,
              icon: MessageCircle,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-start gap-3 rounded-xl border border-sand bg-cream/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 shrink-0">
                  <Icon size={18} style={{ color: "#D4AF37" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-charcoal">{item.title}</h4>
                    <Switch checked={item.enabled} onCheckedChange={item.setEnabled} />
                  </div>
                  <p className="text-xs text-warm-gray mt-1">{item.desc}</p>
                  {item.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2"
                    >
                      <Button variant="outline" size="sm" className="h-7 text-[11px] border-sand">
                        <Edit3 size={11} className="mr-1" /> 编辑模板
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
const tabs = [
  { key: "campaigns", label: "裂变活动", icon: Rocket },
  { key: "invite", label: "邀请返利", icon: Users },
  { key: "chain", label: "推荐链", icon: Link2 },
  { key: "credit", label: "积分裂变", icon: Coins },
  { key: "community", label: "社群运营", icon: MessageCircle },
];

export default function GrowthEngine() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <Rocket size={22} style={{ color: "#D4AF37" }} />
            裂变增长引擎
          </h2>
          <p className="text-sm text-warm-gray mt-1">管理裂变活动、邀请返利、积分体系与社群运营</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-gold hover:shadow-gold-hover"
        >
          <Plus size={16} className="mr-1.5" />
          新建裂变活动
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "进行中活动", value: "5", change: "+2 本月", icon: Rocket, color: "#D4AF37" },
          { label: "总裂变人数", value: "12,420", change: "+28%", icon: Users, color: "#059669" },
          { label: "平均裂变系数", value: "2.54", change: "+0.3", icon: TrendingUp, color: "#E85D3E" },
          { label: "累计发放奖励", value: "$8,920", change: "+15%", icon: Wallet, color: "#8B7355" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <span className="text-[10px] font-medium" style={{ color: "#059669" }}>{stat.change}</span>
              </div>
              <p className="text-xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-warm-gray">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 rounded-xl border border-sand bg-white p-1.5 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-deep-brown text-white shadow-gold"
                  : "text-warm-gray hover:text-charcoal hover:bg-cream"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "campaigns" && <CampaignsTab onCreate={() => setShowModal(true)} />}
          {activeTab === "invite" && <InviteRewardsTab />}
          {activeTab === "chain" && <ReferralChainTab />}
          {activeTab === "credit" && <CreditFissionTab />}
          {activeTab === "community" && <CommunityOpsTab />}
        </motion.div>
      </AnimatePresence>

      {/* Real-time Feed */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
          <CircleDot size={14} className="text-emerald animate-pulse" />
          实时裂变动态
        </h3>
        <div className="flex flex-wrap gap-2">
          {viralFeed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 rounded-full border border-sand bg-cream/30 px-3 py-1.5 text-xs"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[9px] font-bold text-gold">
                {item.user.charAt(0)}
              </div>
              <span className="text-charcoal font-medium">{item.user}</span>
              <span className="text-warm-gray">{item.action}</span>
              {item.target && <span className="text-charcoal">{item.target}</span>}
              <span className="font-semibold" style={{ color: "#059669" }}>{item.reward}</span>
              <span className="text-warm-gray text-[10px]">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Campaign Modal */}
      <GrowthCampaignModal open={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
}
