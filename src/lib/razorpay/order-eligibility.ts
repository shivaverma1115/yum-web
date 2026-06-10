import type { IOrder } from "@/types/order";

export function canRetryOnlinePayment(order: IOrder): boolean {
  return (
    order.payment_method === "online" &&
    order.status !== "cancelled" &&
    (order.payment_status === "pending" || order.payment_status === "failed")
  );
}
