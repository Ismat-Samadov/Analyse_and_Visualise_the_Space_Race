'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { evaluateGuess, getLetterStates, MAX_GUESSES, WORD_LENGTH } from '@/lib/game';
import { getDailyWord, isValidWord } from '@/lib/wordList';
import { loadGameState, loadStats, recordResult, saveGameState, saveStats } from '@/lib/storage';
import { GameState, LetterState, Statistics } from '@/lib/types';

export type ToastMessage = { id: number; text: string };

interface State {
  solution: string;
  currentGuess: string;
  boardState: string[];
  evaluations: (LetterState[] | null)[];
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  revealingRow: number | null;
  shakingRow: number | null;
  stats: Statistics;
  toasts: ToastMessage[];
  hardMode: boolean;
  darkMode: boolean;
}

type Action =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'DELETE_LETTER' }
  | { type: 'SUBMIT_GUESS'; guess: string; evaluation: LetterState[] }
  | { type: 'SHAKE'; row: number }
  | { type: 'REVEAL_DONE' }
  | { type: 'SHAKE_DONE' }
  | { type: 'ADD_TOAST'; id: number; text: string }
  | { type: 'REMOVE_TOAST'; id: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_STATE'; gameState: GameState; stats: Statistics };

let _toastId = 0;

const defaultStats = (): Statistics => ({
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: new Array(MAX_GUESSES).fill(0),
  lastWonTs: 0,
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_STATE': {
      const gs = action.gameState;
      return {
        ...state,
        solution: gs.solution,
        boardState: gs.boardState,
        evaluations: gs.evaluations,
        currentRow: gs.currentRow,
        gameStatus: gs.gameStatus,
        hardMode: gs.hardMode,
        stats: action.stats,
        currentGuess: '',
        revealingRow: null,
        shakingRow: null,
        toasts: [],
      };
    }

    case 'ADD_LETTER': {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length >= WORD_LENGTH) return state;
      if (state.revealingRow !== null) return state;
      return { ...state, currentGuess: state.currentGuess + action.letter };
    }

    case 'DELETE_LETTER': {
      if (state.currentGuess.length === 0) return state;
      return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
    }

    case 'SUBMIT_GUESS': {
      const newBoardState = [...state.boardState, action.guess];
      const newEvaluations = [...state.evaluations];
      newEvaluations[state.currentRow] = action.evaluation;

      const won = action.evaluation.every((s) => s === 'correct');
      const newRow = state.currentRow + 1;
      const lost = !won && newRow >= MAX_GUESSES;

      return {
        ...state,
        boardState: newBoardState,
        evaluations: newEvaluations,
        currentRow: newRow,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        revealingRow: state.currentRow,
      };
    }

    case 'SHAKE': {
      return { ...state, shakingRow: action.row };
    }

    case 'REVEAL_DONE': {
      return { ...state, revealingRow: null };
    }

    case 'SHAKE_DONE': {
      return { ...state, shakingRow: null };
    }

    case 'ADD_TOAST': {
      return { ...state, toasts: [{ id: action.id, text: action.text }, ...state.toasts] };
    }

    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    }

    case 'TOGGLE_DARK_MODE': {
      return { ...state, darkMode: !state.darkMode };
    }

    default:
      return state;
  }
}

