import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  ChevronRight,
  Calendar,
  AlertTriangle,
  CreditCard,
  XCircle,
  Scale,
  Lightbulb,
  Gavel,
  RefreshCw,
  Mail,
  Shield,
  UserCheck,
  Lock,
  Globe,
  Bookmark,
  ExternalLink,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sectionList = [
  { key: 'acceptance', icon: CheckCircle, label: 'Acceptance' },
  { key: 'obligations', icon: UserCheck, label: 'Obligations' },
  { key: 'payments', icon: CreditCard, label: 'Payments' },
  { key: 'termination', icon: XCircle, label: 'Termination' },
  { key: 'liability', icon: Scale, label: 'Liability' },
  { key: 'intellectual', icon: Lightbulb, label: 'IP Rights' },
  { key: 'disputes', icon: Gavel, label: 'Disputes' },
  { key: 'governing', icon: Globe, label: 'Governing Law' },
  { key: 'amendments', icon: RefreshCw, label: 'Amendments' },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <div className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-coral rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-desktop mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-warm-white mb-4">
              Terms of Service
            </h1>
            <p className="text-warm-gray text-base md:text-lg">
              Please read these terms carefully before using our platform. By accessing our services, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-warm-gray">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Effective: January 1, 2024
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> Version 4.0
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-container-desktop mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24 space-y-2">
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-3 px-3">Table of Contents</p>
              {sectionList.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeSection === section.key
                      ? 'bg-gold/10 text-charcoal'
                      : 'text-warm-gray hover:text-charcoal hover:bg-sand/30'
                  }`}
                >
                  <section.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === section.key ? 'text-gold' : 'text-warm-gray'}`} />
                  <span className="flex-1">{section.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${activeSection === section.key ? 'rotate-90 text-gold' : 'text-warm-gray'}`} />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-sand">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-warm-gray hover:text-charcoal hover:bg-sand/30 transition-all w-full">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <a href="mailto:legal@khmerjob.com" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-warm-gray hover:text-charcoal hover:bg-sand/30 transition-all">
                  <Mail className="w-4 h-4" />
                  Contact Legal
                </a>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Agreement Acceptance Banner */}
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-charcoal text-sm mb-1">Important Notice</p>
                  <p className="text-sm text-warm-gray">
                    By using Khmer Job Express (&#34;Platform&#34;, &#34;we&#34;, &#34;us&#34;), you agree to these Terms of Service and our{' '}
                    <Link to="/privacy" className="text-gold hover:underline inline-flex items-center gap-0.5">
                      Privacy Policy <ExternalLink className="w-3 h-3" />
                    </Link>.
                    If you do not agree, please discontinue use immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Acceptance */}
            {activeSection === 'acceptance' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Acceptance of Terms</h2>
                </div>

                <div className="prose prose-sm max-w-none text-charcoal space-y-4">
                  <p className="leading-relaxed">
                    These Terms of Service (&#34;Terms&#34;) constitute a legally binding agreement between you and Khmer Job Express 
                    regarding your use of our website, mobile applications, and related services (collectively, the &#34;Platform&#34;).
                  </p>

                  <div className="bg-cream rounded-lg p-5">
                    <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-gold" />
                      Key Points
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'You must be at least 16 years old to use our Platform.',
                        'You are responsible for maintaining the confidentiality of your account credentials.',
                        'You agree to provide accurate and truthful information at all times.',
                        'These terms may be updated periodically with notice provided.',
                        'Continued use after changes constitutes acceptance of the updated terms.',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h4 className="text-lg font-semibold text-charcoal mt-6">Eligibility</h4>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    By using the Platform, you represent and warrant that you are at least 16 years of age, 
                    or if you are using the Platform on behalf of a company or organization, that you have 
                    the authority to bind such entity to these Terms. If you are under 16, you may only use 
                    the Platform with the consent and supervision of a parent or guardian.
                  </p>

                  <h4 className="text-lg font-semibold text-charcoal mt-6">Account Registration</h4>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    To access certain features, you must register for an account. You agree to provide accurate, 
                    current, and complete information during registration and to keep this information updated. 
                    You are solely responsible for all activities that occur under your account. Notify us 
                    immediately of any unauthorized use of your account.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Section: Obligations */}
            {activeSection === 'obligations' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-gold-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">User Obligations</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald" />
                      Job Seekers
                    </h4>
                    <ul className="space-y-2 text-sm text-warm-gray">
                      {[
                        'Provide accurate information in your profile, resume, and applications.',
                        'Do not apply for jobs you are not genuinely interested in or qualified for.',
                        'Respond to employer communications in a timely and professional manner.',
                        'Do not create multiple accounts or use false identities.',
                        'Respect employer privacy and do not share interview questions or proprietary information.',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gold" />
                      Employers
                    </h4>
                    <ul className="space-y-2 text-sm text-warm-gray">
                      {[
                        'Post accurate and truthful job listings with complete information.',
                        'Respond to all applicants within a reasonable timeframe.',
                        'Do not discriminate based on race, gender, religion, age, or disability.',
                        'Do not charge applicants any fees for job applications or interviews.',
                        'Maintain confidentiality of applicant information and do not share it with unauthorized parties.',
                        'Remove filled positions promptly to avoid misleading candidates.',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-coral/5 border border-coral/20 rounded-xl p-5">
                    <h4 className="font-medium text-coral mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Prohibited Conduct
                    </h4>
                    <p className="text-sm text-charcoal mb-2">The following activities are strictly prohibited:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-warm-gray">
                      {[
                        'Spam or phishing attempts',
                        'Malware or virus distribution',
                        'Data scraping or harvesting',
                        'Impersonation of others',
                        'Fraudulent job postings',
                        'Harassment of other users',
                        'Circumventing platform fees',
                        'Posting offensive content',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section: Payments */}
            {activeSection === 'payments' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Payments</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Free Services', desc: 'Job seeker accounts, basic resume builder, job search, and limited job applications are provided free of charge.' },
                    { title: 'Premium Services', desc: 'Employers may purchase job posting credits, featured listings, and recruitment tools. Pricing is available on our Pricing page.' },
                    { title: 'Payment Terms', desc: 'All payments are processed securely through third-party payment processors. Fees are charged upfront and are non-refundable unless otherwise stated.' },
                    { title: 'Subscriptions', desc: 'Recurring subscriptions automatically renew unless cancelled at least 24 hours before the renewal date. You can cancel anytime from your account settings.' },
                    { title: 'Late Payments', desc: 'Failure to pay may result in service suspension. We reserve the right to charge interest on overdue amounts at 1.5% per month.' },
                    { title: 'Taxes', desc: 'You are responsible for all applicable taxes. Prices displayed may exclude VAT or other applicable taxes.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-warm-white border border-sand rounded-xl p-5"
                    >
                      <h4 className="font-medium text-charcoal mb-1">{item.title}</h4>
                      <p className="text-sm text-warm-gray">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: Termination */}
            {activeSection === 'termination' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-coral" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Termination</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-2">By You</h4>
                    <p className="text-sm text-warm-gray">
                      You may terminate your account at any time by visiting your account settings or contacting support. 
                      Upon termination, your access to the Platform will be revoked. Some data may be retained as required by law.
                    </p>
                  </div>

                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-2">By Us</h4>
                    <p className="text-sm text-warm-gray mb-3">
                      We may suspend or terminate your account immediately, without prior notice, for:
                    </p>
                    <ul className="space-y-1.5 text-sm text-warm-gray">
                      {[
                        'Violation of these Terms',
                        'Fraudulent or illegal activity',
                        'Non-payment of fees',
                        'Extended period of inactivity (24+ months)',
                        'Behavior that harms other users or the Platform',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-cream rounded-lg p-5">
                    <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gold-dark" />
                      Effect of Termination
                    </h4>
                    <p className="text-sm text-warm-gray">
                      Upon termination, all licenses and rights granted to you will immediately cease. 
                      Provisions regarding intellectual property, liability, and dispute resolution survive termination. 
                      You remain liable for any outstanding payments.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section: Liability */}
            {activeSection === 'liability' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Limitation of Liability</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-coral/5 border border-coral/20 rounded-lg p-5">
                    <p className="text-sm text-charcoal">
                      <strong>Important:</strong> The Platform is provided &#34;as is&#34; without warranties of any kind. 
                      We do not guarantee employment outcomes or the accuracy of job postings.
                    </p>
                  </div>

                  {[
                    { title: 'No Warranty', desc: 'We make no representations about the accuracy, reliability, or completeness of any content on the Platform, including job listings and employer information.' },
                    { title: 'Indirect Damages', desc: 'To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.' },
                    { title: 'Liability Cap', desc: 'Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim, or $100 if no payment was made.' },
                    { title: 'User Disputes', desc: 'We are not responsible for disputes between users (job seekers and employers). Any disputes must be resolved directly between the parties.' },
                    { title: 'Third-Party Links', desc: 'The Platform may contain links to third-party websites. We are not responsible for the content or practices of these sites.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-warm-white border border-sand rounded-xl p-5">
                      <h4 className="font-medium text-charcoal mb-1">{item.title}</h4>
                      <p className="text-sm text-warm-gray">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: IP Rights */}
            {activeSection === 'intellectual' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Intellectual Property</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-2">Our IP</h4>
                    <p className="text-sm text-warm-gray">
                      The Platform, including its design, code, logos, trademarks, and content, is owned by 
                      Khmer Job Express and protected by copyright, trademark, and other intellectual property laws. 
                      You may not reproduce, modify, distribute, or create derivative works without our written permission.
                    </p>
                  </div>

                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-2">Your Content</h4>
                    <p className="text-sm text-warm-gray">
                      You retain ownership of content you submit (resumes, applications, messages). 
                      By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, 
                      display, and distribute your content solely for the purpose of operating and improving the Platform.
                    </p>
                  </div>

                  <div className="bg-cream rounded-lg p-5">
                    <h4 className="font-medium text-charcoal mb-2">Feedback</h4>
                    <p className="text-sm text-warm-gray">
                      Any feedback or suggestions you provide may be used by us without restriction or compensation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section: Disputes */}
            {activeSection === 'disputes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Dispute Resolution</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Negotiation', desc: 'In the event of a dispute, both parties agree to first attempt to resolve the matter through good-faith negotiation for at least 30 days.' },
                    { title: 'Mediation', desc: 'If negotiation fails, the dispute will be submitted to mediation in Phnom Penh, Cambodia, under the rules of the National Commercial Arbitration Centre of Cambodia.' },
                    { title: 'Arbitration', desc: 'If mediation fails, the dispute will be resolved by binding arbitration. The arbitration will be conducted in English and Khmer.' },
                    { title: 'Class Action Waiver', desc: 'You agree that any proceedings will be conducted only on an individual basis and not as a class action or representative proceeding.' },
                    { title: 'Injunctive Relief', desc: 'Either party may seek injunctive relief in court to prevent irreparable harm pending the outcome of arbitration.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 bg-warm-white border border-sand rounded-xl p-5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-gold-dark">{i + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-charcoal text-sm">{item.title}</h4>
                        <p className="text-sm text-warm-gray mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: Governing Law */}
            {activeSection === 'governing' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Governing Law</h2>
                </div>
                <p className="text-charcoal leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of the Kingdom of Cambodia, 
                  without regard to its conflict of law provisions. Any legal action or proceeding arising under 
                  these Terms shall be brought exclusively in the courts of Phnom Penh, Cambodia.
                </p>
                <div className="bg-cream rounded-lg p-5">
                  <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gold" />
                    International Users
                  </h4>
                  <p className="text-sm text-warm-gray">
                    If you access the Platform from outside Cambodia, you do so at your own risk and are responsible 
                    for compliance with local laws. The Platform is controlled and operated from Cambodia, and we 
                    make no representation that the content is appropriate for use in other locations.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Section: Amendments */}
            {activeSection === 'amendments' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Amendments</h2>
                </div>
                <p className="text-charcoal leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
                  posting to the Platform. We will notify users of material changes via email or prominent notice 
                  on the Platform.
                </p>
                <div className="bg-warm-white border border-sand rounded-xl p-5">
                  <h4 className="font-medium text-charcoal mb-3">Change Notification Process</h4>
                  <div className="space-y-3">
                    {[
                      { step: '1', desc: 'Material changes will be announced 30 days before taking effect.' },
                      { step: '2', desc: 'Notice will be sent to your registered email address.' },
                      { step: '3', desc: 'A banner notification will appear on the Platform upon login.' },
                      { step: '4', desc: 'Continued use after the effective date constitutes acceptance.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gold-dark">{item.step}</span>
                        </div>
                        <p className="text-sm text-warm-gray">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-coral/5 border border-coral/20 rounded-lg p-4">
                  <p className="text-sm text-charcoal flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                    If you do not agree with the updated Terms, you must stop using the Platform before the changes take effect.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Contact Section */}
            <div className="mt-10 pt-8 border-t border-sand">
              <div className="bg-charcoal rounded-xl p-6 text-center">
                <h3 className="font-semibold text-warm-white mb-2">Questions about these terms?</h3>
                <p className="text-sm text-warm-gray mb-4">
                  Our legal team is available to clarify any provisions of these Terms of Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:legal@khmerjob.com"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-deep-brown text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    legal@khmerjob.com
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-warm-white/20 text-warm-white hover:bg-warm-white/5 text-sm font-medium rounded-lg transition-colors"
                  >
                    Contact Form
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
