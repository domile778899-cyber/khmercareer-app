import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Eye, Share2, UserCheck, Clock, Lock, Mail } from 'lucide-react';

const sections = [
  {
    id: 'collection',
    icon: Eye,
    title: 'Data Collection',
    content: [
      'We collect personal information that you voluntarily provide when creating an account, uploading your resume, applying for jobs, or contacting us. This includes your name, email address, phone number, work experience, education, skills, and other professional details.',
      'We also automatically collect certain information when you visit our platform, including your IP address, browser type, device information, pages visited, and timestamps. This data helps us improve our services and user experience.',
      'With your consent, we may collect location data to provide job recommendations in your area. You can disable location services at any time through your device settings.',
    ],
  },
  {
    id: 'usage',
    icon: Shield,
    title: 'Data Usage',
    content: [
      'Your personal data is used to provide and improve our recruitment services, including matching you with relevant job opportunities, enabling employers to find suitable candidates, and personalizing your experience on our platform.',
      'We use your contact information to send job alerts, application updates, and important service notifications. You can manage your communication preferences in your account settings.',
      'Aggregated and anonymized data may be used for market research, platform analytics, and generating industry insights that help improve Cambodia\'s recruitment ecosystem.',
    ],
  },
  {
    id: 'sharing',
    icon: Share2,
    title: 'Data Sharing',
    content: [
      'We share your profile information with employers when you apply for a job or opt-in to be discovered by recruiters. Your contact details are only shared upon application or when you explicitly agree.',
      'We may share data with trusted third-party service providers who assist in operating our platform (cloud hosting, payment processing, analytics). These partners are bound by strict confidentiality agreements.',
      'We do not sell your personal data to third parties. We may disclose information if required by Cambodian law, court order, or to protect our rights and safety.',
    ],
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: 'User Rights',
    content: [
      'Under Cambodia\'s 2025 Data Protection Law, you have the right to access, correct, and delete your personal data. You can exercise these rights through your account settings or by contacting our data protection officer.',
      'You have the right to withdraw consent for data processing at any time. You may also request a copy of your data in a commonly used format (data portability).',
      'If you believe your data rights have been violated, you have the right to lodge a complaint with Cambodia\'s Data Protection Authority or seek judicial remedy under Cambodian law.',
    ],
  },
  {
    id: 'retention',
    icon: Clock,
    title: 'Data Retention',
    content: [
      'We retain your personal data for as long as your account is active or as necessary to provide our services. If you delete your account, we will remove your profile within 30 days, unless legal obligations require longer retention.',
      'Application history and employer interactions may be retained for up to 2 years to comply with Cambodian labor regulations and for dispute resolution purposes.',
      'Anonymized data that cannot identify you may be retained indefinitely for research and analytics purposes.',
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Security Measures',
    content: [
      'We implement industry-standard security measures including SSL/TLS encryption, secure data centers, access controls, and regular security audits to protect your personal information.',
      'All data transfers between your device and our servers are encrypted. Passwords are hashed using modern cryptographic algorithms.',
      'We conduct regular employee training on data protection and maintain a comprehensive incident response plan. In case of a data breach, we will notify affected users and relevant authorities within 72 hours as required by Cambodian law.',
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer at privacy@khmercareer.com.',
      'You can also reach us at: #126 Norodom Blvd, Phnom Penh, Cambodia, or call +855 23 999 888 during business hours (Mon-Fri, 8:00 AM - 5:30 PM).',
      'We are committed to resolving any privacy concerns promptly and in accordance with Cambodia\'s 2025 Data Protection Law and international best practices.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-[100dvh]">
      {/* Dark Header */}
      <div className="bg-deep-brown pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-caption text-warm-gray mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gold">Privacy Policy</span>
          </nav>

          <h1
            className="text-h1 text-warm-white font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-body-large text-warm-gray max-w-2xl leading-relaxed">
            គោលការណ៍ភាពជាឯកជន &middot; 隐私政策 &middot; Your data, your rights.
            We are committed to protecting your personal information in compliance with Cambodia&apos;s 2025 Data Protection Law.
          </p>
          <p className="text-caption text-warm-gray/60 mt-4">
            Last updated: January 1, 2025 &middot; Effective: January 1, 2025
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
                  高棉职通车 (Khmer Career Express) (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
                  is committed to protecting your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your personal information when you use our platform,
                  in compliance with the{' '}
                  <strong className="text-gold-dark">Kingdom of Cambodia&apos;s 2025 Data Protection Law</strong>{' '}
                  and other applicable regulations.
                </p>
                <p className="text-body text-charcoal leading-relaxed">
                  By using our platform, you consent to the practices described in this policy.
                  If you do not agree, please discontinue use of our services immediately.
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

              {/* Closing */}
              <div className="bg-cream rounded-2xl border border-sand p-6 md:p-8">
                <p className="text-body-small text-warm-gray leading-relaxed">
                  This Privacy Policy is governed by the laws of the Kingdom of Cambodia.
                  Any disputes shall be resolved through the courts of Phnom Penh.
                  We may update this policy periodically; changes will be posted with a revised effective date.
                  Continued use of the platform after changes constitutes acceptance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
