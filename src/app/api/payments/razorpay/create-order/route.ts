import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  createRazorpayOrder,
  getRazorpayCurrency,
  getRazorpayKeyId,
  toRazorpayAmount,
} from "@/lib/razorpay/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { amount?: number };
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "A valid order amount is required." },
        { status: 400 },
      );
    }

    const receipt = `yum_${Date.now()}`;
    const order = await createRazorpayOrder(amount, receipt);
    const currency = getRazorpayCurrency();

    return NextResponse.json({
      success: true,
      data: {
        keyId: getRazorpayKeyId(),
        orderId: order.id,
        amount: order.amount ?? toRazorpayAmount(amount),
        currency: order.currency ?? currency,
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
