import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Send, Eye, EyeOff, Check, Users, Trophy, XCircle, BarChart3, Trash2 } from "lucide-react";
import {
  generatePlayerMap,
  pickWords,
  type PlayerMap,
  type Player,
  type Phase,
  type CardRole,
} from "@/lib/codenames";
import { loadStats, recordGame, resetStats, type GameStats } from "@/lib/codenames-stats";

const MAX_TURNS = 7;

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

type GameState = "lobby" | "playing" | "finished";

const initGame = () => ({
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
  turnCount: 0,
});

const CodenamesSection = () => {
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [ready, setReady] = useState({ player1: false, player2: false });
  const [game, setGame] = useState(initGame);
  const [showMap, setShowMap] = useState(false);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const spymaster = game.turn;
  const guesser: Player = game.turn === "player1" ? "player2" : "player1";
  const guesserMap = game.maps[guesser];
  const spymasterMap = game.maps[spymaster];

  const totalToFind = (p: Player) => game.maps[p].agentCount;
  const foundCount = (p: Player) => game.found[p].length;

  const allFound =
    foundCount("player1") >= totalToFind("player1") &&
    foundCount("player2") >= totalToFind("player2");

  const outOfTurns = game.turnCount >= MAX_TURNS && !allFound && !game.hitAssassin;

  const toggleReady = (p: Player) => {
    setReady((prev) => {
      const next = { ...prev, [p]: !prev[p] };
      if (next.player1 && next.player2) {
        setTimeout(() => {
          setGame(initGame());
          setGameState("playing");
        }, 400);
      }
      return next;
    });
  };

  const toggleGuess = (i: number) => {
    if (game.phase !== "guessing") return;
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

    const newTurnCount = game.turnCount + 1;

    setGame((prev) => ({
      ...prev,
      phase: "reveal",
      revealResults: results,
      found: newFound,
      hitAssassin,
      turnCount: newTurnCount,
    }));

    // Check end conditions after state update
    const nowAllFound =
      newFound.player1.length >= game.maps.player1.agentCount &&
      newFound.player2.length >= game.maps.player2.agentCount;

    if (hitAssassin || nowAllFound || newTurnCount >= MAX_TURNS) {
      const won = nowAllFound && !hitAssassin;
      const updated = recordGame(won, newTurnCount);
      setStats(updated);
      setGameState("finished");
    }
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
    setReady({ player1: false, player2: false });
    setGameState("lobby");
  };

  const handleResetStats = () => {
    setStats(resetStats());
  };

  const isCardUsed = (i: number) =>
    game.found.player1.includes(i) || game.found.player2.includes(i);

  const isGameOver = gameState === "finished" || allFound || game.hitAssassin || outOfTurns;
  const turnsRemaining = MAX_TURNS - game.turnCount;

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

        {/* Stats toggle */}
        <div className="mb-6 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats((v) => !v)}
            className="btn-valentine border border-border gap-2 px-4 py-2 text-xs text-foreground"
          >
            <BarChart3 size={14} />
            {showStats ? "Hide" : "Show"} Statistics
          </motion.button>
        </div>

        {/* Statistics panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-foreground">Game Statistics</h3>
                  {stats.gamesPlayed > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetStats}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 size={12} /> Reset
                    </motion.button>
                  )}
                </div>

                {stats.gamesPlayed === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No games played yet. Start your first game!</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: "Played", value: stats.gamesPlayed, icon: <Users size={14} /> },
                        { label: "Won", value: stats.gamesWon, icon: <Trophy size={14} /> },
                        { label: "Lost", value: stats.gamesLost, icon: <XCircle size={14} /> },
                        { label: "Best Win", value: stats.bestWin ? `${stats.bestWin} turns` : "—", icon: <BarChart3 size={14} /> },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg bg-secondary/50 p-3 text-center">
                          <div className="mb-1 flex items-center justify-center gap-1 text-muted-foreground">
                            {s.icon}
                            <span className="text-[10px] font-medium uppercase tracking-wide">{s.label}</span>
                          </div>
                          <p className="font-serif text-xl font-bold text-foreground">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {stats.gamesPlayed > 0 && (
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
                        <span>Win rate: {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%</span>
                        <span>Avg turns: {(stats.totalTurns / stats.gamesPlayed).toFixed(1)}</span>
                      </div>
                    )}

                    {/* Recent games */}
                    {stats.history.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Games</p>
                        <div className="flex gap-1.5">
                          {stats.history.slice(-10).map((h, i) => (
                            <div
                              key={i}
                              className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold ${
                                h.won
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              title={`${h.won ? "Won" : "Lost"} in ${h.turns} turns`}
                            >
                              {h.won ? "W" : "L"}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lobby — ready up */}
        {gameState === "lobby" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-border bg-card p-6"
          >
            <h3 className="mb-4 text-center font-serif text-lg font-semibold text-foreground">Ready Up</h3>
            <div className="flex justify-center gap-4">
              {(["player1", "player2"] as Player[]).map((p) => (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleReady(p)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all duration-300 ${
                    ready[p]
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      ready[p]
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ready[p] ? <Check size={20} /> : <Users size={20} />}
                  </div>
                  <span className="text-sm font-medium text-foreground">{playerLabel[p]}</span>
                  <span
                    className={`text-xs font-medium ${
                      ready[p] ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {ready[p] ? "Ready!" : "Tap to ready"}
                  </span>
                </motion.button>
              ))}
            </div>
            {ready.player1 && ready.player2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-sm font-medium text-primary"
              >
                Starting game...
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Active game */}
        {gameState !== "lobby" && (
          <>
            {/* Scoreboard + Turn Counter */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              {(["player1", "player2"] as Player[]).map((p) => (
                <div
                  key={p}
                  className={`rounded-xl border px-5 py-3 text-center transition-colors ${
                    game.turn === p && !isGameOver
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
              <div
                className={`rounded-xl border px-5 py-3 text-center ${
                  turnsRemaining <= 2 && !isGameOver
                    ? "border-destructive bg-destructive/10"
                    : "border-border bg-card"
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">Turns Left</p>
                <p
                  className={`font-serif text-2xl font-bold ${
                    turnsRemaining <= 2 && !isGameOver ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {Math.max(0, turnsRemaining)}
                </p>
              </div>
            </div>

            {/* Game over states */}
            {isGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-xl border border-border bg-card p-6 text-center"
              >
                <p className="font-serif text-2xl font-bold text-foreground">
                  {game.hitAssassin
                    ? "💀 Assassin Hit! Game Over."
                    : allFound
                    ? `🎉 You found them all in ${game.turnCount} turns!`
                    : "⏰ Out of turns! Game Over."}
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

            {/* Turn controls */}
            {!isGameOver && (
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
                      {!game.hitAssassin && !outOfTurns && (
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
          </>
        )}
      </div>
    </section>
  );
};

export default CodenamesSection;
