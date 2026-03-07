'use client';

import { LetterState } from '@/lib/types';
import { MAX_GUESSES, WORD_LENGTH } from '@/lib/game';
import { Tile } from './Tile';

interface BoardProps {
  boardState: string[];
  evaluations: (LetterState[] | null)[];
  currentGuess: string;
  currentRow: number;
  revealingRow: number | null;
  shakingRow: number | null;
}

export function Board({
  boardState,
  evaluations,
  currentGuess,
  currentRow,
  revealingRow,
  shakingRow,
}: BoardProps) {
  const rows = Array.from({ length: MAX_GUESSES }, (_, rowIdx) => {
    const isCurrentRow = rowIdx === currentRow;
    const isSubmitted = rowIdx < currentRow;
    const isRevealing = rowIdx === revealingRow;
    const isShaking = rowIdx === shakingRow;

    const letters = isCurrentRow
      ? currentGuess.padEnd(WORD_LENGTH, ' ').split('')
      : isSubmitted
      ? boardState[rowIdx]?.padEnd(WORD_LENGTH, ' ').split('') ?? ' '.repeat(WORD_LENGTH).split('')
      : ' '.repeat(WORD_LENGTH).split('');

    return (
      <div
        key={rowIdx}
        className={`grid gap-1.5 ${isShaking ? 'animate-shake' : ''}`}
        style={{ gridTemplateColumns: `repeat(${WORD_LENGTH}, 1fr)` }}
      >
        {letters.map((letter, colIdx) => {
          const trimmedLetter = letter === ' ' ? '' : letter;

          let tileState: LetterState = 'empty';
          if (isSubmitted && evaluations[rowIdx]) {
            tileState = evaluations[rowIdx]![colIdx];
          } else if (isCurrentRow && trimmedLetter) {
            tileState = 'tbd';
          }

          return (
            <Tile
              key={colIdx}
              letter={trimmedLetter}
              state={tileState}
              isRevealing={isRevealing}
              revealDelay={colIdx * 350}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs mx-auto">
      {rows}
    </div>
  );
}
