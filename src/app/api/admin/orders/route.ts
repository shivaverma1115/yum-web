import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  listAllOrdersWithSupabase,
  parseOrderListFilter,
} from "@/lib/supabase/orders";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const filter = parseOrderListFilter(
      request.nextUrl.searchParams.get("filter"),
    );
    const adminClient = createAdminClient();
    const result = await listAllOrdersWithSupabase(adminClient, { filter });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { orders: result.orders },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Orders API",
      meta: { url: "/api/admin/orders", method: "GET", status: 500 },
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
