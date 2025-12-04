'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CodeRainProps {
  intensity?: number;
  sceneId?: string;
}

export default function CodeRain({ intensity = 1.0, sceneId = 'start' }: CodeRainProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Code characters for Matrix effect
  const codeChars = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/';

  // Generate particles - REDUCED FOR SUBTLETY
  const { positions, velocities, opacities } = useMemo(() => {
    const count = 800; // Way fewer particles
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random position across screen
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Slower fall speed
      velocities[i] = Math.random() * 0.01 + 0.005;

      // Much lower opacity
      opacities[i] = Math.random() * 0.2 + 0.1;
    }

    return { positions, velocities, opacities };
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;

      // Fall down
      positions[i3 + 1] -= velocities[i] * intensity;

      // Reset to top when reaching bottom
      if (positions[i3 + 1] < -10) {
        positions[i3 + 1] = 10;
        positions[i3] = (Math.random() - 0.5) * 30;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Very subtle pulsing
    if (materialRef.current) {
      materialRef.current.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Color based on scene
  const getColor = () => {
    switch (sceneId) {
      case 'question_two':
        return '#8338ec'; // Purple
      case 'question_three':
        return '#ff006e'; // Hot pink
      case 'match_result':
        return '#00f5ff'; // Cyan
      default:
        return '#00ff41'; // Matrix green
    }
  };

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.08}
        color={getColor()}
        transparent
        opacity={0.2}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
