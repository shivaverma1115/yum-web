import type { IUser } from "@/types/user";
import { DEFAULT_USER_IMAGE } from "@/lib/constants";

export function getUserDisplayName(user: IUser | null): string {
  const combined = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (combined) return combined;
  return user?.email?.trim() ?? "";
}

export function getUserAvatarUrl(user: IUser | null | undefined): string {
  const url = user?.avatar_url?.trim();
  return url || DEFAULT_USER_IMAGE;
}
