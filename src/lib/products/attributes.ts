import type { MultiSelectOption } from "@/components/ui/MultiSelect";

export type ProductDietType = "veg" | "non_veg" | "egg" | "jain" | "vegan";

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

export type FoodTag =
  | "bestseller"
  | "chef_special"
  | "recommended"
  | "new"
  | "popular"
  | "signature"
  | "limited_time"
  | "spicy"
  | "extra_spicy"
  | "mild"
  | "healthy"
  | "low_calorie"
  | "high_protein"
  | "high_fiber"
  | "jain"
  | "vegan"
  | "gluten_free"
  | "dairy_free"
  | "kids_favourite"
  | "family_pack"
  | "premium"
  | "budget_friendly"
  | "freshly_prepared"
  | "seasonal"
  | "north_indian"
  | "south_indian"
  | "chinese"
  | "italian"
  | "street_food"
  | "contains_nuts"
  | "contains_dairy";

export type ProductVariant = {
  name: string;
  price: number;
};

export type NutritionKey = "calories" | "protein" | "fat" | "carbs";

export type ProductNutritionItem = {
  key: NutritionKey;
  value: number;
};

/** @deprecated Prefer ProductNutritionItem[]; kept as alias for the array shape. */
export type ProductNutrition = ProductNutritionItem[];

export type ProductCustomization = {
  label: string;
  extra_price: number;
};

export const NUTRITION_OPTIONS: {
  key: NutritionKey;
  label: string;
  unit: string;
  placeholder: string;
  step: string;
}[] = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    placeholder: "e.g. 420",
    step: "1",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    placeholder: "e.g. 18",
    step: "0.1",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    placeholder: "e.g. 28",
    step: "0.1",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    placeholder: "e.g. 15",
    step: "0.1",
  },
];

const NUTRITION_KEY_SET = new Set<string>(
  NUTRITION_OPTIONS.map((option) => option.key),
);

export const DIET_TYPE_OPTIONS: { value: ProductDietType; label: string }[] = [
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non Veg" },
  { value: "egg", label: "Egg" },
  { value: "jain", label: "Jain" },
  { value: "vegan", label: "Vegan" },
];

export const FOOD_TAG_OPTIONS: MultiSelectOption[] = [
  { value: "bestseller", label: "Bestseller" },
  { value: "chef_special", label: "Chef Special" },
  { value: "recommended", label: "Recommended" },
  { value: "new", label: "New Arrival" },
  { value: "popular", label: "Popular" },
  { value: "signature", label: "Signature Dish" },
  { value: "limited_time", label: "Limited Time" },

  { value: "spicy", label: "Spicy" },
  { value: "extra_spicy", label: "Extra Spicy" },
  { value: "mild", label: "Mild" },

  { value: "healthy", label: "Healthy" },
  { value: "low_calorie", label: "Low Calorie" },
  { value: "high_protein", label: "High Protein" },
  { value: "high_fiber", label: "High Fiber" },

  { value: "jain", label: "Jain" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },

  { value: "kids_favourite", label: "Kids Favourite" },
  { value: "family_pack", label: "Family Pack" },
  { value: "premium", label: "Premium" },
  { value: "budget_friendly", label: "Budget Friendly" },

  { value: "freshly_prepared", label: "Freshly Prepared" },
  { value: "seasonal", label: "Seasonal Special" },

  { value: "north_indian", label: "North Indian" },
  { value: "south_indian", label: "South Indian" },
  { value: "chinese", label: "Chinese" },
  { value: "italian", label: "Italian" },
  { value: "street_food", label: "Street Food" },

  { value: "contains_nuts", label: "Contains Nuts" },
  { value: "contains_dairy", label: "Contains Dairy" }
];

export const SPICE_LEVEL_OPTIONS: MultiSelectOption[] = [
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "spicy", label: "Spicy" },
  { value: "extra_spicy", label: "Extra Spicy" },
];

export const INGREDIENT_OPTIONS: MultiSelectOption[] = [
  { value: "paneer", label: "Paneer" },
  { value: "milk", label: "Milk" },
  { value: "cheese", label: "Cheese" },
  { value: "butter", label: "Butter" },
  { value: "fresh_cream", label: "Fresh Cream" },
  { value: "curd", label: "Curd" },

  { value: "onion", label: "Onion" },
  { value: "tomato", label: "Tomato" },
  { value: "potato", label: "Potato" },
  { value: "capsicum", label: "Capsicum" },
  { value: "green_peas", label: "Green Peas" },
  { value: "mushroom", label: "Mushroom" },
  { value: "cauliflower", label: "Cauliflower" },
  { value: "spinach", label: "Spinach" },
  { value: "corn", label: "Sweet Corn" },

  { value: "ginger", label: "Ginger" },
  { value: "garlic", label: "Garlic" },
  { value: "green_chilli", label: "Green Chilli" },
  { value: "fresh_coriander", label: "Fresh Coriander" },

  { value: "cashew_paste", label: "Cashew Paste" },
  { value: "cashew", label: "Cashew" },

  { value: "salt", label: "Salt" },
  { value: "turmeric", label: "Turmeric" },
  { value: "red_chilli_powder", label: "Red Chilli Powder" },
  { value: "coriander_powder", label: "Coriander Powder" },
  { value: "cumin", label: "Cumin" },
  { value: "garam_masala", label: "Garam Masala" },
  { value: "green_cardamom", label: "Green Cardamom" },
  { value: "kasuri_methi", label: "Kasuri Methi" },

  { value: "basmati_rice", label: "Basmati Rice" },
  { value: "wheat_flour", label: "Wheat Flour" },
  { value: "oil", label: "Cooking Oil" },
];

