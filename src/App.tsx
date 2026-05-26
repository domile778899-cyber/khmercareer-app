import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ChatProvider } from './context/ChatContext'
import { ApplyProvider } from './stores/ApplyContext'
import Layout from './components/Layout'
import { Suspense, lazy } from 'react'
import Home from './pages/Home'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuth } from './hooks/useAuth'

/* ── Lazy loaded pages ── */
const Jobs = lazy(() => import('./pages/Jobs'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Employers = lazy(() => import('./pages/Employers'))
const Resume = lazy(() => import('./pages/Resume'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Interview = lazy(() => import('./pages/Interview'))
const VideoInterview = lazy(() => import('./pages/VideoInterview'))
const Live = lazy(() => import('./pages/Live'))
const Training = lazy(() => import('./pages/Training'))
const Business = lazy(() => import('./pages/Business'))
const Credit = lazy(() => import('./pages/Credit'))
const Loan = lazy(() => import('./pages/Loan'))
const CourseMarket = lazy(() => import('./pages/CourseMarket'))
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Teach = lazy(() => import('./pages/Teach'))
const CourseUpload = lazy(() => import('./pages/CourseUpload'))
const AIGenerate = lazy(() => import('./pages/AIGenerate'))
const AppDownload = lazy(() => import('./pages/AppDownload'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))
const FactoryJobs = lazy(() => import('./pages/FactoryJobs'))
const ChineseEnterprise = lazy(() => import('./pages/ChineseEnterprise'))
const ChatList = lazy(() => import('./pages/ChatList'))
const ChatDetail = lazy(() => import('./pages/ChatDetail'))
const AIMatch = lazy(() => import('./pages/AIMatch'))
const VideoResume = lazy(() => import('./pages/VideoResume'))
const VideoResumeRecord = lazy(() => import('./pages/VideoResumeRecord'))

/* ── Admin pages ── */
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./admin/AdminUsers'))
const AdminCourses = lazy(() => import('./admin/AdminCourses'))
const AdminJobs = lazy(() => import('./admin/AdminJobs'))

/* ── Super Admin pages ── */
const SuperAdminLayout = lazy(() => import('./admin/SuperAdminLayout'))
const SuperAdminDashboard = lazy(() => import('./admin/SuperAdminDashboard'))
const AIPromotionCenter = lazy(() => import('./admin/AIPromotionCenter'))
const VideoFactory = lazy(() => import('./admin/VideoFactory'))
const GrowthEngine = lazy(() => import('./admin/GrowthEngine'))
const SocialMatrix = lazy(() => import('./admin/SocialMatrix'))
const AnalyticsCenter = lazy(() => import('./admin/AnalyticsCenter'))

const LazyFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-warm-white">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-warm-gray text-sm">Loading...</p>
    </div>
  </div>
)

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>
}

/* ── Authentication guards ── */

/** Require authentication — redirect to login if not authenticated */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LazyFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/** Require admin role — redirect to login if not admin */
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LazyFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

/** Require superadmin role — redirect to login if not superadmin */
function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LazyFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'superadmin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

/* ── Route wrapper with ErrorBoundary ── */
function SafeRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ChatProvider>
          <ApplyProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<SafeRoute><SuspenseWrapper><Jobs /></SuspenseWrapper></SafeRoute>} />
                <Route path="/jobs/:id" element={<SafeRoute><SuspenseWrapper><JobDetail /></SuspenseWrapper></SafeRoute>} />
                <Route path="/employers" element={<SafeRoute><SuspenseWrapper><Employers /></SuspenseWrapper></SafeRoute>} />
                <Route path="/resume" element={<SafeRoute><SuspenseWrapper><Resume /></SuspenseWrapper></SafeRoute>} />
                <Route path="/interview" element={<SafeRoute><SuspenseWrapper><Interview /></SuspenseWrapper></SafeRoute>} />
                <Route path="/video-interview" element={<SafeRoute><SuspenseWrapper><VideoInterview /></SuspenseWrapper></SafeRoute>} />
                <Route path="/live" element={<SafeRoute><SuspenseWrapper><Live /></SuspenseWrapper></SafeRoute>} />
                <Route path="/pricing" element={<SafeRoute><SuspenseWrapper><Pricing /></SuspenseWrapper></SafeRoute>} />
                <Route path="/about" element={<SafeRoute><SuspenseWrapper><About /></SuspenseWrapper></SafeRoute>} />
                <Route path="/contact" element={<SafeRoute><SuspenseWrapper><Contact /></SuspenseWrapper></SafeRoute>} />
                <Route path="/training" element={<SafeRoute><SuspenseWrapper><Training /></SuspenseWrapper></SafeRoute>} />
                <Route path="/business" element={<SafeRoute><SuspenseWrapper><Business /></SuspenseWrapper></SafeRoute>} />
                <Route path="/credit" element={<SafeRoute><SuspenseWrapper><Credit /></SuspenseWrapper></SafeRoute>} />
                <Route path="/loan" element={<SafeRoute><SuspenseWrapper><Loan /></SuspenseWrapper></SafeRoute>} />
                <Route path="/courses" element={<SafeRoute><SuspenseWrapper><CourseMarket /></SuspenseWrapper></SafeRoute>} />
                <Route path="/courses/:id" element={<SafeRoute><SuspenseWrapper><CoursePlayer /></SuspenseWrapper></SafeRoute>} />
                <Route path="/courses/:id/detail" element={<SafeRoute><SuspenseWrapper><CourseDetail /></SuspenseWrapper></SafeRoute>} />
                <Route path="/teach" element={<SafeRoute><SuspenseWrapper><Teach /></SuspenseWrapper></SafeRoute>} />
                <Route path="/course-upload" element={<SafeRoute><SuspenseWrapper><CourseUpload /></SuspenseWrapper></SafeRoute>} />
                <Route path="/ai-generate" element={<SafeRoute><SuspenseWrapper><AIGenerate /></SuspenseWrapper></SafeRoute>} />
                <Route path="/app" element={<SafeRoute><SuspenseWrapper><AppDownload /></SuspenseWrapper></SafeRoute>} />
                <Route path="/teacher-dashboard" element={<SafeRoute><SuspenseWrapper><TeacherDashboard /></SuspenseWrapper></SafeRoute>} />
                <Route path="/login" element={<SafeRoute><SuspenseWrapper><Login /></SuspenseWrapper></SafeRoute>} />
                <Route path="/register" element={<SafeRoute><SuspenseWrapper><Register /></SuspenseWrapper></SafeRoute>} />
                <Route path="/profile" element={<RequireAuth><SafeRoute><SuspenseWrapper><Profile /></SuspenseWrapper></SafeRoute></RequireAuth>} />
                <Route path="/privacy" element={<SafeRoute><SuspenseWrapper><Privacy /></SuspenseWrapper></SafeRoute>} />
                <Route path="/terms" element={<SafeRoute><SuspenseWrapper><Terms /></SuspenseWrapper></SafeRoute>} />
                <Route path="/factory-jobs" element={<SafeRoute><SuspenseWrapper><FactoryJobs /></SuspenseWrapper></SafeRoute>} />
                <Route path="/chinese-enterprise" element={<SafeRoute><SuspenseWrapper><ChineseEnterprise /></SuspenseWrapper></SafeRoute>} />
                <Route path="/chat" element={<RequireAuth><SafeRoute><SuspenseWrapper><ChatList /></SuspenseWrapper></SafeRoute></RequireAuth>} />
                <Route path="/chat/:id" element={<RequireAuth><SafeRoute><SuspenseWrapper><ChatDetail /></SuspenseWrapper></SafeRoute></RequireAuth>} />
                <Route path="/ai-match" element={<SafeRoute><SuspenseWrapper><AIMatch /></SuspenseWrapper></SafeRoute>} />
                <Route path="/video-resume" element={<SafeRoute><SuspenseWrapper><VideoResume /></SuspenseWrapper></SafeRoute>} />
                <Route path="/video-resume/record" element={<SafeRoute><SuspenseWrapper><VideoResumeRecord /></SuspenseWrapper></SafeRoute>} />
                <Route path="*" element={<SafeRoute><SuspenseWrapper><NotFound /></SuspenseWrapper></SafeRoute>} />
              </Route>

              {/* Admin routes with guards */}
              <Route path="/admin" element={<RequireAdmin><SafeRoute><SuspenseWrapper><AdminLayout /></SuspenseWrapper></SafeRoute></RequireAdmin>}>
                <Route index element={<SafeRoute><SuspenseWrapper><AdminDashboard /></SuspenseWrapper></SafeRoute>} />
                <Route path="users" element={<SafeRoute><SuspenseWrapper><AdminUsers /></SuspenseWrapper></SafeRoute>} />
                <Route path="courses" element={<SafeRoute><SuspenseWrapper><AdminCourses /></SuspenseWrapper></SafeRoute>} />
                <Route path="jobs" element={<SafeRoute><SuspenseWrapper><AdminJobs /></SuspenseWrapper></SafeRoute>} />
              </Route>

              {/* Super Admin routes with guards */}
              <Route path="/superadmin" element={<RequireSuperAdmin><SafeRoute><SuspenseWrapper><SuperAdminLayout /></SuspenseWrapper></SafeRoute></RequireSuperAdmin>}>
                <Route index element={<SafeRoute><SuspenseWrapper><SuperAdminDashboard /></SuspenseWrapper></SafeRoute>} />
                <Route path="promotion" element={<SafeRoute><SuspenseWrapper><AIPromotionCenter /></SuspenseWrapper></SafeRoute>} />
                <Route path="video-factory" element={<SafeRoute><SuspenseWrapper><VideoFactory /></SuspenseWrapper></SafeRoute>} />
                <Route path="growth" element={<SafeRoute><SuspenseWrapper><GrowthEngine /></SuspenseWrapper></SafeRoute>} />
                <Route path="social" element={<SafeRoute><SuspenseWrapper><SocialMatrix /></SuspenseWrapper></SafeRoute>} />
                <Route path="analytics" element={<SafeRoute><SuspenseWrapper><AnalyticsCenter /></SuspenseWrapper></SafeRoute>} />
              </Route>
            </Routes>
          </ApplyProvider>
        </ChatProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
