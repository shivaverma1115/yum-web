"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/otp/OtpModal";
import { PHONE_OTP_LENGTH } from "@/lib/phone-otp/constants";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/phone-otp/client";

type PhoneOtpModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerified: (phone: string) => void;
};

/** @deprecated Prefer `useOtpModal()` with `createPhoneOtpModalSession()` globally. */
export default function PhoneOtpModal({
  open,
  phone,
  onClose,
  onVerified,
}: PhoneOtpModalProps) {
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
      title="Verify phone number"
      target={phone}
      targetType="phone"
      otpLength={PHONE_OTP_LENGTH}
      isVerifying={isVerifying}
      isResending={isResending}
      error={error}
      onClose={onClose}
      onOtpChange={() => setError(null)}
      onVerify={async (otp) => {
        setIsVerifying(true);
        setError(null);
        try {
          const result = await verifyPhoneOtp(phone, otp);
          if (!result.success) {
            setError(result.errors?.otp ?? result.message);
            return;
          }
          toast.success(result.message);
          onVerified(phone);
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
          const result = await sendPhoneOtp(phone);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message, { autoClose: 8000 });
        } catch {
          toast.error("Could not resend OTP.");
        } finally {
          setIsResending(false);
        }
      }}
    />
  );
}
