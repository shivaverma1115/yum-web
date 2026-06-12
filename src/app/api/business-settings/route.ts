import { NextResponse } from "next/server";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";

export async function GET() {
  try {
    const settings = await getCachedBusinessSettings();

    return NextResponse.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    logError(error, {
      context: "Get Business Settings API",
      meta: { url: "/api/business-settings", method: "GET", status: 500 },
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
