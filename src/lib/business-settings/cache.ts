import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getBusinessSettings } from "@/lib/business-settings/index";
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from "@/types/business-settings";

export const BUSINESS_SETTINGS_CACHE_TAG = "business-settings";

async function loadBusinessSettingsSafely(): Promise<BusinessSettings> {
  try {
    return await getBusinessSettings();
  } catch {
    return DEFAULT_BUSINESS_SETTINGS;
  }
}

export const getCachedBusinessSettings = unstable_cache(
  loadBusinessSettingsSafely,
  [BUSINESS_SETTINGS_CACHE_TAG],
  {
    revalidate: 300,
    tags: [BUSINESS_SETTINGS_CACHE_TAG],
  },
);

export function revalidateBusinessSettingsCache() {
  revalidateTag(BUSINESS_SETTINGS_CACHE_TAG, "max");
  revalidatePath("/", "layout");
}
