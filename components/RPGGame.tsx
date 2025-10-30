'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from './Scene';
import CodeRain from './CodeRain';
import RPGDialogue from './RPGDialogue';
import { rpgScenes, type Choice, type Scene as SceneType } from '@/data/rpgScenes';

interface RPGGameProps {
  onComplete: (personality: string, xp: number) => void;
}

export default function RPGGame({ onComplete }: RPGGameProps) {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [xp, setXp] = useState(0);
  const [personality, setPersonality] = useState<string>('balanced');

  const currentScene: SceneType = rpgScenes[currentSceneId];

  const handleChoice = (choice: Choice) => {
    // Add XP
    if (choice.xp) {
      setXp(prev => prev + choice.xp!);
    }

    // Track personality
    if (choice.personality) {
      setPersonality(choice.personality);
    }

    // Smooth transition with proper timing
    setTimeout(() => {
      setCurrentSceneId(choice.nextScene);

      // Check if we've reached the unlock scene
      if (choice.nextScene === 'unlock') {
        setTimeout(() => {
          onComplete(personality, xp);
        }, 2000);
      }
    }, 400);
  };

  const handleSkip = () => {
    onComplete('curious', 0);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Mesh Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="mesh-orb mesh-orb-1 bg-gradient-to-br from-hot-pink to-electric-purple"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-100px',
          }}
        />
        <div
          className="mesh-orb mesh-orb-2 bg-gradient-to-tr from-electric-purple to-cyan-bright"
          style={{
            width: '500px',
            height: '500px',
            bottom: '-150px',
            left: '-100px',
          }}
        />
        <div
          className="mesh-orb mesh-orb-3 bg-gradient-to-br from-cyan-bright to-hot-pink"
          style={{
            width: '400px',
            height: '400px',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* 3D Code Rain Background */}
      <div className="absolute inset-0 z-0">
        <Scene>
          <CodeRain sceneId={currentSceneId} intensity={1.0} />
          <ambientLight intensity={0.2} />
          <fog attach="fog" args={['#000000', 5, 25]} />
        </Scene>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Dialogue UI - Smooth Crossfade */}
      <div className="absolute inset-0 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <RPGDialogue
              question={currentScene.question}
              choices={currentScene.choices}
              onChoice={handleChoice}
              xp={xp}
              progress={currentScene.progress}
              totalSteps={currentScene.totalSteps}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      {currentSceneId !== 'unlock' && (
        <button
          onClick={handleSkip}
          className="pointer-events-auto absolute right-6 top-6 z-40 glass rounded-full px-4 py-2 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          Skip Intro
        </button>
      )}

      {/* Unlock Animation */}
      <AnimatePresence>
        {currentSceneId === 'unlock' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass rounded-3xl px-12 py-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-4 text-6xl"
              >
                🚀
              </motion.div>
              <h3 className="mb-2 text-2xl font-semibold text-white">
                Access Granted
              </h3>
              <p className="text-white/70">
                Loading portfolio...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
