-- Keep placeholder auth emails off profiles; phone-only users get null email.

create or replace function public.sanitize_profile_email(raw_email text)
returns text
language sql
immutable
as $$
  select case
    when raw_email is null or trim(raw_email) = '' then null
    when raw_email ilike '%@phone.yum.internal' then null
    when raw_email ilike '%@checkout.internal' then null
    else trim(raw_email)
  end;
$$;

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
    public.sanitize_profile_email(new.email),
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
    coalesce(nullif(new.phone, ''), ''),
    'user'
  )
  on conflict (id) do update set
    email = coalesce(
      public.sanitize_profile_email(excluded.email),
      public.profiles.email
    ),
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

update public.profiles
set email = null
where email ilike '%@phone.yum.internal'
   or email ilike '%@checkout.internal';
