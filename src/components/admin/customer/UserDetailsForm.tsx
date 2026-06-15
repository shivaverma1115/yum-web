"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserRole, type IUser } from "@/types/user";
import { Info, Save, X } from "lucide-react";
import { useContextApi } from "@/context-api/use-context";
import VerificationBadge from "@/components/admin/customer/VerificationBadge";
import EmailOtpModal from "@/components/common/email-verification/EmailOtpModal";
import {
  PhoneVerification,
  type PhoneVerificationHandle,
} from "@/components/common/phone-verification";
import { sendEmailOtp } from "@/lib/email-otp/client";
import { isValidEmail, normalizeEmail } from "@/lib/email-otp/email";
import {
  profileEmailNeedsVerification,
  profilePhoneNeedsVerification,
} from "@/lib/profile/contact-verification";
import { isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import {
  isValidPhoneNumber,
  phonesMatch,
  validateOptionalPhoneValue,
} from "@/lib/phone-otp/phone";
import { isRichTextEmpty } from "@/lib/rich-text";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useBusinessSettings } from "@/context-api/business-settings-context";

export interface UserDetailsFormProps {
  user?: IUser;
  /** self = own profile via /api/account/customers; admin = manage customers */
  mode?: "self" | "admin";
}
const inputClassName =
  "block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

const errorClassName = "text-red-500 text-sm mt-1";

function optionalMinLength(min: number, message: string) {
  return {
    validate: (value?: string | null) =>
      !value?.trim() || value.trim().length >= min || message,
  };
}

function optionalEmailPattern() {
  return {
    validate: (value?: string | null) => {
      const email = value?.trim();
      if (!email) return true;
      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        "Enter a valid email address."
      );
    },
  };
}

function optionalZipCode() {
  return {
    validate: (value?: string | null) => {
      const zip = value?.trim();
      if (!zip) return true;
      return (
        /^[A-Za-z0-9\s-]{3,10}$/.test(zip) || "Enter a valid zip code."
      );
    },
  };
}

