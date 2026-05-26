/**
 * KhmerCareer Express — Auth Context
 * Real API authentication with localStorage fallback for offline/demo use.
 */

import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { clearTokens, setTokens } from '../api/client';
import type { User } from '../api/types';

export type UserRole = 'jobseeker' | 'employer' | 'admin' | 'superadmin';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFallbackMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: (googleUser: GoogleUserData) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phone?: string;
  companyName?: string;
  industry?: string;
  avatar?: string;
}

export interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  imageUrl?: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isFallbackMode: false,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  loginWithGoogle: async () => false,
  refreshUser: async () => { },
  updateUserProfile: async () => false,
});

const STORAGE_KEY = 'khmer_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const initRef = useRef(false);

  // ── Initialize: check stored token + fetch user ────────────────────────────
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      setIsLoading(true);

      // Check if we have a stored token
      const accessToken = localStorage.getItem('khmer_access_token');
      const storedUser = localStorage.getItem(STORAGE_KEY);

      if (!accessToken) {
        // No token — clean state
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed?.id && parsed?.email && parsed?.role) {
              setUser(parsed as User);
            }
          } catch { /* ignore */ }
        }
        setIsLoading(false);
        return;
      }

      // We have a token — try to get current user from API
      try {
        const me = await authApi.getMe();
        if (me) {
          setUser(me);
          setIsFallbackMode(authApi.isFallbackMode());
        } else {
          // Token invalid — clear everything
          setUser(null);
          clearTokens();
        }
      } catch {
        // API error — try stored user as fallback
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed?.id && parsed?.email && parsed?.role) {
              setUser(parsed as User);
              setIsFallbackMode(true);
            }
          } catch { /* ignore */ }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── Persist user to localStorage ───────────────────────────────────────────
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // ── Listen for session expiry events ───────────────────────────────────────
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      clearTokens();
      setIsFallbackMode(false);
    };
    window.addEventListener('auth:session_expired' as never, handleSessionExpired);
    return () => window.removeEventListener('auth:session_expired' as never, handleSessionExpired);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      const response = await authApi.login({ email: email.trim(), password });
      if (response.user) {
        setUser(response.user);
        setIsFallbackMode(authApi.isFallbackMode());
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      console.error('[AuthContext] Login error:', message);
      return false;
    }
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    if (!userData.email || !userData.password || !userData.fullName) return false;

    try {
      const response = await authApi.register({
        email: userData.email.trim(),
        password: userData.password,
        fullName: userData.fullName.trim(),
        role: userData.role || 'jobseeker',
        phone: userData.phone,
        companyName: userData.companyName,
        industry: userData.industry,
      });
      if (response.user) {
        setUser(response.user);
        setIsFallbackMode(authApi.isFallbackMode());
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      console.error('[AuthContext] Register error:', message);
      return false;
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setIsFallbackMode(false);
  }, []);

  // ── Google Login ───────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (googleUser: GoogleUserData): Promise<boolean> => {
    if (!googleUser.email || !googleUser.id) return false;

    try {
      const response = await authApi.googleLogin({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        imageUrl: googleUser.imageUrl,
      });
      if (response.user) {
        setUser(response.user);
        setIsFallbackMode(authApi.isFallbackMode());
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);
      return false;
    }
  }, []);

  // ── Refresh User ───────────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      if (me) {
        setUser(me);
        setIsFallbackMode(authApi.isFallbackMode());
      }
    } catch (error) {
      console.error('[AuthContext] Refresh user error:', error);
    }
  }, []);

  // ── Update User Profile ────────────────────────────────────────────────────
  const updateUserProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await authApi.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        skills: data.skills,
        companyName: data.companyName,
        industry: data.industry,
      });
      if (response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthContext] Update profile error:', error);
      // Optimistic update
      if (user) {
        const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
        setUser(updated);
      }
      return true;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        isFallbackMode,
        login,
        register,
        logout,
        loginWithGoogle,
        refreshUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
