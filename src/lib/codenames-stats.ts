export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalTurns: number;
  bestWin: number | null; // fewest turns to win
  history: { won: boolean; turns: number; date: string }[];
}

const STORAGE_KEY = "codenames-duet-stats";

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalTurns: 0,
  bestWin: null,
  history: [],
};

export const loadStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultStats, history: [] };
    return JSON.parse(raw) as GameStats;
  } catch {
    return { ...defaultStats, history: [] };
  }
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const recordGame = (won: boolean, turns: number): GameStats => {
  const stats = loadStats();
  stats.gamesPlayed++;
  stats.totalTurns += turns;
  if (won) {
    stats.gamesWon++;
    if (stats.bestWin === null || turns < stats.bestWin) stats.bestWin = turns;
  } else {
    stats.gamesLost++;
  }
  stats.history.push({ won, turns, date: new Date().toISOString() });
  saveStats(stats);
  return stats;
};

export const resetStats = (): GameStats => {
  const fresh = { ...defaultStats, history: [] };
  saveStats(fresh);
  return fresh;
};
