drop table if exists action_outcomes;
drop table if exists shipments;
drop table if exists routes;
drop table if exists suppliers;

create table shipments (
  shipment_id text primary key,
  order_id text not null,
  route_id text not null,
  skus text[] not null,
  due_date date not null,
  estimated_arrival date,
  status text not null check (status in ('in-transit', 'delayed', 'delivered'))
);

create table routes (
  route_id text primary key,
  origin text not null,
  destination text not null,
  status text not null check (status in ('clear', 'disrupted')),
  alternate_route text[] default '{}'
);

create table suppliers (
  supplier_id text primary key,
  name text not null,
  reliability_score numeric not null,
  backup_supplier_id text
);

create table action_outcomes (
  id uuid primary key default gen_random_uuid(),
  notice_id text not null,
  action_kind text not null,
  status text not null check (status in ('approved', 'edited', 'rejected', 'auto-resolved')),
  result_summary text not null,
  logged_at timestamptz not null default now()
);

alter table shipments enable row level security;
create policy "Allow read access" on shipments for select using (true);
create policy "Allow update access" on shipments for update using (true) with check (true);

alter table routes enable row level security;
create policy "Allow read access" on routes for select using (true);

alter table suppliers enable row level security;
create policy "Allow read access" on suppliers for select using (true);

alter table action_outcomes enable row level security;
create policy "Allow insert access" on action_outcomes for insert with check (true);
create policy "Allow read access" on action_outcomes for select using (true);

GRANT SELECT, UPDATE ON public.shipments TO anon;
GRANT SELECT ON public.routes TO anon;
GRANT SELECT ON public.suppliers TO anon;
GRANT SELECT, INSERT ON public.action_outcomes TO anon;