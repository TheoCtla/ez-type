import { useState, useEffect } from 'react';
import { getAllScores } from '../services/leaderboardService';
import { GAME_MODES } from '../utils/constants';
import type { GameMode, LeaderboardEntry } from '../types';
import type { Session } from '@supabase/supabase-js';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

interface LeaderboardProps {
  session: Session | null;
  onBack: () => void;
}

export function Leaderboard({ session, onBack }: LeaderboardProps) {
  const [mode, setMode] = useState<GameMode>(15);
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const showTime = mode === 'sudden-death' || mode === 'ez' || mode === 'ez-training';

  useEffect(() => {
    setLoading(true);
    getAllScores(mode)
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [mode]);

  return (
    <div className="leaderboard-page">
      <button className="back-link" onClick={onBack}>← retour</button>

      <h2>Classement</h2>

      <div className="mode-selector">
        {GAME_MODES.map(({ label, value }) => (
          <button
            key={label}
            className={`mode-btn ${mode === value ? 'active' : ''}`}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="leaderboard-loading">chargement...</p>
      ) : scores.length === 0 ? (
        <p className="leaderboard-empty">aucun score pour ce mode</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>joueur</th>
              <th>score</th>
              <th>wpm</th>
              <th>précision</th>
              {showTime && <th>temps</th>}
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, i) => (
              <tr key={entry.id ?? i} className={entry.user_id === session?.user?.id ? 'highlight' : ''}>
                <td>{i + 1}</td>
                <td>{entry.username ?? '—'}</td>
                <td>{entry.score}</td>
                <td>{entry.wpm}</td>
                <td>{entry.accuracy}%</td>
                {showTime && <td>{entry.elapsed_time ? formatTime(entry.elapsed_time) : '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
