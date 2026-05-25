import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Rocket,
  Users,
  Gift,
  Settings,
  Image,
  Send,
  Calendar,
  Type,
  Upload,
  Coins,
  Banknote,
  Crown,
  Percent,
  Layers,
  Shield,
  Megaphone,
  Share2,
  GraduationCap,
  MessageCircle,
  RefreshCw,
  Sparkles,
  UserPlus,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
interface CampaignFormData {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;

  rewardType: string;
  inviterReward: number;
  inviteeReward: number;
  enableTier2: boolean;
  tier2Reward: number;
  enableTier3: boolean;
  tier3Reward: number;
  dailyLimit: number;
  totalLimit: number;

  targetCount: number;
  viralDepth: number;
  minInviteThreshold: number;
  antiCheat: boolean;
  sameIpLimit: number;
  deviceFingerprint: boolean;

  shareTitle: string;
  shareDescription: string;
  shareImage: string;
  customCopy: string;
}

interface GrowthCampaignModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<CampaignFormData>;
}

/* ═══════════════════════════════════════════════
   Step Config
   ═══════════════════════════════════════════════ */
const steps = [
  { key: 1, label: "基础信息", icon: Rocket },
  { key: 2, label: "奖励设置", icon: Gift },
  { key: 3, label: "规则配置", icon: Settings },
  { key: 4, label: "页面素材", icon: Image },
  { key: 5, label: "确认发布", icon: Send },
];

const campaignTypes = [
  { value: "jobseeker_invite", label: "求职者邀请", icon: UserPlus, desc: "邀请求职者注册并完善简历" },
  { value: "employer_invite", label: "企业邀请", icon: Building2, desc: "邀请企业入驻并发布职位" },
  { value: "share_job", label: "分享职位", icon: Share2, desc: "分享职位到社交媒体获奖励" },
  { value: "share_course", label: "分享课程", icon: GraduationCap, desc: "分享课程链接获积分奖励" },
  { value: "community_join", label: "社群加入", icon: MessageCircle, desc: "加入Telegram/FB群组得福利" },
];

const rewardTypeOptions = [
  { value: "cash", label: "现金", icon: Banknote, color: "#059669" },
  { value: "credit", label: "积分", icon: Coins, color: "#D4AF37" },
  { value: "premium", label: "会员", icon: Crown, color: "#8B7355" },
  { value: "discount", label: "折扣", icon: Percent, color: "#E85D3E" },
];

const defaultForm: CampaignFormData = {
  name: "",
  type: "",
  startDate: "",
  endDate: "",
  description: "",
  rewardType: "cash",
  inviterReward: 5,
  inviteeReward: 3,
  enableTier2: true,
  tier2Reward: 2,
  enableTier3: false,
  tier3Reward: 1,
  dailyLimit: 100,
  totalLimit: 5000,
  targetCount: 500,
  viralDepth: 2,
  minInviteThreshold: 1,
  antiCheat: true,
  sameIpLimit: 3,
  deviceFingerprint: true,
  shareTitle: "",
  shareDescription: "",
  shareImage: "",
  customCopy: "",
};

/* ═══════════════════════════════════════════════
   Step 1: Basic Info
   ═══════════════════════════════════════════════ */
