import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Layout, FormInput, Download, Check, ChevronLeft,
  ChevronRight, Facebook, MessageCircle, Send, Printer,
  Shirt, Hotel, Laptop, Award, ShieldCheck,
  Phone, Mail, MapPin, Briefcase, GraduationCap, Languages,
  FileText, Plus, Trash2,
  Clock, Users, Sparkles, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════ */

interface ResumeData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  photo: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  languages: LanguageEntry[];
  github: string;
  portfolio: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface LanguageEntry {
  id: string;
  name: string;
  level: string;
}

type TemplateId = 'garment' | 'tourism' | 'ict';

interface TemplateDef {
  id: TemplateId;
  icon: typeof Shirt;
  title: string;
  titleKm: string;
  titleZh: string;
  description: string;
  stat: string;
  features: string[];
  color: string;
}

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const templates: TemplateDef[] = [
  {
    id: 'garment',
    icon: Shirt,
    title: 'Garment & Manufacturing',
    titleKm: 'ក្រណាត់​និង​ការផលិត',
    titleZh: '服装制造',
    description: 'Optimized for factory workers, supervisors, and quality control roles. Highlights production skills and safety training.',
    stat: 'Used by 15,000+ garment workers',
    features: ['Production skills section', 'Safety certification fields', 'Machine operation expertise'],
    color: '#D4AF37',
  },
  {
    id: 'tourism',
    icon: Hotel,
    title: 'Tourism & Hospitality',
    titleKm: 'ទេសចរណ៍​និង​បដិសណ្ឋារកម្ម',
    titleZh: '旅游酒店',
    description: 'Designed for hotel staff, tour guides, chefs, and restaurant workers. Highlights languages and customer service skills.',
    stat: 'Used by 8,000+ hospitality staff',
    features: ['Language proficiency section', 'Customer service rating', 'Hospitality certifications'],
    color: '#E85D3E',
  },
  {
    id: 'ict',
    icon: Laptop,
    title: 'ICT & Technology',
    titleKm: 'បច្ចេកវិទ្យា​ព័ត៌មាន',
    titleZh: '信息技术',
    description: 'Modern layout for developers, designers, and IT professionals. Features skills matrix and project showcase.',
    stat: 'Used by 5,000+ tech professionals',
    features: ['Technical skills matrix', 'Project portfolio section', 'Certification & training'],
    color: '#059669',
  },
];

const exampleResumes = [
  { id: 1, title: 'Experienced Sewing Operator', industry: 'Garment', years: '5 years', icon: Shirt },
  { id: 2, title: 'Hotel Front Desk', industry: 'Tourism', years: 'Entry level', icon: Hotel },
  { id: 3, title: 'Junior Web Developer', industry: 'ICT', years: '1 year', icon: Laptop },
  { id: 4, title: 'Factory Line Supervisor', industry: 'Garment', years: '3 years', icon: Shirt },
  { id: 5, title: 'Chinese-Khmer Translator', industry: 'Translation', years: '2 years', icon: Languages },
  { id: 6, title: 'Restaurant Manager', industry: 'Tourism', years: '4 years', icon: Hotel },
];

const defaultResume: ResumeData = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  photo: '',
  summary: '',
  experience: [{ id: '1', title: '', company: '', period: '', description: '' }],
  education: [{ id: '1', degree: '', school: '', year: '' }],
  skills: [],
  certifications: [],
  languages: [{ id: '1', name: '', level: '' }],
  github: '',
  portfolio: '',
};

const emptyExp: ExperienceEntry = { id: '', title: '', company: '', period: '', description: '' };
const emptyEdu: EducationEntry = { id: '', degree: '', school: '', year: '' };
const emptyLang: LanguageEntry = { id: '', name: '', level: '' };

/* ════════════════════════════════════════════
   EASING
   ════════════════════════════════════════════ */

const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

/* ════════════════════════════════════════════
   HELPER: Mini resume preview for cards
   ════════════════════════════════════════════ */

