alter table public.table_qr_codes
  add column if not exists scan_url text;

comment on column public.table_qr_codes.scan_url is
  'Canonical scan URL encoded in the QR image; used to redirect when the site URL changes.';
