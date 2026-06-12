import { PHONE_OTP_LENGTH, PHONE_OTP_TTL_MS } from "@/lib/phone-otp/constants";

export const LOCAL_TEST_OTP = "000000";

export function matchesLocalTestOtp(otp: string): boolean {
  const token = otp.trim();
  return token === LOCAL_TEST_OTP && token.length === PHONE_OTP_LENGTH;
}

export function getLocalTestOtpExpiresInSeconds(): number {
  return Math.floor(PHONE_OTP_TTL_MS / 1000);
}
