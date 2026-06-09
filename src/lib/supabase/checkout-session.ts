import type { User } from "@supabase/supabase-js";
import type { SupabaseCookieAdapter } from "@/lib/supabase/ssr-server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/utils/logError";
import { normalizePhoneE164 } from "@/lib/phone-otp/phone";

export type EstablishSessionResult =
  | { success: true }
  | { success: false; message: string };

const INTERNAL_AUTH_EMAIL_DOMAIN = "phone.yum.internal";

function internalAuthEmail(userId: string): string {
  return `${userId}@${INTERNAL_AUTH_EMAIL_DOMAIN}`;
}

function isRealUserEmail(email?: string | null): boolean {
  const value = email?.trim();
  if (!value) return false;
  if (value.endsWith("@checkout.internal")) return false;
  if (value.endsWith(`@${INTERNAL_AUTH_EMAIL_DOMAIN}`)) return false;
  return true;
}

/**
 * Phone-only auth users need an email for admin magic-link sessions.
 * Stored on auth.users only — not written to profiles or orders.
 */
async function ensureAuthEmailForSession(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  authUser: User,
): Promise<{ email: string } | { error: string }> {
  if (isRealUserEmail(authUser.email)) {
    return { email: authUser.email!.trim() };
  }

  const email = internalAuthEmail(userId);

  if (authUser.email?.trim() === email) {
    return { email };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { email };
}

async function verifyMagicLinkSession(
  cookies: SupabaseCookieAdapter,
  tokenHash: string,
  verificationType: string,
): Promise<EstablishSessionResult> {
  const supabase = createSupabaseServerClient(cookies);
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: verificationType as "magiclink",
  });

  if (verifyError) {
    return { success: false, message: verifyError.message };
  }

  return { success: true };
}

async function tryMagicLinkSession(
  admin: ReturnType<typeof createAdminClient>,
  cookies: SupabaseCookieAdapter,
  email: string,
  userId: string,
): Promise<EstablishSessionResult> {
  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

  const tokenHash = linkData?.properties?.hashed_token;
  const verificationType =
    linkData?.properties?.verification_type ?? "magiclink";

  if (linkError || !tokenHash) {
    return {
      success: false,
      message: linkError?.message ?? "Could not generate sign-in link.",
    };
  }

  const verified = await verifyMagicLinkSession(
    cookies,
    tokenHash,
    verificationType,
  );

  if (!verified.success) {
    logError(new Error(verified.message), {
      context: "Checkout session verifyOtp",
      meta: { userId, email, verificationType },
    });
  }

  return verified;
}

/**
 * Creates a Supabase session for a user after checkout OTP verification.
 * Sets auth cookies via the provided cookie adapter (e.g. on NextResponse).
 */
export async function establishCheckoutSession(
  cookies: SupabaseCookieAdapter,
  userId: string,
  options?: { checkoutPhone?: string },
): Promise<EstablishSessionResult> {
  const admin = createAdminClient();
  const { data: userResult, error: userError } =
    await admin.auth.admin.getUserById(userId);

  if (userError || !userResult.user) {
    return {
      success: false,
      message: userError?.message ?? "User not found.",
    };
  }

  const authUser = userResult.user;
  const checkoutPhone = options?.checkoutPhone?.trim();

  if (checkoutPhone && authUser.phone?.trim()) {
    const authPhone = normalizePhoneE164(authUser.phone);
    const orderPhone = normalizePhoneE164(checkoutPhone);
    if (authPhone && orderPhone && authPhone !== orderPhone) {
      return {
        success: false,
        message: "Checkout phone does not match the user account.",
      };
    }
  }

  const emailResult = await ensureAuthEmailForSession(admin, userId, authUser);
  if ("error" in emailResult) {
    return { success: false, message: emailResult.error };
  }

  const sessionResult = await tryMagicLinkSession(
    admin,
    cookies,
    emailResult.email,
    userId,
  );

  if (!sessionResult.success) {
    logError(new Error(sessionResult.message), {
      context: "Checkout session",
      meta: {
        userId,
        email: emailResult.email,
        authPhone: authUser.phone ?? null,
        checkoutPhone: checkoutPhone ?? null,
      },
    });
  }

  return sessionResult;
}
