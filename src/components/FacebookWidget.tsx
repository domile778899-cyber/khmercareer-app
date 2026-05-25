/**
 * FacebookWidget.tsx
 * Facebook integration component with share, page follow, and Messenger contact buttons.
 * Uses Facebook Share Dialog and direct links (no SDK required).
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Facebook, ThumbsUp, MessageCircle, Share2, ExternalLink } from 'lucide-react'

interface FacebookWidgetProps {
  shareUrl?: string
  shareQuote?: string
  pageUrl?: string
  pageName?: string
  messengerLink?: string
  variant?: 'share' | 'follow' | 'messenger' | 'combined'
  className?: string
}

const DEFAULT_PAGE_URL = 'https://www.facebook.com/khmercareer'
const DEFAULT_MESSENGER = 'https://m.me/khmercareer'

export default function FacebookWidget({
  shareUrl = typeof window !== 'undefined' ? window.location.href : '',
  shareQuote = 'Check this out on KhmerCareer!',
  pageUrl = DEFAULT_PAGE_URL,
  pageName = 'KhmerCareer',
  messengerLink = DEFAULT_MESSENGER,
  variant = 'combined',
  className = '',
}: FacebookWidgetProps) {
  const { t } = useTranslation()

  /* ── open Facebook share dialog ── */
  const handleShare = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareQuote)}`
    window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer')
  }, [shareUrl, shareQuote])

  /* ── open Facebook page ── */
  const handleFollow = useCallback(() => {
    window.open(pageUrl, '_blank', 'noopener,noreferrer')
  }, [pageUrl])

  /* ── open Messenger ── */
  const handleMessenger = useCallback(() => {
    window.open(messengerLink, '_blank', 'noopener,noreferrer')
  }, [messengerLink])

  /* ── share only ── */
  if (variant === 'share') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-medium transition-colors ${className}`}
      >
        <Facebook className="w-4 h-4" />
        {t('facebook.share', 'Share on Facebook')}
      </motion.button>
    )
  }

  /* ── follow page only ── */
  if (variant === 'follow') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFollow}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium transition-colors shadow-lg shadow-[#1877F2]/20 ${className}`}
      >
        <ThumbsUp className="w-4 h-4" />
        {t('facebook.follow', 'Follow Page')}
        <ExternalLink className="w-3.5 h-3.5 ml-1" />
      </motion.button>
    )
  }

  /* ── messenger only ── */
  if (variant === 'messenger') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMessenger}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00B2FF] hover:bg-[#009ee0] text-white font-medium transition-colors shadow-lg shadow-[#00B2FF]/20 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        {t('facebook.messenger', 'Message Us')}
      </motion.button>
    )
  }

  /* ── combined (default) ── */
  return (
    <div className={`bg-white rounded-2xl border border-sand p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 flex items-center justify-center">
          <Facebook className="w-5 h-5 text-[#1877F2]" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal text-sm">
            {t('facebook.title', 'Facebook')}
          </h3>
          <p className="text-xs text-warm-gray">
            {t('facebook.subtitle', 'Connect with us')}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Share button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-medium text-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {t('facebook.share', 'Share on Facebook')}
        </motion.button>

        {/* Follow page button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFollow}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-sm transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          {t('facebook.follow', 'Follow Page')}
          <span className="text-xs opacity-80">({pageName})</span>
        </motion.button>

        {/* Messenger button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMessenger}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00B2FF] hover:bg-[#009ee0] text-white font-medium text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {t('facebook.messenger', 'Message via Messenger')}
        </motion.button>
      </div>
    </div>
  )
}

/* ── Inline Facebook share row ── */
export function FacebookShareRow({
  url,
  quote,
  className = '',
}: {
  url?: string
  quote?: string
  className?: string
}) {
  const { t } = useTranslation()

  const handleShare = useCallback(() => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const shareQuote = quote || ''
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareQuote)}`,
      '_blank',
      'width=600,height=500,noopener,noreferrer'
    )
  }, [url, quote])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors ${className}`}
    >
      <Facebook className="w-3 h-3" />
      {t('facebook.shareShort', 'Facebook')}
    </motion.button>
  )
}

/* ── Facebook comments hint (placeholder for future SDK integration) ── */
export function FacebookCommentsHint({
  className = '',
}: {
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div className={`text-xs text-warm-gray bg-cream rounded-lg px-3 py-2 ${className}`}>
      <p className="flex items-center gap-1.5">
        <Facebook className="w-3 h-3" />
        {t('facebook.commentsHint', 'Facebook comments coming soon')}
      </p>
    </div>
  )
}
