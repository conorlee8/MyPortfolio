'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HackingInterface from './HackingInterface';
import Scene from './Scene';
import Hero3D from './Hero3D';
import ScrollMinimap from './ScrollMinimap';
import ProjectBuilderModal from './ProjectBuilderModal';
import { usePath } from '@/contexts/PathContext';

interface GameHeroProps {
  onUnlock: () => void;
}

export default function GameHero({ onUnlock }: GameHeroProps) {
  const [showGame, setShowGame] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { selectedPath } = usePath();

  const handleGameComplete = () => {
    setShowGame(false);
    onUnlock(); // Notify parent that portfolio is unlocked
  };

  // Dramatically different content based on path
  const heroContent = selectedPath === 'freelance'
    ? {
        badge: '🚀 Available for Projects',
        title: 'Ship Your Product',
        highlight: 'Fast & Professional',
        description: 'From MVP to production in weeks. Modern stack, clean code, on-time delivery. Let\'s build something amazing together.',
        primaryCTA: 'Start Your Project',
        secondaryCTA: 'View Portfolio',
        accentGradient: 'from-green-500 to-emerald-400',
        glowColor: 'shadow-green-500/50',
      }
    : selectedPath === 'fulltime'
    ? {
        badge: '💼 Seeking Full-Time Role',
        title: 'Let\'s Build Together',
        highlight: 'As a Team',
        description: 'Experienced frontend developer & product-minded engineer. Ready to contribute, collaborate, and grow with your organization.',
        primaryCTA: 'Schedule Interview',
        secondaryCTA: 'Download Resume',
        accentGradient: 'from-red-500 to-rose-400',
        glowColor: 'shadow-red-500/50',
      }
    : {
        badge: 'Web Developer',
        title: 'Building',
        highlight: 'Modern Web Experiences',
        description: 'Freelance & full-time opportunities available. Modern stack, AI-assisted development, fast delivery.',
        primaryCTA: 'View My Work',
        secondaryCTA: 'Get in Touch',
        accentGradient: 'from-cyan-bright to-electric-purple',
        glowColor: 'shadow-cyan-bright/50',
      };

  return (
    <>
      {showGame ? (
        <HackingInterface onComplete={handleGameComplete} />
      ) : (
        <section className={`grain relative h-screen w-full overflow-hidden ${selectedPath ? 'bg-transparent' : 'bg-black'}`}>
          {/* Mesh Gradient Orbs - Only for browse/neutral mode (no path selected) */}
          {!selectedPath && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="mesh-orb mesh-orb-1 bg-gradient-to-br from-cyan-bright to-electric-purple"
                style={{
                  width: '700px',
                  height: '700px',
                  top: '-250px',
                  right: '-150px',
                }}
              />
              <div
                className="mesh-orb mesh-orb-2 bg-gradient-to-tr from-electric-purple to-indigo-600"
                style={{
                  width: '600px',
                  height: '600px',
                  bottom: '-200px',
                  left: '-150px',
                }}
              />
              <div
                className="mesh-orb mesh-orb-3 bg-gradient-to-br from-blue-500 to-cyan-bright"
                style={{
                  width: '500px',
                  height: '500px',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Dark gradient overlay for seamless blending */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
            </div>
          )}

          {/* 3D Background - Only for browse/neutral mode */}
          {!selectedPath && (
            <div className="absolute inset-0 z-0">
              <Scene>
                <Hero3D gameMode={false} />
              </Scene>
            </div>
          )}

          {/* Hero Content */}
          <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 sm:px-8">
            <div className="mx-auto w-full max-w-5xl text-center">
              <div className="mb-6 sm:mb-8">
                <span className="glass inline-block rounded-full px-4 py-2 text-xs font-medium tracking-wide text-white/90 sm:px-6 sm:text-sm">
                  {heroContent.badge}
                </span>
              </div>

              <h1 className="mb-4 text-5xl font-semibold leading-tight tracking-tight text-white sm:mb-6 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                {heroContent.title}
                <br />
                <span className={`gradient-text ${
                  selectedPath === 'freelance'
                    ? 'glow-green'
                    : selectedPath === 'fulltime'
                    ? 'glow-red'
                    : 'glow-cyan'
                }`}>{heroContent.highlight}</span>
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:mb-10 sm:text-xl md:text-2xl">
                {heroContent.description}
              </p>

              <div className="relative z-20 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                {selectedPath === 'freelance' ? (
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className={`glass-gradient-button group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r ${heroContent.accentGradient} px-10 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 sm:w-auto sm:px-12 sm:py-4 sm:text-lg`}
                  >
                    <span className="relative z-10">{heroContent.primaryCTA}</span>
                  </button>
                ) : (
                  <a
                    href={selectedPath === 'fulltime' ? '#contact' : '#work'}
                    className={`glass-gradient-button group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r ${heroContent.accentGradient} px-10 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 sm:w-auto sm:px-12 sm:py-4 sm:text-lg`}
                  >
                    <span className="relative z-10">{heroContent.primaryCTA}</span>
                  </a>
                )}
                <a
                  href={selectedPath === 'freelance' ? '#work' : '#contact'}
                  className="glass-button inline-flex w-full items-center justify-center rounded-full px-10 py-4 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 sm:w-auto sm:px-12 sm:py-4 sm:text-lg"
                >
                  {heroContent.secondaryCTA}
                </a>
              </div>
            </div>

            {/* Canvas Minimap Scroll Indicator */}
            <ScrollMinimap />
          </div>
        </section>
      )}

      {/* Project Builder Modal for Freelance */}
      <ProjectBuilderModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
    </>
  );
}
