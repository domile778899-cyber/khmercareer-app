import { apiClient, clearTokens, storeTokens } from './client';
import type { TokenPair } from './client';
import type { User, UserRole } from '../context/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: Exclude<UserRole, 'admin'>;
}

interface AuthPayload {
  user: User;
  tokens: TokenPair;
}

interface MePayload {
  user: User;
}

/**
 * Authentication API adapter for the KhmerCareer backend.
 */
export const authApi = {
  /**
   * Log in with email and password, then persist issued tokens.
   *
   * Args:
   *   payload: User login credentials.
   *
   * Returns:
   *   Authenticated user profile from the backend.
   */
  async login(payload: LoginRequest): Promise<User> {
    const data = await apiClient.post<AuthPayload, LoginRequest>('auth/login', payload, { authenticated: false });
    storeTokens(data.tokens);
    return data.user;
  },

  /**
   * Register a user account, then persist issued tokens.
   *
   * Args:
   *   payload: New user account data.
   *
   * Returns:
   *   Created user profile from the backend.
   */
  async register(payload: RegisterRequest): Promise<User> {
    const data = await apiClient.post<AuthPayload, RegisterRequest>('auth/register', payload, { authenticated: false });
    storeTokens(data.tokens);
    return data.user;
  },

  /**
   * Fetch the authenticated user profile using the stored access token.
   *
   * Returns:
   *   Current user profile.
   */
  async getMe(): Promise<User> {
    const data = await apiClient.get<MePayload>('auth/me');
    return data.user;
  },

  /**
   * Log out from the backend when possible, then clear local tokens.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<null>('auth/logout');
    } finally {
      clearTokens();
    }
  },
};
