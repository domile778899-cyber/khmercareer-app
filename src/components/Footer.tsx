import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, Send } from 'lucide-react';

const jobSeekerLinks = [
  { label: 'Search Jobs', path: '/jobs' },
  { label: 'Create Resume', path: '/resume' },
  { label: 'Job Alerts', path: '/jobs' },
  { label: 'Career Tips', path: '/about' },
];

const employerLinks = [
  { label: 'Post a Job', path: '/employers' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Verification', path: '/employers' },
  { label: 'Employer Dashboard', path: '/employers' },
];

export default function Footer() {
  return (
    <footer className="bg-deep-brown text-warm-gray">
      <div className="mx-auto px-4 md:px-8 pt-20 pb-8 lg:max-w-[1200px] xl:max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col items-start leading-none">
              <span
                className="text-[24px] text-gold tracking-tight font-bold"
                style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
              >
                高棉职通车
              </span>
              <span className="text-[11px] text-gold/80 tracking-[0.08em] font-medium mt-0.5">
                Khmer Career Express
              </span>
            </Link>
            <p className="font-khmer text-gold-light/80 text-sm">
              កម្ពុជា​នៃ​ការងារ
            </p>
            <p className="text-body-small text-warm-gray/80 leading-relaxed">
              Cambodia's premier recruitment platform connecting employers with talent across garment, tourism, ICT, and emerging sectors.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-warm-gray hover:text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-warm-gray hover:text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-200"
                aria-label="Messenger"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-warm-gray hover:text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-200"
                aria-label="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Job Seekers */}
          <div>
            <h4 className="font-khmer text-warm-white font-semibold text-h4 mb-4">
              សម្រាប់​អ្នក​ស្វែងរក​ការងារ
            </h4>
            <p className="text-caption text-warm-gray/60 mb-3">For Job Seekers</p>
            <ul className="space-y-3">
              {jobSeekerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-small text-warm-gray hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Employers */}
          <div>
            <h4 className="font-khmer text-warm-white font-semibold text-h4 mb-4">
              សម្រាប់​និយោជក
            </h4>
            <p className="text-caption text-warm-gray/60 mb-3">For Employers</p>
            <ul className="space-y-3">
              {employerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-small text-warm-gray hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-khmer text-warm-white font-semibold text-h4 mb-4">
              ទំនាក់ទំនង
            </h4>
            <p className="text-caption text-warm-gray/60 mb-3">Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-body-small">
                  #126 Norodom Blvd, Phnom Penh, Cambodia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold shrink-0" />
                <span className="text-body-small">+855 23 999 888</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold shrink-0" />
                <span className="text-body-small">info@khmercareer.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-body-small">
                  Mon - Fri: 8:00 AM - 5:30 PM
                </span>
              </li>
            </ul>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-caption text-warm-gray/60 mb-2">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-h-[40px] px-3 py-2 bg-[#2D2926] border border-[#3D3936] rounded-lg text-body-small text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <button className="px-4 py-2 bg-gold text-deep-brown rounded-lg text-button-small font-semibold hover:bg-gold-dark transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-warm-gray/60">
            &copy; 2025 高棉职通车 (Khmer Career Express). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-caption text-warm-gray/60 hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-caption text-warm-gray/60 hover:text-gold transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-caption text-warm-gray/60 hover:text-gold transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
