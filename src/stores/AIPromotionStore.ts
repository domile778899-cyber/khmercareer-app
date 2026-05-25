import { useState, useEffect, useCallback } from 'react';

// ==================== 类型定义 ====================

/** AI推广活动类型 */
export type AIPromotionType = 'social_media' | 'seo_article' | 'email' | 'sms' | 'push';

/** AI推广活动状态 */
export type AIPromotionStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';

/** 发布频率 */
export type PostingFrequency = 'daily' | 'weekly' | 'custom';

/** 文案模板分类 */
export type AITemplateCategory = 'job_promotion' | 'platform_promotion' | 'success_story' | 'industry_insight' | 'tips';

/** 文案语气 */
export type AITone = 'professional' | 'casual' | 'urgent' | 'inspirational';

/** AI推广活动接口 */
export interface AIPromotionCampaign {
  id: string;
  name: string;
  type: AIPromotionType;
  platforms: string[];
  targetAudience: {
    locations: string[];
    industries: string[];
    jobLevels: string[];
    languages: string[];
  };
  content: {
    headline: string;
    body: string;
    callToAction: string;
    imageUrl?: string;
    videoUrl?: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    postingTimes: string[];
    frequency: PostingFrequency;
  };
  aiGenerated: boolean;
  status: AIPromotionStatus;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    roi: number;
  };
  createdAt: string;
}

/** AI文案模板接口 */
export interface AIContentTemplate {
  id: string;
  name: string;
  category: AITemplateCategory;
  language: string;
  tone: AITone;
  template: string;
  variables: string[];
  usageCount: number;
  avgEngagement: number;
}

/** Store状态接口 */
export interface AIPromotionStoreState {
  campaigns: AIPromotionCampaign[];
  templates: AIContentTemplate[];
  isLoading: boolean;
  error: string | null;
}

// ==================== Constants ====================

const STORAGE_KEY_CAMPAIGNS = 'khmercareer_ai_promotion_campaigns';
const STORAGE_KEY_TEMPLATES = 'khmercareer_ai_promotion_templates';

// ==================== Mock 数据 ====================

