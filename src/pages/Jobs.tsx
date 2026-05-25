import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  TrendingUp,
  Shirt,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { jobsApi } from '@/api/apiService'
import type { Job as JobType } from '@/api/db'
import { useFavorites } from '@/context/FavoritesContext'
import { useApply } from '@/stores/ApplyContext'
import OneClickApply from '@/components/OneClickApply'

// ─── Types ───────────────────────────────────────────────
interface Job {
  id: string
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
  requirements: string[]
  urgent?: boolean
  featured?: boolean
  employerType: string
}

// ─── Mock Data ───────────────────────────────────────────
const FALLBACK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Garment QC Inspector',
    company: 'Premium Garment Co.',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 350,
    salaryMax: 500,
    type: 'Full-time',
    experience: '3+ years',
    industry: 'Garment & Textile',
    posted: '1 day ago',
    postedDays: 1,
    description: 'We are seeking an experienced Quality Control Inspector to oversee garment production quality in our Phnom Penh factory.',
    requirements: ['3+ years garment QC experience', 'Knowledge of AQL standards', 'Ability to work with international buyers'],
    urgent: true,
    employerType: 'Verified',
  },
  {
    id: '2',
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
    description: 'Assist HR department with recruitment, employee relations, and translation between Chinese and Khmer/English.',
    requirements: ['Fluent Chinese (Mandarin)', 'Basic HR knowledge', 'Good communication skills'],
    employerType: 'Chinese Enterprise',
  },
  {
    id: '3',
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
    description: 'Lead the front office team at our luxury hotel. Ensure exceptional guest experience and smooth daily operations.',
    requirements: ['5+ years hotel front office experience', 'Leadership and team management', 'Fluent English, Khmer required'],
    employerType: 'Multinational',
  },
  {
    id: '4',
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
    description: 'Join our growing tech team to build mobile applications for local and international clients.',
    requirements: ['2+ years React Native experience', 'TypeScript proficiency', 'Experience with REST APIs'],
    featured: true,
    employerType: 'Verified',
  },
  {
    id: '5',
    title: 'Factory Production Supervisor',
    company: 'New Wide Garment',
    verified: true,
    location: 'Kandal',
    salaryMin: 500,
    salaryMax: 700,
    type: 'Full-time',
    experience: '3-5 years',
    industry: 'Garment & Textile',
    posted: '1 week ago',
    postedDays: 7,
    description: 'Oversee daily production operations, manage line workers, and ensure production targets are met.',
    requirements: ['3+ years garment factory experience', 'Supervisory experience', 'Knowledge of production planning'],
    employerType: 'Verified',
  },
  {
    id: '6',
    title: 'Tour Guide (Chinese-speaking)',
    company: 'Angkor Wonder Tours',
    verified: true,
    location: 'Siem Reap',
    salaryMin: 300,
    salaryMax: 500,
    type: 'Contract',
    experience: '1+ years',
    industry: 'Tourism & Hospitality',
    posted: '4 days ago',
    postedDays: 4,
    description: 'Guide Chinese-speaking tourists through Angkor Wat and other cultural sites. Provide engaging, educational tours.',
    requirements: ['Fluent Chinese (Mandarin)', 'Knowledge of Angkor history', 'Friendly and outgoing personality'],
    employerType: 'Local Company',
  },
  {
    id: '7',
    title: 'Accounting Officer',
    company: 'Chip Mong Bank',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 600,
    salaryMax: 900,
    type: 'Full-time',
    experience: '2-3 years',
    industry: 'Finance & Banking',
    posted: '2 days ago',
    postedDays: 2,
    description: 'Handle daily accounting operations, financial reporting, and assist with audits.',
    requirements: ['Degree in Accounting or Finance', '2+ years banking experience', 'Proficiency in accounting software'],
    employerType: 'Verified',
  },
  {
    id: '8',
    title: 'Electrical Engineer',
    company: 'SchneiTec Cambodia',
    verified: true,
    location: 'Sihanoukville',
    salaryMin: 1200,
    salaryMax: 2000,
    type: 'Full-time',
    experience: '3-5 years',
    industry: 'Manufacturing',
    posted: '6 days ago',
    postedDays: 6,
    description: 'Design, install, and maintain electrical systems for manufacturing facilities.',
    requirements: ['Degree in Electrical Engineering', '3+ years industrial experience', 'Knowledge of PLC systems'],
    employerType: 'Multinational',
  },
  {
    id: '9',
    title: 'English Teacher',
    company: 'Western International School',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 500,
    salaryMax: 800,
    type: 'Full-time',
    experience: '1-3 years',
    industry: 'Education',
    posted: '3 days ago',
    postedDays: 3,
    description: 'Teach English to primary and secondary students. Create engaging lesson plans and assess student progress.',
    requirements: ['Bachelor\'s degree', 'TESOL/TEFL certificate preferred', 'Native or near-native English'],
    employerType: 'Local Company',
  },
  {
    id: '10',
    title: 'Construction Site Supervisor',
    company: 'OCIC Group',
    verified: true,
    location: 'Phnom Penh',
    salaryMin: 700,
    salaryMax: 1000,
    type: 'Full-time',
    experience: '3-5 years',
    industry: 'Construction',
    posted: '5 days ago',
    postedDays: 5,
    description: 'Supervise construction activities, ensure safety compliance, and coordinate with subcontractors.',
    requirements: ['3+ years construction experience', 'Knowledge of safety regulations', 'Ability to read blueprints'],
    employerType: 'Verified',
  },
  {
    id: '11',
    title: 'Front Desk Receptionist',
    company: 'Sokha Beach Resort',
    verified: true,
    location: 'Sihanoukville',
    salaryMin: 300,
    salaryMax: 450,
    type: 'Full-time',
    experience: 'Entry Level',
    industry: 'Tourism & Hospitality',
    posted: '1 day ago',
    postedDays: 1,
    description: 'Welcome guests, handle check-in/check-out, and provide information about resort facilities.',
    requirements: ['Good communication skills', 'Basic computer skills', 'Friendly personality'],
    employerType: 'Verified',
  },
  {
    id: '12',
    title: 'Agricultural Extension Officer',
    company: 'Cámara Rice Group',
    verified: true,
    location: 'Battambang',
    salaryMin: 400,
    salaryMax: 600,
    type: 'Full-time',
    experience: '2-3 years',
    industry: 'Agriculture',
    posted: '1 week ago',
    postedDays: 7,
    description: 'Work with local farmers to improve rice cultivation techniques and increase crop yields.',
    requirements: ['Degree in Agriculture', 'Experience working with farmers', 'Knowledge of rice cultivation'],
    employerType: 'Local Company',
  },
]

