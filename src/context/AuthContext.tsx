import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'jobseeker' | 'employer' | 'admin' | 'superadmin';

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
const STORAGE_USERS_KEY = 'khmer_registered_users';

interface RegisteredUser extends User {
  password: string;
}

function generateId(): string {
  return 'u_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function getRegisteredUsers(): RegisteredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_USERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as RegisteredUser[];
      }
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveRegisteredUser(user: RegisteredUser): void {
  const users = getRegisteredUsers();
  const existingIndex = users.findIndex((u) => u.email === user.email);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
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

    const users = getRegisteredUsers();
    if (users.length === 0) {
      alert('请先注册');
      return false;
    }

    const trimmedEmail = email.trim();
    const foundUser = users.find(
      (u) => u.email === trimmedEmail && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  }, []);

  const register = useCallback((userData: Partial<User> & { password: string }): boolean => {
    if (!userData.email || !userData.password) return false;
    const trimmedEmail = userData.email.trim();

    const existingUsers = getRegisteredUsers();
    if (existingUsers.some((u) => u.email === trimmedEmail)) {
      return false;
    }

    const newUser: RegisteredUser = {
      id: generateId(),
      email: trimmedEmail,
      fullName: userData.fullName || userData.email.split('@')[0] || 'New User',
      role: userData.role || 'jobseeker',
      avatar: userData.avatar,
      password: userData.password,
    };

    saveRegisteredUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
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
