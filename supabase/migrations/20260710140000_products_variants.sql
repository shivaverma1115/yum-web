-- Replace fixed portion_sizes tags with priced variants (Half/Full, etc.).
alter table public.products
  drop column if exists portion_sizes;

alter table public.products
  add column if not exists variants jsonb not null default '[]'::jsonb;
