import { AppError, APIError, NetworkError, TimeoutError, ValidationError, AuthError, BusinessError } from '../errors';

export interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

export interface Interceptor<T> {
  onFulfilled?: (value: T) => T | Promise<T>;
  onRejected?: (error: AppError) => AppError | Promise<AppError>;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;
  private requestInterceptors: Array<Interceptor<RequestInit>> = [];
  private responseInterceptors: Array<Interceptor<Response>> = [];

  constructor(options?: ApiClientOptions) {
    this.baseURL = options?.baseURL ?? '';
    this.timeout = options?.timeout ?? 30000;
    this.retries = options?.retries ?? 3;
    this.defaultHeaders = options?.headers ?? {};
  }

  /** Register a request interceptor */
  addRequestInterceptor(interceptor: Interceptor<RequestInit>): void { this.requestInterceptors.push(interceptor); }
  /** Register a response interceptor */
  addResponseInterceptor(interceptor: Interceptor<Response>): void { this.responseInterceptors.push(interceptor); }
  /** Update auth token */
  setAuthToken(token: string | null): void { this.authToken = token; }
  /** Update base URL */
  setBaseURL(url: string): void { this.baseURL = url; }

  /** Execute GET request */
  get<T>(path: string, options?: RequestOptions): Promise<T> { return this.request<T>('GET', path, undefined, options); }
  /** Execute POST request */
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> { return this.request<T>('POST', path, body, options); }
  /** Execute PUT request */
  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> { return this.request<T>('PUT', path, body, options); }
  /** Execute DELETE request */
  delete<T>(path: string, options?: RequestOptions): Promise<T> { return this.request<T>('DELETE', path, undefined, options); }

  /** Core HTTP request with retry, timeout, auth, signing */
  async request<T>(method: string, path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const maxRetries = options?.retries ?? this.retries;
    const lastAttempt = maxRetries - 1;
    for (let attempt = 0; attempt <= lastAttempt; attempt++) {
      try { return await this.executeRequest<T>(method, path, body, options); }
      catch (err: unknown) {
        const appErr = err instanceof AppError ? err : new NetworkError({ code: 'UNKNOWN_ERROR', message: String(err), userMessage: 'Unknown error', cause: err instanceof Error ? err : undefined });
        const isRetryable = appErr instanceof NetworkError || appErr instanceof TimeoutError || appErr instanceof APIError;
        if (!isRetryable || attempt === lastAttempt) throw appErr;
        await this.delay(2 ** attempt * 1000);
      }
    }
    throw new NetworkError({ code: 'UNREACHABLE', message: 'Retry loop exhausted', userMessage: 'Service unavailable' });
  }

  private async executeRequest<T>(method: string, path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path);
    const signal = this.createAbortSignal(options?.timeout ?? this.timeout);
    const token = options?.skipAuth ? null : (this.authToken ?? this.loadStoredToken());
    const nonce = this.generateNonce();
    const timestamp = Date.now().toString();

    let init: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...options?.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-Request-Nonce': nonce, 'X-Request-Timestamp': timestamp, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      signal,
    };
    if (body !== undefined) init.body = JSON.stringify(body);

    for (const interceptor of this.requestInterceptors) { if (interceptor.onFulfilled) init = await interceptor.onFulfilled(init); }

    let response: Response;
    try { response = await fetch(url, init); }
    catch (err: unknown) {
      if (signal.aborted) throw new TimeoutError({ code: 'REQUEST_TIMEOUT', message: 'Request timed out', userMessage: 'Request timed out, please try again', cause: err instanceof Error ? err : undefined });
      throw new NetworkError({ code: 'NETWORK_ERROR', message: err instanceof Error ? err.message : 'Network error', userMessage: 'Network connection failed', cause: err instanceof Error ? err : undefined });
    }

    for (const interceptor of this.responseInterceptors) { if (interceptor.onFulfilled) response = await interceptor.onFulfilled(response); }

    if (!response.ok) throw this.convertHTTPError(response);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  private buildURL(path: string): string { return path.startsWith('http') ? path : `${this.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`; }

  private createAbortSignal(ms: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }

  private loadStoredToken(): string | null { try { return localStorage.getItem('auth_token'); } catch { return null; } }

  private generateNonce(): string { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }

  private delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

  private async convertHTTPError(response: Response): Promise<AppError> {
    let body: Record<string, unknown> = {};
    try { body = await response.json(); } catch { /* ignore */ }
    const msg = typeof body.message === 'string' ? body.message : response.statusText;
    const ctx = { status: response.status, body };
    if (response.status === 400) return new ValidationError({ code: 'VALIDATION_ERROR', message: msg, userMessage: msg || 'Invalid request', context: ctx });
    if (response.status === 401) return new AuthError({ code: 'UNAUTHORIZED', message: msg, userMessage: 'Please log in again', context: ctx });
    if (response.status === 403) return new AuthError({ code: 'FORBIDDEN', message: msg, userMessage: 'Access denied', context: ctx });
    if (response.status === 404) return new BusinessError({ code: 'NOT_FOUND', message: msg, userMessage: 'Resource not found', context: ctx });
    if (response.status === 408) return new TimeoutError({ code: 'REQUEST_TIMEOUT', message: msg, userMessage: 'Request timed out', context: ctx });
    return new APIError({ code: `HTTP_${response.status}`, message: msg, userMessage: 'Server error, please try later', context: ctx });
  }
}

/** Global API client singleton */
export const apiClient = new ApiClient({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '' });
