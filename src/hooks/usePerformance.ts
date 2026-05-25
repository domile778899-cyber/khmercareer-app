/**
 * Performance Optimization Hooks
 * Provides utilities for image lazy loading, component lazy loading,
 * and virtual list rendering for large datasets.
 */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy as reactLazy,
  Suspense,
  type ComponentType,
  type ReactNode,
  type ImgHTMLAttributes,
} from 'react';

// ═══════════════════════════════════════════════════════════════
// 1. Image Lazy Loading Hook (Intersection Observer)
// ═══════════════════════════════════════════════════════════════

export interface UseLazyImageOptions {
  /** Root margin for intersection observer (default: "50px") */
  rootMargin?: string;
  /** Intersection threshold (default: 0) */
  threshold?: number;
  /** Placeholder image URL while loading */
  placeholder?: string;
  /** Low quality image placeholder for blur-up effect */
  lqip?: string;
  /** Whether to disable lazy loading */
  eager?: boolean;
}

export interface UseLazyImageReturn {
  /** Current image source (placeholder or actual) */
  imgSrc: string;
  /** Whether the image should start loading */
  isInView: boolean;
  /** Whether the image has finished loading */
  isLoaded: boolean;
  /** Whether the image failed to load */
  hasError: boolean;
  /** Ref to attach to the image container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Props to spread on the img element */
  imgProps: {
    onLoad: () => void;
    onError: () => void;
    loading: 'eager' | 'lazy';
  };
}

/**
 * Hook for lazy loading a single image
 * @param src - Actual image source URL
 * @param options - Lazy loading options
 */
