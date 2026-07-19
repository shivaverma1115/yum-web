export const PHONE_OTP_LENGTH = 6;
export const PHONE_OTP_TTL_MS = 10 * 60 * 1000;
/** Short-lived; consumers must clear after use (checkout/profile). */
export const PHONE_VERIFIED_TTL_MS = 10 * 60 * 1000;
export const PHONE_OTP_PENDING_COOKIE = "yum_phone_otp";
export const PHONE_OTP_VERIFIED_COOKIE = "yum_phone_verified";
/** National mobile number length (e.g. India without +91). */
export const REQUIRED_MOBILE_DIGITS = 10;
export const INDIA_DIAL_CODE = "91";
