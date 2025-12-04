'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePath } from '@/contexts/PathContext';

const SECTIONS = [
  { id: 'hero', name: 'ROOF' },
  { id: 'about', name: 'ABOUT' },
  { id: 'work', name: 'WORK' },
  { id: 'experience', name: 'EXP' },
  { id: 'github', name: 'CODE' },
  { id: 'testimonials', name: 'RECS' },
  { id: 'skills', name: 'SKILLS' },
  { id: 'contact', name: 'LOBBY' },
];

export default function ScrollMinimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { selectedPath } = usePath();

  const themeColor = selectedPath === 'freelance'
    ? { r: 34, g: 197, b: 94 }
    : selectedPath === 'fulltime'
    ? { r: 239, g: 68, b: 68 }
    : { r: 6, g: 182, b: 212 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;
    const raindrops: { x: number; y: number; speed: number; length: number }[] = [];

    // Initialize raindrops
    for (let i = 0; i < 50; i++) {
      raindrops.push({
        x: Math.random() * 90,
        y: Math.random() * 400,
        speed: 2 + Math.random() * 3,
        length: 4 + Math.random() * 8
      });
    }

    // Initialize cars (Japanese style - small, boxy)
    const cars: { x: number; speed: number; color: string; direction: number }[] = [
      { x: -20, speed: 0.4, color: '#ff6b6b', direction: 1 },
      { x: 110, speed: 0.3, color: '#4ecdc4', direction: -1 },
      { x: 50, speed: 0.5, color: '#ffd93d', direction: 1 },
    ];

    const drawBuilding = () => {
      frame++;

      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const maxScroll = docHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setScrollProgress(progress);

      const sectionIndex = Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1);
      setCurrentSection(sectionIndex);

      const width = 90;
      const height = 380;
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(2, 2);
      ctx.imageSmoothingEnabled = false;

      const accent = `rgb(${themeColor.r},${themeColor.g},${themeColor.b})`;
      const accentGlow = `rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.7)`;
      const accentDim = `rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.25)`;

      // ===== SKY WITH GRADIENT =====
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 100);
      skyGrad.addColorStop(0, '#0a0a1a');
      skyGrad.addColorStop(0.4, '#1a2a4a');
      skyGrad.addColorStop(0.7, '#2a3a5a');
      skyGrad.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // ===== BACKGROUND CITY SILHOUETTE =====
      ctx.fillStyle = '#0d1020';
      // Distant buildings
      ctx.fillRect(2, 25, 8, 50);
      ctx.fillRect(12, 35, 6, 40);
      ctx.fillRect(70, 20, 10, 55);
      ctx.fillRect(82, 30, 6, 45);
      ctx.fillRect(5, 40, 4, 35);
      ctx.fillRect(78, 40, 5, 35);

      // Tiny windows on distant buildings
      ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(4 + (i % 2) * 3, 30 + i * 5, 1, 2);
        ctx.fillRect(72 + (i % 3) * 2, 25 + i * 4, 1, 1);
      }

      // ===== CLOUDS =====
      ctx.fillStyle = 'rgba(40, 60, 100, 0.4)';
      ctx.beginPath();
      ctx.arc(25, 15, 12, 0, Math.PI * 2);
      ctx.arc(35, 12, 10, 0, Math.PI * 2);
      ctx.arc(45, 16, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(30, 50, 80, 0.3)';
      ctx.beginPath();
      ctx.arc(60, 20, 10, 0, Math.PI * 2);
      ctx.arc(70, 18, 8, 0, Math.PI * 2);
      ctx.fill();

      // Building position
      const bx = 18;
      const bw = 54;

      // ===== POWER LINES & POLES =====
      ctx.strokeStyle = '#2a2a3a';
      ctx.lineWidth = 1;
      // Left pole
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(5, 50, 3, 280);
      // Right pole
      ctx.fillRect(width - 8, 60, 3, 270);

      // Power lines (catenary curves)
      ctx.strokeStyle = '#2a2a3a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(7, 70);
      ctx.quadraticCurveTo(45, 85, width - 6, 75);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(7, 140);
      ctx.quadraticCurveTo(45, 155, width - 6, 145);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(7, 210);
      ctx.quadraticCurveTo(45, 225, width - 6, 215);
      ctx.stroke();

      // ===== ROOFTOP =====
      // Water tanks
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(bx + 3, 55, 14, 18);
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(bx + 5, 58, 10, 12);

      // Antenna array
      ctx.fillStyle = '#333';
      ctx.fillRect(bx + bw/2 - 1, 48, 2, 25);
      ctx.fillRect(bx + bw/2 - 6, 55, 12, 2);
      ctx.fillRect(bx + bw/2 - 4, 60, 8, 1);
      // Blinking light
      ctx.fillStyle = frame % 40 < 20 ? '#ff3333' : '#330000';
      ctx.fillRect(bx + bw/2 - 1, 46, 2, 3);

      // Rooftop railing
      ctx.strokeStyle = '#3a3a4a';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 2, 70, bw + 4, 8);
      // Railing posts
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(bx + i * 10, 70, 2, 8);
      }

      // AC units cluster
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(bx + bw - 18, 62, 12, 8);
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(bx + bw - 16, 64, 8, 4);
      // Fan spinning
      ctx.fillStyle = frame % 6 < 3 ? '#3a3a4a' : '#2a2a3a';
      ctx.fillRect(bx + bw - 14, 65, 2, 2);
      ctx.fillRect(bx + bw - 11, 65, 2, 2);

      // Rooftop potted plants
      // Pot 1
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(bx + 22, 68, 6, 5);
      ctx.fillStyle = '#3d7a4d';
      ctx.fillRect(bx + 21, 62, 3, 7);
      ctx.fillRect(bx + 25, 64, 3, 5);
      ctx.fillStyle = '#4a9a5d';
      ctx.fillRect(bx + 23, 60, 2, 4);
      // Pot 2 - small
      ctx.fillStyle = '#a0522d';
      ctx.fillRect(bx + 32, 70, 4, 3);
      ctx.fillStyle = '#2d5a3d';
      ctx.fillRect(bx + 32, 66, 4, 5);
      ctx.fillStyle = '#ff9999'; // small flower
      ctx.fillRect(bx + 33, 65, 2, 2);

      // ===== MAIN BUILDING BODY =====
      ctx.fillStyle = '#1a1a28';
      ctx.fillRect(bx, 78, bw, height - 125);

      // Building edge details
      ctx.fillStyle = '#252535';
      ctx.fillRect(bx, 78, 3, height - 125);
      ctx.fillRect(bx + bw - 3, 78, 3, height - 125);

      // ===== VINES & FOLIAGE =====
      // Left side climbing vine
      ctx.strokeStyle = '#2d5a3d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 1, height - 60);
      ctx.quadraticCurveTo(bx - 4, height - 120, bx + 2, height - 180);
      ctx.quadraticCurveTo(bx - 3, height - 220, bx + 1, height - 260);
      ctx.quadraticCurveTo(bx - 2, height - 290, bx + 3, height - 310);
      ctx.stroke();

      // Vine leaves (left side)
      const vineLeafPositions = [
        { x: bx - 3, y: height - 90 },
        { x: bx + 1, y: height - 130 },
        { x: bx - 4, y: height - 170 },
        { x: bx + 2, y: height - 200 },
        { x: bx - 2, y: height - 240 },
        { x: bx + 1, y: height - 280 },
        { x: bx - 3, y: height - 305 },
      ];
      vineLeafPositions.forEach((leaf, i) => {
        // Leaf cluster
        ctx.fillStyle = i % 2 === 0 ? '#3d7a4d' : '#2d5a3d';
        ctx.beginPath();
        ctx.ellipse(leaf.x, leaf.y, 4, 3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4a9a5d';
        ctx.beginPath();
        ctx.ellipse(leaf.x + 2, leaf.y - 2, 3, 2, -Math.PI / 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Right side hanging ivy from rooftop
      ctx.strokeStyle = '#2d5a3d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx + bw + 2, 85);
      ctx.quadraticCurveTo(bx + bw + 5, 110, bx + bw + 1, 140);
      ctx.quadraticCurveTo(bx + bw + 6, 165, bx + bw + 2, 190);
      ctx.stroke();

      // Right ivy leaves
      const ivyPositions = [
        { x: bx + bw + 4, y: 95 },
        { x: bx + bw + 2, y: 115 },
        { x: bx + bw + 5, y: 135 },
        { x: bx + bw + 3, y: 160 },
        { x: bx + bw + 5, y: 185 },
      ];
      ivyPositions.forEach((leaf, i) => {
        ctx.fillStyle = i % 2 === 0 ? '#3d7a4d' : '#4a9a5d';
        ctx.beginPath();
        ctx.ellipse(leaf.x, leaf.y, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Window box foliage (on some windows)
      // Will add more in the floors section

      // ===== FLOORS =====
      const floorHeight = 34;
      const startY = 82;

      SECTIONS.forEach((section, idx) => {
        const floorY = startY + idx * floorHeight;
        const isActive = idx === sectionIndex;
        const isPast = idx < sectionIndex;

        // Floor separator - concrete ledge
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(bx - 3, floorY - 2, bw + 6, 3);

        // ===== BALCONY WITH PLANTS =====
        if (idx % 2 === 0 && idx > 0) {
          // Balcony platform
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(bx - 5, floorY + 18, 8, 3);
          // Railing
          ctx.strokeStyle = '#3a3a4a';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(bx - 5, floorY + 10, 8, 10);

          // Plants!
          ctx.fillStyle = '#2d5a3d';
          ctx.fillRect(bx - 4, floorY + 12, 3, 6);
          ctx.fillStyle = '#3d7a4d';
          ctx.fillRect(bx - 3, floorY + 10, 2, 4);
          // Flowers
          if (idx === 2) {
            ctx.fillStyle = '#ff6b9d';
            ctx.fillRect(bx - 3, floorY + 9, 1, 1);
            ctx.fillRect(bx - 1, floorY + 11, 1, 1);
          }
        }

        // ===== WINDOWS =====
        for (let w = 0; w < 2; w++) {
          const wx = bx + 7 + w * 24;
          const wy = floorY + 4;
          const ww = 18;
          const wh = 22;

          // Window recess/frame
          ctx.fillStyle = '#0a0a15';
          ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);

          if (isActive) {
            // Active - warm interior glow
            const warmGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
            warmGrad.addColorStop(0, accentGlow);
            warmGrad.addColorStop(1, `rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.4)`);
            ctx.fillStyle = warmGrad;
            ctx.fillRect(wx, wy, ww, wh);

            // Glow effect
            ctx.shadowColor = accent;
            ctx.shadowBlur = 15;
            ctx.fillRect(wx, wy, ww, wh);
            ctx.shadowBlur = 0;

            // Interior details - silhouette
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(wx + 6, wy + 10, 6, 12); // Person silhouette
          } else if (isPast) {
            // Dim warm light
            ctx.fillStyle = 'rgba(255, 180, 100, 0.15)';
            ctx.fillRect(wx, wy, ww, wh);
            ctx.fillStyle = accentDim;
            ctx.fillRect(wx, wy, ww, wh);
            // Curtain
            ctx.fillStyle = 'rgba(60, 40, 30, 0.5)';
            ctx.fillRect(wx, wy, ww / 2, wh);

            // Cat silhouette in specific window (floor 3, window 1)
            if (idx === 3 && w === 0) {
              ctx.fillStyle = 'rgba(0,0,0,0.6)';
              // Cat body
              ctx.beginPath();
              ctx.ellipse(wx + ww/2 + 2, wy + wh - 5, 4, 3, 0, 0, Math.PI * 2);
              ctx.fill();
              // Cat head
              ctx.beginPath();
              ctx.arc(wx + ww/2 - 2, wy + wh - 7, 3, 0, Math.PI * 2);
              ctx.fill();
              // Ears
              ctx.beginPath();
              ctx.moveTo(wx + ww/2 - 4, wy + wh - 9);
              ctx.lineTo(wx + ww/2 - 5, wy + wh - 12);
              ctx.lineTo(wx + ww/2 - 2, wy + wh - 10);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(wx + ww/2 - 1, wy + wh - 9);
              ctx.lineTo(wx + ww/2, wy + wh - 12);
              ctx.lineTo(wx + ww/2 + 1, wy + wh - 10);
              ctx.fill();
              // Tail
              ctx.strokeStyle = 'rgba(0,0,0,0.6)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(wx + ww/2 + 5, wy + wh - 4);
              ctx.quadraticCurveTo(wx + ww/2 + 10, wy + wh - 8, wx + ww/2 + 8, wy + wh - 10);
              ctx.stroke();
            }
          } else {
            // Dark with reflection
            ctx.fillStyle = '#0d0d1a';
            ctx.fillRect(wx, wy, ww, wh);
            // Window reflection
            ctx.fillStyle = 'rgba(100, 150, 200, 0.1)';
            ctx.fillRect(wx + 2, wy + 2, 5, 8);
          }

          // Window frame cross
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(wx + ww/2 - 1, wy, 2, wh);
          ctx.fillRect(wx, wy + wh/2 - 1, ww, 2);
        }

        // ===== AC UNIT ON SIDE =====
        if (idx % 2 === 1) {
          ctx.fillStyle = '#3a3a4a';
          ctx.fillRect(bx + bw + 1, floorY + 8, 7, 10);
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(bx + bw + 2, floorY + 10, 5, 6);
          // Drip
          if (frame % 60 > 30) {
            ctx.fillStyle = 'rgba(100, 180, 255, 0.6)';
            ctx.fillRect(bx + bw + 4, floorY + 19 + (frame % 30) * 0.3, 1, 2);
          }
        }

        // ===== PIPES =====
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(bx - 2, floorY, 2, floorHeight);
        // Pipe joints
        if (idx % 2 === 0) {
          ctx.fillRect(bx - 3, floorY + 10, 4, 3);
        }
      });

      // ===== NEON SIGNS =====
      // Main sign
      const signY = startY + 2 * floorHeight + 2;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(bx + bw - 2, signY, 12, 20);

      // Neon text - vertical Japanese style
      ctx.shadowColor = accent;
      ctx.shadowBlur = frame % 45 < 40 ? 10 : 4;
      ctx.fillStyle = accent;
      ctx.font = 'bold 7px monospace';
      ctx.save();
      ctx.translate(bx + bw + 6, signY + 3);
      ctx.fillText('O', 0, 0);
      ctx.fillText('P', 0, 7);
      ctx.fillText('E', 0, 14);
      ctx.restore();
      ctx.shadowBlur = 0;

      // Second neon sign - pink
      const sign2Y = startY + 5 * floorHeight;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(bx + 5, sign2Y - 5, 20, 8);
      ctx.shadowColor = '#ff6b9d';
      ctx.shadowBlur = frame % 50 < 45 ? 8 : 3;
      ctx.fillStyle = '#ff6b9d';
      ctx.font = '5px monospace';
      ctx.fillText('CAFE', bx + 8, sign2Y);
      ctx.shadowBlur = 0;

      // ===== GROUND FLOOR / SHOP =====
      const groundY = height - 55;

      // Awning with stripes
      ctx.fillStyle = accent;
      ctx.fillRect(bx + 2, groundY - 8, 50, 4);
      // Stripes
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(bx + 4 + i * 6, groundY - 8, 3, 4);
      }
      // Awning scallop
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? accent : accentDim;
        ctx.beginPath();
        ctx.arc(bx + 5 + i * 5, groundY - 4, 3, 0, Math.PI);
        ctx.fill();
      }

      // Shop window display
      ctx.fillStyle = '#0a0a15';
      ctx.fillRect(bx + 5, groundY, 18, 28);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
      ctx.fillRect(bx + 7, groundY + 2, 14, 24);
      // Items in window
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(bx + 9, groundY + 18, 4, 6);
      ctx.fillStyle = '#4ecdc4';
      ctx.fillRect(bx + 15, groundY + 16, 4, 8);

      // Door
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(bx + 26, groundY, 14, 28);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
      ctx.fillRect(bx + 28, groundY + 2, 10, 18);
      // Door handle
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(bx + 36, groundY + 14, 2, 4);

      // Vending machine
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(bx + 44, groundY + 5, 10, 23);
      ctx.fillStyle = frame % 80 < 40 ? '#ff6b6b' : '#4ecdc4';
      ctx.fillRect(bx + 45, groundY + 7, 8, 12);
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(bx + 45, groundY + 20, 8, 6);

      // ===== STREET LEVEL =====
      // Sidewalk
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, groundY + 30, width, 6);
      // Sidewalk tiles
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 10, groundY + 30);
        ctx.lineTo(i * 10, groundY + 36);
        ctx.stroke();
      }

      // Street
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, groundY + 36, width, 20);
      // Road markings
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(10, groundY + 45, 15, 2);
      ctx.fillRect(40, groundY + 45, 15, 2);
      ctx.fillRect(70, groundY + 45, 12, 2);

      // ===== JAPANESE STYLE CARS =====
      cars.forEach(car => {
        // Update car position
        car.x += car.speed * car.direction;

        // Reset when off screen
        if (car.direction === 1 && car.x > width + 20) {
          car.x = -20;
        } else if (car.direction === -1 && car.x < -20) {
          car.x = width + 20;
        }

        const carY = car.direction === 1 ? groundY + 39 : groundY + 48;
        const carX = car.x;

        // Car shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(carX - 1, carY + 7, 14, 2);

        // Car body (boxy Japanese kei car style)
        ctx.fillStyle = car.color;
        // Main body
        ctx.fillRect(carX, carY + 2, 12, 5);
        // Top/cabin (smaller, boxy)
        ctx.fillRect(carX + 2, carY - 2, 7, 5);

        // Windows
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(carX + 3, carY - 1, 2, 3);
        ctx.fillRect(carX + 6, carY - 1, 2, 3);

        // Headlights/taillights
        if (car.direction === 1) {
          // Headlights (front)
          ctx.fillStyle = '#ffff88';
          ctx.fillRect(carX + 11, carY + 3, 1, 2);
          // Taillight
          ctx.fillStyle = '#ff3333';
          ctx.fillRect(carX, carY + 3, 1, 2);
        } else {
          // Headlights (front - reversed)
          ctx.fillStyle = '#ffff88';
          ctx.fillRect(carX, carY + 3, 1, 2);
          // Taillight
          ctx.fillStyle = '#ff3333';
          ctx.fillRect(carX + 11, carY + 3, 1, 2);
        }

        // Wheels
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(carX + 3, carY + 7, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(carX + 9, carY + 7, 2, 0, Math.PI * 2);
        ctx.fill();
        // Wheel shine
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(carX + 2, carY + 6, 1, 1);
        ctx.fillRect(carX + 8, carY + 6, 1, 1);
      });

      // ===== STREET LAMP =====
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(6, groundY - 15, 2, 45);
      ctx.fillRect(4, groundY - 18, 6, 4);
      // Lamp glow
      ctx.fillStyle = 'rgba(255, 200, 100, 0.9)';
      ctx.shadowColor = 'rgba(255, 200, 100, 1)';
      ctx.shadowBlur = 15;
      ctx.fillRect(5, groundY - 16, 4, 2);
      ctx.shadowBlur = 0;
      // Light cone
      ctx.fillStyle = 'rgba(255, 200, 100, 0.08)';
      ctx.beginPath();
      ctx.moveTo(7, groundY - 14);
      ctx.lineTo(-5, groundY + 35);
      ctx.lineTo(20, groundY + 35);
      ctx.closePath();
      ctx.fill();

      // ===== TRASH/DETAILS =====
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(bx - 8, groundY + 20, 5, 8);
      // Trash bags
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(bx - 10, groundY + 22, 3, 5);

      // ===== RAIN =====
      ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
      ctx.lineWidth = 0.5;
      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.stroke();

        // Update raindrop position
        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -10;
          drop.x = Math.random() * width;
        }
      });

      // Rain splashes on ground
      if (frame % 10 < 5) {
        ctx.fillStyle = 'rgba(150, 180, 255, 0.3)';
        ctx.fillRect(15 + (frame % 30), groundY + 34, 2, 1);
        ctx.fillRect(45 + (frame % 20), groundY + 34, 2, 1);
        ctx.fillRect(70 + (frame % 15), groundY + 34, 2, 1);
      }

      // ===== PUDDLE REFLECTIONS =====
      ctx.fillStyle = 'rgba(100, 150, 200, 0.15)';
      ctx.fillRect(20, groundY + 40, 25, 8);
      ctx.fillRect(55, groundY + 42, 20, 6);
      // Neon reflection in puddle
      ctx.fillStyle = `rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.1)`;
      ctx.fillRect(22, groundY + 42, 8, 4);

      // ===== PROGRESS ELEVATOR =====
      const elevTrackStart = 85;
      const elevTrackHeight = groundY - 95;
      const elevY = elevTrackStart + progress * elevTrackHeight;

      // Track
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(width - 10, elevTrackStart, 4, elevTrackHeight);

      // Elevator car with glow
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.fillRect(width - 11, elevY, 6, 12);
      ctx.shadowBlur = 0;

      // ===== PERCENTAGE =====
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(progress * 100)}%`, width / 2, height - 5);
    };

    const animate = () => {
      drawBuilding();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [selectedPath, themeColor]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, (y - 80) / (rect.height - 140)));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: progress * maxScroll, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed right-2 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-lg"
          style={{
            boxShadow: isHovered
              ? `0 0 40px rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.4), 0 0 80px rgba(0,0,0,0.8)`
              : '0 0 20px rgba(0,0,0,0.6)',
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            className="cursor-pointer"
            style={{ width: 90, height: 380 }}
          />

          <motion.div
            className="absolute bottom-12 left-0 right-0 text-center font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{
              color: `rgb(${themeColor.r},${themeColor.g},${themeColor.b})`,
              textShadow: `0 0 10px rgba(${themeColor.r},${themeColor.g},${themeColor.b},0.8)`
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {SECTIONS[currentSection]?.name}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden"
      >
        <motion.div
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span
            className="font-mono text-xs font-bold"
            style={{ color: `rgb(${themeColor.r},${themeColor.g},${themeColor.b})` }}
          >
            {Math.round(scrollProgress * 100)}%
          </span>
          <svg className="h-4 w-4" style={{ color: `rgb(${themeColor.r},${themeColor.g},${themeColor.b})` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}
