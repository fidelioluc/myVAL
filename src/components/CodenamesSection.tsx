import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shuffle, RotateCcw } from "lucide-react";

const defaultWords = [
  "Love", "Heart", "Kiss", "Rose", "Moon",
  "Star", "Dream", "Dance", "Song", "Smile",
  "Light", "Hope", "Joy", "Bliss", "Charm",
  "Grace", "Sweet", "Bloom", "Warm", "Glow",
  "Gift", "Wish", "Dear", "Fate", "Soul",
];

type CardType = "neutral" | "agent" | "assassin";

const typeColors: Record<CardType, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  agent: "bg-primary text-primary-foreground",
  assassin: "bg-foreground text-background",
};

const typeLabels: Record<CardType, string> = {
  neutral: "Neutral",
  agent: "Agent",
  assassin: "Assassin",
};

const generateMap = (): CardType[] => {
  const map: CardType[] = Array(25).fill("neutral");
  // 9 agents, 3 assassins
  const indices = Array.from({ length: 25 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < 9; i++) map[indices[i]] = "agent";
  for (let i = 9; i < 12; i++) map[indices[i]] = "assassin";
  return map;
};

const CodenamesSection = () => {
  const [words, setWords] = useState<string[]>(defaultWords);
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [spymasterView, setSpymasterView] = useState(false);
  const [secretMap, setSecretMap] = useState<CardType[]>(generateMap);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(defaultWords.join(", "));

  const toggleCard = (i: number) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const resetGame = () => {
    setRevealed(Array(25).fill(false));
    setSecretMap(generateMap());
  };

  const shuffleWords = () => {
    setWords((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    resetGame();
  };

  const saveWords = () => {
    const parsed = editText
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    if (parsed.length === 25) {
      setWords(parsed);
      setEditing(false);
      resetGame();
    }
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Codenames Duet
          </h2>
          <p className="text-muted-foreground">Our own little game night 🎲</p>
          <div className="section-divider mt-4" />
        </motion.div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSpymasterView((v) => !v)}
            className="btn-valentine border border-border gap-2 text-sm text-foreground"
          >
            {spymasterView ? <EyeOff size={16} /> : <Eye size={16} />}
            {spymasterView ? "Hide Map" : "Reveal Map"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={shuffleWords}
            className="btn-valentine border border-border gap-2 text-sm text-foreground"
          >
            <Shuffle size={16} />
            Shuffle
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-valentine border border-border gap-2 text-sm text-foreground"
          >
            <RotateCcw size={16} />
            Reset
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditText(words.join(", "));
              setEditing((e) => !e);
            }}
            className="btn-valentine border border-border gap-2 text-sm text-foreground"
          >
            {editing ? "Cancel" : "Edit Words"}
          </motion.button>
        </div>

        {/* Word editor */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border bg-card p-4 font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Enter 25 words separated by commas..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {editText.split(",").filter((w) => w.trim()).length}/25 words
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={saveWords}
              disabled={editText.split(",").filter((w) => w.trim()).length !== 25}
              className="btn-yes mt-3 text-sm disabled:opacity-40"
            >
              Save Words
            </motion.button>
          </motion.div>
        )}

        {/* Legend */}
        {spymasterView && (
          <div className="mb-4 flex justify-center gap-4 text-xs font-medium">
            {(["agent", "assassin", "neutral"] as CardType[]).map((type) => (
              <span key={type} className="flex items-center gap-1.5">
                <span className={`inline-block h-3 w-3 rounded-sm ${typeColors[type]}`} />
                {typeLabels[type]}
              </span>
            ))}
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
          {words.map((word, i) => {
            const isRevealed = revealed[i];
            const cardType = secretMap[i];
            const showType = spymasterView || isRevealed;

            return (
              <motion.button
                key={`${word}-${i}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleCard(i)}
                className={`
                  relative flex items-center justify-center rounded-xl p-2 text-center font-sans text-xs font-medium transition-colors duration-200 sm:p-3 sm:text-sm
                  aspect-square sm:aspect-[4/3]
                  ${showType ? typeColors[cardType] : "bg-card text-card-foreground border border-border hover:border-primary/30"}
                `}
              >
                {word}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CodenamesSection;
