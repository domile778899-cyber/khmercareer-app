// @ts-nocheck
export interface ResumeTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  sections: string[];
  color: string;
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 't1',
    name: '专业标准版',
    industry: '通用',
    description: '简洁大方，适用于各行业',
    sections: ['个人信息', '求职意向', '工作经历', '教育背景', '技能特长', '自我评价'],
    color: '#2D2926',
  },
  {
    id: 't2',
    name: '制衣行业版',
    industry: '制衣纺织',
    description: '突出生产经验和技能认证',
    sections: ['个人信息', '求职意向', '工作经历', '技能认证', '培训经历', '自我评价'],
    color: '#D4AF37',
  },
  {
    id: 't3',
    name: '酒店管理版',
    industry: '旅游酒店',
    description: '强调服务意识和语言能力',
    sections: ['个人信息', '求职意向', '工作经历', '语言能力', '专业技能', '自我评价'],
    color: '#8B6914',
  },
  {
    id: 't4',
    name: 'IT技术版',
    industry: 'ICT技术',
    description: '突出技术栈和项目经验',
    sections: ['个人信息', '求职意向', '技术技能', '项目经验', '工作经历', '教育背景'],
    color: '#4A5568',
  },
];
