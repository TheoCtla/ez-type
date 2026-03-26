import { calculateAccuracy, calculateScore, calculateTrainingScore } from '../utils/wpm';
import type { GameMode } from '../types';

interface ResultsProps {
  score: number;
  wpm: number;
  errors: number;
  mode: GameMode;
  onRestart: () => void;
}

export function Results({ score, wpm, errors, mode, onRestart }: ResultsProps) {
  const accuracy = calculateAccuracy(score, errors);
  const isTraining = mode === 'ez-training';
  const isSuddenDeath = mode === 'sudden-death' || mode === 'ez';
  const finalScore = calculateScore(score, wpm);

  return (
    <div className="results">
      <h2>{isTraining ? 'Entraînement terminé' : 'Partie terminée'}</h2>
      {(isSuddenDeath || isTraining) && (
        <div className="final-score">
          <div className="stat-value">{isTraining ? calculateTrainingScore(score, wpm, errors) : finalScore}</div>
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
          <div className="stat-value">{errors}</div>
          <div className="stat-label">erreurs</div>
        </div>
        <div className="result-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">précision</div>
        </div>
      </div>
      <button className="start-btn" onClick={onRestart}>
        rejouer
      </button>
    </div>
  );
}
