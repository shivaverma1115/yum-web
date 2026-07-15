-- Normalized phone for guest checkout account lookup
alter table public.profiles
  add column if not exists phone_digits text not null default '';

update public.profiles
set phone_digits = regexp_replace(phone, '\D', '', 'g')
where phone_digits = ''
  and phone is not null
  and phone <> ''
  and phone <> '-';

-- Keep one profile per phone; clear duplicates so the unique index can be created
with ranked as (
  select
    id,
    row_number() over (
      partition by phone_digits
      order by created_at nulls last, id
    ) as rn
  from public.profiles
  where length(phone_digits) >= 10
)
update public.profiles p
set phone_digits = ''
from ranked r
where p.id = r.id
  and r.rn > 1;

create unique index if not exists profiles_phone_digits_uidx
  on public.profiles (phone_digits)
  where length(phone_digits) >= 10;

-- Guest orders without a linked user cannot satisfy NOT NULL
delete from public.orders
where user_id is null;

alter table public.orders
  alter column user_id set not null;

alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete restrict;

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() = user_id);
