/**
 * ApplyContext - Job Application State Management
 *
 * Manages user's job application status with support for:
 * - Single job application
 * - Batch application (one-click apply to multiple jobs)
 * - Application status tracking: pending/submitted/viewed/accepted/rejected
 * - localStorage persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────

/** Application status lifecycle */
export type ApplicationStatus =
  | "pending"
  | "submitted"
  | "viewed"
  | "accepted"
  | "rejected";

/** Single application record */
export interface Application {
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  resumeId?: string;
  coverLetter?: string;
}

/** Resume profile used for quick apply */
export interface ResumeProfile {
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFileName: string;
}

/** Context value exposed to consumers */
export interface ApplyContextValue {
  /** All user applications */
  applications: Application[];
  /** Current resume profile for quick apply */
  resumeProfile: ResumeProfile | null;
  /** Apply to a single job */
  applyJob: (jobId: string, options?: { resumeId?: string; coverLetter?: string }) => void;
  /** Batch apply to multiple jobs */
  batchApply: (jobIds: string[], options?: { resumeId?: string; coverLetter?: string }) => void;
  /** Withdraw an application */
  withdrawApplication: (jobId: string) => void;
  /** Update application status */
  updateStatus: (jobId: string, status: ApplicationStatus) => void;
  /** Check if user has applied to a job */
  hasApplied: (jobId: string) => boolean;
  /** Get application status for a job */
  getApplicationStatus: (jobId: string) => ApplicationStatus | null;
  /** Get total applied count */
  getAppliedCount: () => number;
  /** Get count by status */
  getCountByStatus: (status: ApplicationStatus) => number;
  /** Set resume profile */
  setResumeProfile: (profile: ResumeProfile | null) => void;
  /** Check if resume profile is complete */
  hasResumeProfile: () => boolean;
  /** Clear all applications (for testing/logout) */
  clearAll: () => void;
}

// ─── Constants ───────────────────────────────────────────────────

const STORAGE_KEY_APPLICATIONS = "khmercareer_applications";
const STORAGE_KEY_RESUME_PROFILE = "khmercareer_resume_profile";

// ─── Context ─────────────────────────────────────────────────────

const ApplyContext = createContext<ApplyContextValue | null>(null);

// ─── Helper Functions ────────────────────────────────────────────

/** Load applications from localStorage */
function loadApplicationsFromStorage(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Application[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save applications to localStorage */
function saveApplicationsToStorage(apps: Application[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

/** Load resume profile from localStorage */
function loadResumeProfileFromStorage(): ResumeProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUME_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as ResumeProfile;
  } catch {
    return null;
  }
}

/** Save resume profile to localStorage */
function saveResumeProfileToStorage(profile: ResumeProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      localStorage.setItem(STORAGE_KEY_RESUME_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY_RESUME_PROFILE);
    }
  } catch {
    // Silently fail
  }
}

/** Create a new application record */
function createApplication(
  jobId: string,
  options?: { resumeId?: string; coverLetter?: string }
): Application {
  const now = new Date().toISOString();
  return {
    jobId,
    status: "submitted",
    appliedAt: now,
    updatedAt: now,
    resumeId: options?.resumeId,
    coverLetter: options?.coverLetter,
  };
}

// ─── Provider ────────────────────────────────────────────────────

export interface ApplyProviderProps {
  children: ReactNode;
}

