import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { handleRazorpayWebhook } from "@/lib/razorpay/webhook";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    console.log("Webhook received");
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature")?.trim() ?? "";

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing webhook signature." },
        { status: 400 },
      );
    }

    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature." },
        { status: 400 },
      );
    }

    const payload = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: { entity?: { id?: string; order_id?: string } };
        order?: { entity?: { id?: string } };
      };
    };

    const adminClient = createAdminClient();
    const result = await handleRazorpayWebhook(adminClient, payload);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      handled: result.handled,
    });
  } catch (error) {
    logError(error, {
      context: "Razorpay Webhook API",
      meta: {
        url: "/api/payments/razorpay/webhook",
        method: "POST",
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
