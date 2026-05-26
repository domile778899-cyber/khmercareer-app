/**
 * KhmerCareer Express — Admin API
 * Dashboard analytics, user management, job moderation,
 * application oversight, and payment monitoring for admins.
 */

import { get, post, patch, del } from './client';
import type { User, UserRole, Job, MyApplication, PaymentRecord } from './types';

// =============================================================================
// Admin TypeScript Interfaces
// =============================================================================

/** Admin dashboard statistics overview */
export interface DashboardStats {
  /** Total registered users */
  totalUsers: number;
  /** New users in the last 30 days */
  newUsersThisMonth: number;
  /** Total job postings */
  totalJobs: number;
  /** Active job postings */
  activeJobs: number;
  /** Pending verification jobs */
  pendingJobs: number;
  /** Total applications submitted */
  totalApplications: number;
  /** Applications pending review */
  pendingApplications: number;
  /** Total revenue in USD */
  totalRevenue: number;
  /** Revenue this month */
  revenueThisMonth: number;
  /** Total payments processed */
  totalPayments: number;
  /** Successful payments */
  successfulPayments: number;
  /** Failed payments */
  failedPayments: number;
  /** Users by role distribution */
  usersByRole: Record<UserRole, number>;
  /** Jobs by industry distribution */
  jobsByIndustry: Record<string, number>;
  /** Daily revenue for charting (last 30 days) */
  revenueChart: { date: string; amount: number }[];
  /** Daily signups for charting (last 30 days) */
  signupsChart: { date: string; count: number }[];
}

/** Admin user list item with extra metadata */
export interface AdminUser extends User {
  applicationCount?: number;
  jobCount?: number;
  lastLoginAt?: string;
  loginCount?: number;
  isBanned?: boolean;
}

/** Paginated users response for admin */
export interface AdminUsersResponse {
  users: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Admin job list item with employer info */
export interface AdminJob extends Job {
  employerEmail?: string;
  employerName?: string;
  viewCount?: number;
  applicationCount?: number;
  reportCount?: number;
}

/** Paginated jobs response for admin */
export interface AdminJobsResponse {
  jobs: AdminJob[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Admin application list item with full details */
export interface AdminApplication extends MyApplication {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  companyName: string;
  employerName?: string;
  employerEmail?: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
}

/** Paginated applications response for admin */
export interface AdminApplicationsResponse {
  applications: AdminApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Admin payment list item with user info */
export interface AdminPayment extends PaymentRecord {
  userName: string;
  userEmail: string;
  userId: string;
  refundable: boolean;
}

/** Paginated payments response for admin */
export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Moderation action request */
export interface ModerationAction {
  action: 'approve' | 'reject' | 'feature' | 'unfeature' | 'close' | 'delete';
  reason?: string;
}

/** User moderation action request */
export interface UserModerationAction {
  action: 'ban' | 'unban' | 'verify' | 'unverify' | 'change_role';
  role?: UserRole;
  reason?: string;
}

/** Bulk action request */
export interface BulkActionRequest {
  ids: string[];
  action: 'approve' | 'reject' | 'delete' | 'feature' | 'close';
  reason?: string;
}

/** Admin activity log entry */
export interface ActivityLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'job' | 'user' | 'application' | 'payment' | 'system';
  targetId?: string;
  details?: string;
  createdAt: string;
}

/** Activity log response */
export interface ActivityLogResponse {
  logs: ActivityLogEntry[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Settings update request */
export interface AdminSettings {
  siteName?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  defaultJobExpiryDays?: number;
  featuredJobPrice?: number;
  subscriptionMonthlyPrice?: number;
  subscriptionYearlyPrice?: number;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
  };
}

// =============================================================================
// Admin API
// =============================================================================

export const adminApi = {
  // ===========================================================================
  // Dashboard Stats
  // ===========================================================================

  /**
   * Get comprehensive dashboard statistics for the admin panel.
   * Includes user counts, job counts, revenue, and chart data.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return get<DashboardStats>('/admin/stats');
  },

  // ===========================================================================
  // User Management
  // ===========================================================================

  /**
   * Get paginated list of all registered users.
   * Supports pagination and optional filtering.
   */
  async getUsers(page = 1, limit = 20, filters?: { role?: UserRole; search?: string; banned?: boolean }): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.role) params.set('role', filters.role);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.banned !== undefined) params.set('banned', String(filters.banned));
    return get<AdminUsersResponse>(`/admin/users?${params.toString()}`);
  },

  /**
   * Get a single user's detailed profile by ID.
   */
  async getUserById(userId: string): Promise<AdminUser> {
    return get<AdminUser>(`/admin/users/${userId}`);
  },

  /**
   * Apply moderation action to a user (ban, unban, verify, change role).
   */
  async moderateUser(userId: string, action: UserModerationAction): Promise<AdminUser> {
    return post<AdminUser>(`/admin/users/${userId}/moderate`, action);
  },

  // ===========================================================================
  // Job Moderation
  // ===========================================================================

