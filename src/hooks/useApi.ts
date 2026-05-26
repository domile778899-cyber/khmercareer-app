/**
 * KhmerCareer Express — API React Hooks
 * Generic data fetching, mutation, and infinite scroll hooks
 * with consistent loading, error, and state management.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type DependencyList,
} from 'react';
import { KhmerCareerAPIError } from '../api/client';

// =============================================================================
// Shared Types
// =============================================================================

export interface FetchState<T> {
  /** Fetched data — undefined until first successful fetch */
  data: T | undefined;
  /** True during initial fetch or refetch */
  isLoading: boolean;
  /** True only during initial fetch (not refetch) */
  isInitialLoading: boolean;
  /** Error from the last fetch attempt */
  error: KhmerCareerAPIError | Error | null;
  /** Manually trigger a refetch */
  refetch: () => void;
}

export interface MutationState<T, P = unknown> {
  /** Mutate function — call with payload to execute */
  mutate: (payload: P) => Promise<T | undefined>;
  /** Mutate function with async callback support */
  mutateAsync: (payload: P) => Promise<T>;
  /** Response data from the last successful mutation */
  data: T | undefined;
  /** True while mutation is in flight */
  isLoading: boolean;
  /** Error from the last mutation attempt */
  error: KhmerCareerAPIError | Error | null;
  /** Reset mutation state (data, error, isLoading) */
  reset: () => void;
}

export interface InfiniteScrollState<T> {
  /** Accumulated items from all pages */
  items: T[];
  /** True during initial load */
  isLoading: boolean;
  /** True while fetching next page */
  isFetchingNextPage: boolean;
  /** Error from the last fetch */
  error: KhmerCareerAPIError | Error | null;
  /** True if there are more pages to fetch */
  hasNextPage: boolean;
  /** Fetch the next page */
  fetchNextPage: () => void;
  /** Reset and reload from page 1 */
  reset: () => void;
  /** Current page number */
  page: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =============================================================================
// useFetch — Generic Data Fetching Hook
// =============================================================================

/**
 * Generic data fetching hook with loading/error states.
 *
 * @param apiCall — Async function that returns data of type T
 * @param deps — Dependency list that triggers refetch when changed
 *
 * @example
 * ```tsx
 * const { data: jobs, isLoading, error, refetch } = useFetch(
 *   () => jobsApi.getJobs({ page: 1, limit: 10 }),
 *   [filters]
 * );
 * ```
 */
export function useFetch<T>(
  apiCall: () => Promise<T>,
  deps: DependencyList = [],
): FetchState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<KhmerCareerAPIError | Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      if (!abortController.signal.aborted && isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (!abortController.signal.aborted && isMountedRef.current) {
        const normalizedError =
          err instanceof KhmerCareerAPIError
            ? err
            : err instanceof Error
              ? err
              : new Error(String(err));
        setError(normalizedError);
      }
    } finally {
      if (!abortController.signal.aborted && isMountedRef.current) {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    }
  }, [apiCall]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    isMountedRef.current = true;
    execute();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  return {
    data,
    isLoading,
    isInitialLoading,
    error,
    refetch,
  };
}

// =============================================================================
// useMutation — Generic Mutation Hook
// =============================================================================

/**
 * Mutation hook for POST/PUT/DELETE operations.
 * Manages loading state, error handling, and success data.
 *
 * @param apiCall — Async function that takes a payload and returns data of type T
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error, data, reset } = useMutation(
 *   (payload: CreateJobRequest) => jobsApi.createJob(payload)
 * );
 *
 * // Usage:
 * await mutate({ title: 'Developer', ... });
 * ```
 */
export function useMutation<T, P = unknown>(
  apiCall: (payload: P) => Promise<T>,
): MutationState<T, P> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<KhmerCareerAPIError | Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (payload: P): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall(payload);
        if (isMountedRef.current) {
          setData(result);
          setIsLoading(false);
        }
        return result;
      } catch (err) {
        if (isMountedRef.current) {
          const normalizedError =
            err instanceof KhmerCareerAPIError
              ? err
              : err instanceof Error
                ? err
                : new Error(String(err));
          setError(normalizedError);
          setIsLoading(false);
        }
        return undefined;
      }
    },
    [apiCall],
  );

  const mutateAsync = useCallback(
    async (payload: P): Promise<T> => {
      const result = await mutate(payload);
      if (result === undefined) {
        throw error || new Error('Mutation failed');
      }
      return result;
    },
    [mutate, error],
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    mutateAsync,
    data,
    isLoading,
    error,
    reset,
  };
}

