"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { inputClassName } from "@/components/ui/Input";

export type OtpModalProps = {
  open: boolean;
  title: string;
  target: string;
  targetType?: "phone" | "email";
  otpLength: number;
  verifyButtonLabel?: string;
  isVerifying?: boolean;
  isResending?: boolean;
  error?: string | null;
  onClose: () => void;
  onVerify: (otp: string) => void | Promise<void>;
  onResend: () => void | Promise<void>;
  onOtpChange?: (otp: string) => void;
};

function getTargetLabel(targetType: OtpModalProps["targetType"]): string {
  if (targetType === "email") return "email address";
  if (targetType === "phone") return "phone number";
  return "contact";
}

export function validateOtpValue(
  value: string,
  otpLength: number,
): string | null {
  const code = value.replace(/\D/g, "");
  if (!code) {
    return "OTP is required.";
  }
  if (!/^\d+$/.test(code)) {
    return "OTP must contain digits only.";
  }
  if (code.length !== otpLength) {
    return `Enter the ${otpLength}-digit OTP.`;
  }
  return null;
}

export default function OtpModal({
  open,
  title,
  target,
  targetType = "phone",
  otpLength,
  verifyButtonLabel = "Verify OTP",
  isVerifying = false,
  isResending = false,
  error: externalError = null,
  onClose,
  onVerify,
  onResend,
  onOtpChange,
}: OtpModalProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const error = externalError ?? localError;
  const targetLabel = getTargetLabel(targetType);

  useEffect(() => {
    if (!open) {
      setOtp("");
      setLocalError(null);
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isVerifying) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isVerifying, onClose]);

  if (!open) return null;

  const handleOtpChange = (nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, "").slice(0, otpLength);
    setOtp(sanitized);
    setLocalError(null);
    onOtpChange?.(sanitized);
  };

  const handleVerify = async () => {
    const validationError = validateOtpValue(otp, otpLength);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    await onVerify(otp.replace(/\D/g, ""));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-default-50">
        <div className="flex items-center justify-between border-b border-default-200 px-4 py-3">
          <h3 id={titleId} className="text-base font-medium text-default-900">
            {title}
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
            Enter the {otpLength}-digit code sent to your {targetLabel}{" "}
            <span className="font-medium text-default-800">{target}</span>.
          </p>

          <div>
            <label
              htmlFor={`${titleId}-otp-input`}
              className="mb-2 block text-sm text-default-700"
            >
              OTP
            </label>
            <input
              ref={inputRef}
              id={`${titleId}-otp-input`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={otpLength}
              value={otp}
              disabled={isVerifying}
              placeholder={"0".repeat(otpLength)}
              className={`${inputClassName} text-center font-medium tracking-[0.35em]`}
              onChange={(event) => {
                void handleOtpChange(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleVerify();
                }
              }}
            />
            {error ? (
              <span className="mt-1 block text-sm text-red-500">{error}</span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={isVerifying || otp.length !== otpLength}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                verifyButtonLabel
              )}
            </button>
            <button
              type="button"
              onClick={() => void onResend()}
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
