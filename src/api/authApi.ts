/**
 * KhmerCareer Express — Auth API
 * Handles register, login, logout, profile, avatar upload, and token refresh.
 * Falls back to localStorage when the API is unreachable.
 */

import { apiClient, get, post, put, clearTokens, setTokens } from './client';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadAvatarResponse,
  RefreshTokenResponse,
  ApiResponse,
} from './types';
export type { User } from './types';

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = 'khmer_auth_user';
const STORAGE_USERS_KEY = 'khmer_registered_users';
const AUTH_FALLBACK_KEY = 'khmer_auth_fallback_enabled';

interface RegisteredUser extends User {
  password: string;
}

// =============================================================================
// Fallback helpers (localStorage mode)
// =============================================================================

function getRegisteredUsers(): RegisteredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_USERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as RegisteredUser[];
    }
  } catch { /* ignore */ }
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

function generateId(): string {
  return 'u_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function generateMockToken(): string {
  return 'mock_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function saveUserToStorage(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
        return parsed as User;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// =============================================================================
// Fallback mode detection
// =============================================================================

function isFallbackEnabled(): boolean {
  try {
    return localStorage.getItem(AUTH_FALLBACK_KEY) === 'true';
  } catch {
    return false;
  }
}

function setFallbackEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(AUTH_FALLBACK_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_FALLBACK_KEY);
    }
  } catch { /* ignore */ }
}

// =============================================================================
// Auth API
// =============================================================================

