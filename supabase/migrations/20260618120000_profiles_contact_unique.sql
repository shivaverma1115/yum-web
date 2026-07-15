-- Case-insensitive unique email on profiles (non-empty values only).
create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(trim(email)))
  where email is not null and trim(email) <> '';
