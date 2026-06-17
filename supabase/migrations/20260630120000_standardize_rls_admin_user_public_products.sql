-- Standardize RLS for admin/user model and public product browsing.
-- Access model:
-- 1) admin: full access
-- 2) user: read/write own data
-- 3) products: public read, admin write

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- PROFILES
alter table public.profiles enable row level security;

drop policy if exists "Profiles: read own" on public.profiles;
drop policy if exists "Profiles: insert own" on public.profiles;
drop policy if exists "Profiles: update own" on public.profiles;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self_or_admin" on public.profiles;
create policy "profiles_insert_self_or_admin"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_delete_admin_only" on public.profiles;
create policy "profiles_delete_admin_only"
  on public.profiles
  for delete
  to authenticated
  using (public.is_admin());

-- ORDERS
alter table public.orders enable row level security;

drop policy if exists "Users can read own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Admins can manage orders" on public.orders;

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
  on public.orders
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_own_or_admin" on public.orders;
create policy "orders_insert_own_or_admin"
  on public.orders
  for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_update_own_or_admin" on public.orders;
create policy "orders_update_own_or_admin"
  on public.orders
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_delete_own_or_admin" on public.orders;
create policy "orders_delete_own_or_admin"
  on public.orders
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ORDER ITEMS
alter table public.order_items enable row level security;

drop policy if exists "Users can read own order items" on public.order_items;
drop policy if exists "Admins can manage order items" on public.order_items;

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
  on public.order_items
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own_or_admin" on public.order_items;
create policy "order_items_insert_own_or_admin"
  on public.order_items
  for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_update_own_or_admin" on public.order_items;
create policy "order_items_update_own_or_admin"
  on public.order_items
  for update
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_delete_own_or_admin" on public.order_items;
create policy "order_items_delete_own_or_admin"
  on public.order_items
  for delete
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- USER ADDRESSES
alter table public.user_addresses enable row level security;

drop policy if exists "Users can read own addresses" on public.user_addresses;
drop policy if exists "Users can insert own addresses" on public.user_addresses;
drop policy if exists "Users can update own addresses" on public.user_addresses;
drop policy if exists "Users can delete own addresses" on public.user_addresses;

drop policy if exists "user_addresses_select_own_or_admin" on public.user_addresses;
create policy "user_addresses_select_own_or_admin"
  on public.user_addresses
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_addresses_insert_own_or_admin" on public.user_addresses;
create policy "user_addresses_insert_own_or_admin"
  on public.user_addresses
  for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_addresses_update_own_or_admin" on public.user_addresses;
create policy "user_addresses_update_own_or_admin"
  on public.user_addresses
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_addresses_delete_own_or_admin" on public.user_addresses;
create policy "user_addresses_delete_own_or_admin"
  on public.user_addresses
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- USER PUSH TOKENS
alter table public.user_push_tokens enable row level security;

drop policy if exists "Users manage own push tokens" on public.user_push_tokens;

drop policy if exists "user_push_tokens_manage_own_or_admin" on public.user_push_tokens;
create policy "user_push_tokens_manage_own_or_admin"
  on public.user_push_tokens
  for all
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- PRODUCTS
alter table public.products enable row level security;

drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_insert_admin_only" on public.products;
drop policy if exists "products_update_admin_only" on public.products;
drop policy if exists "products_delete_admin_only" on public.products;

create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "products_insert_admin_only"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy "products_update_admin_only"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_delete_admin_only"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());
