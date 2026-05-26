/**
 * KhmerCareer Express — Authentication Hook
 * Provides complete auth state management with user data, loading states,
 * role checking, and auth actions (login, logout, session refresh).
 *
 * This enhanced hook replaces the simple context-only version with
 * a full-featured implementation that includes automatic session
 * management, role-based access control, and loading state tracking.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../api/authApi';
import { clearTokens, getAccessToken } from '../api/client';
import type { User, UserRole, LoginRequest, RegisterRequest } from '../api/types';
import { KhmerCareerAPIError } from '../api/client';

// =============================================================================
// Types
// =============================================================================

export interface AuthState {
  /** Current authenticated user, or null if not logged in */
  user: User | null;
  /** True while checking initial auth state */
  isLoading: boolean;
  /** True if user is authenticated */
  isAuthenticated: boolean;
  /** Login error from the last attempt */
  loginError: KhmerCareerAPIError | Error | null;
  /** True while login is in progress */
  isLoggingIn: boolean;
  /** True while logout is in progress */
  isLoggingOut: boolean;
  /** True while registration is in progress */
  isRegistering: boolean;
}

export interface AuthActions {
  /** Log in with email and password */
  login: (credentials: LoginRequest) => Promise<boolean>;
  /** Log in with Google OAuth data */
  googleLogin: (googleData: { id: string; email: string; name: string; imageUrl?: string | null }) => Promise<boolean>;
  /** Register a new account */
  register: (data: RegisterRequest) => Promise<boolean>;
  /** Log out the current user */
  logout: () => Promise<void>;
  /** Refresh the current user data from the API */
  refreshUser: () => Promise<void>;
  /** Check if user has one of the specified roles */
  hasRole: (...roles: UserRole[]) => boolean;
  /** Check if user has admin or superadmin role */
  isAdmin: boolean;
  /** Check if user is an employer */
  isEmployer: boolean;
  /** Check if user is a jobseeker */
  isJobseeker: boolean;
  /** Check if user is a superadmin */
  isSuperAdmin: boolean;
}

export type UseAuthReturn = AuthState & AuthActions;

// =============================================================================
// Storage helpers
// =============================================================================

const AUTH_USER_KEY = 'khmer_auth_user';

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
        return parsed as User;
      }
    }
  } catch {
    // Invalid stored data
  }
  return null;
}

function storeUser(user: User): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // Silent fail in private mode
  }
}

function removeStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // Silent
  }
}

// =============================================================================
// useAuth Hook
// =============================================================================

