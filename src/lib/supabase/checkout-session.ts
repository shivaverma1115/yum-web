import type { SupabaseCookieAdapter } from "@/lib/supabase/ssr-server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";
import { createAdminClient } from "@/lib/supabase/admin";

export type EstablishSessionResult =
  | { success: true }
  | { success: false; message: string };

/**
 * Creates a Supabase session for a user after checkout OTP verification.
 * Sets auth cookies via the provided cookie adapter (e.g. on NextResponse).
 */
export async function establishCheckoutSession(
  cookies: SupabaseCookieAdapter,
  userId: string,
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
  const phone = authUser.phone?.trim();
  const email = authUser.email?.trim();

  const linkResult = phone
    ? await admin.auth.admin.generateLink({
        type: "sms",
        phone,
      } as never)
    : email
      ? await admin.auth.admin.generateLink({ type: "magiclink", email })
      : null;

  if (!linkResult) {
    return { success: false, message: "User has no phone or email for sign-in." };
  }

  const { data: linkData, error: linkError } = linkResult;
  const tokenHash = linkData?.properties?.hashed_token;

  if (linkError || !tokenHash) {
    return {
      success: false,
      message: linkError?.message ?? "Could not start session.",
    };
  }

  const supabase = createSupabaseServerClient(cookies);
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: phone ? "sms" : "email",
    token_hash: tokenHash,
  });

  if (verifyError) {
    return { success: false, message: verifyError.message };
  }

  return { success: true };
}
