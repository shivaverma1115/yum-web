import {
  formatOrderIdShort,
  getOrderStatusLabel,
} from "@/components/admin/orders/order-details-shared";
import { createAdminClient } from "@/lib/supabase/admin";
import { listEnabledPushTokensForUser } from "@/lib/supabase/push-tokens";
import { sendPushToTokens } from "@/lib/notifications/send-push";
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
  const orderRef = formatOrderIdShort(payload.order.id);

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

  const admin = createAdminClient();
  const tokens = await listEnabledPushTokensForUser(admin, userId);
  if (tokens.length === 0) return;

  await sendPushToTokens(tokens, {
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
}

export function notifyOrderUpdateInBackground(
  payload: OrderNotificationPayload,
): void {
  void sendOrderUpdateNotification(payload);
}
