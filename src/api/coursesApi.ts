/**
 * KhmerCareer Express — Courses API (HTTP)
 * Real backend integration with localStorage fallback.
 */

import { get, post } from './client';
import { createCollection } from './db';
import type { Course, CourseFilters, CoursesListResponse, EnrollmentResponse } from './types';

const coursesCollection = createCollection<Course>('courses');

// =============================================================================
// Fallback detection
// =============================================================================

const COURSES_FALLBACK_KEY = 'khmer_courses_fallback';

function isFallbackEnabled(): boolean {
  try { return localStorage.getItem(COURSES_FALLBACK_KEY) === 'true'; } catch { return false; }
}

function setFallbackEnabled(v: boolean): void {
  try { localStorage.setItem(COURSES_FALLBACK_KEY, v ? 'true' : 'false'); } catch { /* */ }
}

// =============================================================================
// localStorage helpers (fallback)
// =============================================================================

interface EnrollmentRecord {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  enrolledAt: string;
}

const ENROLL_KEY = 'khmercareer_enrollments';

function getEnrollments(): EnrollmentRecord[] {
  try { return JSON.parse(localStorage.getItem(ENROLL_KEY) || '[]'); } catch { return []; }
}

function saveEnrollments(enrolls: EnrollmentRecord[]) {
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrolls));
}

function getCurrentUserId(): string | null {
  try {
    const user = localStorage.getItem('khmer_auth_user');
    if (user) return JSON.parse(user).id as string;
  } catch { /* */ }
  return 'anonymous_user';
}

// =============================================================================
// Courses API
// =============================================================================

export { type Course, type CourseFilters, type CoursesListResponse, type EnrollmentResponse };

export const coursesApi = {
  // ── Get Courses (list with filters) ─────────────────────────────────────────
  async getCourses(filters?: CourseFilters): Promise<CoursesListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.category) params.set('category', filters.category);
        if (filters.level) params.set('level', filters.level);
        if (filters.keyword) params.set('keyword', filters.keyword);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
      }

      const queryString = params.toString();
      const response = await get<CoursesListResponse>(`/courses${queryString ? `?${queryString}` : ''}`);
      setFallbackEnabled(false);
      return response;
    } catch {
      setFallbackEnabled(true);
      let courses = coursesCollection.findAll();

      if (filters) {
        if (filters.category) courses = courses.filter(c => c.category === filters.category);
        if (filters.level) courses = courses.filter(c => c.level === filters.level);
        if (filters.keyword) {
          const q = filters.keyword.toLowerCase();
          courses = courses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.instructor.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q),
          );
        }
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const total = courses.length;
      const start = (page - 1) * limit;
      const paginatedCourses = courses.slice(start, start + limit);

      return {
        courses: paginatedCourses,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }
  },

  // ── Get Course by ID ────────────────────────────────────────────────────────
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const course = await get<Course>(`/courses/${id}`);
      return course;
    } catch {
      return coursesCollection.findById(id) || null;
    }
  },

  // ── Enroll ──────────────────────────────────────────────────────────────────
  async enroll(courseId: string): Promise<EnrollmentResponse> {
    try {
      const response = await post<EnrollmentResponse>(`/courses/${courseId}/enroll`);
      return response;
    } catch {
      // Fallback: localStorage enrollment
      const userId = getCurrentUserId() || 'anonymous';
      const enrolls = getEnrollments();
      const existing = enrolls.find(e => e.courseId === courseId && e.userId === userId);

      if (!existing) {
        const newEnrollment: EnrollmentRecord = {
          id: crypto.randomUUID(),
          courseId,
          userId,
          progress: 0,
          enrolledAt: new Date().toISOString(),
        };
        enrolls.push(newEnrollment);
        saveEnrollments(enrolls);

        // Increment student count
        const course = coursesCollection.findById(courseId);
        if (course) {
          coursesCollection.update(courseId, { students: (course.students || 0) + 1 });
        }

        return {
          enrollmentId: newEnrollment.id,
          courseId,
          progress: 0,
          enrolledAt: newEnrollment.enrolledAt,
        };
      }

      return {
        enrollmentId: existing.id,
        courseId,
        progress: existing.progress,
        enrolledAt: existing.enrolledAt,
      };
    }
  },

  // ── Get User Enrollments ────────────────────────────────────────────────────
  async getUserEnrollments(): Promise<Array<EnrollmentRecord & { course: Course | undefined }>> {
    const userId = getCurrentUserId() || 'anonymous';
    const enrolls = getEnrollments();
    const courses = coursesCollection.findAll();
    return enrolls
      .filter(e => e.userId === userId)
      .map(e => ({
        ...e,
        course: courses.find(c => c.id === e.courseId),
      }));
  },

  // ── Is Enrolled ─────────────────────────────────────────────────────────────
  isEnrolled(courseId: string): boolean {
    const userId = getCurrentUserId() || 'anonymous';
    return getEnrollments().some(e => e.courseId === courseId && e.userId === userId);
  },

  // ── Update Progress ─────────────────────────────────────────────────────────
  updateProgress(courseId: string, progress: number): void {
    const userId = getCurrentUserId() || 'anonymous';
    const enrolls = getEnrollments();
    const idx = enrolls.findIndex(e => e.courseId === courseId && e.userId === userId);
    if (idx !== -1) {
      enrolls[idx].progress = Math.min(100, progress);
      saveEnrollments(enrolls);
    }
  },

  // ── Legacy compatibility ────────────────────────────────────────────────────

  /** @deprecated Use getCourses() instead */
  getAll: (): Course[] => coursesCollection.findAll(),

  /** @deprecated Use getCourseById() instead */
  getById: (id: string): Course | undefined => coursesCollection.findById(id),

  /** @deprecated Use getCourses({ keyword }) instead */
  search: (query: string): Course[] => {
    const q = query.toLowerCase();
    return coursesCollection.findAll().filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q),
    );
  },

  /** @deprecated Use getCourses({ category }) instead */
  getByCategory: (cat: string): Course[] => coursesCollection.findBy({ category: cat }),

  /** @deprecated Use local fallback */
  create: (data: Omit<Course, 'id' | 'createdAt'>): Course => coursesCollection.create(data),

  /** @deprecated Use local fallback */
  update: (id: string, data: Partial<Course>): Course | undefined => coursesCollection.update(id, data),

  /** @deprecated Use local fallback */
  remove: (id: string): boolean => coursesCollection.delete(id),

  count: (): number => coursesCollection.count(),
};

export default coursesApi;
