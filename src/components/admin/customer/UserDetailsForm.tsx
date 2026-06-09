"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserRole, type IUser } from "@/types/user";
import { Info, Save, X } from "lucide-react";
import { useContextApi } from "@/context-api/use-context";

export interface UserDetailsFormProps {
  user?: IUser;
  /** self = own profile via /api/account/customers; admin = manage customers */
  mode?: "self" | "admin";
}
const inputClassName =
  "block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

const errorClassName = "text-red-500 text-sm mt-1";

export default function UserDetailsForm({
  user,
  mode = "admin",
}: UserDetailsFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(user?.id);
  const isSelfMode = mode === "self";
  const { setUser } = useContextApi();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUser>({
    defaultValues: user ?? {},
  });

  const onSubmit = handleSubmit(async (values) => {
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
        toast.error(data.message ?? "Something went wrong.");
        return;
      }
      if (isSelfMode) {
        setUser(data.data.user);
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
              First Name <span className="text-required">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter Your First Name"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("first_name", {
                required: "First name is required.",
                minLength: {
                  value: 2,
                  message: "Enter at least 2 characters.",
                },
              })}
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
              Last Name <span className="text-required">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter Your Last Name"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("last_name", {
                required: "Last name is required.",
                minLength: {
                  value: 2,
                  message: "Enter at least 2 characters.",
                },
              })}
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
              <span>
                Email <span className="text-required">*</span>
              </span>
              {isEditMode ? (
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
              readOnly={isEditMode}
              disabled={isSubmitting}
              className={inputClassName}
              aria-describedby={isEditMode ? "email-help" : undefined}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {isEditMode ? (
              <p id="email-help" className="sr-only">
                Email cannot be edited after account creation.
              </p>
            ) : null}
            {errors.email?.message ? (
              <span className={errorClassName}>{errors.email.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="phone"
            >
              Phone Number <span className="text-required">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Please enter your phone number"
              autoComplete="tel"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("phone", {
                required: "Phone number is required.",
                pattern: {
                  value: /^[+]?[\d\s()-]{7,20}$/,
                  message: "Enter a valid phone number.",
                },
              })}
            />
            {errors.phone?.message ? (
              <span className={errorClassName}>{errors.phone.message}</span>
            ) : null}
          </div>

          {!isSelfMode ? (
            <div>
              <label
                className="block text-sm font-medium text-default-900 mb-2"
                htmlFor="role"
              >
                Role <span className="text-required">*</span>
              </label>
              <select
                id="role"
                disabled={isSubmitting}
                className={inputClassName}
                {...register("role", {
                  required: "Role is required.",
                })}
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
              Zip Code <span className="text-required">*</span>
            </label>
            <input
              id="zip_code"
              type="text"
              placeholder="Please enter your zip code"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("zip_code", {
                required: "Zip code is required.",
                pattern: {
                  value: /^[A-Za-z0-9\s-]{3,10}$/,
                  message: "Enter a valid zip code.",
                },
              })}
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
            <textarea
              id="description"
              rows={5}
              placeholder="Please enter your description"
              disabled={isSubmitting}
              className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 disabled:opacity-60"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description must be 500 characters or fewer.",
                },
              })}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 disabled:opacity-60"
          >
            <Save className="size-5" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
