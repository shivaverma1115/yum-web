-- Issue 19: only service_role may write coupon_redemptions.
-- Authenticated users keep SELECT via existing RLS read policy.

begin;

drop policy if exists "coupon_redemptions_insert_own_or_admin" on public.coupon_redemptions;
drop policy if exists "coupon_redemptions_delete_own_or_admin" on public.coupon_redemptions;
drop policy if exists "coupon_redemptions_delete_admin_only" on public.coupon_redemptions;

revoke insert, update, delete
on table public.coupon_redemptions
from anon, authenticated;

grant select, insert, update, delete
on table public.coupon_redemptions
to service_role;

grant select on table public.coupon_redemptions to authenticated;

commit;
