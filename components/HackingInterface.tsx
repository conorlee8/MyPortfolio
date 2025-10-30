'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePath } from '@/contexts/PathContext';

interface HackingInterfaceProps {
  onComplete: () => void;
}

type PathType = 'freelance' | 'fulltime' | null;

const CODE_PARTICLES_FREELANCE = [
  'init()',
  'build()',
  'deploy()',
  'compile()',
  'optimize()',
  'bundle()',
  'test()',
  'push()',
];

const CODE_PARTICLES_FULLTIME = [
  'setup()',
  'configure()',
  'authenticate()',
  'initialize()',
  'connect()',
  'sync()',
  'validate()',
  'load()',
];

export default function HackingInterface({ onComplete }: HackingInterfaceProps) {
  const { setSelectedPath: setContextPath } = usePath();
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [hoveredPath, setHoveredPath] = useState<PathType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; path: PathType; code: string }>>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Generate flowing particles
  useEffect(() => {
    if (selectedPath) return;

    const interval = setInterval(() => {
      const path = Math.random() > 0.5 ? 'freelance' : 'fulltime';
      const codeArray = path === 'freelance' ? CODE_PARTICLES_FREELANCE : CODE_PARTICLES_FULLTIME;
      const code = codeArray[Math.floor(Math.random() * codeArray.length)];

      setParticles((prev) => [
        ...prev.slice(-15),
        { id: Date.now() + Math.random(), path, code },
      ]);
    }, hoveredPath ? 300 : 600);

    return () => clearInterval(interval);
  }, [hoveredPath, selectedPath]);

  // Loading progress animation
  useEffect(() => {
    if (!isTransitioning) return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  const handlePathClick = (path: PathType) => {
    setSelectedPath(path);
    setContextPath(path); // Set in global context
    setIsTransitioning(true);
    setLoadingProgress(0);
    setTimeout(() => onComplete(), 2500);
  };

  const pathConfig = {
    freelance: {
      title: 'Project Work',
      subtitle: 'Contract Development',
      gradient: 'from-green-500 to-emerald-400',
      glowColor: 'rgba(34, 197, 94, 0.6)',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    fulltime: {
      title: 'Full-Time',
      subtitle: 'Hire Me',
      gradient: 'from-red-500 to-rose-400',
      glowColor: 'rgba(239, 68, 68, 0.6)',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
  };

  const selectedConfig = selectedPath ? pathConfig[selectedPath] : null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col items-center justify-center p-4"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20 text-center"
            >
              <h2 className="mb-4 font-mono text-5xl font-bold text-white sm:text-7xl">
                Select Mode
              </h2>
              <p className="font-mono text-base text-cyan-400/70 sm:text-xl">
                Choose how you'd like to work together
              </p>
            </motion.div>

            {/* Central System Container */}
            <div className="relative flex w-full max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row">
              {/* Left Option - Freelance */}
              <motion.div
                className="relative w-full max-w-md"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative h-full">
                  {/* Data Stream - Hidden on mobile */}
                  <svg
                    className="absolute left-full top-1/2 hidden h-1 w-24 -translate-y-1/2 lg:block"
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                  >
                    <motion.line
                      x1="0"
                      y1="2"
                      x2="100"
                      y2="2"
                      stroke="rgba(34, 197, 94, 0.4)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: hoveredPath === 'freelance' ? 1 : 0.5,
                        stroke: hoveredPath === 'freelance' ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 0.4)'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>

                  {/* Flowing Particles - Hidden on mobile */}
                  <div className="absolute left-full top-1/2 hidden h-1 w-24 lg:block">
                    {particles
                      .filter((p) => p.path === 'freelance')
                      .map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] text-green-400"
                          initial={{ x: 0, y: -8, opacity: 0 }}
                          animate={{
                            x: 96,
                            y: -8,
                            opacity: [0, 1, 0]
                          }}
                          transition={{ duration: 1.5, ease: "linear" }}
                          onAnimationComplete={() => {
                            setParticles((prev) => prev.filter((p) => p.id !== particle.id));
                          }}
                        >
                          {particle.code}
                        </motion.div>
                      ))}
                  </div>

                  {/* Button Card */}
                  <motion.button
                    onClick={() => handlePathClick('freelance')}
                    onHoverStart={() => setHoveredPath('freelance')}
                    onHoverEnd={() => setHoveredPath(null)}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-green-500/20 bg-black/60 p-8 backdrop-blur-sm transition-all hover:border-green-500/50"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      boxShadow:
                        hoveredPath === 'freelance'
                          ? '0 0 40px rgba(34, 197, 94, 0.3)'
                          : '0 0 0px rgba(34, 197, 94, 0)',
                    }}
                  >
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-green-400/50">
                          Option 01
                        </span>
                        <motion.div
                          className="h-2 w-2 rounded-full bg-green-400"
                          animate={{
                            opacity: hoveredPath === 'freelance' ? [1, 0.3, 1] : 0.3
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>

                      <h3 className="mb-3 font-mono text-3xl font-bold text-green-400 sm:text-4xl">
                        {pathConfig.freelance.title}
                      </h3>
                      <p className="mb-6 font-mono text-sm text-white/50 sm:text-base">
                        {pathConfig.freelance.subtitle}
                      </p>

                      <div className="flex items-center gap-2 font-mono text-xs text-green-400/70">
                        <span>Initialize</span>
                        <motion.span
                          animate={{ x: hoveredPath === 'freelance' ? [0, 4, 0] : 0 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>

                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Central System Core */}
              <motion.div
                className="relative z-20 hidden lg:block"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
              >
                <div className="relative h-32 w-32">
                  {/* Rotating Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-400/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full border border-purple-400/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-6 rounded-full border border-blue-400/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Core */}
                  <motion.div
                    className="absolute inset-10 rounded-full bg-gradient-to-br from-cyan-500/40 via-blue-500/40 to-purple-500/40"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Center Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="h-3 w-3 rounded-full bg-white"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right Option - Full-time */}
              <motion.div
                className="relative w-full max-w-md"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative h-full">
                  {/* Data Stream - Hidden on mobile */}
                  <svg
                    className="absolute right-full top-1/2 hidden h-1 w-24 -translate-y-1/2 lg:block"
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                  >
                    <motion.line
                      x1="0"
                      y1="2"
                      x2="100"
                      y2="2"
                      stroke="rgba(239, 68, 68, 0.4)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: hoveredPath === 'fulltime' ? 1 : 0.5,
                        stroke: hoveredPath === 'fulltime' ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.4)'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>

                  {/* Flowing Particles - Hidden on mobile */}
                  <div className="absolute right-full top-1/2 hidden h-1 w-24 lg:block">
                    {particles
                      .filter((p) => p.path === 'fulltime')
                      .map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute right-0 top-0 whitespace-nowrap font-mono text-[10px] text-red-400"
                          initial={{ x: 0, y: -8, opacity: 0 }}
                          animate={{
                            x: -96,
                            y: -8,
                            opacity: [0, 1, 0]
                          }}
                          transition={{ duration: 1.5, ease: "linear" }}
                          onAnimationComplete={() => {
                            setParticles((prev) => prev.filter((p) => p.id !== particle.id));
                          }}
                        >
                          {particle.code}
                        </motion.div>
                      ))}
                  </div>

                  {/* Button Card */}
                  <motion.button
                    onClick={() => handlePathClick('fulltime')}
                    onHoverStart={() => setHoveredPath('fulltime')}
                    onHoverEnd={() => setHoveredPath(null)}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-red-500/20 bg-black/60 p-8 backdrop-blur-sm transition-all hover:border-red-500/50"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      boxShadow:
                        hoveredPath === 'fulltime'
                          ? '0 0 40px rgba(239, 68, 68, 0.3)'
                          : '0 0 0px rgba(239, 68, 68, 0)',
                    }}
                  >
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-red-400/50">
                          Option 02
                        </span>
                        <motion.div
                          className="h-2 w-2 rounded-full bg-red-400"
                          animate={{
                            opacity: hoveredPath === 'fulltime' ? [1, 0.3, 1] : 0.3
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>

                      <h3 className="mb-3 font-mono text-3xl font-bold text-red-400 sm:text-4xl">
                        {pathConfig.fulltime.title}
                      </h3>
                      <p className="mb-6 font-mono text-sm text-white/50 sm:text-base">
                        {pathConfig.fulltime.subtitle}
                      </p>

                      <div className="flex items-center gap-2 font-mono text-xs text-red-400/70">
                        <motion.span
                          animate={{ x: hoveredPath === 'fulltime' ? [0, -4, 0] : 0 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ←
                        </motion.span>
                        <span>Initialize</span>
                      </div>
                    </div>

                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Skip Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              className="mt-16 font-mono text-xs text-white/20 transition-colors hover:text-white/50 sm:text-sm"
            >
              Skip
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Loading Transition */}
      <AnimatePresence>
        {isTransitioning && selectedConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="w-full max-w-2xl px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Status Text */}
                <motion.div className="mb-8 text-center">
                  <h3 className={`mb-2 font-mono text-3xl font-bold ${selectedConfig.textColor} sm:text-5xl`}>
                    Initializing
                  </h3>
                  <p className="font-mono text-sm text-white/40 sm:text-base">
                    Loading portfolio system
                  </p>
                </motion.div>

                {/* Progress Container */}
                <div className="space-y-4">
                  {/* Main Progress Bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${selectedConfig.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.1 }}
                      style={{
                        boxShadow: `0 0 20px ${selectedConfig.glowColor}`,
                      }}
                    />
                  </div>

                  {/* System Messages */}
                  <motion.div
                    className="space-y-2 font-mono text-xs text-white/30 sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: loadingProgress > 20 ? 1 : 0.3, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      → System initialized
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: loadingProgress > 50 ? 1 : 0.3, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      → Loading components
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: loadingProgress > 80 ? 1 : 0.3, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      → Establishing connection
                    </motion.div>
                  </motion.div>

                  {/* Percentage */}
                  <motion.div
                    className={`text-center font-mono text-lg font-bold ${selectedConfig.textColor}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {Math.round(loadingProgress)}%
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
