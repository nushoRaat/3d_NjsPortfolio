import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function CircleMesh({ color }) {
  const meshRef = useRef();
  const isHovered = useRef(false);

  useFrame(() => {
    if (meshRef.current) {
      // Smoothly animate scale up/down based on hover
      const targetScale = isHovered.current ? 1.5 : 1;
      meshRef.current.scale.lerp(
        { x: targetScale, y: targetScale, z: targetScale },
        0.1 // smoothing factor
      );
    }
  });

  return (
    <Float speed={8} rotationIntensity={2} floatIntensity={5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { isHovered.current = true; }}
        onPointerOut={() => { isHovered.current = false; }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
}

export default function FloatingCircle({
  position = { top: '50%', right: '2rem' },
  size = 200,
  color = '#d0b49f',
}) {
  const containerStyle = {
    position: 'fixed',
    zIndex: 999,
    width: `${size}px`,
    height: `${size}px`,
    ...position,
    transform: 'translateY(-50%)',
  };

  return (
    <div style={containerStyle}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <CircleMesh color={color} />
      </Canvas>
    </div>
  );
}
