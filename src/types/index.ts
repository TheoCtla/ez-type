export type GameMode = 15 | 30 | 60 | 'sudden-death' | 'ez';

export interface GameConfig {
  mode: GameMode;
  homeRowLetters: string[];
  wordLength: number;
}

export interface GameState {
  status: 'idle' | 'countdown' | 'playing' | 'finished';
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
