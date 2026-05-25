import { useState, useEffect, useCallback } from 'react';

// ==================== 类型定义 ====================

/** 社交媒体平台 */
export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'telegram' | 'twitter' | 'linkedin';

/** 账号连接状态 */
export type AccountStatus = 'connected' | 'disconnected' | 'expired';

/** 社媒账号接口 */
export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  followerCount: number;
  status: AccountStatus;
  lastPost: string;
  metrics: {
    weeklyPosts: number;
    weeklyEngagement: number;
    weeklyGrowth: number;
  };
}

/** 已发布内容接口 */
export interface PublishedContent {
  id: string;
  campaignId: string;
  platform: string;
  content: string;
  mediaUrl: string;
  postUrl: string;
  publishedAt: string;
  metrics: {
    impressions: number;
    clicks: number;
    engagements: number;
    shares: number;
  };
}

/** 发布排期项接口 */
export interface ScheduledPost {
  id: string;
  campaignId: string;
  platform: SocialPlatform;
  content: string;
  mediaUrl: string;
  scheduledAt: string;
  status: 'pending' | 'approved' | 'failed';
}

/** 内容日历项接口 */
export interface ContentCalendarItem {
  date: string;
  posts: Array<{
    id: string;
    platform: SocialPlatform;
    content: string;
    time: string;
    status: 'scheduled' | 'published' | 'draft';
  }>;
}

/** Store状态接口 */
export interface SocialMatrixStoreState {
  accounts: SocialAccount[];
  publishedContents: PublishedContent[];
  scheduledPosts: ScheduledPost[];
  isLoading: boolean;
  error: string | null;
}

// ==================== Constants ====================

const STORAGE_KEY_ACCOUNTS = 'khmercareer_social_matrix_accounts';
const STORAGE_KEY_PUBLISHED = 'khmercareer_social_matrix_published';
const STORAGE_KEY_SCHEDULED = 'khmercareer_social_matrix_scheduled';

/** 平台显示名称映射 */
export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  telegram: 'Telegram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
};

/** 平台图标颜色映射 */
export const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  telegram: '#0088CC',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
};

// ==================== Mock 数据 ====================

const mockAccounts: SocialAccount[] = [
  {
    id: 'acc-001',
    platform: 'facebook',
    accountName: 'KhmerCareer 柬埔寨求职',
    followerCount: 45200,
    status: 'connected',
    lastPost: '2024-01-30T19:00:00Z',
    metrics: { weeklyPosts: 21, weeklyEngagement: 5.8, weeklyGrowth: 340 },
  },
  {
    id: 'acc-002',
    platform: 'instagram',
    accountName: '@khmercareer',
    followerCount: 28600,
    status: 'connected',
    lastPost: '2024-01-30T14:00:00Z',
    metrics: { weeklyPosts: 14, weeklyEngagement: 7.2, weeklyGrowth: 210 },
  },
  {
    id: 'acc-003',
    platform: 'tiktok',
    accountName: '@khmercareer',
    followerCount: 128500,
    status: 'connected',
    lastPost: '2024-01-30T21:00:00Z',
    metrics: { weeklyPosts: 14, weeklyEngagement: 12.5, weeklyGrowth: 1250 },
  },
  {
    id: 'acc-004',
    platform: 'youtube',
    accountName: 'KhmerCareer Cambodia',
    followerCount: 18400,
    status: 'connected',
    lastPost: '2024-01-29T10:00:00Z',
    metrics: { weeklyPosts: 7, weeklyEngagement: 4.3, weeklyGrowth: 89 },
  },
  {
    id: 'acc-005',
    platform: 'telegram',
    accountName: 'KhmerCareer求职社群',
    followerCount: 35600,
    status: 'connected',
    lastPost: '2024-01-30T09:00:00Z',
    metrics: { weeklyPosts: 28, weeklyEngagement: 8.9, weeklyGrowth: 520 },
  },
  {
    id: 'acc-006',
    platform: 'twitter',
    accountName: '@khmercareer',
    followerCount: 8200,
    status: 'expired',
    lastPost: '2024-01-15T12:00:00Z',
    metrics: { weeklyPosts: 0, weeklyEngagement: 0, weeklyGrowth: 0 },
  },
  {
    id: 'acc-007',
    platform: 'linkedin',
    accountName: 'KhmerCareer Official',
    followerCount: 12300,
    status: 'connected',
    lastPost: '2024-01-30T17:00:00Z',
    metrics: { weeklyPosts: 7, weeklyEngagement: 3.6, weeklyGrowth: 78 },
  },
];

