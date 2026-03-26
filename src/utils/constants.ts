import type { GameMode } from '../types';

export const HOME_ROW_LETTERS = ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'];

export const WORD_LENGTH = 2;

export const GAME_MODES: { label: string; value: GameMode }[] = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: 'Mort Subite', value: 'sudden-death' },
  { label: 'ez', value: 'ez' },
];

export const SUDDEN_DEATH_MAX_TIME = 300; // 5 min cap for sudden death
