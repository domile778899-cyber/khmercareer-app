/**
 * KhmerCareer Express — Loading Components
 *
 * A comprehensive set of loading UI components including:
 * - Inline loading spinner (various sizes)
 * - Full-page loading overlay
 * - Skeleton screens for cards, lists, tables, forms, profiles
 * - Section loading states
 * - Loading button wrapper
 */

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// =============================================================================
// Inline Loading Spinner
// =============================================================================

export interface LoadingSpinnerProps {
  /** Spinner size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional text label below the spinner */
  label?: string;
  /** Custom class names */
  className?: string;
  /** Center the spinner in its container */
  centered?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-16 h-16',
};

const labelSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

/**
 * Inline loading spinner with optional label.
 * Use inside buttons, cards, or small containers.
 */
export function LoadingSpinner({ size = 'md', label, className, centered = false }: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center gap-2', centered && 'justify-center', className)}>
      <Loader2 className={cn('animate-spin text-gold', sizeMap[size])} />
      {label && (
        <span className={cn('text-warm-gray animate-pulse', labelSizeMap[size])}>
          {label}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[80px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// =============================================================================
// Full-Page Loading Overlay
// =============================================================================

export interface FullPageLoaderProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Whether the overlay is visible */
  isOpen?: boolean;
  /** Overlay background opacity */
  opacity?: 'light' | 'medium' | 'dark';
  /** Custom class names */
  className?: string;
}

const opacityMap = {
  light: 'bg-warm-white/70',
  medium: 'bg-warm-white/85',
  dark: 'bg-charcoal/50',
};

/**
 * Full-page loading overlay that blocks interaction.
 * Use during route transitions or critical data loading.
 */
export function FullPageLoader({
  message = 'Loading...',
  isOpen = true,
  opacity = 'medium',
  className,
}: FullPageLoaderProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm',
        opacityMap[opacity],
        className,
      )}
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
          <Loader2 className="relative w-12 h-12 animate-spin text-gold" />
        </div>
        {message && (
          <p className="text-body text-warm-gray animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Section Loader
// =============================================================================

export interface SectionLoaderProps {
  /** Height of the loading placeholder area */
  height?: string;
  /** Optional message */
  message?: string;
  /** Custom class names */
  className?: string;
}

/**
 * Loading placeholder for a content section.
 * Use inside pages where only a portion is loading.
 */
export function SectionLoader({ height = '200px', message, className }: SectionLoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl border border-sand bg-warm-white/50',
        className,
      )}
      style={{ height }}
    >
      <LoadingSpinner size="lg" label={message} />
    </div>
  );
}

// =============================================================================
// Skeleton Screens (reusing and extending existing Skeleton components)
// =============================================================================

export { Skeleton, SkeletonText, SkeletonCard, SkeletonList, SkeletonStats, SkeletonJobCard, SkeletonCourseCard, SkeletonTable, SkeletonProfile } from './Skeleton';

// =============================================================================
// Dashboard Skeleton
// =============================================================================

export interface DashboardSkeletonProps {
  className?: string;
}

/**
 * Complete dashboard skeleton with stats, charts, and table sections.
 */
export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <SkeletonStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <SkeletonTable rows={5} />
      </div>
    </div>
  );
}

// =============================================================================
// Form Skeleton
// =============================================================================

export interface FormSkeletonProps {
  /** Number of form fields to show */
  fields?: number;
  className?: string;
}

/**
 * Skeleton for a form with labeled inputs.
 */
export function FormSkeleton({ fields = 6, className }: FormSkeletonProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="pt-2 flex gap-3">
        <Skeleton className="h-11 w-32 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// =============================================================================
// Job List Skeleton
// =============================================================================

export interface JobListSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton for a list of job cards.
 */
export function JobListSkeleton({ count = 5, className }: JobListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonJobCard key={i} />
      ))}
    </div>
  );
}

// =============================================================================
// Course List Skeleton
// =============================================================================

export interface CourseListSkeletonProps {
  count?: number;
  className?: string;
  columns?: number;
}

/**
 * Skeleton for a grid of course cards.
 */
