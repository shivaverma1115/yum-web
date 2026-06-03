"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImageIcon, UploadCloud } from "lucide-react";
import { MAX_PRODUCT_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { validateProductImageFiles } from "@/lib/products/imageValidation";
import type { IProduct, ProductFormInput } from "@/types/product";

type ProductFormValues = ProductFormInput;

const inputClassName =
    "block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60";
const errorClassName = "text-red-500 text-sm mt-1";

type ApiResponse = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string>;
};

function buildProductFormData(
    values: ProductFormValues,
    files: File[],
): FormData {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("selling_price", String(values.selling_price));
    formData.append("cost_price", String(values.cost_price));
    formData.append("quantity", String(values.quantity));
    formData.append("order_type", values.order_type);
    formData.append("short_description", values.short_description);
    formData.append("long_description", values.long_description);
    formData.append("add_discount", String(values.add_discount));
    formData.append("add_expiry_date", String(values.add_expiry_date));
    formData.append("return_policy", String(values.return_policy));

    if (values.image_url) {
        formData.append("image_url", values.image_url);
    }

    if (values.image_urls?.length) {
        formData.append("image_urls", JSON.stringify(values.image_urls));
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

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const selectedImageFilesRef = useRef<File[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        defaultValues: {
            name: product?.name ?? "",
            category: product?.category ?? "",
            selling_price: product?.selling_price ?? 0,
            cost_price: product?.cost_price ?? 0,
            quantity: product?.quantity ?? 0,
            order_type: product?.order_type ?? "delivery",
            short_description: product?.short_description ?? "",
            long_description: product?.long_description ?? "",
            add_discount: product?.add_discount ?? false,
            add_expiry_date: product?.add_expiry_date ?? false,
            return_policy: product?.return_policy ?? false,
            image_url: product?.image_url ?? null,
            image_urls: product?.image_urls ?? [],
        },
    });

    const imageUrl = watch("image_url");
    const imageUrls = watch("image_urls");
    const maxImageSizeMb = MAX_PRODUCT_IMAGE_SIZE_BYTES / (1024 * 1024);

    const hasSelectedOrExistingImage = () =>
        selectedImageFilesRef.current.length > 0 || Boolean(imageUrl);

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        const validation = validateProductImageFiles(files);
        if (!validation.valid) {
            toast.error(validation.message);
            event.target.value = "";
            return;
        }

        selectedImageFilesRef.current = files;
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
        clearErrors("image_url");
    };

    const onSubmit = handleSubmit(async (values) => {
        const files = selectedImageFilesRef.current;

        if (!files.length && !values.image_url) {
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
        const formData = buildProductFormData(values, files);

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
            <div className="p-6 rounded-lg border border-default-200">
                <div className="p-6 rounded-lg border border-default-200 mb-4">
                    <div className="h-52 mb-4 flex items-center justify-center rounded-lg border border-dashed border-default-300 bg-default-50/50 overflow-hidden">
                        {imagePreviews[0] || imageUrl ? (
                            <img
                                src={imagePreviews[0] || imageUrl || ""}
                                alt="Product cover preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-primary" />
                        )}
                    </div>

                    <h5 className="text-base text-primary font-medium mb-2">
                        <UploadCloud className="inline-flex ms-2 h-4 w-4" />
                        Upload Image
                    </h5>

                    <p className="text-sm text-default-600 mb-2">
                        Select product images. They are uploaded when you save the product.
                    </p>
                    <p className="text-sm text-default-600 mb-4">
                        File Format <span className="text-default-800">jpeg, png, webp</span>{" "}
                        Max Size <span className="text-default-800">{maxImageSizeMb} MB per image</span>{" "}
                        Recommended <span className="text-default-800">600x600 (1:1)</span>
                    </p>

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={isSubmitting}
                        onChange={onImageChange}
                        className="block w-full text-sm file:me-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white disabled:opacity-60"
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
                    {errors.image_url?.message ? (
                        <span className={errorClassName}>{errors.image_url.message}</span>
                    ) : null}
                    {imagePreviews.length > 1 ? (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {imagePreviews.slice(1).map((preview, index) => (
                                <img
                                    key={`${preview}-${index}`}
                                    src={preview}
                                    alt={`Selected product image ${index + 2}`}
                                    className="h-20 w-full object-cover rounded-md border border-default-200"
                                />
                            ))}
                        </div>
                    ) : null}
                    {imageUrls?.length ? (
                        <p className="text-xs text-default-500 mt-3">
                            Existing images: {imageUrls.length}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="p-6 rounded-lg border border-default-200">
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="name">
                                    Product Name
                                </label>
                                <input
                                    id="name"
                                    className={inputClassName}
                                    type="text"
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
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className={inputClassName}
                                    disabled={isSubmitting}
                                    {...register("category", {
                                        required: "Please select a category.",
                                    })}
                                >
                                    <option value="">Select Product Category</option>
                                    <option value="italian">Italian</option>
                                    <option value="bbq">BBQ</option>
                                    <option value="mexican">Mexican</option>
                                </select>
                                {errors.category?.message ? (
                                    <span className={errorClassName}>{errors.category.message}</span>
                                ) : null}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="selling_price">
                                        Selling Price
                                    </label>
                                    <input
                                        id="selling_price"
                                        className={inputClassName}
                                        type="number"
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
                                        Cost Price
                                    </label>
                                    <input
                                        id="cost_price"
                                        className={inputClassName}
                                        type="number"
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
                                    Quantity in Stock
                                </label>
                                <input
                                    id="quantity"
                                    className={inputClassName}
                                    type="number"
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
                                    Order Type
                                </label>
                                <select
                                    id="order_type"
                                    className={inputClassName}
                                    disabled={isSubmitting}
                                    {...register("order_type", { required: "Order type is required." })}
                                >
                                    <option value="">Order Type</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="pickup">Pickup</option>
                                    <option value="dine-in">Dine-in</option>
                                </select>
                                {errors.order_type?.message ? (
                                    <span className={errorClassName}>{errors.order_type.message}</span>
                                ) : null}
                            </div>

                            <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-default-600">Discount</h4>
                                <div className="flex items-center gap-4">
                                    <label className="block text-sm text-default-600" htmlFor="addDiscount">
                                        Add Discount
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="addDiscount"
                                        className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200"
                                        disabled={isSubmitting}
                                        {...register("add_discount")}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-default-600">Expiry Date</h4>
                                <div className="flex items-center gap-4">
                                    <label className="block text-sm text-default-600" htmlFor="addExpiryDate">
                                        Add Expiry Date
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="addExpiryDate"
                                        className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200"
                                        disabled={isSubmitting}
                                        {...register("add_expiry_date")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="short_description">
                                    Short Description
                                </label>
                                <textarea
                                    id="short_description"
                                    className={inputClassName}
                                    rows={5}
                                    placeholder="Short Description"
                                    disabled={isSubmitting}
                                    {...register("short_description", {
                                        required: "Short description is required.",
                                    })}
                                />
                                {errors.short_description?.message ? (
                                    <span className={errorClassName}>
                                        {errors.short_description.message}
                                    </span>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="longDescription">
                                    Product Long Description
                                </label>
                                <textarea
                                    id="longDescription"
                                    className={inputClassName}
                                    rows={6}
                                    placeholder="Enter product long description"
                                    disabled={isSubmitting}
                                    {...register("long_description", {
                                        required: "Long description is required.",
                                    })}
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
                                        className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200"
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
                            className="py-2.5 px-4 inline-flex rounded-lg text-sm font-medium bg-default-100 text-default-700 transition-all hover:bg-default-200 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="py-2.5 px-4 inline-flex rounded-lg text-sm font-medium bg-primary text-white transition-all hover:bg-primary-500 disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Create Product"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
