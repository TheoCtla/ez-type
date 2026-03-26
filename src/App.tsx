import './styles/app.css';
import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { ModeSelector } from './components/ModeSelector';
import { Timer } from './components/Timer';
import { GameBoard } from './components/GameBoard';
import { Stats } from './components/Stats';
import { Results } from './components/Results';
import { Leaderboard } from './components/Leaderboard';
import { AuthModal } from './components/AuthModal';
import { getSession, onAuthStateChange, signOut } from './services/authService';
import type { Session } from '@supabase/supabase-js';

function App() {
  const { state, mode, setMode, startGame, handleInput, submitWord, reset, finishGame } = useGame();
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    getSession().then(setSession);
    const { data: { subscription } } = onAuthStateChange(s => setSession(s as Session | null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="user-bar">
        {session ? (
          <>
            <span className="user-name">{session.user.user_metadata?.username || session.user.email?.split('@')[0]}</span>
            <button className="logout-link" onClick={() => signOut()}>déconnexion</button>
          </>
        ) : (
          <button className="logout-link login-link" onClick={() => setShowAuth(true)}>connexion</button>
        )}
        <button className="logout-link classement-link" onClick={() => setShowLeaderboard(!showLeaderboard)}>
          {showLeaderboard ? 'jouer' : 'classement'}
        </button>
      </div>

      <div className="header">
        <h1>MonkeyTsaz</h1>
      </div>

      {showLeaderboard ? (
        <Leaderboard session={session} onBack={() => setShowLeaderboard(false)} />
      ) : (
        <>
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
              session={session}
              onRestart={() => { reset(); startGame(); }}
              onOpenAuth={() => setShowAuth(true)}
            />
          )}
        </>
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}

export default App;
