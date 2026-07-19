export const EMAIL_OTP_LENGTH = 6;
export const EMAIL_OTP_TTL_MS = 10 * 60 * 1000;
/** Short-lived; consumers must clear after use (login/register/profile). */
export const EMAIL_VERIFIED_TTL_MS = 10 * 60 * 1000;
export const EMAIL_OTP_PENDING_COOKIE = "yum_email_otp";
export const EMAIL_OTP_VERIFIED_COOKIE = "yum_email_verified";
