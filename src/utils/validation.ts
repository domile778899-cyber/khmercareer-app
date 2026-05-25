// 邮箱验证
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

// 密码强度验证
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2) return 'medium';
  return 'strong';
}

// 手机号验证（柬埔寨）
export function isValidPhoneKH(phone: string): boolean {
  const regex = /^(0[1-9]\d{7,8}|\+855[1-9]\d{7,8})$/;
  return regex.test(phone.replace(/\s/g, ''));
}

// 防止SQL注入基本检查
export function hasSqlInjection(input: string): boolean {
  const sqlPattern = /('|"|;|--|\/\*|\*\/|xp_|union|select|insert|update|delete|drop|create|alter)/i;
  return sqlPattern.test(input);
}
