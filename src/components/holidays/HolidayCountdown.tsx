import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Timer,
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
  getNextHoliday,
  getHolidayCountdown,
  getMajorHolidays,
  type Holiday,
} from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
  holidayId?: string; // If not provided, shows next major holiday
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

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(holidayId: string): CountdownValue | null {
  const [countdown, setCountdown] = useState<CountdownValue | null>(null);

  useEffect(() => {
    function update() {
      const result = getHolidayCountdown(holidayId);
      if (result) {
        setCountdown({
          days: result.days,
          hours: result.hours,
          minutes: result.minutes,
          seconds: result.seconds,
        });
      }
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [holidayId]);

  return countdown;
}

function CountdownUnit({
  value,
  label,
  gradient,
}: {
  value: number;
  label: string;
  gradient: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center relative overflow-hidden`}
      >
        {/* Decorative shine */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)]" />
        <span className="text-3xl sm:text-4xl font-bold text-white font-mono relative z-10">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function HolidayCountdown({ className, holidayId }: Props) {
  const { t } = useTranslation();
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Determine which holiday to count down to
  useEffect(() => {
    if (holidayId) {
      const holidays = getMajorHolidays();
      const found = holidays.find((h) => h.id === holidayId);
      if (found) {
        setSelectedHoliday(found);
        return;
      }
    }
    const next = getNextHoliday();
    if (next) setSelectedHoliday(next);
  }, [holidayId]);

  const countdown = useCountdown(selectedHoliday?.id ?? '');
  const majorHolidays = getMajorHolidays();

  if (!selectedHoliday || !countdown) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 text-center ${className || ''}`}`}>
        <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400">{t('holidayCountdown.noUpcoming', 'No upcoming holidays')}</p>
      </div>
    );
  }

  const Icon = iconMap[selectedHoliday.icon] || Sparkles;

  // Gradient changes based on how close the holiday is
  const urgencyGradient =
    countdown.days <= 1
      ? 'from-red-500 to-rose-600'
      : countdown.days <= 7
      ? 'from-amber-500 to-orange-600'
      : selectedHoliday.bgGradient;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className || ''}`}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${urgencyGradient} px-6 py-5 relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="absolute top-4 right-4">
            <Sparkles className="w-20 h-20 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
          <div className="absolute bottom-2 left-2">
            <Icon className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold truncate">
                {selectedHoliday.name}
              </h2>
              {selectedHoliday.type === 'major' && (
                <Sparkles className="w-4 h-4 text-amber-200 flex-shrink-0" />
              )}
            </div>
            <p className="text-white/80 text-sm mt-0.5">{selectedHoliday.nameKh}</p>
            <div className="flex items-center gap-2 mt-1">
              <CalendarDays className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/70 text-xs">
                {selectedHoliday.month}/{selectedHoliday.day}
              </span>
              {selectedHoliday.isPublicHoliday && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                  {t('holiday.publicHoliday', 'Public Holiday')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Display */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <CountdownUnit
            value={countdown.days}
            label={t('countdown.days', 'Days')}
            gradient="from-amber-400 to-amber-600"
          />
          <span className="text-2xl sm:text-3xl font-bold text-gray-300">:</span>
          <CountdownUnit
            value={countdown.hours}
            label={t('countdown.hours', 'Hours')}
            gradient="from-orange-400 to-orange-600"
          />
          <span className="text-2xl sm:text-3xl font-bold text-gray-300">:</span>
          <CountdownUnit
            value={countdown.minutes}
            label={t('countdown.minutes', 'Min')}
            gradient="from-rose-400 to-rose-600"
          />
          <span className="text-2xl sm:text-3xl font-bold text-gray-300">:</span>
          <CountdownUnit
            value={countdown.seconds}
            label={t('countdown.seconds', 'Sec')}
            gradient="from-purple-400 to-purple-600"
          />
        </div>

        {/* Greeting */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            &ldquo;{selectedHoliday.greeting}&rdquo;
          </p>
        </div>

        {/* Holiday selector */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            {t('holidayCountdown.viewOther', 'View other holidays')}
          </button>

          {showPicker && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {majorHolidays.map((h) => {
                const HIcon = iconMap[h.icon] || Sparkles;
                const isSelected = h.id === selectedHoliday.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHoliday(h);
                      setShowPicker(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                      ${
                        isSelected
                          ? 'bg-amber-50 border border-amber-200 shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }
                    `}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${h.bgGradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <HIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-amber-700' : 'text-gray-700'}`}>
                        {h.name}
                      </p>
                      <p className="text-xs text-gray-400">{h.month}/{h.day}</p>
                    </div>
                    {isSelected && (
                      <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