const LOCATIONS = ['All Locations', 'Phnom Penh', 'Siem Reap', 'Sihanoukville', 'Battambang', 'Kandal', 'Kampong Cham']
const INDUSTRIES = ['All Industries', 'Garment & Textile', 'Tourism & Hospitality', 'ICT & Technology', 'Manufacturing', 'Finance & Banking', 'Construction', 'Education', 'Agriculture']
const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Manager/Executive']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
const DATE_POSTED_OPTIONS = ['Any time', 'Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days']

const EXPERIENCE_MAP: Record<string, string> = {
  'Entry Level': 'Entry Level',
  '1-2 years': 'Junior',
  '1+ years': 'Junior',
  '2-3 years': 'Mid-Level',
  '2-4 years': 'Mid-Level',
  '3+ years': 'Senior',
  '3-5 years': 'Senior',
  '5+ years': 'Manager/Executive',
}

const QUICK_FILTERS = [
  'Full-time', 'Part-time', 'Contract', 'Urgent Hiring',
  '$300-500', '$500-1000', '$1000+',
  'Entry Level', 'Experienced', 'Today', 'This Week',
]

// ─── Animation variants ──────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

// ─── Components ──────────────────────────────────────────
function VerifiedBadge({ t }: { t: (key: string) => string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-emerald to-emerald-light text-white text-caption px-2 py-0.5 rounded-full animate-pulse-glow">
      <CheckCircle2 className="w-3 h-3" />
      {t('home.verified')}
    </span>
  )
}

function UrgentBadge({ t }: { t: (key: string) => string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-coral to-warning text-white text-caption px-2 py-0.5 rounded-full">
      {t('jobs.urgentHiring')}
    </span>
  )
}

function NewBadge({ t }: { t: (key: string) => string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-coral to-warning text-white text-caption px-2 py-0.5 rounded-full">
      {t('home.new')}
    </span>
  )
}

