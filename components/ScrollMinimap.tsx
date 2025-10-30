'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollMinimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateMinimap = () => {
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const maxScroll = docHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      setScrollProgress(progress);

      // Canvas dimensions
      const width = 100;
      const height = 300;
      canvas.width = width * 2; // 2x for retina
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(2, 2);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw page outline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 0, 80, height);

      // Draw sections (simulate page content blocks)
      const sections = [
        { y: 0, height: 80, color: 'rgba(6, 182, 212, 0.15)' }, // Hero
        { y: 90, height: 60, color: 'rgba(168, 85, 247, 0.15)' }, // About
        { y: 160, height: 70, color: 'rgba(6, 182, 212, 0.15)' }, // Projects
        { y: 240, height: 50, color: 'rgba(168, 85, 247, 0.15)' }, // Contact
      ];

      sections.forEach((section) => {
        ctx.fillStyle = section.color;
        ctx.fillRect(12, section.y, 76, section.height);
      });

      // Draw viewport indicator (current scroll position)
      const viewportHeight = (windowHeight / docHeight) * height;
      const viewportY = progress * (height - viewportHeight);

      // Glow effect for viewport
      const gradient = ctx.createLinearGradient(0, viewportY, 0, viewportY + viewportHeight);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.6)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.4)');

      ctx.fillStyle = gradient;
      ctx.fillRect(10, viewportY, 80, Math.max(viewportHeight, 20));

      // Border for viewport
      ctx.strokeStyle = 'rgba(6, 182, 212, 1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, viewportY, 80, Math.max(viewportHeight, 20));

      // Draw scan lines for tech effect
      for (let i = 0; i < height; i += 4) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, i);
        ctx.lineTo(90, i);
        ctx.stroke();
      }

      // Progress percentage
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(progress * 100)}%`, 50, height - 10);
    };

    // Update on scroll
    const handleScroll = () => {
      requestAnimationFrame(updateMinimap);
    };

    // Update on resize
    const handleResize = () => {
      requestAnimationFrame(updateMinimap);
    };

    // Initial render
    updateMinimap();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const clickProgress = y / height;

    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = docHeight - windowHeight;
    const targetScroll = clickProgress * maxScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed right-6 top-1/2 z-50 -translate-y-1/2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-lg border border-cyan-400/20 bg-black/60 p-3 backdrop-blur-sm transition-all"
        animate={{
          scale: isHovered ? 1.05 : 1,
          boxShadow: isHovered
            ? '0 0 30px rgba(6, 182, 212, 0.3)'
            : '0 0 0px rgba(6, 182, 212, 0)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Label */}
        <motion.div
          className="mb-2 text-center font-mono text-[10px] uppercase tracking-wider text-cyan-400/60"
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          Page Map
        </motion.div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleMinimapClick}
          className="cursor-pointer rounded transition-all hover:ring-2 hover:ring-cyan-400/30"
          style={{ width: 100, height: 300 }}
        />

        {/* Scroll Progress Indicator */}
        <motion.div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5"
          animate={{ opacity: isHovered ? 1 : 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{ width: `${scrollProgress * 100}%` }}
            animate={{
              boxShadow: isHovered
                ? '0 0 10px rgba(6, 182, 212, 0.6)'
                : '0 0 0px rgba(6, 182, 212, 0)',
            }}
          />
        </motion.div>

        {/* Tech Details - Show on Hover */}
        <motion.div
          className="mt-2 space-y-1 overflow-hidden font-mono text-[8px] text-cyan-400/40"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div>SCROLL: {Math.round(window.scrollY)}px</div>
          <div>HEIGHT: {Math.round(document.documentElement.scrollHeight)}px</div>
          <div>VIEWPORT: {Math.round(window.innerHeight)}px</div>
        </motion.div>

        {/* Pulsing Indicator Dot */}
        <motion.div
          className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-400"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Click Hint */}
        <motion.div
          className="mt-2 text-center font-mono text-[8px] text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Click to jump
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
