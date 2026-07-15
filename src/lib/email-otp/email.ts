export function normalizeEmail(email?: string | null): string {
  return email?.trim().toLowerCase() ?? "";
}

export function emailsMatch(
  a?: string | null,
  b?: string | null,
): boolean {
  const left = normalizeEmail(a);
  const right = normalizeEmail(b);
  if (!left || !right) return false;
  return left === right;
}

export function isValidEmail(email?: string | null): boolean {
  const value = normalizeEmail(email);
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
