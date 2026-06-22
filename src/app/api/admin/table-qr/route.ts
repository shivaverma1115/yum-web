import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getConfiguredSiteUrl } from "@/lib/business-settings/site-url";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createTableQrBatchWithSupabase,
  listTableQrCodesWithSupabase,
} from "@/lib/supabase/table-qr/table-qr";
import { parseCreateTableQrPayload } from "@/lib/table-qr/validate";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const adminClient = createAdminClient();
    const result = await listTableQrCodesWithSupabase(adminClient);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { tableQrCodes: result.tableQrCodes },
    });
  } catch (error) {
    logError(error, {
      context: "Admin List Table QR Codes API",
      meta: { url: "/api/admin/table-qr", method: "GET", status: 500 },
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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = await request.json().catch(() => ({}));
    const parsed = parseCreateTableQrPayload(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.message,
          errors: parsed.errors,
        },
        { status: 400 },
      );
    }

    const siteUrl = await getConfiguredSiteUrl(request);
    if (!siteUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Site URL is not configured. Update business settings first.",
          errors: { site_url: "Site URL is required to generate QR codes." },
        },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const result = await createTableQrBatchWithSupabase(
      adminClient,
      parsed.tableNumbers,
      siteUrl,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors ?? {},
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        result.tableQrCodes.length === 1
          ? "Table QR code generated successfully."
          : `${result.tableQrCodes.length} table QR codes generated successfully.`,
      data: { tableQrCodes: result.tableQrCodes },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Create Table QR Codes API",
      meta: { url: "/api/admin/table-qr", method: "POST", status: 500 },
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
