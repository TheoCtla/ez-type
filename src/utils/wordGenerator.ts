import { HOME_ROW_LETTERS, WORD_LENGTH } from './constants';

export function generateWord(): string {
  let word = '';
  for (let i = 0; i < WORD_LENGTH; i++) {
    const index = Math.floor(Math.random() * HOME_ROW_LETTERS.length);
    word += HOME_ROW_LETTERS[index];
  }
  return word;
}
