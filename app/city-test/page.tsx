'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import VoxelCity from '@/components/VoxelCity';

export default function CityTestPage() {
  const [theme, setTheme] = useState<'freelance' | 'fulltime' | 'neutral'>('freelance');

  return (
    <div className="min-h-screen bg-black">
      {/* Theme Toggle */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setTheme('freelance')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            theme === 'freelance'
              ? 'bg-green-500 text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Freelance
        </button>
        <button
          onClick={() => setTheme('fulltime')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            theme === 'fulltime'
              ? 'bg-red-500 text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Full-time
        </button>
        <button
          onClick={() => setTheme('neutral')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            theme === 'neutral'
              ? 'bg-cyan-500 text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Neutral
        </button>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 p-4 rounded-lg text-white text-sm max-w-sm">
        <p className="font-bold mb-2">🎮 Controls:</p>
        <ul className="space-y-1 text-gray-300">
          <li>• Drag to rotate</li>
          <li>• Scroll to zoom</li>
          <li>• Right-click drag to pan</li>
        </ul>
        <p className="mt-3 text-gray-400">
          This is a procedural 3D city. Once you download the voxel assets,
          we can swap these simple boxes for detailed voxel buildings!
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        className="w-full h-screen"
        camera={{ position: [8, 5, 8], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a15']} />
        <fog attach="fog" args={['#0a0a15', 8, 25]} />
        <VoxelCity theme={theme} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
