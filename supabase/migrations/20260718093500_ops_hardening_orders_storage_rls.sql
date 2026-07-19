-- Issues 24, 26, 27: order retention, storage hardening, product/QR read scope.

begin;

-- 24) Keep orders when a user is deleted (anonymize via null user_id).
alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  alter column user_id drop not null;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- 27) Public catalog: available products only (admins use service role).
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_public_read_available" on public.products;

create policy "products_public_read_available"
  on public.products
  for select
  to anon, authenticated
  using (is_available = true or public.is_admin());

-- 27) Do not expose table QR codes (scan secrets) via PostgREST to anon.
drop policy if exists "table_qr_codes_public_read_active" on public.table_qr_codes;
drop policy if exists "table_qr_codes_select_admin_only" on public.table_qr_codes;

create policy "table_qr_codes_select_admin_only"
  on public.table_qr_codes
  for select
  to authenticated
  using (public.is_admin());

-- 26) Storage buckets: public read, service_role write only.
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('table-qr', 'table-qr', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_service_write" on storage.objects;
drop policy if exists "table_qr_public_read" on storage.objects;
drop policy if exists "table_qr_service_write" on storage.objects;
drop policy if exists "Public read product-images" on storage.objects;
drop policy if exists "Public read table-qr" on storage.objects;
drop policy if exists "Authenticated upload product-images" on storage.objects;
drop policy if exists "Authenticated upload table-qr" on storage.objects;

create policy "product_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

create policy "product_images_service_write"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "table_qr_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'table-qr');

create policy "table_qr_service_write"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'table-qr')
  with check (bucket_id = 'table-qr');

commit;
