"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
} from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import PhoneInput, { type PhoneInputVariant } from "@/components/ui/PhoneInput";
import PhoneOtpModal from "@/components/common/phone-verification/PhoneOtpModal";
import { usePhoneVerification } from "@/components/common/phone-verification/usePhoneVerification";
import { validatePhoneValue } from "@/lib/phone-otp/phone";

export type PhoneVerificationHandle = {
  isVerified: boolean;
  isSending: boolean;
  requestOtp: () => Promise<boolean>;
};

export { validatePhoneValue };

type FieldProps = {
  id?: string;
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  variant?: PhoneInputVariant;
  className?: string;
  error?: string | boolean;
  onVerifiedChange?: (verified: boolean) => void;
};

type ControlledPhoneVerificationProps = FieldProps & {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

type RhfPhoneVerificationProps<T extends FieldValues> = FieldProps & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

export type PhoneVerificationProps<T extends FieldValues = FieldValues> =
  | ControlledPhoneVerificationProps
  | RhfPhoneVerificationProps<T>;

function PhoneVerificationField(
  {
    phone,
    onChange,
    onBlur,
    id = "phone",
    label,
    placeholder = "Enter phone number",
    disabled = false,
    variant = "default",
    className = "",
    error,
    onVerifiedChange,
    verification,
  }: {
    phone: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    id?: string;
    label?: ReactNode;
    placeholder?: string;
    disabled?: boolean;
    variant?: PhoneInputVariant;
    className?: string;
    error?: string | boolean;
    onVerifiedChange?: (verified: boolean) => void;
    verification: ReturnType<typeof usePhoneVerification>;
  },
) {
  const {
    isVerified,
    modalOpen,
    closeModal,
    markVerified,
  } = verification;

  useEffect(() => {
    onVerifiedChange?.(isVerified);
  }, [isVerified, onVerifiedChange]);

  const errorMessage = typeof error === "string" ? error : undefined;
  const hasError = Boolean(error);

  return (
    <>
      {label ? (
        <label htmlFor={id} className="mb-2 block text-sm text-default-700">
          {label}
        </label>
      ) : null}

      <div className="space-y-2">
        <PhoneInput
          id={id}
          value={phone}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          variant={variant}
          error={hasError}
          className={className}
        />

        {isVerified ? (
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            Phone number verified
          </p>
        ) : (
          <p className="text-xs text-default-500">
            Verify your phone with OTP before placing the order.
          </p>
        )}

        {errorMessage ? (
          <span className="block text-sm text-red-500">{errorMessage}</span>
        ) : null}
      </div>

      <PhoneOtpModal
        open={modalOpen}
        phone={phone}
        onClose={closeModal}
        onVerified={markVerified}
      />
    </>
  );
}

const PhoneVerificationControlled = forwardRef<
  PhoneVerificationHandle,
  ControlledPhoneVerificationProps
>(function PhoneVerificationControlled(props, ref) {
  const verification = usePhoneVerification(props.value);

  useImperativeHandle(
    ref,
    () => ({
      isVerified: verification.isVerified,
      isSending: verification.isSending,
      requestOtp: verification.sendOtp,
    }),
    [
      verification.isVerified,
      verification.isSending,
      verification.sendOtp,
    ],
  );

  return (
    <PhoneVerificationField
      phone={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      id={props.id}
      label={props.label}
      placeholder={props.placeholder}
      disabled={props.disabled}
      variant={props.variant}
      className={props.className}
      error={props.error}
      onVerifiedChange={props.onVerifiedChange}
      verification={verification}
    />
  );
});

type RhfBridgeProps<T extends FieldValues> = RhfPhoneVerificationProps<T> & {
  verificationRef?: React.Ref<PhoneVerificationHandle>;
};

function PhoneVerificationRhfBridge<T extends FieldValues>({
  control,
  name,
  rules,
  verificationRef,
  error,
  ...rest
}: RhfBridgeProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: validatePhoneValue,
        ...rules,
      }}
      render={({ field, fieldState }) => (
        <PhoneVerificationControlled
          ref={verificationRef}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error ?? fieldState.error?.message}
          {...rest}
        />
      )}
    />
  );
}

function PhoneVerificationRoot<T extends FieldValues>(
  props: PhoneVerificationProps<T>,
  ref: React.Ref<PhoneVerificationHandle>,
) {
  if ("control" in props && "name" in props) {
    const rhfProps = props as RhfPhoneVerificationProps<T>;
    return (
      <PhoneVerificationRhfBridge
        {...rhfProps}
        verificationRef={ref}
      />
    );
  }

  return (
    <PhoneVerificationControlled
      ref={ref}
      {...(props as ControlledPhoneVerificationProps)}
    />
  );
}

const PhoneVerification = forwardRef(PhoneVerificationRoot) as <
  T extends FieldValues = FieldValues,
>(
  props: PhoneVerificationProps<T> & {
    ref?: React.Ref<PhoneVerificationHandle>;
  },
) => React.ReactElement;

export default PhoneVerification;
