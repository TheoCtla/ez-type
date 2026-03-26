import './styles/app.css';
import { useGame } from './hooks/useGame';
import { ModeSelector } from './components/ModeSelector';
import { Timer } from './components/Timer';
import { GameBoard } from './components/GameBoard';
import { Stats } from './components/Stats';
import { Results } from './components/Results';

function App() {
  const { state, mode, setMode, startGame, handleInput, submitWord, reset, finishGame } = useGame();

  return (
    <>
      <div className="header">
        <h1>MonkeyTsaz</h1>
      </div>

      <ModeSelector
        current={mode}
        onChange={setMode}
        disabled={state.status === 'playing'}
      />

      {state.status === 'idle' && (
        <>
          <button className="start-btn" onClick={startGame}>
            démarrer
          </button>
          <p className="idle-hint">
            tape le mot affiché + entrée pour valider
          </p>
        </>
      )}

      {state.status === 'playing' && (
        <>
          <Timer timeLeft={mode === 'ez-training' || mode === 'ez' ? Math.floor(state.elapsedTime) : state.timeLeft} />
          <GameBoard
            targetWord={state.targetWord}
            input={state.input}
            hasError={state.hasError}
            onInput={handleInput}
            onSubmit={submitWord}
          />
          <Stats score={state.score} wpm={state.wpm} errors={state.errors} />
          {mode === 'ez-training' ? (
            <div className="training-buttons">
              <button className="quit-btn" onClick={finishGame}>terminer</button>
              <button className="quit-btn secondary" onClick={reset}>abandonner</button>
            </div>
          ) : (
            <button className="quit-btn" onClick={reset}>abandonner</button>
          )}
        </>
      )}

      {state.status === 'finished' && (
        <Results
          score={state.score}
          wpm={state.wpm}
          errors={state.errors}
          mode={mode}
          onRestart={() => { reset(); startGame(); }}
        />
      )}
    </>
  );
}

export default App;
