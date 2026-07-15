-- Harden money/auth RLS: block privilege escalation and client payment/status edits.
-- Order/coupon writes used by the app go through the service role (admin client).

-- 1) Profiles: users cannot change their own role (admin escalation).
create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not public.is_admin() then
    raise exception 'Changing profile role is not allowed';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_profile_role_escalation();

-- 2) Orders: only admins may update/delete via the anon/authenticated clients.
--    App payment + status updates use the service role and bypass RLS.
drop policy if exists "orders_update_own_or_admin" on public.orders;
create policy "orders_update_admin_only"
  on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_delete_own_or_admin" on public.orders;
create policy "orders_delete_admin_only"
  on public.orders
  for delete
  to authenticated
  using (public.is_admin());

-- 3) Coupon redemptions: users must not delete their own redemptions (reuse exploit).
drop policy if exists "coupon_redemptions_delete_own_or_admin" on public.coupon_redemptions;
create policy "coupon_redemptions_delete_admin_only"
  on public.coupon_redemptions
  for delete
  to authenticated
  using (public.is_admin());