export function CourseListSkeleton({ count = 6, className, columns = 3 }: CourseListSkeletonProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCourseCard key={i} />
      ))}
    </div>
  );
}

// =============================================================================
// Detail Page Skeleton
// =============================================================================

export interface DetailPageSkeletonProps {
  className?: string;
}

/**
 * Skeleton for a detail page (job detail, course detail, etc.).
 */
export function DetailPageSkeleton({ className }: DetailPageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <SkeletonText lines={5} />
      </div>
      <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-12 w-40 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

// =============================================================================
// Search Results Skeleton
// =============================================================================

export interface SearchResultsSkeletonProps {
  className?: string;
}

/**
 * Skeleton for search results page with filters sidebar.
 */
export function SearchResultsSkeleton({ className }: SearchResultsSkeletonProps) {
  return (
    <div className={cn('flex gap-6', className)}>
      <div className="hidden lg:block w-64 shrink-0 space-y-5">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
        <div className="border-t border-sand pt-4 space-y-3">
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonJobCard key={i} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Payment Form Skeleton
// =============================================================================

export interface PaymentSkeletonProps {
  className?: string;
}

/**
 * Skeleton for payment page with order summary and payment method selection.
 */
export function PaymentSkeleton({ className }: PaymentSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-sand">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <FormSkeleton fields={4} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-sand bg-warm-white p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <div className="border-t border-sand pt-3 flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

// =============================================================================
// Loading Button
// =============================================================================

export interface LoadingButtonProps {
  /** Whether the button is in loading state */
  isLoading: boolean;
  /** Button content (shown when not loading) */
  children: React.ReactNode;
  /** Loading text */
  loadingText?: string;
  /** Button variant styling */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Custom class names */
  className?: string;
  /** Icon to show before text */
  icon?: React.ReactNode;
}

/**
 * Button wrapper that shows a spinner during loading state.
 */
export function LoadingButton({
  isLoading,
  children,
  loadingText = 'Loading...',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  icon,
}: LoadingButtonProps) {
  const variantClasses = {
    primary: 'bg-gold text-white hover:bg-gold-dark',
    secondary: 'bg-charcoal text-white hover:bg-charcoal/90',
    outline: 'border-2 border-gold text-gold hover:bg-gold/5',
    ghost: 'text-warm-gray hover:bg-sand/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

// =============================================================================
// Content Loader Wrapper
// =============================================================================

export interface ContentLoaderProps<T> {
  /** Whether content is loading */
  isLoading: boolean;
  /** Error from data fetch */
  error: Error | null;
  /** Data to render */
  data: T | undefined;
  /** Render function for the loaded content */
  children: (data: T) => React.ReactNode;
  /** Custom loading skeleton */
  skeleton?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Empty state when data is null/empty */
  emptyState?: React.ReactNode;
}

/**
 * Generic content loader wrapper that handles loading, error, and empty states.
 */
export function ContentLoader<T>({
  isLoading,
  error,
  data,
  children,
  skeleton,
  errorComponent,
  emptyState,
}: ContentLoaderProps<T>) {
  if (isLoading) {
    return skeleton || <SectionLoader message="Loading content..." />;
  }

  if (error) {
    return (
      errorComponent || (
        <div className="flex items-center justify-center rounded-2xl border border-coral/20 bg-coral/5 p-8">
          <div className="text-center">
            <p className="text-coral font-medium mb-1">Failed to load content</p>
            <p className="text-warm-gray text-sm">{error.message}</p>
          </div>
        </div>
      )
    );
  }

  if (data === undefined || data === null || (Array.isArray(data) && data.length === 0)) {
    return (
      emptyState || (
        <div className="flex items-center justify-center rounded-2xl border border-sand bg-warm-white/50 p-8">
          <p className="text-warm-gray text-sm">No content available</p>
        </div>
      )
    );
  }

  return <>{children(data)}</>;
}

export default {
  LoadingSpinner,
  FullPageLoader,
  SectionLoader,
  DashboardSkeleton,
  FormSkeleton,
  JobListSkeleton,
  CourseListSkeleton,
  DetailPageSkeleton,
  SearchResultsSkeleton,
  PaymentSkeleton,
  LoadingButton,
  ContentLoader,
};
