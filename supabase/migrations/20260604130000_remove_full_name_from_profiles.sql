-- Backfill first_name / last_name from legacy full_name, then drop full_name.

update public.profiles
set first_name = split_part(trim(full_name), ' ', 1)
where coalesce(trim(first_name), '') = ''
  and coalesce(trim(full_name), '') <> '';

update public.profiles
set last_name = trim(
  substring(
    trim(full_name)
    from length(split_part(trim(full_name), ' ', 1)) + 1
  )
)
where coalesce(trim(last_name), '') = ''
  and coalesce(trim(full_name), '') <> ''
  and position(' ' in trim(full_name)) > 0;

alter table public.profiles drop column if exists full_name;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'first_name', ''),
      nullif(new.raw_user_meta_data->>'firstName', ''),
      ''
    ),
    coalesce(
      nullif(new.raw_user_meta_data->>'last_name', ''),
      nullif(new.raw_user_meta_data->>'lastName', ''),
      ''
    ),
    'user'
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(
      nullif(excluded.first_name, ''),
      public.profiles.first_name
    ),
    last_name = coalesce(
      nullif(excluded.last_name, ''),
      public.profiles.last_name
    );
  return new;
end;
$$;
