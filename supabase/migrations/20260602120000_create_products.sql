create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  selling_price numeric(10, 2) not null check (selling_price >= 0),
  cost_price numeric(10, 2) not null check (cost_price >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  order_type text not null,
  short_description text not null,
  long_description text not null,
  add_discount boolean not null default false,
  add_expiry_date boolean not null default false,
  return_policy boolean not null default false,
  image_url text,
  image_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

create policy "Admins can manage products"
on public.products
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
