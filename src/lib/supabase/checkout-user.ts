import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  findProfileIdByEmail,
  findUserIdByPhone,
} from "@/lib/supabase/contact-lookup";
import {
  isValidPhoneNumber,
  normalizePhoneE164,
} from "@/lib/phone-otp/phone";
import { CheckoutPayload } from "@/components/storefront/Checkout";
import { UserRole } from "@/types/user";

export type ResolveCheckoutUserResult =
  | { success: true; userId: string }
  | { success: false; message: string; status: number };

function profilePhone(payload: CheckoutPayload): string {
  const phone = payload.phone?.trim();
  if (!phone || phone === "-") return "";
  return normalizePhoneE164(phone);
}

/** Ensures a profiles row exists and phone/email are set when missing. */
export async function ensureCheckoutProfile(
  admin: SupabaseClient,
  userId: string,
  payload: Pick<CheckoutPayload, "phone" | "email">,
): Promise<string | null> {
  const checkoutPhone = profilePhone(payload as CheckoutPayload);
  const checkoutEmail = payload.email?.trim() || null;

  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("id, phone, email")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    return readError.message;
  }

  if (!existing) {
    const { data: authData, error: authError } =
      await admin.auth.admin.getUserById(userId);

    if (authError || !authData.user) {
      return authError?.message ?? "User not found.";
    }

    const authUser = authData.user;
    const phone =
      checkoutPhone ||
      (authUser.phone?.trim() ? normalizePhoneE164(authUser.phone) : "") ||
      "-";

    const { error: insertError } = await admin.from("profiles").insert({
      id: userId,
      email: checkoutEmail ?? authUser.email?.trim() ?? null,
      first_name: "Guest",
      last_name: "-",
      phone,
      role: UserRole.USER,
    });

    return insertError?.message ?? null;
  }

  const updates: { phone?: string; email?: string | null } = {};

  if (
    checkoutPhone &&
    (!existing.phone?.trim() || existing.phone.trim() === "-")
  ) {
    updates.phone = checkoutPhone;
  }

  if (checkoutEmail && !existing.email?.trim()) {
    updates.email = checkoutEmail;
  }

  if (!Object.keys(updates).length) {
    return null;
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  return updateError?.message ?? null;
}

function isDuplicateUserError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("already") ||
    lower.includes("registered") ||
    lower.includes("exists")
  );
}

async function createAuthUserForCheckout(
  admin: SupabaseClient,
  payload: CheckoutPayload,
): Promise<{ userId: string } | { error: string }> {
  const phone = profilePhone(payload);
  const email = payload.email?.trim();
  const metadata = {
    first_name: "Guest",
  };

  let createResult;

  if (phone && isValidPhoneNumber(phone)) {
    createResult = await admin.auth.admin.createUser({
      phone,
      phone_confirm: true,
      user_metadata: metadata,
    });
  } else {
    createResult = await admin.auth.admin.createUser({
      email: email ? email : `${randomUUID()}@checkout.internal`,
      email_confirm: false,
      user_metadata: metadata,
    });
  }

  const { data, error } = createResult;

  if (error) {
    if (phone && isDuplicateUserError(error.message)) {
      const existingId = await findUserIdByPhone(admin, phone);
      if (existingId) {
        return { userId: existingId };
      }
    }

    if (email && isDuplicateUserError(error.message)) {
      const existingId = await findProfileIdByEmail(admin, email);
      if (existingId) {
        return { userId: existingId };
      }
    }

    return { error: error.message };
  }

  if (!data.user?.id) {
    return { error: ERROR_MESSAGE_GENERIC };
  }

  return { userId: data.user.id };
}

async function finalizeCheckoutUser(
  admin: SupabaseClient,
  userId: string,
  payload: CheckoutPayload,
): Promise<ResolveCheckoutUserResult> {
  const profileError = await ensureCheckoutProfile(admin, userId, payload);
  if (profileError) {
    return { success: false, message: profileError, status: 400 };
  }

  return { success: true, userId };
}

/**
 * Returns an existing session user or finds/creates a customer from checkout data.
 */
export async function resolveCheckoutUserId(
  admin: SupabaseClient,
  payload: CheckoutPayload,
  sessionUserId?: string | null,
): Promise<ResolveCheckoutUserResult> {
  if (sessionUserId) {
    return finalizeCheckoutUser(admin, sessionUserId, payload);
  }

  const phone = profilePhone(payload);
  if (phone && isValidPhoneNumber(phone)) {
    const byPhone = await findUserIdByPhone(admin, phone);
    if (byPhone) {
      return finalizeCheckoutUser(admin, byPhone, payload);
    }
  }

  const email = payload.email?.trim();
  if (email) {
    const byEmail = await findProfileIdByEmail(admin, email);
    if (byEmail) {
      return finalizeCheckoutUser(admin, byEmail, payload);
    }
  }

  const created = await createAuthUserForCheckout(admin, payload);
  if ("error" in created) {
    return { success: false, message: created.error, status: 400 };
  }

  return finalizeCheckoutUser(admin, created.userId, payload);
}
