import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'jobseeker' | 'employer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  language?: string;
  city?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  trustScore?: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem('khmerhr_auth_user');
      if (stored) {
        const user = JSON.parse(stored) as User;
        return { user, isAuthenticated: true };
      }
    } catch {
      // ignore parse errors
    }
    return { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem('khmerhr_auth_user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('khmerhr_auth_user');
    }
  }, [authState.user]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    try {
      const storedUsers = localStorage.getItem('khmerhr_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers) as (User & { password: string })[];
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          const { password: _p, ...userWithoutPassword } = found;
          void _p;
          setAuthState({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
      }
      // Demo login: allow any email with demo password
      if (_password === 'demo123') {
        const demoUser: User = {
          id: 'demo_' + Date.now().toString(),
          email,
          fullName: email.split('@')[0] || 'Demo User',
          role: 'jobseeker',
          trustScore: 85,
          language: 'en',
          city: 'Phnom Penh',
          createdAt: new Date().toISOString(),
        };
        setAuthState({ user: demoUser, isAuthenticated: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(
    async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
      try {
        const newUser: User & { password: string } = {
          ...userData,
          id: 'user_' + Date.now().toString(),
          createdAt: new Date().toISOString(),
          password: userData.password,
        };

        const storedUsers = localStorage.getItem('khmerhr_users');
        const users = storedUsers ? (JSON.parse(storedUsers) as (User & { password: string })[]) : [];

        if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
          return false;
        }

        users.push(newUser);
        localStorage.setItem('khmerhr_users', JSON.stringify(users));

        const { password: _p, ...userWithoutPassword } = newUser;
        void _p;
        setAuthState({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('khmerhr_auth_user');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      return { ...prev, user: updated };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
