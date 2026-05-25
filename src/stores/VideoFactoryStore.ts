import { useState, useEffect, useCallback } from 'react';

// ==================== 类型定义 ====================

/** 视频项目类型 */
export type VideoProjectType = 'job_highlight' | 'success_story' | 'tips' | 'platform_intro' | 'testimonial' | 'trending';

/** 视频项目状态 */
export type VideoProjectStatus = 'script_writing' | 'voice_recording' | 'video_editing' | 'review' | 'published' | 'scheduled';

/** 平台发布状态 */
export type PlatformPublishStatus = 'pending' | 'uploading' | 'published' | 'failed';

/** 视频场景接口 */
export interface VideoScene {
  id: number;
  text: string;
  visual: string;
  duration: number;
  transition: string;
}

/** 发布平台信息接口 */
export interface VideoPlatform {
  name: string;
  status: PlatformPublishStatus;
  url: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

/** 视频项目接口 */
export interface VideoProject {
  id: string;
  title: string;
  type: VideoProjectType;
  status: VideoProjectStatus;
  script: {
    content: string;
    duration: number;
    scenes: VideoScene[];
    voiceOver: string;
    bgm: string;
  };
  video: {
    url: string;
    thumbnail: string;
    duration: number;
    resolution: string;
  };
  platforms: VideoPlatform[];
  schedule?: {
    publishDate: string;
    platforms: string[];
  };
  createdAt: string;
}

/** Store状态接口 */
export interface VideoFactoryStoreState {
  projects: VideoProject[];
  isLoading: boolean;
  error: string | null;
}

// ==================== Constants ====================

const STORAGE_KEY = 'khmercareer_video_factory_projects';

// ==================== Mock 数据 ====================

const mockProjects: VideoProject[] = [
  {
    id: 'vid-001',
    title: '金边科技公司招聘亮点',
    type: 'job_highlight',
    status: 'published',
    script: {
      content: '想在柬埔寨最好的科技公司工作吗？我们提供优厚的薪酬、灵活的工作时间和国际化的团队环境。',
      duration: 45,
      scenes: [
        { id: 1, text: '想在柬埔寨最好的科技公司工作吗？', visual: '现代化办公室全景，员工在电脑前工作', duration: 5, transition: 'fade_in' },
        { id: 2, text: '我们提供优厚的薪酬和福利待遇', visual: '薪资数字动画上升，福利图标展示', duration: 8, transition: 'slide_left' },
        { id: 3, text: '灵活的工作时间', visual: '员工自由选择工作时间场景', duration: 7, transition: 'slide_up' },
        { id: 4, text: '国际化的团队环境', visual: '多元化团队合影，各国员工交流', duration: 8, transition: 'zoom_in' },
        { id: 5, text: '立即申请，开启你的职业新篇章！', visual: '公司logo和申请二维码', duration: 7, transition: 'fade_out' },
      ],
      voiceOver: '专业男声 - 热情激励风格',
      bgm: 'Upbeat Corporate - 轻快企业风格',
    },
    video: {
      url: 'https://videos.khmercareer.com/jobs/tech-highlight-001.mp4',
      thumbnail: 'https://images.khmercareer.com/thumbnails/tech-hiring-thumb.jpg',
      duration: 45,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'published', url: 'https://tiktok.com/@khmercareer/video/001', metrics: { views: 52300, likes: 4200, shares: 1800, comments: 340 } },
      { name: 'facebook', status: 'published', url: 'https://facebook.com/khmercareer/videos/001', metrics: { views: 31800, likes: 2900, shares: 1200, comments: 520 } },
      { name: 'instagram', status: 'published', url: 'https://instagram.com/khmercareer/reel/001', metrics: { views: 28900, likes: 3600, shares: 890, comments: 210 } },
      { name: 'youtube', status: 'published', url: 'https://youtube.com/shorts/001', metrics: { views: 15600, likes: 1800, shares: 450, comments: 160 } },
    ],
    createdAt: '2024-01-05T09:00:00Z',
  },
  {
    id: 'vid-002',
    title: 'Sokha的成功故事 - 从实习生到项目经理',
    type: 'success_story',
    status: 'published',
    script: {
      content: '我是Sokha，两年前我还是一名普通的实习生，通过KhmerCareer我找到了改变人生的机会。',
      duration: 60,
      scenes: [
        { id: 1, text: '两年前，我还是一名刚毕业的实习生', visual: '年轻女性走在校园中，手持简历', duration: 8, transition: 'fade_in' },
        { id: 2, text: '投递了无数份简历，却始终没有回应', visual: '手机屏幕显示已发送的邮件，表情失落', duration: 8, transition: 'slide_right' },
        { id: 3, text: '直到我发现了KhmerCareer', visual: '手指点击KhmerCareer App图标，界面亮起', duration: 7, transition: 'zoom_in' },
        { id: 4, text: '完善的简历工具帮我脱颖而出', visual: '简历模板展示，技能标签高亮', duration: 8, transition: 'slide_left' },
        { id: 5, text: '我收到了多家公司的面试邀请', visual: '手机通知动画，多个面试邀请弹出', duration: 8, transition: 'slide_up' },
        { id: 6, text: '现在，我已经成为项目经理了！', visual: 'Sokha在现代办公室中领导团队开会', duration: 10, transition: 'zoom_out' },
        { id: 7, text: '你也可以，立即下载KhmerCareer！', visual: 'App下载二维码和五星好评', duration: 11, transition: 'fade_out' },
      ],
      voiceOver: '女声叙述 - 温暖真实风格',
      bgm: 'Inspirational Piano - 温暖励志钢琴曲',
    },
    video: {
      url: 'https://videos.khmercareer.com/stories/sokha-success-001.mp4',
      thumbnail: 'https://images.khmercareer.com/thumbnails/sokha-story-thumb.jpg',
      duration: 60,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'published', url: 'https://tiktok.com/@khmercareer/video/002', metrics: { views: 128500, likes: 15600, shares: 8900, comments: 1200 } },
      { name: 'facebook', status: 'published', url: 'https://facebook.com/khmercareer/videos/002', metrics: { views: 89500, likes: 11200, shares: 5600, comments: 2300 } },
      { name: 'youtube', status: 'published', url: 'https://youtube.com/shorts/002', metrics: { views: 34200, likes: 4200, shares: 1800, comments: 560 } },
    ],
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'vid-003',
    title: '求职技巧 - 如何写出完美简历',
    type: 'tips',
    status: 'published',
    script: {
      content: '一份好的简历是你求职成功的第一步。今天教你5个技巧，让你的简历脱颖而出。',
      duration: 55,
      scenes: [
        { id: 1, text: '技巧1：简洁明了，突出重点', visual: '简历模板对比：左边冗长 vs 右边简洁', duration: 10, transition: 'fade_in' },
        { id: 2, text: '技巧2：量化你的成就', visual: '数字高亮动画：提升30%、管理50人', duration: 10, transition: 'slide_left' },
        { id: 3, text: '技巧3：针对性修改简历', visual: '根据职位描述调整简历关键词', duration: 10, transition: 'slide_right' },
        { id: 4, text: '技巧4：注意排版和格式', visual: '专业简历排版模板展示', duration: 10, transition: 'slide_up' },
        { id: 5, text: '技巧5：使用KhmerCareer简历工具', visual: 'App简历工具界面演示', duration: 15, transition: 'fade_out' },
      ],
      voiceOver: '专业女声 - 清晰教学风格',
      bgm: 'Light Tutorial - 轻快教学背景音乐',
    },
    video: {
      url: 'https://videos.khmercareer.com/tips/resume-tips-001.mp4',
      thumbnail: 'https://images.khmercareer.com/thumbnails/resume-tips-thumb.jpg',
      duration: 55,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'published', url: 'https://tiktok.com/@khmercareer/video/003', metrics: { views: 89200, likes: 10200, shares: 5600, comments: 890 } },
      { name: 'instagram', status: 'published', url: 'https://instagram.com/khmercareer/reel/003', metrics: { views: 45600, likes: 5800, shares: 2100, comments: 450 } },
      { name: 'youtube', status: 'published', url: 'https://youtube.com/shorts/003', metrics: { views: 23400, likes: 3100, shares: 1200, comments: 380 } },
    ],
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'vid-004',
    title: 'KhmerCareer平台介绍 - 找工作从未如此简单',
    type: 'platform_intro',
    status: 'video_editing',
    script: {
      content: 'KhmerCareer是柬埔寨领先的求职平台，连接优秀人才与顶级雇主。超过100万用户的选择。',
      duration: 50,
      scenes: [
        { id: 1, text: '找工作，就选KhmerCareer！', visual: 'App界面快速切换展示', duration: 8, transition: 'fade_in' },
        { id: 2, text: '100万+用户的信赖之选', visual: '用户数字跳动增长动画', duration: 8, transition: 'zoom_in' },
        { id: 3, text: '智能匹配，精准推荐', visual: '匹配算法可视化动画', duration: 10, transition: 'slide_left' },
        { id: 4, text: '一键申请，快速反馈', visual: '手指点击申请按钮，通知弹出', duration: 10, transition: 'slide_up' },
        { id: 5, text: '职业成长，全程陪伴', visual: '职业发展路径图动画', duration: 14, transition: 'fade_out' },
      ],
      voiceOver: '专业男声 - 自信大气风格',
      bgm: 'Modern Tech - 现代科技感音乐',
    },
    video: {
      url: '',
      thumbnail: '',
      duration: 50,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'facebook', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'instagram', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'youtube', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
    ],
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'vid-005',
    title: '客户见证 - 建筑公司HR访谈',
    type: 'testimonial',
    status: 'review',
    script: {
      content: 'KhmerCareer帮助我们公司在两周内招到了12名优秀员工，效率比以往提升了3倍。',
      duration: 70,
      scenes: [
        { id: 1, text: '我是Dara，建筑公司人力资源总监', visual: '专业男性在办公室接受采访', duration: 10, transition: 'fade_in' },
        { id: 2, text: '以前招聘一个职位平均需要一个月', visual: '日历翻页动画，时间流逝', duration: 12, transition: 'slide_right' },
        { id: 3, text: '使用KhmerCareer后，只需两周', visual: '对比动画：左边慢，右边快', duration: 12, transition: 'split_screen' },
        { id: 4, text: '两周内我们招到了12名员工', visual: '12名员工头像展示动画', duration: 12, transition: 'slide_left' },
        { id: 5, text: '人才质量也大大提升了', visual: '员工工作场景，满意的笑容', duration: 12, transition: 'slide_up' },
        { id: 6, text: 'KhmerCareer，企业招聘的最佳选择', visual: '公司logo和App界面', duration: 12, transition: 'fade_out' },
      ],
      voiceOver: '受访者原声 - 真实自然',
      bgm: 'Warm Corporate - 温暖企业背景音乐',
    },
    video: {
      url: 'https://videos.khmercareer.com/testimonials/building-hr-001.mp4',
      thumbnail: 'https://images.khmercareer.com/thumbnails/testimonial-hr-thumb.jpg',
      duration: 70,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'facebook', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'youtube', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
    ],
    schedule: {
      publishDate: '2024-02-05T10:00:00Z',
      platforms: ['tiktok', 'facebook', 'youtube'],
    },
    createdAt: '2024-01-25T16:00:00Z',
  },
  {
    id: 'vid-006',
    title: '2024年柬埔寨热门行业趋势',
    type: 'trending',
    status: 'script_writing',
    script: {
      content: '2024年柬埔寨哪些行业最热门？IT、电商、旅游三大行业领跑就业市场。',
      duration: 40,
      scenes: [
        { id: 1, text: '2024年柬埔寨就业市场最热门的三个行业', visual: '动态数据图表上升', duration: 8, transition: 'fade_in' },
        { id: 2, text: '第一名：IT科技行业，薪资增长25%', visual: '科技元素动画，代码流动', duration: 10, transition: 'slide_up' },
        { id: 3, text: '第二名：电子商务，人才需求激增', visual: '电商平台界面快速切换', duration: 10, transition: 'slide_left' },
        { id: 4, text: '第三名：旅游业强势复苏', visual: '吴哥窟、海滩等旅游景点航拍', duration: 12, transition: 'fade_out' },
      ],
      voiceOver: '新闻主播风 - 专业权威风格',
      bgm: 'News Theme - 新闻主题音乐',
    },
    video: {
      url: '',
      thumbnail: '',
      duration: 40,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'facebook', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'instagram', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'youtube', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'telegram', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
    ],
    createdAt: '2024-01-28T09:30:00Z',
  },
  {
    id: 'vid-007',
    title: '暹粒酒店业招聘季 - 加入我们',
    type: 'job_highlight',
    status: 'scheduled',
    script: {
      content: '暹粒旅游旺季来了！各大酒店急招前台、服务员、导游等岗位。',
      duration: 35,
      scenes: [
        { id: 1, text: '暹粒旅游旺季来袭！', visual: '吴哥窟日出航拍，游客络绎不绝', duration: 6, transition: 'fade_in' },
        { id: 2, text: '各大酒店急招人才', visual: '豪华酒店外观和前台场景', duration: 8, transition: 'slide_up' },
        { id: 3, text: '前台、服务员、导游等多岗位', visual: '各岗位工作场景快速展示', duration: 8, transition: 'slide_left' },
        { id: 4, text: '待遇优厚，包吃包住', visual: '员工宿舍和餐厅环境展示', duration: 7, transition: 'zoom_in' },
        { id: 5, text: '立即申请，机会有限！', visual: '申请链接和联系方式', duration: 6, transition: 'fade_out' },
      ],
      voiceOver: '热情女声 - 旅游推广风格',
      bgm: 'Tropical Vibe - 热带风情音乐',
    },
    video: {
      url: 'https://videos.khmercareer.com/jobs/siemreap-hotel-001.mp4',
      thumbnail: 'https://images.khmercareer.com/thumbnails/siemreap-hiring-thumb.jpg',
      duration: 35,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'facebook', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'instagram', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'youtube', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
    ],
    schedule: {
      publishDate: '2024-02-10T08:00:00Z',
      platforms: ['tiktok', 'facebook', 'instagram', 'youtube'],
    },
    createdAt: '2024-01-30T10:00:00Z',
  },
  {
    id: 'vid-008',
    title: '面试技巧 - 如何在5分钟打动HR',
    type: 'tips',
    status: 'voice_recording',
    script: {
      content: '面试的前5分钟决定了80%的结果。掌握这三个技巧，让你瞬间打动HR。',
      duration: 48,
      scenes: [
        { id: 1, text: '面试前5分钟，至关重要！', visual: '面试场景，计时器显示5分钟', duration: 8, transition: 'fade_in' },
        { id: 2, text: '技巧1：自信的自我介绍', visual: '面试者自信微笑，眼神交流', duration: 12, transition: 'slide_up' },
        { id: 3, text: '技巧2：STAR法则回答问题', visual: 'STAR四个字母和示例图表', duration: 14, transition: 'slide_left' },
        { id: 4, text: '技巧3：准备2-3个反问问题', visual: '面试者提问，面试官点头赞许', duration: 14, transition: 'fade_out' },
      ],
      voiceOver: '专业教练风 - 自信鼓励风格',
      bgm: 'Motivational Beat - 激励节奏音乐',
    },
    video: {
      url: '',
      thumbnail: '',
      duration: 48,
      resolution: '1080x1920',
    },
    platforms: [
      { name: 'tiktok', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'facebook', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
      { name: 'youtube', status: 'pending', url: '', metrics: { views: 0, likes: 0, shares: 0, comments: 0 } },
    ],
    createdAt: '2024-01-28T14:00:00Z',
  },
];

