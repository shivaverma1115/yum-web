alter table public.profiles
  drop column if exists country,
  drop column if exists state;
