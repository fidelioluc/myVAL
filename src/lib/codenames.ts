export const COOL_WORDS = [
  "Shadow", "Vortex", "Cipher", "Phantom", "Nebula",
  "Raven", "Glacier", "Thunder", "Mirage", "Obsidian",
  "Blaze", "Specter", "Titan", "Eclipse", "Nomad",
  "Falcon", "Apex", "Drift", "Onyx", "Havoc",
  "Wraith", "Zenith", "Pulse", "Ember", "Frostbite",
  "Venom", "Horizon", "Tempest", "Cobalt", "Abyss",
  "Crimson", "Dagger", "Lynx", "Prism", "Volt",
  "Stealth", "Cascade", "Raptor", "Sable", "Flux",
  "Mercury", "Prowl", "Inferno", "Quartz", "Surge",
  "Bandit", "Oracle", "Magnet", "Recon", "Neon",
];

export type CardRole = "agent" | "assassin" | "neutral";

export interface PlayerMap {
  roles: CardRole[];
  agentCount: number;
}

export interface GuessResult {
  index: number;
  role: CardRole;
}

export const generatePlayerMap = (): PlayerMap => {
  const agentCount = Math.floor(Math.random() * 4) + 6; // 6–9
  const roles: CardRole[] = Array(25).fill("neutral");
  const indices = Array.from({ length: 25 }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < agentCount; i++) roles[indices[i]] = "agent";
  for (let i = agentCount; i < agentCount + 3; i++) roles[indices[i]] = "assassin";
  return { roles, agentCount };
};

export const pickWords = (): string[] => {
  const shuffled = [...COOL_WORDS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 25);
};

export type Player = "player1" | "player2";
export type Phase = "spymaster" | "guessing" | "reveal";
