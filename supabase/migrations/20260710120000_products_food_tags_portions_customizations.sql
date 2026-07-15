-- Expand food type options and add tags, portion sizes, and customizations.
alter table public.products
  drop constraint if exists products_diet_type_check;

alter table public.products
  add constraint products_diet_type_check
  check (
    diet_type is null
    or diet_type in ('veg', 'non_veg', 'egg', 'jain', 'vegan')
  );

alter table public.products
  add column if not exists food_tags text[] not null default '{}',
  add column if not exists portion_sizes text[] not null default '{}',
  add column if not exists customizations jsonb not null default '[]'::jsonb;
