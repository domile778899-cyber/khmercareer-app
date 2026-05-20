import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './i18n'
import './index.css'
import { initPWA } from './utils/pwa'
import App from './App.tsx'

// Initialize PWA features (Service Worker, install prompt, network listeners)
initPWA()

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