// =============================================================================
// useInfiniteScroll — Infinite Scroll / Pagination Hook
// =============================================================================

/**
 * Infinite scroll hook for paginated API lists.
 * Automatically accumulates items across pages and detects
 * when more pages are available.
 *
 * @param apiCall — Async function that takes pagination params and returns a paginated response
 * @param deps — Additional dependencies that trigger a full reset and reload
 * @param options.limit — Items per page (default: 10)
 * @param options.enabled — Whether to start fetching immediately (default: true)
 * @param options.rootMargin — Intersection observer root margin (default: '200px')
 *
 * @example
 * ```tsx
 * const { items, isLoading, hasNextPage, fetchNextPage } = useInfiniteScroll(
 *   (params) => jobsApi.getJobs({ ...filters, page: params.page, limit: params.limit }),
 *   [filters]
 * );
 * ```
 */
export function useInfiniteScroll<T, R extends { meta?: { page?: number; limit?: number; total?: number; totalPages?: number } } = { meta?: { page?: number; limit?: number; total?: number; totalPages?: number } }>(
  apiCall: (params: PaginationParams) => Promise<R & { items?: T[]; data?: T[] }>,
  deps: DependencyList = [],
  options?: {
    limit?: number;
    enabled?: boolean;
    rootMargin?: string;
    /** Extract items array from the response. Defaults to `response.items || response.data || []` */
    selectItems?: (response: R & { items?: T[]; data?: T[] }) => T[];
  },
): InfiniteScrollState<T> {
  const limit = options?.limit ?? 10;
  const enabled = options?.enabled ?? true;
  const rootMargin = options?.rootMargin ?? '200px';
  const selectItems = options?.selectItems;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<KhmerCareerAPIError | Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const isMountedRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const resetCounterRef = useRef(0);

  const getItems = useCallback(
    (response: R & { items?: T[]; data?: T[] }): T[] => {
      if (selectItems) return selectItems(response);
      return (response.items || response.data || []) as T[];
    },
    [selectItems],
  );

  const fetchPage = useCallback(
    async (pageNum: number, isNextPage: boolean) => {
      if (!isMountedRef.current) return;

      if (isNextPage) {
        setIsFetchingNextPage(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await apiCall({ page: pageNum, limit });
        if (!isMountedRef.current) return;

        const newItems = getItems(response);
        const totalPages = response.meta?.totalPages ?? 1;
        const total = response.meta?.total ?? newItems.length;

        setItems((prev) => (isNextPage ? [...prev, ...newItems] : newItems));
        setPage(pageNum);
        setHasNextPage(pageNum < totalPages && items.length + newItems.length < total);
      } catch (err) {
        if (isMountedRef.current) {
          const normalizedError =
            err instanceof KhmerCareerAPIError
              ? err
              : err instanceof Error
                ? err
                : new Error(String(err));
          setError(normalizedError);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsFetchingNextPage(false);
        }
      }
    },
    [apiCall, limit, getItems, items.length],
  );

  // Reset and load page 1 when deps change
  useEffect(() => {
    isMountedRef.current = true;
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setItems([]);
    setPage(1);
    setHasNextPage(true);
    setError(null);
    resetCounterRef.current += 1;

    fetchPage(1, false);

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const fetchNextPage = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchPage(page + 1, true);
    }
  }, [fetchPage, page, isFetchingNextPage, hasNextPage]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasNextPage(true);
    setError(null);
    setIsLoading(true);
    resetCounterRef.current += 1;
    fetchPage(1, false);
  }, [fetchPage]);

  // Intersection Observer for automatic infinite scroll
  const sentinelCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
          }
        },
        { rootMargin },
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage, rootMargin],
  );

  return {
    items,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    reset,
    page,
    /** Attach this ref to a sentinel div at the bottom of your list for auto-fetch */
    sentinelRef,
    /** Callback to attach to a sentinel element for intersection observer */
    setSentinelRef: sentinelCallback,
  } as InfiniteScrollState<T> & {
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    setSentinelRef: (node: HTMLDivElement | null) => void;
  };
}

// =============================================================================
// useOptimisticUpdate — Optimistic UI Updates
// =============================================================================

/**
 * Hook for optimistic UI updates.
 * Updates local state immediately while the API call runs in the background.
 * Rolls back on error.
 *
 * @example
 * ```tsx
 * const { execute, isLoading, error } = useOptimisticUpdate(
 *   toggleFavoriteApi,
 *   currentState,
 *   (prev, payload) => payload.optimisticValue
 * );
 * ```
 */
