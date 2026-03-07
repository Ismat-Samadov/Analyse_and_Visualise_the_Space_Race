'use client';

import { useState, useEffect } from 'react';
import { useWordle } from '@/hooks/useWordle';
import { Board } from '@/components/Board';
import { Keyboard } from '@/components/Keyboard';
import { Header } from '@/components/Header';
import { HelpModal } from '@/components/HelpModal';
import { StatsModal } from '@/components/StatsModal';
import { ToastContainer } from '@/components/Toast';
import { ModalType } from '@/lib/types';

export default function WordlePage() {
  const {
    currentGuess,
    boardState,
    evaluations,
    currentRow,
    gameStatus,
    revealingRow,
    shakingRow,
    letterStates,
    stats,
    toasts,
    handleKey,
    darkMode,
    toggleDarkMode,
  } = useWordle();

  const [modal, setModal] = useState<ModalType>('none');

  // Apply dark mode class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  // Show stats modal after game ends (with delay for animation)
  useEffect(() => {
    if (gameStatus !== 'playing') {
      const timer = setTimeout(() => setModal('stats'), 2200);
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <Header
        onOpenModal={setModal}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />

      <ToastContainer toasts={toasts} />

      <main className="flex-1 flex flex-col items-center justify-between py-4 px-2 gap-4 max-h-[calc(100vh-3.5rem)]">
        {/* Board */}
        <div className="flex-1 flex items-center justify-center w-full">
          <Board
            boardState={boardState}
            evaluations={evaluations}
            currentGuess={currentGuess}
            currentRow={currentRow}
            revealingRow={revealingRow}
            shakingRow={shakingRow}
          />
        </div>

        {/* Keyboard */}
        <div className="w-full pb-2">
          <Keyboard letterStates={letterStates} onKey={handleKey} />
        </div>
      </main>

      <HelpModal isOpen={modal === 'help'} onClose={() => setModal('none')} />
      <StatsModal
        isOpen={modal === 'stats'}
        onClose={() => setModal('none')}
        stats={stats}
        gameStatus={gameStatus}
        currentRow={currentRow}
      />
    </div>
  );
}
