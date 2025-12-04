'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  image?: string;
  linkedIn?: string;
}

interface TestimonialsCarouselProps {
  variant?: 'freelance' | 'fulltime' | 'default';
}

export default function TestimonialsCarousel({ variant = 'default' }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  // Variant colors
  const variantColors = {
    freelance: {
      primary: '#22c55e',
      secondary: '#10b981',
      text: 'text-green-400',
      gradient: 'from-green-500 to-emerald-400',
    },
    fulltime: {
      primary: '#ef4444',
      secondary: '#dc2626',
      text: 'text-red-400',
      gradient: 'from-red-500 to-rose-400',
    },
    default: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      text: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-400',
    },
  };

  const colors = variantColors[variant];

  // Testimonials data from LinkedIn
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Adi Dass',
      role: 'Business Expansion | GTM Strategy',
      company: 'Former Manager',
      text: 'Conor has a natural product mindset. He\'s exceptional at taking ambiguity and turning it into a clear plan, aligning teams, and moving projects forward. He\'s deeply attuned to customer needs and consistently balanced internal priorities with real-world user feedback, delivering results that truly stuck.',
      linkedIn: 'https://www.linkedin.com/in/adidass',
    },
    {
      id: 2,
      name: 'Edmund Read',
      role: 'CCO @ UFOFLEET',
      company: 'Former Manager',
      text: 'Conor is one of those people you can throw into almost anything - product launches, client handoffs, internal fixes - and trust that it\'ll get done right. He\'s sharp, resourceful, and has a great sense for balancing customer needs with the realities of execution. Highly recommended.',
      linkedIn: 'https://www.linkedin.com/in/edmundread',
    },
    {
      id: 3,
      name: 'Eve Lyons, MBA',
      role: 'Technical PM | SaaS Growth',
      company: 'Industry Colleague',
      text: 'Conor brings a strong problem-solving mindset, a passion for building scalable solutions, and a knack for crafting intuitive user experiences. What sets him apart is his eagerness to learn and adapt—he\'s always refining his skills and staying ahead of industry trends.',
      linkedIn: 'https://www.linkedin.com/in/evelyons',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  // Enhanced mouse move for holographic depth effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  };

  // Multi-layer depth transforms
  const rotateX = useTransform(smoothMouseY, [-20, 20], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-20, 20], [-8, 8]);

  // Background layer (moves more)
  const bgX = useTransform(smoothMouseX, [-20, 20], [-30, 30]);
  const bgY = useTransform(smoothMouseY, [-20, 20], [-30, 30]);

  // Middle layer (moderate movement)
  const midX = useTransform(smoothMouseX, [-20, 20], [-15, 15]);
  const midY = useTransform(smoothMouseY, [-20, 20], [-15, 15]);

  // Front layer (subtle movement)
  const frontX = useTransform(smoothMouseX, [-20, 20], [-5, 5]);
  const frontY = useTransform(smoothMouseY, [-20, 20], [-5, 5]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative" ref={containerRef}>
      {/* Holographic Depth Card */}
      <div
        className="relative min-h-[500px]"
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTestimonial.id}
            initial={{ opacity: 0, scale: 0.85, z: -200 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            exit={{ opacity: 0, scale: 0.85, z: -200 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative"
          >
            {/* Main Card Container with Depth */}
            <div
              className="glass-gradient-button relative overflow-hidden rounded-3xl p-8 sm:p-12"
              style={{
                boxShadow: `0 30px 60px -15px ${colors.primary}50, 0 0 0 1px ${colors.primary}20`,
                transform: 'translateZ(0px)',
              }}
            >
              {/* LAYER 1: Background Depth Layer (moves most) */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ x: bgX, y: bgY, transform: 'translateZ(-80px)' }}
              >
                <motion.div
                  className="absolute inset-0 opacity-15"
                  animate={{
                    background: [
                      `radial-gradient(circle at 20% 50%, ${colors.primary} 0%, transparent 50%)`,
                      `radial-gradient(circle at 80% 50%, ${colors.secondary} 0%, transparent 50%)`,
                      `radial-gradient(circle at 20% 50%, ${colors.primary} 0%, transparent 50%)`,
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* Holographic Shimmer Overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(125deg, rgba(255,0,255,0.3) 0%, rgba(0,255,255,0.3) 15%, rgba(255,255,0,0.3) 30%, rgba(0,255,0,0.3) 45%, rgba(0,0,255,0.3) 60%, rgba(255,0,128,0.3) 75%, rgba(255,0,255,0.3) 100%)',
                  backgroundSize: '400% 400%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Glare effect that follows mouse */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-30 transition-opacity"
                style={{
                  background: `radial-gradient(circle 200px at ${smoothMouseX}px ${smoothMouseY}px, ${colors.primary}40, transparent 70%)`,
                }}
              />

              {/* LAYER 2: Quote Mark Depth Layer (moderate movement) */}
              <motion.div
                className={`absolute left-8 top-8 text-7xl sm:text-8xl opacity-10 ${colors.text} font-serif`}
                style={{ x: midX, y: midY, transform: 'translateZ(-40px)' }}
                animate={{ rotate: [0, 3, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                "
              </motion.div>

              {/* LAYER 3: Content Front Layer (subtle movement) */}
              <motion.div
                className="relative z-10"
                style={{ x: frontX, y: frontY, transform: 'translateZ(20px)' }}
              >
                {/* Quote Text */}
                <motion.p
                  className="mb-8 text-xl leading-relaxed text-white sm:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  "{currentTestimonial.text}"
                </motion.p>

                {/* Author Info */}
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Avatar with Holographic Ring */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.15 }}
                  >
                    {/* Holographic ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
                        padding: '3px',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="h-full w-full rounded-full bg-black" />
                    </motion.div>
                    {/* Avatar */}
                    <div className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                      <div className="text-2xl font-bold text-white">
                        {currentTestimonial.name.charAt(0)}
                      </div>
                    </div>
                  </motion.div>

                  {/* Name & Role */}
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-sm text-white/60">
                      {currentTestimonial.role} • {currentTestimonial.company}
                    </div>
                    {currentTestimonial.linkedIn && (
                      <a
                        href={currentTestimonial.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs ${colors.text} hover:underline`}
                      >
                        View LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Holographic Decorative Orbs with Depth */}
              <motion.div
                className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 blur-2xl"
                style={{
                  backgroundColor: colors.primary,
                  transform: 'translateZ(-60px)',
                  x: midX,
                  y: midY,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-20 blur-xl"
                style={{
                  backgroundColor: colors.secondary,
                  transform: 'translateZ(-60px)',
                  x: bgX,
                  y: bgY,
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Floating particles */}
              <motion.div
                className="absolute top-1/4 right-1/4 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  transform: 'translateZ(40px)',
                  boxShadow: `0 0 20px ${colors.primary}`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: colors.secondary,
                  transform: 'translateZ(40px)',
                  boxShadow: `0 0 15px ${colors.secondary}`,
                }}
                animate={{
                  x: [-15, 15, -15],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Outer ring */}
            <div
              className={`h-12 w-12 rounded-full border-2 transition-all ${
                index === currentIndex
                  ? 'border-white/60'
                  : 'border-white/20'
              }`}
            >
              {/* Inner dot */}
              <div className="flex h-full w-full items-center justify-center">
                <motion.div
                  className="rounded-full transition-all"
                  style={{ backgroundColor: colors.primary }}
                  animate={{
                    width: index === currentIndex ? '24px' : '8px',
                    height: index === currentIndex ? '24px' : '8px',
                  }}
                />
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 w-max -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="glass-button rounded px-3 py-1 text-xs text-white">
                {testimonials[index].name}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      {!isPaused && (
        <motion.div
          className="mt-6 h-1 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.gradient}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            key={currentIndex}
          />
        </motion.div>
      )}

      {/* Navigation Arrows */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <motion.button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className={`glass-button rounded-full p-3 ${colors.text} transition-all hover:scale-110`}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
          className={`glass-button rounded-full p-3 ${colors.text} transition-all hover:scale-110`}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-xs text-white/40"
        >
          Paused • Hover out to resume
        </motion.div>
      )}
    </div>
  );
}
