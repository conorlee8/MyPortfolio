'use client';

import { useState, useRef, Suspense, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { useFBX, OrbitControls, PerspectiveCamera, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Texture paths
const TEXTURES = {
  buildings1: '/voxel-city/T_Buildings_001Diffuse- 4K.png',
  buildings1Emissive: '/voxel-city/BAKE_Buildings_001Emissive- 4K.png',
  buildings2: '/voxel-city/T_Buildings_002Diffuse- 4K.png',
  buildings2Emissive: '/voxel-city/BAKE_Buildings_002Emissive- 4K.png',
  roads: '/voxel-city/T_RoadsDiffuse- 4K.png',
  roadsEmissive: '/voxel-city/BAKE_RoadsEmissive- 4K.png',
  props: '/voxel-city/T_PropsDiffuse- 4K.png',
  propsEmissive: '/voxel-city/BAKE_PropsEmissive- 4K.png',
};

// Each piece has defined dimensions for proper snapping
const AVAILABLE_PIECES = [
  { id: 'Building_3', name: 'Main Building', path: '/voxel-city/Building_3.fbx', category: 'buildings', color: '#4488ff', texture: TEXTURES.buildings1, emissive: TEXTURES.buildings1Emissive, width: 2.5, depth: 2.5 },
  { id: 'BuildingBlock_1', name: 'Block 1', path: '/voxel-city/BuildingBlock_1.fbx', category: 'buildings', color: '#44ff88', texture: TEXTURES.buildings1, emissive: TEXTURES.buildings1Emissive, width: 2, depth: 2 },
  { id: 'BuildingBlock_2', name: 'Block 2', path: '/voxel-city/BuildingBlock_2.fbx', category: 'buildings', color: '#ff8844', texture: TEXTURES.buildings1, emissive: TEXTURES.buildings1Emissive, width: 2, depth: 2 },
  { id: 'BuildingBlock_18', name: 'Block 18', path: '/voxel-city/BuildingBlock_18.fbx', category: 'buildings', color: '#ff44ff', texture: TEXTURES.buildings2, emissive: TEXTURES.buildings2Emissive, width: 2, depth: 2 },
  { id: 'BuildingBlock_19', name: 'Block 19', path: '/voxel-city/BuildingBlock_19.fbx', category: 'buildings', color: '#44ffff', texture: TEXTURES.buildings2, emissive: TEXTURES.buildings2Emissive, width: 2, depth: 2 },
  { id: 'BuildingBlock_24', name: 'Block 24', path: '/voxel-city/BuildingBlock_24.fbx', category: 'buildings', color: '#ffff44', texture: TEXTURES.buildings2, emissive: TEXTURES.buildings2Emissive, width: 2, depth: 2 },
  { id: 'Road_Chunk_5', name: 'Road', path: '/voxel-city/Road_Chunk_5.fbx', category: 'roads', color: '#666666', texture: TEXTURES.roads, emissive: TEXTURES.roadsEmissive, width: 2, depth: 2 },
  { id: 'Sidewalk_Chunk_2', name: 'Sidewalk 1', path: '/voxel-city/Sidewalk_Chunk_2.fbx', category: 'roads', color: '#888888', texture: TEXTURES.roads, emissive: TEXTURES.roadsEmissive, width: 1.5, depth: 1.5 },
  { id: 'Sidewalk_Tile_1', name: 'Sidewalk 2', path: '/voxel-city/Sidewalk_Tile_1.fbx', category: 'roads', color: '#999999', texture: TEXTURES.roads, emissive: TEXTURES.roadsEmissive, width: 1, depth: 1 },
  { id: 'Advertising_5', name: 'Sign 1', path: '/voxel-city/Advertising_5.fbx', category: 'props', color: '#ff0088', texture: TEXTURES.props, emissive: TEXTURES.propsEmissive, width: 0.5, depth: 0.5 },
  { id: 'Advertising_6', name: 'Sign 2', path: '/voxel-city/Advertising_6.fbx', category: 'props', color: '#00ff88', texture: TEXTURES.props, emissive: TEXTURES.propsEmissive, width: 0.5, depth: 0.5 },
  { id: 'Advertising_7', name: 'Sign 3', path: '/voxel-city/Advertising_7.fbx', category: 'props', color: '#8800ff', texture: TEXTURES.props, emissive: TEXTURES.propsEmissive, width: 0.5, depth: 0.5 },
  { id: 'SateliteDish', name: 'Satellite', path: '/voxel-city/SateliteDish.fbx', category: 'props', color: '#aaaaaa', texture: TEXTURES.props, emissive: TEXTURES.propsEmissive, width: 0.5, depth: 0.5 },
];

interface PlacedPiece {
  id: string;
  pieceId: string;
  x: number;
  z: number;
  rotation: number;
  scale: number;
}

const MODEL_SCALE = 0.02;
const SNAP_DISTANCE = 0.5; // How close to snap

// Calculate snap points for a piece
function getSnapPoints(piece: PlacedPiece, pieceData: typeof AVAILABLE_PIECES[0]) {
  const halfW = (pieceData.width * piece.scale / MODEL_SCALE) / 2;
  const halfD = (pieceData.depth * piece.scale / MODEL_SCALE) / 2;
  const rad = piece.rotation * Math.PI / 180;

  // Rotate the snap points based on piece rotation
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return {
    north: { x: piece.x - sin * halfD, z: piece.z - cos * halfD, edge: 'south' as const },
    south: { x: piece.x + sin * halfD, z: piece.z + cos * halfD, edge: 'north' as const },
    east: { x: piece.x + cos * halfW, z: piece.z - sin * halfW, edge: 'west' as const },
    west: { x: piece.x - cos * halfW, z: piece.z + sin * halfW, edge: 'east' as const },
  };
}

// Find the best snap position for a new piece
function findSnapPosition(
  mouseX: number,
  mouseZ: number,
  newPieceData: typeof AVAILABLE_PIECES[0],
  newRotation: number,
  placedPieces: PlacedPiece[]
): { x: number; z: number; snapped: boolean } {
  const newHalfW = newPieceData.width / 2;
  const newHalfD = newPieceData.depth / 2;
  const newRad = newRotation * Math.PI / 180;
  const newCos = Math.cos(newRad);
  const newSin = Math.sin(newRad);

  let bestSnap: { x: number; z: number; dist: number } | null = null;

  for (const placed of placedPieces) {
    const placedData = AVAILABLE_PIECES.find(p => p.id === placed.pieceId);
    if (!placedData) continue;

    const snapPoints = getSnapPoints(placed, placedData);

    // Check each snap point
    for (const [edge, point] of Object.entries(snapPoints)) {
      // Calculate where the new piece would need to be to snap here
      let snapX = point.x;
      let snapZ = point.z;

      // Offset by the new piece's half-size in the appropriate direction
      if (point.edge === 'north') {
        snapX += newSin * newHalfD;
        snapZ += newCos * newHalfD;
      } else if (point.edge === 'south') {
        snapX -= newSin * newHalfD;
        snapZ -= newCos * newHalfD;
      } else if (point.edge === 'east') {
        snapX += newCos * newHalfW;
        snapZ -= newSin * newHalfW;
      } else if (point.edge === 'west') {
        snapX -= newCos * newHalfW;
        snapZ += newSin * newHalfW;
      }

      const dist = Math.sqrt((mouseX - snapX) ** 2 + (mouseZ - snapZ) ** 2);

      if (dist < SNAP_DISTANCE * 3 && (!bestSnap || dist < bestSnap.dist)) {
        bestSnap = { x: snapX, z: snapZ, dist };
      }
    }
  }

  if (bestSnap && bestSnap.dist < SNAP_DISTANCE * 2) {
    return { x: bestSnap.x, z: bestSnap.z, snapped: true };
  }

  return { x: mouseX, z: mouseZ, snapped: false };
}

// 3D Piece Preview (small rotating preview)
function PiecePreview3D({ pieceId }: { pieceId: string }) {
  const pieceData = AVAILABLE_PIECES.find(p => p.id === pieceId);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  if (!pieceData) return null;

  return (
    <group ref={groupRef}>
      <Suspense fallback={<mesh><boxGeometry args={[1,1,1]} /><meshBasicMaterial color={pieceData.color} wireframe /></mesh>}>
        <PreviewModel
          path={pieceData.path}
          color={pieceData.color}
          texturePath={pieceData.texture}
          emissivePath={pieceData.emissive}
        />
      </Suspense>
    </group>
  );
}

function PreviewModel({ path, color, texturePath, emissivePath }: { path: string; color: string; texturePath?: string; emissivePath?: string }) {
  const fbx = useFBX(path);
  const cloned = useMemo(() => fbx.clone(), [fbx]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    if (texturePath) {
      loader.load(texturePath, (texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        if (emissivePath) {
          loader.load(emissivePath, (emissiveTexture) => {
            emissiveTexture.flipY = false;
            cloned.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  map: texture,
                  emissiveMap: emissiveTexture,
                  emissive: new THREE.Color(0xffffff),
                  emissiveIntensity: 1.5,
                  roughness: 0.7,
                  metalness: 0.2,
                });
              }
            });
          });
        } else {
          cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.7,
                metalness: 0.2,
              });
            }
          });
        }
      });
    } else {
      cloned.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.6,
            metalness: 0.4,
          });
        }
      });
    }
  }, [cloned, color, texturePath, emissivePath]);

  return <primitive object={cloned} scale={0.008} position={[0, -1, 0]} />;
}

