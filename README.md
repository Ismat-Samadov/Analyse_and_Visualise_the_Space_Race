# Wordle

A beautiful, responsive Wordle clone built with Next.js 16, TypeScript, and Tailwind CSS.

![Wordle Screenshot](public/favicon.svg)

## Features

- **Daily word** — A new 5-letter word every day, consistent for all players
- **6 attempts** — Guess the word before you run out of tries
- **Color feedback** — Green (correct), Yellow (wrong position), Gray (absent)
- **Animated tiles** — Flip reveal animation and shake on invalid input
- **On-screen keyboard** — With color-coded key states; physical keyboard supported
- **Statistics** — Tracks games played, win %, current streak, max streak, and guess distribution
- **Dark / Light mode** — Toggle with one click; defaults to dark
- **Responsive** — Works great on mobile, tablet, and desktop
- **Persistent state** — Game and stats are saved to `localStorage`
- **Toast notifications** — Instant feedback for invalid guesses and game results
- **Accessible** — Keyboard navigation, ARIA labels, semantic HTML

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| CSS Keyframes | Flip, shake, bounce, fade animations |
| `localStorage` | Game state & statistics persistence |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Project Structure

```
src/
  app/
    globals.css        # CSS animations & Tailwind import
    layout.tsx         # Root layout with metadata & favicon
    page.tsx           # Main game page
  components/
    Board.tsx          # 6x5 grid of tiles
    Tile.tsx           # Individual tile with flip animation
    Keyboard.tsx       # On-screen keyboard (3 rows)
    Key.tsx            # Individual keyboard key
    Header.tsx         # Title bar with help/stats/theme icons
    HelpModal.tsx      # How-to-play modal
    StatsModal.tsx     # Statistics modal with guess distribution
    Modal.tsx          # Reusable modal wrapper
    Toast.tsx          # Toast notification container
  hooks/
    useWordle.ts       # Core game state machine (useReducer)
  lib/
    game.ts            # Guess evaluation algorithm
    types.ts           # TypeScript interfaces
    wordList.ts        # Answer words + daily word picker
    storage.ts         # localStorage read/write helpers
public/
  favicon.svg          # Custom Wordle-style favicon
```

## How the Daily Word Works

The daily word is derived deterministically from the current date:

```ts
const dayIndex = Math.floor((today - START_DATE) / 86_400_000);
const word = WORD_LIST[dayIndex % WORD_LIST.length];
```

This ensures every player sees the same word on the same day without a server.

## Guess Evaluation

The evaluator handles duplicate letters correctly with a two-pass algorithm:

1. **First pass** — Mark letters in the exact correct position (green)
2. **Second pass** — Mark remaining letters that exist in the word but in a different position (yellow)
3. Anything else is marked absent (gray)

## Build

```bash
npm run build
npm start
```

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com):

```bash
npx vercel
```

Or any platform that supports Next.js (Netlify, Railway, Render, Docker, etc.).

## License

MIT
