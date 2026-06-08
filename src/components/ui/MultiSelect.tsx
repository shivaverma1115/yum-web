"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  id?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  "aria-label"?: string;
};

export default function MultiSelect({
  id: idProp,
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  error,
  className = "",
  "aria-label": ariaLabel,
}: MultiSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((entry) => entry !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);
  const triggerText = selectedLabels.length
    ? selectedLabels.join(", ")
    : placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-default-200 bg-transparent px-4 py-2.5 text-left text-sm focus:border-default-200 focus:ring-transparent disabled:opacity-60 dark:bg-default-50"
      >
        <span
          className={
            selectedLabels.length ? "text-default-900" : "text-default-500"
          }
        >
          {triggerText}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-default-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-default-200 bg-white py-1 shadow-lg dark:bg-default-50"
        >
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggleOption(option.value)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-default-800 hover:bg-default-100"
                >
                  <span
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-default-300 bg-white"
                    }`}
                    aria-hidden
                  >
                    {selected ? <Check className="h-3 w-3" /> : null}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
    </div>
  );
}
