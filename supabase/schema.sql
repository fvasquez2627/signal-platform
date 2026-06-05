-- SIGNAL platform schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Extensions
create extension if not exists "uuid-ossp";

-- Enums
create type public.user_role as enum ('admin', 'manager', 'viewer');
create type public.signal_type as enum ('news', 'social', 'competitor', 'seo', 'trend', 'other');
create type public.draft_status as enum ('draft', 'review', 'approved', 'published');
-- Integration platform keys (see src/lib/integrations/config.ts)
create type public.integration_platform as enum ('slack', 'hubspot', 'google_analytics', 'semrush', 'other');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

-- Clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_voice text,
  compliance_notes text,
  created_at timestamptz not null default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  keywords text[] default '{}',
  competitors text[] default '{}',
  created_at timestamptz not null default now()
);

-- Signals
create table public.signals (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  type public.signal_type not null default 'other',
  source text,
  title text not null,
  body text,
  score numeric(5, 2) check (score >= 0 and score <= 100),
  created_at timestamptz not null default now()
);

-- Content drafts
create table public.content_drafts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  platform text not null,
  hook text,
  body text,
  cta text,
  status public.draft_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Integrations
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  platform public.integration_platform not null,
  encrypted_key text,
  connected boolean not null default false,
  created_at timestamptz not null default now()
);

-- Client ↔ user membership
create table public.client_users (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique (client_id, user_id)
);

-- Indexes
create index idx_products_client_id on public.products (client_id);
create index idx_signals_product_id on public.signals (product_id);
create index idx_signals_created_at on public.signals (created_at desc);
create index idx_content_drafts_product_id on public.content_drafts (product_id);
create index idx_integrations_client_id on public.integrations (client_id);
create index idx_client_users_user_id on public.client_users (user_id);
create index idx_client_users_client_id on public.client_users (client_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'viewer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at for content_drafts
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger content_drafts_updated_at
  before update on public.content_drafts
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.signals enable row level security;
alter table public.content_drafts enable row level security;
alter table public.integrations enable row level security;
alter table public.client_users enable row level security;

-- Helper: user is global admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: user can access client
create or replace function public.user_has_client_access(p_client_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1 from public.client_users
      where client_id = p_client_id and user_id = auth.uid()
    );
$$;

-- Profiles policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile (not role)"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update any profile role"
  on public.profiles for update
  using (public.is_admin());

-- Clients policies
create policy "Users see clients they belong to"
  on public.clients for select
  using (public.user_has_client_access(id));

create policy "Admins manage clients"
  on public.clients for all
  using (public.is_admin());

-- client_users policies
create policy "Users see own memberships"
  on public.client_users for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Admins manage client_users"
  on public.client_users for all
  using (public.is_admin());

-- Products policies
create policy "Users see products for accessible clients"
  on public.products for select
  using (public.user_has_client_access(client_id));

create policy "Admins and managers mutate products"
  on public.products for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.client_users cu
      where cu.client_id = products.client_id
        and cu.user_id = auth.uid()
        and cu.role in ('admin', 'manager')
    )
  );

-- Signals policies
create policy "Users see signals for accessible products"
  on public.signals for select
  using (
    exists (
      select 1 from public.products p
      where p.id = signals.product_id
        and public.user_has_client_access(p.client_id)
    )
  );

create policy "Admins and managers mutate signals"
  on public.signals for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      join public.client_users cu on cu.client_id = p.client_id
      where p.id = signals.product_id
        and cu.user_id = auth.uid()
        and cu.role in ('admin', 'manager')
    )
  );

-- Content drafts policies
create policy "Users see drafts for accessible products"
  on public.content_drafts for select
  using (
    exists (
      select 1 from public.products p
      where p.id = content_drafts.product_id
        and public.user_has_client_access(p.client_id)
    )
  );

create policy "Admins and managers mutate drafts"
  on public.content_drafts for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      join public.client_users cu on cu.client_id = p.client_id
      where p.id = content_drafts.product_id
        and cu.user_id = auth.uid()
        and cu.role in ('admin', 'manager')
    )
  );

-- Integrations policies
create policy "Users see integrations for accessible clients"
  on public.integrations for select
  using (public.user_has_client_access(client_id));

create policy "Admins manage integrations"
  on public.integrations for all
  using (public.is_admin());

-- Seed demo data (optional — comment out in production)
insert into public.clients (id, name, brand_voice, compliance_notes)
values
  ('a0000000-0000-4000-8000-000000000001', 'Acme Corp', 'Bold, direct, expert tone', 'No medical claims without legal review'),
  ('a0000000-0000-4000-8000-000000000002', 'Northwind Labs', 'Friendly, technical, approachable', 'GDPR-compliant data references only');

insert into public.products (id, client_id, name, keywords, competitors)
values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Signal Platform', array['content intelligence', 'SEO'], array['Contently', 'Clearscope']),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Analytics Suite', array['analytics', 'reporting'], array['Tableau', 'Looker']),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002', 'Research Hub', array['market research'], array['Gartner']);
