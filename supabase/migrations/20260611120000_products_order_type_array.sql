-- Store multiple fulfillment types per product (delivery, pickup, dine_in).
alter table public.products
  alter column order_type type text[] using array[order_type];

alter table public.products
  add constraint products_order_type_not_empty
  check (cardinality(order_type) > 0);
