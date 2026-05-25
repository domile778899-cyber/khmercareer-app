import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { i18n as Ii18n } from 'i18next';
import {
  Menu, X, ChevronDown, LogIn, UserPlus, User, LogOut,
  Briefcase, GraduationCap, DollarSign, FileText, CreditCard,
  Building2, Video, Radio, TrendingUp, Tag, Info, Mail,
  BookOpen, Presentation, Sparkles, LayoutDashboard, Globe, Smartphone,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../context/ChatContext';

/* ─────────── types ─────────── */
interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ReactNode;
}

interface NavGroup {
  key: string;
  labelKey: string;
  icon: React.ReactNode;
  items: NavItem[];
}

/* ─────────── nav data ─────────── */
const jobSeekerLinks: NavItem[] = [
  { path: '/jobs', labelKey: 'nav.jobs', icon: <Briefcase size={16} /> },
  { path: '/training', labelKey: 'nav.training', icon: <GraduationCap size={16} /> },
  { path: '/loan', labelKey: 'nav.loan', icon: <DollarSign size={16} /> },
  { path: '/resume', labelKey: 'nav.resume', icon: <FileText size={16} /> },
  { path: '/credit', labelKey: 'nav.credit', icon: <CreditCard size={16} /> },
];

const employerLinks: NavItem[] = [
  { path: '/employers', labelKey: 'nav.employers', icon: <Building2 size={16} /> },
  { path: '/interview', labelKey: 'nav.interview', icon: <Video size={16} /> },
  { path: '/live', labelKey: 'nav.live', icon: <Radio size={16} /> },
  { path: '/business', labelKey: 'nav.business', icon: <TrendingUp size={16} /> },
];

const generalLinks: NavItem[] = [
  { path: '/app', labelKey: 'nav.app', icon: <Smartphone size={16} /> },
  { path: '/pricing', labelKey: 'nav.pricing', icon: <Tag size={16} /> },
  { path: '/about', labelKey: 'nav.about', icon: <Info size={16} /> },
  { path: '/contact', labelKey: 'nav.contact', icon: <Mail size={16} /> },
];

const educationLinks: NavItem[] = [
  { path: '/courses', labelKey: 'nav.courses', icon: <BookOpen size={16} /> },
  { path: '/teach', labelKey: 'nav.teach', icon: <Presentation size={16} /> },
  { path: '/ai-generate', labelKey: 'nav.aiGenerate', icon: <Sparkles size={16} /> },
];

const navGroups: NavGroup[] = [
  { key: 'jobSeekers', labelKey: 'group.jobSeekers', icon: <Briefcase size={18} />, items: jobSeekerLinks },
  { key: 'employers', labelKey: 'group.employers', icon: <Building2 size={18} />, items: employerLinks },
  { key: 'general', labelKey: 'group.general', icon: <Globe size={18} />, items: generalLinks },
  { key: 'education', labelKey: 'group.education', icon: <GraduationCap size={18} />, items: educationLinks },
];

/* ─────────── language config ─────────── */
const languages = [
  { code: 'km', label: '\u1797\u17B6\u179F\u17B6', font: 'Noto Sans Khmer, sans-serif' },
  { code: 'zh', label: '\u4E2D\u6587', font: 'Noto Sans SC, sans-serif' },
  { code: 'en', label: 'English', font: 'Inter, sans-serif' },
];

