import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, Send, Eye, EyeOff, Check, Users, Trophy, XCircle,
  BarChart3, Trash2, Copy, LogIn, Plus, Target,
} from "lucide-react";
import { useCodenamesGame, type Player, type CardRole } from "@/hooks/use-codenames-game";
import { loadStats, recordGame, resetStats, type GameStats } from "@/lib/codenames-stats";

const MAX_TURNS = 7;
const AGENT_COUNT = 8;


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

const CodenamesSection = () => {
  const {
    game, myRole, loading, error,
    createGame, joinGame, ready, sendClue, submitGuesses, nextTurn, leaveGame,
  } = useCodenamesGame();

  const [joinCode, setJoinCode] = useState("");

  const [showMap, setShowMap] = useState(false);
  const [clueText, setClueText] = useState("");
  const [clueNum, setClueNum] = useState(1);
  const [selectedGuesses, setSelectedGuesses] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [showStats, setShowStats] = useState(false);
  const [prevWinner, setPrevWinner] = useState<string | null>(null);

  // Track game end for stats
  if (game?.phase === "finished" && game.winner && game.winner !== prevWinner) {
    const won = game.winner === "won";
    const updated = recordGame(won, game.turn_count);
    setStats(updated);
    setPrevWinner(game.winner);
  }

  const copyCode = () => {
    if (!game) return;
    navigator.clipboard.writeText(game.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendClue = async () => {
    if (!clueText.trim()) return;
    await sendClue(clueText, clueNum);
    setClueText("");
    setClueNum(1);
  };

  const handleSubmitGuesses = async () => {
    if (selectedGuesses.length === 0) return;
    await submitGuesses(selectedGuesses);
    setSelectedGuesses([]);
  };

  const toggleGuess = (i: number) => {
    setSelectedGuesses((prev) =>
      prev.includes(i) ? prev.filter((g) => g !== i) : [...prev, i]
    );
  };

  const handleResetStats = () => setStats(resetStats());

  const handleNewGame = () => {
    leaveGame();
    setPrevWinner(null);
    setShowMap(false);
    setSelectedGuesses([]);
  };

  // Derive game info
  const isInGame = !!game && !!myRole;
  const spymaster = game?.turn;
  const guesser: Player | undefined = game?.turn === "player1" ? "player2" : "player1";

  const myMap = myRole && game
    ? myRole === "player1" ? game.player1_map : game.player2_map
    : null;

  const foundCount = (p: Player) =>
    game ? (p === "player1" ? game.found_player1.length : game.found_player2.length) : 0;

  // My remaining = agents on MY map not yet found by partner (found_player2 tracks what was found on player1's map and vice versa)
  const myFoundCount = myRole ? foundCount(myRole === "player1" ? "player2" : "player1") : 0;
  const myRemaining = AGENT_COUNT - myFoundCount;

  const p1Remaining = AGENT_COUNT - foundCount("player2"); // found_player2 = found on p1's map
  const p2Remaining = AGENT_COUNT - foundCount("player1"); // found_player1 = found on p2's map
  const totalRemaining = p1Remaining + p2Remaining;

  const isCardUsed = (i: number) =>
    game ? game.found_player1.includes(i) || game.found_player2.includes(i) : false;

  const turnsRemaining = game ? MAX_TURNS - game.turn_count : MAX_TURNS;
  const isGameOver = game?.phase === "finished";

  const amSpymaster = isInGame && game?.phase === "spymaster" && myRole === spymaster;
  const amGuesser = isInGame && game?.phase === "guessing" && myRole === guesser;

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
          <p className="text-muted-foreground">Real-time spy action 🕵️</p>
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
                  <p className="text-sm text-muted-foreground italic">No games played yet.</p>
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
                    {stats.history.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Games</p>
                        <div className="flex gap-1.5">
                          {stats.history.slice(-10).map((h, i) => (
                            <div
                              key={i}
                              className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold ${
                                h.won ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
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

        {/* Error display */}
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* No game - Create or Join */}
        {!isInGame && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-border bg-card p-6"
          >
            <h3 className="mb-5 text-center font-serif text-lg font-semibold text-foreground">
              Start a Game
            </h3>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                25 zufällige Alltagswörter · 8 Agenten pro Spieler · 3 Attentäter
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => createGame()}
                disabled={loading}
                className="btn-yes gap-2 px-6 py-3 text-sm disabled:opacity-50"
              >
                <Plus size={16} /> Neues Spiel erstellen
              </motion.button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-px w-8 bg-border" />
                or join with code
                <div className="h-px w-8 bg-border" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter code..."
                  maxLength={6}
                  className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-center text-sm font-mono uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => joinGame(joinCode)}
                  disabled={loading || joinCode.length < 4}
                  className="btn-yes gap-1.5 px-4 py-2 text-sm disabled:opacity-50"
                >
                  <LogIn size={14} /> Join
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* In game */}
        {isInGame && game && (
          <>
            {/* Game code + role badge */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5">
                <span className="text-xs text-muted-foreground">Code:</span>
                <span className="font-mono text-sm font-bold uppercase text-foreground">{game.code}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={copyCode}>
                  <Copy size={12} className="text-muted-foreground" />
                </motion.button>
                {copied && <span className="text-[10px] text-primary">Copied!</span>}
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                You are {playerLabel[myRole!]}
              </div>
              {game.player2_id ? (
                <div className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600">
                  2 Players Connected
                </div>
              ) : (
                <div className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600">
                  Waiting for Player 2…
                </div>
              )}
            </div>

            {/* Lobby — ready up */}
            {game.phase === "lobby" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-border bg-card p-6"
              >
                <h3 className="mb-4 text-center font-serif text-lg font-semibold text-foreground">Ready Up</h3>
                {!game.player2_id ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Share the code <span className="font-mono font-bold uppercase text-foreground">{game.code}</span> with your partner
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-4">
                      {(["player1", "player2"] as Player[]).map((p) => {
                        const isReady = p === "player1" ? game.player1_ready : game.player2_ready;
                        const isMe = myRole === p;
                        return (
                          <div
                            key={p}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all duration-300 ${
                              isReady
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background"
                            }`}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                              isReady ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                              {isReady ? <Check size={20} /> : <Users size={20} />}
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {playerLabel[p]} {isMe && "(You)"}
                            </span>
                            <span className={`text-xs font-medium ${isReady ? "text-primary" : "text-muted-foreground"}`}>
                              {isReady ? "Ready!" : isMe ? "Tap below" : "Waiting…"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {!(myRole === "player1" ? game.player1_ready : game.player2_ready) && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={ready}
                        className="btn-yes gap-2 px-6 py-2 text-sm"
                      >
                        <Check size={16} /> I'm Ready
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Active game */}
            {game.phase !== "lobby" && (
              <>
                {/* Progress counter - always visible */}
                <div className="mb-5 rounded-xl border border-border bg-card p-4 space-y-3">
                  {/* Total remaining */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={15} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">Noch zu finden</span>
                    </div>
                    <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${
                      totalRemaining <= 4 ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"
                    }`}>
                      {totalRemaining} / {AGENT_COUNT * 2}
                    </div>
                  </div>

                  {/* Progress bar total */}
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={false}
                      animate={{ width: `${((AGENT_COUNT * 2 - totalRemaining) / (AGENT_COUNT * 2)) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>

                  {/* Per-player breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        Meine {myRole === "player1" ? "Wörter" : "Wörter"}
                      </p>
                      <p className="font-serif text-lg font-bold text-foreground">
                        {myRemaining}<span className="text-xs text-muted-foreground font-normal">/{AGENT_COUNT}</span>
                      </p>
                    </div>
                    <div className={`rounded-lg px-3 py-2 text-center ${
                      turnsRemaining <= 2 && !isGameOver ? "bg-destructive/15" : "bg-secondary/50"
                    }`}>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Züge</p>
                      <p className={`font-serif text-lg font-bold ${
                        turnsRemaining <= 2 && !isGameOver ? "text-destructive" : "text-foreground"
                      }`}>
                        {Math.max(0, turnsRemaining)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        Partner
                      </p>
                      <p className="font-serif text-lg font-bold text-foreground">
                        {myRole === "player1" ? p2Remaining : p1Remaining}<span className="text-xs text-muted-foreground font-normal">/{AGENT_COUNT}</span>
                      </p>
                    </div>
                  </div>

                  {/* Turn indicator */}
                  {!isGameOver && (
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <div className={`h-2 w-2 rounded-full ${game.turn === myRole ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <span className="text-xs text-muted-foreground">
                        {game.turn === myRole ? "🕵️ Du bist dran" : `🕵️ ${playerLabel[game.turn as Player]} ist dran`}
                      </span>
                    </div>
                  )}
                </div>


                {/* Your map — always visible */}
                {myMap && (
                  <div className="mb-6 rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Your Map (words you need your partner to find)</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMap((v) => !v)}
                        className="btn-valentine border border-border gap-1.5 px-3 py-1.5 text-xs text-foreground"
                      >
                        {showMap ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showMap ? "Hide" : "Show"}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {showMap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
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
                                  roleColors[myMap.roles[i]]
                                } ${isCardUsed(i) ? "opacity-30" : ""}`}
                              >
                                {word}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Game over */}
                {isGameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 rounded-xl border border-border bg-card p-6 text-center"
                  >
                    <p className="font-serif text-2xl font-bold text-foreground">
                      {game.hit_assassin
                        ? "💀 Assassin Hit! Game Over."
                        : game.winner === "won"
                        ? `🎉 You found them all in ${game.turn_count} turns!`
                        : "⏰ Out of turns! Game Over."}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewGame}
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
                      {/* Spymaster phase */}
                      {game.phase === "spymaster" && (
                        <div className="space-y-3">
                          {amSpymaster ? (
                            <>
                              <p className="text-sm font-medium text-foreground">
                                Your turn — give a clue
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={clueText}
                                  onChange={(e) => setClueText(e.target.value)}
                                  placeholder="Clue word..."
                                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <select
                                  value={clueNum}
                                  onChange={(e) => setClueNum(Number(e.target.value))}
                                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                  ))}
                                </select>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleSendClue}
                                  disabled={!clueText.trim()}
                                  className="btn-yes gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                                >
                                  <Send size={14} /> Send
                                </motion.button>
                              </div>
                            </>
                          ) : (
                            <p className="text-center text-sm text-muted-foreground">
                              Waiting for <span className="text-primary font-medium">{playerLabel[spymaster!]}</span> to give a clue…
                            </p>
                          )}
                        </div>
                      )}

                      {/* Guessing phase */}
                      {game.phase === "guessing" && (
                        <div className="space-y-3">
                          <p className="text-sm text-foreground">
                            Clue: <span className="font-bold text-primary">"{game.clue}" ({game.clue_number})</span>
                          </p>
                          {amGuesser ? (
                            <>
                              <p className="text-xs text-muted-foreground">
                                Tap cards to select your guesses, then submit.
                              </p>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmitGuesses}
                                disabled={selectedGuesses.length === 0}
                                className="btn-yes gap-1.5 text-sm disabled:opacity-40"
                              >
                                <Check size={14} /> Submit {selectedGuesses.length} guess
                                {selectedGuesses.length !== 1 ? "es" : ""}
                              </motion.button>
                            </>
                          ) : (
                            <p className="text-center text-xs text-muted-foreground">
                              Waiting for <span className="text-primary font-medium">{playerLabel[guesser!]}</span> to guess…
                            </p>
                          )}
                        </div>
                      )}

                      {/* Reveal phase */}
                      {game.phase === "reveal" && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-foreground">Results:</p>
                          <div className="flex flex-wrap gap-2">
                            {game.reveal_results.map((r) => (
                              <span
                                key={r.index}
                                className={`rounded-lg px-3 py-1 text-xs font-medium ${roleColors[r.role]}`}
                              >
                                {game.words[r.index]} — {roleLabels[r.role]}
                              </span>
                            ))}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { nextTurn(); }}
                            className="btn-yes gap-1.5 text-sm"
                          >
                            Next Turn →
                          </motion.button>
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
                    const selected = selectedGuesses.includes(i);
                    const canSelect = amGuesser && !used;

                    return (
                      <motion.button
                        key={`${word}-${i}`}
                        whileHover={canSelect ? { scale: 1.04 } : {}}
                        whileTap={canSelect ? { scale: 0.96 } : {}}
                        onClick={() => canSelect && toggleGuess(i)}
                        disabled={!canSelect}
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
                          ${canSelect ? "hover:border-primary/40 cursor-pointer" : ""}
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

                {/* Leave game */}
                <div className="mt-6 flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewGame}
                    className="btn-valentine border border-border gap-2 text-sm text-foreground"
                  >
                    <RotateCcw size={16} /> Leave Game
                  </motion.button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CodenamesSection;
