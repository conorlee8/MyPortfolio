'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleGame from './ParticleGame';

// 80s Infinite Grid Component
function RetroGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create the grid shader material
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ff006e') }, // Hot pink
        uColor2: { value: new THREE.Color('#8338ec') }, // Purple
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vPosition = position;

          // Add subtle wave animation
          vec3 pos = position;
          pos.z += sin(pos.x * 0.5 + uTime) * 0.1;
          pos.z += sin(pos.y * 0.5 + uTime * 0.8) * 0.1;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uTime;

        void main() {
          // Create grid lines
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
          float line = min(grid.x, grid.y);

          // Fade based on distance
          float fadeFactor = 1.0 - clamp(length(vPosition.xy) / 15.0, 0.0, 1.0);

          // Gradient between two colors
          vec3 color = mix(uColor1, uColor2, vUv.y);

          // Glow effect
          float alpha = (1.0 - min(line, 1.0)) * fadeFactor * 0.6;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, []);

  // Animate the shader
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -2, 0]}
    >
      <planeGeometry args={[50, 50, 1, 1]} />
      <primitive object={gridMaterial} attach="material" />
    </mesh>
  );
}

// Floating geometric shapes (minimal and clean)
function FloatingShapes() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group1.current) {
      group1.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      group1.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (group2.current) {
      group2.current.position.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.3;
      group2.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <>
      {/* Wireframe Cube - left side */}
      <group ref={group1} position={[-3, 1, -2]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#00f5ff"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Wireframe Octahedron - right side */}
      <group ref={group2} position={[3, 1, -2]}>
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial
            color="#ff006e"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </>
  );
}

// Subtle particle stars
function Stars() {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface Hero3DProps {
  gameMode?: boolean;
  onSectionUnlock?: (section: string) => void;
  onCollectedChange?: (count: number) => void;
}

export default function Hero3D({ gameMode = false, onSectionUnlock, onCollectedChange }: Hero3DProps) {
  return (
    <>
      {/* Subtle ambient light */}
      <ambientLight intensity={0.3} />

      {/* Key light - purple tint */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#8338ec" />

      {/* Rim light - pink tint */}
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#ff006e" />

      {/* 80s Grid */}
      <RetroGrid />

      {/* Game Mode: Particle System */}
      {gameMode && <ParticleGame onSectionUnlock={onSectionUnlock} onCollectedChange={onCollectedChange} />}

      {/* Non-Game Mode: Original Decorations */}
      {!gameMode && (
        <>
          <FloatingShapes />
          <Stars />
        </>
      )}

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />
    </>
  );
}
