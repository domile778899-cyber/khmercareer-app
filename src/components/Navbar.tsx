import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const navGroups = [
  {
    labelKey: 'nav.forJobSeekers',
    links: [
      { labelKey: 'nav.jobs', path: '/jobs' },
      { labelKey: 'nav.training', path: '/training' },
      { labelKey: 'nav.loan', path: '/loan' },
      { labelKey: 'nav.resume', path: '/resume' },
      { labelKey: 'nav.credit', path: '/credit' },
    ],
  },
  {
    labelKey: 'nav.forEmployers',
    links: [
      { labelKey: 'nav.employers', path: '/employers' },
      { labelKey: 'nav.interview', path: '/interview' },
      { labelKey: 'nav.live', path: '/live' },
      { labelKey: 'nav.business', path: '/business' },
    ],
  },
  {
    labelKey: 'nav.general',
    links: [
      { labelKey: 'nav.pricing', path: '/pricing' },
      { labelKey: 'nav.about', path: '/about' },
      { labelKey: 'nav.contact', path: '/contact' },
    ],
  },
];

const languages = [
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
];

function getLanguageFont(code: string): string {
  switch (code) {
    case 'km':
      return 'Noto Sans Khmer, sans-serif';
    case 'zh':
      return 'Noto Sans SC, sans-serif';
    case 'th':
      return 'Noto Sans Thai, sans-serif';
    default:
      return 'Inter, sans-serif';
  }
}

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const lang = i18n.language || 'km';

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

  const isGroupActive = (links: Array<{ path: string }>) =>
    links.some((link) => isActive(link.path));

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
            {navGroups.map((group) => (
              <div
                key={group.labelKey}
                className="relative"
                onMouseEnter={() => setOpenDropdown(group.labelKey)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-4 py-2 text-body font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
                    isGroupActive(group.links)
                      ? 'text-gold'
                      : scrolled
                      ? 'text-charcoal hover:text-gold'
                      : 'text-charcoal hover:text-gold'
                  }`}
                >
                  {t(group.labelKey)}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openDropdown === group.labelKey ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Dropdown */}
                {openDropdown === group.labelKey && (
                  <div className="absolute top-full left-0 pt-1 min-w-[180px] z-50">
                    <div className="bg-[#FAF8F3]/95 backdrop-blur-[12px] border border-sand rounded-xl shadow-nav p-1.5">
                      {group.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive(link.path)
                              ? 'text-gold bg-gold/10'
                              : 'text-charcoal hover:text-gold hover:bg-gold/5'
                          }`}
                        >
                          {t(link.labelKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {isGroupActive(group.links) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-sand/50 rounded-full p-0.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => i18n.changeLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-full text-caption font-medium transition-all duration-300 ${
                    lang === l.code
                      ? 'bg-gold text-deep-brown'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                  style={{
                    fontFamily: getLanguageFont(l.code),
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
              {t('nav.postJob')}
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
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[360px] bg-[#FAF8F3] shadow-[-8px_0_32px_rgba(0,0,0,0.1)] flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-sand">
              <Link
                to="/"
                className="flex flex-col items-start leading-none"
                onClick={() => setMobileOpen(false)}
              >
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
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => i18n.changeLanguage(l.code)}
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

            {/* Mobile Grouped Navigation */}
            <div className="flex-1 p-4">
              <Accordion type="multiple" className="w-full">
                {navGroups.map((group) => (
                  <AccordionItem key={group.labelKey} value={group.labelKey} className="border-b border-sand">
                    <AccordionTrigger className="text-body font-medium text-charcoal hover:text-gold py-3 hover:no-underline">
                      {t(group.labelKey)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1 pl-2">
                        {group.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileOpen(false)}
                            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                              isActive(link.path)
                                ? 'text-gold bg-gold/10'
                                : 'text-charcoal hover:text-gold hover:bg-gold/5'
                            }`}
                          >
                            {t(link.labelKey)}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Link
                to="/employers"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-coral text-white px-5 py-3.5 rounded-xl text-button font-semibold min-h-[56px] flex items-center justify-center shadow-coral w-full"
              >
                {t('nav.postJob')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
