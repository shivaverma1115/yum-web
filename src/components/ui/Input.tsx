"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type WheelEvent,
} from "react";
export const inputClassName =
  "block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";
function preventNumberWheelChange(event: WheelEvent<HTMLInputElement>) {
  event.currentTarget.blur();
}

type SharedProps = {
  className?: string;
};

type InputAsInput = SharedProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type InputAsTextarea = SharedProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type InputAsSelect = SharedProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
  };

export type InputProps = InputAsInput | InputAsTextarea | InputAsSelect;

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(function Input(props, ref) {
  const { className = "", as, ...rest } = props;
  const classes = `${inputClassName} ${className}`.trim();

  if (as === "textarea") {
    const textareaProps = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={classes}
        {...textareaProps}
      />
    );
  }

  if (as === "select") {
    const selectProps = rest as SelectHTMLAttributes<HTMLSelectElement>;
    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        className={classes}
        {...selectProps}
      />
    );
  }

  const inputProps = rest as InputHTMLAttributes<HTMLInputElement>;
  const { type = "text", onWheel, ...inputRest } = inputProps;

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      className={classes}
      onWheel={
        type === "number"
          ? (event) => {
              preventNumberWheelChange(event);
              onWheel?.(event);
            }
          : onWheel
      }
      {...inputRest}
    />
  );
});

export default Input;
