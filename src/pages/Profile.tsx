import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FileText,
  Bookmark,
  Briefcase,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit3,
  Bell,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { User as UserType } from '../context/AuthContext';

type TabId = 'overview' | 'applications' | 'saved' | 'resume' | 'settings';
type AppStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

interface SidebarItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: AppStatus;
}

interface SavedJob {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: <User size={18} /> },
  { id: 'applications', label: 'My Applications', icon: <Briefcase size={18} /> },
  { id: 'saved', label: 'Saved Jobs', icon: <Bookmark size={18} /> },
  { id: 'resume', label: 'My Resume', icon: <FileText size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

/* ─── Mock Data ─── */
const applications: Application[] = [
  { id: 1, jobTitle: 'Senior Frontend Developer', company: 'TechAsia Solutions', location: 'Phnom Penh', salary: '$1,200 - $1,800', appliedDate: '2025-04-15', status: 'pending' },
  { id: 2, jobTitle: 'UI/UX Designer', company: 'Creative Hub Cambodia', location: 'Phnom Penh', salary: '$800 - $1,200', appliedDate: '2025-04-10', status: 'reviewed' },
  { id: 3, jobTitle: 'React Developer', company: 'Goldensoft Co., Ltd.', location: 'Siem Reap', salary: '$1,000 - $1,500', appliedDate: '2025-03-28', status: 'accepted' },
  { id: 4, jobTitle: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Phnom Penh', salary: '$1,500 - $2,000', appliedDate: '2025-03-20', status: 'rejected' },
];

const savedJobs: SavedJob[] = [
  { id: 1, jobTitle: 'Frontend Team Lead', company: 'Vattanac Bank', location: 'Phnom Penh', salary: '$2,000 - $3,000', posted: '2 days ago' },
  { id: 2, jobTitle: 'Product Designer', company: 'Wing (Cambodia)', location: 'Phnom Penh', salary: '$1,200 - $1,800', posted: '5 days ago' },
  { id: 3, jobTitle: 'Mobile App Developer', company: 'Smart Axiata', location: 'Phnom Penh', salary: '$1,500 - $2,200', posted: '1 week ago' },
];

const statusConfig: Record<AppStatus, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', icon: <Clock size={14} />, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  reviewed: { label: 'Reviewed', icon: <Eye size={14} />, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  accepted: { label: 'Accepted', icon: <CheckCircle2 size={14} />, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  rejected: { label: 'Rejected', icon: <XCircle size={14} />, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ─── Settings state ─── */
  const [langPref, setLangPref] = useState(user?.language || 'en');
  const [emailNotif, setEmailNotif] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-warm-gray mb-4">Please log in to view your profile</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gold text-deep-brown px-6 py-3 rounded-xl text-button-small font-semibold shadow-gold hover:bg-gold-dark transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const completionFields = [
    !!user.fullName,
    !!user.email,
    !!user.phone,
    !!user.city,
    !!user.language,
  ];
  const completionPercent = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const avatarLetter = (user.fullName || user.email || '?')[0].toUpperCase();

  return (
    <div className="min-h-[100dvh] bg-warm-white pt-[72px]">
      <div className="mx-auto max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── Mobile Tab Selector ─── */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-sand text-charcoal"
            >
              <span className="flex items-center gap-2">
                {sidebarItems.find((i) => i.id === activeTab)?.icon}
                {sidebarItems.find((i) => i.id === activeTab)?.label}
              </span>
              <ChevronRight size={18} className={`transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-2 bg-white rounded-xl border border-sand shadow-sm"
                >
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === item.id ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-sand/30'
                      }`}
                    >
                      {item.icon}
                      <span className="text-body-small font-medium">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-coral hover:bg-red-50 transition-colors border-t border-sand"
                  >
                    <LogOut size={18} />
                    <span className="text-body-small font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Left Sidebar (Desktop) ─── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-sand shadow-[0_2px_8px_rgba(26,23,20,0.06)] overflow-hidden sticky top-[88px]">
              {/* User Card */}
              <div className="p-6 text-center border-b border-sand bg-gradient-to-b from-gold/5 to-transparent">
                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-deep-brown text-h2 font-bold mx-auto mb-3">
                  {avatarLetter}
                </div>
                <h3 className="text-h4 font-semibold text-charcoal">{user.fullName || 'User'}</h3>
                <p className="text-caption text-warm-gray mt-1">{user.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-light text-emerald text-caption font-medium">
                  <Shield size={12} />
                  Trust Score: {user.trustScore || 50}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand text-warm-gray text-caption">
                  {user.role === 'employer' ? <Briefcase size={10} /> : <Briefcase size={10} />}
                  {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 ${
                      activeTab === item.id
                        ? 'bg-gold text-deep-brown font-semibold shadow-[0_2px_8px_rgba(212,175,55,0.25)]'
                        : 'text-charcoal hover:bg-sand/40'
                    }`}
                  >
                    {item.icon}
                    <span className="text-body-small">{item.label}</span>
                    {item.id === 'applications' && (
                      <span className="ml-auto bg-gold/20 text-deep-brown text-caption font-bold px-2 py-0.5 rounded-full">
                        {applications.length}
                      </span>
                    )}
                    {item.id === 'saved' && (
                      <span className="ml-auto bg-gold/20 text-deep-brown text-caption font-bold px-2 py-0.5 rounded-full">
                        {savedJobs.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <div className="p-3 border-t border-sand">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-coral hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="text-body-small font-medium">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <OverviewTab
                  key="overview"
                  user={user}
                  completionPercent={completionPercent}
                />
              )}
              {activeTab === 'applications' && (
                <ApplicationsTab key="applications" applications={applications} />
              )}
              {activeTab === 'saved' && (
                <SavedJobsTab key="saved" savedJobs={savedJobs} />
              )}
              {activeTab === 'resume' && (
                <ResumeTab key="resume" user={user} />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  key="settings"
                  langPref={langPref}
                  setLangPref={setLangPref}
                  emailNotif={emailNotif}
                  setEmailNotif={setEmailNotif}
                  jobAlerts={jobAlerts}
                  setJobAlerts={setJobAlerts}
                  marketingEmails={marketingEmails}
                  setMarketingEmails={setMarketingEmails}
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmNewPassword={confirmNewPassword}
                  setConfirmNewPassword={setConfirmNewPassword}
                />
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InfoRow({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-sand/50 flex items-center justify-center text-warm-gray shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-caption text-warm-gray">{label}</p>
        <p className={`text-body-small font-medium ${muted ? 'text-warm-gray/60 italic' : 'text-charcoal'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function OverviewTab({
  user,
  completionPercent,
}: {
  user: UserType;
  completionPercent: number;
}) {
  const acceptedCount = applications.filter((a: Application) => a.status === 'accepted').length;
  const pendingCount = applications.filter((a: Application) => a.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h2 className="text-h3 font-semibold text-charcoal">
          Welcome back, {user.fullName?.split(' ')[0] || 'User'}!
        </h2>
        <p className="text-body text-warm-gray mt-1">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: applications.length, icon: <Briefcase size={20} />, color: 'bg-gold/10 text-gold' },
          { label: 'Accepted', value: acceptedCount, icon: <CheckCircle2 size={20} />, color: 'bg-emerald/10 text-emerald' },
          { label: 'Pending', value: pendingCount, icon: <Clock size={20} />, color: 'bg-amber/10 text-amber-600' },
          { label: 'Saved Jobs', value: savedJobs.length, icon: <Bookmark size={20} />, color: 'bg-blue-50 text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-sand p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
              {stat.icon}
            </div>
            <p className="text-h3 font-bold text-charcoal">{stat.value}</p>
            <p className="text-caption text-warm-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h4 font-semibold text-charcoal">Profile Completion</h3>
          <span className="text-h4 font-bold text-gold">{completionPercent}%</span>
        </div>
        <div className="w-full h-3 bg-sand rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
            className="h-full bg-gold rounded-full"
          />
        </div>
        <p className="text-body-small text-warm-gray mt-3">
          {completionPercent === 100
            ? 'Your profile is complete! Great job!'
            : 'Complete your profile to increase your chances of getting hired.'}
        </p>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h3 className="text-h4 font-semibold text-charcoal mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={<User size={16} />} label="Full Name" value={user.fullName} />
          <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={user.phone || 'Not set'} muted={!user.phone} />
          <InfoRow icon={<MapPin size={16} />} label="City" value={user.city || 'Not set'} muted={!user.city} />
          <InfoRow icon={<Globe size={16} />} label="Language" value={user.language?.toUpperCase() || 'EN'} />
          <InfoRow icon={<Shield size={16} />} label="Role" value={user.role === 'employer' ? 'Employer' : 'Job Seeker'} />
        </div>
      </div>
    </motion.div>
  );
}

function ApplicationsTab({ applications }: { applications: Application[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl border border-sand shadow-[0_2px_8px_rgba(26,23,20,0.06)] overflow-hidden">
        <div className="p-6 border-b border-sand">
          <h2 className="text-h3 font-semibold text-charcoal">My Applications</h2>
          <p className="text-body-small text-warm-gray mt-1">
            Track the status of your job applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={48} className="text-warm-gray/30 mx-auto mb-3" />
            <p className="text-body text-warm-gray">No applications yet</p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium mt-2"
            >
              Browse Jobs <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-sand">
            {applications.map((app: Application) => {
              const status = statusConfig[app.status];
              return (
                <div
                  key={app.id}
                  className="p-5 hover:bg-gold/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body font-semibold text-charcoal truncate">{app.jobTitle}</h4>
                    <p className="text-body-small text-warm-gray mt-0.5">{app.company}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-caption text-warm-gray">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {app.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {app.appliedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-small font-medium text-gold bg-gold/10 px-3 py-1 rounded-lg">
                      {app.salary}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium border ${status.bg} ${status.text} ${status.border}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SavedJobsTab({ savedJobs }: { savedJobs: SavedJob[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl border border-sand shadow-[0_2px_8px_rgba(26,23,20,0.06)] overflow-hidden">
        <div className="p-6 border-b border-sand">
          <h2 className="text-h3 font-semibold text-charcoal">Saved Jobs</h2>
          <p className="text-body-small text-warm-gray mt-1">
            Jobs you&apos;ve bookmarked for later
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark size={48} className="text-warm-gray/30 mx-auto mb-3" />
            <p className="text-body text-warm-gray">No saved jobs yet</p>
          </div>
        ) : (
          <div className="divide-y divide-sand">
            {savedJobs.map((job: SavedJob) => (
              <div
                key={job.id}
                className="p-5 hover:bg-gold/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-body font-semibold text-charcoal truncate">{job.jobTitle}</h4>
                  <p className="text-body-small text-warm-gray mt-0.5">{job.company}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-caption text-warm-gray">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span>{job.posted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-body-small font-medium text-gold bg-gold/10 px-3 py-1 rounded-lg">
                    {job.salary}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gold text-deep-brown text-caption font-medium rounded-lg hover:bg-gold-dark transition-colors"
                  >
                    View <ChevronRight size={14} />
                  </Link>
                  <button
                    onClick={() => { /* Remove bookmark logic would go here */ }}
                    className="p-2 text-warm-gray hover:text-coral transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ResumeTab({ user }: { user: UserType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h3 font-semibold text-charcoal">My Resume</h2>
            <p className="text-body-small text-warm-gray mt-1">Preview and manage your resume</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/resume"
              className="flex items-center gap-2 px-4 py-2.5 bg-gold text-deep-brown text-body-small font-semibold rounded-xl hover:bg-gold-dark transition-colors shadow-gold"
            >
              <Edit3 size={16} />
              Edit
            </Link>
            <button
              onClick={() => { /* Download logic */ }}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-sand text-charcoal text-body-small font-semibold rounded-xl hover:border-gold hover:bg-gold/5 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview Card */}
      <div className="bg-white rounded-2xl border-2 border-gold/30 shadow-[0_4px_16px_rgba(212,175,55,0.1)] overflow-hidden">
        <div className="bg-gradient-to-br from-deep-brown to-charcoal p-8 text-white">
          <h3 className="text-h2 font-bold">{user.fullName || 'Your Name'}</h3>
          <p className="text-body-large text-gold-light mt-1">
            {user.role === 'employer' ? 'Company Representative' : 'Frontend Developer'}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-body-small text-warm-gray">
            {user.email && <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>}
            {user.phone && <span className="flex items-center gap-1"><Phone size={14} /> {user.phone}</span>}
            {user.city && <span className="flex items-center gap-1"><MapPin size={14} /> {user.city}</span>}
          </div>
        </div>
        <div className="p-8">
          <div className="mb-6">
            <h4 className="text-h4 font-semibold text-charcoal mb-3 flex items-center gap-2">
              <FileText size={18} className="text-gold" />
              Professional Summary
            </h4>
            <p className="text-body text-warm-gray leading-relaxed">
              Experienced professional with a passion for delivering high-quality results.
              Skilled in modern technologies and collaborative teamwork. Seeking new
              opportunities to contribute and grow within a dynamic organization.
            </p>
          </div>
          <div className="mb-6">
            <h4 className="text-h4 font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-gold" />
              Work Experience
            </h4>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-gold/30">
                <p className="text-body font-medium text-charcoal">Senior Developer</p>
                <p className="text-body-small text-warm-gray">Tech Company | 2022 - Present</p>
              </div>
              <div className="pl-4 border-l-2 border-sand">
                <p className="text-body font-medium text-charcoal">Junior Developer</p>
                <p className="text-body-small text-warm-gray">StartupXYZ | 2020 - 2022</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-h4 font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Globe size={18} className="text-gold" />
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {['English', 'Khmer'].map((lang) => (
                <span key={lang} className="px-3 py-1 bg-sand/50 text-charcoal text-body-small rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsTab({
  langPref,
  setLangPref,
  emailNotif,
  setEmailNotif,
  jobAlerts,
  setJobAlerts,
  marketingEmails,
  setMarketingEmails,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
}: {
  langPref: string;
  setLangPref: (v: string) => void;
  emailNotif: boolean;
  setEmailNotif: (v: boolean) => void;
  jobAlerts: boolean;
  setJobAlerts: (v: boolean) => void;
  marketingEmails: boolean;
  setMarketingEmails: (v: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Language Preference */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h3 className="text-h4 font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Globe size={18} className="text-gold" />
          Language Preference
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { code: 'en', label: 'English' },
            { code: 'km', label: 'Khmer' },
            { code: 'zh', label: 'Chinese' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLangPref(l.code)}
              className={`px-4 py-2.5 rounded-xl text-body-small font-medium transition-all duration-200 ${
                langPref === l.code
                  ? 'bg-gold text-deep-brown shadow-[0_2px_8px_rgba(212,175,55,0.25)]'
                  : 'bg-sand/40 text-charcoal hover:bg-sand'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h3 className="text-h4 font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Bell size={18} className="text-gold" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <ToggleRow
            label="Email Notifications"
            description="Receive general email updates"
            enabled={emailNotif}
            onChange={setEmailNotif}
          />
          <ToggleRow
            label="Job Alerts"
            description="Get notified about new matching jobs"
            enabled={jobAlerts}
            onChange={setJobAlerts}
          />
          <ToggleRow
            label="Marketing Emails"
            description="Receive promotional content and newsletters"
            enabled={marketingEmails}
            onChange={setMarketingEmails}
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-sand p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h3 className="text-h4 font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Lock size={18} className="text-gold" />
          Change Password
        </h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-body-small font-medium text-charcoal mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-sand focus:border-gold bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
              style={{ minHeight: '48px' }}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-body-small font-medium text-charcoal mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-sand focus:border-gold bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
              style={{ minHeight: '48px' }}
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-body-small font-medium text-charcoal mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-sand focus:border-gold bg-white text-charcoal outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
              style={{ minHeight: '48px' }}
              placeholder="Confirm new password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (newPassword && newPassword === confirmNewPassword && newPassword.length >= 6) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                alert('Password updated successfully!');
              }
            }}
            className="px-6 py-2.5 bg-gold text-deep-brown text-body-small font-semibold rounded-xl hover:bg-gold-dark transition-colors shadow-gold"
          >
            Update Password
          </motion.button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-[0_2px_8px_rgba(26,23,20,0.06)]">
        <h3 className="text-h4 font-semibold text-red-600 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Danger Zone
        </h3>
        <p className="text-body-small text-warm-gray mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              /* Delete account logic */
            }
          }}
          className="px-5 py-2.5 border-2 border-red-300 text-red-600 text-body-small font-semibold rounded-xl hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </motion.div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-body-small font-medium text-charcoal">{label}</p>
        <p className="text-caption text-warm-gray">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-gold' : 'bg-sand'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
