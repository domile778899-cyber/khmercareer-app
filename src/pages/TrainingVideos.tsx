// @ts-nocheck
import { useState, useCallback, useMemo } from 'react';
import {
  Play,
  Clock,
  User,
  Globe,
  Sparkles,
  X,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { trainingVideos, videoCategories } from '../data/trainingVideos';
import type { TrainingVideo } from '../data/trainingVideos';
import ShareButtons from '../components/ShareButtons';

function VideoCard({
  video,
  onClick,
  index,
}: {
  video: TrainingVideo;
  onClick: (video: TrainingVideo) => void;
  index: number;
}) {
  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200"
      onClick={() => onClick(video)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${video.thumbnail} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        <div className="relative z-10 w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-white text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          {video.duration}
        </div>
        {/* Free badge */}
        {video.free && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 rounded-md text-white text-xs font-bold flex items-center gap-1">
            <Sparkles size={12} />
            免费
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs font-medium">
          {video.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span className="truncate max-w-[80px]">{video.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe size={12} />
            <span>{video.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoModal({
  video,
  onClose,
  relatedVideos,
  onSelectVideo,
}: {
  video: TrainingVideo;
  onClose: () => void;
  relatedVideos: TrainingVideo[];
  onSelectVideo: (v: TrainingVideo) => void;
}) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Video Player */}
        <div className="flex-1 overflow-y-auto">
          <div className="aspect-video bg-gray-900 w-full">
            <iframe
              src={video.youtubeUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-5">
            {/* Video Info */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  {video.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Globe size={14} />
                  {video.language}
                </span>
                {video.free && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Sparkles size={14} />
                    免费课程
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {video.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User size={16} className="text-blue-500" />
                <span>
                  讲师：<span className="font-medium text-gray-700">{video.instructor}</span>
                </span>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons
              url={currentUrl}
              title={video.title}
              className="pt-4 border-t border-gray-100"
            />

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                  <BookOpen size={16} className="text-blue-500" />
                  推荐视频
                </h3>
                <div className="space-y-2">
                  {relatedVideos.map((rv) => (
                    <div
                      key={rv.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                      onClick={() => onSelectVideo(rv)}
                    >
                      <div
                        className={`w-20 h-12 rounded-lg bg-gradient-to-br ${rv.thumbnail} flex items-center justify-center flex-shrink-0`}
                      >
                        <Play
                          size={14}
                          className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all"
                          fill="white"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {rv.title}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {rv.duration}
                          <span className="mx-1">·</span>
                          {rv.instructor}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainingVideos() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === '全部') return trainingVideos;
    return trainingVideos.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  const handleVideoClick = useCallback((video: TrainingVideo) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleSelectVideo = useCallback((video: TrainingVideo) => {
    setSelectedVideo(video);
  }, []);

  const relatedVideos = useMemo(() => {
    if (!selectedVideo) return [];
    return trainingVideos
      .filter(
        (v) =>
          v.category === selectedVideo.category && v.id !== selectedVideo.id
      )
      .slice(0, 4);
  }, [selectedVideo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play size={20} fill="white" />
            </div>
            <span className="text-blue-100 text-sm font-medium">在线学习</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            免费培训视频
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            提升技能，增加求职竞争力 — 精选实用培训课程，助你快速掌握职场必备技能
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-blue-100">
            <span className="flex items-center gap-1.5">
              <BookOpen size={16} />
              {trainingVideos.length}+ 门课程
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={16} />
              全部免费
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={16} />
              多语言支持
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {videoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            共 <span className="font-semibold text-gray-800">{filteredVideos.length}</span> 个视频
          </p>
          <p className="text-xs text-gray-400">
            {activeCategory !== '全部' ? `分类：${activeCategory}` : '显示全部课程'}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={handleVideoClick}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">暂无该分类的视频</p>
            <p className="text-gray-400 text-sm">请尝试选择其他分类</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            想要更多专业培训？
          </h2>
          <p className="text-blue-100 mb-4 max-w-lg mx-auto">
            我们正在持续更新更多优质培训内容，敬请期待！
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
            <span className="flex items-center gap-1">
              <Sparkles size={16} />
              即将上线：烘焙技术、汽车维修、美容美发
            </span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseModal}
          relatedVideos={relatedVideos}
          onSelectVideo={handleSelectVideo}
        />
      )}
    </div>
  );
}
