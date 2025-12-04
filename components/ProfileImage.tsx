'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'freelance' | 'fulltime' | 'default';
  className?: string;
}

export default function ProfileImage({
  src,
  alt,
  size = 'md',
  variant = 'default',
  className = '',
}: ProfileImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size mappings
  const sizeClasses = {
    sm: 'w-32 h-32 sm:w-40 sm:h-40',
    md: 'w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64',
    lg: 'w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96',
  };

  // Variant-specific colors
  const variantStyles = {
    freelance: {
      borderGradient: 'from-green-500 via-emerald-400 to-green-600',
      glowColor: 'rgba(34, 197, 94, 0.3)',
      accentColor: 'rgb(34, 197, 94)',
    },
    fulltime: {
      borderGradient: 'from-red-500 via-rose-400 to-red-600',
      glowColor: 'rgba(239, 68, 68, 0.3)',
      accentColor: 'rgb(239, 68, 68)',
    },
    default: {
      borderGradient: 'from-cyan-bright via-electric-purple to-indigo-500',
      glowColor: 'rgba(6, 182, 212, 0.3)',
      accentColor: 'rgb(6, 182, 212)',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      {/* Animated gradient border using pseudo-element */}
      <div className="group relative h-full w-full">
        {/* Rotating gradient border */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${styles.borderGradient} p-[3px]`}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: `drop-shadow(0 0 20px ${styles.glowColor})`,
          }}
        >
          <div className="h-full w-full rounded-full bg-black" />
        </motion.div>

        {/* Glass border overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur-sm" />

        {/* Image container with clip-path */}
        <motion.div
          className="absolute inset-[4px] overflow-hidden rounded-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blur placeholder */}
          {!imageLoaded && (
            <div
              className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br"
              style={{
                backgroundImage: `linear-gradient(135deg, ${styles.accentColor}20, transparent)`,
              }}
            />
          )}

          {/* Next.js Image with modern features */}
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-opacity duration-500"
            style={{
              opacity: imageLoaded ? 1 : 0,
            }}
            sizes={
              size === 'lg'
                ? '(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px'
                : size === 'md'
                ? '(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px'
                : '(max-width: 640px) 128px, 160px'
            }
            priority
            quality={95}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover overlay with gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-t ${styles.borderGradient} opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-20`}
          />
        </motion.div>

        {/* Orbiting particles effect */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              backgroundColor: styles.accentColor,
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1,
            }}
            style={{
              transformOrigin: `${60 + i * 20}px 0px`,
            }}
          />
        ))}

        {/* Scan line effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${styles.accentColor}80, transparent)`,
            }}
            animate={{
              y: ['0%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
