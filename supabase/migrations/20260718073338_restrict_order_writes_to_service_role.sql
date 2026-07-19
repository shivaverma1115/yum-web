-- Issue 1: only service_role (Next.js admin client /api/orders etc.) may write
-- orders. Authenticated users keep SELECT via existing RLS read policies.

begin;

-- Remove direct client write policies on orders.
drop policy if exists "orders_insert_own_or_admin" on public.orders;
drop policy if exists "orders_update_admin_only" on public.orders;
drop policy if exists "orders_delete_admin_only" on public.orders;

-- Remove legacy policies, if present.
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Admins can manage orders" on public.orders;

-- Remove direct client write policies on order items.
drop policy if exists "order_items_insert_own_or_admin" on public.order_items;
drop policy if exists "order_items_update_own_or_admin" on public.order_items;
drop policy if exists "order_items_delete_own_or_admin" on public.order_items;
drop policy if exists "Admins can manage order items" on public.order_items;

-- Defence in depth: authenticated/anonymous clients cannot write.
revoke insert, update, delete
on table public.orders
from anon, authenticated;

revoke insert, update, delete
on table public.order_items
from anon, authenticated;

-- Ensure service role retains full write access (bypasses RLS).
grant select, insert, update, delete
on table public.orders
to service_role;

grant select, insert, update, delete
on table public.order_items
to service_role;

-- Keep read access for signed-in users (RLS still scopes rows).
grant select on table public.orders to authenticated;
grant select on table public.order_items to authenticated;

commit;