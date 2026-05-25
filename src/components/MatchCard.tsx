/**
 * MatchCard - AI匹配结果卡片组件
 *
 * Features:
 * - 职位信息展示（标题、公司、地点、薪资等）
 * - 匹配度环形进度条（SVG实现）
 * - 各维度匹配度细分条（技能/地点/薪资/经验）
 * - 一键申请按钮（集成ApplyContext）
 * - 收藏按钮（集成FavoritesContext）
 * - Framer Motion动画
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Heart,
  Building2,
  Star,
  Zap,
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import type { MockJob } from '../data/mockJobs';

// ─── Types ───────────────────────────────────────────────────────

export interface MatchDimension {
  name: string;
  key: string;
  score: number; // 0-100
  weight: number; // 占比小数
  color: string;
  icon: React.ReactNode;
}

export interface MatchResult {
  job: MockJob;
  overallScore: number; // 0-100
  dimensions: MatchDimension[];
}

interface MatchCardProps {
  match: MatchResult;
  index?: number;
  onApply?: (jobId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

/** 获取匹配度颜色 */
function getScoreColor(score: number): string {
  if (score >= 85) return '#059669'; // emerald
  if (score >= 70) return '#D4AF37'; // gold
  if (score >= 50) return '#F59E0B'; // amber
  return '#E85D3E'; // coral
}

function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-emerald';
  if (score >= 70) return 'bg-gold';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-coral';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Perfect Match';
  if (score >= 80) return 'Great Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Fair Match';
  if (score >= 50) return 'Possible Match';
  return 'Low Match';
}

// ─── CircularProgress - SVG环形进度条 ────────────────────────────

function CircularProgress({
  score,
  size = 72,
  strokeWidth = 5,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = getScoreColor(score);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E0D0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: easeSmooth, delay: 0.2 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-lg font-bold text-charcoal leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {Math.round(score)}
        </motion.span>
        <span className="text-[9px] text-warm-gray leading-none mt-0.5">%</span>
      </div>
    </div>
  );
}

// ─── DimensionBar - 细分维度条 ───────────────────────────────────

function DimensionBar({ dimension }: { dimension: MatchDimension }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-warm-gray">
        {dimension.icon}
      </div>
      <span className="text-[11px] text-warm-gray w-8 flex-shrink-0 truncate">
        {dimension.name}
      </span>
      <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: dimension.color }}
          initial={{ width: 0 }}
          animate={{ width: `${dimension.score}%` }}
          transition={{ duration: 0.8, ease: easeSmooth, delay: 0.3 }}
        />
      </div>
      <span className="text-[10px] font-semibold text-charcoal w-7 text-right flex-shrink-0">
        {Math.round(dimension.score)}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export default function MatchCard({ match, index = 0, onApply }: MatchCardProps) {
  const navigate = useNavigate();
  const { isJobFavorited, toggleJob } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { job, overallScore, dimensions } = match;
  const isFavorited = isJobFavorited(job.id);
  const scoreColor = getScoreColor(overallScore);
  const scoreBgClass = getScoreBgColor(overallScore);

  // 生成公司logo背景色
  const logoBg = useMemo(() => {
    const colors = [
      'bg-amber-100 text-amber-700',
      'bg-emerald-100 text-emerald-700',
      'bg-blue-100 text-blue-700',
      'bg-rose-100 text-rose-700',
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
    ];
    let hash = 0;
    for (let i = 0; i < job.company.length; i++) {
      hash = job.company.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [job.company]);

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleJob(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl border border-sand overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeSmooth }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      layout
    >
      {/* 顶部匹配度标签 */}
      <div className="absolute top-3 left-3 z-10">
        <motion.div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white ${scoreBgClass}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.08 }}
          style={{
            boxShadow: `0 2px 8px ${scoreColor}40`,
          }}
        >
          <Zap className="w-3 h-3" />
          {getScoreLabel(overallScore)}
        </motion.div>
      </div>

      {/* 收藏按钮 */}
      <motion.button
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-sand flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        onClick={handleFavorite}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorited ? 'text-coral fill-coral' : 'text-warm-gray'
          }`}
        />
      </motion.button>

      {/* Card Content */}
      <div className="p-5">
        {/* Header: Logo + Job Info + Circular Progress */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${logoBg} font-bold text-sm`}
          >
            {job.company.charAt(0).toUpperCase()}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-display text-base font-semibold text-charcoal truncate group-hover:text-gold transition-colors leading-tight">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 className="w-3 h-3 text-warm-gray" />
              <span className="text-xs text-warm-gray truncate">{job.company}</span>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="flex-shrink-0 mt-1">
            <CircularProgress score={overallScore} size={64} strokeWidth={4.5} />
          </div>
        </div>

        {/* Job Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] text-charcoal bg-cream px-2 py-1 rounded-lg">
            <MapPin className="w-3 h-3 text-warm-gray" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-charcoal bg-cream px-2 py-1 rounded-lg">
            <DollarSign className="w-3 h-3 text-warm-gray" />
            ${job.salaryMin}-${job.salaryMax}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-charcoal bg-cream px-2 py-1 rounded-lg">
            <Briefcase className="w-3 h-3 text-warm-gray" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-charcoal bg-cream px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-warm-gray" />
            {job.experience}
          </span>
        </div>

        {/* Dimension Breakdown */}
        <div className="bg-warm-white rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-charcoal">Match Breakdown</span>
            <span className="text-[10px] text-warm-gray">AI Analysis</span>
          </div>
          {dimensions.map((dim) => (
            <DimensionBar key={dim.key} dimension={dim} />
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.verified && (
            <span className="text-[10px] bg-emerald/10 text-emerald px-2 py-0.5 rounded-full font-medium">
              Verified
            </span>
          )}
          {job.urgent && (
            <span className="text-[10px] bg-coral/10 text-coral px-2 py-0.5 rounded-full font-medium">
              Urgent
            </span>
          )}
          {job.featured && (
            <span className="text-[10px] bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-medium">
              <Star className="w-2.5 h-2.5 inline mr-0.5" />
              Featured
            </span>
          )}
          <span className="text-[10px] bg-cream text-warm-gray px-2 py-0.5 rounded-full">
            {job.industry}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-sand">
          <motion.button
            className="flex-1 flex items-center justify-center gap-1.5 bg-gold text-deep-brown text-sm font-semibold py-2.5 rounded-xl hover:bg-gold-dark transition-colors"
            onClick={handleApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap className="w-4 h-4" />
            Quick Apply
          </motion.button>
          <motion.button
            className="flex items-center justify-center w-10 h-10 border border-sand rounded-xl text-warm-gray hover:text-gold hover:border-gold transition-colors"
            onClick={handleFavorite}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-coral fill-coral' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
