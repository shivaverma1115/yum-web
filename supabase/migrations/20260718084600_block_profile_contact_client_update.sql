-- Issue 12: block direct profiles.email / profiles.phone updates via PostgREST.
-- Contact changes must go through the API (OTP-gated) using the service role.
-- Authenticated users may still update other profile fields (name, etc.).

begin;

create or replace function public.prevent_profile_contact_client_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email
     or new.phone is distinct from old.phone then
    -- service_role / postgres (no end-user JWT) may sync verified contacts.
    if coalesce(auth.jwt() ->> 'role', '') = 'service_role'
       or auth.uid() is null then
      return new;
    end if;

    raise exception 'Updating profile email or phone is not allowed directly';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_contact_client_update on public.profiles;
create trigger profiles_prevent_contact_client_update
  before update on public.profiles
  for each row
  execute function public.prevent_profile_contact_client_update();

commit;
