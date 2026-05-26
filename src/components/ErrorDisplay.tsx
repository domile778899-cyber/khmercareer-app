/**
 * KhmerCareer Express — Error Display Components
 *
 * Comprehensive error handling UI components including:
 * - Error boundary fallback UI (for React error boundaries)
 * - API error display with retry button
 * - 404 Not Found page content
 * - Empty state with action
 * - Toast/inline error messages
 * - Network error handler
 */

import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  RefreshCw,
  WifiOff,
  FileQuestion,
  Home,
  ArrowLeft,
  ServerCrash,
  Lock,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { KhmerCareerAPIError } from '../api/client';

// =============================================================================
// Shared Types
// =============================================================================

export interface ErrorDisplayProps {
  /** Main error title */
  title?: string;
  /** Error description message */
  message?: string;
  /** Error variant/type affecting styling */
  variant?: 'error' | 'warning' | 'info' | 'network' | 'auth' | 'server';
  /** Custom icon override */
  icon?: LucideIcon;
  /** Retry callback — if provided, shows a retry button */
  onRetry?: () => void;
  /** Go back callback — if provided, shows a back button */
  onBack?: () => void;
  /** Navigate home callback */
  onGoHome?: () => void;
  /** Custom class names */
  className?: string;
  /** Whether to use compact layout (inline) */
  compact?: boolean;
  /** Original error object for debugging */
  error?: Error | KhmerCareerAPIError | unknown;
  /** Show technical error details (for dev mode) */
  showDetails?: boolean;
}

const variantConfig: Record<
  string,
  { icon: LucideIcon; iconBg: string; iconColor: string; borderColor: string; bgColor: string }
> = {
  error: {
    icon: XCircle,
    iconBg: 'bg-coral/10',
    iconColor: 'text-coral',
    borderColor: 'border-coral/20',
    bgColor: 'bg-coral/5',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-gold/10',
    iconColor: 'text-gold',
    borderColor: 'border-gold/20',
    bgColor: 'bg-gold/5',
  },
  info: {
    icon: AlertCircle,
    iconBg: 'bg-ocean/10',
    iconColor: 'text-ocean',
    borderColor: 'border-ocean/20',
    bgColor: 'bg-ocean/5',
  },
  network: {
    icon: WifiOff,
    iconBg: 'bg-gold/10',
    iconColor: 'text-gold',
    borderColor: 'border-gold/20',
    bgColor: 'bg-gold/5',
  },
  auth: {
    icon: Lock,
    iconBg: 'bg-coral/10',
    iconColor: 'text-coral',
    borderColor: 'border-coral/20',
    bgColor: 'bg-coral/5',
  },
  server: {
    icon: ServerCrash,
    iconBg: 'bg-coral/10',
    iconColor: 'text-coral',
    borderColor: 'border-coral/20',
    bgColor: 'bg-coral/5',
  },
};

// =============================================================================
// Generic Error Display
// =============================================================================

/**
 * Flexible error display component with multiple variants.
 * Supports retry, go back, and go home actions.
 */
