import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ChatProvider } from './context/ChatContext'
import Layout from './components/Layout'
import { Suspense, lazy } from 'react'
import Home from './pages/Home'

/* ── Lazy loaded pages ── */
const Jobs = lazy(() => import('./pages/Jobs'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Employers = lazy(() => import('./pages/Employers'))
const Resume = lazy(() => import('./pages/Resume'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Interview = lazy(() => import('./pages/Interview'))
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

/* ── Admin pages ── */
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./admin/AdminUsers'))
const AdminCourses = lazy(() => import('./admin/AdminCourses'))
const AdminJobs = lazy(() => import('./admin/AdminJobs'))

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

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ChatProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<SuspenseWrapper><Jobs /></SuspenseWrapper>} />
            <Route path="/jobs/:id" element={<SuspenseWrapper><JobDetail /></SuspenseWrapper>} />
            <Route path="/employers" element={<SuspenseWrapper><Employers /></SuspenseWrapper>} />
            <Route path="/resume" element={<SuspenseWrapper><Resume /></SuspenseWrapper>} />
            <Route path="/interview" element={<SuspenseWrapper><Interview /></SuspenseWrapper>} />
            <Route path="/live" element={<SuspenseWrapper><Live /></SuspenseWrapper>} />
            <Route path="/pricing" element={<SuspenseWrapper><Pricing /></SuspenseWrapper>} />
            <Route path="/about" element={<SuspenseWrapper><About /></SuspenseWrapper>} />
            <Route path="/contact" element={<SuspenseWrapper><Contact /></SuspenseWrapper>} />
            <Route path="/training" element={<SuspenseWrapper><Training /></SuspenseWrapper>} />
            <Route path="/business" element={<SuspenseWrapper><Business /></SuspenseWrapper>} />
            <Route path="/credit" element={<SuspenseWrapper><Credit /></SuspenseWrapper>} />
            <Route path="/loan" element={<SuspenseWrapper><Loan /></SuspenseWrapper>} />
            <Route path="/courses" element={<SuspenseWrapper><CourseMarket /></SuspenseWrapper>} />
            <Route path="/courses/:id" element={<SuspenseWrapper><CoursePlayer /></SuspenseWrapper>} />
            <Route path="/courses/:id/detail" element={<SuspenseWrapper><CourseDetail /></SuspenseWrapper>} />
            <Route path="/teach" element={<SuspenseWrapper><Teach /></SuspenseWrapper>} />
            <Route path="/course-upload" element={<SuspenseWrapper><CourseUpload /></SuspenseWrapper>} />
            <Route path="/ai-generate" element={<SuspenseWrapper><AIGenerate /></SuspenseWrapper>} />
            <Route path="/app" element={<SuspenseWrapper><AppDownload /></SuspenseWrapper>} />
            <Route path="/teacher-dashboard" element={<SuspenseWrapper><TeacherDashboard /></SuspenseWrapper>} />
            <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
            <Route path="/register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />
            <Route path="/profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
            <Route path="/privacy" element={<SuspenseWrapper><Privacy /></SuspenseWrapper>} />
            <Route path="/terms" element={<SuspenseWrapper><Terms /></SuspenseWrapper>} />
            <Route path="/factory-jobs" element={<SuspenseWrapper><FactoryJobs /></SuspenseWrapper>} />
            <Route path="/chinese-enterprise" element={<SuspenseWrapper><ChineseEnterprise /></SuspenseWrapper>} />
            <Route path="/chat" element={<SuspenseWrapper><ChatList /></SuspenseWrapper>} />
            <Route path="/chat/:id" element={<SuspenseWrapper><ChatDetail /></SuspenseWrapper>} />
            <Route path="*" element={<SuspenseWrapper><NotFound /></SuspenseWrapper>} />
          </Route>
          <Route path="/admin" element={<SuspenseWrapper><AdminLayout /></SuspenseWrapper>}>
            <Route index element={<SuspenseWrapper><AdminDashboard /></SuspenseWrapper>} />
            <Route path="users" element={<SuspenseWrapper><AdminUsers /></SuspenseWrapper>} />
            <Route path="courses" element={<SuspenseWrapper><AdminCourses /></SuspenseWrapper>} />
            <Route path="jobs" element={<SuspenseWrapper><AdminJobs /></SuspenseWrapper>} />
          </Route>
        </Routes>
        </ChatProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
