create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  address_type text not null check (address_type in ('billing', 'shipping')),
  first_name text not null default '',
  last_name text not null default '',
  company_name text not null default '',
  address_line text not null default '',
  country text not null default '',
  state text not null default '',
  city text not null default '',
  zip_code text not null default '',
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, address_type)
);

create index if not exists user_addresses_user_id_idx
  on public.user_addresses (user_id);

create or replace function public.set_user_addresses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_addresses_set_updated_at on public.user_addresses;
create trigger user_addresses_set_updated_at
  before update on public.user_addresses
  for each row
  execute function public.set_user_addresses_updated_at();

alter table public.user_addresses enable row level security;

drop policy if exists "Users can read own addresses" on public.user_addresses;
create policy "Users can read own addresses"
on public.user_addresses
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own addresses" on public.user_addresses;
create policy "Users can insert own addresses"
on public.user_addresses
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own addresses" on public.user_addresses;
create policy "Users can update own addresses"
on public.user_addresses
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own addresses" on public.user_addresses;
create policy "Users can delete own addresses"
on public.user_addresses
for delete
to authenticated
using (auth.uid() = user_id);
