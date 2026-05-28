import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Sparkles,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Check,
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
  isHolidayToday,
  getHolidayById,
  type Holiday,
} from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
  forcedHolidayId?: string;
  onClose?: () => void;
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

const DISMISS_KEY = 'holiday-greeting-dismissed';

function useGreetingDismissal(holidayId: string) {
  const storageKey = `${DISMISS_KEY}-${holidayId}`;

  const isDismissed = useCallback(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  }, [storageKey]);

  const dismiss = useCallback((permanent: boolean = false) => {
    try {
      localStorage.setItem(storageKey, 'true');
      if (permanent) {
        localStorage.setItem(`${DISMISS_KEY}-${holidayId}-permanent`, 'true');
      }
    } catch {
      // localStorage not available
    }
  }, [storageKey, holidayId]);

  const isPermanentlyDismissed = useCallback(() => {
    try {
      return localStorage.getItem(`${DISMISS_KEY}-${holidayId}-permanent`) === 'true';
    } catch {
      return false;
    }
  }, [holidayId]);

  return { isDismissed, dismiss, isPermanentlyDismissed };
}

function ShareButtons({ holiday, message }: { holiday: Holiday; message: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(message);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {t('holidayGreeting.share', 'Share Greeting')}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${shareText}`, '_blank')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </button>
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </button>
        <button
          onClick={() => window.open(`https://wa.me/?text=${shareText}`, '_blank')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? t('holidayGreeting.copied', 'Copied!') : t('holidayGreeting.copy', 'Copy')}</span>
        </button>
      </div>
    </div>
  );
}

export function HolidayGreeting({ className, forcedHolidayId, onClose }: Props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (forcedHolidayId) {
      const h = getHolidayById(forcedHolidayId);
      if (h) {
        setHoliday(h);
        setShow(true);
      }
      return;
    }

    const today = isHolidayToday();
    if (today) {
      const dismissed = localStorage.getItem(`${DISMISS_KEY}-${today.id}-permanent`) === 'true';
      if (!dismissed) {
        setHoliday(today);
        setShow(true);
      }
    }
  }, [forcedHolidayId]);

  const handleClose = () => {
    if (dontShowAgain && holiday) {
      const { dismiss } = useGreetingDismissal(holiday.id);
      dismiss(true);
    }
    setShow(false);
    onClose?.();
  };

  if (!show || !holiday) return null;

  const Icon = iconMap[holiday.icon] || Sparkles;
  const greetingMessage = holiday.greeting;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className || ''}`}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative gradient */}
        <div className={`h-3 bg-gradient-to-r ${holiday.bgGradient}`} />

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ float: 'right' }}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Icon */}
          <div
            className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${holiday.bgGradient} flex items-center justify-center shadow-lg mb-5`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Holiday name */}
          <h2 className="text-2xl font-bold text-gray-800">{holiday.name}</h2>
          <p className="text-amber-600 font-medium text-lg mt-1">{holiday.nameKh}</p>

          {/* Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {t('holidayGreeting.today', 'Celebrating Today!')}
          </div>
        </div>

        {/* Greeting Card */}
        <div className="px-8 pb-6">
          <div
            className={`rounded-2xl p-6 bg-gradient-to-br ${holiday.bgGradient} relative overflow-hidden`}
          >
            {/* Decorative elements */}
            <div className="absolute top-2 right-3 opacity-20">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <div className="absolute bottom-2 left-3 opacity-15">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <div className="relative z-10 text-center">
              <Sparkles className="w-6 h-6 text-white/70 mx-auto mb-3" />
              <p className="text-white text-lg font-medium leading-relaxed italic">
                &ldquo;{greetingMessage}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-white/30" />
                <span className="text-white/60 text-xs">
                  {t('holidayGreeting.fromKhmerCareer', 'From KhmerCareer Team')}
                </span>
                <div className="h-px w-8 bg-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 pb-4">
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            {holiday.description}
          </p>
        </div>

        {/* Share */}
        <div className="px-8 pb-6">
          <ShareButtons holiday={holiday} message={greetingMessage} />
        </div>

        {/* Footer with don't show again */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-500">
              {t('holidayGreeting.dontShowAgain', "Don't show again")}
            </span>
          </label>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
