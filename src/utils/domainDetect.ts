/**
 * Domain Detection Utility
 * 用于识别当前访问的域名并控制访问权限
 */

export type DomainType = 'admin' | 'main' | 'unknown';

/**
 * 获取当前访问的域名类型
 */
export function getDomainType(): DomainType {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const hostname = window.location.hostname.toLowerCase();

  // 管理后台域名
  if (hostname.includes('aiuhotl.com') || hostname === 'localhost:5173') {
    return 'admin';
  }

  // 主网域名
  if (hostname.includes('aiuhotv.com') || hostname === 'localhost:5174') {
    return 'main';
  }

  // IP 地址访问时，根据环境变量判断
  if (hostname === '115.29.213.212' || hostname === '127.0.0.1') {
    const env = import.meta.env.VITE_DOMAIN_TYPE || 'main';
    return env as DomainType;
  }

  return 'unknown';
}

/**
 * 检查是否为管理后台域名
 */
export function isAdminDomain(): boolean {
  return getDomainType() === 'admin';
}

/**
 * 检查是否为主网域名
 */
export function isMainDomain(): boolean {
  return getDomainType() === 'main';
}

/**
 * 获取当前域名的完整 URL
 */
export function getCurrentDomainUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * 重定向到对应的域名
 */
export function redirectToDomain(targetDomain: DomainType, path: string = '/'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const hostname = window.location.hostname;
  let targetHostname = hostname;

  if (targetDomain === 'admin') {
    targetHostname = hostname.replace('aiuhotv.com', 'aiuhotl.com');
  } else if (targetDomain === 'main') {
    targetHostname = hostname.replace('aiuhotl.com', 'aiuhotv.com');
  }

  const targetUrl = `${window.location.protocol}//${targetHostname}${path}`;
  window.location.href = targetUrl;
}
