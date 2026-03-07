// src/Components/FloatingShowcaseModel.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useGLTF, Html, Preload } from '@react-three/drei';

export default function MC_Model({
  modelPath = '/models/me.glb',
  scale = 1,
  position = [0, 0, 0],
  floatSpeed = 2,
  floatIntensity = 1.5,
  rotationIntensity = 2,
  platformRadius = 1.5,
}) {
  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1} />

        {/* Floating Group with Platform */}
        <Float
          speed={floatSpeed}
          floatIntensity={floatIntensity}
          rotationIntensity={rotationIntensity}
        >
          <ShowcaseGroup
            modelPath={modelPath}
            scale={scale}
            platformRadius={platformRadius}
          />
        </Float>

        <Preload all />
      </Canvas>
    </div>
  );
}

function ShowcaseGroup({ modelPath, scale, platformRadius }) {
  const platformRef = useRef();
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  const { scene, animations } = useGLTF(modelPath);

  // Hover scale and rotation
  useFrame((state, delta) => {
    if (platformRef.current) {
      platformRef.current.rotation.y += delta * 0.5;
    }

    if (modelRef.current) {
      const targetScale = hovered ? 1.2 : 1;
      modelRef.current.scale.setScalar(scale * targetScale);
    }
  });

  return (
    <group
      position={[...platformRadius]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Rotating Base */}
      <mesh ref={platformRef} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[platformRadius, platformRadius, 0.2, 64]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 3D Model */}
      <primitive ref={modelRef} object={scene} position={[0, 0.1, 0]} />
    </group>
  );
}
