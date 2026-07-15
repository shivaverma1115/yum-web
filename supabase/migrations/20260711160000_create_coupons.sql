-- Coupons (admin-created) + one redemption per user after successful use.

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  min_order_amount numeric(10, 2) not null default 0 check (min_order_amount >= 0),
  max_discount_amount numeric(10, 2) check (max_discount_amount is null or max_discount_amount > 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_code_nonempty check (length(trim(code)) > 0),
  constraint coupons_percent_range check (
    discount_type <> 'percent' or (discount_value > 0 and discount_value <= 100)
  ),
  constraint coupons_date_range check (
    starts_at is null or ends_at is null or starts_at <= ends_at
  )
);

create unique index if not exists coupons_code_unique_idx
  on public.coupons (upper(trim(code)));

create index if not exists coupons_is_active_idx on public.coupons (is_active);
create index if not exists coupons_created_at_idx on public.coupons (created_at desc);

create or replace function public.set_coupons_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.code = upper(trim(new.code));
  return new;
end;
$$;

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
  before insert or update on public.coupons
  for each row
  execute function public.set_coupons_updated_at();

alter table public.coupons enable row level security;

drop policy if exists "coupons_select_active_authenticated" on public.coupons;
drop policy if exists "coupons_select_admin" on public.coupons;
drop policy if exists "coupons_insert_admin_only" on public.coupons;
drop policy if exists "coupons_update_admin_only" on public.coupons;
drop policy if exists "coupons_delete_admin_only" on public.coupons;

-- Admins manage all coupons; authenticated users can read active ones for apply/validate.
create policy "coupons_select_admin_or_active"
  on public.coupons
  for select
  to authenticated
  using (public.is_admin() or is_active = true);

create policy "coupons_insert_admin_only"
  on public.coupons
  for insert
  to authenticated
  with check (public.is_admin());

create policy "coupons_update_admin_only"
  on public.coupons
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "coupons_delete_admin_only"
  on public.coupons
  for delete
  to authenticated
  using (public.is_admin());

-- One row per user per coupon. Inserted when the coupon is committed to an order
-- (COD on place; online when payment succeeds / reserved on pending order).
create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  discount_amount numeric(10, 2) not null check (discount_amount >= 0),
  created_at timestamptz not null default now(),
  unique (coupon_id, user_id)
);

create index if not exists coupon_redemptions_user_id_idx
  on public.coupon_redemptions (user_id);
create index if not exists coupon_redemptions_order_id_idx
  on public.coupon_redemptions (order_id);

alter table public.coupon_redemptions enable row level security;

drop policy if exists "coupon_redemptions_select_own_or_admin" on public.coupon_redemptions;
drop policy if exists "coupon_redemptions_insert_own_or_admin" on public.coupon_redemptions;
drop policy if exists "coupon_redemptions_delete_own_or_admin" on public.coupon_redemptions;

create policy "coupon_redemptions_select_own_or_admin"
  on public.coupon_redemptions
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "coupon_redemptions_insert_own_or_admin"
  on public.coupon_redemptions
  for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

create policy "coupon_redemptions_delete_own_or_admin"
  on public.coupon_redemptions
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

alter table public.orders
  add column if not exists coupon_id uuid references public.coupons (id) on delete set null,
  add column if not exists coupon_code text,
  add column if not exists discount_amount numeric(10, 2) not null default 0
    check (discount_amount >= 0);

create index if not exists orders_coupon_id_idx on public.orders (coupon_id);
