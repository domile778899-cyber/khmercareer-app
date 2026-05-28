/**
 * ============================================================
 * KhmerCareer Express - PWA Detection Hook
 * ============================================================
 * A lightweight React hook for detecting PWA install state,
 * online/offline status, and providing the install prompt.
 *
 * Features:
 *   - Detects if the app is installable (beforeinstallprompt)
 *   - Detects if the app is already installed (display-mode)
 *   - Tracks online/offline status
 *   - Provides install prompt function for Chrome/Edge/Android
 *   - Detects iOS Safari and provides install instructions
 *   - Integrates with the existing i18n system
 *   - Persists dismissed state in localStorage
 *
 * Usage:
 *   const { isInstallable, isInstalled, isOffline, installPrompt } = usePWA();
 *
 *   if (isInstallable && !isInstalled) {
 *     return <InstallBanner onInstall={installPrompt} />;
 *   }
 * ============================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ───────────────────────────────────────────────────

/** PWA install prompt event (beforeinstallprompt) */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/** Return type for usePWA hook */
export interface UsePWAReturn {
  /** Whether the browser supports PWA installation */
  isInstallable: boolean;
  /** Whether the app is already installed (standalone/display-mode) */
  isInstalled: boolean;
  /** Whether the device is currently offline */
  isOffline: boolean;
  /** Whether the device is running iOS Safari (needs manual install) */
  isIOSSafari: boolean;
  /** Whether the device is running in a Capacitor/WebView context */
  isInStandaloneMode: boolean;
  /** Whether the install banner was dismissed by user */
  isDismissed: boolean;
  /** Function to trigger the browser install prompt (Chrome/Edge/Android) */
  installPrompt: () => Promise<boolean>;
  /** Function to dismiss the install banner */
  dismissInstall: () => void;
  /** Function to reset dismissed state (for testing) */
  resetDismissed: () => void;
  /** The deferred install prompt event (advanced usage) */
  deferredPrompt: BeforeInstallPromptEvent | null;
  /** Platform detection */
  platform: {
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isChrome: boolean;
    isEdge: boolean;
    isFirefox: boolean;
    isStandalone: boolean;
  };
}

/** Platform detection helper */
function detectPlatform() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  return {
    isIOS: /iphone|ipad|ipod/.test(userAgent),
    isAndroid: /android/.test(userAgent),
    isSafari: /safari/.test(userAgent) && !/chrome|chromium|crios/.test(userAgent),
    isChrome: /chrome|chromium|crios/.test(userAgent),
    isEdge: /edg/.test(userAgent),
    isFirefox: /firefox|fxios/.test(userAgent),
    isStandalone: standalone,
  };
}

/** Check if we're running in Capacitor WebView */
function isCapacitorWebView(): boolean {
  return typeof (window as unknown as { Capacitor?: unknown }).Capacitor !== 'undefined';
}

// localStorage key for dismissed state
const DISMISS_KEY = 'khmercareer-pwa-install-dismissed';

/**
 * PWA detection hook for KhmerCareer Express
 * Provides comprehensive PWA state detection and install functionality.
 */
export function usePWA(): UsePWAReturn {
  const platform = useRef(detectPlatform());
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(platform.current.isStandalone);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check dismissed state from localStorage on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10);
        // Reset dismissed state after 7 days
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - dismissedAt > sevenDays) {
          localStorage.removeItem(DISMISS_KEY);
          setIsDismissed(false);
        } else {
          setIsDismissed(true);
        }
      }
    } catch {
      // localStorage not available (private mode, etc.)
      setIsDismissed(false);
    }
  }, []);

  // Detect iOS Safari (which doesn't support beforeinstallprompt)
  useEffect(() => {
    const p = platform.current;
    // iOS Safari: iOS device + Safari browser + not in standalone mode
    if (p.isIOS && p.isSafari && !p.isStandalone) {
      setIsIOSSafari(true);
    }
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    // Don't show install prompt if already in standalone/Capacitor mode
    if (platform.current.isStandalone || isCapacitorWebView()) {
      setIsInstallable(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app was just installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for display-mode changes (installation detection)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsInstalled(e.matches);
    };

    // Check initial state
    handleChange(mediaQuery);

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange as (e: MediaQueryListEvent) => void);
      return () => mediaQuery.removeEventListener('change', handleChange as (e: MediaQueryListEvent) => void);
    } else {
      // Legacy API for older browsers
      mediaQuery.addListener(handleChange as (e: MediaQueryListEvent) => void);
      return () => mediaQuery.removeListener(handleChange as (e: MediaQueryListEvent) => void);
    }
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Trigger the browser's install prompt (Chrome/Edge/Android).
   * Returns true if the user accepted the install.
   */
  const installPrompt = useCallback(async (): Promise<boolean> => {
    const promptEvent = deferredPrompt;

    if (!promptEvent) {
      // On iOS Safari, we can't programmatically install
      // Return false so the UI can show manual instructions
      return false;
    }

    try {
      // Show the install prompt
      await promptEvent.prompt();

      // Wait for the user to respond
      const { outcome } = await promptEvent.userChoice;

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('[usePWA] Install prompt error:', error);
      return false;
    }
  }, [deferredPrompt]);

  /**
   * Dismiss the install banner and persist in localStorage.
   * The banner will reappear after 7 days.
   */
  const dismissInstall = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // localStorage not available
    }
  }, []);

  /**
   * Reset the dismissed state (useful for testing).
   */
  const resetDismissed = useCallback(() => {
    setIsDismissed(false);
    try {
      localStorage.removeItem(DISMISS_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    isOffline,
    isIOSSafari,
    isInStandaloneMode: platform.current.isStandalone || isCapacitorWebView(),
    isDismissed,
    installPrompt,
    dismissInstall,
    resetDismissed,
    deferredPrompt,
    platform: platform.current,
  };
}

/**
 * Simple hook for online/offline status only.
 * Lightweight alternative when you only need network status.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook to check if the app is running as an installed PWA/Capacitor.
 * Useful for conditionally showing/hiding PWA-specific features.
 */
export function useStandaloneMode(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const check = () => {
      const displayMode = window.matchMedia('(display-mode: standalone)').matches;
      const navigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const capacitor = typeof (window as unknown as { Capacitor?: unknown }).Capacitor !== 'undefined';
      setIsStandalone(displayMode || navigatorStandalone || capacitor);
    };
    check();
  }, []);

  return isStandalone;
}

export default usePWA;
