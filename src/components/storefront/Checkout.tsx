"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PhoneVerification, { PhoneVerificationHandle } from "@/components/common/phone-verification/PhoneVerification";
import { AppTooltip } from "@/components/common/AppTooltip";
import { OrderSummaryBreakdown } from "@/components/common/OrderSummary";
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import { ensureCheckoutSession, type CheckoutSessionUser } from "@/lib/auth/ensure-checkout-session";
import { formatCartItemOptionsLabel } from "@/lib/cart/line";
import {
    computeCartBillSummary,
    feeConfigForFulfillment,
} from "@/lib/cart/totals";
import { getDefaultPaymentMethod, getPaymentOptionsForFulfillment } from "@/lib/payment/payment-options";
import { runCheckoutOnlinePayment } from "@/lib/razorpay/checkout-flow";
import { isOtpRequiredFor } from "@/lib/business-settings/phone-verification";
import {
    getStoreClosedMessage,
    isStoreOpen,
} from "@/lib/business-settings/store-hours";
import { formatCurrency } from "@/lib/constants";
import { loadTableQrContext } from "@/lib/table-qr/context";
import { getNationalMobileDigits } from "@/lib/phone-otp/phone";
import type { CheckoutFormValues } from "@/types/checkout";
import { FulfillmentType, OnlinePaymentPhase } from "@/types/order";
import { UserRole } from "@/types/user";
import { useBusinessSettings } from "@/context-api/business-settings-context";

const inputClass = "block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200";

