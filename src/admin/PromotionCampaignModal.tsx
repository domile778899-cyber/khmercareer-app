import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Megaphone,
  Users,
  Sparkles,
  Calendar,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MessageSquare,
  Smartphone,
  Zap,
  Upload,
  RefreshCw,
  Globe,
  Building2,
  Briefcase,
  GraduationCap,
  Factory,
  Utensils,
  Hotel,
  Truck,
  Monitor,
  Wand2,
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

/* ── types ── */
interface CampaignData {
  name: string;
  type: string;
  platforms: string[];
  regions: string[];
  industries: string[];
  jobLevels: string[];
  languages: string[];
  topic: string;
  content: string;
  startDate: string;
  endDate: string;
  frequency: string;
  publishTime: string;
}

interface PromotionCampaignModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<CampaignData>;
}

/* ── step config ── */
const steps = [
  { key: 1, label: "基础信息", icon: Megaphone },
  { key: 2, label: "目标受众", icon: Users },
  { key: 3, label: "AI内容", icon: Sparkles },
  { key: 4, label: "排期设置", icon: Calendar },
  { key: 5, label: "确认发布", icon: Send },
];

const platformOptions = [
  { key: "Facebook", label: "Facebook", icon: Facebook, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { key: "Instagram", label: "Instagram", icon: Instagram, color: "bg-pink-50 text-pink-600 border-pink-200" },
  { key: "TikTok", label: "TikTok", icon: Smartphone, color: "bg-gray-50 text-gray-800 border-gray-200" },
  { key: "Telegram", label: "Telegram", icon: Send, color: "bg-sky-50 text-sky-600 border-sky-200" },
  { key: "YouTube", label: "YouTube", icon: Youtube, color: "bg-red-50 text-red-600 border-red-200" },
  { key: "Email", label: "Email", icon: Mail, color: "bg-orange-50 text-orange-600 border-orange-200" },
  { key: "SMS", label: "SMS", icon: MessageSquare, color: "bg-green-50 text-green-600 border-green-200" },
  { key: "Push", label: "推送通知", icon: Zap, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

const regionOptions = ["金边", "暹粒", "西哈努克", "马德望", "干丹", "磅湛", "卜迭棉芷", "全国"];
const industryOptions = [
  { label: "制造业", icon: Factory },
  { label: "餐饮服务", icon: Utensils },
  { label: "旅游酒店", icon: Hotel },
  { label: "物流运输", icon: Truck },
  { label: "IT科技", icon: Monitor },
  { label: "建筑工程", icon: Building2 },
  { label: "教育培训", icon: GraduationCap },
  { label: "贸易零售", icon: Briefcase },
];
const jobLevelOptions = ["初级", "中级", "高级", "管理层", "不限"];
const languageOptions = ["高棉语", "中文", "英文", "泰语", "越南语"];

/* ── mock AI generation ── */
const mockGenerateContent = (topic: string) => {
  return `🔥 ${topic}！

📢 我们正在大规模招聘，机会难得！

💰 薪资福利：
• 月薪 $250-450（根据经验）
• 包住宿+工作餐
• 法定节假日+带薪年假
• 医疗保险全覆盖

📍 工作地点：金边/西港
🎯 招聘人数：50+ 名
⏰ 截止时间：本月底

✅ 应聘要求：
• 年龄18-45岁
• 身体健康，吃苦耐劳
• 有无经验均可，提供培训

👉 立即申请：khmercareer.com/apply
📞 咨询：+855 23 XXX XXX

#柬埔寨招聘 #${topic.replace(/\s+/g, "")} #KhmerCareer`;
};

/* ═══════════════════════════════════
   Step 1: Basic Info
   ═══════════════════════════════════ */
function StepBasicInfo({ data, onChange }: { data: CampaignData; onChange: (d: Partial<CampaignData>) => void }) {
  const togglePlatform = (platform: string) => {
    const current = data.platforms;
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    onChange({ platforms: updated });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          活动名称 <span className="text-coral">*</span>
        </label>
        <Input
          placeholder="例如：金边服装厂大规模招聘"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="bg-warm-white border-sand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          活动类型 <span className="text-coral">*</span>
        </label>
        <Select value={data.type} onValueChange={(v) => onChange({ type: v })}>
          <SelectTrigger className="bg-warm-white border-sand">
            <SelectValue placeholder="选择活动类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="社媒推广">社媒推广</SelectItem>
            <SelectItem value="SEO文章">SEO文章</SelectItem>
            <SelectItem value="邮件营销">邮件营销</SelectItem>
            <SelectItem value="短信推送">短信推送</SelectItem>
            <SelectItem value="推送通知">推送通知</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          目标平台 <span className="text-coral">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {platformOptions.map((p) => {
            const Icon = p.icon;
            const selected = data.platforms.includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => togglePlatform(p.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  selected
                    ? `${p.color} ring-2 ring-offset-1`
                    : "bg-white text-warm-gray border-sand hover:bg-cream"
                }`}
              >
                <Icon className="w-4 h-4" />
                {p.label}
                {selected && <Check className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </div>
        {data.platforms.length === 0 && (
          <p className="text-xs text-coral mt-1.5">请至少选择一个目标平台</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Step 2: Target Audience
   ═══════════════════════════════════ */
function StepAudience({ data, onChange }: { data: CampaignData; onChange: (d: Partial<CampaignData>) => void }) {
  const toggleArray = (field: keyof CampaignData, value: string) => {
    const current = data[field] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ [field]: updated });
  };

  return (
    <div className="space-y-5">
      {/* Regions */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">目标地区</label>
        <div className="flex flex-wrap gap-2">
          {regionOptions.map((r) => {
            const selected = data.regions.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleArray("regions", r)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                  selected
                    ? "bg-deep-brown text-white border-deep-brown shadow-gold"
                    : "bg-white text-warm-gray border-sand hover:bg-cream"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Industries */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">目标行业</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {industryOptions.map((ind) => {
            const Icon = ind.icon;
            const selected = data.industries.includes(ind.label);
            return (
              <button
                key={ind.label}
                onClick={() => toggleArray("industries", ind.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  selected
                    ? "bg-gold/10 text-gold-dark border-gold shadow-gold"
                    : "bg-white text-warm-gray border-sand hover:bg-cream"
                }`}
              >
                <Icon className="w-4 h-4" />
                {ind.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Levels */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">职位级别</label>
        <div className="flex flex-wrap gap-2">
          {jobLevelOptions.map((level) => {
            const selected = data.jobLevels.includes(level);
            return (
              <button
                key={level}
                onClick={() => toggleArray("jobLevels", level)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  selected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-warm-gray border-sand hover:bg-cream"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">语言偏好</label>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((lang) => {
            const selected = data.languages.includes(lang);
            return (
              <button
                key={lang}
                onClick={() => toggleArray("languages", lang)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  selected
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-warm-gray border-sand hover:bg-cream"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Step 3: AI Content
   ═══════════════════════════════════ */
function StepAIContent({ data, onChange }: { data: CampaignData; onChange: (d: Partial<CampaignData>) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    if (!data.topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      onChange({ content: mockGenerateContent(data.topic) });
      setIsGenerating(false);
      setHasGenerated(true);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">内容主题</label>
        <Input
          placeholder="输入招聘主题，如：服装厂招聘缝纫工"
          value={data.topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className="bg-warm-white border-sand"
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !data.topic.trim()}
        className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white shadow-gold hover:shadow-gold-hover disabled:opacity-50 h-10"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            AI生成中...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            {hasGenerated ? "重新生成" : "AI生成文案"}
          </>
        )}
      </Button>

      {/* Content Editor */}
      <AnimatePresence>
        {(data.content || hasGenerated) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-charcoal mb-1.5">文案内容（可编辑）</label>
            <Textarea
              value={data.content}
              onChange={(e) => onChange({ content: e.target.value })}
              className="min-h-[220px] bg-warm-white border-sand resize-none text-sm leading-relaxed"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">上传媒体</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-video border-2 border-dashed border-sand rounded-xl flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:bg-gold/5 cursor-pointer transition-all">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">上传图片</span>
          </div>
          <div className="aspect-video border-2 border-dashed border-sand rounded-xl flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:bg-gold/5 cursor-pointer transition-all">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">上传视频</span>
          </div>
          <div className="aspect-video bg-cream rounded-xl flex items-center justify-center text-xs text-warm-gray">
            <span className="text-center px-2">AI配图<br />即将上线</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Step 4: Schedule
   ═══════════════════════════════════ */
function StepSchedule({ data, onChange }: { data: CampaignData; onChange: (d: Partial<CampaignData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">开始日期</label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="bg-warm-white border-sand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">结束日期</label>
          <Input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="bg-warm-white border-sand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">发布频率</label>
        <Select value={data.frequency} onValueChange={(v) => onChange({ frequency: v })}>
          <SelectTrigger className="bg-warm-white border-sand">
            <SelectValue placeholder="选择发布频率" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">每日发布</SelectItem>
            <SelectItem value="workday">仅工作日</SelectItem>
            <SelectItem value="weekly">每周一次</SelectItem>
            <SelectItem value="biweekly">每周两次</SelectItem>
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">每日发布时间</label>
        <Select value={data.publishTime} onValueChange={(v) => onChange({ publishTime: v })}>
          <SelectTrigger className="bg-warm-white border-sand">
            <SelectValue placeholder="选择发布时间" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="08:00">08:00 早上</SelectItem>
            <SelectItem value="09:00">09:00 上午</SelectItem>
            <SelectItem value="10:00">10:00 上午</SelectItem>
            <SelectItem value="12:00">12:00 中午</SelectItem>
            <SelectItem value="14:00">14:00 下午</SelectItem>
            <SelectItem value="16:00">16:00 下午</SelectItem>
            <SelectItem value="18:00">18:00 傍晚</SelectItem>
            <SelectItem value="20:00">20:00 晚上</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview summary */}
      <div className="bg-cream rounded-xl p-4 border border-sand">
        <h4 className="text-sm font-medium text-charcoal mb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gold" />
          排期预览
        </h4>
        {data.startDate && data.endDate ? (
          <div className="text-sm text-warm-gray space-y-1">
            <p>📅 活动周期：{data.startDate} 至 {data.endDate}</p>
            <p>🔄 发布频率：{data.frequency ? { daily: "每日", workday: "仅工作日", weekly: "每周一次", biweekly: "每周两次", custom: "自定义" }[data.frequency] : "未设置"}</p>
            <p>⏰ 发布时间：{data.publishTime || "未设置"}</p>
          </div>
        ) : (
          <p className="text-sm text-warm-gray">请设置日期查看排期预览</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Step 5: Confirm & Publish
   ═══════════════════════════════════ */
function StepConfirm({ data }: { data: CampaignData }) {
  return (
    <div className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Check className="w-5 h-5 text-emerald mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-emerald-800">准备发布</h4>
          <p className="text-xs text-emerald-600 mt-0.5">请确认以下信息无误后点击发布按钮</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-sand divide-y divide-sand">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">活动名称</span>
            <span className="text-sm font-medium text-charcoal">{data.name || "-"}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">活动类型</span>
            <Badge variant="outline">{data.type || "-"}</Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">目标平台</span>
            <div className="flex gap-1 flex-wrap justify-end">
              {data.platforms.map((p) => (
                <Badge key={p} className="text-[10px] bg-cream">{p}</Badge>
              )) || "-"}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">目标地区</span>
            <span className="text-sm text-charcoal">{data.regions.join(", ") || "-"}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">目标行业</span>
            <span className="text-sm text-charcoal">{data.industries.join(", ") || "-"}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">活动周期</span>
            <span className="text-sm text-charcoal">{data.startDate} ~ {data.endDate}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warm-gray">发布频率</span>
            <span className="text-sm text-charcoal">{data.frequency || "-"} @ {data.publishTime || "-"}</span>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      {data.content && (
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">文案预览</label>
          <div className="bg-cream rounded-xl p-4 border border-sand">
            <pre className="text-sm whitespace-pre-wrap text-charcoal leading-relaxed font-body">
              {data.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   Main Modal Component
   ═══════════════════════════════════ */
export function PromotionCampaignModal({ open, onClose, initialData }: PromotionCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [data, setData] = useState<CampaignData>({
    name: initialData?.name || "",
    type: "",
    platforms: [],
    regions: [],
    industries: [],
    jobLevels: [],
    languages: [],
    topic: "",
    content: "",
    startDate: "",
    endDate: "",
    frequency: "",
    publishTime: "",
  });

  const updateData = (partial: Partial<CampaignData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.name.trim() && data.type && data.platforms.length > 0;
      case 2: return true;
      case 3: return data.content.trim().length > 0;
      case 4: return data.startDate && data.endDate && data.frequency && data.publishTime;
      case 5: return true;
      default: return false;
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
          onClose();
        }, 2000);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIsPublished(false);
    onClose();
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
                <Megaphone className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-semibold text-charcoal">新建推广活动</h2>
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
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-pulse-glow">
                      <Check className="w-10 h-10 text-emerald" />
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal mb-2">发布成功！</h3>
                    <p className="text-sm text-warm-gray text-center max-w-xs">
                      推广活动"{data.name}"已成功创建并开始执行
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
                    {currentStep === 2 && <StepAudience data={data} onChange={updateData} />}
                    {currentStep === 3 && <StepAIContent data={data} onChange={updateData} />}
                    {currentStep === 4 && <StepSchedule data={data} onChange={updateData} />}
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
