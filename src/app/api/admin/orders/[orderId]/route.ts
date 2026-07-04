import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { notifyOrderUpdateInBackground } from "@/lib/notifications/send-order-update";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteOrderWithSupabase,
  updateOrderStatusWithSupabase,
} from "@/lib/supabase/orders";
import type { IOrder, OrderStatus } from "@/types/order";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "cancelled",
  "completed",
];

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { orderId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      status?: string;
    };

    const status = body.status?.trim() as OrderStatus | undefined;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: "A valid order status is required." },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const { data: existingOrder } = await adminClient
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();

    const result = await updateOrderStatusWithSupabase(
      adminClient,
      orderId,
      status,
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    notifyOrderUpdateInBackground({
      kind: "status",
      order: result.order,
      previousStatus: existingOrder?.status as IOrder["status"] | undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated.",
      data: { order: result.order },
    });
  } catch (error) {
    logError(error, {
      context: "Admin Update Order API",
      meta: {
        url: "/api/admin/orders/[orderId]",
        method: "PATCH",
        status: 500,
      },
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

    const { orderId } = await context.params;
    const adminClient = createAdminClient();
    const result = await deleteOrderWithSupabase(adminClient, orderId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted.",
    });
  } catch (error) {
    logError(error, {
      context: "Admin Delete Order API",
      meta: {
        url: "/api/admin/orders/[orderId]",
        method: "DELETE",
        status: 500,
      },
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
