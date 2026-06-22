import { isOtpEnabled } from "@/lib/business-settings/phone-verification";
import type { BusinessSettings } from "@/types/business-settings";

export function isEmailAuthEnabled(
  settings: Pick<BusinessSettings, "auth">,
): boolean {
  return settings.auth.email_login_register;
}

export function isGoogleAuthEnabled(
  settings: Pick<BusinessSettings, "auth">,
): boolean {
  return settings.auth.google_login_register;
}

export function isPhoneAuthEnabled(
  settings: Pick<BusinessSettings, "auth" | "phone_verification">,
): boolean {
  return settings.auth.phone_login_register && isOtpEnabled(settings);
}

export function hasUsableAuthMethod(
  settings: Pick<BusinessSettings, "auth" | "phone_verification">,
): boolean {
  return (
    isEmailAuthEnabled(settings) ||
    isGoogleAuthEnabled(settings) ||
    isPhoneAuthEnabled(settings)
  );
}

export function hasAnyAuthMethodEnabled(
  settings: Pick<BusinessSettings, "auth">,
): boolean {
  return (
    settings.auth.email_login_register ||
    settings.auth.google_login_register ||
    settings.auth.phone_login_register
  );
}

export function getAuthMethodDisabledMessage(method: "email" | "google" | "phone"): string {
  switch (method) {
    case "email":
      return "Email sign-in is currently disabled.";
    case "google":
      return "Google sign-in is currently disabled.";
    case "phone":
      return "Phone sign-in is currently disabled.";
  }
}
