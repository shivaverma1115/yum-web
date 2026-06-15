import type { IUser } from "@/types/user";

export function getUserDisplayName(user: IUser | null): string {
  const combined = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (combined) return combined;
  return user?.email?.trim() ?? "";
}
