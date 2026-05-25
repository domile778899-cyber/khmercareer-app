import { useState, useEffect, useCallback } from 'react';

// ==================== 类型定义 ====================

/** 邀请活动类型 */
export type ReferralCampaignType = 'jobseeker_invite' | 'employer_invite' | 'share_job' | 'share_course' | 'community_join';

/** 奖励类型 */
export type RewardType = 'cash' | 'credit' | 'premium' | 'discount';

/** 邀请活动状态 */
export type ReferralCampaignStatus = 'draft' | 'active' | 'paused' | 'ended';

/** 裂变参与者接口 */
export interface ReferralParticipant {
  userId: string;
  referralCode: string;
  invitesSent: number;
  invitesConverted: number;
  totalRewards: number;
  referralChain: string[];
}

/** 邀请活动接口 */
export interface ReferralCampaign {
  id: string;
  name: string;
  type: ReferralCampaignType;
  rewardType: RewardType;
  rewardAmount: number;
  maxRewardsPerUser: number;
  targetGoal: number;
  currentProgress: number;
  participants: ReferralParticipant[];
  status: ReferralCampaignStatus;
  startDate: string;
  endDate: string;
}

/** 裂变活动模板接口 */
export interface ViralTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  reward: string;
  viralCoefficient: number;
  estimatedReach: number;
}

/** Store状态接口 */
export interface GrowthEngineStoreState {
  campaigns: ReferralCampaign[];
  viralTemplates: ViralTemplate[];
  isLoading: boolean;
  error: string | null;
}

// ==================== Constants ====================

const STORAGE_KEY_CAMPAIGNS = 'khmercareer_growth_engine_campaigns';
const STORAGE_KEY_TEMPLATES = 'khmercareer_growth_engine_templates';

// ==================== Mock 数据 ====================

