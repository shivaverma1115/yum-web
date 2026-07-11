import { getOrderStatusLabel } from "@/components/admin/orders/order-details-shared";
import { formatOrderIdShort } from "@/lib/orders/order-number";
import { sendPushToUser } from "@/lib/notifications/send-push";
import { logError } from "@/lib/utils/logError";
import type { IOrder, PaymentStatus } from "@/types/order";

export type OrderNotificationKind = "status" | "payment";

export type OrderNotificationPayload = {
  kind: OrderNotificationKind;
  order: IOrder;
  previousStatus?: IOrder["status"];
  previousPaymentStatus?: PaymentStatus;
};

function getPaymentStatusLabel(status: PaymentStatus): string {
  if (status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending";
}

export function buildOrderNotificationMessage(
  payload: OrderNotificationPayload,
): { title: string; body: string } | null {
  const orderRef = formatOrderIdShort(payload.order);

  if (payload.kind === "status") {
    const nextStatus = payload.order.status;
    if (!nextStatus || nextStatus === payload.previousStatus) return null;

    const label = getOrderStatusLabel(
      nextStatus,
      payload.order.fulfillment_type,
    );

    return {
      title: "Order status updated",
      body: `Order ${orderRef} is now ${label}.`,
    };
  }

  const nextPaymentStatus = payload.order.payment_status ?? "pending";
  if (nextPaymentStatus === payload.previousPaymentStatus) return null;

  const label = getPaymentStatusLabel(nextPaymentStatus);

  return {
    title: "Payment update",
    body: `Payment for order ${orderRef} is now ${label}.`,
  };
}

export async function sendOrderUpdateNotification(
  payload: OrderNotificationPayload,
): Promise<void> {
  const userId = payload.order.user_id?.trim();
  if (!userId || !payload.order.id) return;

  const message = buildOrderNotificationMessage(payload);
  if (!message) return;

  const result = await sendPushToUser(userId, {
    title: message.title,
    body: message.body,
    link: "/user/orders",
    data: {
      orderId: payload.order.id,
      kind: payload.kind,
      status: payload.order.status ?? "",
      paymentStatus: payload.order.payment_status ?? "",
      url: "/user/orders",
    },
  });

  if (!result.success && result.skippedReason) {
    console.info("[fcm] order-update skipped", {
      userId,
      orderId: payload.order.id,
      kind: payload.kind,
      reason: result.skippedReason,
    });
    return;
  }

  if (result.failureCount > 0) {
    logError(new Error("Order push notification partially failed"), {
      context: "Order push notification",
      userId,
      meta: {
        orderId: payload.order.id,
        kind: payload.kind,
        successCount: result.successCount,
        failureCount: result.failureCount,
        errors: result.errors,
      },
    });
  }
}

export function notifyOrderUpdateInBackground(
  payload: OrderNotificationPayload,
): void {
  void sendOrderUpdateNotification(payload).catch((error) => {
    logError(error, {
      context: "Order push notification background",
      meta: {
        orderId: payload.order.id,
        kind: payload.kind,
      },
    });
  });
}
