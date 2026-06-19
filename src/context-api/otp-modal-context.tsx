"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/otp/OtpModal";

export type OtpVerifyResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export type OtpModalSession = {
  title: string;
  target: string;
  targetType?: "phone" | "email";
  otpLength: number;
  verifyButtonLabel?: string;
  onResend: () => Promise<{ success: boolean; message?: string }>;
  onVerify: (otp: string) => Promise<OtpVerifyResult>;
};

type OtpModalContextValue = {
  openOtpModal: (session: OtpModalSession) => Promise<boolean>;
  closeOtpModal: () => void;
};

const OtpModalContext = createContext<OtpModalContextValue | null>(null);

type ActiveOtpModal = OtpModalSession & {
  resolve: (verified: boolean) => void;
};

export function OtpModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveOtpModal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const closeOtpModal = useCallback(() => {
    setActiveModal((current) => {
      current?.resolve(false);
      return null;
    });
    setError(null);
    setIsVerifying(false);
    setIsResending(false);
  }, []);

  const openOtpModal = useCallback((session: OtpModalSession) => {
    return new Promise<boolean>((resolve) => {
      setError(null);
      setIsVerifying(false);
      setIsResending(false);
      setActiveModal({
        ...session,
        resolve,
      });
    });
  }, []);

  const handleVerify = useCallback(
    async (otp: string) => {
      if (!activeModal) return;

      setIsVerifying(true);
      setError(null);

      try {
        const result = await activeModal.onVerify(otp);
        if (!result.success) {
          setError(result.error ?? result.message ?? "Invalid OTP.");
          return;
        }

        activeModal.resolve(true);
        setActiveModal(null);
        setError(null);
      } catch {
        setError("Could not verify OTP. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [activeModal],
  );

  const handleResend = useCallback(async () => {
    if (!activeModal) return;

    setIsResending(true);
    setError(null);

    try {
      const result = await activeModal.onResend();
      if (!result.success) {
        toast.error(result.message ?? "Could not resend OTP.");
        return;
      }
    } catch {
      toast.error("Could not resend OTP.");
    } finally {
      setIsResending(false);
    }
  }, [activeModal]);

  const value = useMemo(
    () => ({
      openOtpModal,
      closeOtpModal,
    }),
    [closeOtpModal, openOtpModal],
  );

  return (
    <OtpModalContext.Provider value={value}>
      {children}
      <OtpModal
        open={activeModal !== null}
        title={activeModal?.title ?? "Verify OTP"}
        target={activeModal?.target ?? ""}
        targetType={activeModal?.targetType}
        otpLength={activeModal?.otpLength ?? 6}
        verifyButtonLabel={activeModal?.verifyButtonLabel}
        isVerifying={isVerifying}
        isResending={isResending}
        error={error}
        onClose={closeOtpModal}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </OtpModalContext.Provider>
  );
}

export function useOtpModal(): OtpModalContextValue {
  const context = useContext(OtpModalContext);
  if (!context) {
    throw new Error("useOtpModal must be used within OtpModalProvider.");
  }
  return context;
}
