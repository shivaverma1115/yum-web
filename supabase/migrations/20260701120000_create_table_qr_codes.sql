create table if not exists public.table_qr_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  table_number text not null,
  qr_image_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists table_qr_codes_code_idx on public.table_qr_codes (code);
create index if not exists table_qr_codes_created_at_idx on public.table_qr_codes (created_at desc);

alter table public.table_qr_codes enable row level security;

drop policy if exists "Anyone can read active table qr codes" on public.table_qr_codes;
drop policy if exists "Admins can manage table qr codes" on public.table_qr_codes;
drop policy if exists "table_qr_codes_public_read_active" on public.table_qr_codes;
drop policy if exists "table_qr_codes_insert_admin_only" on public.table_qr_codes;
drop policy if exists "table_qr_codes_update_admin_only" on public.table_qr_codes;
drop policy if exists "table_qr_codes_delete_admin_only" on public.table_qr_codes;

create policy "table_qr_codes_public_read_active"
  on public.table_qr_codes
  for select
  to anon, authenticated
  using (is_active = true);

create policy "table_qr_codes_insert_admin_only"
  on public.table_qr_codes
  for insert
  to authenticated
  with check (public.is_admin());

create policy "table_qr_codes_update_admin_only"
  on public.table_qr_codes
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "table_qr_codes_delete_admin_only"
  on public.table_qr_codes
  for delete
  to authenticated
  using (public.is_admin());