export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  variant = 'error',
  icon: CustomIcon,
  onRetry,
  onBack,
  onGoHome,
  className,
  compact = false,
  error,
  showDetails = false,
}: ErrorDisplayProps) {
  const config = variantConfig[variant] || variantConfig.error;
  const Icon = CustomIcon || config.icon;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-xl border p-4',
          config.borderColor,
          config.bgColor,
          className,
        )}
        role="alert"
      >
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', config.iconColor)}>{title}</p>
          {message && <p className="text-xs text-warm-gray mt-0.5">{message}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'text-xs font-medium mt-2 underline underline-offset-2 hover:no-underline',
                config.iconColor,
              )}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center rounded-2xl border p-8 max-w-md mx-auto',
        config.borderColor,
        config.bgColor,
        className,
      )}
      role="alert"
    >
      <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mb-4', config.iconBg)}>
        <Icon className={cn('w-8 h-8', config.iconColor)} />
      </div>

      <h3 className="text-h4 font-display text-charcoal mb-2">{title}</h3>
      <p className="text-body text-warm-gray mb-6">{message}</p>

      {error && showDetails && (
        <div className="w-full mb-4 p-3 rounded-lg bg-charcoal/5 text-left overflow-auto max-h-40">
          <code className="text-xs text-charcoal/70 break-all">
            {error instanceof Error ? error.message : String(error)}
            {error instanceof KhmerCareerAPIError && error.code && (
              <span className="block mt-1 text-coral">Code: {error.code}</span>
            )}
          </code>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-sand text-charcoal rounded-xl hover:bg-sand/50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-sand text-charcoal rounded-xl hover:bg-sand/50 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// API Error Display
// =============================================================================

export interface ApiErrorDisplayProps {
  /** The error from an API call */
  error: KhmerCareerAPIError | Error | unknown;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom class names */
  className?: string;
  /** Compact inline mode */
  compact?: boolean;
  /** Show technical details */
  showDetails?: boolean;
}

/**
 * Specialized error display for API errors.
 * Automatically extracts error messages from KhmerCareerAPIError instances.
 */
export function ApiErrorDisplay({
  error,
  onRetry,
  className,
  compact = false,
  showDetails = false,
}: ApiErrorDisplayProps) {
  let title = 'Request Failed';
  let message = 'Something went wrong. Please try again.';
  let variant: ErrorDisplayProps['variant'] = 'error';

  if (error instanceof KhmerCareerAPIError) {
    message = error.message;

    switch (error.status) {
      case 401:
        title = 'Session Expired';
        message = 'Your session has expired. Please log in again.';
        variant = 'auth';
        break;
      case 403:
        title = 'Access Denied';
        message = error.message || "You don't have permission to access this resource.";
        variant = 'auth';
        break;
      case 404:
        title = 'Not Found';
        message = error.message || 'The requested resource was not found.';
        variant = 'warning';
        break;
      case 409:
        title = 'Conflict';
        message = error.message || 'This action conflicts with the current state.';
        variant = 'warning';
        break;
      case 422:
        title = 'Validation Error';
        message = error.message || 'Please check your input and try again.';
        variant = 'warning';
        break;
      case 429:
        title = 'Too Many Requests';
        message = 'Please slow down and try again in a moment.';
        variant = 'warning';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        title = 'Server Error';
        message = 'Our servers are experiencing issues. Please try again later.';
        variant = 'server';
        break;
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          title = 'Network Error';
          message = 'Please check your internet connection and try again.';
          variant = 'network';
        }
    }
  } else if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      title = 'Network Error';
      message = 'Please check your internet connection and try again.';
      variant = 'network';
    } else {
      message = error.message;
    }
  }

  return (
    <ErrorDisplay
      title={title}
      message={message}
      variant={variant}
      onRetry={onRetry}
      className={className}
      compact={compact}
      error={error}
      showDetails={showDetails}
    />
  );
}

// =============================================================================
// Validation Error Display
// =============================================================================

export interface ValidationErrorDisplayProps {
  /** Field-level validation errors from API */
  errors: Record<string, string[]>;
  /** Custom class names */
  className?: string;
}

/**
 * Displays field-level validation errors returned from the API.
 * Typically used under form fields or as a summary at the top.
 */
