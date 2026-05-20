import { createCollection } from './db';
import type { Course } from './db';

const coursesCollection = createCollection<Course>('courses');

export type { Course };

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

export const coursesApi = {
  getAll: () => coursesCollection.findAll(),
  getById: (id: string) => coursesCollection.findById(id),
  getByCategory: (cat: string) => coursesCollection.findBy({ category: cat }),
  search: (query: string) => {
    const q = query.toLowerCase();
    return coursesCollection.findAll().filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.titleZh.toLowerCase().includes(q) ||
      c.titleEn.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    );
  },
  create: (data: Omit<Course, 'id' | 'createdAt'>) => coursesCollection.create(data),
  update: (id: string, data: Partial<Course>) => coursesCollection.update(id, data),
  remove: (id: string) => coursesCollection.delete(id),
  count: () => coursesCollection.count(),
  enroll: (courseId: string, userId: string) => {
    const enrolls = getEnrollments();
    if (!enrolls.find(e => e.courseId === courseId && e.userId === userId)) {
      enrolls.push({
        id: crypto.randomUUID(),
        courseId,
        userId,
        progress: 0,
        enrolledAt: new Date().toISOString(),
      });
      saveEnrollments(enrolls);
      const course = coursesCollection.findById(courseId);
      if (course) coursesCollection.update(courseId, { students: course.students + 1 });
    }
  },
  getEnrollments: (userId: string) => {
    const enrolls = getEnrollments();
    const courses = coursesCollection.findAll();
    return enrolls
      .filter(e => e.userId === userId)
      .map(e => ({
        ...e,
        course: courses.find(c => c.id === e.courseId),
      }));
  },
  updateProgress: (courseId: string, userId: string, progress: number) => {
    const enrolls = getEnrollments();
    const idx = enrolls.findIndex(e => e.courseId === courseId && e.userId === userId);
    if (idx !== -1) {
      enrolls[idx].progress = Math.min(100, progress);
      saveEnrollments(enrolls);
    }
  },
  isEnrolled: (courseId: string, userId: string) => {
    return getEnrollments().some(e => e.courseId === courseId && e.userId === userId);
  },
};
