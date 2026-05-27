export interface ApiEnvelope<TData> {
  success: boolean;
  data: TData | null;
  message?: string;
  code?: string;
  details?: unknown;
  meta?: unknown;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  authenticated?: boolean;
}

export interface ApiClientErrorOptions {
  status: number;
  code: string;
  details?: unknown;
  isBusinessError: boolean;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') || 'http://localhost:3001/api/v1';
const ACCESS_TOKEN_STORAGE_KEY = 'khmercareer_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'khmercareer_refresh_token';

/**
 * API client error that separates expected business failures from system failures.
 *
 * Args:
 *   message: Human-readable error message safe to show in UI.
 *   options: Status, code, details, and error category metadata.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly isBusinessError: boolean;

  constructor(message: string, options: ApiClientErrorOptions) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.isBusinessError = options.isBusinessError;
  }
}

/**
 * Read the current access token from browser storage.
 *
 * Returns:
 *   The access token, or null when the user is not authenticated.
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * Read the current refresh token from browser storage.
 *
 * Returns:
 *   The refresh token, or null when no refresh token is available.
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

/**
 * Persist a backend-issued token pair.
 *
 * Args:
 *   tokens: Access and refresh tokens returned by the backend.
 */
export function storeTokens(tokens: TokenPair): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
}

/**
 * Remove all stored authentication tokens.
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

/**
 * Determine whether an unknown JSON payload matches the backend response envelope.
 *
 * Args:
 *   value: Unknown value parsed from a response body.
 *
 * Returns:
 *   True when the value has the expected API envelope shape.
 */
function isApiEnvelope<TData>(value: unknown): value is ApiEnvelope<TData> {
  return typeof value === 'object' && value !== null && 'success' in value && 'data' in value;
}

/**
 * Safely parse a JSON response without leaking raw response details to logs.
 *
 * Args:
 *   response: Fetch response object.
 *
 * Returns:
 *   Parsed JSON payload, or null for empty responses.
 */
async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (error: unknown) {
    throw new ApiClientError('Invalid API response format', {
      status: response.status,
      code: 'INVALID_JSON_RESPONSE',
      details: error instanceof Error ? error.message : String(error),
      isBusinessError: false,
    });
  }
}

/**
 * Build a normalized API path from the configured API base URL.
 *
 * Args:
 *   path: Relative endpoint path, with or without a leading slash.
 *
 * Returns:
 *   Absolute endpoint URL.
 */
function buildUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

/**
 * Execute typed HTTP requests against the KhmerCareer backend.
 */
class ApiClient {
  /**
   * Perform a request and unwrap the backend standard response envelope.
   *
   * Args:
   *   path: Relative endpoint path under the API base URL.
   *   options: HTTP method, JSON body, headers, and auth flag.
   *
   * Returns:
   *   The `data` field from the backend response envelope.
   */
  async request<TResponse, TBody = unknown>(path: string, options: ApiRequestOptions<TBody> = {}): Promise<TResponse> {
    const method = options.method ?? 'GET';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    const hasBody = options.body !== undefined;
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }

    if (options.authenticated !== false) {
      const token = getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    let response: Response;
    try {
      response = await fetch(buildUrl(path), {
        method,
        headers,
        credentials: 'include',
        body: hasBody ? JSON.stringify(options.body) : undefined,
      });
    } catch (error: unknown) {
      throw new ApiClientError('Unable to reach KhmerCareer API', {
        status: 0,
        code: 'NETWORK_ERROR',
        details: error instanceof Error ? error.message : String(error),
        isBusinessError: false,
      });
    }

    const payload = await parseJson(response);
    if (isApiEnvelope<TResponse>(payload)) {
      if (!response.ok || !payload.success) {
        throw new ApiClientError(payload.message || 'API request failed', {
          status: response.status,
          code: payload.code ?? 'API_ERROR',
          details: payload.details,
          isBusinessError: response.status >= 400 && response.status < 500,
        });
      }

      return payload.data as TResponse;
    }

    if (!response.ok) {
      throw new ApiClientError(response.statusText || 'API request failed', {
        status: response.status,
        code: 'HTTP_ERROR',
        details: payload,
        isBusinessError: response.status >= 400 && response.status < 500,
      });
    }

    return payload as TResponse;
  }

  /**
   * Send a GET request.
   */
  async get<TResponse>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  /**
   * Send a POST request.
   */
  async post<TResponse, TBody = unknown>(path: string, body?: TBody, options: Omit<ApiRequestOptions<TBody>, 'method' | 'body'> = {}): Promise<TResponse> {
    return this.request<TResponse, TBody>(path, { ...options, method: 'POST', body });
  }

  /**
   * Send a PUT request.
   */
  async put<TResponse, TBody = unknown>(path: string, body?: TBody, options: Omit<ApiRequestOptions<TBody>, 'method' | 'body'> = {}): Promise<TResponse> {
    return this.request<TResponse, TBody>(path, { ...options, method: 'PUT', body });
  }
}

export const apiClient = new ApiClient();
