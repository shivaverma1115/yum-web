# Storage buckets

## `product-images`
- **Public read** of objects (storefront images via public URL).
- **Writes** only via `service_role` (Next.js admin client). Authenticated/anon clients cannot upload.

## `table-qr`
- **Public read** of QR PNGs.
- **Writes** only via `service_role`.
- Table QR **codes** (scan tokens) are not publicly selectable in Postgres RLS; lookup goes through server admin APIs (`/t/[code]`, admin table-qr routes).
