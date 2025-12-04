'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ASCIIPortraitProps {
  src: string;
  alt: string;
  variant?: 'freelance' | 'fulltime' | 'default';
}

export default function ASCIIPortrait({ src, alt, variant = 'default' }: ASCIIPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLPreElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  // Smooth spring animation for reveal
  const revealProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // ASCII characters from darkest to lightest
  const ASCII_CHARS = ' .:-=+*#%@';

  // More detailed character set for better quality
  const DETAILED_ASCII = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

  const [stats] = useState({
    projects: variant === 'freelance' ? 50 : 25,
    commits: variant === 'freelance' ? 2500 : 5000,
    experience: 5,
    clients: variant === 'freelance' ? 30 : 15,
  });

  // Variant-specific colors
  const variantStyles = {
    freelance: {
      primary: 'rgb(34, 197, 94)',
      secondary: 'rgba(34, 197, 94, 0.6)',
      glow: 'rgba(34, 197, 94, 0.3)',
    },
    fulltime: {
      primary: 'rgb(239, 68, 68)',
      secondary: 'rgba(239, 68, 68, 0.6)',
      glow: 'rgba(239, 68, 68, 0.3)',
    },
    default: {
      primary: 'rgb(6, 182, 212)',
      secondary: 'rgba(6, 182, 212, 0.6)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
  };

  const colors = variantStyles[variant];

  // Animate reveal on hover
  useEffect(() => {
    revealProgress.set(isHovering ? 1 : 0);
  }, [isHovering, revealProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const asciiContainer = asciiRef.current;
    if (!canvas || !asciiContainer) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Set canvas size for ASCII conversion
      const width = 100;  // Number of characters wide
      const height = 60;  // Number of characters tall

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);
      setIsLoaded(true);

      let frame = 0;
      const matrixChars: Array<{ char: string; y: number; speed: number; col: number }> = [];

      // Initialize matrix rain
      for (let i = 0; i < width; i++) {
        if (Math.random() > 0.7) {
          matrixChars.push({
            char: DETAILED_ASCII[Math.floor(Math.random() * DETAILED_ASCII.length)],
            y: Math.random() * height,
            speed: Math.random() * 0.5 + 0.3,
            col: i,
          });
        }
      }

      const renderASCII = () => {
        frame++;

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        let asciiImage = '';

        // Convert pixels to ASCII
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = pixels[offset];
            const g = pixels[offset + 1];
            const b = pixels[offset + 2];

            // Calculate brightness
            const brightness = (r + g + b) / 3;

            // Edge detection (Sobel operator)
            let isEdge = false;
            if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
              const offsetLeft = (y * width + (x - 1)) * 4;
              const offsetRight = (y * width + (x + 1)) * 4;
              const offsetTop = ((y - 1) * width + x) * 4;
              const offsetBottom = ((y + 1) * width + x) * 4;

              const brightLeft = (pixels[offsetLeft] + pixels[offsetLeft + 1] + pixels[offsetLeft + 2]) / 3;
              const brightRight = (pixels[offsetRight] + pixels[offsetRight + 1] + pixels[offsetRight + 2]) / 3;
              const brightTop = (pixels[offsetTop] + pixels[offsetTop + 1] + pixels[offsetTop + 2]) / 3;
              const brightBottom = (pixels[offsetBottom] + pixels[offsetBottom + 1] + pixels[offsetBottom + 2]) / 3;

              const gradientX = Math.abs(brightRight - brightLeft);
              const gradientY = Math.abs(brightBottom - brightTop);
              const edgeStrength = gradientX + gradientY;

              isEdge = edgeStrength > 50;
            }

            // Matrix rain effect - only for first few frames
            let char;
            const transitionProgress = Math.min(frame / 120, 1);
            const shouldShowMatrix = Math.random() > transitionProgress;

            if (shouldShowMatrix && frame < 150) {
              // Matrix rain character
              const matrixChar = matrixChars.find(m => m.col === x && Math.floor(m.y) === y);
              char = matrixChar ? matrixChar.char : ' ';
            } else {
              // Convert brightness to ASCII character
              if (isEdge) {
                // Use more visible characters for edges
                char = '@#%*';
                char = char[Math.floor(Math.random() * char.length)];
              } else {
                const charIndex = Math.floor((brightness / 255) * (DETAILED_ASCII.length - 1));
                char = DETAILED_ASCII[charIndex];
              }
            }

            // Mouse proximity effect
            const dx = x - mousePos.x * width;
            const dy = y - mousePos.y * height;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 10) {
              // Highlight characters near mouse
              char = '@';
            }

            asciiImage += char;
          }
          asciiImage += '\n';
        }

        // Update matrix rain positions
        matrixChars.forEach(m => {
          m.y += m.speed;
          if (m.y > height) {
            m.y = 0;
            m.char = DETAILED_ASCII[Math.floor(Math.random() * DETAILED_ASCII.length)];
          }
        });

        asciiContainer.textContent = asciiImage;
        animationRef.current = requestAnimationFrame(renderASCII);
      };

      renderASCII();
    };

    img.onerror = () => {
      console.error('Failed to load image');
    };

    img.src = src;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src, mousePos, variant]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Corner brackets */}
        {[
          { top: -4, left: -4, rotate: 0 },
          { top: -4, right: -4, rotate: 90 },
          { bottom: -4, right: -4, rotate: 180 },
          { bottom: -4, left: -4, rotate: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute z-30 h-8 w-8"
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

        {/* ASCII Container */}
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            boxShadow: `0 0 40px ${colors.glow}`,
            border: `1px solid ${colors.primary}`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* ASCII Output */}
          <motion.pre
            ref={asciiRef}
            className="relative p-4 font-mono leading-tight"
            style={{
              color: colors.primary,
              fontSize: '7px',
              lineHeight: '1',
              letterSpacing: '-0.05em',
              textShadow: `0 0 5px ${colors.glow}, 0 0 10px ${colors.glow}`,
              WebkitFontSmoothing: 'none',
              fontSmooth: 'never',
              opacity: isHovering ? 0.3 : 1,
              transition: 'opacity 0.6s ease-out',
            }}
          >
            {!isLoaded && 'LOADING IMAGE DATA...'}
          </motion.pre>

          {/* Actual Photo Overlay - Reveals on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: revealProgress,
            }}
          >
            <motion.img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{
                filter: `hue-rotate(${
                  variant === 'freelance' ? '10deg' :
                  variant === 'fulltime' ? '350deg' :
                  '0deg'
                }) saturate(1.1)`,
              }}
            />
            {/* Gradient overlay to blend with theme */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"
              style={{
                opacity: revealProgress,
                mixBlendMode: 'multiply',
              }}
            />
          </motion.div>

          {/* Scan line effect */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(transparent 50%, ${colors.secondary} 50%)`,
              backgroundSize: '100% 4px',
              opacity: 0.1,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%'],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* CRT flicker */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
            style={{
              background: `radial-gradient(circle, transparent 50%, ${colors.glow} 100%)`,
            }}
          />

          {/* Instruction overlay */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center font-mono text-xs"
            style={{ color: colors.secondary }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovering ? 0 : [0, 1, 0.8, 1, 0.8, 1, 0]
            }}
            transition={{ delay: 2, duration: 4 }}
          >
            [HOVER TO REVEAL PHOTO]
          </motion.div>
        </div>

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
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {stats.projects}+
              </div>
              <div className="text-xs text-white/50">PROJECTS</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {stats.commits}+
              </div>
              <div className="text-xs text-white/50">COMMITS</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {stats.experience}+
              </div>
              <div className="text-xs text-white/50">YRS EXP</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {stats.clients}+
              </div>
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
              {'> ASCII_CONVERTER.C ... PIXEL_SAMPLING_ACTIVE [ OK ] EDGE_DETECTION_ENABLED ... '.repeat(
                5
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
