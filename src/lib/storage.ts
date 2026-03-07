import { GameState, Statistics } from './types';
import { MAX_GUESSES } from './game';

const GAME_STATE_KEY = 'wordle-game-state';
const STATS_KEY = 'wordle-statistics';

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function loadStats(): Statistics {
  if (typeof window === 'undefined') return defaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as Statistics) : defaultStats();
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: Statistics): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(
  won: boolean,
  numGuesses: number,
  stats: Statistics
): Statistics {
  const updated: Statistics = { ...stats };
  updated.gamesPlayed += 1;

  if (won) {
    updated.wins += 1;
    updated.currentStreak += 1;
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    const dist = [...updated.guessDistribution];
    dist[numGuesses - 1] = (dist[numGuesses - 1] ?? 0) + 1;
    updated.guessDistribution = dist;
    updated.lastWonTs = Date.now();
  } else {
    updated.currentStreak = 0;
  }

  return updated;
}

function defaultStats(): Statistics {
  return {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: new Array(MAX_GUESSES).fill(0),
    lastWonTs: 0,
  };
}
