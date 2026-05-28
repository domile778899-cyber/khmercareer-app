import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
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
  CalendarDays,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  cambodiaHolidays,
  getHolidayDate,
  getHolidayTypeColor,
  getHolidayTypeLabel,
  type Holiday,
} from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
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

function getHolidayStatus(holiday: Holiday): {
  isPast: boolean;
  isToday: boolean;
  isUpcoming: boolean;
  daysUntil: number;
} {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let date = getHolidayDate(holiday.month, holiday.day);
  date.setHours(0, 0, 0, 0);

  const isToday =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth();

  if (date < now && !isToday) {
    // Check next year
    const nextYearDate = new Date(now.getFullYear() + 1, holiday.month - 1, holiday.day);
    const diffMs = nextYearDate.getTime() - now.getTime();
    return {
      isPast: false,
      isToday: false,
      isUpcoming: true,
      daysUntil: Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
    };
  }

  const diffMs = date.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    isPast: date < now && !isToday,
    isToday,
    isUpcoming: date >= now && !isToday,
    daysUntil,
  };
}

function TimelineNode({
  holiday,
  isLast,
}: {
  holiday: Holiday;
  isLast: boolean;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const status = getHolidayStatus(holiday);
  const Icon = iconMap[holiday.icon] || Sparkles;

  const nodeColor = status.isPast
    ? 'bg-gray-300'
    : status.isToday
    ? 'bg-amber-500'
    : getHolidayTypeColor(holiday.type);

  const glowClass =
    status.isToday
      ? 'ring-4 ring-amber-200 animate-pulse'
      : status.isUpcoming && status.daysUntil <= 30
      ? 'ring-2 ring-amber-100'
      : '';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div
          className={`absolute left-5 top-10 w-0.5 h-[calc(100%-1.5rem)] ${
            status.isPast ? 'bg-gray-200' : 'bg-gradient-to-b from-amber-300 to-amber-100'
          }`}
        />
      )}

      {/* Node */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full ${nodeColor} ${glowClass} flex items-center justify-center transition-all duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-6">
        <div
          className={`
            rounded-xl border transition-all duration-300 overflow-hidden
            ${
              status.isToday
                ? 'border-amber-300 bg-amber-50 shadow-md'
                : status.isPast
                ? 'border-gray-100 bg-gray-50/50 opacity-60'
                : 'border-gray-200 bg-white hover:border-amber-200 hover:shadow-sm'
            }
          `}
        >
          {/* Header - clickable */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center gap-3 text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-sm font-semibold truncate ${
                    status.isPast ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {holiday.name}
                </h3>
                {status.isToday && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    {t('holidayTimeline.today', 'Today')}
                  </span>
                )}
                {holiday.type === 'major' && !status.isPast && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                )}
                {status.isPast && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">
                  {holiday.month}/{holiday.day}
                </span>
                <span className="text-gray-300">|</span>
                <span
                  className={`text-xs ${
                    status.isPast ? 'text-gray-400' : 'text-amber-600'
                  }`}
                >
                  {status.isToday
                    ? t('holidayTimeline.today', 'Today')
                    : status.isPast
                    ? t('holidayTimeline.passed', 'Passed')
                    : `${status.daysUntil} ${t('holidayTimeline.daysUntil', 'days until')}`}
                </span>
              </div>
            </div>

            {/* Expand/collapse */}
            <div className="flex-shrink-0">
              {expanded ? (
                <ChevronUp className={`w-4 h-4 ${status.isPast ? 'text-gray-400' : 'text-gray-500'}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${status.isPast ? 'text-gray-400' : 'text-gray-500'}`} />
              )}
            </div>
          </button>

          {/* Expanded details */}
          {expanded && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                {holiday.description}
              </p>

              {/* Type badge */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${nodeColor}`} />
                <span className="text-xs text-gray-500">
                  {t(`holiday.type.${holiday.type}`, getHolidayTypeLabel(holiday.type))}
                  {holiday.isPublicHoliday && (
                    <span className="ml-2 text-red-500">
                      &middot; {t('holiday.publicHoliday', 'Public Holiday')}
                    </span>
                  )}
                </span>
              </div>

              {/* Greeting */}
              <div className="bg-amber-50/80 rounded-lg p-3">
                <p className="text-amber-800 text-sm italic">
                  &ldquo;{holiday.greeting}&rdquo;
                </p>
              </div>

              {/* Traditions */}
              {holiday.traditions && holiday.traditions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {t('holiday.traditions', 'Traditions')}
                  </h4>
                  <ul className="space-y-1">
                    {holiday.traditions.map((trad, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        {trad}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HolidayTimeline({ className }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'major'>('all');

  const filteredHolidays = useMemo(() => {
    const sorted = [...cambodiaHolidays].sort((a, b) => {
      const now = new Date();
      const da = getHolidayDate(a.month, a.day);
      const db = getHolidayDate(b.month, b.day);
      if (da < now) da.setFullYear(da.getFullYear() + 1);
      if (db < now) db.setFullYear(db.getFullYear() + 1);
      return da.getTime() - db.getTime();
    });

    if (filter === 'upcoming') {
      return sorted.filter((h) => {
        const s = getHolidayStatus(h);
        return !s.isPast;
      });
    }
    if (filter === 'major') {
      return sorted.filter((h) => h.type === 'major');
    }
    return sorted;
  }, [filter]);

  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <CalendarDays className="w-6 h-6 text-white" />
          <h2 className="text-white text-xl font-bold">
            {t('holidayTimeline.title', 'Holiday Timeline')} {currentYear}
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {(['all', 'upcoming', 'major'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all
                ${
                  filter === f
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              {t(`holidayTimeline.filter.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline content */}
      <div className="p-6">
        {/* Current date indicator */}
        <div className="flex items-center gap-2 mb-6 px-2 py-2 bg-amber-50 rounded-lg border border-amber-100">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700">
            {t('holidayTimeline.todayIs', 'Today is')}:{' '}
            <strong>
              {today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </span>
        </div>

        {/* Timeline nodes */}
        <div className="relative">
          {filteredHolidays.map((holiday, i) => (
            <TimelineNode
              key={holiday.id}
              holiday={holiday}
              isLast={i === filteredHolidays.length - 1}
            />
          ))}
        </div>

        {filteredHolidays.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {t('holidayTimeline.noHolidays', 'No holidays match the selected filter')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
