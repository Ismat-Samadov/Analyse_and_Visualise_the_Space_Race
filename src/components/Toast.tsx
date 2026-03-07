'use client';

import { ToastMessage } from '@/hooks/useWordle';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed top-16 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="
            bg-neutral-900 text-white dark:bg-white dark:text-neutral-900
            font-bold px-4 py-2 rounded-lg text-sm shadow-lg
            animate-fade-in-down
          "
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
