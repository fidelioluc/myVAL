import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

interface HeroSectionProps {
  onAccept: () => void;
}

const HeroSection = ({ onAccept }: HeroSectionProps) => {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [accepted, setAccepted] = useState(false);

  const handleNoHover = useCallback(() => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 50);
    setNoPos({ x, y });
  }, []);

  const handleYes = () => {
    setAccepted(true);

    // Fire confetti
    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ["#e11d48", "#fb7185", "#fda4af", "#fecdd3", "#fff1f2"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Also burst from center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors,
    });

    setTimeout(() => {
      onAccept();
    }, 1800);
  };

  return (
    <section className="hero-gradient relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Floating hearts background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10"
          initial={{ y: "100vh", x: `${15 + i * 15}vw` }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        >
          <Heart size={20 + i * 8} fill="currentColor" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 inline-block"
        >
          <Heart
            size={48}
            className="text-primary mx-auto"
            fill="currentColor"
          />
        </motion.div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          Will you be my
        </h1>
        <h1 className="mb-12 text-5xl font-bold italic tracking-tight text-primary sm:text-7xl">
          Valentine?
        </h1>

        <AnimatePresence>
          {!accepted && (
            <motion.div
              className="flex items-center justify-center gap-6"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleYes}
                className="btn-yes text-lg"
              >
                Yes ♥
              </motion.button>

              {!noPos ? (
                <motion.button
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoHover}
                  className="btn-no text-lg"
                >
                  No
                </motion.button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {accepted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 font-serif text-2xl italic text-primary"
            >
              I knew you&apos;d say yes! 💕
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Escaped "No" button */}
      <AnimatePresence>
        {noPos && !accepted && (
          <motion.button
            key="no-escape"
            initial={false}
            animate={{ left: noPos.x, top: noPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            className="btn-no fixed z-50 text-lg"
            style={{ position: "fixed" }}
          >
            No
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
