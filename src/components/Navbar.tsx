import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Jobs', path: '/jobs' },
  { label: 'Training', path: '/training' },
  { label: 'Employers', path: '/employers' },
  { label: 'Resume', path: '/resume' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const languages = [
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [lastScrollY, setLastScrollY] = useState(0);

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
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
          <Link to="/" className="flex items-center gap-0 shrink-0 z-10">
            <span className="font-display italic text-[24px] lg:text-[28px] text-gold tracking-tight">
              Khmer
            </span>
            <span className="font-body font-bold text-[24px] lg:text-[28px] text-gold tracking-tight">
              HR
            </span>
          </Link>

          {/* Desktop Nav Links - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-body font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-gold'
                    : scrolled
                    ? 'text-charcoal hover:text-gold'
                    : 'text-charcoal hover:text-gold'
                } relative`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-sand/50 rounded-full p-0.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1 rounded-full text-caption font-medium transition-all duration-300 ${
                    lang === l.code
                      ? 'bg-gold text-deep-brown'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                  style={{
                    fontFamily:
                      l.code === 'km'
                        ? 'Noto Sans Khmer, sans-serif'
                        : l.code === 'zh'
                        ? 'Noto Sans SC, sans-serif'
                        : 'Inter, sans-serif',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link
              to="/employers"
              className="bg-coral text-white px-5 py-2.5 rounded-xl text-button-small font-semibold min-h-[40px] flex items-center justify-center shadow-coral hover:bg-coral-dark hover:scale-[1.03] transition-all duration-200"
            >
              Post a Job
            </Link>
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
              <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                <span className="font-display italic text-[24px] text-gold">Khmer</span>
                <span className="font-body font-bold text-[24px] text-gold">HR</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gold">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center gap-2 p-4 border-b border-sand">
              {languages.map((l) => (
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

            <div className="flex flex-col gap-2 p-4 flex-1">
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
