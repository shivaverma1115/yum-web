import { createAdminClient } from "@/lib/supabase/admin";
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from "@/types/business-settings";
import { normalizePhoneVerificationSettings } from "@/lib/business-settings/phone-verification";
import { deepMergeBusinessSettings } from "@/lib/business-settings/validate";

const SETTINGS_ROW_ID = "default";

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("business_settings")
    .select("settings")
    .eq("id", SETTINGS_ROW_ID)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.settings || typeof data.settings !== "object") {
    return DEFAULT_BUSINESS_SETTINGS;
  }

  const merged = deepMergeBusinessSettings(
    DEFAULT_BUSINESS_SETTINGS,
    data.settings as Partial<BusinessSettings>,
  );

  return {
    ...merged,
    phone_verification: normalizePhoneVerificationSettings(
      merged.phone_verification,
    ),
  };
}

export async function updateBusinessSettings(
  patch: Partial<BusinessSettings>,
): Promise<BusinessSettings> {
  const current = await getBusinessSettings();
  const merged = deepMergeBusinessSettings(current, patch);
  const next: BusinessSettings = {
    ...merged,
    phone_verification: normalizePhoneVerificationSettings(
      merged.phone_verification,
    ),
  };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("business_settings")
    .update({
      settings: next,
      updated_at: new Date().toISOString(),
    })
    .eq("id", SETTINGS_ROW_ID);

  if (error) {
    throw error;
  }

  return next;
}
