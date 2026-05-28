import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  ChevronRight,
  X,
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
} from 'lucide-react';
import {
  getClosestHoliday,
  cambodiaHolidays,
  getHolidayDate,
  type Holiday,
} from '../../data/cambodiaHolidays';
import { HolidayCalendar } from './HolidayCalendar';

interface Props {
  className?: string;
  variant?: 'sidebar' | 'footer';
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

export function HolidayMiniWidget({ className, variant = 'sidebar' }: Props) {
  const { t } = useTranslation();
  const [closest, setClosest] = useState<{ holiday: Holiday; daysUntil: number } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setClosest(getClosestHoliday());

    // Update every hour
    const timer = setInterval(() => {
      setClosest(getClosestHoliday());
      setCurrentTime(new Date());
    }, 3600000);

    return () => clearInterval(timer);
  }, []);

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <>
        <div
          className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow ${className || ''}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <h3 className="text-white text-sm font-semibold">
              {t('holidayWidget.title', 'Upcoming Holiday')}
            </h3>
          </div>

          {/* Content */}
          {closest ? (
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${closest.holiday.bgGradient} flex items-center justify-center flex-shrink-0`}
                >
                  {(() => {
                    const Icon = iconMap[closest.holiday.icon] || Sparkles;
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {closest.holiday.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {closest.holiday.month}/{closest.holiday.day}
                  </p>
                </div>
              </div>

              {/* Days until */}
              <div className="mt-3 bg-amber-50 rounded-lg px-3 py-2 text-center">
                <span className="text-2xl font-bold text-amber-600">
                  {closest.daysUntil}
                </span>
                <span className="text-xs text-amber-600 ml-1">
                  {t('holidayWidget.daysLeft', 'days left')}
                </span>
              </div>

              {/* Expand button */}
              <button
                onClick={() => setShowCalendar(true)}
                className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {t('holidayWidget.viewCalendar', 'View Calendar')}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-400">
                {t('holidayWidget.noUpcoming', 'No upcoming holidays')}
              </p>
            </div>
          )}

          {/* Month holidays count */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('holidayWidget.thisMonth', "This month's holidays")}</span>
              <span className="font-semibold text-gray-700">
                {cambodiaHolidays.filter((h) => h.month === currentTime.getMonth() + 1).length}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowCalendar(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t('holidayCalendar.title', 'Holiday Calendar')}
                </h3>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <HolidayCalendar />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Footer variant
  return (
    <>
      <div
        className={`bg-white rounded-lg shadow border border-gray-100 overflow-hidden ${className || ''}`}`}
      >
        <button
          onClick={() => setShowCalendar(true)}
          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-600">
            <Calendar className="w-4 h-4" />
            {closest ? (
              <>
                <span className="text-sm font-medium">
                  {closest.holiday.name}
                </span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {closest.daysUntil}d
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">
                {t('holidayWidget.noUpcoming', 'No upcoming holidays')}
              </span>
            )}
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-auto" />
        </button>
      </div>

      {showCalendar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {t('holidayCalendar.title', 'Holiday Calendar')}
              </h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <HolidayCalendar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
