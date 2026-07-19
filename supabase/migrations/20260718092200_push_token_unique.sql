-- Issue 18: one FCM/device token maps to at most one user.

begin;

-- Keep the newest row per token when duplicates exist.
delete from public.user_push_tokens a
using public.user_push_tokens b
where a.token = b.token
  and a.id <> b.id
  and (
    a.updated_at < b.updated_at
    or (a.updated_at = b.updated_at and a.id::text > b.id::text)
  );

create unique index if not exists user_push_tokens_token_uidx
  on public.user_push_tokens (token);

commit;
