'use client';

import { LetterState } from '@/lib/types';

interface KeyProps {
  label: string;
  state?: LetterState;
  wide?: boolean;
  onClick: (key: string) => void;
}

const stateStyles: Record<string, string> = {
  correct: 'bg-green-600 text-white border-green-600',
  present: 'bg-yellow-500 text-white border-yellow-500',
  absent: 'bg-neutral-500 text-white border-neutral-500 dark:bg-neutral-700 dark:border-neutral-700',
  default: 'bg-neutral-200 text-neutral-900 border-neutral-200 dark:bg-neutral-600 dark:text-white dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500',
};

export function Key({ label, state, wide = false, onClick }: KeyProps) {
  const style = state && stateStyles[state] ? stateStyles[state] : stateStyles.default;

  return (
    <button
      className={`
        ${wide ? 'px-3 min-w-[4rem]' : 'w-9 sm:w-10'}
        h-14 rounded-md border font-bold text-sm sm:text-base uppercase
        flex items-center justify-center cursor-pointer
        transition-all duration-200 active:scale-95 select-none
        ${style}
      `}
      onClick={() => onClick(label)}
      aria-label={label}
    >
      {label === 'Backspace' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M9.414 5L2 12l7.414 7H22V5H9.414zm7.293 10.293l-1.414 1.414L12 13.414l-3.293 3.293-1.414-1.414L10.586 12 7.293 8.707l1.414-1.414L12 10.586l3.293-3.293 1.414 1.414L13.414 12l3.293 3.293z"/>
        </svg>
      ) : (
        label
      )}
    </button>
  );
}