export const ALLERGEN_OPTIONS: MultiSelectOption[] = [
  { value: "milk", label: "Milk" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten (Wheat)" },
  { value: "tree_nuts", label: "Tree Nuts" },
  { value: "cashew", label: "Cashew" },
  { value: "peanuts", label: "Peanuts" },
  { value: "soy", label: "Soy" },
  { value: "eggs", label: "Eggs" },
  { value: "sesame", label: "Sesame" },
  { value: "mustard", label: "Mustard" },
  { value: "celery", label: "Celery" },
  { value: "sulphites", label: "Sulphites" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "molluscs", label: "Molluscs" },
  { value: "lupin", label: "Lupin" }
];

const DIET_TYPE_SET = new Set<string>(DIET_TYPE_OPTIONS.map((o) => o.value));
const FOOD_TAG_SET = new Set<string>(FOOD_TAG_OPTIONS.map((o) => o.value));
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

export function normalizeFoodTags(value: unknown): FoodTag[] {
  return normalizeStringArray<FoodTag>(value, FOOD_TAG_SET);
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

function parseNamedPriceList<T extends { name?: string; label?: string; price?: number; extra_price?: number }>(
  value: unknown,
  mapEntry: (name: string, price: number) => T | null,
): T[] {
  let raw: unknown = value;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      raw = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const name = String(record.name ?? record.label ?? "").trim();
      if (!name) return null;

      const priceRaw = record.price ?? record.extra_price;
      const price =
        typeof priceRaw === "number" ? priceRaw : Number(priceRaw ?? 0);

      if (!Number.isFinite(price) || price < 0) {
        return null;
      }

      return mapEntry(name, price);
    })
    .filter((entry): entry is T => entry !== null);
}

export function normalizeVariants(value: unknown): ProductVariant[] {
  return parseNamedPriceList(value, (name, price) => ({ name, price }));
}

export function normalizeCustomizations(value: unknown): ProductCustomization[] {
  return parseNamedPriceList(value, (name, price) => ({
    label: name,
    extra_price: price,
  }));
}

function parseOptionalNonNegativeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function isNutritionKey(value: string): value is NutritionKey {
  return NUTRITION_KEY_SET.has(value);
}

export function getNutritionOption(key: NutritionKey) {
  return NUTRITION_OPTIONS.find((option) => option.key === key);
}

export function normalizeNutrition(value: unknown): ProductNutritionItem[] {
  let raw: unknown = value;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      raw = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  // Legacy object shape: { calories: 420, protein: 18, ... }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    return NUTRITION_OPTIONS.flatMap((option) => {
      const parsed = parseOptionalNonNegativeNumber(record[option.key]);
      if (parsed == null) return [];
      return [{ key: option.key, value: parsed }];
    });
  }

  if (!Array.isArray(raw)) return [];

  const seen = new Set<NutritionKey>();
  const items: ProductNutritionItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const keyRaw = String(record.key ?? "").trim();
    if (!isNutritionKey(keyRaw) || seen.has(keyRaw)) continue;

    const parsed = parseOptionalNonNegativeNumber(record.value);
    if (parsed == null) continue;

    seen.add(keyRaw);
    items.push({ key: keyRaw, value: parsed });
  }

  return items;
}

export function hasProductNutrition(
  nutrition: ProductNutritionItem[] | null | undefined,
): boolean {
  return Array.isArray(nutrition) && nutrition.length > 0;
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

/** Turns `paneer_special` / `paneer-special` into `Paneer Special`. */
export function formatSlugLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getOptionLabel(
  options: MultiSelectOption[],
  value: string,
): string {
  return (
    options.find((option) => option.value === value)?.label ??
    formatSlugLabel(value)
  );
}

export function formatOptionList(
  options: MultiSelectOption[],
  values: string[],
): string {
  if (!values.length) return "—";
  return values.map((value) => getOptionLabel(options, value)).join(", ");
}
