alter table public.products
  add column if not exists preparation_time_minutes integer
    check (preparation_time_minutes is null or preparation_time_minutes >= 0);

alter table public.products
  drop constraint if exists products_expiry_date_range;

alter table public.products
  drop column if exists add_expiry_date,
  drop column if exists expiry_start_date,
  drop column if exists expiry_end_date,
  drop column if exists return_policy;
