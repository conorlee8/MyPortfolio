'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleGameProps {
  onSectionUnlock?: (section: string) => void;
  onCollectedChange?: (count: number) => void;
}

export default function ParticleGame({ onSectionUnlock, onCollectedChange }: ParticleGameProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const mousePos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const velocities = useRef<Float32Array>();
  const [collected, setCollected] = useState(0);
  const [totalParticles] = useState(10000);
  const targetCollected = 100; // Need to collect 100 particles

  // Generate particle positions and velocities
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const vels = new Float32Array(totalParticles * 3);

    // Create particles in a scattered formation
    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3;

      // Random positions in a sphere
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Synthwave colors - pink, purple, cyan
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Hot pink
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.0;
        colors[i3 + 2] = 0.43;
      } else if (colorChoice < 0.66) {
        // Electric purple
        colors[i3] = 0.51;
        colors[i3 + 1] = 0.22;
        colors[i3 + 2] = 0.93;
      } else {
        // Cyan
        colors[i3] = 0.0;
        colors[i3 + 1] = 0.96;
        colors[i3 + 2] = 1.0;
      }

      // Initial velocities
      vels[i3] = (Math.random() - 0.5) * 0.02;
      vels[i3 + 1] = (Math.random() - 0.5) * 0.02;
      vels[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    velocities.current = vels;
    return { positions, colors };
  }, [totalParticles]);

  // Mouse/touch tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Convert screen coordinates to 3D space
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetPos.current.set(x * 10, y * 10, 0);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!particlesRef.current || !velocities.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const vels = velocities.current;

    // Smooth mouse position
    mousePos.current.lerp(targetPos.current, 0.1);

    let collectedCount = 0;
    const attractionRadius = 2.0;
    const centerTarget = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3;

      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      // Distance to mouse
      const dx = mousePos.current.x - px;
      const dy = mousePos.current.y - py;
      const dz = mousePos.current.z - pz;
      const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Distance to center
      const dcx = centerTarget.x - px;
      const dcy = centerTarget.y - py;
      const dcz = centerTarget.z - pz;
      const distToCenter = Math.sqrt(dcx * dcx + dcy * dcy + dcz * dcz);

      // Attraction force towards mouse
      if (distToMouse < attractionRadius) {
        const force = 0.001 * (1.0 - distToMouse / attractionRadius);
        vels[i3] += dx * force;
        vels[i3 + 1] += dy * force;
        vels[i3 + 2] += dz * force;
      }

      // Weak attraction to center (creates flow)
      const centerForce = 0.0001;
      vels[i3] += dcx * centerForce;
      vels[i3 + 1] += dcy * centerForce;
      vels[i3 + 2] += dcz * centerForce;

      // Apply velocity with damping
      vels[i3] *= 0.98;
      vels[i3 + 1] *= 0.98;
      vels[i3 + 2] *= 0.98;

      positions[i3] += vels[i3];
      positions[i3 + 1] += vels[i3 + 1];
      positions[i3 + 2] += vels[i3 + 2];

      // Count collected particles (near center)
      if (distToCenter < 1.0) {
        collectedCount++;
      }

      // Keep particles in bounds
      const maxDist = 20;
      const currentDist = Math.sqrt(px * px + py * py + pz * pz);
      if (currentDist > maxDist) {
        const scale = maxDist / currentDist;
        positions[i3] *= scale;
        positions[i3 + 1] *= scale;
        positions[i3 + 2] *= scale;
        vels[i3] *= -0.5;
        vels[i3 + 1] *= -0.5;
        vels[i3 + 2] *= -0.5;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Update collected count
    if (collectedCount !== collected) {
      setCollected(collectedCount);

      // Notify parent component
      if (onCollectedChange) {
        onCollectedChange(collectedCount);
      }

      // Unlock section when target reached
      if (collectedCount >= targetCollected && onSectionUnlock) {
        onSectionUnlock('about');
      }
    }
  });

  return (
    <>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={totalParticles}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={totalParticles}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Progress indicator */}
      {collected > 0 && (
        <group position={[0, -8, 0]}>
          <mesh>
            <planeGeometry args={[10, 0.2]} />
            <meshBasicMaterial color="#ff006e" transparent opacity={0.3} />
          </mesh>
          <mesh scale={[(collected / targetCollected) * 10, 1, 1]} position={[-(5 - (collected / targetCollected) * 5), 0, 0.01]}>
            <planeGeometry args={[1, 0.2]} />
            <meshBasicMaterial color="#ff006e" />
          </mesh>
        </group>
      )}
    </>
  );
}
