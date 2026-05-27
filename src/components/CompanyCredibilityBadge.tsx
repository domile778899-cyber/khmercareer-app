/**
 * Company Credibility Badge Component
 * 显示企业的认证等级和信用标签
 * 借鉴 BOSS 直聘的企业信用展示
 */

import { Award, CheckCircle, Star, TrendingUp } from 'lucide-react'

export type CredibilityLevel = 'gold' | 'silver' | 'bronze' | 'verified' | 'none'

interface CompanyCredibilityBadgeProps {
  level: CredibilityLevel
  companyName: string
  scale?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const credibilityConfig = {
  gold: {
    icon: Award,
    label: '高棉认证企业',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: '企业已通过官方认证，信用等级最高',
  },
  silver: {
    icon: CheckCircle,
    label: '认证企业',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: '企业已通过基础认证',
  },
  bronze: {
    icon: Star,
    label: '活跃企业',
    color: 'text-orange-400',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: '企业在平台活跃度高',
  },
  verified: {
    icon: TrendingUp,
    label: '高成长企业',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: '企业融资情况良好，发展潜力大',
  },
  none: {
    icon: CheckCircle,
    label: '普通企业',
    color: 'text-gray-300',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-100',
    description: '企业信息已验证',
  },
}

export default function CompanyCredibilityBadge({
  level,
  companyName,
  scale = 'md',
  showLabel = true,
}: CompanyCredibilityBadgeProps) {
  const config = credibilityConfig[level]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-3 text-base gap-2',
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  return (
    <div
      className={`
        inline-flex items-center
        border rounded-full
        ${config.bgColor} ${config.borderColor}
        ${sizeClasses[scale]}
        transition-all duration-200
        hover:shadow-md
      `}
      title={`${companyName} - ${config.description}`}
    >
      <Icon size={iconSizes[scale]} className={config.color} />
      {showLabel && <span className="font-semibold text-gray-700">{config.label}</span>}
    </div>
  )
}
