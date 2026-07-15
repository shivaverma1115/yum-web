import type { BusinessSettings, PhoneOtpMode } from "@/types/business-settings";
import { isValidStoreTime } from "@/lib/business-settings/store-hours";
import { isValidEmail } from "../email-otp/email";

const PHONE_OTP_MODES: PhoneOtpMode[] = [
  "off",
  "test",
  "test_local",
  "production",
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMergeBusinessSettings<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T>,
): T {
  const result = { ...base };

  for (const key of Object.keys(patch) as (keyof T)[]) {
    const patchValue = patch[key];
    const baseValue = base[key];

    if (patchValue === undefined) {
      continue;
    }

    if (isPlainObject(patchValue) && isPlainObject(baseValue)) {
      result[key] = deepMergeBusinessSettings(
        baseValue as Record<string, unknown>,
        patchValue as Record<string, unknown>,
      ) as T[keyof T];
      continue;
    }

    result[key] = patchValue as T[keyof T];
  }

  return result;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidSocialHandle(value: string): boolean {
  const handle = value.trim().replace(/^@/, "");
  if (!handle) return true;
  return /^[A-Za-z0-9._]{1,30}$/.test(handle);
}

function normalizeSocialHandle(value: string): string {
  return value.trim().replace(/^@/, "");
}

function parseNonNegativeNumber(
  value: unknown,
  field: string,
  errors: Record<string, string>,
): number | null {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    errors[field] = "Enter a valid amount (0 or greater).";
    return null;
  }

  return parsed;
}

