/**
 * TelegramWidget.tsx
 * Telegram integration component with share button and channel join CTA.
 * Opens Telegram share dialog / channel link in new tab.
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Send, Users, ExternalLink, MessageSquare } from 'lucide-react'

interface TelegramWidgetProps {
  shareUrl?: string
  shareText?: string
  channelUrl?: string
  channelName?: string
  variant?: 'share' | 'join' | 'combined'
  className?: string
}

const DEFAULT_CHANNEL = 'https://t.me/khmercareer'

export default function TelegramWidget({
  shareUrl = typeof window !== 'undefined' ? window.location.href : '',
  shareText = 'Check this out!',
  channelUrl = DEFAULT_CHANNEL,
  channelName = 'KhmerCareer Official',
  variant = 'combined',
  className = '',
}: TelegramWidgetProps) {
  const { t } = useTranslation()

  /* ── open Telegram share ── */
  const handleShare = useCallback(() => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer')
  }, [shareUrl, shareText])

  /* ── open Telegram channel ── */
  const handleJoinChannel = useCallback(() => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer')
  }, [channelUrl])

  /* ── open Telegram bot ── */
  const handleOpenBot = useCallback(() => {
    window.open('https://t.me/KhmerCareerBot', '_blank', 'noopener,noreferrer')
  }, [])

  /* ── share only ── */
  if (variant === 'share') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088CC]/10 hover:bg-[#0088CC]/20 text-[#0088CC] font-medium transition-colors ${className}`}
      >
        <Send className="w-4 h-4" />
        {t('telegram.share', 'Share on Telegram')}
      </motion.button>
    )
  }

  /* ── join channel only ── */
  if (variant === 'join') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleJoinChannel}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077B3] text-white font-medium transition-colors shadow-lg shadow-[#0088CC]/20 ${className}`}
      >
        <Users className="w-4 h-4" />
        {t('telegram.joinChannel', 'Join Channel')}
        <ExternalLink className="w-3.5 h-3.5 ml-1" />
      </motion.button>
    )
  }

  /* ── combined (default) ── */
  return (
    <div className={`bg-white rounded-2xl border border-sand p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0088CC]/10 flex items-center justify-center">
          <Send className="w-5 h-5 text-[#0088CC]" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal text-sm">
            {t('telegram.title', 'Telegram')}
          </h3>
          <p className="text-xs text-warm-gray">
            {t('telegram.subtitle', 'Join our community')}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Share button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088CC]/10 hover:bg-[#0088CC]/20 text-[#0088CC] font-medium text-sm transition-colors"
        >
          <Send className="w-4 h-4" />
          {t('telegram.share', 'Share on Telegram')}
        </motion.button>

        {/* Join channel button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJoinChannel}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077B3] text-white font-medium text-sm transition-colors"
        >
          <Users className="w-4 h-4" />
          {t('telegram.joinChannel', 'Join Channel')}
          <span className="text-xs opacity-80">({channelName})</span>
        </motion.button>

        {/* Bot button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenBot}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cream hover:bg-sand text-charcoal font-medium text-sm transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {t('telegram.chatBot', 'Chat with Bot')}
        </motion.button>
      </div>
    </div>
  )
}

/* ── Inline Telegram share row ── */
export function TelegramShareRow({
  url,
  text,
  className = '',
}: {
  url?: string
  text?: string
  className?: string
}) {
  const { t } = useTranslation()
  const handleShare = useCallback(() => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const shareText = text || ''
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank',
      'width=600,height=500,noopener,noreferrer'
    )
  }, [url, text])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0088CC]/10 text-[#0088CC] hover:bg-[#0088CC]/20 transition-colors ${className}`}
    >
      <Send className="w-3 h-3" />
      {t('telegram.shareShort', 'Telegram')}
    </motion.button>
  )
}
