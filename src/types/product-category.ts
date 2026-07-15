export type IProductCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProductCategoryInput = {
  name: string;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
};
