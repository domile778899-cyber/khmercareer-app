// localStorage-based database with collections
const DB_PREFIX = 'khmercareer_';

export interface DBCollection<T> {
  findAll(): T[];
  findById(id: string): T | undefined;
  findBy(filter: Partial<T>): T[];
  create(data: Omit<T, 'id' | 'createdAt'>): T;
  update(id: string, data: Partial<T>): T | undefined;
  delete(id: string): boolean;
  count(): number;
}

export function createCollection<T extends { id: string; createdAt: string }>(name: string): DBCollection<T> {
  const key = DB_PREFIX + name;

  const getAll = (): T[] => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  };

  const saveAll = (items: T[]) => localStorage.setItem(key, JSON.stringify(items));

  return {
    findAll: () => getAll(),
    findById: (id) => getAll().find(item => item.id === id),
    findBy: (filter) => getAll().filter(item => Object.entries(filter).every(([k, v]) => (item as Record<string, unknown>)[k] === v)),
    create: (data) => {
      const items = getAll();
      const newItem = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as unknown as T;
      items.push(newItem);
      saveAll(items);
      return newItem;
    },
    update: (id, data) => {
      const items = getAll();
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return undefined;
      items[idx] = { ...items[idx], ...data };
      saveAll(items);
      return items[idx];
    },
    delete: (id) => {
      const items = getAll().filter(i => i.id !== id);
      saveAll(items);
      return true;
    },
    count: () => getAll().length,
  };
}

export interface Job {
  id: string;
  title: string;
  titleZh: string;
  titleEn: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  industry: string;
  level: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  postedAt: string;
  status: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  titleZh: string;
  titleEn: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  students: number;
  rating: number;
  reviews: number;
  duration: string;
  language: string;
  thumbnail: string;
  status: string;
  description: string;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'course' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
}