function MiniResumePreview({ templateId, isInteractive }: { templateId: TemplateId; isInteractive?: boolean }) {
  if (isInteractive) {
    return <MiniResumePreviewInteractive templateId={templateId} />;
  }

  const previews: Record<TemplateId, React.ReactNode> = {
    garment: (
      <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
        <div className="border-b-2 border-gold pb-1.5">
          <div className="h-2.5 w-20 bg-charcoal rounded" />
          <div className="h-1.5 w-28 bg-warm-gray/50 rounded mt-1" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-14 bg-gold rounded" />
          <div className="h-1.5 w-full bg-sand/60 rounded" />
          <div className="h-1.5 w-3/4 bg-sand/60 rounded" />
        </div>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {['Sewing', 'QC', 'Line Lead', 'Safety'].map((t) => (
            <span key={t} className="px-1 py-0.5 bg-gold/10 text-[6px] rounded text-gold-dark">{t}</span>
          ))}
        </div>
        <div className="mt-auto space-y-1">
          <div className="h-1 w-12 bg-gold rounded" />
          <div className="h-1.5 w-full bg-sand/40 rounded" />
          <div className="h-1.5 w-5/6 bg-sand/40 rounded" />
        </div>
      </div>
    ),
    tourism: (
      <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
        <div className="border-b-2 border-coral pb-1.5">
          <div className="h-2.5 w-20 bg-charcoal rounded" />
          <div className="h-1.5 w-28 bg-warm-gray/50 rounded mt-1" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-12 bg-coral rounded" />
          <div className="flex gap-1 mt-1">
            <div className="h-1 w-10 bg-coral/60 rounded" />
            <div className="h-1 w-10 bg-coral/40 rounded" />
            <div className="h-1 w-8 bg-coral/30 rounded" />
          </div>
        </div>
        <div className="mt-auto space-y-1">
          <div className="h-1 w-14 bg-coral rounded" />
          <div className="h-1.5 w-full bg-sand/40 rounded" />
          <div className="h-1.5 w-4/5 bg-sand/40 rounded" />
        </div>
      </div>
    ),
    ict: (
      <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
        <div className="border-b-2 border-emerald pb-1.5">
          <div className="h-2.5 w-20 bg-charcoal rounded" />
          <div className="flex gap-2 mt-1">
            <div className="h-1 w-10 bg-warm-gray/50 rounded" />
            <div className="h-1 w-10 bg-warm-gray/50 rounded" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1 w-16 bg-emerald rounded" />
          <div className="grid grid-cols-3 gap-0.5 mt-1">
            {['React', 'Node', 'SQL', 'AWS', 'Type', 'Git'].map((t) => (
              <span key={t} className="px-0.5 py-0.5 bg-emerald/10 text-[6px] rounded text-center text-emerald">{t}</span>
            ))}
          </div>
        </div>
        <div className="mt-auto space-y-1">
          <div className="h-1 w-10 bg-emerald rounded" />
          <div className="h-1.5 w-full bg-sand/40 rounded" />
          <div className="h-1.5 w-3/4 bg-sand/40 rounded" />
        </div>
      </div>
    ),
  };
  return previews[templateId];
}

