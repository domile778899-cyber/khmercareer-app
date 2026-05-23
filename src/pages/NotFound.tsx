import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  Search,
  Briefcase,
  Map,
  Compass,
  HelpCircle,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

const popularLinks = [
  { icon: Briefcase, label: 'Browse Jobs', path: '/jobs' },
  { icon: Map, label: 'Employers', path: '/employers' },
  { icon: Compass, label: 'Training', path: '/training' },
  { icon: HelpCircle, label: 'Contact Support', path: '/contact' },
];

const recentPages = [
  { label: 'Home', path: '/' },
  { label: 'Job Search', path: '/jobs' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About Us', path: '/about' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-cream" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral/3 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center relative px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl md:text-9xl font-display font-bold text-gold/15 select-none"
              >
                404
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-7xl font-display font-bold text-gold"
                >
                  404
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-coral" />
              <span className="text-sm font-medium text-coral uppercase tracking-wide">Page Not Found</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
              Oops! This page took a wrong turn
            </h1>
            <p className="text-warm-gray text-base max-w-md mx-auto mb-2">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
            <p className="text-warm-gray text-sm max-w-md mx-auto mb-8 font-khmer">
              ទំព័រដែលអ្នកស្វែងរកមិនមានទេ
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-sand hover:border-charcoal text-charcoal font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald text-emerald hover:bg-emerald/5 font-medium rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              Search Jobs
            </Link>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm text-warm-gray mb-4 uppercase tracking-wide font-medium">Popular Destinations</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularLinks.map((link, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={link.path}
                    className="flex flex-col items-center gap-2 p-4 bg-warm-white border border-sand rounded-xl hover:border-gold/30 hover:shadow-card transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <link.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-sm font-medium text-charcoal">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sitemap Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-warm-white border border-sand rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-charcoal mb-4 uppercase tracking-wide">
              Common Pages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recentPages.map((page, i) => (
                <Link
                  key={i}
                  to={page.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-warm-gray hover:text-charcoal hover:bg-cream transition-colors group"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
                  <span>{page.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Error Code for Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-warm-gray">
              Error Code: <span className="font-mono text-charcoal">404_NOT_FOUND</span> • 
              If you believe this is an error, please{' '}
              <Link to="/contact" className="text-gold hover:underline">contact support</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
