interface StatsProps {
  score: number;
  wpm: number;
  errors: number;
}

export function Stats({ score, wpm, errors }: StatsProps) {
  return (
    <div className="stats-row">
      <div className="stat">
        <div className="stat-value">{score}</div>
        <div className="stat-label">mots</div>
      </div>
      <div className="stat">
        <div className="stat-value">{wpm}</div>
        <div className="stat-label">wpm</div>
      </div>
      <div className="stat">
        <div className="stat-value">{errors}</div>
        <div className="stat-label">erreurs</div>
      </div>
    </div>
  );
}