const mockCampaigns: ReferralCampaign[] = [
  {
    id: 'ref-001',
    name: '求职者邀请好友赚积分',
    type: 'jobseeker_invite',
    rewardType: 'credit',
    rewardAmount: 500,
    maxRewardsPerUser: 10,
    targetGoal: 5000,
    currentProgress: 3280,
    participants: [
      { userId: 'u-1001', referralCode: 'KC2024A1B2', invitesSent: 25, invitesConverted: 18, totalRewards: 9000, referralChain: ['u-1002', 'u-1003', 'u-1004'] },
      { userId: 'u-1002', referralCode: 'KC2024C3D4', invitesSent: 15, invitesConverted: 10, totalRewards: 5000, referralChain: ['u-1005', 'u-1006'] },
      { userId: 'u-1003', referralCode: 'KC2024E5F6', invitesSent: 32, invitesConverted: 24, totalRewards: 12000, referralChain: ['u-1007', 'u-1008', 'u-1009', 'u-1010'] },
      { userId: 'u-1004', referralCode: 'KC2024G7H8', invitesSent: 8, invitesConverted: 5, totalRewards: 2500, referralChain: ['u-1011'] },
      { userId: 'u-1005', referralCode: 'KC2024I9J0', invitesSent: 45, invitesConverted: 30, totalRewards: 15000, referralChain: ['u-1012', 'u-1013', 'u-1014', 'u-1015', 'u-1016'] },
      { userId: 'u-1006', referralCode: 'KC2024K1L2', invitesSent: 12, invitesConverted: 7, totalRewards: 3500, referralChain: ['u-1017', 'u-1018'] },
      { userId: 'u-1007', referralCode: 'KC2024M3N4', invitesSent: 20, invitesConverted: 14, totalRewards: 7000, referralChain: ['u-1019', 'u-1020', 'u-1021'] },
      { userId: 'u-1008', referralCode: 'KC2024O5P6', invitesSent: 5, invitesConverted: 3, totalRewards: 1500, referralChain: ['u-1022'] },
    ],
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
  },
  {
    id: 'ref-002',
    name: '企业推荐入驻奖励',
    type: 'employer_invite',
    rewardType: 'cash',
    rewardAmount: 50,
    maxRewardsPerUser: 20,
    targetGoal: 500,
    currentProgress: 187,
    participants: [
      { userId: 'u-2001', referralCode: 'EMP2024A001', invitesSent: 10, invitesConverted: 6, totalRewards: 300, referralChain: ['u-2002', 'u-2003'] },
      { userId: 'u-2002', referralCode: 'EMP2024B002', invitesSent: 5, invitesConverted: 3, totalRewards: 150, referralChain: ['u-2004'] },
      { userId: 'u-2003', referralCode: 'EMP2024C003', invitesSent: 15, invitesConverted: 9, totalRewards: 450, referralChain: ['u-2005', 'u-2006', 'u-2007'] },
      { userId: 'u-2004', referralCode: 'EMP2024D004', invitesSent: 8, invitesConverted: 4, totalRewards: 200, referralChain: ['u-2008'] },
      { userId: 'u-2005', referralCode: 'EMP2024E005', invitesSent: 20, invitesConverted: 12, totalRewards: 600, referralChain: ['u-2009', 'u-2010', 'u-2011'] },
    ],
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
  },
  {
    id: 'ref-003',
    name: '分享职位得好礼',
    type: 'share_job',
    rewardType: 'premium',
    rewardAmount: 7,
    maxRewardsPerUser: 4,
    targetGoal: 10000,
    currentProgress: 6750,
    participants: [
      { userId: 'u-3001', referralCode: 'SHARE001', invitesSent: 50, invitesConverted: 35, totalRewards: 245, referralChain: ['u-3002', 'u-3003', 'u-3004', 'u-3005'] },
      { userId: 'u-3002', referralCode: 'SHARE002', invitesSent: 30, invitesConverted: 20, totalRewards: 140, referralChain: ['u-3006', 'u-3007'] },
      { userId: 'u-3003', referralCode: 'SHARE003', invitesSent: 65, invitesConverted: 42, totalRewards: 294, referralChain: ['u-3008', 'u-3009', 'u-3010', 'u-3011', 'u-3012'] },
      { userId: 'u-3004', referralCode: 'SHARE004', invitesSent: 18, invitesConverted: 11, totalRewards: 77, referralChain: ['u-3013'] },
      { userId: 'u-3005', referralCode: 'SHARE005', invitesSent: 42, invitesConverted: 28, totalRewards: 196, referralChain: ['u-3014', 'u-3015', 'u-3016'] },
      { userId: 'u-3006', referralCode: 'SHARE006', invitesSent: 25, invitesConverted: 16, totalRewards: 112, referralChain: ['u-3017', 'u-3018'] },
    ],
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
  },
  {
    id: 'ref-004',
    name: '培训课程分享赢会员',
    type: 'share_course',
    rewardType: 'discount',
    rewardAmount: 30,
    maxRewardsPerUser: 5,
    targetGoal: 3000,
    currentProgress: 1200,
    participants: [
      { userId: 'u-4001', referralCode: 'COURSE01', invitesSent: 15, invitesConverted: 8, totalRewards: 240, referralChain: ['u-4002', 'u-4003'] },
      { userId: 'u-4002', referralCode: 'COURSE02', invitesSent: 22, invitesConverted: 12, totalRewards: 360, referralChain: ['u-4004', 'u-4005', 'u-4006'] },
      { userId: 'u-4003', referralCode: 'COURSE03', invitesSent: 10, invitesConverted: 5, totalRewards: 150, referralChain: ['u-4007'] },
      { userId: 'u-4004', referralCode: 'COURSE04', invitesSent: 35, invitesConverted: 20, totalRewards: 600, referralChain: ['u-4008', 'u-4009', 'u-4010', 'u-4011'] },
    ],
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
  },
  {
    id: 'ref-005',
    name: '社群邀请得VIP特权',
    type: 'community_join',
    rewardType: 'premium',
    rewardAmount: 30,
    maxRewardsPerUser: 3,
    targetGoal: 2000,
    currentProgress: 890,
    participants: [
      { userId: 'u-5001', referralCode: 'COMMU001', invitesSent: 20, invitesConverted: 13, totalRewards: 390, referralChain: ['u-5002', 'u-5003', 'u-5004'] },
      { userId: 'u-5002', referralCode: 'COMMU002', invitesSent: 12, invitesConverted: 7, totalRewards: 210, referralChain: ['u-5005', 'u-5006'] },
      { userId: 'u-5003', referralCode: 'COMMU003', invitesSent: 30, invitesConverted: 18, totalRewards: 540, referralChain: ['u-5007', 'u-5008', 'u-5009'] },
      { userId: 'u-5004', referralCode: 'COMMU004', invitesSent: 8, invitesConverted: 4, totalRewards: 120, referralChain: ['u-5010'] },
      { userId: 'u-5005', referralCode: 'COMMU005', invitesSent: 18, invitesConverted: 11, totalRewards: 330, referralChain: ['u-5011', 'u-5012'] },
    ],
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
  },
  {
    id: 'ref-006',
    name: '春节特别活动-推荐红包',
    type: 'jobseeker_invite',
    rewardType: 'cash',
    rewardAmount: 5,
    maxRewardsPerUser: 50,
    targetGoal: 2000,
    currentProgress: 2000,
    participants: [
      { userId: 'u-6001', referralCode: 'CNY202401', invitesSent: 40, invitesConverted: 25, totalRewards: 125, referralChain: ['u-6002', 'u-6003', 'u-6004'] },
      { userId: 'u-6002', referralCode: 'CNY202402', invitesSent: 55, invitesConverted: 35, totalRewards: 175, referralChain: ['u-6005', 'u-6006', 'u-6007', 'u-6008'] },
      { userId: 'u-6003', referralCode: 'CNY202403', invitesSent: 30, invitesConverted: 18, totalRewards: 90, referralChain: ['u-6009', 'u-6010'] },
      { userId: 'u-6004', referralCode: 'CNY202404', invitesSent: 25, invitesConverted: 15, totalRewards: 75, referralChain: ['u-6011', 'u-6012'] },
    ],
    status: 'ended',
    startDate: '2024-01-25',
    endDate: '2024-02-25',
  },
  {
    id: 'ref-007',
    name: 'Khmer New Year推荐狂欢',
    type: 'share_job',
    rewardType: 'credit',
    rewardAmount: 1000,
    maxRewardsPerUser: 5,
    targetGoal: 3000,
    currentProgress: 0,
    participants: [],
    status: 'draft',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
  },
];

