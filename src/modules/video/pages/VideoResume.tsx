/**
 * VideoResume.tsx
 * Video resume management page with hero, recording, upload, preview, listing,
 * privacy settings, and sharing via SocialShare component.
 * Uses localStorage + IndexedDB for persistence.
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Camera,
  Upload,
  Trash2,
  Play,
  Lock,
  Globe,
  Building2,
  Eye,
  Clock,
  AlertCircle,
  ChevronRight,
  X,
  Share2,
  Plus,
  FileVideo,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import usePageSEO from '@/hooks/usePageSEO'
import SocialShare from '@/components/SocialShare'
import type { ShareData } from '@/components/SocialShare'
import { logger } from '@/shared/logger'

/* ── Types ── */
interface VideoResume {
  id: string
  title: string
  videoUrl: string
  blobType: string
  blobSize: number
  duration: number
  createdAt: string
  privacy: 'public' | 'employers' | 'private'
  thumbnail: string
}

type PrivacyLevel = 'public' | 'employers' | 'private'

/* ── Privacy config ── */
const privacyConfig: Record<PrivacyLevel, { label: string; icon: React.ReactNode; desc: string; color: string }> = {
  public: {
    label: 'videoResume.privacy.public',
    icon: <Globe className="w-4 h-4" />,
    desc: 'videoResume.privacy.publicDesc',
    color: 'text-emerald',
  },
  employers: {
    label: 'videoResume.privacy.employers',
    icon: <Building2 className="w-4 h-4" />,
    desc: 'videoResume.privacy.employersDesc',
    color: 'text-gold-dark',
  },
  private: {
    label: 'videoResume.privacy.private',
    icon: <Lock className="w-4 h-4" />,
    desc: 'videoResume.privacy.privateDesc',
    color: 'text-warm-gray',
  },
}

