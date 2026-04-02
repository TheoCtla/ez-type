import { useState, useEffect } from 'react';
import { calculateAccuracy, calculateScore, calculateSuddenDeathScore, calculateTrainingScore } from '../utils/wpm';
import { submitScore, getTopScores } from '../services/leaderboardService';
import type { GameMode, LeaderboardEntry } from '../types';
import type { Session } from '@supabase/supabase-js';

interface ResultsProps {
  score: number;
  wpm: number;
  errors: number;
  elapsedTime: number;
  mode: GameMode;
  session: Session | null;
  onRestart: () => void;
  onOpenAuth: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

export function Results({ score, wpm, errors, elapsedTime, mode, session, onRestart, onOpenAuth }: ResultsProps) {
  const accuracy = calculateAccuracy(score, errors);
  const isTraining = mode === 'ez-training';
  const isSuddenDeath = mode === 'sudden-death' || mode === 'ez';
  const showTime = isSuddenDeath || isTraining;
  const finalScore = isTraining
    ? calculateTrainingScore(score, wpm, errors)
    : isSuddenDeath
      ? calculateSuddenDeathScore(score, wpm)
      : calculateScore(score, wpm);

  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    getTopScores(mode).then(setTopScores).catch(() => {});
  }, [mode, saved]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await submitScore({ mode, score: finalScore, wpm, errors, accuracy, elapsed_time: Math.round(elapsedTime) });
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="results">
      <h2>{isTraining ? 'Entraînement terminé' : 'Partie terminée'}</h2>
      {(isSuddenDeath || isTraining) && (
        <div className="final-score">
          <div className="stat-value">{finalScore}</div>
          <div className="stat-label">score</div>
        </div>
      )}
      <div className="results-grid">
        <div className="result-card">
          <div className="stat-value">{wpm}</div>
          <div className="stat-label">wpm</div>
        </div>
        <div className="result-card">
          <div className="stat-value">{score}</div>
          <div className="stat-label">mots</div>
        </div>
        <div className="result-card">
          <div className="stat-value">{isSuddenDeath ? formatTime(elapsedTime) : errors}</div>
          <div className="stat-label">{isSuddenDeath ? 'temps' : 'erreurs'}</div>
        </div>
        <div className="result-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">précision</div>
        </div>
      </div>

      <div className="results-actions">
        <button className="start-btn" onClick={onRestart}>
          rejouer
        </button>

        {session ? (
          saved ? (
            <p className="save-status success fade-in">score enregistré !</p>
          ) : (
            <button
              className={`start-btn secondary ${saving ? 'saving' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'enregistrement...' : 'enregistrer mon score'}
            </button>
          )
        ) : (
          <button className="start-btn secondary" onClick={onOpenAuth}>
            se connecter pour enregistrer
          </button>
        )}
        {saveError && <p className="save-status error">{saveError}</p>}
      </div>

      {topScores.length > 0 && (
        <div className="leaderboard">
          <h3>top 10 — {String(mode)}</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>joueur</th>
                <th>score</th>
                <th>wpm</th>
                {showTime && <th>temps</th>}
              </tr>
            </thead>
            <tbody>
              {topScores.map((entry, i) => (
                <tr key={entry.id ?? i} className={entry.user_id === session?.user?.id ? 'highlight' : ''}>
                  <td>{i + 1}</td>
                  <td>{entry.username ?? '—'}</td>
                  <td>{entry.score}</td>
                  <td>{entry.wpm}</td>
                  {showTime && <td>{entry.elapsed_time ? formatTime(entry.elapsed_time) : '—'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
