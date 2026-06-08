"use client";

import Link from "next/link";
import type { IProduct } from "@/types/product";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchProductsPage } from "@/lib/api/products";
import { formatCurrency, formatCustomerSince } from "@/lib/constants";
import OrderTypeBadges from "@/components/ui/OrderTypeBadges";
import { Eye, Pencil, Trash } from "lucide-react";

const TABLE_COL_SPAN = 19;
const DEFAULT_LIMIT = 10;

export default function ProductsList() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);
    const handleDelete = async (product: IProduct) => {
        if (!product.id) return;

        const confirmed = window.confirm(
            `Delete product "${product.name}"? This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingId(product.id);

        try {
            const response = await fetch(`/api/admin/products/${product.id}`, {
                method: "DELETE",
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                toast.error(data.message ?? "Failed to delete product.");
                return;
            }

            toast.success(data.message ?? "Product deleted.");

            if (products.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                setReloadToken((current) => current + 1);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete product.",
            );
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadProducts = async () => {
            setIsLoading(true);

            try {
                const data = await fetchProductsPage({
                    page,
                    limit: DEFAULT_LIMIT,
                    signal: controller.signal,
                    endpoint: "/api/products",
                });

                if (!active) return;

                setProducts(data.products);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                if (!active || controller.signal.aborted) return;
                toast.error(
                    error instanceof Error ? error.message : "Failed to load products.",
                );
                setProducts([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadProducts();

        return () => {
            active = false;
            controller.abort();
        };
    }, [page, reloadToken]);

    const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
    const endItem = Math.min(page * DEFAULT_LIMIT, total);

    return (
        <div className="grid grid-cols-1">
            <div className="border rounded-lg border-default-200">
                <div className="px-6 py-4 overflow-hidden">
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                        <h2 className="text-xl text-default-800 font-semibold">
                            Products ({total})
                        </h2>
                        <Link
                            href="/admin/products/add"
                            className="py-2.5 px-4 inline-flex rounded-lg text-sm font-medium bg-primary text-white transition-all hover:bg-primary-500"
                        >
                            Add Product
                        </Link>
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    {isLoading ? (
                        <div className="px-6 py-10 text-center text-sm text-default-500">
                            Loading products...
                        </div>
                    ) : (
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-default-200">
                                    <thead className="bg-default-100">
                                        <tr className="text-start">
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Product ID
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Image
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Selling Price
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Cost Price
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Order Type
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Short Description
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Long Description
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Discount
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Expiry Date
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Return Policy
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Created By (User ID)
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Updated At
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Images Count
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                View on store
                                            </th>
                                            <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-default-200">
                                        {products.length === 0 ? (
                                            <tr>
                                                <td
                                                    className="px-6 py-6 text-sm text-default-500"
                                                    colSpan={TABLE_COL_SPAN}
                                                >
                                                    No products found.
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                        #{product.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-12 w-12 rounded object-cover border border-default-200"
                                                            />
                                                        ) : (
                                                            <span className="text-default-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.selling_price ? formatCurrency(product.selling_price) : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.cost_price ? formatCurrency(product.cost_price) : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-default-600 min-w-[160px]">
                                                        <OrderTypeBadges types={product.order_type} />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-default-600 min-w-[220px]" title={product.short_description}>
                                                        {product.short_description.length > 50 ? product.short_description.substring(0, 50) + "..." : product.short_description}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-default-600 min-w-[260px]" title={product.long_description}>
                                                        {product.long_description.length > 50 ? product.long_description.substring(0, 50) + "..." : product.long_description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.add_discount ? "Yes" : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.add_expiry_date ? "Yes" : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.return_policy ? "Yes" : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.user_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {formatCustomerSince(product.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {formatCustomerSince(product.updated_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        {product.image_urls?.length ?? 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-default-600">
                                                        <Link
                                                            href={
                                                                product.id
                                                                    ? `/products/${product.id}`
                                                                    : "/products"
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                                                        >
                                                            <Eye className="size-3.5" />
                                                            View on store
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/admin/products/${product.id}`}
                                                                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                                                            >
                                                                <Eye className="size-3.5" />
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={`/admin/products/${product.id}/edit`}
                                                                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-default-700 bg-default-100 hover:bg-default-200 transition-colors"
                                                            >
                                                                <Pencil className="size-3.5" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                disabled={deletingId === product.id}
                                                                onClick={() => void handleDelete(product)}
                                                                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-red-700 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                                            >
                                                                <Trash className="size-3.5" />
                                                                {deletingId === product.id ? "..." : "Delete"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {!isLoading && total > 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-default-200 px-6 py-4">
                        <p className="text-sm text-default-500">
                            Showing {startItem}–{endItem} of {total} products
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1 || isLoading}
                                onClick={() => setPage((current) => current - 1)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-default-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={page >= totalPages || isLoading}
                                onClick={() => setPage((current) => current + 1)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
