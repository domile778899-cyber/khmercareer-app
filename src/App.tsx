import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
import Teach from './pages/Teach'
import CourseUpload from './pages/CourseUpload'

export default function App() {
  return (
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
        <Route path="/teach" element={<Teach />} />
        <Route path="/course-upload" element={<CourseUpload />} />
      </Route>
    </Routes>
  )
}
