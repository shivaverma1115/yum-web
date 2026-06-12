import { emailsMatch, normalizeEmail } from "@/lib/email-otp/email";
import { mapAuthContactDuplicateError } from "@/lib/profile/contact-duplicate-errors";
import {
  getPhoneDigits,
  isValidPhoneNumber,
  normalizePhoneE164,
  phonesMatch,
} from "@/lib/phone-otp/phone";
import type { IUser, UserVerificationStatus } from "@/types/user";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ContactSyncMode = "self" | "admin";

export type ContactSyncContext = {
  mode: ContactSyncMode;
  previousProfile: Pick<IUser, "email" | "phone"> | null;
  nextEmail: string | null;
  nextPhone: string;
  verification?: UserVerificationStatus;
  emailVerifiedOnRequest?: boolean;
  phoneVerifiedOnRequest?: boolean;
  requirePhoneOtpForUpdate?: boolean;
};

export function normalizeProfileContactPatch<
  T extends Partial<Pick<IUser, "email" | "phone">>,
>(patch: T): T {
  const normalized = { ...patch };

  if (patch.email !== undefined) {
    normalized.email = patch.email?.trim()
      ? normalizeEmail(patch.email)
      : (null as T["email"]);
  }

  if (patch.phone !== undefined) {
    normalized.phone = patch.phone?.trim()
      ? normalizePhoneE164(patch.phone)
      : ("" as T["phone"]);
  }

  return normalized;
}

export function buildAuthContactSyncPayload(
  ctx: ContactSyncContext,
): { email?: string; phone?: string } {
  const {
    mode,
    previousProfile,
    verification,
    nextEmail,
    nextPhone,
    emailVerifiedOnRequest = false,
    phoneVerifiedOnRequest = false,
    requirePhoneOtpForUpdate = false,
  } = ctx;

  const sync: { email?: string; phone?: string } = {};
  const savedEmail = previousProfile?.email ?? null;
  const savedPhone = previousProfile?.phone ?? "";

  if (mode === "admin") {
    if (nextEmail && !emailsMatch(nextEmail, savedEmail)) {
      sync.email = nextEmail;
    }
    if (
      nextPhone &&
      isValidPhoneNumber(nextPhone) &&
      !phonesMatch(nextPhone, savedPhone)
    ) {
      sync.phone = normalizePhoneE164(nextPhone);
    }
    return sync;
  }

  if (!verification) {
    return sync;
  }

  if (
    nextEmail &&
    emailVerifiedOnRequest &&
    (!emailsMatch(nextEmail, savedEmail) || !verification.email_verified)
  ) {
    sync.email = nextEmail;
  }

  const phoneOtpOk = phoneVerifiedOnRequest || !requirePhoneOtpForUpdate;
  if (
    nextPhone &&
    phoneOtpOk &&
    isValidPhoneNumber(nextPhone) &&
    (!phonesMatch(nextPhone, savedPhone) || !verification.phone_verified)
  ) {
    sync.phone = normalizePhoneE164(nextPhone);
  }

  return sync;
}

export async function syncAuthContactWithAdmin(
  admin: SupabaseClient,
  userId: string,
  input: { email?: string; phone?: string },
): Promise<
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    }
> {
  const patch: {
    email?: string;
    email_confirm?: boolean;
    phone?: string;
    phone_confirm?: boolean;
  } = {};

  if (input.email) {
    patch.email = normalizeEmail(input.email);
    patch.email_confirm = true;
  }

  if (input.phone) {
    patch.phone = getPhoneDigits(input.phone);
    patch.phone_confirm = true;
  }

  if (!Object.keys(patch).length) {
    return { success: true };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, patch);

  if (error) {
    const duplicate = mapAuthContactDuplicateError(error.message, input);
    if (duplicate) {
      return {
        success: false,
        message: duplicate.message,
        status: duplicate.status,
        errors: duplicate.errors,
      };
    }

    return {
      success: false,
      message: error.message,
      status: error.status ?? 400,
    };
  }

  return { success: true };
}

export async function syncProfileAuthContact(
  admin: SupabaseClient,
  userId: string,
  ctx: ContactSyncContext,
): Promise<
  | { success: true }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    }
> {
  const payload = buildAuthContactSyncPayload(ctx);
  return syncAuthContactWithAdmin(admin, userId, payload);
}
