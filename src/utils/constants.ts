import type { GameMode } from '../types';

// AZERTY keyboard layout (rows top to bottom)
export const KEYBOARD_ROWS = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n'],
];

export const ALL_LETTERS = KEYBOARD_ROWS.flat();

export const WORD_LENGTH = 2;

export const MAX_KEY_DISTANCE = 3; // max distance on the keyboard grid

export const GAME_MODES: { label: string; value: GameMode }[] = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: 'Mort Subite', value: 'sudden-death' },
  { label: 'ez', value: 'ez' },
  { label: 'ez 15s', value: 'ez-15' },
  { label: 'ez 30s', value: 'ez-30' },
  { label: 'ez 60s', value: 'ez-60' },
  { label: 'ez training', value: 'ez-training' },
];

export const SUDDEN_DEATH_MAX_TIME = 300; // 5 min cap for sudden death
