import type { ReactNode } from 'react';

/**
 * Base Skeleton component with pulse animation.
 * Usage: <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-sand ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}

/**
 * Generic card skeleton with image, title, and lines.
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-sand p-6 space-y-4">
      {/* Image area */}
      <Skeleton className="h-40 w-full rounded-xl" />
      {/* Title */}
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-5/6 rounded" />
        <Skeleton className="h-3.5 w-4/6 rounded" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Text skeleton with multiple lines.
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${widths[i % widths.length]} rounded`}
        />
      ))}
    </div>
  );
}

/**
 * Job card skeleton matching the JobCard design.
 */
export function SkeletonJobCard() {
  return (
    <div className="bg-white rounded-2xl border border-sand p-5 md:p-6 space-y-4">
      {/* Header: Logo + Company */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>

      {/* Footer: Salary + Apply button */}
      <div className="flex items-center justify-between pt-2 border-t border-sand/50">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Stats grid skeleton for dashboard/hero sections.
 */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-sand p-5 md:p-6 text-center space-y-3"
        >
          <Skeleton className="h-10 w-20 mx-auto rounded-lg" />
          <Skeleton className="h-3.5 w-24 mx-auto rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Page section skeleton with heading + cards.
 */
export function SkeletonSection({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-3.5 w-64 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg hidden sm:block" />
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cards }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page loading skeleton combining multiple skeleton types.
 */
export function SkeletonPage(): ReactNode {
  return (
    <div className="space-y-8 py-8">
      {/* Hero skeleton */}
      <div className="bg-deep-brown rounded-2xl p-8 md:p-12 space-y-4">
        <Skeleton className="h-10 w-3/4 md:w-1/2 rounded-lg bg-white/10" />
        <Skeleton className="h-4 w-5/6 md:w-2/3 rounded bg-white/10" />
        <Skeleton className="h-4 w-4/6 md:w-1/2 rounded bg-white/10" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 w-32 rounded-xl bg-white/10" />
          <Skeleton className="h-12 w-28 rounded-xl bg-white/10" />
        </div>
      </div>

      {/* Stats skeleton */}
      <SkeletonStats count={4} />

      {/* Section skeleton */}
      <SkeletonSection cards={3} />
    </div>
  );
}
