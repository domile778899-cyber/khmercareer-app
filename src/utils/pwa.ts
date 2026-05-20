/**
 * Khmer Career Express - PWA Utilities
 * Service Worker registration, install prompt handling,
 * online/offline status, and push notification support
 */

// =============================================================================
// Types
// =============================================================================

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  swRegistered: boolean;
  swUpdateAvailable: boolean;
  pushSupported: boolean;
  pushSubscribed: boolean;
}

// =============================================================================
// State Management
// =============================================================================

let deferredPrompt: BeforeInstallPromptEvent | null = null;

const pwaState: PWAState = {
  isInstallable: false,
  isInstalled: false,
  isOnline: navigator.onLine,
  swRegistered: false,
  swUpdateAvailable: false,
  pushSupported: 'PushManager' in window,
  pushSubscribed: false,
};

const listeners: Set<(state: PWAState) => void> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => cb({ ...pwaState }));
}

export function subscribeToPWAState(callback: (state: PWAState) => void): () => void {
  listeners.add(callback);
  callback({ ...pwaState });
  return () => listeners.delete(callback);
}

export function getPWAState(): PWAState {
  return { ...pwaState };
}

// =============================================================================
// Service Worker Registration
// =============================================================================

/**
 * Register the Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'imports',
    });

    console.log('[PWA] Service Worker registered:', registration.scope);
    pwaState.swRegistered = true;
    notifyListeners();

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[PWA] New version available');
          pwaState.swUpdateAvailable = true;
          notifyListeners();
        }
      });
    });

    // Listen for messages from SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[PWA] Message from SW:', event.data);
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Update the Service Worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  await registration.update();
  console.log('[PWA] Service Worker update check triggered');
}

/**
 * Skip waiting and activate new Service Worker
 */
export function skipWaiting(): void {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.waiting?.postMessage('skipWaiting');
    pwaState.swUpdateAvailable = false;
    notifyListeners();
  });
}

// =============================================================================
// Install Prompt Handling
// =============================================================================

/**
 * Listen for the beforeinstallprompt event
 */
export function initInstallPrompt(): void {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true) {
    pwaState.isInstalled = true;
    notifyListeners();
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt fired');
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    pwaState.isInstallable = true;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
    pwaState.isInstallable = false;
    pwaState.isInstalled = true;
    notifyListeners();
  });
}

/**
 * Show the install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] No deferred prompt available');
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    deferredPrompt = null;
    pwaState.isInstallable = false;
    notifyListeners();

    return result.outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Install prompt failed:', error);
    return false;
  }
}

/**
 * Check if the app can be installed
 */
export function canInstall(): boolean {
  return deferredPrompt !== null && !pwaState.isInstalled;
}

// =============================================================================
// Online/Offline Status
// =============================================================================

/**
 * Initialize online/offline listeners
 */
export function initNetworkListeners(): void {
  const handleOnline = () => {
    console.log('[PWA] Device is online');
    pwaState.isOnline = true;
    notifyListeners();
    
    // Dispatch custom event for app components
    window.dispatchEvent(new CustomEvent('pwa:online'));
  };

  const handleOffline = () => {
    console.log('[PWA] Device is offline');
    pwaState.isOnline = false;
    notifyListeners();
    
    // Dispatch custom event for app components
    window.dispatchEvent(new CustomEvent('pwa:offline'));
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Set initial state
  pwaState.isOnline = navigator.onLine;
}

/**
 * Check if device is currently online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

// =============================================================================
// Push Notifications
// =============================================================================

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[PWA] Notification permission error:', error);
    return 'denied';
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(
  applicationServerKey?: string
): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('[PWA] Push notifications not supported');
    return null;
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('[PWA] Notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Check existing subscription
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      console.log('[PWA] Already subscribed to push');
      pwaState.pushSubscribed = true;
      notifyListeners();
      return existingSub;
    }

    // Subscribe
    const vapidKey = applicationServerKey 
      ? urlBase64ToUint8Array(applicationServerKey)
      : undefined;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    console.log('[PWA] Push subscription created:', subscription);
    pwaState.pushSubscribed = true;
    notifyListeners();

    // TODO: Send subscription to server
    // await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error('[PWA] Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('[PWA] Push unsubscribed');
      // TODO: Remove subscription from server
    }
    
    pwaState.pushSubscribed = false;
    notifyListeners();
    return true;
  } catch (error) {
    console.error('[PWA] Push unsubscribe failed:', error);
    return false;
  }
}

/**
 * Convert VAPID key from base64url to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// =============================================================================
// Background Sync
// =============================================================================

/**
 * Register a background sync
 */
export async function registerBackgroundSync(tag: string = 'sync-submissions'): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    console.log('[PWA] Background sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log('[PWA] Background sync registered:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Background sync registration failed:', error);
    return false;
  }
}

// =============================================================================
// Cache Management
// =============================================================================

/**
 * Clear all app caches
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  const appCaches = cacheNames.filter((name) => name.startsWith('khmer-career-'));
  
  await Promise.all(appCaches.map((name) => caches.delete(name)));
  console.log('[PWA] All caches cleared');
}

/**
 * Get cache info
 */
export async function getCacheInfo(): Promise<{ name: string; size: number }[]> {
  if (!('caches' in window)) return [];

  const cacheNames = await caches.keys();
  const appCaches = cacheNames.filter((name) => name.startsWith('khmer-career-'));
  
  const info = await Promise.all(
    appCaches.map(async (name) => {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      return { name, size: keys.length };
    })
  );
  
  return info;
}

// =============================================================================
// Initialize All PWA Features
// =============================================================================

/**
 * Initialize all PWA functionality
 * Call this once at app startup
 */
export function initPWA(): void {
  console.log('[PWA] Initializing PWA...');

  // Register service worker
  registerServiceWorker();

  // Listen for install prompt
  initInstallPrompt();

  // Listen for network changes
  initNetworkListeners();

  console.log('[PWA] PWA initialized');
}

// Auto-initialize when imported
// initPWA(); // Uncomment for auto-init, or call manually in main.tsx

export default initPWA;
