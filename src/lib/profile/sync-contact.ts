import { emailsMatch, normalizeEmail } from "@/lib/email-otp/email";
import { mapAuthContactDuplicateError } from "@/lib/profile/contact-duplicate-errors";
import {
  getPhoneDigits,
  isValidPhoneNumber,
  normalizeProfilePhone,
  phonesMatch,
} from "@/lib/phone-otp/phone";
import { logError } from "@/lib/utils/logError";
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

export type ContactSyncFailure = {
  success: false;
  message: string;
  status: number;
  errors?: Record<string, string>;
};

export type ContactSyncResult = { success: true } | ContactSyncFailure;

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
      ? normalizeProfilePhone(patch.phone)
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
      sync.phone = normalizeProfilePhone(nextPhone);
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
    sync.phone = normalizeProfilePhone(nextPhone);
  }

  return sync;
}

export async function syncAuthContactWithAdmin(
  admin: SupabaseClient,
  userId: string,
  input: { email?: string; phone?: string },
): Promise<ContactSyncResult> {
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

/**
 * Restores Auth email/phone to the previous profile values after a failed
 * profile write that followed a successful Auth contact update.
 */
export async function rollbackAuthContactToPrevious(
  admin: SupabaseClient,
  userId: string,
  previousProfile: Pick<IUser, "email" | "phone"> | null,
  applied: { email?: string; phone?: string },
): Promise<ContactSyncResult> {
  const patch: {
    email?: string;
    email_confirm?: boolean;
    phone?: string;
    phone_confirm?: boolean;
  } = {};

  if (applied.email) {
    const previousEmail = previousProfile?.email?.trim();
    if (previousEmail) {
      patch.email = normalizeEmail(previousEmail);
      patch.email_confirm = true;
    }
  }

  if (applied.phone) {
    const previousPhone = previousProfile?.phone?.trim();
    if (previousPhone && isValidPhoneNumber(previousPhone)) {
      patch.phone = getPhoneDigits(previousPhone);
      patch.phone_confirm = true;
    }
  }

  if (!Object.keys(patch).length) {
    return { success: true };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, patch);
  if (error) {
    return {
      success: false,
      message: error.message,
      status: error.status ?? 500,
    };
  }

  return { success: true };
}

/**
 * Updates Auth contact first, then runs the profile writer.
 * If the profile write fails after Auth changed, Auth is rolled back.
 */
export async function runWithAuthContactFirst<T>(
  admin: SupabaseClient,
  userId: string,
  ctx: ContactSyncContext,
  runProfile: () => Promise<{ success: true; data: T } | ContactSyncFailure>,
): Promise<{ success: true; data: T } | ContactSyncFailure> {
  const payload = buildAuthContactSyncPayload(ctx);
  const authResult = await syncAuthContactWithAdmin(admin, userId, payload);
  if (!authResult.success) {
    return authResult;
  }

  const profileResult = await runProfile();
  if (profileResult.success) {
    return profileResult;
  }

  if (payload.email || payload.phone) {
    const rollback = await rollbackAuthContactToPrevious(
      admin,
      userId,
      ctx.previousProfile,
      payload,
    );

    if (!rollback.success) {
      logError(new Error(rollback.message), {
        context: "Auth contact rollback after profile failure",
        meta: { userId, payload, profileError: profileResult.message },
      });

      return {
        success: false,
        message: `${profileResult.message} Contact was updated in Auth but could not be reverted automatically. Please retry or contact support.`,
        status: profileResult.status,
        errors: profileResult.errors,
      };
    }
  }

  return profileResult;
}

export async function syncProfileAuthContact(
  admin: SupabaseClient,
  userId: string,
  ctx: ContactSyncContext,
): Promise<ContactSyncResult> {
  const payload = buildAuthContactSyncPayload(ctx);
  return syncAuthContactWithAdmin(admin, userId, payload);
}
