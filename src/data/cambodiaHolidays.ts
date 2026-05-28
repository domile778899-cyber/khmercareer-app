export type HolidayType = 'major' | 'traditional' | 'national' | 'religious';

export interface Holiday {
  id: string;
  name: string;
  nameKh: string;
  date: string; // MM-DD format
  month: number;
  day: number;
  type: HolidayType;
  description: string;
  greeting: string;
  color: string;
  bgGradient: string;
  icon: string;
  isPublicHoliday: boolean;
  traditions?: string[];
  activities?: string[];
  image?: string;
}

// Helper to get holiday date for current year
export function getHolidayDate(month: number, day: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  return new Date(year, month - 1, day);
}

// Helper to get holiday date for a specific year
export function getHolidayDateForYear(month: number, day: number, year: number): Date {
  return new Date(year, month - 1, day);
}

// Calculate days until holiday
export function getDaysUntil(month: number, day: number): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let holidayDate = getHolidayDate(month, day);
  holidayDate.setHours(0, 0, 0, 0);

  if (holidayDate < now) {
    // Holiday passed this year, calculate for next year
    holidayDate = new Date(now.getFullYear() + 1, month - 1, day);
    holidayDate.setHours(0, 0, 0, 0);
  }

  const diffMs = holidayDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export const cambodiaHolidays: Holiday[] = [
  {
    id: 'international-new-year',
    name: 'International New Year',
    nameKh: 'ទិវាចូលឆ្នាំសាកល',
    date: '01-01',
    month: 1,
    day: 1,
    type: 'national',
    description: 'Celebration of the Gregorian New Year across Cambodia.',
    greeting: 'Happy New Year! សួស្ដីឆ្នាំថ្មី!',
    color: '#EF4444',
    bgGradient: 'from-red-500 to-orange-500',
    icon: 'PartyPopper',
    isPublicHoliday: true,
    traditions: ['Fireworks at midnight', 'Family gatherings', 'Visiting temples'],
    activities: ['Countdown parties', 'Street celebrations in Phnom Penh', 'Temple offerings'],
  },
  {
    id: 'victory-day',
    name: 'Victory Over Genocide Day',
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    date: '01-07',
    month: 1,
    day: 7,
    type: 'national',
    description: 'Commemorates the fall of the Khmer Rouge regime in 1979.',
    greeting: 'Victory Day ទិវាជ័យជម្នះ!',
    color: '#DC2626',
    bgGradient: 'from-red-600 to-red-800',
    icon: 'Flag',
    isPublicHoliday: true,
    traditions: ['Wreath laying ceremonies', 'Moments of silence', 'Historical commemorations'],
    activities: ['Visit Tuol Sleng and Choeung Ek', 'Educational events', 'Cultural performances'],
  },
  {
    id: 'meak-bochea',
    name: 'Meak Bochea Day',
    nameKh: 'ពិធីបុណ្យមាឃបូជា',
    date: '02-12',
    month: 2,
    day: 12,
    type: 'religious',
    description: 'Buddhist holy day commemorating the spontaneous gathering of 1,250 monks.',
    greeting: 'Happy Meak Bochea! ចម្រើនពិធីបុណ្យមាឃបូជា!',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 to-yellow-600',
    icon: 'Sunrise',
    isPublicHoliday: true,
    traditions: ['Temple visits', 'Candlelight processions', 'Offerings to monks'],
    activities: ['Circumambulation ceremonies at Oudong Mountain', 'Meditation', 'Giving alms'],
  },
  {
    id: 'women-day',
    name: 'International Women\'s Day',
    nameKh: 'ទិវាអន្តរជាតិនារី',
    date: '03-08',
    month: 3,
    day: 8,
    type: 'national',
    description: 'Celebrating the achievements of women in Cambodia and worldwide.',
    greeting: 'Happy Women\'s Day! រីករាយទិវានារី!',
    color: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-500',
    icon: 'Heart',
    isPublicHoliday: false,
    traditions: ['Giving flowers to women', 'Special events for women', 'Promoting gender equality'],
    activities: ['Women\'s rights seminars', 'Cultural performances', 'Community celebrations'],
  },
  {
    id: 'khmer-new-year',
    name: 'Khmer New Year (Choul Chnam Thmey)',
    nameKh: 'ចូលឆ្នាំខ្មែរ',
    date: '04-13',
    month: 4,
    day: 13,
    type: 'major',
    description: 'The most important Cambodian festival marking the end of the harvest season. Celebrated over 3 days.',
    greeting: 'Happy Khmer New Year! សួស្ដីឆ្នាំថ្មី ចូលឆ្នាំខ្មែរ!',
    color: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-600',
    icon: 'Crown',
    isPublicHoliday: true,
    traditions: ['Building sand pagodas', 'Water throwing celebrations', 'Visiting elders', 'Temple offerings', 'Traditional games'],
    activities: ['Angkor Sangkran festival', 'Street water fights', 'Traditional dance performances', 'Family reunions', 'Bay ben (throwing rice) ceremony'],
  },
  {
    id: 'visak-bochea',
    name: 'Visak Bochea Day',
    nameKh: 'ពិធីបុណ្យវិសាខបូជា',
    date: '05-14',
    month: 5,
    day: 14,
    type: 'religious',
    description: 'Celebrates the birth, enlightenment, and passing of Buddha.',
    greeting: 'Happy Visak Bochea! ចម្រើនពិធីបុណ្យវិសាខបូជា!',
    color: '#8B5CF6',
    bgGradient: 'from-violet-500 to-purple-600',
    icon: 'Moon',
    isPublicHoliday: true,
    traditions: ['Lighting lanterns', 'Temple ceremonies', 'Releasing birds and fish'],
    activities: ['Candlelit processions at Angkor Wat', 'Meditation retreats', 'Alms giving'],
  },
  {
    id: 'labor-day',
    name: 'International Labor Day',
    nameKh: 'ទិវាពលកម្មអន្តរជាតិ',
    date: '05-01',
    month: 5,
    day: 1,
    type: 'national',
    description: 'Honoring workers and labor rights in Cambodia.',
    greeting: 'Happy Labor Day! រីករាយទិវាពលកម្ម!',
    color: '#3B82F6',
    bgGradient: 'from-blue-500 to-indigo-500',
    icon: 'Briefcase',
    isPublicHoliday: true,
    traditions: ['Worker parades', 'Union gatherings', 'Recognition of worker achievements'],
    activities: ['Marching at Freedom Park', 'Community service', 'Family outings'],
  },
  {
    id: 'royal-birthday-king-mother',
    name: 'King Mother\'s Birthday',
    nameKh: 'ព្រះរាជពិធីបុណ្យថ្ងៃប្រសូត្រព្រះមហាក្សត្រី',
    date: '06-18',
    month: 6,
    day: 18,
    type: 'national',
    description: 'Celebrating the birthday of Her Majesty Queen Mother Norodom Monineath.',
    greeting: 'Happy Birthday Queen Mother! រីករាយថ្ងៃប្រសូត្រព្រះមហាក្សត្រី!',
    color: '#F59E0B',
    bgGradient: 'from-yellow-500 to-amber-600',
    icon: 'Crown',
    isPublicHoliday: true,
    traditions: ['Royal ceremonies', 'Public celebrations', 'Charity events'],
    activities: ['Fireworks display', 'Cultural performances', 'Public gatherings'],
  },
  {
    id: 'pchum-ben',
    name: 'Pchum Ben (Ancestors\' Day)',
    nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    date: '09-20',
    month: 9,
    day: 20,
    type: 'major',
    description: '15-day festival where Cambodians pay respects to deceased ancestors. The most spiritually significant Buddhist festival.',
    greeting: 'Happy Pchum Ben! សួស្ដីពិធីបុណ្យភ្ជុំបិណ្ឌ!',
    color: '#F97316',
    bgGradient: 'from-orange-500 to-amber-600',
    icon: 'Flame',
    isPublicHoliday: true,
    traditions: ['Offering bay ben (rice balls) to monks', 'Visiting temples at dawn', 'Honoring 7 generations of ancestors', 'Wearing white to temples'],
    activities: ['Early morning temple visits (4-6 AM)', 'Making rice ball offerings', 'Listening to Buddhist sermons', 'Family reunions'],
  },
  {
    id: 'constitution-day',
    name: 'Constitution Day',
    nameKh: 'ទិវារដ្ឋធម្មនុញ្ញ',
    date: '09-24',
    month: 9,
    day: 24,
    type: 'national',
    description: 'Commemorates the signing of the Cambodian Constitution in 1993.',
    greeting: 'Happy Constitution Day! រីករាយទិវារដ្ឋធម្មនុញ្ញ!',
    color: '#1D4ED8',
    bgGradient: 'from-blue-600 to-blue-800',
    icon: 'Scroll',
    isPublicHoliday: true,
    traditions: ['Official ceremonies', 'Flag raising', 'Public education about the constitution'],
    activities: ['Government ceremonies', 'School programs', 'Community events'],
  },
  {
    id: 'coronation-day',
    name: 'King\'s Coronation Day',
    nameKh: 'ទិវាគ្រងរាជ្យ',
    date: '10-29',
    month: 10,
    day: 29,
    type: 'national',
    description: 'Celebrates the coronation of His Majesty King Norodom Sihamoni in 2004.',
    greeting: 'Happy Coronation Day! រីករាយទិវាគ្រងរាជ្យ!',
    color: '#D97706',
    bgGradient: 'from-amber-600 to-yellow-700',
    icon: 'Crown',
    isPublicHoliday: true,
    traditions: ['Royal ceremonies', 'Public celebrations', 'Fireworks'],
    activities: ['Palace ceremonies', 'Cultural shows', 'National celebrations'],
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    nameKh: 'ទិវាឯករាជ្យជាតិ',
    date: '11-09',
    month: 11,
    day: 9,
    type: 'major',
    description: 'Celebrates Cambodia\'s independence from France in 1953. A proud national celebration.',
    greeting: 'Happy Independence Day! រីករាយទិវាឯករាជ្យជាតិ!',
    color: '#DC2626',
    bgGradient: 'from-red-600 to-blue-600',
    icon: 'Flag',
    isPublicHoliday: true,
    traditions: ['Flag hoisting at Independence Monument', 'Military parades', 'Fireworks displays', 'National anthem singing'],
    activities: ['Parade at Independence Monument', 'Visit the Royal Palace', 'Watch fireworks over the Mekong', 'Cultural exhibitions'],
  },
  {
    id: 'bon-om-touk',
    name: 'Water Festival (Bon Om Touk)',
    nameKh: 'ពិធីបុណ្យអុំទូក',
    date: '11-14',
    month: 11,
    day: 14,
    type: 'major',
    description: 'Three-day festival celebrating the reversing flow of the Tonle Sap River. Famous for traditional boat races.',
    greeting: 'Happy Water Festival! សួស្ដីពិធីបុណ្យអុំទូក!',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-600',
    icon: 'Waves',
    isPublicHoliday: true,
    traditions: ['Boat racing on Tonle Sap', 'Floating lantern ceremonies', 'Eating ambok (flattened rice)', 'Sampeah preah khae (moon salutation)'],
    activities: ['Watch boat races in Phnom Penh', 'Release floating lanterns', 'Enjoy ambok and coconut juice', 'Fireworks over the river'],
  },
  {
    id: 'royal-birthday-king',
    name: 'King\'s Birthday',
    nameKh: 'ព្រះរាជពិធីបុណ្យថ្ងៃប្រសូត្រព្រះមហាក្សត្រ',
    date: '05-14',
    month: 5,
    day: 14,
    type: 'national',
    description: 'Celebrating the birthday of His Majesty King Norodom Sihamoni.',
    greeting: 'Happy King\'s Birthday! រីករាយថ្ងៃប្រសូត្រព្រះមហាក្សត្រ!',
    color: '#EAB308',
    bgGradient: 'from-yellow-400 to-amber-600',
    icon: 'Crown',
    isPublicHoliday: true,
    traditions: ['Royal ceremonies', 'Public celebrations', 'Charity events'],
    activities: ['Palace ceremonies', 'Cultural performances', 'Public gatherings'],
  },
];

