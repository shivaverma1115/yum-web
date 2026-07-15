drop index if exists public.profiles_phone_digits_uidx;

alter table public.profiles
  drop column if exists phone_digits;
