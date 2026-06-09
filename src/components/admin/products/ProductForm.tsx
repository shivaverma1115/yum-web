"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, Package, Save, X } from "lucide-react";
import { fetchProductCategories } from "@/lib/api/categories";
import { formatCurrency, MAX_PRODUCT_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import ImageUploadField, {
    type ImageUploadValue,
} from "@/components/common/image/ImageUploadField";
import Input from "@/components/ui/Input";
import MultiSelect from "@/components/ui/MultiSelect";
import { validateProductImageFiles } from "@/lib/products/imageValidation";
import { normalizeOrderTypes, ORDER_TYPE_OPTIONS } from "@/lib/order-types";
import type { IProductCategory } from "@/types/product-category";
import type { IProduct, ProductFormInput } from "@/types/product";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { isRichTextEmpty } from "@/lib/rich-text";

const errorClassName = "text-red-500 text-sm mt-1";

const DEFAULT_FORM_VALUES: ProductFormInput = {
    name: "",
    category: "",
    selling_price: null,
    cost_price: null,
    quantity: null,
    order_type: [],
    short_description: "",
    long_description: "",
    add_discount: false,
    discount_percent: null,
    add_expiry_date: false,
    expiry_start_date: null,
    expiry_end_date: null,
    return_policy: false,
    image_url: null,
    image_urls: [],
};

type ApiResponse = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string>;
};

function buildProductFormData(
    values: ProductFormInput,
    imageValue: ImageUploadValue,
): FormData {
    const files = imageValue.files;
    const keptExistingUrls = imageValue.existingUrls;
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("selling_price", String(values.selling_price));
    formData.append("cost_price", String(values.cost_price));
    formData.append("quantity", String(values.quantity));
    for (const orderType of values.order_type) {
        formData.append("order_type", orderType);
    }
    formData.append("short_description", values.short_description);
    formData.append("long_description", values.long_description);
    formData.append("add_discount", String(values.add_discount));
    if (values.add_discount && values.discount_percent != null) {
        formData.append("discount_percent", String(values.discount_percent));
    }
    formData.append("add_expiry_date", String(values.add_expiry_date));
    if (values.add_expiry_date) {
        if (values.expiry_start_date) {
            formData.append("expiry_start_date", values.expiry_start_date);
        }
        if (values.expiry_end_date) {
            formData.append("expiry_end_date", values.expiry_end_date);
        }
    }
    formData.append("return_policy", String(values.return_policy));

    const coverUrl = keptExistingUrls[0] ?? values.image_url;
    if (coverUrl) {
        formData.append("image_url", coverUrl);
    }

    if (keptExistingUrls.length) {
        formData.append("image_urls", JSON.stringify(keptExistingUrls));
    }

    for (const file of files) {
        formData.append("images", file);
    }

    return formData;
}

async function saveProduct(
    endpoint: string,
    method: "POST" | "PATCH",
    formData: FormData,
): Promise<ApiResponse> {
    const response = await fetch(endpoint, { method, body: formData });
    return response.json().catch(() => ({}));
}

