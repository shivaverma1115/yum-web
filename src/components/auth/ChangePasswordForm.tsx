"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const inputClassName =
  "block w-full rounded-s-full py-2.5 px-4 bg-transparent border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

const errorClassName = "text-red-500 text-sm mt-1";

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm<ChangePasswordValues>>["register"]>;
};

function PasswordField({
  id,
  label,
  autoComplete,
  placeholder,
  disabled,
  error,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="flex">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={inputClassName}
          {...registration}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-transparent -ms-px border-default-200"
          aria-label={visible ? "Hide password" : "Show password"}
          disabled={disabled}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? (
            <EyeOff className="h-5 w-5 text-default-600" aria-hidden />
          ) : (
            <Eye className="h-5 w-5 text-default-600" aria-hidden />
          )}
        </button>
      </div>
      {error ? <span className={errorClassName}>{error}</span> : null}
    </div>
  );
}

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Something went wrong.");
        return;
      }

      toast.success(data.message ?? "Password updated successfully.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-default-500 mb-4">
        Leave current password empty if you are setting a password for the first time.
      </p>

      <PasswordField
        id="current_password"
        label="Current Password"
        autoComplete="current-password"
        placeholder="Enter your current password"
        disabled={isSubmitting}
        error={errors.currentPassword?.message}
        registration={register("currentPassword")}
      />

      <PasswordField
        id="new_password"
        label="New Password"
        autoComplete="new-password"
        placeholder="Enter new password"
        disabled={isSubmitting}
        error={errors.newPassword?.message}
        registration={register("newPassword", {
          required: "New password is required.",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters.",
          },
        })}
      />

      <PasswordField
        id="confirm_password"
        label="Confirm Password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        disabled={isSubmitting}
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword", {
          required: "Please confirm your password.",
          validate: (value) =>
            value === newPassword || "Passwords do not match.",
        })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
