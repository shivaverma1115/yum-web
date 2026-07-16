import { getOrderStatusLabel } from "@/lib/orders/status-label";
import { formatOrderIdShort } from "@/lib/orders/order-number";
import { sendPushToUser } from "@/lib/notifications/send-push";
import { logError } from "@/lib/utils/logError";
import type { IOrder, PaymentStatus } from "@/types/order";

export type NotifyMessage = {
  title: string;
  body: string;
  link?: string;
  data?: Record<string, string>;
};

function paymentLabel(status: PaymentStatus | null | undefined): string {
  if (status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending";
}

/**
 * Send a push notification to a user. Safe no-op if they have no tokens.
 * Use from any server route / lib.
 */
export async function notifyUser(
  userId: string | null | undefined,
  message: NotifyMessage,
): Promise<void> {
  const id = userId?.trim();
  if (!id || !message.title.trim()) return;

  const result = await sendPushToUser(id, {
    title: message.title,
    body: message.body,
    link: message.link,
    data: message.data,
  });

  if (!result.success && result.skippedReason) {
    console.info("[notify] skipped", { userId: id, reason: result.skippedReason });
    return;
  }

  if (!result.success && result.failureCount > 0) {
    logError(new Error("Push notification failed"), {
      context: "notifyUser",
      userId: id,
      meta: {
        successCount: result.successCount,
        failureCount: result.failureCount,
        errors: result.errors,
      },
    });
    return;
  }

  if (result.failureCount > 0) {
    logError(new Error("Push notification partially failed"), {
      context: "notifyUser",
      userId: id,
      meta: {
        successCount: result.successCount,
        failureCount: result.failureCount,
        errors: result.errors,
      },
    });
  }
}

/** Fire-and-forget — does not block the API response. */
export function notifyUserInBackground(
  userId: string | null | undefined,
  message: NotifyMessage,
): void {
  void notifyUser(userId, message).catch((error) => {
    logError(error, {
      context: "notifyUserInBackground",
      meta: { userId },
    });
  });
}

const ORDERS_LINK = "/user/orders";

function orderData(
  order: IOrder,
  kind: string,
): Record<string, string> {
  return {
    orderId: order.id ?? "",
    kind,
    status: order.status ?? "",
    paymentStatus: order.payment_status ?? "",
    url: ORDERS_LINK,
  };
}

/** New order placed (COD or confirmed). */
export async function notifyOrderPlaced(order: IOrder): Promise<void> {
  try {
    const ref = formatOrderIdShort(order);
    const statusLabel = getOrderStatusLabel(
      order.status ?? "pending",
      order.fulfillment_type,
    );
    const payLabel = paymentLabel(order.payment_status);

    await notifyUser(order.user_id, {
      title: "Order placed",
      body: `Order ${ref}: ${statusLabel} · Payment ${payLabel}.`,
      link: ORDERS_LINK,
      data: orderData(order, "placed"),
    });
  } catch (error) {
    logError(error, {
      context: "notifyOrderPlaced",
      meta: { orderId: order.id },
    });
  }
}

/** Order status changed (e.g. admin update). */
export async function notifyOrderStatus(
  order: IOrder,
  previousStatus?: IOrder["status"],
): Promise<void> {
  try {
    const next = order.status;
    if (!next || next === previousStatus) return;

    const ref = formatOrderIdShort(order);
    const label = getOrderStatusLabel(next, order.fulfillment_type);

    await notifyUser(order.user_id, {
      title: "Order status updated",
      body: `Order ${ref} is now ${label}.`,
      link: ORDERS_LINK,
      data: orderData(order, "status"),
    });
  } catch (error) {
    logError(error, {
      context: "notifyOrderStatus",
      meta: { orderId: order.id },
    });
  }
}

/** Payment status changed (webhook / client confirm). */
export async function notifyPaymentUpdate(
  order: IOrder,
  previousPaymentStatus?: PaymentStatus,
): Promise<void> {
  try {
    const next = order.payment_status ?? "pending";
    if (next === previousPaymentStatus) return;

    const ref = formatOrderIdShort(order);

    await notifyUser(order.user_id, {
      title: "Payment update",
      body: `Payment for order ${ref} is now ${paymentLabel(next)}.`,
      link: ORDERS_LINK,
      data: orderData(order, "payment"),
    });
  } catch (error) {
    logError(error, {
      context: "notifyPaymentUpdate",
      meta: { orderId: order.id },
    });
  }
}
