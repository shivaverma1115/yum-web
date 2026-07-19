import type { SupabaseClient } from "@supabase/supabase-js";
import { isAnonymousUser } from "@/lib/auth/anonymous-user";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  ensureProfileForUserId,
  getProfileByUserId,
  getProfileByUserIdAdmin,
} from "@/lib/supabase/account/profile";
import type { IUser } from "@/types/user";

export type AnonymousSessionResult =
  | {
      success: true;
      user: IUser;
      isAnonymous: boolean;
      created: boolean;
    }
  | {
      success: false;
      message: string;
      status: number;
    };

function mapAnonymousAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("anonymous")) {
    return "Guest checkout is not enabled. Contact support or sign in to place an order.";
  }

  return message;
}

export async function ensureAnonymousSessionWithSupabase(
  supabase: SupabaseClient,
  admin: SupabaseClient,
): Promise<AnonymousSessionResult> {
  // Prefer getUser() over getSession() — cookie storage is not trusted for identity.
  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  if (existingUser) {
    const profile =
      (await getProfileByUserId(supabase, existingUser.id)) ??
      (await getProfileByUserIdAdmin(admin, existingUser.id));

    if (!profile) {
      const ensured = await ensureProfileForUserId(admin, existingUser.id);
      if (!ensured.ok) {
        return {
          success: false,
          message: ensured.message,
          status: 400,
        };
      }

      const createdProfile =
        (await getProfileByUserId(supabase, existingUser.id)) ??
        (await getProfileByUserIdAdmin(admin, existingUser.id));

      if (!createdProfile) {
        return {
          success: false,
          message: ERROR_MESSAGE_GENERIC,
          status: 500,
        };
      }

      return {
        success: true,
        user: createdProfile,
        isAnonymous: isAnonymousUser(existingUser),
        created: false,
      };
    }

    return {
      success: true,
      user: profile,
      isAnonymous: isAnonymousUser(existingUser),
      created: false,
    };
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error || !data.user) {
    return {
      success: false,
      message: mapAnonymousAuthError(
        error?.message ?? "Could not start checkout. Please try again.",
      ),
      status: error?.status ?? 400,
    };
  }

  const ensured = await ensureProfileForUserId(admin, data.user.id);
  if (!ensured.ok) {
    return {
      success: false,
      message: ensured.message,
      status: 400,
    };
  }

  const profile =
    (await getProfileByUserId(supabase, data.user.id)) ??
    (await getProfileByUserIdAdmin(admin, data.user.id));

  if (!profile) {
    return {
      success: false,
      message: "Guest session started but profile could not be loaded.",
      status: 500,
    };
  }

  return {
    success: true,
    user: profile,
    isAnonymous: true,
    created: true,
  };
}
