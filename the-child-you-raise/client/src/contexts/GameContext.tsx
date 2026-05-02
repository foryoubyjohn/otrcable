// ============================================================
// Game Context — Central state management for the game
// ============================================================

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { GameState, Difficulty, EventChoice, GameEvent } from '../engine/types';
import { createNewGame } from '../engine/gameState';
import { applyChoice, processMonthlyUpdate } from '../engine/statEngine';
import { evaluateTraits } from '../engine/traitEngine';
import { updateRisks } from '../engine/riskEngine';
import { selectEvent } from '../engine/eventEngine';
import { calculateEndgame } from '../engine/admissionsEngine';
import { saveGame, loadGame, deleteSave } from '../engine/saveEngine';
import { getAgeString } from '../engine/gameState';

type GameScreen = 'menu' | 'newgame' | 'dashboard' | 'child' | 'parent' | 'household' | 'school' | 'timeline' | 'endgame';

interface GameContextState {
  gameState: GameState | null;
  currentScreen: GameScreen;
  eventResult: string | null;
}

type GameAction =
  | { type: 'START_NEW_GAME'; parentName: string; childName: string; difficulty: Difficulty }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'MAKE_CHOICE'; choice: EventChoice; event: GameEvent }
  | { type: 'ADVANCE_MONTH' }
  | { type: 'NAVIGATE'; screen: GameScreen }
  | { type: 'CLEAR_RESULT' }
  | { type: 'RESET_GAME' };

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'START_NEW_GAME': {
      const newGame = createNewGame(action.parentName, action.childName, action.difficulty);
      const event = selectEvent(newGame);
      newGame.current_event = event;
      saveGame(newGame);
      return { gameState: newGame, currentScreen: 'dashboard', eventResult: null };
    }

    case 'LOAD_GAME': {
      return { gameState: action.state, currentScreen: 'dashboard', eventResult: null };
    }

    case 'MAKE_CHOICE': {
      if (!state.gameState) return state;
      let newGameState = applyChoice(state.gameState, action.choice);
      
      // Add to timeline
      newGameState.timeline.push({
        month: newGameState.current_month,
        age: getAgeString(newGameState.current_month),
        title: action.event.title,
        choice: action.choice.text,
        result: action.choice.result_text,
        isMilestone: action.event.category === 'milestone',
      });

      // Mark event as seen
      newGameState.events_seen.push(action.event.id);
      newGameState.current_event = null;

      saveGame(newGameState);
      return { ...state, gameState: newGameState, eventResult: action.choice.result_text };
    }

    case 'ADVANCE_MONTH': {
      if (!state.gameState) return state;
      let newGameState = structuredClone(state.gameState);
      
      // Advance time
      newGameState.current_month += 1;
      
      // Process monthly updates
      newGameState = processMonthlyUpdate(newGameState);
      
      // Update risks
      newGameState = updateRisks(newGameState);
      
      // Evaluate traits
      newGameState = evaluateTraits(newGameState);
      
      // Check for endgame (age 18 = month 216)
      if (newGameState.current_month >= 216) {
        newGameState.game_over = true;
        newGameState.endgame_result = calculateEndgame(newGameState);
        saveGame(newGameState);
        return { gameState: newGameState, currentScreen: 'endgame', eventResult: null };
      }
      
      // Select new event
      const event = selectEvent(newGameState);
      newGameState.current_event = event;
      
      saveGame(newGameState);
      return { ...state, gameState: newGameState, eventResult: null };
    }

    case 'NAVIGATE': {
      return { ...state, currentScreen: action.screen };
    }

    case 'CLEAR_RESULT': {
      return { ...state, eventResult: null };
    }

    case 'RESET_GAME': {
      deleteSave();
      return { gameState: null, currentScreen: 'menu', eventResult: null };
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameContextState;
  startNewGame: (parentName: string, childName: string, difficulty: Difficulty) => void;
  loadSavedGame: () => void;
  makeChoice: (choice: EventChoice, event: GameEvent) => void;
  advanceMonth: () => void;
  navigate: (screen: GameScreen) => void;
  clearResult: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    gameState: null,
    currentScreen: 'menu',
    eventResult: null,
  });

  const startNewGame = useCallback((parentName: string, childName: string, difficulty: Difficulty) => {
    dispatch({ type: 'START_NEW_GAME', parentName, childName, difficulty });
  }, []);

  const loadSavedGame = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      if (saved.game_over) {
        dispatch({ type: 'LOAD_GAME', state: saved });
        dispatch({ type: 'NAVIGATE', screen: 'endgame' });
      } else {
        dispatch({ type: 'LOAD_GAME', state: saved });
      }
    }
  }, []);

  const makeChoice = useCallback((choice: EventChoice, event: GameEvent) => {
    dispatch({ type: 'MAKE_CHOICE', choice, event });
  }, []);

  const advanceMonth = useCallback(() => {
    dispatch({ type: 'ADVANCE_MONTH' });
  }, []);

  const navigate = useCallback((screen: GameScreen) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  const clearResult = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULT' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return (
    <GameContext.Provider value={{ state, startNewGame, loadSavedGame, makeChoice, advanceMonth, navigate, clearResult, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
