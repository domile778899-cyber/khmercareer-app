/**
 * KhmerCareer Express - Axios HTTP Client
 * Production-grade axios instance with JWT auth, token refresh, and error handling.
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// =============================================================================
// Token Storage Keys
// =============================================================================

export const ACCESS_TOKEN_KEY = 'khmer_access_token';
export const REFRESH_TOKEN_KEY = 'khmer_refresh_token';

// =============================================================================
// Types
// =============================================================================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

// =============================================================================
// Token helpers
// =============================================================================

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setTokens(tokens: TokenPayload): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch {
    // silent fail in private mode
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('khmer_auth_user');
  } catch {
    // silent
  }
}

// =============================================================================
// API Error class
// =============================================================================

export class KhmerCareerAPIError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message || 'An unexpected error occurred');
    this.name = 'KhmerCareerAPIError';
    this.code = error.code;
    this.status = error.status;
    this.errors = error.errors;
  }
}

// =============================================================================
// Axios Instance
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// Request Interceptor — attach JWT access token
// =============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// =============================================================================
// Response Interceptor — handle 401 + token refresh
// =============================================================================

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void): void {
  refreshSubscribers.push(cb);
}

async function doRefreshToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiResponse<TokenPayload>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );

    if (response.data?.success && response.data.data) {
      setTokens(response.data.data);
      return response.data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // If response is wrapped in our standard format, unwrap it
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      // Keep the original response but ensure data is accessible
      return response;
    }
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown> | { message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(
        new KhmerCareerAPIError({ message: 'Network error — no response received' }),
      );
    }

    // Handle 401 Unauthorized — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const newToken = await doRefreshToken();
          isRefreshing = false;

          if (newToken) {
            onTokenRefreshed(newToken);
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            return apiClient(originalRequest);
          } else {
            // Refresh failed — clear tokens and reject
            clearTokens();
            window.dispatchEvent(new CustomEvent('auth:session_expired'));
            return Promise.reject(
              new KhmerCareerAPIError({
                message: 'Session expired. Please log in again.',
                status: 401,
                code: 'SESSION_EXPIRED',
              }),
            );
          }
        } catch (refreshErr) {
          isRefreshing = false;
          clearTokens();
          return Promise.reject(
            new KhmerCareerAPIError({
              message: 'Session expired. Please log in again.',
              status: 401,
              code: 'SESSION_EXPIRED',
            }),
          );
        }
      }

      // Token refresh is already in progress — queue this request
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
          resolve(apiClient(originalRequest));
        });
      });
    }

    // Parse error response into meaningful error
    const apiError = parseApiError(error);
    return Promise.reject(new KhmerCareerAPIError(apiError));
  },
);

// =============================================================================
// Error Parser
// =============================================================================

function parseApiError(error: AxiosError<ApiResponse<unknown> | { message?: string }>): ApiError {
  if (error.response) {
    const data = error.response.data;
    let message = 'An error occurred';
    let code: string | undefined;
    let errors: Record<string, string[]> | undefined;

    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string') {
        message = data.message;
      }
      if ('success' in data && 'message' in data && typeof data.message === 'string') {
        message = data.message;
      }
      if ('code' in data && typeof data.code === 'string') {
        code = data.code;
      }
      if ('errors' in data && typeof data.errors === 'object' && data.errors !== null) {
        errors = data.errors as Record<string, string[]>;
      }
    }

    return {
      message,
      code,
      status: error.response.status,
      errors,
    };
  }

  if (error.request) {
    return {
      message: 'Network error — please check your connection and try again.',
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

// =============================================================================
// HTTP Helpers
// =============================================================================

export async function get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(path, config);
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as unknown as T;
}

export async function post<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(path, body, config);
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as unknown as T;
}

export async function put<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(path, body, config);
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as unknown as T;
}

export async function patch<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(path, body, config);
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as unknown as T;
}

export async function del<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(path, config);
  const data = response.data;
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }
  return data as unknown as T;
}

// =============================================================================
// Legacy compatibility — allow apiService.configure() pattern
// =============================================================================

export function configureClient(baseURL: string): void {
  apiClient.defaults.baseURL = baseURL;
}

export function isLocalMode(): boolean {
  return !apiClient.defaults.baseURL || apiClient.defaults.baseURL === '';
}

export { apiClient };
export default apiClient;
