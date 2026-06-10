import { NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { establishCheckoutSession } from "@/lib/supabase/checkout-session";
import { resolveCheckoutUserId } from "@/lib/supabase/checkout-user";
import { createOrderWithSupabase } from "@/lib/supabase/orders";
import { getCurrentUser } from "@/lib/supabase/account/profile";
import { createClient } from "@/lib/supabase/server";
import { getUserVerificationStatus } from "@/lib/auth/verification";
import { isPhoneVerifiedOnRequest } from "@/lib/phone-otp/request";
import { phonesMatch } from "@/lib/phone-otp/phone";
import { CheckoutPayload } from "@/components/storefront/Checkout";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

function isCheckoutPhoneVerified(
  request: NextRequest,
  phone: string,
  session: Awaited<ReturnType<typeof getCurrentUser>>,
): boolean {
  if (isPhoneVerifiedOnRequest(request, phone)) {
    return true;
  }

  if (!session?.authUser) {
    return false;
  }

  const verification = getUserVerificationStatus(session.authUser);
  if (!verification.phone_verified) {
    return false;
  }

  return (
    phonesMatch(session.authUser.phone, phone) ||
    phonesMatch(session.user?.phone, phone)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutPayload = (await request.json().catch(() => ({})));

    const supabase = await createClient();
    const session = await getCurrentUser(supabase);

    const fulfillment = body.fulfillment_type;
    if (
      (fulfillment === "delivery" || fulfillment === "pickup") &&
      !isCheckoutPhoneVerified(request, body.phone, session)
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
    const wasGuest = !session?.authUser.id;

    const adminClient = createAdminClient();
    const userResult = await resolveCheckoutUserId(
      adminClient,
      body,
      session?.authUser.id,
    );

    if (!userResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: userResult.message,
          errors: {},
        },
        { status: userResult.status },
      );
    }

    const result = await createOrderWithSupabase(
      adminClient,
      body,
      userResult.userId,
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

    const isPendingOnline = body.payment_method === "online" && body.payment_phase === "pending";

    const cookiesToApply: CookieToSet[] = [];
    let loggedIn = !wasGuest;

    if (wasGuest) {
      const sessionResult = await establishCheckoutSession(
        {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookiesToApply.push(...cookies);
          },
        },
        userResult.userId,
        { checkoutPhone: body.phone },
      );
      loggedIn = sessionResult.success;
      if (!sessionResult.success) {
        logError(new Error(sessionResult.message), {
          context: "Create Order API — guest session",
          meta: { userId: userResult.userId },
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: isPendingOnline
        ? "Order created. Complete payment to confirm."
        : "Order placed successfully.",
      data: {
        order: result.order,
        items: result.items,
        loggedIn,
        redirectTo: loggedIn ? "/user/orders" : "/home",
      },
    });

    cookiesToApply.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

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
