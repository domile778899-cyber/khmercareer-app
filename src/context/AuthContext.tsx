import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { clearTokens, getAccessToken } from '../api/client';

export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  subscriptionTier?: string | null;
  subscriptionExpiry?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isInitializing: false,
  login: async () => false,
  register: async () => false,
  logout: async () => { },
});

const STORAGE_KEY = 'khmer_auth_user';
const DEMO_AUTH_ENABLED = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

/**
 * Generate a local-only user ID for explicit demo mode.
 *
 * Returns:
 *   A unique demo user identifier.
 */
function generateDemoId(): string {
  return 'demo_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Validate an unknown value as a persisted user snapshot.
 *
 * Args:
 *   value: Unknown value parsed from localStorage.
 *
 * Returns:
 *   True when the value can be used as a non-sensitive user cache.
 */
function isStoredUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value &&
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.role === 'string'
  );
}

/**
 * Load the cached user profile only when a real token or explicit demo mode exists.
 *
 * Returns:
 *   Cached user profile, or null when no trusted session indicator exists.
 */
function loadCachedUser(): User | null {
  if (!getAccessToken() && !DEMO_AUTH_ENABLED) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);
    return isStoredUser(parsed) ? parsed : null;
  } catch (error: unknown) {
    localStorage.removeItem(STORAGE_KEY);
    console.warn('Failed to parse cached auth user', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

/**
 * Persist a non-sensitive user snapshot for fast UI hydration.
 *
 * Args:
 *   value: User profile to cache, or null to remove the cache.
 */
function persistUser(value: User | null): void {
  if (value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Write a structured browser-side audit event without tokens or passwords.
 *
 * Args:
 *   action: Auth lifecycle action name.
 *   actorId: Authenticated user identifier when available.
 *   role: User role when available.
 */
function logAuthEvent(action: string, actorId?: string, role?: UserRole): void {
  console.info('khmercareer.auth', {
    who: actorId ?? 'anonymous',
    when: new Date().toISOString(),
    what: action,
    role: role ?? 'unknown',
  });
}

/**
 * Create a local user profile for explicit demo mode only.
 *
 * Args:
 *   email: Demo user email.
 *   role: Demo user role.
 *   fullName: Optional display name.
 *
 * Returns:
 *   Local-only demo user profile.
 */
function createDemoUser(email: string, role: UserRole = 'jobseeker', fullName?: string): User {
  return {
    id: generateDemoId(),
    email: email.trim(),
    fullName: fullName || email.split('@')[0] || 'Demo User',
    role,
    avatar: undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCachedUser());
  const [isInitializing, setIsInitializing] = useState<boolean>(() => Boolean(getAccessToken()));

  useEffect(() => {
    persistUser(user);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    /**
     * Hydrate the authenticated user from the backend when a token is present.
     */
    async function hydrateUser(): Promise<void> {
      if (!getAccessToken()) {
        setIsInitializing(false);
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        if (isMounted) {
          setUser(currentUser);
          logAuthEvent('session_hydrated', currentUser.id, currentUser.role);
        }
      } catch (error: unknown) {
        clearTokens();
        if (isMounted) {
          setUser(null);
        }
        console.warn('Failed to hydrate auth session', { error: error instanceof Error ? error.message : String(error) });
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void hydrateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      const authenticatedUser = await authApi.login({ email: email.trim(), password });
      setUser(authenticatedUser);
      logAuthEvent('login_success', authenticatedUser.id, authenticatedUser.role);
      return true;
    } catch (error: unknown) {
      if (DEMO_AUTH_ENABLED && password === 'demo123') {
        const demoUser = createDemoUser(email, email.trim().startsWith('admin@') ? 'admin' : 'jobseeker');
        setUser(demoUser);
        logAuthEvent('demo_login_success', demoUser.id, demoUser.role);
        return true;
      }

      console.warn('Login failed', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }, []);

  const register = useCallback(async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    if (!userData.email || !userData.password || !userData.fullName) return false;
    if (userData.role === 'admin') return false;

    try {
      const registeredUser = await authApi.register({
        email: userData.email.trim(),
        password: userData.password,
        fullName: userData.fullName.trim(),
        role: userData.role || 'jobseeker',
      });
      setUser(registeredUser);
      logAuthEvent('register_success', registeredUser.id, registeredUser.role);
      return true;
    } catch (error: unknown) {
      if (DEMO_AUTH_ENABLED) {
        const demoUser = createDemoUser(userData.email, userData.role || 'jobseeker', userData.fullName);
        setUser(demoUser);
        logAuthEvent('demo_register_success', demoUser.id, demoUser.role);
        return true;
      }

      console.warn('Registration failed', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const actorId = user?.id;
    const role = user?.role;
    setUser(null);
    try {
      await authApi.logout();
    } finally {
      clearTokens();
      localStorage.removeItem(STORAGE_KEY);
      logAuthEvent('logout', actorId, role);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