export function ApplyProvider({ children }: ApplyProviderProps): ReactNode {
  const [applications, setApplications] = useState<Application[]>(
    loadApplicationsFromStorage
  );
  const [resumeProfile, setResumeProfileState] = useState<ResumeProfile | null>(
    loadResumeProfileFromStorage
  );

  // Persist applications whenever they change
  useEffect(() => {
    saveApplicationsToStorage(applications);
  }, [applications]);

  // Persist resume profile whenever it changes
  useEffect(() => {
    saveResumeProfileToStorage(resumeProfile);
  }, [resumeProfile]);

  // ─── Actions ─────────────────────────────────────────────────

  /** Apply to a single job */
  const applyJob = useCallback(
    (jobId: string, options?: { resumeId?: string; coverLetter?: string }) => {
      setApplications((prev) => {
        // Prevent duplicate applications
        if (prev.some((app) => app.jobId === jobId)) return prev;

        const newApp = createApplication(jobId, options);
        return [...prev, newApp];
      });
    },
    []
  );

  /** Batch apply to multiple jobs */
  const batchApply = useCallback(
    (
      jobIds: string[],
      options?: { resumeId?: string; coverLetter?: string }
    ) => {
      if (!jobIds.length) return;

      setApplications((prev) => {
        const existingIds = new Set(prev.map((app) => app.jobId));
        const newApps: Application[] = [];

        jobIds.forEach((jobId) => {
          if (!existingIds.has(jobId)) {
            newApps.push(createApplication(jobId, options));
            existingIds.add(jobId); // Prevent duplicates within the same batch
          }
        });

        return [...prev, ...newApps];
      });
    },
    []
  );

  /** Withdraw an application */
  const withdrawApplication = useCallback((jobId: string) => {
    setApplications((prev) => prev.filter((app) => app.jobId !== jobId));
  }, []);

  /** Update application status */
  const updateStatus = useCallback(
    (jobId: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.jobId === jobId
            ? { ...app, status, updatedAt: new Date().toISOString() }
            : app
        )
      );
    },
    []
  );

  /** Set resume profile */
  const setResumeProfile = useCallback((profile: ResumeProfile | null) => {
    setResumeProfileState(profile);
  }, []);

  /** Clear all data */
  const clearAll = useCallback(() => {
    setApplications([]);
    setResumeProfileState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_APPLICATIONS);
      localStorage.removeItem(STORAGE_KEY_RESUME_PROFILE);
    }
  }, []);

  // ─── Queries ─────────────────────────────────────────────────

  const hasApplied = useCallback(
    (jobId: string): boolean => {
      return applications.some((app) => app.jobId === jobId);
    },
    [applications]
  );

  const getApplicationStatus = useCallback(
    (jobId: string): ApplicationStatus | null => {
      const app = applications.find((a) => a.jobId === jobId);
      return app ? app.status : null;
    },
    [applications]
  );

  const getAppliedCount = useCallback((): number => {
    return applications.length;
  }, [applications]);

  const getCountByStatus = useCallback(
    (status: ApplicationStatus): number => {
      return applications.filter((app) => app.status === status).length;
    },
    [applications]
  );

  const hasResumeProfile = useCallback((): boolean => {
    return resumeProfile !== null;
  }, [resumeProfile]);

  // ─── Memoized Value ──────────────────────────────────────────

  const value = useMemo<ApplyContextValue>(
    () => ({
      applications,
      resumeProfile,
      applyJob,
      batchApply,
      withdrawApplication,
      updateStatus,
      hasApplied,
      getApplicationStatus,
      getAppliedCount,
      getCountByStatus,
      setResumeProfile,
      hasResumeProfile,
      clearAll,
    }),
    [
      applications,
      resumeProfile,
      applyJob,
      batchApply,
      withdrawApplication,
      updateStatus,
      hasApplied,
      getApplicationStatus,
      getAppliedCount,
      getCountByStatus,
      setResumeProfile,
      hasResumeProfile,
      clearAll,
    ]
  );

  return (
    <ApplyContext.Provider value={value}>
      {children}
    </ApplyContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────

/**
 * Hook to access the ApplyContext.
 * Must be used within an `<ApplyProvider>`.
 */
export function useApply(): ApplyContextValue {
  const context = useContext(ApplyContext);
  if (!context) {
    throw new Error("useApply must be used within an <ApplyProvider>");
  }
  return context;
}

// ─── Default Export ──────────────────────────────────────────────

export default ApplyContext;
