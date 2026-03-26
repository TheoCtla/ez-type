import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameMode, GameState } from '../types';
import { generateWord } from '../utils/wordGenerator';
import { calculateWpm } from '../utils/wpm';
import { SUDDEN_DEATH_MAX_TIME } from '../utils/constants';

const COUNTDOWN_SECONDS = 5;

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
  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const isSuddenDeath = mode === 'sudden-death' || mode === 'ez';

  const launchGame = useCallback(() => {
    const word = mode === 'ez' ? 'ez' : generateWord();
    const duration = isSuddenDeath ? SUDDEN_DEATH_MAX_TIME : mode;

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

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setState(prev => {
        const newTimeLeft = Math.max(0, (isSuddenDeath ? SUDDEN_DEATH_MAX_TIME : mode) - Math.floor(elapsed));
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
  }, [mode, isSuddenDeath]);

  const startGame = useCallback(() => {
    clearTimer();
    clearCountdown();

    setState(prev => ({ ...prev, status: 'countdown' }));
    setCountdown(COUNTDOWN_SECONDS);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearCountdown();
          launchGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, clearCountdown, launchGame]);

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
  }, []);

  const submitWord = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;

      if (prev.input === prev.targetWord) {
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
  }, [mode, isSuddenDeath]);

  const reset = useCallback(() => {
    clearTimer();
    clearCountdown();
    setCountdown(0);
    setState(initialState);
  }, [clearTimer, clearCountdown]);

  useEffect(() => {
    return () => {
      clearTimer();
      clearCountdown();
    };
  }, [clearTimer, clearCountdown]);

  return { state, mode, setMode, startGame, handleInput, submitWord, reset, countdown };
}
