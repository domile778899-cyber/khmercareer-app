import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import AICustomerService from './AICustomerService';
import { usePageSEO } from '../hooks/usePageSEO';
import { OrganizationJsonLd } from './SEOProvider';

export default function Layout() {
  // Auto-update SEO metadata on route change
  usePageSEO();

  useEffect(() => {
    let lenis: { destroy: () => void; raf: (time: number) => void } | null = null;
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <OrganizationJsonLd />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <AICustomerService />
    </div>
  );
}
