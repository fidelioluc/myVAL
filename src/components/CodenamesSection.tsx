import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Send, Eye, EyeOff, Check } from "lucide-react";
import {
  generatePlayerMap,
  pickWords,
  type PlayerMap,
  type Player,
  type Phase,
  type CardRole,
} from "@/lib/codenames";

const roleColors: Record<CardRole, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  agent: "bg-primary text-primary-foreground",
  assassin: "bg-foreground text-background",
};

const roleLabels: Record<CardRole, string> = {
  neutral: "Neutral",
  agent: "Agent",
  assassin: "Assassin",
};

const playerLabel: Record<Player, string> = {
  player1: "Player 1",
  player2: "Player 2",
};

const initGame = () => {
  return {
    words: pickWords(),
    maps: { player1: generatePlayerMap(), player2: generatePlayerMap() },
    turn: "player1" as Player,
    phase: "spymaster" as Phase,
    clue: "",
    clueNumber: 1,
    guesses: [] as number[],
    found: { player1: [] as number[], player2: [] as number[] },
    hitAssassin: false,
    revealResults: [] as { index: number; role: CardRole }[],
  };
};

const CodenamesSection = () => {
  const [game, setGame] = useState(initGame);
  const [showMap, setShowMap] = useState(false);

  const spymaster = game.turn; // the one giving the clue
  const guesser: Player = game.turn === "player1" ? "player2" : "player1";
  // The guesser's map is what determines if a card is agent/assassin for them
  const guesserMap = game.maps[guesser];
  const spymasterMap = game.maps[spymaster];

  const totalToFind = (p: Player) => game.maps[p].agentCount;
  const foundCount = (p: Player) => game.found[p].length;

  const allFound =
    foundCount("player1") >= totalToFind("player1") &&
    foundCount("player2") >= totalToFind("player2");

  const toggleGuess = (i: number) => {
    if (game.phase !== "guessing") return;
    // Can't guess already-found cards
    if (game.found.player1.includes(i) || game.found.player2.includes(i)) return;
    setGame((prev) => {
      const guesses = prev.guesses.includes(i)
        ? prev.guesses.filter((g) => g !== i)
        : [...prev.guesses, i];
      return { ...prev, guesses };
    });
  };

  const submitClue = () => {
    if (!game.clue.trim()) return;
    setGame((prev) => ({ ...prev, phase: "guessing" }));
  };

  const submitGuesses = () => {
    if (game.guesses.length === 0) return;
    const results = game.guesses.map((i) => ({
      index: i,
      role: guesserMap.roles[i],
    }));
    const hitAssassin = results.some((r) => r.role === "assassin");
    const newFound = { ...game.found };
    results.forEach((r) => {
      if (r.role === "agent" && !newFound[guesser].includes(r.index)) {
        newFound[guesser] = [...newFound[guesser], r.index];
      }
    });
    setGame((prev) => ({
      ...prev,
      phase: "reveal",
      revealResults: results,
      found: newFound,
      hitAssassin,
    }));
  };

  const nextTurn = () => {
    setGame((prev) => ({
      ...prev,
      turn: prev.turn === "player1" ? "player2" : "player1",
      phase: "spymaster",
      clue: "",
      clueNumber: 1,
      guesses: [],
      revealResults: [],
    }));
    setShowMap(false);
  };

  const resetGame = () => {
    setGame(initGame());
    setShowMap(false);
  };

  const isCardUsed = (i: number) =>
    game.found.player1.includes(i) || game.found.player2.includes(i);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Codenames Duet
          </h2>
          <p className="text-muted-foreground">Side-by-side spy action 🕵️</p>
          <div className="section-divider mt-4" />
        </motion.div>

        {/* Scoreboard */}
        <div className="mb-6 flex justify-center gap-6">
          {(["player1", "player2"] as Player[]).map((p) => (
            <div
              key={p}
              className={`rounded-xl border px-5 py-3 text-center transition-colors ${
                game.turn === p && !allFound && !game.hitAssassin
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-xs font-medium text-muted-foreground">{playerLabel[p]}</p>
              <p className="font-serif text-2xl font-bold text-foreground">
                {foundCount(p)}/{totalToFind(p)}
              </p>
            </div>
          ))}
        </div>

        {/* Game over states */}
        {(allFound || game.hitAssassin) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-xl border border-border bg-card p-6 text-center"
          >
            <p className="font-serif text-2xl font-bold text-foreground">
              {game.hitAssassin ? "💀 Assassin Hit! Game Over." : "🎉 You found them all!"}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="btn-yes mt-4 gap-2 text-sm"
            >
              <RotateCcw size={16} /> New Game
            </motion.button>
          </motion.div>
        )}

        {/* Turn info & controls */}
        {!allFound && !game.hitAssassin && (
          <div className="mb-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              {game.phase === "spymaster" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-primary">{playerLabel[spymaster]}</span> — give a clue
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMap((v) => !v)}
                      className="btn-valentine border border-border gap-1.5 px-3 py-1.5 text-xs text-foreground"
                    >
                      {showMap ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showMap ? "Hide" : "View"} Your Map
                    </motion.button>
                  </div>

                  {showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <div className="flex gap-3 text-xs font-medium">
                        {(["agent", "assassin", "neutral"] as CardRole[]).map((type) => (
                          <span key={type} className="flex items-center gap-1.5">
                            <span className={`inline-block h-3 w-3 rounded-sm ${roleColors[type]}`} />
                            {roleLabels[type]}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {game.words.map((word, i) => (
                          <div
                            key={i}
                            className={`rounded-lg p-1.5 text-center text-[10px] font-medium sm:text-xs ${
                              roleColors[spymasterMap.roles[i]]
                            } ${isCardUsed(i) ? "opacity-30" : ""}`}
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={game.clue}
                      onChange={(e) =>
                        setGame((prev) => ({ ...prev, clue: e.target.value }))
                      }
                      placeholder="Clue word..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <select
                      value={game.clueNumber}
                      onChange={(e) =>
                        setGame((prev) => ({
                          ...prev,
                          clueNumber: Number(e.target.value),
                        }))
                      }
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={submitClue}
                      disabled={!game.clue.trim()}
                      className="btn-yes gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                    >
                      <Send size={14} /> Send
                    </motion.button>
                  </div>
                </div>
              )}

              {game.phase === "guessing" && (
                <div className="space-y-3">
                  <p className="text-sm text-foreground">
                    <span className="text-primary">{playerLabel[guesser]}</span> — guess for clue:{" "}
                    <span className="font-bold">
                      "{game.clue}" ({game.clueNumber})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap cards to select your guesses, then submit.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={submitGuesses}
                    disabled={game.guesses.length === 0}
                    className="btn-yes gap-1.5 text-sm disabled:opacity-40"
                  >
                    <Check size={14} /> Submit {game.guesses.length} guess
                    {game.guesses.length !== 1 ? "es" : ""}
                  </motion.button>
                </div>
              )}

              {game.phase === "reveal" && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Results:</p>
                  <div className="flex flex-wrap gap-2">
                    {game.revealResults.map((r) => (
                      <span
                        key={r.index}
                        className={`rounded-lg px-3 py-1 text-xs font-medium ${roleColors[r.role]}`}
                      >
                        {game.words[r.index]} — {roleLabels[r.role]}
                      </span>
                    ))}
                  </div>
                  {!game.hitAssassin && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={nextTurn}
                      className="btn-yes gap-1.5 text-sm"
                    >
                      Next Turn →
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-5 gap-2 sm:gap-3"
        >
          {game.words.map((word, i) => {
            const used = isCardUsed(i);
            const selected = game.guesses.includes(i);
            const isGuessing = game.phase === "guessing";
            // Show role color for used cards
            const usedRole = game.found.player1.includes(i)
              ? "agent"
              : game.found.player2.includes(i)
              ? "agent"
              : null;

            return (
              <motion.button
                key={`${word}-${i}`}
                whileHover={!used ? { scale: 1.04 } : {}}
                whileTap={!used ? { scale: 0.96 } : {}}
                onClick={() => isGuessing && toggleGuess(i)}
                disabled={used || !isGuessing}
                className={`
                  relative flex items-center justify-center rounded-xl p-2 text-center font-sans text-xs font-medium transition-all duration-200 sm:p-3 sm:text-sm
                  aspect-square sm:aspect-[4/3]
                  ${
                    used
                      ? "bg-primary/20 text-primary/50 line-through cursor-default"
                      : selected
                      ? "bg-accent text-accent-foreground ring-2 ring-accent"
                      : "bg-card text-card-foreground border border-border"
                  }
                  ${isGuessing && !used ? "hover:border-primary/40 cursor-pointer" : ""}
                `}
              >
                {word}
                {selected && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] text-accent-foreground">
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Reset */}
        <div className="mt-6 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-valentine border border-border gap-2 text-sm text-foreground"
          >
            <RotateCcw size={16} /> New Game
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CodenamesSection;
