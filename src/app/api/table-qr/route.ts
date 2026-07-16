import { NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { listActiveTableNumbersWithSupabase } from "@/lib/supabase/table-qr/table-qr";

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const result = await listActiveTableNumbersWithSupabase(adminClient);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { tableNumbers: result.tableNumbers },
    });
  } catch (error) {
    logError(error, {
      context: "List Active Table Numbers API",
      meta: { url: "/api/table-qr", method: "GET", status: 500 },
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
