-- Convert food_tags text[] to a single food_tag text value.
alter table public.products
  add column if not exists food_tag text;

update public.products
set food_tag = food_tags[1]
where
  food_tag is null
  and food_tags is not null
  and cardinality(food_tags) > 0;

alter table public.products
  drop column if exists food_tags;
