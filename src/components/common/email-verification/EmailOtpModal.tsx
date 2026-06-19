"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/otp/OtpModal";
import { EMAIL_OTP_LENGTH } from "@/lib/email-otp/constants";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/email-otp/client";

type EmailOtpModalProps = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: (email: string) => void;
};

/** @deprecated Prefer `useOtpModal()` with `createEmailOtpModalSession()` globally. */
export default function EmailOtpModal({
  open,
  email,
  onClose,
  onVerified,
}: EmailOtpModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setIsVerifying(false);
      setIsResending(false);
    }
  }, [open]);

  return (
    <OtpModal
      open={open}
      title="Verify email address"
      target={email}
      targetType="email"
      otpLength={EMAIL_OTP_LENGTH}
      isVerifying={isVerifying}
      isResending={isResending}
      error={error}
      onClose={onClose}
      onOtpChange={() => setError(null)}
      onVerify={async (otp) => {
        setIsVerifying(true);
        setError(null);
        try {
          const result = await verifyEmailOtp(email, otp);
          if (!result.success) {
            setError(result.errors?.otp ?? result.message);
            return;
          }
          toast.success(result.message);
          onVerified(email);
          onClose();
        } catch {
          setError("Could not verify OTP. Please try again.");
        } finally {
          setIsVerifying(false);
        }
      }}
      onResend={async () => {
        setIsResending(true);
        setError(null);
        try {
          const result = await sendEmailOtp(email);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          if (result.data.debugOtp) {
            toast.info(`Dev OTP: ${result.data.debugOtp}`, { autoClose: 10000 });
          }
        } catch {
          toast.error("Could not resend OTP.");
        } finally {
          setIsResending(false);
        }
      }}
    />
  );
}
