'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MicroCityWorldProps {
  className?: string;
}

export default function MicroCityWorld({ className = '' }: MicroCityWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Tiny buildings with neon glow
    interface Building {
      x: number;
      y: number;
      width: number;
      height: number;
      windows: { x: number; y: number; lit: boolean; flickerRate: number }[];
      color: string;
      glowColor: string;
    }

    // Micro people
    interface Person {
      x: number;
      y: number;
      targetX: number;
      speed: number;
      direction: number;
      color: string;
    }

    // Flying vehicles (drones/cars)
    interface Vehicle {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      size: number;
      color: string;
      trail: { x: number; y: number }[];
    }

    // Data streams (vertical light beams)
    interface DataStream {
      x: number;
      particles: { y: number; speed: number; alpha: number }[];
      color: string;
    }

    const width = rect.width;
    const height = rect.height;

    // Create buildings - futuristic skyline
    const buildings: Building[] = [];
    const buildingCount = 12;
    const colors = [
      { main: '#0a1628', glow: '#00f5ff' },
      { main: '#0d1b2a', glow: '#7c3aed' },
      { main: '#1a1a2e', glow: '#10b981' },
      { main: '#16213e', glow: '#f59e0b' },
    ];

    for (let i = 0; i < buildingCount; i++) {
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      const bWidth = 8 + Math.random() * 15;
      const bHeight = 20 + Math.random() * 40;
      const bX = (i / buildingCount) * width + Math.random() * 10;
      const bY = height - bHeight - 5;

      const windows: Building['windows'] = [];
      const windowRows = Math.floor(bHeight / 6);
      const windowCols = Math.floor(bWidth / 4);

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          windows.push({
            x: col * 4 + 2,
            y: row * 6 + 4,
            lit: Math.random() > 0.3,
            flickerRate: 0.002 + Math.random() * 0.01,
          });
        }
      }

      buildings.push({
        x: bX,
        y: bY,
        width: bWidth,
        height: bHeight,
        windows,
        color: colorScheme.main,
        glowColor: colorScheme.glow,
      });
    }

    // Create micro people walking on ground
    const people: Person[] = [];
    const personColors = ['#00f5ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

    for (let i = 0; i < 8; i++) {
      people.push({
        x: Math.random() * width,
        y: height - 4 + Math.random() * 2,
        targetX: Math.random() * width,
        speed: 0.15 + Math.random() * 0.25,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: personColors[Math.floor(Math.random() * personColors.length)],
      });
    }

    // Create flying vehicles
    const vehicles: Vehicle[] = [];
    const vehicleColors = ['#00f5ff', '#7c3aed', '#f59e0b'];

    for (let i = 0; i < 4; i++) {
      vehicles.push({
        x: Math.random() * width,
        y: 10 + Math.random() * 30,
        targetY: 10 + Math.random() * 30,
        speed: 0.3 + Math.random() * 0.5,
        size: 2 + Math.random() * 2,
        color: vehicleColors[Math.floor(Math.random() * vehicleColors.length)],
        trail: [],
      });
    }

    // Create data streams
    const dataStreams: DataStream[] = [];
    const streamColors = ['#00f5ff', '#7c3aed', '#10b981'];

    for (let i = 0; i < 5; i++) {
      const particles: DataStream['particles'] = [];
      for (let j = 0; j < 8; j++) {
        particles.push({
          y: Math.random() * height,
          speed: 0.5 + Math.random() * 1,
          alpha: 0.3 + Math.random() * 0.7,
        });
      }
      dataStreams.push({
        x: (i + 0.5) * (width / 5) + Math.random() * 20 - 10,
        particles,
        color: streamColors[Math.floor(Math.random() * streamColors.length)],
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a0a15');
      gradient.addColorStop(1, '#0f1629');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw data streams (behind buildings)
      dataStreams.forEach((stream) => {
        stream.particles.forEach((particle) => {
          particle.y -= particle.speed;
          if (particle.y < 0) {
            particle.y = height;
            particle.alpha = 0.3 + Math.random() * 0.7;
          }

          ctx.beginPath();
          ctx.fillStyle = stream.color;
          ctx.globalAlpha = particle.alpha * 0.4;
          ctx.fillRect(stream.x, particle.y, 1, 3);
          ctx.globalAlpha = 1;
        });
      });

      // Draw buildings
      buildings.forEach((building) => {
        // Building body
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, building.y, building.width, building.height);

        // Building glow at top
        const glowGradient = ctx.createLinearGradient(
          building.x,
          building.y,
          building.x,
          building.y + 10
        );
        glowGradient.addColorStop(0, building.glowColor + '40');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(building.x, building.y, building.width, 10);

        // Windows
        building.windows.forEach((window) => {
          // Random flicker
          if (Math.random() < window.flickerRate) {
            window.lit = !window.lit;
          }

          if (window.lit) {
            ctx.fillStyle = building.glowColor;
            ctx.globalAlpha = 0.6 + Math.sin(time * 0.02 + window.x) * 0.2;
            ctx.fillRect(
              building.x + window.x,
              building.y + window.y,
              2,
              3
            );
            ctx.globalAlpha = 1;
          }
        });
      });

      // Draw ground line with glow
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, height - 2);
      ctx.lineTo(width, height - 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw and update micro people
      people.forEach((person) => {
        // Move toward target
        if (Math.abs(person.x - person.targetX) < 2) {
          person.targetX = Math.random() * width;
          person.direction = person.targetX > person.x ? 1 : -1;
        }
        person.x += person.speed * person.direction;

        // Keep in bounds
        if (person.x < 0) {
          person.x = 0;
          person.direction = 1;
          person.targetX = Math.random() * width;
        }
        if (person.x > width) {
          person.x = width;
          person.direction = -1;
          person.targetX = Math.random() * width;
        }

        // Draw tiny person (dot with glow)
        ctx.beginPath();
        ctx.fillStyle = person.color;
        ctx.shadowColor = person.color;
        ctx.shadowBlur = 3;
        ctx.arc(person.x, person.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw and update flying vehicles
      vehicles.forEach((vehicle) => {
        // Store trail position
        vehicle.trail.push({ x: vehicle.x, y: vehicle.y });
        if (vehicle.trail.length > 15) {
          vehicle.trail.shift();
        }

        // Move vehicle
        vehicle.x += vehicle.speed;

        // Gentle vertical movement
        vehicle.y += (vehicle.targetY - vehicle.y) * 0.02;
        if (Math.abs(vehicle.y - vehicle.targetY) < 1) {
          vehicle.targetY = 10 + Math.random() * 30;
        }

        // Wrap around
        if (vehicle.x > width + 10) {
          vehicle.x = -10;
          vehicle.trail = [];
        }

        // Draw trail
        vehicle.trail.forEach((pos, i) => {
          const alpha = (i / vehicle.trail.length) * 0.5;
          ctx.beginPath();
          ctx.fillStyle = vehicle.color;
          ctx.globalAlpha = alpha;
          ctx.arc(pos.x, pos.y, vehicle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Draw vehicle
        ctx.beginPath();
        ctx.fillStyle = vehicle.color;
        ctx.shadowColor = vehicle.color;
        ctx.shadowBlur = 5;
        ctx.arc(vehicle.x, vehicle.y, vehicle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Animated pulse effect at random building tops
      if (time % 60 === 0) {
        const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        ctx.beginPath();
        ctx.strokeStyle = randomBuilding.glowColor;
        ctx.globalAlpha = 0.8;
        ctx.arc(
          randomBuilding.x + randomBuilding.width / 2,
          randomBuilding.y,
          5,
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
  }, []);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.03) 2px, rgba(0, 245, 255, 0.03) 4px)',
        }}
      />
    </motion.div>
  );
}
