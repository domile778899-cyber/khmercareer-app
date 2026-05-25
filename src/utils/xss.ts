// 简单的HTML转义函数，替代dompurify
export function sanitizeHtml(dirty: string): string {
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
}

// 净化纯文本（用于搜索框等）
export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// 净化URL
export function sanitizeUrl(dirty: string): string {
  const clean = dirty.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  return '#';
}
