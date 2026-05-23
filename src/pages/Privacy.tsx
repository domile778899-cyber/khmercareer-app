import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Database,
  Eye,
  Share2,
  UserCheck,
  Archive,
  Lock,
  Cookie,
  ChevronRight,
  Calendar,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Server,
  Key,
  Clock,
  Users,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';

const sections = [
  { key: 'collection', icon: Database, title: 'Data Collection', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'usage', icon: Eye, title: 'Data Usage', color: 'text-emerald', bg: 'bg-emerald/10' },
  { key: 'sharing', icon: Share2, title: 'Data Sharing', color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'rights', icon: UserCheck, title: 'User Rights', color: 'text-gold-dark', bg: 'bg-gold/10' },
  { key: 'retention', icon: Archive, title: 'Data Retention', color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'security', icon: Lock, title: 'Data Security', color: 'text-coral', bg: 'bg-coral/10' },
  { key: 'cookies', icon: Cookie, title: 'Cookie Policy', color: 'text-pink-600', bg: 'bg-pink-50' },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState('collection');

  const lastUpdated = 'May 15, 2024';

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <div className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-desktop mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-warm-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-warm-gray text-base md:text-lg">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-warm-gray">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Last updated: {lastUpdated}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald" /> GDPR Compliant
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-container-desktop mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24 space-y-2">
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-3 px-3">Sections</p>
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeSection === section.key
                      ? 'bg-gold/10 text-charcoal'
                      : 'text-warm-gray hover:text-charcoal hover:bg-sand/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${section.bg} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`w-4 h-4 ${section.color}`} />
                  </div>
                  <span className="flex-1">{section.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${activeSection === section.key ? 'rotate-90 text-gold' : 'text-warm-gray'}`} />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-sand">
                <a
                  href="mailto:dpo@khmerjob.com"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-warm-gray hover:text-charcoal hover:bg-sand/30 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Contact DPO
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
            {/* Quick Summary */}
            <div className="bg-emerald/5 border border-emerald/20 rounded-xl p-6 mb-8">
              <h2 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald" />
                At a Glance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Lock, text: '256-bit encryption for all data' },
                  { icon: Users, text: 'Data never sold to third parties' },
                  { icon: Trash2, text: 'Request deletion at any time' },
                  { icon: Download, text: 'Export your data anytime' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-charcoal">
                    <item.icon className="w-4 h-4 text-emerald flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Data Collection */}
            {activeSection === 'collection' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Data Collection</h2>
                </div>

                <div className="prose prose-sm max-w-none text-charcoal">
                  <p className="leading-relaxed mb-4">
                    We collect information to provide better services to all our users. The types of data we collect include:
                  </p>

                  <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gold" />
                    Information You Provide
                  </h3>
                  <div className="bg-cream rounded-lg p-4 space-y-3">
                    {[
                      { label: 'Account Information', desc: 'Name, email address, phone number, password, and profile photo when you register.' },
                      { label: 'Professional Information', desc: 'Resume, work experience, education, skills, certifications, and portfolio links.' },
                      { label: 'Application Data', desc: 'Job applications, cover letters, interview schedules, and communication with employers.' },
                      { label: 'Payment Information', desc: 'Billing address and payment method details for premium services (processed by secure third-party providers).' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-sm text-warm-gray">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3 flex items-center gap-2">
                    <Server className="w-4 h-4 text-gold" />
                    Automatically Collected Information
                  </h3>
                  <div className="bg-cream rounded-lg p-4 space-y-3">
                    {[
                      { label: 'Device Information', desc: 'IP address, browser type, operating system, device identifiers.' },
                      { label: 'Usage Data', desc: 'Pages visited, time spent, clicks, search queries, job preferences.' },
                      { label: 'Location Data', desc: 'General location based on IP address (with your consent for precise location).' },
                      { label: 'Cookies & Similar Technologies', desc: 'See our Cookie Policy section for detailed information.' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-sm text-warm-gray">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section: Data Usage */}
            {activeSection === 'usage' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-emerald" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Data Usage</h2>
                </div>
                <p className="text-charcoal leading-relaxed">
                  We use the collected data for the following purposes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: FileText, title: 'Service Provision', desc: 'To operate and maintain our platform, process job applications, and connect job seekers with employers.' },
                    { icon: Globe, title: 'Personalization', desc: 'To recommend relevant jobs, courses, and content based on your profile and activity.' },
                    { icon: Mail, title: 'Communication', desc: 'To send job alerts, application updates, interview reminders, and important account notifications.' },
                    { icon: Shield, title: 'Security', desc: 'To detect fraud, prevent abuse, and ensure the safety of our platform and users.' },
                    { icon: AlertCircle, title: 'Legal Compliance', desc: 'To comply with applicable laws, regulations, and legal processes.' },
                    { icon: Key, title: 'Account Management', desc: 'To authenticate your identity and manage your account settings and preferences.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-warm-white border border-sand rounded-xl p-4"
                    >
                      <item.icon className="w-5 h-5 text-gold mb-2" />
                      <h4 className="font-medium text-charcoal text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-warm-gray">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: Data Sharing */}
            {activeSection === 'sharing' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Data Sharing</h2>
                </div>
                <div className="bg-coral/5 border border-coral/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-charcoal flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                    We do not sell your personal data. We only share data with trusted partners as described below.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'With Employers', desc: 'When you apply for a job, your resume and profile information are shared with the respective employer. You control what information is visible on your profile.' },
                    { title: 'Service Providers', desc: 'We work with third-party providers for hosting, payment processing, email delivery, and analytics. All providers are contractually obligated to protect your data.' },
                    { title: 'Legal Requirements', desc: 'We may disclose data if required by law, court order, or government request, or to protect our rights and safety.' },
                    { title: 'Business Transfers', desc: 'In the event of a merger, acquisition, or sale of assets, your data may be transferred with prior notice.' },
                    { title: 'With Your Consent', desc: 'We may share data with third parties when you explicitly authorize us to do so.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-warm-white border border-sand rounded-xl p-5"
                    >
                      <h4 className="font-medium text-charcoal mb-1">{item.title}</h4>
                      <p className="text-sm text-warm-gray">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: User Rights */}
            {activeSection === 'rights' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-gold-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Your Rights</h2>
                </div>
                <p className="text-charcoal leading-relaxed">
                  Under applicable data protection laws, you have the following rights regarding your personal data:
                </p>
                <div className="space-y-3">
                  {[
                    { right: 'Right to Access', desc: 'Request a copy of all personal data we hold about you.' },
                    { right: 'Right to Rectification', desc: 'Correct any inaccurate or incomplete personal data.' },
                    { right: 'Right to Erasure', desc: 'Request deletion of your personal data ("right to be forgotten").' },
                    { right: 'Right to Restrict Processing', desc: 'Limit how we use your personal data in certain circumstances.' },
                    { right: 'Right to Data Portability', desc: 'Receive your data in a structured, machine-readable format.' },
                    { right: 'Right to Object', desc: 'Opt out of certain data uses, including direct marketing.' },
                    { right: 'Right to Withdraw Consent', desc: 'Revoke previously given consent at any time.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 bg-warm-white border border-sand rounded-lg p-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-charcoal">{item.right}</p>
                        <p className="text-sm text-warm-gray">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-warm-gray">
                  To exercise any of these rights, please contact our Data Protection Officer at{' '}
                  <a href="mailto:dpo@khmerjob.com" className="text-gold hover:underline">dpo@khmerjob.com</a>.
                  We will respond within 30 days.
                </p>
              </motion.div>
            )}

            {/* Section: Data Retention */}
            {activeSection === 'retention' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Data Retention</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Active Accounts', desc: 'We retain your personal data for as long as your account is active or as needed to provide you services.' },
                    { title: 'Inactive Accounts', desc: 'If your account is inactive for 24 months, we may send a notification and begin the data deletion process after an additional 30-day grace period.' },
                    { title: 'Application Records', desc: 'Job application data is retained for 3 years to comply with employment regulations and for your reference.' },
                    { title: 'Deleted Accounts', desc: 'Upon account deletion, most personal data is removed within 30 days. Some data may be retained longer as required by law (up to 7 years for financial records).' },
                    { title: 'Anonymized Data', desc: 'After deletion, some data may be retained in anonymized form for analytics and platform improvement purposes.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-warm-white border border-sand rounded-xl p-5">
                      <h4 className="font-medium text-charcoal mb-1 flex items-center gap-2">
                        <Archive className="w-4 h-4 text-warm-gray" />
                        {item.title}
                      </h4>
                      <p className="text-sm text-warm-gray">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: Data Security */}
            {activeSection === 'security' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-coral" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Data Security</h2>
                </div>
                <p className="text-charcoal leading-relaxed">
                  We implement comprehensive security measures to protect your personal data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Lock, title: 'Encryption', desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256).' },
                    { icon: Key, title: 'Access Control', desc: 'Role-based access controls limit data access to authorized personnel only.' },
                    { icon: Shield, title: 'Regular Audits', desc: 'Quarterly security audits and penetration testing by third-party experts.' },
                    { icon: Server, title: 'Secure Infrastructure', desc: 'Data stored in SOC 2 Type II certified data centers.' },
                    { icon: AlertCircle, title: 'Incident Response', desc: '24/7 security monitoring with incident response procedures.' },
                    { icon: Users, title: 'Employee Training', desc: 'All staff undergo annual data protection and security awareness training.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-warm-white border border-sand rounded-xl p-4"
                    >
                      <item.icon className="w-5 h-5 text-gold mb-2" />
                      <h4 className="font-medium text-charcoal text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-warm-gray">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section: Cookies */}
            {activeSection === 'cookies' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Cookie Policy</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-charcoal leading-relaxed">
                    Cookies are small text files stored on your device that help us provide and improve our services.
                  </p>

                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-3">Types of Cookies We Use</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Essential Cookies', required: true, desc: 'Required for the platform to function. Cannot be disabled.' },
                        { name: 'Functional Cookies', required: false, desc: 'Remember your preferences and settings.' },
                        { name: 'Analytics Cookies', required: false, desc: 'Help us understand how users interact with our platform.' },
                        { name: 'Marketing Cookies', required: false, desc: 'Used to deliver relevant advertisements and track their performance.' },
                      ].map((cookie, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 pb-3 border-b border-sand last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium text-sm text-charcoal">{cookie.name}</p>
                            <p className="text-xs text-warm-gray">{cookie.desc}</p>
                          </div>
                          {cookie.required ? (
                            <span className="text-xs text-warm-gray bg-sand px-2 py-0.5 rounded-full flex-shrink-0">Required</span>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-sand peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold" />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-warm-white border border-sand rounded-xl p-5">
                    <h4 className="font-medium text-charcoal mb-2">Managing Cookies</h4>
                    <p className="text-sm text-warm-gray mb-3">
                      You can manage your cookie preferences through our cookie banner or your browser settings.
                      Most browsers allow you to refuse or delete cookies. Note that disabling cookies may affect platform functionality.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1">
                        Chrome <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://support.mozilla.org/kb/enable-and-disable-cookies" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1">
                        Firefox <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://support.apple.com/guide/safari/manage-cookies" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1">
                        Safari <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Section */}
            <div className="mt-10 pt-8 border-t border-sand">
              <div className="bg-charcoal rounded-xl p-6 text-center">
                <h3 className="font-semibold text-warm-white mb-2">Questions about your privacy?</h3>
                <p className="text-sm text-warm-gray mb-4">
                  Our Data Protection Officer is here to help with any privacy-related concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:dpo@khmerjob.com"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-deep-brown text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    dpo@khmerjob.com
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

import { Link } from 'react-router-dom';
