'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector3, Color } from 'three';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ParallaxPortraitProps {
  src: string;
  alt: string;
  variant?: 'freelance' | 'fulltime' | 'default';
}

// Individual depth layer component
function DepthLayer({
  texture,
  depth,
  mouseX,
  mouseY,
  color,
}: {
  texture: THREE.Texture;
  depth: number;
  mouseX: number;
  mouseY: number;
  color: Color;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader for depth-based effects
  const vertexShader = `
    varying vec2 vUv;
    varying float vDepth;
    uniform float uTime;
    uniform float uDepth;
    uniform vec2 uMouse;

    void main() {
      vUv = uv;
      vDepth = uDepth;

      // Apply parallax displacement based on depth
      vec3 pos = position;
      float parallaxStrength = uDepth * 0.5;
      pos.x += uMouse.x * parallaxStrength;
      pos.y += uMouse.y * parallaxStrength;

      // Add subtle wave motion
      pos.z += sin(pos.x * 2.0 + uTime) * 0.02 * uDepth;
      pos.z += cos(pos.y * 2.0 + uTime * 0.8) * 0.02 * uDepth;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uDepth;
    uniform float uTime;
    varying vec2 vUv;
    varying float vDepth;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);

      // Apply tint based on variant color
      vec3 tinted = mix(texColor.rgb, uColor, 0.15 * vDepth);

      // Add depth fog effect
      float fog = smoothstep(0.0, 1.0, vDepth);
      tinted = mix(tinted, vec3(0.0), fog * 0.3);

      // Enhance edges with fresnel-like effect
      vec2 centered = vUv - 0.5;
      float dist = length(centered);
      float edge = smoothstep(0.3, 0.5, dist);
      tinted += uColor * edge * 0.2;

      // Pulsing glow effect
      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      tinted += uColor * pulse * 0.05 * vDepth;

      gl_FragColor = vec4(tinted, texColor.a * (1.0 - fog * 0.5));
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uDepth: { value: depth },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: color },
    }),
    [texture, depth, color]
  );

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Smooth camera rotation based on mouse
      const targetRotationY = mouseX * 0.3;
      const targetRotationX = -mouseY * 0.2;

      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;

      // Update shader uniforms
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.set(mouseX, mouseY);
    }
  });

  const zPosition = -depth * 0.8;

  return (
    <mesh ref={meshRef} position={[0, 0, zPosition]}>
      <planeGeometry args={[4, 5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Main 3D Scene
function Scene({ src, variant }: { src: string; variant: 'freelance' | 'fulltime' | 'default' }) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const texture = useLoader(TextureLoader, src);

  // Variant-specific colors
  const variantColors = {
    freelance: new Color(0.133, 0.773, 0.369), // green
    fulltime: new Color(0.937, 0.267, 0.267), // red
    default: new Color(0.024, 0.714, 0.831), // cyan
  };

  const accentColor = variantColors[variant];

  // Create multiple depth layers
  const layers = useMemo(() => {
    return [
      { depth: 0, brightness: 1.0 },      // Foreground (face)
      { depth: 0.3, brightness: 0.9 },    // Mid-ground (shoulders)
      { depth: 0.6, brightness: 0.7 },    // Background (upper body)
      { depth: 1.0, brightness: 0.5 },    // Far background (shadow)
    ];
  }, []);

  const handlePointerMove = (e: any) => {
    const x = (e.point.x / 4) * 2;
    const y = (e.point.y / 5) * 2;
    setMouseX(x);
    setMouseY(y);
  };

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Directional light following mouse */}
      <directionalLight
        position={[mouseX * 5, mouseY * 5, 5]}
        intensity={0.8}
        color={accentColor}
      />

      {/* Point lights for rim lighting */}
      <pointLight position={[-3, 2, 2]} intensity={0.5} color={accentColor} />
      <pointLight position={[3, -2, 2]} intensity={0.5} color={accentColor} />

      {/* Interactive plane for mouse tracking */}
      <mesh
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        visible={false}
      >
        <planeGeometry args={[8, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render depth layers */}
      {layers.map((layer, i) => (
        <DepthLayer
          key={i}
          texture={texture}
          depth={layer.depth}
          mouseX={mouseX}
          mouseY={mouseY}
          color={accentColor}
        />
      ))}

      {/* Particle field for atmosphere */}
      <ParticleField color={accentColor} mouseX={mouseX} mouseY={mouseY} />
    </>
  );
}

// Floating particles for depth atmosphere
function ParticleField({
  color,
  mouseX,
  mouseY,
}: {
  color: Color;
  mouseX: number;
  mouseY: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
      sizes[i] = Math.random() * 0.05 + 0.02;
    }

    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      // Rotate particle field opposite to mouse for parallax
      particlesRef.current.rotation.y = -mouseX * 0.1;
      particlesRef.current.rotation.x = mouseY * 0.1;

      // Drift particles
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParallaxPortrait({ src, alt, variant = 'default' }: ParallaxPortraitProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [stats] = useState({
    projects: variant === 'freelance' ? 50 : 25,
    commits: variant === 'freelance' ? 2500 : 5000,
    experience: 5,
    clients: variant === 'freelance' ? 30 : 15,
  });

  // Variant-specific colors
  const variantStyles = {
    freelance: {
      primary: 'rgba(34, 197, 94, 1)',
      glow: 'rgba(34, 197, 94, 0.3)',
    },
    fulltime: {
      primary: 'rgba(239, 68, 68, 1)',
      glow: 'rgba(239, 68, 68, 0.3)',
    },
    default: {
      primary: 'rgba(6, 182, 212, 1)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
  };

  const colors = variantStyles[variant];

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
            className="absolute h-8 w-8 z-30"
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

        {/* 3D Canvas Container */}
        <div
          className="relative h-[600px] w-[450px] overflow-hidden rounded-lg"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
            boxShadow: isHovered ? `0 0 40px ${colors.glow}` : `0 0 20px ${colors.glow}`,
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <Scene src={src} variant={variant} />
          </Canvas>

          {/* Instruction overlay */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ delay: 2 }}
          >
            Move mouse to explore 3D depth
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
              {'> 3D_DEPTH_MAPPING.GLSL ... VERTEX_SHADER_COMPILED [ OK ] PARALLAX_ACTIVE ... '.repeat(
                5
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