export function seedDatabase() {
  // Seed jobs if empty
  const jobsKey = DB_PREFIX + 'jobs';
  if (!localStorage.getItem(jobsKey) || JSON.parse(localStorage.getItem(jobsKey) || '[]').length === 0) {
    localStorage.setItem(jobsKey, JSON.stringify([
      { id: '1', title: 'អ្នកថតខារ៉ូទូករ', titleZh: '缝纫工', titleEn: 'Garment Sewing Worker', company: 'CamKo Textile', location: 'Phnom Penh', salary: '$250-$350', type: 'fulltime', industry: 'garment', level: 'entry', description: '操作缝纫机，制作服装。无需经验，提供培训。', requirements: ['无经验要求', '18-45岁', '身体健康'], benefits: ['免费宿舍', '免费午餐', '交通补贴'], applicants: 23, postedAt: '2025-06-15', status: 'active', createdAt: '2025-06-15' },
      { id: '2', title: 'អ្នកបម្រើតុ', titleZh: '餐厅服务员', titleEn: 'Restaurant Server', company: 'Angkor Paradise Hotel', location: 'Siem Reap', salary: '$300-$450', type: 'fulltime', industry: 'tourism', level: 'entry', description: '为客人提供优质的餐厅服务。', requirements: ['基础英语', '微笑服务', '18-35岁'], benefits: ['小费', '免费住宿', '餐食'], applicants: 12, postedAt: '2025-06-14', status: 'active', createdAt: '2025-06-14' },
      { id: '3', title: 'សហគ្រិនព័ត៌មានវិទ្យា', titleZh: 'IT开发工程师', titleEn: 'IT Developer', company: 'SinoLink Technology', location: 'Phnom Penh', salary: '$800-$1500', type: 'fulltime', industry: 'ict', level: 'mid', description: '开发Web和移动应用程序。', requirements: ['React/Vue经验', '2年以上', '大学学历'], benefits: ['弹性工作', '健康保险', '培训'], applicants: 8, postedAt: '2025-06-13', status: 'active', createdAt: '2025-06-13' },
      { id: '4', title: 'ជាងសាងសង់', titleZh: '建筑工人', titleEn: 'Construction Worker', company: 'Mekong Build', location: 'Sihanoukville', salary: '$300-$500', type: 'fulltime', industry: 'construction', level: 'entry', description: '建筑工地各类工作。', requirements: ['体力好', '有经验优先'], benefits: ['包住', '工伤保险'], applicants: 45, postedAt: '2025-06-12', status: 'active', createdAt: '2025-06-12' },
      { id: '5', title: 'អ្នកបកប្រែភាសាចិន', titleZh: '中文翻译', titleEn: 'Chinese Translator', company: 'Chamkamorn Group', location: 'Phnom Penh', salary: '$500-$800', type: 'fulltime', industry: 'business', level: 'mid', description: '中文-高棉语翻译工作。', requirements: ['中文流利', '高棉语母语', '1年以上经验'], benefits: ['年终奖', '弹性时间'], applicants: 15, postedAt: '2025-06-11', status: 'active', createdAt: '2025-06-11' },
      { id: '6', title: 'បុគ្គលិកទទួលភ្ញៀវ', titleZh: '酒店前台', titleEn: 'Hotel Receptionist', company: 'Raffles Hotel', location: 'Phnom Penh', salary: '$350-$550', type: 'fulltime', industry: 'tourism', level: 'entry', description: '接待入住客人，处理预订。', requirements: ['基础英语', '电脑操作', '形象好'], benefits: ['制服', '员工餐', '培训'], applicants: 19, postedAt: '2025-06-10', status: 'active', createdAt: '2025-06-10' },
      { id: '7', title: 'អ្នកបើកបរដឹកជញ្ជូន', titleZh: '货车司机', titleEn: 'Delivery Driver', company: 'Mekong Logistics', location: 'Phnom Penh', salary: '$300-$450', type: 'fulltime', industry: 'logistics', level: 'entry', description: '驾驶货车配送货物。', requirements: ['驾照B/C', '熟悉金边路线', '2年驾龄'], benefits: ['油补', '意外险'], applicants: 31, postedAt: '2025-06-09', status: 'active', createdAt: '2025-06-09' },
      { id: '8', title: 'អ្នកគ្រប់គ្រងរោងចក្រ', titleZh: '工厂主管', titleEn: 'Factory Supervisor', company: 'Evergreen Garment', location: 'Kampong Speu', salary: '$600-$900', type: 'fulltime', industry: 'garment', level: 'senior', description: '管理生产线工人，确保生产目标。', requirements: ['3年服装厂经验', '管理能力', '高棉语'], benefits: ['奖金', '住房补贴'], applicants: 6, postedAt: '2025-06-08', status: 'active', createdAt: '2025-06-08' },
    ] as Job[]));
  }

  // Seed courses if empty
  const coursesKey = DB_PREFIX + 'courses';
  if (!localStorage.getItem(coursesKey) || JSON.parse(localStorage.getItem(coursesKey) || '[]').length === 0) {
    localStorage.setItem(coursesKey, JSON.stringify([
      { id: '1', title: 'កម្រិតភាសាអង់គ្លេសពាណិជកម្ម', titleZh: '商务英语精通', titleEn: 'Business English Mastery', instructor: 'John Smith', category: 'english', level: 'intermediate', price: 19.99, students: 1245, rating: 4.9, reviews: 324, duration: '18h', language: 'en', thumbnail: 'business-english', status: 'published', description: '掌握200+商务英语短语，自信邮件写作，专业演讲技巧。', createdAt: '2025-05-01' },
      { id: '2', title: 'ទំនាក់ទំនងពាណិជកម្មភាសាចិន', titleZh: '中文商务沟通', titleEn: 'Chinese Business Communication', instructor: '李老师', category: 'chinese', level: 'intermediate', price: 15.99, students: 892, rating: 4.8, reviews: 210, duration: '15h', language: 'zh', thumbnail: 'chinese-business', status: 'published', description: '学习中文商务场景对话和书面沟通。', createdAt: '2025-04-15' },
      { id: '3', title: 'កម្រិត Excel សម្រាប់ការគ្រប់គ្រងរោងចក្រ', titleZh: 'Excel工厂管理', titleEn: 'Excel for Factory Management', instructor: 'Sopheap Rith', category: 'it', level: 'beginner', price: 8.99, students: 2340, rating: 4.7, reviews: 456, duration: '10h', language: 'km', thumbnail: 'excel-factory', status: 'published', description: '从零开始学习Excel，掌握工厂数据管理。', createdAt: '2025-04-20' },
      { id: '4', title: 'ការណែនាំអំពីទីផ្សារឌីជីថល', titleZh: '数字营销入门', titleEn: 'Introduction to Digital Marketing', instructor: 'Sarah Johnson', category: 'marketing', level: 'beginner', price: 12.99, students: 756, rating: 4.8, reviews: 189, duration: '12h', language: 'en', thumbnail: 'digital-marketing', status: 'published', description: '学习社交媒体营销、SEO和在线广告。', createdAt: '2025-05-10' },
      { id: '5', title: 'បច្ចេកទេសការដំអាងខោអាវ', titleZh: '服装缝制技巧', titleEn: 'Garment Sewing Techniques', instructor: 'Ming Zhang', category: 'garment', level: 'beginner', price: 0, students: 3102, rating: 4.6, reviews: 567, duration: '8h', language: 'zh', thumbnail: 'sewing', status: 'published', description: '服装缝制基础技能，适合新手工人。', createdAt: '2025-03-01' },
      { id: '6', title: 'ភាពអស្ចារ្យនៃសេវាកម្មសណ្ឋាគារ', titleZh: '酒店服务卓越', titleEn: 'Hotel Service Excellence', instructor: 'Sopheap Rith', category: 'hospitality', level: 'beginner', price: 0, students: 1890, rating: 4.9, reviews: 432, duration: '10h', language: 'km', thumbnail: 'hotel-service', status: 'published', description: '酒店服务标准和客户接待技巧。', createdAt: '2025-03-15' },
    ] as Course[]));
  }

  // Seed notifications if empty
  const notifKey = DB_PREFIX + 'notifications';
  if (!localStorage.getItem(notifKey)) {
    localStorage.setItem(notifKey, JSON.stringify([
      { id: '1', title: 'មានការងារថ្មីសម្រាប់អ្នក!', message: 'ក្រុមហ៊ុន CamKo Textile កំពុងជ្រើសរើសអ្នកថតខារ៉ូទូករ 50 នាក់', type: 'job', read: false, createdAt: '2025-06-15T08:00:00' },
      { id: '2', title: 'វគ្គសិក្សាថ្មីឥតគិតថ្លៃ!', message: 'វគ្គសិក្សា "ភាសាអង់គ្លេសពាណិជកម្ម" ឥតគិតថ្លៃសម្រាប់បុគ្គលិកកាត់ដេ', type: 'course', read: false, createdAt: '2025-06-14T10:00:00' },
      { id: '3', title: 'ប្រូមូសិនក្រុមហ៊ុន', message: 'ចុះឈ្មោះជាមួយក្រុមហ៊ុន ទទួលបានក្រេឌីត $100!', type: 'promo', read: true, createdAt: '2025-06-13T14:00:00' },
    ] as NotificationData[]));
  }

  // Seed applications if empty
  const appKey = DB_PREFIX + 'applications';
  if (!localStorage.getItem(appKey)) {
    localStorage.setItem(appKey, JSON.stringify([]));
  }

  // Seed course enrollments if empty
  const enrollKey = DB_PREFIX + 'enrollments';
  if (!localStorage.getItem(enrollKey)) {
    localStorage.setItem(enrollKey, JSON.stringify([]));
  }
}

export function clearDatabase() {
  Object.keys(localStorage).filter(k => k.startsWith(DB_PREFIX)).forEach(k => localStorage.removeItem(k));
}
