import { createCollection, seedDatabase } from './db';
import type { Job } from './db';

const jobsCollection = createCollection<Job>('jobs');

export type { Job };

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

export const jobsApi = {
  getAll: () => jobsCollection.findAll(),
  getById: (id: string) => jobsCollection.findById(id),
  getByIndustry: (industry: string) => jobsCollection.findBy({ industry }),
  getByLocation: (location: string) => jobsCollection.findBy({ location }),
  search: (query: string) => {
    const q = query.toLowerCase();
    return jobsCollection.findAll().filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.titleZh.toLowerCase().includes(q) ||
      j.titleEn.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  },
  create: (data: Omit<Job, 'id' | 'createdAt'>) => jobsCollection.create(data),
  update: (id: string, data: Partial<Job>) => jobsCollection.update(id, data),
  remove: (id: string) => jobsCollection.delete(id),
  count: () => jobsCollection.count(),
  apply: (jobId: string, userId: string) => {
    const job = jobsCollection.findById(jobId);
    if (job) {
      jobsCollection.update(jobId, { applicants: job.applicants + 1 });
      const apps = getApplications();
      apps.push({
        id: crypto.randomUUID(),
        jobId,
        userId,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      });
      saveApplications(apps);
    }
    return job;
  },
  getApplications: (userId: string) => {
    const apps = getApplications();
    const jobs = jobsCollection.findAll();
    return apps
      .filter(a => a.userId === userId)
      .map(a => ({
        ...a,
        job: jobs.find(j => j.id === a.jobId),
      }));
  },
  getJobApplicants: (jobId: string) => {
    return getApplications().filter(a => a.jobId === jobId);
  },
};

// Auto-seed on first load
seedDatabase();
