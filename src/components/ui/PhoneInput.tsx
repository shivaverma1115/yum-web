"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { inputClassName } from "@/components/ui/Input";

const ReactPhoneInput = dynamic(() => import("react-phone-input-2"), {
  ssr: false,
  loading: () => (
    <input
      disabled
      className={`${inputClassName} opacity-60`}
      placeholder="Loading phone input..."
      aria-hidden
    />
  ),
});

export type PhoneInputVariant = "default" | "pill";

export type PhoneInputProps = {
  id?: string;
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  preferredCountries?: string[];
  enableSearch?: boolean;
  variant?: PhoneInputVariant;
  className?: string;
  error?: boolean;
};

/** Converts stored phone (+E.164 or digits) to react-phone-input-2 value. */
export function toPhoneInputValue(phone?: string | null): string {
  if (!phone?.trim()) return "";
  return phone.replace(/\D/g, "");
}

/** Normalizes react-phone-input-2 value to E.164 (+digits). */
export function toStoredPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

const variantClass: Record<PhoneInputVariant, string> = {
  default: "yum-phone-input--default",
  pill: "yum-phone-input--pill",
};

export default function PhoneInput({
  id,
  name,
  value = "",
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Enter phone number",
  defaultCountry = "in",
  preferredCountries = ["in", "us", "gb", "ae"],
  enableSearch = true,
  variant = "default",
  className = "",
  error = false,
}: PhoneInputProps) {
  const inputValue = useMemo(() => toPhoneInputValue(value), [value]);
  const containerClass = [
    "yum-phone-input",
    variantClass[variant],
    error ? "yum-phone-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ReactPhoneInput
      country={defaultCountry}
      preferredCountries={preferredCountries}
      enableSearch={enableSearch}
      value={inputValue}
      disabled={disabled}
      placeholder={placeholder}
      containerClass={containerClass}
      inputClass="yum-phone-input__field"
      buttonClass="yum-phone-input__button"
      dropdownClass="yum-phone-input__dropdown"
      searchClass="yum-phone-input__search"
      onChange={(nextValue) => onChange(toStoredPhone(nextValue))}
      onBlur={() => onBlur?.()}
      inputProps={{
        id,
        name,
        required: false,
        autoComplete: "tel",
      }}
      countryCodeEditable={false}
      copyNumbersOnly
    />
  );
}
