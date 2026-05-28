# KhmerCareer Mobile App Guide

Complete guide for building and deploying the KhmerCareer mobile app using Capacitor.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Configuration](#configuration)
5. [Android Build](#android-build)
6. [iOS Build](#ios-build)
7. [Plugin Integration](#plugin-integration)
8. [Push Notifications](#push-notifications)
9. [App Store Submission](#app-store-submission)
10. [Troubleshooting](#troubleshooting)

---

## Overview

KhmerCareer uses Capacitor to wrap the React web application into native mobile apps for iOS and Android. This provides:

- Single codebase for web and mobile
- Native device API access
- App store distribution
- Push notifications
- Native performance

### Supported Platforms

| Platform | Minimum Version | Status |
|----------|----------------|--------|
| iOS | 15.0 | Production Ready |
| Android | API 26 (8.0) | Production Ready |

---

## Prerequisites

### macOS (for iOS)

```bash
# Install Xcode from Mac App Store
# Install Xcode command line tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Verify
xcodebuild -version
cocoapods --version
```

### Android

```bash
# Install Android Studio
# Install SDK Platform Tools (API 34)
# Set environment variables

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### Common

```bash
# Node.js 22+
node --version  # v22.x.x

# Install Capacitor CLI
npm install -g @capacitor/cli
```

---

## Project Setup

### Install Dependencies

```bash
# Install Capacitor core and platforms
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Install plugins
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/push-notifications
npm install @capacitor/share
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
```

### Initialize Capacitor

```bash
# Initialize Capacitor (creates capacitor.config.ts)
npx cap init KhmerCareer com.khmercareer.app --web-dir dist
```

### Capacitor Configuration

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.khmercareer.app',
  appName: 'KhmerCareer',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  server: {
    // Development - use live reload
    url: process.env.NODE_ENV === 'development' 
      ? 'http://YOUR_IP:5173' 
      : undefined,
    cleartext: process.env.NODE_ENV === 'development',
    
    // Production - use bundled files
    androidScheme: 'https',
    iosScheme: 'https',
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#D4A574',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
      spinnerStyle: 'large',
    },
    
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#D4A574',
    },
    
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
    },
  },
  
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystoreAlias: 'khmercareer',
    },
  },
};

export default config;
```

---

## Configuration

### Add Platforms

```bash
# Add Android platform
npx cap add android

# Add iOS platform
npx cap add ios

# Sync web code to native projects
npm run build
npx cap sync
```

### Icons and Splash Screens

```bash
# Generate icons and splash screens
# Place source files in resources/
# Source icon: resources/icon.png (1024x1024)
# Source splash: resources/splash.png (2732x2732)

# Generate for all platforms
npx capacitor-assets generate --android --ios

# Or use specific tool
npm install -g cordova-res
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

### Required Assets

| Asset | Size | Format | Location |
|-------|------|--------|----------|
| App Icon | 1024x1024 | PNG | `resources/icon.png` |
| Splash Screen | 2732x2732 | PNG | `resources/splash.png` |
| Android Adaptive | 432x432 | PNG/Vector | `android/app/src/main/res/...` |

---

## Android Build

### Development Build

```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Build debug APK
# In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### Release Build

```bash
# 1. Build production web assets
npm run build

# 2. Sync
npx cap sync android

# 3. Create signing keystore (first time only)
keytool -genkey -v -keystore release.keystore -alias khmercareer \
    -keyalg RSA -keysize 2048 -validity 10000

# 4. Create signing.properties
cat > android/signing.properties << EOF
STORE_FILE=../release.keystore
STORE_PASSWORD=your_password
KEY_ALIAS=khmercareer
KEY_PASSWORD=your_password
EOF

# 5. Build release APK
cd android
./gradlew assembleRelease

# Or build AAB for Play Store
./gradlew bundleRelease
```

### Output Files

```
android/app/build/outputs/
├── apk/
│   └── release/
│       └── app-release.apk          # Signed APK
└── bundle/
    └── release/
        └── app-release.aab          # Play Store bundle
```

### Development with Live Reload

```bash
# 1. Start dev server on your IP
npm run dev -- --host 0.0.0.0

# 2. Update capacitor.config.ts
# server: { url: 'http://YOUR_IP:5173', cleartext: true }

# 3. Sync and run
npx cap sync android
npx cap run android
```

---

## iOS Build

### Development Build

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. In Xcode:
# - Select target device/simulator
# - Press Cmd+R to build and run
```

### Release Build

```bash
# 1. Build production web assets
npm run build

# 2. Sync
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. In Xcode:
# - Select "Any iOS Device" as target
# - Product > Archive
# - Distribute App > App Store Connect
```

### Xcode Configuration

Required settings in Xcode:

1. **Signing & Capabilities**
   - Select your development team
   - Enable required capabilities

2. **Info.plist** updates:
```xml
<!-- Camera permission -->
<key>NSCameraUsageDescription</key>
<string>KhmerCareer needs camera access for video interviews</string>

<!-- Photo library permission -->
<key>NSPhotoLibraryUsageDescription</key>
<string>KhmerCareer needs photo access for profile pictures</string>

<!-- Location permission -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>KhmerCareer uses location for job search</string>

<!-- Microphone permission -->
<key>NSMicrophoneUsageDescription</key>
<string>KhmerCareer needs microphone for video calls</string>
```

---

## Plugin Integration

### Camera Plugin

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

async function takeProfilePhoto() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Base64,
    source: CameraSource.Prompt,
  });

  return image.base64String;
}
```

### Geolocation Plugin

```typescript
import { Geolocation } from '@capacitor/geolocation';

async function getCurrentLocation() {
  const permission = await Geolocation.requestPermissions();
  
  if (permission.location === 'granted') {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  }
}
```

### Share Plugin

```typescript
import { Share } from '@capacitor/share';

async function shareJob(job: Job) {
  await Share.share({
    title: job.title,
    text: `Check out this job: ${job.title} at ${job.company}`,
    url: `https://khmercareer.com/jobs/${job.id}`,
    dialogTitle: 'Share Job',
  });
}
```

### Status Bar Plugin

```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

async function configureStatusBar() {
  await StatusBar.setStyle({ style: Style.Light });
  await StatusBar.setBackgroundColor({ color: '#D4A574' });
  await StatusBar.show();
}
```

---

## Push Notifications

### Firebase Configuration (Android)

```bash
# 1. Create Firebase project
# 2. Add Android app (package: com.khmercareer.app)
# 3. Download google-services.json
# 4. Place in android/app/

# 5. Update build.gradle (project level)
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}

# 6. Update build.gradle (app level)
apply plugin: 'com.google.gms.google-services'
```

### APNS Configuration (iOS)

```bash
# 1. Create APNS key in Apple Developer Portal
# 2. Upload to Firebase Cloud Messaging
# 3. Enable Push Notifications capability in Xcode
# 4. Enable Background Modes > Remote Notifications in Xcode
```

### Implementation

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

class NotificationService {
  async initialize() {
    // Request permission
    const result = await PushNotifications.requestPermissions();
    
    if (result.receive === 'granted') {
      // Register with FCM/APNS
      await PushNotifications.register();
      
      // Listen for registration token
      PushNotifications.addListener('registration', (token) => {
        console.log('Push token:', token.value);
        // Send token to your server
        this.sendTokenToServer(token.value);
      });
      
      // Listen for incoming notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
        this.handleNotification(notification);
      });
      
      // Listen for notification tap
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Notification tapped:', action);
        this.handleNotificationTap(action.notification);
      });
    }
  }
  
  private async sendTokenToServer(token: string) {
    await api.post('/users/push-token', { token });
  }
  
  private handleNotification(notification: PushNotificationSchema) {
    // Show in-app notification
    toast.info(notification.title, {
      description: notification.body,
    });
  }
  
  private handleNotificationTap(notification: PushNotificationSchema) {
    const { jobId, type } = notification.data || {};
    
    if (type === 'job_application' && jobId) {
      navigate(`/jobs/${jobId}`);
    }
  }
}
```

---

## App Store Submission

### Google Play Store

```bash
# 1. Build AAB
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease

# 2. Create Google Play Developer account ($25 one-time)
# 3. Create new app in Play Console
# 4. Upload AAB to Play Console
# 5. Fill store listing
# 6. Set up pricing and distribution
# 7. Submit for review
```

**Required Assets:**
- Short description (80 chars max)
- Full description (4000 chars max)
- Screenshots (phone: 1080x1920, tablet: 2732x2048)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy policy URL
- Content rating questionnaire

### Apple App Store

```bash
# 1. Archive in Xcode
npx cap sync ios
npx cap open ios
# Product > Archive

# 2. Upload via Xcode Organizer
# Window > Organizer > Distribute App

# Or use Transporter app for .ipa
```

**Required Assets:**
- App name (30 chars max)
- Subtitle (30 chars max)
- Description (4000 chars max)
- Keywords (100 chars max)
- Screenshots (6.5", 5.5", iPad)
- App Preview video (optional)
- Privacy policy URL
- Support URL
- App icon (1024x1024)

### App Store Screenshots

| Device | Size | Quantity |
|--------|------|----------|
| iPhone 6.5" | 1284x2778 | 3-5 |
| iPhone 5.5" | 1242x2208 | 3-5 |
| iPad Pro 12.9" | 2048x2732 | 3-5 |
| Android Phone | 1080x1920 | 3-5 |
| Android Tablet | 2732x2048 | 3-5 |

---

## Troubleshooting

### Common Issues

#### Capacitor Sync Fails

```bash
# Clean and reinstall
rm -rf node_modules android ios
npm install
npx cap add android
npx cap add ios
npx cap sync
```

#### Android Build Fails

```bash
# Clean build
cd android && ./gradlew clean

# Update dependencies
cd android && ./gradlew dependencies

# Check for conflicting dependencies
cd android && ./gradlew app:dependencies --configuration implementation
```

#### iOS Build Fails

```bash
# Clean build
# In Xcode: Product > Clean Build Folder (Cmd+Shift+K)

# Update pods
cd ios && pod install --repo-update

# Reset simulator
xcrun simctl erase all
```

#### White Screen on App Launch

```bash
# Check web assets are built
npm run build
ls dist/

# Check capacitor.config.ts webDir
# Should match Vite output directory

# Check console logs
# Android: adb logcat | grep "Capacitor"
# iOS: Check Xcode console
```

#### CORS Issues in Dev

```bash
# Use capacitor.config.ts with local server URL
server: {
  url: 'http://192.168.1.100:5173',
  cleartext: true,
}
```

### Platform-Specific Debugging

**Android:**
```bash
# View logs
adb logcat | grep "KhmerCareer"

# Chrome DevTools
chrome://inspect/#devices

# Run on device
npx cap run android --target <device_id>
```

**iOS:**
```bash
# Safari DevTools
# Safari > Preferences > Advanced > Show Develop menu
# Develop > <Device> > khmercareer.com

# Console logs in Xcode
# View > Debug Area > Activate Console
```

### Performance Tips

1. **Optimize images** before adding to resources/
2. **Lazy load routes** to reduce initial bundle size
3. **Use virtual scrolling** for long lists
4. **Enable ProGuard** for Android release builds
5. **Use WKWebView** configuration for iOS
6. **Minimize HTTP requests** by bundling assets

### Security Checklist

- [ ] HTTPS only for API calls
- [ ] ProGuard/R8 enabled for Android
- [ ] SSL pinning configured
- [ ] Sensitive data stored in Keychain/Keystore
- [ ] deeplink validation
- [ ] Input validation on native bridges