const mockPublishedContents: PublishedContent[] = [
  {
    id: 'pub-001',
    campaignId: 'camp-001',
    platform: 'facebook',
    content: '🔥【高薪招聘】金边顶级科技公司正在招聘资深前端工程师！💰薪资：$1500-2500 📍地点：金边 BKK1区 🎯要求：3年以上React经验 👉 立即申请：link.khmercareer.com/tech-senior',
    mediaUrl: 'https://images.khmercareer.com/social/tech-hiring-fb-001.jpg',
    postUrl: 'https://facebook.com/khmercareer/posts/001',
    publishedAt: '2024-01-30T09:00:00Z',
    metrics: { impressions: 12500, clicks: 890, engagements: 234, shares: 56 },
  },
  {
    id: 'pub-002',
    campaignId: 'camp-001',
    platform: 'instagram',
    content: '想在柬埔寨最好的科技公司工作吗？🚀 我们正在招聘！💻 #KhmerCareer #TechJobs #PhnomPenh',
    mediaUrl: 'https://images.khmercareer.com/social/tech-hiring-ig-001.jpg',
    postUrl: 'https://instagram.com/khmercareer/p/001',
    publishedAt: '2024-01-30T14:00:00Z',
    metrics: { impressions: 8200, clicks: 560, engagements: 445, shares: 23 },
  },
  {
    id: 'pub-003',
    campaignId: 'camp-001',
    platform: 'tiktok',
    content: '柬埔寨程序员薪资揭秘！💰 从初级到高级，你能赚多少？@khmercareer #techjobs #cambodia #salary',
    mediaUrl: 'https://videos.khmercareer.com/social/salary-reveal-tt-001.mp4',
    postUrl: 'https://tiktok.com/@khmercareer/video/001',
    publishedAt: '2024-01-30T19:00:00Z',
    metrics: { impressions: 52300, clicks: 4200, engagements: 6800, shares: 1200 },
  },
  {
    id: 'pub-004',
    campaignId: 'camp-003',
    platform: 'facebook',
    content: '📧 本月精选高薪职位已发送！查看您的邮箱或点击链接查看本月最热门的20个职位机会。涵盖金融、科技、营销等多个领域。',
    mediaUrl: '',
    postUrl: 'https://facebook.com/khmercareer/posts/002',
    publishedAt: '2024-01-29T10:00:00Z',
    metrics: { impressions: 18500, clicks: 3200, engagements: 456, shares: 89 },
  },
  {
    id: 'pub-005',
    campaignId: 'camp-007',
    platform: 'tiktok',
    content: '你的创意值得被看见！🎨 加入柬埔寨最具创意的设计团队，释放你的设计天赋！#creativejobs #design #cambodia',
    mediaUrl: 'https://videos.khmercareer.com/social/creative-tt-001.mp4',
    postUrl: 'https://tiktok.com/@khmercareer/video/002',
    publishedAt: '2024-01-29T21:00:00Z',
    metrics: { impressions: 67800, clicks: 8900, engagements: 12300, shares: 2100 },
  },
  {
    id: 'pub-006',
    campaignId: 'camp-002',
    platform: 'telegram',
    content: '⚡ 暹粒酒店业招聘热潮来袭！随着旅游业复苏，暹粒各大酒店急需前台、导游、餐饮服务人员。点击查看详情👇',
    mediaUrl: 'https://images.khmercareer.com/social/siemreap-tg-001.jpg',
    postUrl: 'https://t.me/khmercareer/001',
    publishedAt: '2024-01-28T09:00:00Z',
    metrics: { impressions: 23400, clicks: 1800, engagements: 340, shares: 120 },
  },
  {
    id: 'pub-007',
    campaignId: 'camp-008',
    platform: 'youtube',
    content: '2024年柬埔寨职场完全指南 - 从简历撰写到面试技巧，从薪资谈判到职业规划，全方位指导您的职业发展之路。',
    mediaUrl: 'https://videos.khmercareer.com/social/guide-yt-001.mp4',
    postUrl: 'https://youtube.com/shorts/001',
    publishedAt: '2024-01-27T10:00:00Z',
    metrics: { impressions: 15600, clicks: 2300, engagements: 890, shares: 45 },
  },
  {
    id: 'pub-008',
    campaignId: 'camp-005',
    platform: 'facebook',
    content: '💡 求职小贴士 #12：面试前一定要研究公司背景！了解公司的产品、文化和近期新闻，让你在面试中脱颖而出。',
    mediaUrl: 'https://images.khmercareer.com/social/tips-fb-001.jpg',
    postUrl: 'https://facebook.com/khmercareer/posts/003',
    publishedAt: '2024-01-26T15:00:00Z',
    metrics: { impressions: 8900, clicks: 1200, engagements: 567, shares: 78 },
  },
  {
    id: 'pub-009',
    campaignId: 'camp-005',
    platform: 'instagram',
    content: '✨ 5个让你的简历脱颖而出的技巧 ✨ 1️⃣ 量化成就 2️⃣ 针对性修改 3️⃣ 简洁明了 4️⃣ 注意排版 5️⃣ 使用KhmerCareer工具 #resumetips #jobsearch',
    mediaUrl: 'https://images.khmercareer.com/social/tips-ig-001.jpg',
    postUrl: 'https://instagram.com/khmercareer/p/002',
    publishedAt: '2024-01-25T11:00:00Z',
    metrics: { impressions: 12300, clicks: 1800, engagements: 1234, shares: 156 },
  },
  {
    id: 'pub-010',
    campaignId: 'camp-006',
    platform: 'linkedin',
    content: 'Senior Management Opportunities in Phnom Penh 🎯 Leading companies are seeking experienced professionals with international vision. Apply now to take your career to the next level.',
    mediaUrl: 'https://images.khmercareer.com/social/executive-li-001.jpg',
    postUrl: 'https://linkedin.com/company/khmercareer/posts/001',
    publishedAt: '2024-01-24T17:00:00Z',
    metrics: { impressions: 8200, clicks: 1100, engagements: 234, shares: 67 },
  },
];

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: 'sch-001',
    campaignId: 'camp-001',
    platform: 'facebook',
    content: '🌅 早安求职者！今日精选职位已更新，快来看看有没有适合你的机会吧！',
    mediaUrl: 'https://images.khmercareer.com/scheduled/morning-fb-001.jpg',
    scheduledAt: '2024-02-01T09:00:00Z',
    status: 'approved',
  },
  {
    id: 'sch-002',
    campaignId: 'camp-001',
    platform: 'tiktok',
    content: '程序员的一天是什么样的？👨‍💻 跟随我们的镜头看看柬埔寨科技公司的工作日常！',
    mediaUrl: 'https://videos.khmercareer.com/scheduled/day-in-life-tt-001.mp4',
    scheduledAt: '2024-02-01T19:00:00Z',
    status: 'approved',
  },
  {
    id: 'sch-003',
    campaignId: 'camp-003',
    platform: 'telegram',
    content: '📊 本周职位数据报告：新增职位156个，活跃企业42家，最高薪资$3500/月',
    mediaUrl: '',
    scheduledAt: '2024-02-01T10:00:00Z',
    status: 'pending',
  },
  {
    id: 'sch-004',
    campaignId: 'camp-002',
    platform: 'instagram',
    content: '🏨 暹粒豪华度假村招聘季！前台、管家、餐饮经理等多岗位热招中',
    mediaUrl: 'https://images.khmercareer.com/scheduled/siemreap-ig-001.jpg',
    scheduledAt: '2024-02-02T14:00:00Z',
    status: 'approved',
  },
  {
    id: 'sch-005',
    campaignId: 'camp-005',
    platform: 'youtube',
    content: '如何通过KhmerCareer找到理想工作？完整教程来了！',
    mediaUrl: 'https://videos.khmercareer.com/scheduled/tutorial-yt-001.mp4',
    scheduledAt: '2024-02-02T10:00:00Z',
    status: 'pending',
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
    console.error(`[SocialMatrixStore] Failed to load ${key}:`, error);
  }
  return fallback;
};

