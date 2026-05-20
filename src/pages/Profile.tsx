import { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved' | 'resume' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || 'Demo User');
  const [email] = useState(user?.email || 'demo@khmerjob.com');
  const [phone, setPhone] = useState('+855 12 345 678');
  const [location, setLocation] = useState('Phnom Penh, Cambodia');
  const [bio, setBio] = useState('Passionate software developer with 5+ years of experience in full-stack development. Looking for new opportunities to grow and contribute.');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: UserCircle },
    { key: 'applications' as const, label: 'Applications', icon: FileText },
    { key: 'saved' as const, label: 'Saved Jobs', icon: Bookmark },
    { key: 'resume' as const, label: 'My Resume', icon: FileText },
    { key: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const mockApplications = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp Cambodia', location: 'Phnom Penh', salary: '$1,500 - $2,500', status: 'Interview', date: '2024-05-15', logo: 'TC' },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupHub', location: 'Remote', salary: '$2,000 - $3,500', status: 'Applied', date: '2024-05-12', logo: 'SH' },
    { id: 3, title: 'React Developer', company: 'Digital Solutions', location: 'Siem Reap', salary: '$1,200 - $2,000', status: 'Rejected', date: '2024-05-10', logo: 'DS' },
    { id: 4, title: 'UI/UX Designer', company: 'Creative Agency', location: 'Phnom Penh', salary: '$1,000 - $1,800', status: 'Reviewing', date: '2024-05-08', logo: 'CA' },
  ];

  const mockSavedJobs = [
    { id: 1, title: 'Software Architect', company: 'Enterprise Co', location: 'Phnom Penh', salary: '$3,000 - $5,000', posted: '2 days ago', logo: 'EC' },
    { id: 2, title: 'Mobile Developer', company: 'AppWorks', location: 'Remote', salary: '$1,500 - $2,800', posted: '3 days ago', logo: 'AW' },
    { id: 3, title: 'DevOps Engineer', company: 'CloudFirst', location: 'Phnom Penh', salary: '$2,500 - $4,000', posted: '1 week ago', logo: 'CF' },
  ];

  const mockExperiences = [
    { id: 1, title: 'Senior Developer', company: 'WebSolutions Inc', period: '2021 - Present', description: 'Leading frontend development team of 5 engineers.' },
    { id: 2, title: 'Web Developer', company: 'Digital Agency', period: '2018 - 2021', description: 'Developed responsive web applications for clients.' },
  ];

  const mockEducation = [
    { id: 1, degree: 'BSc Computer Science', school: 'Royal University of Phnom Penh', year: '2014 - 2018' },
  ];

  const mockSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Tailwind CSS'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview': return 'bg-emerald/10 text-emerald border-emerald/20';
      case 'Applied': return 'bg-gold/10 text-gold-dark border-gold/20';
      case 'Reviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-coral/10 text-coral border-coral/20';
      default: return 'bg-sand text-warm-gray border-sand';
    }
  };

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
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-deep-brown text-3xl md:text-4xl font-display font-bold shadow-gold">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'D'}
              </div>
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
                {user?.fullName || 'Demo User'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-warm-gray mt-1"
              >
                {user?.role === 'employer' ? 'Employer' : 'Job Seeker'} • {email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mt-3 justify-center md:justify-start"
              >
                <span className="flex items-center gap-1 text-xs text-warm-gray">
                  <MapPin className="w-3 h-3" /> {location}
                </span>
                <span className="flex items-center gap-1 text-xs text-warm-gray">
                  <Calendar className="w-3 h-3" /> Member since Jan 2024
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
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
                {isEditing ? 'Cancel' : 'Edit Profile'}
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
              { icon: FileText, value: '12', label: 'Applications' },
              { icon: Bookmark, value: '8', label: 'Saved Jobs' },
              { icon: Eye, value: '156', label: 'Profile Views' },
              { icon: TrendingUp, value: '85%', label: 'Profile Score' },
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
            <span className="text-sm text-emerald">Profile updated successfully!</span>
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Bio */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-charcoal flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-gold" />
                  About Me
                </h3>
                {isEditing && (
                  <button onClick={handleSaveProfile} className="text-xs text-emerald font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Save
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-sand rounded-lg text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-cream/50 min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-charcoal leading-relaxed">{bio}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-warm-white rounded-xl border border-sand p-6">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gold" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: UserCircle, label: 'Full Name', value: fullName, setter: setFullName },
                    { icon: Mail, label: 'Email', value: email, setter: null },
                    { icon: Phone, label: 'Phone', value: phone, setter: setPhone },
                    { icon: MapPin, label: 'Location', value: location, setter: setLocation },
                  ].map((field, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <field.icon className="w-4 h-4 text-warm-gray mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-warm-gray">{field.label}</p>
                        {isEditing && field.setter ? (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.setter?.(e.target.value)}
                            className="w-full mt-1 px-2 py-1 border border-sand rounded text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 bg-cream/50"
                          />
                        ) : (
                          <p className="text-sm text-charcoal">{field.value}</p>
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
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockSkills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 bg-emerald/10 text-emerald text-sm rounded-full font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                Work Experience
              </h3>
              <div className="space-y-4">
                {mockExperiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 pb-4 border-b border-sand last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{exp.title}</p>
                      <p className="text-sm text-warm-gray">{exp.company}</p>
                      <p className="text-xs text-warm-gray mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {exp.period}
                      </p>
                      <p className="text-sm text-charcoal mt-1">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gold" />
                Education
              </h3>
              {mockEducation.map((edu) => (
                <div key={edu.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-emerald" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{edu.degree}</p>
                    <p className="text-sm text-warm-gray">{edu.school}</p>
                    <p className="text-xs text-warm-gray mt-0.5">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'applications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-charcoal">My Applications</h2>
              <span className="text-sm text-warm-gray">{mockApplications.length} total</span>
            </div>
            {mockApplications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-warm-white rounded-xl border border-sand p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
                      {app.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{app.title}</h3>
                      <p className="text-sm text-warm-gray">{app.company}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-warm-gray flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {app.location}
                        </span>
                        <span className="text-xs text-warm-gray">{app.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-warm-gray flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {app.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'saved' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-charcoal">Saved Jobs</h2>
              <span className="text-sm text-warm-gray">{mockSavedJobs.length} jobs</span>
            </div>
            {mockSavedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-warm-white rounded-xl border border-sand p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold text-sm flex-shrink-0">
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{job.title}</h3>
                      <p className="text-sm text-warm-gray">{job.company}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-warm-gray flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="text-xs text-warm-gray">{job.salary}</span>
                        <span className="text-xs text-warm-gray">Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-4 py-2 bg-gold hover:bg-gold-dark text-deep-brown text-sm font-medium rounded-lg transition-colors"
                    >
                      Apply
                    </Link>
                    <button className="p-2 text-warm-gray hover:text-coral transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'resume' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                Resume Builder
              </h3>
              <p className="text-sm text-warm-gray mb-6">
                Create a professional resume with our AI-powered builder. Choose from multiple templates and export in PDF format.
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
                    <p className="text-sm font-medium text-charcoal">{template}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/resume"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold-dark text-deep-brown font-semibold rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Resume
                </Link>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-sand hover:border-charcoal text-charcoal font-medium rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Account Settings */}
            <div className="bg-warm-white rounded-xl border border-sand p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gold" />
                Account Settings
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
                Notification Preferences
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
                Security
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-gold/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-charcoal">Change Password</span>
                  <ChevronRight className="w-4 h-4 text-warm-gray group-hover:text-gold transition-colors" />
                </button>
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-gold/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-charcoal">Two-Factor Authentication</span>
                  <span className="text-xs text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">Enabled</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-sand rounded-lg hover:border-coral/30 transition-colors flex items-center justify-between group">
                  <span className="text-sm text-coral">Delete Account</span>
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
