-- Full row data in WAL improves Realtime UPDATE delivery with RLS.
alter table public.orders replica identity full;
