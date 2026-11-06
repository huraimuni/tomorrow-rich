-- Supabase SQL Editor 에서 한 번 실행하세요 (클라우드 저장).
create table if not exists public.saves (
  id uuid primary key references auth.users(id) on delete cascade,
  data text not null check (length(data) < 800000),
  day int not null default 1,
  net bigint not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;
drop policy if exists "saves read own" on public.saves;
create policy "saves read own" on public.saves for select to authenticated using (auth.uid() = id);
drop policy if exists "saves insert own" on public.saves;
create policy "saves insert own" on public.saves for insert to authenticated with check (auth.uid() = id);
drop policy if exists "saves update own" on public.saves;
create policy "saves update own" on public.saves for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
