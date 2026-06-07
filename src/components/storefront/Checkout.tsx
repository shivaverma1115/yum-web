"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import {
    buildCheckoutDefaults,
    FULFILLMENT_OPTIONS,
    type CheckoutFormValues,
} from "@/lib/checkout/form-defaults";
import { getPaymentOptionsForFulfillment } from "@/lib/checkout/payment-options";
import { openRazorpayCheckout } from "@/lib/checkout/razorpay-client";
import { waitForOrderPaymentStatus } from "@/lib/checkout/wait-for-payment";
import { COUNTRIES, formatCurrency, STATES } from "@/lib/constants";

const inputClass =
    "block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200";

export default function Checkout() {
    const router = useRouter();
    const { user, loading: userLoading } = useContextApi();
    const { items, subtotal, clearCart } = useCart();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
        defaultValues: buildCheckoutDefaults(null),
    });

    const fulfillmentType = watch("fulfillment_type");
    const paymentMethod = watch("payment_method");
    const paymentOptions = getPaymentOptionsForFulfillment(fulfillmentType);
    const fulfillmentLabel =
        FULFILLMENT_OPTIONS.find((o) => o.value === fulfillmentType)?.label ?? "Order";

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

    const buildOrderBody = (
        values: CheckoutFormValues,
        extras?: {
            payment_phase?: "pending" | "complete";
            razorpay_order_id?: string;
            razorpay_payment_id?: string;
            razorpay_signature?: string;
        },
    ) => ({
        fulfillment_type: values.fulfillment_type,
        payment_method: values.payment_method,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        country: values.country,
        state: values.state,
        city: values.city,
        zip_code: values.zip_code,
        pickup_time: values.pickup_time,
        table_number: values.table_number,
        party_size: values.party_size ?? 0,
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

    const finishOrderSuccess = () => {
        toast.success("Order placed successfully.");
        clearCart();
        router.push("/home");
        router.refresh();
    };

    const placeOrder = async (values: CheckoutFormValues) => {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildOrderBody(values)),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            toast.error(data.message ?? "Failed to place order.");
            return false;
        }

        finishOrderSuccess();
        return true;
    };

    const onSubmit = handleSubmit(async (values) => {
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
                if (!yumOrderId) {
                    toast.error("Order id missing from server response.");
                    return;
                }

                try {
                    await openRazorpayCheckout({
                        keyId: createData.data.keyId,
                        orderId: razorpayOrderId,
                        amount: createData.data.amount,
                        currency: createData.data.currency,
                        name: "Yum",
                        description: "Food order payment",
                        prefill: {
                            name: `${values.first_name} ${values.last_name}`.trim(),
                            email: values.email,
                            contact: values.phone,
                        },
                    });

                    toast.info("Confirming payment. Please wait...");
                    await waitForOrderPaymentStatus(yumOrderId);
                    finishOrderSuccess();
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
                                                className={`flex flex-col items-center text-center gap-2 cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-primary/50 ${
                                                    isSelected
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

                            <div>
                                <h4 className="text-lg font-medium text-default-800 mb-6">
                                    Contact information
                                </h4>
                                {user ? (
                                    <p className="text-xs text-default-500 mb-4">
                                        Pre-filled from your profile. You can edit any field below.
                                    </p>
                                ) : (
                                    <p className="text-xs text-default-500 mb-4">
                                        <Link href="/login?redirectTo=/checkout" className="text-primary">
                                            Sign in
                                        </Link>{" "}
                                        to auto-fill your details.
                                    </p>
                                )}

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm text-default-700 mb-2">
                                            First name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                            disabled={isSubmitting}
                                            className={inputClass}
                                            {...register("first_name", { required: "First name is required." })}
                                        />
                                        {errors.first_name?.message ? (
                                            <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm text-default-700 mb-2">
                                            Last name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                            disabled={isSubmitting}
                                            className={inputClass}
                                            {...register("last_name", { required: "Last name is required." })}
                                        />
                                        {errors.last_name?.message ? (
                                            <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm text-default-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            disabled={isSubmitting}
                                            className={inputClass}
                                            {...register("email", {
                                                required: "Email is required.",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Enter a valid email.",
                                                },
                                            })}
                                        />
                                        {errors.email?.message ? (
                                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm text-default-700 mb-2">
                                            Phone number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            disabled={isSubmitting}
                                            className={inputClass}
                                            placeholder="Enter your phone number"
                                            {...register("phone", { required: "Phone is required." })}
                                        />
                                        {errors.phone?.message ? (
                                            <span className="text-red-500 text-sm">{errors.phone.message}</span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {fulfillmentType === "delivery" ? (
                                <div>
                                    <h4 className="text-lg font-medium text-default-800 mb-6">
                                        Delivery address
                                    </h4>
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <div className="lg:col-span-2">
                                            <label htmlFor="address" className="block text-sm text-default-700 mb-2">
                                                Street address
                                            </label>
                                            <input
                                                id="address"
                                                type="text"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                placeholder="Enter your street address"
                                                {...register("address", {
                                                    required: "Address is required for delivery.",
                                                })}
                                            />
                                            {errors.address?.message ? (
                                                <span className="text-red-500 text-sm">{errors.address.message}</span>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label htmlFor="country" className="block text-sm text-default-700 mb-2">
                                                Country
                                            </label>
                                            <select
                                                id="country"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                {...register("country", { required: "Country is required." })}
                                            >
                                                {COUNTRIES.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="state" className="block text-sm text-default-700 mb-2">
                                                Region / State
                                            </label>
                                            <select
                                                id="state"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                {...register("state", { required: "State is required." })}
                                            >
                                                {STATES.map((state) => (
                                                    <option key={state} value={state}>
                                                        {state}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm text-default-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="Enter your city"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                {...register("city", { required: "City is required." })}
                                            />
                                            {errors.city?.message ? (
                                                <span className="text-red-500 text-sm">{errors.city.message}</span>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm text-default-700 mb-2">
                                                Zip code
                                            </label>
                                            <input
                                                id="zipCode"
                                                type="text"
                                                placeholder="Enter your zip code"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                {...register("zip_code", { required: "Zip code is required." })}
                                            />
                                            {errors.zip_code?.message ? (
                                                <span className="text-red-500 text-sm">{errors.zip_code.message}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {fulfillmentType === "pickup" ? (
                                <div>
                                    <h4 className="text-lg font-medium text-default-800 mb-6">
                                        Pickup details
                                    </h4>
                                    <div>
                                        <label htmlFor="pickupTime" className="block text-sm text-default-700 mb-2">
                                            Preferred pickup time{" "}
                                            <span className="text-default-500">(optional)</span>
                                        </label>
                                        <input
                                            id="pickupTime"
                                            type="text"
                                            disabled={isSubmitting}
                                            className={inputClass}
                                            placeholder="Enter your preferred pickup time"
                                            {...register("pickup_time")}
                                        />
                                    </div>
                                </div>
                            ) : null}

                            {fulfillmentType === "dine_in" ? (
                                <div>
                                    <h4 className="text-lg font-medium text-default-800 mb-6">
                                        Table details
                                    </h4>
                                    <div className="grid lg:grid-cols-2 gap-6">
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
                                                    required: "Table number is required.",
                                                })}
                                            />
                                            {errors.table_number?.message ? (
                                                <span className="text-red-500 text-sm">{errors.table_number.message}</span>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label htmlFor="partySize" className="block text-sm text-default-700 mb-2">
                                                Party size{" "}
                                                <span className="text-default-500">(optional)</span>
                                            </label>
                                            <input
                                                id="partySize"
                                                type="text"
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                placeholder="Enter your party size"
                                                {...register("party_size")}
                                            />
                                        </div>
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
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500 disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? paymentMethod === "online"
                                            ? "Processing payment..."
                                            : "Placing order..."
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