const mockCampaigns: AIPromotionCampaign[] = [
  {
    id: 'camp-001',
    name: '金边科技人才招聘推广',
    type: 'social_media',
    platforms: ['facebook', 'instagram', 'tiktok'],
    targetAudience: {
      locations: ['Phnom Penh', 'Siem Reap'],
      industries: ['IT', 'Software Development'],
      jobLevels: ['senior', 'manager'],
      languages: ['khmer', 'english'],
    },
    content: {
      headline: '加入柬埔寨顶级科技团队！',
      body: '我们正在寻找有才华的软件开发工程师，提供具有竞争力的薪资和职业发展机会。',
      callToAction: '立即申请',
      imageUrl: 'https://images.khmercareer.com/promo/tech-hiring-001.jpg',
    },
    schedule: {
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      postingTimes: ['09:00', '14:00', '19:00'],
      frequency: 'daily',
    },
    aiGenerated: true,
    status: 'running',
    metrics: { impressions: 45230, clicks: 3845, conversions: 312, spend: 1250.00, roi: 3.8 },
    createdAt: '2024-01-10T08:30:00Z',
  },
  {
    id: 'camp-002',
    name: '暹粒旅游业人才招募',
    type: 'seo_article',
    platforms: ['facebook', 'telegram'],
    targetAudience: {
      locations: ['Siem Reap', 'Battambang'],
      industries: ['Tourism', 'Hospitality'],
      jobLevels: ['entry', 'mid'],
      languages: ['khmer', 'english', 'chinese'],
    },
    content: {
      headline: '暹粒酒店业招聘热潮来袭',
      body: '随着旅游业复苏，暹粒各大酒店急需前台、导游、餐饮服务人员。',
      callToAction: '了解更多',
    },
    schedule: {
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      postingTimes: ['08:00', '18:00'],
      frequency: 'weekly',
    },
    aiGenerated: true,
    status: 'scheduled',
    metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0, roi: 0 },
    createdAt: '2024-01-20T10:15:00Z',
  },
  {
    id: 'camp-003',
    name: 'Email Newsletter - 月度职位精选',
    type: 'email',
    platforms: ['email'],
    targetAudience: {
      locations: ['Phnom Penh', 'Sihanoukville', 'Battambang'],
      industries: ['Finance', 'Marketing', 'Engineering'],
      jobLevels: ['mid', 'senior', 'manager'],
      languages: ['khmer', 'english'],
    },
    content: {
      headline: '本月精选高薪职位',
      body: '为您精选本月最热门的高薪职位机会，涵盖金融、营销、工程等多个领域。',
      callToAction: '查看职位',
    },
    schedule: {
      startDate: '2024-01-25',
      endDate: '2024-12-25',
      postingTimes: ['10:00'],
      frequency: 'weekly',
    },
    aiGenerated: true,
    status: 'running',
    metrics: { impressions: 28500, clicks: 4520, conversions: 890, spend: 800.00, roi: 5.2 },
    createdAt: '2024-01-18T14:00:00Z',
  },
  {
    id: 'camp-004',
    name: 'SMS推送 - 紧急职位通知',
    type: 'sms',
    platforms: ['sms'],
    targetAudience: {
      locations: ['Phnom Penh'],
      industries: ['Construction', 'Manufacturing'],
      jobLevels: ['entry', 'mid'],
      languages: ['khmer'],
    },
    content: {
      headline: '紧急招聘！建筑工人',
      body: '金边多家建筑公司急招有经验的建筑工人，日薪$15-25。',
      callToAction: '回复YES申请',
    },
    schedule: {
      startDate: '2024-01-22',
      endDate: '2024-01-29',
      postingTimes: ['07:00', '12:00'],
      frequency: 'daily',
    },
    aiGenerated: false,
    status: 'completed',
    metrics: { impressions: 15200, clicks: 2100, conversions: 456, spend: 450.00, roi: 2.5 },
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'camp-005',
    name: 'Push通知 - 新职位上线',
    type: 'push',
    platforms: ['app_push'],
    targetAudience: {
      locations: ['Phnom Penh', 'Siem Reap', 'Sihanoukville'],
      industries: ['All'],
      jobLevels: ['entry', 'mid', 'senior'],
      languages: ['khmer', 'english'],
    },
    content: {
      headline: '有新职位匹配您的简历！',
      body: '根据您的技能和偏好，我们为您推荐了5个新职位。',
      callToAction: '立即查看',
    },
    schedule: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      postingTimes: ['09:00', '15:00'],
      frequency: 'daily',
    },
    aiGenerated: true,
    status: 'running',
    metrics: { impressions: 128000, clicks: 18500, conversions: 2340, spend: 2000.00, roi: 4.1 },
    createdAt: '2023-12-28T16:00:00Z',
  },
  {
    id: 'camp-006',
    name: 'LinkedIn专业人才招聘',
    type: 'social_media',
    platforms: ['linkedin', 'facebook'],
    targetAudience: {
      locations: ['Phnom Penh'],
      industries: ['Banking', 'Finance', 'Technology'],
      jobLevels: ['senior', 'manager', 'executive'],
      languages: ['english'],
    },
    content: {
      headline: '高级管理人才招聘中',
      body: '寻找具有国际化视野的高级管理人才，加入柬埔寨领先企业。',
      callToAction: '申请职位',
      imageUrl: 'https://images.khmercareer.com/promo/executive-001.jpg',
    },
    schedule: {
      startDate: '2024-02-10',
      endDate: '2024-04-10',
      postingTimes: ['09:00', '17:00'],
      frequency: 'custom',
    },
    aiGenerated: true,
    status: 'draft',
    metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0, roi: 0 },
    createdAt: '2024-01-25T11:30:00Z',
  },
  {
    id: 'camp-007',
    name: 'TikTok年轻人才推广',
    type: 'social_media',
    platforms: ['tiktok', 'instagram'],
    targetAudience: {
      locations: ['Phnom Penh', 'Sihanoukville'],
      industries: ['Creative', 'Media', 'Design'],
      jobLevels: ['entry', 'mid'],
      languages: ['khmer'],
    },
    content: {
      headline: '你的创意值得被看见！',
      body: '加入柬埔寨最具创意的团队，释放你的设计天赋。',
      callToAction: '立即申请',
      videoUrl: 'https://videos.khmercareer.com/promo/creative-001.mp4',
    },
    schedule: {
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      postingTimes: ['12:00', '19:00', '21:00'],
      frequency: 'daily',
    },
    aiGenerated: true,
    status: 'paused',
    metrics: { impressions: 67800, clicks: 8900, conversions: 567, spend: 1800.00, roi: 2.9 },
    createdAt: '2024-01-22T13:45:00Z',
  },
  {
    id: 'camp-008',
    name: 'SEO文章 - 柬埔寨职场指南',
    type: 'seo_article',
    platforms: ['facebook', 'telegram', 'youtube'],
    targetAudience: {
      locations: ['Nationwide'],
      industries: ['All'],
      jobLevels: ['entry', 'mid', 'senior'],
      languages: ['khmer', 'english'],
    },
    content: {
      headline: '2024年柬埔寨职场完全指南',
      body: '从简历撰写到面试技巧，从薪资谈判到职业规划，全方位指导您的职业发展之路。',
      callToAction: '阅读全文',
    },
    schedule: {
      startDate: '2024-01-30',
      endDate: '2024-06-30',
      postingTimes: ['10:00'],
      frequency: 'weekly',
    },
    aiGenerated: true,
    status: 'running',
    metrics: { impressions: 34500, clicks: 5600, conversions: 1230, spend: 600.00, roi: 6.5 },
    createdAt: '2024-01-28T08:00:00Z',
  },
];