export default function ProductForm({ product }: { product?: IProduct | null }) {
    const router = useRouter();
    const params = useParams();
    const productId = String(params?.productId ?? "");
    const isEditMode = Boolean(productId);

    const [categories, setCategories] = useState<IProductCategory[]>([]);
    const imageUploadRef = useRef<ImageUploadValue>({
        files: [],
        existingUrls: [],
    });
    const initialProductImages = useMemo(() => {
        if (!product) return [];
        const urls = [...(product.image_urls ?? [])];
        if (product.image_url && !urls.includes(product.image_url)) {
            urls.unshift(product.image_url);
        }
        return urls;
    }, [product]);

    useEffect(() => {
        const controller = new AbortController();

        fetchProductCategories(controller.signal)
            .then(setCategories)
            .catch((error) => {
                if (controller.signal.aborted) return;
                toast.error(
                    error instanceof Error ? error.message : "Failed to load categories.",
                );
            });

        return () => controller.abort();
    }, []);

    const {
        register,
        control,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormInput>({
        defaultValues: product
            ? {
                ...DEFAULT_FORM_VALUES,
                ...product,
                order_type: normalizeOrderTypes(product.order_type),
            }
            : DEFAULT_FORM_VALUES,
    });

    useEffect(() => {
        if (!product) return;
        reset({
            ...DEFAULT_FORM_VALUES,
            ...product,
            order_type: normalizeOrderTypes(product.order_type),
        });
    }, [product, reset]);

    const handleImageUploadChange = useCallback(
        (value: ImageUploadValue) => {
            imageUploadRef.current = value;
            if (value.files.length > 0 || value.existingUrls.length > 0) {
                queueMicrotask(() => clearErrors("image_url"));
            }
        },
        [clearErrors],
    );
    const addDiscount = watch("add_discount");
    const discountPercent = watch("discount_percent");
    const sellingPrice = watch("selling_price");
    const addExpiryDate = watch("add_expiry_date");
    const discountedPrice = calculateDiscountedPrice(sellingPrice, discountPercent);
    const maxImageSizeMb = MAX_PRODUCT_IMAGE_SIZE_BYTES / (1024 * 1024);

    const toggleClassName =
        "relative h-7 w-[3.25rem] cursor-pointer appearance-none rounded-full border-2 border-transparent bg-default-200 transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:transition before:duration-200 before:ease-in-out checked:border-transparent checked:bg-none checked:!bg-primary checked:before:translate-x-full focus:ring-0 focus:ring-transparent";

    const hasSelectedOrExistingImage = () => {
        const { files, existingUrls } = imageUploadRef.current;
        return files.length > 0 || existingUrls.length > 0;
    };

    const onSubmit = handleSubmit(async (values) => {
        const imageValue = imageUploadRef.current;
        const files = imageValue.files;

        if (!files.length && !imageValue.existingUrls.length) {
            setError("image_url", {
                type: "required",
                message: "Please select at least one product image.",
            });
            return;
        }

        if (files.length) {
            const validation = validateProductImageFiles(files);
            if (!validation.valid) {
                setError("image_url", { type: "validate", message: validation.message });
                toast.error(validation.message);
                return;
            }
        }

        const endpoint = isEditMode
            ? `/api/admin/products/${productId}`
            : "/api/admin/products";
        const method = isEditMode ? "PATCH" : "POST";
        const formData = buildProductFormData(values, imageValue);

        try {
            const data = await saveProduct(endpoint, method, formData);

            if (!data.success) {
                if (data.errors?.image_url) {
                    setError("image_url", {
                        type: "server",
                        message: data.errors.image_url,
                    });
                }
                toast.error(data.message ?? "Failed to save product.");
                return;
            }

            toast.success(data.message ?? "Product saved successfully.");
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to save product.",
            );
        }
    });

    return (
        <form onSubmit={onSubmit} noValidate className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-lg border border-default-200 p-6">
                <div className="rounded-lg border border-default-200 p-6">
                    <ImageUploadField
                        key={product?.id ?? "new-product"}
                        variant="gallery"
                        multiple
                        aspect={1}
                        required
                        disabled={isSubmitting}
                        initialExistingUrls={initialProductImages}
                        maxSizeBytes={MAX_PRODUCT_IMAGE_SIZE_BYTES}
                        label="Upload Image"
                        description={
                            <>
                                <p className="mb-2 text-sm text-default-600">
                                    Crop each image after selecting. Images upload when you save the product.
                                </p>
                                <p className="mb-4 text-sm text-default-600">
                                    File Format{" "}
                                    <span className="text-default-800">jpeg, png, webp</span>{" "}
                                    Max Size{" "}
                                    <span className="text-default-800">
                                        {maxImageSizeMb} MB per image
                                    </span>{" "}
                                    Recommended{" "}
                                    <span className="text-default-800">600x600 (1:1)</span>
                                </p>
                            </>
                        }
                        error={errors.image_url?.message}
                        onChange={handleImageUploadChange}
                    />
                    <input
                        type="hidden"
                        {...register("image_url", {
                            validate: () =>
                                hasSelectedOrExistingImage() ||
                                "Please select at least one product image.",
                        })}
                    />
                    <input type="hidden" {...register("image_urls")} />
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="p-6 rounded-lg border border-default-200">
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="name">
                                    Product Name <span className="text-required" >*</span>
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Product Name"
                                    disabled={isSubmitting}
                                    {...register("name", {
                                        required: "Product name is required.",
                                        minLength: { value: 2, message: "Use at least 2 characters." },
                                    })}
                                />
                                {errors.name?.message ? (
                                    <span className={errorClassName}>{errors.name.message}</span>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="category">
                                    Category <span className="text-required" >*</span>
                                </label>
                                <Input
                                    as="select"
                                    id="category"
                                    disabled={isSubmitting}
                                    {...register("category", {
                                        required: "Please select a category.",
                                    })}
                                >
                                    <option value="">Select Product Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Input>
                                {errors.category?.message ? (
                                    <span className={errorClassName}>{errors.category.message}</span>
                                ) : null}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="selling_price">
                                        Selling Price <span className="text-required" >*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        id="selling_price"
                                        step="0.01"
                                        min={0}
                                        placeholder="Selling Price"
                                        disabled={isSubmitting}
                                        {...register("selling_price", {
                                            required: "Selling price is required.",
                                            valueAsNumber: true,
                                            min: { value: 0, message: "Price cannot be negative." },
                                        })}
                                    />
                                    {errors.selling_price?.message ? (
                                        <span className={errorClassName}>{errors.selling_price.message}</span>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="cost_price">
                                        Cost Price <span className="text-required" >*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        id="cost_price"
                                        step="0.01"
                                        min={0}
                                        placeholder="Cost Price"
                                        disabled={isSubmitting}
                                        {...register("cost_price", {
                                            required: "Cost price is required.",
                                            valueAsNumber: true,
                                            min: { value: 0, message: "Cost cannot be negative." },
                                        })}
                                    />
                                    {errors.cost_price?.message ? (
                                        <span className={errorClassName}>{errors.cost_price.message}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="quantity">
                                    Quantity in Stock <span className="text-required" >*</span>
                                </label>
                                <Input
                                    type="number"
                                    id="quantity"
                                    min={0}
                                    placeholder="Quantity in Stock"
                                    disabled={isSubmitting}
                                    {...register("quantity", {
                                        required: "Quantity is required.",
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Quantity cannot be negative." },
                                    })}
                                />
                                {errors.quantity?.message ? (
                                    <span className={errorClassName}>{errors.quantity.message}</span>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="order_type">
                                    Order Type <span className="text-required" >*</span>
                                </label>
                                <Controller
                                    name="order_type"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            value.length > 0 ||
                                            "Select at least one order type.",
                                    }}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id="order_type"
                                            options={ORDER_TYPE_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select order types"
                                            disabled={isSubmitting}
                                            error={errors.order_type?.message}
                                            aria-label="Order type"
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-4 rounded-lg border border-default-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-default-600">Discount</h4>
                                    <div className="flex items-center gap-4">
                                        <label className="block text-sm text-default-600" htmlFor="addDiscount">
                                            Add Discount
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="addDiscount"
                                            className={toggleClassName}
                                            disabled={isSubmitting}
                                            {...register("add_discount")}
                                        />
                                    </div>
                                </div>

                                {addDiscount ? (
                                    <div className="space-y-3 border-t border-default-200 pt-4">
                                        <div>
                                            <label
                                                className="mb-2 block text-sm font-medium text-default-900"
                                                htmlFor="discount_percent"
                                            >
                                                Discount (%)
                                            </label>
                                            <Input
                                                type="number"
                                                id="discount_percent"
                                                min={1}
                                                max={100}
                                                step="0.01"
                                                placeholder="e.g. 10"
                                                disabled={isSubmitting}
                                                {...register("discount_percent", {
                                                    valueAsNumber: true,
                                                    validate: (value, formValues) => {
                                                        if (!formValues.add_discount) return true;
                                                        if (
                                                            value == null ||
                                                            Number.isNaN(value)
                                                        ) {
                                                            return "Discount percentage is required.";
                                                        }
                                                        if (value <= 0 || value > 100) {
                                                            return "Enter a discount between 1 and 100.";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                            />
                                            {errors.discount_percent?.message ? (
                                                <span className={errorClassName}>
                                                    {errors.discount_percent.message}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="rounded-lg bg-default-50 px-4 py-3 text-sm">
                                            <p className="text-default-600">
                                                Selling price:{" "}
                                                <span className="font-medium text-default-900">
                                                    {sellingPrice != null &&
                                                        !Number.isNaN(sellingPrice)
                                                        ? formatCurrency(sellingPrice)
                                                        : "—"}
                                                </span>
                                            </p>
                                            <p className="mt-1 text-default-600">
                                                Discounted price:{" "}
                                                <span className="font-semibold text-primary">
                                                    {discountedPrice != null
                                                        ? formatCurrency(discountedPrice)
                                                        : "—"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-4 rounded-lg border border-default-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-default-600">Expiry Date</h4>
                                    <div className="flex items-center gap-4">
                                        <label className="block text-sm text-default-600" htmlFor="addExpiryDate">
                                            Add Expiry Date
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="addExpiryDate"
                                            className={toggleClassName}
                                            disabled={isSubmitting}
                                            {...register("add_expiry_date")}
                                        />
                                    </div>
                                </div>

                                {addExpiryDate ? (
                                    <div className="grid gap-4 border-t border-default-200 pt-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                className="mb-2 block text-sm font-medium text-default-900"
                                                htmlFor="expiry_start_date"
                                            >
                                                Start date
                                            </label>
                                            <Input
                                                type="date"
                                                id="expiry_start_date"
                                                disabled={isSubmitting}
                                                {...register("expiry_start_date", {
                                                    validate: (value, formValues) => {
                                                        if (!formValues.add_expiry_date) return true;
                                                        return value
                                                            ? true
                                                            : "Start date is required.";
                                                    },
                                                })}
                                            />
                                            {errors.expiry_start_date?.message ? (
                                                <span className={errorClassName}>
                                                    {errors.expiry_start_date.message}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-sm font-medium text-default-900"
                                                htmlFor="expiry_end_date"
                                            >
                                                End date
                                            </label>
                                            <Input
                                                type="date"
                                                id="expiry_end_date"
                                                disabled={isSubmitting}
                                                {...register("expiry_end_date", {
                                                    validate: (value, formValues) => {
                                                        if (!formValues.add_expiry_date) return true;
                                                        if (!value) {
                                                            return "End date is required.";
                                                        }
                                                        if (
                                                            formValues.expiry_start_date &&
                                                            value < formValues.expiry_start_date
                                                        ) {
                                                            return "End date must be on or after start date.";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                            />
                                            {errors.expiry_end_date?.message ? (
                                                <span className={errorClassName}>
                                                    {errors.expiry_end_date.message}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="short_description">
                                    Short Description <span className="text-required" >*</span>
                                </label>
                                <Controller
                                    name="short_description"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            !isRichTextEmpty(value) ||
                                            "Short description is required.",
                                    }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            id="short_description"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            disabled={isSubmitting}
                                            toolbar="minimal"
                                            minHeight={120}
                                            placeholder="Short description"
                                        />
                                    )}
                                />
                                {errors.short_description?.message ? (
                                    <span className={errorClassName}>
                                        {errors.short_description.message}
                                    </span>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="longDescription">
                                    Product Long Description <span className="text-required" >*</span>
                                </label>
                                <Controller
                                    name="long_description"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            !isRichTextEmpty(value) ||
                                            "Long description is required.",
                                    }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            id="longDescription"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            disabled={isSubmitting}
                                            toolbar="standard"
                                            minHeight={200}
                                            placeholder="Enter product long description"
                                        />
                                    )}
                                />
                                <p className="text-sm text-default-600 mt-2">
                                    Add a long description for your product
                                </p>
                                {errors.long_description?.message ? (
                                    <span className={errorClassName}>
                                        {errors.long_description.message}
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-default-600">Return Policy</h4>
                                <div className="flex items-center gap-4">
                                    <label className="block text-sm text-default-600" htmlFor="returnPolicy">
                                        Return Policy
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="returnPolicy"
                                        className={toggleClassName}
                                        disabled={isSubmitting}
                                        {...register("return_policy")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => router.push("/admin/products")}
                            className="inline-flex items-center gap-2 rounded-lg bg-default-100 px-4 py-2.5 text-sm font-medium text-default-700 transition-all hover:bg-default-200 disabled:opacity-60"
                        >
                            <X className="h-4 w-4 shrink-0" aria-hidden />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-500 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {isEditMode ? (
                                        <Save className="h-4 w-4 shrink-0" aria-hidden />
                                    ) : (
                                        <Package className="h-4 w-4 shrink-0" aria-hidden />
                                    )}
                                    {isEditMode ? "Update Product" : "Create Product"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
