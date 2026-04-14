import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameMode, GameState, WordEntry } from '../types';
import { generateWord } from '../utils/wordGenerator';
import { calculateWpm } from '../utils/wpm';
import { SUDDEN_DEATH_MAX_TIME } from '../utils/constants';

const initialState: GameState = {
  status: 'idle',
  targetWord: '',
  input: '',
  score: 0,
  errors: 0,
  timeLeft: 0,
  elapsedTime: 0,
  wpm: 0,
  hasError: false,
};

export function useGame() {
  const [mode, setMode] = useState<GameMode>(30);
  const [state, setState] = useState<GameState>(initialState);
  const [wordHistory, setWordHistory] = useState<WordEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerStartedRef = useRef<boolean>(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const isSuddenDeath = mode === 'sudden-death' || mode === 'ez';
  const isTraining = mode === 'ez-training';
  const isUnlimited = isTraining || mode === 'ez';
  const isEzTimed = mode === 'ez-15' || mode === 'ez-30' || mode === 'ez-60';
  const ezTimedDuration = mode === 'ez-15' ? 15 : mode === 'ez-30' ? 30 : mode === 'ez-60' ? 60 : 0;

  const startTimer = useCallback(() => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setState(prev => {
        if (prev.status !== 'playing') return prev;
        if (isUnlimited) {
          return {
            ...prev,
            elapsedTime: elapsed,
            wpm: calculateWpm(prev.score, elapsed),
          };
        }
        const totalDuration = isSuddenDeath
          ? SUDDEN_DEATH_MAX_TIME
          : isEzTimed
            ? ezTimedDuration
            : (mode as number);
        const newTimeLeft = Math.max(0, totalDuration - Math.floor(elapsed));
        if (newTimeLeft <= 0) {
          return { ...prev, status: 'finished', timeLeft: 0, elapsedTime: elapsed };
        }
        return {
          ...prev,
          timeLeft: newTimeLeft,
          elapsedTime: elapsed,
          wpm: calculateWpm(prev.score, elapsed),
        };
      });
    }, 100);
  }, [mode, isSuddenDeath, isUnlimited, isEzTimed, ezTimedDuration]);

  const startGame = useCallback(() => {
    clearTimer();
    timerStartedRef.current = false;

    const word = mode === 'ez' || mode === 'ez-training' || isEzTimed ? 'ez' : generateWord();
    const duration = isUnlimited
      ? 0
      : isSuddenDeath
        ? SUDDEN_DEATH_MAX_TIME
        : isEzTimed
          ? ezTimedDuration
          : (mode as number);

    setWordHistory([]);
    setState({
      status: 'playing',
      targetWord: word,
      input: '',
      score: 0,
      errors: 0,
      timeLeft: duration,
      elapsedTime: 0,
      wpm: 0,
      hasError: false,
    });
  }, [mode, clearTimer, isSuddenDeath, isUnlimited, isEzTimed, ezTimedDuration]);

  // Watch for finished status to clear timer
  useEffect(() => {
    if (state.status === 'finished') {
      clearTimer();
    }
  }, [state.status, clearTimer]);

  const handleInput = useCallback((value: string) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, input: value, hasError: false };
    });
    startTimer();
  }, [startTimer]);

  const submitWord = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;

      const typed = prev.input;
      const correct = typed === prev.targetWord;

      if (isTraining) {
        setWordHistory(h => [...h, { word: typed, correct }]);
      }

      if (correct) {
        const newScore = prev.score + 1;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        return {
          ...prev,
          input: '',
          score: newScore,
          wpm: calculateWpm(newScore, elapsed),
          hasError: false,
        };
      } else {
        if (isSuddenDeath) {
          return { ...prev, status: 'finished', errors: prev.errors + 1, input: '', hasError: true };
        }
        return { ...prev, input: '', errors: prev.errors + 1, hasError: true };
      }
    });
  }, [mode, isSuddenDeath, isTraining]);

  const finishGame = useCallback(() => {
    clearTimer();
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setState(prev => ({
      ...prev,
      status: 'finished',
      elapsedTime: elapsed,
      wpm: calculateWpm(prev.score, elapsed),
    }));
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    timerStartedRef.current = false;
    setState(initialState);
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return { state, mode, setMode, startGame, handleInput, submitWord, reset, finishGame, wordHistory };
}
