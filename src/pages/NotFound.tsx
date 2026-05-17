import { useNavigate, Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft, Search, Briefcase, Building2, FileText, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const popularPages = [
  { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
  { label: 'For Employers', path: '/employers', icon: Building2 },
  { label: 'Build Resume', path: '/resume', icon: FileText },
  { label: 'Help & Contact', path: '/contact', icon: HelpCircle },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-warm-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        {/* Large 404 */}
        <div className="relative mb-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Compass size={56} className="text-gold md:w-16 md:h-16" />
          </div>
          <h1
            className="text-[5rem] md:text-[7rem] font-bold leading-none text-center"
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 30%, #E8C547 60%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
        </div>

        {/* Message in 3 languages */}
        <h2 className="text-h2 text-charcoal font-semibold text-center mb-2">
          Page Not Found
        </h2>
        <p className="text-body-large text-warm-gray text-center mb-1">
          ទំព័រមិនត្រូវបានរកឃើញ
        </p>
        <p className="text-body text-warm-gray text-center mb-8">
          页面未找到 &middot; The page you are looking for does not exist or has been moved.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jobs, companies..."
              className="w-full min-h-[56px] pl-11 pr-4 bg-white border-2 border-sand rounded-xl text-body text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold/15 transition-all"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-deep-brown rounded-xl text-button-small font-semibold hover:bg-gold-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.3)] min-h-[48px]"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-gold text-gold rounded-xl text-button-small font-semibold hover:bg-gold/10 active:bg-gold/20 transition-all duration-200 min-h-[48px]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Popular Pages */}
        <div className="w-full max-w-lg">
          <p className="text-caption text-warm-gray font-semibold uppercase tracking-wider text-center mb-4">
            Popular Pages
          </p>
          <div className="grid grid-cols-2 gap-3">
            {popularPages.map((page) => (
              <Link
                key={page.label}
                to={page.path}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-sand hover:border-gold hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <page.icon size={20} className="text-gold shrink-0" />
                <span className="text-body-small text-charcoal font-medium">{page.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
