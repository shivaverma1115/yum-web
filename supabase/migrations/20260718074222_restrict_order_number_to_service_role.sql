-- Issue 2: only service_role may allocate public order numbers.
-- App order creation uses the admin client (service role).

begin;

revoke all on function public.next_order_number(text, text) from public;
revoke all on function public.next_order_number(text, text) from anon;
revoke all on function public.next_order_number(text, text) from authenticated;

grant execute on function public.next_order_number(text, text) to service_role;

-- Sequence table is only used inside the security-definer RPC.
revoke all on table public.order_number_seq from public;
revoke all on table public.order_number_seq from anon;
revoke all on table public.order_number_seq from authenticated;

grant select, insert, update on table public.order_number_seq to service_role;

commit;
