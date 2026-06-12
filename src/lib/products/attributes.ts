import type { MultiSelectOption } from "@/components/ui/MultiSelect";

export type ProductDietType = "veg" | "non_veg";

export type SpiceLevel = "mild" | "medium" | "spicy" | "extra_spicy";

export type ProductIngredient =
  | "paneer"
  | "onion"
  | "tomato"
  | "cream"
  | "butter"
  | "indian_spices";

export type ProductAllergen =
  | "nuts"
  | "dairy"
  | "gluten"
  | "soy"
  | "eggs"
  | "shellfish"
  | "sesame";

export const DIET_TYPE_OPTIONS: { value: ProductDietType; label: string }[] = [
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non Veg" },
];

export const SPICE_LEVEL_OPTIONS: MultiSelectOption[] = [
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "spicy", label: "Spicy" },
  { value: "extra_spicy", label: "Extra Spicy" },
];

export const INGREDIENT_OPTIONS: MultiSelectOption[] = [
  { value: "paneer", label: "Paneer" },
  { value: "onion", label: "Onion" },
  { value: "tomato", label: "Tomato" },
  { value: "cream", label: "Cream" },
  { value: "butter", label: "Butter" },
  { value: "indian_spices", label: "Indian Spices" },
];

export const ALLERGEN_OPTIONS: MultiSelectOption[] = [
  { value: "nuts", label: "Nuts" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "soy", label: "Soy" },
  { value: "eggs", label: "Eggs" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
];

const DIET_TYPE_SET = new Set<string>(DIET_TYPE_OPTIONS.map((o) => o.value));
const SPICE_LEVEL_SET = new Set<string>(SPICE_LEVEL_OPTIONS.map((o) => o.value));
const INGREDIENT_SET = new Set<string>(INGREDIENT_OPTIONS.map((o) => o.value));
const ALLERGEN_SET = new Set<string>(ALLERGEN_OPTIONS.map((o) => o.value));

function normalizeStringArray<T extends string>(
  value: unknown,
  allowed: Set<string>,
): T[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("[")) {
        try {
          return normalizeStringArray<T>(JSON.parse(trimmed), allowed);
        } catch {
          return [];
        }
      }
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((part) => part.trim())
          .filter((part): part is T => allowed.has(part));
      }
      return allowed.has(trimmed) ? [trimmed as T] : [];
    }
    return [];
  }

  return value
    .map((entry) => String(entry).trim())
    .filter((entry): entry is T => allowed.has(entry));
}

export function isProductDietType(value: string): value is ProductDietType {
  return DIET_TYPE_SET.has(value);
}

export function normalizeSpiceLevels(value: unknown): SpiceLevel[] {
  return normalizeStringArray<SpiceLevel>(value, SPICE_LEVEL_SET);
}

export function normalizeIngredients(value: unknown): ProductIngredient[] {
  return normalizeStringArray<ProductIngredient>(value, INGREDIENT_SET);
}

export function normalizeAllergens(value: unknown): ProductAllergen[] {
  return normalizeStringArray<ProductAllergen>(value, ALLERGEN_SET);
}

export function parseStringArrayFromFormData(
  formData: FormData,
  field: string,
): string[] {
  const entries = formData
    .getAll(field)
    .map((entry) => String(entry).trim())
    .filter(Boolean);

  if (entries.length === 1 && entries[0].startsWith("[")) {
    try {
      const parsed = JSON.parse(entries[0]) as unknown;
      return Array.isArray(parsed)
        ? parsed.map((entry) => String(entry).trim()).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  }

  return entries;
}

export function getDietTypeLabel(value: ProductDietType | null | undefined): string {
  if (!value) return "—";
  return DIET_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getOptionLabel(
  options: MultiSelectOption[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function formatOptionList(
  options: MultiSelectOption[],
  values: string[],
): string {
  if (!values.length) return "—";
  return values.map((value) => getOptionLabel(options, value)).join(", ");
}
