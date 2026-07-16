"use client";

import { useEffect, useId, useState } from "react";
import { Filter, X } from "lucide-react";
import {
  DEFAULT_ORDER_LIST_FILTERS,
  type OrderListFilters,
} from "@/lib/supabase/orders";
import { useActiveTableNumbers } from "@/hooks/use-active-table-numbers";
import type { OrderStatus, PaymentStatus } from "@/types/order";

const ORDER_STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus | "all"; label: string }[] =
  [
    { value: "all", label: "All payments" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
  ];

const fieldClassName =
  "block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 text-sm text-default-900 focus:border-default-300 focus:ring-0 dark:bg-default-50";

type OrderFiltersModalProps = {
  open: boolean;
  filters: OrderListFilters;
  onClose: () => void;
  onApply: (filters: OrderListFilters) => void;
};

export default function OrderFiltersModal({
  open,
  filters,
  onClose,
  onApply,
}: OrderFiltersModalProps) {
  const titleId = useId();
  const [draft, setDraft] = useState<OrderListFilters>(filters);
  const { tableNumbers, loading: tableNumbersLoading } = useActiveTableNumbers();

  useEffect(() => {
    if (!open) return;
    setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleClear = () => {
    const cleared = { ...DEFAULT_ORDER_LIST_FILTERS };
    setDraft(cleared);
    onApply(cleared);
    onClose();
  };

  const handleApply = () => {
    onApply({
      ...DEFAULT_ORDER_LIST_FILTERS,
      ...draft,
      tableNumber: draft.tableNumber?.trim() || undefined,
      search: draft.search?.trim() || undefined,
    });
    onClose();
  };

  const tableOptions = [...tableNumbers];
  const selectedTable = draft.tableNumber?.trim();
  if (selectedTable && !tableOptions.includes(selectedTable)) {
    tableOptions.unshift(selectedTable);
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:bg-default-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-default-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" aria-hidden />
            <h3 id={titleId} className="text-base font-semibold text-default-900">
              Filter Orders
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-default-500 hover:bg-default-100"
            aria-label="Close filter dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-3 text-sm font-medium text-default-800">Date range</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${titleId}-date-from`}
                  className="mb-2 block text-sm text-default-600"
                >
                  From
                </label>
                <input
                  id={`${titleId}-date-from`}
                  type="date"
                  value={draft.dateFrom ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      dateFrom: event.target.value || undefined,
                    }))
                  }
                  className={fieldClassName}
                />
              </div>
              <div>
                <label
                  htmlFor={`${titleId}-date-to`}
                  className="mb-2 block text-sm text-default-600"
                >
                  To
                </label>
                <input
                  id={`${titleId}-date-to`}
                  type="date"
                  value={draft.dateTo ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      dateTo: event.target.value || undefined,
                    }))
                  }
                  className={fieldClassName}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${titleId}-order-status`}
                className="mb-2 block text-sm font-medium text-default-800"
              >
                Order status
              </label>
              <select
                id={`${titleId}-order-status`}
                value={draft.orderStatus ?? "all"}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    orderStatus: event.target.value as OrderStatus | "all",
                  }))
                }
                className={fieldClassName}
              >
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`${titleId}-payment-status`}
                className="mb-2 block text-sm font-medium text-default-800"
              >
                Payment status
              </label>
              <select
                id={`${titleId}-payment-status`}
                value={draft.paymentStatus ?? "all"}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    paymentStatus: event.target.value as PaymentStatus | "all",
                  }))
                }
                className={fieldClassName}
              >
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor={`${titleId}-table-number`}
              className="mb-2 block text-sm font-medium text-default-800"
            >
              Table number
            </label>
            <select
              id={`${titleId}-table-number`}
              value={draft.tableNumber ?? ""}
              disabled={tableNumbersLoading && tableOptions.length === 0}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  tableNumber: event.target.value || undefined,
                }))
              }
              className={fieldClassName}
            >
              <option value="">
                {tableNumbersLoading && tableOptions.length === 0
                  ? "Loading tables..."
                  : "All tables"}
              </option>
              {tableOptions.map((tableNumber) => (
                <option key={tableNumber} value={tableNumber}>
                  {tableNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${titleId}-search`}
              className="mb-2 block text-sm font-medium text-default-800"
            >
              Search
            </label>
            <input
              id={`${titleId}-search`}
              type="search"
              value={draft.search ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              placeholder="Phone number or address"
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-default-200 px-5 py-4">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-default-200 px-4 py-2 text-sm font-medium text-default-700 hover:bg-default-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-full border border-primary bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-500"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
