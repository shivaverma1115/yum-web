import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  isUserAddressType,
  listUserAddressesWithSupabase,
  upsertUserAddressWithSupabase,
} from "@/lib/supabase/addresses";
import type { UserAddressInput } from "@/types/user-address";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "You must be signed in." },
        { status: 401 },
      );
    }

    const result = await listUserAddressesWithSupabase(supabase, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { addresses: result.addresses },
    });
  } catch (error) {
    logError(error, {
      context: "Account List Addresses API",
      meta: { url: "/api/account/addresses", method: "GET", status: 500 },
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

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "You must be signed in." },
        { status: 401 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as UserAddressInput;

    if (!payload.address_type || !isUserAddressType(payload.address_type)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid address type is required.",
          errors: { address_type: "Use billing or shipping." },
        },
        { status: 400 },
      );
    }

    const result = await upsertUserAddressWithSupabase(
      supabase,
      user.id,
      payload,
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

    return NextResponse.json({
      success: true,
      message: "Address saved successfully.",
      data: { address: result.address },
    });
  } catch (error) {
    logError(error, {
      context: "Account Upsert Address API",
      meta: { url: "/api/account/addresses", method: "PUT", status: 500 },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
        errors: {},
      },
      { status: 500 },
    );
  }
}