export default function UserDetailsForm({
  user,
  mode = "admin",
}: UserDetailsFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(user?.id);
  const isSelfMode = mode === "self";
  const isCreateMode = !isEditMode && !isSelfMode;
  const { user: sessionUser, verification, setUser, refresh } = useContextApi();
  const { settings: businessSettings } = useBusinessSettings();
  const profileUser = isSelfMode ? (sessionUser ?? user) : user;
  const phoneOtpRequired =
    isSelfMode && isOtpRequiredFor(businessSettings, "profile_update");

  const phoneVerificationRef = useRef<PhoneVerificationHandle>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IUser>({
    defaultValues: user ?? {},
  });

  const email = watch("email");
  const phone = watch("phone");

  useEffect(() => {
    setEmailVerified(false);
  }, [email]);

  const emailOk =
    !isSelfMode ||
    !profileEmailNeedsVerification(
      email,
      profileUser?.email,
      verification,
      emailVerified,
    );

  const phoneOk =
    !phoneOtpRequired ||
    !profilePhoneNeedsVerification(
      phone,
      profileUser?.phone,
      verification,
      phoneVerified,
    );

  const canSave = emailOk && phoneOk;
  const trustedPhone =
    isSelfMode &&
    phonesMatch(phone, profileUser?.phone) &&
    verification?.phone_verified
      ? profileUser?.phone ?? null
      : null;

  const handleSendEmailOtp = async () => {
    const value = normalizeEmail(email);
    if (!isValidEmail(value)) {
      toast.error("Please enter a valid email address first.");
      return;
    }

    setIsSendingEmailOtp(true);
    try {
      const result = await sendEmailOtp(value);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (result.data.debugOtp) {
        toast.info(`Dev OTP: ${result.data.debugOtp}`, { autoClose: 10000 });
      }
      setEmailModalOpen(true);
    } catch {
      toast.error("Could not send OTP. Please try again.");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    setIsSendingPhoneOtp(true);
    try {
      await phoneVerificationRef.current?.requestOtp();
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (isCreateMode) {
      const hasEmail =
        Boolean(values.email?.trim()) &&
        isValidEmail(normalizeEmail(values.email));
      const hasPhone = isValidPhoneNumber(values.phone);

      if (!hasEmail && !hasPhone) {
        toast.error("Email or phone number is required.");
        return;
      }
    }

    try {
      const url = isSelfMode
        ? "/api/account/customers"
        : isEditMode
          ? `/api/admin/customers/${user!.id}`
          : "/api/admin/customers";
      const method = isSelfMode || isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        const fieldErrors = data.errors as Record<string, string> | undefined;
        if (fieldErrors?.email) {
          setError("email", { type: "server", message: fieldErrors.email });
        }
        if (fieldErrors?.phone) {
          setError("phone", { type: "server", message: fieldErrors.phone });
        }
        toast.error(data.message ?? "Something went wrong.");
        return;
      }
      if (isSelfMode) {
        setUser(data.data.user);
        await refresh();
        setEmailVerified(false);
        setPhoneVerified(false);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  });

  const handleClose = () => {
    router.push("/admin/customers");
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border rounded-lg border-default-200"
    >
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="first_name"
            >
              First Name
              {isCreateMode ? (
                <span className="text-required"> *</span>
              ) : null}
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter Your First Name"
              disabled={isSubmitting}
              className={inputClassName}
              {...register(
                "first_name",
                isCreateMode
                  ? {
                      required: "First name is required.",
                      minLength: {
                        value: 2,
                        message: "Enter at least 2 characters.",
                      },
                    }
                  : optionalMinLength(2, "Enter at least 2 characters."),
              )}
            />
            {errors.first_name?.message ? (
              <span className={errorClassName}>{errors.first_name.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="last_name"
            >
              Last Name
              {isCreateMode ? (
                <span className="text-required"> *</span>
              ) : null}
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter Your Last Name"
              disabled={isSubmitting}
              className={inputClassName}
              {...register(
                "last_name",
                isCreateMode
                  ? {
                      required: "Last name is required.",
                      minLength: {
                        value: 2,
                        message: "Enter at least 2 characters.",
                      },
                    }
                  : optionalMinLength(2, "Enter at least 2 characters."),
              )}
            />
            {errors.last_name?.message ? (
              <span className={errorClassName}>{errors.last_name.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="flex items-center gap-1 text-sm font-medium text-default-900 mb-2"
              htmlFor="email"
            >
              <span>Email</span>
              {isEditMode && !isSelfMode ? (
                <span className="relative inline-flex group">
                  <button
                    type="button"
                    className="inline-flex rounded text-default-400 hover:text-primary focus:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="Email cannot be edited after account creation"
                  >
                    <Info className="size-4" aria-hidden />
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute start-0 top-full z-10 mt-1 w-56 rounded-md border border-default-200 bg-white px-3 py-2 text-xs font-normal text-default-600 opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-default-50"
                  >
                    Email cannot be edited after account creation.
                  </span>
                </span>
              ) : null}
            </label>
            <input
              id="email"
              type="email"
              placeholder="Please enter your email address"
              autoComplete="email"
              readOnly={isEditMode && !isSelfMode}
              disabled={isSubmitting}
              className={inputClassName}
              aria-describedby={isEditMode && !isSelfMode ? "email-help" : undefined}
              {...register("email", optionalEmailPattern())}
            />
            {isCreateMode ? (
              <p className="mt-1 text-xs text-default-500">
                Provide an email or phone number (at least one).
              </p>
            ) : null}
            {isEditMode && !isSelfMode ? (
              <p id="email-help" className="sr-only">
                Email cannot be edited after account creation.
              </p>
            ) : null}
            {errors.email?.message ? (
              <span className={errorClassName}>{errors.email.message}</span>
            ) : null}
            {isSelfMode && normalizeEmail(email) ? (
              <div className="mt-2 space-y-1">
                <VerificationBadge verified={emailOk} label="Email" />
                {!emailOk ? (
                  <p className="text-xs text-default-500">
                    Verify your email with OTP before saving.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div>
            <PhoneVerification<IUser>
              ref={phoneVerificationRef}
              control={control}
              name="phone"
              id="phone"
              label="Phone number"
              rules={
                isCreateMode
                  ? undefined
                  : { validate: validateOptionalPhoneValue }
              }
              placeholder="Enter your phone number"
              variant="pill"
              disabled={isSubmitting}
              showOtpHint={phoneOtpRequired}
              requireVerification={phoneOtpRequired}
              otpHint="Verify your phone with OTP before saving."
              trustedPhone={trustedPhone}
              onVerifiedChange={setPhoneVerified}
            />
            {phoneOtpRequired && phone?.trim() ? (
              <div className="mt-2">
                <VerificationBadge verified={phoneOk} label="Phone" />
              </div>
            ) : null}
          </div>

          {isSelfMode ? (
            <EmailOtpModal
              open={emailModalOpen}
              email={normalizeEmail(email)}
              onClose={() => setEmailModalOpen(false)}
              onVerified={() => setEmailVerified(true)}
            />
          ) : null}

          {!isSelfMode ? (
            <div>
              <label
                className="block text-sm font-medium text-default-900 mb-2"
                htmlFor="role"
              >
                Role
                {isCreateMode ? (
                  <span className="text-required"> *</span>
                ) : null}
              </label>
              <select
                id="role"
                disabled={isSubmitting}
                className={inputClassName}
                {...register(
                  "role",
                  isCreateMode ? { required: "Role is required." } : {},
                )}
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role?.message ? (
                <span className={errorClassName}>{errors.role.message}</span>
              ) : null}
            </div>
          ) : null}

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="zip_code"
            >
              Zip Code
              {isCreateMode ? (
                <span className="text-required"> *</span>
              ) : null}
            </label>
            <input
              id="zip_code"
              type="text"
              placeholder="Please enter your zip code"
              disabled={isSubmitting}
              className={inputClassName}
              {...register(
                "zip_code",
                isCreateMode
                  ? {
                      required: "Zip code is required.",
                      pattern: {
                        value: /^[A-Za-z0-9\s-]{3,10}$/,
                        message: "Enter a valid zip code.",
                      },
                    }
                  : optionalZipCode(),
              )}
            />
            {errors.zip_code?.message ? (
              <span className={errorClassName}>{errors.zip_code.message}</span>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                validate: (value) => {
                  if (isRichTextEmpty(value)) return true;

                  const text = value
                    .replace(/<[^>]*>/g, " ")
                    .replace(/&nbsp;/gi, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                  return (
                    text.length <= 500 ||
                    "Description must be 500 characters or fewer."
                  );
                },
              }}
              render={({ field }) => (
                <RichTextEditor
                  id="description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isSubmitting}
                  toolbar="minimal"
                  minHeight={120}
                  placeholder="Please enter your description"
                />
              )}
            />
            {errors.description?.message ? (
              <span className={errorClassName}>
                {errors.description.message}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {!isSelfMode ? (
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-60"
            >
              <X className="size-5" />
              Close
            </button>
          ) : null}

          {isSelfMode && !canSave ? (
            <div className="flex flex-wrap justify-end gap-3">
              {!emailOk ? (
                <button
                  type="button"
                  onClick={() => void handleSendEmailOtp()}
                  disabled={isSubmitting || isSendingEmailOtp}
                  className="flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary/10 disabled:opacity-60"
                >
                  {isSendingEmailOtp ? "Sending..." : "Send OTP to email"}
                </button>
              ) : null}
              {phoneOtpRequired && !phoneOk ? (
                <button
                  type="button"
                  onClick={() => void handleSendPhoneOtp()}
                  disabled={isSubmitting || isSendingPhoneOtp}
                  className="flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary/10 disabled:opacity-60"
                >
                  {isSendingPhoneOtp ? "Sending..." : "Send OTP to phone"}
                </button>
              ) : null}
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 disabled:opacity-60"
            >
              <Save className="size-5" />
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
