-- Human-readable public order numbers (e.g. YUM-250711-0001).
-- UUID `id` remains the primary key for FKs / Razorpay / URLs.

alter table public.orders
  add column if not exists order_number text;

create table if not exists public.order_number_seq (
  day_key text primary key,
  last_value integer not null default 0 check (last_value >= 0)
);

create or replace function public.next_order_number(
  p_prefix text default 'YUM',
  p_timezone text default 'Asia/Kolkata'
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tz text;
  v_day text;
  v_seq integer;
  v_prefix text;
begin
  begin
    perform now() at time zone coalesce(nullif(trim(p_timezone), ''), 'Asia/Kolkata');
    v_tz := coalesce(nullif(trim(p_timezone), ''), 'Asia/Kolkata');
  exception
    when others then
      v_tz := 'Asia/Kolkata';
  end;

  v_day := to_char((now() at time zone v_tz), 'YYMMDD');

  v_prefix := upper(regexp_replace(coalesce(nullif(trim(p_prefix), ''), 'YUM'), '[^A-Z0-9]', '', 'g'));
  if length(v_prefix) = 0 then
    v_prefix := 'YUM';
  end if;
  v_prefix := left(v_prefix, 8);

  insert into public.order_number_seq (day_key, last_value)
  values (v_day, 1)
  on conflict (day_key) do update
    set last_value = public.order_number_seq.last_value + 1
  returning last_value into v_seq;

  return v_prefix || '-' || v_day || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

revoke all on function public.next_order_number(text, text) from public;
grant execute on function public.next_order_number(text, text) to authenticated;
grant execute on function public.next_order_number(text, text) to service_role;

-- Backfill existing orders chronologically (store-local calendar day).
do $$
declare
  r record;
  v_day text;
  v_seq integer;
  v_prefix text := 'YUM';
begin
  for r in
    select id, created_at
    from public.orders
    where order_number is null
    order by created_at asc, id asc
  loop
    v_day := to_char((r.created_at at time zone 'Asia/Kolkata'), 'YYMMDD');

    insert into public.order_number_seq (day_key, last_value)
    values (v_day, 1)
    on conflict (day_key) do update
      set last_value = public.order_number_seq.last_value + 1
    returning last_value into v_seq;

    update public.orders
    set order_number = v_prefix || '-' || v_day || '-' || lpad(v_seq::text, 4, '0')
    where id = r.id;
  end loop;
end;
$$;

create unique index if not exists orders_order_number_uidx
  on public.orders (order_number);

alter table public.orders
  alter column order_number set not null;
