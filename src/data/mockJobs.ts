// 113 jobs across 14 industries for KhmerCareer platform
export interface MockJob {
  id: string;
  title: string;
  titleZh: string;
  titleEn: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  industry: string;
  experience: string;
  level: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  postedAt: string;
  status: string;
  verified: boolean;
  urgent: boolean;
  featured: boolean;
  employerType: string;
  createdAt: string;
}

export const mockJobs: MockJob[] = [
  // ========== 1. Garment & Textile (服装纺织) - 12 jobs ==========
  {
    id: '101', title: 'អ្នកថតខារ៉ូទូករ', titleZh: '缝纫工', titleEn: 'Sewing Worker',
    company: 'CamKo Textile Co., Ltd.', location: 'Phnom Penh', salaryMin: 250, salaryMax: 350,
    type: 'Full-time', industry: 'Garment & Textile', experience: 'Entry Level', level: 'entry',
    description: '操作缝纫机进行服装缝制，流水线作业，无需经验，入职培训。',
    requirements: ['18-45岁', '身体健康', '能接受加班'], benefits: ['免费宿舍', '免费午餐', '交通补贴', '全勤奖'],
    applicants: 23, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '102', title: 'អ្នកគ្រប់គ្រងរោងចក្រកាត់ដេ', titleZh: '服装厂主管', titleEn: 'Garment Factory Supervisor',
    company: 'Evergreen Garment Co., Ltd.', location: 'Kampong Speu', salaryMin: 600, salaryMax: 900,
    type: 'Full-time', industry: 'Garment & Textile', experience: '3+ years', level: 'senior',
    description: '管理生产线员工，确保产量和质量达标，协调各部门工作。',
    requirements: ['3年以上服装厂经验', '具备管理能力', '熟悉生产流程'], benefits: ['绩效奖金', '住房补贴', '年终分红'],
    applicants: 6, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '103', title: 'ជាងដេរ', titleZh: '样衣工', titleEn: 'Sample Maker',
    company: 'New Wide Garment (Cambodia)', location: 'Phnom Penh', salaryMin: 350, salaryMax: 500,
    type: 'Full-time', industry: 'Garment & Textile', experience: '2-3 years', level: 'mid',
    description: '制作产前样衣，确认版型和工艺，指导大货生产。',
    requirements: ['能独立完成整件样衣', '看懂工艺单', '2年以上样衣经验'], benefits: ['技能培训', '晋升机会', '食宿全包'],
    applicants: 9, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '104', title: 'អ្នកត្រួតពិនិត្យគុណភាព', titleZh: '质检员QC', titleEn: 'Quality Control Inspector',
    company: 'Premium Garment Co.', location: 'Phnom Penh', salaryMin: 350, salaryMax: 500,
    type: 'Full-time', industry: 'Garment & Textile', experience: '1-2 years', level: 'junior',
    description: '负责服装成品和半成品的质量检验，记录不良问题。',
    requirements: ['了解AQL标准', '1年以上质检经验', '细心认真'], benefits: ['绩效奖金', '健康保险', '带薪年假'],
    applicants: 15, postedAt: '2026-05-17', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '105', title: 'បុគ្គលិកកាត់ត', titleZh: '裁剪工', titleEn: 'Cutting Worker',
    company: 'Wing Star Garment', location: 'Kandal', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Garment & Textile', experience: 'Entry Level', level: 'entry',
    description: '使用电剪进行布料裁剪，按唛架操作。',
    requirements: ['有裁剪经验优先', '能吃苦耐劳', '18-50岁'], benefits: ['包住', '工作餐', '加班补贴'],
    applicants: 31, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '106', title: 'អ្នកគ្រប់គ្រងតុប្លង់', titleZh: '排版师', titleEn: 'Pattern Master',
    company: 'Cambodia Garment Ltd.', location: 'Phnom Penh', salaryMin: 500, salaryMax: 750,
    type: 'Full-time', industry: 'Garment & Textile', experience: '3-5 years', level: 'senior',
    description: '负责服装排唛架，优化用料，降低损耗。',
    requirements: ['熟练使用排料软件', '3年以上排版经验', '会计算用料'], benefits: ['绩效奖金', '专业培训', '带薪假期'],
    applicants: 4, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-14'
  },
  {
    id: '107', title: 'អ្នកដឹកជញ្ជូនផលិតផលកាត់ដេ', titleZh: '服装跟单员', titleEn: 'Garment Merchandiser',
    company: 'Eastex Garment', location: 'Phnom Penh', salaryMin: 450, salaryMax: 700,
    type: 'Full-time', industry: 'Garment & Textile', experience: '2-3 years', level: 'mid',
    description: '跟进客户订单，协调生产和出货，处理客户问题。',
    requirements: ['英语基础沟通', '熟悉服装生产流程', '2年以上跟单经验'], benefits: ['年终奖金', '商务旅行', '职业发展'],
    applicants: 11, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Chinese Enterprise', createdAt: '2026-05-16'
  },
  {
    id: '108', title: 'អ្នកបញ្ចូលទិន្នន័យកាត់ដេ', titleZh: '服装IE工程师', titleEn: 'IE Engineer (Garment)',
    company: 'Formosa Textile', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1100,
    type: 'Full-time', industry: 'Garment & Textile', experience: '3+ years', level: 'senior',
    description: '进行工时测量，制定标准工时，优化生产流程，提高效率。',
    requirements: ['熟悉GST/GSD系统', '3年以上服装IE经验', '数据分析能力'], benefits: ['高薪', '管理培训', '股份期权'],
    applicants: 3, postedAt: '2026-05-12', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-12'
  },
  {
    id: '109', title: 'អ្នកបោះពុម្ពផ្ទាំង', titleZh: '印花工', titleEn: 'Screen Printer',
    company: 'Printex Cambodia', location: 'Phnom Penh', salaryMin: 300, salaryMax: 450,
    type: 'Full-time', industry: 'Garment & Textile', experience: '1+ years', level: 'junior',
    description: '操作印花设备进行布料印花，调色对版。',
    requirements: ['有印花经验', '色感好', '能调颜色'], benefits: ['技能培训', '绩效奖金', '包吃住'],
    applicants: 18, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-13'
  },
  {
    id: '110', title: 'អ្នករចនាខោអាវ', titleZh: '服装设计师', titleEn: 'Fashion Designer',
    company: 'Chamkamorn Fashion', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Garment & Textile', experience: '2-4 years', level: 'mid',
    description: '设计新款服装，绘制设计图，跟进打样过程。',
    requirements: ['服装设计专业', '熟练使用AI/PS', '2年以上设计经验'], benefits: ['创意空间', '作品展示机会', '弹性工作'],
    applicants: 7, postedAt: '2026-05-11', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-11'
  },
  {
    id: '111', title: 'អ្នកគ្រប់គ្រងស្តុក', titleZh: '仓库管理员', titleEn: 'Warehouse Keeper (Garment)',
    company: 'Mega Garment Co.', location: 'Kandal', salaryMin: 320, salaryMax: 480,
    type: 'Full-time', industry: 'Garment & Textile', experience: '1-2 years', level: 'junior',
    description: '管理面辅料仓库，收发物料，盘点库存。',
    requirements: ['有仓库管理经验', '会使用电脑', '责任心强'], benefits: ['全勤奖', '包住', '工作餐'],
    applicants: 22, postedAt: '2026-05-10', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-10'
  },
  {
    id: '112', title: 'ប្រធានផ្នែកកាត់', titleZh: '裁床主管', titleEn: 'Cutting Room Manager',
    company: 'Victory Garment', location: 'Phnom Penh', salaryMin: 550, salaryMax: 800,
    type: 'Full-time', industry: 'Garment & Textile', experience: '3-5 years', level: 'senior',
    description: '管理裁床部门，安排裁剪计划，控制用料损耗。',
    requirements: ['5年以上裁床经验', '有管理经验', '熟悉裁床设备'], benefits: ['高薪', '年终分红', '住房补贴'],
    applicants: 5, postedAt: '2026-05-09', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-09'
  },

  // ========== 2. Tourism & Hospitality (旅游酒店) - 10 jobs ==========
  {
    id: '201', title: 'បុគ្គលិកទទួលភ្ញៀវ', titleZh: '酒店前台', titleEn: 'Hotel Receptionist',
    company: 'Raffles Hotel Le Royal', location: 'Phnom Penh', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: 'Entry Level', level: 'entry',
    description: '接待入住客人，办理登记退房，处理预订，解答咨询。',
    requirements: ['形象好', '基础英语', '会使用电脑'], benefits: ['制服', '员工餐', '免费住宿', '培训机会'],
    applicants: 19, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-20'
  },
  {
    id: '202', title: 'អ្នកបម្រើតុ', titleZh: '餐厅服务员', titleEn: 'Restaurant Server',
    company: 'Angkor Paradise Hotel', location: 'Siem Reap', salaryMin: 300, salaryMax: 450,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: 'Entry Level', level: 'entry',
    description: '为客人提供优质的餐厅服务，点单上菜，保持桌面整洁。',
    requirements: ['微笑服务', '基础英语', '18-35岁'], benefits: ['小费', '免费住宿', '员工餐'],
    applicants: 12, postedAt: '2026-05-19', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '203', title: 'អ្នកដឹកនាំភ្ញៀវទេសចរណ៍', titleZh: '导游', titleEn: 'Tour Guide',
    company: 'Angkor Wonder Tours', location: 'Siem Reap', salaryMin: 300, salaryMax: 500,
    type: 'Contract', industry: 'Tourism & Hospitality', experience: '1+ years', level: 'junior',
    description: '带领游客参观吴哥窟等景点，讲解历史文化，提供热情服务。',
    requirements: ['流利中文或英文', '了解吴哥历史', '开朗外向'], benefits: ['小费丰厚', '弹性时间', '免费门票'],
    applicants: 25, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '204', title: 'អ្នកគ្រប់គ្រងមុខងារសណ្ឋាគារ', titleZh: '酒店前厅经理', titleEn: 'Front Office Manager',
    company: 'Sokha Beach Resort', location: 'Sihanoukville', salaryMin: 800, salaryMax: 1200,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '5+ years', level: 'manager',
    description: '管理前厅部门日常运营，培训员工，处理客户投诉，确保服务质量。',
    requirements: ['5年以上酒店前厅经验', '管理团队能力', '流利英文'], benefits: ['高薪', '海景宿舍', '年终奖'],
    applicants: 4, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '205', title: 'ចុងភៅចិន', titleZh: '中餐厨师', titleEn: 'Chinese Chef',
    company: 'Dragon Palace Restaurant', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '3+ years', level: 'senior',
    description: '烹饪中餐菜品，研发新菜，管理厨房出品质量。',
    requirements: ['3年以上中餐烹饪经验', '熟悉粤菜或川菜', '能带徒弟'], benefits: ['包吃住', '绩效奖金', '菜品提成'],
    applicants: 8, postedAt: '2026-05-17', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Chinese Enterprise', createdAt: '2026-05-17'
  },
  {
    id: '206', title: 'អ្នកបម្រើក្នុងបន្ទប់', titleZh: '客房服务员', titleEn: 'Room Attendant',
    company: 'Hyatt Regency Phnom Penh', location: 'Phnom Penh', salaryMin: 250, salaryMax: 380,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: 'Entry Level', level: 'entry',
    description: '打扫客房卫生，更换床品，补充客房用品，确保房间整洁。',
    requirements: ['勤劳细心', '能接受体力劳动', '18-45岁'], benefits: ['免费制服', '员工餐', '医疗保险'],
    applicants: 35, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-16'
  },
  {
    id: '207', title: 'អ្នករៀបចំកម្មវិធីពិធីមង្គល', titleZh: '宴会策划师', titleEn: 'Event Coordinator',
    company: 'NagaWorld Hotel', location: 'Phnom Penh', salaryMin: 450, salaryMax: 700,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '2-3 years', level: 'mid',
    description: '策划和执行婚礼、会议等宴会活动，协调各部门资源。',
    requirements: ['创意策划能力', '2年以上活动策划经验', '良好的沟通能力'], benefits: ['高端工作环境', '绩效奖金', '带薪年假'],
    applicants: 6, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-14'
  },
  {
    id: '208', title: 'អ្នកបើករថយន្តដឹកភ្ញៀវ', titleZh: '酒店司机', titleEn: 'Hotel Driver',
    company: 'Sofitel Phnom Penh', location: 'Phnom Penh', salaryMin: 350, salaryMax: 500,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '3+ years', level: 'mid',
    description: '负责接送酒店客人，车辆保养维护，确保安全驾驶。',
    requirements: ['驾照B/C', '3年以上驾龄', '熟悉金边路线', '会基础英语'], benefits: ['小费', '免费住宿', '工作餐'],
    applicants: 14, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-13'
  },
  {
    id: '209', title: 'បុគ្គលិកសន្តិសុខសណ្ឋាគារ', titleZh: '酒店保安', titleEn: 'Hotel Security Guard',
    company: 'Pacific Hotel', location: 'Sihanoukville', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '1+ years', level: 'junior',
    description: '维护酒店安全秩序，巡逻检查，处理突发事件。',
    requirements: ['身体健康', '有责任心', '能接受轮班'], benefits: ['包住', '工作餐', '加班费'],
    applicants: 20, postedAt: '2026-05-11', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-11'
  },
  {
    id: '210', title: 'អ្នកគ្រប់គ្រងផ្នែកលក់សណ្ឋាគារ', titleZh: '酒店销售经理', titleEn: 'Hotel Sales Manager',
    company: 'City Center Hotel', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Tourism & Hospitality', experience: '3-5 years', level: 'senior',
    description: '开发企业客户，推广酒店会议和住宿服务，完成销售目标。',
    requirements: ['销售经验', '人脉资源', '流利英文'], benefits: ['销售提成', '年终奖金', '出国培训'],
    applicants: 5, postedAt: '2026-05-10', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-10'
  },

  // ========== 3. ICT & Technology (ICT与科技) - 10 jobs ==========
  {
    id: '301', title: 'វិស្វករកម្មវិធី', titleZh: '软件开发工程师', titleEn: 'Software Developer',
    company: 'SinoLink Technology', location: 'Phnom Penh', salaryMin: 800, salaryMax: 1500,
    type: 'Full-time', industry: 'ICT & Technology', experience: '2-4 years', level: 'mid',
    description: '开发Web和移动应用程序，编写高质量代码，参与技术方案设计。',
    requirements: ['React/Vue经验', '2年以上开发经验', '大学学历'], benefits: ['弹性工作', '健康保险', '技能培训', '年度调薪'],
    applicants: 8, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-20'
  },
  {
    id: '302', title: 'អ្នករចនាUI/UX', titleZh: 'UI/UX设计师', titleEn: 'UI/UX Designer',
    company: 'GrowHub Tech', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1200,
    type: 'Full-time', industry: 'ICT & Technology', experience: '2-3 years', level: 'mid',
    description: '设计用户界面和交互体验，制作原型图，跟进开发实现。',
    requirements: ['熟练使用Figma/Sketch', '2年以上设计经验', '有作品集'], benefits: ['创意氛围', '最新设备', '远程办公选项'],
    applicants: 9, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '303', title: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', titleZh: '系统管理员', titleEn: 'System Administrator',
    company: 'ACLEDA Bank', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'ICT & Technology', experience: '2-4 years', level: 'mid',
    description: '维护服务器和网络设备，监控系统运行状态，处理技术故障。',
    requirements: ['熟悉Linux/Windows Server', '网络基础知识', '相关认证优先'], benefits: ['银行福利', '稳定工作', '培训机会'],
    applicants: 7, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '304', title: 'វិស្វករទិន្នន័យ', titleZh: '数据分析师', titleEn: 'Data Analyst',
    company: 'Smart Axiata', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1200,
    type: 'Full-time', industry: 'ICT & Technology', experience: '2-3 years', level: 'mid',
    description: '分析业务数据，制作报表，为决策提供数据支持。',
    requirements: ['熟练使用Excel/SQL', '数据分析经验', '商业敏感度'], benefits: ['通信补贴', '弹性工作', '年度奖金'],
    applicants: 6, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-17'
  },
  {
    id: '305', title: 'អ្នកគ្រប់គ្រងផ្នែកIT', titleZh: 'IT主管', titleEn: 'IT Manager',
    company: 'Chip Mong Group', location: 'Phnom Penh', salaryMin: 1200, salaryMax: 2000,
    type: 'Full-time', industry: 'ICT & Technology', experience: '5+ years', level: 'manager',
    description: '管理公司IT部门，制定技术战略，监督项目执行。',
    requirements: ['5年以上IT管理经验', '项目管理能力', '技术背景'], benefits: ['高薪', '股份期权', '管理培训'],
    applicants: 3, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '306', title: 'អ្នកគាំទ្របច្ចេកទេស', titleZh: '技术支持工程师', titleEn: 'Technical Support Engineer',
    company: 'Microsoft Cambodia', location: 'Phnom Penh', salaryMin: 500, salaryMax: 850,
    type: 'Full-time', industry: 'ICT & Technology', experience: '1-3 years', level: 'junior',
    description: '为客户提供技术支持服务，解决软硬件问题，编写技术文档。',
    requirements: ['熟悉Windows/Office', '良好的沟通能力', '问题解决能力'], benefits: ['国际品牌', '职业认证', '出国培训'],
    applicants: 16, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-16'
  },
  {
    id: '307', title: 'អ្នកអភិវឌ្ឍកម្មវិធីទូរស័ព្ទ', titleZh: '移动应用开发', titleEn: 'Mobile App Developer',
    company: 'Wing Cambodia', location: 'Phnom Penh', salaryMin: 900, salaryMax: 1600,
    type: 'Full-time', industry: 'ICT & Technology', experience: '3+ years', level: 'senior',
    description: '开发iOS和Android移动应用，优化性能，修复Bug。',
    requirements: ['React Native/Flutter经验', '3年以上移动端开发', '上架经验'], benefits: ['金融科技环境', '快速晋升', '股权激励'],
    applicants: 5, postedAt: '2026-05-14', status: 'active', verified: true, urgent: true, featured: true, employerType: 'Local Company', createdAt: '2026-05-14'
  },
  {
    id: '308', title: 'អ្នកធ្វើតេស្តកម្មវិធី', titleZh: '软件测试工程师', titleEn: 'QA Engineer',
    company: 'EZECOM', location: 'Phnom Penh', salaryMin: 550, salaryMax: 900,
    type: 'Full-time', industry: 'ICT & Technology', experience: '2-3 years', level: 'mid',
    description: '编写测试用例，执行功能测试，跟踪Bug修复进度。',
    requirements: ['熟悉测试流程', '2年以上测试经验', '细心严谨'], benefits: ['技术培训', '弹性工作', '团队氛围好'],
    applicants: 10, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-13'
  },
  {
    id: '309', title: 'អ្នកគ្រប់គ្រងគេហទំព័រ', titleZh: '网站运营专员', titleEn: 'Web Operations Specialist',
    company: 'Online Store Cambodia', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'ICT & Technology', experience: '1-2 years', level: 'junior',
    description: '管理电商平台日常运营，更新商品信息，处理客户订单。',
    requirements: ['熟悉电商平台', '有运营经验', '会基础PS'], benefits: ['电商折扣', '绩效奖金', '快速晋升'],
    applicants: 21, postedAt: '2026-05-12', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-12'
  },
  {
    id: '310', title: 'អ្នកជំនាញAI', titleZh: 'AI工程师', titleEn: 'AI Engineer',
    company: 'AI Innovation Lab', location: 'Phnom Penh', salaryMin: 1500, salaryMax: 2500,
    type: 'Full-time', industry: 'ICT & Technology', experience: '3-5 years', level: 'senior',
    description: '开发机器学习模型，处理自然语言处理项目，优化算法。',
    requirements: ['Python深度学习经验', '熟悉TensorFlow/PyTorch', '硕士学历优先'], benefits: ['顶级薪资', '研究氛围', '国际会议'],
    applicants: 2, postedAt: '2026-05-11', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-11'
  },

  // ========== 4. Construction (建筑工程) - 10 jobs ==========
  {
    id: '401', title: 'ជាងសាងសង់', titleZh: '建筑工人', titleEn: 'Construction Worker',
    company: 'Mekong Build Co.', location: 'Sihanoukville', salaryMin: 300, salaryMax: 500,
    type: 'Full-time', industry: 'Construction', experience: 'Entry Level', level: 'entry',
    description: '建筑工地各类工作，包括砌砖、浇筑、钢筋绑扎等。',
    requirements: ['体力好', '能吃苦', '有经验优先'], benefits: ['包住', '工伤保险', '工资月结'],
    applicants: 45, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '402', title: 'វិស្វករសំណង់', titleZh: '建筑工程师', titleEn: 'Civil Engineer',
    company: 'OCIC Group', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1200,
    type: 'Full-time', industry: 'Construction', experience: '3-5 years', level: 'senior',
    description: '负责建筑项目的技术管理，审核图纸，监督施工质量。',
    requirements: ['土木工程学位', '3年以上施工经验', '能看懂图纸'], benefits: ['项目奖金', '职业发展', '住房补贴'],
    applicants: 5, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '403', title: 'អ្នកគ្រប់គ្រងគ្រួសារសំណង់', titleZh: '施工主管', titleEn: 'Site Supervisor',
    company: 'China Road & Bridge Corp', location: 'Phnom Penh', salaryMin: 800, salaryMax: 1300,
    type: 'Full-time', industry: 'Construction', experience: '5+ years', level: 'senior',
    description: '管理施工现场，协调分包商，确保工程进度和安全。',
    requirements: ['5年以上施工管理经验', '熟悉施工规范', '会中文优先'], benefits: ['高薪', '包住', '带薪休假'],
    applicants: 3, postedAt: '2026-05-18', status: 'active', verified: true, urgent: true, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-18'
  },
  {
    id: '404', title: 'អ្នកបញ្ចូលទិន្នន័យគំនូសតាង', titleZh: 'CAD绘图员', titleEn: 'CAD Drafter',
    company: 'Architectural Design Co.', location: 'Phnom Penh', salaryMin: 400, salaryMax: 700,
    type: 'Full-time', industry: 'Construction', experience: '1-3 years', level: 'junior',
    description: '使用AutoCAD绘制建筑施工图，修改图纸，制作竣工图。',
    requirements: ['熟练使用AutoCAD', '了解建筑规范', '1年以上绘图经验'], benefits: ['技能培训', '弹性工作', '项目奖金'],
    applicants: 12, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '405', title: 'អ្នកបោះជំរុំវាស់វែង', titleZh: '测量员', titleEn: 'Surveyor',
    company: 'Land Survey Cambodia', location: 'Phnom Penh', salaryMin: 450, salaryMax: 750,
    type: 'Full-time', industry: 'Construction', experience: '2-3 years', level: 'mid',
    description: '进行土地和建筑测量，记录数据，制作测量报告。',
    requirements: ['熟悉测量仪器', '2年以上测量经验', '会使用测量软件'], benefits: ['户外补贴', '技能培训', '包住'],
    applicants: 8, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '406', title: 'វិស្វករអគ្គិសនី', titleZh: '电气工程师', titleEn: 'Electrical Engineer',
    company: 'SchneiTec Cambodia', location: 'Sihanoukville', salaryMin: 800, salaryMax: 1400,
    type: 'Full-time', industry: 'Construction', experience: '3-5 years', level: 'senior',
    description: '设计建筑电气系统，监督安装，调试运行。',
    requirements: ['电气工程学位', '3年以上建筑电气经验', '熟悉PLC'], benefits: ['高薪', '包住', '国际项目'],
    applicants: 4, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '407', title: 'អ្នកបញ្ជាគ្រឿងចក្រធ្ងន់', titleZh: '机械操作员', titleEn: 'Heavy Equipment Operator',
    company: 'BuildTech Cambodia', location: 'Sihanoukville', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Construction', experience: '2+ years', level: 'mid',
    description: '操作挖掘机、推土机等重型机械设备。',
    requirements: ['有操作证', '2年以上操作经验', '安全意识强'], benefits: ['高薪日结', '包住', '工伤保险'],
    applicants: 19, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },
  {
    id: '408', title: 'អ្នកគ្រប់គ្រងសុវត្ថិភាព', titleZh: '安全员', titleEn: 'Safety Officer',
    company: 'World Bridge Construction', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Construction', experience: '2-4 years', level: 'mid',
    description: '监督施工现场安全，进行安全培训，处理安全事故。',
    requirements: ['安全员证书', '2年以上安全工作经验', '熟悉安全规范'], benefits: ['稳定工作', '培训机会', '包住'],
    applicants: 7, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-13'
  },
  {
    id: '409', title: 'អ្នកដាក់ក្បឿងថ្ម', titleZh: '水电工', titleEn: 'Plumber & Electrician',
    company: 'HomeFix Services', location: 'Phnom Penh', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Construction', experience: '2-3 years', level: 'mid',
    description: '安装和维修建筑内的给排水和电气系统。',
    requirements: ['懂水电安装', '2年以上经验', '能独立作业'], benefits: ['日薪结算', '工作量充足', '技能培训'],
    applicants: 15, postedAt: '2026-05-12', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-12'
  },
  {
    id: '410', title: 'អ្នកប៉ាន់ប្រមាណតម្លៃ', titleZh: '造价工程师', titleEn: 'Quantity Surveyor',
    company: 'CostPlan Cambodia', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Construction', experience: '3+ years', level: 'senior',
    description: '编制工程预算，审核结算，控制项目成本。',
    requirements: ['造价专业背景', '3年以上造价经验', '熟悉当地定额'], benefits: ['项目提成', '高薪', '职业发展'],
    applicants: 3, postedAt: '2026-05-11', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-11'
  },

  // ========== 5. Manufacturing (制造业) - 8 jobs ==========
  {
    id: '501', title: 'បុគ្គលិកប្រតិបត្តិកម្មវិធី', titleZh: '生产操作工', titleEn: 'Production Operator',
    company: 'Crown Can Cambodia', location: 'Phnom Penh', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Manufacturing', experience: 'Entry Level', level: 'entry',
    description: '操作生产线设备，完成产品组装和包装。',
    requirements: ['能接受两班倒', '身体健康', '18-40岁'], benefits: ['免费午餐', '交通补贴', '绩效奖金'],
    applicants: 38, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Multinational', createdAt: '2026-05-20'
  },
  {
    id: '502', title: 'អ្នកគ្រប់គ្រងរោងចក្រ', titleZh: '工厂经理', titleEn: 'Factory Manager',
    company: 'Dragon Steel Cambodia', location: 'Phnom Penh', salaryMin: 1200, salaryMax: 2000,
    type: 'Full-time', industry: 'Manufacturing', experience: '5+ years', level: 'manager',
    description: '全面管理工厂运营，包括生产、质量、人事、安全等方面。',
    requirements: ['5年以上制造业管理经验', '中资企业背景优先', '流利中文'], benefits: ['高薪', '年终分红', '住房补贴', '配车'],
    applicants: 2, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-19'
  },
  {
    id: '503', title: 'វិស្វករមេកានិច', titleZh: '机械工程师', titleEn: 'Mechanical Engineer',
    company: 'Coca-Cola Cambodia', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1100,
    type: 'Full-time', industry: 'Manufacturing', experience: '3-5 years', level: 'senior',
    description: '维护生产设备，制定保养计划，解决机械故障。',
    requirements: ['机械工程学位', '3年以上设备维护经验', '熟悉自动化设备'], benefits: ['国际品牌', '完善福利', '培训体系'],
    applicants: 5, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-18'
  },
  {
    id: '504', title: 'អ្នកត្រួតពិនិត្យគុណភាព', titleZh: '品检员', titleEn: 'QA Inspector',
    company: 'Toyota Tsusho', location: 'Phnom Penh', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Manufacturing', experience: '1-2 years', level: 'junior',
    description: '检查产品质量，记录不良数据，提出改善建议。',
    requirements: ['有品检经验', '会使用量具', '了解质量管理体系'], benefits: ['日企管理', '稳定工作', '带薪培训'],
    applicants: 14, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-17'
  },
  {
    id: '505', title: 'អ្នកគ្រប់គ្រងបញ្ជាទិញ', titleZh: '采购专员', titleEn: 'Purchasing Officer',
    company: 'HEINEKEN Cambodia', location: 'Phnom Penh', salaryMin: 450, salaryMax: 750,
    type: 'Full-time', industry: 'Manufacturing', experience: '2-3 years', level: 'mid',
    description: '负责原材料采购，供应商管理，价格谈判。',
    requirements: ['采购经验', '谈判能力', '供应链管理知识'], benefits: ['外企福利', '年终奖金', '带薪年假'],
    applicants: 8, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-16'
  },
  {
    id: '506', title: 'អ្នកបញ្ចូលទិន្នន័យ', titleZh: '仓管员', titleEn: 'Warehouse Staff',
    company: 'Unilever Cambodia', location: 'Phnom Penh', salaryMin: 300, salaryMax: 450,
    type: 'Full-time', industry: 'Manufacturing', experience: '1+ years', level: 'junior',
    description: '管理原料和成品仓库，收发货物，盘点库存。',
    requirements: ['会使用ERP系统', '有仓管经验', '责任心强'], benefits: ['外企环境', '完善保险', '培训机会'],
    applicants: 20, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '507', title: 'អ្នកថែទាំគ្រឿងចក្រ', titleZh: '设备维修技师', titleEn: 'Maintenance Technician',
    company: 'Specialized Electronics', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Manufacturing', experience: '2-3 years', level: 'mid',
    description: '维修和保养生产设备，确保设备正常运行。',
    requirements: ['机电一体化背景', '2年以上维修经验', '有电工证'], benefits: ['技能提升', '绩效奖金', '包住'],
    applicants: 11, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },
  {
    id: '508', title: 'អ្នកគ្រប់គ្រងផលិតកម្ម', titleZh: '生产计划员', titleEn: 'Production Planner',
    company: 'Pricon Cambodia', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Manufacturing', experience: '2-4 years', level: 'mid',
    description: '制定生产计划，协调物料供应，跟踪生产进度。',
    requirements: ['熟悉ERP系统', '有生产计划经验', '数据分析能力'], benefits: ['高薪', '年终奖金', '职业发展'],
    applicants: 6, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-13'
  },

  // ========== 6. Finance & Banking (金融银行) - 8 jobs ==========
  {
    id: '601', title: 'អ្នកគិតលុយ', titleZh: '会计', titleEn: 'Accountant',
    company: 'Chip Mong Bank', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Finance & Banking', experience: '2-3 years', level: 'mid',
    description: '处理日常账务，编制财务报表，协助审计工作。',
    requirements: ['会计或金融学位', '2年以上银行经验', '熟悉会计软件'], benefits: ['银行福利', '稳定工作', '培训体系'],
    applicants: 13, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '602', title: 'បុគ្គលិកឥណទាន', titleZh: '信贷专员', titleEn: 'Loan Officer',
    company: 'ABA Bank', location: 'Phnom Penh', salaryMin: 450, salaryMax: 750,
    type: 'Full-time', industry: 'Finance & Banking', experience: '1-3 years', level: 'mid',
    description: '开发贷款客户，审核贷款申请，管理贷款组合。',
    requirements: ['销售能力', '金融知识', '客户关系管理'], benefits: ['绩效提成', '五险一金', '带薪年假'],
    applicants: 17, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '603', title: 'អ្នកប្រឹក្សាវិភាគទុនហិរញ្ញវត្ថុ', titleZh: '财务分析师', titleEn: 'Financial Analyst',
    company: 'Maybank Cambodia', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1200,
    type: 'Full-time', industry: 'Finance & Banking', experience: '3-5 years', level: 'senior',
    description: '分析财务数据，制作财务模型，为投资决策提供支持。',
    requirements: ['财务/金融学位', '3年以上分析经验', '精通Excel'], benefits: ['高薪', '年终奖金', '国际银行经验'],
    applicants: 4, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-18'
  },
  {
    id: '604', title: 'បុគ្គលិកតុ', titleZh: '银行柜员', titleEn: 'Bank Teller',
    company: 'Canadia Bank', location: 'Phnom Penh', salaryMin: 350, salaryMax: 500,
    type: 'Full-time', industry: 'Finance & Banking', experience: 'Entry Level', level: 'entry',
    description: '处理柜台业务，存取款、转账、外汇兑换等。',
    requirements: ['形象好', '细心认真', '基础英文'], benefits: ['制服', '工作餐', '培训机会'],
    applicants: 28, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '605', title: 'អ្នកគ្រប់គ្រងហានិភ័យ', titleZh: '风控经理', titleEn: 'Risk Manager',
    company: 'Sathapana Bank', location: 'Phnom Penh', salaryMin: 900, salaryMax: 1500,
    type: 'Full-time', industry: 'Finance & Banking', experience: '5+ years', level: 'manager',
    description: '制定风控政策，评估信贷风险，监督合规执行。',
    requirements: ['5年以上风控经验', '熟悉银行监管', '数据分析能力'], benefits: ['高薪', '年终分红', '股份期权'],
    applicants: 2, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '606', title: 'អ្នកលក់បរិក្ខាហិរញ្ញវត្ថុ', titleZh: '保险销售', titleEn: 'Insurance Sales',
    company: 'Forte Insurance', location: 'Phnom Penh', salaryMin: 300, salaryMax: 800,
    type: 'Full-time', industry: 'Finance & Banking', experience: 'Entry Level', level: 'entry',
    description: '开发保险客户，推荐保险产品，维护客户关系。',
    requirements: ['销售热情', '沟通能力', '自学能力强'], benefits: ['高佣金', '弹性时间', '旅游奖励'],
    applicants: 22, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '607', title: 'អ្នករៀបចំប្រតិបត្តិការបរទេស', titleZh: '外汇交易员', titleEn: 'FX Dealer',
    company: 'ANZ Royal Bank', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Finance & Banking', experience: '3+ years', level: 'senior',
    description: '执行外汇交易，监控汇率波动，管理外汇风险。',
    requirements: ['3年以上外汇交易经验', '熟悉外汇市场', '抗压能力强'], benefits: ['高薪', '交易奖金', '国际化平台'],
    applicants: 3, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-14'
  },
  {
    id: '608', title: 'អ្នកបញ្ចូលទិន្នន័យហិរញ្ញវត្ថុ', titleZh: '财务数据录入员', titleEn: 'Finance Data Entry Clerk',
    company: 'BRED Bank', location: 'Phnom Penh', salaryMin: 320, salaryMax: 450,
    type: 'Full-time', industry: 'Finance & Banking', experience: 'Entry Level', level: 'entry',
    description: '录入财务数据，核对凭证，整理档案。',
    requirements: ['打字速度快', '细心认真', '基础财务知识'], benefits: ['银行环境', '带薪培训', '晋升通道'],
    applicants: 30, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-13'
  },

  // ========== 7. Education (教育培训) - 8 jobs ==========
  {
    id: '701', title: 'គ្រូបង្រៀនភាសាអង់គ្លេស', titleZh: '英语老师', titleEn: 'English Teacher',
    company: 'Western International School', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Education', experience: '1-3 years', level: 'mid',
    description: '教授中小学英语课程，设计教案，评估学生成绩。',
    requirements: ['学士学位', 'TESOL/TEFL证书优先', '英语流利'], benefits: ['寒暑假', '住房补贴', '子女入学优惠'],
    applicants: 15, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '702', title: 'គ្រូបង្រៀនភាសាចិន', titleZh: '中文教师', titleEn: 'Chinese Teacher',
    company: 'Zhonghua School', location: 'Phnom Penh', salaryMin: 550, salaryMax: 850,
    type: 'Full-time', industry: 'Education', experience: '2-3 years', level: 'mid',
    description: '教授中文课程，组织文化活动，辅导学生。',
    requirements: ['中文流利', '有教学经验', '热爱教育事业'], benefits: ['带薪假期', '文化培训', '晋升机会'],
    applicants: 10, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-19'
  },
  {
    id: '703', title: 'គ្រូបង្រៀនគណិតវិទ្យា', titleZh: '数学老师', titleEn: 'Math Teacher',
    company: 'Beltei International School', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Education', experience: '1-2 years', level: 'mid',
    description: '教授数学课程，辅导学生作业，参与教研活动。',
    requirements: ['数学或教育专业', '有教学经验', '耐心负责'], benefits: ['培训机会', '绩效奖金', '带薪假期'],
    applicants: 8, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '704', title: 'អ្នកគ្រប់គ្រងសាលា', titleZh: '校长', titleEn: 'School Principal',
    company: 'AIS International School', location: 'Phnom Penh', salaryMin: 1500, salaryMax: 2500,
    type: 'Full-time', industry: 'Education', experience: '5+ years', level: 'manager',
    description: '全面管理学校运营，制定教育方针，招聘和管理教师团队。',
    requirements: ['教育管理硕士', '5年以上管理经验', '国际学校背景'], benefits: ['高薪', '住房补贴', '国际学校资源'],
    applicants: 1, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-17'
  },
  {
    id: '705', title: 'អ្នកបង្រៀនកុំព្យូទ័រ', titleZh: '计算机教师', titleEn: 'IT Instructor',
    company: 'IT Academy Cambodia', location: 'Phnom Penh', salaryMin: 450, salaryMax: 700,
    type: 'Full-time', industry: 'Education', experience: '2-3 years', level: 'mid',
    description: '教授编程和IT技能课程，包括Python、Web开发等。',
    requirements: ['编程能力', '教学经验', '有亲和力'], benefits: ['技术培训', '弹性排课', '课程提成'],
    applicants: 6, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '706', title: 'អ្នកជំនួញការអប់រំ', titleZh: '教育顾问', titleEn: 'Education Consultant',
    company: 'IDP Education', location: 'Phnom Penh', salaryMin: 500, salaryMax: 850,
    type: 'Full-time', industry: 'Education', experience: '2-3 years', level: 'mid',
    description: '为学生提供留学咨询，协助申请学校，办理签证。',
    requirements: ['了解留学流程', '沟通能力强', '英语流利'], benefits: ['国际公司', '出国考察', '绩效奖金'],
    applicants: 9, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '707', title: 'អ្នកថែទាំកុមារ', titleZh: '幼儿园老师', titleEn: 'Kindergarten Teacher',
    company: 'Little Stars Preschool', location: 'Phnom Penh', salaryMin: 300, salaryMax: 450,
    type: 'Full-time', industry: 'Education', experience: 'Entry Level', level: 'entry',
    description: '照顾和教育幼儿，组织游戏活动，与家长沟通。',
    requirements: ['热爱孩子', '有耐心', '幼教经验优先'], benefits: ['温馨环境', '带薪假期', '培训机会'],
    applicants: 18, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },
  {
    id: '708', title: 'អ្នករៀបចំកម្មវិធីអប់រំ', titleZh: '教务主管', titleEn: 'Academic Coordinator',
    company: 'E2Language School', location: 'Phnom Penh', salaryMin: 550, salaryMax: 850,
    type: 'Full-time', industry: 'Education', experience: '3+ years', level: 'senior',
    description: '安排课程表，管理教学资源，监督教学质量。',
    requirements: ['教育管理经验', '组织能力', '沟通协调'], benefits: ['管理培训', '带薪年假', '晋升空间'],
    applicants: 4, postedAt: '2026-05-13', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-13'
  },

  // ========== 8. Agriculture (农业) - 7 jobs ==========
  {
    id: '801', title: 'អ្នកបម្រើកសិកម្ម', titleZh: '农场工人', titleEn: 'Farm Worker',
    company: 'Cámara Rice Group', location: 'Battambang', salaryMin: 250, salaryMax: 350,
    type: 'Full-time', industry: 'Agriculture', experience: 'Entry Level', level: 'entry',
    description: '从事水稻种植、施肥、收割等农田工作。',
    requirements: ['能吃苦耐劳', '有农活经验优先', '身体健康'], benefits: ['包住', '提供农具', '收成奖金'],
    applicants: 33, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '802', title: 'អ្នកផ្សារកសិកម្ម', titleZh: '农业技术员', titleEn: 'Agricultural Technician',
    company: 'Amru Rice', location: 'Battambang', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Agriculture', experience: '2-3 years', level: 'mid',
    description: '指导农民科学种植，推广农业技术，检测土壤和作物。',
    requirements: ['农学背景', '2年以上农技推广经验', '会开车'], benefits: ['下乡补贴', '技能培训', '绩效奖金'],
    applicants: 7, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '803', title: 'អ្នកគ្រប់គ្រងចម្ការ', titleZh: '种植园主管', titleEn: 'Plantation Manager',
    company: 'Kirirom Agriculture', location: 'Kampong Speu', salaryMin: 700, salaryMax: 1100,
    type: 'Full-time', industry: 'Agriculture', experience: '5+ years', level: 'manager',
    description: '管理种植园日常运营，制定种植计划，监督收获和加工。',
    requirements: ['农学学位', '5年以上种植园管理经验', '管理团队能力'], benefits: ['高薪', '住房', '年终分红'],
    applicants: 2, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '804', title: 'អ្នកលក់ផលិតផលកសិកម្ម', titleZh: '农产品销售', titleEn: 'Agri Product Sales',
    company: 'GreenTrade Cambodia', location: 'Phnom Penh', salaryMin: 350, salaryMax: 600,
    type: 'Full-time', industry: 'Agriculture', experience: '1-3 years', level: 'mid',
    description: '销售农产品到大米加工厂和出口商，维护客户关系。',
    requirements: ['销售能力', '了解农产品', '会开车'], benefits: ['销售提成', '弹性工作', '年终奖金'],
    applicants: 12, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '805', title: 'អ្នកបច្ចេកទេសបន្លែ', titleZh: '蔬菜技术员', titleEn: 'Vegetable Technician',
    company: 'Safe Vegetable Cambodia', location: 'Kandal', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Agriculture', experience: '2+ years', level: 'mid',
    description: '指导大棚蔬菜种植，管理水肥系统，防治病虫害。',
    requirements: ['蔬菜种植经验', '了解无土栽培', '会基础英文'], benefits: ['技术培训', '包住', '绩效奖金'],
    applicants: 9, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '806', title: 'អ្នកគ្រប់គ្រងគុណភាពកសិកម្ម', titleZh: '农产品质检员', titleEn: 'Agri QA Inspector',
    company: 'SGS Cambodia', location: 'Phnom Penh', salaryMin: 450, salaryMax: 700,
    type: 'Full-time', industry: 'Agriculture', experience: '2-3 years', level: 'mid',
    description: '检测农产品质量，确保符合出口标准，出具检测报告。',
    requirements: ['质检经验', '了解食品安全标准', '细心认真'], benefits: ['国际公司', '培训机会', '带薪年假'],
    applicants: 5, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '807', title: 'អ្នកបញ្ចូលទិន្នន័យកសិកម្ម', titleZh: '农机操作员', titleEn: 'Farm Machinery Operator',
    company: 'Modern Farm Co.', location: 'Battambang', salaryMin: 300, salaryMax: 450,
    type: 'Full-time', industry: 'Agriculture', experience: '1+ years', level: 'junior',
    description: '操作拖拉机、收割机等农业机械，维护保养设备。',
    requirements: ['有农机操作经验', '会简单维修', '有驾照'], benefits: ['包住', '工作餐', '技能培训'],
    applicants: 14, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },

  // ========== 9. Logistics (物流运输) - 7 jobs ==========
  {
    id: '901', title: 'អ្នកបើកបរដឹកជញ្ជូន', titleZh: '货车司机', titleEn: 'Truck Driver',
    company: 'Mekong Logistics', location: 'Phnom Penh', salaryMin: 350, salaryMax: 500,
    type: 'Full-time', industry: 'Logistics', experience: '3+ years', level: 'mid',
    description: '驾驶货车运输货物，往返金边和西港之间。',
    requirements: ['驾照B/C', '3年以上驾龄', '熟悉金边路线'], benefits: ['油补', '意外险', '包住'],
    applicants: 31, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '902', title: 'អ្នកគ្រប់គ្រងឃ្លាំង', titleZh: '仓库经理', titleEn: 'Warehouse Manager',
    company: 'DHL Supply Chain', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Logistics', experience: '3-5 years', level: 'senior',
    description: '管理仓库运营，优化存储空间，控制库存成本。',
    requirements: ['仓库管理经验', '熟悉WMS系统', '团队管理'], benefits: ['国际品牌', '完善福利', '培训体系'],
    applicants: 4, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-19'
  },
  {
    id: '903', title: 'អ្នកប៉ាន់ប្រមាណតម្លៃដឹកជញ្ជូន', titleZh: '货运代理', titleEn: 'Freight Forwarder',
    company: 'Kerry Express Cambodia', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Logistics', experience: '2-3 years', level: 'mid',
    description: '安排货物运输，处理报关文件，跟踪货物状态。',
    requirements: ['了解货运流程', '2年以上货代经验', '英语基础'], benefits: ['绩效奖金', '带薪年假', '职业发展'],
    applicants: 8, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-18'
  },
  {
    id: '904', title: 'អ្នកបញ្ចូលទិន្នន័យដឹកជញ្ជូន', titleZh: '物流专员', titleEn: 'Logistics Coordinator',
    company: 'Maersk Cambodia', location: 'Sihanoukville', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Logistics', experience: '2-3 years', level: 'mid',
    description: '协调进出口物流，安排船期和拖车，处理单证。',
    requirements: ['物流经验', '熟悉海运流程', '英语沟通'], benefits: ['顶级物流平台', '国际培训', '年终奖金'],
    applicants: 6, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-17'
  },
  {
    id: '905', title: 'អ្នកបញ្ជូនសារឥតគិតថ្លៃ', titleZh: '快递员', titleEn: 'Delivery Courier',
    company: 'J&T Express Cambodia', location: 'Phnom Penh', salaryMin: 280, salaryMax: 450,
    type: 'Full-time', industry: 'Logistics', experience: 'Entry Level', level: 'entry',
    description: '配送快递包裹，维护客户关系，确保准时送达。',
    requirements: ['有摩托车', '熟悉金边路线', '服务意识强'], benefits: ['计件工资', '交通补贴', '多劳多得'],
    applicants: 42, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '906', title: 'អ្នកគ្រប់គ្រងប្រតិបត្តិការដឹកជញ្ជូន', titleZh: '运输调度员', titleEn: 'Transport Dispatcher',
    company: 'Vireak Buntham Express', location: 'Phnom Penh', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Logistics', experience: '2+ years', level: 'mid',
    description: '安排车辆调度，跟踪车辆位置，处理运输异常。',
    requirements: ['调度经验', '熟悉金边路况', '会用调度系统'], benefits: ['稳定工作', '包住', '绩效奖金'],
    applicants: 11, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '907', title: 'អ្នកគិតលុយឃ្លាំង', titleZh: '仓库文员', titleEn: 'Warehouse Clerk',
    company: 'Cambodia Post', location: 'Phnom Penh', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Logistics', experience: 'Entry Level', level: 'entry',
    description: '处理仓库进出货单据，录入系统，协助盘点。',
    requirements: ['会用电脑', '细心认真', '会用Excel'], benefits: ['政府福利', '稳定工作', '退休金'],
    applicants: 25, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },

  // ========== 10. Business Services (商业服务) - 7 jobs ==========
  {
    id: '1001', title: 'អ្នកបកប្រែភាសាចិន', titleZh: '中文翻译', titleEn: 'Chinese Translator',
    company: 'Chamkamorn Group', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Business Services', experience: '1-3 years', level: 'mid',
    description: '中文-高棉语-英语互译，商务谈判陪同翻译，文件翻译。',
    requirements: ['中文流利', '高棉语母语', '1年以上翻译经验'], benefits: ['年终奖金', '弹性时间', '商务出差'],
    applicants: 15, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Chinese Enterprise', createdAt: '2026-05-20'
  },
  {
    id: '1002', title: 'អ្នកប្រឹក្សាអាជីវកម្ម', titleZh: '商务顾问', titleEn: 'Business Consultant',
    company: 'PwC Cambodia', location: 'Phnom Penh', salaryMin: 1000, salaryMax: 1800,
    type: 'Full-time', industry: 'Business Services', experience: '3-5 years', level: 'senior',
    description: '为客户提供商业咨询服务，包括市场调研、战略规划、尽职调查。',
    requirements: ['商科硕士', '咨询公司经验', '分析能力强'], benefits: ['顶级咨询平台', '出国培训', '年终分红'],
    applicants: 2, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-19'
  },
  {
    id: '1003', title: 'បុគ្គលិកលក់', titleZh: '销售代表', titleEn: 'Sales Representative',
    company: 'Camel Brewery', location: 'Phnom Penh', salaryMin: 350, salaryMax: 700,
    type: 'Full-time', industry: 'Business Services', experience: '1-2 years', level: 'mid',
    description: '开发新客户，维护老客户，完成销售目标。',
    requirements: ['销售热情', '沟通能力强', '有驾照'], benefits: ['高提成', '话费补贴', '旅游奖励'],
    applicants: 27, postedAt: '2026-05-18', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '1004', title: 'អ្នកគ្រប់គ្រងទំនាក់ទំនងអតិថិជន', titleZh: '客户关系经理', titleEn: 'Account Manager',
    company: 'Cellcard', location: 'Phnom Penh', salaryMin: 550, salaryMax: 900,
    type: 'Full-time', industry: 'Business Services', experience: '3+ years', level: 'senior',
    description: '管理企业客户关系，提供解决方案，推动业务增长。',
    requirements: ['3年以上客户管理经验', 'B2B销售能力', '英文流利'], benefits: ['通信补贴', '年终奖金', '职业晋升'],
    applicants: 5, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '1005', title: 'អ្នកធ្វើទីផ្សារ', titleZh: '市场营销专员', titleEn: 'Marketing Specialist',
    company: 'Sabay Digital', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Business Services', experience: '2-3 years', level: 'mid',
    description: '策划和执行市场推广活动，管理社交媒体，分析营销数据。',
    requirements: ['市场营销背景', '熟悉数字营销', '创意能力'], benefits: ['年轻团队', '弹性工作', '培训机会'],
    applicants: 13, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '1006', title: 'អ្នកបំរើអតិថិជនតាមទូរស័ព្ទ', titleZh: '电话客服', titleEn: 'Call Center Agent',
    company: 'Wing Money', location: 'Phnom Penh', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Business Services', experience: 'Entry Level', level: 'entry',
    description: '接听客户来电，解答问题，处理投诉，记录工单。',
    requirements: ['声音甜美', '耐心好', '会高棉语'], benefits: ['空调环境', '培训上岗', '绩效奖金'],
    applicants: 36, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '1007', title: 'អ្នកប្រឹក្សាច្បាប់', titleZh: '法律顾问', titleEn: 'Legal Advisor',
    company: 'BNG Legal', location: 'Phnom Penh', salaryMin: 800, salaryMax: 1500,
    type: 'Full-time', industry: 'Business Services', experience: '3-5 years', level: 'senior',
    description: '为企业提供法律咨询，起草合同，处理法律纠纷。',
    requirements: ['法律学位', '柬埔寨律师执照', '3年以上执业经验'], benefits: ['高薪', '专业培训', '社会地位'],
    applicants: 3, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-14'
  },

  // ========== 11. Healthcare (医疗健康) - 7 jobs ==========
  {
    id: '1101', title: 'គិលានុប្បដ្ឋាយិកា', titleZh: '护士', titleEn: 'Registered Nurse',
    company: 'Calmette Hospital', location: 'Phnom Penh', salaryMin: 350, salaryMax: 550,
    type: 'Full-time', industry: 'Healthcare', experience: '1-3 years', level: 'mid',
    description: '提供临床护理服务，执行医嘱，观察患者病情变化。',
    requirements: ['护理学位', '护士执照', '1年以上临床经验'], benefits: ['医院环境', '技能培训', '医疗保险'],
    applicants: 16, postedAt: '2026-05-20', status: 'active', verified: true, urgent: true, featured: false, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '1102', title: 'វេជ្ជបណ្ឌិត', titleZh: '医生', titleEn: 'Medical Doctor',
    company: 'Royal Phnom Penh Hospital', location: 'Phnom Penh', salaryMin: 1500, salaryMax: 3000,
    type: 'Full-time', industry: 'Healthcare', experience: '3+ years', level: 'senior',
    description: '为患者提供诊断和治疗服务，参与科室值班。',
    requirements: ['医学学位', '医生执照', '3年以上临床经验'], benefits: ['顶级薪资', '国际医疗环境', '继续教育'],
    applicants: 2, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-19'
  },
  {
    id: '1103', title: 'អ្នកគ្រប់គ្រងឱសថស្ថាន', titleZh: '药店店长', titleEn: 'Pharmacy Manager',
    company: 'Ucare Pharmacy', location: 'Phnom Penh', salaryMin: 450, salaryMax: 700,
    type: 'Full-time', industry: 'Healthcare', experience: '3+ years', level: 'senior',
    description: '管理药店日常运营，指导用药，管理库存。',
    requirements: ['药学背景', '药店管理经验', '销售能力'], benefits: ['绩效奖金', '技能培训', '职业发展'],
    applicants: 6, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '1104', title: 'អ្នកជំនួញសុខភាព', titleZh: '健康管理师', titleEn: 'Health Coordinator',
    company: 'BioLab Cambodia', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Healthcare', experience: '2-3 years', level: 'mid',
    description: '为客户提供健康管理服务，安排体检，解读报告。',
    requirements: ['医学/护理背景', '沟通能力', '服务意识'], benefits: ['医疗福利', '培训机会', '带薪年假'],
    applicants: 8, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '1105', title: 'អ្នកជំនាញវេជ្ជសាស្ត្រសម្ភព', titleZh: '助产士', titleEn: 'Midwife',
    company: 'Reproductive Health Clinic', location: 'Phnom Penh', salaryMin: 400, salaryMax: 600,
    type: 'Full-time', industry: 'Healthcare', experience: '2+ years', level: 'mid',
    description: '为孕产妇提供产前产后护理，协助分娩，健康教育。',
    requirements: ['助产士执照', '2年以上经验', '有爱心'], benefits: ['诊所环境', '培训机会', '绩效奖金'],
    applicants: 5, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '1106', title: 'អ្នកជំនាញវាស់វែងភ្នែក', titleZh: '验光师', titleEn: 'Optometrist',
    company: 'Optic City', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Healthcare', experience: '2-3 years', level: 'mid',
    description: '进行视力检查，配镜建议，销售眼镜产品。',
    requirements: ['验光师资格', '2年以上经验', '销售能力'], benefits: ['销售提成', '技能培训', '员工折扣'],
    applicants: 7, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-15'
  },
  {
    id: '1107', title: 'អ្នកថែទាំជនជាប់គេ្គ', titleZh: '养老护理员', titleEn: 'Elderly Caregiver',
    company: 'Sunrise Senior Care', location: 'Phnom Penh', salaryMin: 280, salaryMax: 400,
    type: 'Full-time', industry: 'Healthcare', experience: 'Entry Level', level: 'entry',
    description: '照顾老年人日常生活，协助进食、洗澡、康复训练。',
    requirements: ['有爱心耐心', '能吃苦耐劳', '身体健康'], benefits: ['温馨环境', '包住', '带薪培训'],
    applicants: 19, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-14'
  },

  // ========== 12. Real Estate (房地产) - 7 jobs ==========
  {
    id: '1201', title: 'អ្នកលក់អចលនទ្រព្យ', titleZh: '房产销售', titleEn: 'Real Estate Agent',
    company: 'Century 21 Cambodia', location: 'Phnom Penh', salaryMin: 300, salaryMax: 1000,
    type: 'Full-time', industry: 'Real Estate', experience: 'Entry Level', level: 'entry',
    description: '开发房产客户，带看房源，促成交易。',
    requirements: ['销售热情', '会开车', '了解房产市场'], benefits: ['高佣金', '灵活时间', '出国旅游奖励'],
    applicants: 29, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-20'
  },
  {
    id: '1202', title: 'អ្នកគ្រប់គ្រងអចលនទ្រព្យ', titleZh: '物业经理', titleEn: 'Property Manager',
    company: 'Chip Mong Land', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Real Estate', experience: '3-5 years', level: 'senior',
    description: '管理商业物业日常运营，处理租户关系，维护物业设施。',
    requirements: ['物业管理经验', '团队管理能力', '客户服务'], benefits: ['高薪', '年终奖金', '住房补贴'],
    applicants: 4, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '1203', title: 'វាស់វែងដីធ្លី', titleZh: '土地测量师', titleEn: 'Land Surveyor',
    company: 'Ministry of Land Management', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Real Estate', experience: '2-3 years', level: 'mid',
    description: '进行土地测量，制作地籍图，处理土地纠纷。',
    requirements: ['测量专业', '2年以上经验', '政府关系'], benefits: ['公务员福利', '稳定工作', '退休金'],
    applicants: 7, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '1204', title: 'អ្នកប៉ាន់ប្រមាណតម្លៃអចលនទ្រព្យ', titleZh: '房产评估师', titleEn: 'Property Appraiser',
    company: 'Bonna Realty Group', location: 'Phnom Penh', salaryMin: 500, salaryMax: 850,
    type: 'Full-time', industry: 'Real Estate', experience: '3+ years', level: 'senior',
    description: '评估房产价值，出具评估报告，为客户提供投资建议。',
    requirements: ['评估师资格', '3年以上评估经验', '市场分析能力'], benefits: ['专业培训', '年终奖金', '弹性工作'],
    applicants: 3, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '1205', title: 'អ្នករចនាផ្ទះ', titleZh: '室内设计师', titleEn: 'Interior Designer',
    company: 'Home Decor Cambodia', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Real Estate', experience: '2-4 years', level: 'mid',
    description: '为住宅和商业空间提供室内设计方案，选材搭配。',
    requirements: ['设计专业', '熟练使用3D软件', '有作品集'], benefits: ['创意工作', '设计提成', '高端客户'],
    applicants: 9, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },
  {
    id: '1206', title: 'អ្នកថែទាំអគារ', titleZh: '保洁员', titleEn: 'Building Cleaner',
    company: 'JLL Cambodia', location: 'Phnom Penh', salaryMin: 250, salaryMax: 350,
    type: 'Full-time', industry: 'Real Estate', experience: 'Entry Level', level: 'entry',
    description: '清洁写字楼公共区域，维护卫生环境。',
    requirements: ['勤劳', '能接受早晚班', '身体健康'], benefits: ['国际品牌', '稳定工作', '工作餐'],
    applicants: 40, postedAt: '2026-05-15', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-15'
  },
  {
    id: '1207', title: 'អ្នកគ្រប់គ្រងគម្រោងអភិវឌ្ឍន៍', titleZh: '开发项目经理', titleEn: 'Development Project Manager',
    company: 'Oxley-Worldbridge', location: 'Phnom Penh', salaryMin: 1200, salaryMax: 2000,
    type: 'Full-time', industry: 'Real Estate', experience: '5+ years', level: 'manager',
    description: '管理房地产开发项目，协调设计、施工、销售各环节。',
    requirements: ['5年以上项目管理经验', '熟悉开发流程', '管理团队能力'], benefits: ['顶级薪资', '项目奖金', '股份期权'],
    applicants: 1, postedAt: '2026-05-14', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Multinational', createdAt: '2026-05-14'
  },

  // ========== 13. Media & Entertainment (传媒娱乐) - 5 jobs ==========
  {
    id: '1301', title: 'អ្នកថតរូបភាព', titleZh: '摄影师', titleEn: 'Photographer',
    company: 'PhotoPro Studio', location: 'Phnom Penh', salaryMin: 400, salaryMax: 700,
    type: 'Freelance', industry: 'Media & Entertainment', experience: '2-3 years', level: 'mid',
    description: '拍摄商业照片，包括产品、人像、活动摄影，后期修图。',
    requirements: ['摄影技术', '熟练使用Lightroom/PS', '有作品集'], benefits: ['创意工作', '弹性时间', '作品曝光'],
    applicants: 11, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '1302', title: 'អ្នកនិពន្ធវីដេអូ', titleZh: '视频剪辑师', titleEn: 'Video Editor',
    company: 'Sabay TV', location: 'Phnom Penh', salaryMin: 450, salaryMax: 750,
    type: 'Full-time', industry: 'Media & Entertainment', experience: '2-3 years', level: 'mid',
    description: '剪辑短视频和长视频内容，添加字幕和特效，制作片头片尾。',
    requirements: ['熟练使用PR/AE/剪映', '2年以上剪辑经验', '有网感'], benefits: ['年轻团队', '创作自由', '技能培训'],
    applicants: 14, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-19'
  },
  {
    id: '1303', title: 'អ្នកដឹកនាំរឿង', titleZh: '导演/编导', titleEn: 'Film Director',
    company: 'KWest Entertainment', location: 'Phnom Penh', salaryMin: 800, salaryMax: 1500,
    type: 'Contract', industry: 'Media & Entertainment', experience: '3-5 years', level: 'senior',
    description: '执导电视节目和网络视频，把控内容质量，管理团队。',
    requirements: ['导演经验', '创意能力', '团队管理'], benefits: ['项目奖金', '行业资源', '作品署名'],
    applicants: 3, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '1304', title: 'អ្នកនិពន្ធមាតិកា', titleZh: '新媒体运营', titleEn: 'Social Media Manager',
    company: 'CoolApp Cambodia', location: 'Phnom Penh', salaryMin: 400, salaryMax: 700,
    type: 'Full-time', industry: 'Media & Entertainment', experience: '2-3 years', level: 'mid',
    description: '运营TikTok/FB/IG等社交媒体账号，策划内容，分析数据。',
    requirements: ['熟悉社交媒体', '内容创作能力', '数据分析'], benefits: ['潮流工作', '弹性时间', '培训机会'],
    applicants: 18, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-17'
  },
  {
    id: '1305', title: 'តារាសម្តែង', titleZh: '演员/主播', titleEn: 'Actor/Live Streamer',
    company: 'LiveStar Agency', location: 'Phnom Penh', salaryMin: 300, salaryMax: 1000,
    type: 'Contract', industry: 'Media & Entertainment', experience: 'Entry Level', level: 'entry',
    description: '参与短视频和直播表演，与粉丝互动，推广产品。',
    requirements: ['外形好', '有表演天赋', '善于表达'], benefits: ['高收入潜力', '出名机会', '粉丝经济'],
    applicants: 35, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Local Company', createdAt: '2026-05-16'
  },

  // ========== 14. Energy (能源电力) - 5 jobs ==========
  {
    id: '1401', title: 'វិស្វករថាមពលអគ្គិសនី', titleZh: '电力工程师', titleEn: 'Electrical Power Engineer',
    company: 'Electricite du Cambodge', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1200,
    type: 'Full-time', industry: 'Energy', experience: '3-5 years', level: 'senior',
    description: '设计电力系统，监督电网建设，处理电力故障。',
    requirements: ['电气工程学位', '3年以上电力系统经验', '熟悉电力规范'], benefits: ['国企福利', '稳定工作', '退休金'],
    applicants: 4, postedAt: '2026-05-20', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-20'
  },
  {
    id: '1402', title: 'អ្នកបញ្ចូលទិន្នន័យអគ្គីសនី', titleZh: '电力技术员', titleEn: 'Electrical Technician',
    company: 'Schneider Electric', location: 'Phnom Penh', salaryMin: 450, salaryMax: 750,
    type: 'Full-time', industry: 'Energy', experience: '2-3 years', level: 'mid',
    description: '安装和维护电气设备，进行故障排查和维修。',
    requirements: ['电气技术背景', '2年以上经验', '有电工证'], benefits: ['国际品牌', '技术培训', '国际认证'],
    applicants: 8, postedAt: '2026-05-19', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-19'
  },
  {
    id: '1403', title: 'អ្នកគ្រប់គ្រងប្រព័ន្ធថាមពលព្រះអាទិត្យ', titleZh: '太阳能技术员', titleEn: 'Solar Energy Technician',
    company: 'SolarWorks Cambodia', location: 'Phnom Penh', salaryMin: 400, salaryMax: 650,
    type: 'Full-time', industry: 'Energy', experience: '2+ years', level: 'mid',
    description: '安装和维护太阳能发电系统，为客户提供技术支持。',
    requirements: ['了解光伏系统', '安装经验', '会用电工工具'], benefits: ['绿色能源', '技能培训', '绩效奖金'],
    applicants: 10, postedAt: '2026-05-18', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-18'
  },
  {
    id: '1404', title: 'អ្នកប្រតិបត្តិការរ៉ែ', titleZh: '矿山操作员', titleEn: 'Mining Operator',
    company: 'Angkor Gold', location: 'Mondulkiri', salaryMin: 500, salaryMax: 800,
    type: 'Full-time', industry: 'Energy', experience: '3+ years', level: 'mid',
    description: '操作矿山设备，进行矿石开采和初步处理。',
    requirements: ['矿山工作经验', '能吃苦耐劳', '安全意识强'], benefits: ['矿区包住', '高薪', '轮休制度'],
    applicants: 12, postedAt: '2026-05-17', status: 'active', verified: true, urgent: false, featured: false, employerType: 'Multinational', createdAt: '2026-05-17'
  },
  {
    id: '1405', title: 'អ្នកគ្រប់គ្រងបរិស្ថាន', titleZh: '环保工程师', titleEn: 'Environmental Engineer',
    company: 'MoE Cambodia', location: 'Phnom Penh', salaryMin: 600, salaryMax: 1000,
    type: 'Full-time', industry: 'Energy', experience: '3-5 years', level: 'senior',
    description: '评估环境影响，制定环保方案，监督污染控制。',
    requirements: ['环境工程学位', '3年以上环保经验', '熟悉法规'], benefits: ['政府福利', '稳定工作', '专业发展'],
    applicants: 3, postedAt: '2026-05-16', status: 'active', verified: true, urgent: false, featured: true, employerType: 'Local Company', createdAt: '2026-05-16'
  },
];

export default mockJobs;
