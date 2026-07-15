-- Map Google/OAuth names from auth metadata into profiles on signup and backfill existing rows.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_first text;
  v_last text;
  v_full text;
begin
  v_first := coalesce(
    nullif(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'firstName', ''),
    ''
  );
  v_last := coalesce(
    nullif(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'lastName', ''),
    ''
  );

  if v_first = '' and v_last = '' then
    v_full := coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      ''
    );
    if v_full <> '' then
      v_first := split_part(trim(v_full), ' ', 1);
      v_last := trim(
        substring(
          trim(v_full)
          from length(split_part(trim(v_full), ' ', 1)) + 1
        )
      );
    end if;
  end if;

  insert into public.profiles (id, email, first_name, last_name, phone, role)
  values (
    new.id,
    public.sanitize_profile_email(new.email),
    v_first,
    v_last,
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

-- Backfill names for OAuth users created before full_name/name mapping existed.
update public.profiles p
set
  first_name = split_part(trim(v.full_name), ' ', 1),
  last_name = trim(
    substring(
      trim(v.full_name)
      from length(split_part(trim(v.full_name), ' ', 1)) + 1
    )
  )
from (
  select
    u.id,
    coalesce(
      nullif(u.raw_user_meta_data->>'full_name', ''),
      nullif(u.raw_user_meta_data->>'name', ''),
      ''
    ) as full_name
  from auth.users u
) v
where p.id = v.id
  and coalesce(trim(p.first_name), '') = ''
  and coalesce(trim(p.last_name), '') = ''
  and v.full_name <> '';
