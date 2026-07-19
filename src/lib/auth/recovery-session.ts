import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const PASSWORD_RECOVERY_COOKIE = "yum_password_recovery";

/** Align with Supabase recovery session window (~15 minutes). */
const RECOVERY_TTL_MS = 15 * 60 * 1000;

type RecoveryPayload = {
  userId: string;
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

function verifySignedToken(token: string): RecoveryPayload | null {
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
    ) as RecoveryPayload;
    if (!payload.userId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function createPasswordRecoveryToken(userId: string): {
  token: string;
  maxAge: number;
} {
  const payload: RecoveryPayload = {
    userId,
    exp: Date.now() + RECOVERY_TTL_MS,
  };

  return {
    token: signPayload(payload),
    maxAge: Math.floor(RECOVERY_TTL_MS / 1000),
  };
}

export function readPasswordRecoveryToken(
  token: string | undefined,
): RecoveryPayload | null {
  if (!token) return null;
  return verifySignedToken(token);
}

export function setPasswordRecoveryCookie(
  response: NextResponse,
  userId: string,
) {
  const { token, maxAge } = createPasswordRecoveryToken(userId);
  response.cookies.set(PASSWORD_RECOVERY_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearPasswordRecoveryCookie(response: NextResponse) {
  response.cookies.set(PASSWORD_RECOVERY_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * True when the request carries a valid recovery cookie for this user
 * (issued only after a password-recovery email link).
 */
export function hasValidPasswordRecoverySession(
  token: string | undefined,
  userId: string,
): boolean {
  const payload = readPasswordRecoveryToken(token);
  return Boolean(payload && payload.userId === userId);
}