/* ─────────── component ─────────── */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const typedI18n = i18n as unknown as Ii18n;
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadTotal } = useChat();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<Record<string, boolean>>({
    jobSeekers: true, employers: false, general: false, education: false,
  });
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const groupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  /* scroll handler */
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 80);
    setHidden(currentY > lastScrollY.current && currentY > 200);
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  /* lock body scroll when mobile open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* click outside to close dropdowns */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const changeLanguage = useCallback((code: string) => {
    typedI18n.changeLanguage(code);
  }, [typedI18n]);

  const currentLang = typedI18n.language || 'km';

  const toggleMobileGroup = useCallback((key: string) => {
    setOpenMobileGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const handleGroupEnter = useCallback((key: string) => {
    if (groupTimeoutRef.current) clearTimeout(groupTimeoutRef.current);
    setOpenGroup(key);
  }, []);

  const handleGroupLeave = useCallback(() => {
    groupTimeoutRef.current = setTimeout(() => setOpenGroup(null), 150);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  /* ─────────── render helpers ─────────── */
  const renderDesktopGroupDropdown = (group: NavGroup) => (
    <div
      key={group.key}
      className="relative"
      onMouseEnter={() => handleGroupEnter(group.key)}
      onMouseLeave={handleGroupLeave}
    >
      <button
        className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
          group.items.some((item) => isActive(item.path))
            ? 'text-[#D4AF37]'
            : 'text-[#3D3833] hover:text-[#D4AF37]'
        }`}
      >
        {group.icon}
        <span>{t(group.labelKey)}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${openGroup === group.key ? 'rotate-180' : ''}`}
        />
      </button>

      {openGroup === group.key && (
        <div
          className="absolute top-full left-0 mt-1 w-52 rounded-xl border py-2 z-50"
          style={{
            background: 'rgba(250,248,243,0.95)',
            backdropFilter: 'blur(12px)',
            borderColor: '#E8E2D9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          {group.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
                isActive(item.path)
                  ? 'text-[#D4AF37]'
                  : 'text-[#3D3833] hover:text-[#D4AF37]'
              }`}
              style={isActive(item.path) ? { background: 'rgba(212,175,55,0.08)' } : undefined}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ color: 'rgba(212,175,55,0.7)' }}>{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const renderLanguageSwitcher = (variant: 'desktop' | 'mobile') => {
    const isDesktop = variant === 'desktop';
    return (
      <div className={`flex items-center gap-1 ${isDesktop ? '' : 'justify-center'}`}>
        {!isDesktop && <Globe size={14} className="text-[#8A8279] mr-1" />}
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={`rounded-full font-medium transition-all duration-300 ${
              currentLang === l.code
                ? 'bg-[#D4AF37] text-[#2D2926]'
                : isDesktop
                ? 'text-[#8A8279] hover:text-[#3D3833]'
                : 'bg-[#F0EBE3]/60 text-[#8A8279]'
            } ${isDesktop ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'}`}
            style={{ fontFamily: l.font }}
            aria-label={`Switch to ${l.label}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  };

  /* ─────────── JSX ─────────── */
  return (
    <>
      {/* ====== Desktop & Mobile Top Nav ====== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F3]/90 backdrop-blur-[12px]'
            : 'bg-transparent'
        } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
        style={{
          height: '72px',
          borderBottom: scrolled ? '1px solid #E8E2D9' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div className="mx-auto h-full flex items-center justify-between lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start shrink-0 z-10 leading-none">
            <span
              className="text-[22px] lg:text-[26px] font-bold tracking-tight"
              style={{ color: '#D4AF37', fontFamily: 'Noto Sans SC, sans-serif' }}
            >
              高棉职通车
            </span>
            <span
              className="text-[11px] lg:text-[12px] tracking-[0.08em] font-medium mt-0.5"
              style={{ color: 'rgba(212,175,55,0.80)' }}
            >
              Career Express
            </span>
          </Link>

          {/* Desktop Nav Groups */}
          <div className="hidden md:flex items-center gap-0.5">
            {navGroups.map(renderDesktopGroupDropdown)}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div
              className="flex items-center rounded-full p-0.5"
              style={{ background: 'rgba(240,235,227,0.6)' }}
            >
              {renderLanguageSwitcher('desktop')}
            </div>

            {/* Desktop Chat Icon */}
            <Link
              to="/chat"
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: unreadTotal > 0 ? '#D4AF37' : '#8A8279' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Messages"
            >
              <MessageCircle size={20} />
              {unreadTotal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#C75B3F] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md min-w-[18px] min-h-[18px]">
                  {unreadTotal > 99 ? '99+' : unreadTotal}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-colors"
                  style={{ borderColor: '#E8E2D9' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E2D9'; }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #B8962F)',
                      color: '#2D2926',
                    }}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (user?.fullName || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-[#3D3833] max-w-[80px] truncate">
                    {user?.fullName || 'User'}
                  </span>
                  <ChevronDown size={12} className="text-[#8A8279]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border py-2 z-50"
                    style={{
                      background: 'rgba(250,248,243,0.95)',
                      backdropFilter: 'blur(12px)',
                      borderColor: '#E8E2D9',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[#3D3833] hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/teacher-dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[#3D3833] hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <div className="my-1 border-t" style={{ borderColor: '#E8E2D9' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors text-left"
                      style={{ color: '#C75B3F' }}
                    >
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-[#3D3833] hover:text-[#D4AF37] transition-colors"
                >
                  <LogIn size={15} />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  style={{ background: '#D4AF37', color: '#2D2926' }}
                >
                  <UserPlus size={15} />
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 z-10"
            style={{ color: '#D4AF37' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* ====== Mobile Menu Drawer ====== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />

          {/* Drawer */}
          <div
            className="absolute right-0 top-0 bottom-0 flex flex-col overflow-hidden"
            style={{
              width: '85%',
              maxWidth: '400px',
              background: '#FAF8F3',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: '#E8E2D9' }}>
              <Link
                to="/"
                className="flex flex-col items-start leading-none"
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="text-[22px] font-bold tracking-tight"
                  style={{ color: '#D4AF37', fontFamily: 'Noto Sans SC, sans-serif' }}
                >
                  高棉职通车
                </span>
                <span
                  className="text-[11px] tracking-[0.08em] font-medium mt-0.5"
                  style={{ color: 'rgba(212,175,55,0.80)' }}
                >
                  Career Express
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2"
                style={{ color: '#D4AF37' }}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: '#E8E2D9', background: 'rgba(212,175,55,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962F)', color: '#2D2926' }}
                  >
                    {(user?.fullName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#3D3833] truncate">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-[#8A8279] truncate">{user?.email || ''}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: '#D4AF37', color: '#2D2926' }}
                  >
                    <User size={14} />
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border"
                    style={{ borderColor: '#E8E2D9', color: '#C75B3F' }}
                  >
                    <LogOut size={14} />
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b flex gap-2 shrink-0" style={{ borderColor: '#E8E2D9' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border"
                  style={{ borderColor: '#E8E2D9', color: '#3D3833' }}
                >
                  <LogIn size={16} />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: '#D4AF37', color: '#2D2926' }}
                >
                  <UserPlus size={16} />
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Language Switcher */}
            <div className="px-4 py-3 border-b flex items-center justify-center gap-2 shrink-0" style={{ borderColor: '#E8E2D9' }}>
              {renderLanguageSwitcher('mobile')}
            </div>

            {/* Scrollable Nav Groups */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {navGroups.map((group) => (
                <div
                  key={group.key}
                  className="rounded-xl overflow-hidden mb-2 border"
                  style={{ borderColor: 'rgba(232,226,217,0.6)' }}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleMobileGroup(group.key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                    style={openMobileGroups[group.key] ? { background: 'rgba(212,175,55,0.05)' } : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <span style={{ color: '#D4AF37' }}>{group.icon}</span>
                      <span className="text-sm font-semibold text-[#3D3833]">{t(group.labelKey)}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className="text-[#8A8279] transition-transform duration-200"
                      style={{ transform: openMobileGroups[group.key] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {/* Accordion Content */}
                  {openMobileGroups[group.key] && (
                    <div className="pb-2 px-2">
                      {group.items.map((item) => {
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleMobileLinkClick}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              color: active ? '#D4AF37' : '#3D3833',
                              background: active ? 'rgba(212,175,55,0.08)' : undefined,
                            }}
                          >
                            <span style={{ color: active ? '#D4AF37' : 'rgba(212,175,55,0.5)' }}>
                              {item.icon}
                            </span>
                            {t(item.labelKey)}
                            {active && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {isAuthenticated && (
                <Link
                  to="/teacher-dashboard"
                  onClick={handleMobileLinkClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border"
                  style={{ borderColor: 'rgba(232,226,217,0.6)', color: '#3D3833' }}
                >
                  <LayoutDashboard size={16} style={{ color: '#D4AF37' }} />
                  Teacher Dashboard
                </Link>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t shrink-0" style={{ borderColor: '#E8E2D9', background: 'rgba(245,242,237,0.5)' }}>
              <Link
                to="/employers"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full min-h-[48px] text-white rounded-xl text-sm font-semibold"
                style={{ background: '#C75B3F', boxShadow: '0 2px 8px rgba(199,91,63,0.25)' }}
              >
                <Briefcase size={16} />
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ====== Mobile Floating Chat Button ====== */}
      <Link
        to="/chat"
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962F)' }}
      >
        <MessageCircle size={24} className="text-charcoal" />
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#C75B3F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            {unreadTotal > 99 ? '99+' : unreadTotal}
          </span>
        )}
      </Link>
    </>
  );
}
