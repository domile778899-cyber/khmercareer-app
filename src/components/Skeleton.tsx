import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/* ── Base pulse block ────────────────────────────────────────── */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-sand',
        className
      )}
    />
  );
}

/* ── Text line skeleton ──────────────────────────────────────── */
export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/* ── Generic card skeleton (jobs / listings) ────────────────── */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-sand p-5 animate-pulse", className)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cream" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-cream rounded w-3/4" />
          <div className="h-4 bg-cream rounded w-1/2" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-cream rounded-full w-20" />
            <div className="h-6 bg-cream rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton list (repeating cards) ────────────────────────── */
export function SkeletonList({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── Stats grid skeleton ────────────────────────────────────── */
export function SkeletonStats({ className }: SkeletonProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-sand p-6 animate-pulse">
          <div className="h-8 bg-cream rounded w-16 mb-2" />
          <div className="h-4 bg-cream rounded w-24" />
        </div>
      ))}
    </div>
  );
}

/* ── Detailed job card skeleton ─────────────────────────────── */
export function SkeletonJobCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-sand bg-warm-white p-4 md:p-5 space-y-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Course card skeleton ───────────────────────────────────── */
export function SkeletonCourseCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-sand bg-warm-white overflow-hidden space-y-3', className)}>
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/* ── Table skeleton ─────────────────────────────────────────── */
export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-4 pb-3 border-b border-sand">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-4', i === 0 ? 'w-12' : i === 3 ? 'w-24' : 'w-32')} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className={cn('h-3', j === 0 ? 'w-8' : j === 3 ? 'w-20' : 'w-32')} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Profile page skeleton ──────────────────────────────────── */
export function SkeletonProfile({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 text-center md:text-left">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-sand bg-warm-white p-4 space-y-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-sand bg-warm-white p-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        <SkeletonText lines={4} />
      </div>
    </div>
  );
}
