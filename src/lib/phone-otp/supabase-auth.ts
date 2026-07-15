import { createClient } from "@supabase/supabase-js";
import { PHONE_OTP_TTL_MS } from "@/lib/phone-otp/constants";
import { normalizePhoneE164 } from "@/lib/phone-otp/phone";

export type SupabasePhoneOtpResult =
  | { success: true; phone: string; expiresInSeconds: number }
  | { success: false; message: string; status: number };

function createPhoneOtpClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function mapSupabasePhoneAuthError(message: string): string {
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

  return message;
}

export async function sendSupabasePhoneOtp(
  phone: string,
): Promise<SupabasePhoneOtpResult> {
  const normalized = normalizePhoneE164(phone);
  const supabase = createPhoneOtpClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  });

  if (error) {
    return {
      success: false,
      message: mapSupabasePhoneAuthError(error.message),
      status: error.status === 429 ? 429 : 400,
    };
  }

  return {
    success: true,
    phone: normalized,
    expiresInSeconds: Math.floor(PHONE_OTP_TTL_MS / 1000),
  };
}

export async function verifySupabasePhoneOtp(
  phone: string,
  otp: string,
): Promise<SupabasePhoneOtpResult> {
  const normalized = normalizePhoneE164(phone);
  const supabase = createPhoneOtpClient();

  const { error } = await supabase.auth.verifyOtp({
    phone: normalized,
    token: otp,
    type: "sms",
  });

  if (error) {
    return {
      success: false,
      message: mapSupabasePhoneAuthError(error.message),
      status: 400,
    };
  }

  return {
    success: true,
    phone: normalized,
    expiresInSeconds: Math.floor(PHONE_OTP_TTL_MS / 1000),
  };
}
