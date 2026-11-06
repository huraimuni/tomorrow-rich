-- Supabase SQL Editor 에서 한 번 실행하세요.
create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null check (nick ~ '^[가-힣a-zA-Z0-9]{2,12}$'),
  nick_key text not null unique,
  net bigint not null default 0 check (net between -1000000000000 and 100000000000000),
  day int not null default 1,
  title text,
  updated_at timestamptz not null default now()
);
alter table public.players enable row level security;
drop policy if exists "players read" on public.players;
create policy "players read" on public.players for select using (true);
drop policy if exists "players insert own" on public.players;
create policy "players insert own" on public.players for insert to authenticated with check (auth.uid() = id);
drop policy if exists "players update own" on public.players;
create policy "players update own" on public.players for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
