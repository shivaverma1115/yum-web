import { createHmac, randomInt, timingSafeEqual } from "crypto";
import {
  PHONE_OTP_LENGTH,
  PHONE_OTP_PENDING_COOKIE,
  PHONE_OTP_TTL_MS,
  PHONE_OTP_VERIFIED_COOKIE,
  PHONE_VERIFIED_TTL_MS,
} from "@/lib/phone-otp/constants";
import { normalizePhoneE164 } from "@/lib/phone-otp/phone";

type OtpPendingPayload = {
  phone: string;
  otpHash: string;
  exp: number;
};

type PhoneVerifiedPayload = {
  phone: string;
  exp: number;
};

function getSecret(): string {
  const secret =
    process.env.PHONE_OTP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("PHONE_OTP_SECRET is not configured.");
  }
  return secret;
}

function signPayload(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function verifySignedToken<T extends { exp: number }>(token: string): T | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as T;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashOtp(otp: string): string {
  return createHmac("sha256", getSecret()).update(otp).digest("hex");
}

export function generateOtpCode(): string {
  const max = 10 ** PHONE_OTP_LENGTH;
  return String(randomInt(0, max)).padStart(PHONE_OTP_LENGTH, "0");
}

export function createPendingOtpToken(phone: string, otp: string): {
  token: string;
  cookieName: string;
  maxAge: number;
} {
  const normalized = normalizePhoneE164(phone);
  const payload: OtpPendingPayload = {
    phone: normalized,
    otpHash: hashOtp(otp),
    exp: Date.now() + PHONE_OTP_TTL_MS,
  };

  return {
    token: signPayload(payload),
    cookieName: PHONE_OTP_PENDING_COOKIE,
    maxAge: Math.floor(PHONE_OTP_TTL_MS / 1000),
  };
}

export function createVerifiedPhoneToken(phone: string): {
  token: string;
  cookieName: string;
  maxAge: number;
} {
  const normalized = normalizePhoneE164(phone);
  const payload: PhoneVerifiedPayload = {
    phone: normalized,
    exp: Date.now() + PHONE_VERIFIED_TTL_MS,
  };

  return {
    token: signPayload(payload),
    cookieName: PHONE_OTP_VERIFIED_COOKIE,
    maxAge: Math.floor(PHONE_VERIFIED_TTL_MS / 1000),
  };
}

export function readPendingOtpToken(
  token: string | undefined,
): OtpPendingPayload | null {
  if (!token) return null;
  return verifySignedToken<OtpPendingPayload>(token);
}

export function readVerifiedPhoneToken(
  token: string | undefined,
): PhoneVerifiedPayload | null {
  if (!token) return null;
  return verifySignedToken<PhoneVerifiedPayload>(token);
}

export function otpMatchesHash(otp: string, otpHash: string): boolean {
  const candidate = hashOtp(otp);
  const a = Buffer.from(candidate);
  const b = Buffer.from(otpHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
