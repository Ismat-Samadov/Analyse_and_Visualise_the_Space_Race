export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface TileData {
  letter: string;
  state: LetterState;
}

export type BoardRow = TileData[];

export interface GameState {
  solution: string;
  boardState: string[]; // each string is a guessed word
  evaluations: (LetterState[] | null)[];
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  hardMode: boolean;
  lastPlayedTs: number;
}

export interface Statistics {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // index 0 = 1 guess, index 5 = 6 guesses
  lastWonTs: number;
}

export type ModalType = 'none' | 'help' | 'stats' | 'settings';
