import { supabase } from './supabaseClient';
import type { GameMode, LeaderboardEntry } from '../types';

interface SubmitParams {
  mode: GameMode;
  score: number;
  wpm: number;
  errors: number;
  accuracy: number;
  elapsed_time?: number;
}

export async function submitScore(entry: SubmitParams): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Non connecté');

  const response = await supabase.functions.invoke('submit-score', {
    body: {
      mode: String(entry.mode),
      score: entry.score,
      wpm: entry.wpm,
      errors: entry.errors,
      accuracy: entry.accuracy,
      elapsed_time: entry.elapsed_time,
    },
  });

  if (response.error) throw new Error(response.error.message);

  const data = response.data;
  if (data && !data.success) throw new Error(data.error || 'Erreur serveur');
}

export async function getTopScores(mode: GameMode): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('mode', String(mode))
    .order('score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
}

export async function getAllScores(mode: GameMode): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('mode', String(mode))
    .order('score', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
