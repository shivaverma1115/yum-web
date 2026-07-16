"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, Package, Plus, Save, Trash2, X } from "lucide-react";
import { fetchProductCategories } from "@/lib/api/categories";
import { formatCurrency, MAX_PRODUCT_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { getPrimaryVariant } from "@/lib/cart/line";
import { calculateDiscountedPrice } from "@/lib/products/discount";
import ImageUploadField, {
    type ImageUploadValue,
} from "@/components/common/image/ImageUploadField";
import Input from "@/components/ui/Input";
import MultiSelect from "@/components/ui/MultiSelect";
import { validateProductImageFiles } from "@/lib/products/imageValidation";
import {
    ALLERGEN_OPTIONS,
    DIET_TYPE_OPTIONS,
    FOOD_TAG_OPTIONS,
    INGREDIENT_OPTIONS,
    NUTRITION_OPTIONS,
    normalizeAllergens,
    normalizeCustomizations,
    normalizeFoodTag,
    normalizeIngredients,
    normalizeNutrition,
    normalizeSpiceLevels,
    normalizeVariants,
    SPICE_LEVEL_OPTIONS,
    type NutritionKey,
} from "@/lib/products/attributes";
import { normalizeOrderTypes, ORDER_TYPE_OPTIONS } from "@/lib/order-types";
import type { IProductCategory } from "@/types/product-category";
import type { IProduct, ProductFormInput } from "@/types/product";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { isRichTextEmpty } from "@/lib/rich-text";

const errorClassName = "text-red-500 text-sm mt-1";

const DEFAULT_FORM_VALUES: ProductFormInput = {
    name: "",
    category: "",
    order_type: [],
    short_description: "",
    long_description: "",
    add_discount: false,
    discount_percent: null,
    preparation_time_minutes: null,
    diet_type: "veg",
    food_tag: null,
    variants: [],
    customizations: [],
    nutrition: [],
    spice_levels: [],
    ingredients: [],
    allergens: [],
    is_available: true,
    image_url: null,
    image_urls: [],
};

type ApiResponse = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string>;
};

function resolveCategorySlug(
    stored: string | null | undefined,
    categories: IProductCategory[],
): string {
    const value = String(stored ?? "").trim();
    if (!value) return "";

    const bySlug = categories.find((category) => category.slug === value);
    if (bySlug) return bySlug.slug;

    const byName = categories.find(
        (category) => category.name.toLowerCase() === value.toLowerCase(),
    );
    if (byName) return byName.slug;

    return value;
}

function toFormValues(
    product?: IProduct | null,
    categories: IProductCategory[] = [],
): ProductFormInput {
    if (!product) return DEFAULT_FORM_VALUES;

    return {
        ...DEFAULT_FORM_VALUES,
        ...product,
        category: resolveCategorySlug(product.category, categories),
        order_type: normalizeOrderTypes(product.order_type),
        food_tag: normalizeFoodTag(product.food_tag),
        variants: normalizeVariants(product.variants),
        customizations: normalizeCustomizations(product.customizations),
        nutrition: normalizeNutrition(product.nutrition),
        spice_levels: normalizeSpiceLevels(product.spice_levels),
        ingredients: normalizeIngredients(product.ingredients),
        allergens: normalizeAllergens(product.allergens),
        is_available: product.is_available !== false,
    };
}

