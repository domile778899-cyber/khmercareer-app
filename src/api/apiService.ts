/**
 * Khmer Career Express - Unified API Service Layer
 * 
 * Designed for easy future migration from localStorage (mock) to real REST API.
 * When ready, just set apiService.configure({ baseURL: 'https://api.khmercareer.com' })
 * and implement the transport methods.
 */

import { createCollection } from './db';
import type { Job, Course, Notification, Application } from './db';

// =============================================================================
// Types
// =============================================================================

export interface HttpClientConfig {
  baseURL: string;
  headers: Record<string, string>;
  timeout: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiCollection<T> {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  create: (data: Omit<T, 'id' | 'createdAt'>) => T;
  update: (id: string, data: Partial<T>) => T | undefined;
  delete: (id: string) => boolean;
  count: () => number;
}

// =============================================================================
// HttpClient – Abstract Transport Layer
// =============================================================================

class HttpClient {
  private config: HttpClientConfig = {
    baseURL: '', // Empty = localStorage mode
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  };

  configure(cfg: Partial<HttpClientConfig>) {
    this.config = { ...this.config, ...cfg };
  }

  private get isLocalMode(): boolean {
    return !this.config.baseURL;
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: Partial<HttpClientConfig>,
  ): Promise<ApiResponse<T>> {
    if (this.isLocalMode) {
      throw new Error(`[HttpClient] Cannot make real HTTP request in localStorage mode. 
        Call apiService.configure({ baseURL: 'https://your-api.com' }) to switch to REST mode.`);
    }

    const cfg = { ...this.config, ...options };
    const url = `${cfg.baseURL}${path}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), cfg.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: cfg.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const json = await response.json();
      return { success: response.ok, data: json as T, message: response.statusText };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, data: null as unknown as T, message: msg };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, options?: Partial<HttpClientConfig>) {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: Partial<HttpClientConfig>) {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: Partial<HttpClientConfig>) {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: Partial<HttpClientConfig>) {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: Partial<HttpClientConfig>) {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

// =============================================================================
// LocalStorage-backed Collection Adapter
// =============================================================================

function createLocalAdapter<T extends { id: string }>(
  collectionName: string,
): ApiCollection<T> {
  const local = createCollection<T>(collectionName);

  return {
    getAll: () => local.findAll() as T[],
    getById: (id: string) => local.findById(id),
    create: (data: Omit<T, 'id' | 'createdAt'>) => local.create(data) as T,
    update: (id: string, data: Partial<T>) => local.update(id, data) as T | undefined,
    delete: (id: string) => local.delete(id),
    count: () => local.count(),
  };
}

// =============================================================================
// API Modules
// =============================================================================

const client = new HttpClient();

// ─── Jobs Module ──────────────────────────────────────────────────────────────
export interface JobWithDetails extends Job {
  applications?: Application[];
  applicantCount?: number;
}

export const jobsApi = {
  getAll: (): Job[] => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.getAll();
  },
  getById: (id: string): Job | undefined => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.getById(id);
  },
  search: (query: string): Job[] => {
    const q = query.toLowerCase();
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.getAll().filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.industry.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.description && j.description.toLowerCase().includes(q)),
    );
  },
  filter: (filters: {
    industry?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    type?: string;
    experience?: string;
  }): Job[] => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.getAll().filter((j) => {
      if (filters.industry && j.industry !== filters.industry) return false;
      if (filters.location && j.location !== filters.location) return false;
      if (filters.salaryMin && (j.salaryMin || 0) < filters.salaryMin) return false;
      if (filters.salaryMax && (j.salaryMax || 0) > filters.salaryMax) return false;
      if (filters.type && j.type !== filters.type) return false;
      if (filters.experience && j.experience !== filters.experience) return false;
      return true;
    });
  },
  getFeatured: (limit = 6): Job[] => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter
      .getAll()
      .filter((j) => j.featured)
      .slice(0, limit);
  },
  getRecent: (limit = 10): Job[] => {
    const adapter = createLocalAdapter<Job>('jobs');
    // Sort by id descending as a proxy for recency
    return adapter
      .getAll()
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, limit);
  },
  create: (data: Omit<Job, 'id' | 'createdAt'>) => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.create(data);
  },
  update: (id: string, data: Partial<Job>) => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.update(id, data);
  },
  delete: (id: string) => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.delete(id);
  },
  count: () => {
    const adapter = createLocalAdapter<Job>('jobs');
    return adapter.count();
  },
  apply: (jobId: string, userId: string) => {
    const appAdapter = createLocalAdapter<Application>('applications');
    const existing = appAdapter.getAll();
    if (!existing.find((a) => a.jobId === jobId && a.userId === userId)) {
      appAdapter.create({
        jobId,
        userId,
        status: 'pending' as const,
        appliedAt: new Date().toISOString(),
      } as unknown as Omit<Application, 'id' | 'createdAt'>);
    }
  },
  getApplications: (userId: string) => {
    const appAdapter = createLocalAdapter<Application>('applications');
    return appAdapter.getAll().filter((a) => a.userId === userId);
  },
  getApplicationsForJob: (jobId: string) => {
    const appAdapter = createLocalAdapter<Application>('applications');
    return appAdapter.getAll().filter((a) => a.jobId === jobId);
  },
};

// ─── Courses Module ───────────────────────────────────────────────────────────
export const coursesApi = {
  getAll: () => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.getAll();
  },
  getById: (id: string) => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.getById(id);
  },
  search: (query: string) => {
    const q = query.toLowerCase();
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.getAll().filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleZh.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q),
    );
  },
  getByCategory: (cat: string) => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.getAll().filter((c) => c.category === cat);
  },
  create: (data: Omit<Course, 'id' | 'createdAt'>) => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.create(data);
  },
  update: (id: string, data: Partial<Course>) => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.update(id, data);
  },
  delete: (id: string) => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.delete(id);
  },
  count: () => {
    const adapter = createLocalAdapter<Course>('courses');
    return adapter.count();
  },
  enroll: (courseId: string, userId: string) => {
    const enrollKey = 'khmercareer_enrollments';
    const raw = localStorage.getItem(enrollKey);
    const enrolls: Array<{ id: string; courseId: string; userId: string; progress: number; enrolledAt: string }> =
      raw ? JSON.parse(raw) : [];
    if (!enrolls.find((e) => e.courseId === courseId && e.userId === userId)) {
      enrolls.push({
        id: crypto.randomUUID(),
        courseId,
        userId,
        progress: 0,
        enrolledAt: new Date().toISOString(),
      });
      localStorage.setItem(enrollKey, JSON.stringify(enrolls));

      // Increment student count
      const adapter = createLocalAdapter<Course>('courses');
      const course = adapter.getById(courseId);
      if (course) {
        adapter.update(courseId, { students: (course.students || 0) + 1 } as Partial<Course>);
      }
    }
  },
  isEnrolled: (courseId: string, userId: string): boolean => {
    const enrollKey = 'khmercareer_enrollments';
    const raw = localStorage.getItem(enrollKey);
    if (!raw) return false;
    try {
      const enrolls = JSON.parse(raw);
      return enrolls.some((e: { courseId: string; userId: string }) => e.courseId === courseId && e.userId === userId);
    } catch {
      return false;
    }
  },
  getUserEnrollments: (userId: string) => {
    const enrollKey = 'khmercareer_enrollments';
    const raw = localStorage.getItem(enrollKey);
    if (!raw) return [];
    try {
      const enrolls = JSON.parse(raw).filter((e: { userId: string }) => e.userId === userId);
      const adapter = createLocalAdapter<Course>('courses');
      const allCourses = adapter.getAll();
      return enrolls.map((e: { courseId: string; userId: string; progress: number; enrolledAt: string }) => ({
        ...e,
        course: allCourses.find((c) => c.id === e.courseId),
      }));
    } catch {
      return [];
    }
  },
  updateProgress: (courseId: string, userId: string, progress: number) => {
    const enrollKey = 'khmercareer_enrollments';
    const raw = localStorage.getItem(enrollKey);
    if (!raw) return;
    try {
      const enrolls = JSON.parse(raw);
      const idx = enrolls.findIndex(
        (e: { courseId: string; userId: string }) => e.courseId === courseId && e.userId === userId,
      );
      if (idx !== -1) {
        enrolls[idx].progress = Math.min(100, progress);
        localStorage.setItem(enrollKey, JSON.stringify(enrolls));
      }
    } catch {
      // silent
    }
  },
};

// ─── Notifications Module ─────────────────────────────────────────────────────
export const notificationsApi = {
  getAll: () => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.getAll();
  },
  getUnread: () => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.getAll().filter((n) => !n.read);
  },
  markAsRead: (id: string) => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.update(id, { read: true } as Partial<Notification>);
  },
  markAllAsRead: () => {
    const adapter = createLocalAdapter<Notification>('notifications');
    const all = adapter.getAll();
    all.forEach((n) => adapter.update(n.id, { read: true } as Partial<Notification>));
  },
  create: (data: Omit<Notification, 'id' | 'createdAt'>) => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.create(data);
  },
  delete: (id: string) => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.delete(id);
  },
  count: () => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.count();
  },
  unreadCount: () => {
    const adapter = createLocalAdapter<Notification>('notifications');
    return adapter.getAll().filter((n) => !n.read).length;
  },
};

// ─── Applications Module ──────────────────────────────────────────────────────
export const applicationsApi = {
  getAll: () => {
    const adapter = createLocalAdapter<Application>('applications');
    return adapter.getAll();
  },
  getByUser: (userId: string) => {
    const adapter = createLocalAdapter<Application>('applications');
    return adapter.getAll().filter((a) => a.userId === userId);
  },
  getByJob: (jobId: string) => {
    const adapter = createLocalAdapter<Application>('applications');
    return adapter.getAll().filter((a) => a.jobId === jobId);
  },
  apply: (jobId: string, userId: string) => {
    const adapter = createLocalAdapter<Application>('applications');
    const existing = adapter.getAll();
    if (!existing.find((a) => a.jobId === jobId && a.userId === userId)) {
      return adapter.create({
        jobId,
        userId,
        status: 'pending' as const,
        appliedAt: new Date().toISOString(),
      } as unknown as Omit<Application, 'id' | 'createdAt'>);
    }
    return existing.find((a) => a.jobId === jobId && a.userId === userId);
  },
  updateStatus: (id: string, status: Application['status']) => {
    const adapter = createLocalAdapter<Application>('applications');
    return adapter.update(id, { status } as Partial<Application>);
  },
  withdraw: (id: string) => {
    const adapter = createLocalAdapter<Application>('applications');
    return adapter.delete(id);
  },
};

// =============================================================================
// Exports
// =============================================================================

export const apiService = {
  /** Configure the HTTP client for REST API mode */
  configure: (cfg: Partial<HttpClientConfig>) => client.configure(cfg),
  /** Check if currently in localStorage mode */
  isLocalMode: () => !client['config']?.baseURL,
  /** Get the HTTP client for custom requests */
  client,
  /** API modules */
  jobs: jobsApi,
  courses: coursesApi,
  notifications: notificationsApi,
  applications: applicationsApi,
};

export default apiService;