function IndustryTag({ label }: { label: string }) {
  return (
    <span className="inline-block bg-cream text-charcoal text-caption px-3 py-1 rounded-full border border-sand hover:bg-gold hover:text-[#1A1714] transition-colors cursor-pointer">
      {label}
    </span>
  )
}

function SalaryTag({ min, max }: { min: number; max: number }) {
  return (
    <span className="inline-block bg-[rgba(212,175,55,0.12)] text-gold-dark text-caption font-mono px-3 py-1 rounded-lg">
      ${min}-${max}/mo
    </span>
  )
}

// ─── Filter Panel Component ──────────────────────────────
function FilterPanel({
  t,
  salaryRange,
  setSalaryRange,
  selectedExp,
  setSelectedExp,
  selectedTypes,
  setSelectedTypes,
  selectedIndustries,
  setSelectedIndustries,
  datePosted,
  setDatePosted,
  verifiedOnly,
  setVerifiedOnly,
  resultCount,
  onClear,
}: {
  t: (key: string) => string
  salaryRange: number[]
  setSalaryRange: (v: number[]) => void
  selectedExp: string[]
  setSelectedExp: (v: string[]) => void
  selectedTypes: string[]
  setSelectedTypes: (v: string[]) => void
  selectedIndustries: string[]
  setSelectedIndustries: (v: string[]) => void
  datePosted: string
  setDatePosted: (v: string) => void
  verifiedOnly: boolean
  setVerifiedOnly: (v: boolean) => void
  resultCount: number
  onClear: () => void
}) {
  const toggleInArray = (arr: string[], val: string, setter: (v: string[]) => void) => {
    if (arr.includes(val)) setter(arr.filter((x) => x !== val))
    else setter([...arr, val])
  }

  return (
    <div className="w-full space-y-6">
      {/* Salary Range */}
      <div className="border-b border-sand pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.salaryRange')}</h4>
        <Slider
          value={salaryRange}
          onValueChange={setSalaryRange}
          min={100}
          max={5000}
          step={100}
          className="mb-3"
        />
        <p className="text-body-small font-mono text-gold-dark">
          ${salaryRange[0]} - ${salaryRange[1]}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['$300-500', '$500-1000', '$1000-2000', '$2000+'].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                if (preset === '$300-500') setSalaryRange([300, 500])
                else if (preset === '$500-1000') setSalaryRange([500, 1000])
                else if (preset === '$1000-2000') setSalaryRange([1000, 2000])
                else setSalaryRange([2000, 5000])
              }}
              className="text-caption bg-cream text-charcoal px-2 py-1 rounded-lg border border-sand hover:bg-gold hover:text-[#1A1714] transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="border-b border-sand pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.experienceLevel')}</h4>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedExp.includes(level)}
                onCheckedChange={() => toggleInArray(selectedExp, level, setSelectedExp)}
                className="w-5 h-5 border-2 border-sand data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-body-small text-charcoal group-hover:text-gold transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="border-b border-sand pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.jobType')}</h4>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleInArray(selectedTypes, type, setSelectedTypes)}
                className="w-5 h-5 border-2 border-sand data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-body-small text-charcoal group-hover:text-gold transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div className="border-b border-sand pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.industry')}</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {INDUSTRIES.filter((i) => i !== 'All Industries').map((ind) => (
            <label key={ind} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedIndustries.includes(ind)}
                onCheckedChange={() => toggleInArray(selectedIndustries, ind, setSelectedIndustries)}
                className="w-5 h-5 border-2 border-sand data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-body-small text-charcoal group-hover:text-gold transition-colors">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Posted */}
      <div className="border-b border-sand pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.datePosted')}</h4>
        <div className="space-y-2">
          {DATE_POSTED_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  datePosted === opt ? 'border-gold' : 'border-sand'
                )}
              >
                {datePosted === opt && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
              </div>
              <input
                type="radio"
                name="datePosted"
                value={opt}
                checked={datePosted === opt}
                onChange={() => setDatePosted(opt)}
                className="sr-only"
              />
              <span className="text-body-small text-charcoal group-hover:text-gold transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employer Type */}
      <div className="pb-4">
        <h4 className="text-body font-semibold text-charcoal mb-3">{t('jobs.employerType')}</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={verifiedOnly}
              onCheckedChange={(v) => setVerifiedOnly(!!v)}
              className="w-5 h-5 border-2 border-sand data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <span className="text-body-small text-charcoal group-hover:text-gold transition-colors">{t('jobs.verifiedOnly')}</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-2">
        <p className="text-body-small text-warm-gray">{resultCount} {t('jobs.jobsFound')}</p>
        <button
          onClick={onClear}
          className="w-full text-center text-body-small text-gold hover:text-gold-dark transition-colors py-2"
        >
          {t('jobs.clearAll')}
        </button>
      </div>
    </div>
  )
}

