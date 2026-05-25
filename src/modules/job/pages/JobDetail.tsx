import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  ChevronLeft,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Users,
  AlertTriangle,
  Facebook,
  Send,
  Copy,
  Check,
  Briefcase,
  Upload,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  FileText,
  Shield,
} from 'lucide-react'
import { logger } from '@/shared/logger';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useApply } from '@/stores/ApplyContext'
import OneClickApply from '@/components/OneClickApply'

// ─── Types ───────────────────────────────────────────────
interface Job {
  id: number
  title: string
  company: string
  verified: boolean
  location: string
  salaryMin: number
  salaryMax: number
  type: string
  experience: string
  industry: string
  posted: string
  postedDays: number
  description: string
  descriptionKh: string
  descriptionZh: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  education: string
  positions: number
  deadline: string
  urgent?: boolean
  featured?: boolean
  views: number
  employerType: string
  companyDescription: string
  companyDescriptionKh: string
  companyDescriptionZh: string
  companyEmployees: string
  companyFounded: string
  companyOpenJobs: number
  companyMemberSince: string
}

// ─── Mock Data ───────────────────────────────────────────
const JOBS_DATA: Record<number, Job> = {
  1: {
    id: 1,
    title: 'Senior Garment QC Inspector',
    company: 'Premium Garment Co.',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 350,
    salaryMax: 500,
    type: 'Full-time',
    experience: '3+ years',
    industry: 'Garment & Textile',
    posted: '2 days ago',
    postedDays: 2,
    description: 'We are seeking experienced Quality Control Inspectors to join our growing garment factory in Phnom Penh. You will work on high-quality garment production for international export brands, ensuring all products meet the highest quality standards before shipment. This is an excellent opportunity to work with a leading garment manufacturer that exports to EU and US markets.',
    descriptionKh: 'យើងកំពុងស្វែងរកអ្នកត្រួតពិនិត្យគុណភាពដែលមានបទពិសោធន៍ដើម្បីចូលរួមក្រុមហ៊ុនផលិតសម្លៀកបំពាក់របស់យើងនៅភ្នំពេញ។',
    descriptionZh: '我们正在寻找有经验的质量检验员加入我们在金边不断发展的服装厂。您将从事面向国际出口品牌的高质量服装生产。',
    requirements: [
      'Minimum 3 years experience in garment quality control',
      'Experience with international quality standards (AQL 1.5, 2.5)',
      'Knowledge of garment construction and defect classification',
      'Ability to work with international buyers and auditors',
      'Basic computer skills for reporting',
      'Willing to work overtime during peak season',
    ],
    responsibilities: [
      'Inspect garments at various stages of production',
      'Record and report quality issues to production manager',
      'Work with production team to resolve quality problems',
      'Maintain inspection records and prepare quality reports',
      'Train junior QC staff on inspection procedures',
      'Ensure compliance with buyer specifications',
    ],
    benefits: [
      'Health insurance',
      'Free lunch',
      'Transportation provided',
      'Housing allowance',
      'Annual bonus',
      'Skills training',
    ],
    education: 'High School or equivalent',
    positions: 5,
    deadline: 'Open until filled',
    urgent: true,
    views: 234,
    employerType: 'Verified',
    companyDescription: 'Premium Garment Co. is a leading garment manufacturer exporting to EU and US markets. With over 500 employees and ISO 9001 certification, we maintain the highest standards in Cambodian garment production.',
    companyDescriptionKh: 'Premium Garment Co. គឺជាក្រុមហ៊ុនផលិតសម្លៀកបំពាក់ឈានមុខគេក្នុងការនាំចេញទៅទីផ្សារអឺរ៉ុប និងអាមេរិក។',
    companyDescriptionZh: 'Premium Garment Co. 是一家领先的服装制造商，出口到欧盟和美国市场。',
    companyEmployees: '500+',
    companyFounded: '2015',
    companyOpenJobs: 12,
    companyMemberSince: '2023',
  },
  2: {
    id: 2,
    title: 'Chinese-Speaking HR Assistant',
    company: 'Dragon Steel Cambodia',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 400,
    salaryMax: 600,
    type: 'Full-time',
    experience: '1-2 years',
    industry: 'Manufacturing',
    posted: '2 days ago',
    postedDays: 2,
    description: 'Dragon Steel Cambodia is looking for a Chinese-speaking HR Assistant to support our growing team. You will assist with recruitment, employee relations, payroll, and serve as a bridge between Chinese management and local staff.',
    descriptionKh: 'Dragon Steel Cambodia កំពុងស្វែងរកអ្នកជំនួយការធនធានមនុស្សដែលនិយាយភាសាចិនដើម្បីគាំទ្រក្រុមការងាររបស់យើង។',
    descriptionZh: 'Dragon Steel Cambodia 正在寻找一位会中文的人力资源助理来支持我们不断壮大的团队。',
    requirements: [
      'Fluent in Chinese (Mandarin) - speaking, reading, writing',
      'Good command of Khmer and English',
      '1-2 years of HR or administrative experience',
      'Proficiency in Microsoft Office',
      'Good interpersonal and communication skills',
      'Detail-oriented and organized',
    ],
    responsibilities: [
      'Assist in recruitment and onboarding of new employees',
      'Translate documents between Chinese, Khmer, and English',
      'Maintain employee records and HR database',
      'Coordinate training programs',
      'Handle employee inquiries and grievances',
      'Assist with payroll processing',
    ],
    benefits: [
      'Health insurance',
      'Free lunch',
      'Annual bonus',
      'Skills training',
      'Paid leave',
    ],
    education: 'Bachelor\'s degree',
    positions: 2,
    deadline: '2025-08-15',
    views: 189,
    employerType: 'Chinese Enterprise',
    companyDescription: 'Dragon Steel Cambodia is a leading steel manufacturing company with Chinese investment, employing over 300 staff across Phnom Penh.',
    companyDescriptionKh: 'Dragon Steel Cambodia គឺជាក្រុមហ៊ុនផលិតដែកឈានមុខគេដែលមានទុនវិនិយោគចិន។',
    companyDescriptionZh: 'Dragon Steel Cambodia 是一家领先的钢铁制造公司，拥有中国投资。',
    companyEmployees: '300+',
    companyFounded: '2018',
    companyOpenJobs: 8,
    companyMemberSince: '2024',
  },
  3: {
    id: 3,
    title: 'Hotel Front Office Manager',
    company: 'Raffles Grand Hotel',
    verified: true,
    location: 'Siem Reap',
    salaryMin: 800,
    salaryMax: 1200,
    type: 'Full-time',
    experience: '5+ years',
    industry: 'Tourism & Hospitality',
    posted: '3 days ago',
    postedDays: 3,
    description: 'Lead the front office operations at one of Siem Reap\'s most prestigious hotels. You will oversee guest check-in/check-out, manage the front desk team, and ensure world-class service standards.',
    descriptionKh: 'ដឹកនាំប្រតិបត្តិការការិយាល័យខាងមុខនៅសណ្ឋាគារដ៏មានកិត្យានុភាពបំផុតមួយនៅសៀមរាប។',
    descriptionZh: '领导暹粒最负盛名的酒店之一的前厅部运营。',
    requirements: [
      '5+ years of hotel front office experience',
      'Previous supervisory or management experience',
      'Fluency in English and Khmer',
      'Knowledge of hotel management software (Opera preferred)',
      'Exceptional customer service skills',
      'Ability to handle guest complaints professionally',
    ],
    responsibilities: [
      'Oversee daily front office operations',
      'Manage front desk team schedules and performance',
      'Ensure smooth check-in and check-out processes',
      'Handle VIP guest relations',
      'Coordinate with housekeeping and maintenance teams',
      'Prepare daily revenue and occupancy reports',
    ],
    benefits: [
      'Health insurance',
      'Free meals',
      'Housing allowance',
      'Annual bonus',
      'Staff discounts',
      'Training opportunities',
    ],
    education: 'Bachelor\'s degree in Hospitality',
    positions: 1,
    deadline: '2025-07-30',
    views: 312,
    employerType: 'Multinational',
    companyDescription: 'Raffles Grand Hotel is a luxury heritage hotel in the heart of Siem Reap, offering world-class hospitality near the magnificent Angkor Wat temple complex.',
    companyDescriptionKh: 'សណ្ឋាគារ Raffles Grand គឺជាសណ្ឋាគារប្រណីតបេតិកភណ្ឌនៅចំកណ្តាលសៀមរាប។',
    companyDescriptionZh: 'Raffles Grand Hotel 是暹粒市中心的一家豪华传统酒店。',
    companyEmployees: '200+',
    companyFounded: '2010',
    companyOpenJobs: 5,
    companyMemberSince: '2022',
  },
}