// Utility functions

export function getUpcomingHolidays(days: number = 30): Holiday[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return cambodiaHolidays.filter((h) => {
    const holidayDate = getHolidayDate(h.month, h.day);
    holidayDate.setHours(0, 0, 0, 0);
    if (holidayDate < now) {
      // Check next year's date
      const nextYearDate = new Date(now.getFullYear() + 1, h.month - 1, h.day);
      return nextYearDate >= now && nextYearDate <= endDate;
    }
    return holidayDate >= now && holidayDate <= endDate;
  }).sort((a, b) => {
    const da = getHolidayDate(a.month, a.day);
    const db = getHolidayDate(b.month, b.day);
    if (da < now) da.setFullYear(da.getFullYear() + 1);
    if (db < now) db.setFullYear(db.getFullYear() + 1);
    return da.getTime() - db.getTime();
  });
}

export function getCurrentMonthHolidays(year?: number, month?: number): Holiday[] {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  return cambodiaHolidays.filter((h) => {
    if (h.month !== targetMonth) return false;
    const date = getHolidayDateForYear(h.month, h.day, targetYear);
    return date.getMonth() + 1 === targetMonth;
  });
}

export function getHolidayCountdown(holidayId: string): { days: number; hours: number; minutes: number; seconds: number; totalMs: number } | null {
  const holiday = cambodiaHolidays.find((h) => h.id === holidayId);
  if (!holiday) return null;

  const now = new Date();
  let targetDate = getHolidayDate(holiday.month, holiday.day);

  if (targetDate < now) {
    targetDate = new Date(now.getFullYear() + 1, holiday.month - 1, holiday.day);
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalMs: diffMs };
}

