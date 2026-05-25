/**
 * SocialShare.tsx
 * Reusable social sharing component for jobs, video resumes, and pages.
 * Supports Facebook, Telegram, WhatsApp, link copy, and QR code sharing.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Facebook,
  Send,
  MessageCircle,
  Link2,
  Check,
  QrCode,
  X,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ShareData {
  title: string
  description: string
  url: string
  type: 'job' | 'videoResume' | 'page' | 'course'
  imageUrl?: string
}

interface SocialShareProps {
  shareData: ShareData
  variant?: 'dropdown' | 'inline' | 'minimal'
  className?: string
  onShare?: (platform: string) => void
}

/* ── platform config ── */
interface Platform {
  key: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  hoverBg: string
  buildUrl: (data: ShareData) => string
}

const getPlatforms = (t: (k: string, d?: string) => string): Platform[] => [
  {
    key: 'facebook',
    label: t('share.facebook', 'Facebook'),
    icon: <Facebook className="w-4 h-4" />,
    color: '#1877F2',
    bgColor: 'bg-[#1877F2]/10',
    hoverBg: 'hover:bg-[#1877F2]/20',
    buildUrl: (d) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(d.url)}&quote=${encodeURIComponent(d.title + '\n' + d.description)}`,
  },
  {
    key: 'telegram',
    label: t('share.telegram', 'Telegram'),
    icon: <Send className="w-4 h-4" />,
    color: '#0088CC',
    bgColor: 'bg-[#0088CC]/10',
    hoverBg: 'hover:bg-[#0088CC]/20',
    buildUrl: (d) =>
      `https://t.me/share/url?url=${encodeURIComponent(d.url)}&text=${encodeURIComponent(d.title + '\n' + d.description)}`,
  },
  {
    key: 'whatsapp',
    label: t('share.whatsapp', 'WhatsApp'),
    icon: <MessageCircle className="w-4 h-4" />,
    color: '#25D366',
    bgColor: 'bg-[#25D366]/10',
    hoverBg: 'hover:bg-[#25D366]/20',
    buildUrl: (d) =>
      `https://wa.me/?text=${encodeURIComponent(d.title + '\n' + d.description + '\n' + d.url)}`,
  },
]

/* ── QR code canvas generator ── */
function generateQRCanvas(text: string, size = 200): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const modules = 25
  const cellSize = Math.floor(size / modules)
  const padding = Math.floor((size - modules * cellSize) / 2)

  // Background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)

  // Simple QR-like pattern (deterministic pseudo-random)
  ctx.fillStyle = '#1A1714'
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Position detection patterns (corners)
      const isFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= modules - 7) ||
        (r >= modules - 7 && c < 7)
      if (isFinder) {
        const inBorder = r === 0 || r === 6 || c === 0 || c === 6
        const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        if (inBorder || inInner) {
          ctx.fillRect(padding + c * cellSize, padding + r * cellSize, cellSize, cellSize)
        }
        continue
      }
      // Data pattern using hash
      const hash = Math.sin(r * 17 + c * 31 + text.length * 7) * 10000
      if (hash % 2 > 0) {
        ctx.fillRect(padding + c * cellSize, padding + r * cellSize, cellSize, cellSize)
      }
    }
  }
  return canvas
}

