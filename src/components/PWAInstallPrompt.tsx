/**
 * ============================================================
 * KhmerCareer Express - PWA Install Prompt Component
 * ============================================================
 * A bilingual (5-language) install prompt banner that detects
 * the user's platform and shows appropriate installation
 * instructions for each browser/device.
 *
 * Features:
 *   - Detects beforeinstallprompt event (Chrome/Edge/Android)
 *   - Shows custom install banner at bottom of screen
 *   - iOS Safari support with step-by-step instructions
 *   - Dismissible with 7-day localStorage persistence
 *   - Golden theme matching KhmerCareer branding
 *   - Full i18n support (km/zh/en/th/vi)
 *   - Animated entrance/exit transitions
 *   - Responsive design for all screen sizes
 *
 * Usage:
 *   <PWAInstallPrompt />
 *
 * Add to App.tsx near the root level:
 *   import PWAInstallPrompt from './components/PWAInstallPrompt';
 *   // ...
 *   <PWAInstallPrompt />
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Share2, PlusSquare, Smartphone, ChevronDown } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

// ── i18n Translation Keys ───────────────────────────────────
/**
 * Extend the i18n type declarations for PWA install prompt translations.
 * These translations are loaded dynamically.
 */
declare module 'react-i18next' {
  interface Resources {
    pwaInstall: {
      bannerTitle: string;
      bannerSubtitle: string;
      installButton: string;
      dismissButton: string;
      iosInstructions: string;
      iosStep1: string;
      iosStep2: string;
      iosStep3: string;
      iosNote: string;
      androidInstructions: string;
      androidNote: string;
      alreadyInstalled: string;
      laterButton: string;
      neverButton: string;
    };
  }
}

// ── Translation Resources ───────────────────────────────────
const pwaInstallTranslations = {
  km: {
    pwaInstall: {
      bannerTitle: 'ដំឡើង KhmerCareer លើទូរស័ព្ទរបស់អ្នក',
      bannerSubtitle: 'ចូលប្រើប្រាស់លឿន ទាំងដែលក្រៅបណ្តាញ — គ្មានការទាញយកពី App Store ទេ!',
      installButton: 'ដំឡើងកម្មវិធី',
      dismissButton: 'មិនអរគុណ',
      iosInstructions: 'របៀបដំឡើងលើ iPhone/iPad:',
      iosStep1: 'ចុចប៊ូតុង "ចែករំលែក" នៅខាងក្រោមរបាររុករក ( Safari )',
      iosStep2: 'រក្រាយចុះហើយចុច "បញ្ចូលទៅអេក្រង់ដើម"',
      iosStep3: 'KhmerCareer នឹងបង្ហាញលើអេក្រង់ដើមរបស់អ្នក!',
      iosNote: 'ចំណាំ: របៀបនេះត្រូវការ Safari browser ប៉ុណ្ណោះ',
      androidInstructions: 'ចុច "ដំឡើង" ដើម្បីបន្ថែម KhmerCareer ទៅអេក្រង់ដើម',
      androidNote: 'អ្នកអាចប្រើប្រាស់កម្មវិធីបានទាំងដែលក្រៅបណ្តាញ!',
      alreadyInstalled: 'កម្មវិធីបានដំឡើងរួចហើយ',
      laterButton: 'ក្រោយមក',
      neverButton: 'កុំបង្ហាញម្តងទៀត',
    },
  },
  zh: {
    pwaInstall: {
      bannerTitle: '安装 KhmerCareer 到您的手机',
      bannerSubtitle: '快速访问，离线使用 — 无需从应用商店下载！',
      installButton: '安装应用',
      dismissButton: '不了谢谢',
      iosInstructions: 'iPhone/iPad 安装方法：',
      iosStep1: '点击底部 Safari 工具栏的"分享"按钮',
      iosStep2: '向下滚动并点击"添加到主屏幕"',
      iosStep3: 'KhmerCareer 将出现在您的主屏幕上！',
      iosNote: '注意：此方法仅适用于 Safari 浏览器',
      androidInstructions: '点击"安装"将 KhmerCareer 添加到主屏幕',
      androidNote: '您可以离线使用该应用！',
      alreadyInstalled: '应用已安装',
      laterButton: '稍后',
      neverButton: '不再显示',
    },
  },
  en: {
    pwaInstall: {
      bannerTitle: 'Install KhmerCareer on Your Phone',
      bannerSubtitle: 'Fast access, works offline — no app store download needed!',
      installButton: 'Install App',
      dismissButton: 'No Thanks',
      iosInstructions: 'How to install on iPhone/iPad:',
      iosStep1: 'Tap the "Share" button in Safari\'s bottom toolbar',
      iosStep2: 'Scroll down and tap "Add to Home Screen"',
      iosStep3: 'KhmerCareer will appear on your home screen!',
      iosNote: 'Note: This method requires Safari browser only',
      androidInstructions: 'Tap "Install" to add KhmerCareer to your home screen',
      androidNote: 'You can use the app even when offline!',
      alreadyInstalled: 'App already installed',
      laterButton: 'Later',
      neverButton: 'Don\'t show again',
    },
  },
  th: {
    pwaInstall: {
      bannerTitle: 'ติดตั้ง KhmerCareer บนโทรศัพท์ของคุณ',
      bannerSubtitle: 'เข้าถึงได้เร็ว ใช้งานออฟไลน์ได้ — ไม่ต้องดาวน์โหลดจาก App Store!',
      installButton: 'ติดตั้งแอป',
      dismissButton: 'ไม่เป็นไร',
      iosInstructions: 'วิธีติดตั้งบน iPhone/iPad:',
      iosStep1: 'แตะปุ่ม "แชร์" ในแถบเครื่องมือ Safari ที่ด้านล่าง',
      iosStep2: 'เลื่อนลงและแตะ "เพิ่มไปยังหน้าจอโฮม"',
      iosStep3: 'KhmerCareer จะปรากฏบนหน้าจอโฮมของคุณ!',
      iosNote: 'หมายเหตุ: วิธีนี้ใช้ได้กับ Safari เท่านั้น',
      androidInstructions: 'แตะ "ติดตั้ง" เพื่อเพิ่ม KhmerCareer ไปยังหน้าจอโฮม',
      androidNote: 'คุณสามารถใช้แอปได้แม้ไม่มีอินเทอร์เน็ต!',
      alreadyInstalled: 'แอปติดตั้งแล้ว',
      laterButton: 'ภายหลัง',
      neverButton: 'ไม่ต้องแสดงอีก',
    },
  },
  vi: {
    pwaInstall: {
      bannerTitle: 'Cài đặt KhmerCareer trên điện thoại của bạn',
      bannerSubtitle: 'Truy cập nhanh, hoạt động ngoại tuyến — không cần tải từ App Store!',
      installButton: 'Cài đặt ứng dụng',
      dismissButton: 'Không, cảm ơn',
      iosInstructions: 'Cách cài đặt trên iPhone/iPad:',
      iosStep1: 'Nhấn nút "Chia sẻ" trong thanh công cụ Safari ở dưới cùng',
      iosStep2: 'Cuộn xuống và nhấn "Thêm vào Màn hình chính"',
      iosStep3: 'KhmerCareer sẽ xuất hiện trên màn hình chính của bạn!',
      iosNote: 'Lưu ý: Phương pháp này chỉ hoạt động với Safari',
      androidInstructions: 'Nhấn "Cài đặt" để thêm KhmerCareer vào màn hình chính',
      androidNote: 'Bạn có thể sử dụng ứng dụng ngay cả khi ngoại tuyến!',
      alreadyInstalled: 'Ứng dụng đã được cài đặt',
      laterButton: 'Để sau',
      neverButton: 'Không hiển thị lại',
    },
  },
};

