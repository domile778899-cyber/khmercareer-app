import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Factory,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Home,
  Utensils,
  ShieldCheck,
  Zap,
  ChevronRight,
  Search,
  Filter,
  Briefcase,
  Star,
  Phone,
  CheckCircle2,
  HardHat,
  Shirt,
  CircleDot,
  Truck,
  Building2,
  ArrowRight,
  Bookmark,
  MessageCircle,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Types ─── */
interface FactoryJob {
  id: number;
  title: string;
  company: string;
  location: string;
  district: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  industry: string;
  benefits: string[];
  urgent: boolean;
  logo: string;
  openings: number;
  experience: string;
}

/* ─── Filter options ─── */
const locations = [
  'factoryJobs.allLocations',
  'factoryJobs.phnomPenh',
  'factoryJobs.kampongSpeu',
  'factoryJobs.kandal',
  'factoryJobs.preyVeng',
  'factoryJobs.battambang',
  'factoryJobs.sihanoukville',
];

const industries = [
  'factoryJobs.allIndustries',
  'factoryJobs.garment',
  'factoryJobs.footwear',
  'factoryJobs.tire',
  'factoryJobs.electronics',
  'factoryJobs.foodProcessing',
];

const salaryRanges = [
  'factoryJobs.allSalaries',
  'factoryJobs.salary200_250',
  'factoryJobs.salary250_300',
  'factoryJobs.salary300_400',
  'factoryJobs.salary400_plus',
];

/* ─── Mock Factory Jobs ─── */
const factoryJobs: FactoryJob[] = [
  {
    id: 1, title: 'factoryJobs.sewingOperator', company: 'Golden Thread Garment Co., Ltd.',
    location: 'factoryJobs.phnomPenh', district: 'Pur SenChey', salary: '$250 - $320',
    salaryMin: 250, salaryMax: 320, type: 'factoryJobs.fullTime', industry: 'factoryJobs.garment',
    benefits: ['factoryJobs.freeMeals', 'factoryJobs.freeDorm', 'factoryJobs.overtimePay', 'factoryJobs.healthInsurance'],
    urgent: true, logo: 'GT', openings: 120, experience: 'factoryJobs.noExperience',
  },
  {
    id: 2, title: 'factoryJobs.qualityInspector', company: 'Evergreen Footwear Ltd.',
    location: 'factoryJobs.kampongSpeu', district: ' factoryJobs.specialEconomicZone', salary: '$280 - $350',
    salaryMin: 280, salaryMax: 350, type: 'factoryJobs.fullTime', industry: 'factoryJobs.footwear',
    benefits: ['factoryJobs.freeMeals', 'factoryJobs.transport', 'factoryJobs.bonus'],
    urgent: false, logo: 'EF', openings: 45, experience: 'factoryJobs.1year',
  },
  {
    id: 3, title: 'factoryJobs.tireMoldingOperator', company: 'Pacific Tire Cambodia',
    location: 'factoryJobs.kandal', district: 'Kandal Stung', salary: '$300 - $400',
    salaryMin: 300, salaryMax: 400, type: 'factoryJobs.fullTime', industry: 'factoryJobs.tire',
    benefits: ['factoryJobs.freeDorm', 'factoryJobs.freeMeals', 'factoryJobs.insurance', 'factoryJobs.training'],
    urgent: true, logo: 'PT', openings: 80, experience: 'factoryJobs.noExperience',
  },
  {
    id: 4, title: 'factoryJobs.assemblyWorker', company: 'TechGear Electronics',
    location: 'factoryJobs.phnomPenh', district: 'Meanchey', salary: '$220 - $280',
    salaryMin: 220, salaryMax: 280, type: 'factoryJobs.fullTime', industry: 'factoryJobs.electronics',
    benefits: ['factoryJobs.freeMeals', 'factoryJobs.overtimePay'],
    urgent: false, logo: 'TG', openings: 60, experience: 'factoryJobs.noExperience',
  },
  {
    id: 5, title: 'factoryJobs.packagingWorker', company: 'Angkor Food Products',
    location: 'factoryJobs.preyVeng', district: 'Kampong Leav', salary: '$200 - $260',
    salaryMin: 200, salaryMax: 260, type: 'factoryJobs.fullTime', industry: 'factoryJobs.foodProcessing',
    benefits: ['factoryJobs.freeMeals', 'factoryJobs.transport'],
    urgent: false, logo: 'AF', openings: 30, experience: 'factoryJobs.noExperience',
  },
  {
    id: 6, title: 'factoryJobs.cuttingOperator', company: 'CamKo Textile Group',
    location: 'factoryJobs.phnomPenh', district: 'Dangkao', salary: '$270 - $340',
    salaryMin: 270, salaryMax: 340, type: 'factoryJobs.fullTime', industry: 'factoryJobs.garment',
    benefits: ['factoryJobs.freeDorm', 'factoryJobs.freeMeals', 'factoryJobs.bonus', 'factoryJobs.insurance'],
    urgent: true, logo: 'CT', openings: 55, experience: 'factoryJobs.6months',
  },
  {
    id: 7, title: 'factoryJobs.warehouseWorker', company: 'Sino Tire Manufacturing',
    location: 'factoryJobs.sihanoukville', district: 'Sihanoukville SEZ', salary: '$280 - $360',
    salaryMin: 280, salaryMax: 360, type: 'factoryJobs.fullTime', industry: 'factoryJobs.tire',
    benefits: ['factoryJobs.freeDorm', 'factoryJobs.freeMeals', 'factoryJobs.overtimePay', 'factoryJobs.training'],
    urgent: false, logo: 'ST', openings: 40, experience: 'factoryJobs.noExperience',
  },
  {
    id: 8, title: 'factoryJobs.machineOperator', company: 'Viet-Cambodia Garment',
    location: 'factoryJobs.battambang', district: 'Battambang City', salary: '$240 - $300',
    salaryMin: 240, salaryMax: 300, type: 'factoryJobs.fullTime', industry: 'factoryJobs.garment',
    benefits: ['factoryJobs.freeMeals', 'factoryJobs.transport'],
    urgent: false, logo: 'VC', openings: 35, experience: 'factoryJobs.1year',
  },
];