// Piece selector button with 3D preview
function PieceButton({
  piece,
  isSelected,
  onClick
}: {
  piece: typeof AVAILABLE_PIECES[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`w-full p-2 rounded text-xs transition-all flex flex-col items-center gap-1 ${
          isSelected
            ? 'bg-green-500 text-black font-bold ring-2 ring-green-300'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-900">
          <Canvas camera={{ position: [3, 2, 3], fov: 40 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 3, 2]} intensity={0.8} />
            <PiecePreview3D pieceId={piece.id} />
          </Canvas>
        </div>
        <span className="truncate w-full text-center text-[10px]">{piece.name}</span>
      </button>
    </div>
  );
}

// Ground plane that receives clicks
function GroundPlane({
  onHover,
  onClick
}: {
  onHover: (x: number, z: number) => void;
  onClick: (x: number, z: number) => void;
}) {
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(e.point.x, e.point.z);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e.point.x, e.point.z);
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

// Ghost preview piece (follows mouse with snapping)
function GhostPiece({ pieceId, x, z, rotation, snapped }: { pieceId: string; x: number; z: number; rotation: number; snapped: boolean }) {
  const pieceData = AVAILABLE_PIECES.find(p => p.id === pieceId);
  const fbx = useFBX(pieceData?.path || '');
  const cloned = useMemo(() => fbx.clone(), [fbx]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    if (pieceData?.texture) {
      loader.load(pieceData.texture, (texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        cloned.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              transparent: true,
              opacity: 0.7,
              emissive: new THREE.Color(snapped ? 0x00ff88 : 0xffff00),
              emissiveIntensity: snapped ? 1 : 0.5,
            });
          }
        });
      });
    } else {
      cloned.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: snapped ? '#00ff88' : '#ffff00',
            transparent: true,
            opacity: 0.5,
          });
        }
      });
    }
  }, [cloned, pieceData, snapped]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]} rotation={[0, rotation * Math.PI / 180, 0]}>
      <primitive object={cloned} scale={MODEL_SCALE} />
      {/* Snap indicator */}
      {snapped && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      )}
    </group>
  );
}

// Placed piece in 3D with full textures
function PlacedPiece3D({
  piece,
  isSelected,
  onClick
}: {
  piece: PlacedPiece;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pieceData = AVAILABLE_PIECES.find(p => p.id === piece.pieceId);
  const fbx = useFBX(pieceData?.path || '');
  const cloned = useMemo(() => fbx.clone(), [fbx]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    if (pieceData?.texture) {
      loader.load(pieceData.texture, (texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        if (pieceData.emissive) {
          loader.load(pieceData.emissive, (emissiveTexture) => {
            emissiveTexture.flipY = false;
            cloned.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  map: texture,
                  emissiveMap: emissiveTexture,
                  emissive: new THREE.Color(isSelected ? 0x00ff88 : 0xffffff),
                  emissiveIntensity: isSelected ? 2 : 1.5,
                  roughness: 0.7,
                  metalness: 0.2,
                });
              }
            });
          });
        } else {
          cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                map: texture,
                emissive: isSelected ? new THREE.Color(0x00ff88) : undefined,
                emissiveIntensity: isSelected ? 0.3 : 0,
                roughness: 0.7,
                metalness: 0.2,
              });
            }
          });
        }
      });
    } else {
      cloned.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: isSelected ? '#00ff88' : pieceData?.color || '#888888',
            roughness: 0.7,
            metalness: 0.3,
            emissive: isSelected ? '#003311' : '#000000',
          });
        }
      });
    }
  }, [cloned, pieceData, isSelected]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group
      ref={groupRef}
      position={[piece.x, 0, piece.z]}
      rotation={[0, piece.rotation * Math.PI / 180, 0]}
      onClick={handleClick}
    >
      <primitive object={cloned} scale={piece.scale} />
      {isSelected && (
        <>
          {/* Selection indicator */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
          {/* Bounding box visualization */}
          {pieceData && (
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(pieceData.width, 3, pieceData.depth)]} />
              <lineBasicMaterial color="#00ff88" />
            </lineSegments>
          )}
        </>
      )}
    </group>
  );
}

// 3D Scene
function CityScene({
  placedPieces,
  selectedPieceId,
  selectedTool,
  ghostPosition,
  ghostRotation,
  ghostSnapped,
  onGroundHover,
  onGroundClick,
  onPieceClick
}: {
  placedPieces: PlacedPiece[];
  selectedPieceId: string | null;
  selectedTool: string | null;
  ghostPosition: { x: number; z: number } | null;
  ghostRotation: number;
  ghostSnapped: boolean;
  onGroundHover: (x: number, z: number) => void;
  onGroundClick: (x: number, z: number) => void;
  onPieceClick: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 20]} intensity={1} castShadow />
      <pointLight position={[-10, 10, 10]} color="#00ff88" intensity={0.3} />
      <pointLight position={[10, 10, -10]} color="#ff4488" intensity={0.3} />

      {/* Reference grid */}
      <gridHelper args={[50, 50, '#333355', '#222244']} position={[0, 0, 0]} />

      {/* Clickable ground */}
      <GroundPlane onHover={onGroundHover} onClick={onGroundClick} />

      {/* Ghost preview of piece to place */}
      {ghostPosition && selectedTool && (
        <Suspense fallback={null}>
          <GhostPiece
            pieceId={selectedTool}
            x={ghostPosition.x}
            z={ghostPosition.z}
            rotation={ghostRotation}
            snapped={ghostSnapped}
          />
        </Suspense>
      )}

      {/* Placed pieces */}
      <Suspense fallback={null}>
        {placedPieces.map((piece) => (
          <PlacedPiece3D
            key={piece.id}
            piece={piece}
            isSelected={piece.id === selectedPieceId}
            onClick={() => onPieceClick(piece.id)}
          />
        ))}
      </Suspense>

      <OrbitControls
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={80}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Mini-map component showing overhead view
function MiniMap({ placedPieces, selectedPieceId }: { placedPieces: PlacedPiece[]; selectedPieceId: string | null }) {
  const scale = 8; // pixels per unit
  const size = 200;
  const offset = size / 2;

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded" style={{ width: size, height: size }}>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <line x1={i * 20} y1={0} x2={i * 20} y2={size} stroke="#444" strokeWidth={1} />
            <line x1={0} y1={i * 20} x2={size} y2={i * 20} stroke="#444" strokeWidth={1} />
          </g>
        ))}
      </svg>

      {/* Pieces */}
      {placedPieces.map((piece) => {
        const pieceData = AVAILABLE_PIECES.find(p => p.id === piece.pieceId);
        if (!pieceData) return null;

        const w = pieceData.width * scale;
        const h = pieceData.depth * scale;
        const x = offset + piece.x * scale - w / 2;
        const y = offset + piece.z * scale - h / 2;

        return (
          <div
            key={piece.id}
            className={`absolute transition-all ${piece.id === selectedPieceId ? 'ring-2 ring-cyan-400' : ''}`}
            style={{
              left: x,
              top: y,
              width: w,
              height: h,
              backgroundColor: pieceData.color,
              transform: `rotate(${piece.rotation}deg)`,
              transformOrigin: 'center',
              opacity: 0.9,
            }}
          />
        );
      })}

      {/* Center marker */}
      <div className="absolute w-2 h-2 bg-white rounded-full" style={{ left: offset - 4, top: offset - 4 }} />
    </div>
  );
}

export default function CityBuilderPage() {
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{ x: number; z: number } | null>(null);
  const [ghostRotation, setGhostRotation] = useState(0);
  const [ghostSnapped, setGhostSnapped] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleGroundHover = useCallback((x: number, z: number) => {
    if (!selectedTool) {
      setGhostPosition(null);
      return;
    }

    const pieceData = AVAILABLE_PIECES.find(p => p.id === selectedTool);
    if (!pieceData) return;

    const snapResult = findSnapPosition(x, z, pieceData, ghostRotation, placedPieces);
    setGhostPosition({ x: snapResult.x, z: snapResult.z });
    setGhostSnapped(snapResult.snapped);
  }, [selectedTool, ghostRotation, placedPieces]);

  const handleGroundClick = useCallback((x: number, z: number) => {
    if (!selectedTool) return;

    const pieceData = AVAILABLE_PIECES.find(p => p.id === selectedTool);
    if (!pieceData) return;

    const snapResult = findSnapPosition(x, z, pieceData, ghostRotation, placedPieces);

    const newPiece: PlacedPiece = {
      id: `piece_${Date.now()}`,
      pieceId: selectedTool,
      x: snapResult.x,
      z: snapResult.z,
      rotation: ghostRotation,
      scale: MODEL_SCALE,
    };

    setPlacedPieces(prev => [...prev, newPiece]);
  }, [selectedTool, ghostRotation, placedPieces]);

  const handlePieceClick = useCallback((id: string) => {
    if (selectedTool) return; // Don't select when placing
    setSelectedPieceId(prev => prev === id ? null : id);
  }, [selectedTool]);

  const handleDelete = () => {
    if (selectedPieceId) {
      setPlacedPieces(prev => prev.filter(p => p.id !== selectedPieceId));
      setSelectedPieceId(null);
    }
  };

  const handleRotate = (delta: number = 90) => {
    if (selectedPieceId) {
      setPlacedPieces(prev => prev.map(p =>
        p.id === selectedPieceId ? { ...p, rotation: (p.rotation + delta + 360) % 360 } : p
      ));
    } else if (selectedTool) {
      setGhostRotation(prev => (prev + delta + 360) % 360);
    }
  };

  const handleMove = (dx: number, dz: number) => {
    if (selectedPieceId) {
      setPlacedPieces(prev => prev.map(p =>
        p.id === selectedPieceId ? { ...p, x: p.x + dx, z: p.z + dz } : p
      ));
    }
  };

  const generateExportCode = () => {
    return placedPieces.map(piece => {
      const pieceData = AVAILABLE_PIECES.find(p => p.id === piece.pieceId);
      return `<VoxelModel
  modelPath="${pieceData?.path}"
  texturePath="${pieceData?.texture}"
  emissivePath="${pieceData?.emissive}"
  position={[${piece.x.toFixed(2)}, 0, ${piece.z.toFixed(2)}]}
  scale={${piece.scale}}
  rotation={[0, ${(piece.rotation * Math.PI / 180).toFixed(3)}, 0]}
/>`;
    }).join('\n\n');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') handleDelete();
      else if (e.key === 'r' || e.key === 'R') handleRotate(e.shiftKey ? -90 : 90);
      else if (e.key === 'Escape') {
        setSelectedTool(null);
        setSelectedPieceId(null);
        setGhostRotation(0);
      }
      // Arrow keys to nudge selected piece
      else if (e.key === 'ArrowUp') handleMove(0, -0.5);
      else if (e.key === 'ArrowDown') handleMove(0, 0.5);
      else if (e.key === 'ArrowLeft') handleMove(-0.5, 0);
      else if (e.key === 'ArrowRight') handleMove(0.5, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPieceId, selectedTool]);

  return (
    <div className="flex h-screen bg-gray-900 select-none">
      {/* Left Sidebar - Piece Selector */}
      <div className="w-48 bg-gray-800 p-2 overflow-y-auto border-r border-gray-700 flex flex-col">
        <h2 className="text-white font-bold text-sm mb-2">🏗️ City Builder</h2>

        <p className="text-gray-400 text-[10px] mb-2">
          Click to place • R to rotate • Pieces snap together!
        </p>

        {/* Buildings */}
        <h3 className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Buildings</h3>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {AVAILABLE_PIECES.filter(p => p.category === 'buildings').map(piece => (
            <PieceButton
              key={piece.id}
              piece={piece}
              isSelected={selectedTool === piece.id}
              onClick={() => {
                setSelectedTool(selectedTool === piece.id ? null : piece.id);
                setSelectedPieceId(null);
              }}
            />
          ))}
        </div>

        {/* Roads */}
        <h3 className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Roads</h3>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {AVAILABLE_PIECES.filter(p => p.category === 'roads').map(piece => (
            <PieceButton
              key={piece.id}
              piece={piece}
              isSelected={selectedTool === piece.id}
              onClick={() => {
                setSelectedTool(selectedTool === piece.id ? null : piece.id);
                setSelectedPieceId(null);
              }}
            />
          ))}
        </div>

        {/* Props */}
        <h3 className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Props</h3>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {AVAILABLE_PIECES.filter(p => p.category === 'props').map(piece => (
            <PieceButton
              key={piece.id}
              piece={piece}
              isSelected={selectedTool === piece.id}
              onClick={() => {
                setSelectedTool(selectedTool === piece.id ? null : piece.id);
                setSelectedPieceId(null);
              }}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Mini-map */}
        <div className="mb-2">
          <h3 className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Overview</h3>
          <MiniMap placedPieces={placedPieces} selectedPieceId={selectedPieceId} />
        </div>

        <button
          onClick={() => setShowExport(true)}
          disabled={placedPieces.length === 0}
          className="w-full p-2 rounded bg-green-600 text-white text-sm font-bold hover:bg-green-500 disabled:opacity-50"
        >
          📤 Export ({placedPieces.length})
        </button>
      </div>

      {/* Main 3D View */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-2 text-sm">
          {selectedTool && (
            <div className="bg-green-500 text-black px-3 py-1 rounded font-medium flex items-center gap-2">
              Placing: {AVAILABLE_PIECES.find(p => p.id === selectedTool)?.name}
              {ghostRotation > 0 && <span className="text-green-800">({ghostRotation}°)</span>}
              <button onClick={() => { setSelectedTool(null); setGhostRotation(0); }} className="hover:text-green-800">✕</button>
            </div>
          )}
          {ghostSnapped && selectedTool && (
            <div className="bg-cyan-500 text-black px-2 py-1 rounded text-xs">
              ⚡ Snapping
            </div>
          )}
          {selectedPieceId && (
            <>
              <span className="text-gray-400">Selected:</span>
              <button onClick={() => handleRotate(-90)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500">↶</button>
              <button onClick={() => handleRotate(90)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500">↷</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500">🗑️</button>
              <span className="text-gray-500 text-xs ml-2">Arrow keys to nudge</span>
            </>
          )}
          <div className="flex-1" />
          <span className="text-gray-500 text-xs">
            R = Rotate | Del = Delete | Arrows = Nudge | Esc = Cancel
          </span>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 bg-gray-950">
          <Canvas shadows camera={{ position: [15, 12, 15], fov: 50 }}>
            <color attach="background" args={['#0a0a15']} />
            <fog attach="fog" args={['#0a0a15', 30, 80]} />
            <CityScene
              placedPieces={placedPieces}
              selectedPieceId={selectedPieceId}
              selectedTool={selectedTool}
              ghostPosition={ghostPosition}
              ghostRotation={ghostRotation}
              ghostSnapped={ghostSnapped}
              onGroundHover={handleGroundHover}
              onGroundClick={handleGroundClick}
              onPieceClick={handlePieceClick}
            />
          </Canvas>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-bold text-xl">📤 Export Code</h2>
              <button onClick={() => setShowExport(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>
            <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-auto max-h-80">
              {generateExportCode()}
            </pre>
            <button
              onClick={() => { navigator.clipboard.writeText(generateExportCode()); alert('Copied!'); }}
              className="mt-4 w-full p-3 bg-green-600 text-white rounded font-bold hover:bg-green-500"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