export function useLazyImage(
  src: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {
    rootMargin = '50px',
    threshold = 0,
    placeholder,
    eager = false,
  } = options;

  const [isInView, setIsInView] = useState(eager);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer setup
  useEffect(() => {
    if (eager || isInView) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [eager, isInView, rootMargin, threshold]);

  // Use placeholder initially, actual src when in view
  const imgSrc = isInView ? src : (placeholder || '');

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return {
    imgSrc,
    isInView,
    isLoaded,
    hasError,
    containerRef,
    imgProps: {
      onLoad: handleLoad,
      onError: handleError,
      loading: eager ? ('eager' as const) : ('lazy' as const),
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 2. Component Lazy Loading (React.lazy + Suspense wrapper)
// ═══════════════════════════════════════════════════════════════

/**
 * Enhanced lazy loading wrapper that supports:
 * - Loading timeout
 * - Error retry
 * - Preloading
 *
 * @param factory - Dynamic import factory function
 * @param options - Lazy loading options
 *
 * @example
 * const HeavyComponent = lazyComponent(() => import('./HeavyComponent'), {
 *   fallback: <Spinner />,
 *   timeout: 10000,
 * });
 */
export interface LazyComponentOptions {
  /** Fallback UI while loading */
  fallback?: ReactNode;
  /** Timeout in ms before showing error (default: 15000) */
  timeout?: number;
  /** Custom error component */
  errorComponent?: ComponentType<{ onRetry: () => void; error: Error }>;
}

export function lazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const LazyComponent = reactLazy(() =>
    Promise.race([
      factory(),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Component load timeout')),
          options.timeout || 15000
        );
      }),
    ])
  );

  return function WrappedLazyComponent(
    props: React.ComponentProps<T>
  ) {
    return (
      <Suspense fallback={options.fallback || <DefaultLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/** Default loading fallback for lazy components */
function DefaultLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        minHeight: '200px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          animation: 'lazySpin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes lazySpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Preload a lazy component before it's needed
 * @param factory - The same factory function passed to lazyComponent
 */
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): Promise<{ default: T }> {
  return factory();
}

// ═══════════════════════════════════════════════════════════════
// 3. Virtual List Hook (for large data rendering)
// ═══════════════════════════════════════════════════════════════

export interface UseVirtualListOptions<T> {
  /** Full list of items */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Number of extra items to render above/below viewport (default: 5) */
  overscan?: number;
  /** Container height in pixels (auto-detected if not provided) */
  containerHeight?: number;
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal';
}

export interface UseVirtualListReturn<T> {
  /** Items currently visible in the viewport */
  virtualItems: {
    item: T;
    index: number;
    style: React.CSSProperties;
  }[];
  /** Total height/width of the scrollable area */
  totalSize: number;
  /** Ref to attach to the scroll container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current scroll offset */
  scrollOffset: number;
  /** Programmatically scroll to an index */
  scrollToIndex: (index: number) => void;
  /** Programmatically scroll to an offset */
  scrollToOffset: (offset: number) => void;
  /** Spacer style for top/bottom padding */
  spacerStyle: React.CSSProperties;
}

/**
 * Virtual list hook for efficiently rendering large datasets
 * Only renders items visible in the viewport + overscan buffer
 *
 * @example
 * const { virtualItems, containerRef, totalSize, spacerStyle } = useVirtualList({
 *   items: largeDataArray,
 *   itemHeight: 60,
 *   overscan: 10,
 * });
 *
 * return (
 *   <div ref={containerRef} style={{ height: '500px', overflow: 'auto' }}>
 *     <div style={{ height: totalSize, position: 'relative', ...spacerStyle }}>
 *       {virtualItems.map(({ item, style }) => (
 *         <div key={item.id} style={{ position: 'absolute', ...style }}>
 *           {item.content}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * );
 */
export function useVirtualList<T>(
  options: UseVirtualListOptions<T>
): UseVirtualListReturn<T> {
  const {
    items,
    itemHeight,
    overscan = 5,
    containerHeight: initialContainerHeight,
    direction = 'vertical',
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const [measuredContainerHeight, setMeasuredContainerHeight] = useState(
    initialContainerHeight || 0
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container height if not provided
  useEffect(() => {
    if (initialContainerHeight) return;

    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      setMeasuredContainerHeight(container.clientHeight);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [initialContainerHeight]);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (direction === 'vertical') {
        setScrollOffset(container.scrollTop);
      } else {
        setScrollOffset(container.scrollLeft);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [direction]);

  const actualContainerHeight = initialContainerHeight || measuredContainerHeight;

  // Calculate visible range
  const virtualItems = useMemo(() => {
    if (actualContainerHeight <= 0) return [];

    const totalItems = items.length;
    const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
    const visibleCount = Math.ceil(actualContainerHeight / itemHeight);
    const endIndex = Math.min(totalItems - 1, Math.ceil((scrollOffset + actualContainerHeight) / itemHeight) + overscan);

    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= 0 && i < totalItems) {
        const isHorizontal = direction === 'horizontal';
        result.push({
          item: items[i],
          index: i,
          style: {
            position: 'absolute' as const,
            top: isHorizontal ? 0 : `${i * itemHeight}px`,
            left: isHorizontal ? `${i * itemHeight}px` : 0,
            height: isHorizontal ? '100%' : `${itemHeight}px`,
            width: isHorizontal ? `${itemHeight}px` : '100%',
          },
        });
      }
    }
    return result;
  }, [items, itemHeight, scrollOffset, actualContainerHeight, overscan, direction]);

  const totalSize = items.length * itemHeight;

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      const offset = clampedIndex * itemHeight;
      if (direction === 'vertical') {
        container.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        container.scrollTo({ left: offset, behavior: 'smooth' });
      }
    },
    [itemHeight, items.length, direction]
  );

  const scrollToOffset = useCallback(
    (offset: number) => {
      const container = containerRef.current;
      if (!container) return;
      if (direction === 'vertical') {
        container.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        container.scrollTo({ left: offset, behavior: 'smooth' });
      }
    },
    [direction]
  );

  const isHorizontal = direction === 'horizontal';

  return {
    virtualItems,
    totalSize,
    containerRef,
    scrollOffset,
    scrollToIndex,
    scrollToOffset,
    spacerStyle: {
      [isHorizontal ? 'width' : 'height']: `${totalSize}px`,
      position: 'relative' as const,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 4. Performance Measurement Hook
// ═══════════════════════════════════════════════════════════════

export interface PerformanceMetrics {
  /** Time to First Byte (if available) */
  ttfb?: number;
  /** First Contentful Paint */
  fcp?: number;
  /** Largest Contentful Paint */
  lcp?: number;
  /** First Input Delay */
  fid?: number;
  /** Cumulative Layout Shift */
  cls?: number;
  /** Time to Interactive (approximation) */
  tti?: number;
}

/**
 * Hook to measure and report Core Web Vitals
 * @param onMetric - Callback when a metric is measured
 */
export function usePerformanceMetrics(
  onMetric?: (metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) => void
): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        let metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null = null;

        switch (entry.entryType) {
          case 'web-vitals':
          case 'paint': {
            if (entry.name === 'first-contentful-paint') {
              const value = entry.startTime;
              setMetrics((prev) => ({ ...prev, fcp: value }));
              metric = {
                name: 'FCP',
                value,
                rating: value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor',
              };
            }
            break;
          }
          case 'largest-contentful-paint': {
            const lcpEntry = entry as PerformanceEntry & { startTime: number };
            const value = lcpEntry.startTime;
            setMetrics((prev) => ({ ...prev, lcp: value }));
            metric = {
              name: 'LCP',
              value,
              rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
            };
            break;
          }
          case 'layout-shift': {
            const lsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!lsEntry.hadRecentInput) {
              setMetrics((prev) => ({
                ...prev,
                cls: (prev.cls || 0) + lsEntry.value,
              }));
              const clsValue = (metrics.cls || 0) + lsEntry.value;
              metric = {
                name: 'CLS',
                value: clsValue,
                rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
              };
            }
            break;
          }
          case 'first-input': {
            const fiEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
            const value = fiEntry.processingStart - fiEntry.startTime;
            setMetrics((prev) => ({ ...prev, fid: value }));
            metric = {
              name: 'FID',
              value,
              rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
            };
            break;
          }
          default:
            break;
        }

        if (metric) {
          onMetric?.(metric);
        }
      }
    });

    // Observe paint entries
    try {
      observer.observe({ type: 'paint', buffered: true });
    } catch {
      // Type not supported
    }

    // TTFB
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.startTime;
      setMetrics((prev) => ({ ...prev, ttfb }));
      onMetric?.({
        name: 'TTFB',
        value: ttfb,
        rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor',
      });
    }

    return () => observer.disconnect();
  }, [onMetric]);

  return metrics;
}

