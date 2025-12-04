'use client';

import { useRef, useEffect, Suspense, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles, useGLTF, useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface VoxelCityProps {
  theme: 'freelance' | 'fulltime' | 'neutral';
  interactive?: boolean;
}

// Component to load a single FBX model with manual texture application
function VoxelModel({
  modelPath,
  texturePath,
  emissivePath,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0]
}: {
  modelPath: string;
  texturePath: string;
  emissivePath?: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  const fbx = useFBX(modelPath);
  const clonedFbx = useMemo(() => fbx.clone(), [fbx]);

  useEffect(() => {
    // Load textures manually
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(texturePath, (texture) => {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      // Load emissive texture if provided
      if (emissivePath) {
        textureLoader.load(emissivePath, (emissiveTexture) => {
          emissiveTexture.flipY = false;
          emissiveTexture.colorSpace = THREE.SRGBColorSpace;

          // Apply materials to all meshes
          clonedFbx.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                map: texture,
                emissiveMap: emissiveTexture,
                emissive: new THREE.Color(0xffffff),
                emissiveIntensity: 2,
                roughness: 0.7,
                metalness: 0.1,
              });
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        });
      } else {
        // Apply material without emissive
        clonedFbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.7,
              metalness: 0.1,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    });
  }, [clonedFbx, texturePath, emissivePath]);

  return (
    <primitive
      object={clonedFbx}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

// Loading fallback
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00ff88" wireframe />
    </mesh>
  );
}

// Main city scene using actual voxel assets
function CityScene({ theme }: { theme: 'freelance' | 'fulltime' | 'neutral' }) {
  const groupRef = useRef<THREE.Group>(null);

  // Theme colors for lighting
  const themeColors = {
    freelance: { primary: '#00ff88', secondary: '#00d4ff', ambient: '#0a2a1a' },
    fulltime: { primary: '#ff4444', secondary: '#ff8800', ambient: '#2a1a0a' },
    neutral: { primary: '#00d4ff', secondary: '#8b5cf6', ambient: '#0a1a2a' }
  };

  const colors = themeColors[theme];

  // Slow rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Texture paths
  const buildings1Diffuse = '/voxel-city/Textures/T_Buildings_001Diffuse-_4K.png';
  const buildings1Emissive = '/voxel-city/Textures/BAKE_Buildings_001Emissive-_4K.png';
  const buildings2Diffuse = '/voxel-city/Textures/T_Buildings_002Diffuse-_4K.png';
  const buildings2Emissive = '/voxel-city/Textures/BAKE_Buildings_002Emissive-_4K.png';
  const roadsDiffuse = '/voxel-city/Textures/T_RoadsDiffuse-_4K.png';
  const roadsEmissive = '/voxel-city/Textures/BAKE_RoadsEmissive-_4K.png';
  const propsDiffuse = '/voxel-city/Textures/T_PropsDiffuse-_4K.png';
  const propsEmissive = '/voxel-city/Textures/BAKE_PropsEmissive-_4K.png';

  return (
    <group ref={groupRef}>
      {/* Main Building */}
      <VoxelModel
        modelPath="/voxel-city/Building_3.fbx"
        texturePath={buildings1Diffuse}
        emissivePath={buildings1Emissive}
        position={[0, 0, 0]}
        scale={0.02}
      />

      {/* Building Blocks arranged as a street */}
      <VoxelModel
        modelPath="/voxel-city/BuildingBlock_1.fbx"
        texturePath={buildings1Diffuse}
        emissivePath={buildings1Emissive}
        position={[-4, 0, 0]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/BuildingBlock_2.fbx"
        texturePath={buildings1Diffuse}
        emissivePath={buildings1Emissive}
        position={[4, 0, 0]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/BuildingBlock_18.fbx"
        texturePath={buildings2Diffuse}
        emissivePath={buildings2Emissive}
        position={[-4, 0, -4]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/BuildingBlock_19.fbx"
        texturePath={buildings2Diffuse}
        emissivePath={buildings2Emissive}
        position={[4, 0, -4]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/BuildingBlock_24.fbx"
        texturePath={buildings2Diffuse}
        emissivePath={buildings2Emissive}
        position={[0, 0, -4]}
        scale={0.02}
      />

      {/* Roads */}
      <VoxelModel
        modelPath="/voxel-city/Road_Chunk_5.fbx"
        texturePath={roadsDiffuse}
        emissivePath={roadsEmissive}
        position={[0, -0.1, 3]}
        scale={0.02}
      />

      {/* Sidewalks */}
      <VoxelModel
        modelPath="/voxel-city/Sidewalk_Chunk_2.fbx"
        texturePath={roadsDiffuse}
        position={[-2, -0.1, 3]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/Sidewalk_Tile_1.fbx"
        texturePath={roadsDiffuse}
        position={[2, -0.1, 3]}
        scale={0.02}
      />

      {/* Advertising/Signs */}
      <VoxelModel
        modelPath="/voxel-city/Advertising_5.fbx"
        texturePath={propsDiffuse}
        emissivePath={propsEmissive}
        position={[-2, 2, 1]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/Advertising_6.fbx"
        texturePath={propsDiffuse}
        emissivePath={propsEmissive}
        position={[2, 2, 1]}
        scale={0.02}
      />

      <VoxelModel
        modelPath="/voxel-city/Advertising_7.fbx"
        texturePath={propsDiffuse}
        emissivePath={propsEmissive}
        position={[0, 3, -2]}
        scale={0.02}
      />

      {/* Satellite Dish */}
      <VoxelModel
        modelPath="/voxel-city/SateliteDish.fbx"
        texturePath={propsDiffuse}
        position={[3, 3, -3]}
        scale={0.02}
      />

      {/* Themed lighting */}
      <pointLight
        position={[-3, 4, 2]}
        color={colors.primary}
        intensity={50}
        distance={15}
      />
      <pointLight
        position={[3, 4, 2]}
        color={colors.secondary}
        intensity={50}
        distance={15}
      />
      <pointLight
        position={[0, 2, 5]}
        color={colors.primary}
        intensity={30}
        distance={10}
      />

      {/* Atmospheric particles */}
      <Sparkles
        count={50}
        scale={15}
        size={3}
        speed={0.2}
        color={colors.primary}
      />
    </group>
  );
}

export default function VoxelCity({ theme, interactive = true }: VoxelCityProps) {
  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* City with loading fallback */}
      <Suspense fallback={<LoadingFallback />}>
        <CityScene theme={theme} />
      </Suspense>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0a0a15"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}
