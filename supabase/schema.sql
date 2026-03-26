-- Table leaderboard
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  username text not null,
  mode text not null,
  score integer not null,
  wpm integer not null,
  errors integer not null default 0,
  accuracy integer not null default 100,
  signature text not null,
  created_at timestamptz default now()
);

-- Index pour les requêtes top scores par mode
create index if not exists idx_leaderboard_mode_score on public.leaderboard (mode, score desc);

-- RLS : activer
alter table public.leaderboard enable row level security;

-- Tout le monde peut lire (pour le top 10)
create policy "Lecture publique du leaderboard"
  on public.leaderboard for select
  using (true);

-- Personne ne peut insérer directement (seule la Edge Function avec service_role peut)
-- Pas de policy INSERT/UPDATE/DELETE = bloqué par défaut avec RLS activé
