import {
  formatOrderTypes,
  getOrderTypeLabel,
  normalizeOrderTypes,
} from "@/lib/order-types";

type OrderTypeBadgesProps = {
  types: unknown;
  variant?: "badges" | "text";
  className?: string;
};

export default function OrderTypeBadges({
  types,
  variant = "badges",
  className = "",
}: OrderTypeBadgesProps) {
  const orderTypes = normalizeOrderTypes(types);

  if (!orderTypes.length) {
    return variant === "text" ? (
      <span className={className}>—</span>
    ) : null;
  }

  if (variant === "text") {
    return <span className={className}>{formatOrderTypes(orderTypes)}</span>;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {orderTypes.map((type) => (
        <span
          key={type}
          className="inline-flex items-center rounded-full border border-default-200 px-2.5 py-1 text-xs text-default-700"
        >
          {getOrderTypeLabel(type)}
        </span>
      ))}
    </div>
  );
}
