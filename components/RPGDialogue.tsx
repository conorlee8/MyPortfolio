'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Choice } from '@/data/rpgScenes';

interface RPGDialogueProps {
  question: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
  xp: number;
  progress?: number;
  totalSteps?: number;
}

export default function RPGDialogue({
  question,
  choices,
  onChoice,
  xp,
  progress = 0,
  totalSteps = 0,
}: RPGDialogueProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleChoice = (choice: Choice, index: number) => {
    setSelectedChoice(index);

    // Delay to show selection, then transition
    setTimeout(() => {
      onChoice(choice);
      setSelectedChoice(null);
    }, 400);
  };

  // Smooth easing
  const smoothEasing: [number, number, number, number] = [0.4, 0, 0.2, 1];

  return (
    <div className="relative z-20 flex h-full w-full items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-3xl">
        {/* Progress Indicator */}
        {progress > 0 && totalSteps > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: smoothEasing }}
            className="mb-8 flex items-center justify-between"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-cyan-bright/60">
              Question {progress} of {totalSteps}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: smoothEasing
                  }}
                  className={`h-1 w-8 origin-left rounded-full ${
                    i < progress
                      ? 'bg-gradient-to-r from-cyan-bright to-electric-purple'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: smoothEasing }}
            className="mb-12"
          >
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Choices */}
        <div className="space-y-4">
          <AnimatePresence>
            {choices.map((choice, index) => (
              <motion.button
                key={`${question}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: smoothEasing
                }}
                onClick={() => handleChoice(choice, index)}
                disabled={selectedChoice !== null}
                className={`group relative w-full overflow-hidden rounded-2xl border px-8 py-5 text-left backdrop-blur-sm transition-all duration-300 ${
                  selectedChoice === index
                    ? 'border-cyan-bright bg-cyan-bright/20 scale-[0.98]'
                    : selectedChoice !== null
                    ? 'opacity-30 pointer-events-none'
                    : 'border-white/10 bg-white/5 hover:border-cyan-bright/50 hover:bg-white/10 hover:scale-[1.01]'
                }`}
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-hot-pink" />
                  <span className="text-lg text-white sm:text-xl">
                    {choice.text}
                  </span>
                </div>

                {/* Subtle shimmer on hover */}
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* XP Display */}
        {xp > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-8 text-center text-xs text-white/40"
          >
            XP: {xp}
          </motion.div>
        )}
      </div>
    </div>
  );
}
