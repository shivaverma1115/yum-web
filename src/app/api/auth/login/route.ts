import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
    loginWithSupabase,
    type LoginPayload,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json().catch(() => ({})) as LoginPayload;

        const supabase = await createClient();
        const result = await loginWithSupabase(
            supabase,
            payload.email!.trim(),
            payload.password!,
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
            message: "Logged in successfully.",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        logError(error, {
            context: "Auth Login API",
            meta: { url: '/api/auth/login', method: "POST", status: 500 },
        });
        return NextResponse.json(
            {
                success: false,
                message: ERROR_MESSAGE_GENERIC,
                errors: {},
            },
            { status: 500 },
        );
    }
}