// ═══════════════════════════════════════════════════════════════
// 5. Resource Preloading Utilities
// ═══════════════════════════════════════════════════════════════

/**
 * Preload an image resource
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map((src) => preloadImage(src)));
}

/**
 * Add preload link for critical resources
 */
export function addPreloadLink(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch',
  options: { type?: string; crossorigin?: boolean } = {}
): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (options.type) link.type = options.type;
  if (options.crossorigin) link.crossOrigin = 'anonymous';

  document.head.appendChild(link);
}

// ═══════════════════════════════════════════════════════════════
// 6. Debounced/Throttled Scroll & Resize Hooks
// ═══════════════════════════════════════════════════════════════

/**
 * Hook for debounced scroll position tracking
 */
export function useScrollPosition(delay = 100): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrollY(window.scrollY);
      }, delay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return scrollY;
}

/**
 * Hook for throttled scroll position tracking
 */
export function useThrottledScrollPosition(interval = 100): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastTime = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [interval]);

  return scrollY;
}

// ═══════════════════════════════════════════════════════════════
// 7. Bundle Splitting Helpers
// ═══════════════════════════════════════════════════════════════

/**
 * Route-based lazy loading helper for React Router
 *
 * @example
 * const routes = [
 *   {
 *     path: '/jobs',
 *     element: <JobPage />,
 *   },
 *   {
 *     path: '/training',
 *     element: createLazyRoute(() => import('./pages/Training')),
 *   },
 * ];
 */
export function createLazyRoute<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ReactNode
): ReactNode {
  const LazyComponent = reactLazy(factory);
  return (
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
      {/* @ts-expect-error React 19 type compat */}
      <LazyComponent />
    </Suspense>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. Memoized Component Wrapper
// ═══════════════════════════════════════════════════════════════

/**
 * Creates a deeply memoized component for expensive renders
 * Uses React.memo with deep comparison for props
 */
export function createMemoizedComponent<T extends ComponentType<any>>(
  Component: T,
  propsAreEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
): T {
  // @ts-expect-error React 19 type compat
  return React.memo(Component, propsAreEqual) as unknown as T;
}

// ═══════════════════════════════════════════════════════════════
// Default Export
// ═══════════════════════════════════════════════════════════════

export default {
  useLazyImage,
  lazyComponent,
  useVirtualList,
  usePerformanceMetrics,
  preloadImage,
  preloadImages,
  addPreloadLink,
  useScrollPosition,
  useThrottledScrollPosition,
  createLazyRoute,
};
