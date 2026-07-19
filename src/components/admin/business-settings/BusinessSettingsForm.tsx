"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type FieldPath } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import { AppTooltip } from "@/components/common/AppTooltip";
import { SettingsFormSkeleton } from "@/components/skeleton";
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from "@/types/business-settings";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import { getPhoneDigits, validatePhoneValue } from "@/lib/phone-otp/phone";
import { deepMergeBusinessSettings } from "@/lib/business-settings/validate";
import { getAuthMethodDisabledMessage } from "@/lib/business-settings/auth-methods";
import { isProductionAppEnv } from "@/lib/app-env";

const errorClassName = "text-red-500 text-sm mt-1";

const toggleClassName =
  "relative h-7 w-[3.25rem] cursor-pointer appearance-none rounded-full border-2 border-transparent bg-default-200 transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:transition before:duration-200 before:ease-in-out checked:border-transparent checked:bg-none checked:!bg-primary checked:before:translate-x-full focus:ring-0 focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-60";

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: { settings?: BusinessSettings };
};

type ToggleFieldProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  /** Shown via AppTooltip on the switch (e.g. permission / off message). */
  tooltip?: string;
  onChange: (checked: boolean) => void;
};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-default-200 p-6">
      <div className="mb-6">
        <h4 className="text-xl font-medium text-default-900">{title}</h4>
        {description ? (
          <p className="mt-1 text-sm text-default-600">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function FieldGroup({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-default-900">
        {label}
      </label>
      {children}
      {error ? <p className={errorClassName}>{error}</p> : null}
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  disabled,
  tooltip,
  onChange,
}: ToggleFieldProps) {
  const switchControl = (
    <input
      type="checkbox"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={toggleClassName}
      checked={Boolean(checked)}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
    />
  );

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-default-200 p-4 md:col-span-2">
      <div>
        <p className="text-sm font-medium text-default-900">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-default-600">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${checked ? "text-primary" : "text-default-400"
            }`}
        >
          {checked ? "On" : "Off"}
        </span>
        {tooltip ? (
          <AppTooltip content={tooltip} isMobile side="top">
            <span className="inline-flex">{switchControl}</span>
          </AppTooltip>
        ) : (
          switchControl
        )}
      </div>
    </div>
  );
}

export default function BusinessSettingsForm() {
  const [loading, setLoading] = useState(true);
  const { setSettings: setGlobalBusinessSettings } = useBusinessSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSettings>({
    defaultValues: DEFAULT_BUSINESS_SETTINGS,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadSettings = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/admin/business-settings", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({}))) as ApiResponse;

        if (!active) return;

        if (!response.ok || !data.success || !data.data?.settings) {
          toast.error(data.message ?? "Failed to load business settings.");
          return;
        }

        reset(
          deepMergeBusinessSettings(
            DEFAULT_BUSINESS_SETTINGS,
            data.data.settings,
          ),
        );
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load business settings.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload: BusinessSettings = {
      ...values,
      support: {
        ...values.support,
        phone: getPhoneDigits(values.support.phone),
      },
    };

    try {
      const response = await fetch("/api/admin/business-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || !data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            setError(field as FieldPath<BusinessSettings>, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message ?? "Failed to save business settings.");
        return;
      }

      if (data.data?.settings) {
        const next = deepMergeBusinessSettings(
          DEFAULT_BUSINESS_SETTINGS,
          data.data.settings,
        );
        reset(next);
        setGlobalBusinessSettings(next);
      }

      toast.success(data.message ?? "Business settings saved successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save business settings.",
      );
    }
  });

  if (loading) {
    return <SettingsFormSkeleton sections={7} />
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <SettingsSection
        title="General"
        description="Basic site information shown across the storefront."
      >
        <FieldGroup label="Site name" error={errors.general?.site_name?.message}>
          <Input
            {...register("general.site_name", { required: "Site name is required." })}
            disabled={isSubmitting}
            placeholder="Yum"
          />
        </FieldGroup>

        <FieldGroup label="Site URL" error={errors.general?.site_url?.message}>
          <Input
            {...register("general.site_url", { required: "Site URL is required." })}
            disabled={isSubmitting}
            placeholder={`Enter your site URL`}
          />
        </FieldGroup>

        <FieldGroup label="Currency code" error={errors.general?.currency?.message}>
          <Input
            {...register("general.currency", { required: "Currency code is required." })}
            disabled={isSubmitting}
            placeholder="INR"
          />
        </FieldGroup>

        <FieldGroup
          label="Currency symbol"
          error={errors.general?.currency_symbol?.message}
        >
          <Input
            {...register("general.currency_symbol", {
              required: "Currency symbol is required.",
            })}
            disabled={isSubmitting}
            placeholder="₹"
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Authentication"
        description="Choose which sign-in methods customers can use on login and register pages."
      >
        <ToggleField
          label="Email login & register"
          description="Allow customers to sign in or register with email and password."
          checked={watch("auth.email_login_register")}
          disabled={isSubmitting}
          tooltip={
            watch("auth.email_login_register")
              ? "Customers can sign in and register with email."
              : getAuthMethodDisabledMessage("email")
          }
          onChange={(checked) => setValue("auth.email_login_register", checked)}
        />

        <ToggleField
          label="Google login & register"
          description="Allow customers to sign in or register with Google."
          checked={watch("auth.google_login_register")}
          disabled={isSubmitting}
          tooltip={
            watch("auth.google_login_register")
              ? "Customers can sign in and register with Google."
              : getAuthMethodDisabledMessage("google")
          }
          onChange={(checked) => setValue("auth.google_login_register", checked)}
        />

        <ToggleField
          label="Phone login & register"
          description="Allow customers to sign in or register with mobile OTP. Requires OTP mode to be enabled."
          checked={watch("auth.phone_login_register")}
          disabled={isSubmitting}
          tooltip={
            watch("auth.phone_login_register")
              ? "Customers can sign in and register with phone OTP."
              : getAuthMethodDisabledMessage("phone")
          }
          onChange={(checked) => setValue("auth.phone_login_register", checked)}
        />
      </SettingsSection>

      <SettingsSection
        title="Orders"
        description="Control checkout rules and delivery pricing."
      >
        <ToggleField
          label="Cash on delivery"
          description="Allow customers to pay with cash on delivery."
          checked={watch("order.cod_enabled")}
          disabled={isSubmitting}
          onChange={(checked) => setValue("order.cod_enabled", checked)}
        />

        <ToggleField
          label="Online payment"
          description="Allow customers to pay online at checkout."
          checked={watch("order.online_payment_enabled")}
          disabled={isSubmitting}
          onChange={(checked) => setValue("order.online_payment_enabled", checked)}
        />

        <FieldGroup
          label="Minimum order amount"
          error={errors.order?.min_order_amount?.message}
        >
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("order.min_order_amount", {
              valueAsNumber: true,
              min: { value: 0, message: "Minimum order amount must be 0 or greater." },
            })}
            disabled={isSubmitting}
          />
        </FieldGroup>

        <FieldGroup
          label="Delivery charge"
          error={errors.order?.delivery_charge?.message}
        >
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("order.delivery_charge", {
              valueAsNumber: true,
              min: { value: 0, message: "Delivery charge must be 0 or greater." },
            })}
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-default-500">
            Amount customers pay for delivery. Set to 0 for free delivery.
          </p>
        </FieldGroup>

        <FieldGroup
          label="Miscellaneous fee"
          error={errors.order?.miscellaneous_fee?.message}
        >
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("order.miscellaneous_fee", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Miscellaneous fee must be 0 or greater.",
              },
            })}
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-default-500">
            Flat platform / handling fee (includes payment gateway costs). Shown
            as a single line on the order summary.
          </p>
        </FieldGroup>

        <ToggleField
          label="Enforce store hours"
          description="Block checkout when the store is outside open hours."
          checked={watch("order.store_hours_enabled")}
          disabled={isSubmitting}
          onChange={(checked) => setValue("order.store_hours_enabled", checked)}
        />

        <FieldGroup
          label="Opens at"
          error={errors.order?.open_time?.message}
        >
          <Input
            type="time"
            {...register("order.open_time", {
              required: "Open time is required.",
            })}
            disabled={isSubmitting || !watch("order.store_hours_enabled")}
          />
        </FieldGroup>

        <FieldGroup
          label="Closes at"
          error={errors.order?.close_time?.message}
        >
          <Input
            type="time"
            {...register("order.close_time", {
              required: "Close time is required.",
            })}
            disabled={isSubmitting || !watch("order.store_hours_enabled")}
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Phone verification"
        description="Configure OTP mode and when verification is required."
      >
        <FieldGroup
          label="OTP mode"
          error={errors.phone_verification?.mode?.message}
          className="md:col-span-2"
        >
          <Input
            as="select"
            {...register("phone_verification.mode", {
              required: "OTP mode is required.",
            })}
            disabled={isSubmitting}
          >
            <option value="off">Off</option>
            {!isProductionAppEnv() ? (
              <option value="test_local">Test (local)</option>
            ) : null}
            <option value="test">Test (Supabase test numbers)</option>
            <option value="production">Production (real SMS)</option>
          </Input>
          <p className="mt-2 text-xs text-default-500">
            {!isProductionAppEnv()
              ? "Test (local) accepts OTP 000000 for any valid phone number — no SMS is sent. "
              : null}
            Test (Supabase) uses fixed OTP numbers from Supabase Dashboard → Auth → Phone.
            Production sends real SMS through your Supabase phone provider.
            {isProductionAppEnv()
              ? " Local test OTP (000000) is disabled in production."
              : null}
          </p>
        </FieldGroup>

        <ToggleField
          label="Required for registration"
          description="Require phone verification when creating an account."
          checked={watch("phone_verification.required_for.registration")}
          disabled={isSubmitting || watch("phone_verification.mode") === "off"}
          onChange={(checked) =>
            setValue("phone_verification.required_for.registration", checked)
          }
        />

        <ToggleField
          label="Required for checkout"
          description="Require phone verification before placing an order."
          checked={watch("phone_verification.required_for.checkout")}
          disabled={isSubmitting || watch("phone_verification.mode") === "off"}
          onChange={(checked) =>
            setValue("phone_verification.required_for.checkout", checked)
          }
        />

        <ToggleField
          label="Required for profile update"
          description="Require phone verification when changing profile phone number."
          checked={watch("phone_verification.required_for.profile_update")}
          disabled={isSubmitting || watch("phone_verification.mode") === "off"}
          onChange={(checked) =>
            setValue("phone_verification.required_for.profile_update", checked)
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Payment"
        description="Toggle payment providers. API keys remain in environment variables."
      >
        <ToggleField
          label="Razorpay enabled"
          description="Allow Razorpay checkout when online payment is enabled."
          checked={watch("payment.razorpay_enabled")}
          disabled={isSubmitting}
          onChange={(checked) => setValue("payment.razorpay_enabled", checked)}
        />
      </SettingsSection>

      <SettingsSection
        title="Support"
        description="Contact details shown to customers."
      >
        <FieldGroup label="Support email" error={errors.support?.email?.message}>
          <Input
            type="email"
            {...register("support.email", { required: "Support email is required." })}
            disabled={isSubmitting}
            placeholder="support@yum.com"
          />
        </FieldGroup>

        <FieldGroup label="Support phone" error={errors.support?.phone?.message}>
          <Controller
            control={control}
            name="support.phone"
            rules={{ validate: validatePhoneValue }}
            render={({ field, fieldState }) => (
              <PhoneInput
                id="support-phone"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                placeholder="Enter support phone number"
                error={Boolean(fieldState.error)}
              />
            )}
          />
        </FieldGroup>
      </SettingsSection>

      <SettingsSection
        title="Social"
        description="Social profile usernames shown in the footer."
      >
        <FieldGroup label="Instagram username" error={errors.social?.instagram?.message}>
          <Input
            {...register("social.instagram")}
            disabled={isSubmitting}
            placeholder="yumstore"
          />
        </FieldGroup>

        <FieldGroup label="Twitter / X username" error={errors.social?.twitter?.message}>
          <Input
            {...register("social.twitter")}
            disabled={isSubmitting}
            placeholder="yumstore"
          />
        </FieldGroup>
      </SettingsSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-primary-700 hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          Save settings
        </button>
      </div>
    </form>
  );
}
