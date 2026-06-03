alter table public.products
add column if not exists user_id uuid references public.profiles (id) on delete set null;

create index if not exists products_user_id_idx on public.products (user_id);
