import {
  formatOrderTypes,
  getOrderTypeLabel,
  normalizeOrderTypes,
} from "@/lib/order-types";
import Badge from "../ui/Badge";

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
        <Badge
          key={type}
          color="default"
          size="sm"
        >
          {getOrderTypeLabel(type)}
        </Badge>
      ))}
    </div>
  );
}
