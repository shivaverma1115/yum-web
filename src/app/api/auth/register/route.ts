import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
  registerWithSupabase,
  type RegisterPayload,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => ({})) as RegisterPayload
    console.log(payload);

    const email = payload.email.trim();
    const password = payload.password;
    const fullName = payload.fullName.trim();

    const supabase = await createClient();
    const result = await registerWithSupabase(supabase, {
      fullName,
      email,
      password,
    });

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
      message: result.needsEmailConfirmation
        ? "Account created. Check your email to confirm, then sign in."
        : "Registered successfully.",
      data: {
        user: result.user,
        needsEmailConfirmation: result.needsEmailConfirmation,
      },
    });
  } catch (error) {
    logError(error, {
      context: "Auth Register API",
      meta: { url: "/api/auth/register", method: "POST", status: 500 },
    });
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGE_GENERIC,
        errors: {},
      },
      { status: 500 },
    );
  }
}
