-- Store full_name from auth metadata when a profile row is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'fullName', ''),
      ''
    ),
    'user'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(
      nullif(excluded.full_name, ''),
      public.profiles.full_name
    );
  return new;
end;
$$;
