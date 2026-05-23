import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  GripVertical,
  PlayCircle,
  FileText,
  HelpCircle,
  ClipboardList,
  Eye,
  CheckCircle2,
  Save,
  Send,
  DollarSign,
  Tag,
  Clock,
  Star,
  Users,
  BookOpen,
  Facebook,
  Linkedin,
  Youtube,
  Info,
} from 'lucide-react';
import { cn } from '../lib/utils';

/* ──────────────────────── Types ──────────────────────── */

type LessonType = 'Video' | 'Document' | 'Quiz' | 'Assignment';
type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
type CourseLanguage = 'English' | 'Khmer' | 'Chinese' | 'Thai';
type CourseCategory = 'English' | 'Chinese' | 'Khmer' | 'IT Skills' | 'Business' | 'Design' | 'Marketing' | 'Personal Development' | 'Factory Skills' | 'Hospitality';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  description: string;
  isFreePreview: boolean;
  videoProgress?: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseForm {
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  language: CourseLanguage;
  description: string;
  learningOutcomes: string[];
  requirements: string[];
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  tags: string[];
}

interface TeacherBio {
  displayName: string;
  professionalTitle: string;
  bio: string;
  profilePhoto: string | null;
  socialFacebook: string;
  socialLinkedIn: string;
  socialYouTube: string;
}

/* ──────────────────────── Helpers ──────────────────────── */

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const categories: CourseCategory[] = [
  'English', 'Chinese', 'Khmer', 'IT Skills', 'Business', 'Design', 'Marketing', 'Personal Development', 'Factory Skills', 'Hospitality',
];

const lessonTypeIcons: Record<LessonType, React.ComponentType<{ size?: number; className?: string }>> = {
  Video: PlayCircle,
  Document: FileText,
  Quiz: HelpCircle,
  Assignment: ClipboardList,
};

/* ──────────────────────── Input Components ──────────────────────── */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mb-5">
      <label className="block text-body-small font-semibold text-charcoal mb-2">
        {label}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body min-h-[56px]"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxChars,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  maxChars?: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-body-small font-semibold text-charcoal">
          {label}
        </label>
        {maxChars && (
          <span className={cn(
            'text-caption',
            value.length > maxChars ? 'text-coral' : 'text-warm-gray'
          )}>
            {value.length}/{maxChars}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          if (!maxChars || e.target.value.length <= maxChars) {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body resize-none"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div className="mb-5">
      <label className="block text-body-small font-semibold text-charcoal mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-sand text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body min-h-[56px] appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function BulletPointInput({
  items,
  onChange,
  placeholder,
  minItems = 0,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  minItems?: number;
}) {
  const [inputValue, setInputValue] = useState('');

  const addItem = useCallback(() => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  }, [inputValue, items, onChange]);

  const removeItem = useCallback((index: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  }, [items, onChange, minItems]);

  return (
    <div className="mb-5">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-5 py-3.5 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body min-h-[48px]"
        />
        <button
          onClick={addItem}
          className="px-4 py-3 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-deep-brown transition-all duration-200 shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 bg-cream px-4 py-2.5 rounded-lg text-body-small text-charcoal"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald shrink-0" />
                <span>{item}</span>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="text-warm-gray hover:text-coral transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length < minItems && (
        <p className="text-caption text-coral mt-2">
          Add at least {minItems} items
        </p>
      )}
    </div>
  );
}

