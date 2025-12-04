'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MicroWorldButtonProps {
  onClick: () => void;
  label: string;
  accentGradient: string;
  pathType: 'freelance' | 'fulltime' | 'default';
}

export default function MicroWorldButton({
  onClick,
  label,
  accentGradient,
  pathType,
}: MicroWorldButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 320 * dpr;
    canvas.height = 80 * dpr;
    ctx.scale(dpr, dpr);

    const width = 320;
    const height = 80;

    // Color schemes based on path
    const colorScheme = pathType === 'freelance'
      ? { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' }
      : pathType === 'fulltime'
      ? { primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5' }
      : { primary: '#00f5ff', secondary: '#7c3aed', accent: '#a78bfa' };

    // Buildings configuration
    interface Building {
      x: number;
      baseY: number;
      width: number;
      height: number;
      windows: { x: number; y: number; lit: boolean }[];
      antenna: boolean;
    }

    // Micro people
    interface Person {
      x: number;
      y: number;
      speed: number;
      direction: number;
    }

    // Flying drones/vehicles
    interface Drone {
      x: number;
      y: number;
      speed: number;
      size: number;
      trail: { x: number; y: number; alpha: number }[];
    }

    // Particles (data streams rising)
    interface Particle {
      x: number;
      y: number;
      speed: number;
      alpha: number;
      size: number;
    }

    // Create buildings - futuristic skyline across the button
    const buildings: Building[] = [];
    const groundY = height - 8;

    // Building positions to create interesting skyline
    const buildingConfigs = [
      { x: 5, w: 12, h: 35 },
      { x: 20, w: 8, h: 25 },
      { x: 32, w: 15, h: 45 },
      { x: 52, w: 10, h: 30 },
      { x: 65, w: 8, h: 20 },
      { x: 78, w: 14, h: 40 },
      { x: 95, w: 10, h: 28 },
      { x: 110, w: 12, h: 38 },
      { x: 125, w: 8, h: 22 },
      { x: 140, w: 16, h: 48 },
      { x: 160, w: 10, h: 32 },
      { x: 175, w: 12, h: 42 },
      { x: 190, w: 8, h: 26 },
      { x: 205, w: 14, h: 38 },
      { x: 222, w: 10, h: 30 },
      { x: 238, w: 12, h: 44 },
      { x: 255, w: 8, h: 24 },
      { x: 270, w: 15, h: 40 },
      { x: 290, w: 10, h: 32 },
      { x: 305, w: 8, h: 28 },
    ];

    buildingConfigs.forEach((config) => {
      const windows: Building['windows'] = [];
      const windowRows = Math.floor(config.h / 5);
      const windowCols = Math.floor(config.w / 3);

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          windows.push({
            x: col * 3 + 1,
            y: row * 5 + 3,
            lit: Math.random() > 0.4,
          });
        }
      }

      buildings.push({
        x: config.x,
        baseY: groundY,
        width: config.w,
        height: config.h,
        windows,
        antenna: Math.random() > 0.6,
      });
    });

    // Create people
    const people: Person[] = [];
    for (let i = 0; i < 15; i++) {
      people.push({
        x: Math.random() * width,
        y: groundY + 1 + Math.random() * 3,
        speed: 0.1 + Math.random() * 0.2,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Create drones
    const drones: Drone[] = [];
    for (let i = 0; i < 6; i++) {
      drones.push({
        x: Math.random() * width,
        y: 5 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.4,
        size: 1.5 + Math.random(),
        trail: [],
      });
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.5,
        alpha: 0.2 + Math.random() * 0.5,
        size: 1 + Math.random(),
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Background - dark gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#050510');
      bgGradient.addColorStop(0.5, '#0a0a18');
      bgGradient.addColorStop(1, '#0f0f20');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Animated scan line effect
      const scanY = (time * 0.5) % height;
      ctx.fillStyle = colorScheme.primary + '10';
      ctx.fillRect(0, scanY, width, 2);

      // Rising particles (data streams)
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = colorScheme.primary;
        ctx.globalAlpha = p.alpha * (isHovered ? 0.8 : 0.4);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw buildings
      buildings.forEach((building) => {
        const bY = building.baseY - building.height;

        // Building shadow/glow when hovered
        if (isHovered) {
          ctx.shadowColor = colorScheme.primary;
          ctx.shadowBlur = 8;
        }

        // Building body
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(building.x, bY, building.width, building.height);

        // Building outline glow
        ctx.strokeStyle = colorScheme.primary + '40';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(building.x, bY, building.width, building.height);

        ctx.shadowBlur = 0;

        // Windows with flicker
        building.windows.forEach((window) => {
          // Occasional flicker
          if (Math.random() < 0.003) {
            window.lit = !window.lit;
          }

          if (window.lit) {
            const flickerAlpha = 0.5 + Math.sin(time * 0.03 + window.x * 0.5) * 0.3;
            ctx.fillStyle = colorScheme.primary;
            ctx.globalAlpha = flickerAlpha * (isHovered ? 1.2 : 0.8);
            ctx.fillRect(
              building.x + window.x,
              bY + window.y,
              1.5,
              2.5
            );
            ctx.globalAlpha = 1;
          }
        });

        // Antenna on some buildings
        if (building.antenna) {
          ctx.strokeStyle = colorScheme.secondary;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(building.x + building.width / 2, bY);
          ctx.lineTo(building.x + building.width / 2, bY - 5);
          ctx.stroke();

          // Blinking light on antenna
          if (Math.sin(time * 0.05 + building.x) > 0.5) {
            ctx.beginPath();
            ctx.fillStyle = colorScheme.accent;
            ctx.arc(building.x + building.width / 2, bY - 5, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Ground line with glow
      ctx.strokeStyle = colorScheme.primary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = isHovered ? 0.8 : 0.4;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Micro people walking
      people.forEach((person) => {
        person.x += person.speed * person.direction;

        // Wrap around
        if (person.x > width + 5) {
          person.x = -5;
        } else if (person.x < -5) {
          person.x = width + 5;
        }

        // Draw tiny person
        ctx.beginPath();
        ctx.fillStyle = colorScheme.secondary;
        ctx.globalAlpha = isHovered ? 0.9 : 0.6;
        ctx.arc(person.x, person.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Flying drones with trails
      drones.forEach((drone) => {
        // Store trail
        drone.trail.push({ x: drone.x, y: drone.y, alpha: 1 });
        if (drone.trail.length > 12) {
          drone.trail.shift();
        }

        // Update position
        drone.x += drone.speed;
        drone.y += Math.sin(time * 0.02 + drone.x * 0.1) * 0.2;

        // Wrap around
        if (drone.x > width + 10) {
          drone.x = -10;
          drone.trail = [];
        }

        // Draw trail
        drone.trail.forEach((t, i) => {
          const alpha = (i / drone.trail.length) * 0.4;
          ctx.beginPath();
          ctx.fillStyle = colorScheme.accent;
          ctx.globalAlpha = alpha * (isHovered ? 1.5 : 1);
          ctx.arc(t.x, t.y, drone.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Draw drone
        ctx.beginPath();
        ctx.fillStyle = colorScheme.accent;
        ctx.shadowColor = colorScheme.accent;
        ctx.shadowBlur = isHovered ? 6 : 3;
        ctx.arc(drone.x, drone.y, drone.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Occasional building pulse
      if (time % 90 === 0 && buildings.length > 0) {
        const randomB = buildings[Math.floor(Math.random() * buildings.length)];
        const pulseY = randomB.baseY - randomB.height;

        ctx.beginPath();
        ctx.strokeStyle = colorScheme.primary;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1;
        ctx.arc(
          randomB.x + randomB.width / 2,
          pulseY,
          8,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [pathType, isHovered]);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isHovered ? 'scale-105' : ''
      }`}
      style={{ width: '320px', height: '80px' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '320px', height: '80px' }}
      />

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${accentGradient} opacity-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-40' : ''
        }`}
      />

      {/* Holographic scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
        }}
      />

      {/* Border glow */}
      <div
        className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
          pathType === 'freelance'
            ? 'border-green-500/30 group-hover:border-green-400/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : pathType === 'fulltime'
            ? 'border-red-500/30 group-hover:border-red-400/60 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : 'border-cyan-500/30 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]'
        }`}
      />

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <span className="text-base font-semibold text-white sm:text-lg drop-shadow-lg">
          {label}
        </span>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${
          pathType === 'freelance'
            ? 'bg-green-500/10'
            : pathType === 'fulltime'
            ? 'bg-red-500/10'
            : 'bg-cyan-500/10'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
