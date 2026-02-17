export const CODENAMES_WORDS_DE = [
  "Schatten", "Wirbel", "Chiffre", "Phantom", "Nebel", "Rabe", "Gletscher", "Donner", "Illusion", "Obsidian",
  "Flamme", "Gespenst", "Titan", "Finsternis", "Nomade", "Falke", "Gipfel", "Drift", "Onyx", "Chaos",
  "Geist", "Zenit", "Puls", "Glut", "Frost", "Gift", "Horizont", "Sturm", "Kobalt", "Abgrund",
  "Purpur", "Dolch", "Luchs", "Prisma", "Blitz", "Tarnung", "Kaskade", "Raptor", "Zobel", "Strom",
  "Quecksilber", "Pirsch", "Inferno", "Quarz", "Woge", "Bandit", "Orakel", "Magnet", "Späher", "Neon",
  "Anker", "Axt", "Batterie", "Bär", "Bogen", "Brille", "Burg", "Dampf", "Diamant", "Drache",
  "Echo", "Eis", "Eisen", "Engel", "Erde", "Faden", "Falle", "Fass", "Feder", "Fels",
  "Feuer", "Figur", "Film", "Fisch", "Flasche", "Fliege", "Fluss", "Flügel", "Form", "Fort",
  "Funke", "Gabel", "Garten", "Gas", "Gehirn", "Glocke", "Gold", "Grab", "Graphit", "Grenze",
  "Hafen", "Hahn", "Hammer", "Hand", "Harz", "Helm", "Herz", "Hexe", "Honig", "Horn",
  "Hund", "Insel", "Jäger", "Kaffee", "Kahn", "Kaiser", "Kamera", "Kamm", "Kanal", "Kante",
  "Kapitän", "Karte", "Kasten", "Katze", "Kegel", "Kern", "Kette", "Kiefer", "Klaue", "Klee",
  "Klippe", "Knoten", "Knopf", "Koffer", "Kohle", "Komet", "Kompass", "König", "Kopf", "Korb",
  "Kran", "Kranich", "Krieger", "Krone", "Kugel", "Labor", "Labyrinth", "Lachs", "Lampe", "Laser",
  "Lasso", "Laub", "Lawine", "Leine", "Löwe", "Löffel", "Luft", "Lupe", "Maske", "Mast",
  "Mauer", "Maus", "Meißel", "Messer", "Mine", "Mond", "Moos", "Motor", "Münze", "Nadel",
  "Nagel", "Netz", "Nuss", "Ozean", "Panther", "Panzer", "Papier", "Pfeil", "Pferd", "Pflanze",
  "Pilot", "Pirat", "Pistole", "Platin", "Post", "Prinz", "Pulver", "Rad", "Rakete", "Rauch",
  "Reifen", "Reiter", "Ring", "Ritter", "Roboter", "Rohr", "Rose", "Rost", "Rubin", "Säge",
  "Salz", "Sand", "Sattel", "Säule", "Schiff", "Schild", "Schloss", "Schlüssel", "Schnabel", "Schnee",
  "Schwert", "Siegel", "Silber", "Smaragd", "Sonne", "Spiegel", "Spinne", "Spur", "Stahl", "Staub",
  "Stein", "Stern", "Stock", "Strahlen", "Sumpf", "Tafel", "Turm", "Ufer", "Uhr", "Vulkan",
  "Wald", "Wand", "Wasser", "Würfel", "Wüste", "Zahn", "Zaun", "Zelt", "Ziegel", "Zirkel"
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
  const shuffled = [...CODENAMES_WORDS_DE];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 25);
};

export type Player = "player1" | "player2";
export type Phase = "spymaster" | "guessing" | "reveal";