export default function Checkout() {
    const router = useRouter();
    const { user, verification, loading: userLoading, refresh: refreshUser } = useContextApi();
    const { items, appliedCoupon, subtotal, couponDiscount, clearCart } = useCart();
    const { settings: businessSettings } = useBusinessSettings();
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
        defaultValues: buildCheckoutDefaults(null),
    });

    const fulfillmentType = watch("fulfillment_type");
    const paymentMethod = watch("payment_method");
    const phone = watch("phone");

    const checkoutBill = useMemo(
        () =>
            computeCartBillSummary({
                items,
                subtotal,
                couponDiscount,
                couponCode: appliedCoupon?.code ?? null,
                fees: feeConfigForFulfillment(businessSettings, fulfillmentType),
            }),
        [
            items,
            subtotal,
            couponDiscount,
            appliedCoupon?.code,
            businessSettings,
            fulfillmentType,
        ],
    );
    const amountToPay = checkoutBill.amountToPay;
    const isDelivery = fulfillmentType === "delivery";

    const paymentOptions = getPaymentOptionsForFulfillment(fulfillmentType);
    const fulfillmentLabel = FULFILLMENT_OPTIONS.find((o) => o.value === fulfillmentType)?.label;
    const needsContact = fulfillmentType === "delivery" || fulfillmentType === "pickup";

    const phoneVerificationRef = useRef<PhoneVerificationHandle>(null);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);
    /** Stays true through Razorpay + redirect (RHF isSubmitting ends before navigation). */
    const [isPaying, setIsPaying] = useState(false);
    // Keep button disabled after success until this page unmounts (isSubmitting ends before redirect).
    const isCheckoutBusy = isSubmitting || isPaying || orderCompleted;
    const hasPhoneEntered = getNationalMobileDigits(phone).length > 0;
    const checkoutOtpRequired = isOtpRequiredFor(businessSettings, "checkout");
    const storeOpen = isStoreOpen(businessSettings);
    const storeClosedMessage = getStoreClosedMessage(businessSettings);
    const trustedPhone =
        verification?.phone_verified && user?.phone ? user.phone : null;
    const showSendOtp =
        needsContact &&
        checkoutOtpRequired &&
        !phoneVerified &&
        hasPhoneEntered;

    useEffect(() => {
        if (userLoading) return;

        const defaults = buildCheckoutDefaults(user);
        const tableContext = loadTableQrContext();

        if (tableContext) {
            defaults.fulfillment_type = "dine_in";
            defaults.table_number = tableContext.table_number;
        }

        reset(defaults);
    }, [user, userLoading, reset]);

    useEffect(() => {
        if (orderCompleted) return;
        // if (items.length === 0 && !isSubmitting) {
        //     router.replace("/cart");
        // }
    }, [items.length, isSubmitting, orderCompleted, router]);

    useEffect(() => {
        if (!paymentOptions.some((option) => option.value === paymentMethod)) {
            setValue("payment_method", paymentOptions[0].value);
        }
    }, [fulfillmentType, paymentMethod, paymentOptions, setValue]);

    useEffect(() => {
        if (!needsContact) {
            setPhoneVerified(false);
        }
    }, [needsContact]);

    const buildOrderBody = (
        values: CheckoutFormValues,
        extras?: {
            payment_phase?: OnlinePaymentPhase;
            razorpay_order_id?: string;
            razorpay_payment_id?: string;
            razorpay_signature?: string;
        },
    ) => ({
        fulfillment_type: values.fulfillment_type,
        payment_method: values.payment_method,
        phone: values.phone,
        address: values.address,
        table_number: values.table_number,
        additional_notes: values.additional_notes,
        coupon_code: appliedCoupon?.code ?? null,
        ...extras,
        items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantName: item.variant?.name ?? null,
            customizationLabels: (item.customizations ?? []).map((c) => c.label),
        })),
    });

    const buildPaymentQuote = (values: CheckoutFormValues) => ({
        fulfillment_type: values.fulfillment_type,
        coupon_code: appliedCoupon?.code ?? null,
        items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantName: item.variant?.name ?? null,
            customizationLabels: (item.customizations ?? []).map((c) => c.label),
        })),
    });

    const finishOrderSuccess = async (
        redirectTo?: string,
        role: UserRole = user?.role ?? UserRole.USER,
    ) => {
        setOrderCompleted(true);
        toast.success("Order placed successfully.");
        clearCart();

        const ordersPath = `/${role}/orders`;
        router.replace(redirectTo ?? ordersPath);
        router.refresh();
        // Don't await — refresh can remount checkout and re-enable the button before redirect.
        void refreshUser();
    };

    const placeOrder = async (
        values: CheckoutFormValues,
        checkoutSession: CheckoutSessionUser,
    ) => {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(buildOrderBody(values)),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            toast.error(data.message ?? "Failed to place order.");
            return false;
        }

        await finishOrderSuccess(
            data.data?.redirectTo as string | undefined,
            checkoutSession.role,
        );
        return true;
    };

    const handleSendOtp = async () => {
        const valid = await trigger("phone");
        if (!valid) return;

        setIsSendingOtp(true);
        try {
            await phoneVerificationRef.current?.requestOtp();
        } finally {
            setIsSendingOtp(false);
        }
    };

    const onSubmit = handleSubmit(async (values) => {
        if (showSendOtp) {
            await handleSendOtp();
            return;
        }
        if (items.length === 0) {
            toast.error("Your cart is empty.");
            router.push("/cart");
            return;
        }

        try {
            const checkoutSession = await ensureCheckoutSession();
            await refreshUser();

            if (values.payment_method === "online") {
                setIsPaying(true);
                try {
                    const paymentResult = await runCheckoutOnlinePayment({
                        quote: buildPaymentQuote(values),
                        prefill: {
                            name: checkoutSession.displayName,
                            email: checkoutSession.email ?? "",
                            contact: values.phone ?? checkoutSession.phone,
                        },
                        createPendingOrder: async (razorpayOrderId) => {
                            const pendingResponse = await fetch("/api/orders", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify(
                                    buildOrderBody(values, {
                                        payment_phase: "pending",
                                        razorpay_order_id: razorpayOrderId,
                                    }),
                                ),
                            });
                            const pendingData = await pendingResponse.json().catch(() => ({}));

                            if (!pendingResponse.ok || !pendingData.success) {
                                throw new Error(
                                    pendingData.message ?? "Failed to create order.",
                                );
                            }

                            const orderId = pendingData.data?.order?.id as string | undefined;
                            if (!orderId) {
                                throw new Error("Order id missing from server response.");
                            }

                            return { orderId };
                        },
                    });

                    setOrderCompleted(true);
                    clearCart();
                    router.replace(paymentResult.redirectTo);
                    // Keep isPaying true until this page unmounts after navigation.
                    return;
                } catch (error) {
                    setIsPaying(false);
                    throw error;
                }
            }

            await placeOrder(values, checkoutSession);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to place order.",
            );
        }
    });

    if (items.length === 0 || orderCompleted || isPaying) {
        return (
            <section className="lg:py-10 py-6">
                <div className="container text-center py-16 text-sm text-default-500">
                    {orderCompleted || isPaying
                        ? "Order placed… Redirecting you to your orders."
                        : "Redirecting to cart..."}
                </div>
            </section>
        );
    }

    const submitLabel = !storeOpen
        ? paymentMethod === "online"
            ? "Pay & Place Order"
            : "Place Order"
        : isSendingOtp
          ? "Sending OTP..."
          : isCheckoutBusy
            ? paymentMethod === "online" || isPaying
                ? "Processing payment..."
                : "Placing order..."
            : showSendOtp
              ? "Send OTP"
              : paymentMethod === "online"
                ? "Pay & Place Order"
                : "Place Order";

    const submitButton = (
        <button
            type={!storeOpen || showSendOtp ? "button" : "submit"}
            onClick={storeOpen && showSendOtp ? () => void handleSendOtp() : undefined}
            disabled={!storeOpen || isCheckoutBusy || isSendingOtp}
            className={`w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm ${
                storeOpen
                    ? "transition-all duration-500 hover:bg-primary-500 disabled:opacity-60"
                    : "pointer-events-none opacity-60"
            }`}
        >
            {submitLabel}
        </button>
    );

    return (
        <section className="lg:py-10 py-6">
            <div className="container">
                <form onSubmit={onSubmit} noValidate>
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="lg:col-span-2 col-span-1 space-y-8">
                            <div>
                                <h4 className="text-lg font-medium text-default-800 mb-4">
                                    Order type
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {FULFILLMENT_OPTIONS.map((option) => {
                                        const inputId = `fulfillment-${option.value}`;
                                        const isSelected = fulfillmentType === option.value;

                                        return (
                                            <label
                                                key={option.value}
                                                htmlFor={inputId}
                                                className={`flex flex-col items-center text-center gap-2 cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-primary/50 ${isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-default-200"
                                                    }`}
                                            >
                                                <input
                                                    id={inputId}
                                                    type="radio"
                                                    value={option.value}
                                                    className="text-primary w-5 h-5 border-default-200 focus:ring-0"
                                                    {...register("fulfillment_type", {
                                                        required: "Select an order type.",
                                                    })}
                                                />
                                                <span>
                                                    <span className="block text-xs sm:text-sm font-medium text-default-800">
                                                        {option.label}
                                                    </span>
                                                    <span className="block text-[10px] sm:text-xs text-default-500 mt-0.5">
                                                        {option.description}
                                                    </span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.fulfillment_type?.message ? (
                                    <span className="text-red-500 text-sm">
                                        {errors.fulfillment_type.message}
                                    </span>
                                ) : null}
                            </div>

                            {needsContact ? (
                                <div>
                                    <h4 className="text-lg font-medium text-default-800 mb-6">
                                        Contact information
                                    </h4>
                                    {user?.phone ? (
                                        <p className="text-xs text-default-500 mb-4">
                                            Phone pre-filled from your profile. You can edit it below.
                                        </p>
                                    ) : (
                                        <p className="text-xs text-default-500 mb-4">
                                            Add your phone number for delivery or pickup updates.
                                        </p>
                                    )}

                                    <PhoneVerification<CheckoutFormValues>
                                        ref={phoneVerificationRef}
                                        control={control}
                                        name="phone"
                                        id="phone"
                                        label={
                                            <>
                                                Phone number{" "}
                                                <span className="text-required">*</span>
                                            </>
                                        }
                                        placeholder="Enter your phone number"
                                        variant="pill"
                                        disabled={isCheckoutBusy}
                                        trustedPhone={trustedPhone}
                                        requireVerification={checkoutOtpRequired}
                                        onVerifiedChange={setPhoneVerified}
                                    />
                                </div>
                            ) : null}

                            {fulfillmentType === "delivery" ? (
                                <div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm text-default-700 mb-2">
                                            Street address <span className="text-required">*</span>
                                        </label>
                                        <input
                                            id="address"
                                            type="text"
                                            disabled={isCheckoutBusy}
                                            className={inputClass}
                                            placeholder="Enter your street address"
                                            {...register("address", {
                                                validate: (value, formValues) => {
                                                    if (formValues.fulfillment_type !== "delivery") {
                                                        return true;
                                                    }
                                                    return value?.trim()
                                                        ? true
                                                        : "Street address is required for delivery.";
                                                },
                                            })}
                                        />
                                        {errors.address?.message ? (
                                            <span className="text-red-500 text-sm">{errors.address.message}</span>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}

                            {fulfillmentType === "dine_in" ? (
                                <div>
                                    <h4 className="text-lg font-medium text-default-800 mb-6">
                                        Table details
                                    </h4>
                                    <div>
                                        <label htmlFor="tableNumber" className="block text-sm text-default-700 mb-2">
                                            Table number
                                        </label>
                                        <input
                                            id="tableNumber"
                                            type="text"
                                            disabled={isCheckoutBusy}
                                            className={inputClass}
                                            placeholder="Enter your table number"
                                            {...register("table_number", {
                                                validate: (value, formValues) => {
                                                    if (formValues.fulfillment_type !== "dine_in") {
                                                        return true;
                                                    }
                                                    return value?.trim()
                                                        ? true
                                                        : "Table number is required.";
                                                },
                                            })}
                                        />
                                        {errors.table_number?.message ? (
                                            <span className="text-red-500 text-sm">{errors.table_number.message}</span>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                <h4 className="text-lg font-medium text-default-800 mb-6">
                                    Payment option
                                </h4>
                                <div className="border border-default-200 rounded-lg p-6 lg:w-5/6 mb-5">
                                    <p className="text-sm font-semibold text-default-800 mb-4">
                                        {fulfillmentLabel}
                                    </p>
                                    <div className="space-y-3">
                                        {paymentOptions.map((option) => {
                                            const inputId = `payment-${option.value}`;
                                            return (
                                                <label
                                                    key={option.value}
                                                    htmlFor={inputId}
                                                    className="flex items-center gap-3 cursor-pointer rounded-lg py-2 px-1 hover:bg-default-50"
                                                >
                                                    <input
                                                        id={inputId}
                                                        type="radio"
                                                        value={option.value}
                                                        className="text-primary w-5 h-5 border-default-200 focus:ring-0"
                                                        {...register("payment_method", {
                                                            required: "Select a payment option.",
                                                        })}
                                                    />
                                                    <i
                                                        data-lucide={option.icon}
                                                        className="text-primary size-5 shrink-0"
                                                    />
                                                    <span className="text-sm font-medium text-default-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {paymentMethod === "online" ? (
                                    <p className="text-sm text-default-500 mb-4">
                                        Pay securely with Razorpay when you place your order.
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-default-800 mb-6">
                                    Additional information
                                </h4>
                                <label htmlFor="additionalNotes" className="block text-sm text-default-700 mb-2">
                                    Order notes{" "}
                                    <span className="text-default-500">(optional)</span>
                                </label>
                                <textarea
                                    id="additionalNotes"
                                    rows={4}
                                    disabled={isCheckoutBusy}
                                    className="block w-full bg-transparent dark:bg-default-50 rounded-lg py-2.5 px-4 border border-default-200"
                                    placeholder="Notes about your order, e.g. special instructions for delivery"
                                    {...register("additional_notes")}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="border border-default-200 rounded-lg p-5 sticky top-24">
                                <h4 className="text-lg font-semibold text-default-700 mb-5">
                                    Order summary
                                </h4>

                                {items.map((item) => {
                                    const optionsLabel = formatCartItemOptionsLabel(item);

                                    return (
                                    <div key={item.lineId} className="flex items-center mb-4">
                                        <img
                                            src={item.image_url ?? "/images/dishes/pizza.png"}
                                            alt={item.name}
                                            className="h-20 w-20 me-2 object-cover rounded"
                                        />
                                        <div>
                                            <h4 className="text-sm text-default-600 mb-1">{item.name}</h4>
                                            {optionsLabel ? (
                                                <p className="mb-1 text-xs text-default-400">
                                                    {optionsLabel}
                                                </p>
                                            ) : null}
                                            <h4 className="text-sm text-default-400">
                                                {item.quantity} x{" "}
                                                <span className="text-primary font-semibold">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                    );
                                })}

                                <div className="mb-6">
                                    <OrderSummaryBreakdown
                                        bill={checkoutBill}
                                        mode="final"
                                        showDeliveryFee={isDelivery}
                                    />
                                </div>

                                {!storeOpen ? (
                                    <AppTooltip
                                        content={storeClosedMessage}
                                        isMobile
                                        side="top"
                                    >
                                        <span className="block w-full cursor-not-allowed">
                                            {submitButton}
                                        </span>
                                    </AppTooltip>
                                ) : (
                                    submitButton
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export const FULFILLMENT_OPTIONS: {
    value: FulfillmentType;
    label: string;
    description: string;
}[] = [
        {
            value: "delivery",
            label: "Delivery",
            description: "We deliver to your address.",
        },
        {
            value: "pickup",
            label: "Pickup",
            description: "Pick up your order at the restaurant.",
        },
        {
            value: "dine_in",
            label: "Dine In / On Table",
            description: "Enjoy your meal at your table.",
        },
    ];

export function buildCheckoutDefaults(
    user: { phone?: string } | null,
): CheckoutFormValues {
    return {
        fulfillment_type: FULFILLMENT_OPTIONS[0].value,
        phone: user?.phone ?? "",
        address: "",
        table_number: "",
        payment_method: getDefaultPaymentMethod(FULFILLMENT_OPTIONS[0].value),
        additional_notes: "",
    };
}