/* ─── Benefit icon map ─── */
const benefitIcons: Record<string, React.ElementType> = {
  'factoryJobs.freeMeals': Utensils,
  'factoryJobs.freeDorm': Home,
  'factoryJobs.transport': Truck,
  'factoryJobs.overtimePay': DollarSign,
  'factoryJobs.insurance': ShieldCheck,
  'factoryJobs.bonus': Star,
  'factoryJobs.training': Zap,
  'factoryJobs.healthInsurance': ShieldCheck,
};

const industryIcons: Record<string, React.ElementType> = {
  'factoryJobs.garment': Shirt,
  'factoryJobs.footwear': CircleDot,
  'factoryJobs.tire': CircleDot,
  'factoryJobs.electronics': Zap,
  'factoryJobs.foodProcessing': Utensils,
};

/* ─── Section: Hero ─── */
function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Factory, value: '2,400+', label: 'factoryJobs.factoryPositions' },
    { icon: Users, value: '120万', label: 'factoryJobs.workersInSector' },
    { icon: MapPin, value: '18+', label: 'factoryJobs.industrialZones' },
    { icon: Zap, value: '48h', label: 'factoryJobs.fastHire' },
  ];

  return (
    <section className="relative bg-deep-brown overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald blur-3xl" />
      </div>

      <div className="relative max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide py-16 md:py-24 lg:py-28">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald/20 border border-emerald/30 text-emerald px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <HardHat className="w-4 h-4" />
            {t('factoryJobs.blueCollarJobs')}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mb-4 leading-tight">
            {t('factoryJobs.heroTitle')}
          </h1>
          <p className="text-warm-gray text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('factoryJobs.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="#factory-listings"
              className="inline-flex items-center justify-center gap-2 bg-emerald text-white px-8 py-4 rounded-xl font-semibold min-h-[56px] hover:bg-emerald-dark hover:scale-[1.03] transition-all duration-200"
            >
              <Briefcase className="w-5 h-5" />
              {t('factoryJobs.viewFactoryJobs')}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold px-8 py-4 rounded-xl font-semibold min-h-[56px] hover:bg-gold/10 transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
              {t('factoryJobs.callFactoryHotline')}
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-charcoal/60 border border-sand/10 rounded-xl px-4 py-5"
              >
                <stat.icon className="w-6 h-6 text-emerald mx-auto mb-2" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-warm-gray text-sm">{t(stat.label)}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section: Why Factory Jobs ─── */
function WhyFactorySection() {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: CheckCircle2,
      title: 'factoryJobs.noResume',
      desc: 'factoryJobs.noResumeDesc',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      icon: Zap,
      title: 'factoryJobs.quickStart',
      desc: 'factoryJobs.quickStartDesc',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: Home,
      title: 'factoryJobs.accommodation',
      desc: 'factoryJobs.accommodationDesc',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      icon: Utensils,
      title: 'factoryJobs.mealsIncluded',
      desc: 'factoryJobs.mealsIncludedDesc',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: ShieldCheck,
      title: 'factoryJobs.insurance',
      desc: 'factoryJobs.insuranceDesc',
      color: 'text-emerald',
      bg: 'bg-emerald/10',
    },
    {
      icon: Star,
      title: 'factoryJobs.training',
      desc: 'factoryJobs.trainingDesc',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
  ];

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              {t('factoryJobs.whyFactoryWork')}
            </h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              {t('factoryJobs.whyFactoryWorkDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i * 0.1}>
              <motion.div
                className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-feature transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 ${reason.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <reason.icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  {t(reason.title)}
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed">
                  {t(reason.desc)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Factory Job Filters & Listings ─── */
function FactoryListings() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);
  const [selectedSalary, setSelectedSalary] = useState(salaryRanges[0]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]));
  };

  const filteredJobs = factoryJobs.filter((job) => {
    const matchSearch =
      searchQuery === '' ||
      t(job.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation =
      selectedLocation === locations[0] || job.location === selectedLocation;
    const matchIndustry =
      selectedIndustry === industries[0] || job.industry === selectedIndustry;
    const matchSalary =
      selectedSalary === salaryRanges[0] ||
      (selectedSalary === salaryRanges[1] && job.salaryMin >= 200 && job.salaryMax <= 250) ||
      (selectedSalary === salaryRanges[2] && job.salaryMin >= 250 && job.salaryMax <= 300) ||
      (selectedSalary === salaryRanges[3] && job.salaryMin >= 300 && job.salaryMax <= 400) ||
      (selectedSalary === salaryRanges[4] && job.salaryMin >= 400);
    return matchSearch && matchLocation && matchIndustry && matchSalary;
  });

  return (
    <section id="factory-listings" className="bg-warm-white py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">
                {t('factoryJobs.latestFactoryJobs')}
              </h2>
              <p className="text-warm-gray">
                {filteredJobs.length} {t('factoryJobs.positionsAvailable')}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal>
          <div className="bg-white border border-sand rounded-2xl p-4 mb-8 shadow-card">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('factoryJobs.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 bg-cream border border-sand rounded-xl text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray z-10" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="pl-9 pr-8 py-3 bg-cream border border-sand rounded-xl text-charcoal appearance-none focus:outline-none focus:border-gold min-w-[160px] cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{t(loc)}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray z-10" />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="pl-9 pr-8 py-3 bg-cream border border-sand rounded-xl text-charcoal appearance-none focus:outline-none focus:border-gold min-w-[160px] cursor-pointer"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{t(ind)}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray z-10" />
                  <select
                    value={selectedSalary}
                    onChange={(e) => setSelectedSalary(e.target.value)}
                    className="pl-9 pr-8 py-3 bg-cream border border-sand rounded-xl text-charcoal appearance-none focus:outline-none focus:border-gold min-w-[160px] cursor-pointer"
                  >
                    {salaryRanges.map((sal) => (
                      <option key={sal} value={sal}>{t(sal)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job, i) => {
            const IndustryIcon = industryIcons[job.industry] || Factory;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: easeSmooth }}
              >
                <div className="bg-white border border-sand rounded-2xl p-5 md:p-6 shadow-card hover:shadow-feature transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/20 flex items-center justify-center flex-shrink-0">
                      <IndustryIcon className="w-7 h-7 text-emerald" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-semibold text-charcoal">
                          {t(job.title)}
                        </h3>
                        {job.urgent && (
                          <span className="bg-coral/10 text-coral text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {t('factoryJobs.urgent')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-warm-gray mb-2">{job.company}</p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-warm-gray mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {t(job.location)} · {job.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald" />
                          <span className="font-semibold text-charcoal">{job.salary}</span>/month
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {t(job.type)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {job.openings} {t('factoryJobs.openings')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" /> {t(job.experience)}
                        </span>
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit) => {
                          const BenefitIcon = benefitIcons[benefit] || CheckCircle2;
                          return (
                            <span
                              key={benefit}
                              className="inline-flex items-center gap-1 bg-cream text-charcoal text-xs px-2.5 py-1 rounded-full border border-sand"
                            >
                              <BenefitIcon className="w-3 h-3 text-emerald" />
                              {t(benefit)}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 flex-shrink-0">
                      <button className="inline-flex items-center justify-center gap-2 bg-emerald text-white px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] hover:bg-emerald-dark hover:scale-[1.03] transition-all duration-200 flex-1 lg:flex-none">
                        {t('factoryJobs.applyNow')}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] border transition-all flex-1 lg:flex-none ${
                          savedJobs.includes(job.id)
                            ? 'bg-gold/10 border-gold text-gold'
                            : 'border-sand text-warm-gray hover:border-gold hover:text-gold'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                        {savedJobs.includes(job.id) ? t('factoryJobs.saved') : t('factoryJobs.save')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">{t('factoryJobs.noResults')}</h3>
            <p className="text-warm-gray">{t('factoryJobs.tryDifferentFilters')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Section: Application Process ─── */
function ProcessSection() {
  const { t } = useTranslation();

  const steps = [
    { num: '01', icon: Phone, title: 'factoryJobs.step1Call', desc: 'factoryJobs.step1CallDesc' },
    { num: '02', icon: MapPin, title: 'factoryJobs.step2Visit', desc: 'factoryJobs.step2VisitDesc' },
    { num: '03', icon: Briefcase, title: 'factoryJobs.step3Start', desc: 'factoryJobs.step3StartDesc' },
  ];

  return (
    <section className="py-12 md:py-20" style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}>
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-caption text-gold tracking-[0.15em] uppercase mb-2">{t('factoryJobs.howToApply')}</p>
            <h2 className="text-h2 text-warm-white mb-3">{t('factoryJobs.simple3Steps')}</h2>
            <p className="text-body text-warm-white/70 max-w-[600px] mx-auto">
              {t('factoryJobs.noResumeNeeded')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.15}>
              <motion.div
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-emerald" />
                </div>
                <span className="text-caption text-gold font-mono">{step.num}</span>
                <h3 className="text-h3 text-warm-white mt-1 mb-2">{t(step.title)}</h3>
                <p className="text-body-small text-warm-white/60 max-w-[280px] mx-auto">
                  {t(step.desc)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Industrial Zones ─── */
function IndustrialZones() {
  const { t } = useTranslation();

  const zones = [
    {
      name: 'factoryJobs.phnomPenhSEZ',
      count: '850+', jobs: 'factoryJobs.positions', industries: 'factoryJobs.garmentFootwearTire',
    },
    {
      name: 'factoryJobs.kampongSpeuSEZ',
      count: '420+', jobs: 'factoryJobs.positions', industries: 'factoryJobs.footwearGarment',
    },
    {
      name: 'factoryJobs.sihanoukvilleSEZ',
      count: '380+', jobs: 'factoryJobs.positions', industries: 'factoryJobs.tireElectronics',
    },
    {
      name: 'factoryJobs.kandalSEZ',
      count: '310+', jobs: 'factoryJobs.positions', industries: 'factoryJobs.foodProcessing',
    },
  ];

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              {t('factoryJobs.industrialZones')}
            </h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              {t('factoryJobs.industrialZonesDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {zones.map((zone, i) => (
            <ScrollReveal key={zone.name} delay={i * 0.1}>
              <motion.div
                className="bg-white border border-sand rounded-2xl p-6 shadow-card hover:shadow-feature transition-all duration-300 text-center"
                whileHover={{ y: -4 }}
              >
                <Building2 className="w-10 h-10 text-emerald mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-charcoal mb-1">
                  {t(zone.name)}
                </h3>
                <div className="font-display text-3xl font-bold text-gold mb-1">{zone.count}</div>
                <p className="text-xs text-warm-gray mb-2">{t(zone.jobs)}</p>
                <p className="text-xs text-emerald">{t(zone.industries)}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: CTA ─── */
function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-emerald py-12 md:py-20">
      <div className="max-w-container-desktop mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-container-wide">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <MessageCircle className="w-14 h-14 text-white mx-auto mb-6" />
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('factoryJobs.readyToWork')}
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8">
              {t('factoryJobs.callOurTeam')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+85523999888"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald px-8 py-4 rounded-xl font-semibold min-h-[56px] shadow-lg hover:bg-cream hover:scale-[1.03] transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                +855 23 999 888
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold min-h-[56px] hover:bg-white/10 transition-all duration-200"
              >
                {t('factoryJobs.leaveMessage')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══════════ MAIN PAGE COMPONENT ══════════ */
/* ═══════════════════════════════════════════ */
export default function FactoryJobs() {
  return (
    <main className="min-h-screen bg-warm-white">
      <HeroSection />
      <WhyFactorySection />
      <FactoryListings />
      <ProcessSection />
      <IndustrialZones />
      <CtaSection />
    </main>
  );
}
