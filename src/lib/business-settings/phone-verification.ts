import type {
  BusinessSettings,
  BusinessSettingsPhoneVerification,
  PhoneOtpMode,
  PhoneVerificationFlow,
} from "@/types/business-settings";
import { DEFAULT_BUSINESS_SETTINGS } from "@/types/business-settings";
import { isProductionAppEnv } from "@/lib/app-env";

const OTP_MODES: PhoneOtpMode[] = ["off", "test", "test_local", "production"];

type LegacyPhoneVerification = {
  otp_enabled?: boolean;
  mobile_verification_required?: boolean;
  verification_required_for_registration?: boolean;
  verification_required_for_checkout?: boolean;
  verification_required_for_profile_update?: boolean;
};

export function normalizePhoneVerificationSettings(
  raw: unknown,
  defaults: BusinessSettingsPhoneVerification = DEFAULT_BUSINESS_SETTINGS.phone_verification,
): BusinessSettingsPhoneVerification {
  if (
    raw &&
    typeof raw === "object" &&
    "mode" in raw &&
    "required_for" in raw
  ) {
    const current = raw as BusinessSettingsPhoneVerification;
    let mode: PhoneOtpMode = OTP_MODES.includes(current.mode)
      ? current.mode
      : defaults.mode;

    // Never honor fixed-OTP local test mode on a production deployment.
    if (mode === "test_local" && isProductionAppEnv()) {
      mode = "off";
    }

    return {
      mode,
      required_for: {
        registration:
          current.required_for?.registration ?? defaults.required_for.registration,
        checkout: current.required_for?.checkout ?? defaults.required_for.checkout,
        profile_update:
          current.required_for?.profile_update ??
          defaults.required_for.profile_update,
      },
    };
  }

  const legacy = raw as LegacyPhoneVerification | undefined;
  const enabled = legacy?.otp_enabled !== false;

  return {
    mode: enabled ? "test" : "off",
    required_for: {
      registration:
        legacy?.verification_required_for_registration ??
        defaults.required_for.registration,
      checkout:
        legacy?.verification_required_for_checkout ??
        defaults.required_for.checkout,
      profile_update:
        legacy?.verification_required_for_profile_update ??
        defaults.required_for.profile_update,
    },
  };
}

export function isOtpEnabled(settings: Pick<BusinessSettings, "phone_verification">): boolean {
  return settings.phone_verification.mode !== "off";
}

export function getOtpMode(settings: Pick<BusinessSettings, "phone_verification">): PhoneOtpMode {
  return settings.phone_verification.mode;
}

export function isOtpRequiredFor(
  settings: Pick<BusinessSettings, "phone_verification">,
  flow: PhoneVerificationFlow,
): boolean {
  if (!isOtpEnabled(settings)) {
    return false;
  }

  return settings.phone_verification.required_for[flow];
}

/** True only when local fixed-OTP mode is active and the app is not production. */
export function isLocalTestOtpMode(mode: PhoneOtpMode): boolean {
  return mode === "test_local" && !isProductionAppEnv();
}

/** Saved as test_local but running on a production deployment — must not use 000000. */
export function isLocalTestOtpBlockedInProduction(mode: PhoneOtpMode): boolean {
  return mode === "test_local" && isProductionAppEnv();
}

export function isProductionOtpBlockedInDev(mode: PhoneOtpMode): boolean {
  return mode === "production" && process.env.NODE_ENV === "development";
}

export function getOtpSendSuccessMessage(mode: PhoneOtpMode): string {
  const base = "OTP sent to your phone.";

  if (isLocalTestOtpMode(mode)) {
    return `${base} Local test mode is active — enter OTP ${"000000"} for any number.`;
  }

  if (mode === "test") {
    return `${base} Use the test OTP configured in Supabase Dashboard → Auth → Phone.`;
  }

  return base;
}

export function getOtpDisabledMessage(): string {
  return "Phone OTP verification is currently disabled.";
}

export function getOtpProductionBlockedInDevMessage(): string {
  return "Production OTP is disabled in development. Switch to Test (local) or Test (Supabase) in Business Settings.";
}

export function getLocalTestOtpBlockedInProductionMessage(): string {
  return "Local test OTP (000000) is not allowed in production. Switch OTP mode to Production or Test (Supabase) in Business Settings.";
}
