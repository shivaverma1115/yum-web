-- Issue 9: prevent privilege escalation on profile insert.
-- Self-insert may only create role = 'user'. Admins may still insert any role.
-- Trigger blocks role = 'admin' on insert unless the actor is already an admin
-- (or service_role / no JWT, used by backend + SQL ops).

begin;

drop policy if exists "profiles_insert_self_or_admin" on public.profiles;
drop policy if exists "profiles_insert_self_user_or_admin" on public.profiles;

create policy "profiles_insert_self_user_or_admin"
  on public.profiles
  for insert
  to authenticated
  with check (
    (id = auth.uid() and role = 'user')
    or public.is_admin()
  );

create or replace function public.prevent_profile_admin_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'admin' then
    -- service_role / postgres (no end-user JWT) may bootstrap admins.
    if coalesce(auth.jwt() ->> 'role', '') = 'service_role'
       or auth.uid() is null then
      return new;
    end if;

    if not public.is_admin() then
      raise exception 'Creating an admin profile is not allowed';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_admin_insert on public.profiles;
create trigger profiles_prevent_admin_insert
  before insert on public.profiles
  for each row
  execute function public.prevent_profile_admin_insert();

commit;
