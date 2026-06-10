import { createHmac, randomInt, timingSafeEqual } from "crypto";
import {
  EMAIL_OTP_LENGTH,
  EMAIL_OTP_PENDING_COOKIE,
  EMAIL_OTP_TTL_MS,
  EMAIL_OTP_VERIFIED_COOKIE,
  EMAIL_VERIFIED_TTL_MS,
} from "@/lib/email-otp/constants";
import { normalizeEmail } from "@/lib/email-otp/email";

type OtpPendingPayload = {
  email: string;
  otpHash: string;
  exp: number;
};

type EmailVerifiedPayload = {
  email: string;
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

export function generateEmailOtpCode(): string {
  const max = 10 ** EMAIL_OTP_LENGTH;
  return String(randomInt(0, max)).padStart(EMAIL_OTP_LENGTH, "0");
}

export function createPendingEmailOtpToken(email: string, otp: string): {
  token: string;
  cookieName: string;
  maxAge: number;
} {
  const normalized = normalizeEmail(email);
  const payload: OtpPendingPayload = {
    email: normalized,
    otpHash: hashOtp(otp),
    exp: Date.now() + EMAIL_OTP_TTL_MS,
  };

  return {
    token: signPayload(payload),
    cookieName: EMAIL_OTP_PENDING_COOKIE,
    maxAge: Math.floor(EMAIL_OTP_TTL_MS / 1000),
  };
}

export function createVerifiedEmailToken(email: string): {
  token: string;
  cookieName: string;
  maxAge: number;
} {
  const normalized = normalizeEmail(email);
  const payload: EmailVerifiedPayload = {
    email: normalized,
    exp: Date.now() + EMAIL_VERIFIED_TTL_MS,
  };

  return {
    token: signPayload(payload),
    cookieName: EMAIL_OTP_VERIFIED_COOKIE,
    maxAge: Math.floor(EMAIL_VERIFIED_TTL_MS / 1000),
  };
}

export function readPendingEmailOtpToken(
  token: string | undefined,
): OtpPendingPayload | null {
  if (!token) return null;
  return verifySignedToken<OtpPendingPayload>(token);
}

export function readVerifiedEmailToken(
  token: string | undefined,
): EmailVerifiedPayload | null {
  if (!token) return null;
  return verifySignedToken<EmailVerifiedPayload>(token);
}

export function emailOtpMatchesHash(otp: string, otpHash: string): boolean {
  const candidate = hashOtp(otp);
  const a = Buffer.from(candidate);
  const b = Buffer.from(otpHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
