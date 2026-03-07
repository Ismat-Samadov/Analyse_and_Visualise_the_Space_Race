'use client';

import { LetterState } from '@/lib/types';

interface TileProps {
  letter: string;
  state: LetterState;
  isRevealing?: boolean;
  revealDelay?: number;
}

const stateColors: Record<LetterState, string> = {
  correct: 'bg-green-600 border-green-600 text-white',
  present: 'bg-yellow-500 border-yellow-500 text-white',
  absent: 'bg-neutral-600 border-neutral-600 text-white dark:bg-neutral-700 dark:border-neutral-700',
  tbd: 'bg-transparent border-neutral-400 dark:border-neutral-500 text-neutral-900 dark:text-white',
  empty: 'bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white',
};

export function Tile({ letter, state, isRevealing = false, revealDelay = 0 }: TileProps) {
  const isRevealed = state === 'correct' || state === 'present' || state === 'absent';

  return (
    <div
      className="relative w-full aspect-square select-none"
      style={{
        perspective: '250px',
      }}
    >
      {/* Inner wrapper that flips */}
      <div
        className="w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          animation: isRevealing
            ? `flip 0.7s ease-in-out ${revealDelay}ms both`
            : undefined,
          transform: !isRevealing && isRevealed ? 'rotateX(180deg)' : undefined,
          transition: !isRevealing ? 'transform 0s' : undefined,
        }}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 font-bold text-2xl sm:text-3xl uppercase rounded-sm
            ${isRevealed ? 'bg-transparent border-neutral-300 dark:border-neutral-700' : stateColors[state]}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span
            className={`
              ${isRevealed ? 'text-transparent' : ''}
              ${state === 'tbd' ? 'animate-pop' : ''}
            `}
          >
            {letter}
          </span>
        </div>

        {/* Back face (revealed color) */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 font-bold text-2xl sm:text-3xl uppercase rounded-sm
            ${isRevealed ? stateColors[state] : 'bg-transparent border-transparent'}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          {letter}
        </div>
      </div>
    </div>
  );
}
