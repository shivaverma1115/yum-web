alter table public.orders
  drop column if exists customer_first_name,
  drop column if exists customer_last_name,
  drop column if exists customer_email;
