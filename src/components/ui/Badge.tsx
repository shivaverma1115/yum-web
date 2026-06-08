import type { ReactNode } from "react";
import {
  getBadgeClassName,
  type BadgeColor,
} from "@/lib/badge-colors";

type BadgeProps = {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
  size?: "sm" | "md";
};

const SIZE_CLASSES = {
  sm: "text-xs px-3 py-1",
  md: "text-sm px-4 py-1",
} as const;

export default function Badge({
  children,
  color = "default",
  className = "",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium capitalize ${SIZE_CLASSES[size]} ${getBadgeClassName(color)} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
