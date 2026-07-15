export const BADGE_COLORS = {
  amber: "bg-amber-500/20 text-amber-600",
  blue: "bg-blue-500/20 text-blue-600",
  violet: "bg-violet-500/20 text-violet-600",
  green: "bg-green-500/20 text-green-600",
  red: "bg-red-500/20 text-red-500",
  yellow: "bg-yellow-500/20 text-yellow-500",
  primary: "bg-primary/20 text-primary",
  default: "bg-default-500/20 text-default-600",
} as const;

export const BADGE_DOT_COLORS = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  primary: "bg-primary",
  default: "bg-default-500",
} as const;

export type BadgeColor = keyof typeof BADGE_COLORS;

export function getBadgeClassName(color: BadgeColor): string {
  return BADGE_COLORS[color];
}

export function getBadgeDotClassName(color: BadgeColor): string {
  return BADGE_DOT_COLORS[color];
}
