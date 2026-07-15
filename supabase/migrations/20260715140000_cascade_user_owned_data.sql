-- Cascade user-owned rows when an auth user is deleted.
-- Storage objects (product images) still need app-level cleanup before deleteUser.

alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.products
  drop constraint if exists products_user_id_fkey;

alter table public.products
  add constraint products_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;
