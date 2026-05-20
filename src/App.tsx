import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import { Suspense, lazy } from 'react'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Employers from './pages/Employers'
import Resume from './pages/Resume'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Interview from './pages/Interview'
import Live from './pages/Live'
import Training from './pages/Training'
import Business from './pages/Business'
import Credit from './pages/Credit'
import Loan from './pages/Loan'
import CourseMarket from './pages/CourseMarket'
import CoursePlayer from './pages/CoursePlayer'
import CourseDetail from './pages/CourseDetail'
import Teach from './pages/Teach'
import CourseUpload from './pages/CourseUpload'
import AIGenerate from './pages/AIGenerate'
import AppDownload from './pages/AppDownload'
import TeacherDashboard from './pages/TeacherDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsers from './admin/AdminUsers'
import AdminCourses from './admin/AdminCourses'
import AdminJobs from './admin/AdminJobs'

/* ── Lazy loaded pages ── */
const FactoryJobs = lazy(() => import('./pages/FactoryJobs'))
const ChineseEnterprise = lazy(() => import('./pages/ChineseEnterprise'))

const LazyFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-warm-white">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-warm-gray text-sm">Loading...</p>
    </div>
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/live" element={<Live />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/training" element={<Training />} />
          <Route path="/business" element={<Business />} />
          <Route path="/credit" element={<Credit />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/courses" element={<CourseMarket />} />
          <Route path="/courses/:id" element={<CoursePlayer />} />
          <Route path="/courses/:id/detail" element={<CourseDetail />} />
          <Route path="/teach" element={<Teach />} />
          <Route path="/course-upload" element={<CourseUpload />} />
          <Route path="/ai-generate" element={<AIGenerate />} />
          <Route path="/app" element={<AppDownload />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/factory-jobs" element={<Suspense fallback={<LazyFallback />}><FactoryJobs /></Suspense>} />
          <Route path="/chinese-enterprise" element={<Suspense fallback={<LazyFallback />}><ChineseEnterprise /></Suspense>} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
