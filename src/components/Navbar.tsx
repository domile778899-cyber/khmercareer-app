import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../context/AuthContext';

interface NavLink {
  label: string;
  path: string;
  roles?: UserRole[];
}

const allNavLinks: NavLink[] = [
  { label: 'Jobs', path: '/jobs' },
  { label: 'Training', path: '/training' },
  { label: 'Loan', path: '/loan' },
  { label: 'Employers', path: '/employers' },
  { label: 'Interview', path: '/interview' },
  { label: 'Live', path: '/live' },
  { label: 'Resume', path: '/resume' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Business', path: '/business' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const languages = [
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
];

function getLanguageFont(code: string): string {
  switch (code) {
    case 'km':
      return 'Noto Sans Khmer, sans-serif';
    case 'zh':
      return 'Noto Sans SC, sans-serif';
    case 'th':
      return 'Noto Sans Thai, sans-serif';
    case 'ja':
      return 'Noto Sans JP, sans-serif';
    case 'ko':
      return 'Noto Sans KR, sans-serif';
    case 'vi':
    case 'fr':
    case 'en':
    default:
      return 'Inter, sans-serif';
  }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('km');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 80);
    if (currentY > lastScrollY && currentY > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setAvatarDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!avatarDropdownOpen) return;
    const handleClick = () => setAvatarDropdownOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [avatarDropdownOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Filter nav links based on role
  const navLinks = allNavLinks.filter((link) => {
    if (!link.roles) return true;
    if (!user) return true;
    return link.roles.includes(user.role);
  });

  const avatarLetter = (user?.fullName || user?.email || '?')[0].toUpperCase();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          scrolled
            ? 'bg-[#FAF8F3]/90 backdrop-blur-[12px] border-b border-sand shadow-nav'
            : 'bg-transparent border-b border-transparent'
        } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ height: '72px' }}
      >
        <div className="mx-auto h-full flex items-center justify-between lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start shrink-0 z-10 leading-none">
            <span
              className="text-[22px] lg:text-[26px] text-gold tracking-tight font-bold"
              style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
            >
              高棉职通车
            </span>
            <span className="text-[11px] lg:text-[12px] text-gold/80 tracking-[0.08em] font-medium mt-0.5">
              Career Express
            </span>
          </Link>

          {/* Desktop Nav Links - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-body font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-gold'
                    : 'text-charcoal hover:text-gold'
                } relative`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: Language Switcher + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-sand/50 rounded-full p-0.5">
              {languages.slice(0, 3).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1 rounded-full text-caption font-medium transition-all duration-300 ${
                    lang === l.code
                      ? 'bg-gold text-deep-brown'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                  style={{ fontFamily: getLanguageFont(l.code) }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarDropdownOpen(!avatarDropdownOpen);
                  }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-sand/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-deep-brown text-caption font-bold">
                    {avatarLetter}
                  </div>
                  <span className="text-body-small font-medium text-charcoal max-w-[80px] truncate">
                    {user?.fullName || 'User'}
                  </span>
                </button>

                {/* Avatar Dropdown */}
                {avatarDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-sand shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-2 z-[200]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-sand mb-1">
                      <p className="text-body-small font-semibold text-charcoal truncate">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-caption text-warm-gray truncate">{user?.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand text-warm-gray text-caption">
                        {user?.role === 'employer' ? <Building2 size={10} /> : <Briefcase size={10} />}
                        {user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
                      </div>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setAvatarDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-body-small text-charcoal hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                        setAvatarDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-body-small text-coral hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-body-small font-medium text-charcoal hover:text-gold hover:bg-gold/5 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gold text-deep-brown px-4 py-2 rounded-xl text-body-small font-semibold flex items-center justify-center shadow-[0_2px_8px_rgba(212,175,55,0.25)] hover:bg-gold-dark hover:scale-[1.03] transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}

            {!isAuthenticated && (
              <Link
                to="/employers"
                className="bg-coral text-white px-5 py-2.5 rounded-xl text-button-small font-semibold min-h-[40px] flex items-center justify-center shadow-coral hover:bg-coral-dark hover:scale-[1.03] transition-all duration-200"
              >
                Post a Job
              </Link>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gold z-10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[360px] bg-[#FAF8F3] shadow-[-8px_0_32px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-sand">
              <Link to="/" className="flex flex-col items-start leading-none" onClick={() => setMobileOpen(false)}>
                <span
                  className="text-[22px] text-gold tracking-tight font-bold"
                  style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
                >
                  高棉职通车
                </span>
                <span className="text-[11px] text-gold/80 tracking-[0.08em] font-medium mt-0.5">
                  Career Express
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gold">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center gap-2 p-4 border-b border-sand">
              {languages.slice(0, 3).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    lang === l.code
                      ? 'bg-gold text-deep-brown'
                      : 'bg-sand/50 text-warm-gray'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Mobile: Auth Section */}
            {isAuthenticated && (
              <div className="p-4 border-b border-sand bg-gold/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-deep-brown text-body font-bold">
                    {avatarLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-charcoal truncate">{user?.fullName || 'User'}</p>
                    <p className="text-caption text-warm-gray truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gold text-deep-brown text-body-small font-semibold rounded-xl"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setMobileOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-coral text-coral text-body-small font-semibold rounded-xl"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-body font-medium rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'text-gold bg-gold/10'
                      : 'text-charcoal hover:text-gold hover:bg-gold/5'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="mt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3.5 border-2 border-gold text-gold rounded-xl text-button font-semibold min-h-[48px]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3.5 bg-gold text-deep-brown rounded-xl text-button font-semibold min-h-[48px]"
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                to="/employers"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-coral text-white px-5 py-3.5 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-coral"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
