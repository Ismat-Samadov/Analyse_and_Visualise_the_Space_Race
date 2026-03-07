'use client';

import { LetterState } from '@/lib/types';
import { Key } from './Key';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

interface KeyboardProps {
  letterStates: Record<string, LetterState>;
  onKey: (key: string) => void;
}

export function Keyboard({ letterStates, onKey }: KeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg mx-auto px-1">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1">
          {row.map((key) => (
            <Key
              key={key}
              label={key}
              state={letterStates[key]}
              wide={key === 'Enter' || key === 'Backspace'}
              onClick={onKey}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
