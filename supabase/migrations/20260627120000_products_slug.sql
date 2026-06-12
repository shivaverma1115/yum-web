alter table public.products
  add column if not exists slug text;

with base as (
  select
    id,
    created_at,
    case
      when trim(both '-' from regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')) = ''
        then 'product-' || substr(id::text, 1, 8)
      else trim(both '-' from regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g'))
    end as base_slug
  from public.products
),
numbered as (
  select
    id,
    base_slug,
    row_number() over (partition by base_slug order by created_at, id) as rn
  from base
)
update public.products p
set slug = case
  when n.rn = 1 then n.base_slug
  else n.base_slug || '-' || n.rn
end
from numbered n
where p.id = n.id
  and p.slug is null;

alter table public.products
  alter column slug set not null;

create unique index if not exists products_slug_idx on public.products (slug);
