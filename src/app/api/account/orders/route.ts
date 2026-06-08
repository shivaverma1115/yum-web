import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  listCustomerOrdersWithSupabase,
  parseOrderListFilter,
} from "@/lib/supabase/orders";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const filter = parseOrderListFilter(
      request.nextUrl.searchParams.get("filter"),
    );

    const result = await listCustomerOrdersWithSupabase(
      auth.supabase,
      auth.user.id,
      {
        filter,
        customerEmail: auth.user.email ?? undefined,
      },
    );

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
      context: "User Orders API",
      meta: { url: "/api/account/orders", method: "GET", status: 500 },
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