function StepBasicInfo({ data, onChange }: { data: CampaignFormData; onChange: (d: Partial<CampaignFormData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          活动名称 <span className="text-coral">*</span>
        </label>
        <Input
          placeholder="例如：邀请好友得现金红包"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="bg-warm-white border-sand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          活动类型 <span className="text-coral">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {campaignTypes.map((t) => {
            const Icon = t.icon;
            const selected = data.type === t.value;
            return (
              <button
                key={t.value}
                onClick={() => onChange({ type: t.value })}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  selected
                    ? "border-gold bg-gold/5 shadow-gold ring-1 ring-gold/30"
                    : "border-sand bg-white hover:bg-cream hover:border-gold/30"
                }`}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: selected ? "rgba(212,175,55,0.15)" : "rgba(245,240,232,0.8)" }}
                >
                  <Icon size={18} style={{ color: selected ? "#D4AF37" : "#9C9588" }} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected ? "text-gold-dark" : "text-charcoal"}`}>{t.label}</p>
                  <p className="text-[11px] text-warm-gray mt-0.5">{t.desc}</p>
                </div>
                {selected && <Check size={16} className="ml-auto shrink-0 text-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">开始日期 <span className="text-coral">*</span></label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="bg-warm-white border-sand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">结束日期 <span className="text-coral">*</span></label>
          <Input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="bg-warm-white border-sand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">活动描述</label>
        <Textarea
          placeholder="描述活动的目的和规则..."
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="bg-warm-white border-sand min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 2: Reward Settings
   ═══════════════════════════════════════════════ */
function StepReward({ data, onChange }: { data: CampaignFormData; onChange: (d: Partial<CampaignFormData>) => void }) {
  const rewardType = rewardTypeOptions.find((r) => r.value === data.rewardType);

  return (
    <div className="space-y-5">
      {/* Reward Type */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">奖励类型</label>
        <div className="flex flex-wrap gap-2">
          {rewardTypeOptions.map((rt) => {
            const Icon = rt.icon;
            const selected = data.rewardType === rt.value;
            return (
              <button
                key={rt.value}
                onClick={() => onChange({ rewardType: rt.value })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? "border-gold bg-gold/5 text-gold-dark shadow-gold ring-1 ring-gold/30"
                    : "border-sand bg-white text-warm-gray hover:bg-cream"
                }`}
              >
                <Icon size={16} style={{ color: selected ? rt.color : "#9C9588" }} />
                {rt.label}
                {selected && <Check size={14} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 1 Rewards */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-gold/10 text-gold-dark border-gold/30">一级奖励</Badge>
          <span className="text-xs text-warm-gray">直接邀请的双方奖励</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1.5">
              邀请人奖励 ({rewardType?.label})
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ inviterReward: Math.max(0, data.inviterReward - 1) })}
              >
                -
              </Button>
              <Input
                type="number"
                value={data.inviterReward}
                onChange={(e) => onChange({ inviterReward: Number(e.target.value) })}
                className="h-9 text-center bg-white border-sand"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ inviterReward: data.inviterReward + 1 })}
              >
                +
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1.5">
              被邀请人奖励 ({rewardType?.label})
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ inviteeReward: Math.max(0, data.inviteeReward - 1) })}
              >
                -
              </Button>
              <Input
                type="number"
                value={data.inviteeReward}
                onChange={(e) => onChange({ inviteeReward: Number(e.target.value) })}
                className="h-9 text-center bg-white border-sand"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ inviteeReward: data.inviteeReward + 1 })}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2 */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald/10 text-emerald border-emerald/30">二级奖励</Badge>
            <span className="text-xs text-warm-gray">被邀请人再邀请他人</span>
          </div>
          <Switch
            checked={data.enableTier2}
            onCheckedChange={(v) => onChange({ enableTier2: v })}
          />
        </div>
        <AnimatePresence>
          {data.enableTier2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs font-medium text-warm-gray mb-1.5">
                二级邀请奖励 ({rewardType?.label})
              </label>
              <div className="flex items-center gap-2 max-w-[200px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-sand"
                  onClick={() => onChange({ tier2Reward: Math.max(0, data.tier2Reward - 1) })}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={data.tier2Reward}
                  onChange={(e) => onChange({ tier2Reward: Number(e.target.value) })}
                  className="h-9 text-center bg-white border-sand"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-sand"
                  onClick={() => onChange({ tier2Reward: data.tier2Reward + 1 })}
                >
                  +
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tier 3 */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-coral/10 text-coral border-coral/30">三级奖励</Badge>
            <span className="text-xs text-warm-gray">更深层的裂变奖励</span>
          </div>
          <Switch
            checked={data.enableTier3}
            onCheckedChange={(v) => onChange({ enableTier3: v })}
          />
        </div>
        <AnimatePresence>
          {data.enableTier3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs font-medium text-warm-gray mb-1.5">
                三级邀请奖励 ({rewardType?.label})
              </label>
              <div className="flex items-center gap-2 max-w-[200px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-sand"
                  onClick={() => onChange({ tier3Reward: Math.max(0, data.tier3Reward - 1) })}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={data.tier3Reward}
                  onChange={(e) => onChange({ tier3Reward: Number(e.target.value) })}
                  className="h-9 text-center bg-white border-sand"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-sand"
                  onClick={() => onChange({ tier3Reward: data.tier3Reward + 1 })}
                >
                  +
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">每日上限 ({rewardType?.label})</label>
          <Input
            type="number"
            value={data.dailyLimit}
            onChange={(e) => onChange({ dailyLimit: Number(e.target.value) })}
            className="bg-warm-white border-sand"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">总上限 ({rewardType?.label})</label>
          <Input
            type="number"
            value={data.totalLimit}
            onChange={(e) => onChange({ totalLimit: Number(e.target.value) })}
            className="bg-warm-white border-sand"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 3: Rule Config
   ═══════════════════════════════════════════════ */
function StepRules({ data, onChange }: { data: CampaignFormData; onChange: (d: Partial<CampaignFormData>) => void }) {
  return (
    <div className="space-y-5">
      {/* Target */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <TargetIcon size={16} style={{ color: "#D4AF37" }} />
          <span className="text-sm font-medium text-charcoal">目标设置</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1.5">目标邀请人数</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ targetCount: Math.max(1, data.targetCount - 50) })}
              >
                -
              </Button>
              <Input
                type="number"
                value={data.targetCount}
                onChange={(e) => onChange({ targetCount: Number(e.target.value) })}
                className="h-9 text-center bg-white border-sand"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ targetCount: data.targetCount + 50 })}
              >
                +
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1.5">最低邀请门槛</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ minInviteThreshold: Math.max(0, data.minInviteThreshold - 1) })}
              >
                -
              </Button>
              <Input
                type="number"
                value={data.minInviteThreshold}
                onChange={(e) => onChange({ minInviteThreshold: Number(e.target.value) })}
                className="h-9 text-center bg-white border-sand"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-sand"
                onClick={() => onChange({ minInviteThreshold: data.minInviteThreshold + 1 })}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Viral Depth */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: "#059669" }} />
          <span className="text-sm font-medium text-charcoal">裂变层级</span>
        </div>
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((depth) => (
            <button
              key={depth}
              onClick={() => onChange({ viralDepth: depth })}
              className={`flex flex-col items-center gap-2 rounded-xl border px-5 py-3 transition-all ${
                data.viralDepth === depth
                  ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                  : "border-sand bg-white hover:bg-cream"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  data.viralDepth === depth
                    ? "bg-gold text-white"
                    : "bg-sand text-warm-gray"
                }`}
              >
                {depth}
              </div>
              <span className={`text-xs font-medium ${data.viralDepth === depth ? "text-gold-dark" : "text-warm-gray"}`}>
                {depth === 1 ? "一级裂变" : depth === 2 ? "二级裂变" : "三级裂变"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Anti-Cheat */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: "#E85D3E" }} />
            <span className="text-sm font-medium text-charcoal">反作弊规则</span>
          </div>
          <Switch
            checked={data.antiCheat}
            onCheckedChange={(v) => onChange({ antiCheat: v })}
          />
        </div>
        <AnimatePresence>
          {data.antiCheat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5">同IP限制（个设备）</label>
                <div className="flex items-center gap-2 max-w-[200px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 border-sand"
                    onClick={() => onChange({ sameIpLimit: Math.max(1, data.sameIpLimit - 1) })}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={data.sameIpLimit}
                    onChange={(e) => onChange({ sameIpLimit: Number(e.target.value) })}
                    className="h-9 text-center bg-white border-sand"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 border-sand"
                    onClick={() => onChange({ sameIpLimit: data.sameIpLimit + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-sand bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <SmartphoneIcon size={14} className="text-warm-gray" />
                  <span className="text-sm text-charcoal">设备指纹验证</span>
                </div>
                <Switch
                  checked={data.deviceFingerprint}
                  onCheckedChange={(v) => onChange({ deviceFingerprint: v })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 4: Page Assets
   ═══════════════════════════════════════════════ */
function StepAssets({ data, onChange }: { data: CampaignFormData; onChange: (d: Partial<CampaignFormData>) => void }) {
  return (
    <div className="space-y-5">
      {/* Share Title & Description */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Type size={16} style={{ color: "#D4AF37" }} />
          <span className="text-sm font-medium text-charcoal">分享文案</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">分享页面标题</label>
          <Input
            placeholder="例如：邀请好友，各得$5现金！"
            value={data.shareTitle}
            onChange={(e) => onChange({ shareTitle: e.target.value })}
            className="bg-warm-white border-sand"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">分享页面描述</label>
          <Textarea
            placeholder="输入分享页面的描述文案..."
            value={data.shareDescription}
            onChange={(e) => onChange({ shareDescription: e.target.value })}
            className="bg-warm-white border-sand min-h-[80px] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">自定义分享文案模板</label>
          <Textarea
            placeholder="支持变量: {inviter} = 邀请人名字, {reward} = 奖励金额..."
            value={data.customCopy}
            onChange={(e) => onChange({ customCopy: e.target.value })}
            className="bg-warm-white border-sand min-h-[100px] resize-none"
          />
          <p className="text-[10px] text-warm-gray mt-1.5">
            可用变量：{"{inviter}"} - 邀请人昵称, {"{reward}"} - 奖励金额, {"{link}"} - 邀请链接
          </p>
        </div>
      </div>

      {/* Share Image */}
      <div className="rounded-xl border border-sand bg-cream/30 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Image size={16} style={{ color: "#059669" }} />
          <span className="text-sm font-medium text-charcoal">分享图片</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-sand bg-white flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:bg-gold/5 cursor-pointer transition-all"
          >
            <Upload size={24} className="mb-2" />
            <span className="text-xs">上传主图</span>
            <span className="text-[10px] text-warm-gray mt-0.5">1200 x 630</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-sand bg-white flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:bg-gold/5 cursor-pointer transition-all"
          >
            <Upload size={24} className="mb-2" />
            <span className="text-xs">上传缩略图</span>
            <span className="text-[10px] text-warm-gray mt-0.5">300 x 300</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-sand bg-white flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:bg-gold/5 cursor-pointer transition-all"
          >
            <Sparkles size={24} className="mb-2 text-gold" />
            <span className="text-xs">AI生成图片</span>
            <span className="text-[10px] text-warm-gray mt-0.5">一键生成</span>
          </motion.div>
        </div>
      </div>

      {/* Preview */}
      {(data.shareTitle || data.shareDescription) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-gold/30 bg-gold/5 p-4"
        >
          <h4 className="text-xs font-medium text-gold-dark mb-2 flex items-center gap-1.5">
            <EyeIcon size={12} />
            分享预览
          </h4>
          <div className="rounded-lg border border-sand bg-white p-3">
            {data.shareTitle && <p className="text-sm font-semibold text-charcoal">{data.shareTitle}</p>}
            {data.shareDescription && <p className="text-xs text-warm-gray mt-1">{data.shareDescription}</p>}
            <div className="mt-2 rounded-md bg-cream px-2 py-1 text-[10px] text-warm-gray font-mono truncate">
              khmercareer.com/invite/abc123
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 5: Confirm & Publish
   ═══════════════════════════════════════════════ */
function StepConfirm({ data }: { data: CampaignFormData }) {
  const campaignType = campaignTypes.find((t) => t.value === data.type);
  const rewardType = rewardTypeOptions.find((r) => r.value === data.rewardType);

  return (
    <div className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Check size={20} className="text-emerald mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-emerald-800">准备发布</h4>
          <p className="text-xs text-emerald-600 mt-0.5">请确认以下信息无误后点击发布按钮</p>
        </div>
      </div>

      <div className="rounded-xl border border-sand bg-white divide-y divide-sand">
        {/* Basic */}
        <div className="p-4">
          <h4 className="text-xs font-medium text-warm-gray mb-2.5 uppercase tracking-wider">基础信息</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">活动名称</span>
              <span className="text-sm font-medium text-charcoal">{data.name || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">活动类型</span>
              <span className="text-sm text-charcoal">{campaignType?.label || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">活动周期</span>
              <span className="text-sm text-charcoal">{data.startDate} ~ {data.endDate}</span>
            </div>
          </div>
        </div>

        {/* Reward */}
        <div className="p-4">
          <h4 className="text-xs font-medium text-warm-gray mb-2.5 uppercase tracking-wider">奖励设置</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">奖励类型</span>
              <Badge variant="outline" className="text-[11px]">{rewardType?.label || "-"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">邀请人奖励</span>
              <span className="text-sm font-medium text-charcoal">{data.inviterReward} {rewardType?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">被邀请人奖励</span>
              <span className="text-sm font-medium text-charcoal">{data.inviteeReward} {rewardType?.label}</span>
            </div>
            {data.enableTier2 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-warm-gray">二级奖励</span>
                <span className="text-sm font-medium text-charcoal">{data.tier2Reward} {rewardType?.label}</span>
              </div>
            )}
            {data.enableTier3 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-warm-gray">三级奖励</span>
                <span className="text-sm font-medium text-charcoal">{data.tier3Reward} {rewardType?.label}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">上限设置</span>
              <span className="text-sm text-charcoal">日{data.dailyLimit} / 总{data.totalLimit}</span>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="p-4">
          <h4 className="text-xs font-medium text-warm-gray mb-2.5 uppercase tracking-wider">规则配置</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">目标人数</span>
              <span className="text-sm font-medium text-charcoal">{data.targetCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">裂变层级</span>
              <span className="text-sm text-charcoal">{data.viralDepth} 级</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">最低邀请门槛</span>
              <span className="text-sm text-charcoal">{data.minInviteThreshold} 人</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warm-gray">反作弊</span>
              <span className="text-sm text-charcoal">{data.antiCheat ? "已启用" : "已关闭"}</span>
            </div>
          </div>
        </div>

        {/* Assets */}
        {data.shareTitle && (
          <div className="p-4">
            <h4 className="text-xs font-medium text-warm-gray mb-2.5 uppercase tracking-wider">分享素材</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-warm-gray">分享标题</span>
                <span className="text-sm font-medium text-charcoal">{data.shareTitle}</span>
              </div>
              {data.shareDescription && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-warm-gray shrink-0">分享描述</span>
                  <span className="text-sm text-charcoal text-right">{data.shareDescription}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Modal Component
   ═══════════════════════════════════════════════ */
export function GrowthCampaignModal({ open, onClose, initialData }: GrowthCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [data, setData] = useState<CampaignFormData>({
    ...defaultForm,
    ...initialData,
  });

  const updateData = (partial: Partial<CampaignFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name.trim() && data.type && data.startDate && data.endDate;
      case 2:
        return data.inviterReward >= 0 && data.inviteeReward >= 0;
      case 3:
        return data.targetCount > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPublished(true);
        setTimeout(() => {
          setIsPublished(false);
          setCurrentStep(1);
          setData(defaultForm);
          onClose();
        }, 2000);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setIsPublished(false);
      setData(defaultForm);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-sand shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand bg-cream/30">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-semibold text-charcoal">新建裂变活动</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-sand transition-colors"
              >
                <X className="w-5 h-5 text-warm-gray" />
              </button>
            </div>

            {/* Step Indicator */}
            {!isPublished && (
              <div className="px-6 py-4 border-b border-sand bg-warm-white">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.key;
                    const isCompleted = currentStep > step.key;
                    return (
                      <div key={step.key} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isActive
                                ? "bg-deep-brown text-white shadow-gold"
                                : isCompleted
                                ? "bg-emerald text-white"
                                : "bg-sand text-warm-gray"
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <span
                            className={`text-xs mt-1.5 font-medium ${
                              isActive ? "text-charcoal" : isCompleted ? "text-emerald" : "text-warm-gray"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${
                              isCompleted ? "bg-emerald" : "bg-sand"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {isPublished ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-pulse">
                      <Check className="w-10 h-10 text-emerald" />
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal mb-2">发布成功！</h3>
                    <p className="text-sm text-warm-gray text-center max-w-xs">
                      裂变活动"{data.name}"已成功创建并开始运行
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentStep === 1 && <StepBasicInfo data={data} onChange={updateData} />}
                    {currentStep === 2 && <StepReward data={data} onChange={updateData} />}
                    {currentStep === 3 && <StepRules data={data} onChange={updateData} />}
                    {currentStep === 4 && <StepAssets data={data} onChange={updateData} />}
                    {currentStep === 5 && <StepConfirm data={data} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {!isPublished && (
              <div className="px-6 py-4 border-t border-sand bg-cream/30 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? handleClose : handleBack}
                  className="border-sand hover:bg-cream"
                  disabled={isSubmitting}
                >
                  {currentStep === 1 ? (
                    "取消"
                  ) : (
                    <>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      上一步
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-gold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                      发布中...
                    </>
                  ) : currentStep === 5 ? (
                    <>
                      <Send className="w-4 h-4 mr-1.5" />
                      确认发布
                    </>
                  ) : (
                    <>
                      下一步
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   Mini Icons (inline for Step 3)
   ═══════════════════════════════════════════════ */
function TargetIcon({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={style?.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function SmartphoneIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
    </svg>
  );
}
function EyeIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
