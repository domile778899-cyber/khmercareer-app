import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Bookmark,
  FileText,
  Settings,
  Bell,
  Lock,
  Edit3,
  Camera,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  Calendar,
  ChevronRight,
  Trash2,
  Download,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { jobsApi } from '../api/jobsApi';
import { favoritesApi } from '../api/favoritesApi';
import type { MyApplication } from '../api/types';

interface SavedJob {
  id: string;
  jobId: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    createdAt: string;
  };
}

export default function Profile() {
  const { user, updateUserProfile } = useAuth() as any;
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved' | 'resume' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Real data
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Sync user fields when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  // Load applications
  const loadApplications = useCallback(async () => {
    if (activeTab !== 'applications') return;
    setLoadingApps(true);
    try {
      const apps = await jobsApi.getMyApplications();
      setApplications(apps);
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setLoadingApps(false);
    }
  }, [activeTab]);

  // Load saved jobs
  const loadSavedJobs = useCallback(async () => {
    if (activeTab !== 'saved') return;
    setLoadingSaved(true);
    try {
      const favs = await favoritesApi.getFavorites();
      setSavedJobs(favs as any);
    } catch (e) {
      console.error('Failed to load saved jobs:', e);
    } finally {
      setLoadingSaved(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        fullName,
        phone,
        location,
        bio,
        skills,
      });
      setIsEditing(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (e) {
      console.error('Failed to save profile:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleRemoveFavorite = async (jobId: string) => {
    try {
      await favoritesApi.removeFavorite(jobId);
      setSavedJobs(prev => prev.filter(f => f.jobId !== jobId));
    } catch (e) {
      console.error('Failed to remove favorite:', e);
    }
  };

  const tabs = [
    { key: 'overview' as const, label: t('profile.overview'), icon: UserCircle },
    { key: 'applications' as const, label: t('profile.applications'), icon: FileText },
    { key: 'saved' as const, label: t('profile.savedJobs'), icon: Bookmark },
    { key: 'resume' as const, label: t('profile.myResume'), icon: FileText },
    { key: 'settings' as const, label: t('profile.settings'), icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald/10 text-emerald border-emerald/20';
      case 'pending': return 'bg-gold/10 text-gold-dark border-gold/20';
      case 'reviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-coral/10 text-coral border-coral/20';
      default: return 'bg-sand text-warm-gray border-sand';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Applied',
      reviewing: 'Reviewing',
      accepted: 'Interview',
      rejected: 'Rejected',
    };
    return map[status] || status;
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2024';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header Banner */}
      <div className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/4 translate-y-1/3" />
        </div>
        <div className="max-w-container-desktop mx-auto px-4 py-10 md:py-16 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-gold" />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-deep-brown text-3xl md:text-4xl font-display font-bold shadow-gold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-warm-white rounded-full shadow-md flex items-center justify-center hover:bg-cream transition-colors">
                <Camera className="w-4 h-4 text-charcoal" />
              </button>
            </motion.div>
            <div className="text-center md:text-left flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl md:text-4xl font-bold text-warm-white"
              >
                {user?.fullName || 'User'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-warm-gray mt-1"
              >
                {user?.role === 'employer' ? 'Employer' : 'Job Seeker'} • {user?.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mt-3 justify-center md:justify-start"
              >
                {location && (
                  <span className="flex items-center gap-1 text-xs text-warm-gray">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-warm-gray">
                  <Calendar className="w-3 h-3" /> Member since {memberSince}
                </span>
                {user?.verified && (
                  <span className="flex items-center gap-1 text-xs text-emerald">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2"
            >
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gold hover:bg-gold-dark text-deep-brown text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t('profile.cancel') : t('profile.editProfile')}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-warm-white border-b border-sand">
        <div className="max-w-container-desktop mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, value: String(applications.length || '—'), label: t('profile.stats.applications') },
              { icon: Bookmark, value: String(savedJobs.length || '—'), label: t('profile.stats.savedJobs') },
              { icon: Eye, value: '—', label: t('profile.stats.profileViews') },
              { icon: TrendingUp, value: skills.length > 0 ? `${Math.min(100, 60 + skills.length * 3)}%` : '—', label: t('profile.stats.profileScore') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-gold mb-0.5">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xl font-bold text-charcoal">{stat.value}</span>
                </div>
                <p className="text-xs text-warm-gray">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-container-desktop mx-auto px-4 py-6">
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald/10 border border-emerald/20 rounded-lg p-3 mb-6 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald" />
            <span className="text-sm text-emerald">{t('profile.profileUpdated')}</span>
          </motion.div>
        )}

        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-gold text-deep-brown'
                  : 'text-warm-gray hover:text-charcoal hover:bg-sand/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Bio */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-charcoal flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-gold" />
                  {t('profile.aboutMe')}
                </h3>
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="text-xs text-emerald font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    {isSaving ? 'Saving...' : t('profile.save')}
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-sand rounded-lg text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-cream/50 min-h-[100px]"
                  placeholder="Tell employers about yourself..."
                />
              ) : (
                <p className="text-sm text-charcoal leading-relaxed">
                  {bio || <span className="text-warm-gray italic">No bio yet. Click Edit Profile to add one.</span>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-warm-white rounded-xl border border-sand p-6">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gold" />
                  {t('profile.personalInfo')}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: UserCircle, label: t('profile.fullName'), value: fullName, setter: setFullName, editable: true },
                    { icon: Mail, label: t('profile.email'), value: user?.email || '', setter: null, editable: false },
                    { icon: Phone, label: t('profile.phone'), value: phone, setter: setPhone, editable: true },
                    { icon: MapPin, label: t('profile.location'), value: location, setter: setLocation, editable: true },
                  ].map((field, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <field.icon className="w-4 h-4 text-warm-gray mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-warm-gray">{field.label}</p>
                        {isEditing && field.editable && field.setter ? (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.setter?.(e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-sand rounded text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 bg-cream/50"
                          />
                        ) : (
                          <p className="text-sm text-charcoal">
                            {field.value || <span className="text-warm-gray italic">Not set</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-warm-white rounded-xl border border-sand p-6">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  {t('profile.skills')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 bg-emerald/10 text-emerald text-sm rounded-full font-medium flex items-center gap-1"
                    >
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-coral">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </motion.span>
                  )) : (
                    <p className="text-sm text-warm-gray italic">No skills added yet.</p>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-1.5 border border-sand rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 bg-cream/50"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 py-1.5 bg-gold text-deep-brown rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                {t('profile.workExperience')}
              </h3>
              {(user?.experience as any[])?.length > 0 ? (
                <div className="space-y-4">
                  {(user?.experience as any[]).map((exp: any, i: number) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-sand last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-medium text-charcoal">{exp.title}</h4>
                        <p className="text-sm text-warm-gray">{exp.company}</p>
                        <p className="text-xs text-warm-gray flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {exp.period || exp.startDate}
                        </p>
                        {exp.description && <p className="text-sm text-charcoal mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-10 h-10 text-warm-gray/30 mx-auto mb-3" />
                  <p className="text-sm text-warm-gray">No work experience added yet.</p>
                  <Link to="/resume" className="text-sm text-gold hover:underline mt-1 inline-block">
                    Add experience in Resume Builder →
                  </Link>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gold" />
                {t('profile.education')}
              </h3>
              {(user?.education as any[])?.length > 0 ? (
                <div className="space-y-4">
                  {(user?.education as any[]).map((edu: any, i: number) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-sand last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-medium text-charcoal">{edu.degree}</h4>
                        <p className="text-sm text-warm-gray">{edu.school}</p>
                        <p className="text-xs text-warm-gray mt-1">{edu.year || edu.startYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-10 h-10 text-warm-gray/30 mx-auto mb-3" />
                  <p className="text-sm text-warm-gray">No education added yet.</p>
                  <Link to="/resume" className="text-sm text-gold hover:underline mt-1 inline-block">
                    Add education in Resume Builder →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-charcoal">{t('profile.myApplications')}</h3>
              <span className="text-sm text-warm-gray">{applications.length} {t('profile.total')}</span>
            </div>
            {loadingApps ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-warm-white rounded-xl border border-sand">
                <FileText className="w-12 h-12 text-warm-gray/30 mx-auto mb-4" />
                <p className="text-warm-gray font-medium">No applications yet</p>
                <p className="text-sm text-warm-gray mt-1">Start applying to jobs to track your progress here.</p>
                <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold text-deep-brown text-sm font-semibold rounded-lg hover:bg-gold-dark transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              applications.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-warm-white rounded-xl border border-sand p-4 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">
                      {app.job?.company?.charAt(0) || 'J'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-charcoal truncate">{app.job?.title || 'Job'}</h4>
                      <p className="text-sm text-warm-gray">{app.job?.company}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-warm-gray">
                        {app.job?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job.location}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === 'saved' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-charcoal">{t('profile.savedJobsTitle')}</h3>
              <span className="text-sm text-warm-gray">{savedJobs.length} {t('profile.total')}</span>
            </div>
            {loadingSaved ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-16 bg-warm-white rounded-xl border border-sand">
                <Bookmark className="w-12 h-12 text-warm-gray/30 mx-auto mb-4" />
                <p className="text-warm-gray font-medium">No saved jobs yet</p>
                <p className="text-sm text-warm-gray mt-1">Save jobs you're interested in to review them later.</p>
                <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold text-deep-brown text-sm font-semibold rounded-lg hover:bg-gold-dark transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              savedJobs.map((fav: any, i) => {
                const job = fav.job || fav;
                return (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-warm-white rounded-xl border border-sand p-4 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">
                        {job?.company?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-charcoal truncate">{job?.title || 'Job'}</h4>
                        <p className="text-sm text-warm-gray">{job?.company}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-warm-gray">
                          {job?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                          {job?.salaryMin && (
                            <span>${job.salaryMin}–${job.salaryMax} {job.salaryCurrency || 'USD'}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/jobs/${fav.jobId || job?.id}`}
                          className="text-xs px-3 py-1.5 bg-gold/10 text-gold-dark rounded-lg hover:bg-gold/20 transition-colors font-medium"
                        >
                          {t('profile.apply')}
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(fav.jobId || job?.id)}
                          className="p-2 text-warm-gray hover:text-coral transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                {t('profile.resumeBuilder')}
              </h3>
              <p className="text-sm text-warm-gray mb-6">
                {t('profile.resumeDesc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {['Modern', 'Classic', 'Creative'].map((template, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-sand hover:border-gold rounded-xl p-4 cursor-pointer transition-colors text-center"
                  >
                    <div className="w-16 h-20 bg-cream rounded mx-auto mb-3 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-warm-gray" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">{t(`profile.${template.toLowerCase()}`)}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/resume"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {t('profile.editResume')}
                </Link>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-sand hover:border-charcoal text-charcoal font-medium rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  {t('profile.downloadPDF')}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gold" />
                {t('profile.accountSettings')}
              </h3>
              <div className="space-y-4">
                {['Email notifications for new jobs', 'Push notifications for messages', 'Weekly job digest', 'Profile visibility to employers'].map((label, i) => (
                  <label key={i} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-sm text-charcoal">{label}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded border-sand text-gold focus:ring-gold/30" />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                {t('profile.notificationPreferences')}
              </h3>
              <div className="space-y-4">
                {['Application status updates', 'Interview reminders', 'New matching jobs', 'Course recommendations'].map((label, i) => (
                  <label key={i} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-sm text-charcoal">{label}</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-sand text-gold focus:ring-gold/30" />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                {t('profile.security')}
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-gold/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-charcoal">{t('profile.changePassword')}</span>
                  <ChevronRight className="w-4 h-4 text-warm-gray group-hover:text-gold transition-colors" />
                </button>
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-gold/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-charcoal">{t('profile.twoFactorAuth')}</span>
                  <span className="text-xs text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">{t('profile.enabled')}</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-coral/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-coral">{t('profile.deleteAccount')}</span>
                  <Trash2 className="w-4 h-4 text-coral" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
