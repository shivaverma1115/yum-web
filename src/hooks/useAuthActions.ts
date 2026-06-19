"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
import { getSafeRedirect } from "@/lib/auth/redirect";
import {
  loginWithEmailClient,
  registerWithEmailClient,
  sendAuthPhoneOtpClient,
  signInWithGoogleClient,
  verifyAuthPhoneOtpClient,
} from "@/lib/auth/client";
import type { IUser } from "@/types/user";

type UseAuthActionsOptions = {
  redirectTo?: string | null;
  onSuccess?: (user: IUser) => void | Promise<void>;
};

export function useAuthActions(options: UseAuthActionsOptions = {}) {
  const router = useRouter();
  const { setUser, refresh } = useContextApi();

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

      router.push(
        getSafeRedirect(options.redirectTo ?? null, user.role),
      );
      router.refresh();
    },
    [options.onSuccess, options.redirectTo, refresh, router, setUser],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const result = await loginWithEmailClient(email, password);

      if (!result.success) {
        toast.error(result.message);
        return false;
      }

      await finishAuth(result.data.user, "Logged in successfully.");
      return true;
    },
    [finishAuth],
  );

  const registerWithEmail = useCallback(
    async (email: string, password: string, phone?: string) => {
      const result = await registerWithEmailClient({ email, password, phone });

      if (!result.success) {
        const detail = result.errors
          ? Object.values(result.errors).join(" ")
          : null;
        toast.error(detail ? `${result.message} ${detail}` : result.message);
        return false;
      }

      if (result.data.needsEmailConfirmation) {
        toast.success(result.message);
        router.push(
          `/login${options.redirectTo ? `?redirectTo=${encodeURIComponent(options.redirectTo)}` : ""}`,
        );
        return true;
      }

      await finishAuth(result.data.user, result.message);
      return true;
    },
    [finishAuth, options.redirectTo, router],
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
        result.data.isNewUser
          ? "Account created successfully."
          : "Logged in successfully.",
      );
      return true;
    },
    [finishAuth],
  );

  const signInWithGoogle = useCallback(async () => {
    const nextPath = options.redirectTo ?? "/home";
    const result = await signInWithGoogleClient(nextPath);

    if (!result.success) {
      toast.error(result.message);
      return false;
    }

    return true;
  }, [options.redirectTo]);

  return {
    loginWithEmail,
    registerWithEmail,
    sendAuthPhoneOtp,
    verifyAuthPhoneOtp,
    signInWithGoogle,
    finishAuth,
  };
}
