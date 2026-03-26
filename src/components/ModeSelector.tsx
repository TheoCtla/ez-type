import type { GameMode } from '../types';
import { GAME_MODES } from '../utils/constants';

interface ModeSelectorProps {
  current: GameMode;
  onChange: (mode: GameMode) => void;
  disabled: boolean;
}

export function ModeSelector({ current, onChange, disabled }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      {GAME_MODES.map(({ label, value }) => (
        <button
          key={label}
          className={`mode-btn ${current === value ? 'active' : ''}`}
          onClick={() => onChange(value)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
