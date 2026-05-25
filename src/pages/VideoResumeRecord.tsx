/**
 * VideoResumeRecord.tsx
 * Full-screen video recording page with countdown, timer, and controls.
 * Uses WebRTC getUserMedia + MediaRecorder API.
 * Maximum recording duration: 60 seconds.
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Square,
  RotateCcw,
  Save,
  ChevronLeft,
  Timer,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import usePageSEO from '@/hooks/usePageSEO'

type RecordingState = 'idle' | 'countdown' | 'recording' | 'preview' | 'saving'

const MAX_DURATION = 60 // seconds
const COUNTDOWN = 3

export default function VideoResumeRecord() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  usePageSEO({ title: t('videoResume.record.title'), description: t('videoResume.record.desc') })

  const [state, setState] = useState<RecordingState>('idle')
  const [countdown, setCountdown] = useState(COUNTDOWN)
  const [elapsed, setElapsed] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [error, setError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── cleanup on unmount ── */
  useEffect(() => {
    return () => {
      stopStream()
      if (timerRef.current) clearInterval(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  /* ── stop media stream ── */
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  /* ── start camera preview ── */
  const startCamera = useCallback(async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      setError(t('videoResume.record.cameraError', 'Unable to access camera. Please allow camera permissions.'))
      console.error('Camera error:', err)
    }
  }, [t])

  /* ── toggle camera ── */
  const toggleCamera = useCallback(async () => {
    if (!streamRef.current) return
    const videoTrack = streamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCameraOn(videoTrack.enabled)
    }
  }, [])

  /* ── toggle mic ── */
  const toggleMic = useCallback(() => {
    if (!streamRef.current) return
    const audioTrack = streamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setMicOn(audioTrack.enabled)
    }
  }, [])

  /* ── start countdown then recording ── */
  const startRecording = useCallback(async () => {
    chunksRef.current = []
    setElapsed(0)
    await startCamera()

    if (!streamRef.current) return

    setState('countdown')
    setCountdown(COUNTDOWN)

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          // Start actual recording
          beginMediaRecorder()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [startCamera])

  /* ── begin MediaRecorder ── */
  const beginMediaRecorder = useCallback(() => {
    if (!streamRef.current) return

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm'

    const recorder = new MediaRecorder(streamRef.current, { mimeType })
    recorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const fullBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(fullBlob)
      setBlob(fullBlob)
      setVideoUrl(url)
      setState('preview')
    }

    recorder.start(1000) // collect every 1s
    setState('recording')

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= MAX_DURATION) {
          // Auto stop
          recorder.stop()
          if (timerRef.current) clearInterval(timerRef.current)
          return MAX_DURATION
        }
        return prev + 1
      })
    }, 1000)
  }, [])

  /* ── stop recording ── */
  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /* ── discard and restart ── */
  const handleRetake = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl('')
    setBlob(null)
    setElapsed(0)
    setState('idle')
    startCamera()
  }, [videoUrl, startCamera])

  /* ── save video ── */
  const handleSave = useCallback(() => {
    if (!blob || !videoUrl) return
    setState('saving')

    try {
      const title = t('videoResume.defaultTitle', 'My Video Resume')
      const now = new Date().toISOString()
      const id = `vr_${Date.now()}`

      const record: VideoResumeRecord = {
        id,
        title: `${title} ${new Date().toLocaleDateString()}`,
        videoUrl,
        blobType: blob.type,
        blobSize: blob.size,
        duration: elapsed,
        createdAt: now,
        privacy: 'public' as const,
        thumbnail: '',
      }

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('videoResumes') || '[]')
      existing.unshift(record)
      localStorage.setItem('videoResumes', JSON.stringify(existing))

      // Also store the blob in IndexedDB for persistence
      saveBlobToIndexedDB(id, blob)

      navigate('/video-resume', { state: { success: true } })
    } catch (err) {
      setError(t('videoResume.record.saveError', 'Failed to save video. Please try again.'))
      setState('preview')
    }
  }, [blob, videoUrl, elapsed, t, navigate])

  /* ── format timer ── */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  /* ── idle: start camera preview ── */
  useEffect(() => {
    if (state === 'idle') {
      startCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state === 'idle'])

  return (
    <div className="min-h-screen bg-deep-brown flex flex-col relative">
      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/video-resume')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('common.back', 'Back')}
        </motion.button>

        {/* Timer display */}
        <AnimatePresence>
          {state === 'recording' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white font-mono font-semibold">
                {formatTime(elapsed)} / {formatTime(MAX_DURATION)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-3 rounded-xl bg-coral/90 text-white shadow-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video area ── */}
      <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
        {/* Live preview / camera */}
        {(state === 'idle' || state === 'countdown' || state === 'recording') && (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
            {/* Mirror overlay hint */}
            <div className="absolute top-20 left-4 text-white/50 text-xs flex items-center gap-1">
              <span className="bg-black/30 px-2 py-1 rounded">{t('videoResume.record.mirrorHint', 'Mirror mode')}</span>
            </div>
          </>
        )}

        {/* Recorded preview */}
        {state === 'preview' && videoUrl && (
          <video
            ref={previewRef}
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        )}

        {/* Saving overlay */}
        <AnimatePresence>
          {state === 'saving' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full mb-4"
              />
              <p className="text-white font-medium">{t('videoResume.record.saving', 'Saving video...')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown overlay */}
        <AnimatePresence>
          {state === 'countdown' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-8xl font-bold text-white font-display"
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar during recording */}
        {state === 'recording' && (
          <div className="absolute bottom-24 left-4 right-4 z-10">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coral rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(elapsed / MAX_DURATION) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-white/60 text-xs text-center mt-1">
              {elapsed >= MAX_DURATION - 10
                ? t('videoResume.record.endingSoon', 'Recording ending soon...')
                : t('videoResume.record.recording', 'Recording...')}
            </p>
          </div>
        )}
      </div>

      {/* ── Controls bar ── */}
      <div className="bg-charcoal border-t border-white/10 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          {/* Idle state controls */}
          {state === 'idle' && (
            <>
              {/* Camera toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCamera}
                className={`p-3 rounded-full ${cameraOn ? 'bg-white/10 text-white' : 'bg-coral/20 text-coral'} transition-colors`}
              >
                {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </motion.button>

              {/* Start recording */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-coral hover:bg-coral-dark flex items-center justify-center shadow-lg shadow-coral/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-white" />
              </motion.button>

              {/* Mic toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                className={`p-3 rounded-full ${micOn ? 'bg-white/10 text-white' : 'bg-coral/20 text-coral'} transition-colors`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </motion.button>
            </>
          )}

          {/* Recording state - stop button */}
          {state === 'recording' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-coral hover:bg-coral-dark flex items-center justify-center shadow-lg shadow-coral/30 transition-colors"
            >
              <Square className="w-6 h-6 text-white fill-white" />
            </motion.button>
          )}

          {/* Countdown state */}
          {state === 'countdown' && (
            <div className="flex items-center gap-2 text-white/60">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{t('videoResume.record.getReady', 'Get ready...')}</span>
            </div>
          )}

          {/* Preview state - retake / save */}
          {state === 'preview' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetake}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t('videoResume.record.retake', 'Retake')}
              </motion.button>

              <div className="flex items-center gap-1.5 text-gold-light">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{formatTime(elapsed)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-dark text-white font-medium transition-colors shadow-lg shadow-gold/20"
              >
                <Save className="w-4 h-4" />
                {t('videoResume.record.save', 'Save')}
              </motion.button>
            </>
          )}
        </div>

        {/* Recording tips */}
        {state === 'idle' && (
          <div className="max-w-lg mx-auto mt-4 text-center">
            <p className="text-white/40 text-xs">
              {t('videoResume.record.tip', 'Tip: Speak clearly, look at the camera, and keep it under {{max}} seconds for best results.', { max: MAX_DURATION })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Types ── */
interface VideoResumeRecord {
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

/* ── IndexedDB helpers for blob storage ── */
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