// Default job for IDs without specific data
const DEFAULT_JOB: Job = {
  id: 4,
  title: 'React Native Developer',
  company: 'GrowHub Tech',
  verified: true,
  location: 'Phnom Penh',
  salaryMin: 1000,
  salaryMax: 1800,
  type: 'Full-time',
  experience: '2-4 years',
  industry: 'ICT & Technology',
  posted: '5 hours ago',
  postedDays: 0,
  description: 'Join our growing tech team to build mobile applications for local and international clients. You will work on cutting-edge React Native projects using modern development practices.',
  descriptionKh: 'ចូលរួមក្រុមបច្ចេកវិទ្យារបស់យើងដើម្បីបង្កើតកម្មវិធីទូរស័ព្ទចល័តសម្រាប់អតិថិជនក្នុងស្រុក និងអន្តរជាតិ។',
  descriptionZh: '加入我们不断壮大的技术团队，为本地和国际客户构建移动应用程序。',
  requirements: [
    '2+ years React Native development experience',
    'Strong TypeScript skills',
    'Experience with REST APIs and GraphQL',
    'Knowledge of state management (Redux, Zustand)',
    'Experience with CI/CD pipelines',
    'Good problem-solving skills',
  ],
  responsibilities: [
    'Develop and maintain React Native mobile applications',
    'Collaborate with designers and backend developers',
    'Write clean, maintainable, and testable code',
    'Participate in code reviews',
    'Debug and fix production issues',
    'Stay updated with the latest mobile development trends',
  ],
  benefits: [
    'Health insurance',
    'Flexible working hours',
    'Remote work options',
    'Annual bonus',
    'Conference budget',
    'Latest MacBook Pro',
  ],
  education: 'Bachelor\'s degree in CS or related',
  positions: 3,
  deadline: 'Open until filled',
  featured: true,
  views: 456,
  employerType: 'Verified',
  companyDescription: 'GrowHub Tech is a leading Cambodian tech company specializing in mobile app development and digital solutions for startups and enterprises.',
  companyDescriptionKh: 'GrowHub Tech គឺជាក្រុមហ៊ុនបច្ចេកវិទ្យាកម្ពុជាឈានមុខគេដែលមានជំនាញពិសេសក្នុងការអភិវឌ្ឍកម្មវិធីទូរស័ព្ទចល័ត។',
  companyDescriptionZh: 'GrowHub Tech 是一家领先的柬埔寨科技公司，专注于移动应用程序开发。',
  companyEmployees: '80+',
  companyFounded: '2019',
  companyOpenJobs: 6,
  companyMemberSince: '2023',
}

