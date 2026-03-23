import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  rotation: number;
  scale: number;
}

const colors = [
  "hsl(var(--primary))", // Saffron
  "hsl(var(--success))", // Green
  "hsl(var(--secondary))", // Navy
  "hsl(var(--accent))", // Chakra Blue
  "#FFFFFF",
];

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}vw`,
                y: -20,
                rotate: 0,
                scale: particle.scale,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: particle.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeOut",
              }}
              className="absolute"
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: particle.color,
                  boxShadow: `0 0 6px ${particle.color}`,
                }}
              />
            </motion.div>
          ))}

          {/* Indian Flag Wave */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: "50%" }}
            animate={{ opacity: 1, scale: 1, y: "40%" }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute left-1/2 -translate-x-1/2 text-8xl"
          >
            🇮🇳
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
