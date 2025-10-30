'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameOverlayProps {
  collected: number;
  target: number;
  isUnlocked: boolean;
  onSkip: () => void;
}

export default function GameOverlay({ collected, target, isUnlocked, onSkip }: GameOverlayProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const progress = Math.min((collected / target) * 100, 100);

  useEffect(() => {
    // Hide instructions after 5 seconds
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && !isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-1/2 top-24 -translate-x-1/2"
          >
            <div className="glass rounded-2xl px-6 py-4">
              <p className="text-center text-sm text-white/90">
                <span className="hidden sm:inline">Move your mouse</span>
                <span className="inline sm:hidden">Touch and drag</span>
                {' '}to collect particles
              </p>
              <p className="mt-1 text-center text-xs text-white/60">
                Collect {target} to unlock the site
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {!isUnlocked && collected > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-32 left-1/2 w-full max-w-md -translate-x-1/2 px-6"
        >
          <div className="glass rounded-full p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-white/70">
              <span>Particles Collected</span>
              <span className="font-mono">{collected} / {target}</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-hot-pink to-electric-purple"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass rounded-3xl px-12 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-4 text-6xl"
              >
                ✨
              </motion.div>
              <h3 className="mb-2 text-2xl font-semibold text-white">
                Portfolio Unlocked!
              </h3>
              <p className="text-white/70">
                Scroll down to explore
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="pointer-events-auto absolute right-6 top-6 glass rounded-full px-4 py-2 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white"
      >
        Skip Game
      </button>
    </div>
  );
}
