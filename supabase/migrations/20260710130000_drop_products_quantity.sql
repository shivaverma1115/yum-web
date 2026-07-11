-- Restaurant menus don't track inventory stock per product.
alter table public.products
  drop column if exists quantity;