function buildProductFormData(
    values: ProductFormInput,
    imageValue: ImageUploadValue,
): FormData {
    const files = imageValue.files;
    const keptExistingUrls = imageValue.existingUrls;
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", values.category);
    for (const orderType of values.order_type) {
        formData.append("order_type", orderType);
    }
    formData.append("short_description", values.short_description);
    formData.append("long_description", values.long_description);
    formData.append("add_discount", String(values.add_discount));
    if (values.add_discount && values.discount_percent != null) {
        formData.append("discount_percent", String(values.discount_percent));
    }
    if (values.preparation_time_minutes != null) {
        formData.append(
            "preparation_time_minutes",
            String(values.preparation_time_minutes),
        );
    }
    if (values.diet_type) {
        formData.append("diet_type", values.diet_type);
    }
    if (values.food_tag) {
        formData.append("food_tag", values.food_tag);
    }
    formData.append("variants", JSON.stringify(values.variants ?? []));
    formData.append("customizations", JSON.stringify(values.customizations ?? []));
    formData.append(
        "nutrition",
        JSON.stringify(normalizeNutrition(values.nutrition)),
    );
    for (const level of values.spice_levels) {
        formData.append("spice_levels", level);
    }
    for (const ingredient of values.ingredients) {
        formData.append("ingredients", ingredient);
    }
    for (const allergen of values.allergens) {
        formData.append("allergens", allergen);
    }
    formData.append("is_available", String(values.is_available));

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
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormInput>({
        defaultValues: toFormValues(product),
    });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control,
        name: "variants",
    });

    const {
        fields: customizationFields,
        append: appendCustomization,
        remove: removeCustomization,
    } = useFieldArray({
        control,
        name: "customizations",
    });

    // Reset after product loads, and again once categories arrive so the
    // <select> can match option values (slug) that were missing on first paint.
    useEffect(() => {
        if (!product) return;
        reset(toFormValues(product, categories));
    }, [product, categories, reset]);

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
    const watchedVariants = watch("variants") ?? [];
    const nutrition = watch("nutrition") ?? [];
    const primaryVariantPrice = getPrimaryVariant(watchedVariants)?.price ?? null;
    const discountedPrice = calculateDiscountedPrice(
        primaryVariantPrice,
        discountPercent,
    );
    const maxImageSizeMb = MAX_PRODUCT_IMAGE_SIZE_BYTES / (1024 * 1024);

    const toggleNutrition = (key: NutritionKey, checked: boolean) => {
        const current = nutrition ?? [];
        if (checked) {
            if (current.some((item) => item.key === key)) return;
            setValue("nutrition", [...current, { key, value: 0 }], {
                shouldDirty: true,
            });
            return;
        }

        setValue(
            "nutrition",
            current.filter((item) => item.key !== key),
            { shouldDirty: true },
        );
    };

    const updateNutritionValue = (key: NutritionKey, rawValue: string) => {
        const current = nutrition ?? [];
        const parsed =
            rawValue.trim() === "" ? 0 : Number(rawValue);
        const value = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

        setValue(
            "nutrition",
            current.map((item) =>
                item.key === key ? { ...item, value } : item,
            ),
            { shouldDirty: true },
        );
    };

    const toggleClassName =
        "relative h-7 w-[3.25rem] cursor-pointer appearance-none rounded-full border-2 border-transparent bg-default-200 transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:transition before:duration-200 before:ease-in-out checked:border-transparent checked:bg-none checked:!bg-primary checked:before:translate-x-full focus:ring-0 focus:ring-transparent";

    const hasSelectedOrExistingImage = () => {
        const { files, existingUrls } = imageUploadRef.current;
        return files.length > 0 || existingUrls.length > 0;
    };

    const onSubmit = handleSubmit(async (values) => {
        const imageValue = imageUploadRef.current;
        const files = imageValue.files;

        const cleanedVariants = (values.variants ?? [])
            .map((item) => ({
                name: item.name.trim(),
                price: Number(item.price) || 0,
            }))
            .filter((item) => item.name.length > 0);

        if (!cleanedVariants.length) {
            setError("variants", {
                type: "required",
                message: "Add at least one variant with a price.",
            });
            toast.error("Add at least one variant with a price.");
            return;
        }

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
        const formData = buildProductFormData(
            {
                ...values,
                variants: cleanedVariants,
                customizations: (values.customizations ?? [])
                    .map((item) => ({
                        label: item.label.trim(),
                        extra_price: Number(item.extra_price) || 0,
                    }))
                    .filter((item) => item.label.length > 0),
                nutrition: normalizeNutrition(values.nutrition).filter(
                    (item) => item.value >= 0,
                ),
            },
            imageValue,
        );

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
                        aspect={4 / 3}
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
                                    disabled={isSubmitting || categories.length === 0}
                                    {...register("category", {
                                        required: "Please select a category.",
                                    })}
                                >
                                    <option value="">
                                        {categories.length === 0
                                            ? "No category found"
                                            : "Select Product Category"}
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                    {product?.category &&
                                    !categories.some(
                                        (category) =>
                                            category.slug === product.category ||
                                            category.name.toLowerCase() ===
                                                product.category.toLowerCase(),
                                    ) ? (
                                        <option value={product.category}>
                                            {product.category}
                                        </option>
                                    ) : null}
                                </Input>
                                {errors.category?.message ? (
                                    <span className={errorClassName}>{errors.category.message}</span>
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

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="diet_type">
                                    Food Type <span className="text-required">*</span>
                                </label>
                                <Input
                                    as="select"
                                    id="diet_type"
                                    disabled={isSubmitting}
                                    {...register("diet_type", {
                                        required: "Please select a food type.",
                                    })}
                                >
                                    <option value="">Select food type</option>
                                    {DIET_TYPE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Input>
                                {errors.diet_type?.message ? (
                                    <span className={errorClassName}>{errors.diet_type.message}</span>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="food_tag">
                                    Food Tag
                                </label>
                                <Input
                                    as="select"
                                    id="food_tag"
                                    disabled={isSubmitting}
                                    {...register("food_tag", {
                                        setValueAs: (value) =>
                                            value === "" || value == null
                                                ? null
                                                : value,
                                    })}
                                >
                                    <option value="">No tag</option>
                                    {FOOD_TAG_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Input>
                                {errors.food_tag?.message ? (
                                    <span className={errorClassName}>{errors.food_tag.message}</span>
                                ) : null}
                            </div>

                            <div className="space-y-4 rounded-lg border border-default-200 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-default-900">
                                            Variants <span className="text-required">*</span>
                                        </h4>
                                        <p className="mt-1 text-sm text-default-600">
                                            Portion options with their own price (e.g. Half ₹120, Full ₹190). At least one is required.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() =>
                                            appendVariant({ name: "", price: 0 })
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-default-100 px-3 py-2 text-sm font-medium text-default-700 transition-all hover:bg-default-200 disabled:opacity-60"
                                    >
                                        <Plus className="h-4 w-4 shrink-0" aria-hidden />
                                        Add
                                    </button>
                                </div>

                                {variantFields.length === 0 ? (
                                    <p className="text-sm text-default-500">
                                        No variants yet. Add Half/Full, Regular/Large, etc.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {variantFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="grid gap-3 sm:grid-cols-[1fr_120px_auto]"
                                            >
                                                <div>
                                                    <Input
                                                        placeholder="e.g. Half"
                                                        disabled={isSubmitting}
                                                        {...register(
                                                            `variants.${index}.name` as const,
                                                            {
                                                                required: "Variant name is required.",
                                                            },
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        placeholder="Price ₹"
                                                        disabled={isSubmitting}
                                                        {...register(
                                                            `variants.${index}.price` as const,
                                                            {
                                                                valueAsNumber: true,
                                                                min: {
                                                                    value: 0,
                                                                    message: "Price cannot be negative.",
                                                                },
                                                            },
                                                        )}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={() => removeVariant(index)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-default-200 px-3 py-2 text-default-600 transition-all hover:bg-default-50 disabled:opacity-60"
                                                    aria-label={`Remove variant ${index + 1}`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.variants?.message || errors.variants?.root?.message ? (
                                    <span className={errorClassName}>
                                        {errors.variants.message ?? errors.variants.root?.message}
                                    </span>
                                ) : null}
                            </div>

                            <div className="space-y-4 rounded-lg border border-default-200 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-default-900">
                                            Customizations
                                        </h4>
                                        <p className="mt-1 text-sm text-default-600">
                                            Optional add-ons customers can choose (e.g. Extra Butter +20).
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() =>
                                            appendCustomization({ label: "", extra_price: 0 })
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-default-100 px-3 py-2 text-sm font-medium text-default-700 transition-all hover:bg-default-200 disabled:opacity-60"
                                    >
                                        <Plus className="h-4 w-4 shrink-0" aria-hidden />
                                        Add
                                    </button>
                                </div>

                                {customizationFields.length === 0 ? (
                                    <p className="text-sm text-default-500">
                                        No customizations yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {customizationFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="grid gap-3 sm:grid-cols-[1fr_120px_auto]"
                                            >
                                                <div>
                                                    <Input
                                                        placeholder="e.g. Extra Butter"
                                                        disabled={isSubmitting}
                                                        {...register(
                                                            `customizations.${index}.label` as const,
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        placeholder="Extra ₹"
                                                        disabled={isSubmitting}
                                                        {...register(
                                                            `customizations.${index}.extra_price` as const,
                                                            {
                                                                valueAsNumber: true,
                                                                min: {
                                                                    value: 0,
                                                                    message: "Price cannot be negative.",
                                                                },
                                                            },
                                                        )}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={() => removeCustomization(index)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-default-200 px-3 py-2 text-default-600 transition-all hover:bg-default-50 disabled:opacity-60"
                                                    aria-label={`Remove customization ${index + 1}`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 rounded-lg border border-default-200 p-4">
                                <div>
                                    <h4 className="text-sm font-medium text-default-900">
                                        Nutrition
                                    </h4>
                                    <p className="mt-1 text-sm text-default-600">
                                        Select nutrients to include, then enter values (per serving).
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {NUTRITION_OPTIONS.map((option) => {
                                        const selected = nutrition.find(
                                            (item) => item.key === option.key,
                                        );
                                        const inputId = `nutrition_${option.key}`;

                                        return (
                                            <div
                                                key={option.key}
                                                className="rounded-lg border border-default-200 p-3"
                                            >
                                                <label className="flex cursor-pointer items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="size-4 rounded border-default-300 text-primary focus:ring-primary"
                                                        checked={Boolean(selected)}
                                                        disabled={isSubmitting}
                                                        onChange={(event) =>
                                                            toggleNutrition(
                                                                option.key,
                                                                event.target.checked,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm font-medium text-default-900">
                                                        {option.label}{" "}
                                                        <span className="font-normal text-default-500">
                                                            ({option.unit})
                                                        </span>
                                                    </span>
                                                </label>

                                                {selected ? (
                                                    <div className="mt-3 ps-7">
                                                        <Input
                                                            type="number"
                                                            id={inputId}
                                                            min={0}
                                                            step={option.step}
                                                            placeholder={option.placeholder}
                                                            disabled={isSubmitting}
                                                            value={selected.value}
                                                            onChange={(event) =>
                                                                updateNutritionValue(
                                                                    option.key,
                                                                    event.target.value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="spice_levels">
                                    Spice Level
                                </label>
                                <Controller
                                    name="spice_levels"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id="spice_levels"
                                            options={SPICE_LEVEL_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select spice levels"
                                            disabled={isSubmitting}
                                            error={errors.spice_levels?.message}
                                            aria-label="Spice level"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="ingredients">
                                    Ingredients
                                </label>
                                <Controller
                                    name="ingredients"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id="ingredients"
                                            options={INGREDIENT_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select ingredients"
                                            disabled={isSubmitting}
                                            error={errors.ingredients?.message}
                                            aria-label="Ingredients"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="allergens">
                                    Allergens
                                </label>
                                <Controller
                                    name="allergens"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id="allergens"
                                            options={ALLERGEN_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select allergens"
                                            disabled={isSubmitting}
                                            error={errors.allergens?.message}
                                            aria-label="Allergens"
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
                                                Base variant price:{" "}
                                                <span className="font-medium text-default-900">
                                                    {primaryVariantPrice != null
                                                        ? formatCurrency(primaryVariantPrice)
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

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-default-900"
                                    htmlFor="preparation_time_minutes"
                                >
                                    Preparation Time (minutes)
                                </label>
                                <Input
                                    type="number"
                                    id="preparation_time_minutes"
                                    min={0}
                                    step={1}
                                    placeholder="e.g. 15"
                                    disabled={isSubmitting}
                                    {...register("preparation_time_minutes", {
                                        setValueAs: (value) => {
                                            if (value === "" || value == null) {
                                                return null;
                                            }
                                            const parsed = Number(value);
                                            return Number.isFinite(parsed) ? parsed : null;
                                        },
                                        validate: (value) => {
                                            if (value == null) return true;
                                            if (!Number.isInteger(value)) {
                                                return "Enter whole minutes only.";
                                            }
                                            if (value < 0) {
                                                return "Preparation time cannot be negative.";
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                <p className="mt-2 text-sm text-default-600">
                                    Estimated time to prepare this item. Leave empty if not applicable.
                                </p>
                                {errors.preparation_time_minutes?.message ? (
                                    <span className={errorClassName}>
                                        {errors.preparation_time_minutes.message}
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-default-200 p-4">
                                <div>
                                    <h4 className="text-sm font-medium text-default-600">Availability</h4>
                                    <p className="mt-1 text-sm text-default-500">
                                        Unavailable products are hidden from the storefront.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="block text-sm text-default-600" htmlFor="is_available">
                                        Available
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="is_available"
                                        className={toggleClassName}
                                        disabled={isSubmitting}
                                        {...register("is_available")}
                                    />
                                </div>
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
