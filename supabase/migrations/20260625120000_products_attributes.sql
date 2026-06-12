alter table public.products
  add column if not exists diet_type text
    check (diet_type is null or diet_type in ('veg', 'non_veg')),
  add column if not exists spice_levels text[] not null default '{}',
  add column if not exists ingredients text[] not null default '{}',
  add column if not exists allergens text[] not null default '{}',
  add column if not exists is_available boolean not null default true;
