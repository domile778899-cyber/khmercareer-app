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
