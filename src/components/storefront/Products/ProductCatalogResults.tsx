import ProductCard from "@/components/storefront/Products/ProductCard";
import ProductListRow from "@/components/storefront/Products/ProductListRow";
import type { ProductViewMode } from "@/components/storefront/Products/ProductViewModeToggle";
import type { IProduct } from "@/types/product";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type ProductCatalogResultsProps = {
  products: IProduct[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  startItem: number;
  endItem: number;
  viewMode: ProductViewMode;
  onPageChange: (page: number) => void;
};

export default function ProductCatalogResults({
  products,
  isLoading,
  page,
  totalPages,
  total,
  startItem,
  endItem,
  viewMode,
  onPageChange,
}: ProductCatalogResultsProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-default-500">
        Loading products...
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="py-16 text-center text-sm text-default-500">
        No products found.
      </div>
    );
  }

  return (
    <>
      {page === 1 ? (
        <div className="mb-5 w-full">
          <div
            className="relative rounded-lg overflow-hidden bg-primary/10 bg-cover bg-center w-full min-h-[280px]"
            style={{ backgroundImage: "url('/images/other/discount.png')" }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-8 md:p-12">
              <h4 className="text-5xl text-yellow-500 font-semibold mb-6">
                52% Discount
              </h4>
              <p className="text-lg text-default-500 mb-6">on your first order</p>
              <button
                type="button"
                className="md:mb-10 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500"
              >
                Shop Now
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {viewMode === "grid" ? (
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id ?? product.name} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {products.map((product) => (
            <ProductListRow key={product.id ?? product.name} product={product} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <p className="text-sm text-default-500 lg:hidden">
          Showing {startItem}–{endItem} of {total} results
        </p>

        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 w-full md:w-auto ms-auto">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex items-center justify-center h-9 w-9 bg-default-100 rounded-full transition-all duration-500 text-default-800 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5" />
          </button>

          <span className="text-sm text-default-600">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex items-center justify-center h-9 w-9 bg-default-100 rounded-full transition-all duration-500 text-default-800 hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Next page"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
}
