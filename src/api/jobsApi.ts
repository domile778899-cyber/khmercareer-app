/**
 * KhmerCareer Express — Jobs API (HTTP)
 * Real backend integration with localStorage fallback for offline use.
 */

import { get, post } from './client';
import { createCollection, seedDatabase } from './db';
import type { Job } from './types';
import type {
  JobFilters,
  JobsListResponse,
  CreateJobRequest,
  ApplyJobResponse,
  MyApplication,
} from './types';

const jobsCollection = createCollection<Job>('jobs');

// =============================================================================
// Fallback detection
// =============================================================================

const JOBS_FALLBACK_KEY = 'khmer_jobs_fallback';

function isFallbackEnabled(): boolean {
  try { return localStorage.getItem(JOBS_FALLBACK_KEY) === 'true'; } catch { return false; }
}

function setFallbackEnabled(v: boolean): void {
  try { localStorage.setItem(JOBS_FALLBACK_KEY, v ? 'true' : 'false'); } catch { /* */ }
}

// =============================================================================
// localStorage helpers (fallback)
// =============================================================================

interface ApplicationRecord {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  appliedAt: string;
}

const APPS_KEY = 'khmercareer_applications';

function getApplications(): ApplicationRecord[] {
  try { return JSON.parse(localStorage.getItem(APPS_KEY) || '[]'); } catch { return []; }
}

