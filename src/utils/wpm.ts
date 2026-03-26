export function calculateWpm(correctWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(correctWords / minutes);
}

export function calculateAccuracy(correct: number, errors: number): number {
  const total = correct + errors;
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function calculateScore(correctWords: number, wpm: number): number {
  return Math.round(correctWords * wpm);
}
