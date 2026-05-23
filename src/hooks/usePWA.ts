/**
 * Khmer Career Express - PWA React Hook
 * Convenient React hook for accessing PWA state and functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getPWAState,
  subscribeToPWAState,
  showInstallPrompt,
  updateServiceWorker,
  skipWaiting,
  isOnline,
  subscribeToPush,
  unsubscribeFromPush,
  requestNotificationPermission,
  registerBackgroundSync,
  clearAllCaches,
  type PWAState,
} from '@/utils/pwa';

/**
 * React hook for PWA state and operations
 * Provides reactive access to PWA functionality
 */
export function usePWA() {
  const [state, setState] = useState<PWAState>(getPWAState);

  useEffect(() => {
    const unsubscribe = subscribeToPWAState(setState);
    return unsubscribe;
  }, []);

  /** Show the PWA install prompt */
  const install = useCallback(async (): Promise<boolean> => {
    return showInstallPrompt();
  }, []);

  /** Check for Service Worker updates */
  const checkUpdate = useCallback(async (): Promise<void> => {
    return updateServiceWorker();
  }, []);

  /** Apply pending Service Worker update */
  const applyUpdate = useCallback((): void => {
    skipWaiting();
    window.location.reload();
  }, []);

  /** Subscribe to push notifications */
  const subscribePush = useCallback(async (vapidKey?: string) => {
    return subscribeToPush(vapidKey);
  }, []);

  /** Unsubscribe from push notifications */
  const unsubscribePush = useCallback(async (): Promise<boolean> => {
    return unsubscribeFromPush();
  }, []);

  /** Request notification permission */
  const requestNotifyPermission = useCallback(async (): Promise<NotificationPermission> => {
    return requestNotificationPermission();
  }, []);

  /** Register background sync */
  const sync = useCallback(async (tag?: string): Promise<boolean> => {
    return registerBackgroundSync(tag);
  }, []);

  /** Clear all app caches */
  const clearCaches = useCallback(async (): Promise<void> => {
    return clearAllCaches();
  }, []);

  return {
    // State
    ...state,
    isInstallable: state.isInstallable,
    isInstalled: state.isInstalled,
    isOnline: state.isOnline,
    swRegistered: state.swRegistered,
    swUpdateAvailable: state.swUpdateAvailable,
    pushSupported: state.pushSupported,
    pushSubscribed: state.pushSubscribed,

    // Actions
    install,
    checkUpdate,
    applyUpdate,
    subscribePush,
    unsubscribePush,
    requestNotifyPermission,
    sync,
    clearCaches,
  };
}

/**
 * Simple hook for online/offline status
 */
export function useNetworkStatus(): boolean {
  const [online, setOnline] = useState<boolean>(isOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setOnline(isOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}

/**
 * Hook for PWA install prompt
 */
export function useInstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA();

  return {
    isInstallable,
    isInstalled,
    install,
  };
}

/**
 * Hook for push notification status and control
 */
export function usePushNotifications(vapidKey?: string) {
  const {
    pushSupported,
    pushSubscribed,
    subscribePush,
    unsubscribePush,
    requestNotifyPermission,
  } = usePWA();

  const subscribe = useCallback(async () => {
    return subscribePush(vapidKey);
  }, [subscribePush, vapidKey]);

  return {
    supported: pushSupported,
    subscribed: pushSubscribed,
    subscribe,
    unsubscribe: unsubscribePush,
    requestPermission: requestNotifyPermission,
  };
}

export default usePWA;
