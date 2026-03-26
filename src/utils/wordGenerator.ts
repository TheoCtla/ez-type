import { KEYBOARD_ROWS, ALL_LETTERS, WORD_LENGTH, MAX_KEY_DISTANCE } from './constants';

// Build a map of letter -> { row, col } position on the keyboard
const keyPositions = new Map<string, { row: number; col: number }>();
KEYBOARD_ROWS.forEach((row, r) => {
  row.forEach((letter, c) => {
    keyPositions.set(letter, { row: r, col: c });
  });
});

function keyDistance(a: string, b: string): number {
  const posA = keyPositions.get(a)!;
  const posB = keyPositions.get(b)!;
  return Math.abs(posA.row - posB.row) + Math.abs(posA.col - posB.col);
}

export function generateWord(): string {
  let word = '';
  let lastLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
  word += lastLetter;

  for (let i = 1; i < WORD_LENGTH; i++) {
    const neighbors = ALL_LETTERS.filter(
      l => l !== lastLetter && keyDistance(l, lastLetter) <= MAX_KEY_DISTANCE
    );
    lastLetter = neighbors[Math.floor(Math.random() * neighbors.length)];
    word += lastLetter;
  }
  return word;
}