export const authApi = {
  // ── Register ────────────────────────────────────────────────────────────────
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await post<RegisterResponse>('/auth/register', data);
      if (response.accessToken && response.refreshToken) {
        setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
        saveUserToStorage(response.user);
        setFallbackEnabled(false);
      }
      return response;
    } catch (error) {
      // Fallback to localStorage if API fails
      const existingUsers = getRegisteredUsers();
      if (existingUsers.some((u) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      const newUser: RegisteredUser = {
        id: generateId(),
        email: data.email.trim(),
        fullName: data.fullName || data.email.split('@')[0] || 'New User',
        role: data.role || 'jobseeker',
        phone: data.phone,
        companyName: data.companyName,
        industry: data.industry,
        avatar: undefined,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: data.password,
      };

      saveRegisteredUser(newUser);

      const accessToken = generateMockToken();
      const refreshToken = generateMockToken();
      setTokens({ accessToken, refreshToken });

      const { password: _, ...userWithoutPassword } = newUser;
      saveUserToStorage(userWithoutPassword as User);
      setFallbackEnabled(true);

      return {
        user: userWithoutPassword as User,
        accessToken,
        refreshToken,
      };
    }
  },

  // ── Login ───────────────────────────────────────────────────────────────────
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await post<LoginResponse>('/auth/login', data);
      if (response.accessToken && response.refreshToken) {
        setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
        saveUserToStorage(response.user);
        setFallbackEnabled(false);
      }
      return response;
    } catch (error) {
      // Fallback to localStorage
      const trimmedEmail = data.email.trim();
      const users = getRegisteredUsers();
      const foundUser = users.find(
        (u) => u.email === trimmedEmail && u.password === data.password,
      );

      if (foundUser) {
        const accessToken = generateMockToken();
        const refreshToken = generateMockToken();
        setTokens({ accessToken, refreshToken });

        const { password: _, ...userWithoutPassword } = foundUser;
        saveUserToStorage(userWithoutPassword as User);
        setFallbackEnabled(true);

        return {
          user: userWithoutPassword as User,
          accessToken,
          refreshToken,
        };
      }

      throw new Error('Invalid email or password');
    }
  },

  // ── Logout ──────────────────────────────────────────────────────────────────
  logout(): void {
    // Always call API logout (best-effort, don't wait)
    try {
      post('/auth/logout').catch(() => { /* silent */ });
    } catch {
      // silent
    }
    clearTokens();
    setFallbackEnabled(false);
  },

  // ── Get Me ──────────────────────────────────────────────────────────────────
  async getMe(): Promise<User | null> {
    // If fallback mode is active, use localStorage user
    if (isFallbackEnabled()) {
      return getUserFromStorage();
    }

    // Check if we have a token
    const token = localStorage.getItem('khmer_access_token');
    if (!token) {
      return null;
    }

    try {
      const user = await get<User>('/auth/me');
      if (user) {
        saveUserToStorage(user);
        setFallbackEnabled(false);
      }
      return user;
    } catch (error) {
      // If 401, try fallback
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setFallbackEnabled(true);
        return storedUser;
      }
      return null;
    }
  },

  // ── Update Profile ──────────────────────────────────────────────────────────
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await put<UpdateProfileResponse>('/me', data);
      if (response.user) {
        saveUserToStorage(response.user);
      }
      return response;
    } catch (error) {
      // Fallback: update localStorage user
      const stored = getUserFromStorage();
      if (stored) {
        const updated = { ...stored, ...data, updatedAt: new Date().toISOString() };
        saveUserToStorage(updated);
        return { user: updated };
      }
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  },

  // ── Upload Avatar ───────────────────────────────────────────────────────────
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await apiClient.post<ApiResponse<UploadAvatarResponse>>(
        '/me/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const data = response.data;
      const result = (data && typeof data === 'object' && 'data' in data)
        ? (data as unknown as ApiResponse<UploadAvatarResponse>).data
        : data as unknown as UploadAvatarResponse;

      // Update stored user avatar
      const stored = getUserFromStorage();
      if (stored && result && (result as UploadAvatarResponse).avatarUrl) {
        const updated = {
          ...stored,
          avatar: (result as UploadAvatarResponse).avatarUrl,
          updatedAt: new Date().toISOString(),
        };
        saveUserToStorage(updated);
      }
      return result;
    } catch (error) {
      // Fallback: create object URL for local preview
      const objectUrl = URL.createObjectURL(file);
      const stored = getUserFromStorage();
      if (stored) {
        const updated = {
          ...stored,
          avatar: objectUrl,
          updatedAt: new Date().toISOString(),
        };
        saveUserToStorage(updated);
      }
      return { avatarUrl: objectUrl };
    }
  },

  // ── Refresh Token ───────────────────────────────────────────────────────────
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('khmer_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // If using mock tokens, just generate new ones
    if (isFallbackEnabled() || refreshToken.startsWith('mock_')) {
      const newAccessToken = generateMockToken();
      const newRefreshToken = generateMockToken();
      setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    const response = await post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    if (response.accessToken && response.refreshToken) {
      setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
    }
    return response;
  },

  // ── Google Login ────────────────────────────────────────────────────────────
  async googleLogin(googleData: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string | null;
  }): Promise<LoginResponse> {
    try {
      const response = await post<LoginResponse>('/auth/google', {
        googleId: googleData.id,
        email: googleData.email,
        fullName: googleData.name,
        avatar: googleData.imageUrl,
      });
      if (response.accessToken && response.refreshToken) {
        setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
        saveUserToStorage(response.user);
        setFallbackEnabled(false);
      }
      return response;
    } catch (error) {
      // Fallback: create local user from Google data
      const mockToken = generateMockToken();
      const mockRefresh = generateMockToken();
      const user: User = {
        id: googleData.id,
        email: googleData.email,
        fullName: googleData.name || googleData.email.split('@')[0] || 'Google User',
        role: 'jobseeker',
        avatar: googleData.imageUrl || undefined,
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTokens({ accessToken: mockToken, refreshToken: mockRefresh });
      saveUserToStorage(user);
      setFallbackEnabled(true);
      return { user, accessToken: mockToken, refreshToken: mockRefresh };
    }
  },

  // ── Change Password ─────────────────────────────────────────────────────────
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await post('/auth/change-password', data);
  },

  // ── Request Password Reset ──────────────────────────────────────────────────
  async forgotPassword(email: string): Promise<void> {
    await post('/auth/forgot-password', { email });
  },

  // ── Utility: check if we're in fallback mode ────────────────────────────────
  isFallbackMode(): boolean {
    return isFallbackEnabled();
  },
};

export default authApi;
