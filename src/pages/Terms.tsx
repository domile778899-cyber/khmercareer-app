import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, User, Building2, CreditCard, XOctagon, AlertTriangle, Scale, RefreshCw } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using 高棉职通车 (Khmer Career Express), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use our platform.',
      'These terms apply to all visitors, users, job seekers, employers, and others who access or use the service. You must be at least 16 years old to use this platform, in compliance with Cambodian labor law regarding minimum working age.',
      'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use constitutes acceptance of the revised terms.',
    ],
  },
  {
    id: 'user-obligations',
    icon: User,
    title: 'User Obligations',
    content: [
      'Job seekers must provide accurate, current, and complete information when creating profiles and applying for positions. Misrepresentation of qualifications, experience, or identity is strictly prohibited.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.',
      'Users may not use the platform for unlawful purposes, including but not limited to: fraudulent job applications, spam, harassment, discrimination, or distribution of malicious software. Violations will result in account termination.',
    ],
  },
  {
    id: 'employer-obligations',
    icon: Building2,
    title: 'Employer Obligations',
    content: [
      'Employers must provide accurate job descriptions, including duties, requirements, compensation, and working conditions. All job postings must comply with Cambodia\'s Labor Law and anti-discrimination regulations.',
      'Employers are prohibited from charging job seekers any fees for applications, interviews, or placement. Such practices violate Cambodian law and platform policy.',
      'Employers must respond to applications in a timely manner and maintain professional conduct throughout the recruitment process. Verified employer status may be revoked for violations.',
    ],
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Terms',
    content: [
      'Certain services require payment, including premium job postings, featured listings, and employer verification packages. All fees are quoted in USD unless otherwise stated.',
      'Payments are processed securely through our payment partners. Subscription services automatically renew unless cancelled at least 24 hours before the renewal date.',
      'Refunds are provided at our discretion. No refunds for services already rendered. If you dispute a charge, contact our support team within 30 days of the transaction.',
    ],
  },
  {
    id: 'termination',
    icon: XOctagon,
    title: 'Termination',
    content: [
      'We may suspend or terminate your account immediately for violations of these terms, fraudulent activity, or behavior that harms other users or the platform.',
      'You may delete your account at any time through your account settings. Upon termination, your right to use the platform ceases immediately, and your profile data will be handled per our Privacy Policy.',
      'Provisions that by their nature should survive termination shall survive, including intellectual property rights, warranty disclaimers, and limitations of liability.',
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: [
      '高棉职通车 provides the platform &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that jobs posted are accurate, that employers will hire, or that candidates are suitable.',
      'To the maximum extent permitted by Cambodian law, we shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.',
      'Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim, or USD 100 if no payment was made.',
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    title: 'Governing Law',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Cambodia, including the Civil Code, Labor Law, and E-Commerce Law.',
      'Any dispute arising from these terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to arbitration in Phnom Penh under Cambodian Arbitration Law.',
      'If any provision is found invalid, the remaining provisions shall continue in full effect.',
    ],
  },
  {
    id: 'changes',
    icon: RefreshCw,
    title: 'Changes to Terms',
    content: [
      'We may update these Terms from time to time to reflect changes in our services, legal requirements, or business practices.',
      'We will notify users of material changes via email or platform notification at least 15 days before they take effect.',
      'Your continued use of the platform after changes become effective constitutes acceptance of the updated terms.',
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-[100dvh]">
      {/* Dark Header */}
      <div className="bg-deep-brown pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-caption text-warm-gray mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gold">Terms of Service</span>
          </nav>

          <h1
            className="text-h1 text-warm-white font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Terms of Service
          </h1>
          <p className="text-body-large text-warm-gray max-w-2xl leading-relaxed">
            លក្ខខណ្ឌសេវាកម្ម &middot; 服务条款 &middot; The rules that keep our community fair and safe.
            Governing law: Kingdom of Cambodia.
          </p>
          <p className="text-caption text-warm-gray/60 mt-4">
            Last updated: January 1, 2025 &middot; Version 1.0
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-warm-white py-12 md:py-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1">
                <p className="text-caption text-warm-gray font-semibold uppercase tracking-wider mb-4">
                  Contents
                </p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-body-small text-charcoal hover:bg-cream hover:text-gold transition-colors"
                  >
                    <section.icon size={16} />
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              <div className="bg-white rounded-2xl border border-sand p-6 md:p-10">
                <p className="text-body text-charcoal leading-relaxed mb-6">
                  Welcome to <strong className="text-gold-dark">高棉职通车 (Khmer Career Express)</strong>.
                  These Terms of Service constitute a legally binding agreement between you and
                  Khmer Career Express Co., Ltd., a company registered in the Kingdom of Cambodia,
                  regarding your use of our recruitment platform and related services.
                </p>
                <p className="text-body text-charcoal leading-relaxed">
                  Please read these terms carefully. By accessing or using our platform,
                  you acknowledge that you have read, understood, and agree to be bound by these terms,
                  our Privacy Policy, and any additional guidelines or rules applicable to specific services.
                </p>
              </div>

              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <section.icon size={20} className="text-gold" />
                    </div>
                    <h2
                      className="text-h2 text-charcoal font-semibold"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="bg-white rounded-2xl border border-sand p-6 md:p-8 space-y-4">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="text-body text-charcoal/85 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              {/* Contact */}
              <div className="bg-cream rounded-2xl border border-sand p-6 md:p-8">
                <h3 className="text-h4 text-charcoal font-semibold mb-3">
                  Questions About These Terms?
                </h3>
                <p className="text-body-small text-warm-gray leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us at
                  legal@khmercareer.com, call +855 23 999 888, or visit our office at
                  #126 Norodom Blvd, Phnom Penh, Cambodia.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium text-body-small transition-colors"
                >
                  Contact Us &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