  /**
   * Get paginated list of all jobs for moderation.
   * Supports filtering by status, industry, and search.
   */
  async getJobs(page = 1, limit = 20, filters?: { status?: string; industry?: string; search?: string; verified?: boolean }): Promise<AdminJobsResponse> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.status) params.set('status', filters.status);
    if (filters?.industry) params.set('industry', filters.industry);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.verified !== undefined) params.set('verified', String(filters.verified));
    return get<AdminJobsResponse>(`/admin/jobs?${params.toString()}`);
  },

  /**
   * Get a single job's detailed info for moderation.
   */
  async getJobById(jobId: string): Promise<AdminJob> {
    return get<AdminJob>(`/admin/jobs/${jobId}`);
  },

  /**
   * Apply moderation action to a job (approve, reject, feature, close, delete).
   */
  async moderateJob(jobId: string, action: ModerationAction): Promise<AdminJob> {
    return post<AdminJob>(`/admin/jobs/${jobId}/moderate`, action);
  },

  /**
   * Apply a bulk action to multiple jobs at once.
   */
  async bulkActionOnJobs(bulkAction: BulkActionRequest): Promise<{ success: boolean; affected: number }> {
    return post<{ success: boolean; affected: number }>('/admin/jobs/bulk', bulkAction);
  },

  // ===========================================================================
  // Application Management
  // ===========================================================================

  /**
   * Get paginated list of all applications.
   * Supports filtering by status, job, and user.
   */
  async getApplications(page = 1, limit = 20, filters?: { status?: string; jobId?: string; userId?: string }): Promise<AdminApplicationsResponse> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.status) params.set('status', filters.status);
    if (filters?.jobId) params.set('jobId', filters.jobId);
    if (filters?.userId) params.set('userId', filters.userId);
    return get<AdminApplicationsResponse>(`/admin/applications?${params.toString()}`);
  },

  /**
   * Get a single application detail.
   */
  async getApplicationById(applicationId: string): Promise<AdminApplication> {
    return get<AdminApplication>(`/admin/applications/${applicationId}`);
  },

  /**
   * Update an application's status (pending -> reviewing -> accepted/rejected).
   */
  async updateApplicationStatus(
    applicationId: string,
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected',
    notes?: string,
  ): Promise<AdminApplication> {
    return patch<AdminApplication>(`/admin/applications/${applicationId}/status`, { status, notes });
  },

  // ===========================================================================
  // Payment Monitoring
  // ===========================================================================

  /**
   * Get paginated list of all payments for monitoring.
   * Supports filtering by status, method, and search.
   */
  async getPayments(page = 1, limit = 20, filters?: { status?: string; method?: string; search?: string }): Promise<AdminPaymentsResponse> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.status) params.set('status', filters.status);
    if (filters?.method) params.set('method', filters.method);
    if (filters?.search) params.set('search', filters.search);
    return get<AdminPaymentsResponse>(`/admin/payments?${params.toString()}`);
  },

  /**
   * Get a single payment's detailed info.
   */
  async getPaymentById(paymentId: string): Promise<AdminPayment> {
    return get<AdminPayment>(`/admin/payments/${paymentId}`);
  },

  /**
   * Process a refund for a payment as an admin.
   */
  async processRefund(paymentId: string, reason?: string): Promise<{ success: boolean; refundId: string }> {
    return post<{ success: boolean; refundId: string }>(`/admin/payments/${paymentId}/refund`, { reason });
  },

  // ===========================================================================
  // Activity Log
  // ===========================================================================

  /**
   * Get admin activity log for audit trail.
   */
  async getActivityLog(page = 1, limit = 50): Promise<ActivityLogResponse> {
    return get<ActivityLogResponse>(`/admin/activity-log?page=${page}&limit=${limit}`);
  },

  // ===========================================================================
  // Settings
  // ===========================================================================

  /**
   * Get current platform settings.
   */
  async getSettings(): Promise<AdminSettings> {
    return get<AdminSettings>('/admin/settings');
  },

  /**
   * Update platform settings.
   */
  async updateSettings(settings: AdminSettings): Promise<AdminSettings> {
    return patch<AdminSettings>('/admin/settings', settings);
  },

  // ===========================================================================
  // Reports & Analytics
  // ===========================================================================

  /**
   * Get revenue analytics for a date range.
   */
  async getRevenueAnalytics(startDate: string, endDate: string): Promise<{ date: string; revenue: number; payments: number }[]> {
    return get<{ date: string; revenue: number; payments: number }[]>(
      `/admin/analytics/revenue?startDate=${startDate}&endDate=${endDate}`,
    );
  },

  /**
   * Get user growth analytics for a date range.
   */
  async getUserAnalytics(startDate: string, endDate: string): Promise<{ date: string; signups: number; active: number }[]> {
    return get<{ date: string; signups: number; active: number }[]>(
      `/admin/analytics/users?startDate=${startDate}&endDate=${endDate}`,
    );
  },
};

export default adminApi;
