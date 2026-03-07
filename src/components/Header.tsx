'use client';

import { ModalType } from '@/lib/types';

interface HeaderProps {
  onOpenModal: (modal: ModalType) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Header({ onOpenModal, darkMode, onToggleDark }: HeaderProps) {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-700 px-4">
      <div className="max-w-xl mx-auto h-14 flex items-center justify-between">
        {/* Left icons */}
        <div className="flex items-center gap-1">
          <IconButton
            label="Help"
            onClick={() => onOpenModal('help')}
            title="How to play"
          >
            <HelpIcon />
          </IconButton>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white select-none">
          Wordle
        </h1>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <IconButton
            label="Stats"
            onClick={() => onOpenModal('stats')}
            title="Statistics"
          >
            <StatsIcon />
          </IconButton>
          <IconButton
            label={darkMode ? 'Light mode' : 'Dark mode'}
            onClick={onToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  label,
  onClick,
  title,
  children,
}: {
  label: string;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={title}
      onClick={onClick}
      className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    >
      {children}
    </button>
  );
}

function HelpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
