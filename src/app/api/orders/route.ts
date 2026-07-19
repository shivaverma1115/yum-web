import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { getUserVerificationStatus } from "@/lib/auth/verification";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import {
  getStoreClosedMessage,
  isStoreOpen,
} from "@/lib/business-settings/store-hours";
import { ERROR_MESSAGE_GENERIC, FULFILLMENT_TYPE } from "@/lib/constants";
import { isPhoneVerifiedOnRequest } from "@/lib/phone-otp/request";
import { clearPhoneOtpCookiesOnResponse } from "@/lib/otp/clear-verification-cookies";
import { phonesMatch } from "@/lib/phone-otp/phone";
import { logError } from "@/lib/utils/logError";
import { notifyOrderPlaced } from "@/lib/notifications/notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderWithSupabase } from "@/lib/supabase/orders";
import type { CheckoutPayload } from "@/types/checkout";

function isCheckoutPhoneVerified(
  request: NextRequest,
  phone: string,
  authUser: NonNullable<Awaited<ReturnType<typeof requireAuth>>["user"]>,
  profilePhone?: string | null,
): boolean {
  if (isPhoneVerifiedOnRequest(request, phone)) {
    return true;
  }

  const verification = getUserVerificationStatus(authUser);
  if (!verification.phone_verified) {
    return false;
  }

  return (
    phonesMatch(authUser.phone, phone) || phonesMatch(profilePhone, phone)
  );
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutPayload;
    const settings = await getCachedBusinessSettings();
    const fulfillment = body.fulfillment_type;
    const checkoutPhone = body.phone?.trim() || auth.profile?.phone?.trim() || "";
    const usedPhoneOtpCookie = Boolean(
      checkoutPhone && isPhoneVerifiedOnRequest(request, checkoutPhone),
    );

    if (!isStoreOpen(settings)) {
      return NextResponse.json(
        {
          success: false,
          message: getStoreClosedMessage(settings),
        },
        { status: 403 },
      );
    }

    if (
      (fulfillment === FULFILLMENT_TYPE.DELIVERY ||
        fulfillment === FULFILLMENT_TYPE.PICKUP) &&
      isOtpRequiredFor(settings, "checkout") &&
      checkoutPhone &&
      !isCheckoutPhoneVerified(
        request,
        checkoutPhone,
        auth.user,
        auth.profile?.phone,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your phone number with OTP before placing the order.",
          errors: { phone: "Phone verification required." },
        },
        { status: 403 },
      );
    }

    const adminClient = createAdminClient();
    const result = await createOrderWithSupabase(
      adminClient,
      body,
      auth.user.id,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors ?? {},
        },
        { status: result.status },
      );
    }

    const isPendingOnline =
      body.payment_method === "online" && body.payment_phase === "pending";

    // Skip push for unpaid online drafts — notify after payment confirms.
    if (!isPendingOnline) {
      await notifyOrderPlaced(result.order);
    }

    const response = NextResponse.json({
      success: true,
      message: isPendingOnline
        ? "Order created. Complete payment to confirm."
        : "Order placed successfully.",
      data: {
        order: result.order,
        items: result.items,
        redirectTo: result.order.id
          ? `/track-order?orderId=${encodeURIComponent(result.order.id)}`
          : `/${auth.profile?.role ?? "user"}/orders`,
      },
    });

    if (usedPhoneOtpCookie) {
      clearPhoneOtpCookiesOnResponse(response);
    }

    return response;
  } catch (error) {
    logError(error, {
      context: "Create Order API",
      meta: { url: "/api/orders", method: "POST", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGE_GENERIC,
      },
      { status: 500 },
    );
  }
}
