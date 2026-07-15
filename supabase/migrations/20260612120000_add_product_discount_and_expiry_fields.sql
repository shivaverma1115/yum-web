alter table public.products
  add column if not exists discount_percent numeric(5, 2)
    check (discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)),
  add column if not exists expiry_start_date date,
  add column if not exists expiry_end_date date;

alter table public.products
  drop constraint if exists products_expiry_date_range;

alter table public.products
  add constraint products_expiry_date_range
  check (
    expiry_start_date is null
    or expiry_end_date is null
    or expiry_end_date >= expiry_start_date
  );