/** 保存到localStorage */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[SocialMatrixStore] Failed to save ${key}:`, error);
  }
};

/** 获取过去N天的日期 */
const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// ==================== Store Hook ====================

export function useSocialMatrixStore() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(() =>
    loadFromStorage<SocialAccount[]>(STORAGE_KEY_ACCOUNTS, mockAccounts)
  );
  const [publishedContents, setPublishedContents] = useState<PublishedContent[]>(() =>
    loadFromStorage<PublishedContent[]>(STORAGE_KEY_PUBLISHED, mockPublishedContents)
  );
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() =>
    loadFromStorage<ScheduledPost[]>(STORAGE_KEY_SCHEDULED, mockScheduledPosts)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 持久化到localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY_ACCOUNTS, accounts);
  }, [accounts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_PUBLISHED, publishedContents);
  }, [publishedContents]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_SCHEDULED, scheduledPosts);
  }, [scheduledPosts]);

  // ==================== 账号管理 CRUD ====================

  /** 创建社媒账号 */
  const createAccount = useCallback((data: Omit<SocialAccount, 'id' | 'metrics' | 'lastPost'>): SocialAccount => {
    const newAccount: SocialAccount = {
      ...data,
      id: generateId('acc'),
      metrics: { weeklyPosts: 0, weeklyEngagement: 0, weeklyGrowth: 0 },
      lastPost: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  }, []);

  /** 更新社媒账号 */
  const updateAccount = useCallback((id: string, updates: Partial<SocialAccount>): SocialAccount | null => {
    let updated: SocialAccount | null = null;
    setAccounts(prev =>
      prev.map(a => {
        if (a.id === id) {
          updated = { ...a, ...updates };
          return updated;
        }
        return a;
      })
    );
    return updated;
  }, []);

  /** 删除社媒账号 */
  const deleteAccount = useCallback((id: string): boolean => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    return true;
  }, []);

  /** 获取单个账号 */
  const getAccount = useCallback((id: string): SocialAccount | undefined => {
    return accounts.find(a => a.id === id);
  }, [accounts]);

  /** 按平台获取账号 */
  const getAccountByPlatform = useCallback(
    (platform: SocialPlatform): SocialAccount | undefined => {
      return accounts.find(a => a.platform === platform);
    },
    [accounts]
  );

  /** 更新账号连接状态 */
  const updateAccountStatus = useCallback((id: string, status: AccountStatus): SocialAccount | null => {
    return updateAccount(id, { status });
  }, [updateAccount]);

  /** 更新账号数据指标 */
  const updateAccountMetrics = useCallback(
    (id: string, metrics: Partial<SocialAccount['metrics']>): SocialAccount | null => {
      const account = accounts.find(a => a.id === id);
      if (!account) return null;
      return updateAccount(id, { metrics: { ...account.metrics, ...metrics } });
    },
    [accounts, updateAccount]
  );

  /** 更新粉丝数 */
  const updateFollowerCount = useCallback(
    (id: string, count: number): SocialAccount | null => {
      return updateAccount(id, { followerCount: count });
    },
    [updateAccount]
  );

  /** 更新最后发布时间 */
  const updateLastPost = useCallback(
    (id: string): SocialAccount | null => {
      return updateAccount(id, { lastPost: new Date().toISOString() });
    },
    [updateAccount]
  );

  /** 筛选账号 */
  const filterAccounts = useCallback(
    (filters: { platform?: SocialPlatform; status?: AccountStatus; searchQuery?: string }): SocialAccount[] => {
      return accounts.filter(a => {
        if (filters.platform && a.platform !== filters.platform) return false;
        if (filters.status && a.status !== filters.status) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return a.accountName.toLowerCase().includes(q);
        }
        return true;
      });
    },
    [accounts]
  );

  // ==================== 已发布内容 CRUD ====================

  /** 创建发布记录 */
  const createPublishedContent = useCallback((data: Omit<PublishedContent, 'id'>): PublishedContent => {
    const newContent: PublishedContent = {
      ...data,
      id: generateId('pub'),
    };
    setPublishedContents(prev => [newContent, ...prev]);

    // 同步更新账号最后发布时间
    const account = accounts.find(a => a.platform === data.platform);
    if (account) {
      updateAccount(account.id, { lastPost: data.publishedAt });
    }

    return newContent;
  }, [accounts, updateAccount]);

  /** 更新发布内容 */
  const updatePublishedContent = useCallback((id: string, updates: Partial<PublishedContent>): PublishedContent | null => {
    let updated: PublishedContent | null = null;
    setPublishedContents(prev =>
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

  /** 删除发布内容 */
  const deletePublishedContent = useCallback((id: string): boolean => {
    setPublishedContents(prev => prev.filter(c => c.id !== id));
    return true;
  }, []);

  /** 获取单条发布内容 */
  const getPublishedContent = useCallback((id: string): PublishedContent | undefined => {
    return publishedContents.find(c => c.id === id);
  }, [publishedContents]);

  /** 更新发布内容数据指标 */
  const updateContentMetrics = useCallback(
    (id: string, metrics: Partial<PublishedContent['metrics']>): PublishedContent | null => {
      const content = publishedContents.find(c => c.id === id);
      if (!content) return null;
      return updatePublishedContent(id, { metrics: { ...content.metrics, ...metrics } });
    },
    [publishedContents, updatePublishedContent]
  );

  /** 按活动筛选内容 */
  const getContentsByCampaign = useCallback(
    (campaignId: string): PublishedContent[] => {
      return publishedContents.filter(c => c.campaignId === campaignId);
    },
    [publishedContents]
  );

  /** 按平台筛选内容 */
  const getContentsByPlatform = useCallback(
    (platform: string): PublishedContent[] => {
      return publishedContents.filter(c => c.platform === platform);
    },
    [publishedContents]
  );

  /** 筛选发布内容 */
  const filterPublishedContents = useCallback(
    (filters: {
      campaignId?: string;
      platform?: string;
      searchQuery?: string;
    }): PublishedContent[] => {
      return publishedContents.filter(c => {
        if (filters.campaignId && c.campaignId !== filters.campaignId) return false;
        if (filters.platform && c.platform !== filters.platform) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return c.content.toLowerCase().includes(q);
        }
        return true;
      });
    },
    [publishedContents]
  );

  // ==================== 排期管理 CRUD ====================

  /** 创建排期 */
  const createScheduledPost = useCallback((data: Omit<ScheduledPost, 'id' | 'status'> & { status?: ScheduledPost['status'] }): ScheduledPost => {
    const newPost: ScheduledPost = {
      ...data,
      id: generateId('sch'),
      status: data.status || 'pending',
    };
    setScheduledPosts(prev => [...prev, newPost]);
    return newPost;
  }, []);

  /** 更新排期 */
  const updateScheduledPost = useCallback((id: string, updates: Partial<ScheduledPost>): ScheduledPost | null => {
    let updated: ScheduledPost | null = null;
    setScheduledPosts(prev =>
      prev.map(s => {
        if (s.id === id) {
          updated = { ...s, ...updates };
          return updated;
        }
        return s;
      })
    );
    return updated;
  }, []);

  /** 删除排期 */
  const deleteScheduledPost = useCallback((id: string): boolean => {
    setScheduledPosts(prev => prev.filter(s => s.id !== id));
    return true;
  }, []);

  /** 获取单个排期 */
  const getScheduledPost = useCallback((id: string): ScheduledPost | undefined => {
    return scheduledPosts.find(s => s.id === id);
  }, [scheduledPosts]);

  /** 审批排期 */
  const approveScheduledPost = useCallback((id: string): ScheduledPost | null => {
    return updateScheduledPost(id, { status: 'approved' });
  }, [updateScheduledPost]);

  /** 标记排期失败 */
  const failScheduledPost = useCallback((id: string): ScheduledPost | null => {
    return updateScheduledPost(id, { status: 'failed' });
  }, [updateScheduledPost]);

  // ==================== 内容日历 ====================

  /** 获取内容日历 */
  const getContentCalendar = useCallback(
    (days: number = 14): ContentCalendarItem[] => {
      const dates = getLastNDays(days);
      return dates.map(date => {
        const posts: ContentCalendarItem['posts'] = [];

        // 添加已发布内容
        publishedContents
          .filter(c => c.publishedAt.startsWith(date))
          .forEach(c => {
            posts.push({
              id: c.id,
              platform: c.platform as SocialPlatform,
              content: c.content.slice(0, 60) + '...',
              time: c.publishedAt.split('T')[1]?.slice(0, 5) || '00:00',
              status: 'published',
            });
          });

        // 添加排期内容
        scheduledPosts
          .filter(s => s.scheduledAt.startsWith(date))
          .forEach(s => {
            posts.push({
              id: s.id,
              platform: s.platform,
              content: s.content.slice(0, 60) + '...',
              time: s.scheduledAt.split('T')[1]?.slice(0, 5) || '00:00',
              status: s.status === 'approved' ? 'scheduled' : 'draft',
            });
          });

        return { date, posts: posts.sort((a, b) => a.time.localeCompare(b.time)) };
      });
    },
    [publishedContents, scheduledPosts]
  );

  // ==================== 统计聚合 ====================

  /** 获取社媒矩阵概览统计 */
  const getMatrixStats = useCallback(() => {
    const totalAccounts = accounts.length;
    const connectedAccounts = accounts.filter(a => a.status === 'connected').length;
    const totalFollowers = accounts.reduce((sum, a) => sum + a.followerCount, 0);

    const totalPosts = publishedContents.length;
    const totalImpressions = publishedContents.reduce((sum, c) => sum + c.metrics.impressions, 0);
    const totalClicks = publishedContents.reduce((sum, c) => sum + c.metrics.clicks, 0);
    const totalEngagements = publishedContents.reduce((sum, c) => sum + c.metrics.engagements, 0);
    const totalShares = publishedContents.reduce((sum, c) => sum + c.metrics.shares, 0);

    const pendingApprovals = scheduledPosts.filter(s => s.status === 'pending').length;
    const scheduledCount = scheduledPosts.filter(s => s.status === 'approved').length;

    return {
      totalAccounts,
      connectedAccounts,
      disconnectedAccounts: totalAccounts - connectedAccounts,
      totalFollowers,
      totalPosts,
      totalImpressions,
      totalClicks,
      totalEngagements,
      totalShares,
      pendingApprovals,
      scheduledCount,
      avgEngagementRate: totalImpressions > 0 ? parseFloat(((totalEngagements / totalImpressions) * 100).toFixed(2)) : 0,
      avgCtr: totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
    };
  }, [accounts, publishedContents, scheduledPosts]);

  /** 按平台统计 */
  const getPlatformStats = useCallback(
    (): Record<string, { posts: number; impressions: number; clicks: number; engagements: number; shares: number }> => {
      const stats: Record<string, { posts: number; impressions: number; clicks: number; engagements: number; shares: number }> = {};
      publishedContents.forEach(c => {
        if (!stats[c.platform]) {
          stats[c.platform] = { posts: 0, impressions: 0, clicks: 0, engagements: 0, shares: 0 };
        }
        stats[c.platform].posts++;
        stats[c.platform].impressions += c.metrics.impressions;
        stats[c.platform].clicks += c.metrics.clicks;
        stats[c.platform].engagements += c.metrics.engagements;
        stats[c.platform].shares += c.metrics.shares;
      });
      return stats;
    },
    [publishedContents]
  );

  /** 获取增长趋势数据 */
  const getGrowthTrend = useCallback(
    (days: number = 7): Array<{ date: string; newPosts: number; totalImpressions: number; totalEngagements: number }> => {
      const dates = getLastNDays(days);
      return dates.map(date => {
        const dayPosts = publishedContents.filter(c => c.publishedAt.startsWith(date));
        return {
          date,
          newPosts: dayPosts.length,
          totalImpressions: dayPosts.reduce((sum, c) => sum + c.metrics.impressions, 0),
          totalEngagements: dayPosts.reduce((sum, c) => sum + c.metrics.engagements, 0),
        };
      });
    },
    [publishedContents]
  );

  /** 获取最佳表现内容 */
  const getTopPerformingContents = useCallback(
    (limit: number = 5): PublishedContent[] => {
      return [...publishedContents]
        .sort((a, b) => b.metrics.engagements - a.metrics.engagements)
        .slice(0, limit);
    },
    [publishedContents]
  );

  // ==================== 工具方法 ====================

  /** 重置为Mock数据 */
  const resetToMockData = useCallback(() => {
    setAccounts(mockAccounts);
    setPublishedContents(mockPublishedContents);
    setScheduledPosts(mockScheduledPosts);
    setError(null);
  }, []);

  /** 清除所有数据 */
  const clearAll = useCallback(() => {
    setAccounts([]);
    setPublishedContents([]);
    setScheduledPosts([]);
    localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY_PUBLISHED);
    localStorage.removeItem(STORAGE_KEY_SCHEDULED);
  }, []);

  return {
    // 状态
    accounts,
    publishedContents,
    scheduledPosts,
    isLoading,
    error,

    // 账号管理
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    getAccountByPlatform,
    updateAccountStatus,
    updateAccountMetrics,
    updateFollowerCount,
    updateLastPost,
    filterAccounts,

    // 已发布内容管理
    createPublishedContent,
    updatePublishedContent,
    deletePublishedContent,
    getPublishedContent,
    updateContentMetrics,
    getContentsByCampaign,
    getContentsByPlatform,
    filterPublishedContents,

    // 排期管理
    createScheduledPost,
    updateScheduledPost,
    deleteScheduledPost,
    getScheduledPost,
    approveScheduledPost,
    failScheduledPost,

    // 内容日历
    getContentCalendar,

    // 统计
    getMatrixStats,
    getPlatformStats,
    getGrowthTrend,
    getTopPerformingContents,

    // 工具
    setIsLoading,
    setError,
    resetToMockData,
    clearAll,
  };
}
