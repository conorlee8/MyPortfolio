'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePath } from '@/contexts/PathContext';

interface HackingInterfaceProps {
  onComplete: () => void;
}

type PathType = 'freelance' | 'fulltime' | null;

// Pixel Art Lofi City - Freelance Side (Green/Cyan theme) - ULTRA DETAILED
const FreelanceWorldAnimation = ({ isHovered }: { isHovered: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const w = 400;
    const h = 200;
    let time = 0;
    let animationId: number;

    // Raindrops - more of them
    const raindrops: { x: number; y: number; speed: number; length: number }[] = [];
    for (let i = 0; i < 80; i++) {
      raindrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 2 + Math.random() * 4,
        length: 3 + Math.random() * 10
      });
    }

    // Steam particles
    const steam: { x: number; y: number; life: number }[] = [];
    for (let i = 0; i < 8; i++) {
      steam.push({ x: 272, y: 165 - i * 3, life: Math.random() });
    }

    // Cars moving (Japanese kei style)
    interface Car { x: number; y: number; speed: number; color: string; type: number }
    const cars: Car[] = [
      { x: 0, y: 166, speed: 0.5, color: '#10b981', type: 0 },
      { x: 200, y: 172, speed: -0.35, color: '#22d3ee', type: 1 },
      { x: 100, y: 169, speed: 0.4, color: '#f472b6', type: 0 },
    ];

    // Birds
    const birds: { x: number; y: number; speed: number }[] = [
      { x: 50, y: 40, speed: 0.3 },
      { x: 120, y: 35, speed: 0.25 },
    ];

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // ===== SKY - Multi-layer gradient =====
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#050510');
      sky.addColorStop(0.15, '#0a0a20');
      sky.addColorStop(0.3, '#101030');
      sky.addColorStop(0.5, '#151540');
      sky.addColorStop(0.7, '#1a2040');
      sky.addColorStop(1, '#0f1525');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // ===== STARS - Multiple layers =====
      // Distant small stars
      for (let i = 0; i < 60; i++) {
        const sx = (i * 37) % w;
        const sy = (i * 13) % 55;
        const twinkle = 0.2 + Math.sin(time * 3 + i * 0.5) * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = twinkle * 0.4;
        ctx.fillRect(sx, sy, 1, 1);
      }
      // Brighter stars
      for (let i = 0; i < 15; i++) {
        const sx = (i * 67 + 20) % w;
        const sy = (i * 11) % 45;
        const twinkle = 0.4 + Math.sin(time * 2 + i) * 0.4;
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = i % 3 === 0 ? '#a0d8ff' : '#ffffff';
        ctx.fillRect(sx, sy, 1, 1);
        if (i % 5 === 0) {
          ctx.globalAlpha = twinkle * 0.3;
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        }
      }
      ctx.globalAlpha = 1;

      // ===== CLOUDS - Layered with parallax =====
      // Far clouds
      ctx.fillStyle = 'rgba(30, 40, 60, 0.3)';
      ctx.beginPath();
      ctx.arc(50 + Math.sin(time * 0.1) * 2, 35, 25, 0, Math.PI * 2);
      ctx.arc(75, 30, 18, 0, Math.PI * 2);
      ctx.arc(100, 35, 22, 0, Math.PI * 2);
      ctx.fill();
      // Near clouds
      ctx.fillStyle = 'rgba(40, 55, 80, 0.35)';
      ctx.beginPath();
      ctx.arc(250 + Math.sin(time * 0.15) * 3, 25, 20, 0, Math.PI * 2);
      ctx.arc(275, 20, 15, 0, Math.PI * 2);
      ctx.arc(295, 25, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(340, 40, 12, 0, Math.PI * 2);
      ctx.arc(355, 38, 10, 0, Math.PI * 2);
      ctx.fill();

      // ===== MOON - Detailed with craters =====
      // Glow layers
      ctx.fillStyle = 'rgba(255, 240, 200, 0.05)';
      ctx.beginPath();
      ctx.arc(360, 28, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 240, 200, 0.1)';
      ctx.beginPath();
      ctx.arc(360, 28, 25, 0, Math.PI * 2);
      ctx.fill();
      // Moon body
      ctx.fillStyle = '#fef9e7';
      ctx.beginPath();
      ctx.arc(360, 28, 16, 0, Math.PI * 2);
      ctx.fill();
      // Craters
      ctx.fillStyle = 'rgba(200, 180, 150, 0.3)';
      ctx.beginPath();
      ctx.arc(355, 25, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(365, 32, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(358, 33, 2, 0, Math.PI * 2);
      ctx.fill();

      // ===== BIRDS =====
      birds.forEach((bird, bi) => {
        bird.x += bird.speed;
        if (bird.x > w + 20) bird.x = -20;
        const wingY = Math.sin(time * 8 + bi * 2) * 2;
        ctx.fillStyle = '#1a1a2a';
        // Body
        ctx.fillRect(bird.x, bird.y, 4, 2);
        // Wings
        ctx.fillRect(bird.x - 2, bird.y + wingY, 2, 1);
        ctx.fillRect(bird.x + 4, bird.y - wingY, 2, 1);
      });

      // ===== FAR BACKGROUND BUILDINGS (Layer 1) =====
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 50, 15, 130);
      ctx.fillRect(12, 65, 12, 115);
      ctx.fillRect(320, 45, 20, 135);
      ctx.fillRect(345, 55, 18, 125);
      ctx.fillRect(368, 70, 32, 110);
      // Tiny windows
      ctx.fillStyle = 'rgba(255, 180, 100, 0.25)';
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(3 + (i % 2) * 5, 60 + i * 10, 2, 2);
        ctx.fillRect(328 + (i % 3) * 4, 55 + i * 9, 1, 2);
        ctx.fillRect(375 + (i % 4) * 5, 80 + i * 8, 2, 2);
      }

      // ===== POWER LINES & UTILITY POLES =====
      // Left pole with transformer
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(25, 35, 5, 145);
      ctx.fillStyle = '#252530';
      ctx.fillRect(22, 45, 11, 8); // Transformer box
      ctx.fillRect(20, 55, 15, 3); // Cross beam
      // Right pole
      ctx.fillRect(385, 45, 5, 135);
      ctx.fillRect(382, 55, 11, 3);
      // Power lines with sag
      ctx.strokeStyle = '#252530';
      ctx.lineWidth = 0.8;
      for (let line = 0; line < 3; line++) {
        ctx.beginPath();
        ctx.moveTo(27, 48 + line * 8);
        ctx.quadraticCurveTo(200, 65 + line * 10, 387, 50 + line * 8);
        ctx.stroke();
      }

      // ===== MAIN BUILDING 1 - Left Japanese Apartment =====
      ctx.fillStyle = '#151520';
      ctx.fillRect(40, 42, 72, 138);
      // Building texture/panels
      ctx.fillStyle = '#1a1a28';
      ctx.fillRect(42, 44, 68, 134);
      // Edge details
      ctx.fillStyle = '#202030';
      ctx.fillRect(40, 42, 3, 138);
      ctx.fillRect(109, 42, 3, 138);
      // Horizontal floor lines
      ctx.fillStyle = '#252535';
      for (let f = 0; f < 7; f++) {
        ctx.fillRect(40, 60 + f * 20, 72, 2);
      }

      // Rooftop - detailed
      ctx.fillStyle = '#252535';
      ctx.fillRect(42, 38, 68, 6); // Roof edge
      // Water tank
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(48, 25, 18, 15);
      ctx.fillStyle = '#353545';
      ctx.fillRect(50, 27, 14, 11);
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(52, 29, 10, 7);
      // Pipes from tank
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(66, 32, 20, 2);
      ctx.fillRect(84, 32, 2, 10);

      // Antenna array
      ctx.fillStyle = '#303040';
      ctx.fillRect(92, 18, 3, 24);
      ctx.fillRect(88, 25, 11, 2);
      ctx.fillRect(96, 22, 2, 16);
      // Blinking lights
      ctx.fillStyle = Math.sin(time * 4) > 0 ? '#ff4444' : '#440000';
      ctx.fillRect(92, 16, 3, 3);
      ctx.fillStyle = Math.sin(time * 5 + 1) > 0 ? '#ff4444' : '#440000';
      ctx.fillRect(96, 20, 2, 2);

      // AC units on roof
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(70, 30, 12, 10);
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(72, 32, 8, 6);
      // Fan animation
      const fanAngle = time * 10;
      ctx.fillStyle = '#3a3a4a';
      ctx.save();
      ctx.translate(76, 35);
      ctx.rotate(fanAngle);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.fillRect(-1, -3, 2, 6);
      ctx.restore();

      // Windows - detailed with life inside
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = 47 + col * 22;
          const wy = 48 + row * 20;

          // Window recess
          ctx.fillStyle = '#0a0a12';
          ctx.fillRect(wx - 2, wy - 1, 18, 14);

          const lit = isHovered ? Math.sin(time * 2 + row + col) > -0.3 : (row + col) % 3 === 0;

          if (lit) {
            // Warm interior gradient
            const windowGrad = ctx.createLinearGradient(wx, wy, wx, wy + 12);
            windowGrad.addColorStop(0, 'rgba(255, 200, 120, 0.7)');
            windowGrad.addColorStop(1, 'rgba(255, 160, 80, 0.5)');
            ctx.fillStyle = windowGrad;
            ctx.fillRect(wx, wy, 14, 12);

            // Curtains (various styles)
            if ((row + col) % 3 === 0) {
              ctx.fillStyle = 'rgba(80, 60, 50, 0.6)';
              ctx.fillRect(wx, wy, 5, 12);
              ctx.fillRect(wx + 9, wy, 5, 12);
            } else if ((row + col) % 4 === 1) {
              // Blinds
              ctx.fillStyle = 'rgba(60, 50, 40, 0.4)';
              for (let b = 0; b < 4; b++) {
                ctx.fillRect(wx, wy + b * 3, 14, 1);
              }
            }

            // Silhouettes
            if (row === 2 && col === 1) {
              // Person at desk
              ctx.fillStyle = 'rgba(0,0,0,0.4)';
              ctx.fillRect(wx + 4, wy + 4, 4, 8);
              ctx.fillRect(wx + 3, wy + 2, 6, 3);
            } else if (row === 4 && col === 0) {
              // TV glow
              ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
              ctx.fillRect(wx + 2, wy + 6, 6, 4);
            }
          } else {
            ctx.fillStyle = '#0c0c15';
            ctx.fillRect(wx, wy, 14, 12);
            // Reflection
            ctx.fillStyle = 'rgba(80, 120, 180, 0.08)';
            ctx.fillRect(wx + 1, wy + 1, 5, 4);
          }

          // Window frame
          ctx.fillStyle = '#303040';
          ctx.fillRect(wx + 6, wy, 2, 12);
          ctx.fillRect(wx, wy + 5, 14, 2);
        }
      }

      // Cat in window
      const catY = 48 + 2 * 20;
      const catX = 47;
      ctx.fillStyle = 'rgba(40, 35, 30, 0.9)';
      ctx.beginPath();
      ctx.ellipse(catX + 8, catY + 8, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(catX + 5, catY + 6, 3, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(catX + 3, catY + 4);
      ctx.lineTo(catX + 2, catY + 1);
      ctx.lineTo(catX + 5, catY + 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(catX + 6, catY + 4);
      ctx.lineTo(catX + 7, catY + 1);
      ctx.lineTo(catX + 8, catY + 3);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(catX + 4, catY + 5, 1, 1);
      ctx.fillRect(catX + 6, catY + 5, 1, 1);
      // Tail
      ctx.strokeStyle = 'rgba(40, 35, 30, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(catX + 12, catY + 7);
      ctx.quadraticCurveTo(catX + 16, catY + 4, catX + 14, catY + 2);
      ctx.stroke();

      // Balconies with detailed plants
      for (let i = 0; i < 3; i++) {
        const balY = 62 + i * 40;
        // Balcony structure
        ctx.fillStyle = '#353545';
        ctx.fillRect(37, balY, 8, 3);
        // Railing
        ctx.strokeStyle = '#404050';
        ctx.lineWidth = 1;
        ctx.strokeRect(37, balY - 10, 8, 12);
        // Railing bars
        ctx.fillStyle = '#404050';
        ctx.fillRect(39, balY - 10, 1, 12);
        ctx.fillRect(42, balY - 10, 1, 12);

        // Plant pot
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(38, balY - 3, 5, 4);
        // Plants
        ctx.fillStyle = '#2d5a3d';
        ctx.fillRect(38, balY - 8, 2, 6);
        ctx.fillRect(40, balY - 10, 2, 8);
        ctx.fillRect(42, balY - 7, 1, 5);
        ctx.fillStyle = '#3d7a4d';
        ctx.fillRect(39, balY - 11, 2, 4);
        ctx.fillRect(41, balY - 9, 1, 3);
        // Flowers
        if (i === 1) {
          ctx.fillStyle = '#ff6b9d';
          ctx.fillRect(39, balY - 12, 2, 2);
          ctx.fillStyle = '#ffb347';
          ctx.fillRect(41, balY - 10, 1, 1);
        }
      }

      // Laundry hanging
      ctx.strokeStyle = '#404050';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(37, 105);
      ctx.lineTo(30, 105);
      ctx.stroke();
      // Clothes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(32, 106, 3, 5);
      ctx.fillStyle = '#6b9fff';
      ctx.fillRect(35, 106, 2, 6);

      // Drainpipe with water
      ctx.fillStyle = '#303040';
      ctx.fillRect(110, 60, 3, 120);
      // Drip animation
      const dripY = (time * 30) % 40;
      ctx.fillStyle = 'rgba(100, 180, 255, 0.5)';
      ctx.fillRect(111, 140 + dripY, 2, 3);

      // ===== BUILDING 2 - Center Shop Building =====
      ctx.fillStyle = '#181825';
      ctx.fillRect(118, 68, 82, 112);
      ctx.fillStyle = '#1e1e2e';
      ctx.fillRect(120, 70, 78, 108);

      // Upper windows
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const wx = 126 + col * 18;
          const wy = 78 + row * 18;
          const lit = isHovered ? Math.sin(time * 1.5 + row * 2 + col) > -0.2 : (row + col) % 2 === 0;
          ctx.fillStyle = '#08080f';
          ctx.fillRect(wx - 1, wy - 1, 15, 13);
          ctx.fillStyle = lit ? 'rgba(255, 210, 140, 0.55)' : '#0a0a12';
          ctx.fillRect(wx, wy, 13, 11);
          if (lit && row === 1 && col === 2) {
            // Plant silhouette
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(wx + 8, wy + 4, 4, 7);
          }
          ctx.fillStyle = '#282838';
          ctx.fillRect(wx + 6, wy, 1, 11);
        }
      }

      // Neon sign - Japanese vertical
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(198, 75, 12, 45);
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = time % 45 < 38 ? 15 : 6;
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px monospace';
      ctx.save();
      ctx.translate(207, 80);
      ctx.fillText('O', 0, 0);
      ctx.fillText('P', 0, 11);
      ctx.fillText('E', 0, 22);
      ctx.fillText('N', 0, 33);
      ctx.restore();
      ctx.shadowBlur = 0;

      // Shop awning - striped with scallops
      ctx.fillStyle = '#10b981';
      ctx.fillRect(118, 148, 82, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let i = 0; i < 14; i++) {
        ctx.fillRect(120 + i * 6, 148, 3, 6);
      }
      // Scallop edge
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#10b981' : 'rgba(16, 185, 129, 0.6)';
        ctx.beginPath();
        ctx.arc(121 + i * 5, 154, 3, 0, Math.PI);
        ctx.fill();
      }

      // Shop windows with display
      ctx.fillStyle = '#050508';
      ctx.fillRect(123, 157, 35, 23);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.35)';
      ctx.fillRect(125, 159, 31, 19);
      // Display items
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(128, 168, 6, 9);
      ctx.fillStyle = '#4ecdc4';
      ctx.fillRect(138, 166, 5, 11);
      ctx.fillStyle = '#ffd93d';
      ctx.fillRect(147, 170, 4, 7);

      // Shop door
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(162, 157, 15, 23);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
      ctx.fillRect(164, 159, 11, 15);
      // Door handle
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(173, 168, 2, 4);

      // Vending machine - detailed
      ctx.fillStyle = '#252535';
      ctx.fillRect(182, 155, 16, 25);
      ctx.fillStyle = time % 80 < 40 ? '#ff6b6b' : '#4ecdc4';
      ctx.shadowColor = time % 80 < 40 ? '#ff6b6b' : '#4ecdc4';
      ctx.shadowBlur = 8;
      ctx.fillRect(184, 157, 12, 13);
      ctx.shadowBlur = 0;
      // Drink slots
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(184, 171, 12, 7);
      // Coin slot
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(194, 165, 2, 3);

      // ===== BUILDING 3 - Right Taller Building =====
      ctx.fillStyle = '#151522';
      ctx.fillRect(208, 50, 68, 130);
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(210, 52, 64, 126);
      ctx.fillStyle = '#202032';
      ctx.fillRect(208, 50, 3, 130);
      ctx.fillRect(273, 50, 3, 130);

      // Rooftop
      ctx.fillStyle = '#252538';
      ctx.fillRect(210, 46, 64, 6);
      // Rooftop AC
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(250, 38, 15, 10);

      // Windows
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = 218 + col * 20;
          const wy = 58 + row * 22;
          const lit = Math.sin(time + row + col * 2) > 0;
          ctx.fillStyle = '#08080f';
          ctx.fillRect(wx - 1, wy - 1, 16, 17);
          ctx.fillStyle = lit ? 'rgba(255, 180, 100, 0.5)' : '#0b0b14';
          ctx.fillRect(wx, wy, 14, 15);
          ctx.fillStyle = '#282838';
          ctx.fillRect(wx + 6, wy, 2, 15);
          ctx.fillRect(wx, wy + 7, 14, 1);
        }
      }

      // AC units - detailed
      for (let i = 0; i < 4; i++) {
        const acY = 65 + i * 28;
        ctx.fillStyle = '#353545';
        ctx.fillRect(274, acY, 10, 14);
        ctx.fillStyle = '#252535';
        ctx.fillRect(275, acY + 2, 8, 10);
        // Grille
        ctx.fillStyle = '#1a1a25';
        for (let g = 0; g < 3; g++) {
          ctx.fillRect(276, acY + 3 + g * 3, 6, 1);
        }
        // Drip
        if (time % 60 > 30 && i % 2 === 0) {
          ctx.fillStyle = 'rgba(100, 180, 255, 0.6)';
          ctx.fillRect(279, acY + 15 + (time % 30) * 0.3, 1, 3);
        }
      }

      // Pink neon CAFE sign
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(213, 158, 45, 12);
      ctx.shadowColor = '#ff6b9d';
      ctx.shadowBlur = time % 50 < 42 ? 12 : 5;
      ctx.fillStyle = '#ff6b9d';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('CAFE', 220, 168);
      ctx.shadowBlur = 0;

      // Coffee cup sign
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.fillRect(255, 160, 7, 8);
      ctx.fillRect(253, 158, 11, 3);
      // Steam from cup
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      const steamOffset = Math.sin(time * 3) * 2;
      ctx.fillRect(256 + steamOffset, 154, 1, 3);
      ctx.fillRect(258 - steamOffset, 152, 1, 4);

      // ===== SMALL BUILDING - Far Right =====
      ctx.fillStyle = '#1a1a28';
      ctx.fillRect(288, 115, 50, 65);
      // Cyan awning
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(285, 113, 55, 5);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(287 + i * 6, 113, 3, 5);
      }
      // Window
      ctx.fillStyle = 'rgba(255, 200, 100, 0.45)';
      ctx.fillRect(293, 125, 40, 22);
      // Bicycle parked
      ctx.fillStyle = '#404050';
      ctx.fillRect(342, 168, 10, 1);
      ctx.strokeStyle = '#404050';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(345, 172, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(352, 172, 4, 0, Math.PI * 2);
      ctx.stroke();

      // ===== STREET LEVEL =====
      // Sidewalk
      ctx.fillStyle = '#252530';
      ctx.fillRect(0, 180, w, 6);
      // Sidewalk tiles
      ctx.strokeStyle = '#353540';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 10, 180);
        ctx.lineTo(i * 10, 186);
        ctx.stroke();
      }

      // Street
      ctx.fillStyle = '#151520';
      ctx.fillRect(0, 186, w, 14);
      // Road markings
      ctx.fillStyle = '#303040';
      for (let i = 0; i < 15; i++) {
        const markX = (i * 35 + time * 12) % (w + 35) - 17;
        ctx.fillRect(markX, 193, 18, 2);
      }

      // Manhole
      ctx.fillStyle = '#202030';
      ctx.beginPath();
      ctx.ellipse(180, 190, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Street lamps - detailed
      [145, 315].forEach((lampX, li) => {
        // Pole
        ctx.fillStyle = '#252535';
        ctx.fillRect(lampX, 135, 4, 50);
        // Arm
        ctx.fillRect(lampX - 5, 133, 14, 4);
        // Lamp housing
        ctx.fillStyle = '#353545';
        ctx.fillRect(lampX - 3, 136, 10, 5);
        // Light
        ctx.fillStyle = 'rgba(255, 200, 100, 0.95)';
        ctx.shadowColor = 'rgba(255, 200, 100, 1)';
        ctx.shadowBlur = 20;
        ctx.fillRect(lampX - 1, 138, 6, 3);
        ctx.shadowBlur = 0;
        // Light cone
        ctx.fillStyle = 'rgba(255, 200, 100, 0.05)';
        ctx.beginPath();
        ctx.moveTo(lampX + 2, 141);
        ctx.lineTo(lampX - 18, 186);
        ctx.lineTo(lampX + 22, 186);
        ctx.closePath();
        ctx.fill();
      });

      // Trash can
      ctx.fillStyle = '#353545';
      ctx.fillRect(98, 170, 8, 12);
      ctx.fillStyle = '#404050';
      ctx.fillRect(97, 168, 10, 3);
      // Trash bag
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(107, 173, 5, 7);

      // ===== CARS - Japanese Kei Style =====
      cars.forEach(car => {
        car.x += car.speed;
        if (car.x > w + 25) car.x = -30;
        if (car.x < -30) car.x = w + 25;

        const carY = car.y;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(car.x - 1, carY + 9, 22, 3);

        // Body
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, carY + 2, 20, 7);
        ctx.fillRect(car.x + 3, carY - 4, 14, 7);

        // Windows
        ctx.fillStyle = 'rgba(135, 206, 235, 0.7)';
        ctx.fillRect(car.x + 5, carY - 3, 4, 5);
        ctx.fillRect(car.x + 11, carY - 3, 4, 5);

        // Headlights/taillights
        ctx.fillStyle = car.speed > 0 ? '#ffffaa' : '#ff4444';
        ctx.shadowColor = car.speed > 0 ? '#ffffaa' : '#ff4444';
        ctx.shadowBlur = 5;
        ctx.fillRect(car.speed > 0 ? car.x + 18 : car.x, carY + 4, 2, 3);
        ctx.shadowBlur = 0;

        // Wheels
        ctx.fillStyle = '#151520';
        ctx.beginPath();
        ctx.arc(car.x + 5, carY + 9, 3, 0, Math.PI * 2);
        ctx.arc(car.x + 15, carY + 9, 3, 0, Math.PI * 2);
        ctx.fill();
        // Hubcaps
        ctx.fillStyle = '#353545';
        ctx.beginPath();
        ctx.arc(car.x + 5, carY + 9, 1.5, 0, Math.PI * 2);
        ctx.arc(car.x + 15, carY + 9, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== PUDDLE REFLECTIONS =====
      ctx.fillStyle = 'rgba(80, 120, 180, 0.12)';
      ctx.fillRect(70, 194, 50, 6);
      ctx.fillRect(190, 195, 45, 5);
      ctx.fillRect(300, 194, 35, 6);
      // Neon reflections in puddles
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.fillRect(195, 196, 20, 3);
      ctx.fillStyle = 'rgba(255, 107, 157, 0.1)';
      ctx.fillRect(215, 195, 15, 4);
      // Ripples
      ctx.strokeStyle = 'rgba(150, 180, 220, 0.15)';
      ctx.lineWidth = 0.5;
      const rippleX = 85 + Math.sin(time) * 10;
      ctx.beginPath();
      ctx.ellipse(rippleX, 196, 4 + Math.sin(time * 2) * 2, 1, 0, 0, Math.PI * 2);
      ctx.stroke();

      // ===== STEAM FROM VENT =====
      steam.forEach((s, i) => {
        s.life += 0.02;
        if (s.life > 1) {
          s.life = 0;
          s.y = 165;
        }
        s.y -= 0.3;
        s.x = 272 + Math.sin(time * 2 + i) * 3;
        ctx.fillStyle = `rgba(200, 210, 220, ${0.3 * (1 - s.life)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 + s.life * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== RAIN =====
      ctx.strokeStyle = 'rgba(140, 170, 220, 0.35)';
      ctx.lineWidth = 0.6;
      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1.5, drop.y + drop.length);
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > h) {
          drop.y = -10;
          drop.x = Math.random() * w;
        }
      });

      // Rain splashes on ground
      for (let i = 0; i < 8; i++) {
        if ((time * 10 + i * 3) % 15 < 7) {
          ctx.fillStyle = 'rgba(140, 170, 220, 0.25)';
          const splashX = (i * 53 + time * 20) % w;
          ctx.fillRect(splashX, 184, 2, 1);
          ctx.fillRect(splashX - 1, 183, 1, 1);
          ctx.fillRect(splashX + 2, 183, 1, 1);
        }
      }

      // ===== ATMOSPHERIC FOG =====
      ctx.fillStyle = 'rgba(100, 120, 150, 0.03)';
      ctx.fillRect(0, 140, w, 60);

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Pixel Art Lofi City - Full-time Side (Red/Orange corporate theme) - ULTRA DETAILED
const FulltimeWorldAnimation = ({ isHovered }: { isHovered: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const w = 400;
    const h = 200;
    let time = 0;
    let animationId: number;

    // Raindrops - more of them
    const raindrops: { x: number; y: number; speed: number; length: number }[] = [];
    for (let i = 0; i < 80; i++) {
      raindrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 2 + Math.random() * 4,
        length: 3 + Math.random() * 10
      });
    }

    // Steam particles
    const steam: { x: number; y: number; life: number }[] = [];
    for (let i = 0; i < 8; i++) {
      steam.push({ x: 352, y: 152 - i * 3, life: Math.random() });
    }

    // Cars moving (Japanese kei style)
    interface Car { x: number; y: number; speed: number; color: string; type: number }
    const cars: Car[] = [
      { x: 50, y: 166, speed: 0.45, color: '#ef4444', type: 0 },
      { x: 300, y: 172, speed: -0.5, color: '#f97316', type: 1 },
      { x: 150, y: 169, speed: 0.35, color: '#fbbf24', type: 0 },
    ];

    // Birds
    const birds: { x: number; y: number; speed: number }[] = [
      { x: 280, y: 38, speed: 0.25 },
      { x: 350, y: 32, speed: 0.2 },
    ];

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // ===== SKY - Warm sunset gradient =====
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#050508');
      sky.addColorStop(0.1, '#100815');
      sky.addColorStop(0.25, '#1a0a20');
      sky.addColorStop(0.4, '#251030');
      sky.addColorStop(0.55, '#1a1530');
      sky.addColorStop(0.7, '#151525');
      sky.addColorStop(1, '#0a0a18');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // ===== STARS =====
      // Distant small stars
      for (let i = 0; i < 50; i++) {
        const sx = (i * 41) % w;
        const sy = (i * 11) % 50;
        const twinkle = 0.2 + Math.sin(time * 3 + i * 0.5) * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = twinkle * 0.35;
        ctx.fillRect(sx, sy, 1, 1);
      }
      // Brighter colored stars
      for (let i = 0; i < 12; i++) {
        const sx = (i * 71 + 30) % w;
        const sy = (i * 9) % 40;
        const twinkle = 0.4 + Math.sin(time * 2 + i) * 0.4;
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = i % 4 === 0 ? '#ffaa80' : i % 3 === 0 ? '#ffd0a0' : '#ffffff';
        ctx.fillRect(sx, sy, 1, 1);
        if (i % 4 === 0) {
          ctx.globalAlpha = twinkle * 0.25;
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        }
      }
      ctx.globalAlpha = 1;

      // ===== CLOUDS - Warm tinted =====
      ctx.fillStyle = 'rgba(50, 30, 50, 0.35)';
      ctx.beginPath();
      ctx.arc(280 + Math.sin(time * 0.12) * 2, 28, 22, 0, Math.PI * 2);
      ctx.arc(305, 22, 16, 0, Math.PI * 2);
      ctx.arc(328, 28, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(40, 25, 45, 0.3)';
      ctx.beginPath();
      ctx.arc(60 + Math.sin(time * 0.1) * 3, 35, 18, 0, Math.PI * 2);
      ctx.arc(82, 30, 14, 0, Math.PI * 2);
      ctx.arc(100, 36, 16, 0, Math.PI * 2);
      ctx.fill();

      // ===== MOON - Large with warm glow =====
      // Glow layers
      ctx.fillStyle = 'rgba(255, 200, 150, 0.04)';
      ctx.beginPath();
      ctx.arc(45, 35, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 180, 120, 0.08)';
      ctx.beginPath();
      ctx.arc(45, 35, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 160, 100, 0.12)';
      ctx.beginPath();
      ctx.arc(45, 35, 22, 0, Math.PI * 2);
      ctx.fill();
      // Moon body
      ctx.fillStyle = '#fef5e0';
      ctx.beginPath();
      ctx.arc(45, 35, 18, 0, Math.PI * 2);
      ctx.fill();
      // Craters
      ctx.fillStyle = 'rgba(220, 180, 140, 0.3)';
      ctx.beginPath();
      ctx.arc(40, 30, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(52, 38, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(42, 42, 2, 0, Math.PI * 2);
      ctx.fill();

      // ===== BIRDS =====
      birds.forEach((bird, bi) => {
        bird.x += bird.speed;
        if (bird.x > w + 20) bird.x = -20;
        const wingY = Math.sin(time * 7 + bi * 2.5) * 2;
        ctx.fillStyle = '#151520';
        ctx.fillRect(bird.x, bird.y, 4, 2);
        ctx.fillRect(bird.x - 2, bird.y + wingY, 2, 1);
        ctx.fillRect(bird.x + 4, bird.y - wingY, 2, 1);
      });

      // ===== FAR BACKGROUND BUILDINGS =====
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 55, 18, 125);
      ctx.fillRect(15, 70, 14, 110);
      ctx.fillRect(340, 48, 22, 132);
      ctx.fillRect(365, 60, 18, 120);
      ctx.fillRect(378, 75, 22, 105);
      // Tiny windows with warm glow
      ctx.fillStyle = 'rgba(255, 150, 80, 0.25)';
      for (let i = 0; i < 12; i++) {
        ctx.fillRect(4 + (i % 2) * 6, 65 + i * 8, 2, 2);
        ctx.fillRect(348 + (i % 3) * 5, 55 + i * 9, 2, 2);
        ctx.fillRect(382 + (i % 3) * 4, 85 + i * 7, 1, 2);
      }

      // ===== POWER LINES & UTILITY POLES =====
      // Left pole with transformer
      ctx.fillStyle = '#18181f';
      ctx.fillRect(20, 38, 5, 142);
      ctx.fillStyle = '#222230';
      ctx.fillRect(17, 48, 11, 8);
      ctx.fillRect(15, 58, 15, 3);
      // Right pole
      ctx.fillRect(385, 48, 5, 132);
      ctx.fillRect(382, 58, 11, 3);
      // Power lines
      ctx.strokeStyle = '#222230';
      ctx.lineWidth = 0.8;
      for (let line = 0; line < 3; line++) {
        ctx.beginPath();
        ctx.moveTo(22, 50 + line * 8);
        ctx.quadraticCurveTo(200, 68 + line * 10, 387, 52 + line * 8);
        ctx.stroke();
      }

      // ===== MAIN CORPORATE TOWER - Center =====
      ctx.fillStyle = '#121220';
      ctx.fillRect(140, 28, 85, 152);
      ctx.fillStyle = '#181828';
      ctx.fillRect(143, 31, 79, 146);
      // Building edges
      ctx.fillStyle = '#1e1e30';
      ctx.fillRect(140, 28, 4, 152);
      ctx.fillRect(221, 28, 4, 152);
      // Floor lines
      ctx.fillStyle = '#252538';
      for (let f = 0; f < 9; f++) {
        ctx.fillRect(140, 48 + f * 16, 85, 2);
      }

      // Rooftop - detailed
      ctx.fillStyle = '#252538';
      ctx.fillRect(143, 22, 79, 8);
      // Helipad markings
      ctx.fillStyle = '#353548';
      ctx.beginPath();
      ctx.arc(182, 18, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(182, 18, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 6px monospace';
      ctx.fillText('H', 179, 20);

      // Water tank
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(148, 10, 18, 14);
      ctx.fillStyle = '#353548';
      ctx.fillRect(150, 12, 14, 10);

      // Antenna array
      ctx.fillStyle = '#303042';
      ctx.fillRect(200, 5, 3, 25);
      ctx.fillRect(196, 12, 11, 2);
      ctx.fillRect(208, 8, 3, 20);
      ctx.fillRect(214, 12, 2, 15);
      // Blinking lights
      ctx.fillStyle = Math.sin(time * 3) > 0 ? '#ff4444' : '#440000';
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = Math.sin(time * 3) > 0 ? 8 : 0;
      ctx.fillRect(200, 3, 3, 3);
      ctx.shadowBlur = 0;
      ctx.fillStyle = Math.sin(time * 4 + 1) > 0 ? '#ff4444' : '#440000';
      ctx.fillRect(208, 6, 3, 2);
      ctx.fillStyle = Math.sin(time * 5 + 2) > 0 ? '#ff4444' : '#440000';
      ctx.fillRect(214, 10, 2, 2);

      // Corporate logo - RED neon
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(155, 24, 55, 14);
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = time % 40 < 33 ? 18 : 7;
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('CORP', 163, 35);
      ctx.shadowBlur = 0;

      // Windows grid - detailed
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 4; col++) {
          const wx = 150 + col * 18;
          const wy = 42 + row * 16;

          // Window recess
          ctx.fillStyle = '#08080f';
          ctx.fillRect(wx - 1, wy - 1, 15, 13);

          const lit = isHovered ? Math.sin(time * 1.8 + row + col * 2) > -0.4 : (row + col) % 3 === 0;

          if (lit) {
            const windowGrad = ctx.createLinearGradient(wx, wy, wx, wy + 11);
            windowGrad.addColorStop(0, 'rgba(255, 180, 100, 0.6)');
            windowGrad.addColorStop(1, 'rgba(255, 140, 60, 0.4)');
            ctx.fillStyle = windowGrad;
            ctx.fillRect(wx, wy, 13, 11);

            // Blinds on some
            if ((row + col) % 4 === 0) {
              ctx.fillStyle = 'rgba(50, 40, 35, 0.5)';
              for (let b = 0; b < 4; b++) {
                ctx.fillRect(wx, wy + b * 3, 13, 1);
              }
            }

            // Office silhouettes
            if (row === 3 && col === 1) {
              ctx.fillStyle = 'rgba(0,0,0,0.35)';
              ctx.fillRect(wx + 2, wy + 3, 4, 8);
              ctx.fillRect(wx + 1, wy + 1, 6, 3);
            } else if (row === 5 && col === 2) {
              // Computer screen glow
              ctx.fillStyle = 'rgba(80, 150, 255, 0.25)';
              ctx.fillRect(wx + 3, wy + 5, 5, 4);
            }
          } else {
            ctx.fillStyle = '#0b0b15';
            ctx.fillRect(wx, wy, 13, 11);
            // Reflection
            ctx.fillStyle = 'rgba(80, 100, 140, 0.07)';
            ctx.fillRect(wx + 1, wy + 1, 4, 4);
          }

          // Window frame
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(wx + 6, wy, 1, 11);
          ctx.fillRect(wx, wy + 5, 13, 1);
        }
      }

      // ===== LEFT BUILDING - Japanese Apartment =====
      ctx.fillStyle = '#121220';
      ctx.fillRect(32, 65, 60, 115);
      ctx.fillStyle = '#181828';
      ctx.fillRect(34, 67, 56, 111);
      ctx.fillStyle = '#1e1e30';
      ctx.fillRect(32, 65, 3, 115);
      ctx.fillRect(89, 65, 3, 115);
      // Floor lines
      ctx.fillStyle = '#252538';
      for (let f = 0; f < 6; f++) {
        ctx.fillRect(32, 82 + f * 18, 60, 2);
      }

      // Rooftop
      ctx.fillStyle = '#252538';
      ctx.fillRect(34, 60, 56, 7);
      // AC unit
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(72, 52, 14, 10);
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(74, 54, 10, 6);
      // Fan
      const fanAngle = time * 8;
      ctx.fillStyle = '#3a3a4a';
      ctx.save();
      ctx.translate(79, 57);
      ctx.rotate(fanAngle);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.fillRect(-1, -3, 2, 6);
      ctx.restore();

      // Left building windows
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 2; col++) {
          const wx = 40 + col * 25;
          const wy = 72 + row * 18;
          const lit = Math.sin(time * 2 + row * 1.5 + col) > 0;
          ctx.fillStyle = '#08080f';
          ctx.fillRect(wx - 1, wy - 1, 18, 13);
          ctx.fillStyle = lit ? 'rgba(255, 150, 80, 0.55)' : '#0b0b15';
          ctx.fillRect(wx, wy, 16, 11);
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(wx + 7, wy, 2, 11);

          // TV glow in one
          if (lit && row === 3 && col === 0) {
            ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
            ctx.fillRect(wx + 10, wy + 5, 5, 4);
          }
        }
      }

      // Cat in window
      const catY = 72 + 1 * 18;
      const catX = 40;
      ctx.fillStyle = 'rgba(35, 30, 25, 0.9)';
      ctx.beginPath();
      ctx.ellipse(catX + 9, catY + 7, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(catX + 5, catY + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(catX + 3, catY + 3);
      ctx.lineTo(catX + 2, catY);
      ctx.lineTo(catX + 5, catY + 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(catX + 6, catY + 3);
      ctx.lineTo(catX + 7, catY);
      ctx.lineTo(catX + 8, catY + 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(catX + 4, catY + 4, 1, 1);
      ctx.fillRect(catX + 6, catY + 4, 1, 1);

      // Orange neon sign
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(90, 78, 12, 42);
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = time % 45 < 38 ? 14 : 5;
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 8px monospace';
      ctx.save();
      ctx.translate(99, 84);
      ctx.fillText('H', 0, 0);
      ctx.fillText('I', 0, 10);
      ctx.fillText('R', 0, 20);
      ctx.fillText('E', 0, 30);
      ctx.restore();
      ctx.shadowBlur = 0;

      // Balconies with plants
      for (let i = 0; i < 3; i++) {
        const balY = 85 + i * 36;
        ctx.fillStyle = '#353548';
        ctx.fillRect(29, balY, 7, 3);
        ctx.strokeStyle = '#404055';
        ctx.lineWidth = 1;
        ctx.strokeRect(29, balY - 10, 7, 12);
        // Plant
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(30, balY - 3, 4, 4);
        ctx.fillStyle = '#2d5a3d';
        ctx.fillRect(30, balY - 8, 2, 6);
        ctx.fillRect(32, balY - 10, 2, 8);
        ctx.fillStyle = '#3d7a4d';
        ctx.fillRect(31, balY - 11, 2, 4);
      }

      // Drainpipe
      ctx.fillStyle = '#303042';
      ctx.fillRect(92, 80, 3, 100);

      // ===== RIGHT BUILDING - Tech Company =====
      ctx.fillStyle = '#121220';
      ctx.fillRect(232, 55, 65, 125);
      ctx.fillStyle = '#181828';
      ctx.fillRect(234, 57, 61, 121);
      ctx.fillStyle = '#1e1e30';
      ctx.fillRect(232, 55, 3, 125);
      ctx.fillRect(294, 55, 3, 125);

      // Red neon stripe
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = isHovered ? 18 : 10;
      ctx.fillRect(232, 52, 65, 4);
      ctx.shadowBlur = 0;

      // TECH sign
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 12;
      ctx.font = 'bold 9px monospace';
      ctx.fillText('TECH', 248, 50);
      ctx.shadowBlur = 0;

      // Windows - modern horizontal
      for (let row = 0; row < 5; row++) {
        ctx.fillStyle = '#08080f';
        ctx.fillRect(238, 62 + row * 22, 52, 16);
        for (let sec = 0; sec < 3; sec++) {
          const lit = isHovered ? Math.sin(time * 2.5 + row + sec) > -0.2 : sec === 1;
          if (lit) {
            ctx.fillStyle = 'rgba(255, 190, 120, 0.5)';
            ctx.fillRect(240 + sec * 17, 64 + row * 22, 15, 12);
            // Meeting room
            if (row === 2 && sec === 1) {
              ctx.fillStyle = 'rgba(0,0,0,0.25)';
              ctx.fillRect(244, 70, 3, 6);
              ctx.fillRect(249, 70, 3, 6);
              ctx.fillRect(254, 70, 3, 6);
            }
          }
        }
      }

      // AC units
      for (let i = 0; i < 4; i++) {
        const acY = 68 + i * 28;
        ctx.fillStyle = '#353548';
        ctx.fillRect(295, acY, 10, 14);
        ctx.fillStyle = '#252535';
        ctx.fillRect(296, acY + 2, 8, 10);
        // Grille
        ctx.fillStyle = '#1a1a25';
        for (let g = 0; g < 3; g++) {
          ctx.fillRect(297, acY + 3 + g * 3, 6, 1);
        }
        // Drip
        if (time % 55 > 28 && i % 2 === 0) {
          ctx.fillStyle = 'rgba(100, 180, 255, 0.55)';
          ctx.fillRect(300, acY + 15 + (time % 28) * 0.25, 1, 3);
        }
      }

      // Climbing vines
      ctx.strokeStyle = '#2d5a3d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(231, 180);
      ctx.quadraticCurveTo(227, 150, 233, 120);
      ctx.quadraticCurveTo(228, 90, 234, 60);
      ctx.stroke();
      // Leaves
      const vines = [{ x: 229, y: 165 }, { x: 232, y: 135 }, { x: 228, y: 105 }, { x: 233, y: 78 }];
      vines.forEach((leaf, i) => {
        ctx.fillStyle = i % 2 === 0 ? '#3d7a4d' : '#2d5a3d';
        ctx.beginPath();
        ctx.ellipse(leaf.x, leaf.y, 4, 2.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== SMALL SHOP - Far Right =====
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(308, 118, 52, 62);
      // Red awning
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(305, 115, 58, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(307 + i * 6, 115, 3, 6);
      }
      // Scallops
      for (let i = 0; i < 11; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : 'rgba(239, 68, 68, 0.6)';
        ctx.beginPath();
        ctx.arc(308 + i * 5, 121, 3, 0, Math.PI);
        ctx.fill();
      }

      // Shop window
      ctx.fillStyle = '#050508';
      ctx.fillRect(313, 128, 30, 22);
      ctx.fillStyle = 'rgba(255, 180, 100, 0.4)';
      ctx.fillRect(315, 130, 26, 18);
      // Display items
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(318, 140, 5, 7);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(327, 138, 4, 9);
      ctx.fillStyle = '#4ecdc4';
      ctx.fillRect(334, 141, 4, 6);

      // Vending machine - detailed
      ctx.fillStyle = '#252535';
      ctx.fillRect(348, 148, 14, 32);
      ctx.fillStyle = time % 75 < 38 ? '#ef4444' : '#f97316';
      ctx.shadowColor = time % 75 < 38 ? '#ef4444' : '#f97316';
      ctx.shadowBlur = 10;
      ctx.fillRect(350, 150, 10, 15);
      ctx.shadowBlur = 0;
      // Drink slots
      ctx.fillStyle = '#1a1a25';
      ctx.fillRect(350, 166, 10, 12);
      // Coin slot
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(358, 158, 2, 4);

      // Steam from somewhere
      steam.forEach((s, i) => {
        s.life += 0.02;
        if (s.life > 1) {
          s.life = 0;
          s.y = 152;
        }
        s.y -= 0.25;
        s.x = 352 + Math.sin(time * 2 + i) * 3;
        ctx.fillStyle = `rgba(180, 170, 160, ${0.25 * (1 - s.life)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 + s.life * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== STREET LEVEL =====
      // Sidewalk
      ctx.fillStyle = '#222230';
      ctx.fillRect(0, 180, w, 6);
      // Tiles
      ctx.strokeStyle = '#323242';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 10, 180);
        ctx.lineTo(i * 10, 186);
        ctx.stroke();
      }

      // Street
      ctx.fillStyle = '#141420';
      ctx.fillRect(0, 186, w, 14);
      // Road markings
      ctx.fillStyle = '#2a2a38';
      for (let i = 0; i < 15; i++) {
        const markX = (i * 35 + time * 14) % (w + 35) - 17;
        ctx.fillRect(markX, 193, 18, 2);
      }

      // Manhole
      ctx.fillStyle = '#1c1c28';
      ctx.beginPath();
      ctx.ellipse(120, 190, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Street lamps - warm glow
      [95, 265].forEach((lampX) => {
        ctx.fillStyle = '#222232';
        ctx.fillRect(lampX, 132, 4, 52);
        ctx.fillRect(lampX - 5, 130, 14, 4);
        ctx.fillStyle = '#353548';
        ctx.fillRect(lampX - 3, 133, 10, 5);
        // Light
        ctx.fillStyle = 'rgba(255, 180, 100, 0.95)';
        ctx.shadowColor = 'rgba(249, 115, 22, 1)';
        ctx.shadowBlur = 22;
        ctx.fillRect(lampX - 1, 135, 6, 3);
        ctx.shadowBlur = 0;
        // Light cone
        ctx.fillStyle = 'rgba(249, 115, 22, 0.04)';
        ctx.beginPath();
        ctx.moveTo(lampX + 2, 138);
        ctx.lineTo(lampX - 18, 186);
        ctx.lineTo(lampX + 22, 186);
        ctx.closePath();
        ctx.fill();
      });

      // Trash can
      ctx.fillStyle = '#353548';
      ctx.fillRect(372, 168, 8, 14);
      ctx.fillStyle = '#404055';
      ctx.fillRect(371, 166, 10, 3);

      // Bicycle
      ctx.strokeStyle = '#404055';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(135, 174, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(145, 174, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#404055';
      ctx.fillRect(138, 168, 4, 1);
      ctx.fillRect(136, 167, 2, 7);
      ctx.fillRect(143, 168, 2, 6);

      // ===== CARS - Japanese Kei Style =====
      cars.forEach(car => {
        car.x += car.speed;
        if (car.x > w + 25) car.x = -30;
        if (car.x < -30) car.x = w + 25;

        const carY = car.y;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(car.x - 1, carY + 9, 22, 3);

        // Body
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, carY + 2, 20, 7);
        ctx.fillRect(car.x + 3, carY - 4, 14, 7);

        // Windows
        ctx.fillStyle = 'rgba(135, 206, 235, 0.7)';
        ctx.fillRect(car.x + 5, carY - 3, 4, 5);
        ctx.fillRect(car.x + 11, carY - 3, 4, 5);

        // Headlights/taillights
        ctx.fillStyle = car.speed > 0 ? '#ffffaa' : '#ff4444';
        ctx.shadowColor = car.speed > 0 ? '#ffffaa' : '#ff4444';
        ctx.shadowBlur = 6;
        ctx.fillRect(car.speed > 0 ? car.x + 18 : car.x, carY + 4, 2, 3);
        ctx.shadowBlur = 0;

        // Wheels
        ctx.fillStyle = '#101018';
        ctx.beginPath();
        ctx.arc(car.x + 5, carY + 9, 3, 0, Math.PI * 2);
        ctx.arc(car.x + 15, carY + 9, 3, 0, Math.PI * 2);
        ctx.fill();
        // Hubcaps
        ctx.fillStyle = '#353548';
        ctx.beginPath();
        ctx.arc(car.x + 5, carY + 9, 1.5, 0, Math.PI * 2);
        ctx.arc(car.x + 15, carY + 9, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ===== PUDDLE REFLECTIONS =====
      ctx.fillStyle = 'rgba(80, 100, 140, 0.12)';
      ctx.fillRect(65, 194, 45, 6);
      ctx.fillRect(180, 195, 50, 5);
      ctx.fillRect(320, 194, 40, 6);
      // Neon reflections
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fillRect(185, 196, 22, 3);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
      ctx.fillRect(325, 195, 18, 4);
      // Ripples
      ctx.strokeStyle = 'rgba(140, 160, 200, 0.12)';
      ctx.lineWidth = 0.5;
      const rippleX = 200 + Math.sin(time) * 12;
      ctx.beginPath();
      ctx.ellipse(rippleX, 196, 4 + Math.sin(time * 2) * 2, 1, 0, 0, Math.PI * 2);
      ctx.stroke();

      // ===== RAIN =====
      ctx.strokeStyle = 'rgba(130, 150, 200, 0.35)';
      ctx.lineWidth = 0.6;
      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1.5, drop.y + drop.length);
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > h) {
          drop.y = -10;
          drop.x = Math.random() * w;
        }
      });

      // Rain splashes
      for (let i = 0; i < 8; i++) {
        if ((time * 10 + i * 3) % 15 < 7) {
          ctx.fillStyle = 'rgba(130, 150, 200, 0.25)';
          const splashX = (i * 57 + time * 18) % w;
          ctx.fillRect(splashX, 184, 2, 1);
          ctx.fillRect(splashX - 1, 183, 1, 1);
          ctx.fillRect(splashX + 2, 183, 1, 1);
        }
      }

      // ===== ATMOSPHERIC FOG =====
      ctx.fillStyle = 'rgba(100, 90, 110, 0.025)';
      ctx.fillRect(0, 135, w, 65);

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

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
                    className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-green-500/20 bg-black/60 backdrop-blur-sm transition-all hover:border-green-500/50"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      boxShadow:
                        hoveredPath === 'freelance'
                          ? '0 0 40px rgba(34, 197, 94, 0.3)'
                          : '0 0 0px rgba(34, 197, 94, 0)',
                    }}
                  >
                    {/* Micro World Animation */}
                    <div className="relative h-40 w-full overflow-hidden rounded-t-2xl border-b border-green-500/20">
                      <FreelanceWorldAnimation isHovered={hoveredPath === 'freelance'} />
                      {/* Scanline overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.1) 2px, rgba(16, 185, 129, 0.1) 4px)',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <div className="mb-3 flex items-center justify-between">
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

                      <h3 className="mb-2 font-mono text-2xl font-bold text-green-400 sm:text-3xl">
                        {pathConfig.freelance.title}
                      </h3>
                      <p className="mb-4 font-mono text-sm text-white/50">
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
                    className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-red-500/20 bg-black/60 backdrop-blur-sm transition-all hover:border-red-500/50"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      boxShadow:
                        hoveredPath === 'fulltime'
                          ? '0 0 40px rgba(239, 68, 68, 0.3)'
                          : '0 0 0px rgba(239, 68, 68, 0)',
                    }}
                  >
                    {/* Micro World Animation */}
                    <div className="relative h-40 w-full overflow-hidden rounded-t-2xl border-b border-red-500/20">
                      <FulltimeWorldAnimation isHovered={hoveredPath === 'fulltime'} />
                      {/* Scanline overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.1) 2px, rgba(239, 68, 68, 0.1) 4px)',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <div className="mb-3 flex items-center justify-between">
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

                      <h3 className="mb-2 font-mono text-2xl font-bold text-red-400 sm:text-3xl">
                        {pathConfig.fulltime.title}
                      </h3>
                      <p className="mb-4 font-mono text-sm text-white/50">
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
