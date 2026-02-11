import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const reasons = [
  "Because your laugh is my favorite sound in the entire world.",
  "Because you make even the most ordinary moments feel magical.",
  "Because you believe in me even when I don't believe in myself.",
  "Because waking up next to you is the best part of every day.",
  "Because you're the first person I want to tell good news to.",
  "Because your hugs feel like coming home.",
  "Because you make me want to be a better person.",
  "Because life with you is the greatest adventure I could ever imagine.",
  "Because you see the good in everyone, especially me.",
  "Because you're the calm in my chaos.",
  "Because every love song suddenly makes sense with you.",
  "Because I fall in love with you a little more every single day.",
  "Because no one else could ever compare to you.",
  "Because you're my best friend and my whole heart.",
  "Because even silence is comfortable when I'm with you.",
];

const ReasonsSection = () => {
  const [currentReason, setCurrentReason] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const showReason = () => {
    const available = reasons.filter((r) => r !== currentReason);
    const next = available[Math.floor(Math.random() * available.length)];
    setCurrentReason(next);
    setKey((k) => k + 1);
  };

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="mx-auto mb-4 text-gold" size={28} />
          <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            For when you need a reminder...
          </h2>
          <div className="section-divider mt-4 mb-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 sm:p-10"
        >
          <div className="min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentReason ? (
                <motion.p
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-xl italic leading-relaxed text-foreground/90 sm:text-2xl"
                >
                  "{currentReason}"
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground"
                >
                  Tap below whenever you need a pick-me-up 💛
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={showReason}
            className="btn-yes mt-8 gap-2"
          >
            <Heart size={16} fill="currentColor" />
            {currentReason ? "Tell me another" : "I'm feeling sad"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReasonsSection;
