import nodemailer from "nodemailer";
import { EMAIL_OTP_TTL_MS } from "@/lib/email-otp/constants";
import { normalizeEmail } from "@/lib/email-otp/email";

type EmailDeliveryResult = { sent: boolean; message: string };

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim().replace(/\s+/g, "");
  const from = process.env.SMTP_FROM?.trim() ?? user;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure: port === 465,
    auth: { user, pass },
    from,
  };
}

function buildOtpEmailHtml(otp: string, siteName: string, expiresMinutes: number) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <p>Hello,</p>
      <p>Your verification code for ${siteName} is:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 24px 0;">${otp}</p>
      <p>This code expires in ${expiresMinutes} minutes. Do not share it with anyone.</p>
      <p>If you did not request this code, you can ignore this email.</p>
    </div>
  `;
}

export async function sendEmailOtpMessage(
  email: string,
  otp: string,
  options?: { siteName?: string },
): Promise<EmailDeliveryResult> {
  const normalized = normalizeEmail(email);
  const smtp = getSmtpConfig();

  if (!smtp) {
    return {
      sent: false,
      message:
        "Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD (or EMAIL_SMTP_PASSWORD), and EMAIL_FROM (or SMTP_FROM).",
    };
  }

  const siteName = options?.siteName?.trim() || "Yum";
  const expiresMinutes = Math.max(1, Math.floor(EMAIL_OTP_TTL_MS / 60_000));

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    });

    await transporter.sendMail({
      from: smtp.from,
      to: normalized,
      subject: `${siteName} verification code`,
      text: `Your ${siteName} verification code is ${otp}. It expires in ${expiresMinutes} minutes.`,
      html: buildOtpEmailHtml(otp, siteName, expiresMinutes),
    });

    return { sent: true, message: "OTP sent to your email." };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not send verification email.";

    return {
      sent: false,
      message,
    };
  }
}
