"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import {
  getOrderStatusLabel,
  getOrderStatusOptions,
  ORDER_STATUS_COLORS,
} from "@/components/admin/orders/order-details-shared";
import Badge from "@/components/ui/Badge";
import { getBadgeDotClassName } from "@/lib/badge-colors";
import type { FulfillmentType, OrderStatus } from "@/types/order";

type OrderStatusDropdownProps = {
  orderId: string;
  status: OrderStatus;
  fulfillment: FulfillmentType;
  onStatusUpdated: (orderId: string, status: OrderStatus) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

function stopRowToggle(event: React.SyntheticEvent) {
  event.stopPropagation();
}

export default function OrderStatusDropdown({
  orderId,
  status,
  fulfillment,
  onStatusUpdated,
}: OrderStatusDropdownProps) {
  const statusOptions = getOrderStatusOptions(fulfillment);
  const statusLabel = getOrderStatusLabel(status, fulfillment);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateMenuPosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: rect.width,
    });
  };

  const closeMenu = () => setOpen(false);

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopRowToggle(event);
    if (updating) return;

    setOpen((isOpen) => {
      if (isOpen) return false;
      updateMenuPosition();
      return true;
    });
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      closeMenu();
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const handleSelect = async (
    event: React.MouseEvent<HTMLButtonElement>,
    nextStatus: OrderStatus,
  ) => {
    stopRowToggle(event);
    if (nextStatus === status || updating) return;

    closeMenu();

    const confirmed = window.confirm(
      `Change order status from "${getOrderStatusLabel(status, fulfillment)}" to "${getOrderStatusLabel(nextStatus, fulfillment)}"?`,
    );
    if (!confirmed) return;

    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Failed to update order status.");
        return;
      }

      onStatusUpdated(orderId, nextStatus);
      toast.success(data.message ?? "Order status updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const menu =
    open && menuPosition
      ? createPortal(
          <div
            className="fixed z-[100] min-w-[10rem] rounded-lg border border-default-100 bg-white p-1.5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] dark:bg-default-50"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              minWidth: menuPosition.minWidth,
            }}
            onMouseDown={stopRowToggle}
            onClick={stopRowToggle}
          >
            <ul className="flex flex-col gap-1">
              {statusOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={(event) => void handleSelect(event, option.value)}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-start font-normal capitalize transition-all ${status === option.value
                      ? "bg-default-400/20 text-default-700"
                      : "text-default-600 hover:bg-default-400/20 hover:text-default-700"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${getBadgeDotClassName(ORDER_STATUS_COLORS[option.value])}`}
                      aria-hidden
                    />
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onMouseDown={stopRowToggle}
      onClick={stopRowToggle}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={updating}
        onMouseDown={stopRowToggle}
        onClick={toggleMenu}
        className={`inline-flex transition-opacity ${updating ? "cursor-wait opacity-60" : "cursor-pointer"}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Order status: ${statusLabel}`}
      >
        <Badge color={ORDER_STATUS_COLORS[status]} className="gap-1.5 px-3">
          {statusLabel}
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </Badge>
      </button>
      {menu}
    </div>
  );
}
