/**
 * LazyImage Component
 * Provides image lazy loading using Intersection Observer API
 * with skeleton loading placeholder and error fallback.
 */
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ImgHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Aspect ratio to prevent layout shift (e.g., "16/9", "4/3", "1") */
  aspectRatio?: string;
  /** Skeleton placeholder color (default: #e5e7eb) */
  skeletonColor?: string;
  /** Custom skeleton/loading element */
  skeletonElement?: ReactNode;
  /** Custom error/fallback element */
  fallbackElement?: ReactNode;
  /** Root margin for intersection observer (default: "50px") */
  rootMargin?: string;
  /** Threshold for intersection observer (default: 0) */
  threshold?: number;
  /** Enable blur-up placeholder effect (default: true) */
  blurPlaceholder?: boolean;
  /** Low quality image placeholder URL for blur-up effect */
  placeholderSrc?: string;
  /** Object fit style (default: "cover") */
  objectFit?: CSSProperties['objectFit'];
  /** Object position style (default: "center") */
  objectPosition?: CSSProperties['objectPosition'];
  /** Duration of the fade-in transition in ms (default: 300) */
  transitionDuration?: number;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Container className */
  containerClassName?: string;
  /** Container style */
  containerStyle?: CSSProperties;
  /** Whether to disable lazy loading (load immediately) */
  eager?: boolean;
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export function LazyImage({
  src,
  alt,
  aspectRatio,
  skeletonColor = '#e5e7eb',
  skeletonElement,
  fallbackElement,
  rootMargin = '50px',
  threshold = 0,
  blurPlaceholder = true,
  placeholderSrc,
  objectFit = 'cover',
  objectPosition = 'center',
  transitionDuration = 300,
  onLoad,
  onError,
  containerClassName = '',
  containerStyle,
  eager = false,
  className = '',
  style,
  width,
  height,
  ...imgProps
}: LazyImageProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isInView, setIsInView] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // When in view, start loading
  useEffect(() => {
    if (isInView && loadingState === 'idle') {
      setLoadingState('loading');
    }
  }, [isInView, loadingState]);

  // Handle successful load
  const handleLoad = useCallback(() => {
    setLoadingState('loaded');
    onLoad?.();
  }, [onLoad]);

  // Handle load error
  const handleError = useCallback(() => {
    setLoadingState('error');
    onError?.();
  }, [onError]);

  // Retry loading
  const handleRetry = useCallback(() => {
    setLoadingState('loading');
    // Force re-render by updating img key or reloading
    if (imgRef.current) {
      const currentSrc = imgRef.current.src;
      imgRef.current.src = '';
      requestAnimationFrame(() => {
        if (imgRef.current) {
          imgRef.current.src = currentSrc;
        }
      });
    }
  }, []);

  const isLoaded = loadingState === 'loaded';
  const hasError = loadingState === 'error';
  const isLoading = loadingState === 'loading' || loadingState === 'idle';

  // Container styles for aspect ratio and positioning
  const containerBaseStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: skeletonColor,
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...containerStyle,
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
    display: 'block',
    opacity: isLoaded ? 1 : 0,
    transition: `opacity ${transitionDuration}ms ease-in-out`,
    filter: isLoaded ? 'none' : 'blur(8px)',
    ...style,
  };

  // Placeholder image for blur-up effect
  const placeholderStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
    filter: 'blur(8px)',
    transform: 'scale(1.05)',
    opacity: isLoaded ? 0 : 1,
    transition: `opacity ${transitionDuration}ms ease-in-out`,
    pointerEvents: 'none',
  };

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={containerBaseStyle}
      role="img"
      aria-label={alt}
    >
      {/* Skeleton loader */}
      {isLoading &&
        (skeletonElement || (
          <div
            className="lazy-image-skeleton"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: skeletonColor,
              animation: 'lazyImagePulse 1.5s ease-in-out infinite',
            }}
          />
        ))}

      {/* Blur-up placeholder */}
      {blurPlaceholder && placeholderSrc && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
        />
      )}

      {/* Main image - only load when in view */}
      {(isInView || eager) && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={className}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...imgProps}
        />
      )}

      {/* Error fallback */}
      {hasError &&
        (fallbackElement || (
          <DefaultFallback
            alt={alt}
            onRetry={handleRetry}
            objectFit={objectFit}
            objectPosition={objectPosition}
          />
        ))}

      {/* CSS animation for skeleton */}
      <style>{`
        @keyframes lazyImagePulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ------------------------------------------------------------------
// Default Error Fallback
// ------------------------------------------------------------------

interface DefaultFallbackProps {
  alt: string;
  onRetry: () => void;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
}

function DefaultFallback({
  alt,
  onRetry,
  objectFit = 'cover',
  objectPosition = 'center',
}: DefaultFallbackProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        gap: '8px',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span
        style={{
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
          padding: '0 12px',
          wordBreak: 'break-word',
        }}
      >
        {alt}
      </span>
      <button
        onClick={onRetry}
        style={{
          marginTop: '4px',
          padding: '6px 16px',
          fontSize: '13px',
          color: '#374151',
          backgroundColor: '#e5e7eb',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#e5e7eb';
        }}
        type="button"
      >
        Retry
      </button>
    </div>
  );
}

// ------------------------------------------------------------------
// LazyImageGallery - Grid gallery with lazy loading for multiple images
// ------------------------------------------------------------------

export interface LazyImageGalleryProps {
  images: {
    src: string;
    alt: string;
    aspectRatio?: string;
  }[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function LazyImageGallery({
  images,
  columns = 3,
  gap = 8,
  className = '',
}: LazyImageGalleryProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((img, index) => (
        <LazyImage
          key={`${img.src}-${index}`}
          src={img.src}
          alt={img.alt}
          aspectRatio={img.aspectRatio || '1'}
        />
      ))}
    </div>
  );
}

export default LazyImage;
