export type GameMode = 15 | 30 | 60 | 'sudden-death' | 'ez' | 'ez-training';

export interface GameConfig {
  mode: GameMode;
  homeRowLetters: string[];
  wordLength: number;
}

export interface GameState {
  status: 'idle' | 'playing' | 'finished';
  targetWord: string;
  input: string;
  score: number;
  errors: number;
  timeLeft: number;
  elapsedTime: number;
  wpm: number;
  hasError: boolean;
}

export interface GameStats {
  score: number;
  wpm: number;
  errors: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  id?: string;
  user_id?: string;
  username?: string;
  mode: string;
  score: number;
  wpm: number;
  errors: number;
  accuracy: number;
  elapsed_time?: number;
  signature: string;
  created_at?: string;
}
