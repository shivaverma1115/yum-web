import { NextRequest, NextResponse } from "next/server";
import { assertOrderAccess } from "@/lib/auth/order-access";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderByReferenceWithSupabase } from "@/lib/supabase/orders";
import { logError } from "@/lib/utils/logError";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

function jsonNoCache(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return jsonNoCache(
        { success: false, message: auth.message },
        auth.status,
      );
    }

    const reference =
      request.nextUrl.searchParams.get("reference")?.trim() ?? "";
    const result = await getOrderByReferenceWithSupabase(
      createAdminClient(),
      reference,
    );

    if (!result.success) {
      return jsonNoCache(
        { success: false, message: result.message },
        result.status,
      );
    }

    const access = assertOrderAccess(auth, result.order.user_id);
    if (!access.allowed) {
      // Do not reveal whether another customer's order exists.
      return jsonNoCache(
        {
          success: false,
          message: "We couldn't find an order with that number.",
        },
        404,
      );
    }

    return jsonNoCache({
      success: true,
      data: { order: result.order },
    });
  } catch (error) {
    logError(error, {
      context: "Track Order API",
      meta: { url: "/api/orders/track", method: "GET", status: 500 },
    });
    return jsonNoCache(
      { success: false, message: ERROR_MESSAGE_GENERIC },
      500,
    );
  }
}
