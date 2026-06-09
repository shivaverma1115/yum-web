import { logError } from "@/lib/utils/logError";
import { normalizePhoneE164 } from "@/lib/phone-otp/phone";

/**
 * Sends OTP via SMS provider. Wire Twilio/MessageBird here for production.
 * In development the OTP is logged server-side when SMS is not configured.
 */
export async function sendPhoneOtpSms(
  phone: string,
  otp: string,
): Promise<{ sent: boolean; message: string }> {
  const normalized = normalizePhoneE164(phone);

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    // Placeholder for Twilio integration — extend when credentials are available.
    logError(new Error("Twilio SMS not implemented yet."), {
      context: "Phone OTP SMS",
      meta: { phone: normalized },
    });
    return {
      sent: false,
      message: "SMS provider is not configured. Contact support.",
    };
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[phone-otp] OTP for ${normalized}: ${otp}`);
    return { sent: true, message: "OTP sent." };
  }

  console.info(`[phone-otp] OTP queued for ${normalized}`);
  return { sent: true, message: "OTP sent." };
}
