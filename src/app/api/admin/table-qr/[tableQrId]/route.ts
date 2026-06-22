import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteTableQrWithSupabase,
  updateTableQrActiveStatusWithSupabase,
} from "@/lib/supabase/table-qr/table-qr";

type RouteContext = {
  params: Promise<{ tableQrId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { tableQrId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      is_active?: boolean;
    };

    if (typeof body.is_active !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Active status is required.",
          errors: { is_active: "Provide true or false." },
        },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const result = await updateTableQrActiveStatusWithSupabase(
      adminClient,
      tableQrId,
      body.is_active,
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
      message: result.tableQrCode.is_active
        ? "Table QR code activated."
        : "Table QR code deactivated.",
      data: { tableQrCode: result.tableQrCode },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Table QR Code API",
      meta: { url: "/api/admin/table-qr/[tableQrId]", method: "PATCH", status: 500 },
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

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { tableQrId } = await context.params;
    const adminClient = createAdminClient();
    const result = await deleteTableQrWithSupabase(adminClient, tableQrId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Table QR code deleted successfully.",
    });
  } catch (error) {
    logError(error, {
      context: "Admin Delete Table QR Code API",
      meta: { url: "/api/admin/table-qr/[tableQrId]", method: "DELETE", status: 500 },
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