function getJob(id: number): Job {
  return JOBS_DATA[id] || { ...DEFAULT_JOB, id }
}

// ─── Mock Similar Jobs ──────────────────────────────────
function getSimilarJobs(currentId: number): Array<{
  id: number
  title: string
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  type: string
  verified: boolean
}> {
  const all = [
    { id: 5, title: 'Factory Production Supervisor', company: 'New Wide Garment', location: 'Kandal', salaryMin: 500, salaryMax: 700, type: 'Full-time', verified: true },
    { id: 6, title: 'Tour Guide (Chinese-speaking)', company: 'Angkor Wonder Tours', location: 'Siem Reap', salaryMin: 300, salaryMax: 500, type: 'Contract', verified: true },
    { id: 7, title: 'Accounting Officer', company: 'Chip Mong Bank', location: 'Phnom Penh', salaryMin: 600, salaryMax: 900, type: 'Full-time', verified: true },
    { id: 8, title: 'Electrical Engineer', company: 'SchneiTec Cambodia', location: 'Sihanoukville', salaryMin: 1200, salaryMax: 2000, type: 'Full-time', verified: true },
    { id: 9, title: 'English Teacher', company: 'Western International School', location: 'Phnom Penh', salaryMin: 500, salaryMax: 800, type: 'Full-time', verified: true },
    { id: 10, title: 'Construction Site Supervisor', company: 'OCIC Group', location: 'Phnom Penh', salaryMin: 700, salaryMax: 1000, type: 'Full-time', verified: true },
  ]
  return all.filter((j) => j.id !== currentId).slice(0, 3)
}

