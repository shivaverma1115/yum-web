"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendPhoneOtp } from "@/lib/phone-otp/client";
import { phonesMatch } from "@/lib/phone-otp/phone";

export function usePhoneVerification(phone: string) {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isVerified = Boolean(
    verifiedPhone && phonesMatch(verifiedPhone, phone),
  );

  useEffect(() => {
    if (verifiedPhone && !phonesMatch(verifiedPhone, phone)) {
      setVerifiedPhone(null);
    }
  }, [phone, verifiedPhone]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

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
      toast.success(result.message);
      if (result.data.debugOtp) {
        toast.info(`Dev OTP: ${result.data.debugOtp}`, { autoClose: 10000 });
      }
      setModalOpen(true);
      return true;
    } catch {
      toast.error("Could not send OTP. Please try again.");
      return false;
    } finally {
      setIsSending(false);
    }
  }, [phone]);

  return {
    isVerified,
    verifiedPhone,
    modalOpen,
    isSending,
    openModal,
    closeModal,
    sendOtp,
    markVerified,
  };
}
