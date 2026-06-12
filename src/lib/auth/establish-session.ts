import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isRealUserEmail,
  INTERNAL_EMAIL_DOMAINS,
} from "@/lib/auth/verification";

const INTERNAL_AUTH_EMAIL_DOMAIN = INTERNAL_EMAIL_DOMAINS[0];

function internalAuthEmail(userId: string): string {
  return `${userId}@${INTERNAL_AUTH_EMAIL_DOMAIN}`;
}

export type EstablishSessionResult =
  | { success: true }
  | { success: false; message: string };

async function clearPlaceholderAuthEmail(
  admin: SupabaseClient,
  userId: string,
): Promise<void> {
  await admin.auth.admin.updateUserById(userId, {
    email: undefined,
  });
}

/**
 * Creates a browser session for an existing auth user.
 * Phone-only users may get a temporary internal auth email for magic-link
 * bootstrap only; it is cleared immediately and never stored on profiles.
 */
export async function establishAuthSessionForUser(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  userId: string,
): Promise<EstablishSessionResult> {
  const { data: userResult, error: userError } =
    await admin.auth.admin.getUserById(userId);

  if (userError || !userResult.user) {
    return {
      success: false,
      message: userError?.message ?? "User not found.",
    };
  }

  const authUser = userResult.user;
  const hasPhone = Boolean(authUser.phone?.trim());
  const realEmail = isRealUserEmail(authUser.email)
    ? authUser.email!.trim()
    : null;

  let linkEmail = realEmail;
  let usedPlaceholderEmail = false;

  if (!linkEmail) {
    if (!hasPhone) {
      return {
        success: false,
        message: "This account has no email or phone for sign-in.",
      };
    }

    linkEmail = internalAuthEmail(userId);
    usedPlaceholderEmail = true;

    if (authUser.email?.trim() !== linkEmail) {
      const { error: updateError } = await admin.auth.admin.updateUserById(
        userId,
        {
          email: linkEmail,
          email_confirm: true,
        },
      );

      if (updateError) {
        return { success: false, message: updateError.message };
      }
    }
  }

  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: linkEmail,
    });

  const tokenHash = linkData?.properties?.hashed_token;

  if (linkError || !tokenHash) {
    return {
      success: false,
      message: linkError?.message ?? "Could not generate sign-in link.",
    };
  }

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "magiclink",
  });

  if (verifyError) {
    return { success: false, message: verifyError.message };
  }

  if (usedPlaceholderEmail) {
    await clearPlaceholderAuthEmail(admin, userId);
  }

  return { success: true };
}
