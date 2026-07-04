import type { User } from "@supabase/supabase-js";
import { profileEmailFromAuth } from "@/lib/auth/verification";
import { normalizeProfilePhone } from "@/lib/phone-otp/phone";
import { UserRole, type IUser } from "@/types/user";

type AuthMetadata = Record<string, unknown>;

export function namesFromAuthMetadata(
  metadata: AuthMetadata | null | undefined,
): { first_name: string; last_name: string } {
  const meta = metadata ?? {};

  const first = String(meta.first_name ?? meta.firstName ?? "").trim();
  const last = String(meta.last_name ?? meta.lastName ?? "").trim();

  if (first || last) {
    return { first_name: first, last_name: last };
  }

  const full = String(meta.full_name ?? meta.name ?? "").trim();
  if (!full) {
    return { first_name: "", last_name: "" };
  }

  const parts = full.split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" "),
  };
}

export function avatarUrlFromAuthMetadata(
  metadata: AuthMetadata | null | undefined,
): string | null {
  const meta = metadata ?? {};
  const url = String(meta.avatar_url ?? meta.picture ?? "").trim();
  return url || null;
}

export function enrichProfileFromAuthUser(
  profile: IUser,
  authUser: User,
): IUser {
  const names = namesFromAuthMetadata(authUser.user_metadata);
  const avatarUrl = avatarUrlFromAuthMetadata(authUser.user_metadata);
  const authPhone = authUser.phone?.trim()
    ? normalizeProfilePhone(authUser.phone)
    : "";

  return {
    ...profile,
    email: profile.email ?? profileEmailFromAuth(authUser.email),
    phone: profile.phone?.trim() || authPhone,
    first_name: profile.first_name?.trim() || names.first_name,
    last_name: profile.last_name?.trim() || names.last_name,
    avatar_url: avatarUrl,
  };
}

export function profileFromAuthUser(authUser: User): IUser {
  const names = namesFromAuthMetadata(authUser.user_metadata);

  return {
    id: authUser.id,
    email: profileEmailFromAuth(authUser.email),
    first_name: names.first_name,
    last_name: names.last_name,
    phone: authUser.phone?.trim()
      ? normalizeProfilePhone(authUser.phone)
      : "",
    zip_code: "",
    description: "",
    role: UserRole.USER,
    avatar_url: avatarUrlFromAuthMetadata(authUser.user_metadata),
  };
}