// ─── Components ──────────────────────────────────────────
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-emerald to-emerald-light text-white text-caption px-2 py-0.5 rounded-full animate-pulse-glow">
      <Shield className="w-3 h-3" />
      Verified
    </span>
  )
}

function UrgentBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-coral to-warning text-white text-caption px-2 py-0.5 rounded-full">
      Urgent Hiring
    </span>
  )
}

function GoldUnderline() {
  return <div className="w-[60px] h-[2px] bg-gold mt-2 mb-4" />
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-cream last:border-b-0">
      <Icon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
      <div>
        <p className="text-caption text-warm-gray">{label}</p>
        <p className="text-body-small text-charcoal font-medium">{value}</p>
      </div>
    </div>
  )
}

function BenefitPill({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-cream border border-sand rounded-full px-4 py-2 text-body-small text-charcoal">
      <Icon className="w-4 h-4 text-gold" />
      {label}
    </span>
  )
}

// ─── Application Modal ───────────────────────────────────
function ApplicationModal({
  job,
  open,
  onClose,
}: {
  job: Job | null
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    experience: '',
    expectedSalary: '',
    message: '',
    agree: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setStep('form')
      setFormData({ fullName: '', phone: '', email: '', experience: '', expectedSalary: '', message: '', agree: false })
      setFile(null)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('success')
    }, 1500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-white rounded-2xl border border-sand shadow-[0_24px_48px_rgba(0,0,0,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-h3 text-charcoal pr-8">
            {step === 'form' ? `Apply for ${job.title}` : 'Application Submitted!'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4 mt-2"
            >
              {/* Full Name */}
              <div>
                <label className="text-body-small text-charcoal font-medium mb-1 block">
                  Full Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-12 px-4 border-2 border-sand rounded-xl text-body text-charcoal placeholder:text-warm-gray focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-body-small text-charcoal font-medium mb-1 block">
                  Phone Number <span className="text-coral">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 border-2 border-sand rounded-xl text-body text-charcoal placeholder:text-warm-gray focus:border-gold outline-none transition-all"
                    placeholder="012 345 678"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-body-small text-charcoal font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 border-2 border-sand rounded-xl text-body text-charcoal placeholder:text-warm-gray focus:border-gold outline-none transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              {/* Experience + Salary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-body-small text-charcoal font-medium mb-1 block">Years of Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full h-12 px-3 border-2 border-sand rounded-xl text-body-small text-charcoal bg-white focus:border-gold outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option>0-1 year</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="text-body-small text-charcoal font-medium mb-1 block">Expected Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                    <input
                      type="text"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 border-2 border-sand rounded-xl text-body text-charcoal placeholder:text-warm-gray focus:border-gold outline-none transition-all"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="text-body-small text-charcoal font-medium mb-1 block">Upload Resume</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-gold hover:bg-[rgba(212,175,55,0.05)]',
                    file ? 'border-emerald bg-emerald-light/30' : 'border-sand'
                  )}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-emerald">
                      <FileText className="w-5 h-5" />
                      <span className="text-body-small font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
                      <p className="text-body-small text-warm-gray">
                        Drag & drop or <span className="text-gold font-medium">browse</span>
                      </p>
                      <p className="text-caption text-warm-gray mt-1">PDF, DOC up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-body-small text-charcoal font-medium mb-1 block">Message to Employer</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-sand rounded-xl text-body-small text-charcoal placeholder:text-warm-gray focus:border-gold outline-none transition-all resize-none"
                  placeholder="Why are you a good fit for this role?"
                />
              </div>

              {/* Agree checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    formData.agree ? 'bg-gold border-gold' : 'border-sand'
                  )}
                  onClick={() => setFormData({ ...formData, agree: !formData.agree })}
                >
                  {formData.agree && <Check className="w-3.5 h-3.5 text-[#1A1714]" />}
                </div>
                <span className="text-body-small text-charcoal">
                  I agree to share my profile with this employer <span className="text-coral">*</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.agree || isSubmitting}
                className="w-full h-14 bg-coral text-white font-semibold rounded-xl shadow-coral hover:bg-coral-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
              <p className="text-caption text-warm-gray text-center flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Your application will be reviewed within 48 hours
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
              className="text-center py-8"
            >
              {/* Animated checkmark */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-light flex items-center justify-center">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald" />
                </motion.div>
              </div>
              <h3 className="text-h3 text-emerald mb-2">Application Submitted!</h3>
              <p className="text-body text-warm-gray mb-6">The employer will contact you soon.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="h-12 px-6 bg-gold text-[#1A1714] font-semibold rounded-xl shadow-gold hover:bg-gold-dark transition-all text-button"
                >
                  View More Jobs
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// ─── Share Bar Component ─────────────────────────────────
function ShareBar({ jobTitle }: { jobTitle: string }) {
  const [copied, setCopied] = useState(false)
  const isMobile = useIsMobile()

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareButtons = [
    { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
    { icon: Send, label: 'Messenger', color: 'bg-[#0084FF]', action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=123456`, '_blank') },
    { icon: MessageSquare, label: 'Telegram', color: 'bg-[#0088CC]', action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(jobTitle)}`, '_blank') },
    { icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy Link', color: 'bg-gold', action: handleCopyLink },
  ]

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-sand shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3"
      >
        <div className="max-w-container-desktop mx-auto flex items-center justify-between">
          <span className="text-body-small text-warm-gray shrink-0">Share:</span>
          <div className="flex items-center gap-2">
            {shareButtons.map((btn, i) => (
              <motion.button
                key={btn.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                onClick={btn.action}
                className={cn('w-11 h-11 rounded-lg flex items-center justify-center text-white transition-transform hover:scale-110', btn.color)}
                aria-label={btn.label}
              >
                <btn.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-body-small text-warm-gray">Share this job:</span>
      <div className="flex items-center gap-2">
        {shareButtons.map((btn, i) => (
          <motion.button
            key={btn.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            onClick={btn.action}
            className={cn('w-11 h-11 rounded-lg flex items-center justify-center text-white transition-transform hover:scale-110', btn.color)}
            aria-label={btn.label}
          >
            <btn.icon className="w-5 h-5" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Job Detail Page ────────────────────────────────
export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { hasApplied } = useApply()

  const jobId = Number(id) || 1
  const job = getJob(jobId)
  const isApplied = hasApplied(String(jobId))

  const [savedJobs, setSavedJobs] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('khmerhr-saved-jobs')
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      logger.error('Load saved jobs failed', { error: err, component: 'JobDetail' })
      return []
    }
  })
  const [applyOpen, setApplyOpen] = useState(false)
  const [langTab, setLangTab] = useState<'en' | 'kh' | 'zh'>('en')

  useEffect(() => {
    try {
      localStorage.setItem('khmerhr-saved-jobs', JSON.stringify(savedJobs))
    } catch (err) {
      logger.error('Save saved jobs failed', { error: err, component: 'JobDetail' })
    }
  }, [savedJobs])

  const isSaved = savedJobs.includes(job.id)

  const toggleSave = () => {
    setSavedJobs((prev) => (prev.includes(job.id) ? prev.filter((j) => j !== job.id) : [...prev, job.id]))
  }

  const similarJobs = getSimilarJobs(job.id)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
  }

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const benefitIcons = [Upload, Upload, Upload, Upload, TrendingUp, GraduationCap]

  return (
    <div className={cn('min-h-[100dvh] bg-warm-white', isMobile && 'pb-20')}>
      {/* ====== Section 1: Job Header ====== */}
      <section className="bg-deep-brown pt-[72px] pb-space-12">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="mt-4 mb-4">
            <ol className="flex items-center gap-2 text-caption text-warm-gray flex-wrap">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-gold transition-colors">Home</button>
              </li>
              <span>/</span>
              <li>
                <button onClick={() => navigate('/jobs')} className="hover:text-gold transition-colors">Jobs</button>
              </li>
              <span>/</span>
              <li className="hover:text-gold transition-colors cursor-pointer">{job.industry}</li>
              <span>/</span>
              <li className="text-gold truncate max-w-[200px]">{job.title}</li>
            </ol>
          </nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="text-h1 font-display text-[#FAF8F3] mb-3"
          >
            {job.title}
          </motion.h1>

          {/* Company Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="flex flex-wrap items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-xl border border-sand bg-cream flex items-center justify-center text-gold font-bold text-xl">
              {job.company.charAt(0)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body text-[#FAF8F3] font-medium">{job.company}</span>
              {job.verified && <VerifiedBadge />}
              <span className="flex items-center gap-1 text-body-small text-warm-gray">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            </div>
          </motion.div>

          {/* Quick Info Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4"
          >
            <span className="flex items-center gap-2 text-body text-gold font-mono">
              <DollarSign className="w-5 h-5" />
              ${job.salaryMin} - ${job.salaryMax} / month
            </span>
            <span className="flex items-center gap-2 text-body text-[rgba(250,248,243,0.7)]">
              <Clock className="w-5 h-5" />
              {job.type}
            </span>
            <span className="flex items-center gap-2 text-body-small text-warm-gray">
              <Calendar className="w-4 h-4" />
              {job.posted}
            </span>
            <span className="flex items-center gap-2 text-body-small text-warm-gray">
              <Users className="w-4 h-4" />
              {job.views} views
            </span>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <span className="bg-cream text-charcoal text-caption px-3 py-1 rounded-full border border-sand">{job.industry}</span>
            <span className="bg-cream text-charcoal text-caption px-3 py-1 rounded-full border border-sand">{job.experience}</span>
            <span className="bg-cream text-charcoal text-caption px-3 py-1 rounded-full border border-sand">Senior</span>
            {job.urgent && <UrgentBadge />}
          </motion.div>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="flex flex-wrap gap-3"
          >
            {isApplied ? (
              <span className="h-14 px-8 bg-emerald-light text-emerald font-semibold rounded-xl flex items-center gap-2 text-button">
                <CheckCircle2 className="w-5 h-5" />
                Applied
              </span>
            ) : (
              <>
                <button
                  onClick={() => setApplyOpen(true)}
                  className="h-14 px-8 bg-coral text-white font-semibold rounded-xl shadow-coral hover:bg-coral-dark hover:scale-[1.03] active:scale-[0.98] transition-all text-button flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Apply Now
                </button>
                <OneClickApply
                  jobId={String(jobId)}
                  job={{ id: String(jobId), title: job.title, company: job.company, location: job.location }}
                  variant="outline"
                  size="lg"
                  className="h-14 px-6 border-2 border-gold text-gold hover:bg-gold/10 font-semibold rounded-xl text-button flex items-center gap-2"
                />
              </>
            )}
            <button
              onClick={toggleSave}
              className="h-14 px-6 border-2 border-gold text-gold font-semibold rounded-xl hover:bg-gold/10 transition-all text-button flex items-center gap-2"
            >
              <Bookmark className={cn('w-5 h-5', isSaved && 'fill-gold')} />
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
            {!isMobile && <ShareBar jobTitle={job.title} />}
          </motion.div>
        </div>
      </section>

      {/* ====== Section 2: Job Details & Sidebar ====== */}
      <section className="py-space-12">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Job Details */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0"
            >
              {/* Job Description */}
              <motion.div variants={fadeInUp} custom={0} className="mb-8">
                <h2 className="text-h3 text-charcoal">Job Description</h2>
                <GoldUnderline />

                {/* Language tabs */}
                <div className="flex gap-2 mb-4">
                  {[
                    { key: 'en' as const, label: 'English' },
                    { key: 'kh' as const, label: 'ខ្មែរ' },
                    { key: 'zh' as const, label: '中文' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setLangTab(tab.key)}
                      className={cn(
                        'px-4 py-2 rounded-full text-body-small font-medium transition-all',
                        langTab === tab.key
                          ? 'bg-gold text-[#1A1714]'
                          : 'bg-cream text-warm-gray hover:text-gold'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="text-body text-charcoal leading-[1.7]">
                  {langTab === 'en' ? job.description : langTab === 'kh' ? job.descriptionKh : job.descriptionZh}
                </p>
              </motion.div>

              {/* Requirements */}
              <motion.div variants={fadeInUp} custom={1} className="mb-8">
                <h2 className="text-h3 text-charcoal">Requirements</h2>
                <GoldUnderline />
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span className="text-body text-charcoal">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Responsibilities */}
              <motion.div variants={fadeInUp} custom={2} className="mb-8">
                <h2 className="text-h3 text-charcoal">Responsibilities</h2>
                <GoldUnderline />
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span className="text-body text-charcoal">{resp}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeInUp} custom={3} className="mb-8">
                <h2 className="text-h3 text-charcoal">Benefits</h2>
                <GoldUnderline />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, i) => (
                    <BenefitPill
                      key={i}
                      icon={benefitIcons[i] || CheckCircle2}
                      label={benefit}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Report Link */}
              <button className="flex items-center gap-2 text-caption text-warm-gray hover:text-coral transition-colors mt-4">
                <AlertTriangle className="w-4 h-4" />
                Report this job
              </button>
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="w-full lg:w-[340px] shrink-0 space-y-6"
            >
              {/* Job Summary Card */}
              <div className="bg-white border border-sand rounded-2xl p-6 shadow-card">
                <h3 className="text-h4 text-charcoal mb-4">Job Summary</h3>
                <InfoRow icon={DollarSign} label="Salary" value={`$${job.salaryMin} - $${job.salaryMax}/month`} />
                <InfoRow icon={MapPin} label="Location" value={`${job.location}, Cambodia`} />
                <InfoRow icon={Clock} label="Job Type" value={job.type} />
                <InfoRow icon={Briefcase} label="Industry" value={job.industry} />
                <InfoRow icon={TrendingUp} label="Experience" value={job.experience} />
                <InfoRow icon={GraduationCap} label="Education" value={job.education} />
                <InfoRow icon={Users} label="Positions" value={`${job.positions} openings`} />
                <InfoRow icon={Calendar} label="Deadline" value={job.deadline} />
              </div>

              {/* Apply Card */}
              <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-6">
                <h3 className="text-h4 text-charcoal mb-2">Ready to apply?</h3>
                <p className="text-body-small text-warm-gray mb-4">
                  Submit your application now. Takes less than 2 minutes.
                </p>
                <button
                  onClick={() => setApplyOpen(true)}
                  className="w-full h-12 bg-coral text-white font-semibold rounded-xl shadow-coral hover:bg-coral-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-button flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Apply Now
                </button>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ====== Section 3: Company Profile ====== */}
      <section className="bg-cream py-space-12">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="bg-white border border-sand rounded-2xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            {/* Company Logo */}
            <div className="w-20 h-20 rounded-2xl border-2 border-gold bg-cream flex items-center justify-center text-gold font-bold text-3xl shrink-0">
              {job.company.charAt(0)}
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-h3 text-charcoal mb-1">{job.company}</h3>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {job.verified && <VerifiedBadge />}
                <span className="text-body-small text-warm-gray">Member since {job.companyMemberSince}</span>
              </div>
              <p className="text-body-small text-warm-gray mb-3">
                {langTab === 'en' ? job.companyDescription : langTab === 'kh' ? job.companyDescriptionKh : job.companyDescriptionZh}
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="text-caption text-gold font-medium">{job.companyEmployees} Employees</span>
                <span className="text-caption text-gold font-medium">Founded {job.companyFounded}</span>
                <span className="text-caption text-gold font-medium">{job.companyOpenJobs} Open Jobs</span>
              </div>
            </div>

            {/* View Company Link */}
            <button className="text-gold font-semibold text-body-small hover:text-gold-dark transition-colors shrink-0 flex items-center gap-1">
              View Company Profile
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ====== Section 4: Application CTA ====== */}
      <section className="bg-gradient-to-b from-deep-brown via-charcoal to-deep-brown py-space-16">
        <div className="max-w-[600px] mx-auto px-4 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-h2 text-[#FAF8F3] mb-3"
          >
            Interested in this position?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-body text-[rgba(250,248,243,0.7)] mb-6"
          >
            Apply now or save for later. Share with friends who might be interested.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-4"
          >
            <button
              onClick={() => setApplyOpen(true)}
              className="h-16 px-8 bg-coral text-white font-semibold rounded-xl shadow-coral hover:bg-coral-dark hover:scale-[1.03] active:scale-[0.98] transition-all text-button flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Apply Now
            </button>
            <button
              onClick={toggleSave}
              className="h-16 px-8 border-2 border-gold text-gold font-semibold rounded-xl hover:bg-gold/10 transition-all text-button flex items-center justify-center gap-2"
            >
              <Bookmark className={cn('w-5 h-5', isSaved && 'fill-gold')} />
              {isSaved ? 'Saved' : 'Save for Later'}
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-caption text-gold flex items-center justify-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Application takes less than 2 minutes
          </motion.p>
        </div>
      </section>

      {/* ====== Section 5: Similar Jobs ====== */}
      <section className="bg-warm-white py-space-12">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-charcoal">Similar Jobs</h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-gold font-semibold text-body-small hover:text-gold-dark transition-colors flex items-center gap-1"
            >
              View All
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarJobs.map((sj, i) => (
              <motion.div
                key={sj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                onClick={() => { navigate(`/jobs/${sj.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl border border-sand bg-cream flex items-center justify-center text-gold font-bold text-lg shrink-0">
                    {sj.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-body font-semibold text-charcoal mb-1 truncate hover:text-gold transition-colors">{sj.title}</h3>
                    <p className="text-body-small text-warm-gray mb-1">{sj.company}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-caption text-warm-gray">
                        <MapPin className="w-3 h-3" />
                        {sj.location}
                      </span>
                      <span className="text-caption text-gold font-mono font-medium">
                        ${sj.salaryMin}-${sj.salaryMax}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Section 6: Mobile Floating Share Bar ====== */}
      {isMobile && <ShareBar jobTitle={job.title} />}

      {/* ====== Application Modal ====== */}
      <ApplicationModal job={job} open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  )
}