/**
 * Enhanced authentication hook with full session management.
 *
 * Features:
 * - Automatic session restoration on mount
 * - Token-based auth state detection
 * - Role-based access control helpers
 * - Loading states for all auth operations
 * - Session expiration event handling
 * - Automatic user data refresh
 *
 * @example
 * ```tsx
 * const { user, isLoading, isAuthenticated, login, logout, hasRole, isAdmin } = useAuth();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginForm />;
 *
 * return <Dashboard user={user} />;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<KhmerCareerAPIError | Error | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const isMountedRef = useRef(true);
  const sessionCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuthenticated = !!user && !!getAccessToken();

  // ---------------------------------------------------------------------------
  // Derived role checks
  // ---------------------------------------------------------------------------

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isEmployer = user?.role === 'employer';
  const isJobseeker = user?.role === 'jobseeker';
  const isSuperAdmin = user?.role === 'superadmin';

  /**
   * Check if the current user has any of the specified roles.
   * Always returns false if not authenticated.
   */
  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user || !isAuthenticated) return false;
      return roles.includes(user.role);
    },
    [user, isAuthenticated],
  );

  // ---------------------------------------------------------------------------
  // Session initialization
  // ---------------------------------------------------------------------------

  const initializeSession = useCallback(async () => {
    // Check for stored token
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Try to get stored user first for immediate UI render
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Then fetch fresh user data from API
    try {
      const freshUser = await authApi.getMe();
      if (isMountedRef.current) {
        if (freshUser) {
          setUser(freshUser);
          storeUser(freshUser);
        } else {
          // Token exists but user not found — clear everything
          setUser(null);
          removeStoredUser();
          clearTokens();
        }
      }
    } catch {
      // If API fails but we have stored user, keep it (fallback mode)
      if (!storedUser && isMountedRef.current) {
        setUser(null);
        clearTokens();
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await authApi.login(credentials);
      if (isMountedRef.current) {
        if (response.user) {
          setUser(response.user);
          storeUser(response.user);
          setLoginError(null);
          return true;
        }
      }
      return false;
    } catch (err) {
      if (isMountedRef.current) {
        const normalizedError =
          err instanceof KhmerCareerAPIError
            ? err
            : err instanceof Error
              ? err
              : new Error(String(err));
        setLoginError(normalizedError);
      }
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoggingIn(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Google Login
  // ---------------------------------------------------------------------------

  const googleLogin = useCallback(
    async (googleData: { id: string; email: string; name: string; imageUrl?: string | null }): Promise<boolean> => {
      setIsLoggingIn(true);
      setLoginError(null);

      try {
        const response = await authApi.googleLogin(googleData);
        if (isMountedRef.current) {
          if (response.user) {
            setUser(response.user);
            storeUser(response.user);
            setLoginError(null);
            return true;
          }
        }
        return false;
      } catch (err) {
        if (isMountedRef.current) {
          const normalizedError =
            err instanceof KhmerCareerAPIError
              ? err
              : err instanceof Error
                ? err
                : new Error(String(err));
          setLoginError(normalizedError);
        }
        return false;
      } finally {
        if (isMountedRef.current) {
          setIsLoggingIn(false);
        }
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    setIsRegistering(true);
    setLoginError(null);

    try {
      const response = await authApi.register(data);
      if (isMountedRef.current) {
        if (response.user) {
          setUser(response.user);
          storeUser(response.user);
          setLoginError(null);
          return true;
        }
      }
      return false;
    } catch (err) {
      if (isMountedRef.current) {
        const normalizedError =
          err instanceof KhmerCareerAPIError
            ? err
            : err instanceof Error
              ? err
              : new Error(String(err));
        setLoginError(normalizedError);
      }
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsRegistering(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  const logout = useCallback(async (): Promise<void> => {
    setIsLoggingOut(true);

    try {
      authApi.logout();
    } catch {
      // Silent — logout should always succeed locally
    } finally {
      if (isMountedRef.current) {
        setUser(null);
        removeStoredUser();
        clearTokens();
        setLoginError(null);
        setIsLoggingOut(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Refresh User
  // ---------------------------------------------------------------------------

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!getAccessToken()) return;

    try {
      const freshUser = await authApi.getMe();
      if (isMountedRef.current) {
        if (freshUser) {
          setUser(freshUser);
          storeUser(freshUser);
        }
      }
    } catch (err) {
      // If we get a 401, the session is expired
      if (err instanceof KhmerCareerAPIError && err.status === 401) {
        if (isMountedRef.current) {
          setUser(null);
          removeStoredUser();
          clearTokens();
        }
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Session expiration listener
  // ---------------------------------------------------------------------------

  useEffect(() => {
    isMountedRef.current = true;

    // Listen for session expiration events from the API client
    const handleSessionExpired = () => {
      setUser(null);
      removeStoredUser();
      clearTokens();
      setLoginError(new KhmerCareerAPIError({
        message: 'Your session has expired. Please log in again.',
        code: 'SESSION_EXPIRED',
        status: 401,
      }));
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);

    // Initialize session on mount
    initializeSession();

    // Periodic session check every 5 minutes
    sessionCheckIntervalRef.current = setInterval(() => {
      const token = getAccessToken();
      if (token && user) {
        // Token exists and user is set — verify it's still valid
        refreshUser();
      }
    }, 5 * 60 * 1000);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('auth:session_expired', handleSessionExpired);
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [initializeSession, refreshUser, user]);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    loginError,
    isLoggingIn,
    isLoggingOut,
    isRegistering,

    // Actions
    login,
    googleLogin,
    register,
    logout,
    refreshUser,
    hasRole,
    isAdmin,
    isEmployer,
    isJobseeker,
    isSuperAdmin,
  };
}

export default useAuth;
