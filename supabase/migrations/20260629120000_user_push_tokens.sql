create table if not exists public.user_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  token text not null,
  platform text not null default 'web',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

create index if not exists user_push_tokens_user_id_idx
  on public.user_push_tokens (user_id)
  where enabled = true;

create or replace function public.set_user_push_tokens_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_push_tokens_set_updated_at on public.user_push_tokens;
create trigger user_push_tokens_set_updated_at
  before update on public.user_push_tokens
  for each row
  execute function public.set_user_push_tokens_updated_at();

alter table public.user_push_tokens enable row level security;

drop policy if exists "Users manage own push tokens" on public.user_push_tokens;
create policy "Users manage own push tokens"
  on public.user_push_tokens
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