function ImageUploadZone({
  label,
  image,
  onChange,
}: {
  label: string;
  image: string | null;
  onChange: (img: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="mb-5">
      <label className="block text-body-small font-semibold text-charcoal mb-2">
        {label}
      </label>
      {image ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-sand">
          <img src={image} alt="Uploaded" className="w-full h-48 object-cover" />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-2 bg-deep-brown/70 text-white rounded-full hover:bg-deep-brown transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-48 rounded-xl border-2 border-dashed border-sand bg-cream flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all"
        >
          <Upload size={32} className="text-warm-gray mb-2" />
          <p className="text-body-small text-warm-gray text-center">
            Click or drag & drop to upload
          </p>
          <p className="text-caption text-warm-gray/70 mt-1">
            JPG, PNG up to 5MB
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}

/* ──────────────────────── Main Component ──────────────────────── */

export default function CourseUpload() {
  /* ── Form States ── */
  const [course, setCourse] = useState<CourseForm>({
    title: '',
    category: 'English',
    level: 'Beginner',
    language: 'English',
    description: '',
    learningOutcomes: [
      'Master essential vocabulary and grammar',
      'Hold basic conversations confidently',
      'Understand common workplace communication',
    ],
    requirements: [],
    thumbnail: null,
    price: 19.99,
    isFree: false,
    tags: [],
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: generateId(),
      title: 'Section 1: Introduction',
      lessons: [
        {
          id: generateId(),
          title: 'Welcome to the Course',
          type: 'Video' as LessonType,
          duration: '5:00',
          description: 'Overview of what you will learn',
          isFreePreview: true,
        },
        {
          id: generateId(),
          title: 'Course Materials',
          type: 'Document' as LessonType,
          duration: '2:00',
          description: 'Downloadable resources',
          isFreePreview: false,
        },
      ],
    },
  ]);

  const [teacherBio, setTeacherBio] = useState<TeacherBio>({
    displayName: '',
    professionalTitle: '',
    bio: '',
    profilePhoto: null,
    socialFacebook: '',
    socialLinkedIn: '',
    socialYouTube: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [sections[0].id]: true,
  });
  const [collapsedStep2, setCollapsedStep2] = useState(false);
  const [collapsedStep3, setCollapsedStep3] = useState(false);

  /* ── Computed Progress ── */
  const step1Complete = course.title.length > 0 && course.description.length > 0 && course.learningOutcomes.length >= 3;
  const step2Complete = sections.length > 0 && sections.every((s) => s.title.length > 0 && s.lessons.length > 0);
  const step3Complete = teacherBio.displayName.length > 0 && teacherBio.professionalTitle.length > 0 && teacherBio.bio.length > 0;
  const completedSteps = [step1Complete, step2Complete, step3Complete].filter(Boolean).length;

  /* ── Handlers ── */
  const addSection = useCallback(() => {
    const newSection: Section = {
      id: generateId(),
      title: '',
      lessons: [],
    };
    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title } : s))
    );
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }, []);

  const addLesson = useCallback((sectionId: string) => {
    const newLesson: Lesson = {
      id: generateId(),
      title: '',
      type: 'Video',
      duration: '10:00',
      description: '',
      isFreePreview: false,
    };
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s
      )
    );
  }, []);

  const removeLesson = useCallback((sectionId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s
      )
    );
  }, []);

  const updateLesson = useCallback(
    (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, ...updates } : l
                ),
              }
            : s
        )
      );
    },
    []
  );

  const addTag = useCallback(() => {
    if (tagInput.trim() && !course.tags.includes(tagInput.trim())) {
      setCourse((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  }, [tagInput, course.tags]);

  const removeTag = useCallback((tag: string) => {
    setCourse((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = sections.reduce((acc, s) => {
    return acc + s.lessons.reduce((lAcc, l) => {
      const parts = l.duration.split(':');
      const mins = Number(parts[0]) || 0;
      return lAcc + mins;
    }, 0);
  }, 0);

  /* ──────────────────────── Render ──────────────────────── */

  return (
    <div className="min-h-[100dvh] bg-warm-white pt-[72px]">
      {/* Header */}
      <div className="bg-deep-brown border-b border-sand/20">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px] py-6">
          <h1 className="text-h2 font-display text-warm-white mb-1">
            Course Creation Studio
          </h1>
          <p className="text-body text-warm-gray">
            Build your course step by step. Preview how students will see it on the right.
          </p>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px] py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ────────── LEFT COLUMN: Form (60%) ────────── */}
          <div className="w-full lg:w-[60%] space-y-6">

            {/* ══════ Step 1: Course Information ══════ */}
            <div className="bg-white border border-sand rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-gold/5 border-b border-sand flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold',
                    step1Complete ? 'bg-emerald text-white' : 'bg-gold text-deep-brown'
                  )}>
                    {step1Complete ? <CheckCircle2 size={16} /> : '1'}
                  </div>
                  <h2 className="text-h4 font-display text-charcoal">
                    Course Information
                  </h2>
                </div>
                {step1Complete && <CheckCircle2 size={20} className="text-emerald" />}
              </div>

              <div className="p-6">
                <FormInput
                  label="Course Title *"
                  value={course.title}
                  onChange={(val) => setCourse((prev) => ({ ...prev, title: val }))}
                  placeholder="e.g., Business English for Cambodian Professionals"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Category"
                    value={course.category}
                    onChange={(val) => setCourse((prev) => ({ ...prev, category: val as CourseCategory }))}
                    options={categories}
                  />
                  <FormSelect
                    label="Course Level"
                    value={course.level}
                    onChange={(val) => setCourse((prev) => ({ ...prev, level: val as CourseLevel }))}
                    options={['Beginner', 'Intermediate', 'Advanced', 'All Levels']}
                  />
                </div>

                <FormSelect
                  label="Language"
                  value={course.language}
                  onChange={(val) => setCourse((prev) => ({ ...prev, language: val as CourseLanguage }))}
                  options={['English', 'Khmer', 'Chinese', 'Thai']}
                />

                <FormTextarea
                  label="Course Description *"
                  value={course.description}
                  onChange={(val) => setCourse((prev) => ({ ...prev, description: val }))}
                  placeholder="Describe what your course covers, who it's for, and what students will achieve..."
                  rows={5}
                />

                <div className="mb-2">
                  <label className="block text-body-small font-semibold text-charcoal mb-2">
                    What Students Will Learn * (min 3)
                  </label>
                  <BulletPointInput
                    items={course.learningOutcomes}
                    onChange={(items) => setCourse((prev) => ({ ...prev, learningOutcomes: items }))}
                    placeholder="Add a learning outcome (e.g., 'Master basic grammar')"
                    minItems={3}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-body-small font-semibold text-charcoal mb-2">
                    Requirements / Prerequisites
                  </label>
                  <BulletPointInput
                    items={course.requirements}
                    onChange={(items) => setCourse((prev) => ({ ...prev, requirements: items }))}
                    placeholder="Add a prerequisite (e.g., 'Basic computer skills')"
                  />
                </div>

                <ImageUploadZone
                  label="Course Thumbnail"
                  image={course.thumbnail}
                  onChange={(img) => setCourse((prev) => ({ ...prev, thumbnail: img }))}
                />

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-body-small font-semibold text-charcoal">
                      Price
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.isFree}
                        onChange={(e) => setCourse((prev) => ({ ...prev, isFree: e.target.checked }))}
                        className="w-5 h-5 rounded border-2 border-sand text-gold focus:ring-gold/20 accent-gold"
                      />
                      <span className="text-body-small text-charcoal">Free Course</span>
                    </label>
                  </div>
                  {!course.isFree && (
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                      <input
                        type="number"
                        min="1"
                        max="500"
                        step="0.01"
                        value={course.price}
                        onChange={(e) => setCourse((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-white border-2 border-sand text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body min-h-[56px]"
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-2">
                  <label className="block text-body-small font-semibold text-charcoal mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add tags (comma separated)"
                        className="w-full pl-11 pr-5 py-3 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body-small min-h-[48px]"
                      />
                    </div>
                    <button
                      onClick={addTag}
                      className="px-4 py-3 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-deep-brown transition-all duration-200 shrink-0"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark px-3 py-1.5 rounded-full text-caption font-medium"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-coral transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══════ Step 2: Curriculum Builder ══════ */}
            <div className="bg-white border border-sand rounded-2xl overflow-hidden">
              <button
                onClick={() => setCollapsedStep2(!collapsedStep2)}
                className="w-full px-6 py-4 bg-gold/5 border-b border-sand flex items-center justify-between hover:bg-gold/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold',
                    step2Complete ? 'bg-emerald text-white' : 'bg-gold text-deep-brown'
                  )}>
                    {step2Complete ? <CheckCircle2 size={16} /> : '2'}
                  </div>
                  <h2 className="text-h4 font-display text-charcoal text-left">
                    Curriculum Builder
                  </h2>
                  <span className="text-caption text-warm-gray">
                    ({sections.length} sections, {totalLessons} lessons)
                  </span>
                </div>
                {collapsedStep2 ? <ChevronDown size={20} className="text-warm-gray" /> : <ChevronUp size={20} className="text-warm-gray" />}
              </button>

              <AnimatePresence>
                {!collapsedStep2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6">
                      <AnimatePresence>
                        {sections.map((section) => (
                          <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="border border-sand rounded-xl mb-4 overflow-hidden"
                          >
                            {/* Section Header */}
                            <div className="px-4 py-3 bg-cream flex items-center gap-3">
                              <GripVertical size={18} className="text-warm-gray shrink-0" />
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                placeholder="Section title"
                                className="flex-1 bg-transparent text-body font-semibold text-charcoal placeholder:text-warm-gray focus:outline-none"
                              />
                              <button
                                onClick={() => toggleSection(section.id)}
                                className="p-1.5 text-warm-gray hover:text-charcoal transition-colors"
                              >
                                {expandedSections[section.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              <button
                                onClick={() => removeSection(section.id)}
                                className="p-1.5 text-warm-gray hover:text-coral transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Section Lessons */}
                            <AnimatePresence>
                              {expandedSections[section.id] && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4">
                                    {section.lessons.map((lesson) => (
                                      <LessonEditor
                                        key={lesson.id}
                                        lesson={lesson}
                                        onUpdate={(updates) => updateLesson(section.id, lesson.id, updates)}
                                        onRemove={() => removeLesson(section.id, lesson.id)}
                                      />
                                    ))}
                                    <button
                                      onClick={() => addLesson(section.id)}
                                      className="w-full py-2.5 border-2 border-dashed border-sand rounded-lg text-body-small font-medium text-warm-gray hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
                                    >
                                      <Plus size={16} />
                                      Add Lesson
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button
                        onClick={addSection}
                        className="w-full py-3.5 border-2 border-dashed border-gold/40 rounded-xl text-body font-medium text-gold hover:bg-gold/5 hover:border-gold transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Section
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ══════ Step 3: Teacher Bio ══════ */}
            <div className="bg-white border border-sand rounded-2xl overflow-hidden">
              <button
                onClick={() => setCollapsedStep3(!collapsedStep3)}
                className="w-full px-6 py-4 bg-gold/5 border-b border-sand flex items-center justify-between hover:bg-gold/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold',
                    step3Complete ? 'bg-emerald text-white' : 'bg-gold text-deep-brown'
                  )}>
                    {step3Complete ? <CheckCircle2 size={16} /> : '3'}
                  </div>
                  <h2 className="text-h4 font-display text-charcoal text-left">
                    Teacher Bio
                  </h2>
                </div>
                {collapsedStep3 ? <ChevronDown size={20} className="text-warm-gray" /> : <ChevronUp size={20} className="text-warm-gray" />}
              </button>

              <AnimatePresence>
                {!collapsedStep3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6">
                      <FormInput
                        label="Display Name *"
                        value={teacherBio.displayName}
                        onChange={(val) => setTeacherBio((prev) => ({ ...prev, displayName: val }))}
                        placeholder="How students will see your name"
                      />

                      <FormInput
                        label="Professional Title *"
                        value={teacherBio.professionalTitle}
                        onChange={(val) => setTeacherBio((prev) => ({ ...prev, professionalTitle: val }))}
                        placeholder="e.g., Senior English Instructor"
                      />

                      <FormTextarea
                        label="Bio *"
                        value={teacherBio.bio}
                        onChange={(val) => setTeacherBio((prev) => ({ ...prev, bio: val }))}
                        placeholder="Tell students about your experience, teaching style, and expertise..."
                        rows={4}
                        maxChars={200}
                      />

                      <ImageUploadZone
                        label="Profile Photo"
                        image={teacherBio.profilePhoto}
                        onChange={(img) => setTeacherBio((prev) => ({ ...prev, profilePhoto: img }))}
                      />

                      <div className="mb-2">
                        <label className="block text-body-small font-semibold text-charcoal mb-3">
                          Social Links (Optional)
                        </label>
                        <div className="space-y-3">
                          <div className="relative">
                            <Facebook size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                            <input
                              type="text"
                              value={teacherBio.socialFacebook}
                              onChange={(e) => setTeacherBio((prev) => ({ ...prev, socialFacebook: e.target.value }))}
                              placeholder="Facebook profile URL"
                              className="w-full pl-11 pr-5 py-3 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body-small min-h-[48px]"
                            />
                          </div>
                          <div className="relative">
                            <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                            <input
                              type="text"
                              value={teacherBio.socialLinkedIn}
                              onChange={(e) => setTeacherBio((prev) => ({ ...prev, socialLinkedIn: e.target.value }))}
                              placeholder="LinkedIn profile URL"
                              className="w-full pl-11 pr-5 py-3 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body-small min-h-[48px]"
                            />
                          </div>
                          <div className="relative">
                            <Youtube size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                            <input
                              type="text"
                              value={teacherBio.socialYouTube}
                              onChange={(e) => setTeacherBio((prev) => ({ ...prev, socialYouTube: e.target.value }))}
                              placeholder="YouTube channel URL"
                              className="w-full pl-11 pr-5 py-3 rounded-xl bg-white border-2 border-sand text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-body-small min-h-[48px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ────────── RIGHT COLUMN: Preview (40%) ────────── */}
          <div className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-[88px] space-y-6">
              <PreviewPanel
                course={course}
                sections={sections}
                teacherBio={teacherBio}
                totalLessons={totalLessons}
                totalDuration={totalDuration}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ────────── Bottom Sticky Bar ────────── */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-sand z-40">
        <div className="mx-auto px-4 md:px-8 lg:max-w-[1200px] xl:max-w-[1320px] py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    step <= completedSteps ? 'bg-emerald' : 'bg-sand'
                  )}
                />
              ))}
            </div>
            <span className="text-body-small text-warm-gray">
              Step {completedSteps} of 3 completed
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => alert('Draft saved!')}
              className="flex-1 sm:flex-none px-6 py-3 border-2 border-sand text-charcoal rounded-xl text-button-small font-semibold hover:border-gold hover:text-gold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save as Draft
            </button>
            <button
              onClick={() => {
                if (!step1Complete || !step2Complete || !step3Complete) {
                  alert('Please complete all 3 steps before submitting.');
                  return;
                }
                alert('Course submitted for review! We will review it within 3-5 business days.');
              }}
              className="flex-1 sm:flex-none px-8 py-3 bg-gold text-deep-brown rounded-xl text-button-small font-semibold shadow-gold hover:bg-gold-dark hover:scale-[1.03] hover:shadow-gold-hover transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Lesson Editor Sub-Component ──────────────────────── */

function LessonEditor({
  lesson,
  onUpdate,
  onRemove,
}: {
  lesson: Lesson;
  onUpdate: (updates: Partial<Lesson>) => void;
  onRemove: () => void;
}) {
  const [videoProgress, setVideoProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const TypeIcon = lessonTypeIcons[lesson.type];

  const simulateUpload = useCallback(() => {
    setIsUploading(true);
    setVideoProgress(0);
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  return (
    <div className="bg-warm-white rounded-lg p-4 mb-3 border border-sand/60">
      <div className="flex items-center gap-2 mb-3">
        <GripVertical size={16} className="text-warm-gray shrink-0" />
        <TypeIcon size={16} className="text-gold shrink-0" />
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Lesson title"
          className="flex-1 bg-transparent text-body-small font-medium text-charcoal placeholder:text-warm-gray focus:outline-none"
        />
        <button
          onClick={onRemove}
          className="p-1 text-warm-gray hover:text-coral transition-colors shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <select
          value={lesson.type}
          onChange={(e) => onUpdate({ type: e.target.value as LessonType })}
          className="px-3 py-2 rounded-lg bg-white border border-sand text-caption text-charcoal focus:border-gold focus:outline-none"
        >
          <option value="Video">Video</option>
          <option value="Document">Document</option>
          <option value="Quiz">Quiz</option>
          <option value="Assignment">Assignment</option>
        </select>

        <div className="relative">
          <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            value={lesson.duration}
            onChange={(e) => onUpdate({ duration: e.target.value })}
            placeholder="MM:SS"
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-sand text-caption text-charcoal focus:border-gold focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lesson.isFreePreview}
            onChange={(e) => onUpdate({ isFreePreview: e.target.checked })}
            className="w-4 h-4 rounded border-2 border-sand text-gold accent-gold"
          />
          <span className="text-caption text-charcoal">Free preview</span>
        </label>
      </div>

      <textarea
        value={lesson.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Lesson description"
        rows={2}
        className="w-full px-3 py-2 rounded-lg bg-white border border-sand text-caption text-charcoal placeholder:text-warm-gray focus:border-gold focus:outline-none resize-none mb-3"
      />

      {/* Video Upload */}
      {lesson.type === 'Video' && (
        <div>
          {videoProgress === 100 ? (
            <div className="flex items-center gap-2 text-emerald text-caption">
              <CheckCircle2 size={14} />
              Video uploaded successfully
            </div>
          ) : (
            <button
              onClick={simulateUpload}
              disabled={isUploading}
              className="w-full py-2 border border-dashed border-sand rounded-lg text-caption text-warm-gray hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Upload size={14} />
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          )}
          {isUploading && videoProgress < 100 && (
            <div className="mt-2">
              <div className="w-full h-1.5 bg-sand/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${videoProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-caption text-warm-gray mt-1">{videoProgress}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Preview Panel Sub-Component ──────────────────────── */

function PreviewPanel({
  course,
  sections,
  teacherBio,
  totalLessons,
  totalDuration,
}: {
  course: CourseForm;
  sections: Section[];
  teacherBio: TeacherBio;
  totalLessons: number;
  totalDuration: number;
}) {
  const [activePreviewTab, setActivePreviewTab] = useState<'card' | 'curriculum' | 'info'>('card');

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Eye size={18} className="text-gold" />
        <h3 className="text-h4 font-display text-charcoal">Live Preview</h3>
        <span className="text-caption text-warm-gray ml-auto">
          This is how students will see your course
        </span>
      </div>

      {/* Preview Tabs */}
      <div className="flex gap-1 mb-4 bg-cream p-1 rounded-xl">
        {[
          { key: 'card' as const, label: 'Course Card' },
          { key: 'curriculum' as const, label: 'Curriculum' },
          { key: 'info' as const, label: 'Details' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePreviewTab(tab.key)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-caption font-medium transition-all',
              activePreviewTab === tab.key
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-warm-gray hover:text-charcoal'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview Content */}
      <div className="bg-white border border-sand rounded-2xl overflow-hidden shadow-card">
        {activePreviewTab === 'card' && (
          <div>
            {/* Course Thumbnail */}
            <div className="h-44 bg-gradient-to-br from-gold/20 via-gold/10 to-emerald/10 flex items-center justify-center relative">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-warm-gray">
                  <BookOpen size={48} className="mb-2 opacity-40" />
                  <span className="text-caption">Course thumbnail will appear here</span>
                </div>
              )}
              {!course.isFree && course.price > 0 && (
                <span className="absolute top-3 right-3 bg-gold text-deep-brown px-3 py-1 rounded-full text-caption font-semibold">
                  ${course.price.toFixed(2)}
                </span>
              )}
              {course.isFree && (
                <span className="absolute top-3 right-3 bg-emerald text-white px-3 py-1 rounded-full text-caption font-semibold">
                  FREE
                </span>
              )}
              <span className="absolute top-3 left-3 bg-white/90 text-charcoal px-3 py-1 rounded-full text-caption font-medium">
                {course.category}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-h4 font-display text-charcoal mb-2 line-clamp-2">
                {course.title || 'Your Course Title'}
              </h3>

              <p className="text-body-small text-warm-gray mb-4 line-clamp-3">
                {course.description || 'Course description will appear here...'}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-caption text-warm-gray">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {totalLessons} lessons
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {Math.ceil(totalDuration / 60)}h {totalDuration % 60}m
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {course.level}
                </div>
              </div>

              {/* Tags */}
              {course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="bg-cream text-warm-gray px-2.5 py-1 rounded-full text-caption"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Teacher */}
              <div className="flex items-center gap-3 pt-4 border-t border-sand">
                {teacherBio.profilePhoto ? (
                  <img
                    src={teacherBio.profilePhoto}
                    alt={teacherBio.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark font-bold text-sm">
                    {teacherBio.displayName ? teacherBio.displayName.charAt(0).toUpperCase() : 'T'}
                  </div>
                )}
                <div>
                  <p className="text-body-small font-semibold text-charcoal">
                    {teacherBio.displayName || 'Your Name'}
                  </p>
                  <p className="text-caption text-warm-gray">
                    {teacherBio.professionalTitle || 'Your Title'}
                  </p>
                </div>
              </div>

              {/* Mock stats */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-sand">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-gold fill-gold" />
                  <span className="text-caption font-medium text-charcoal">4.8</span>
                  <span className="text-caption text-warm-gray">(120)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info size={14} className="text-emerald" />
                  <span className="text-caption text-warm-gray">{course.language}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePreviewTab === 'curriculum' && (
          <div className="p-5">
            <h4 className="text-h4 font-display text-charcoal mb-4">
              Course Curriculum
            </h4>
            <p className="text-body-small text-warm-gray mb-4">
              {sections.length} sections &middot; {totalLessons} lessons &middot; {Math.ceil(totalDuration / 60)}h {totalDuration % 60}m total
            </p>

            <div className="space-y-3">
              {sections.map((section, si) => (
                <div key={section.id} className="border border-sand rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-cream flex items-center justify-between">
                    <span className="text-body-small font-semibold text-charcoal">
                      {section.title || `Section ${si + 1}`}
                    </span>
                    <span className="text-caption text-warm-gray">
                      {section.lessons.length} lessons
                    </span>
                  </div>
                  <div className="divide-y divide-sand/50">
                    {section.lessons.map((lesson, li) => {
                      const LiIcon = lessonTypeIcons[lesson.type];
                      return (
                        <div key={lesson.id} className="px-4 py-2.5 flex items-center gap-3">
                          <LiIcon size={14} className="text-warm-gray shrink-0" />
                          <span className="text-caption text-charcoal flex-1 truncate">
                            {lesson.title || `Lesson ${li + 1}`}
                          </span>
                          {lesson.isFreePreview && (
                            <span className="text-caption text-emerald font-medium shrink-0">
                              Preview
                            </span>
                          )}
                          <span className="text-caption text-warm-gray shrink-0">
                            {lesson.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {sections.length === 0 && (
                <p className="text-body-small text-warm-gray text-center py-8">
                  Add sections and lessons to see your curriculum here
                </p>
              )}
            </div>
          </div>
        )}

        {activePreviewTab === 'info' && (
          <div className="p-5">
            <h4 className="text-h4 font-display text-charcoal mb-4">
              Course Details
            </h4>

            {/* What You'll Learn */}
            {course.learningOutcomes.length > 0 && (
              <div className="mb-5">
                <h5 className="text-body-small font-semibold text-charcoal mb-2">
                  What You&apos;ll Learn
                </h5>
                <ul className="space-y-1.5">
                  {course.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-caption text-warm-gray">
                      <CheckCircle2 size={14} className="text-emerald shrink-0 mt-0.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <div className="mb-5">
                <h5 className="text-body-small font-semibold text-charcoal mb-2">
                  Requirements
                </h5>
                <ul className="space-y-1.5">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-caption text-warm-gray">
                      <Info size={14} className="text-gold shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About the Teacher */}
            <div className="pt-4 border-t border-sand">
              <h5 className="text-body-small font-semibold text-charcoal mb-3">
                About the Instructor
              </h5>
              <div className="flex items-center gap-3 mb-3">
                {teacherBio.profilePhoto ? (
                  <img
                    src={teacherBio.profilePhoto}
                    alt={teacherBio.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark font-bold">
                    {teacherBio.displayName ? teacherBio.displayName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <p className="text-body-small font-semibold text-charcoal">
                    {teacherBio.displayName || 'Instructor name'}
                  </p>
                  <p className="text-caption text-warm-gray">
                    {teacherBio.professionalTitle || 'Professional title'}
                  </p>
                </div>
              </div>
              {teacherBio.bio && (
                <p className="text-caption text-warm-gray">
                  {teacherBio.bio}
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="mt-5 pt-4 border-t border-sand">
              <div className="flex items-center justify-between">
                <span className="text-body-small font-semibold text-charcoal">Price</span>
                {course.isFree ? (
                  <span className="text-h4 font-display text-emerald">FREE</span>
                ) : (
                  <span className="text-h4 font-display text-gold">${course.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
