import { NextRequest, NextResponse } from "next/server";
import { canAccessOrder } from "@/lib/auth/order-access";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { getCurrentUser } from "@/lib/supabase/account/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderByReferenceWithSupabase } from "@/lib/supabase/orders";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/utils/logError";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

const ORDER_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonNoCache(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  try {
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

    const session = await getCurrentUser(await createClient());
    const isOwnerOrAdmin =
      Boolean(session) &&
      canAccessOrder(
        { user: session!.authUser, profile: session!.user },
        result.order.user_id ?? "",
      );

    // Guests (and non-owners) may track by public order number only.
    // UUID lookups stay owner/admin-only so checkout deep-links are not public.
    const isPublicOrderNumber = !ORDER_UUID_RE.test(reference);
    if (!isOwnerOrAdmin && !isPublicOrderNumber) {
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
