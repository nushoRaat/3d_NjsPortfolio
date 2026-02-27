import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CardMesh({ textureUrl, color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth scaling
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Smooth rotation on hover
      const targetRotationY = hovered ? meshRef.current.rotation.y + delta * 5 : 0;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        hovered ? 1 : 0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          map={texture || null}
          color={texture ? '#fff' : color}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingCard({
  position = { top: '30%', right: '2rem' },
  size = 300,
  color = '#d0b49f',
  textureUrl = null,
}) {
  const containerStyle = {
    position: 'fixed',
    zIndex: 999,
    width: `${(size * 2) / 3}px`,
    height: `${size}px`,
    ...position,
    transform: 'translateY(-50%)',
  };

  return (
    <div style={containerStyle}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} />
        <CardMesh textureUrl={textureUrl} color={color} />
      </Canvas>
    </div>
  );
}
