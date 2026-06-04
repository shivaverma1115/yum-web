import { NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderByIdWithSupabase } from "@/lib/supabase/orders";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function GET(_: Request, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const adminClient = createAdminClient();
    const result = await getOrderByIdWithSupabase(adminClient, orderId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { order: result.order },
    });
  } catch (error) {
    logError(error, {
      context: "Get Order API",
      meta: { url: "/api/orders/[orderId]", method: "GET", status: 500 },
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
