-- Issue 11: merge guest (anonymous) user data transactionally before auth delete.
-- Moves orders, products, addresses, push tokens, and coupon redemptions in one
-- function so a mid-merge failure does not leave a half-migrated guest account.

begin;

create or replace function public.merge_anonymous_user_data(
  p_from_user_id uuid,
  p_to_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_orders int := 0;
  v_products int := 0;
  v_addresses int := 0;
  v_push_tokens int := 0;
  v_coupons int := 0;
  v_is_anonymous boolean := false;
begin
  if p_from_user_id is null
     or p_to_user_id is null
     or p_from_user_id = p_to_user_id then
    return jsonb_build_object(
      'orders_moved', 0,
      'products_moved', 0,
      'addresses_moved', 0,
      'push_tokens_moved', 0,
      'coupons_moved', 0
    );
  end if;

  if not exists (select 1 from public.profiles where id = p_to_user_id) then
    raise exception 'Destination profile not found';
  end if;

  select coalesce(u.is_anonymous, false)
    or (
      coalesce(nullif(trim(u.email), ''), null) is null
      and coalesce(nullif(trim(u.phone), ''), null) is null
    )
  into v_is_anonymous
  from auth.users u
  where u.id = p_from_user_id;

  if not found or not v_is_anonymous then
    return jsonb_build_object(
      'orders_moved', 0,
      'products_moved', 0,
      'addresses_moved', 0,
      'push_tokens_moved', 0,
      'coupons_moved', 0
    );
  end if;

  -- Orders
  update public.orders
  set user_id = p_to_user_id
  where user_id = p_from_user_id;
  get diagnostics v_orders = row_count;

  -- Products (owner attribution)
  update public.products
  set user_id = p_to_user_id
  where user_id = p_from_user_id;
  get diagnostics v_products = row_count;

  -- Addresses: keep destination when address_type already exists
  delete from public.user_addresses ua
  where ua.user_id = p_from_user_id
    and exists (
      select 1
      from public.user_addresses t
      where t.user_id = p_to_user_id
        and t.address_type = ua.address_type
    );

  update public.user_addresses
  set user_id = p_to_user_id
  where user_id = p_from_user_id;
  get diagnostics v_addresses = row_count;

  -- Push tokens: keep destination when same token already exists
  delete from public.user_push_tokens pt
  where pt.user_id = p_from_user_id
    and exists (
      select 1
      from public.user_push_tokens t
      where t.user_id = p_to_user_id
        and t.token = pt.token
    );

  update public.user_push_tokens
  set user_id = p_to_user_id
  where user_id = p_from_user_id;
  get diagnostics v_push_tokens = row_count;

  -- Coupon redemptions: keep destination when same coupon already redeemed
  delete from public.coupon_redemptions cr
  where cr.user_id = p_from_user_id
    and exists (
      select 1
      from public.coupon_redemptions t
      where t.user_id = p_to_user_id
        and t.coupon_id = cr.coupon_id
    );

  update public.coupon_redemptions
  set user_id = p_to_user_id
  where user_id = p_from_user_id;
  get diagnostics v_coupons = row_count;

  return jsonb_build_object(
    'orders_moved', v_orders,
    'products_moved', v_products,
    'addresses_moved', v_addresses,
    'push_tokens_moved', v_push_tokens,
    'coupons_moved', v_coupons
  );
end;
$$;

revoke all on function public.merge_anonymous_user_data(uuid, uuid) from public;
revoke all on function public.merge_anonymous_user_data(uuid, uuid) from anon;
revoke all on function public.merge_anonymous_user_data(uuid, uuid) from authenticated;

grant execute on function public.merge_anonymous_user_data(uuid, uuid) to service_role;

commit;
