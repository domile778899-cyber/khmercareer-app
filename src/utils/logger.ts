type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LOG_STORAGE_KEY = 'khmercareer_logs';
const MAX_LOGS = 100;

class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = import.meta.env.DEV;
  }

  private save(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    // 开发环境输出到控制台
    if (this.isDev) {
      const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      fn(`[${level.toUpperCase()}] ${message}`, context || '');
    }

    // 生产环境保存到localStorage（用于调试）
    if (level === 'error' || level === 'warn') {
      try {
        const logs = this.getLogs();
        logs.push(entry);
        if (logs.length > MAX_LOGS) logs.shift();
        localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
      } catch {
        // 忽略存储错误
      }
    }
  }

  getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem(LOG_STORAGE_KEY);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDev) this.save('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.save('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.save('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.save('error', message, context);
  }
}

export const logger = new Logger();
