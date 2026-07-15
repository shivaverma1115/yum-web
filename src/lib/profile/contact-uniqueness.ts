import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeEmail } from "@/lib/email-otp/email";
import { isValidPhoneNumber } from "@/lib/phone-otp/phone";
import {
  findProfileIdByEmail,
  findUserIdByPhone,
} from "@/lib/supabase/contact-lookup";

export type ContactConflictResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      errors: Record<string, string>;
      status: 409;
    };

export async function assertContactAvailable(
  admin: SupabaseClient,
  input: { email?: string | null; phone?: string | null },
  excludeUserId?: string,
): Promise<ContactConflictResult> {
  const errors: Record<string, string> = {};
  const email = normalizeEmail(input.email);
  const phone = input.phone?.trim() ?? "";

  if (email) {
    const owner = await findProfileIdByEmail(admin, email);
    if (owner && owner !== excludeUserId) {
      errors.email = "This email is already registered to another account.";
    }
  }

  if (phone && isValidPhoneNumber(phone)) {
    const owner = await findUserIdByPhone(admin, phone);
    if (owner && owner !== excludeUserId) {
      errors.phone =
        "This phone number is already registered to another account.";
    }
  }

  if (!Object.keys(errors).length) {
    return { ok: true };
  }

  const message =
    errors.email && errors.phone
      ? "Email and phone are already in use."
      : (errors.email ?? errors.phone!);

  return { ok: false, message, errors, status: 409 };
}
