'use client';

import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface SceneProps {
  children: ReactNode;
  className?: string;
}

export default function Scene({ children, className = '' }: SceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
    >
      {children}
    </Canvas>
  );
}
