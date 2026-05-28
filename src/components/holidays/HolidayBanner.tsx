import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
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
  Bell,
} from 'lucide-react';
import {
  getUpcomingHolidays,
  getHolidayCountdown,
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
  Bell,
};

// Key for localStorage to remember dismissal
const DISMISS_KEY = 'holiday-banner-dismissed';
const DISMISS_DURATION_HOURS = 24;

function useDismissal(holidayId: string) {
  const storageKey = `${DISMISS_KEY}-${holidayId}`;

  const isDismissed = useCallback(() => {
    try {
      const data = localStorage.getItem(storageKey);
      if (!data) return false;
      const { timestamp } = JSON.parse(data);
      const elapsed = Date.now() - timestamp;
      return elapsed < DISMISS_DURATION_HOURS * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, [storageKey]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ timestamp: Date.now() })
      );
    } catch {
      // localStorage not available
    }
  }, [storageKey]);

  return { isDismissed, dismiss };
}

function CountdownDisplay({ holidayId }: { holidayId: string }) {
  const [countdown, setCountdown] = useState(() => getHolidayCountdown(holidayId));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getHolidayCountdown(holidayId));
    }, 1000);
    return () => clearInterval(timer);
  }, [holidayId]);

  if (!countdown) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Timer className="w-4 h-4" />
      <span className="font-mono font-bold">
        {countdown.days}d {String(countdown.hours).padStart(2, '0')}h{' '}
        {String(countdown.minutes).padStart(2, '0')}m{' '}
        {String(countdown.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
}

function MajorHolidayBanner({
  holiday,
  onDismiss,
}: {
  holiday: Holiday;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const Icon = iconMap[holiday.icon] || Sparkles;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${holiday.bgGradient} rounded-2xl shadow-lg`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,white,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,white,transparent_50%)]" />
      </div>

      {/* Floating sparkles decoration */}
      <div className="absolute top-2 right-12 opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <div className="absolute bottom-2 left-8 opacity-20 animate-pulse">
        <Sparkles className="w-5 h-5 text-white" />
      </div>

      <div className="relative px-6 py-5 flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {t('holidayBanner.comingSoon', 'Coming Soon')}
            </span>
          </div>
          <h3 className="text-xl font-bold leading-tight">{holiday.name}</h3>
          <p className="text-white/80 text-sm mt-0.5">{holiday.nameKh}</p>

          {/* Countdown */}
          <div className="mt-3 text-white/90">
            <CountdownDisplay holidayId={holiday.id} />
          </div>

          {/* Greeting */}
          <p className="mt-2 text-white/80 text-sm italic">
            &ldquo;{holiday.greeting}&rdquo;
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MinorHolidayBar({
  holiday,
  onDismiss,
}: {
  holiday: Holiday;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const Icon = iconMap[holiday.icon] || Bell;

  return (
    <div
      className={`relative bg-gradient-to-r ${holiday.bgGradient} rounded-xl shadow`}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <Icon className="w-5 h-5 text-white flex-shrink-0" />
        <div className="flex-1 min-w-0 text-white">
          <p className="text-sm font-medium truncate">
            {holiday.name}
            <span className="ml-2 text-white/70 font-normal">
              {holiday.month}/{holiday.day}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CountdownDisplay holidayId={holiday.id} />
          <button
            onClick={onDismiss}
            className="p-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HolidayBanner({ className }: Props) {
  const { t } = useTranslation();
  const [visibleBanners, setVisibleBanners] = useState<Holiday[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Check for upcoming holidays on mount
  useEffect(() => {
    const upcoming = getUpcomingHolidays(7);
    setVisibleBanners(upcoming);
  }, []);

  // Check localStorage for dismissed banners
  useEffect(() => {
    const dismissed = new Set<string>();
    for (const h of visibleBanners) {
      const key = `${DISMISS_KEY}-${h.id}`;
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const { timestamp } = JSON.parse(data);
          const elapsed = Date.now() - timestamp;
          if (elapsed < DISMISS_DURATION_HOURS * 60 * 60 * 1000) {
            dismissed.add(h.id);
          }
        }
      } catch {
        // localStorage not available
      }
    }
    setDismissedIds(dismissed);
  }, [visibleBanners]);

  const handleDismiss = (holidayId: string) => {
    const key = `${DISMISS_KEY}-${holidayId}`;
    try {
      localStorage.setItem(key, JSON.stringify({ timestamp: Date.now() }));
    } catch {
      // localStorage not available
    }
    setDismissedIds((prev) => new Set(prev).add(holidayId));
  };

  const activeBanners = visibleBanners.filter((h) => !dismissedIds.has(h.id));

  // Major holidays get big banner, minor get simple bar
  const majorBanners = activeBanners.filter((h) => h.type === 'major');
  const minorBanners = activeBanners.filter((h) => h.type !== 'major');

  if (activeBanners.length === 0) return null;

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* Major holiday banners */}
      {majorBanners.map((holiday) => (
        <MajorHolidayBanner
          key={holiday.id}
          holiday={holiday}
          onDismiss={() => handleDismiss(holiday.id)}
        />
      ))}

      {/* Minor holiday notification bars */}
      {minorBanners.length > 0 && (
        <div className="space-y-2">
          {minorBanners.map((holiday) => (
            <MinorHolidayBar
              key={holiday.id}
              holiday={holiday}
              onDismiss={() => handleDismiss(holiday.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
