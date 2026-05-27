/**
 * Face Verification Module
 * 就业者人脸识别与身份核验
 * 集成 CamDigiKey (CamDX) e-KYC API 实现自动审核
 */

import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'

type VerificationStep = 'intro' | 'capture' | 'upload' | 'processing' | 'result'
type VerificationStatus = 'idle' | 'loading' | 'success' | 'failed'

interface FaceVerificationResult {
  status: VerificationStatus
  message: string
  matchScore?: number
  certificateId?: string
  timestamp?: string
}

export default function FaceVerification() {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [step, setStep] = useState<VerificationStep>('intro')
  const [result, setResult] = useState<FaceVerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // 初始化摄像头
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Failed to access camera:', error)
      setResult({
        status: 'failed',
        message: '无法访问摄像头，请检查权限设置',
      })
    }
  }

  // 停止摄像头
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  // 拍照
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        stopCamera()
        setStep('processing')
        verifyFace(imageData)
      }
    }
  }

  // 上传图片进行验证
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
        setStep('processing')
        verifyFace(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  // 调用人脸识别 API
  const verifyFace = async (imageData: string) => {
    setIsLoading(true)
    try {
      // TODO: 实现真实的 CamDigiKey API 调用
      // 当前使用 Mock 逻辑进行演示

      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock 验证结果（实际应调用 CamDigiKey API）
      const mockResult: FaceVerificationResult = {
        status: 'success',
        message: '身份验证成功！您已获得"金牌就业者"认证',
        matchScore: 0.95,
        certificateId: `CERT-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }

      setResult(mockResult)
      setStep('result')

      // 保存验证结果到用户档案
      // await updateUserProfile({ faceVerified: true, certificateId: mockResult.certificateId })
    } catch (error) {
      console.error('Face verification failed:', error)
      setResult({
        status: 'failed',
        message: '身份验证失败，请重试或联系客服',
      })
      setStep('result')
    } finally {
      setIsLoading(false)
    }
  }

  // 重新开始验证
  const resetVerification = () => {
    setCapturedImage(null)
    setResult(null)
    setStep('intro')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">身份核验</h1>
          <p className="text-gray-600">通过人脸识别获得"金牌就业者"认证，提升求职竞争力</p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex justify-between mb-8">
          {(['intro', 'capture', 'processing', 'result'] as const).map((s, i) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${
                    step === s
                      ? 'bg-blue-500 text-white'
                      : step > s
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {i + 1}
              </div>
              <p className="text-xs mt-2 text-gray-600">
                {['开始', '拍照', '处理中', '结果'][i]}
              </p>
              {i < 3 && <div className="flex-1 h-1 bg-gray-300 mt-4 mx-2" />}
            </div>
          ))}
        </div>

        {/* 主内容区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'intro' && (
            <div className="text-center">
              <div className="mb-6">
                <Camera size={64} className="mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">准备好了吗？</h2>
                <p className="text-gray-600 mb-4">
                  我们需要您的一张清晰的正面照片来验证您的身份。整个过程只需 1 分钟。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setStep('capture')
                    initCamera()
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  📷 使用摄像头拍照
                </button>

                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload size={20} />
                    上传照片
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 'capture' && (
            <div className="text-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg mb-4 bg-black"
              />
              <p className="text-gray-600 mb-4">请确保面部清晰可见，光线充足</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={capturePhoto}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  📸 拍照
                </button>
                <button
                  onClick={() => {
                    stopCamera()
                    setStep('intro')
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center">
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="w-full rounded-lg mb-4 max-h-96" />
              )}
              <div className="flex justify-center mb-4">
                <Loader size={48} className="text-blue-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">正在验证您的身份...</h2>
              <p className="text-gray-600">这通常需要 10-30 秒，请稍候</p>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 'result' && result && (
            <div className="text-center">
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="w-full rounded-lg mb-4 max-h-96" />
              )}

              {result.status === 'success' ? (
                <>
                  <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-green-600 mb-2">验证成功！</h2>
                  <p className="text-gray-600 mb-4">{result.message}</p>
                  {result.matchScore && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">匹配度</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(result.matchScore * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {result.certificateId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">证书 ID</p>
                      <p className="text-lg font-mono text-blue-600">{result.certificateId}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-red-600 mb-2">验证失败</h2>
                  <p className="text-gray-600 mb-4">{result.message}</p>
                </>
              )}

              <button
                onClick={resetVerification}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {result.status === 'success' ? '完成' : '重新尝试'}
              </button>
            </div>
          )}
        </div>

        {/* 安全提示 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>🔒 隐私保护：</strong>
            您的照片仅用于身份验证，我们承诺不会将其用于其他目的。所有数据均已加密存储。
          </p>
        </div>
      </div>
    </div>
  )
}
