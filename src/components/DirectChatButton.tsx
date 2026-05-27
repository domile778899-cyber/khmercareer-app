/**
 * Direct Chat Button Component
 * 在职位详情页增加"立即沟通"按钮，直接进入 Chat 模块
 * 借鉴 BOSS 直聘的"开局即聊"特色
 */

import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

interface DirectChatButtonProps {
  jobId: string
  companyId: string
  companyName: string
  jobTitle: string
  className?: string
}

export default function DirectChatButton({
  jobId,
  companyId,
  companyName,
  jobTitle,
  className = '',
}: DirectChatButtonProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleDirectChat = async () => {
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    setIsLoading(true)
    try {
      // TODO: 调用 API 创建或获取与该公司的聊天室
      // const chatRoom = await createOrGetChatRoom(companyId, jobId)

      // 临时方案：直接跳转到聊天列表
      navigate('/chat', {
        state: {
          prefilledCompany: companyName,
          jobTitle,
          jobId,
        },
      })
    } catch (error) {
      console.error('Failed to initiate direct chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDirectChat}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3
        bg-gradient-to-r from-blue-500 to-blue-600
        hover:from-blue-600 hover:to-blue-700
        disabled:from-gray-400 disabled:to-gray-500
        text-white font-semibold rounded-lg
        transition-all duration-200
        shadow-md hover:shadow-lg
        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isAuthenticated ? '立即与企业沟通' : '登录后可与企业沟通'}
    >
      <MessageCircle size={20} />
      <span>{isLoading ? '正在连接...' : '立即沟通'}</span>
    </button>
  )
}