export default function VideoResume() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  // usePageSEO
  // SEO disabled for build

  const [videos, setVideos] = useState<VideoResume[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [shareTarget, setShareTarget] = useState<VideoResume | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPrivacyTip, setShowPrivacyTip] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── load from localStorage ── */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('videoResumes') || '[]')
      // Filter out stale blob URLs (they become invalid after page refresh)
      const valid = stored.filter((v: VideoResume) => {
        try {
          // Blob URLs starting with blob: are valid for current session
          return v.videoUrl.startsWith('blob:')
        } catch {
          return false
        }
      })
      setVideos(valid)
      // Attempt to restore blobs from IndexedDB
      restoreBlobsFromIndexedDB(valid)
    } catch {
      setVideos([])
    }
  }, [])

  /* ── show success toast ── */
  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true)
      const t = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(t)
    }
  }, [location.state])

  /* ── show privacy tip on first visit ── */
  useEffect(() => {
    try {
      if (!localStorage.getItem('videoResumePrivacyTip')) {
        setShowPrivacyTip(true)
        localStorage.setItem('videoResumePrivacyTip', '1')
      }
    } catch (err) {
      logger.error('Privacy tip check failed', { error: err, component: 'VideoResume' })
    }
  }, [])

  /* ── go to record page ── */
  const handleRecord = useCallback(() => {
    navigate('/video-resume/record')
  }, [navigate])

  /* ── trigger file upload ── */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /* ── process uploaded file ── */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
      if (!validTypes.includes(file.type)) {
        alert(t('videoResume.upload.invalidType', 'Please upload MP4, MOV, or WebM video files only.'))
        return
      }

      // Validate size (50MB max)
      const MAX_SIZE = 50 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        alert(t('videoResume.upload.tooLarge', 'File size must be under 50MB.'))
        return
      }

      setUploading(true)

      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: file.type })
        const url = URL.createObjectURL(blob)

        // Get video duration
        const tempVideo = document.createElement('video')
        tempVideo.preload = 'metadata'
        tempVideo.onloadedmetadata = () => {
          const duration = Math.round(tempVideo.duration)

          const record: VideoResume = {
            id: `vr_${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            videoUrl: url,
            blobType: blob.type,
            blobSize: blob.size,
            duration,
            createdAt: new Date().toISOString(),
            privacy: 'public',
            thumbnail: '',
          }

          setVideos((prev) => [record, ...prev])
          try {
            localStorage.setItem('videoResumes', JSON.stringify([record, ...videos]))
          } catch (err) {
            logger.error('Save uploaded video failed', { error: err, component: 'VideoResume' })
          }
          saveBlobToIndexedDB(record.id, blob)
          setUploading(false)

          // Clear input
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
        tempVideo.src = url
      }
      reader.onerror = () => {
        setUploading(false)
        alert(t('videoResume.upload.readError', 'Failed to read video file.'))
      }
      reader.readAsArrayBuffer(file)
    },
    [t, videos]
  )

  /* ── delete video ── */
  const handleDelete = useCallback(
    (id: string) => {
      const video = videos.find((v) => v.id === id)
      if (video) {
        URL.revokeObjectURL(video.videoUrl)
      }
      const updated = videos.filter((v) => v.id !== id)
      setVideos(updated)
      try {
        localStorage.setItem('videoResumes', JSON.stringify(updated))
      } catch (err) {
        logger.error('Delete video from storage failed', { error: err, component: 'VideoResume' })
      }
      setDeleteId(null)
      // Also remove from IndexedDB
      deleteBlobFromIndexedDB(id).catch(() => {})
    },
    [videos]
  )

  /* ── change privacy ── */
  const handlePrivacyChange = useCallback(
    (id: string, privacy: PrivacyLevel) => {
      const updated = videos.map((v) => (v.id === id ? { ...v, privacy } : v))
      setVideos(updated)
      try {
        localStorage.setItem('videoResumes', JSON.stringify(updated))
      } catch (err) {
        logger.error('Update video privacy failed', { error: err, component: 'VideoResume' })
      }
    },
    [videos]
  )

  /* ── format duration ── */
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  /* ── format date ── */
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  /* ── get share data for a video ── */
  const getShareData = (video: VideoResume): ShareData => ({
    title: video.title,
    description: t('videoResume.share.description', 'Check out my video resume on KhmerCareer!'),
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/video-resume`,
    type: 'videoResume',
  })

  /* ── format file size ── */
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ── Hero Section ── */}
      <section className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D4AF37 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gold/10">
                <Video className="w-5 h-5 text-gold" />
              </div>
              <span className="text-gold-light text-sm font-medium tracking-wide uppercase">
                {t('videoResume.hero.badge', 'Stand Out')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              {t('videoResume.hero.title', 'Video Resume')}
            </h1>

            <p className="text-white/70 text-base md:text-lg mb-6 leading-relaxed max-w-xl">
              {t(
                'videoResume.hero.subtitle',
                'Introduce yourself to employers with a 60-second video. In Cambodia\'s TikTok culture, video resumes help you stand out and get hired faster.'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRecord}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold shadow-lg shadow-gold/20 transition-colors"
              >
                <Camera className="w-5 h-5" />
                {t('videoResume.hero.recordBtn', 'Record Video')}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                {uploading
                  ? t('videoResume.hero.uploading', 'Uploading...')
                  : t('videoResume.hero.uploadBtn', 'Upload Video')}
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                <span>{t('videoResume.hero.maxDuration', 'Max 60 seconds')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Shield className="w-4 h-4" />
                <span>{t('videoResume.hero.privacyControl', 'Privacy controlled')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Eye className="w-4 h-4" />
                <span>{t('videoResume.hero.employerViews', 'Track views')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Hidden file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald text-white shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{t('videoResume.saveSuccess', 'Video saved successfully!')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Privacy Tip Banner ── */}
        <AnimatePresence>
          {showPrivacyTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-charcoal">
                    {t(
                      'videoResume.privacyTip',
                      'Tip: Set your video resume to "Employers Only" to share only with verified employers while keeping it private from the public.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowPrivacyTip(false)}
                  className="p-1 hover:bg-gold/10 rounded-lg shrink-0"
                >
                  <X className="w-4 h-4 text-warm-gray" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section: My Video Resumes ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-charcoal">
                {t('videoResume.myVideos.title', 'My Video Resumes')}
              </h2>
              <p className="text-warm-gray text-sm mt-1">
                {t('videoResume.myVideos.subtitle', 'Manage and share your video introductions')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-warm-gray">
                {videos.length} {t('videoResume.myVideos.count', 'videos')}
              </span>
            </div>
          </div>

          {/* Empty state */}
          {videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-sand p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
                <FileVideo className="w-8 h-8 text-warm-gray" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {t('videoResume.empty.title', 'No Video Resumes Yet')}
              </h3>
              <p className="text-warm-gray text-sm max-w-md mx-auto mb-6">
                {t(
                  'videoResume.empty.description',
                  'Create your first video resume to stand out to employers. Record up to 60 seconds introducing yourself.'
                )}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleRecord}
                  className="bg-gold hover:bg-gold-dark text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t('videoResume.empty.recordBtn', 'Record Now')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUploadClick}
                  className="border-sand hover:bg-cream"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('videoResume.empty.uploadBtn', 'Upload')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-sand overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Video thumbnail / player */}
                  <div className="relative aspect-video bg-charcoal group">
                    {playingId === video.id ? (
                      <video
                        src={video.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover opacity-70"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPlayingId(video.id)}
                            className="w-14 h-14 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center shadow-lg transition-colors"
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </motion.button>
                        </div>
                        {/* Duration badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-mono">
                          {formatDuration(video.duration)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-charcoal text-sm line-clamp-1 flex-1">
                        {video.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-warm-gray mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                      </span>
                      <span>{formatSize(video.blobSize)}</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>

                    {/* Privacy selector */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative group/privacy">
                        <button className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cream hover:bg-sand transition-colors ${privacyConfig[video.privacy].color}`}>
                          {privacyConfig[video.privacy].icon}
                          <span>{t(privacyConfig[video.privacy].label)}</span>
                        </button>
                        {/* Privacy dropdown */}
                        <div className="absolute bottom-full left-0 mb-1 w-48 bg-white rounded-xl shadow-xl border border-sand z-20 hidden group-hover/privacy:block">
                          {(Object.keys(privacyConfig) as PrivacyLevel[]).map((level) => (
                            <button
                              key={level}
                              onClick={() => handlePrivacyChange(video.id, level)}
                              className={`w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-cream transition-colors first:rounded-t-xl last:rounded-b-xl ${video.privacy === level ? 'bg-cream' : ''}`}
                            >
                              <span className={`mt-0.5 ${privacyConfig[level].color}`}>
                                {privacyConfig[level].icon}
                              </span>
                              <div>
                                <p className="text-xs font-medium text-charcoal">
                                  {t(privacyConfig[level].label)}
                                </p>
                                <p className="text-[10px] text-warm-gray">
                                  {t(privacyConfig[level].desc)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShareTarget(video)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold-dark text-xs font-medium transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        {t('videoResume.actions.share', 'Share')}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(video.id)}
                        className="p-2 rounded-lg bg-cream hover:bg-coral/10 text-warm-gray hover:text-coral transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add another button */}
          {videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex items-center justify-center"
            >
              <button
                onClick={handleRecord}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-sand hover:border-gold/40 text-warm-gray hover:text-gold-dark transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {t('videoResume.addAnother', 'Add Another Video Resume')}
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Section: Why Video Resume ── */}
        <div className="mt-12 bg-white rounded-2xl border border-sand p-6 md:p-8">
          <h2 className="text-xl font-display font-bold text-charcoal mb-6">
            {t('videoResume.why.title', 'Why Video Resume?')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-gold" />,
                title: t('videoResume.why.standOut.title', 'Stand Out'),
                desc: t('videoResume.why.standOut.desc', 'Differentiate yourself from hundreds of text-only applicants.'),
              },
              {
                icon: <Eye className="w-6 h-6 text-gold" />,
                title: t('videoResume.why.personality.title', 'Show Personality'),
                desc: t('videoResume.why.personality.desc', 'Let employers see your communication skills and confidence.'),
              },
              {
                icon: <Globe className="w-6 h-6 text-gold" />,
                title: t('videoResume.why.language.title', 'Language Skills'),
                desc: t('videoResume.why.language.desc', 'Demonstrate Khmer, English, or Chinese proficiency.'),
              },
              {
                icon: <Building2 className="w-6 h-6 text-gold" />,
                title: t('videoResume.why.employers.title', 'Employer Preferred'),
                desc: t('videoResume.why.employers.desc', 'Employers are 3x more likely to shortlist candidates with video.'),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-charcoal text-sm mb-1">{item.title}</h3>
                <p className="text-warm-gray text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section: Tips ── */}
        <div className="mt-8 bg-white rounded-2xl border border-sand p-6 md:p-8">
          <h2 className="text-xl font-display font-bold text-charcoal mb-4">
            {t('videoResume.tips.title', 'Recording Tips')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              t('videoResume.tips.tip1', 'Dress professionally as you would for an interview'),
              t('videoResume.tips.tip2', 'Find a quiet, well-lit location with a clean background'),
              t('videoResume.tips.tip3', 'Introduce yourself, mention your key skills, and state what job you seek'),
              t('videoResume.tips.tip4', 'Keep it concise — 30-60 seconds is the sweet spot'),
              t('videoResume.tips.tip5', 'Speak clearly in Khmer, English, or Chinese'),
              t('videoResume.tips.tip6', 'Smile and maintain eye contact with the camera'),
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight className="w-3 h-3 text-gold" />
                </div>
                <p className="text-sm text-charcoal">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShareTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-charcoal">
                  {t('videoResume.share.title', 'Share Video Resume')}
                </h3>
                <button
                  onClick={() => setShareTarget(null)}
                  className="p-1 hover:bg-sand rounded-lg"
                >
                  <X className="w-5 h-5 text-warm-gray" />
                </button>
              </div>
              <SocialShare shareData={getShareData(shareTarget)} variant="inline" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-coral" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal text-center mb-2">
                {t('videoResume.delete.title', 'Delete Video Resume?')}
              </h3>
              <p className="text-sm text-warm-gray text-center mb-6">
                {t('videoResume.delete.confirm', 'This action cannot be undone. The video will be permanently removed.')}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-sand hover:bg-cream"
                  onClick={() => setDeleteId(null)}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  className="flex-1 bg-coral hover:bg-coral-dark text-white"
                  onClick={() => handleDelete(deleteId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── IndexedDB helpers ── */
const DB_NAME = 'KhmerCareerDB'
const STORE_NAME = 'videoBlobs'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

async function saveBlobToIndexedDB(id: string, blob: Blob) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const arrayBuffer = await blob.arrayBuffer()
    await new Promise<void>((resolve, reject) => {
      const req = store.put({ id, blob: arrayBuffer, type: blob.type, savedAt: Date.now() })
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
    db.close()
  } catch (e) {
    console.error('IndexedDB save failed:', e)
  }
}

async function deleteBlobFromIndexedDB(id: string) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    await new Promise<void>((resolve, reject) => {
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
    db.close()
  } catch (e) {
    console.error('IndexedDB delete failed:', e)
  }
}

async function restoreBlobsFromIndexedDB(videos: VideoResume[]) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    for (const video of videos) {
      try {
        const result = await new Promise<{ blob: ArrayBuffer; type: string } | undefined>((resolve) => {
          const req = store.get(video.id)
          req.onsuccess = () => resolve(req.result as { blob: ArrayBuffer; type: string } | undefined)
          req.onerror = () => resolve(undefined)
        })
        if (result) {
          const blob = new Blob([result.blob], { type: result.type })
          const url = URL.createObjectURL(blob)
          video.videoUrl = url
        }
      } catch {
        // Skip if can't restore
      }
    }
    db.close()
  } catch {
    // IndexedDB not available
  }
}