export function getMajorHolidays(): Holiday[] {
  return cambodiaHolidays.filter((h) => h.type === 'major');
}

export function getHolidayById(id: string): Holiday | undefined {
  return cambodiaHolidays.find((h) => h.id === id);
}

export function getNextHoliday(): Holiday | null {
  const now = new Date();
  let closest: Holiday | null = null;
  let closestDiff = Infinity;

  for (const h of cambodiaHolidays) {
    let date = getHolidayDate(h.month, h.day);
    if (date < now) {
      date = new Date(now.getFullYear() + 1, h.month - 1, h.day);
    }
    const diff = date.getTime() - now.getTime();
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = h;
    }
  }

  return closest;
}

export function isHolidayToday(): Holiday | null {
  const now = new Date();
  const today = cambodiaHolidays.find(
    (h) => h.month === now.getMonth() + 1 && h.day === now.getDate()
  );
  return today ?? null;
}

export function getClosestHoliday(): { holiday: Holiday; daysUntil: number } | null {
  const next = getNextHoliday();
  if (!next) return null;
  return { holiday: next, daysUntil: getDaysUntil(next.month, next.day) };
}

export function getHolidayTypeColor(type: HolidayType): string {
  switch (type) {
    case 'major': return 'bg-emerald-500';
    case 'traditional': return 'bg-amber-500';
    case 'national': return 'bg-blue-500';
    case 'religious': return 'bg-violet-500';
    default: return 'bg-gray-500';
  }
}

export function getHolidayTypeLabel(type: HolidayType): string {
  switch (type) {
    case 'major': return 'Major Festival';
    case 'traditional': return 'Traditional';
    case 'national': return 'National Holiday';
    case 'religious': return 'Religious';
    default: return type;
  }
}