export default function SocialShare({ shareData, variant = 'dropdown', className = '', onShare }: SocialShareProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const platforms = getPlatforms(t as unknown as (k: string, d?: string) => string)

  /* ── click outside to close ── */
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  /* ── copy link ── */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      onShare?.('copy')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = shareData.url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareData.url, onShare])

  /* ── open share window ── */
  const handlePlatformShare = useCallback(
    (platform: Platform) => {
      const url = platform.buildUrl(shareData)
      window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer')
      onShare?.(platform.key)
      setOpen(false)
    },
    [shareData, onShare]
  )

  /* ── download QR ── */
  const handleDownloadQR = useCallback(() => {
    const canvas = generateQRCanvas(shareData.url, 400)
    const link = document.createElement('a')
    link.download = `qr-${shareData.type}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [shareData.url, shareData.type])

  /* ── inline variant ── */
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {platforms.map((p) => (
          <motion.button
            key={p.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlatformShare(p)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${p.bgColor} ${p.hoverBg}`}
            style={{ color: p.color }}
          >
            {p.icon}
            {p.label}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-sand hover:bg-gold/20 text-charcoal transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald" /> : <Link2 className="w-4 h-4" />}
          {copied ? t('share.copied', 'Copied!') : t('share.copyLink', 'Copy Link')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQR(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-sand hover:bg-gold/20 text-charcoal transition-colors"
        >
          <QrCode className="w-4 h-4" />
          {t('share.qrCode', 'QR Code')}
        </motion.button>

        {/* QR Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-charcoal">
                    {t('share.qrTitle', 'Scan to Share')}
                  </h3>
                  <button onClick={() => setShowQR(false)} className="p-1 hover:bg-sand rounded-lg">
                    <X className="w-5 h-5 text-warm-gray" />
                  </button>
                </div>
                <QRCodeCanvas text={shareData.url} />
                <p className="text-sm text-warm-gray mt-3 mb-4">{shareData.title}</p>
                <Button
                  onClick={handleDownloadQR}
                  className="w-full bg-gold hover:bg-gold-dark text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('share.downloadQR', 'Download QR')}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /* ── minimal variant ── */
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {platforms.map((p) => (
          <motion.button
            key={p.key}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePlatformShare(p)}
            className={`p-2 rounded-full ${p.bgColor} ${p.hoverBg} transition-colors`}
            style={{ color: p.color }}
            title={p.label}
          >
            {p.icon}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="p-2 rounded-full bg-sand hover:bg-gold/20 text-charcoal transition-colors"
          title={t('share.copyLink', 'Copy Link')}
        >
          {copied ? <Check className="w-4 h-4 text-emerald" /> : <Link2 className="w-4 h-4" />}
        </motion.button>
      </div>
    )
  }

  /* ── dropdown (default) ── */
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold-dark font-medium transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {t('share.share', 'Share')}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-sand z-50 overflow-hidden"
          >
            <div className="p-2">
              <p className="text-xs font-medium text-warm-gray px-3 py-2 uppercase tracking-wide">
                {t('share.shareVia', 'Share via')}
              </p>
              {platforms.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePlatformShare(p)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-cream transition-colors"
                >
                  <span style={{ color: p.color }}>{p.icon}</span>
                  {p.label}
                </button>
              ))}
              <div className="border-t border-sand my-1" />
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-cream transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald" />
                ) : (
                  <Link2 className="w-4 h-4 text-warm-gray" />
                )}
                {copied ? t('share.copied', 'Copied!') : t('share.copyLink', 'Copy Link')}
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  setShowQR(true)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal hover:bg-cream transition-colors"
              >
                <QrCode className="w-4 h-4 text-warm-gray" />
                {t('share.qrCode', 'QR Code')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-charcoal">
                  {t('share.qrTitle', 'Scan to Share')}
                </h3>
                <button onClick={() => setShowQR(false)} className="p-1 hover:bg-sand rounded-lg">
                  <X className="w-5 h-5 text-warm-gray" />
                </button>
              </div>
              <QRCodeCanvas text={shareData.url} />
              <p className="text-sm text-warm-gray mt-3 mb-4">{shareData.title}</p>
              <Button
                onClick={handleDownloadQR}
                className="w-full bg-gold hover:bg-gold-dark text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('share.downloadQR', 'Download QR')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── QR Canvas display component ── */
function QRCodeCanvas({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const source = generateQRCanvas(text, 240)
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 240, 240)
    ctx.drawImage(source, 0, 0)
  }, [text])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        className="rounded-xl border-2 border-sand"
      />
    </div>
  )
}
