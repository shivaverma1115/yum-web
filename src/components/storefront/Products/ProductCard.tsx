import Link from "next/link";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import type { IProduct } from "@/types/product";
import { formatCurrency } from "@/lib/constants";

type ProductCardProps = {
  product: IProduct;
};

function productHref(product: IProduct) {
  return product.id ? `/products/${product.id}` : "/products";
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc =
    product.image_url ?? "/images/dishes/pizza.png";

  return (
    <div className="border border-default-200 rounded-lg p-4 overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300">
      <div className="relative rounded-lg overflow-hidden divide-y divide-default-200 group">
        <div className="mb-4 mx-auto">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-all object-cover min-h-[180px]"
          />
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={productHref(product)}
              className="text-default-800 text-xl font-semibold line-clamp-1 after:absolute after:inset-0"
            >
              {product.name}
            </Link>
            <i
              className="h-6 w-6 text-default-200 cursor-pointer hover:text-red-500 hover:fill-red-500 transition-all relative z-10"
              data-lucide="heart"
            />
          </div>

          <p className="text-sm text-default-500 mb-4 line-clamp-2">
            {product.short_description || product.category}
          </p>

          <div className="flex items-end justify-between mb-4">
            <h4 className="font-semibold text-xl text-default-900">
              {product.selling_price !== null ? formatCurrency(product.selling_price) : "-"}
            </h4>
          </div>

          <AddToCartButton
            product={product}
            className="relative z-10 w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