// ── Component ───────────────────────────────────────────────

export default function PWAInstallPrompt() {
  const { i18n, t } = useTranslation();
  const {
    isInstallable,
    isInstalled,
    isIOSSafari,
    isInStandaloneMode,
    isDismissed,
    installPrompt,
    dismissInstall,
    platform,
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Add PWA translations to i18n if not already present
  useEffect(() => {
    const currentLang = i18n.language || 'km';
    const lang = currentLang.split('-')[0]; // 'zh-CN' → 'zh'

    // Add resources for each language
    Object.entries(pwaInstallTranslations).forEach(([lng, resources]) => {
      if (!i18n.hasResourceBundle(lng, 'pwaInstall')) {
        i18n.addResourceBundle(lng, 'pwaInstall', resources.pwaInstall, true, true);
      }
    });

    // Force re-render to pick up translations
    // (The i18n system will handle this automatically)
  }, [i18n]);

  // Determine if we should show the banner
  const shouldShow = useCallback(() => {
    // Don't show if already in standalone/PWA mode
    if (isInStandaloneMode) return false;
    // Don't show if already installed
    if (isInstalled) return false;
    // Don't show if dismissed (within 7 days)
    if (isDismissed) return false;
    // Show if the browser supports install, or if it's iOS Safari
    return isInstallable || isIOSSafari;
  }, [isInstallable, isInstalled, isIOSSafari, isInStandaloneMode, isDismissed]);

  // Control visibility with animation
  useEffect(() => {
    if (shouldShow()) {
      // Small delay for better UX (let page load first)
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);

  // Handle install button click
  const handleInstall = async () => {
    if (isIOSSafari) {
      // On iOS, expand to show instructions
      setIsExpanded(!isExpanded);
      return;
    }

    // On Android/Chrome, trigger the install prompt
    const accepted = await installPrompt();
    if (accepted) {
      setIsVisible(false);
    }
  };

  // Handle dismiss button click
  const handleDismiss = () => {
    setIsVisible(false);
    // Small delay to let animation finish before calling dismissInstall
    setTimeout(() => {
      dismissInstall();
    }, 300);
  };

  // Handle "Don't show again" click
  const handleNeverShow = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissInstall();
      // Set a far-future timestamp so it won't show again
      try {
        localStorage.setItem('khmercareer-pwa-install-dismissed', '9999999999999');
      } catch {
        // localStorage not available
      }
    }, 300);
  };

  // If not visible and animation hasn't played, don't render
  if (!isVisible && !hasAnimated) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[9999]
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
      role="dialog"
      aria-label="Install app prompt"
    >
      {/* Backdrop overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Main banner */}
      <div
        className={`
          relative mx-2 sm:mx-4 mb-2 sm:mb-4
          rounded-2xl shadow-2xl
          border border-[#D4AF37]/30
          bg-gradient-to-br from-[#1A1714] to-[#2D2926]
          overflow-hidden
        `}
      >
        {/* Golden shimmer effect at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

        <div className="p-4 sm:p-5">
          {/* Header row */}
          <div className="flex items-start gap-3 sm:gap-4">
            {/* App icon */}
            <div
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center
                         bg-gradient-to-br from-[#D4AF37] to-[#B8960F] shadow-lg shadow-[#D4AF37]/20"
            >
              <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[#FAF8F3] font-bold text-sm sm:text-base leading-tight">
                {t('pwaInstall:bannerTitle')}
              </h3>
              <p className="text-[#A8A39A] text-xs sm:text-sm mt-1 leading-relaxed">
                {t('pwaInstall:bannerSubtitle')}
              </p>
            </div>

            {/* Close button (desktop only) */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 rounded-lg text-[#A8A39A] hover:text-[#FAF8F3]
                         hover:bg-white/10 transition-colors duration-200
                         hidden sm:block"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 sm:gap-3 mt-4">
            {/* Install button */}
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2
                         bg-gradient-to-r from-[#D4AF37] to-[#B8960F]
                         hover:from-[#E0BC4B] hover:to-[#C9A61D]
                         text-[#1A1714] font-bold
                         py-2.5 sm:py-3 px-4 sm:px-6
                         rounded-xl text-sm sm:text-base
                         shadow-lg shadow-[#D4AF37]/20
                         active:scale-[0.98] transform
                         transition-all duration-200
                         min-h-[44px] touch-manipulation"
            >
              {isIOSSafari ? (
                <>
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{isExpanded ? t('pwaInstall:laterButton') : t('pwaInstall:installButton')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('pwaInstall:installButton')}</span>
                </>
              )}
            </button>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="px-4 sm:px-5 py-2.5 sm:py-3
                         text-[#A8A39A] hover:text-[#FAF8F3]
                         text-sm sm:text-base font-medium
                         rounded-xl border border-[#D4AF37]/20
                         hover:bg-white/5
                         active:scale-[0.98] transform
                         transition-all duration-200
                         min-h-[44px] touch-manipulation"
            >
              {t('pwaInstall:dismissButton')}
            </button>
          </div>

          {/* iOS Safari install instructions (expandable) */}
          {isIOSSafari && isExpanded && (
            <div
              className="mt-4 p-4 rounded-xl bg-[#FAF8F3]/5 border border-[#D4AF37]/20
                         animate-in slide-in-from-top-2 duration-300"
            >
              <p className="text-[#D4AF37] font-semibold text-sm mb-3 flex items-center gap-2">
                <PlusSquare className="w-4 h-4" />
                {t('pwaInstall:iosInstructions')}
              </p>
              <ol className="space-y-2.5">
                <li className="flex items-start gap-3 text-[#FAF8F3]/80 text-sm">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20
                                 flex items-center justify-center text-[#D4AF37] text-xs font-bold"
                  >
                    1
                  </span>
                  {t('pwaInstall:iosStep1')}
                </li>
                <li className="flex items-start gap-3 text-[#FAF8F3]/80 text-sm">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20
                                 flex items-center justify-center text-[#D4AF37] text-xs font-bold"
                  >
                    2
                  </span>
                  {t('pwaInstall:iosStep2')}
                </li>
                <li className="flex items-start gap-3 text-[#FAF8F3]/80 text-sm">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20
                                 flex items-center justify-center text-[#D4AF37] text-xs font-bold"
                  >
                    3
                  </span>
                  {t('pwaInstall:iosStep3')}
                </li>
              </ol>
              <p className="text-[#A8A39A] text-xs mt-3 italic">
                {t('pwaInstall:iosNote')}
              </p>
            </div>
          )}

          {/* Android note */}
          {!isIOSSafari && (
            <p className="text-[#A8A39A] text-xs mt-3 text-center">
              {t('pwaInstall:androidNote')}
            </p>
          )}

          {/* "Don't show again" link */}
          <button
            onClick={handleNeverShow}
            className="w-full mt-3 text-center text-[#A8A39A] hover:text-[#FAF8F3]
                       text-xs underline underline-offset-2
                       transition-colors duration-200 py-1"
          >
            {t('pwaInstall:neverButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
