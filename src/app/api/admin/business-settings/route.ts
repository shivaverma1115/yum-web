import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "@/lib/business-settings";
import { revalidateBusinessSettingsCache } from "@/lib/business-settings/cache";
import { validateFullBusinessSettings } from "@/lib/business-settings/validate";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import type { BusinessSettings } from "@/types/business-settings";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const settings = await getBusinessSettings();

    return NextResponse.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Get Business Settings API",
      meta: { url: "/api/admin/business-settings", method: "GET", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const body = (await request.json().catch(() => ({}))) as BusinessSettings;
    const validation = validateFullBusinessSettings(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the validation errors.",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const settings = await updateBusinessSettings(validation.value);
    revalidateBusinessSettingsCache();

    return NextResponse.json({
      success: true,
      message: "Business settings saved successfully.",
      data: { settings },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Business Settings API",
      meta: { url: "/api/admin/business-settings", method: "PATCH", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
