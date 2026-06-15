"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import { watchOrderPaymentStatus } from "@/lib/razorpay/poll-payment";
import type { PaymentWatchResult } from "@/lib/razorpay/poll-payment";

type ProcessingState = "loading" | PaymentWatchResult["status"] | "error";

export default function PaymentProcessing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")?.trim() ?? "";
  const { clearCart } = useCart();
  const { user, refresh: refreshUser } = useContextApi();
  const [state, setState] = useState<ProcessingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const ordersPath = `/${user?.role ?? "user"}/orders`;

  const handleRefreshStatus = useCallback(() => {
    setIsManualRefresh(true);
    setState("loading");
    setErrorMessage(null);
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setState("error");
      setErrorMessage("Order reference is missing.");
      return;
    }

    const controller = new AbortController();
    let active = true;

    const watchPayment = async () => {
      try {
        const result = await watchOrderPaymentStatus(orderId, controller.signal);
        if (!active) return;

        setState(result.status);

        if (result.status === "paid") {
          clearCart();
          await refreshUser();
        }
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        setState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not verify payment status.",
        );
      } finally {
        if (active) {
          setIsManualRefresh(false);
        }
      }
    };

    void watchPayment();

    return () => {
      active = false;
      controller.abort();
    };
  }, [orderId, refreshKey, clearCart, refreshUser]);

  useEffect(() => {
    if (state !== "paid") return;

    const timer = window.setTimeout(() => {
      router.replace(ordersPath);
      router.refresh();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state, router, ordersPath]);

  const refreshButton = (
    <button
      type="button"
      onClick={handleRefreshStatus}
      disabled={state === "loading"}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-default-200 bg-white px-6 py-2.5 text-sm font-medium text-default-800 transition-colors hover:bg-default-50 disabled:opacity-60"
    >
      <RefreshCw
        className={`h-4 w-4 ${state === "loading" && isManualRefresh ? "animate-spin" : ""}`}
        aria-hidden
      />
      Refresh status
    </button>
  );

  if (!orderId) {
    return (
      <ProcessingShell>
        <StatusCard
          icon={<XCircle className="h-12 w-12 text-red-500" aria-hidden />}
          title="Invalid payment session"
          description="We could not find your order reference. Please check your orders or try checkout again."
          action={
            <Link
              href={ordersPath}
              className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
            >
              Go to My Orders
            </Link>
          }
        />
      </ProcessingShell>
    );
  }

  if (state === "loading") {
    return (
      <ProcessingShell orderId={orderId}>
        <StatusCard
          icon={<Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden />}
          title="Processing your payment"
          description="Please wait while we confirm your payment with the bank. This can take up to a minute after a retry. Do not close this page."
        />
      </ProcessingShell>
    );
  }

  if (state === "paid") {
    return (
      <ProcessingShell orderId={orderId}>
        <StatusCard
          icon={<CheckCircle2 className="h-12 w-12 text-green-500" aria-hidden />}
          title="Payment successful"
          description="Your order is confirmed. Redirecting you to your orders…"
          action={
            <Link
              href={ordersPath}
              className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
            >
              View My Orders
            </Link>
          }
        />
      </ProcessingShell>
    );
  }

  if (state === "failed") {
    return (
      <ProcessingShell orderId={orderId}>
        <StatusCard
          icon={<XCircle className="h-12 w-12 text-red-500" aria-hidden />}
          title="Payment failed"
          description="Your payment could not be confirmed. If money was deducted, wait a moment and refresh — or pay again from My Orders."
          action={
            <ActionRow>
              {refreshButton}
              <Link
                href={ordersPath}
                className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
              >
                Go to My Orders
              </Link>
            </ActionRow>
          }
        />
      </ProcessingShell>
    );
  }

  if (state === "error") {
    return (
      <ProcessingShell orderId={orderId}>
        <StatusCard
          icon={<XCircle className="h-12 w-12 text-red-500" aria-hidden />}
          title="Something went wrong"
          description={errorMessage ?? "We could not verify your payment status."}
          action={
            <ActionRow>
              {refreshButton}
              <Link
                href={ordersPath}
                className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
              >
                Go to My Orders
              </Link>
            </ActionRow>
          }
        />
      </ProcessingShell>
    );
  }

  return (
    <ProcessingShell orderId={orderId}>
      <StatusCard
        icon={<Clock className="h-12 w-12 text-amber-500" aria-hidden />}
        title="Payment still processing"
        description="We have not received final confirmation yet. If money was deducted, it should update shortly. Refresh the status or check My Orders."
        action={
          <ActionRow>
            {refreshButton}
            <Link
              href={ordersPath}
              className="inline-flex rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
            >
              Go to My Orders
            </Link>
          </ActionRow>
        }
      />
    </ProcessingShell>
  );
}

function ProcessingShell({
  children,
  orderId,
}: {
  children: React.ReactNode;
  orderId?: string;
}) {
  return (
    <section className="lg:py-10 py-6">
      <div className="container max-w-lg">
        {orderId ? (
          <p className="mb-4 text-center text-xs text-default-500">
            Order reference: <span className="font-mono">{orderId}</span>
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {children}
    </div>
  );
}

function StatusCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-default-200 bg-white p-8 text-center dark:bg-default-50">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h1 className="text-xl font-semibold text-default-900 mb-2">{title}</h1>
      <p className="text-sm text-default-600 mb-6">{description}</p>
      {action ? action : null}
    </div>
  );
}
