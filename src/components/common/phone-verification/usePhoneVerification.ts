"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOtpModal } from "@/context-api/otp-modal-context";
import { createPhoneOtpModalSession } from "@/lib/otp/modal-options";
import { sendPhoneOtp } from "@/lib/phone-otp/client";
import { phonesMatch } from "@/lib/phone-otp/phone";

export function usePhoneVerification(
  phone: string,
  trustedPhone?: string | null,
) {
  const { openOtpModal } = useOtpModal();
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(() =>
    trustedPhone && phonesMatch(trustedPhone, phone) ? trustedPhone : null,
  );
  const [isSending, setIsSending] = useState(false);

  const isVerified = Boolean(
    verifiedPhone && phonesMatch(verifiedPhone, phone),
  );

  useEffect(() => {
    if (trustedPhone && phonesMatch(trustedPhone, phone)) {
      setVerifiedPhone(trustedPhone);
      return;
    }

    if (verifiedPhone && !phonesMatch(verifiedPhone, phone)) {
      setVerifiedPhone(null);
    }
  }, [phone, trustedPhone, verifiedPhone]);

  const markVerified = useCallback((nextPhone: string) => {
    setVerifiedPhone(nextPhone);
  }, []);

  const sendOtp = useCallback(async (): Promise<boolean> => {
    if (!phone?.trim()) {
      toast.error("Please enter your phone number first.");
      return false;
    }

    setIsSending(true);
    try {
      const result = await sendPhoneOtp(phone);
      if (!result.success) {
        toast.error(result.message);
        return false;
      }

      toast.success(result.message, { autoClose: 8000 });
      const verified = await openOtpModal(createPhoneOtpModalSession(phone));
      if (verified) {
        markVerified(phone);
        return true;
      }

      return false;
    } catch {
      toast.error("Could not send OTP. Please try again.");
      return false;
    } finally {
      setIsSending(false);
    }
  }, [markVerified, openOtpModal, phone]);

  return {
    isVerified,
    verifiedPhone,
    isSending,
    sendOtp,
    markVerified,
  };
}
