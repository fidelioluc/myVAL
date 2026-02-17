import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const reasons = [
  "Ich liebe es mit dir zu lachen und zu kabbeln.",
  "Wenn du an mich glaubst ist alles okay danke dafür.",
  "Ich habe immer das Gefühl das wir zusammen alles schaffen können.",
  "Selbst die alltäglichen Dinge machen mit dir Spaß weil du mir immer lebensfreude gibst.",
  "Ich bin so stolz auf dich und wie du dich in unserer Beziehung immer weiterentwickelst und an dir arbeitest.",
  "Du bist so loyal und zuverlässig wie ein Löwe und ich bewundere das an dir.",
  "Wenn du mich anlächelst fühle ich mich wie der glücklichste Mensch auf Erden.",
  "Du bist mein Leuchtturm im Sturm ;)",
  "Ich weiß das du immer an mich denkst und das gibt mir so viel Kraft.",
  "Ich liebe es wie du mich immer zum Lachen bringst auch wenn ich mal schlecht drauf bin.",
  "Du hast den besten Bunda im Gym.",
  "Ich liebe dich so sehr weil wir das beste Team bei Wer Stielt mir die Show sind. Kopenhagen Open Champions 2026.",
  "Weil ich dich einfach so sehr liebe !!!!! Guck so dolle 3> 3> 3> 3> 3> 3> !!!!!!!",
  "Ich liebe es an dir das du beim Essen machen so kreative bist und so viele leckere Sachen für mich zauberst."
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
            For when you need a reminder how much I love you ...
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
