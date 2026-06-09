import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import { getProfileByUserId } from "@/lib/supabase/account/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureCheckoutProfile } from "@/lib/supabase/checkout-user";

export async function GET() {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    let profile = auth.profile;

    if (!profile) {
      const admin = createAdminClient();
      await ensureCheckoutProfile(admin, auth.user.id, {
        phone: auth.user.phone ?? "",
        email: auth.user.email ?? null,
      });
      profile = await getProfileByUserId(auth.supabase, auth.user.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        authUser: auth.user,
        user: profile,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Me API",
      meta: { url: "/api/account/me", method: "GET", status: 500 },
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
