import {
  SkeletonBox,
  SkeletonText,
} from "./SkeletonToolkit";

type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="overflow-hidden rounded-lg border border-default-200"
        >
          <SkeletonBox className="h-48 w-full rounded-none" />
          <div className="space-y-3 p-4">
            <SkeletonBox className="skel-line h-3 w-1/3" />
            <SkeletonBox className="skel-line h-5 w-2/3" />
            <SkeletonBox className="skel-line h-5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container py-6 lg:py-10" aria-hidden>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBox className="min-h-[320px] w-full rounded-lg" />
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBox
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="h-24 w-24 rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SkeletonBox className="skel-line h-4 w-24" />
          <SkeletonBox className="skel-line h-8 w-3/4" />
          <SkeletonText lines={3} widths={["100%", "92%", "70%"]} />
          <SkeletonBox className="skel-line h-10 w-32" />
          <SkeletonBox className="h-12 w-full max-w-xs rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FormSectionSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="flex items-start gap-6">
        <SkeletonBox className="h-24 w-24 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-5 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="space-y-2"
            >
              <SkeletonBox className="skel-line-sm w-24" />
              <SkeletonBox className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsFormSkeleton({ sections = 5 }: { sections?: number }) {
  return (
    <div className="space-y-6" aria-hidden>
      {Array.from({ length: sections }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="rounded-lg border border-default-200 p-6"
        >
          <SkeletonBox className="skel-line mb-6 h-6 w-40" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((__, fieldIndex) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={fieldIndex}
                className="space-y-2"
              >
                <SkeletonBox className="skel-line-sm w-28" />
                <SkeletonBox className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="overflow-hidden rounded-lg border border-default-200 p-6"
        >
          <div className="flex items-center gap-4">
            <SkeletonBox className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonBox className="skel-line-sm w-28" />
              <SkeletonBox className="skel-line h-7 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AddressCardsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-hidden>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="rounded-lg border border-default-200 p-6"
        >
          <SkeletonBox className="skel-line mb-6 h-6 w-40" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 6 }).map((__, fieldIndex) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={fieldIndex}
                className="space-y-2"
              >
                <SkeletonBox className="skel-line-sm w-24" />
                <SkeletonBox className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryFilterSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="flex items-center gap-3"
        >
          <SkeletonBox className="h-5 w-5 rounded-full" />
          <SkeletonBox className="skel-line-sm w-32" />
        </div>
      ))}
    </div>
  );
}
