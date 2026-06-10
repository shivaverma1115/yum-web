import { NextRequest, NextResponse } from "next/server";
import { getUserVerificationStatus } from "@/lib/auth/verification";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { isEmailVerifiedOnRequest } from "@/lib/email-otp/request";
import { emailsMatch, isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import {
  profileEmailNeedsVerification,
  profilePhoneNeedsVerification,
} from "@/lib/profile/contact-verification";
import { assertContactAvailable } from "@/lib/profile/contact-uniqueness";
import { isPhoneVerifiedOnRequest } from "@/lib/phone-otp/request";
import { isValidPhoneNumber, phonesMatch } from "@/lib/phone-otp/phone";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getProfileByUserId,
  syncAuthContactWithAdmin,
  updateOwnProfileWithSupabase,
  type UpdateOwnProfileInput,
} from "@/lib/supabase/account/profile";
import type { IUser } from "@/types/user";

/** Logged-in user updates their own profile (no admin check). */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as Partial<IUser>;
    const profile =
      auth.profile ?? (await getProfileByUserId(auth.supabase, auth.user.id));
    const verification = getUserVerificationStatus(auth.user);

    const nextEmail =
      payload.email !== undefined
        ? normalizeEmail(payload.email)
        : normalizeEmail(profile?.email);
    const nextPhone =
      payload.phone !== undefined
        ? (payload.phone ?? "").trim()
        : (profile?.phone?.trim() ?? "");

    if (nextEmail && !isValidEmail(nextEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
          errors: { email: "Invalid email address." },
        },
        { status: 400 },
      );
    }

    if (nextPhone && !isValidPhoneNumber(nextPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number.",
          errors: { phone: "Invalid phone number." },
        },
        { status: 400 },
      );
    }

    const emailVerifiedOnRequest = isEmailVerifiedOnRequest(request, nextEmail);
    const phoneVerifiedOnRequest = isPhoneVerifiedOnRequest(request, nextPhone);

    if (
      profileEmailNeedsVerification(
        nextEmail,
        profile?.email,
        verification,
        emailVerifiedOnRequest,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email with OTP before saving.",
          errors: { email: "Email verification required." },
        },
        { status: 403 },
      );
    }

    if (
      profilePhoneNeedsVerification(
        nextPhone,
        profile?.phone,
        verification,
        phoneVerifiedOnRequest,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your phone number with OTP before saving.",
          errors: { phone: "Phone verification required." },
        },
        { status: 403 },
      );
    }

    const admin = createAdminClient();
    const contactConflict = await assertContactAvailable(
      admin,
      { email: nextEmail, phone: nextPhone },
      auth.user.id,
    );

    if (!contactConflict.ok) {
      return NextResponse.json(
        {
          success: false,
          message: contactConflict.message,
          errors: contactConflict.errors,
        },
        { status: contactConflict.status },
      );
    }

    const result = await updateOwnProfileWithSupabase(
      auth.supabase,
      auth.user.id,
      payload as UpdateOwnProfileInput,
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

    const authSyncInput: { email?: string; phone?: string } = {};

    if (
      nextEmail &&
      emailVerifiedOnRequest &&
      (!emailsMatch(nextEmail, profile?.email) || !verification.email_verified)
    ) {
      authSyncInput.email = nextEmail;
    }

    if (
      nextPhone &&
      phoneVerifiedOnRequest &&
      (!phonesMatch(nextPhone, profile?.phone) || !verification.phone_verified)
    ) {
      authSyncInput.phone = nextPhone;
    }

    if (Object.keys(authSyncInput).length > 0) {
      const syncResult = await syncAuthContactWithAdmin(
        admin,
        auth.user.id,
        authSyncInput,
      );

      if (!syncResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: syncResult.message,
            errors: syncResult.errors ?? {},
          },
          { status: syncResult.status },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: { user: result.user },
    });
  } catch (error) {
    logError(error, {
      context: "Account Update Profile API",
      meta: { url: "/api/account/customers", method: "PATCH", status: 500 },
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
