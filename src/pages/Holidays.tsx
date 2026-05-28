import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HolidayCalendar,
  HolidayCountdown,
  HolidayTimeline,
  HolidayMiniWidget,
  HolidayBanner,
  HolidayGreeting,
} from '../components/holidays';
import { Calendar, Clock, List, Sparkles } from 'lucide-react';

type TabType = 'calendar' | 'countdown' | 'timeline';

export default function Holidays() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  const tabs = [
    { id: 'calendar' as TabType, label: '节日日历', icon: Calendar },
    { id: 'countdown' as TabType, label: '倒计时', icon: Clock },
    { id: 'timeline' as TabType, label: '时间线', icon: List },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0B09] via-[#1a1410] to-[#0D0B09]">
      {/* 节日横幅 */}
      <HolidayBanner />

      {/* 节日问候弹窗 */}
      <HolidayGreeting />

      {/* 页面头部 */}
      <div className="relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-48 h-48 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/2 w-40 h-40 bg-red-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="text-gold text-sm font-medium uppercase tracking-wider">
                Cambodia Festivals
              </span>
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              បុណ្យប្រពៃណីកម្ពុជា
            </h1>
            <p className="text-xl text-white/70 mb-2">
              {t('holidays.title', '柬埔寨传统节日')}
            </p>
            <p className="text-white/50 max-w-2xl mx-auto">
              探索柬埔寨丰富的文化遗产，了解高棉民族最重要的传统节日与庆典活动
            </p>
          </div>
        </div>
      </div>

      {/* 倒计时区域 */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <HolidayCountdown className="mb-6" />
      </div>

      {/* 标签切换 */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 w-fit mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gold text-black shadow-lg shadow-gold/20'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {activeTab === 'calendar' && <HolidayCalendar />}
            {activeTab === 'countdown' && (
              <div className="space-y-6">
                <HolidayCountdown showAll />
              </div>
            )}
            {activeTab === 'timeline' && <HolidayTimeline />}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            <HolidayMiniWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
