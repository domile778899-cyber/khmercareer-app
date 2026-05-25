/** Base application error with structured context */
export class AppError extends Error {
  readonly code: string;
  readonly userMessage: string;
  readonly context?: Record<string, unknown>;
  readonly cause?: Error;

  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code;
    this.userMessage = params.userMessage;
    this.context = params.context;
    this.cause = params.cause;
  }
}

/** 5xx server-side API failures */
export class APIError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'APIError';
  }
}

/** Network connectivity failures */
export class NetworkError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'NetworkError';
  }
}

/** Request timeout failures */
export class TimeoutError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'TimeoutError';
  }
}

/** 400 validation failures */
export class ValidationError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'ValidationError';
  }
}

/** 401/403 authentication failures */
export class AuthError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'AuthError';
  }
}

/** 404 business logic failures */
export class BusinessError extends AppError {
  constructor(params: { code: string; message: string; userMessage: string; context?: Record<string, unknown>; cause?: Error }) {
    super(params);
    this.name = 'BusinessError';
  }
}
