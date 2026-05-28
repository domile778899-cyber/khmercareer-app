# KhmerCareer Frontend Architecture

Architecture documentation for the KhmerCareer React frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [API Integration](#api-integration)
8. [Authentication Flow](#authentication-flow)
9. [Component Architecture](#component-architecture)
10. [Styling System](#styling-system)
11. [Performance Optimization](#performance-optimization)
12. [Internationalization](#internationalization)
13. [Mobile & PWA](#mobile--pwa)
14. [Build & Deployment](#build--deployment)

---

## Overview

KhmerCareer frontend is a modern single-page application (SPA) built with React 19 and TypeScript. It serves as the primary interface for job seekers, employers, and administrators interacting with the KhmerCareer platform.

### Key Features

| Feature | Description |
|---------|-------------|
| Job Board | Search, filter, and apply for jobs |
| Course Marketplace | Browse and enroll in courses |
| AI Tools | Resume optimization, salary analysis, job matching |
| Video Features | Video interviews, video resumes, live streaming |
| Chat System | Real-time messaging between users |
| Admin Panel | Dashboard for managing users, jobs, and courses |
| Mobile App | Capacitor-based iOS/Android builds |

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 19.2 | UI library |
| Language | TypeScript | 5.9 | Type safety |
| Build Tool | Vite | 7.2 | Build and dev server |
| Routing | React Router DOM | 7.1 | Client-side routing |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS |
| Components | Radix UI | 1.x | Accessible UI primitives |
| Forms | React Hook Form | 7.70 | Form management |
| Validation | Zod | 4.3 | Schema validation |
| HTTP Client | Axios | 1.8 | API requests |
| State | Zustand | 4.x | Global state |
| Context | React Context | 19.x | Auth, favorites, chat |
| i18n | react-i18next | 17.0 | Internationalization |
| Charts | Recharts | 2.15 | Data visualization |
| Animation | Framer Motion | 12.3 | UI animations |
| Carousel | Embla Carousel | 8.6 | Touch sliders |
| Icons | Lucide React | 0.56 | Icon library |
| Mobile | Capacitor | 7.0 | iOS/Android builds |
| Testing | Playwright | 1.49 | E2E testing |
| PWA | Vite PWA Plugin | - | Service worker |

---

## Project Structure

```
src/
├── App.tsx                    # Root component with routes
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── i18n.ts                    # i18n configuration
│
├── api/                       # API client & endpoints
│   ├── client.ts              # Axios configuration
│   ├── auth.ts                # Auth API
│   ├── jobs.ts                # Jobs API
│   ├── courses.ts             # Courses API
│   ├── applications.ts        # Applications API
│   ├── users.ts               # Users API
│   ├── ai.ts                  # AI API
│   ├── payments.ts            # Payments API
│   ├── chat.ts                # Chat API
│   └── notifications.ts       # Notifications API
│
├── components/                # Reusable components
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── Layout.tsx             # Main layout wrapper
│   ├── Navbar.tsx             # Navigation bar
│   ├── Footer.tsx             # Footer
│   ├── ErrorBoundary.tsx      # Error boundary
│   ├── LoadingSpinner.tsx     # Loading indicator
│   ├── Pagination.tsx         # Pagination control
│   ├── SearchBar.tsx          # Global search
│   └── ...
│
├── pages/                     # Page components
│   ├── Home.tsx               # Homepage
│   ├── Jobs.tsx               # Job listings
│   ├── JobDetail.tsx          # Job detail
│   ├── Employers.tsx          # Employer list
│   ├── Resume.tsx             # Resume builder
│   ├── Interview.tsx          # AI interview
│   ├── VideoInterview.tsx     # Video interview
│   ├── Live.tsx               # Live streaming
│   ├── Courses.tsx            # Course catalog
│   ├── CourseDetail.tsx       # Course detail
│   ├── CoursePlayer.tsx       # Course player
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Registration
│   ├── Profile.tsx            # User profile
│   ├── ChatList.tsx           # Chat rooms list
│   ├── ChatDetail.tsx         # Chat conversation
│   ├── AIGenerate.tsx         # AI generation
│   ├── AIMatch.tsx            # AI job matching
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── Pricing.tsx            # Pricing page
│   ├── About.tsx              # About page
│   ├── Contact.tsx            # Contact page
│   ├── Privacy.tsx            # Privacy policy
│   ├── Terms.tsx              # Terms of service
│   ├── NotFound.tsx           # 404 page
│   ├── FactoryJobs.tsx        # Factory jobs
│   ├── ChineseEnterprise.tsx  # Chinese enterprise jobs
│   ├── Business.tsx           # Business services
│   ├── Credit.tsx             # Credit services
│   ├── Loan.tsx               # Loan services
│   ├── Training.tsx           # Training programs
│   ├── Teach.tsx              # Teach page
│   ├── CourseUpload.tsx       # Course upload
│   ├── TeacherDashboard.tsx   # Teacher dashboard
│   ├── AppDownload.tsx        # App download
│   ├── VideoResume.tsx        # Video resume
│   ├── VideoResumeRecord.tsx  # Record video resume
│   ├── MarketingPromo.tsx     # Marketing promotion
│   └── ...
│
├── admin/                     # Admin pages
│   ├── AdminLayout.tsx        # Admin layout
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── AdminUsers.tsx         # User management
│   ├── AdminCourses.tsx       # Course management
│   ├── AdminJobs.tsx          # Job management
│   ├── SuperAdminLayout.tsx   # Super admin layout
│   ├── SuperAdminDashboard.tsx
│   ├── AIPromotionCenter.tsx
│   ├── VideoFactory.tsx
│   ├── GrowthEngine.tsx
│   ├── SocialMatrix.tsx
│   └── AnalyticsCenter.tsx
│
├── context/                   # React contexts
│   ├── AuthContext.tsx        # Authentication state
│   ├── FavoritesContext.tsx   # Favorites state
│   └── ChatContext.tsx        # Chat state
│
├── hooks/                     # Custom hooks
│   ├── useAuth.ts             # Authentication hook
│   ├── useApi.ts              # API request hook
│   ├── useLocalStorage.ts     # Local storage hook
│   ├── useDebounce.ts         # Debounce hook
│   ├── usePagination.ts       # Pagination hook
│   └── useMediaQuery.ts       # Responsive hook
│
├── stores/                    # Zustand stores
│   ├── ApplyContext.tsx       # Application state
│   └── ...
│
├── types/                     # TypeScript types
│   └── index.ts
│
├── lib/                       # Utilities
│   └── utils.ts               # Helper functions
│
├── utils/                     # Utility functions
│   ├── constants.ts           # App constants
│   ├── formatters.ts          # Data formatters
│   └── validators.ts          # Form validators
│
├── locales/                   # i18n translations
│   ├── en/                    # English
│   │   └── translation.json
│   ├── km/                    # Khmer
│   │   └── translation.json
│   └── zh/                    # Chinese
│       └── translation.json
│
└── data/                      # Static data
    └── ...
```

---

## Architecture Patterns

### Component Patterns

```typescript
// Container/Presenter Pattern
// Container: Handles data and logic
function JobListContainer() {
  const { data, isLoading } = useJobs();
  const [filters, setFilters] = useState({});

  if (isLoading) return <LoadingSpinner />;
  return <JobList jobs={data} onFilter={setFilters} />;
}

// Presenter: Pure rendering
interface JobListProps {
  jobs: Job[];
  onFilter: (filters: FilterOptions) => void;
}

function JobList({ jobs, onFilter }: JobListProps) {
  return (
    <div className="grid gap-4">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

### Lazy Loading Pattern

```typescript
import { lazy, Suspense } from 'react';

const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetail = lazy(() => import('./pages/JobDetail'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
    </Suspense>
  );
}
```

---

## State Management

### Global State (Zustand)

Used for: UI state, filters, theme preferences

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

### Context State (React Context)

Used for: Authentication, real-time chat, favorites

```typescript
// context/AuthContext.tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... implementation

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Local State (useState)

Used for: Form inputs, UI toggles, component-specific data

### Server State (API + Caching)

```typescript
// hooks/useJobs.ts
import { useState, useEffect } from 'react';
import { jobsApi } from '@/api/jobs';

export function useJobs(filters: JobFilters) {
  const [data, setData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    jobsApi.list(filters)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [filters]);

  return { data, isLoading, error };
}
```

---

## Routing

### Route Structure

```typescript
// App.tsx - Route definitions
<Routes>
  {/* Public routes */}
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/jobs/:id" element={<JobDetail />} />
    <Route path="/courses" element={<CourseMarket />} />
    <Route path="/courses/:id" element={<CoursePlayer />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    {/* ... more public routes */}
  </Route>

  {/* Protected routes */}
  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
  <Route path="/chat" element={<RequireAuth><ChatList /></RequireAuth>} />
  <Route path="/chat/:id" element={<RequireAuth><ChatDetail /></RequireAuth>} />

  {/* Admin routes */}
  <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="courses" element={<AdminCourses />} />
    <Route path="jobs" element={<AdminJobs />} />
  </Route>

  {/* Super admin routes */}
  <Route path="/superadmin" element={<RequireSuperAdmin><SuperAdminLayout /></SuperAdminLayout>}>
    {/* ... super admin routes */}
  </Route>
</Routes>
```

### Route Guards

```typescript
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && user?.role !== 'superadmin') return <Navigate to="/" replace />;
  return <>{children}</>;
}
```

---

## API Integration

### Axios Client Configuration

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      // If refresh fails, redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Module Pattern

```typescript
// api/jobs.ts
import client from './client';

export const jobsApi = {
  list: (params?: JobListParams) =>
    client.get('/jobs', { params }).then(r => r.data),

  get: (id: string) =>
    client.get(`/jobs/${id}`).then(r => r.data),

  search: (query: string, filters?: JobFilters) =>
    client.get('/jobs/search', { params: { keyword: query, ...filters } }).then(r => r.data),

  create: (data: CreateJobInput) =>
    client.post('/jobs', data).then(r => r.data),

  update: (id: string, data: Partial<CreateJobInput>) =>
    client.put(`/jobs/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    client.delete(`/jobs/${id}`).then(r => r.data),
};
```

---

## Authentication Flow

```
User Input Credentials
        │
        ▼
┌───────────────┐
│  POST /login  │─────► API Server
│               │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Receive Token │◄───── JWT Access + Refresh
│               │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Store Token   │─────► localStorage (access)
│               │       httpOnly cookie (refresh)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Set Auth State│─────► AuthContext update
│               │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Navigate to  │─────► /profile or /dashboard
│  Dashboard    │
└───────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── SearchBar
│   │   ├── UserMenu
│   │   └── MobileMenu
│   ├── Main Content (via Outlet/Routes)
│   │   └── Page Components
│   └── Footer
├── Toast Notifications (sonner)
└── PWA Install Prompt
```

### Component Categories

| Category | Location | Examples |
|----------|----------|----------|
| Layout | `components/` | Layout, Navbar, Footer |
| UI Primitives | `components/ui/` | Button, Card, Dialog, Input |
| Pages | `pages/` | Home, Jobs, Profile |
| Admin | `admin/` | AdminLayout, AdminDashboard |
| Forms | Inline or `components/` | LoginForm, JobPostForm |
| Feedback | `components/` | LoadingSpinner, ErrorBoundary |

---

## Styling System

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#B8925F',
        },
        'warm-white': '#FAF8F5',
        'warm-gray': '#6B6560',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### Styling Patterns

```tsx
// Utility-first approach
function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{job.company}</p>
      <div className="flex items-center gap-2 mt-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {job.type}
        </span>
        <span className="text-sm text-gray-500">{job.location}</span>
      </div>
    </div>
  );
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load pages
const Jobs = lazy(() => import('./pages/Jobs'));
const CourseMarket = lazy(() => import('./pages/CourseMarket'));
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const JobCard = memo(function JobCard({ job }: { job: Job }) {
  return <div>{/* ... */}</div>;
});

// Memoize computed values
const filteredJobs = useMemo(() =>
  jobs.filter(j => j.salaryMax <= maxSalary),
  [jobs, maxSalary]
);

// Memoize callbacks
const handleApply = useCallback((jobId: string) => {
  applyForJob(jobId);
}, []);
```

### Image Optimization

```tsx
<img
  src={job.companyLogo}
  alt={job.company}
  loading="lazy"
  className="w-12 h-12 object-contain"
/>
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze

# Use dynamic imports for heavy components
const Chart = lazy(() => import('./components/Chart'));
```

---

## Internationalization

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| en | English | Complete |
| km | Khmer | In Progress |
| zh | Chinese (Simplified) | In Progress |

### Usage

```tsx
import { useTranslation } from 'react-i18next';

function JobCard({ job }: { job: Job }) {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{job.title}</h3>
      <p>{t('jobs.location', { location: job.location })}</p>
      <button>{t('common.apply')}</button>
    </div>
  );
}
```

### Language Switcher

```tsx
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="km">Khmer</option>
      <option value="zh">Chinese</option>
    </select>
  );
}
```

---

## Mobile & PWA

### Capacitor Integration

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.khmercareer.app',
  appName: 'KhmerCareer',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
```

### PWA Configuration

- Service worker for offline support
- App manifest for install prompt
- Push notification support
- Background sync for forms

### Mobile-Specific Features

```typescript
// hooks/useMobile.ts
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';

export function useMobile() {
  const isNative = Capacitor.isNativePlatform();

  const takePhoto = async () => {
    if (!isNative) return;
    return Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
  };

  return { isNative, takePhoto };
}
```

---

## Build & Deployment

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# E2E tests
npm run e2e
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.khmercareer.com/api/v1` |
| `VITE_APP_NAME` | App name | `KhmerCareer` |
| `VITE_APP_VERSION` | App version | `1.0.0` |
| `VITE_SOCKET_URL` | Socket.IO URL | `wss://api.khmercareer.com` |
| `VITE_STRIPE_KEY` | Stripe publishable key | `pk_live_...` |

### Deployment Targets

| Target | Build Output | Deploy Method |
|--------|-------------|---------------|
| Web | `dist/` | Nginx / CDN |
| iOS | `ios/` | Xcode / TestFlight |
| Android | `android/` | Android Studio / Play Store |