export function ValidationErrorDisplay({ errors, className }: ValidationErrorDisplayProps) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-xl border border-coral/20 bg-coral/5 p-4 text-left',
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-coral">Please fix the following errors:</p>
      </div>
      <ul className="space-y-1 ml-6">
        {entries.map(([field, messages]) =>
          messages.map((msg, i) => (
            <li key={`${field}-${i}`} className="text-xs text-coral/80">
              <span className="capitalize font-medium">{field}:</span> {msg}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

// =============================================================================
// 404 Not Found Page Content
// =============================================================================

export interface NotFoundProps {
  /** Resource type for contextual message (e.g., "Job", "Course", "Page") */
  resourceType?: string;
  /** Custom message */
  message?: string;
  /** Callback to go back */
  onBack?: () => void;
  /** Callback to go home */
  onGoHome: () => void;
  /** Suggested links to show */
  suggestions?: { label: string; onClick: () => void }[];
  /** Custom class names */
  className?: string;
}

/**
 * Full 404 Not Found page content with helpful suggestions.
 */
export function NotFoundPage({
  resourceType = 'Page',
  message,
  onBack,
  onGoHome,
  suggestions = [],
  className,
}: NotFoundProps) {
  return (
    <div className={cn('min-h-[60vh] flex items-center justify-center px-4', className)}>
      <div className="text-center max-w-lg">
        {/* 404 Visual */}
        <div className="relative mb-6 inline-block">
          <div className="text-9xl font-display font-bold text-sand select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="w-20 h-20 text-gold/60" />
          </div>
        </div>

        <h1 className="text-h3 font-display text-charcoal mb-3">
          {resourceType} Not Found
        </h1>
        <p className="text-body text-warm-gray mb-8">
          {message ||
            `The ${resourceType.toLowerCase()} you are looking for does not exist, has been removed, or the URL has changed.`}
        </p>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-charcoal mb-3">You might want to try:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={s.onClick}
                  className="px-4 py-2 text-sm text-ocean bg-ocean/5 border border-ocean/20 rounded-lg hover:bg-ocean/10 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-sand text-charcoal rounded-xl hover:bg-sand/50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          )}
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Network Error Page
// =============================================================================

export interface NetworkErrorProps {
  /** Retry callback */
  onRetry: () => void;
  /** Custom class names */
  className?: string;
}

/**
 * Full-page network error display.
 * Shown when the user is offline or the API is unreachable.
 */
export function NetworkErrorPage({ onRetry, className }: NetworkErrorProps) {
  return (
    <div className={cn('min-h-[60vh] flex items-center justify-center px-4', className)}>
      <ErrorDisplay
        title="You're Offline"
        message="We can't connect to the internet. Please check your connection and try again. Some features may be available offline."
        variant="network"
        onRetry={onRetry}
        onGoHome={() => window.location.reload()}
      />
    </div>
  );
}

// =============================================================================
// Auth Required / Unauthorized
// =============================================================================

export interface AuthRequiredProps {
  /** Callback to navigate to login */
  onLogin: () => void;
  /** Callback to navigate home */
  onGoHome?: () => void;
  /** Custom message */
  message?: string;
  className?: string;
}

/**
 * Displayed when authentication is required to access a resource.
 */
export function AuthRequired({
  onLogin,
  onGoHome,
  message,
  className,
}: AuthRequiredProps) {
  return (
    <div className={cn('min-h-[50vh] flex items-center justify-center px-4', className)}>
      <ErrorDisplay
        title="Authentication Required"
        message={message || 'Please log in to access this page.'}
        variant="auth"
        icon={Lock}
        onRetry={onLogin}
        onGoHome={onGoHome}
      />
    </div>
  );
}

// =============================================================================
// Error Boundary Fallback Component
// =============================================================================

export interface ErrorBoundaryFallbackProps {
  /** The error that was caught */
  error: Error;
  /** React error info */
  errorInfo?: React.ErrorInfo;
  /** Reset the error boundary */
  onReset?: () => void;
  /** Navigate home */
  onGoHome?: () => void;
  /** Show technical details (dev mode) */
  showDetails?: boolean;
  className?: string;
}

/**
 * Fallback UI component for React Error Boundaries.
 * Displays a user-friendly error message with a reset button.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
 *   <ErrorBoundaryFallback error={error} onReset={resetErrorBoundary} />
 * )}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundaryFallback({
  error,
  errorInfo,
  onReset,
  onGoHome,
  showDetails = process.env.NODE_ENV === 'development',
  className,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className={cn('min-h-[60vh] flex items-center justify-center px-4 bg-warm-white', className)}>
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-coral" />
        </div>

        <h2 className="text-h3 font-display text-charcoal mb-2">
          Something went wrong
        </h2>
        <p className="text-body text-warm-gray mb-6">
          We apologize for the inconvenience. Our team has been notified of this issue.
          Please try refreshing the page or come back later.
        </p>

        {showDetails && (
          <div className="mb-6 text-left rounded-xl border border-coral/20 bg-charcoal/5 p-4 overflow-auto max-h-60">
            <p className="text-xs font-mono text-coral font-medium mb-2">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs font-mono text-charcoal/60 whitespace-pre-wrap leading-relaxed">
                {error.stack}
              </pre>
            )}
            {errorInfo && (
              <pre className="text-xs font-mono text-charcoal/60 whitespace-pre-wrap leading-relaxed mt-2 pt-2 border-t border-sand">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-sand text-charcoal rounded-xl hover:bg-sand/50 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Toast Error (inline dismissal)
// =============================================================================

export interface ToastErrorProps {
  message: string;
  onDismiss?: () => void;
  /** Auto-dismiss after milliseconds (0 = no auto-dismiss) */
  autoDismiss?: number;
  className?: string;
}

/**
 * Inline dismissible error toast for temporary notifications.
 */
export function ToastError({ message, onDismiss, autoDismiss = 5000, className }: ToastErrorProps) {
  useDismissible(autoDismiss, onDismiss);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3',
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="w-4 h-4 text-coral shrink-0" />
      <p className="text-sm text-coral flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-coral/60 hover:text-coral transition-colors"
          aria-label="Dismiss"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Inline Field Error
// =============================================================================

export interface FieldErrorProps {
  message?: string;
  className?: string;
}

/**
 * Small inline error message for form fields.
 */
export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className={cn('text-xs text-coral mt-1 flex items-center gap-1', className)} role="alert">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

// =============================================================================
// Helper Hook
// =============================================================================

/**
 * Helper hook for auto-dismissing components.
 */
function useDismissible(timeout: number, onDismiss?: () => void) {
  useEffect(() => {
    if (timeout > 0 && onDismiss) {
      const timer = setTimeout(onDismiss, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, onDismiss]);
}

// =============================================================================
// Empty State with Action
// =============================================================================

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Empty state display with optional action button.
 */
export function EmptyState({
  title = 'No results found',
  message = 'There are no items to display at the moment.',
  icon: Icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center text-center py-12 px-4', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-sand/50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-warm-gray" />
        </div>
      )}
      <h3 className="text-h5 font-display text-charcoal mb-2">{title}</h3>
      <p className="text-body text-warm-gray mb-6 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default {
  ErrorDisplay,
  ApiErrorDisplay,
  ValidationErrorDisplay,
  NotFoundPage,
  NetworkErrorPage,
  AuthRequired,
  ErrorBoundaryFallback,
  ToastError,
  FieldError,
  EmptyState,
};