// ─── Main Jobs Page ──────────────────────────────────────
export default function Jobs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isJobFavorited, toggleJob } = useFavorites()
  const { hasApplied } = useApply()

  // Search/filter state
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [industry, setIndustry] = useState('All Industries')
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([])

  // Sidebar filter state
  const [salaryRange, setSalaryRange] = useState([100, 5000])
  const [selectedExp, setSelectedExp] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [datePosted, setDatePosted] = useState('Any time')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    const stored = localStorage.getItem('khmercareer-saved-jobs')
    return stored ? JSON.parse(stored) : []
  })
  const [sortBy, setSortBy] = useState('Relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Load jobs from API with fallback
  useEffect(() => {
    setLoading(true)
    try {
      const apiJobs = jobsApi.getAll()
      // Map API jobs to the local Job interface
      if (apiJobs && apiJobs.length > 0) {
        const mapped: Job[] = apiJobs.map((j: JobType) => ({
          id: j.id,
          title: j.title,
          company: j.company || '',
          verified: j.verified ?? true,
          location: j.location,
          salaryMin: j.salaryMin || 100,
          salaryMax: j.salaryMax || 2000,
          type: j.type || 'Full-time',
          experience: j.experience || '1+ years',
          industry: j.industry || 'General',
          posted: j.createdAt ? `${Math.floor((Date.now() - new Date(j.createdAt).getTime()) / 86400000)} days ago` : 'Recently',
          postedDays: j.createdAt ? Math.floor((Date.now() - new Date(j.createdAt).getTime()) / 86400000) : 0,
          description: j.description || '',
          requirements: j.requirements || [],
          urgent: j.urgent || false,
          featured: j.featured || false,
          employerType: j.employerType || 'Company',
        }))
        setAllJobs(mapped)
      } else {
        // Fallback to mock data
        setAllJobs(FALLBACK_JOBS)
      }
    } catch {
      setAllJobs(FALLBACK_JOBS)
    } finally {
      setLoading(false)
    }
  }, [])
  const pageSize = 8

  // Persist saved jobs
  useEffect(() => {
    localStorage.setItem('khmercareer-saved-jobs', JSON.stringify(savedJobs))
  }, [savedJobs])

  const toggleSaveJob = useCallback((id: string) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((j: string) => j !== id) : [...prev, id]))
  }, [])

  const toggleQuickFilter = useCallback((filter: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }, [])

  // Filtering logic
  const filteredJobs = useMemo(() => {
    let results = [...allJobs]

    // Keyword
    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.industry.toLowerCase().includes(kw) ||
          j.requirements.some((r) => r.toLowerCase().includes(kw))
      )
    }

    // Location
    if (location !== 'All Locations') {
      results = results.filter((j) => j.location === location)
    }

    // Industry dropdown
    if (industry !== 'All Industries') {
      results = results.filter((j) => j.industry === industry)
    }

    // Salary range
    results = results.filter((j) => j.salaryMin >= salaryRange[0] && j.salaryMax <= salaryRange[1])

    // Experience
    if (selectedExp.length > 0) {
      results = results.filter((j) => {
        const mapped = EXPERIENCE_MAP[j.experience] || j.experience
        return selectedExp.some((se) => mapped === se)
      })
    }

    // Job type
    if (selectedTypes.length > 0) {
      results = results.filter((j) => selectedTypes.includes(j.type))
    }

    // Industry sidebar
    if (selectedIndustries.length > 0) {
      results = results.filter((j) => selectedIndustries.includes(j.industry))
    }

    // Date posted
    if (datePosted !== 'Any time') {
      const daysMap: Record<string, number> = {
        'Last 24 hours': 1,
        'Last 3 days': 3,
        'Last 7 days': 7,
        'Last 14 days': 14,
      }
      const maxDays = daysMap[datePosted] || 999
      results = results.filter((j) => j.postedDays <= maxDays)
    }

    // Verified only
    if (verifiedOnly) {
      results = results.filter((j) => j.verified)
    }

    // Quick filters
    activeQuickFilters.forEach((qf) => {
      if (qf === 'Urgent Hiring') results = results.filter((j) => j.urgent)
      else if (qf === '$300-500') results = results.filter((j) => j.salaryMin >= 300 && j.salaryMax <= 500)
      else if (qf === '$500-1000') results = results.filter((j) => j.salaryMin >= 500 && j.salaryMax <= 1000)
      else if (qf === '$1000+') results = results.filter((j) => j.salaryMin >= 1000)
      else if (qf === 'Entry Level') results = results.filter((j) => j.experience === 'Entry Level')
      else if (qf === 'Experienced') results = results.filter((j) => j.experience !== 'Entry Level')
      else if (qf === 'Today') results = results.filter((j) => j.postedDays <= 1)
      else if (qf === 'This Week') results = results.filter((j) => j.postedDays <= 7)
      else if (JOB_TYPES.includes(qf)) results = results.filter((j) => j.type === qf)
    })

    // Sort
    if (sortBy === 'Newest') {
      results.sort((a, b) => a.postedDays - b.postedDays)
    } else if (sortBy === 'Salary (Low-High)') {
      results.sort((a, b) => a.salaryMin - b.salaryMin)
    } else if (sortBy === 'Salary (High-Low)') {
      results.sort((a, b) => b.salaryMax - a.salaryMax)
    }

    return results
  }, [keyword, location, industry, salaryRange, selectedExp, selectedTypes, selectedIndustries, datePosted, verifiedOnly, activeQuickFilters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearAllFilters = () => {
    setKeyword('')
    setLocation('All Locations')
    setIndustry('All Industries')
    setSalaryRange([100, 5000])
    setSelectedExp([])
    setSelectedTypes([])
    setSelectedIndustries([])
    setDatePosted('Any time')
    setVerifiedOnly(false)
    setActiveQuickFilters([])
    setCurrentPage(1)
  }

  return (
    <div className="min-h-[100dvh] bg-warm-white">
      {/* ====== Section 1: Page Header + Search Bar ====== */}
      <section className="bg-deep-brown pt-[72px] pb-space-12">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="mt-4 mb-4">
            <ol className="flex items-center gap-2 text-caption text-warm-gray">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-gold transition-colors">
                  {t('jobs.home')}
                </button>
              </li>
              <span>/</span>
              <li className="text-gold">{t('nav.jobs')}</li>
            </ol>
          </nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="text-h1 font-display text-[#FAF8F3] mb-2"
          >
            {t('jobs.findYourPerfectJob')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="text-body text-[rgba(250,248,243,0.7)] mb-space-6"
          >
            {t('jobs.jobsFromEmployers', { count: '2,400', employers: '850' })}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="bg-white/95 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Keyword */}
              <div className="relative lg:w-[40%]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold pointer-events-none" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1) }}
                  placeholder={t('jobs.searchPlaceholder')}
                  className="w-full h-14 pl-12 pr-4 border-2 border-sand rounded-xl text-body-large text-charcoal placeholder:text-warm-gray focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none transition-all"
                />
              </div>
              {/* Location */}
              <div className="relative lg:w-[25%]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCurrentPage(1) }}
                  className="w-full h-14 pl-12 pr-4 border-2 border-sand rounded-xl text-body text-charcoal bg-white appearance-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none transition-all cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              {/* Industry */}
              <div className="relative lg:w-[25%]">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold pointer-events-none" />
                <select
                  value={industry}
                  onChange={(e) => { setIndustry(e.target.value); setCurrentPage(1) }}
                  className="w-full h-14 pl-12 pr-4 border-2 border-sand rounded-xl text-body text-charcoal bg-white appearance-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none transition-all cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              {/* Search Button */}
              <button
                onClick={() => setCurrentPage(1)}
                className="lg:w-[10%] h-14 bg-gold text-[#1A1714] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-gold hover:bg-gold-dark hover:shadow-gold-hover hover:scale-[1.02] active:scale-[0.98] transition-all text-button"
              >
                <Search className="w-5 h-5" />
                <span className="hidden lg:inline">{t('jobs.search')}</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-space-4">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => { toggleQuickFilter(filter); setCurrentPage(1) }}
                className={cn(
                  'px-4 py-2 rounded-full text-body-small font-medium border transition-all',
                  activeQuickFilters.includes(filter)
                    ? 'bg-gold text-[#1A1714] border-gold'
                    : 'bg-[#2D2926] text-gold border-[rgba(212,175,55,0.3)] hover:border-gold'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Section 2+3: Filter Panel + Job Results ====== */}
      <section className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8 py-space-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Panel */}
          {!isMobile && (
            <aside className="hidden lg:block w-[280px] shrink-0 bg-warm-white border-r border-sand pr-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-gold" />
                <h3 className="text-h4 text-charcoal">{t('jobs.filters')}</h3>
              </div>
              <FilterPanel
                t={t}
                salaryRange={salaryRange}
                setSalaryRange={setSalaryRange}
                selectedExp={selectedExp}
                setSelectedExp={setSelectedExp}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedIndustries={selectedIndustries}
                setSelectedIndustries={setSelectedIndustries}
                datePosted={datePosted}
                setDatePosted={setDatePosted}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                resultCount={filteredJobs.length}
                onClear={clearAllFilters}
              />
            </aside>
          )}

          {/* Mobile Filter Button */}
          {isMobile && (
            <button
              onClick={() => setShowMobileFilters(true)}
              className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold rounded-full shadow-gold hover:shadow-gold-hover flex items-center justify-center text-[#1A1714] transition-all hover:scale-105 active:scale-95"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          )}

          {/* Mobile Filter Drawer */}
          {isMobile && (
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-[380px] bg-warm-white overflow-y-auto p-6 shadow-[-8px_0_32px_rgba(0,0,0,0.1)]"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-h4 text-charcoal flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-gold" />
                        {t('jobs.filters')}
                      </h3>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-10 h-10 flex items-center justify-center text-warm-gray hover:text-gold transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <FilterPanel
                      t={t}
                      salaryRange={salaryRange}
                      setSalaryRange={setSalaryRange}
                      selectedExp={selectedExp}
                      setSelectedExp={setSelectedExp}
                      selectedTypes={selectedTypes}
                      setSelectedTypes={setSelectedTypes}
                      selectedIndustries={selectedIndustries}
                      setSelectedIndustries={setSelectedIndustries}
                      datePosted={datePosted}
                      setDatePosted={setDatePosted}
                      verifiedOnly={verifiedOnly}
                      setVerifiedOnly={setVerifiedOnly}
                      resultCount={filteredJobs.length}
                      onClear={clearAllFilters}
                    />
                    <div className="mt-6 pt-4 border-t border-sand">
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full h-14 bg-gold text-[#1A1714] font-semibold rounded-xl shadow-gold hover:bg-gold-dark transition-all text-button"
                      >
                        {t('jobs.applyFilters')}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Job Results */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-h4 text-charcoal">{filteredJobs.length} {t('jobs.jobsFound')}</h2>
              <div className="flex items-center gap-2">
                <span className="text-body-small text-warm-gray">{t('jobs.sortBy')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 border border-sand rounded-lg text-body-small text-charcoal bg-white focus:border-gold outline-none transition-all cursor-pointer"
                >
                  <option>{t('jobs.relevance')}</option>
                  <option>{t('jobs.newest')}</option>
                  <option>{t('jobs.salaryLowHigh')}</option>
                  <option>{t('jobs.salaryHighLow')}</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold flex items-center justify-center">
                  <Search className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-h3 text-charcoal mb-2">{t('jobs.noJobsMatch')}</h3>
                <p className="text-body text-warm-gray mb-6">{t('jobs.adjustFilters')}</p>
                <button
                  onClick={clearAllFilters}
                  className="h-12 px-6 bg-gold text-[#1A1714] font-semibold rounded-xl shadow-gold hover:bg-gold-dark transition-all text-button"
                >
                  {t('jobs.clearAllFilters')}
                </button>
              </motion.div>
            )}

            {/* Job Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="wait">
                {paginatedJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    custom={i}
                    variants={fadeInUp}
                    layout
                    className="relative bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-[3px] hover:border-gold transition-all cursor-pointer group"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    {/* Favorite Heart Button - Top Right */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleJob(String(job.id)); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"
                      aria-label={isJobFavorited(String(job.id)) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={cn(
                          'w-4 h-4 transition-all',
                          isJobFavorited(String(job.id))
                            ? 'fill-gold text-gold scale-110'
                            : 'text-warm-gray hover:text-gold'
                        )}
                      />
                    </button>

                    {/* Row 1: Main Info */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Company Logo */}
                      <div className="w-14 h-14 rounded-xl border border-sand bg-cream flex items-center justify-center shrink-0 text-gold font-bold text-lg">
                        {job.company.charAt(0)}
                      </div>

                      {/* Center: Title, Company, Location */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-h3 text-charcoal group-hover:text-gold transition-colors truncate">
                            {job.title}
                          </h3>
                          {job.urgent && <UrgentBadge t={t} />}
                          {job.featured && <NewBadge t={t} />}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-body text-charcoal font-medium">{job.company}</span>
                          {job.verified && <VerifiedBadge t={t} />}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-warm-gray text-body-small">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>

                      {/* Right: Salary, Date, Save */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                        <span className="text-h4 text-gold font-mono">
                          ${job.salaryMin}-${job.salaryMax}
                          <span className="text-body-small text-warm-gray font-body">/mo</span>
                        </span>
                        <span className="text-caption text-warm-gray">{job.posted}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id) }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream transition-colors"
                          aria-label={t('jobs.saveJob')}
                        >
                          <Bookmark
                            className={cn(
                              'w-5 h-5 transition-all',
                              savedJobs.includes(job.id) ? 'fill-gold text-gold scale-110' : 'text-warm-gray'
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Details */}
                    <div className="mt-4 pt-4 border-t border-sand">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <IndustryTag label={job.industry} />
                        <SalaryTag min={job.salaryMin} max={job.salaryMax} />
                        <IndustryTag label={job.experience} />
                      </div>
                      <p className="text-body-small text-warm-gray mb-3 line-clamp-2">{job.description}</p>
                      <ul className="space-y-1 mb-4">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-body-small text-charcoal">
                            <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                          className="h-10 px-5 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-all text-button-small"
                        >
                          {t('jobs.viewDetails')}
                        </button>
                        {hasApplied(String(job.id)) ? (
                          <span className="h-10 px-5 bg-emerald-light text-emerald font-semibold rounded-lg flex items-center gap-2 text-button-small">
                            <CheckCircle2 className="w-4 h-4" />
                            {t('jobs.applied') || 'Applied'}
                          </span>
                        ) : (
                          <OneClickApply
                            jobId={String(job.id)}
                            job={{ id: String(job.id), title: job.title, company: job.company, location: job.location }}
                            variant="compact"
                            size="sm"
                            className="h-10 px-5 bg-coral text-white hover:bg-coral-dark hover:scale-[1.03] active:scale-[0.98] shadow-coral text-button-small rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ====== Section 4: Pagination ====== */}
            {filteredJobs.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-11 h-11 flex items-center justify-center rounded-lg border border-sand text-charcoal hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Show page numbers on tablet+ */}
                {!isMobile && (
                  <>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'w-11 h-11 flex items-center justify-center rounded-lg text-body-small font-medium transition-all',
                          currentPage === page
                            ? 'bg-gold text-[#1A1714]'
                            : 'text-warm-gray hover:text-gold hover:border hover:border-gold'
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </>
                )}

                <span className="text-body-small text-warm-gray px-2 sm:hidden">
                  {t('jobs.pageOf', { current: currentPage, total: totalPages })}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-11 h-11 flex items-center justify-center rounded-lg border border-sand text-charcoal hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== Section 5: Related Suggestions ====== */}
      <section className="bg-cream py-space-16">
        <div className="max-w-container-desktop xl:max-w-container-wide mx-auto px-4 md:px-8">
          <h2 className="text-h3 text-charcoal text-center mb-8">{t('jobs.youMightAlsoLike')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Similar Jobs in Phnom Penh', count: '1,240 jobs', icon: MapPin },
              { title: 'Garment Industry Jobs', count: '890 jobs', icon: Shirt },
              { title: 'Entry Level Positions', count: '560 jobs', icon: TrendingUp },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="bg-white border border-sand rounded-2xl p-6 hover:border-gold hover:-translate-y-1 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => {
                  if (i === 0) { setLocation('Phnom Penh'); setIndustry('All Industries') }
                  else if (i === 1) { setIndustry('Garment & Textile'); setLocation('All Locations') }
                  else { setSelectedExp(['Entry Level']) }
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <card.icon className="w-8 h-8 text-gold mb-3" />
                <h3 className="text-body font-semibold text-charcoal mb-1">{card.title}</h3>
                <p className="text-body-small text-warm-gray">{card.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
