alter table public.products
  add column if not exists nutrition jsonb not null default '{}'::jsonb;