export function validateBusinessSettingsPatch(
  patch: Partial<BusinessSettings>,
): { valid: true; value: Partial<BusinessSettings> } | { valid: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const value: Partial<BusinessSettings> = {};

  if (patch.general) {
    const general: Partial<BusinessSettings["general"]> = {};

    if (patch.general.site_name !== undefined) {
      if (!isNonEmptyString(patch.general.site_name)) {
        errors["general.site_name"] = "Site name is required.";
      } else {
        general.site_name = patch.general.site_name.trim();
      }
    }

    if (patch.general.site_url !== undefined) {
      const siteUrl = patch.general.site_url.trim();
      if (!isValidUrl(siteUrl)) {
        errors["general.site_url"] = "Enter a valid site URL.";
      } else {
        general.site_url = siteUrl;
      }
    }

    if (patch.general.currency !== undefined) {
      if (!isNonEmptyString(patch.general.currency)) {
        errors["general.currency"] = "Currency code is required.";
      } else {
        general.currency = patch.general.currency.trim().toUpperCase();
      }
    }

    if (patch.general.currency_symbol !== undefined) {
      if (!isNonEmptyString(patch.general.currency_symbol)) {
        errors["general.currency_symbol"] = "Currency symbol is required.";
      } else {
        general.currency_symbol = patch.general.currency_symbol.trim();
      }
    }

    if (Object.keys(general).length) {
      value.general = general as BusinessSettings["general"];
    }
  }

  if (patch.order) {
    const order: Partial<BusinessSettings["order"]> = {};

    if (patch.order.cod_enabled !== undefined) {
      order.cod_enabled = Boolean(patch.order.cod_enabled);
    }

    if (patch.order.online_payment_enabled !== undefined) {
      order.online_payment_enabled = Boolean(patch.order.online_payment_enabled);
    }

    if (patch.order.min_order_amount !== undefined) {
      const amount = parseNonNegativeNumber(
        patch.order.min_order_amount,
        "order.min_order_amount",
        errors,
      );
      if (amount !== null) {
        order.min_order_amount = amount;
      }
    }

    if (patch.order.delivery_charge !== undefined) {
      const charge = parseNonNegativeNumber(
        patch.order.delivery_charge,
        "order.delivery_charge",
        errors,
      );
      if (charge !== null) {
        order.delivery_charge = charge;
      }
    }

    if (patch.order.miscellaneous_fee !== undefined) {
      const misc = parseNonNegativeNumber(
        patch.order.miscellaneous_fee,
        "order.miscellaneous_fee",
        errors,
      );
      if (misc !== null) {
        order.miscellaneous_fee = misc;
      }
    }

    if (patch.order.store_hours_enabled !== undefined) {
      order.store_hours_enabled = Boolean(patch.order.store_hours_enabled);
    }

    if (patch.order.open_time !== undefined) {
      const openTime = String(patch.order.open_time).trim();
      if (!isValidStoreTime(openTime)) {
        errors["order.open_time"] = "Enter a valid open time (HH:mm).";
      } else {
        order.open_time = openTime;
      }
    }

    if (patch.order.close_time !== undefined) {
      const closeTime = String(patch.order.close_time).trim();
      if (!isValidStoreTime(closeTime)) {
        errors["order.close_time"] = "Enter a valid close time (HH:mm).";
      } else {
        order.close_time = closeTime;
      }
    }

    if (patch.order.timezone !== undefined) {
      const timezone = String(patch.order.timezone).trim();
      if (!timezone) {
        errors["order.timezone"] = "Timezone is required.";
      } else {
        order.timezone = timezone;
      }
    }

    if (Object.keys(order).length) {
      value.order = order as BusinessSettings["order"];
    }
  }

  if (patch.phone_verification) {
    const phoneVerification: Partial<BusinessSettings["phone_verification"]> = {};

    if (patch.phone_verification.mode !== undefined) {
      const mode = patch.phone_verification.mode;
      if (!PHONE_OTP_MODES.includes(mode)) {
        errors["phone_verification.mode"] = "Select a valid OTP mode.";
      } else {
        phoneVerification.mode = mode;
      }
    }

    if (patch.phone_verification.required_for) {
      const requiredFor: Partial<
        BusinessSettings["phone_verification"]["required_for"]
      > = {};

      if (patch.phone_verification.required_for.registration !== undefined) {
        requiredFor.registration = Boolean(
          patch.phone_verification.required_for.registration,
        );
      }

      if (patch.phone_verification.required_for.checkout !== undefined) {
        requiredFor.checkout = Boolean(
          patch.phone_verification.required_for.checkout,
        );
      }

      if (patch.phone_verification.required_for.profile_update !== undefined) {
        requiredFor.profile_update = Boolean(
          patch.phone_verification.required_for.profile_update,
        );
      }

      if (Object.keys(requiredFor).length) {
        phoneVerification.required_for =
          requiredFor as BusinessSettings["phone_verification"]["required_for"];
      }
    }

    if (Object.keys(phoneVerification).length) {
      value.phone_verification =
        phoneVerification as BusinessSettings["phone_verification"];
    }
  }

  if (patch.auth) {
    const auth: Partial<BusinessSettings["auth"]> = {};

    if (patch.auth.email_login_register !== undefined) {
      auth.email_login_register = Boolean(patch.auth.email_login_register);
    }

    if (patch.auth.google_login_register !== undefined) {
      auth.google_login_register = Boolean(patch.auth.google_login_register);
    }

    if (patch.auth.phone_login_register !== undefined) {
      auth.phone_login_register = Boolean(patch.auth.phone_login_register);
    }

    if (Object.keys(auth).length) {
      value.auth = auth as BusinessSettings["auth"];
    }
  }

  if (patch.payment) {
    const payment: Partial<BusinessSettings["payment"]> = {};

    if (patch.payment.razorpay_enabled !== undefined) {
      payment.razorpay_enabled = Boolean(patch.payment.razorpay_enabled);
    }

    if (Object.keys(payment).length) {
      value.payment = payment as BusinessSettings["payment"];
    }
  }

  if (patch.support) {
    const support: Partial<BusinessSettings["support"]> = {};

    if (patch.support.email !== undefined) {
      const email = patch.support.email.trim();
      if (!isValidEmail(email)) {
        errors["support.email"] = "Enter a valid support email.";
      } else {
        support.email = email;
      }
    }

    if (patch.support.phone !== undefined) {
      const phone = patch.support.phone.trim();
      if (!/^\d{6,15}$/.test(phone)) {
        errors["support.phone"] = "Enter a valid support phone number.";
      } else {
        support.phone = phone;
      }
    }

    if (Object.keys(support).length) {
      value.support = support as BusinessSettings["support"];
    }
  }

  if (patch.social) {
    const social: Partial<BusinessSettings["social"]> = {};

    if (patch.social.instagram !== undefined) {
      const instagram = normalizeSocialHandle(patch.social.instagram);
      if (!isValidSocialHandle(instagram)) {
        errors["social.instagram"] = "Enter a valid Instagram username.";
      } else {
        social.instagram = instagram;
      }
    }

    if (patch.social.twitter !== undefined) {
      const twitter = normalizeSocialHandle(patch.social.twitter);
      if (!isValidSocialHandle(twitter)) {
        errors["social.twitter"] = "Enter a valid Twitter/X username.";
      } else {
        social.twitter = twitter;
      }
    }

    if (Object.keys(social).length) {
      value.social = social as BusinessSettings["social"];
    }
  }

  if (Object.keys(errors).length) {
    return { valid: false, errors };
  }

  if (!Object.keys(value).length) {
    return {
      valid: false,
      errors: { settings: "No settings were provided to update." },
    };
  }

  return { valid: true, value };
}

export function validateFullBusinessSettings(
  settings: BusinessSettings,
): { valid: true; value: BusinessSettings } | { valid: false; errors: Record<string, string> } {
  const result = validateBusinessSettingsPatch(settings);

  if (!result.valid) {
    return result;
  }

  const merged = result.value;
  const requiredSections: (keyof BusinessSettings)[] = [
    "general",
    "order",
    "phone_verification",
    "auth",
    "payment",
    "support",
    "social",
  ];

  for (const section of requiredSections) {
    if (!merged[section]) {
      return {
        valid: false,
        errors: { settings: `Missing ${section} settings.` },
      };
    }
  }

  const auth = merged.auth as BusinessSettings["auth"];
  if (
    !auth.email_login_register &&
    !auth.google_login_register &&
    !auth.phone_login_register
  ) {
    return {
      valid: false,
      errors: { auth: "At least one sign-in method must be enabled." },
    };
  }

  return { valid: true, value: merged as BusinessSettings };
}
