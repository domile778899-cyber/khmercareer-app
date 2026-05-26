/**
 * KhmerCareer Express — API Index
 * Central export for all API modules and shared types.
 */

// ── Axios Client ─────────────────────────────────────────────────────────────
export {
  apiClient,
  default as defaultClient,
  get,
  post,
  put,
  patch,
  del,
  configureClient,
  isLocalMode,
  clearTokens,
  setTokens,
  getAccessToken,
  getRefreshToken,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from './client';
export type { ApiResponse, ApiError, TokenPayload } from './client';
export { KhmerCareerAPIError } from './client';

// ── Auth API ─────────────────────────────────────────────────────────────────
export { authApi, default as auth } from './authApi';

// ── Jobs API ─────────────────────────────────────────────────────────────────
export { jobsApi, default as jobs } from './jobsApi';

// ── Courses API ──────────────────────────────────────────────────────────────
export { coursesApi, default as courses } from './coursesApi';

// ── Favorites API ────────────────────────────────────────────────────────────
export { favoritesApi, default as favorites } from './favoritesApi';

// ── Chat API ─────────────────────────────────────────────────────────────────
export { chatApi, default as chat } from './chatApi';

// ── Notifications API (legacy localStorage) ──────────────────────────────────
export { notificationsApi } from './notificationsApi';
export type { Notification } from './notificationsApi';

// ── Payments API ─────────────────────────────────────────────────────────────
export { paymentsApi, default as payments } from './paymentsApi';
export type {
  PaymentType,
  LocalPaymentMethod,
  PaymentStatus,
  StripeIntentResponse,
  CreateStripeIntentRequest,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreateLocalPaymentRequest,
  LocalPaymentResponse,
  PaymentRecord,
  PaymentHistoryResponse,
  SubscriptionPlan,
  SubscriptionStatus,
} from './paymentsApi';

// ── Admin API ────────────────────────────────────────────────────────────────
export { adminApi, default as admin } from './adminApi';
export type {
  DashboardStats,
  AdminUser,
  AdminUsersResponse,
  AdminJob,
  AdminJobsResponse,
  AdminApplication,
  AdminApplicationsResponse,
  AdminPayment,
  AdminPaymentsResponse,
  ModerationAction,
  UserModerationAction,
  BulkActionRequest,
  ActivityLogEntry,
  ActivityLogResponse,
  AdminSettings,
} from './adminApi';

// ── AI API ───────────────────────────────────────────────────────────────────
export { aiApi, default as ai } from './aiApi';
export type {
  ResumeSection,
  OptimizeResumeRequest,
  OptimizeResumeResponse,
  AnalyzeSalaryRequest,
  SalaryRange,
  AnalyzeSalaryResponse,
  MatchJobsRequest,
  MatchedJob,
  MatchJobsResponse,
  GenerateVideoPromoRequest,
  GenerateVideoPromoResponse,
  ChatMessage as AIChatMessage,
  ChatWithAIRequest,
  ChatWithAIResponse,
  AIUsageRecord,
  AIUsageResponse,
  AIFeature,
  AIFeaturesResponse,
  ParseResumeRequest,
  ParseResumeResponse,
} from './aiApi';

// ── Legacy localStorage DB ───────────────────────────────────────────────────
export { createCollection, seedDatabase, clearDatabase } from './db';
export type { DBCollection, Job, Course } from './db';

// ── Chat Types ───────────────────────────────────────────────────────────────
export type { ChatMessage, Conversation } from './chatTypes';

// ── Shared API Types ─────────────────────────────────────────────────────────
export type {
  User,
  UserRole,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadAvatarResponse,
  JobFilters,
  JobsListResponse,
  CreateJobRequest,
  ApplyJobResponse,
  MyApplication,
  CourseFilters,
  CoursesListResponse,
  EnrollmentResponse,
  Favorite,
  FavoriteToggleResponse,
  ChatRoom,
  ChatParticipant,
  LastMessage,
  SendMessageRequest,
  AppNotification,
} from './types';
