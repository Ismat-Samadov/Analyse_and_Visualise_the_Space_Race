'use client';

import { Statistics } from '@/lib/types';
import { MAX_GUESSES } from '@/lib/game';
import { Modal } from './Modal';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Statistics;
  gameStatus: 'playing' | 'won' | 'lost';
  currentRow: number;
}

export function StatsModal({ isOpen, onClose, stats, gameStatus, currentRow }: StatsModalProps) {
  const winPct = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="space-y-6">
        {/* Stat numbers */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: stats.gamesPlayed, label: 'Played' },
            { value: winPct, label: 'Win %' },
            { value: stats.currentStreak, label: 'Current Streak' },
            { value: stats.maxStreak, label: 'Max Streak' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Guess distribution */}
        <div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
            Guess Distribution
          </p>
          <div className="space-y-1.5">
            {Array.from({ length: MAX_GUESSES }, (_, i) => {
              const count = stats.guessDistribution[i] ?? 0;
              const pct = Math.max(7, Math.round((count / maxGuesses) * 100));
              const isCurrentGuess = gameStatus === 'won' && currentRow === i + 1;

              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 w-4 text-right">
                    {i + 1}
                  </span>
                  <div
                    className={`h-6 flex items-center justify-end pr-2 rounded text-sm font-bold text-white transition-all duration-500
                      ${isCurrentGuess ? 'bg-green-600' : 'bg-neutral-500 dark:bg-neutral-600'}`}
                    style={{ width: `${pct}%`, minWidth: '1.75rem' }}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next word countdown */}
        <div className="text-center border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Next WORDLE</p>
          <Countdown />
        </div>
      </div>
    </Modal>
  );
}

function Countdown() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diffMs = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const mins = Math.floor((diffMs % 3_600_000) / 60_000);
  const secs = Math.floor((diffMs % 60_000) / 1000);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums mt-1">
      {pad(hours)}:{pad(mins)}:{pad(secs)}
    </p>
  );
}
