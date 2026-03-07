import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wordle',
  description: 'A beautiful Wordle clone — guess the 5-letter word in 6 tries.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Wordle',
    description: 'Guess the 5-letter word in 6 tries.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
