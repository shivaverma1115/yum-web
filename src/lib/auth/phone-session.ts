import type { SupabaseClient } from "@supabase/supabase-js";
import { establishAuthSessionForUser } from "@/lib/auth/establish-session";
import { PHONE_OTP_LENGTH } from "@/lib/phone-otp/constants";
import { LOCAL_TEST_OTP, matchesLocalTestOtp } from "@/lib/phone-otp/local-test";
import {
  isValidPhoneNumber,
  normalizePhoneE164,
} from "@/lib/phone-otp/phone";
import { profileEmailFromAuth } from "@/lib/auth/verification";
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

export type PhoneAuthResult =
  | { success: true; user: IUser; isNewUser: boolean }
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
): Promise<PhoneOtpSendResult> {
  const normalized = normalizePhoneE164(phone);

  if (!isValidPhoneNumber(normalized)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
      status: 400,
      errors: { phone: "Invalid phone number." },
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  });

  if (error) {
    return {
      success: false,
      message: mapPhoneAuthError(error.message),
      status: normalizeHttpStatus(error.status, 429),
      errors: {},
    };
  }

  return { success: true, phone: normalized };
}

export async function sendPhoneAuthOtpLocal(
  phone: string,
): Promise<PhoneOtpSendResult> {
  const normalized = normalizePhoneE164(phone);

  if (!isValidPhoneNumber(normalized)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
      status: 400,
      errors: { phone: "Invalid phone number." },
    };
  }

  return { success: true, phone: normalized };
}

export async function verifyPhoneAuthOtpLocal(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  phone: string,
  otp: string,
): Promise<PhoneAuthResult> {
  const normalized = normalizePhoneE164(phone);
  const token = otp.trim();

  if (!isValidPhoneNumber(normalized)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
      status: 400,
      errors: { phone: "Invalid phone number." },
    };
  }

  if (!/^\d+$/.test(token) || token.length !== PHONE_OTP_LENGTH) {
    return {
      success: false,
      message: "Please enter a valid 6-digit OTP.",
      status: 400,
      errors: { otp: "Invalid OTP." },
    };
  }

  if (!matchesLocalTestOtp(token)) {
    return {
      success: false,
      message: `Invalid OTP. Use ${LOCAL_TEST_OTP} in local test mode.`,
      status: 400,
      errors: { otp: `Use OTP ${LOCAL_TEST_OTP} in local test mode.` },
    };
  }

  let userId = await findUserIdByPhone(admin, normalized);
  let isNewUser = false;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      phone: normalized,
      phone_confirm: true,
    });

    if (error) {
      const existingId = await findUserIdByPhone(admin, normalized);
      if (!existingId) {
        return {
          success: false,
          message: error.message,
          status: 400,
          errors: {},
        };
      }
      userId = existingId;
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

  const ensureProfile = await ensureProfileForUserId(admin, userId, {
    phone: normalized,
  });

  if (!ensureProfile.ok) {
    return {
      success: false,
      message: ensureProfile.message,
      status: 400,
      errors: {},
    };
  }

  const sessionResult = await establishAuthSessionForUser(
    supabase,
    admin,
    userId,
  );

  if (!sessionResult.success) {
    return {
      success: false,
      message: sessionResult.message,
      status: 400,
      errors: {},
    };
  }

  await syncProfileAfterPhoneAuth(admin, userId, normalized);

  const profile =
    (await getProfileByUserId(supabase, userId)) ??
    (await getProfileByUserIdAdmin(admin, userId));

  if (!profile) {
    return {
      success: false,
      message: "Account was created but the profile could not be loaded.",
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

export async function verifyPhoneAuthOtp(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  phone: string,
  otp: string,
): Promise<PhoneAuthResult> {
  const normalized = normalizePhoneE164(phone);
  const token = otp.trim();

  if (!isValidPhoneNumber(normalized)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
      status: 400,
      errors: { phone: "Invalid phone number." },
    };
  }

  if (!/^\d+$/.test(token) || token.length !== PHONE_OTP_LENGTH) {
    return {
      success: false,
      message: "Please enter a valid 6-digit OTP.",
      status: 400,
      errors: { otp: "Invalid OTP." },
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalized,
    token,
    type: "sms",
  });

  if (error) {
    return {
      success: false,
      message: mapPhoneAuthError(error.message),
      status: 400,
      errors: { otp: mapPhoneAuthError(error.message) },
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

  const isNewUser = (data.user.identities?.length ?? 0) <= 1;

  const ensureProfile = await ensureProfileForUserId(admin, data.user.id, {
    phone: normalized,
  });

  if (!ensureProfile.ok) {
    return {
      success: false,
      message: ensureProfile.message,
      status: 400,
      errors: {},
    };
  }

  await syncProfileAfterPhoneAuth(admin, data.user.id, normalized);

  const profile =
    (await getProfileByUserId(supabase, data.user.id)) ??
    (await getProfileByUserIdAdmin(admin, data.user.id));

  if (!profile) {
    return {
      success: false,
      message: "Signed in but the profile could not be loaded.",
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

/** Keeps profiles.phone in sync after phone OTP sign-in / sign-up. */
export async function syncProfileAfterPhoneAuth(
  admin: SupabaseClient,
  userId: string,
  phone: string,
): Promise<void> {
  const normalized = normalizePhoneE164(phone);

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
    existing.phone.trim() === "-"
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