const mockViralTemplates: ViralTemplate[] = [
  {
    id: 'viral-001',
    name: '邀请注册得积分',
    description: '用户邀请好友注册并完成简历填写，双方获得积分奖励',
    trigger: '用户完成注册并激活账户',
    action: '分享专属邀请链接给好友',
    reward: '邀请人500积分，被邀请人200积分',
    viralCoefficient: 1.8,
    estimatedReach: 5000,
  },
  {
    id: 'viral-002',
    name: '企业入驻推荐奖金',
    description: '推荐企业成功入驻平台，推荐人获得现金奖励',
    trigger: '企业HR完成首次职位发布',
    action: '将平台推荐给其他企业HR',
    reward: '每成功推荐一家企业，获得$50现金',
    viralCoefficient: 1.2,
    estimatedReach: 500,
  },
  {
    id: 'viral-003',
    name: '职位分享解锁特权',
    description: '分享职位到社交媒体，累计分享次数解锁高级会员',
    trigger: '用户浏览职位详情页',
    action: '将职位分享到Facebook/Telegram',
    reward: '分享3次获得7天Premium，分享10次获得30天Premium',
    viralCoefficient: 2.5,
    estimatedReach: 10000,
  },
  {
    id: 'viral-004',
    name: '二级裂变奖励',
    description: '不仅邀请好友有奖励，好友再邀请其他人也能获得分成',
    trigger: '好友成功邀请另一位用户',
    action: '持续推广邀请链接',
    reward: '一级邀请50%奖励，二级邀请25%奖励',
    viralCoefficient: 3.2,
    estimatedReach: 15000,
  },
  {
    id: 'viral-005',
    name: '社群打卡裂变',
    description: '加入Telegram社群并每日打卡，邀请更多成员获得奖励',
    trigger: '用户加入Telegram求职社群',
    action: '邀请朋友加入社群并每日签到',
    reward: '每邀请1人获得30天VIP，连续打卡7天额外奖励',
    viralCoefficient: 2.1,
    estimatedReach: 3000,
  },
  {
    id: 'viral-006',
    name: '限时红包裂变',
    description: '特定节日发放现金红包，需邀请好友才能领取',
    trigger: '节日期间用户登录App',
    action: '邀请好友助力拆红包',
    reward: '每邀请1人获得$5，上限$250',
    viralCoefficient: 4.5,
    estimatedReach: 8000,
  },
  {
    id: 'viral-007',
    name: '课程学习分享',
    description: '完成职业技能课程学习后，分享证书获得折扣',
    trigger: '用户完成课程学习并获得证书',
    action: '将学习证书分享到社交媒体',
    reward: '分享获得30%课程折扣码',
    viralCoefficient: 1.6,
    estimatedReach: 2000,
  },
  {
    id: 'viral-008',
    name: '成功求职双享奖',
    description: '通过平台成功找到工作的用户，邀请好友也能获得奖金',
    trigger: '用户标记为"已入职"状态',
    action: '邀请正在求职的好友使用平台',
    reward: '好友成功入职后，双方各得$20',
    viralCoefficient: 2.8,
    estimatedReach: 5000,
  },
];

