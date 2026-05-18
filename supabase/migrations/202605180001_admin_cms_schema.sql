create extension if not exists pgcrypto;

create type public.record_type as enum ('journal', 'gallery', 'racing', 'devlog', 'project', 'note');
create type public.record_visibility as enum ('public', 'private', 'draft');
create type public.racing_game as enum ('acc', 'ace', 'lmu');

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.records (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type public.record_type not null,
  visibility public.record_visibility not null default 'draft',
  summary text not null default '',
  body text not null default '',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.record_assets (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references public.records(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  alt_text text not null default '',
  caption text not null default '',
  is_public boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.racing_laps (
  id uuid primary key default gen_random_uuid(),
  game public.racing_game not null,
  source_id integer not null,
  track text not null,
  vehicle text not null,
  vehicle_class text not null default 'Unknown',
  session_type text not null default '',
  lap_number integer not null,
  lap_time_ms integer not null,
  sector1_ms integer,
  sector2_ms integer,
  sector3_ms integer,
  recorded_at timestamptz not null,
  imported_at timestamptz not null default now(),
  unique (game, source_id)
);

create table public.racing_setups (
  id uuid primary key default gen_random_uuid(),
  game public.racing_game not null,
  track text not null,
  vehicle text not null,
  setup_name text not null,
  setup_data jsonb not null default '{}'::jsonb,
  notes text not null default '',
  visibility public.record_visibility not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.codex_daily_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null unique,
  title text not null,
  summary text not null,
  body text not null,
  source_commit text,
  visibility public.record_visibility not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.records enable row level security;
alter table public.record_assets enable row level security;
alter table public.racing_laps enable row level security;
alter table public.racing_setups enable row level security;
alter table public.codex_daily_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

create policy "Admins can read admin profiles"
on public.admin_profiles for select
to authenticated
using (public.is_admin());

create policy "Public can read published records"
on public.records for select
to anon, authenticated
using (visibility = 'public');

create policy "Admins can manage records"
on public.records for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read public record assets"
on public.record_assets for select
to anon, authenticated
using (is_public = true);

create policy "Admins can manage record assets"
on public.record_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read racing laps"
on public.racing_laps for select
to anon, authenticated
using (true);

create policy "Admins can manage racing laps"
on public.racing_laps for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published racing setups"
on public.racing_setups for select
to anon, authenticated
using (visibility = 'public');

create policy "Admins can manage racing setups"
on public.racing_setups for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published codex daily logs"
on public.codex_daily_logs for select
to anon, authenticated
using (visibility = 'public');

create policy "Admins can manage codex daily logs"
on public.codex_daily_logs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
