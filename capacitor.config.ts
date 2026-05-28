/**
 * ============================================================
 * KhmerCareer Express - Capacitor Configuration
 * ============================================================
 * This file configures the Capacitor mobile runtime for both
 * Android and iOS builds. It is used during:
 *   - Local development (`npx cap run android/ios`)
 *   - CI/CD pipeline builds (GitHub Actions)
 *   - Production APK/IPA generation
 *
 * Key configuration areas:
 *   - App identity (appId, appName, version)
 *   - Web asset directory (`webDir: 'dist'`)
 *   - Server URL for development (commented out for production)
 *   - Android build options with signing config template
 *   - iOS content inset and custom URL scheme
 *   - Plugin configurations (SplashScreen, PushNotifications,
 *     App, Browser, Camera, Geolocation, StatusBar)
 *
 * Usage:
 *   npx cap sync          - Sync web assets to native platforms
 *   npx cap run android   - Run on Android device/emulator
 *   npx cap run ios       - Run on iOS simulator
 *   npx cap open android  - Open Android project in Android Studio
 *   npx cap open ios      - Open iOS project in Xcode
 * ============================================================
 */

import type { CapacitorConfig } from '@capacitor/cli';

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  // ── App Identity ──────────────────────────────────────────
  /** Android application ID (reverse domain notation) */
  appId: 'com.khmercareer.app',
  /** Display name shown on device home screen */
  appName: 'KhmerCareer Express',
  /** Directory containing built web assets */
  webDir: 'dist',
  /** Disable bundled runtime (use native WebView) */
  bundledWebRuntime: false,

  // ── Server Configuration ──────────────────────────────────
  /** Server URL for live reload during development only */
  server: isDev
    ? {
        /** Your local dev server URL — update with your machine's IP */
        url: 'http://192.168.1.100:5173',
        /** Allow cleartext (non-HTTPS) in development */
        cleartext: true,
        /**
         * Android 8+ requires cleartext traffic for local dev.
         * This is automatically handled by allowMixedContent below.
         */
      }
    : {
        /**
         * PRODUCTION: Leave url empty to use bundled assets.
         * Uncomment and set if using remote URL (e.g., Capacitor live update).
         */
        // url: 'https://your-production-domain.com',
        // cleartext: false,
      },

  // ── Android Configuration ─────────────────────────────────
  android: {
    /**
     * Build signing configuration.
     * For CI/CD, these values are overridden via environment variables
     * or injected from GitHub Secrets. See .github/workflows/build-android.yml
     */
    buildOptions: {
      /** Path to keystore file (relative to android/app) */
      keystorePath: 'release.keystore',
      /** Keystore alias name */
      keystoreAlias: 'khmercareer',
      /** Keystore password — set via BUILD_PASSWORD env var in CI */
      keystorePassword: process.env.BUILD_KEYSTORE_PASSWORD || '',
      /** Key password — set via BUILD_KEY_PASSWORD env var in CI */
      keystoreAliasPassword: process.env.BUILD_KEY_PASSWORD || '',
      /** Use apksigner for APK signing (Android 7+) */
      signingType: 'apksigner',
    },
    /**
     * Allow mixed content (HTTP + HTTPS).
     * Required for:
     *   - Development server (HTTP)
     *   - Loading images from legacy HTTP URLs
     *   - Third-party integrations that use HTTP
     */
    allowMixedContent: true,
    /**
     * Enable input capture for file inputs.
     * Required for resume upload, profile photo, and document features.
     */
    captureInput: true,
    /** Enable WebView debugging in development only */
    webContentsDebuggingEnabled: isDev,
    /** Background color shown during WebView initialization */
    backgroundColor: '#FAF8F3',
  },

  // ── iOS Configuration ─────────────────────────────────────
  ios: {
    /**
     * Content inset behavior for safe areas (notches, home indicator).
     * 'always' ensures content respects safe area insets on all edges.
     */
    contentInset: 'always',
    /**
     * Custom URL scheme for deep linking.
     * Usage: khmercareer://jobs/123 opens the app to a specific job.
     */
    scheme: 'khmercareer',
    /**
     * Enable link preview on long-press (iOS 13+).
     * Set to false if you want to handle long-press yourself.
     */
    allowsLinkPreview: true,
    /** Enable native scrolling (recommended for most apps) */
    scrollEnabled: true,
    /** Enable WebView debugging in development only */
    webContentsDebuggingEnabled: isDev,
    /** Background color shown during WebView initialization */
    backgroundColor: '#FAF8F3',
  },

  // ── Plugin Configurations ─────────────────────────────────
  plugins: {
    // ── SplashScreen ────────────────────────────────────────
    SplashScreen: {
      /** Duration splash screen is shown (ms). Set to 0 for manual dismiss */
      launchShowDuration: 3000,
      /** Auto-hide splash after duration */
      launchAutoHide: true,
      /** Fade-out duration when hiding (ms) */
      launchFadeOutDuration: 500,
      /** Splash background color (golden KhmerCareer theme) */
      backgroundColor: '#D4AF37',
      /** Android drawable resource name for splash image */
      androidSplashResourceName: 'splash',
      /** Scale type for splash image on Android */
      androidScaleType: 'CENTER_CROP',
      /** Show loading spinner during app initialization */
      showSpinner: true,
      /** Android spinner size */
      androidSpinnerStyle: 'large',
      /** iOS spinner size */
      iosSpinnerStyle: 'large',
      /** Spinner color (white on gold background) */
      spinnerColor: '#FFFFFF',
      /** Use full screen for splash (hides status bar) */
      splashFullScreen: true,
      /** Immersive mode (hides navigation bar on Android) */
      splashImmersive: true,
      /** Custom layout name for Android splash */
      layoutName: 'launch_screen',
      /** Use dialog instead of full-screen splash */
      useDialog: false,
    },

    // ── PushNotifications ───────────────────────────────────
    PushNotifications: {
      /** iOS presentation options when app is in foreground */
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // ── LocalNotifications ──────────────────────────────────
    LocalNotifications: {
      /** Small icon for local notification */
      smallIcon: 'ic_stat_icon_config_sample',
      /** Icon tint color (golden theme) */
      iconColor: '#D4AF37',
      /** Default notification sound */
      sound: 'beep.wav',
    },

    // ── StatusBar ───────────────────────────────────────────
    StatusBar: {
      /** Light status bar icons (for dark/gold background) */
      style: 'LIGHT',
      /** Status bar background (golden KhmerCareer theme) */
      backgroundColor: '#D4AF37',
      /** Do not allow WebView to overlay status bar */
      overlaysWebView: false,
    },

    // ── Keyboard ────────────────────────────────────────────
    Keyboard: {
      /** Resize the WebView when keyboard appears */
      resize: 'body',
      /** Light keyboard theme */
      style: 'light',
      /** Show form accessory bar (previous/next/done) */
      hideFormAccessoryBar: false,
    },

    // ── App ─────────────────────────────────────────────────
    App: {
      /** Custom URL scheme for iOS deep linking */
      iosScheme: 'khmercareer',
      /** Android uses HTTPS scheme for deep links */
      androidScheme: 'https',
    },

    // ── Browser ─────────────────────────────────────────────
    Browser: {
      /** Show toolbar when opening in-app browser */
      toolbarColor: '#D4AF37',
      /** Show URL in browser */
      showUrl: true,
      /** Show forward/back navigation buttons */
      showNavigationButtons: true,
    },

    // ── Camera ──────────────────────────────────────────────
    Camera: {
      /** Allow editing after capture */
      allowEditing: false,
      /** Save photos to device gallery */
      saveToGallery: true,
      /** Photo source: PROMPT = ask user (camera/gallery) */
      source: 'PROMPT',
      /** Photo quality (0-100) */
      quality: 90,
      /** Correct photo orientation from EXIF */
      correctOrientation: true,
    },

    // ── Geolocation ─────────────────────────────────────────
    Geolocation: {
      /** Geolocation timeout in milliseconds */
      timeout: 10000,
      /** Maximum cached position age in ms */
      maximumAge: 60000,
      /** Request high-accuracy position (uses GPS) */
      enableHighAccuracy: true,
    },

    // ── Share ───────────────────────────────────────────────
    Share: {
      /** Default title for share dialog */
      dialogTitle: 'Share via Khmer Career Express',
    },
  },

  // ── Cordova Compatibility ─────────────────────────────────
  /**
   * Cordova plugin compatibility layer.
   * Only needed if using Cordova plugins via @awesome-cordova-plugins.
   */
  cordova: {},
};

export default config;
