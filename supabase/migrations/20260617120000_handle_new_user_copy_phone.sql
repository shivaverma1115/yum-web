-- Copy auth phone into profiles when a user is created (phone checkout / signup).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'first_name', ''),
      nullif(new.raw_user_meta_data->>'firstName', ''),
      'Guest'
    ),
    coalesce(
      nullif(new.raw_user_meta_data->>'last_name', ''),
      nullif(new.raw_user_meta_data->>'lastName', ''),
      '-'
    ),
    coalesce(nullif(new.phone, ''), ''),
    'user'
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    first_name = coalesce(
      nullif(excluded.first_name, ''),
      public.profiles.first_name
    ),
    last_name = coalesce(
      nullif(excluded.last_name, ''),
      public.profiles.last_name
    ),
    phone = coalesce(
      nullif(excluded.phone, ''),
      public.profiles.phone
    );
  return new;
end;
$$;
