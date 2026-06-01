"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserRole, type IUser } from "@/types/user";
import { COUNTRIES, STATES } from "@/lib/constants";

export interface UserDetailsFormProps {
  user?: IUser;
}
type UserDetailsFormValues = IUser & { password?: string };
const inputClassName =
  "block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

const errorClassName = "text-red-500 text-sm mt-1";

function getDefaultValues(user?: IUser): UserDetailsFormValues {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    full_name: user?.full_name ?? "",
    user_name: user?.user_name ?? "",
    role: user?.role ?? UserRole.USER,
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "",
    state: user?.state ?? "",
    zip_code: user?.zip_code ?? "",
    description: user?.description ?? "",
    password: "",
    created_at: user?.created_at ?? "",
    updated_at: user?.updated_at ?? "",
  };
}

export default function UserDetailsForm({ user }: UserDetailsFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(user?.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserDetailsFormValues>({
    defaultValues: getDefaultValues(user),
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      user_name: values.user_name.trim(),
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country,
      state: values.state,
      zip_code: values.zip_code.trim(),
      role: values.role,
      description: values.description.trim(),
      ...(values.password ? { password: values.password } : {}),
    };
    console.log(payload);
    try {
      // const response = await fetch(
      //   isEditMode
      //     ? `/api/admin/customers/${user!.id}`
      //     : "/api/admin/customers",
      //   {
      //     method: isEditMode ? "PATCH" : "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   },
      // );

      // const data = await response.json().catch(() => ({}));

      // if (!response.ok || !data.success) {
      //   toast.error(data.message ?? "Something went wrong.");
      //   return;
      // }

      // toast.success(data.message);
      // router.push("/admin/customers");
      // router.refresh();
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
              Last Name
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
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="user_name"
            >
              User Name
            </label>
            <input
              id="user_name"
              type="text"
              placeholder="Enter Your User Name"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("user_name", {
                required: "User name is required.",
                minLength: {
                  value: 3,
                  message: "User name must be at least 3 characters.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Use letters, numbers, and underscores only.",
                },
              })}
            />
            {errors.user_name?.message ? (
              <span className={errorClassName}>{errors.user_name.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="demoexample@mail.com"
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
              <span className={errorClassName}>{errors.email.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1-123-XXX-4567"
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

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder={
                isEditMode
                  ? "Leave blank to keep current password"
                  : "Enter a password"
              }
              autoComplete="new-password"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("password", {
                required: isEditMode ? false : "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
            />
            {errors.password?.message ? (
              <span className={errorClassName}>{errors.password.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="country"
            >
              Country/Region
            </label>
            <select
              id="country"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("country", {
                required: "Country is required.",
              })}
            >
              {COUNTRIES.map((country: string) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country?.message ? (
              <span className={errorClassName}>{errors.country.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="state"
            >
              State
            </label>
            <select
              id="state"
              disabled={isSubmitting}
              className={inputClassName}
              {...register("state", {
                required: "State is required.",
              })}
            >
              {STATES.map((state: string) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state?.message ? (
              <span className={errorClassName}>{errors.state.message}</span>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="role"
            >
              Role
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

          <div>
            <label
              className="block text-sm font-medium text-default-900 mb-2"
              htmlFor="zip_code"
            >
              Zip Code
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
              placeholder="Enter customer description"
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
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-60"
          >
            <i data-lucide="x" className="w-5 h-5" />
            Close
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 disabled:opacity-60"
          >
            <i data-lucide="save" className="w-5 h-5" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
