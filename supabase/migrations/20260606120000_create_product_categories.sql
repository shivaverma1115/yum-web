create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_categories_sort_order_idx
  on public.product_categories (sort_order asc, name asc);

create index if not exists product_categories_is_active_idx
  on public.product_categories (is_active);

alter table public.product_categories enable row level security;

create policy "Anyone can read active product categories"
on public.product_categories
for select
using (is_active = true);

create policy "Admins can manage product categories"
on public.product_categories
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

insert into public.product_categories (name, slug, sort_order) values
  ('Wraps', 'wraps_roll', 1),
  ('Noodles', 'noodles_bowl', 2),
  ('Burrito Bowls', 'burrito_bowls', 3),
  ('Thalis', 'thalis', 4),
  ('Smart Meals', 'smart_meals', 5),
  ('Salads', 'salads', 6),
  ('Beverages & Desserts', 'beverages_desserts', 7),
  ('Appetizers', 'appetizers', 8),
  ('Burger & More', 'burger_more', 9),
  ('Italian', 'italian', 10),
  ('BBQ', 'bbq', 11),
  ('Mexican', 'mexican', 12)
on conflict (slug) do nothing;
