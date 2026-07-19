"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
import { useOtpModal } from "@/context-api/otp-modal-context";
import { getSafeRedirect } from "@/lib/auth/redirect";
import {
  loginWithEmailClient,
  registerWithEmailClient,
  sendAuthPhoneOtpClient,
  signInWithGoogleClient,
  verifyAuthPhoneOtpClient,
  verifyEmailCredentialsClient,
} from "@/lib/auth/client";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/email-otp/client";
import { createAuthEmailOtpModalSession } from "@/lib/otp/modal-options";
import type { IUser } from "@/types/user";

type UseAuthActionsOptions = {
  redirectTo?: string | null;
  onSuccess?: (user: IUser) => void | Promise<void>;
};

type EmailAuthMode = "login" | "register";

export type EmailAuthActionResult =
  | { success: true }
  | {
      success: false;
      message: string;
      errors?: Record<string, string>;
    };

function authApiFailureToOtpResult(result: {
  success: false;
  message: string;
  errors?: Record<string, string>;
}) {
  const detail = result.errors ? Object.values(result.errors).join(" ") : null;
  return {
    success: false as const,
    message: detail ? `${result.message} ${detail}` : result.message,
    error:
      result.errors?.email ??
      result.errors?.otp ??
      result.errors?.password ??
      result.message,
  };
}

export function useAuthActions(options: UseAuthActionsOptions = {}) {
  const router = useRouter();
  const { setUser, refresh, isAnonymous } = useContextApi();
  const { openOtpModal } = useOtpModal();

  const finishAuth = useCallback(
    async (user: IUser, message?: string) => {
      setUser(user);
      await refresh();

      if (message) {
        toast.success(message);
      }

      if (options.onSuccess) {
        await options.onSuccess(user);
        return;
      }

      router.push(getSafeRedirect(options.redirectTo ?? null, user.role));
      router.refresh();
    },
    [options.onSuccess, options.redirectTo, refresh, router, setUser],
  );

  /**
   * Email auth:
   * - login: verify email+password first → only then send OTP → login
   * - register: send OTP first → verify → create account
   */
  const authenticateWithEmail = useCallback(
    async (
      mode: EmailAuthMode,
      email: string,
      password: string,
    ): Promise<EmailAuthActionResult> => {
      if (mode === "login") {
        const credentials = await verifyEmailCredentialsClient(email, password);
        if (!credentials.success) {
          return {
            success: false,
            message: credentials.message,
            errors: credentials.errors,
          };
        }
      }

      const sent = await sendEmailOtp(email);
      if (!sent.success) {
        return {
          success: false,
          message: sent.message,
          errors: sent.errors ?? { email: sent.message },
        };
      }

      toast.success(sent.message);

      const verified = await openOtpModal(
        createAuthEmailOtpModalSession(
          email,
          async (verifiedEmail, otp) => {
            const otpResult = await verifyEmailOtp(verifiedEmail, otp);
            if (!otpResult.success) {
              return {
                success: false,
                message: otpResult.message,
                error: otpResult.errors?.otp ?? otpResult.message,
              };
            }

            if (mode === "login") {
              const loginResult = await loginWithEmailClient(
                verifiedEmail,
                password,
              );
              if (!loginResult.success) {
                return authApiFailureToOtpResult(loginResult);
              }

              await finishAuth(
                loginResult.data.user,
                loginResult.data.mergeMessage
                  ? `Logged in successfully. ${loginResult.data.mergeMessage}`
                  : "Logged in successfully.",
              );
              return { success: true };
            }

            const registerResult = await registerWithEmailClient({
              email: verifiedEmail,
              password,
            });
            if (!registerResult.success) {
              return authApiFailureToOtpResult(registerResult);
            }

            await finishAuth(
              registerResult.data.user,
              registerResult.message || "Registered successfully.",
            );
            return { success: true };
          },
          mode === "login" ? "Verify & login" : "Verify & register",
        ),
      );

      return verified ? { success: true } : { success: false, message: "Verification cancelled." };
    },
    [finishAuth, openOtpModal],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) =>
      authenticateWithEmail("login", email, password),
    [authenticateWithEmail],
  );

  const registerWithEmail = useCallback(
    async (email: string, password: string) =>
      authenticateWithEmail("register", email, password),
    [authenticateWithEmail],
  );

  const sendAuthPhoneOtp = useCallback(async (phone: string) => {
    const result = await sendAuthPhoneOtpClient(phone);

    if (!result.success) {
      toast.error(result.message);
      return false;
    }

    toast.success(result.message, { autoClose: 8000 });
    return true;
  }, []);

  const verifyAuthPhoneOtp = useCallback(
    async (phone: string, otp: string) => {
      const result = await verifyAuthPhoneOtpClient(phone, otp);

      if (!result.success) {
        toast.error(result.message);
        return false;
      }

      await finishAuth(
        result.data.user,
        result.data.mergeMessage
          ? `${result.data.isNewUser ? "Account created successfully." : "Logged in successfully."} ${result.data.mergeMessage}`
          : result.data.isNewUser
            ? "Account created successfully."
            : "Logged in successfully.",
      );
      return true;
    },
    [finishAuth],
  );

  const signInWithGoogle = useCallback(async () => {
    const nextPath = options.redirectTo ?? "/home";
    const result = await signInWithGoogleClient(nextPath, {
      linkAnonymous: isAnonymous,
    });

    if (!result.success) {
      toast.error(result.message);
      return false;
    }

    return true;
  }, [isAnonymous, options.redirectTo]);

  return {
    authenticateWithEmail,
    loginWithEmail,
    registerWithEmail,
    sendAuthPhoneOtp,
    verifyAuthPhoneOtp,
    signInWithGoogle,
    finishAuth,
  };
}
