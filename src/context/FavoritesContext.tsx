'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ──────────────────────────────────────────────
// Type Definitions
// ──────────────────────────────────────────────

export interface FavoriteItem {
  id: string;
  type: 'job' | 'course';
  typeId: string;
  createdAt: string;
}

export interface FavoritesContextValue {
  /** All favorite items */
  all: FavoriteItem[];
  /** Number of favorited jobs */
  jobCount: number;
  /** Number of favorited courses */
  courseCount: number;
  /** Total favorites count */
  totalCount: number;
  /** Toggle a job favorite */
  toggleJob: (jobId: string) => void;
  /** Toggle a course favorite */
  toggleCourse: (courseId: string) => void;
  /** Add a job favorite */
  addJob: (jobId: string) => void;
  /** Add a course favorite */
  addCourse: (courseId: string) => void;
  /** Remove a job favorite */
  removeJob: (jobId: string) => void;
  /** Remove a course favorite */
  removeCourse: (courseId: string) => void;
  /** Clear all favorites */
  clearAll: () => void;
  /** Check if a job is favorited */
  isJobFavorited: (jobId: string) => boolean;
  /** Check if a course is favorited */
  isCourseFavorited: (courseId: string) => boolean;
  /** Check if any item with given id is favorited */
  isFavorited: (id: string) => boolean;
  /** Reload from localStorage */
  reload: () => void;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const STORAGE_KEY = 'khmercareer_favorites';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFromStorage(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as FavoriteItem[];
  } catch {
    return [];
  }
}

function saveToStorage(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('[FavoritesContext] Failed to save:', err);
  }
}

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [items, setItems] = useState<FavoriteItem[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const reload = useCallback(() => {
    setItems(loadFromStorage());
  }, []);

  const addItem = useCallback(
    (type: 'job' | 'course', typeId: string) => {
      setItems((prev) => {
        if (prev.some((i) => i.type === type && i.typeId === typeId)) return prev;
        return [{ id: `${type}-${typeId}`, type, typeId, createdAt: new Date().toISOString() }, ...prev];
      });
    },
    [],
  );

  const removeItem = useCallback(
    (type: 'job' | 'course', typeId: string) => {
      setItems((prev) => prev.filter((i) => !(i.type === type && i.typeId === typeId)));
    },
    [],
  );

  const toggleItem = useCallback(
    (type: 'job' | 'course', typeId: string) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.type === type && i.typeId === typeId);
        if (exists) return prev.filter((i) => !(i.type === type && i.typeId === typeId));
        return [{ id: `${type}-${typeId}`, type, typeId, createdAt: new Date().toISOString() }, ...prev];
      });
    },
    [],
  );

  const clearAll = useCallback(() => setItems([]), []);

  const toggleJob = useCallback((jobId: string) => toggleItem('job', jobId), [toggleItem]);
  const toggleCourse = useCallback((courseId: string) => toggleItem('course', courseId), [toggleItem]);
  const addJob = useCallback((jobId: string) => addItem('job', jobId), [addItem]);
  const addCourse = useCallback((courseId: string) => addItem('course', courseId), [addItem]);
  const removeJob = useCallback((jobId: string) => removeItem('job', jobId), [removeItem]);
  const removeCourse = useCallback((courseId: string) => removeItem('course', courseId), [removeItem]);
  const isJobFavorited = useCallback((jobId: string) => items.some((i) => i.type === 'job' && i.typeId === jobId), [items]);
  const isCourseFavorited = useCallback((courseId: string) => items.some((i) => i.type === 'course' && i.typeId === courseId), [items]);
  const isFavorited = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      all: items,
      jobCount: items.filter((i) => i.type === 'job').length,
      courseCount: items.filter((i) => i.type === 'course').length,
      totalCount: items.length,
      toggleJob,
      toggleCourse,
      addJob,
      addCourse,
      removeJob,
      removeCourse,
      clearAll,
      isJobFavorited,
      isCourseFavorited,
      isFavorited,
      reload,
    }),
    [items, toggleJob, toggleCourse, addJob, addCourse, removeJob, removeCourse, clearAll, isJobFavorited, isCourseFavorited, isFavorited, reload],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a <FavoritesProvider>');
  }
  return ctx;
}
