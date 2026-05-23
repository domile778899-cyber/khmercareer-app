import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (userData: Partial<User> & { password: string }) => boolean;
  logout: () => void;
  loginWithGoogle: (googleUser: { id: string; email: string; name: string; imageUrl?: string | null }) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  register: () => false,
  logout: () => { },
  loginWithGoogle: () => false,
});

const STORAGE_KEY = 'khmer_auth_user';

function generateId(): string {
  return 'u_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
          return parsed as User;
        }
      }
    } catch {
      // ignore parse errors
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((email: string, password: string): boolean => {
    if (!email || !password) return false;
    if (password === 'demo123') {
      const isAdmin = email.trim().startsWith('admin@');
      const mockUser: User = {
        id: generateId(),
        email: email.trim(),
        fullName: isAdmin ? 'Admin User' : (email.split('@')[0] || 'Demo User'),
        role: isAdmin ? 'admin' : 'jobseeker',
        avatar: undefined,
      };
      setUser(mockUser);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((userData: Partial<User> & { password: string }): boolean => {
    if (!userData.email || !userData.password) return false;
    const newUser: User = {
      id: generateId(),
      email: userData.email.trim(),
      fullName: userData.fullName || userData.email.split('@')[0] || 'New User',
      role: userData.role || 'jobseeker',
      avatar: userData.avatar,
    };
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loginWithGoogle = useCallback(
    (googleUser: { id: string; email: string; name: string; imageUrl?: string | null }): boolean => {
      if (!googleUser.email || !googleUser.id) return false;
      const newUser: User = {
        id: googleUser.id,
        email: googleUser.email,
        fullName: googleUser.name || googleUser.email.split('@')[0] || 'Google User',
        role: 'jobseeker',
        avatar: googleUser.imageUrl || undefined,
      };
      setUser(newUser);
      return true;
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
