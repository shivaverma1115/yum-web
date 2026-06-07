"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { COUNTRIES, STATES } from "@/lib/constants";
import type { IUserAddress, UserAddressType } from "@/types/user-address";

const inputClassName =
  "block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";

const errorClassName = "text-red-500 text-sm mt-1";

const emptyAddress = (addressType: UserAddressType): IUserAddress => ({
  user_id: "",
  address_type: addressType,
  first_name: "",
  last_name: "",
  company_name: "",
  address_line: "",
  country: COUNTRIES[0] ?? "",
  state: STATES[0] ?? "",
  city: "",
  zip_code: "",
  email: "",
  phone: "",
});

type UserAddressFormProps = {
  title: string;
  addressType: UserAddressType;
  initialAddress?: IUserAddress | null;
  onSaved?: (address: IUserAddress) => void;
};

export default function UserAddressForm({
  title,
  addressType,
  initialAddress,
  onSaved,
}: UserAddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUserAddress>({
    defaultValues: initialAddress ?? emptyAddress(addressType),
  });

  useEffect(() => {
    reset(initialAddress ?? emptyAddress(addressType));
  }, [addressType, initialAddress, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/account/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_type: addressType,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          address_line: values.address_line,
          country: values.country,
          state: values.state,
          city: values.city,
          zip_code: values.zip_code,
          email: values.email,
          phone: values.phone,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Something went wrong.");
        return;
      }

      toast.success(data.message ?? "Address saved successfully.");
      if (data.data?.address) {
        reset(data.data.address);
        onSaved?.(data.data.address);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  });

  return (
    <div className="p-6 border rounded-lg border-default-200">
      <h4 className="text-xl font-medium text-default-900 mb-6">{title}</h4>

      <form className="grid lg:grid-cols-2 gap-6" onSubmit={onSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_first_name`}>
            First Name
          </label>
          <input
            id={`${addressType}_first_name`}
            type="text"
            placeholder="Enter your first name"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("first_name", { required: "First name is required." })}
          />
          {errors.first_name?.message ? (
            <span className={errorClassName}>{errors.first_name.message}</span>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_last_name`}>
            Last Name
          </label>
          <input
            id={`${addressType}_last_name`}
            type="text"
            placeholder="Enter your last name"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("last_name", { required: "Last name is required." })}
          />
          {errors.last_name?.message ? (
            <span className={errorClassName}>{errors.last_name.message}</span>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_company_name`}>
            Company Name (Optional)
          </label>
          <input
            id={`${addressType}_company_name`}
            type="text"
            placeholder="Company name"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("company_name")}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_address_line`}>
            Address
          </label>
          <input
            id={`${addressType}_address_line`}
            type="text"
            placeholder="Street address"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("address_line")}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_country`}>
            Country/Region
          </label>
          <select
            id={`${addressType}_country`}
            disabled={isSubmitting}
            className={inputClassName}
            {...register("country")}
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_state`}>
            State
          </label>
          <select
            id={`${addressType}_state`}
            disabled={isSubmitting}
            className={inputClassName}
            {...register("state")}
          >
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_city`}>
            City
          </label>
          <input
            id={`${addressType}_city`}
            type="text"
            placeholder="City"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("city")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_zip_code`}>
            Zip Code
          </label>
          <input
            id={`${addressType}_zip_code`}
            type="text"
            placeholder="Zip code"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("zip_code")}
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_email`}>
            Email
          </label>
          <input
            id={`${addressType}_email`}
            type="email"
            placeholder="Email address"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("email", {
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

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-default-900 mb-2" htmlFor={`${addressType}_phone`}>
            Phone Number
          </label>
          <input
            id={`${addressType}_phone`}
            type="tel"
            placeholder="Phone number"
            disabled={isSubmitting}
            className={inputClassName}
            {...register("phone")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
