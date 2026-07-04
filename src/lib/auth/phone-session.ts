import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PhoneOtpMode } from "@/types/business-settings";
import { isLocalTestOtpMode } from "@/lib/business-settings/phone-verification";
import { PHONE_OTP_LENGTH } from "@/lib/phone-otp/constants";
import { LOCAL_TEST_OTP, matchesLocalTestOtp } from "@/lib/phone-otp/local-test";
import {
  isValidPhoneNumber,
  normalizePhoneE164,
  normalizeProfilePhone,
  phonesMatch,
} from "@/lib/phone-otp/phone";
import { profileEmailFromAuth } from "@/lib/auth/verification";
import {
  getAnonymousUserId,
  mergeAnonymousUserIntoAccount,
  mergeSuccessMessage,
} from "@/lib/auth/anonymous-upgrade";
import {
  ensureProfileForUserId,
  getProfileByUserId,
  getProfileByUserIdAdmin,
} from "@/lib/supabase/account/profile";
import { findUserIdByPhone } from "@/lib/supabase/contact-lookup";
import { mapAuthErrorMessage } from "@/lib/supabase/auth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import type { IUser } from "@/types/user";

function normalizeHttpStatus(status: number | undefined, fallback = 400): number {
  if (typeof status === "number" && status >= 200 && status <= 599) {
    return status;
  }
  return fallback;
}

function mapPhoneAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("expired") || lower.includes("invalid otp")) {
    return "OTP expired or incorrect. Please send a new OTP.";
  }

  if (lower.includes("rate") || lower.includes("too many")) {
    return "Too many OTP requests. Please wait and try again.";
  }

  if (lower.includes("phone provider") || lower.includes("sms")) {
    return "Phone OTP is not configured in Supabase Auth. Enable Phone provider and add test numbers.";
  }

  return mapAuthErrorMessage(message);
}

function createBootstrapPassword(): string {
  return randomBytes(24).toString("base64url");
}

function invalidPhoneResult(): Extract<PhoneAuthResult, { success: false }> {
  return {
    success: false,
    message: "Please enter a valid phone number.",
    status: 400,
    errors: { phone: "Invalid phone number." },
  };
}

function invalidOtpResult(message = "Please enter a valid 6-digit OTP."): Extract<
  PhoneAuthResult,
  { success: false }
> {
  return {
    success: false,
    message,
    status: 400,
    errors: { otp: "Invalid OTP." },
  };
}

function parsePhoneAuthInput(
  phone: string,
  otp: string,
): { normalized: string; token: string } | Extract<PhoneAuthResult, { success: false }> {
  const normalized = normalizeProfilePhone(phone);
  const token = otp.trim();

  if (!isValidPhoneNumber(normalized)) {
    return invalidPhoneResult();
  }

  if (!/^\d+$/.test(token) || token.length !== PHONE_OTP_LENGTH) {
    return invalidOtpResult();
  }

  return { normalized, token };
}

export type PhoneAuthResult =
  | { success: true; user: IUser; isNewUser: boolean; mergeMessage?: string | null }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export type PhoneOtpSendResult =
  | { success: true; phone: string }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

export async function sendPhoneAuthOtp(
  supabase: SupabaseClient,
  phone: string,
  mode: PhoneOtpMode,
): Promise<PhoneOtpSendResult> {
  const profilePhone = normalizeProfilePhone(phone);

  if (!isValidPhoneNumber(profilePhone)) {
    return invalidPhoneResult();
  }

  if (isLocalTestOtpMode(mode)) {
    return { success: true, phone: profilePhone };
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizePhoneE164(profilePhone),
  });

  if (error) {
    return {
      success: false,
      message: mapPhoneAuthError(error.message),
      status: normalizeHttpStatus(error.status, 429),
      errors: {},
    };
  }

  return { success: true, phone: profilePhone };
}

/**
 * Local test mode: create or locate a phone-only auth user and sign in with a
 * server-side bootstrap password. Never writes placeholder emails to auth.users.
 */
async function authenticateLocalPhoneAuthUser(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  phone: string,
): Promise<
  | { userId: string; isNewUser: boolean }
  | Extract<PhoneAuthResult, { success: false }>
> {
  const normalized = normalizeProfilePhone(phone);
  const bootstrapPassword = createBootstrapPassword();
  let userId = await findUserIdByPhone(admin, normalized);
  let isNewUser = false;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      phone: normalized,
      phone_confirm: true,
      password: bootstrapPassword,
    });

    if (error) {
      userId = await findUserIdByPhone(admin, normalized);
      if (!userId) {
        return {
          success: false,
          message: error.message,
          status: 400,
          errors: {},
        };
      }
    } else if (data.user?.id) {
      userId = data.user.id;
      isNewUser = true;
    } else {
      return {
        success: false,
        message: ERROR_MESSAGE_GENERIC,
        status: 400,
        errors: {},
      };
    }
  }

  if (!isNewUser) {
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password: bootstrapPassword,
    });

    if (updateError) {
      return {
        success: false,
        message: updateError.message,
        status: 400,
        errors: {},
      };
    }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    phone: normalized,
    password: bootstrapPassword,
  });

  if (signInError) {
    return {
      success: false,
      message: mapPhoneAuthError(signInError.message),
      status: normalizeHttpStatus(signInError.status),
      errors: {},
    };
  }

  return { userId, isNewUser };
}

