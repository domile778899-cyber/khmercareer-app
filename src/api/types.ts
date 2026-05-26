/**
 * KhmerCareer Express - Shared API Types
 * All request/response TypeScript interfaces for the backend API.
 */

// =============================================================================
// User & Auth Types
// =============================================================================

export type UserRole = 'jobseeker' | 'employer' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phone?: string;
  companyName?: string;
  industry?: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  companyName?: string;
  industry?: string;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

// =============================================================================
// Job Types
// =============================================================================

export interface Job {
  id: string;
  title: string;
  titleZh?: string;
  titleEn?: string;
  company: string;
  location: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  industry: string;
  level: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  postedAt: string;
  status: 'active' | 'inactive' | 'closed';
  verified: boolean;
  urgent: boolean;
  featured: boolean;
  employerType: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JobFilters {
  industry?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  keyword?: string;
  page?: number;
  limit?: number;
  experience?: string;
  sortBy?: 'newest' | 'salary' | 'relevance';
}

export interface JobsListResponse {
  jobs: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateJobRequest {
  title: string;
  titleZh?: string;
  titleEn?: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  industry: string;
  level: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent?: boolean;
  featured?: boolean;
  employerType?: string;
}

export interface ApplyJobResponse {
  applicationId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface MyApplication {
  id: string;
  jobId: string;
  job: Job;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}

// =============================================================================
// Course Types
// =============================================================================

export interface Course {
  id: string;
  title: string;
  titleZh?: string;
  titleEn?: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  students: number;
  rating: number;
  reviews: number;
  duration: string;
  language: string;
  thumbnail?: string;
  status: 'active' | 'inactive' | 'draft';
  description: string;
  syllabus?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price' | 'rating';
}

export interface CoursesListResponse {
  courses: Course[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EnrollmentResponse {
  enrollmentId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
}

// =============================================================================
// Favorite Types
// =============================================================================

export interface Favorite {
  id: string;
  jobId: string;
  job: Job;
  createdAt: string;
}

export interface FavoriteToggleResponse {
  favorited: boolean;
  favoriteId?: string;
}

// =============================================================================
// Chat Types
// =============================================================================

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatParticipant[];
  lastMessage?: LastMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
  read: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  type?: 'text' | 'image' | 'file';
  metadata?: ChatMessage['metadata'];
}

// =============================================================================
// Notification Types
// =============================================================================

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'course' | 'promo' | 'system' | 'application' | 'message';
  read: boolean;
  link?: string;
  createdAt: string;
}

// =============================================================================
// API Wrapper Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
