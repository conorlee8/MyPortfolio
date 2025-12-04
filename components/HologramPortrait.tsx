'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface HologramPortraitProps {
  src: string;
  alt: string;
  variant?: 'freelance' | 'fulltime' | 'default';
}

interface DataPoint {
  id: number;
  angle: number;
  distance: number;
  label: string;
  value: string;
}

export default function HologramPortrait({ src, alt, variant = 'default' }: HologramPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    commits: 0,
    experience: 0,
    clients: 0,
  });

  // Variant-specific colors
  const variantStyles = {
    freelance: {
      primary: 'rgba(34, 197, 94, 1)',
      secondary: 'rgba(34, 197, 94, 0.6)',
      glow: 'rgba(34, 197, 94, 0.3)',
    },
    fulltime: {
      primary: 'rgba(239, 68, 68, 1)',
      secondary: 'rgba(239, 68, 68, 0.6)',
      glow: 'rgba(239, 68, 68, 0.3)',
    },
    default: {
      primary: 'rgba(6, 182, 212, 1)',
      secondary: 'rgba(6, 182, 212, 0.6)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
  };

  const colors = variantStyles[variant];

  // Floating data points
  const [dataPoints] = useState<DataPoint[]>([
    { id: 1, angle: 0, distance: 200, label: 'STATUS', value: 'ACTIVE' },
    { id: 2, angle: 90, distance: 220, label: 'LEVEL', value: 'EXPERT' },
    { id: 3, angle: 180, distance: 200, label: 'MODE', value: 'DEV' },
    { id: 4, angle: 270, distance: 220, label: 'STACK', value: 'FULL' },
  ]);

  // Animate stats on mount
  useEffect(() => {
    const targets = {
      projects: variant === 'freelance' ? 50 : 25,
      commits: variant === 'freelance' ? 2500 : 5000,
      experience: 5,
      clients: variant === 'freelance' ? 30 : 15,
    };

    const animateValue = (key: keyof typeof stats, target: number) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    };

    animateValue('projects', targets.projects);
    animateValue('commits', targets.commits);
    animateValue('experience', targets.experience);
    animateValue('clients', targets.clients);
  }, [variant]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Canvas scan lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 450;
    const height = 600;
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(2, 2);

    let scanY = 0;

    const drawScanLines = () => {
      ctx.clearRect(0, 0, width, height);

      // Horizontal scan lines
      for (let i = 0; i < height; i += 4) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Moving scan line
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = colors.glow;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      scanY += 2;
      if (scanY > height) scanY = 0;

      requestAnimationFrame(drawScanLines);
    };

    drawScanLines();
  }, [colors]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      {/* Main hologram container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Corner brackets */}
        {[
          { top: -4, left: -4, rotate: 0 },
          { top: -4, right: -4, rotate: 90 },
          { bottom: -4, right: -4, rotate: 180 },
          { bottom: -4, left: -4, rotate: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8"
            style={{
              ...pos,
              borderTop: `2px solid ${colors.primary}`,
              borderLeft: `2px solid ${colors.primary}`,
              rotate: pos.rotate,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Main image container with RGB split */}
        <div className="relative h-[600px] w-[450px] overflow-hidden rounded-lg">
          {/* Canvas scan lines overlay */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
            style={{ width: 450, height: 600 }}
          />

          {/* RGB Split layers */}
          <div className="absolute inset-0">
            {/* Red channel */}
            <motion.div
              className="absolute inset-0 mix-blend-screen"
              style={{ filter: 'brightness(1.2)' }}
              animate={
                glitchActive
                  ? {
                      x: [-3, 3, -2, 2, 0],
                      opacity: [0.8, 0.6, 0.8, 0.6, 0.8],
                    }
                  : {
                      x: isHovered ? 2 : 0,
                      opacity: 0.8,
                    }
              }
              transition={{ duration: 0.1 }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                style={{
                  filter: 'sepia(1) hue-rotate(315deg) saturate(3)',
                  mixBlendMode: 'screen',
                }}
                sizes="450px"
                quality={95}
              />
            </motion.div>

            {/* Green channel */}
            <motion.div
              className="absolute inset-0 mix-blend-screen"
              animate={
                glitchActive
                  ? {
                      x: [2, -2, 3, -3, 0],
                      opacity: [0.7, 0.9, 0.7, 0.9, 0.7],
                    }
                  : {
                      x: 0,
                      opacity: 0.7,
                    }
              }
              transition={{ duration: 0.1 }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                style={{
                  filter: 'sepia(1) hue-rotate(60deg) saturate(3)',
                  mixBlendMode: 'screen',
                }}
                sizes="450px"
                quality={95}
              />
            </motion.div>

            {/* Blue channel */}
            <motion.div
              className="absolute inset-0 mix-blend-screen"
              animate={
                glitchActive
                  ? {
                      x: [3, -3, 2, -2, 0],
                      y: [2, -2, 0],
                      opacity: [0.6, 0.8, 0.6, 0.8, 0.6],
                    }
                  : {
                      x: isHovered ? -2 : 0,
                      opacity: 0.6,
                    }
              }
              transition={{ duration: 0.1 }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                style={{
                  filter: 'sepia(1) hue-rotate(180deg) saturate(3)',
                  mixBlendMode: 'screen',
                }}
                sizes="450px"
                quality={95}
              />
            </motion.div>

            {/* Base image */}
            <div className="absolute inset-0">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top opacity-40"
                sizes="450px"
                quality={95}
              />
            </div>
          </div>

          {/* Hologram flicker overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-0"
            animate={{
              opacity: [0, 0.1, 0],
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Glitch bars */}
          {glitchActive && (
            <>
              <div
                className="absolute left-0 right-0 h-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"
                style={{ top: `${Math.random() * 80}%` }}
              />
              <div
                className="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
                style={{ top: `${Math.random() * 80}%` }}
              />
            </>
          )}
        </div>

        {/* Floating data points */}
        {dataPoints.map((point) => {
          const x = Math.cos((point.angle * Math.PI) / 180) * point.distance;
          const y = Math.sin((point.angle * Math.PI) / 180) * point.distance;

          return (
            <motion.div
              key={point.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x,
                y,
              }}
              transition={{
                delay: point.id * 0.2,
                duration: 0.5,
              }}
            >
              {/* Connection line */}
              <svg
                className="absolute left-0 top-0"
                style={{
                  width: Math.abs(x),
                  height: Math.abs(y),
                  transform: `translate(${x > 0 ? '-100%' : '0'}, ${y > 0 ? '-100%' : '0'})`,
                }}
              >
                <motion.line
                  x1={x > 0 ? '100%' : '0'}
                  y1={y > 0 ? '100%' : '0'}
                  x2={x > 0 ? '0' : '100%'}
                  y2={y > 0 ? '0' : '100%'}
                  stroke={colors.secondary}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: point.id * 0.2 }}
                />
              </svg>

              {/* Data point */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="rounded border px-3 py-1.5 font-mono text-xs backdrop-blur-md"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    boxShadow: `0 0 10px ${colors.glow}`,
                  }}
                >
                  <div
                    className="font-bold"
                    style={{ color: colors.primary }}
                  >
                    {point.label}
                  </div>
                  <div className="text-white/70">{point.value}</div>
                </div>
                {/* Pulsing dot */}
                <motion.div
                  className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Terminal stats overlay */}
        <motion.div
          className="absolute -bottom-16 left-0 right-0 overflow-hidden rounded border bg-black/90 p-4 font-mono backdrop-blur-md"
          style={{
            borderColor: colors.primary,
            boxShadow: `0 0 20px ${colors.glow}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <motion.div
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {stats.projects}+
              </motion.div>
              <div className="text-xs text-white/50">PROJECTS</div>
            </div>
            <div>
              <motion.div
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {stats.commits}+
              </motion.div>
              <div className="text-xs text-white/50">COMMITS</div>
            </div>
            <div>
              <motion.div
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {stats.experience}+
              </motion.div>
              <div className="text-xs text-white/50">YRS EXP</div>
            </div>
            <div>
              <motion.div
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {stats.clients}+
              </motion.div>
              <div className="text-xs text-white/50">
                {variant === 'freelance' ? 'CLIENTS' : 'TEAMS'}
              </div>
            </div>
          </div>

          {/* Scrolling code effect */}
          <motion.div
            className="mt-2 overflow-hidden text-xs opacity-30"
            style={{ color: colors.primary }}
          >
            <motion.div
              animate={{ x: [0, -200] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {'> EXECUTING_PROTOCOL.SH ... SUCCESS [ OK ] STATUS: READY_FOR_DEPLOYMENT ... '.repeat(
                5
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
