create table if not exists public.business_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.business_settings (id, settings)
values (
  'default',
  '{
    "general": {
      "site_name": "Yum",
      "site_url": "https://yum.com",
      "currency": "INR",
      "currency_symbol": "₹"
    },
    "order": {
      "cod_enabled": true,
      "online_payment_enabled": true,
      "min_order_amount": 100,
      "delivery_charge": 40
    },
    "phone_verification": {
      "mode": "test",
      "required_for": {
        "registration": true,
        "checkout": false,
        "profile_update": false
      }
    },
    "payment": {
      "razorpay_enabled": true
    },
    "support": {
      "email": "support@yum.com",
      "phone": "9876543210"
    }
  }'::jsonb
)
on conflict (id) do nothing;

alter table public.business_settings enable row level security;

create policy "Public can read business settings"
on public.business_settings
for select
to anon, authenticated
using (true);

create policy "Admins can update business settings"
on public.business_settings
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
