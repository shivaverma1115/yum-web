"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
import { canRetryOnlinePayment } from "@/lib/razorpay/order-eligibility";
import { runRetryOrderPayment } from "@/lib/razorpay/order-payment-flow";
import { getUserDisplayName } from "@/lib/user/display-name";
import type { IOrderWithItems } from "@/types/order";

type PayOrderButtonProps = {
  order: IOrderWithItems;
  onPaymentUpdated?: () => void;
};

export default function PayOrderButton({
  order,
  onPaymentUpdated,
}: PayOrderButtonProps) {
  const { user } = useContextApi();
  const [paying, setPaying] = useState(false);

  if (!order.id || !canRetryOnlinePayment(order)) {
    return null;
  }

  const handlePay = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setPaying(true);
    try {
      const result = await runRetryOrderPayment({
        orderId: order.id!,
        prefill: {
          name: user ? getUserDisplayName(user) : "",
          email: user?.email ?? undefined,
          contact: order.customer_phone,
        },
      });

      if (result.status === "success") {
        toast.success("Payment successful.");
        onPaymentUpdated?.();
        return;
      }

      if (result.status === "cancelled") {
        toast.info("Payment cancelled. You can try again anytime.");
        return;
      }

      toast.error(result.message || "Payment failed. Please try again.");
      onPaymentUpdated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment failed.",
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={paying}
      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {paying ? "Opening payment…" : "Pay now"}
    </button>
  );
}
