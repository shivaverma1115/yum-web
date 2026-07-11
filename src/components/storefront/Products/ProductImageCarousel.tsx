"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { getProductImages } from "@/lib/products/products";
import { cn } from "@/lib/utils/helpers";
import type { IProduct } from "@/types/product";

export type ProductImageCarouselVariant = "card" | "detail" | "thumb";

type ProductImageCarouselProps = {
  product: IProduct;
  /** Visual layout preset. Default `card`. */
  variant?: ProductImageCarouselVariant;
  className?: string;
  imageClassName?: string;
  /** Auto-advance when there are multiple images. Default true. */
  autoplay?: boolean;
  /** Dot pagination when there are multiple images. Default true for card/detail. */
  showPagination?: boolean;
  alt?: string;
};

const VARIANT_ROOT: Record<ProductImageCarouselVariant, string> = {
  card: "aspect-square w-full",
  detail: "aspect-[4/3] w-full sm:aspect-square",
  thumb: "h-14 w-14 shrink-0 overflow-hidden rounded-lg",
};

const VARIANT_IMAGE: Record<ProductImageCarouselVariant, string> = {
  card: "pointer-events-none h-full w-full object-cover",
  detail: "pointer-events-none h-full w-full object-contain",
  thumb: "pointer-events-none h-full w-full object-cover",
};

/**
 * Shared product image carousel — uses `image_urls` (+ `image_url`) via `getProductImages`.
 * Auto-rotates when more than one image is present.
 */
export default function ProductImageCarousel({
  product,
  variant = "card",
  className,
  imageClassName,
  autoplay = true,
  showPagination,
  alt,
}: ProductImageCarouselProps) {
  const images = useMemo(() => getProductImages(product), [product]);
  const label = alt ?? product.name;
  const multi = images.length > 1;
  const paginationEnabled =
    showPagination ?? (variant !== "thumb" && multi);

  if (!multi) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-default-50",
          VARIANT_ROOT[variant],
          className,
        )}
      >
        <img
          src={images[0]}
          alt={label}
          className={cn(VARIANT_IMAGE[variant], imageClassName)}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "product-image-carousel relative overflow-hidden bg-default-50",
        VARIANT_ROOT[variant],
        className,
      )}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        speed={500}
        autoplay={
          autoplay
            ? {
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={
          paginationEnabled
            ? {
                clickable: true,
                dynamicBullets: images.length > 4,
              }
            : false
        }
        className="h-full w-full"
        aria-label={`${label} images`}
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`} className="!h-full overflow-hidden">
            <img
              src={src}
              alt={`${label} ${index + 1}`}
              className={cn(VARIANT_IMAGE[variant], imageClassName)}
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
