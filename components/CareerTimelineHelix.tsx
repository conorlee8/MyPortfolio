'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
  logo?: string;
  color: number;
}

interface CareerTimelineHelixProps {
  experiences: Experience[];
  variant?: 'freelance' | 'fulltime' | 'default';
}

export default function CareerTimelineHelix({ experiences, variant = 'default' }: CareerTimelineHelixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Variant colors
  const variantColors = {
    freelance: { primary: 0x22c55e, secondary: 0x10b981 },
    fulltime: { primary: 0xef4444, secondary: 0xdc2626 },
    default: { primary: 0x06b6d4, secondary: 0x8b5cf6 },
  };

  const colors = variantColors[variant];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let helix: THREE.Group;
    let nodes: THREE.Mesh[] = [];
    let connections: THREE.Line[] = [];
    let animationId: number;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();

      // Camera
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 0, 25);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create helix group
      helix = new THREE.Group();
      scene.add(helix);

      // Create nodes for each experience
      const helixRadius = 6;
      const helixHeight = experiences.length * 3;
      const turns = 2;

      experiences.forEach((exp, index) => {
        const t = index / (experiences.length - 1);
        const angle = t * Math.PI * 2 * turns;
        const y = t * helixHeight - helixHeight / 2;

        // Node sphere
        const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: exp.color || colors.primary,
          transparent: true,
          opacity: 0.9,
        });

        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
          Math.cos(angle) * helixRadius,
          y,
          Math.sin(angle) * helixRadius
        );

        // Store index for raycasting
        node.userData = { index };

        // Glow ring around node
        const ringGeometry = new THREE.RingGeometry(1, 1.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: exp.color || colors.primary,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        node.add(ring);

        helix.add(node);
        nodes.push(node);

        // Connection line to previous node
        if (index > 0) {
          const prevNode = nodes[index - 1];
          const points = [];
          points.push(prevNode.position.clone());
          points.push(node.position.clone());

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: colors.secondary,
            transparent: true,
            opacity: 0.4,
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          helix.add(line);
          connections.push(line);
        }

        // Particle trail around node
        const particleCount = 20;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          const particleAngle = (i / particleCount) * Math.PI * 2;
          const particleRadius = 1.5;
          particlePositions[i * 3] = Math.cos(particleAngle) * particleRadius;
          particlePositions[i * 3 + 1] = 0;
          particlePositions[i * 3 + 2] = Math.sin(particleAngle) * particleRadius;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
          color: exp.color || colors.primary,
          size: 0.1,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        node.add(particles);
      });

      // Center helix
      helix.position.y = 0;

      // Raycaster for hover detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);

        if (intersects.length > 0) {
          const hoveredNode = intersects[0].object as THREE.Mesh;
          const index = hoveredNode.userData.index;
          setSelectedIndex(index);
          setIsHovered(true);
          document.body.style.cursor = 'pointer';

          // Highlight hovered node
          nodes.forEach((node, i) => {
            const material = node.material as THREE.MeshBasicMaterial;
            material.opacity = i === index ? 1 : 0.5;
          });
        } else {
          setIsHovered(false);
          document.body.style.cursor = 'default';

          // Reset opacity
          nodes.forEach((node) => {
            const material = node.material as THREE.MeshBasicMaterial;
            material.opacity = 0.9;
          });
        }
      };

      container.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      let time = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.01;

        // Rotate helix
        helix.rotation.y += 0.003;

        // Animate particles
        nodes.forEach((node) => {
          const particles = node.children.find((child) => child instanceof THREE.Points) as THREE.Points;
          if (particles) {
            particles.rotation.y += 0.02;
          }

          // Pulse ring
          const ring = node.children.find((child) => child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) as THREE.Mesh;
          if (ring) {
            const ringMaterial = ring.material as THREE.MeshBasicMaterial;
            ringMaterial.opacity = 0.3 + Math.sin(time * 2) * 0.2;
            ring.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
          }
        });

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
        document.body.style.cursor = 'default';
      };
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
  }, [experiences, variant]);

  const selectedExperience = selectedIndex !== null ? experiences[selectedIndex] : null;

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
          className="relative h-[600px] w-full bg-gradient-to-b from-black via-black/95 to-black"
        />

        {/* Detail Card - Shows on hover */}
        <AnimatePresence>
          {isHovered && selectedExperience && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute left-4 top-4 max-w-sm"
            >
              <div className="glass-gradient-button rounded-lg p-6">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: `#${colors.primary.toString(16).padStart(6, '0')}` }}
                    >
                      {selectedExperience.role}
                    </h3>
                    <p className="text-sm text-white/70">{selectedExperience.company}</p>
                  </div>
                </div>

                <div className="mb-3 text-xs text-white/50">
                  {selectedExperience.startDate} - {selectedExperience.endDate}
                </div>

                <p className="mb-4 text-sm leading-relaxed text-white/80">
                  {selectedExperience.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedExperience.skills.slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: `rgba(${(colors.primary >> 16) & 255}, ${(colors.primary >> 8) & 255}, ${colors.primary & 255}, 0.2)`,
                        color: `#${colors.primary.toString(16).padStart(6, '0')}`,
                        border: `1px solid rgba(${(colors.primary >> 16) & 255}, ${(colors.primary >> 8) & 255}, ${colors.primary & 255}, 0.3)`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-4 right-4 font-mono text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1, 0] }}
          transition={{ delay: 2, duration: 4 }}
        >
          [HOVER OVER NODES TO EXPLORE]
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 font-mono text-xs text-white/50"
        >
          <div className="glass-button rounded-lg px-4 py-2">
            {experiences.length} Positions • 3D Career Timeline
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
