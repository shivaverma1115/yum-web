import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC, FULFILLMENT_TYPES } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { buildServerOrderQuote } from "@/lib/orders/reprice-cart";
import {
  createRazorpayOrder,
  getRazorpayCurrency,
  getRazorpayKeyId,
  toRazorpayAmount,
} from "@/lib/razorpay/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBusinessSettings } from "@/lib/business-settings";
import type { RazorpayQuoteRequest } from "@/types/checkout";
import type { FulfillmentType } from "@/types/order";

const FULFILLMENTS: FulfillmentType[] = [...FULFILLMENT_TYPES];

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const settings = await getBusinessSettings();
    if (!settings.order.online_payment_enabled) {
      return NextResponse.json(
        { success: false, message: "Online payment is not available." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as RazorpayQuoteRequest & {
      /** @deprecated Client amount is ignored. */
      amount?: number;
    };

    const fulfillment = body.fulfillment_type;
    if (!FULFILLMENTS.includes(fulfillment)) {
      return NextResponse.json(
        { success: false, message: "A valid order type is required." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    const quote = await buildServerOrderQuote(adminClient, {
      items: body.items,
      fulfillment_type: fulfillment,
      coupon_code: body.coupon_code,
      userId: auth.user.id,
    });

    if (!quote.success) {
      return NextResponse.json(
        {
          success: false,
          message: quote.message,
          errors: quote.errors ?? {},
        },
        { status: quote.status },
      );
    }

    const receipt = `yum_${Date.now()}`;
    const order = await createRazorpayOrder(quote.total, receipt);
    const currency = getRazorpayCurrency();

    return NextResponse.json({
      success: true,
      data: {
        keyId: getRazorpayKeyId(),
        orderId: order.id,
        amount: order.amount ?? toRazorpayAmount(quote.total),
        currency: order.currency ?? currency,
        total: quote.total,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Razorpay Create Order API",
      meta: { url: "/api/payments/razorpay/create-order", method: "POST", status: 500 },
    });

    const message =
      error instanceof Error && error.message.includes("RAZORPAY")
        ? "Online payments are not configured. Contact support."
        : error instanceof Error
          ? error.message
          : ERROR_MESSAGE_GENERIC;

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
