import type { IUser } from "@/types/user";

export function getUserDisplayName(
  user: Pick<IUser, "first_name" | "last_name" | "email">,
): string {
  const combined = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (combined) return combined;
  return user.email?.trim() || "Customer";
}
