'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface GitHubParticleGalaxyProps {
  username: string;
  variant?: 'freelance' | 'fulltime' | 'default';
}

interface CommitData {
  date: string;
  count: number;
  language?: string;
}

export default function GitHubParticleGalaxy({ username, variant = 'default' }: GitHubParticleGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalRepos: 0,
    languages: [] as string[],
    streak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Variant colors
  const variantColors = {
    freelance: { primary: 0x22c55e, secondary: 0x10b981, accent: 0x34d399 },
    fulltime: { primary: 0xef4444, secondary: 0xdc2626, accent: 0xf87171 },
    default: { primary: 0x06b6d4, secondary: 0x8b5cf6, accent: 0x00f5ff },
  };

  const colors = variantColors[variant];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let animationId: number;

    const init = async () => {
      // Scene setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.001);

      // Camera
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 50;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      try {
        // Fetch GitHub data
        let repos = [];
        let contribData: any = { contributions: {} };

        try {
          const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
          if (reposResponse.ok) {
            repos = await reposResponse.json();
          }
        } catch (error) {
          console.warn('GitHub API unavailable, using demo data');
        }

        // If API fails, use demo data
        if (repos.length === 0) {
          repos = Array.from({ length: 30 }, (_, i) => ({
            name: `project-${i}`,
            language: ['JavaScript', 'TypeScript', 'Python', 'React', 'Go'][Math.floor(Math.random() * 5)],
          }));
        }

        // Calculate stats
        const languages = new Set<string>();
        let totalCommits = 0;

        repos.forEach((repo: any) => {
          if (repo.language) languages.add(repo.language);
        });

        // Fetch contribution data (using a public contributions API)
        try {
          const contribResponse = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
          if (contribResponse.ok) {
            contribData = await contribResponse.json();
          }
        } catch (error) {
          console.warn('Contributions API unavailable, generating demo data');
        }

        const commits: CommitData[] = [];
        let currentStreak = 0;
        let maxStreak = 0;

        if (contribData.contributions && Object.keys(contribData.contributions).length > 0) {
          Object.entries(contribData.contributions).forEach(([date, data]: [string, any]) => {
            const count = data.count || 0;
            totalCommits += count;

            if (count > 0) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
              commits.push({
                date,
                count,
                language: repos[Math.floor(Math.random() * repos.length)]?.language || 'Unknown'
              });
            } else {
              currentStreak = 0;
            }
          });
        } else {
          // Generate demo commits if API fails
          for (let i = 0; i < 365; i++) {
            const count = Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0;
            totalCommits += count;

            if (count > 0) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
              commits.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                count,
                language: repos[Math.floor(Math.random() * repos.length)]?.language || 'Unknown'
              });
            } else {
              currentStreak = 0;
            }
          }
        }

        setStats({
          totalCommits,
          totalRepos: repos.length,
          languages: Array.from(languages).slice(0, 5),
          streak: maxStreak,
        });

        // Create particle system
        const particleCount = Math.min(commits.length, 5000);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Language to color mapping
        const langColors: { [key: string]: THREE.Color } = {
          JavaScript: new THREE.Color(colors.primary),
          TypeScript: new THREE.Color(colors.secondary),
          Python: new THREE.Color(0x3776ab),
          Java: new THREE.Color(0xf89820),
          Go: new THREE.Color(0x00add8),
          Rust: new THREE.Color(0xdea584),
          C: new THREE.Color(0x555555),
          'C++': new THREE.Color(0xf34b7d),
          Ruby: new THREE.Color(0xcc342d),
          PHP: new THREE.Color(0x777bb4),
          Unknown: new THREE.Color(colors.accent),
        };

        commits.slice(0, particleCount).forEach((commit, i) => {
          // Position particles in a galaxy spiral
          const angle = (i / particleCount) * Math.PI * 8;
          const radius = (i / particleCount) * 40;
          const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
          const y = (Math.random() - 0.5) * 20;
          const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 5;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          // Color based on language
          const langColor = langColors[commit.language || 'Unknown'] || langColors.Unknown;
          colorArray[i * 3] = langColor.r;
          colorArray[i * 3 + 1] = langColor.g;
          colorArray[i * 3 + 2] = langColor.b;

          // Size based on commit count
          sizes[i] = Math.min(commit.count * 0.5 + 0.5, 3);
        });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for glow effect
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            pixelRatio: { value: renderer.getPixelRatio() }
          },
          vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;

            void main() {
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

              // Pulsing effect
              float pulse = sin(time * 2.0 + position.x * 0.1) * 0.3 + 1.0;
              gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;

            void main() {
              // Circular particles with glow
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);

              if (dist > 0.5) discard;

              // Soft glow edge
              float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

              // Core brightness
              float core = 1.0 - smoothstep(0.0, 0.3, dist);

              vec3 finalColor = vColor * (core * 2.0 + 0.3);
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        setIsLoading(false);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
          mouseY = -((event.clientY - rect.top) / height) * 2 + 1;
        };

        container.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Update time uniform for pulsing
          if (material.uniforms) {
            material.uniforms.time.value += 0.01;
          }

          // Rotate galaxy
          particles.rotation.y += 0.001;
          particles.rotation.x += 0.0005;

          // Mouse influence
          camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
          camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
          camera.lookAt(scene.position);

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          const width = container.clientWidth;
          const height = container.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          container.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error('Error initializing visualization:', err);
        // Don't set error - we handle API failures gracefully with demo data
      }
    };

    init();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [username, variant]);

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden rounded-lg border"
        style={{
          borderColor: `#${colors.primary.toString(16).padStart(6, '0')}33`,
          boxShadow: `0 0 40px rgba(${(colors.primary >> 16) & 255}, ${(colors.primary >> 8) & 255}, ${colors.primary & 255}, 0.3)`,
        }}
      >
        {/* WebGL Canvas Container */}
        <div
          ref={containerRef}
          className="relative h-[500px] w-full bg-black"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <motion.div
                className="mb-4 h-12 w-12 rounded-full border-4 border-t-transparent"
                style={{ borderColor: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="font-mono text-sm text-white/70">Loading GitHub data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-mono text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overlay */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="glass-button grid grid-cols-2 gap-3 rounded-lg p-4 sm:grid-cols-4">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                >
                  {stats.totalCommits.toLocaleString()}
                </div>
                <div className="text-xs text-white/50">Commits</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                >
                  {stats.totalRepos}
                </div>
                <div className="text-xs text-white/50">Repositories</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                >
                  {stats.languages.length}
                </div>
                <div className="text-xs text-white/50">Languages</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                >
                  {stats.streak}
                </div>
                <div className="text-xs text-white/50">Max Streak</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          className="absolute right-4 top-4 font-mono text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2, duration: 3 }}
        >
          [MOVE MOUSE TO INTERACT]
        </motion.div>
      </motion.div>
    </div>
  );
}
