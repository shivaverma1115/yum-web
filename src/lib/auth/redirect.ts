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

export function getSafeRedirect(
  path: string | null,
  role: UserRoleType,
): string {
  const defaultPath = getDefaultPathForRole(role);

  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return defaultPath;
  }

  if (AUTH_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return defaultPath;
  }

  if (role === UserRole.USER && isAdminPath(path)) {
    return "/";
  }

  return path;
}