// ==================== 工具函数 ====================

/** 生成唯一ID */
const generateId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** 生成推荐码 */
const generateReferralCode = (campaignId: string): string => {
  const prefix = campaignId.split('-')[0]?.toUpperCase() || 'REF';
  return `${prefix}${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).toUpperCase().slice(-4)}`;
};

/** 从localStorage加载数据 */
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`[GrowthEngineStore] Failed to load ${key}:`, error);
  }
  return fallback;
};

/** 保存到localStorage */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[GrowthEngineStore] Failed to save ${key}:`, error);
  }
};

// ==================== Store Hook ====================

export function useGrowthEngineStore() {
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>(() =>
    loadFromStorage<ReferralCampaign[]>(STORAGE_KEY_CAMPAIGNS, mockCampaigns)
  );
  const [viralTemplates, setViralTemplates] = useState<ViralTemplate[]>(() =>
    loadFromStorage<ViralTemplate[]>(STORAGE_KEY_TEMPLATES, mockViralTemplates)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 持久化到localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY_CAMPAIGNS, campaigns);
  }, [campaigns]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_TEMPLATES, viralTemplates);
  }, [viralTemplates]);

  // ==================== Campaign CRUD ====================

  /** 创建邀请活动 */
  const createCampaign = useCallback(
    (data: Omit<ReferralCampaign, 'id' | 'currentProgress' | 'participants' | 'status'> & { status?: ReferralCampaignStatus }): ReferralCampaign => {
      const newCampaign: ReferralCampaign = {
        ...data,
        id: generateId('ref'),
        currentProgress: 0,
        participants: [],
        status: data.status || 'draft',
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    },
    []
  );

  /** 更新邀请活动 */
  const updateCampaign = useCallback((id: string, updates: Partial<ReferralCampaign>): ReferralCampaign | null => {
    let updated: ReferralCampaign | null = null;
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

  /** 删除邀请活动 */
  const deleteCampaign = useCallback((id: string): boolean => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    return true;
  }, []);

  /** 获取单个邀请活动 */
  const getCampaign = useCallback((id: string): ReferralCampaign | undefined => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  /** 更新活动状态 */
  const updateCampaignStatus = useCallback((id: string, status: ReferralCampaignStatus): ReferralCampaign | null => {
    return updateCampaign(id, { status });
  }, [updateCampaign]);

  /** 更新活动进度 */
  const updateProgress = useCallback((id: string, increment: number): ReferralCampaign | null => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return null;
    return updateCampaign(id, { currentProgress: Math.min(campaign.currentProgress + increment, campaign.targetGoal) });
  }, [campaigns, updateCampaign]);

  /** 筛选邀请活动 */
  const filterCampaigns = useCallback(
    (filters: {
      type?: ReferralCampaignType;
      status?: ReferralCampaignStatus;
      rewardType?: RewardType;
      searchQuery?: string;
    }): ReferralCampaign[] => {
      return campaigns.filter(c => {
        if (filters.type && c.type !== filters.type) return false;
        if (filters.status && c.status !== filters.status) return false;
        if (filters.rewardType && c.rewardType !== filters.rewardType) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return c.name.toLowerCase().includes(q);
        }
        return true;
      });
    },
    [campaigns]
  );

  // ==================== 参与者管理 ====================

  /** 添加参与者 */
  const addParticipant = useCallback(
    (campaignId: string, userId: string, referralChain?: string[]): ReferralParticipant | null => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return null;
      if (campaign.participants.find(p => p.userId === userId)) return null;

      const participant: ReferralParticipant = {
        userId,
        referralCode: generateReferralCode(campaignId),
        invitesSent: 0,
        invitesConverted: 0,
        totalRewards: 0,
        referralChain: referralChain || [],
      };

      setCampaigns(prev =>
        prev.map(c => (c.id === campaignId ? { ...c, participants: [...c.participants, participant] } : c))
      );
      return participant;
    },
    [campaigns]
  );

  /** 更新参与者数据 */
  const updateParticipant = useCallback(
    (campaignId: string, userId: string, updates: Partial<ReferralParticipant>): ReferralParticipant | null => {
      let updated: ReferralParticipant | null = null;
      setCampaigns(prev =>
        prev.map(c => {
          if (c.id === campaignId) {
            const updatedParticipants = c.participants.map(p => {
              if (p.userId === userId) {
                updated = { ...p, ...updates };
                return updated;
              }
              return p;
            });
            return { ...c, participants: updatedParticipants };
          }
          return c;
        })
      );
      return updated;
    },
    []
  );

  /** 记录邀请发送 */
  const recordInviteSent = useCallback(
    (campaignId: string, userId: string): ReferralParticipant | null => {
      const participant = campaigns.find(c => c.id === campaignId)?.participants.find(p => p.userId === userId);
      if (!participant) return null;
      return updateParticipant(campaignId, userId, { invitesSent: participant.invitesSent + 1 });
    },
    [campaigns, updateParticipant]
  );

  /** 记录邀请转化 */
  const recordInviteConverted = useCallback(
    (campaignId: string, userId: string): { participant: ReferralParticipant | null; campaign: ReferralCampaign | null } => {
      const campaign = campaigns.find(c => c.id === campaignId);
      const participant = campaign?.participants.find(p => p.userId === userId);
      if (!campaign || !participant) return { participant: null, campaign: null };

      const updatedInvitesConverted = participant.invitesConverted + 1;
      const updatedTotalRewards = participant.totalRewards + campaign.rewardAmount;

      const updatedParticipant = updateParticipant(campaignId, userId, {
        invitesConverted: updatedInvitesConverted,
        totalRewards: updatedTotalRewards,
      });

      const updatedCampaign = updateProgress(campaignId, 1);
      return { participant: updatedParticipant, campaign: updatedCampaign };
    },
    [campaigns, updateParticipant, updateProgress]
  );

  /** 获取参与者的裂变链 */
  const getReferralChain = useCallback(
    (campaignId: string, userId: string): ReferralParticipant[] => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return [];
      const participant = campaign.participants.find(p => p.userId === userId);
      if (!participant) return [];
      return participant.referralChain
        .map(chainId => campaign.participants.find(p => p.userId === chainId))
        .filter(Boolean) as ReferralParticipant[];
    },
    [campaigns]
  );

  /** 获取排行榜 */
  const getLeaderboard = useCallback(
    (campaignId: string, sortBy: 'invitesSent' | 'invitesConverted' | 'totalRewards' = 'totalRewards'): ReferralParticipant[] => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return [];
      return [...campaign.participants].sort((a, b) => b[sortBy] - a[sortBy]);
    },
    [campaigns]
  );

  // ==================== Viral Template CRUD ====================

  /** 创建裂变模板 */
  const createViralTemplate = useCallback((data: Omit<ViralTemplate, 'id'>): ViralTemplate => {
    const newTemplate: ViralTemplate = {
      ...data,
      id: generateId('viral'),
    };
    setViralTemplates(prev => [newTemplate, ...prev]);
    return newTemplate;
  }, []);

  /** 更新裂变模板 */
  const updateViralTemplate = useCallback((id: string, updates: Partial<ViralTemplate>): ViralTemplate | null => {
    let updated: ViralTemplate | null = null;
    setViralTemplates(prev =>
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

  /** 删除裂变模板 */
  const deleteViralTemplate = useCallback((id: string): boolean => {
    setViralTemplates(prev => prev.filter(t => t.id !== id));
    return true;
  }, []);

  /** 获取单个裂变模板 */
  const getViralTemplate = useCallback((id: string): ViralTemplate | undefined => {
    return viralTemplates.find(t => t.id === id);
  }, [viralTemplates]);

  // ==================== 统计聚合 ====================

  /** 获取增长引擎统计概览 */
  const getGrowthStats = useCallback(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalParticipants = campaigns.reduce((sum, c) => sum + c.participants.length, 0);
    const totalInvitesSent = campaigns.reduce((sum, c) => sum + c.participants.reduce((s, p) => s + p.invitesSent, 0), 0);
    const totalInvitesConverted = campaigns.reduce(
      (sum, c) => sum + c.participants.reduce((s, p) => s + p.invitesConverted, 0),
      0
    );
    const totalRewardsDistributed = campaigns.reduce(
      (sum, c) => sum + c.participants.reduce((s, p) => s + p.totalRewards, 0),
      0
    );
    const avgConversionRate = totalInvitesSent > 0 ? parseFloat(((totalInvitesConverted / totalInvitesSent) * 100).toFixed(2)) : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      totalParticipants,
      totalInvitesSent,
      totalInvitesConverted,
      totalRewardsDistributed: parseFloat(totalRewardsDistributed.toFixed(2)),
      avgConversionRate,
      completionRate: campaigns.reduce((sum, c) => sum + (c.targetGoal > 0 ? c.currentProgress / c.targetGoal : 0), 0) / (campaigns.length || 1),
    };
  }, [campaigns]);

  /** 按类型分组统计 */
  const getCampaignTypeDistribution = useCallback((): Record<ReferralCampaignType, number> => {
    const distribution: Record<ReferralCampaignType, number> = {
      jobseeker_invite: 0,
      employer_invite: 0,
      share_job: 0,
      share_course: 0,
      community_join: 0,
    };
    campaigns.forEach(c => { distribution[c.type]++; });
    return distribution;
  }, [campaigns]);

  /** 按状态分组统计 */
  const getCampaignStatusDistribution = useCallback((): Record<ReferralCampaignStatus, number> => {
    const distribution: Record<ReferralCampaignStatus, number> = {
      draft: 0,
      active: 0,
      paused: 0,
      ended: 0,
    };
    campaigns.forEach(c => { distribution[c.status]++; });
    return distribution;
  }, [campaigns]);

  /** 获取顶级推荐者（跨活动） */
  const getTopReferrers = useCallback(
    (limit: number = 10): Array<{ userId: string; totalInvitesSent: number; totalInvitesConverted: number; totalRewards: number }> => {
      const userMap = new Map<string, { userId: string; totalInvitesSent: number; totalInvitesConverted: number; totalRewards: number }>();

      campaigns.forEach(c => {
        c.participants.forEach(p => {
          const existing = userMap.get(p.userId);
          if (existing) {
            existing.totalInvitesSent += p.invitesSent;
            existing.totalInvitesConverted += p.invitesConverted;
            existing.totalRewards += p.totalRewards;
          } else {
            userMap.set(p.userId, {
              userId: p.userId,
              totalInvitesSent: p.invitesSent,
              totalInvitesConverted: p.invitesConverted,
              totalRewards: p.totalRewards,
            });
          }
        });
      });

      return Array.from(userMap.values())
        .sort((a, b) => b.totalRewards - a.totalRewards)
        .slice(0, limit);
    },
    [campaigns]
  );

  /** 预估裂变效果 */
  const estimateViralImpact = useCallback(
    (templateId: string, initialUsers: number): { estimatedReach: number; estimatedConversions: number; rounds: number[] } | null => {
      const template = viralTemplates.find(t => t.id === templateId);
      if (!template) return null;

      const rounds: number[] = [initialUsers];
      let totalReach = initialUsers;
      let currentUsers = initialUsers;

      for (let i = 0; i < 5; i++) {
        currentUsers = Math.floor(currentUsers * template.viralCoefficient);
        rounds.push(currentUsers);
        totalReach += currentUsers;
      }

      const avgConversionRate = 0.15;
      return {
        estimatedReach: totalReach,
        estimatedConversions: Math.floor(totalReach * avgConversionRate),
        rounds,
      };
    },
    [viralTemplates]
  );

  // ==================== 工具方法 ====================

  /** 重置为Mock数据 */
  const resetToMockData = useCallback(() => {
    setCampaigns(mockCampaigns);
    setViralTemplates(mockViralTemplates);
    setError(null);
  }, []);

  /** 清除所有数据 */
  const clearAll = useCallback(() => {
    setCampaigns([]);
    setViralTemplates([]);
    localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEY_TEMPLATES);
  }, []);

  return {
    // 状态
    campaigns,
    viralTemplates,
    isLoading,
    error,

    // Campaign CRUD
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    updateCampaignStatus,
    updateProgress,
    filterCampaigns,

    // 参与者管理
    addParticipant,
    updateParticipant,
    recordInviteSent,
    recordInviteConverted,
    getReferralChain,
    getLeaderboard,

    // Viral Template CRUD
    createViralTemplate,
    updateViralTemplate,
    deleteViralTemplate,
    getViralTemplate,

    // 统计
    getGrowthStats,
    getCampaignTypeDistribution,
    getCampaignStatusDistribution,
    getTopReferrers,
    estimateViralImpact,

    // 工具
    setIsLoading,
    setError,
    resetToMockData,
    clearAll,
  };
}
