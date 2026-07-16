import type { FulfillmentType, OrderStatus } from "@/types/order";

export function getTimelineLabels(fulfillment: FulfillmentType): string[] {
  if (fulfillment === "delivery") {
    return ["Pending", "Confirmed", "On the way", "Delivered"];
  }
  if (fulfillment === "pickup") {
    return ["Pending", "Confirmed", "Preparing", "Ready for pickup"];
  }
  return ["Pending", "Confirmed", "Preparing", "Served"];
}

const STATUS_STEP_INDEX: Record<Exclude<OrderStatus, "cancelled">, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  completed: 3,
};

/** Server-safe status label (do not import from client components). */
export function getOrderStatusLabel(
  status: OrderStatus,
  fulfillment: FulfillmentType,
): string {
  if (status === "cancelled") return "Cancelled";

  const labels = getTimelineLabels(fulfillment);
  return labels[STATUS_STEP_INDEX[status]] ?? status;
}

export function getOrderStatusOptions(fulfillment: FulfillmentType) {
  const labels = getTimelineLabels(fulfillment);

  return [
    { value: "pending" as const, label: labels[0] },
    { value: "confirmed" as const, label: labels[1] },
    { value: "processing" as const, label: labels[2] },
    { value: "completed" as const, label: labels[3] },
    { value: "cancelled" as const, label: "Cancelled" },
  ];
}