const mockTemplates: AIContentTemplate[] = [
  {
    id: 'tmpl-001',
    name: '高薪职位推广',
    category: 'job_promotion',
    language: 'zh-CN',
    tone: 'professional',
    template: '🔥【高薪招聘】{company}正在招聘{position}！\n\n📍地点：{location}\n💰薪资：{salary}\n🎯要求：{requirements}\n\n{description}\n\n👉 {cta}',
    variables: ['company', 'position', 'location', 'salary', 'requirements', 'description', 'cta'],
    usageCount: 128,
    avgEngagement: 4.5,
  },
  {
    id: 'tmpl-002',
    name: '平台推广-求职者版',
    category: 'platform_promotion',
    language: 'km',
    tone: 'inspirational',
    template: 'ស្វែងរកការងារដ៏ស្វែងរកនៅ KhmerCareer! 🎯\n\nមានការងារជាង {jobCount} កំពុងរង់ចាំអ្នក។\nបង្កើតប្រវត្តិរូបឥឡូវនេះ ហើយចាប់ផ្តើមដំណើរការងារថ្មីរបស់អ្នក! 🚀',
    variables: ['jobCount'],
    usageCount: 256,
    avgEngagement: 5.2,
  },
  {
    id: 'tmpl-003',
    name: '成功故事分享',
    category: 'success_story',
    language: 'zh-CN',
    tone: 'inspirational',
    template: '🌟【成功故事】从{name}到{newRole}的蜕变\n\n"{quote}"\n\n{name}通过KhmerCareer找到了理想的工作，仅用了{timePeriod}就实现了职业跃升。\n\n你也可以！立即开始你的求职之旅 👇',
    variables: ['name', 'newRole', 'quote', 'timePeriod'],
    usageCount: 89,
    avgEngagement: 6.8,
  },
  {
    id: 'tmpl-004',
    name: '行业洞察报告',
    category: 'industry_insight',
    language: 'en',
    tone: 'professional',
    template: '📊 {industry} Industry Report {year}\n\nKey findings:\n• Average salary: {avgSalary}\n• Top hiring companies: {topCompanies}\n• Most in-demand skills: {topSkills}\n\nRead the full report: {link}',
    variables: ['industry', 'year', 'avgSalary', 'topCompanies', 'topSkills', 'link'],
    usageCount: 67,
    avgEngagement: 3.9,
  },
  {
    id: 'tmpl-005',
    name: '求职技巧小贴士',
    category: 'tips',
    language: 'zh-CN',
    tone: 'casual',
    template: '💡 求职小贴士 #{tipNumber}\n\n{tipTitle}\n\n{tipContent}\n\n关注 @KhmerCareer 获取更多求职技巧！✨',
    variables: ['tipNumber', 'tipTitle', 'tipContent'],
    usageCount: 312,
    avgEngagement: 5.7,
  },
  {
    id: 'tmpl-006',
    name: '紧急招聘通知',
    category: 'job_promotion',
    language: 'km',
    tone: 'urgent',
    template: '⚠️ ជ្រើសរើសបុគ្គលិកបន្ទាន់! ⚠️\n\n{company} ត្រូវការជ្រើសរើស{position} ចំនួន {vacancy} នាក់\n\n⏰ ដាច់កំណត់ដាក់ពាក្យ：{deadline}\n\nកុំខកខាន! ដាក់ពាក្យឥឡូវនេះ 👇',
    variables: ['company', 'position', 'vacancy', 'deadline'],
    usageCount: 178,
    avgEngagement: 4.3,
  },
  {
    id: 'tmpl-007',
    name: 'Telegram社群邀请',
    category: 'platform_promotion',
    language: 'zh-CN',
    tone: 'casual',
    template: '📢 加入KhmerCareer求职社群！\n\n✅ 每日精选职位\n✅ 求职经验分享\n✅ HR在线答疑\n✅ 同行交流机会\n\n已有{memberCount}位求职者加入👥\n\n点击链接加入：{inviteLink}',
    variables: ['memberCount', 'inviteLink'],
    usageCount: 445,
    avgEngagement: 7.1,
  },
  {
    id: 'tmpl-008',
    name: '限时优惠活动',
    category: 'platform_promotion',
    language: 'en',
    tone: 'urgent',
    template: '⏰ LIMITED TIME OFFER ⏰\n\nGet {discount}% off on Premium Membership!\n\nUnlock exclusive features:\n✨ Priority job alerts\n✨ Direct messaging with employers\n✨ Resume review service\n✨ Career coaching sessions\n\nOffer ends {expiryDate}\n\nUpgrade now: {upgradeLink}',
    variables: ['discount', 'expiryDate', 'upgradeLink'],
    usageCount: 203,
    avgEngagement: 4.8,
  },
];

