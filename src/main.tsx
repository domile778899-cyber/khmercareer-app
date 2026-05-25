import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './i18n'
import './index.css'
import { initPWA } from './utils/pwa'
import { seedDatabase } from './api/db'
import App from './App.tsx'
import { SEOProvider } from './components/SEOProvider'

// Initialize PWA features (Service Worker, install prompt, network listeners)
initPWA()

// Seed localStorage database with initial data if empty
seedDatabase()

// Initialize Google Auth for native platforms
// Note: Replace YOUR_WEB_CLIENT_ID with your actual Google OAuth Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
//
// For Web platform, Google Auth is initialized lazily in the component.
// For Android/iOS, uncomment the following after adding platform:
//
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
// GoogleAuth.initialize({
//   clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
//   scopes: ['profile', 'email'],
//   grantOfflineAccess: true,
// })

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <SEOProvider>
        <App />
      </SEOProvider>
    </HashRouter>
  </React.StrictMode>,
)
