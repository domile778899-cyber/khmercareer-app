import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  Sparkles,
  Crown,
  Flag,
  Flame,
  Waves,
  PartyPopper,
  Sunrise,
  Moon,
  Heart,
  Briefcase,
  Scroll,
} from 'lucide-react';
import {
  cambodiaHolidays,
  getHolidayDate,
  getHolidayTypeColor,
  getHolidayTypeLabel,
  type Holiday,
  type HolidayType,
} from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
  onSelectHoliday?: (holiday: Holiday) => void;
}

const iconMap: Record<string, React.ElementType> = {
  PartyPopper,
  Flag,
  Sunrise,
  Heart,
  Crown,
  Moon,
  Briefcase,
  Flame,
  Waves,
  Scroll,
  Sparkles,
};

const typeBorderColor: Record<HolidayType, string> = {
  major: 'border-emerald-400',
  traditional: 'border-amber-400',
  national: 'border-blue-400',
  religious: 'border-violet-400',
};

export function HolidayCalendar({ className, onSelectHoliday }: Props) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const today = new Date();

  const monthNames = [
    t('months.january', 'January'),
    t('months.february', 'February'),
    t('months.march', 'March'),
    t('months.april', 'April'),
    t('months.may', 'May'),
    t('months.june', 'June'),
    t('months.july', 'July'),
    t('months.august', 'August'),
    t('months.september', 'September'),
    t('months.october', 'October'),
    t('months.november', 'November'),
    t('months.december', 'December'),
  ];

  const weekDays = [
    t('weekDays.sun', 'Sun'),
    t('weekDays.mon', 'Mon'),
    t('weekDays.tue', 'Tue'),
    t('weekDays.wed', 'Wed'),
    t('weekDays.thu', 'Thu'),
    t('weekDays.fri', 'Fri'),
    t('weekDays.sat', 'Sat'),
  ];

  // Get holidays for the current displayed month
  const monthHolidays = useMemo(() => {
    return cambodiaHolidays.filter((h) => h.month === currentMonth + 1);
  }, [currentMonth]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: {
      date: number | null;
      isToday: boolean;
      holiday?: Holiday;
    }[] = [];

    // Empty cells before start
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, isToday: false });
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        today.getDate() === d &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

      const holiday = monthHolidays.find((h) => h.day === d);
      days.push({ date: d, isToday, holiday });
    }

    return days;
  }, [currentMonth, currentYear, monthHolidays, today]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  const handleHolidayClick = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    onSelectHoliday?.(holiday);
  };

  const HolidayIcon = selectedHoliday
    ? iconMap[selectedHoliday.icon] || Sparkles
    : null;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-white" />
          <h2 className="text-white text-xl font-bold">
            {t('holidayCalendar.title', 'Khmer Holiday Calendar')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white font-medium text-sm"
          >
            {monthNames[currentMonth]} {currentYear}
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 flex flex-wrap gap-3 border-b border-gray-100 bg-gray-50/50">
        {(['major', 'national', 'religious', 'traditional'] as HolidayType[]).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getHolidayTypeColor(type)}`} />
            <span className="text-xs text-gray-600 capitalize">
              {t(`holiday.type.${type}`, getHolidayTypeLabel(type))}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all duration-200 cursor-default
                ${day.date === null ? 'invisible' : ''}
                ${
                  day.isToday
                    ? 'bg-amber-50 ring-2 ring-amber-400 font-bold'
                    : 'hover:bg-gray-50'
                }
                ${day.holiday ? 'cursor-pointer hover:scale-105' : ''}
              `}
              onClick={() => day.holiday && handleHolidayClick(day.holiday)}
            >
              {day.date !== null && (
                <>
                  <span
                    className={`
                      text-sm
                      ${day.isToday ? 'text-amber-700' : 'text-gray-700'}
                      ${day.holiday ? 'font-semibold' : ''}
                    `}
                  >
                    {day.date}
                  </span>
                  {day.holiday && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <div
                        className={`w-2 h-2 rounded-full ${getHolidayTypeColor(day.holiday.type)}`}
                        title={day.holiday.name}
                      />
                      {day.holiday.type === 'major' && (
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Month holidays summary */}
        {monthHolidays.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {t('holidayCalendar.thisMonth', 'This Month\'s Holidays')}
            </h3>
            <div className="space-y-2">
              {monthHolidays.map((h) => {
                const Icon = iconMap[h.icon] || Sparkles;
                return (
                  <div
                    key={h.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border-l-4 ${typeBorderColor[h.type]} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
                    onClick={() => handleHolidayClick(h)}
                  >
                    <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {h.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {h.month}/{h.day} &middot; {t(`holiday.type.${h.type}`, getHolidayTypeLabel(h.type))}
                      </p>
                    </div>
                    {h.type === 'major' && (
                      <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Holiday Detail Modal */}
      {selectedHoliday && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedHoliday(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${selectedHoliday.bgGradient} px-6 py-5 relative`}
            >
              <button
                onClick={() => setSelectedHoliday(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
              {HolidayIcon && (
                <HolidayIcon className="w-10 h-10 text-white/90 mb-2" />
              )}
              <h3 className="text-white text-xl font-bold">{selectedHoliday.name}</h3>
              <p className="text-white/80 text-sm mt-0.5">{selectedHoliday.nameKh}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs">
                <div className={`w-2 h-2 rounded-full bg-white`} />
                {t(`holiday.type.${selectedHoliday.type}`, getHolidayTypeLabel(selectedHoliday.type))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedHoliday.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {selectedHoliday.month}/{selectedHoliday.day}
                  {selectedHoliday.isPublicHoliday && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                      {t('holiday.publicHoliday', 'Public Holiday')}
                    </span>
                  )}
                </span>
              </div>

              {/* Greeting */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                <p className="text-amber-800 text-sm font-medium italic">
                  &ldquo;{selectedHoliday.greeting}&rdquo;
                </p>
              </div>

              {/* Traditions */}
              {selectedHoliday.traditions && selectedHoliday.traditions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {t('holiday.traditions', 'Traditions')}
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedHoliday.traditions.map((t_, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        {t_}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Activities */}
              {selectedHoliday.activities && selectedHoliday.activities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {t('holiday.activities', 'Activities')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHoliday.activities.map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
