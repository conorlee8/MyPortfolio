'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SkillGroup } from '@/data/portfolioContent';

interface SkillsShowcaseProps {
  skillGroups: SkillGroup[];
  variant?: 'default' | 'freelance' | 'fulltime';
}

// Magnetic card with 3D parallax depth
const MagneticSkillCard = ({
  group,
  index
}: {
  group: SkillGroup;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic interaction (for cursor pull)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Smooth mouse movement for parallax
  const smoothMouseX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothMouseY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  // 3D rotation based on mouse
  const rotateX = useTransform(smoothMouseY, [-20, 20], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-20, 20], [-6, 6]);

  // Multi-layer parallax depths
  const bgX = useTransform(smoothMouseX, [-20, 20], [-25, 25]);
  const bgY = useTransform(smoothMouseY, [-20, 20], [-25, 25]);

  const midX = useTransform(smoothMouseX, [-20, 20], [-12, 12]);
  const midY = useTransform(smoothMouseY, [-20, 20], [-12, 12]);

  const frontX = useTransform(smoothMouseX, [-20, 20], [-4, 4]);
  const frontY = useTransform(smoothMouseY, [-20, 20], [-4, 4]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Parallax effect (relative to card center)
      const relX = e.clientX - centerX;
      const relY = e.clientY - centerY;
      const normalizedX = (relX / rect.width) * 40;
      const normalizedY = (relY / rect.height) * 40;

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);

      // Magnetic pull effect
      const distance = Math.sqrt(relX * relX + relY * relY);
      const magneticRange = 180;

      if (distance < magneticRange) {
        const strength = (1 - distance / magneticRange) * 8;
        x.set(relX * strength * 0.008);
        y.set(relY * strength * 0.008);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      x.set(0);
      y.set(0);
    };

    const card = ref.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isMobile, mouseX, mouseY, x, y]);

  return (
    <motion.div
      ref={ref}
      style={isMobile ? {} : {
        x: xSpring,
        y: ySpring,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative"
    >
      <motion.div
        style={isMobile ? {} : {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-2xl"
      >
        {/* Background Layer (deepest) - Animated gradient */}
        <motion.div
          style={isMobile ? {} : {
            x: bgX,
            y: bgY,
            translateZ: -30,
          }}
          className="absolute inset-0 opacity-30"
        >
          <div
            className={`h-full w-full bg-gradient-to-br ${group.accent} to-transparent`}
            style={{
              filter: 'blur(40px)',
            }}
          />
        </motion.div>

        {/* Glassmorphic card base */}
        <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8">
          {/* Holographic shimmer overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,0,255,0.4) 0%, rgba(0,255,255,0.4) 25%, rgba(255,255,0,0.4) 50%, rgba(0,255,0,0.4) 75%, rgba(255,0,255,0.4) 100%)',
              backgroundSize: '300% 300%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Accent line at top */}
          <motion.div
            style={isMobile ? {} : {
              x: midX,
              y: midY,
              translateZ: 20,
            }}
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${group.accent} to-transparent`}
          />

          {/* Border glow on hover */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${group.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40`} />

          {/* Content Layer (middle depth) */}
          <motion.div
            style={isMobile ? {} : {
              x: midX,
              y: midY,
              translateZ: 15,
            }}
            className="relative space-y-5"
          >
            {/* Category title */}
            <div className="flex items-center gap-3">
              <div className={`h-10 w-1 rounded-full bg-gradient-to-b ${group.accent}`} />
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {group.category}
              </h3>
            </div>

            {/* Skills list with proficiency indicators */}
            <motion.ul
              style={isMobile ? {} : {
                x: frontX,
                y: frontY,
                translateZ: 30,
              }}
              className="space-y-3"
            >
              {group.skills.map((skill, i) => {
                // Calculate proficiency level (0-100) from relevance
                const proficiency = Math.round((skill.relevance.freelance + skill.relevance.fulltime) / 4 * 100);

                return (
                  <li key={i} className="group/skill relative">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base text-white/90 transition-colors group-hover/skill:text-white sm:text-lg">
                        {skill.name}
                      </span>

                      {/* Animated proficiency level */}
                      <div className="relative">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 + i * 0.05 }}
                          className="text-sm font-semibold text-white/60 transition-colors group-hover/skill:text-white/90"
                        >
                          {proficiency}%
                        </motion.span>

                        {/* Particle glow effect on hover */}
                        <motion.div
                          className={`absolute -inset-2 rounded-full bg-gradient-to-r ${group.accent} opacity-0 blur-md transition-opacity group-hover/skill:opacity-50`}
                        />
                      </div>
                    </div>

                    {/* Animated progress bar */}
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.08 + i * 0.05,
                          duration: 0.8,
                          ease: 'easeOut'
                        }}
                        className={`h-full bg-gradient-to-r ${group.accent} relative`}
                      >
                        {/* Shimmer effect on bar */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: index * 0.08 + i * 0.05 + 0.8,
                          }}
                        />
                      </motion.div>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function SkillsShowcase({ skillGroups, variant = 'default' }: SkillsShowcaseProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 sm:gap-8 sm:px-8 lg:grid-cols-4">
      {skillGroups.map((group, index) => (
        <MagneticSkillCard
          key={group.category}
          group={group}
          index={index}
        />
      ))}
    </div>
  );
}