// ==================== 工具函数 ====================

/** 生成唯一ID */
const generateId = (): string => `vid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** 从localStorage加载数据 */
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`[VideoFactoryStore] Failed to load ${key}:`, error);
  }
  return fallback;
};

/** 保存到localStorage */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[VideoFactoryStore] Failed to save ${key}:`, error);
  }
};

// ==================== Store Hook ====================

export function useVideoFactoryStore() {
  const [projects, setProjects] = useState<VideoProject[]>(() =>
    loadFromStorage<VideoProject[]>(STORAGE_KEY, mockProjects)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 持久化到localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY, projects);
  }, [projects]);

  // ==================== CRUD 操作 ====================

  /** 创建视频项目 */
  const createProject = useCallback((data: Omit<VideoProject, 'id' | 'createdAt' | 'status'> & { status?: VideoProjectStatus }): VideoProject => {
    const newProject: VideoProject = {
      ...data,
      id: generateId(),
      status: data.status || 'script_writing',
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  /** 更新视频项目 */
  const updateProject = useCallback((id: string, updates: Partial<VideoProject>): VideoProject | null => {
    let updated: VideoProject | null = null;
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    return updated;
  }, []);

  /** 删除视频项目 */
  const deleteProject = useCallback((id: string): boolean => {
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  /** 获取单个项目 */
  const getProject = useCallback((id: string): VideoProject | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  // ==================== 状态流转 ====================

  /** 更新项目状态 */
  const updateProjectStatus = useCallback((id: string, status: VideoProjectStatus): VideoProject | null => {
    return updateProject(id, { status });
  }, [updateProject]);

  /** 推进到下一阶段 */
  const advanceToNextStage = useCallback((id: string): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;

    const statusFlow: VideoProjectStatus[] = ['script_writing', 'voice_recording', 'video_editing', 'review', 'published'];
    const currentIndex = statusFlow.indexOf(project.status);
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1) return null;

    const nextStatus = statusFlow[currentIndex + 1];
    return updateProject(id, { status: nextStatus });
  }, [projects, updateProject]);

  /** 回退到上一阶段 */
  const revertToPreviousStage = useCallback((id: string): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;

    const statusFlow: VideoProjectStatus[] = ['script_writing', 'voice_recording', 'video_editing', 'review', 'published'];
    const currentIndex = statusFlow.indexOf(project.status);
    if (currentIndex <= 0) return null;

    const prevStatus = statusFlow[currentIndex - 1];
    return updateProject(id, { status: prevStatus });
  }, [projects, updateProject]);

  // ==================== 脚本管理 ====================

  /** 更新脚本内容 */
  const updateScript = useCallback((id: string, scriptUpdates: Partial<VideoProject['script']>): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    return updateProject(id, { script: { ...project.script, ...scriptUpdates } });
  }, [projects, updateProject]);

  /** 更新场景 */
  const updateScene = useCallback((id: string, sceneId: number, sceneUpdates: Partial<VideoScene>): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    const updatedScenes = project.script.scenes.map(s =>
      s.id === sceneId ? { ...s, ...sceneUpdates } : s
    );
    return updateProject(id, { script: { ...project.script, scenes: updatedScenes } });
  }, [projects, updateProject]);

  /** 添加场景 */
  const addScene = useCallback((id: string, scene: Omit<VideoScene, 'id'>): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    const maxId = project.script.scenes.reduce((max, s) => Math.max(max, s.id), 0);
    const newScene: VideoScene = { ...scene, id: maxId + 1 };
    return updateProject(id, { script: { ...project.script, scenes: [...project.script.scenes, newScene] } });
  }, [projects, updateProject]);

  /** 删除场景 */
  const deleteScene = useCallback((id: string, sceneId: number): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    const updatedScenes = project.script.scenes.filter(s => s.id !== sceneId);
    return updateProject(id, { script: { ...project.script, scenes: updatedScenes } });
  }, [projects, updateProject]);

  /** 重新排序场景 */
  const reorderScenes = useCallback((id: string, sceneIds: number[]): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    const sceneMap = new Map(project.script.scenes.map(s => [s.id, s]));
    const reordered = sceneIds.map(sid => sceneMap.get(sid)).filter(Boolean) as VideoScene[];
    return updateProject(id, { script: { ...project.script, scenes: reordered } });
  }, [projects, updateProject]);

  // ==================== 视频管理 ====================

  /** 更新视频信息 */
  const updateVideoInfo = useCallback((id: string, videoUpdates: Partial<VideoProject['video']>): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    return updateProject(id, { video: { ...project.video, ...videoUpdates } });
  }, [projects, updateProject]);

  // ==================== 平台发布管理 ====================

  /** 更新平台发布状态 */
  const updatePlatformStatus = useCallback(
    (id: string, platformName: string, status: PlatformPublishStatus): VideoProject | null => {
      const project = projects.find(p => p.id === id);
      if (!project) return null;
      const updatedPlatforms = project.platforms.map(p =>
        p.name === platformName ? { ...p, status } : p
      );
      return updateProject(id, { platforms: updatedPlatforms });
    },
    [projects, updateProject]
  );

  /** 更新平台数据指标 */
  const updatePlatformMetrics = useCallback(
    (id: string, platformName: string, metrics: Partial<VideoPlatform['metrics']>): VideoProject | null => {
      const project = projects.find(p => p.id === id);
      if (!project) return null;
      const updatedPlatforms = project.platforms.map(p =>
        p.name === platformName ? { ...p, metrics: { ...p.metrics, ...metrics } } : p
      );
      return updateProject(id, { platforms: updatedPlatforms });
    },
    [projects, updateProject]
  );

  /** 添加发布平台 */
  const addPlatform = useCallback((id: string, platform: VideoPlatform): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    if (project.platforms.find(p => p.name === platform.name)) return null;
    return updateProject(id, { platforms: [...project.platforms, platform] });
  }, [projects, updateProject]);

  /** 移除发布平台 */
  const removePlatform = useCallback((id: string, platformName: string): VideoProject | null => {
    const project = projects.find(p => p.id === id);
    if (!project) return null;
    return updateProject(id, { platforms: project.platforms.filter(p => p.name !== platformName) });
  }, [projects, updateProject]);

  // ==================== 发布排期 ====================

  /** 设置发布排期 */
  const setSchedule = useCallback(
    (id: string, schedule: { publishDate: string; platforms: string[] }): VideoProject | null => {
      return updateProject(id, { schedule, status: 'scheduled' });
    },
    [updateProject]
  );

  /** 取消发布排期 */
  const cancelSchedule = useCallback((id: string): VideoProject | null => {
    return updateProject(id, { schedule: undefined, status: 'review' });
  }, [updateProject]);

  // ==================== 筛选和搜索 ====================

  /** 筛选项目 */
  const filterProjects = useCallback(
    (filters: {
      type?: VideoProjectType;
      status?: VideoProjectStatus;
      searchQuery?: string;
    }): VideoProject[] => {
      return projects.filter(p => {
        if (filters.type && p.type !== filters.type) return false;
        if (filters.status && p.status !== filters.status) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return p.title.toLowerCase().includes(q) || p.script.content.toLowerCase().includes(q);
        }
        return true;
      });
    },
    [projects]
  );

  // ==================== 统计聚合 ====================

  /** 获取视频工厂统计 */
  const getFactoryStats = useCallback(() => {
    const totalProjects = projects.length;
    const publishedProjects = projects.filter(p => p.status === 'published').length;
    const inProgressProjects = projects.filter(p => ['script_writing', 'voice_recording', 'video_editing', 'review'].includes(p.status)).length;
    const scheduledProjects = projects.filter(p => p.status === 'scheduled').length;

    const totalViews = projects.reduce((sum, p) => sum + p.platforms.reduce((s, plat) => s + plat.metrics.views, 0), 0);
    const totalLikes = projects.reduce((sum, p) => sum + p.platforms.reduce((s, plat) => s + plat.metrics.likes, 0), 0);
    const totalShares = projects.reduce((sum, p) => sum + p.platforms.reduce((s, plat) => s + plat.metrics.shares, 0), 0);
    const totalComments = projects.reduce((sum, p) => sum + p.platforms.reduce((s, plat) => s + plat.metrics.comments, 0), 0);

    const totalDuration = projects.reduce((sum, p) => sum + p.script.duration, 0);
    const totalScenes = projects.reduce((sum, p) => sum + p.script.scenes.length, 0);

    return {
      totalProjects,
      publishedProjects,
      inProgressProjects,
      scheduledProjects,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      totalDuration,
      totalScenes,
      avgEngagementRate: totalViews > 0 ? parseFloat((((totalLikes + totalShares + totalComments) / totalViews) * 100).toFixed(2)) : 0,
    };
  }, [projects]);

  /** 按状态分组统计 */
  const getStatusDistribution = useCallback((): Record<VideoProjectStatus, number> => {
    const distribution: Record<VideoProjectStatus, number> = {
      script_writing: 0,
      voice_recording: 0,
      video_editing: 0,
      review: 0,
      published: 0,
      scheduled: 0,
    };
    projects.forEach(p => { distribution[p.status]++; });
    return distribution;
  }, [projects]);

  /** 按类型分组统计 */
  const getTypeDistribution = useCallback((): Record<VideoProjectType, number> => {
    const distribution: Record<VideoProjectType, number> = {
      job_highlight: 0,
      success_story: 0,
      tips: 0,
      platform_intro: 0,
      testimonial: 0,
      trending: 0,
    };
    projects.forEach(p => { distribution[p.type]++; });
    return distribution;
  }, [projects]);

  /** 获取平台表现数据 */
  const getPlatformPerformance = useCallback((): Record<string, { views: number; likes: number; shares: number; comments: number }> => {
    const performance: Record<string, { views: number; likes: number; shares: number; comments: number }> = {};
    projects.forEach(p => {
      p.platforms.forEach(plat => {
        if (!performance[plat.name]) {
          performance[plat.name] = { views: 0, likes: 0, shares: 0, comments: 0 };
        }
        performance[plat.name].views += plat.metrics.views;
        performance[plat.name].likes += plat.metrics.likes;
        performance[plat.name].shares += plat.metrics.shares;
        performance[plat.name].comments += plat.metrics.comments;
      });
    });
    return performance;
  }, [projects]);

  // ==================== 工具方法 ====================

  /** 重置为Mock数据 */
  const resetToMockData = useCallback(() => {
    setProjects(mockProjects);
    setError(null);
  }, []);

  /** 清除所有数据 */
  const clearAll = useCallback(() => {
    setProjects([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // 状态
    projects,
    isLoading,
    error,

    // CRUD
    createProject,
    updateProject,
    deleteProject,
    getProject,

    // 状态流转
    updateProjectStatus,
    advanceToNextStage,
    revertToPreviousStage,

    // 脚本管理
    updateScript,
    updateScene,
    addScene,
    deleteScene,
    reorderScenes,

    // 视频管理
    updateVideoInfo,

    // 平台管理
    updatePlatformStatus,
    updatePlatformMetrics,
    addPlatform,
    removePlatform,

    // 排期
    setSchedule,
    cancelSchedule,

    // 筛选
    filterProjects,

    // 统计
    getFactoryStats,
    getStatusDistribution,
    getTypeDistribution,
    getPlatformPerformance,

    // 工具
    setIsLoading,
    setError,
    resetToMockData,
    clearAll,
  };
}
