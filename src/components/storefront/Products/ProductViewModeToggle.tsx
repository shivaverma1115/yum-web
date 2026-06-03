import { LayoutGrid, List } from "lucide-react";

export type ProductViewMode = "grid" | "list";

type ProductViewModeToggleProps = {
  value: ProductViewMode;
  onChange: (mode: ProductViewMode) => void;
};

export default function ProductViewModeToggle({
  value,
  onChange,
}: ProductViewModeToggleProps) {
  const buttonClass = (active: boolean) =>
    `inline-flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 ${
      active
        ? "bg-primary text-white"
        : "bg-default-100 text-default-700 hover:bg-default-200"
    }`;

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-default-200 p-1"
      role="group"
      aria-label="Product view mode"
    >
      <button
        type="button"
        className={buttonClass(value === "grid")}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        className={buttonClass(value === "list")}
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}