export function useWordle() {
  const solution = getDailyWord();

  const [state, dispatch] = useReducer(reducer, {
    solution,
    currentGuess: '',
    boardState: [],
    evaluations: [],
    currentRow: 0,
    gameStatus: 'playing',
    revealingRow: null,
    shakingRow: null,
    stats: defaultStats(),
    toasts: [],
    hardMode: false,
    darkMode: true,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // --- Persistence: load on mount ---
  useEffect(() => {
    const savedGame = loadGameState();
    const savedStats = loadStats();
    const gameToLoad: GameState =
      savedGame && savedGame.solution === solution
        ? savedGame
        : {
            solution,
            boardState: [],
            evaluations: [],
            currentRow: 0,
            gameStatus: 'playing',
            hardMode: false,
            lastPlayedTs: Date.now(),
          };
    dispatch({ type: 'LOAD_STATE', gameState: gameToLoad, stats: savedStats });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Persistence: save on changes ---
  useEffect(() => {
    if (state.currentRow > 0 || state.gameStatus !== 'playing') {
      saveGameState({
        solution: state.solution,
        boardState: state.boardState,
        evaluations: state.evaluations,
        currentRow: state.currentRow,
        gameStatus: state.gameStatus,
        hardMode: state.hardMode,
        lastPlayedTs: Date.now(),
      });
    }
  }, [state.boardState, state.evaluations, state.currentRow, state.gameStatus, state.hardMode, state.solution]);

  // --- Toast helper ---
  const toast = useCallback((text: string, duration = 1800) => {
    const id = ++_toastId;
    dispatch({ type: 'ADD_TOAST', id, text });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), duration);
  }, []);

  // --- Handle game end after reveal ---
  const prevRevealRef = useRef<number | null>(null);
  useEffect(() => {
    const wasRevealing = prevRevealRef.current !== null;
    prevRevealRef.current = state.revealingRow;
    if (!wasRevealing || state.revealingRow !== null) return;

    const { gameStatus, currentRow, solution: sol, stats } = stateRef.current;
    if (gameStatus === 'won') {
      const msgs = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
      toast(msgs[Math.min(currentRow - 1, msgs.length - 1)], 2000);
      const updated = recordResult(true, currentRow, stats);
      saveStats(updated);
      dispatch({ type: 'LOAD_STATE', gameState: { ...buildCurrentGameState() }, stats: updated });
    } else if (gameStatus === 'lost') {
      toast(sol.toUpperCase(), 3500);
      const updated = recordResult(false, currentRow, stats);
      saveStats(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.revealingRow]);

  function buildCurrentGameState(): GameState {
    const s = stateRef.current;
    return {
      solution: s.solution,
      boardState: s.boardState,
      evaluations: s.evaluations,
      currentRow: s.currentRow,
      gameStatus: s.gameStatus,
      hardMode: s.hardMode,
      lastPlayedTs: Date.now(),
    };
  }

  // --- Key handler ---
  const handleKey = useCallback(
    (key: string) => {
      const s = stateRef.current;
      if (s.gameStatus !== 'playing') return;
      if (s.revealingRow !== null) return;

      if (key === 'Enter') {
        if (s.currentGuess.length < WORD_LENGTH) {
          dispatch({ type: 'SHAKE', row: s.currentRow });
          toast('Not enough letters');
          return;
        }
        const guess = s.currentGuess.toLowerCase();
        if (!isValidWord(guess)) {
          dispatch({ type: 'SHAKE', row: s.currentRow });
          toast('Not in word list');
          return;
        }
        const evaluation = evaluateGuess(guess, s.solution);
        dispatch({ type: 'SUBMIT_GUESS', guess, evaluation });
        return;
      }

      if (key === 'Backspace') {
        dispatch({ type: 'DELETE_LETTER' });
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        dispatch({ type: 'ADD_LETTER', letter: key.toLowerCase() });
      }
    },
    [toast]
  );

  // --- Global keyboard listener ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      handleKey(e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  // --- Shake reset ---
  useEffect(() => {
    if (state.shakingRow === null) return;
    const t = setTimeout(() => dispatch({ type: 'SHAKE_DONE' }), 650);
    return () => clearTimeout(t);
  }, [state.shakingRow]);

  // --- Reveal reset ---
  useEffect(() => {
    if (state.revealingRow === null) return;
    const t = setTimeout(() => dispatch({ type: 'REVEAL_DONE' }), WORD_LENGTH * 350 + 200);
    return () => clearTimeout(t);
  }, [state.revealingRow]);

  const letterStates = getLetterStates(state.boardState, state.evaluations);

  return {
    ...state,
    letterStates,
    handleKey,
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
  };
}
