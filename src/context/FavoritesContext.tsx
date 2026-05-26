'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { favoritesApi } from '../api/favoritesApi';
import type { Favorite } from '../api/favoritesApi';

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
  /** Reload from API */
  reload: () => void;
  /** Whether favorites are syncing with the API */
  syncing: boolean;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const STORAGE_KEY = 'khmercareer_favorites';
const FAVORITES_LOADED_KEY = 'khmercareer_favorites_loaded';

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

/**
 * Convert API Favorite[] to local FavoriteItem[]
 */
function mapApiToLocal(apiFavs: Favorite[]): FavoriteItem[] {
  return apiFavs.map((f) => ({
    id: f.id,
    type: 'job' as const,
    typeId: f.jobId,
    createdAt: f.createdAt,
  }));
}

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const mounted = useRef(false);

  // ── Load favorites from API on mount ─────────────────────────────────────
  const loadFavorites = useCallback(async () => {
    setSyncing(true);
    try {
      const apiFavorites = await favoritesApi.getFavorites();
      const localItems = mapApiToLocal(apiFavorites);
      setItems(localItems);
      saveToStorage(localItems);
    } catch {
      // API failed — use cached localStorage data
      setItems(loadFromStorage());
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Start with cached data for instant UI
    setItems(loadFromStorage());
    // Then sync with API
    loadFavorites();
  }, [loadFavorites]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const reload = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addItem = useCallback(
    async (type: 'job' | 'course', typeId: string) => {
      // Optimistic UI update
      setItems((prev) => {
        if (prev.some((i) => i.type === type && i.typeId === typeId)) return prev;
        return [
          { id: `${type}-${typeId}`, type, typeId, createdAt: new Date().toISOString() },
          ...prev,
        ];
      });

      // API call for job favorites (only jobs are supported by the API)
      if (type === 'job') {
        try {
          await favoritesApi.addFavorite(typeId);
        } catch {
          // Keep localStorage state as fallback; no action needed
        }
      }
    },
    [],
  );

  const removeItem = useCallback(
    async (type: 'job' | 'course', typeId: string) => {
      // Optimistic UI update
      setItems((prev) => prev.filter((i) => !(i.type === type && i.typeId === typeId)));

      // API call for job favorites
      if (type === 'job') {
        try {
          await favoritesApi.removeFavorite(typeId);
        } catch {
          // Keep localStorage state as fallback; no action needed
        }
      }
    },
    [],
  );

  const toggleItem = useCallback(
    async (type: 'job' | 'course', typeId: string) => {
      const exists = items.some((i) => i.type === type && i.typeId === typeId);
      if (exists) {
        await removeItem(type, typeId);
      } else {
        await addItem(type, typeId);
      }
    },
    [items, addItem, removeItem],
  );

  const clearAll = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const toggleJob = useCallback(
    (jobId: string) => toggleItem('job', jobId),
    [toggleItem],
  );
  const toggleCourse = useCallback(
    (courseId: string) => toggleItem('course', courseId),
    [toggleItem],
  );
  const addJob = useCallback((jobId: string) => addItem('job', jobId), [addItem]);
  const addCourse = useCallback((courseId: string) => addItem('course', courseId), [addItem]);
  const removeJob = useCallback((jobId: string) => removeItem('job', jobId), [removeItem]);
  const removeCourse = useCallback((courseId: string) => removeItem('course', courseId), [removeItem]);
  const isJobFavorited = useCallback(
    (jobId: string) => items.some((i) => i.type === 'job' && i.typeId === jobId),
    [items],
  );
  const isCourseFavorited = useCallback(
    (courseId: string) => items.some((i) => i.type === 'course' && i.typeId === courseId),
    [items],
  );
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
      syncing,
    }),
    [
      items,
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
      syncing,
    ],
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
