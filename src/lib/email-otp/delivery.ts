import { normalizeEmail } from "@/lib/email-otp/email";

export async function sendEmailOtpMessage(
  email: string,
  otp: string,
): Promise<{ sent: boolean; message: string }> {
  const normalized = normalizeEmail(email);

  if (process.env.NODE_ENV === "development") {
    console.info(`[email-otp] OTP for ${normalized}: ${otp}`);
    return { sent: true, message: "OTP sent." };
  }

  // Wire Resend/SMTP here for production.
  console.info(`[email-otp] OTP queued for ${normalized}`);
  return { sent: true, message: "OTP sent." };
}
