"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "react-toastify";
import PhoneVerification from "@/components/common/phone-verification/PhoneVerification";
import PhoneInput from "@/components/ui/PhoneInput";
import { useOtpModal } from "@/context-api/otp-modal-context";
import { useAuthActions } from "@/hooks/useAuthActions";
import { isOtpEnabled, isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import { createAuthPhoneOtpModalSession } from "@/lib/otp/modal-options";
import { verifyAuthPhoneOtpClient } from "@/lib/auth/client";
import { validatePhoneValue } from "@/lib/phone-otp/phone";
import type { IUser } from "@/types/user";
import { useBusinessSettings } from "@/context-api/business-settings-context";

export type AuthFormMode = "login" | "register";

export type AuthFormProps = {
  mode: AuthFormMode;
  redirectTo?: string | null;
  variant?: "page" | "embedded";
  onSuccess?: (user: IUser) => void | Promise<void>;
};

type AuthMethod = "email" | "phone";

type EmailFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
};

const inputClassName =
  "block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

export default function AuthForm({
  mode,
  redirectTo,
  variant = "page",
  onSuccess,
}: AuthFormProps) {
  const isLogin = mode === "login";
  const { settings } = useBusinessSettings();
  const { openOtpModal } = useOtpModal();
  const phoneAuthEnabled = isOtpEnabled(settings);
  const registrationPhoneRequired = isOtpRequiredFor(settings, "registration");

  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [authPhone, setAuthPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const {
    loginWithEmail,
    registerWithEmail,
    sendAuthPhoneOtp,
    signInWithGoogle,
    finishAuth,
  } = useAuthActions({ redirectTo, onSuccess });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    defaultValues: {
      email: "shivavermadev6@gmail.com",
      password: "000000",
      confirmPassword: "",
      phone: "",
    },
  });

  const password = watch("password");
  const isEmbedded = variant === "embedded";

  const onEmailSubmit = handleSubmit(async ({ email, password, phone }) => {
    if (!isLogin && registrationPhoneRequired && !phoneVerified) {
      toast.error("Please verify your phone number with OTP before registering.");
      return;
    }

    if (isLogin) {
      await loginWithEmail(email, password);
      return;
    }

    await registerWithEmail(email, password, phone?.trim() || undefined);
  });

  const handleSendPhoneOtp = async () => {
    const phoneError = validatePhoneValue(authPhone);
    if (phoneError !== true) {
      toast.error(
        typeof phoneError === "string"
          ? phoneError
          : "Enter a valid phone number.",
      );
      return;
    }

    setPhoneBusy(true);
    try {
      const sent = await sendAuthPhoneOtp(authPhone);
      if (!sent) return;

      await openOtpModal(
        createAuthPhoneOtpModalSession(
          authPhone,
          async (phone, otp) => {
            const result = await verifyAuthPhoneOtpClient(phone, otp);
            if (!result.success) {
              return {
                success: false,
                message: result.message,
                error: result.errors?.otp ?? result.message,
              };
            }

            await finishAuth(
              result.data.user,
              result.data.isNewUser
                ? "Account created successfully."
                : "Logged in successfully.",
            );

            return { success: true };
          },
          isLogin ? "Verify & log in" : "Verify & register",
        ),
      );
    } finally {
      setPhoneBusy(false);
    }
  };

  const switchMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setPhoneVerified(false);
  };

  const handleGoogleAuth = async () => {
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setGoogleBusy(false);
    }
  };

  const title = isLogin ? "Sign in to continue" : "Create an account";
  const subtitle = isLogin
    ? "Use your email and password or sign in with your mobile number."
    : "Register with email and password or your mobile number.";

  return (
    <div className={isEmbedded ? "" : "w-full"}>
      {!isEmbedded ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-default-800 mb-2">{title}</h2>
          <p className="text-sm text-default-500">{subtitle}</p>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-default-200 bg-default-50/60 p-4">
          <h4 className="text-lg font-medium text-default-800 mb-1">{title}</h4>
          <p className="text-sm text-default-500">{subtitle}</p>
        </div>
      )}

      <div className="mb-6 flex rounded-full border border-default-200 p-1 bg-white dark:bg-default-50">
        <button
          type="button"
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${authMethod === "email"
              ? "bg-primary text-white"
              : "text-default-600 hover:text-default-800"
            }`}
          onClick={() => switchMethod("email")}
        >
          Email
        </button>
        <button
          type="button"
          disabled={!phoneAuthEnabled}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors disabled:opacity-50 ${authMethod === "phone"
              ? "bg-primary text-white"
              : "text-default-600 hover:text-default-800"
            }`}
          onClick={() => switchMethod("phone")}
        >
          Mobile
        </button>
      </div>

      {!phoneAuthEnabled && authMethod === "phone" ? (
        <p className="mb-4 text-sm text-default-500">
          Phone sign-in is disabled. Ask your admin to enable phone verification
          in Business Settings.
        </p>
      ) : null}

      {authMethod === "email" ? (
        <form onSubmit={onEmailSubmit} noValidate className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor={`${mode}-email`}
            >
              Email
            </label>
            <input
              id={`${mode}-email`}
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email?.message ? (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            ) : null}
          </div>

          {!isLogin && registrationPhoneRequired ? (
            <PhoneVerification<EmailFormValues>
              control={control}
              name="phone"
              id={`${mode}-register-phone`}
              label="Phone number"
              placeholder="Enter your phone number"
              variant="pill"
              disabled={isSubmitting}
              requireVerification={registrationPhoneRequired}
              showOtpHint={registrationPhoneRequired}
              otpHint="Verify your phone with OTP before registering."
              onVerifiedChange={setPhoneVerified}
            />
          ) : null}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-sm font-medium text-default-900"
                htmlFor={`${mode}-password`}
              >
                Password
              </label>
              {isLogin ? (
                <Link href="/recover-password" className="text-xs text-default-700">
                  Forgot password?
                </Link>
              ) : null}
            </div>
            <div className="flex">
              <input
                id={`${mode}-password`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                disabled={isSubmitting}
                className={`${inputClassName} rounded-e-none`}
                {...register("password", {
                  required: "Password is required.",
                  minLength: !isLogin
                    ? {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    }
                    : undefined,
                })}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-white -ms-px border-default-200 dark:bg-default-50"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-default-600" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 text-default-600" />
                )}
              </button>
            </div>
            {errors.password?.message ? (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            ) : null}
          </div>

          {!isLogin ? (
            <div>
              <label
                className="block text-sm font-medium text-default-900 mb-2"
                htmlFor={`${mode}-confirm-password`}
              >
                Confirm password
              </label>
              <input
                id={`${mode}-confirm-password`}
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className={inputClassName}
                {...register("confirmPassword", {
                  required: "Please confirm your password.",
                  validate: (value) =>
                    value === password || "Passwords do not match.",
                })}
              />
              {errors.confirmPassword?.message ? (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
          >
            {isSubmitting
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
                ? "Log in"
                : "Register"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-default-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-default-500 dark:bg-default-50">
                Or
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={googleBusy || isSubmitting}
            onClick={() => void handleGoogleAuth()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-default-200 bg-white px-6 py-3 text-sm font-medium text-default-800 hover:bg-default-50 disabled:opacity-60 dark:bg-default-50"
          >
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-default-300 text-[10px] font-semibold"
              aria-hidden
            >
              G
            </span>
            {googleBusy
              ? "Redirecting to Google..."
              : isLogin
                ? "Continue with Google"
                : "Sign up with Google"}
          </button>
        </form>
      ) : phoneAuthEnabled ? (
        <div className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor={`${mode}-auth-phone`}
            >
              Mobile number
            </label>
            <PhoneInput
              id={`${mode}-auth-phone`}
              value={authPhone}
              onChange={setAuthPhone}
              placeholder="Enter your mobile number"
              variant="pill"
              disabled={phoneBusy}
            />
          </div>
          <button
            type="button"
            disabled={phoneBusy}
            onClick={() => void handleSendPhoneOtp()}
            className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
          >
            {phoneBusy ? "Sending OTP..." : "Send OTP"}
          </button>
          <p className="text-xs text-default-500">
            We will send a one-time code to your mobile number. Enter it in the
            verification popup to continue.
          </p>
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-default-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={
            isLogin
              ? `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
              : `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
          }
          className="text-primary font-medium"
        >
          {isLogin ? "Register" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
