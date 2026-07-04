import { NextRequest, NextResponse } from "next/server";
import { getUserVerificationStatus } from "@/lib/auth/verification";
import { requireAuth } from "@/lib/auth/requireAuth";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import { isEmailVerifiedOnRequest } from "@/lib/email-otp/request";
import { isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import {
  profileEmailNeedsVerification,
  profilePhoneNeedsVerification,
} from "@/lib/profile/contact-verification";
import { assertContactAvailable } from "@/lib/profile/contact-uniqueness";
import { getCachedBusinessSettings } from "@/lib/business-settings/cache";
import { isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import { isPhoneVerifiedOnRequest } from "@/lib/phone-otp/request";
import { isValidPhoneNumber, normalizeProfilePhone } from "@/lib/phone-otp/phone";
import { logError } from "@/lib/utils/logError";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncProfileAuthContact } from "@/lib/profile/sync-contact";
import {
  getProfileByUserId,
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

    const settings = await getCachedBusinessSettings();

    if (
      isOtpRequiredFor(settings, "profile_update") &&
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

    const syncResult = await syncProfileAuthContact(admin, auth.user.id, {
      mode: "self",
      previousProfile: profile,
      verification,
      nextEmail,
      nextPhone: nextPhone ? normalizeProfilePhone(nextPhone) : "",
      emailVerifiedOnRequest,
      phoneVerifiedOnRequest,
      requirePhoneOtpForUpdate: isOtpRequiredFor(settings, "profile_update"),
    });

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