// ==================== 工具函数 ====================

/** 生成唯一ID */
const generateId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** 从localStorage加载数据 */
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`[AIPromotionStore] Failed to load ${key}:`, error);
  }
  return fallback;
};

/** 保存到localStorage */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[AIPromotionStore] Failed to save ${key}:`, error);
  }
};

// ==================== Store Hook ====================

export function useAIPromotionStore() {
  const [campaigns, setCampaigns] = useState<AIPromotionCampaign[]>(() =>
    loadFromStorage<AIPromotionCampaign[]>(STORAGE_KEY_CAMPAIGNS, mockCampaigns)
  );
  const [templates, setTemplates] = useState<AIContentTemplate[]>(() =>
    loadFromStorage<AIContentTemplate[]>(STORAGE_KEY_TEMPLATES, mockTemplates)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 持久化到localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY_CAMPAIGNS, campaigns);
  }, [campaigns]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_TEMPLATES, templates);
  }, [templates]);

  // ==================== Campaign CRUD ====================

  /** 创建推广活动 */
  const createCampaign = useCallback((data: Omit<AIPromotionCampaign, 'id' | 'createdAt' | 'status' | 'metrics'> & { status?: AIPromotionStatus }): AIPromotionCampaign => {
    const newCampaign: AIPromotionCampaign = {
      ...data,
      id: generateId('camp'),
      status: data.status || 'draft',
      metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0, roi: 0 },
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    return newCampaign;
  }, []);

  /** 更新推广活动 */
  const updateCampaign = useCallback((id: string, updates: Partial<AIPromotionCampaign>): AIPromotionCampaign | null => {
    let updated: AIPromotionCampaign | null = null;
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          updated = { ...c, ...updates };
          return updated;
        }
        return c;
      })
    );
    return updated;
  }, []);

  /** 删除推广活动 */
  const deleteCampaign = useCallback((id: string): boolean => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    return true;
  }, []);

  /** 获取单个推广活动 */
  const getCampaign = useCallback((id: string): AIPromotionCampaign | undefined => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  /** 更新推广活动状态 */
  const updateCampaignStatus = useCallback((id: string, status: AIPromotionStatus): AIPromotionCampaign | null => {
    return updateCampaign(id, { status });
  }, [updateCampaign]);

  /** 更新推广活动数据指标 */
  const updateCampaignMetrics = useCallback((id: string, metrics: Partial<AIPromotionCampaign['metrics']>): AIPromotionCampaign | null => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return null;
    return updateCampaign(id, { metrics: { ...campaign.metrics, ...metrics } });
  }, [campaigns, updateCampaign]);

  /** 筛选推广活动 */
  const filterCampaigns = useCallback((
    filters: {
      type?: AIPromotionType;
      status?: AIPromotionStatus;
      platform?: string;
      aiGenerated?: boolean;
      searchQuery?: string;
    }
  ): AIPromotionCampaign[] => {
    return campaigns.filter(c => {
      if (filters.type && c.type !== filters.type) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.platform && !c.platforms.includes(filters.platform)) return false;
      if (filters.aiGenerated !== undefined && c.aiGenerated !== filters.aiGenerated) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.content.headline.toLowerCase().includes(q);
      }
      return true;
    });
  }, [campaigns]);

  // ==================== Template CRUD ====================

  /** 创建文案模板 */
  const createTemplate = useCallback((data: Omit<AIContentTemplate, 'id' | 'usageCount' | 'avgEngagement'>): AIContentTemplate => {
    const newTemplate: AIContentTemplate = {
      ...data,
      id: generateId('tmpl'),
      usageCount: 0,
      avgEngagement: 0,
    };
    setTemplates(prev => [newTemplate, ...prev]);
    return newTemplate;
  }, []);

  /** 更新文案模板 */
  const updateTemplate = useCallback((id: string, updates: Partial<AIContentTemplate>): AIContentTemplate | null => {
    let updated: AIContentTemplate | null = null;
    setTemplates(prev =>
      prev.map(t => {
        if (t.id === id) {
          updated = { ...t, ...updates };
          return updated;
        }
        return t;
      })
    );
    return updated;
  }, []);

  /** 删除文案模板 */
  const deleteTemplate = useCallback((id: string): boolean => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    return true;
  }, []);

  /** 获取单个模板 */
  const getTemplate = useCallback((id: string): AIContentTemplate | undefined => {
    return templates.find(t => t.id === id);
  }, [templates]);

  /** 增加模板使用次数 */
  const incrementTemplateUsage = useCallback((id: string, engagement: number): AIContentTemplate | null => {
    const template = templates.find(t => t.id === id);
    if (!template) return null;
    const newCount = template.usageCount + 1;
    const newAvg = ((template.avgEngagement * template.usageCount) + engagement) / newCount;
    return updateTemplate(id, { usageCount: newCount, avgEngagement: parseFloat(newAvg.toFixed(2)) });
  }, [templates, updateTemplate]);

  /** 筛选模板 */
  const filterTemplates = useCallback((
    filters: {
      category?: AITemplateCategory;
      tone?: AITone;
      language?: string;
      searchQuery?: string;
    }
  ): AIContentTemplate[] => {
    return templates.filter(t => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.tone && t.tone !== filters.tone) return false;
      if (filters.language && t.language !== filters.language) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.template.toLowerCase().includes(q);
      }
      return true;
    });
  }, [templates]);

  // ==================== 统计聚合 ====================

  /** 获取推广活动统计概览 */
  const getCampaignStats = useCallback(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.metrics.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.metrics.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + c.metrics.spend, 0);
    const avgRoi = totalCampaigns > 0
      ? campaigns.reduce((sum, c) => sum + c.metrics.roi, 0) / totalCampaigns
      : 0;
    return {
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      avgRoi: parseFloat(avgRoi.toFixed(2)),
      avgCtr: totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
    };
  }, [campaigns]);

  /** 重置为Mock数据 */
  const resetToMockData = useCallback(() => {
    setCampaigns(mockCampaigns);
    setTemplates(mockTemplates);
    setError(null);
  }, []);

  /** 清除所有数据 */
  const clearAll = useCallback(() => {
    setCampaigns([]);
    setTemplates([]);
    localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEY_TEMPLATES);
  }, []);

  return {
    // 状态
    campaigns,
    templates,
    isLoading,
    error,

    // Campaign操作
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    updateCampaignStatus,
    updateCampaignMetrics,
    filterCampaigns,

    // Template操作
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    incrementTemplateUsage,
    filterTemplates,

    // 统计
    getCampaignStats,

    // 工具
    setIsLoading,
    setError,
    resetToMockData,
    clearAll,
  };
}
