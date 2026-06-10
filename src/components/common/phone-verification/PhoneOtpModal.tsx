"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { PHONE_OTP_LENGTH } from "@/lib/phone-otp/constants";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/phone-otp/client";
import { inputClassName } from "@/components/ui/Input";

type PhoneOtpModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerified: (phone: string) => void;
};

export default function PhoneOtpModal({
  open,
  phone,
  onClose,
  onVerified,
}: PhoneOtpModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!open) {
      setOtp("");
      setError(null);
      setIsVerifying(false);
      setIsResending(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleVerify = async () => {
    const code = otp.replace(/\D/g, "");
    if (code.length !== PHONE_OTP_LENGTH) {
      setError(`Enter the ${PHONE_OTP_LENGTH}-digit OTP.`);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyPhoneOtp(phone, code);
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
  };

  const handleResend = async () => {
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
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-otp-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-default-50">
        <div className="flex items-center justify-between border-b border-default-200 px-4 py-3">
          <h3 id="phone-otp-title" className="text-base font-medium text-default-900">
            Verify phone number
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isVerifying}
            className="rounded-lg p-1 text-default-500 hover:bg-default-100 disabled:opacity-60"
            aria-label="Close verification dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <p className="text-sm text-default-600">
            Enter the {PHONE_OTP_LENGTH}-digit code sent to{" "}
            <span className="font-medium text-default-800">{phone}</span>.
          </p>

          <div>
            <label htmlFor="phone-otp-input" className="mb-2 block text-sm text-default-700">
              OTP
            </label>
            <input
              id="phone-otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={PHONE_OTP_LENGTH}
              value={otp}
              disabled={isVerifying}
              placeholder="000000"
              className={`${inputClassName} text-center tracking-[0.35em] font-medium`}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, PHONE_OTP_LENGTH));
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleVerify();
                }
              }}
            />
            {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={isVerifying}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={isResending || isVerifying}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-default-200 px-6 py-2.5 text-sm font-medium text-default-700 hover:bg-default-100 disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
