import {
  INDIA_DIAL_CODE,
  REQUIRED_MOBILE_DIGITS,
} from "@/lib/phone-otp/constants";

/** Normalizes any phone string to E.164 (+digits). */
export function normalizePhoneE164(phone?: string | null): string {
  const digits = phone?.replace(/\D/g, "") ?? "";
  return digits ? `+${digits}` : "";
}

export function getPhoneDigits(phone?: string | null): string {
  return phone?.replace(/\D/g, "") ?? "";
}

/** Digits-only phone for profiles and auth.users (e.g. 918004716907). */
export function normalizeProfilePhone(phone?: string | null): string {
  return getPhoneDigits(phone);
}

/** Returns the subscriber number without the India country code (+91). */
export function getNationalMobileDigits(phone?: string | null): string {
  const digits = getPhoneDigits(phone);
  if (digits.startsWith(INDIA_DIAL_CODE)) {
    return digits.slice(INDIA_DIAL_CODE.length);
  }
  return digits;
}

/** Validates format only when a value is present (profile forms). */
export function validateOptionalPhoneValue(
  phone?: string | null,
): true | string {
  if (!getPhoneDigits(phone)) {
    return true;
  }
  return validatePhoneValue(phone);
}

export function validatePhoneValue(phone?: string | null): true | string {
  const digits = getPhoneDigits(phone);
  if (!digits) {
    return "Phone is required.";
  }

  const national = getNationalMobileDigits(phone);
  if (national.length < REQUIRED_MOBILE_DIGITS) {
    return national.length > 0
      ? "Must enter 10 digits."
      : "Phone is required.";
  }

  if (national.length > REQUIRED_MOBILE_DIGITS) {
    return "Please enter a valid 10-digit mobile number.";
  }

  return true;
}

export function isValidPhoneNumber(phone?: string | null): boolean {
  return validatePhoneValue(phone) === true;
}

export function phonesMatch(
  a?: string | null,
  b?: string | null,
): boolean {
  const da = getPhoneDigits(a);
  const db = getPhoneDigits(b);
  return Boolean(da && db && da === db);
}

/** Matches India mobiles whether stored as 10 digits or +91 E.164. */
export function phonesMatchNational(
  a?: string | null,
  b?: string | null,
): boolean {
  const na = getNationalMobileDigits(a);
  const nb = getNationalMobileDigits(b);
  return (
    na.length === REQUIRED_MOBILE_DIGITS &&
    nb.length === REQUIRED_MOBILE_DIGITS &&
    na === nb
  );
}
