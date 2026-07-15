import { NextResponse } from "next/server";
import { assertOrderAccess } from "@/lib/auth/order-access";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderByIdWithSupabase } from "@/lib/supabase/orders";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ orderId: string }> };

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

function jsonNoCache(
  body: unknown,
  init?: { status?: number },
): NextResponse {
  return NextResponse.json(body, {
    status: init?.status,
    headers: NO_CACHE_HEADERS,
  });
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return jsonNoCache(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { orderId } = await context.params;
    const adminClient = createAdminClient();
    const result = await getOrderByIdWithSupabase(adminClient, orderId);

    if (!result.success) {
      return jsonNoCache(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const access = assertOrderAccess(auth, result.order.user_id);
    if (!access.allowed) {
      return jsonNoCache(
        { success: false, message: access.message },
        { status: access.status },
      );
    }

    return jsonNoCache({
      success: true,
      data: { order: result.order },
    });
  } catch (error) {
    logError(error, {
      context: "Get Order API",
      meta: { url: "/api/orders/[orderId]", method: "GET", status: 500 },
    });

    return jsonNoCache(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
