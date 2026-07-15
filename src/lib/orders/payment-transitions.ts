import type { PaymentStatus } from "@/types/order";

export type PaymentTransitionActor = "client" | "webhook";

const CLIENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed"],
  failed: ["paid", "pending"],
  paid: [],
};

const WEBHOOK_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed", "pending"],
  failed: ["paid", "failed"],
  paid: ["paid"],
};

export function assertPaymentStatusTransition(
  actor: PaymentTransitionActor,
  from: PaymentStatus,
  to: PaymentStatus,
): { ok: true } | { ok: false; message: string } {
  if (from === to) {
    return { ok: true };
  }

  const allowed =
    actor === "client"
      ? CLIENT_TRANSITIONS[from]
      : WEBHOOK_TRANSITIONS[from];

  if (!allowed.includes(to)) {
    return {
      ok: false,
      message: `Payment status cannot move from "${from}" to "${to}" via ${actor}.`,
    };
  }

  return { ok: true };
}

export function normalizePaymentStatus(
  value: string | null | undefined,
): PaymentStatus {
  if (value === "paid" || value === "failed") {
    return value;
  }
  return "pending";
}
