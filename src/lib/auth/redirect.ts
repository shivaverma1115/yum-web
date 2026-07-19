import { UserRole, type IUser } from "@/types/user";

export type UserRoleType = IUser["role"];

const AUTH_PATHS = [
  "/login",
  "/register",
  "/recover-password",
  "/reset-password",
] as const;

export function getDefaultPathForRole(role: UserRoleType): string {
  return role === UserRole.ADMIN ? "/admin/dashboard" : "/";
}

export function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

/** Same-origin relative paths only — blocks //host and /\host open redirects. */
export function safeNextPath(
  value: string | null | undefined,
  fallback = "/home",
): string {
  if (!value) return fallback;

  const path = value.trim();
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /\\|%5c|%2f%2f/i.test(path)
  ) {
    return fallback;
  }

  return path;
}

export function getSafeRedirect(
  path: string | null,
  role: UserRoleType,
): string {
  const defaultPath = getDefaultPathForRole(role);
  const safe = safeNextPath(path, "");

  if (!safe) {
    return defaultPath;
  }

  if (AUTH_PATHS.some((p) => safe === p || safe.startsWith(`${p}/`))) {
    return defaultPath;
  }

  if (role === UserRole.USER && isAdminPath(safe)) {
    return "/";
  }

  return safe;
}