/* Mini interactive resume preview for Section 4 */
function MiniResumePreviewInteractive({ templateId }: { templateId: TemplateId }) {
  const resume: Record<TemplateId, ResumeData> = {
    garment: {
      fullName: 'Sopheap Kim',
      phone: '+855 12 345 678',
      email: 'sopheap.kim@email.com',
      location: 'Phnom Penh',
      photo: '',
      summary: 'Dedicated sewing operator with 5 years experience in garment manufacturing.',
      experience: [{ id: '1', title: 'Senior Sewing Operator', company: 'CamKo Garment Ltd.', period: '2020 - Present', description: 'Operate industrial sewing machines. Quality inspection. Train new workers.' }],
      education: [{ id: '1', degree: 'High School Diploma', school: 'Phnom Penh High School', year: '2018' }],
      skills: ['Industrial Sewing', 'Quality Control', 'Line Supervision', 'Pattern Reading', 'Safety Protocols'],
      certifications: ['OSHA Safety', 'Lean Manufacturing'],
      languages: [{ id: '1', name: 'Khmer', level: 'Native' }, { id: '2', name: 'English', level: 'Basic' }],
      github: '',
      portfolio: '',
    },
    tourism: {
      fullName: 'Rathana Sok',
      phone: '+855 98 765 432',
      email: 'rathana.sok@email.com',
      location: 'Siem Reap',
      photo: '',
      summary: 'Friendly front desk receptionist with excellent customer service skills.',
      experience: [{ id: '1', title: 'Front Desk Receptionist', company: 'Sokha Angkor Resort', period: '2022 - Present', description: 'Check-in/check-out. Guest inquiries. Reservation management.' }],
      education: [{ id: '1', degree: 'Hospitality Certificate', school: 'AHA Hospitality School', year: '2021' }],
      skills: ['Customer Service', 'Reservation Systems', 'Multilingual', 'Problem Solving', 'POS Systems'],
      certifications: ['First Aid', 'Food Safety'],
      languages: [{ id: '1', name: 'Khmer', level: 'Native' }, { id: '2', name: 'English', level: 'Fluent' }, { id: '3', name: 'Chinese', level: 'Conversational' }],
      github: '',
      portfolio: '',
    },
    ict: {
      fullName: 'Dara Meas',
      phone: '+855 11 222 333',
      email: 'dara.meas@email.com',
      location: 'Phnom Penh',
      photo: '',
      summary: 'Passionate full-stack developer specializing in React and Node.js applications.',
      experience: [{ id: '1', title: 'Frontend Developer', company: 'Tech Cambodia Co.', period: '2023 - Present', description: 'Build React apps. REST API integration. UI/UX implementation.' }],
      education: [{ id: '1', degree: "B.S. Computer Science", school: 'RUPP', year: '2022' }],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Tailwind CSS'],
      certifications: ['AWS Cloud Practitioner', 'Meta Frontend'],
      languages: [{ id: '1', name: 'Khmer', level: 'Native' }, { id: '2', name: 'English', level: 'Fluent' }],
      github: 'github.com/dara-meas',
      portfolio: 'dara.dev',
    },
  };

  const data = resume[templateId];

  return (
    <div className="w-full h-full bg-white p-4 overflow-auto text-[10px] leading-relaxed">
      <div className="border-b pb-2 mb-2" style={{ borderColor: templateId === 'garment' ? '#D4AF37' : templateId === 'tourism' ? '#E85D3E' : '#059669' }}>
        <div className="font-bold text-sm text-charcoal">{data.fullName}</div>
        <div className="flex gap-2 mt-0.5 text-warm-gray text-[8px]">
          <span>{data.phone}</span>
          <span>{data.email}</span>
          <span>{data.location}</span>
        </div>
      </div>
      <div className="mb-2 text-warm-gray">{data.summary}</div>

      <div className="mb-2">
        <div className="font-semibold text-[9px] uppercase tracking-wider mb-1" style={{ color: templateId === 'garment' ? '#D4AF37' : templateId === 'tourism' ? '#E85D3E' : '#059669' }}>
          {templateId === 'garment' ? 'Production Skills' : templateId === 'tourism' ? 'Languages' : 'Technical Skills'}
        </div>
        <div className="flex flex-wrap gap-0.5">
          {(templateId === 'tourism' ? data.languages : data.skills).map((s, i) => (
            <span key={i} className="px-1 py-0.5 rounded text-[7px]" style={{
              background: templateId === 'garment' ? 'rgba(212,175,55,0.1)' : templateId === 'tourism' ? 'rgba(232,93,62,0.1)' : 'rgba(5,150,105,0.1)',
              color: templateId === 'garment' ? '#B8941F' : templateId === 'tourism' ? '#C44B2F' : '#059669',
            }}>
              {typeof s === 'string' ? s : `${s.name} - ${s.level}`}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <div className="font-semibold text-[9px] uppercase tracking-wider mb-1" style={{ color: templateId === 'garment' ? '#D4AF37' : templateId === 'tourism' ? '#E85D3E' : '#059669' }}>
          Experience
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-1">
            <div className="font-medium text-charcoal">{exp.title}</div>
            <div className="text-warm-gray">{exp.company} | {exp.period}</div>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="font-semibold text-[9px] uppercase tracking-wider mb-1" style={{ color: templateId === 'garment' ? '#D4AF37' : templateId === 'tourism' ? '#E85D3E' : '#059669' }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id}>
            <div className="font-medium text-charcoal">{edu.degree}</div>
            <div className="text-warm-gray">{edu.school} | {edu.year}</div>
          </div>
        ))}
      </div>

      {data.github && (
        <div className="text-[8px] text-warm-gray">
          github: {data.github} | portfolio: {data.portfolio}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   INTERACTIVE RESUME WIZARD
   ════════════════════════════════════════════ */

function ResumeWizard({ selectedTemplate, onClose }: { selectedTemplate: TemplateId; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResume);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [previewTab, setPreviewTab] = useState<TemplateId>(selectedTemplate);

  const updateField = useCallback((field: keyof ResumeData, value: unknown) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 600);
  }, []);

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...emptyExp, id: Date.now().toString() }],
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { ...emptyEdu, id: Date.now().toString() }],
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, { ...emptyLang, id: Date.now().toString() }],
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id),
    }));
  };

  const updateLanguage = (id: string, field: keyof LanguageEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const val = e.currentTarget.value.trim();
      if (!resumeData.skills.includes(val)) {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, val] }));
      }
      e.currentTarget.value = '';
    }
  };

  const handleCertAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const val = e.currentTarget.value.trim();
      if (!resumeData.certifications.includes(val)) {
        setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, val] }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const removeCert = (cert: string) => {
    setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }));
  };

  const stepLabels = ['Choose Template', 'Fill Details', 'Preview & Download'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-warm-white overflow-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-sand shadow-nav">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-warm-gray hover:text-gold transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Exit Builder</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(s => (
                <div key={s} className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  s === step ? "bg-gold text-deep-brown" : s < step ? "bg-emerald text-white" : "bg-sand text-warm-gray"
                )}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-charcoal hidden md:inline">
              {stepLabels[step - 1]}
            </span>
            {step === 2 && (
              <div className="flex items-center gap-1 text-xs text-emerald">
                <Clock className="w-3.5 h-3.5" />
                {autoSaveStatus === 'saved' ? 'Auto-saved' : 'Saving...'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: CHOOSE TEMPLATE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <h2 className="text-h2 font-display text-charcoal text-center mb-2">Choose Your Template</h2>
              <p className="text-body text-warm-gray text-center mb-8">Select the industry that matches your experience</p>
              <div className="grid md:grid-cols-3 gap-6">
                {templates.map((t) => {
                  const Icon = t.icon;
                  const isSelected = previewTab === t.id;
                  return (
                    <motion.div
                      key={t.id}
                      whileHover={{ y: -6 }}
                      onClick={() => setPreviewTab(t.id)}
                      className={cn(
                        "bg-white rounded-xl p-6 cursor-pointer border-2 transition-all",
                        isSelected ? "border-gold shadow-gold-hover" : "border-transparent shadow-card hover:shadow-card-hover"
                      )}
                    >
                      <div className="w-full aspect-[3/4] rounded-lg border border-sand overflow-hidden mb-4">
                        <MiniResumePreview templateId={t.id} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.color + '15' }}>
                          <Icon className="w-5 h-5" style={{ color: t.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-charcoal text-sm">{t.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-warm-gray mb-3">{t.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {t.features.map(f => (
                          <span key={f} className="px-2 py-0.5 bg-cream rounded-full text-[10px] text-warm-gray">{f}</span>
                        ))}
                      </div>
                      <div className="text-[10px] font-medium" style={{ color: t.color }}>{t.stat}</div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => { setStep(2); }}
                  className="bg-gold text-deep-brown px-8 py-3 rounded-xl font-semibold shadow-gold hover:shadow-gold-hover hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: FILL DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Form */}
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" /> Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-warm-gray mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.fullName}
                        onChange={e => updateField('fullName', e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-14 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-warm-gray mb-1 block">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder="+855 XX XXX XXX"
                        className="w-full h-14 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-warm-gray mb-1 block">Email</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={e => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full h-14 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-warm-gray mb-1 block">Location</label>
                      <input
                        type="text"
                        value={resumeData.location}
                        onChange={e => updateField('location', e.target.value)}
                        placeholder="City, Province"
                        className="w-full h-14 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-warm-gray mb-1 block">Professional Summary</label>
                    <textarea
                      value={resumeData.summary}
                      onChange={e => updateField('summary', e.target.value)}
                      placeholder="Brief summary of your professional background..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all resize-none"
                    />
                  </div>
                  {previewTab === 'ict' && (
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm text-warm-gray mb-1 block">GitHub</label>
                        <input
                          type="text"
                          value={resumeData.github}
                          onChange={e => updateField('github', e.target.value)}
                          placeholder="github.com/username"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-warm-gray mb-1 block">Portfolio</label>
                        <input
                          type="text"
                          value={resumeData.portfolio}
                          onChange={e => updateField('portfolio', e.target.value)}
                          placeholder="yourportfolio.com"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gold" /> Work Experience
                  </h3>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp.id} className={cn("space-y-3", idx > 0 && "mt-4 pt-4 border-t border-sand")}>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gold">Experience {idx + 1}</span>
                        {resumeData.experience.length > 1 && (
                          <button onClick={() => removeExperience(exp.id)} className="text-warm-gray hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                          placeholder="Job Title"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={e => updateExperience(exp.id, 'period', e.target.value)}
                        placeholder="Period (e.g., 2020 - 2023)"
                        className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                      <textarea
                        value={exp.description}
                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Job description and achievements..."
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all resize-none"
                      />
                    </div>
                  ))}
                  <button onClick={addExperience} className="mt-4 flex items-center gap-2 text-gold hover:text-gold-dark transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>

                {/* Education */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-gold" /> Education
                  </h3>
                  {resumeData.education.map((edu, idx) => (
                    <div key={edu.id} className={cn("space-y-3", idx > 0 && "mt-4 pt-4 border-t border-sand")}>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gold">Education {idx + 1}</span>
                        {resumeData.education.length > 1 && (
                          <button onClick={() => removeEducation(edu.id)} className="text-warm-gray hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Degree / Certificate"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                        <input
                          type="text"
                          value={edu.school}
                          onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="School / University"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                      </div>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                        placeholder="Year"
                        className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                    </div>
                  ))}
                  <button onClick={addEducation} className="mt-4 flex items-center gap-2 text-gold hover:text-gold-dark transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {resumeData.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-gold/10 text-gold-dark rounded-full text-sm flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleSkillAdd}
                    placeholder="Type a skill and press Enter..."
                    className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                  />
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold" /> Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {resumeData.certifications.map(cert => (
                      <span key={cert} className="px-3 py-1.5 bg-emerald/10 text-emerald rounded-full text-sm flex items-center gap-1">
                        {cert}
                        <button onClick={() => removeCert(cert)} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleCertAdd}
                    placeholder="Type a certification and press Enter..."
                    className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                  />
                </div>

                {/* Languages */}
                <div className="bg-white rounded-xl p-6 border border-sand">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-gold" /> Languages
                  </h3>
                  {resumeData.languages.map((lang, idx) => (
                    <div key={lang.id} className={cn("grid sm:grid-cols-2 gap-3", idx > 0 && "mt-3 pt-3 border-t border-sand")}>
                      <input
                        type="text"
                        value={lang.name}
                        onChange={e => updateLanguage(lang.id, 'name', e.target.value)}
                        placeholder="Language"
                        className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lang.level}
                          onChange={e => updateLanguage(lang.id, 'level', e.target.value)}
                          placeholder="Level (e.g., Native)"
                          className="w-full h-12 px-4 border-2 border-sand rounded-xl focus:border-gold focus:ring-[3px] focus:ring-gold/15 outline-none transition-all"
                        />
                        {resumeData.languages.length > 1 && (
                          <button onClick={() => removeLanguage(lang.id)} className="text-warm-gray hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={addLanguage} className="mt-4 flex items-center gap-2 text-gold hover:text-gold-dark transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Language
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="lg:sticky lg:top-20 self-start">
                <div className="bg-sand/40 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-warm-gray mb-3 text-center">Live Preview</h4>
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto" style={{ maxWidth: 400, aspectRatio: '210/297', maxHeight: '70vh' }}>
                    <div className="w-full h-full overflow-auto p-4 text-[11px]">
                      <LiveResumePreview data={resumeData} templateId={previewTab} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-sand text-warm-gray py-3 rounded-xl font-semibold hover:bg-sand/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gold text-deep-brown py-3 rounded-xl font-semibold shadow-gold hover:shadow-gold-hover hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    Preview & Download
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREVIEW & DOWNLOAD */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="max-w-[800px] mx-auto"
            >
              <h2 className="text-h2 font-display text-charcoal text-center mb-6">Your Resume is Ready!</h2>

              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-sand" style={{ aspectRatio: '210/297', maxHeight: '80vh' }}>
                <div className="w-full h-full overflow-auto p-8">
                  <LiveResumePreview data={resumeData} templateId={previewTab} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="border-2 border-sand text-warm-gray px-6 py-3 rounded-xl font-semibold hover:bg-sand/20 transition-all"
                >
                  Edit Resume
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gold text-deep-brown px-8 py-4 rounded-xl font-semibold shadow-gold hover:shadow-gold-hover hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 min-h-[56px]"
                >
                  <Printer className="w-5 h-5" /> Download PDF
                </button>
                <div className="flex gap-2">
                  <button className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#0088CC] text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   LIVE RESUME PREVIEW COMPONENT
   ════════════════════════════════════════════ */

function LiveResumePreview({ data, templateId }: { data: ResumeData; templateId: TemplateId }) {
  const accent = templateId === 'garment' ? '#D4AF37' : templateId === 'tourism' ? '#E85D3E' : '#059669';
  const accentLight = templateId === 'garment' ? 'rgba(212,175,55,0.1)' : templateId === 'tourism' ? 'rgba(232,93,62,0.1)' : 'rgba(5,150,105,0.1)';

  if (!data.fullName && !data.summary && data.skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-warm-gray text-sm">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Start filling in your details to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      {/* Header */}
      <div className="border-b-2 pb-3" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-bold text-charcoal">{data.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-1 text-warm-gray text-xs">
          {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{data.phone}</span>}
          {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{data.email}</span>}
          {data.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{data.location}</span>}
        </div>
        {(data.github || data.portfolio) && (
          <div className="flex gap-3 mt-1 text-xs" style={{ color: accent }}>
            {data.github && <span>github.com/{data.github.replace(/^github\.com\//, '')}</span>}
            {data.portfolio && <span>{data.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: accent }}>Professional Summary</h2>
          <p className="text-warm-gray text-xs leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>
            {templateId === 'garment' ? 'Production Skills' : templateId === 'tourism' ? 'Key Skills' : 'Technical Skills'}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="px-2 py-1 rounded-md text-xs" style={{ background: accentLight, color: accent }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.some(e => e.title) && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>Work Experience</h2>
          {data.experience.filter(e => e.title).map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="font-semibold text-charcoal text-xs">{exp.title}</div>
              <div className="text-warm-gray text-[10px]">{exp.company}{exp.period ? ` | ${exp.period}` : ''}</div>
              {exp.description && <p className="text-warm-gray text-[10px] mt-0.5">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.some(e => e.degree) && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>Education</h2>
          {data.education.filter(e => e.degree).map((edu) => (
            <div key={edu.id} className="mb-1">
              <div className="font-semibold text-charcoal text-xs">{edu.degree}</div>
              <div className="text-warm-gray text-[10px]">{edu.school}{edu.year ? ` | ${edu.year}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>Certifications</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.certifications.map((c, i) => (
              <span key={i} className="px-2 py-1 bg-emerald/10 text-emerald rounded-md text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />{c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.some(l => l.name) && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>Languages</h2>
          <div className="flex flex-wrap gap-2">
            {data.languages.filter(l => l.name).map((l) => (
              <span key={l.id} className="text-xs text-warm-gray">
                <strong className="text-charcoal">{l.name}</strong>{l.level ? ` - ${l.level}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   SECTION 1: HERO
   ════════════════════════════════════════════ */

function HeroSection({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-title-word', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.06,
        ease: 'expo.out',
      });
      gsap.from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.7, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, delay: 0.6, ease: 'power3.out' });
      gsap.from('.hero-phone', { x: 40, opacity: 0, duration: 0.7, delay: 0.3, ease: 'expo.out' });
      gsap.from('.hero-badge', { scale: 0, stagger: 0.1, duration: 0.3, ease: 'back.out(1.7)', delay: 0.8 });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-cream pt-[72px] md:pt-[80px] pb-16 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="hero-title-word opacity-0 text-caption text-gold tracking-[0.15em] uppercase mb-3">
              {'\u1794\u179A\u179C\u178F\u17D2\u178F\u179B\u17CB\u179A\u17BC\u1794 / \u7B80\u5386\u751F\u6210\u5668 / RESUME BUILDER'}
            </div>
            <h1 className="font-display text-hero-title text-charcoal leading-[1.05] mb-4">
              {'Your Professional Resume in 3 Minutes'.split(' ').map((word, i) => (
                <span key={i} className="hero-title-word inline-block opacity-0 mr-[0.3em]">{word}</span>
              ))}
            </h1>
            <p className="hero-subtitle opacity-0 text-body-large text-warm-gray max-w-[480px] mb-6">
              No writing skills needed. Choose your industry template, fill in your details, and get a resume that gets you hired. Works in Khmer, Chinese, and English.
            </p>
            <div className="hero-cta opacity-0 flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={onStart}
                className="bg-gold text-deep-brown px-8 py-4 rounded-xl font-semibold text-lg shadow-gold hover:shadow-gold-hover hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[64px]"
              >
                Build My Resume <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="hero-cta opacity-0 flex flex-wrap gap-x-4 gap-y-2 text-body-small text-emerald">
              <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Free forever</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4" /> No signup required</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Mobile-friendly</span>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="order-1 lg:order-2 flex justify-center relative">
            <motion.div
              className="hero-phone relative opacity-0"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative" style={{ transform: 'rotate(2deg)' }}>
                {/* Phone frame */}
                <div className="w-[260px] md:w-[280px] bg-charcoal rounded-[2.5rem] p-2 shadow-[0_20px_60px_rgba(212,175,55,0.15)]">
                  <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/18]">
                    {/* Phone notch */}
                    <div className="h-6 bg-charcoal mx-auto w-24 rounded-b-xl" />
                    <div className="p-3 pt-1">
                      <div className="h-2 w-16 bg-gold rounded mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-8 bg-cream rounded-lg" />
                        <div className="h-8 bg-cream rounded-lg" />
                        <div className="h-8 bg-cream rounded-lg" />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-[3/4] bg-cream rounded-lg border border-sand" />
                        ))}
                      </div>
                      <div className="mt-3 h-20 bg-cream rounded-lg flex items-center justify-center">
                        <div className="h-3 w-24 bg-gold rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  className="hero-badge absolute -left-20 top-10 bg-gold/10 text-gold-dark px-3 py-1.5 rounded-full text-xs font-medium border border-gold/20 shadow-sm backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Khmer supported</span>
                </motion.div>
                <motion.div
                  className="hero-badge absolute -right-16 top-24 bg-emerald/10 text-emerald px-3 py-1.5 rounded-full text-xs font-medium border border-emerald/20 shadow-sm backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                >
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> PDF export</span>
                </motion.div>
                <motion.div
                  className="hero-badge absolute -left-12 bottom-16 bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-500/20 shadow-sm backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                >
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Share to Facebook</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SECTION 2: TEMPLATE SELECTION
   ════════════════════════════════════════════ */

function TemplateSection({ selected, onSelect }: { selected: TemplateId | null; onSelect: (id: TemplateId) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.template-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-warm-white py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="text-caption text-gold tracking-[0.15em] uppercase mb-3">
            {'\u1782\u1798\u17D2\u179A\u17BC / \u6A21\u677F / TEMPLATES'}
          </div>
          <h2 className="font-display text-h2 text-charcoal mb-3">Choose Your Industry</h2>
          <p className="text-body text-warm-gray">Each template is designed for your industry&apos;s expectations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {templates.map((t) => {
            const Icon = t.icon;
            const isSelected = selected === t.id;
            return (
              <motion.div
                key={t.id}
                className={cn(
                  'template-card bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer',
                  isSelected ? 'border-gold shadow-gold-hover' : 'border-transparent shadow-card hover:shadow-card-hover hover:-translate-y-1.5'
                )}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(t.id)}
              >
                {/* Preview */}
                <div className="p-4 bg-cream/50">
                  <div className="aspect-[3/4] max-h-[280px] mx-auto rounded-lg border border-sand overflow-hidden">
                    <MiniResumePreview templateId={t.id} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.color + '15' }}>
                      <Icon className="w-6 h-6" style={{ color: t.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal text-h4">{t.title}</h3>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        className="ml-auto w-8 h-8 rounded-full bg-gold flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-deep-brown" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-body-small text-warm-gray mb-4">{t.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {t.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                        <Check className="w-3.5 h-3.5 text-emerald flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-caption font-medium mb-4" style={{ color: t.color }}>{t.stat}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(t.id); }}
                    className={cn(
                      "w-full py-2.5 rounded-lg font-semibold text-sm transition-all border-2",
                      isSelected
                        ? "bg-gold text-deep-brown border-gold"
                        : "border-gold text-gold hover:bg-gold/10"
                    )}
                  >
                    {isSelected ? 'Selected \u2713' : 'Use This Template \u2192'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SECTION 3: 3-STEP PROCESS
   ════════════════════════════════════════════ */

function StepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.step-item-1', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        x: -40, opacity: 0, duration: 0.8, ease: 'expo.out',
      });
      gsap.from('.step-item-2', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        x: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'expo.out',
      });
      gsap.from('.step-item-3', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        x: -40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'expo.out',
      });
      gsap.from('.step-icon', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        scale: 0, duration: 0.4, stagger: 0.2, ease: 'back.out(1.7)', delay: 0.3,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  const steps = [
    {
      num: '01',
      icon: Layout,
      title: 'Choose Your Template',
      titleKm: '\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F\u1782\u1798\u17D2\u179A\u17BC',
      desc: 'Pick from industry-specific templates designed by HR professionals. Each one is optimized for your field.',
      time: '\u23F1 30 seconds',
    },
    {
      num: '02',
      icon: FormInput,
      title: 'Fill In Your Details',
      titleKm: '\u1794\u17C6\u1796\u17C1\u179B\u17BE\u179B\u1796\u17C0\u1796\u17B7\u1791\u17D2\u1799\u17B6',
      desc: 'Simple form fields with examples. Auto-saves as you type. Fill once, use everywhere. Large buttons, clear labels \u2014 designed for mobile.',
      time: '\u23F1 2 minutes',
      note: 'Works offline \u2014 save and continue later',
    },
    {
      num: '03',
      icon: Download,
      title: 'Download & Share',
      titleKm: '\u1791\u17B6\u17C1\u1789\u1799\u1780\u1793\u17B7\u1784\u1785\u17C6\u179A\u17BE\u179B\u17BE\u179B\u17D2\u178F\u179F\u17D2\u179A\u17B6\u1799',
      desc: 'Get your resume as PDF. Share directly to Facebook, Messenger, or Telegram. Send to employers with one tap.',
      time: '\u23F1 30 seconds',
      isLast: true,
    },
  ];

  return (
    <section ref={sectionRef} className="bg-deep-brown py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="text-caption text-gold tracking-[0.15em] uppercase mb-3">
            {'\u1787\u17C6\u17A0\u17B6\u1793 / \u6B65\u9AA4 / STEPS'}
          </div>
          <h2 className="font-display text-h2 text-warm-white mb-3">Build Your Resume in 3 Easy Steps</h2>
        </div>

        <div className="relative">
          {/* Connecting line - desktop horizontal, mobile vertical */}
          <div className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-gold/30" />
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gold/30" />

          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const itemClass = i % 2 === 0 ? 'step-item-1' : 'step-item-2';
              return (
                <div key={s.num} className={cn(itemClass, 'relative flex gap-6 lg:flex-col lg:items-center lg:text-center')}>
                  <div className="step-icon relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: s.isLast
                        ? 'linear-gradient(135deg, #059669, #34D399)'
                        : 'linear-gradient(135deg, #D4AF37, #F5E6A3)',
                      boxShadow: s.isLast
                        ? '0 0 20px rgba(5,150,105,0.3)'
                        : '0 0 20px rgba(212,175,55,0.3)',
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[4rem] font-bold leading-none opacity-10 text-gold absolute -top-4 right-0 lg:left-1/2 lg:-translate-x-1/2 pointer-events-none select-none">
                      {s.num}
                    </div>
                    <h3 className="text-h4 font-semibold text-warm-white mb-2 relative">{s.title}</h3>
                    <p className="text-body text-warm-white/70 mb-3 relative">{s.desc}</p>
                    <div className="flex items-center gap-3 lg:justify-center relative">
                      <span className="text-caption text-gold font-medium">{s.time}</span>
                      {s.note && <span className="text-caption text-emerald">{s.note}</span>}
                    </div>
                    {s.isLast && (
                      <div className="flex gap-2 mt-3 lg:justify-center relative">
                        <span className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook className="w-4 h-4" /></span>
                        <span className="w-9 h-9 rounded-full bg-[#0088CC] flex items-center justify-center text-white"><Send className="w-4 h-4" /></span>
                        <span className="w-9 h-9 rounded-full bg-[#0088CC] flex items-center justify-center text-white"><MessageCircle className="w-4 h-4" /></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SECTION 4: RESUME PREVIEW DEMO
   ════════════════════════════════════════════ */

function PreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TemplateId>('garment');

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.preview-container', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scale: 0.95, opacity: 0, duration: 0.7, ease: 'expo.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  const tabs: { id: TemplateId; label: string }[] = [
    { id: 'garment', label: 'Garment' },
    { id: 'tourism', label: 'Tourism' },
    { id: 'ict', label: 'ICT' },
  ];

  return (
    <section ref={sectionRef} className="bg-cream py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="text-caption text-gold tracking-[0.15em] uppercase mb-3">
            {'\u1798\u17BE\u179B / \u9884\u89C8 / PREVIEW'}
          </div>
          <h2 className="font-display text-h2 text-charcoal mb-3">See What Employers Will See</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 border border-sand shadow-sm relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all z-10',
                  activeTab === tab.id ? 'text-deep-brown' : 'text-warm-gray hover:text-charcoal'
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="previewTab"
                    className="absolute inset-0 bg-gold rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview container */}
        <div className="preview-container max-w-[700px] mx-auto">
          <div className="bg-white rounded-2xl shadow-card-hover border border-sand overflow-hidden" style={{ aspectRatio: '210/297', maxHeight: '70vh' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <MiniResumePreview templateId={activeTab} isInteractive />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SECTION 5: POPULAR EXAMPLES CAROUSEL
   ════════════════════════════════════════════ */

function ExamplesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.example-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        x: 50, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setScrollPos(prev => {
        const maxScroll = (exampleResumes.length - 3) * 316;
        const next = prev + 316;
        return next > maxScroll ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (dir: 'left' | 'right') => {
    const amount = 316;
    setScrollPos(prev => {
      const maxScroll = Math.max(0, (exampleResumes.length - 3) * 316);
      if (dir === 'left') return Math.max(0, prev - amount);
      return Math.min(maxScroll, prev + amount);
    });
  };

  const getIndustryColor = (industry: string) => {
    if (industry === 'Garment') return '#D4AF37';
    if (industry === 'Tourism') return '#E85D3E';
    if (industry === 'ICT') return '#059669';
    return '#9C9588';
  };

  return (
    <section ref={sectionRef} className="bg-warm-white py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h3 className="font-display text-h3 text-charcoal text-center mb-8">
          {'\u1782\u1798\u17D2\u179A\u17BC\u1794\u179A\u179C\u178F\u17D2\u178F\u17CB\u179B\u17BC\u1794\u1796\u17C1\u1799\u17B7\u1798\u1793\u17B7\u1799\u1798 '}
          / Popular Resume Examples
        </h3>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel */}
          <div className="overflow-hidden">
            <motion.div
              ref={carouselRef}
              className="flex gap-4"
              animate={{ x: -scrollPos }}
              transition={{ duration: 0.4, ease: easeSmooth }}
            >
              {exampleResumes.map((ex) => {
                const Icon = ex.icon;
                return (
                  <motion.div
                    key={ex.id}
                    className="example-card flex-shrink-0 w-[300px] bg-white rounded-xl border border-sand shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover hover:scale-[1.03] transition-all"
                    whileHover={{ y: -4 }}
                  >
                    <div className="aspect-[200/280] bg-cream/50 p-4">
                      <div className="w-full h-full bg-white rounded-lg border border-sand overflow-hidden p-3">
                        <div className="border-b-2 pb-1.5 mb-2" style={{ borderColor: getIndustryColor(ex.industry) }}>
                          <div className="h-2 w-16 bg-charcoal rounded" />
                          <div className="h-1 w-24 bg-warm-gray/40 rounded mt-1" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1 w-12 rounded" style={{ background: getIndustryColor(ex.industry) }} />
                          <div className="h-1.5 w-full bg-sand/50 rounded" />
                          <div className="h-1.5 w-4/5 bg-sand/50 rounded" />
                          <div className="h-1.5 w-3/4 bg-sand/50 rounded" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {['Skill 1', 'Skill 2', 'Skill 3'].map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded text-[7px]" style={{
                              background: getIndustryColor(ex.industry) + '18',
                              color: getIndustryColor(ex.industry),
                            }}>{s}</span>
                          ))}
                        </div>
                        <div className="mt-auto pt-3">
                          <div className="h-1 w-10 rounded" style={{ background: getIndustryColor(ex.industry) }} />
                          <div className="h-1.5 w-full bg-sand/40 rounded mt-1" />
                          <div className="h-1.5 w-2/3 bg-sand/40 rounded mt-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-charcoal text-sm mb-1">{ex.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium" style={{
                          background: getIndustryColor(ex.industry) + '15',
                          color: getIndustryColor(ex.industry),
                        }}>
                          <span className="flex items-center gap-1">
                            <Icon className="w-3 h-3" />{ex.industry}
                          </span>
                        </span>
                        <span className="text-[10px] text-warm-gray">{ex.years}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/3 -translate-x-4 w-12 h-12 rounded-full bg-white border-2 border-gold shadow-md flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/3 translate-x-4 w-12 h-12 rounded-full bg-white border-2 border-gold shadow-md flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {exampleResumes.map((_, i) => (
              <button
                key={i}
                onClick={() => setScrollPos(i * 316)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  Math.floor(scrollPos / 316) === i ? 'bg-gold w-6' : 'bg-sand hover:bg-warm-gray'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SECTION 6: CTA
   ════════════════════════════════════════════ */

function CTASection({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.cta-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24"
      style={{ background: 'linear-gradient(180deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)' }}
    >
      <div className="max-w-[640px] mx-auto px-4 md:px-8 text-center">
        <motion.div
          className="cta-item mx-auto w-16 h-16 mb-6"
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M32 8C20 8 12 16 12 28c0 8 4 14 10 18l10 10 10-10c6-4 10-10 10-18 0-12-8-20-20-20z" fill="#D4AF37" opacity="0.9" />
            <path d="M32 16l4 8 8 1-6 6 1.5 8L32 34l-7.5 5L26 31l-6-6 8-1z" fill="#F5E6A3" />
          </svg>
        </motion.div>

        <h2 className="cta-item font-display text-h2 text-warm-white mb-4">
          {'\u1794\u179A\u179C\u178F\u17D2\u178F\u17CB\u179B\u17BC\u1794\u1796\u17C1\u1799\u17B7\u1798\u1793\u17B7\u1799\u1798? / Ready to Build Your Resume?'}
        </h2>
        <p className="cta-item text-body-large mb-8" style={{ color: 'rgba(250,248,243,0.8)' }}>
          Join 28,000+ job seekers who found work with KhmerHR resumes. Free, fast, and mobile-friendly.
        </p>

        <div className="cta-item flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={onStart}
            className="bg-gold text-deep-brown px-8 py-4 rounded-xl font-semibold text-lg shadow-gold hover:shadow-gold-hover hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[64px]"
          >
            <FileText className="w-5 h-5" /> Build My Resume Now
          </button>
          <button className="bg-[#1877F2] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[64px]">
            <Facebook className="w-5 h-5" /> Share on Facebook
          </button>
        </div>

        <div className="cta-item flex flex-wrap gap-x-4 gap-y-2 justify-center text-caption text-gold/80">
          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Free</span>
          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> No account needed</span>
          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 3 minutes</span>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════ */

export default function Resume() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('garment');

  const openWizard = useCallback((template?: TemplateId) => {
    if (template) setSelectedTemplate(template);
    setShowWizard(true);
  }, []);

  return (
    <div className="pt-[0px]">
      <AnimatePresence>
        {showWizard && (
          <ResumeWizard
            key="wizard"
            selectedTemplate={selectedTemplate}
            onClose={() => setShowWizard(false)}
          />
        )}
      </AnimatePresence>

      <HeroSection onStart={() => openWizard()} />
      <TemplateSection selected={selectedTemplate} onSelect={(id) => { setSelectedTemplate(id); }} />
      <StepsSection />
      <PreviewSection />
      <ExamplesSection />
      <CTASection onStart={() => openWizard()} />
    </div>
  );
}
