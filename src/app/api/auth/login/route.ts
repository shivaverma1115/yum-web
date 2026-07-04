import { NextRequest, NextResponse } from "next/server";
import { getAuthMethodDisabledMessage, isEmailAuthEnabled } from "@/lib/business-settings/auth-methods";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { logError } from "@/lib/utils/logError";
import {
    loginWithSupabase,
    type LoginPayload,
} from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BusinessSettings } from "@/types/business-settings";

export async function POST(request: NextRequest) {
    try {
        const settings: BusinessSettings = await getCachedBusinessSettings();

        if (!isEmailAuthEnabled(settings)) {
            return NextResponse.json(
                {
                    success: false,
                    message: getAuthMethodDisabledMessage("email"),
                },
                { status: 403 },
            );
        }

        const payload = await request.json().catch(() => ({})) as LoginPayload;

        const supabase = await createClient();
        const adminClient = createAdminClient();
        const result = await loginWithSupabase(
            supabase,
            adminClient,
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
            message: result.mergeMessage
                ? `Logged in successfully. ${result.mergeMessage}`
                : "Logged in successfully.",
            data: {
                user: result.user,
                mergeMessage: result.mergeMessage ?? null,
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
