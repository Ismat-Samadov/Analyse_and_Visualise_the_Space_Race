'use client';

import { Modal } from './Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ExampleTile({ letter, state }: { letter: string; state: string }) {
  const colors: Record<string, string> = {
    correct: 'bg-green-600 border-green-600 text-white',
    present: 'bg-yellow-500 border-yellow-500 text-white',
    absent: 'bg-neutral-500 border-neutral-500 text-white',
    empty: 'bg-transparent border-neutral-300 dark:border-neutral-600',
  };
  return (
    <div
      className={`w-10 h-10 border-2 flex items-center justify-center font-bold text-lg uppercase rounded-sm ${colors[state] ?? colors.empty}`}
    >
      {letter}
    </div>
  );
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to play">
      <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
        <p>Guess the <strong className="text-neutral-900 dark:text-white">WORDLE</strong> in 6 tries.</p>

        <ul className="list-disc list-inside space-y-1">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles changes to show how close your guess was.</li>
        </ul>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        <div className="space-y-3">
          <p className="font-bold text-neutral-900 dark:text-white">Examples</p>

          <div>
            <div className="flex gap-1.5 mb-2">
              <ExampleTile letter="W" state="correct" />
              <ExampleTile letter="E" state="empty" />
              <ExampleTile letter="A" state="empty" />
              <ExampleTile letter="R" state="empty" />
              <ExampleTile letter="Y" state="empty" />
            </div>
            <p><span className="font-bold text-neutral-900 dark:text-white">W</span> is in the word and in the correct spot.</p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              <ExampleTile letter="P" state="empty" />
              <ExampleTile letter="I" state="present" />
              <ExampleTile letter="L" state="empty" />
              <ExampleTile letter="L" state="empty" />
              <ExampleTile letter="S" state="empty" />
            </div>
            <p><span className="font-bold text-neutral-900 dark:text-white">I</span> is in the word but in the wrong spot.</p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              <ExampleTile letter="V" state="empty" />
              <ExampleTile letter="A" state="empty" />
              <ExampleTile letter="G" state="absent" />
              <ExampleTile letter="U" state="empty" />
              <ExampleTile letter="E" state="empty" />
            </div>
            <p><span className="font-bold text-neutral-900 dark:text-white">G</span> is not in the word in any spot.</p>
          </div>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        <p className="font-semibold text-center text-neutral-900 dark:text-white">
          A new WORDLE is available each day!
        </p>
      </div>
    </Modal>
  );
}
