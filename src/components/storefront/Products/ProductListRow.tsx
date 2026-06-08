import Link from "next/link";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import { formatCurrency } from "@/lib/constants";
import type { IProduct } from "@/types/product";

type ProductListRowProps = {
  product: IProduct;
};

function productHref(product: IProduct) {
  return product.id ? `/products/${product.id}` : "/products";
}

export default function ProductListRow({ product }: ProductListRowProps) {
  const imageSrc = product.image_url ?? "/images/dishes/pizza.png";

  return (
    <>
      <div className="border border-default-200 rounded-lg p-4 hover:border-primary transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center gap-4 relative">
          <div className="shrink-0 md:w-48">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg min-h-[140px] md:min-h-[160px]"
            />
          </div>

          <div className="grow">
            <div className="flex items-center justify-between mb-4">
              <Link
                href={productHref(product)}
                className="text-default-800 text-2xl font-semibold line-clamp-1 after:absolute after:inset-0"
              >
                {product.name}
              </Link>
              <i
                className="relative z-10 h-6 w-6 text-default-200 cursor-pointer hover:text-red-500 hover:fill-red-500"
                data-lucide="heart"
              />
            </div>

            <p className="text-base text-default-600 max-w-2xl line-clamp-2 mb-6">
              {product.long_description}
            </p>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-6">
              <AddToCartButton
                product={product}
                className="relative z-10 inline-flex items-center justify-center rounded-full border border-primary bg-primary px-12 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
              />
            </div>

            <h4 className="font-semibold text-lg sm:text-2xl text-primary">
              {product.selling_price !== null ? formatCurrency(product.selling_price) : "-"}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
