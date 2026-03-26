import './styles/app.css';
import { useGame } from './hooks/useGame';
import { ModeSelector } from './components/ModeSelector';
import { Timer } from './components/Timer';
import { GameBoard } from './components/GameBoard';
import { Stats } from './components/Stats';
import { Results } from './components/Results';

function App() {
  const { state, mode, setMode, startGame, handleInput, submitWord, reset } = useGame();

  return (
    <>
      <div className="header">
        <h1>ez type</h1>
        <p>home row only</p>
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
          <Timer timeLeft={state.timeLeft} />
          <GameBoard
            targetWord={state.targetWord}
            input={state.input}
            hasError={state.hasError}
            onInput={handleInput}
            onSubmit={submitWord}
          />
          <Stats score={state.score} wpm={state.wpm} errors={state.errors} />
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
