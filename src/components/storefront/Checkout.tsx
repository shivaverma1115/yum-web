"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
    PhoneVerification,
    type PhoneVerificationHandle,
} from "@/components/common/phone-verification";
import { toast } from "react-toastify";
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import { getDefaultPaymentMethod, getPaymentOptionsForFulfillment } from "@/lib/payment/payment-options";
import { confirmOrderPayment } from "@/lib/payment/confirm-payment";
import { openRazorpayCheckout } from "@/lib/razorpay/client";
import { formatCurrency } from "@/lib/constants";
import { getNationalMobileDigits } from "@/lib/phone-otp/phone";
import { IUser } from "@/types/user";
import { FulfillmentType, OnlinePaymentPhase, PaymentMethod } from "@/types/order";

const inputClass = "block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200";

export default function Checkout() {
    const router = useRouter();
    const { user, loading: userLoading, refresh: refreshUser } = useContextApi();
    const { items, subtotal, clearCart } = useCart();

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

    /** Fulfillment type */
    const fulfillmentType = watch("fulfillment_type");
    const paymentMethod = watch("payment_method");
    const phone = watch("phone");

    /** Payment options */
    const paymentOptions = getPaymentOptionsForFulfillment(fulfillmentType);
    const fulfillmentLabel = FULFILLMENT_OPTIONS.find((o) => o.value === fulfillmentType)?.label;
    const needsContact = fulfillmentType === "delivery" || fulfillmentType === "pickup";

    /** Phone verification */
    const phoneVerificationRef = useRef<PhoneVerificationHandle>(null);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const hasPhoneEntered = getNationalMobileDigits(phone).length > 0;
    const showSendOtp = needsContact && !phoneVerified && hasPhoneEntered;

    useEffect(() => {
        if (userLoading) return;
        reset(buildCheckoutDefaults(user));
    }, [user, userLoading, reset]);

    useEffect(() => {
        if (items.length === 0 && !isSubmitting) {
            router.replace("/cart");
        }
    }, [items.length, isSubmitting, router]);

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

    /** Build order body */
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
        ...extras,
        items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.image_url ?? null,
        })),
    });

    const finishOrderSuccess = async (
        loggedIn?: boolean,
        redirectTo?: string,
    ) => {
        toast.success("Order placed successfully.");
        clearCart();

        if (loggedIn) {
            await refreshUser();
            router.push(redirectTo ?? "/user/orders");
            router.refresh();
            return;
        }

        router.push(redirectTo ?? "/home");
        router.refresh();
    };

    const placeOrder = async (values: CheckoutFormValues) => {
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
            Boolean(data.data?.loggedIn),
            data.data?.redirectTo as string | undefined,
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
            if (values.payment_method === "online") {
                const createResponse = await fetch("/api/payments/razorpay/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: subtotal }),
                });
                const createData = await createResponse.json().catch(() => ({}));

                if (!createResponse.ok || !createData.success) {
                    toast.error(createData.message ?? "Could not start online payment.");
                    return;
                }

                const razorpayOrderId = createData.data.orderId as string;

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
                    toast.error(pendingData.message ?? "Failed to create order.");
                    return;
                }

                const yumOrderId = pendingData.data?.order?.id as string | undefined;
                const guestLoggedIn = Boolean(pendingData.data?.loggedIn);
                const guestRedirectTo = pendingData.data?.redirectTo as
                    | string
                    | undefined;
                if (!yumOrderId) {
                    toast.error("Order id missing from server response.");
                    return;
                }

                try {
                    const payment = await openRazorpayCheckout({
                        keyId: createData.data.keyId,
                        orderId: razorpayOrderId,
                        amount: createData.data.amount,
                        currency: createData.data.currency,
                        name: "Yum",
                        description: "Food order payment",
                        prefill: {
                            name: "Guest",
                            email: undefined,
                            contact: values.phone || "",
                        },
                    });

                    toast.info("Confirming payment. Please wait...");
                    await confirmOrderPayment(yumOrderId, payment);
                    await finishOrderSuccess(guestLoggedIn, guestRedirectTo);
                } catch (error) {
                    if (error instanceof Error && error.message === "Payment cancelled.") {
                        toast.info(
                            "Payment cancelled. Your order is saved as pending payment.",
                        );
                        return;
                    }
                    throw error;
                }
                return;
            }

            await placeOrder(values);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to place order.",
            );
        }
    });

    if (items.length === 0) {
        return (
            <section className="lg:py-10 py-6">
                <div className="container text-center py-16 text-sm text-default-500">
                    Redirecting to cart...
                </div>
            </section>
        );
    }

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
                                            <Link href="/login?redirectTo=/checkout" className="text-primary">
                                                Sign in
                                            </Link>{" "}
                                            to auto-fill your phone number.
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
                                        disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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

                                {items.map((item) => (
                                    <div key={item.productId} className="flex items-center mb-4">
                                        <img
                                            src={item.image_url ?? "/images/dishes/pizza.png"}
                                            alt={item.name}
                                            className="h-20 w-20 me-2 object-cover rounded"
                                        />
                                        <div>
                                            <h4 className="text-sm text-default-600 mb-2">{item.name}</h4>
                                            <h4 className="text-sm text-default-400">
                                                {item.quantity} x{" "}
                                                <span className="text-primary font-semibold">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                ))}

                                <div className="mb-6">
                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Sub-total</p>
                                        <p className="text-sm text-default-700 font-medium">
                                            {formatCurrency(subtotal)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">
                                            {fulfillmentType === "delivery" ? "Delivery" : "Service"}
                                        </p>
                                        <p className="text-sm text-default-700 font-medium">Free</p>
                                    </div>
                                    <div className="border-b border-default-200 my-4" />
                                    <div className="flex justify-between mb-3">
                                        <p className="text-base text-default-700">Total</p>
                                        <p className="text-base text-default-700 font-medium">
                                            {formatCurrency(subtotal)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type={showSendOtp ? "button" : "submit"}
                                    onClick={showSendOtp ? () => void handleSendOtp() : undefined}
                                    disabled={isSubmitting || isSendingOtp}
                                    className="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500 disabled:opacity-60"
                                >
                                    {isSendingOtp
                                        ? "Sending OTP..."
                                        : isSubmitting
                                            ? paymentMethod === "online"
                                                ? "Processing payment..."
                                                : "Placing order..."
                                            : showSendOtp
                                                ? "Send OTP"
                                                : paymentMethod === "online"
                                                    ? "Pay & Place Order"
                                                    : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}


export type CheckoutFormValues = Omit<CheckoutPayload, "items">;

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

export type CheckoutPayload = Pick<IUser, "email" | "phone"> & {
    address: string;
    table_number: string;
    additional_notes: string;
    fulfillment_type: FulfillmentType;
    payment_method: PaymentMethod;
    payment_phase?: OnlinePaymentPhase;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    items: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
        imageUrl?: string | null;
    }[];
};

export function buildCheckoutDefaults(user: IUser | null): CheckoutFormValues {
    return {
        fulfillment_type: FULFILLMENT_OPTIONS[0].value,
        phone: user?.phone ?? "",
        email: user?.email ?? null,
        address: "",
        table_number: "",
        payment_method: getDefaultPaymentMethod(FULFILLMENT_OPTIONS[0].value),
        additional_notes: "",
    };
}
