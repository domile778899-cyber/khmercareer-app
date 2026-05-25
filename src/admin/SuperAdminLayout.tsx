import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import SuperAdminGuard from './SuperAdminGuard';
import {
  LayoutDashboard,
  Bot,
  Video,
  Rocket,
  Share2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Crown,
  Bell,
  Search,
  ArrowLeft,
  Sparkles,
  CircleDot,
} from 'lucide-react';

/* ── types ── */
interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  badge?: number | string;
  badgeColor?: string;
}

/* ── navigation data ── */
const navItems: NavItem[] = [
  { label: '总览看板', icon: LayoutDashboard, path: '/superadmin' },
  { label: 'AI推广中心', icon: Bot, path: '/superadmin/promotion', badge: 'NEW', badgeColor: '#D4AF37' },
  { label: '短视频工厂', icon: Video, path: '/superadmin/video-factory', badge: 3, badgeColor: '#E85D3E' },
  { label: '裂变增长引擎', icon: Rocket, path: '/superadmin/growth' },
  { label: '社媒矩阵', icon: Share2, path: '/superadmin/social', badge: 12, badgeColor: '#059669' },
  { label: '数据分析', icon: BarChart3, path: '/superadmin/analytics' },
  { label: '系统设置', icon: Settings, path: '/superadmin/settings' },
];

const pageTitles: Record<string, string> = {
  '/superadmin': '超级管理总览',
  '/superadmin/promotion': 'AI推广中心',
  '/superadmin/video-factory': '短视频工厂',
  '/superadmin/growth': '裂变增长引擎',
  '/superadmin/social': '社媒矩阵管理',
  '/superadmin/analytics': '数据分析中心',
  '/superadmin/settings': '系统设置',
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── sidebar component ── */
function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/superadmin') {
      return location.pathname === '/superadmin';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <SuperAdminGuard>
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] flex-col bg-deep-brown shadow-2xl lg:flex ${
          isOpen ? 'flex' : 'hidden'
        }`}
        initial={false}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo area */}
        <div className="flex flex-col items-center border-b border-white/10 px-4 py-6">
          <motion.div
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgba(212,175,55,0.2)' }}
            whileHover={{ scale: 1.05 }}
          >
            <Crown size={26} style={{ color: '#D4AF37' }} />
          </motion.div>
          <h1
            className="text-lg font-bold tracking-wide"
            style={{ color: '#D4AF37' }}
          >
            高棉职通车
          </h1>
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: '#D4AF3720', color: '#D4AF37' }}
            >
              <Sparkles size={10} />
              超级管理中心
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              功能菜单
            </span>
          </div>
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                  color: active ? '#D4AF37' : 'rgba(255,255,255,0.65)',
                  borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {active && (
                  <motion.div
                    layoutId="superadmin-active-indicator"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  className={active ? 'text-[#D4AF37]' : 'text-white/40 group-hover:text-white/70'}
                />
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span
                    className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${item.badgeColor}20`,
                      color: item.badgeColor || '#D4AF37',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}

          <div className="mt-6 mb-2 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              实时状态
            </span>
          </div>
          <div className="space-y-2 px-3">
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#059669]" />
                系统运行中
              </span>
              <span className="text-emerald">正常</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#D4AF37]" />
                AI服务
              </span>
              <span className="text-gold">在线</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#2563EB]" />
                视频渲染队列
              </span>
              <span className="text-blue-400">3 任务</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#E85D3E]" />
                待审核内容
              </span>
              <span className="text-coral">7 项</span>
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 px-3 py-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#D4AF37' }}
              >
                {user?.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="flex flex-1 flex-col items-start overflow-hidden">
                <span className="truncate text-sm font-medium text-white">
                  {user?.fullName || '超级管理员'}
                </span>
                <span className="truncate text-[10px] text-gold/70">
                  {user?.email || 'superadmin@kmjob.com'}
                </span>
              </div>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-white/50" />
              </motion.div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-white/10 bg-[#2D2926] shadow-xl"
                >
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/superadmin/settings');
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Settings size={14} />
                    <span>系统设置</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <LayoutDashboard size={14} />
                    <span>普通后台</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-white/10"
                  >
                    <LogOut size={14} />
                    <span>退出登录</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back to site */}
          <motion.button
            whileHover={{ x: -2 }}
            onClick={() => navigate('/')}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-gold"
          >
            <ArrowLeft size={14} />
            返回网站
          </motion.button>
        </div>
      </motion.aside>
    </>
    </SuperAdminGuard>
  );
}

/* ── header component ── */
interface HeaderProps {
  onMenuToggle: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const title = pageTitles[location.pathname] || '超级管理总览';

  const notifications = [
    { id: 1, text: '新视频待审核: "AI招聘视频 #128"', time: '2分钟前', type: 'video' },
    { id: 2, text: '裂变活动 "春节招聘季" 达到1000次分享', time: '15分钟前', type: 'growth' },
    { id: 3, text: 'AI推广任务 #45 已完成', time: '1小时前', type: 'ai' },
    { id: 4, text: '社媒账号 Facebook 收到新私信', time: '2小时前', type: 'social' },
  ];

  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-deep-brown/10 bg-warm-white/80 px-4 backdrop-blur-md lg:px-6"
      style={{ left: '260px' }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-charcoal hover:bg-deep-brown/5 lg:hidden"
        >
          <Menu size={20} />
        </motion.button>
        <motion.h2
          key={title}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold text-charcoal"
        >
          {title}
        </motion.h2>
        <span
          className="hidden rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:inline-block"
          style={{ backgroundColor: '#D4AF3720', color: '#B8941F' }}
        >
          SUPER ADMIN
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索功能、数据..."
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded-lg border border-deep-brown/10 bg-white py-1.5 pl-3 pr-3 text-sm text-charcoal shadow-sm outline-none focus:border-gold"
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              setSearchQuery('');
            }}
            className="relative rounded-lg p-2 text-charcoal/60 hover:bg-deep-brown/5 hover:text-charcoal"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
            }}
            className="relative rounded-lg p-2 text-charcoal/60 hover:bg-deep-brown/5 hover:text-charcoal"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-deep-brown/10 bg-white shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-deep-brown/10 px-4 py-3">
                    <span className="text-sm font-semibold text-charcoal">通知</span>
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold text-coral">
                      {notifications.length} 新
                    </span>
                  </div>
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: n.id * 0.05 }}
                      className="flex items-start gap-3 border-b border-deep-brown/5 px-4 py-3 last:border-0 hover:bg-cream"
                    >
                      <div
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            n.type === 'video'
                              ? '#E85D3E'
                              : n.type === 'growth'
                                ? '#059669'
                                : n.type === 'ai'
                                  ? '#D4AF37'
                                  : '#2563EB',
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-charcoal">{n.text}</p>
                        <p className="mt-0.5 text-xs text-warm-gray">{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="border-t border-deep-brown/10 px-4 py-2.5">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-medium text-gold transition-opacity hover:opacity-80"
                    >
                      查看全部通知
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Quick actions */}
        <div className="hidden h-6 w-px bg-deep-brown/10 sm:block" />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/superadmin/promotion')}
          className="hidden items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-deep-brown shadow-gold transition-all hover:shadow-gold-hover sm:flex"
        >
          <Bot size={14} />
          新建AI推广
        </motion.button>
      </div>
    </header>
  );
}

/* ── main layout ── */
export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (user?.role !== 'superadmin') {
      navigate('/admin', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, user, navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-deep-brown">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-4 border-gold border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <main className="pt-16 transition-all duration-300" style={{ marginLeft: '260px', minHeight: '100vh' }}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