export function useOptimisticUpdate<T, P>(
  apiCall: (payload: P) => Promise<T>,
  currentState: T,
  optimisticUpdater: (prev: T, payload: P) => T,
): {
  execute: (payload: P) => Promise<T | undefined>;
  isLoading: boolean;
  error: KhmerCareerAPIError | Error | null;
  optimisticState: T;
} {
  const [optimisticState, setOptimisticState] = useState<T>(currentState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<KhmerCareerAPIError | Error | null>(null);

  // Keep optimistic state in sync when currentState changes externally
  useEffect(() => {
    setOptimisticState(currentState);
  }, [currentState]);

  const execute = useCallback(
    async (payload: P): Promise<T | undefined> => {
      const previousState = optimisticState;

      // Apply optimistic update immediately
      setOptimisticState(optimisticUpdater(previousState, payload));
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall(payload);
        setOptimisticState(result);
        setIsLoading(false);
        return result;
      } catch (err) {
        // Rollback on error
        setOptimisticState(previousState);
        const normalizedError =
          err instanceof KhmerCareerAPIError
            ? err
            : err instanceof Error
              ? err
              : new Error(String(err));
        setError(normalizedError);
        setIsLoading(false);
        return undefined;
      }
    },
    [apiCall, optimisticState, optimisticUpdater],
  );

  return {
    execute,
    isLoading,
    error,
    optimisticState,
  };
}

// =============================================================================
// useApiPolling — Polling for Async Job Status
// =============================================================================

/**
 * Hook for polling an async job status (e.g., video generation).
 * Polls at a configurable interval until the job reaches a terminal state.
 *
 * @param apiCall — Function that returns the current job status
 * @param isComplete — Function that checks if the job is in a terminal state
 * @param options — Polling configuration
 *
 * @example
 * ```tsx
 * const { data: videoStatus, isLoading } = useApiPolling(
 *   () => aiApi.getVideoPromoStatus(videoId),
 *   (status) => status.status === 'completed' || status.status === 'failed',
 *   { interval: 5000, maxAttempts: 60 }
 * );
 * ```
 */
export function useApiPolling<T>(
  apiCall: () => Promise<T>,
  isComplete: (data: T) => boolean,
  options?: {
    interval?: number;
    maxAttempts?: number;
    enabled?: boolean;
    onComplete?: (data: T) => void;
    onError?: (error: Error) => void;
  },
): FetchState<T> {
  const {
    interval = 5000,
    maxAttempts = 60,
    enabled = true,
    onComplete,
    onError,
  } = options || {};

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<KhmerCareerAPIError | Error | null>(null);
  const attemptsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const execute = useCallback(async () => {
    if (!isMountedRef.current || !enabled) return;

    try {
      const result = await apiCall();
      attemptsRef.current += 1;

      if (!isMountedRef.current) return;

      setData(result);
      setError(null);

      if (isComplete(result)) {
        stopPolling();
        setIsLoading(false);
        setIsInitialLoading(false);
        onComplete?.(result);
        return;
      }

      if (attemptsRef.current >= maxAttempts) {
        stopPolling();
        setError(new Error('Polling exceeded maximum attempts'));
        setIsLoading(false);
        setIsInitialLoading(false);
        onError?.(new Error('Polling exceeded maximum attempts'));
        return;
      }

      setIsLoading(false);
      setIsInitialLoading(false);
    } catch (err) {
      if (!isMountedRef.current) return;
      const normalizedError =
        err instanceof KhmerCareerAPIError
          ? err
          : err instanceof Error
            ? err
            : new Error(String(err));
      setError(normalizedError);
      setIsLoading(false);
      setIsInitialLoading(false);
      onError?.(normalizedError);
    }
  }, [apiCall, isComplete, maxAttempts, enabled, onComplete, onError, stopPolling]);

  const refetch = useCallback(() => {
    attemptsRef.current = 0;
    setIsLoading(true);
    execute();
  }, [execute]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setIsLoading(false);
      return stopPolling;
    }

    attemptsRef.current = 0;
    execute();

    intervalRef.current = setInterval(() => {
      execute();
    }, interval);

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled, interval, stopPolling]);

  return {
    data,
    isLoading,
    isInitialLoading,
    error,
    refetch,
  };
}

export default {
  useFetch,
  useMutation,
  useInfiniteScroll,
  useOptimisticUpdate,
  useApiPolling,
};
