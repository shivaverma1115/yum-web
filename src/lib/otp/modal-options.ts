import { toast } from "react-toastify";
import { sendAuthPhoneOtpClient } from "@/lib/auth/client";
import { EMAIL_OTP_LENGTH } from "@/lib/email-otp/constants";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/email-otp/client";
import { PHONE_OTP_LENGTH } from "@/lib/phone-otp/constants";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/phone-otp/client";
import type {
  OtpModalSession,
  OtpVerifyResult,
} from "../../context-api/otp-modal-context";

export function createPhoneOtpModalSession(phone: string): OtpModalSession {
  return {
    title: "Verify phone number",
    target: phone,
    targetType: "phone",
    otpLength: PHONE_OTP_LENGTH,
    onResend: async () => {
      const result = await sendPhoneOtp(phone);
      if (result.success) {
        toast.success(result.message, { autoClose: 8000 });
      }
      return {
        success: result.success,
        message: result.message,
      };
    },
    onVerify: async (otp: string) => {
      const result = await verifyPhoneOtp(phone, otp);
      if (result.success) {
        toast.success(result.message);
      }
      return {
        success: result.success,
        message: result.message,
        error: result.success ? undefined : result.errors?.otp,
      };
    },
  };
}

export function createEmailOtpModalSession(email: string): OtpModalSession {
  return {
    title: "Verify email address",
    target: email,
    targetType: "email",
    otpLength: EMAIL_OTP_LENGTH,
    onResend: async () => {
      const result = await sendEmailOtp(email);
      if (result.success) {
        toast.success(result.message);
      }
      return {
        success: result.success,
        message: result.message,
      };
    },
    onVerify: async (otp: string) => {
      const result = await verifyEmailOtp(email, otp);
      if (result.success) {
        toast.success(result.message);
      }
      return {
        success: result.success,
        message: result.message,
        error: result.success ? undefined : result.errors?.otp,
      };
    },
  };
}

type AuthEmailVerifyHandler = (
  email: string,
  otp: string,
) => Promise<OtpVerifyResult>;

export function createAuthEmailRegisterOtpModalSession(
  email: string,
  verify: AuthEmailVerifyHandler,
  verifyButtonLabel = "Verify & register",
): OtpModalSession {
  return {
    title: "Verify email address",
    target: email,
    targetType: "email",
    otpLength: EMAIL_OTP_LENGTH,
    verifyButtonLabel,
    onResend: async () => {
      const result = await sendEmailOtp(email);
      if (result.success) {
        toast.success(result.message);
      }
      return {
        success: result.success,
        message: result.message,
      };
    },
    onVerify: async (otp: string) => verify(email, otp),
  };
}

type AuthPhoneVerifyHandler = (
  phone: string,
  otp: string,
) => Promise<OtpVerifyResult>;

export function createAuthPhoneOtpModalSession(
  phone: string,
  verify: AuthPhoneVerifyHandler,
  verifyButtonLabel = "Verify & continue",
): OtpModalSession {
  return {
    title: "Verify mobile number",
    target: phone,
    targetType: "phone",
    otpLength: PHONE_OTP_LENGTH,
    verifyButtonLabel,
    onResend: async () => {
      const result = await sendAuthPhoneOtpClient(phone);
      if (result.success) {
        toast.success(result.message, { autoClose: 8000 });
      }
      return {
        success: result.success,
        message: result.message,
      };
    },
    onVerify: async (otp: string) => verify(phone, otp),
  };
}
