import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import './index.css'
import { initPWA } from './utils/pwa'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

/**
 * Schedules PWA initialization after the first React render.
 *
 * This prevents service worker registration or storage-related runtime failures
 * from blocking the initial application mount on production domains.
 */
const schedulePWAInitialization = (): void => {
  const initialize = (): void => {
    try {
      initPWA()
    } catch (error: unknown) {
      console.error('[PWA] Initialization failed after React mount:', error)
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initialize, { timeout: 3000 })
    return
  }

  window.setTimeout(initialize, 0)
}

schedulePWAInitialization()
