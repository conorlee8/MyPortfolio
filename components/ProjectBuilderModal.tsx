'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Send, Check } from 'lucide-react';

// Micro City Canvas Animation Component
const MicroCityAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 120 * dpr;
    ctx.scale(dpr, dpr);

    const width = 600;
    const height = 120;

    // Buildings
    interface Building {
      x: number;
      width: number;
      height: number;
      windows: { x: number; y: number; lit: boolean }[];
      antenna: boolean;
    }

    interface Person {
      x: number;
      y: number;
      speed: number;
      direction: number;
    }

    interface Drone {
      x: number;
      y: number;
      speed: number;
      size: number;
      trail: { x: number; y: number }[];
    }

    interface Particle {
      x: number;
      y: number;
      speed: number;
      alpha: number;
    }

    const groundY = height - 10;
    const buildings: Building[] = [];

    // Create futuristic cityscape
    const buildingConfigs = [
      { x: 10, w: 18, h: 55 }, { x: 35, w: 12, h: 40 }, { x: 55, w: 22, h: 70 },
      { x: 85, w: 14, h: 45 }, { x: 105, w: 10, h: 30 }, { x: 125, w: 20, h: 60 },
      { x: 150, w: 12, h: 35 }, { x: 170, w: 18, h: 55 }, { x: 195, w: 14, h: 48 },
      { x: 215, w: 24, h: 75 }, { x: 245, w: 12, h: 38 }, { x: 265, w: 16, h: 52 },
      { x: 290, w: 10, h: 28 }, { x: 310, w: 20, h: 65 }, { x: 340, w: 14, h: 42 },
      { x: 360, w: 18, h: 58 }, { x: 385, w: 12, h: 34 }, { x: 405, w: 22, h: 68 },
      { x: 435, w: 14, h: 45 }, { x: 455, w: 16, h: 50 }, { x: 480, w: 20, h: 62 },
      { x: 510, w: 12, h: 36 }, { x: 530, w: 18, h: 54 }, { x: 555, w: 14, h: 40 },
      { x: 575, w: 20, h: 58 },
    ];

    buildingConfigs.forEach(config => {
      const windows: Building['windows'] = [];
      const rows = Math.floor(config.h / 6);
      const cols = Math.floor(config.w / 4);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          windows.push({ x: c * 4 + 2, y: r * 6 + 4, lit: Math.random() > 0.35 });
        }
      }
      buildings.push({
        x: config.x,
        width: config.w,
        height: config.h,
        windows,
        antenna: Math.random() > 0.5,
      });
    });

    // People walking
    const people: Person[] = [];
    for (let i = 0; i < 20; i++) {
      people.push({
        x: Math.random() * width,
        y: groundY + 2 + Math.random() * 4,
        speed: 0.15 + Math.random() * 0.25,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Flying drones
    const drones: Drone[] = [];
    for (let i = 0; i < 8; i++) {
      drones.push({
        x: Math.random() * width,
        y: 8 + Math.random() * 25,
        speed: 0.25 + Math.random() * 0.5,
        size: 2 + Math.random() * 1.5,
        trail: [],
      });
    }

    // Rising particles
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.4 + Math.random() * 0.6,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#050508');
      bg.addColorStop(0.5, '#080812');
      bg.addColorStop(1, '#0a0a15');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Scan line
      const scanY = (time * 0.4) % height;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(0, scanY, width, 2);

      // Particles
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
        ctx.beginPath();
        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Buildings
      buildings.forEach(b => {
        const bY = groundY - b.height;
        ctx.fillStyle = '#0a0f18';
        ctx.fillRect(b.x, bY, b.width, b.height);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(b.x, bY, b.width, b.height);

        // Windows
        b.windows.forEach(w => {
          if (Math.random() < 0.004) w.lit = !w.lit;
          if (w.lit) {
            const flicker = 0.5 + Math.sin(time * 0.03 + w.x) * 0.3;
            ctx.fillStyle = '#10b981';
            ctx.globalAlpha = flicker * 0.85;
            ctx.fillRect(b.x + w.x, bY + w.y, 2, 3);
            ctx.globalAlpha = 1;
          }
        });

        // Antenna
        if (b.antenna) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(b.x + b.width / 2, bY);
          ctx.lineTo(b.x + b.width / 2, bY - 6);
          ctx.stroke();
          if (Math.sin(time * 0.06 + b.x) > 0.5) {
            ctx.beginPath();
            ctx.fillStyle = '#6ee7b7';
            ctx.arc(b.x + b.width / 2, bY - 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Ground
      ctx.strokeStyle = '#10b981';
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // People
      people.forEach(p => {
        p.x += p.speed * p.direction;
        if (p.x > width + 5) p.x = -5;
        if (p.x < -5) p.x = width + 5;
        ctx.beginPath();
        ctx.fillStyle = '#34d399';
        ctx.globalAlpha = 0.7;
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Drones
      drones.forEach(d => {
        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 15) d.trail.shift();
        d.x += d.speed;
        d.y += Math.sin(time * 0.025 + d.x * 0.08) * 0.25;
        if (d.x > width + 10) { d.x = -10; d.trail = []; }

        d.trail.forEach((t, i) => {
          ctx.beginPath();
          ctx.fillStyle = '#6ee7b7';
          ctx.globalAlpha = (i / d.trail.length) * 0.4;
          ctx.arc(t.x, t.y, d.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.fillStyle = '#6ee7b7';
        ctx.shadowColor = '#6ee7b7';
        ctx.shadowBlur = 4;
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Isometric Project Type Canvas Animations - Enhanced versions with tiny people and detailed scenes
const IsometricAnimation = ({ type, isActive }: { type: string; isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 120 * dpr;
    canvas.height = 80 * dpr;
    ctx.scale(dpr, dpr);

    const w = 120;
    const h = 80;
    let time = 0;
    let animationId: number;

    // Helper functions
    const drawRect = (x: number, y: number, width: number, height: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    };

    const drawCircle = (x: number, y: number, r: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const drawPerson = (x: number, y: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      // Head
      ctx.beginPath();
      ctx.arc(x, y - 4, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fcd9b6';
      ctx.fill();
      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x - 1.5, y - 2, 3, 5);
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, w, h);

      const alpha = isActive ? 1 : 0.6;

      if (type === 'website') {
        // === BROWSER WORLD: Mini browser with person scrolling ===

        // Browser window
        drawRect(20, 10, 80, 55, '#1e293b', alpha);
        // Browser header
        drawRect(20, 10, 80, 8, '#334155', alpha);
        // Traffic lights
        drawCircle(26, 14, 2, '#ef4444', alpha);
        drawCircle(32, 14, 2, '#fbbf24', alpha);
        drawCircle(38, 14, 2, '#22c55e', alpha);
        // URL bar
        drawRect(45, 12, 50, 4, '#475569', alpha);

        // Content area with scrolling effect
        const scrollOffset = (time * 20) % 40;
        ctx.save();
        ctx.beginPath();
        ctx.rect(22, 20, 76, 43);
        ctx.clip();

        // Content blocks that scroll
        for (let i = 0; i < 4; i++) {
          const yPos = 25 + i * 18 - scrollOffset;
          if (yPos > 15 && yPos < 65) {
            drawRect(25, yPos, 35, 4, '#3b82f6', alpha * 0.8);
            drawRect(25, yPos + 6, 50, 3, '#64748b', alpha * 0.5);
            drawRect(25, yPos + 10, 40, 3, '#64748b', alpha * 0.4);
          }
        }
        ctx.restore();

        // Tiny person at computer
        drawRect(5, 50, 12, 8, '#1e293b', alpha); // Desk
        drawRect(7, 42, 8, 10, '#0ea5e9', alpha); // Monitor
        drawPerson(11, 58, '#3b82f6', alpha);

        // Cursor clicking
        if (isActive) {
          const cursorX = 50 + Math.sin(time * 2) * 15;
          const cursorY = 35 + Math.cos(time * 1.5) * 10;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(cursorX, cursorY);
          ctx.lineTo(cursorX + 6, cursorY + 6);
          ctx.lineTo(cursorX + 2, cursorY + 6);
          ctx.lineTo(cursorX, cursorY + 10);
          ctx.closePath();
          ctx.fill();

          // Click ripple
          if (Math.sin(time * 4) > 0.8) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cursorX, cursorY, 5 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

      } else if (type === 'webapp') {
        // === WORKSPACE SCENE: Tiny people at desks with chat bubbles ===

        // Floor
        drawRect(0, 55, w, 25, '#1e293b', alpha * 0.5);

        // Desks with people
        const desks = [
          { x: 15, person: '#8b5cf6' },
          { x: 50, person: '#ec4899' },
          { x: 85, person: '#06b6d4' },
        ];

        desks.forEach((desk, i) => {
          // Desk
          drawRect(desk.x - 8, 48, 16, 3, '#475569', alpha);
          // Monitor
          const monitorGlow = isActive ? 0.8 + Math.sin(time * 3 + i) * 0.2 : 0.6;
          drawRect(desk.x - 5, 38, 10, 10, '#0f172a', alpha);
          drawRect(desk.x - 4, 39, 8, 8, '#1e40af', alpha * monitorGlow);
          // Person
          const bobble = isActive ? Math.sin(time * 2 + i * 2) * 1 : 0;
          drawPerson(desk.x, 56 + bobble, desk.person, alpha);

          // Typing animation on screen
          if (isActive) {
            const typeWidth = ((time * 30 + i * 50) % 6);
            drawRect(desk.x - 3, 42, typeWidth, 1, '#60a5fa', alpha);
          }
        });

        // Chat bubbles appearing
        if (isActive) {
          const bubbles = [
            { x: 25, y: 25, delay: 0 },
            { x: 70, y: 20, delay: 1.5 },
            { x: 95, y: 28, delay: 3 },
          ];

          bubbles.forEach((bubble) => {
            const showTime = (time + bubble.delay) % 4;
            if (showTime < 2) {
              const bubbleAlpha = showTime < 0.3 ? showTime / 0.3 : showTime > 1.7 ? (2 - showTime) / 0.3 : 1;
              ctx.globalAlpha = alpha * bubbleAlpha;
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.ellipse(bubble.x, bubble.y, 8, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              // Dots in bubble
              ctx.fillStyle = '#64748b';
              for (let d = 0; d < 3; d++) {
                const dotBounce = Math.sin(time * 8 + d * 0.5) * 1;
                ctx.beginPath();
                ctx.arc(bubble.x - 3 + d * 3, bubble.y + dotBounce, 1, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.globalAlpha = 1;
            }
          });
        }

      } else if (type === 'ecommerce') {
        // === MINI STORE: Isometric shop with customers ===

        // Store building - isometric style
        // Floor
        ctx.fillStyle = '#1e293b';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(60, 65);
        ctx.lineTo(110, 45);
        ctx.lineTo(60, 25);
        ctx.lineTo(10, 45);
        ctx.closePath();
        ctx.fill();

        // Back walls
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(60, 25);
        ctx.lineTo(60, 5);
        ctx.lineTo(110, 25);
        ctx.lineTo(110, 45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(60, 25);
        ctx.lineTo(60, 5);
        ctx.lineTo(10, 25);
        ctx.lineTo(10, 45);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Shelves with products
        const shelfColors = ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#ec4899', '#8b5cf6'];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 2; j++) {
            const px = 30 + i * 15;
            const py = 15 + j * 12;
            drawRect(px, py, 8, 6, shelfColors[(i + j * 3) % 6], alpha * 0.9);
          }
        }

        // Shopping customers walking
        const customers = [
          { startX: -10, y: 58, speed: 0.4, color: '#06b6d4', offset: 0 },
          { startX: -10, y: 62, speed: 0.3, color: '#f472b6', offset: 2 },
          { startX: 130, y: 55, speed: -0.35, color: '#a78bfa', offset: 1 },
        ];

        customers.forEach((c) => {
          const x = ((time * c.speed * 30 + c.offset * 40 + 140) % 140) - 10;
          const walkBob = Math.sin(time * 8 + c.offset) * 1;
          drawPerson(c.speed > 0 ? x : 120 - x, c.y + walkBob, c.color, alpha);

          // Shopping bag for some
          if (c.offset === 0 && isActive) {
            drawRect((c.speed > 0 ? x : 120 - x) + 3, c.y - 1, 3, 4, '#fbbf24', alpha);
          }
        });

        // Cash register with checkout
        drawRect(85, 50, 12, 8, '#22c55e', alpha);
        if (isActive) {
          // Coins/money flying
          const coinY = 45 - ((time * 20) % 15);
          drawCircle(91, coinY, 2, '#fbbf24', alpha * (1 - (45 - coinY) / 15));
        }

      } else if (type === 'mobile') {
        // === APP UNIVERSE: Phone with apps launching as 3D worlds ===

        // Phone body
        drawRect(45, 10, 30, 55, '#1f2937', alpha);
        drawRect(47, 13, 26, 49, '#0f172a', alpha);
        // Notch
        drawRect(55, 14, 10, 3, '#1f2937', alpha);

        // App grid on phone
        const apps = [
          { x: 50, y: 22, color: '#ef4444' },
          { x: 60, y: 22, color: '#22c55e' },
          { x: 70, y: 22, color: '#3b82f6' },
          { x: 50, y: 32, color: '#fbbf24' },
          { x: 60, y: 32, color: '#ec4899' },
          { x: 70, y: 32, color: '#8b5cf6' },
        ];

        apps.forEach((app, i) => {
          const pulse = isActive ? 1 + Math.sin(time * 3 + i) * 0.1 : 1;
          drawRect(app.x, app.y, 6 * pulse, 6 * pulse, app.color, alpha * 0.9);
        });

        // Apps launching as expanding worlds
        if (isActive) {
          const launchingApps = [
            { fromX: 50, fromY: 22, toX: 15, toY: 20, color: '#ef4444', delay: 0 },
            { fromX: 70, fromY: 32, toX: 100, toY: 25, color: '#8b5cf6', delay: 1.5 },
            { fromX: 60, fromY: 22, toX: 20, toY: 55, color: '#22c55e', delay: 3 },
          ];

          launchingApps.forEach((app) => {
            const cycleTime = (time + app.delay) % 4;
            if (cycleTime < 2.5) {
              const progress = Math.min(cycleTime / 1.5, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const x = app.fromX + (app.toX - app.fromX) * eased;
              const y = app.fromY + (app.toY - app.fromY) * eased;
              const size = 3 + progress * 12;
              const expandAlpha = cycleTime > 2 ? (2.5 - cycleTime) * 2 : 1;

              // Expanding world
              ctx.globalAlpha = alpha * expandAlpha * 0.8;
              ctx.fillStyle = app.color;
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill();

              // Inner details
              if (size > 8) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = alpha * expandAlpha * 0.3;
                ctx.beginPath();
                ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.globalAlpha = 1;

              // Connection line
              ctx.strokeStyle = app.color;
              ctx.globalAlpha = alpha * expandAlpha * 0.4;
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 2]);
              ctx.beginPath();
              ctx.moveTo(app.fromX + 3, app.fromY + 3);
              ctx.lineTo(x, y);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.globalAlpha = 1;
            }
          });
        }

        // Tiny hand tapping
        if (isActive) {
          const tapX = 55 + Math.sin(time) * 10;
          const tapY = 50 + Math.cos(time * 0.7) * 5;
          ctx.fillStyle = '#fcd9b6';
          ctx.globalAlpha = alpha * 0.8;
          ctx.beginPath();
          ctx.ellipse(tapX, tapY, 4, 3, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

      } else if (type === 'saas') {
        // === CLOUD CITY + API HUB: Floating platform with offices and data pipes ===

        // Main cloud platform
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.ellipse(60, 40, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Platform top
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.ellipse(60, 38, 32, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Mini office buildings on cloud
        const buildings = [
          { x: 45, h: 18, color: '#1e293b' },
          { x: 55, h: 25, color: '#334155' },
          { x: 65, h: 20, color: '#1e293b' },
          { x: 75, h: 15, color: '#475569' },
        ];

        buildings.forEach((b) => {
          drawRect(b.x, 38 - b.h, 8, b.h, b.color, alpha);
          // Windows
          for (let wy = 0; wy < b.h - 4; wy += 4) {
            for (let wx = 0; wx < 2; wx++) {
              const lit = Math.sin(time * 2 + b.x + wy + wx) > 0;
              drawRect(b.x + 1 + wx * 4, 38 - b.h + 2 + wy, 2, 2, lit ? '#fbbf24' : '#0f172a', alpha * 0.8);
            }
          }
        });

        // Tiny people in elevator/moving between floors
        if (isActive) {
          const elevatorY = 20 + ((time * 15) % 18);
          drawRect(53, elevatorY, 4, 5, '#22d3ee', alpha);
          drawCircle(55, elevatorY + 1.5, 1.5, '#fcd9b6', alpha);
        }

        // API pipes/connections to external services
        const services = [
          { x: 10, y: 20, color: '#22c55e', label: 'DB' },
          { x: 110, y: 20, color: '#f59e0b', label: 'API' },
          { x: 10, y: 60, color: '#ec4899', label: 'Auth' },
          { x: 110, y: 60, color: '#06b6d4', label: 'CDN' },
        ];

        services.forEach((s, i) => {
          // Service node
          drawCircle(s.x, s.y, 6, s.color, alpha * 0.8);

          // Connection pipe
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = alpha * 0.5;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.quadraticCurveTo(60, s.y, 60, 40);
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Data packets flowing
          if (isActive) {
            const packetPos = ((time * 0.5 + i * 0.25) % 1);
            const px = s.x + (60 - s.x) * packetPos;
            const py = s.y + (40 - s.y) * packetPos;
            drawCircle(px, py, 2, '#ffffff', alpha * (1 - Math.abs(packetPos - 0.5) * 2));
          }
        });

      } else if (type === 'other') {
        // === CREATIVE WORKSHOP: Tiny artists building something abstract ===

        // Workshop floor
        drawRect(10, 55, 100, 20, '#1e293b', alpha * 0.5);

        // Central creation being built - abstract sculpture
        const sculptureBlocks = [
          { x: 55, y: 45, w: 10, h: 10, color: '#8b5cf6' },
          { x: 50, y: 38, w: 8, h: 8, color: '#ec4899' },
          { x: 62, y: 35, w: 6, h: 12, color: '#06b6d4' },
          { x: 48, y: 28, w: 7, h: 10, color: '#fbbf24' },
          { x: 58, y: 25, w: 9, h: 8, color: '#22c55e' },
        ];

        sculptureBlocks.forEach((block, i) => {
          const float = isActive ? Math.sin(time * 2 + i) * 2 : 0;
          const rotate = isActive ? Math.sin(time + i) * 0.1 : 0;
          ctx.save();
          ctx.translate(block.x + block.w / 2, block.y + block.h / 2 + float);
          ctx.rotate(rotate);
          ctx.fillStyle = block.color;
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillRect(-block.w / 2, -block.h / 2, block.w, block.h);
          ctx.restore();
          ctx.globalAlpha = 1;
        });

        // Artist/builder people working
        const workers = [
          { x: 25, baseY: 60, color: '#f472b6', tool: 'brush' },
          { x: 85, baseY: 62, color: '#a78bfa', tool: 'hammer' },
          { x: 40, baseY: 58, color: '#34d399', tool: 'wrench' },
        ];

        workers.forEach((worker, i) => {
          const hop = isActive ? Math.abs(Math.sin(time * 4 + i * 2)) * 3 : 0;
          drawPerson(worker.x, worker.baseY - hop, worker.color, alpha);

          // Tool animation
          if (isActive) {
            const toolSwing = Math.sin(time * 6 + i * 2) * 0.5;
            ctx.save();
            ctx.translate(worker.x + 4, worker.baseY - 4 - hop);
            ctx.rotate(toolSwing);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(0, -1, 6, 2);
            ctx.restore();
          }
        });

        // Sparkles/magic particles
        if (isActive) {
          for (let i = 0; i < 8; i++) {
            const sparkleTime = (time * 2 + i * 0.5) % 3;
            if (sparkleTime < 1.5) {
              const sx = 45 + Math.sin(time + i * 1.5) * 25;
              const sy = 20 + Math.cos(time * 0.8 + i) * 20 - sparkleTime * 10;
              const sparkleAlpha = 1 - sparkleTime / 1.5;
              ctx.fillStyle = ['#fbbf24', '#f472b6', '#22d3ee', '#a78bfa'][i % 4];
              ctx.globalAlpha = alpha * sparkleAlpha;
              ctx.beginPath();
              ctx.arc(sx, sy, 2 - sparkleTime, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }

        // "?" or lightbulb appearing
        if (isActive && Math.sin(time * 0.5) > 0.3) {
          ctx.fillStyle = '#fbbf24';
          ctx.globalAlpha = alpha * 0.8;
          ctx.font = 'bold 14px Arial';
          ctx.fillText('💡', 55, 15);
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [type, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Budget Animation - Space/Rocket Journey Theme
const BudgetAnimation = ({ budgetId, isActive }: { budgetId: string; isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 80 * dpr;
    canvas.height = 50 * dpr;
    ctx.scale(dpr, dpr);

    const w = 80;
    const h = 50;
    let time = 0;
    let animationId: number;

    const drawStar = (x: number, y: number, size: number, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const drawRocket = (x: number, y: number, scale: number, flameSize: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Rocket body
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(4, 0);
      ctx.lineTo(4, 8);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();

      // Nose cone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(3, -4);
      ctx.lineTo(-3, -4);
      ctx.closePath();
      ctx.fill();

      // Window
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -1, 2, 0, Math.PI * 2);
      ctx.fill();

      // Fins
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-4, 8);
      ctx.lineTo(-7, 12);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 8);
      ctx.lineTo(7, 12);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();

      // Flame
      if (flameSize > 0) {
        const flicker = Math.sin(time * 15) * 2;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-3, 8);
        ctx.lineTo(0, 8 + flameSize + flicker);
        ctx.lineTo(3, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-2, 8);
        ctx.lineTo(0, 8 + flameSize * 0.6 + flicker);
        ctx.lineTo(2, 8);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, w, h);

      const alpha = isActive ? 1 : 0.5;

      // Background gradient based on "altitude"
      let bgTop = '#0f172a';
      let bgBottom = '#1e293b';

      if (budgetId === 'starter') {
        // Tiny rocket being assembled on workbench
        bgTop = '#1e293b';
        bgBottom = '#334155';

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, bgTop);
        grad.addColorStop(1, bgBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Workbench
        ctx.fillStyle = '#78716c';
        ctx.globalAlpha = alpha;
        ctx.fillRect(10, 35, 60, 4);
        ctx.fillRect(15, 39, 4, 8);
        ctx.fillRect(61, 39, 4, 8);
        ctx.globalAlpha = 1;

        // Small rocket parts being assembled
        ctx.fillStyle = '#e2e8f0';
        ctx.globalAlpha = alpha;
        ctx.fillRect(35, 25, 8, 10);

        // Nose cone floating/being placed
        const noseY = isActive ? 18 + Math.sin(time * 3) * 3 : 20;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(39, noseY);
        ctx.lineTo(43, noseY + 5);
        ctx.lineTo(35, noseY + 5);
        ctx.closePath();
        ctx.fill();

        // Fins on bench
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(25, 32, 4, 3);
        ctx.fillRect(50, 32, 4, 3);
        ctx.globalAlpha = 1;

        // Tools
        ctx.fillStyle = '#94a3b8';
        ctx.globalAlpha = alpha;
        ctx.fillRect(15, 32, 6, 2);
        ctx.fillRect(60, 30, 2, 5);
        ctx.globalAlpha = 1;

        // Tiny worker
        ctx.fillStyle = '#fcd9b6';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(28, 30, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(26, 32, 4, 5);
        if (isActive) {
          ctx.fillStyle = '#fcd9b6';
          ctx.fillRect(30, 32, 4, 1.5);
        }
        ctx.globalAlpha = 1;

        // Sparkle for assembly
        if (isActive && Math.sin(time * 5) > 0.7) {
          ctx.fillStyle = '#fbbf24';
          ctx.globalAlpha = alpha * 0.8;
          ctx.beginPath();
          ctx.arc(39, 24, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

      } else if (budgetId === 'small') {
        // Launchpad - ground level
        bgTop = '#1e3a5f';
        bgBottom = '#374151';

        // Ground
        ctx.fillStyle = '#4b5563';
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 40, w, 10);

        // Launchpad
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(30, 35, 20, 8);
        ctx.globalAlpha = 1;

        // Rocket on pad with smoke
        drawRocket(40, 28, 0.8, isActive ? 5 : 0);

        // Smoke building
        if (isActive) {
          for (let i = 0; i < 5; i++) {
            const smokeX = 35 + Math.sin(time * 2 + i) * 8 + i * 2;
            const smokeY = 42 - i * 2;
            const smokeAlpha = (1 - i * 0.15) * alpha * 0.5;
            ctx.fillStyle = '#9ca3af';
            ctx.globalAlpha = smokeAlpha;
            ctx.beginPath();
            ctx.arc(smokeX, smokeY, 3 + i, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

      } else if (budgetId === 'medium') {
        // Lifting off
        bgTop = '#1e3a5f';
        bgBottom = '#3b82f6';

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, bgTop);
        grad.addColorStop(1, bgBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Ground far below
        ctx.fillStyle = '#22c55e';
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillRect(0, 45, w, 5);
        ctx.globalAlpha = 1;

        // Rocket rising
        const rocketY = isActive ? 25 + Math.sin(time) * 3 : 28;
        drawRocket(40, rocketY, 0.9, isActive ? 12 : 6);

        // Trail
        if (isActive) {
          for (let i = 0; i < 8; i++) {
            ctx.fillStyle = '#fbbf24';
            ctx.globalAlpha = (1 - i * 0.1) * alpha * 0.4;
            ctx.beginPath();
            ctx.arc(40 + Math.sin(i) * 2, rocketY + 15 + i * 3, 2 - i * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

      } else if (budgetId === 'large') {
        // Mid-flight through clouds
        bgTop = '#1e3a8a';
        bgBottom = '#7c3aed';

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, bgTop);
        grad.addColorStop(1, bgBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Clouds passing
        const clouds = [
          { x: ((time * 30) % 100) - 20, y: 35, size: 8 },
          { x: ((time * 20 + 50) % 100) - 10, y: 20, size: 6 },
          { x: ((time * 25 + 30) % 100) - 15, y: 40, size: 10 },
        ];
        clouds.forEach(c => {
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
          ctx.arc(c.x + c.size * 0.7, c.y, c.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Rocket speeding
        const shake = isActive ? Math.sin(time * 20) * 0.5 : 0;
        drawRocket(40 + shake, 22, 1, isActive ? 15 : 8);

        // Speed lines
        if (isActive) {
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = alpha * 0.3;
          ctx.lineWidth = 1;
          for (let i = 0; i < 5; i++) {
            const ly = 10 + i * 8;
            const lx = ((time * 50 + i * 20) % 30);
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + 10, ly);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

      } else if (budgetId === 'enterprise') {
        // In space with stars and planet
        bgTop = '#030712';
        bgBottom = '#1e1b4b';

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, bgTop);
        grad.addColorStop(1, bgBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Stars
        for (let i = 0; i < 20; i++) {
          const sx = (i * 17 + time * 5) % w;
          const sy = (i * 13) % h;
          const twinkle = isActive ? 0.5 + Math.sin(time * 3 + i) * 0.5 : 0.6;
          drawStar(sx, sy, 0.5 + (i % 3) * 0.3, alpha * twinkle);
        }

        // Planet/Moon
        ctx.fillStyle = '#a78bfa';
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(65, 38, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c4b5fd';
        ctx.beginPath();
        ctx.arc(62, 35, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Rocket cruising in space
        const float = isActive ? Math.sin(time * 2) * 2 : 0;
        drawRocket(25, 20 + float, 1.1, isActive ? 10 : 5);

        // Stardust trail
        if (isActive) {
          for (let i = 0; i < 6; i++) {
            ctx.fillStyle = '#fbbf24';
            ctx.globalAlpha = (1 - i * 0.15) * alpha * 0.5;
            ctx.beginPath();
            ctx.arc(25 - i * 4, 28 + float + i * 2, 1.5 - i * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

      } else if (budgetId === 'discuss') {
        // Multiple trajectory paths
        bgTop = '#1e293b';
        bgBottom = '#334155';

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, bgTop);
        grad.addColorStop(1, bgBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Multiple dotted trajectory paths
        const paths = [
          { endX: 15, endY: 8, color: '#22c55e' },
          { endX: 40, endY: 5, color: '#3b82f6' },
          { endX: 65, endY: 10, color: '#a78bfa' },
        ];

        paths.forEach((p, idx) => {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha * (isActive ? 0.6 : 0.3);
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(40, 40);
          ctx.quadraticCurveTo(40, 25, p.endX, p.endY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Destination markers
          if (isActive) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * (0.5 + Math.sin(time * 2 + idx) * 0.3);
            ctx.beginPath();
            ctx.arc(p.endX, p.endY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;

        // Rocket with question mark
        drawRocket(40, 35, 0.7, isActive ? 4 : 0);

        // Question mark
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = alpha * (isActive ? 0.8 + Math.sin(time * 3) * 0.2 : 0.6);
        ctx.font = 'bold 12px Arial';
        ctx.fillText('?', 48, 30);
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [budgetId, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Timeline Animation - Construction Theme
const TimelineAnimation = ({ timelineId, isActive }: { timelineId: string; isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 80 * dpr;
    canvas.height = 50 * dpr;
    ctx.scale(dpr, dpr);

    const w = 80;
    const h = 50;
    let time = 0;
    let animationId: number;

    const drawPerson = (x: number, y: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      // Head
      ctx.fillStyle = '#fcd9b6';
      ctx.beginPath();
      ctx.arc(x, y - 3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x - 1, y - 1.5, 2, 4);
      // Hard hat
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 1.5, y - 4.5, 3, 1.5);
      ctx.globalAlpha = 1;
    };

    const drawBlock = (x: number, y: number, w: number, h: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(x, y, w, 1);
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      time += 0.04;
      ctx.clearRect(0, 0, w, h);

      const alpha = isActive ? 1 : 0.5;

      // Ground
      ctx.fillStyle = '#4b5563';
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 45, w, 5);
      ctx.globalAlpha = 1;

      if (timelineId === 'asap') {
        // SPEED BUILD - blocks slamming down fast

        // Crane (moving fast)
        const craneX = 55 + Math.sin(time * 4) * 10;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(craneX, 5);
        ctx.lineTo(craneX, 25);
        ctx.stroke();
        // Crane arm
        ctx.beginPath();
        ctx.moveTo(craneX - 15, 5);
        ctx.lineTo(craneX + 5, 5);
        ctx.stroke();
        // Cable
        const cableY = 5 + Math.abs(Math.sin(time * 6)) * 15;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(craneX - 10, 5);
        ctx.lineTo(craneX - 10, cableY);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Blocks being placed rapidly
        const blockColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
        for (let i = 0; i < 4; i++) {
          const blockY = 38 - i * 6;
          const shake = isActive && i === 3 ? Math.sin(time * 20) * 1 : 0;
          drawBlock(15 + shake, blockY, 25, 6, blockColors[i], alpha);
        }

        // Flying block
        if (isActive) {
          const flyY = 10 + ((time * 80) % 25);
          if (flyY < 20) {
            drawBlock(craneX - 14, flyY, 8, 5, '#ef4444', alpha);
          }
        }

        // Speed lines
        if (isActive) {
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = alpha * 0.4;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(5, 15 + i * 8);
            ctx.lineTo(12, 15 + i * 8);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        // Worker running
        const workerX = isActive ? 50 + ((time * 40) % 20) : 55;
        drawPerson(workerX, 43, '#ef4444', alpha);

      } else if (timelineId === '1month') {
        // Quick construction - foundation + walls going up

        // Foundation
        drawBlock(15, 40, 40, 5, '#6b7280', alpha);

        // Walls rising
        const wallHeight = isActive ? 15 + Math.sin(time) * 2 : 12;
        drawBlock(15, 40 - wallHeight, 5, wallHeight, '#94a3b8', alpha);
        drawBlock(50, 40 - wallHeight, 5, wallHeight, '#94a3b8', alpha);

        // Blocks being added
        if (isActive) {
          const newBlockY = 25 - ((time * 20) % 15);
          drawBlock(25, newBlockY, 8, 4, '#3b82f6', alpha * (1 - (25 - newBlockY) / 15));
        }

        // Simple crane
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(60, 10);
        ctx.lineTo(60, 40);
        ctx.moveTo(50, 10);
        ctx.lineTo(65, 10);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Workers
        drawPerson(30, 43, '#3b82f6', alpha);
        if (isActive) {
          const worker2Bob = Math.sin(time * 4) * 1;
          drawPerson(42, 43 + worker2Bob, '#22c55e', alpha);
        }

      } else if (timelineId === '2-3months') {
        // Standard build - full building rising floor by floor

        // Multi-floor building
        const floors = isActive ? 4 : 3;
        for (let i = 0; i < floors; i++) {
          const floorY = 40 - i * 8;
          const buildProgress = isActive && i === floors - 1 ? (Math.sin(time) + 1) / 2 : 1;

          // Floor slab
          drawBlock(12, floorY, 35 * buildProgress, 2, '#64748b', alpha);

          // Walls
          if (i < floors - 1 || buildProgress > 0.5) {
            drawBlock(12, floorY - 6, 4, 6, '#94a3b8', alpha * buildProgress);
            drawBlock(43, floorY - 6, 4, 6, '#94a3b8', alpha * buildProgress);
          }

          // Windows
          if (i < floors - 1) {
            drawBlock(20, floorY - 5, 4, 4, '#38bdf8', alpha * 0.8);
            drawBlock(30, floorY - 5, 4, 4, '#38bdf8', alpha * 0.8);
          }
        }

        // Crane
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        const craneSwing = Math.sin(time * 2) * 5;
        ctx.beginPath();
        ctx.moveTo(55, 5);
        ctx.lineTo(55, 45);
        ctx.moveTo(40 + craneSwing, 5);
        ctx.lineTo(60, 5);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Multiple workers
        drawPerson(25, 43, '#3b82f6', alpha);
        drawPerson(38, 43, '#22c55e', alpha);
        if (isActive) {
          const movingWorker = 55 + Math.sin(time * 2) * 5;
          drawPerson(movingWorker, 43, '#ec4899', alpha);
        }

      } else if (timelineId === '3-6months') {
        // Complex project - multiple buildings/skyscraper

        // Main skyscraper
        const mainFloors = 6;
        for (let i = 0; i < mainFloors; i++) {
          const floorY = 42 - i * 6;
          drawBlock(30, floorY, 20, 5, i % 2 === 0 ? '#475569' : '#64748b', alpha);
          // Windows
          for (let wj = 0; wj < 3; wj++) {
            const windowLit = isActive && Math.sin(time * 2 + i + wj) > 0;
            drawBlock(33 + wj * 5, floorY + 1, 3, 3, windowLit ? '#fbbf24' : '#1e293b', alpha * 0.9);
          }
        }

        // Secondary building
        for (let i = 0; i < 3; i++) {
          drawBlock(8, 32 - i * 6, 15, 5, '#334155', alpha);
        }

        // Tower crane
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(60, 2);
        ctx.lineTo(60, 45);
        ctx.moveTo(52, 2);
        ctx.lineTo(72, 2);
        ctx.stroke();
        // Rotating arm
        const armAngle = time * 0.5;
        ctx.beginPath();
        ctx.moveTo(60, 2);
        ctx.lineTo(60 + Math.cos(armAngle) * 12, 2 + Math.sin(armAngle) * 3);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Workers team
        for (let i = 0; i < 3; i++) {
          const wx = 55 + i * 6;
          const bob = isActive ? Math.sin(time * 3 + i) * 1 : 0;
          drawPerson(wx, 43 + bob, ['#3b82f6', '#22c55e', '#ec4899'][i], alpha);
        }

        // Scaffolding
        ctx.strokeStyle = '#78716c';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = alpha * 0.6;
        for (let sy = 15; sy < 40; sy += 8) {
          ctx.beginPath();
          ctx.moveTo(28, sy);
          ctx.lineTo(52, sy);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

      } else if (timelineId === '6months+') {
        // Mega city district - full city block with multiple towers

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#1e3a5f');
        skyGrad.addColorStop(1, '#334155');
        ctx.fillStyle = skyGrad;
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;

        // Multiple skyscrapers
        const towers = [
          { x: 5, w: 12, h: 35, color: '#334155' },
          { x: 20, w: 15, h: 42, color: '#475569' },
          { x: 38, w: 18, h: 38, color: '#334155' },
          { x: 58, w: 14, h: 30, color: '#475569' },
        ];

        towers.forEach((tower, ti) => {
          const towerY = 45 - tower.h;
          drawBlock(tower.x, towerY, tower.w, tower.h, tower.color, alpha);

          // Windows
          for (let wy = 0; wy < tower.h - 5; wy += 5) {
            for (let wx = 0; wx < tower.w - 4; wx += 4) {
              const lit = isActive && Math.sin(time * 2 + ti + wy + wx) > 0.3;
              drawBlock(tower.x + 2 + wx, towerY + 3 + wy, 2, 3, lit ? '#fbbf24' : '#1e293b', alpha * 0.9);
            }
          }

          // Antenna on tallest
          if (ti === 1) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(tower.x + tower.w / 2, towerY);
            ctx.lineTo(tower.x + tower.w / 2, towerY - 6);
            ctx.stroke();
            // Blinking light
            if (isActive && Math.sin(time * 4) > 0) {
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(tower.x + tower.w / 2, towerY - 6, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }
        });

        // Ground/road
        ctx.fillStyle = '#1f2937';
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 45, w, 5);
        ctx.globalAlpha = 1;

        // Road markings
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = alpha * 0.6;
        for (let rx = 5; rx < w; rx += 12) {
          ctx.fillRect(rx, 47, 6, 1);
        }
        ctx.globalAlpha = 1;

        // Crane in distance
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.moveTo(72, 8);
        ctx.lineTo(72, 35);
        ctx.moveTo(65, 8);
        ctx.lineTo(78, 8);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Workers on ground
        for (let i = 0; i < 4; i++) {
          const wx = 10 + i * 18;
          const bob = isActive ? Math.sin(time * 3 + i * 1.5) * 0.5 : 0;
          drawPerson(wx, 43 + bob, ['#3b82f6', '#22c55e', '#ec4899', '#f59e0b'][i], alpha * 0.8);
        }

      } else if (timelineId === 'flexible') {
        // Blueprint on table, architect relaxed

        // Desk
        drawBlock(15, 32, 45, 3, '#78716c', alpha);
        // Desk legs
        ctx.fillStyle = '#57534e';
        ctx.globalAlpha = alpha;
        ctx.fillRect(18, 35, 3, 10);
        ctx.fillRect(54, 35, 3, 10);
        ctx.globalAlpha = 1;

        // Blueprint paper
        drawBlock(20, 22, 30, 10, '#dbeafe', alpha);

        // Blueprint lines
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = alpha * 0.6;
        // Building outline
        ctx.strokeRect(25, 24, 12, 6);
        ctx.beginPath();
        ctx.moveTo(31, 24);
        ctx.lineTo(31, 18);
        ctx.lineTo(25, 24);
        ctx.stroke();
        // Grid lines
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(40, 24 + i * 2);
          ctx.lineTo(48, 24 + i * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Coffee cup
        ctx.fillStyle = '#78716c';
        ctx.globalAlpha = alpha;
        ctx.fillRect(52, 25, 5, 6);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(53, 26, 3, 2);
        // Steam
        if (isActive) {
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = alpha * 0.4;
          ctx.lineWidth = 0.5;
          for (let i = 0; i < 2; i++) {
            const steamY = 22 - Math.sin(time * 3 + i) * 3;
            ctx.beginPath();
            ctx.moveTo(54 + i * 2, 25);
            ctx.quadraticCurveTo(54 + i * 2 + Math.sin(time * 2) * 2, steamY, 54 + i * 2, steamY - 3);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;

        // Relaxed architect in chair
        // Chair
        ctx.fillStyle = '#1e293b';
        ctx.globalAlpha = alpha;
        ctx.fillRect(5, 30, 8, 12);
        ctx.fillRect(3, 28, 12, 3);
        ctx.globalAlpha = 1;

        // Person sitting
        ctx.fillStyle = '#fcd9b6';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(9, 26, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(6, 29, 6, 8);
        // Arm on desk
        ctx.fillStyle = '#fcd9b6';
        ctx.fillRect(11, 30, 5, 1.5);
        ctx.globalAlpha = 1;

        // Thought bubble
        if (isActive) {
          const bubbleAlpha = 0.5 + Math.sin(time * 2) * 0.3;
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = alpha * bubbleAlpha;
          ctx.beginPath();
          ctx.arc(18, 15, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(13, 20, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(11, 23, 1, 0, Math.PI * 2);
          ctx.fill();
          // Mini building in thought
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(15, 12, 6, 5);
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [timelineId, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Contact Animation - Communication/Signal Theme
const ContactAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 500 * dpr;
    canvas.height = 80 * dpr;
    ctx.scale(dpr, dpr);

    const w = 500;
    const h = 80;
    let time = 0;
    let animationId: number;

    interface Signal {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }

    const signals: Signal[] = [];
    const particles: Particle[] = [];

    // Create initial signals
    for (let i = 0; i < 4; i++) {
      signals.push({
        x: 80,
        y: 45,
        targetX: 420,
        targetY: 35,
        progress: i * 0.25,
        speed: 0.008 + Math.random() * 0.004,
        color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i],
        size: 3 + Math.random() * 2,
      });
    }

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createLinearGradient(0, 0, w, 0);
      bg.addColorStop(0, '#0a0f1a');
      bg.addColorStop(0.5, '#0f172a');
      bg.addColorStop(1, '#0a0f1a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Ground line
      ctx.strokeStyle = '#10b981';
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 65);
      ctx.lineTo(w, 65);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Left side - Person at computer sending message
      // Desk
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, 50, 50, 5);
      ctx.fillRect(50, 55, 5, 10);
      ctx.fillRect(80, 55, 5, 10);

      // Computer
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(55, 35, 25, 18);
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.8 + Math.sin(time * 3) * 0.2;
      ctx.fillRect(57, 37, 21, 14);
      ctx.globalAlpha = 1;

      // Typing lines on screen
      for (let i = 0; i < 3; i++) {
        const lineWidth = 8 + Math.sin(time * 4 + i) * 4;
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(59, 39 + i * 4, lineWidth, 2);
      }

      // Person sitting
      ctx.fillStyle = '#fcd9b6';
      ctx.beginPath();
      ctx.arc(35, 42, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(31, 46, 8, 12);
      // Arms typing
      ctx.fillStyle = '#fcd9b6';
      const typeOffset = Math.sin(time * 8) * 1;
      ctx.fillRect(39, 49 + typeOffset, 12, 2);

      // Signal tower/antenna
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(95, 65);
      ctx.lineTo(95, 25);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(85, 30);
      ctx.lineTo(95, 25);
      ctx.lineTo(105, 30);
      ctx.stroke();

      // Signal waves emanating
      for (let i = 0; i < 3; i++) {
        const waveRadius = 10 + ((time * 30 + i * 15) % 40);
        const waveAlpha = 0.5 - (waveRadius - 10) / 40 * 0.5;
        ctx.strokeStyle = '#10b981';
        ctx.globalAlpha = waveAlpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(95, 25, waveRadius, -Math.PI * 0.7, -Math.PI * 0.3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Right side - Recipient (me)
      // Desk
      ctx.fillStyle = '#334155';
      ctx.fillRect(380, 45, 60, 5);
      ctx.fillRect(390, 50, 5, 15);
      ctx.fillRect(425, 50, 5, 15);

      // Multiple monitors (workstation)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(385, 25, 22, 18);
      ctx.fillRect(410, 28, 18, 15);

      // Screen glow
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.7 + Math.sin(time * 2) * 0.2;
      ctx.fillRect(387, 27, 18, 14);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(412, 30, 14, 11);
      ctx.globalAlpha = 1;

      // Person at desk
      ctx.fillStyle = '#fcd9b6';
      ctx.beginPath();
      ctx.arc(455, 38, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.fillRect(450, 43, 10, 15);
      // Arm reaching to keyboard
      ctx.fillStyle = '#fcd9b6';
      ctx.fillRect(443, 48, 8, 2);

      // Coffee cup
      ctx.fillStyle = '#78716c';
      ctx.fillRect(470, 38, 6, 7);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(471, 39, 4, 3);

      // Flying signals/messages between sender and receiver
      signals.forEach((signal, i) => {
        signal.progress += signal.speed;
        if (signal.progress > 1) {
          signal.progress = 0;
          // Add particle burst at destination
          for (let p = 0; p < 5; p++) {
            particles.push({
              x: signal.targetX,
              y: signal.targetY,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              life: 1,
              color: signal.color,
            });
          }
        }

        // Curved path
        const t = signal.progress;
        const curveHeight = -30 - i * 8;
        const x = signal.x + (signal.targetX - signal.x) * t;
        const y = signal.y + (signal.targetY - signal.y) * t + Math.sin(t * Math.PI) * curveHeight;

        // Trail
        ctx.strokeStyle = signal.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(signal.x, signal.y);
        ctx.quadraticCurveTo(
          (signal.x + signal.targetX) / 2,
          signal.y + curveHeight,
          signal.targetX,
          signal.targetY
        );
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Signal dot
        ctx.fillStyle = signal.color;
        ctx.shadowColor = signal.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, signal.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Envelope icon on signal
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x - 2, y - 1.5, 4, 3);
        ctx.globalAlpha = 1;
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // "New Message" notification pop
      const notifPulse = Math.sin(time * 4);
      if (notifPulse > 0.7) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(405, 27, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 5px Arial';
        ctx.fillText('!', 403.5, 29);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Animated Input Field with micro canvas animation
const AnimatedInput = ({
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  fieldType,
}: {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete: string;
  fieldType: 'name' | 'email' | 'company';
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 32 * dpr;
    canvas.height = 32 * dpr;
    ctx.scale(dpr, dpr);

    const w = 32;
    const h = 32;
    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, w, h);

      const alpha = isFocused ? 1 : 0.5;

      if (fieldType === 'name') {
        // Tiny person waving
        // Head
        ctx.fillStyle = '#fcd9b6';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(16, 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#10b981';
        ctx.fillRect(12, 15, 8, 10);

        // Arm waving
        const armAngle = isFocused ? Math.sin(time * 4) * 0.5 : 0;
        ctx.save();
        ctx.translate(20, 17);
        ctx.rotate(armAngle - 0.8);
        ctx.fillStyle = '#fcd9b6';
        ctx.fillRect(0, 0, 7, 2);
        ctx.restore();

        // Other arm
        ctx.fillStyle = '#fcd9b6';
        ctx.fillRect(6, 17, 6, 2);

        // Smile when focused
        if (isFocused) {
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(16, 11, 2, 0, Math.PI);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

      } else if (fieldType === 'email') {
        // Flying envelope
        const flyOffset = isFocused ? Math.sin(time * 3) * 3 : 0;
        const tilt = isFocused ? Math.sin(time * 2) * 0.1 : 0;

        ctx.save();
        ctx.translate(16, 16 + flyOffset);
        ctx.rotate(tilt);

        // Envelope body
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.fillRect(-8, -5, 16, 10);

        // Envelope flap
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(0, 2);
        ctx.lineTo(8, -5);
        ctx.closePath();
        ctx.fill();

        // @ symbol
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 8px Arial';
        ctx.fillText('@', -3, 3);

        ctx.restore();

        // Flying particles when focused
        if (isFocused) {
          for (let i = 0; i < 3; i++) {
            const px = 5 + ((time * 20 + i * 10) % 25);
            const py = 20 + Math.sin(time * 3 + i) * 3;
            ctx.fillStyle = '#10b981';
            ctx.globalAlpha = 0.5 * (1 - px / 25);
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

      } else if (fieldType === 'company') {
        // Mini office building
        ctx.fillStyle = '#334155';
        ctx.globalAlpha = alpha;
        ctx.fillRect(8, 8, 16, 18);

        // Windows that light up when focused
        const windowColors = isFocused ? ['#fbbf24', '#10b981', '#3b82f6', '#fbbf24'] : ['#1e293b', '#1e293b', '#1e293b', '#1e293b'];
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 2; col++) {
            const windowIdx = row * 2 + col;
            const lit = isFocused && Math.sin(time * 3 + windowIdx) > 0;
            ctx.fillStyle = lit ? windowColors[windowIdx] : '#1e293b';
            ctx.fillRect(10 + col * 6, 11 + row * 7, 4, 5);
          }
        }

        // Door
        ctx.fillStyle = '#10b981';
        ctx.fillRect(14, 21, 4, 5);

        // Antenna
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(16, 4);
        ctx.stroke();

        // Signal waves when focused
        if (isFocused) {
          for (let i = 0; i < 2; i++) {
            const waveR = 3 + ((time * 10 + i * 5) % 8);
            ctx.strokeStyle = '#10b981';
            ctx.globalAlpha = 0.5 * (1 - waveR / 8);
            ctx.beginPath();
            ctx.arc(16, 4, waveR, -Math.PI * 0.8, -Math.PI * 0.2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [fieldType, isFocused]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '32px', height: '32px' }}
        />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-lg border border-white/20 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};

// Animated Textarea with micro canvas animation
const AnimatedTextarea = ({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 32 * dpr;
    canvas.height = 32 * dpr;
    ctx.scale(dpr, dpr);

    const w = 32;
    const h = 32;
    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, w, h);

      const alpha = isFocused ? 1 : 0.5;

      // Lightbulb with ideas
      // Bulb
      ctx.fillStyle = isFocused ? '#fbbf24' : '#64748b';
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(16, 12, 7, 0, Math.PI * 2);
      ctx.fill();

      // Bulb base
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(13, 18, 6, 4);
      ctx.fillRect(14, 22, 4, 2);

      // Filament glow when focused
      if (isFocused) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.6 + Math.sin(time * 5) * 0.3;
        ctx.beginPath();
        ctx.arc(16, 11, 3, 0, Math.PI * 2);
        ctx.fill();

        // Sparkles/ideas floating up
        for (let i = 0; i < 4; i++) {
          const sparkY = 8 - ((time * 15 + i * 8) % 12);
          const sparkX = 12 + i * 3 + Math.sin(time * 2 + i) * 2;
          const sparkAlpha = 1 - (8 - sparkY) / 12;
          ctx.fillStyle = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][i];
          ctx.globalAlpha = sparkAlpha * 0.8;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isFocused]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-3 w-8 h-8 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '32px', height: '32px' }}
        />
      </div>
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        rows={rows}
        className="w-full rounded-lg border border-white/20 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        placeholder={placeholder}
      />
    </div>
  );
};

interface ProjectBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectType {
  id: string;
  title: string;
  icon: string;
  description: string;
  gradient: string;
}

const projectTypes: ProjectType[] = [
  {
    id: 'website',
    title: 'Website',
    icon: '🌐',
    description: 'Marketing sites, landing pages, blogs',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'webapp',
    title: 'Web App',
    icon: '⚡',
    description: 'Interactive applications, dashboards',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    icon: '🛒',
    description: 'Online stores, payment integration',
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    icon: '📱',
    description: 'iOS & Android applications',
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    id: 'saas',
    title: 'SaaS Platform',
    icon: '☁️',
    description: 'Multi-tenant, subscriptions, APIs',
    gradient: 'from-indigo-500 to-violet-400',
  },
  {
    id: 'other',
    title: 'Something Else',
    icon: '✨',
    description: 'Custom project or not sure yet',
    gradient: 'from-rose-500 to-pink-400',
  },
];

const budgetRanges = [
  { id: 'starter', label: 'Under $1K', description: 'Quick fixes, small tasks' },
  { id: 'small', label: '$1K - $5K', description: 'Small projects, MVPs' },
  { id: 'medium', label: '$5K - $15K', description: 'Medium complexity' },
  { id: 'large', label: '$15K - $50K', description: 'Large applications' },
  { id: 'enterprise', label: '$50K+', description: 'Enterprise solutions' },
  { id: 'discuss', label: "Let's Discuss", description: 'Flexible / Not sure' },
];

const timelines = [
  { id: 'asap', label: 'ASAP', description: 'Rush project' },
  { id: '1month', label: '1 Month', description: 'Quick turnaround' },
  { id: '2-3months', label: '2-3 Months', description: 'Standard timeline' },
  { id: '3-6months', label: '3-6 Months', description: 'Complex project' },
  { id: '6months+', label: '6+ Months', description: 'Long-term project' },
  { id: 'flexible', label: 'Flexible', description: 'No hard deadline' },
];

// Magnetic card component
const MagneticCard = ({
  children,
  selected,
  onClick,
  gradient,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  gradient: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { damping: 20, stiffness: 200 });
  const ySpring = useSpring(y, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
        selected
          ? 'border-white/50 bg-white/15'
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
      }`}
    >
      {/* Holographic shimmer on selected */}
      {selected && (
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(255,0,255,0.3) 0%, rgba(0,255,255,0.3) 50%, rgba(255,255,0,0.3) 100%)`,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Gradient accent on selected */}
      {selected && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 pointer-events-none`} />
      )}

      {/* Checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${gradient}`}
          >
            <Check className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default function ProjectBuilderModal({ isOpen, onClose }: ProjectBuilderModalProps) {
  const [step, setStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 4;

  const toggleProjectType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Build the email content
    const projectData = {
      name: formData.name,
      email: formData.email,
      company: formData.company || 'Not provided',
      project_types: selectedTypes.map(t => projectTypes.find(p => p.id === t)?.title).join(', '),
      budget: budgetRanges.find(b => b.id === selectedBudget)?.label || 'Not specified',
      timeline: timelines.find(t => t.id === selectedTimeline)?.label || 'Not specified',
      description: formData.description || 'No additional details provided',
      _subject: `New Project Request from ${formData.name}`,
    };

    try {
      // Send via Formspree - you'll need to create a form at formspree.io and replace the ID
      const response = await fetch('https://formspree.io/f/xldqnard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback: open mailto if Formspree fails
        const mailtoLink = `mailto:Conorlee8@gmail.com?subject=${encodeURIComponent(`Project Request from ${formData.name}`)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\n\nProject Type: ${projectData.project_types}\nBudget: ${projectData.budget}\nTimeline: ${projectData.timeline}\n\nDetails:\n${formData.description || 'None provided'}`
        )}`;
        window.open(mailtoLink, '_blank');
        setIsSubmitted(true);
      }
    } catch (error) {
      // Fallback to mailto on error
      const mailtoLink = `mailto:Conorlee8@gmail.com?subject=${encodeURIComponent(`Project Request from ${formData.name}`)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\n\nProject Type: ${projectData.project_types}\nBudget: ${projectData.budget}\nTimeline: ${projectData.timeline}\n\nDetails:\n${formData.description || 'None provided'}`
      )}`;
      window.open(mailtoLink, '_blank');
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedTypes.length > 0;
      case 2:
        return selectedBudget !== '';
      case 3:
        return selectedTimeline !== '';
      case 4:
        return formData.name && formData.email;
      default:
        return false;
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedTypes([]);
    setSelectedBudget('');
    setSelectedTimeline('');
    setFormData({ name: '', email: '', company: '', description: '' });
    setIsSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop - clicking here closes modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl"
          >
            {/* Animated Micro City Header */}
            <div className="relative h-[120px] w-full overflow-hidden border-b border-white/10">
              <MicroCityAnimation />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* Header content overlay */}
              <div className="absolute inset-0 flex items-end justify-between p-4 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                    {isSubmitted ? '🎉 Request Sent!' : "Let's Build Something Amazing"}
                  </h2>
                  {!isSubmitted && (
                    <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
                      Step {step} of {totalSteps}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Holographic scan line overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(16, 185, 129, 0.1) 3px, rgba(16, 185, 129, 0.1) 4px)',
                }}
              />
            </div>

            {/* Progress bar */}
            {!isSubmitted && (
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    >
                      <Check className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      Thanks, {formData.name}!
                    </h3>
                    <p className="mb-6 text-white/70">
                      I&apos;ll review your project details and get back to you within 24-48 hours.
                    </p>
                    <div className="rounded-xl bg-white/5 p-4 text-left">
                      <h4 className="mb-2 text-sm font-medium text-white/80">Project Summary:</h4>
                      <ul className="space-y-1 text-sm text-white/60">
                        <li>
                          <span className="text-white/80">Type:</span>{' '}
                          {selectedTypes.map((t) => projectTypes.find((p) => p.id === t)?.title).join(', ')}
                        </li>
                        <li>
                          <span className="text-white/80">Budget:</span>{' '}
                          {budgetRanges.find((b) => b.id === selectedBudget)?.label}
                        </li>
                        <li>
                          <span className="text-white/80">Timeline:</span>{' '}
                          {timelines.find((t) => t.id === selectedTimeline)?.label}
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-8 py-3 font-medium text-white transition-all hover:scale-105"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Step 1: Project Type */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          What are you building?
                        </h3>
                        <p className="mb-6 text-sm text-white/60">
                          Select all that apply
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {projectTypes.map((type) => (
                            <MagneticCard
                              key={type.id}
                              selected={selectedTypes.includes(type.id)}
                              onClick={() => toggleProjectType(type.id)}
                              gradient={type.gradient}
                            >
                              <div className="text-center">
                                {/* Isometric Animation */}
                                <div className="relative mx-auto mb-2 h-16 w-24 overflow-hidden rounded-lg bg-black/30">
                                  <IsometricAnimation
                                    type={type.id}
                                    isActive={selectedTypes.includes(type.id)}
                                  />
                                </div>
                                <h4 className="font-medium text-white">{type.title}</h4>
                                <p className="mt-1 text-xs text-white/50">{type.description}</p>
                              </div>
                            </MagneticCard>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Budget */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          What&apos;s your budget range?
                        </h3>
                        <p className="mb-6 text-sm text-white/60">
                          This helps me understand the scope
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {budgetRanges.map((budget) => (
                            <MagneticCard
                              key={budget.id}
                              selected={selectedBudget === budget.id}
                              onClick={() => setSelectedBudget(budget.id)}
                              gradient="from-green-500 to-emerald-400"
                            >
                              <div className="text-center">
                                {/* Budget Animation */}
                                <div className="relative mx-auto mb-2 h-12 w-20 overflow-hidden rounded-lg bg-black/30">
                                  <BudgetAnimation
                                    budgetId={budget.id}
                                    isActive={selectedBudget === budget.id}
                                  />
                                </div>
                                <h4 className="font-medium text-white">{budget.label}</h4>
                                <p className="mt-1 text-xs text-white/50">{budget.description}</p>
                              </div>
                            </MagneticCard>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Timeline */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          When do you need it?
                        </h3>
                        <p className="mb-6 text-sm text-white/60">
                          Select your ideal timeline
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {timelines.map((timeline) => (
                            <MagneticCard
                              key={timeline.id}
                              selected={selectedTimeline === timeline.id}
                              onClick={() => setSelectedTimeline(timeline.id)}
                              gradient="from-green-500 to-emerald-400"
                            >
                              <div className="text-center">
                                {/* Timeline Animation */}
                                <div className="relative mx-auto mb-2 h-12 w-20 overflow-hidden rounded-lg bg-black/30">
                                  <TimelineAnimation
                                    timelineId={timeline.id}
                                    isActive={selectedTimeline === timeline.id}
                                  />
                                </div>
                                <h4 className="font-medium text-white">{timeline.label}</h4>
                                <p className="mt-1 text-xs text-white/50">{timeline.description}</p>
                              </div>
                            </MagneticCard>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Contact Info */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Almost done! How can I reach you?
                        </h3>
                        <p className="mb-6 text-sm text-white/60">
                          I&apos;ll get back to you within 24-48 hours
                        </p>
                        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-white/80">
                              Name *
                            </label>
                            <AnimatedInput
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Your name"
                              autoComplete="name"
                              fieldType="name"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-white/80">
                              Email *
                            </label>
                            <AnimatedInput
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="you@company.com"
                              autoComplete="email"
                              fieldType="email"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-white/80">
                              Company
                            </label>
                            <AnimatedInput
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Your company (optional)"
                              autoComplete="organization"
                              fieldType="company"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-white/80">
                              Project Details
                            </label>
                            <AnimatedTextarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Tell me a bit about your project... (optional)"
                              rows={3}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with navigation */}
            {!isSubmitted && (
              <div className="flex items-center justify-between border-t border-white/10 p-6">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {/* Selected types floating preview */}
                {step === 1 && selectedTypes.length > 0 && (
                  <div className="hidden items-center gap-2 sm:flex">
                    {selectedTypes.slice(0, 3).map((typeId) => {
                      const type = projectTypes.find((t) => t.id === typeId);
                      return (
                        <motion.span
                          key={typeId}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xl"
                        >
                          {type?.icon}
                        </motion.span>
                      );
                    })}
                    {selectedTypes.length > 3 && (
                      <span className="text-sm text-white/50">+{selectedTypes.length - 3}</span>
                    )}
                  </div>
                )}

                {step < 4 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-2 font-medium text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-2 font-medium text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Request
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
