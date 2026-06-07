import type { IUser } from "@/types/user";

export function getUserDisplayName(
  user: Pick<IUser, "first_name" | "last_name" | "user_name">,
): string {
  const combined = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (combined) return combined;
  return user.user_name?.trim() || "Customer";
}
