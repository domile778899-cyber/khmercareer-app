import { logger } from './logger';

export function setupGlobalErrorHandler() {
  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
    });
  });

  // 捕获全局JavaScript错误
  window.addEventListener('error', (event) => {
    logger.error('Global JavaScript Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    });
  });

  // 捕获资源加载失败
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        logger.warn('Resource Load Failed', {
          tag: target.tagName,
          src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src || (target as HTMLLinkElement).href,
        });
      }
    },
    true
  );

  // 网络状态监听
  window.addEventListener('online', () => {
    logger.info('Network: Online');
  });

  window.addEventListener('offline', () => {
    logger.warn('Network: Offline');
  });
}
