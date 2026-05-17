import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

type ConsentChoice = 'all' | 'essential' | null;

const STORAGE_KEY = 'cookie-consent';

function getStoredConsent(): ConsentChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'all' || stored === 'essential') return stored;
  } catch {
    // localStorage not available
  }
  return null;
}

function storeConsent(choice: ConsentChoice) {
  try {
    if (choice) {
      localStorage.setItem(STORAGE_KEY, choice);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage not available
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing the banner slightly for better UX
    const timer = setTimeout(() => {
      const consent = getStoredConsent();
      if (!consent) {
        setIsVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    storeConsent('all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    storeConsent('essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[300] px-4 pb-4"
        >
          <div className="mx-auto max-w-4xl bg-white rounded-2xl border border-sand shadow-[0_-4px_32px_rgba(0,0,0,0.12)] p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Icon + Text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Cookie size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-body-small text-charcoal leading-relaxed">
                    We use cookies to improve your experience, personalize content,
                    and analyze our traffic. By continuing, you agree to our use of cookies.
                  </p>
                  <Link
                    to="/privacy"
                    className="inline-block mt-1 text-caption text-gold hover:text-gold-dark font-medium transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 bg-gold text-deep-brown rounded-xl text-button-small font-semibold hover:bg-gold-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.3)] whitespace-nowrap"
                >
                  Accept All
                </button>
                <button
                  onClick={handleEssentialOnly}
                  className="px-5 py-2.5 bg-transparent border-2 border-gold text-gold rounded-xl text-button-small font-semibold hover:bg-gold/10 active:bg-gold/20 transition-all duration-200 whitespace-nowrap"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
