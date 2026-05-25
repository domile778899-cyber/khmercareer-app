import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Check, X, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'khmer_cookie_consent';

type ConsentChoice = 'all' | 'essential' | null;

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setChoice(stored as ConsentChoice);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    setChoice('all');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(STORAGE_KEY, 'essential');
    setChoice('essential');
    setVisible(false);
  };

  const handleDismiss = () => {
    handleEssentialOnly();
  };

  if (choice === 'all' || choice === 'essential') {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 mb-20 md:mb-4"
        >
          <div className="max-w-4xl mx-auto bg-charcoal border border-gold/20 rounded-xl shadow-card-hover p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-gold" />
              </div>

              <div className="flex-1">
                <h3 className="text-warm-white font-semibold text-sm md:text-base mb-1">
                  Cookie {t('footer.preferences') || 'Preferences'}
                </h3>
                <p className="text-warm-gray text-xs md:text-sm leading-relaxed">
                  {t('cookies.message')}
                  {' '}
                  <a
                    href="/privacy"
                    className="text-gold hover:text-gold-light underline inline-flex items-center gap-0.5"
                  >
                    {t('footer.privacy')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {' '}
                  {t('cookies.learnMore') || 'for more details.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAcceptAll}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gold hover:bg-gold-dark text-deep-brown text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t('cookies.accept')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEssentialOnly}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-warm-gray/30 hover:border-warm-gray/50 text-warm-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {t('cookies.essential')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-warm-gray hover:text-warm-white hover:bg-warm-white/10 transition-colors"
                  aria-label={t('common.close') || 'Dismiss'}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
