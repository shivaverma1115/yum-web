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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const profile =
      (await getProfileByUserId(supabase, session.user.id)) ??
      (await getProfileByUserIdAdmin(admin, session.user.id));

    if (!profile) {
      const ensured = await ensureProfileForUserId(admin, session.user.id);
      if (!ensured.ok) {
        return {
          success: false,
          message: ensured.message,
          status: 400,
        };
      }

      const createdProfile =
        (await getProfileByUserId(supabase, session.user.id)) ??
        (await getProfileByUserIdAdmin(admin, session.user.id));

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
        isAnonymous: isAnonymousUser(session.user),
        created: false,
      };
    }

    return {
      success: true,
      user: profile,
      isAnonymous: isAnonymousUser(session.user),
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
