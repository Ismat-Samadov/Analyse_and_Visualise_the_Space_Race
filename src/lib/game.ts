import { LetterState } from './types';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export function evaluateGuess(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = new Array(WORD_LENGTH).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // First pass: mark correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = '#'; // mark as used
      guessChars[i] = '*';   // mark as matched
    }
  }

  // Second pass: mark present (wrong position)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === '*') continue;
    const idx = solutionChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      solutionChars[idx] = '#'; // mark as used
    }
  }

  return result;
}

export function getLetterStates(
  boardState: string[],
  evaluations: (LetterState[] | null)[]
): Record<string, LetterState> {
  const states: Record<string, LetterState> = {};
  const priority: Record<LetterState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    tbd: 0,
    empty: 0,
  };

  boardState.forEach((word, rowIdx) => {
    const evaluation = evaluations[rowIdx];
    if (!evaluation) return;
    word.split('').forEach((letter, colIdx) => {
      const newState = evaluation[colIdx];
      const existing = states[letter];
      if (!existing || priority[newState] > priority[existing]) {
        states[letter] = newState;
      }
    });
  });

  return states;
}
