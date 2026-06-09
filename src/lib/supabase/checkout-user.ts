import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import {
  getNationalMobileDigits,
  getPhoneDigits,
  isValidPhoneNumber,
  normalizePhoneE164,
  phonesMatch,
} from "@/lib/phone-otp/phone";
import { CheckoutPayload } from "@/components/storefront/Checkout";

export type ResolveCheckoutUserResult =
  | { success: true; userId: string }
  | { success: false; message: string; status: number };

function profilePhone(payload: CheckoutPayload): string {
  const phone = payload.phone?.trim();
  if (!phone || phone === "-") return "";
  return normalizePhoneE164(phone);
}

function phoneLookupValues(phone: string): string[] {
  const e164 = normalizePhoneE164(phone);
  const digits = getPhoneDigits(phone);
  return [...new Set([e164, digits, digits ? `+${digits}` : ""].filter(Boolean))];
}

async function findProfileIdByPhone(
  admin: SupabaseClient,
  phone: string,
): Promise<string | null> {
  if (!isValidPhoneNumber(phone)) return null;

  for (const candidate of phoneLookupValues(phone)) {
    const { data, error } = await admin
      .from("profiles")
      .select("id, phone")
      .eq("phone", candidate)
      .maybeSingle();

    if (!error && data) {
      return data.id as string;
    }
  }

  const national = getNationalMobileDigits(phone);
  if (national.length !== 10) return null;

  const { data: rows, error } = await admin
    .from("profiles")
    .select("id, phone")
    .not("phone", "eq", "")
    .not("phone", "eq", "-");

  if (error || !rows?.length) return null;

  const match = rows.find((row) => phonesMatch(row.phone, phone));
  return match?.id ?? null;
}

async function findProfileIdByEmail(
  admin: SupabaseClient,
  email: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) return null;
  return data.id as string;
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
    if (
      phone &&
      (error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("registered") ||
        error.message.toLowerCase().includes("exists"))
    ) {
      const existingId = await findProfileIdByPhone(admin, phone);
      if (existingId) {
        return { userId: existingId };
      }
    }

    if (
      email &&
      (error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("registered"))
    ) {
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

/**
 * Returns an existing session user or finds/creates a customer from checkout data.
 */
export async function resolveCheckoutUserId(
  admin: SupabaseClient,
  payload: CheckoutPayload,
  sessionUserId?: string | null,
): Promise<ResolveCheckoutUserResult> {
  if (sessionUserId) {
    return { success: true, userId: sessionUserId };
  }

  const phone = profilePhone(payload);
  if (phone && isValidPhoneNumber(phone)) {
    const byPhone = await findProfileIdByPhone(admin, phone);
    if (byPhone) {
      return { success: true, userId: byPhone };
    }
  }

  const email = payload.email?.trim();
  if (email) {
    const byEmail = await findProfileIdByEmail(admin, email);
    if (byEmail) {
      return { success: true, userId: byEmail };
    }
  }

  const created = await createAuthUserForCheckout(admin, payload);
  if ("error" in created) {
    return { success: false, message: created.error, status: 400 };
  }

  return { success: true, userId: created.userId };
}
