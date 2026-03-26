import { useRef, useEffect } from 'react';

interface GameBoardProps {
  targetWord: string;
  input: string;
  hasError: boolean;
  onInput: (value: string) => void;
  onSubmit: () => void;
}

export function GameBoard({ targetWord, input, hasError, onInput, onSubmit }: GameBoardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [targetWord]);

  return (
    <div className="game-board">
      <div className={`target-word ${hasError ? 'error' : ''}`}>
        {targetWord}
      </div>
      <input
        ref={inputRef}
        className={`game-input ${hasError ? 'error' : ''}`}
        type="text"
        value={input}
        onChange={e => onInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  );
}