async function finalizePhoneAuth(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  userId: string,
  phone: string,
  isNewUser: boolean,
  failureMessage: string,
): Promise<PhoneAuthResult> {
  const ensureProfile = await ensureProfileForUserId(admin, userId, {
    phone,
  });

  if (!ensureProfile.ok) {
    return {
      success: false,
      message: ensureProfile.message,
      status: 400,
      errors: {},
    };
  }

  await syncProfileAfterPhoneAuth(admin, userId, phone);

  const profile =
    (await getProfileByUserId(supabase, userId)) ??
    (await getProfileByUserIdAdmin(admin, userId));

  if (!profile) {
    return {
      success: false,
      message: failureMessage,
      status: 500,
      errors: {},
    };
  }

  return {
    success: true,
    user: profile,
    isNewUser,
  };
}

async function applyAnonymousMerge(
  admin: SupabaseClient,
  anonymousId: string | null,
  targetUserId: string,
): Promise<string | null> {
  if (!anonymousId || anonymousId === targetUserId) {
    return null;
  }

  const merge = await mergeAnonymousUserIntoAccount(
    admin,
    anonymousId,
    targetUserId,
  );
  return mergeSuccessMessage(merge);
}

export async function verifyPhoneAuthOtp(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  phone: string,
  otp: string,
  mode: PhoneOtpMode,
): Promise<PhoneAuthResult> {
  const parsed = parsePhoneAuthInput(phone, otp);
  if ("success" in parsed) {
    return parsed;
  }

  const { normalized, token } = parsed;
  const anonymousId = await getAnonymousUserId(supabase);

  if (isLocalTestOtpMode(mode)) {
    if (!matchesLocalTestOtp(token)) {
      return invalidOtpResult(
        `Invalid OTP. Use ${LOCAL_TEST_OTP} in local test mode.`,
      );
    }

    const authResult = await authenticateLocalPhoneAuthUser(
      supabase,
      admin,
      normalized,
    );

    if ("success" in authResult) {
      return authResult;
    }

    const mergeMessage = await applyAnonymousMerge(
      admin,
      anonymousId,
      authResult.userId,
    );

    const finalized = await finalizePhoneAuth(
      supabase,
      admin,
      authResult.userId,
      normalized,
      authResult.isNewUser,
      "Account was created but the profile could not be loaded.",
    );

    if (!finalized.success) {
      return finalized;
    }

    return {
      ...finalized,
      mergeMessage,
    };
  }

  const existingUserId = await findUserIdByPhone(admin, normalized);

  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalizePhoneE164(normalized),
    token,
    type: "sms",
  });

  if (error) {
    const message = mapPhoneAuthError(error.message);
    return {
      success: false,
      message,
      status: 400,
      errors: { otp: message },
    };
  }

  if (!data.user?.id) {
    return {
      success: false,
      message: ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  const mergeMessage = await applyAnonymousMerge(
    admin,
    anonymousId,
    data.user.id,
  );

  const finalized = await finalizePhoneAuth(
    supabase,
    admin,
    data.user.id,
    normalized,
    !existingUserId,
    "Signed in but the profile could not be loaded.",
  );

  if (!finalized.success) {
    return finalized;
  }

  return {
    ...finalized,
    mergeMessage,
  };
}

/** Keeps profiles.phone in sync after phone OTP sign-in / sign-up. */
export async function syncProfileAfterPhoneAuth(
  admin: SupabaseClient,
  userId: string,
  phone: string,
): Promise<void> {
  const normalized = normalizeProfilePhone(phone);

  const { data: existing } = await admin
    .from("profiles")
    .select("id, phone, email, first_name, last_name")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) return;

  const { data: authData } = await admin.auth.admin.getUserById(userId);
  const resolvedEmail = profileEmailFromAuth(authData.user?.email);

  const updates: Record<string, string | null> = {};

  if (
    !existing.phone?.trim() ||
    existing.phone.trim() === "-" ||
    !phonesMatch(existing.phone, normalized)
  ) {
    updates.phone = normalized;
  }

  if (existing.email && !resolvedEmail) {
    updates.email = null;
  }

  if (existing.first_name === "Guest" && existing.last_name === "-") {
    updates.first_name = "";
    updates.last_name = "";
  }

  if (!Object.keys(updates).length) return;

  await admin.from("profiles").update(updates).eq("id", userId);
}