function saveApplications(apps: ApplicationRecord[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

// Get current user ID from storage
function getCurrentUserId(): string | null {
  try {
    const user = localStorage.getItem('khmer_auth_user');
    if (user) return JSON.parse(user).id as string;
  } catch { /* */ }
  return 'anonymous_user';
}

// =============================================================================
// Jobs API
// =============================================================================

export { type Job, type JobFilters, type JobsListResponse, type CreateJobRequest, type ApplyJobResponse, type MyApplication };

export const jobsApi = {
  // ── Get Jobs (list with filters) ────────────────────────────────────────────
  async getJobs(filters?: JobFilters): Promise<JobsListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.industry) params.set('industry', filters.industry);
        if (filters.location) params.set('location', filters.location);
        if (filters.type) params.set('type', filters.type);
        if (filters.salaryMin) params.set('salaryMin', String(filters.salaryMin));
        if (filters.salaryMax) params.set('salaryMax', String(filters.salaryMax));
        if (filters.keyword) params.set('keyword', filters.keyword);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));
        if (filters.experience) params.set('experience', filters.experience);
      }

      const queryString = params.toString();
      const response = await get<JobsListResponse>(`/jobs${queryString ? `?${queryString}` : ''}`);
      setFallbackEnabled(false);
      return response;
    } catch {
      setFallbackEnabled(true);
      // Fallback to localStorage
      let jobs = jobsCollection.findAll();

      if (filters) {
        if (filters.industry) jobs = jobs.filter(j => j.industry === filters.industry);
        if (filters.location) jobs = jobs.filter(j => j.location === filters.location);
        if (filters.type) jobs = jobs.filter(j => j.type === filters.type);
        if (filters.salaryMin) jobs = jobs.filter(j => (j.salaryMin ?? 0) >= filters.salaryMin!);
        if (filters.salaryMax) jobs = jobs.filter(j => (j.salaryMax ?? 0) <= filters.salaryMax!);
        if (filters.keyword) {
          const q = filters.keyword.toLowerCase();
          jobs = jobs.filter(j =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.industry.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q),
          );
        }
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const total = jobs.length;
      const start = (page - 1) * limit;
      const paginatedJobs = jobs.slice(start, start + limit);

      return {
        jobs: paginatedJobs,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }
  },

  // ── Get Job by ID ───────────────────────────────────────────────────────────
  async getJobById(id: string): Promise<Job | null> {
    try {
      const job = await get<Job>(`/jobs/${id}`);
      return job;
    } catch {
      return jobsCollection.findById(id) || null;
    }
  },

  // ── Get Featured Jobs ───────────────────────────────────────────────────────
  async getFeaturedJobs(): Promise<Job[]> {
    try {
      const response = await get<{ jobs: Job[] }>('/jobs/featured');
      return response.jobs || [];
    } catch {
      setFallbackEnabled(true);
      return jobsCollection
        .findAll()
        .filter(j => j.featured)
        .slice(0, 6);
    }
  },

  // ── Search Jobs ─────────────────────────────────────────────────────────────
  async searchJobs(query: string): Promise<Job[]> {
    if (!query.trim()) return [];
    try {
      const response = await get<{ jobs: Job[] }>(`/jobs/search?q=${encodeURIComponent(query.trim())}`);
      return response.jobs || [];
    } catch {
      const q = query.toLowerCase();
      return jobsCollection.findAll().filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.industry.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
      );
    }
  },

  // ── Apply to Job ────────────────────────────────────────────────────────────
  async applyToJob(jobId: string): Promise<ApplyJobResponse> {
    try {
      const response = await post<ApplyJobResponse>(`/jobs/${jobId}/apply`);
      return response;
    } catch {
      // Fallback localStorage application
      const userId = getCurrentUserId() || 'anonymous';
      const job = jobsCollection.findById(jobId);
      if (job) {
        jobsCollection.update(jobId, { applicants: (job.applicants || 0) + 1 });
      }
      const apps = getApplications();
      if (!apps.find(a => a.jobId === jobId && a.userId === userId)) {
        apps.push({
          id: crypto.randomUUID(),
          jobId,
          userId,
          status: 'pending',
          appliedAt: new Date().toISOString(),
        });
        saveApplications(apps);
      }
      return {
        applicationId: crypto.randomUUID(),
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
    }
  },

  // ── Create Job ──────────────────────────────────────────────────────────────
  async createJob(data: CreateJobRequest): Promise<Job> {
    const response = await post<Job>('/jobs', data);
    return response;
  },

  // ── Get My Applications ─────────────────────────────────────────────────────
  async getMyApplications(): Promise<MyApplication[]> {
    try {
      const response = await get<{ applications: MyApplication[] }>('/applications/my');
      return response.applications || [];
    } catch {
      const userId = getCurrentUserId() || 'anonymous';
      const apps = getApplications();
      const jobs = jobsCollection.findAll();
      return apps
        .filter(a => a.userId === userId)
        .map(a => ({
          id: a.id,
          jobId: a.jobId,
          job: jobs.find(j => j.id === a.jobId)!,
          status: a.status as 'pending' | 'reviewing' | 'accepted' | 'rejected',
          appliedAt: a.appliedAt,
          updatedAt: a.appliedAt,
        }))
        .filter(a => a.job); // filter out applications with missing jobs
    }
  },

  // ── Get Recent Jobs ─────────────────────────────────────────────────────────
  async getRecentJobs(limit = 10): Promise<Job[]> {
    try {
      const response = await get<{ jobs: Job[] }>(`/jobs/recent?limit=${limit}`);
      return response.jobs || [];
    } catch {
      return jobsCollection
        .findAll()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }
  },

  // ── Legacy compatibility helpers ────────────────────────────────────────────

  /** @deprecated Use getJobs() instead */
  getAll: (): Job[] => {
    return jobsCollection.findAll();
  },

  /** @deprecated Use getJobById() instead */
  getById: (id: string): Job | undefined => {
    return jobsCollection.findById(id);
  },

  /** @deprecated Use getJobs({ keyword }) instead */
  search: (query: string): Job[] => {
    const q = query.toLowerCase();
    return jobsCollection.findAll().filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.industry.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q),
    );
  },

  /** @deprecated Use createJob() instead */
  create: (data: Omit<Job, 'id' | 'createdAt'>): Job => {
    return jobsCollection.create(data);
  },

  /** @deprecated Use local fallback */
  update: (id: string, data: Partial<Job>): Job | undefined => {
    return jobsCollection.update(id, data);
  },

  /** @deprecated Use local fallback */
  remove: (id: string): boolean => {
    return jobsCollection.delete(id);
  },

  count: (): number => {
    return jobsCollection.count();
  },
};

// Auto-seed on first load
seedDatabase();
