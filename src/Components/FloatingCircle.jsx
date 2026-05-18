import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CircleMesh({ color }) {
  const meshRef = useRef();
  const isHovered = useRef(false);
  // Pre-allocate once — avoids a plain-object allocation every frame
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered.current ? 1.5 : 1;
      scaleVec.current.setScalar(targetScale);
      meshRef.current.scale.lerp(scaleVec.current, 0.1);
    }
  });

  return (
    <Float speed={8} rotationIntensity={2} floatIntensity={5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { isHovered.current = true; }}
        onPointerOut={() => { isHovered.current = false; }}
      >
        {/* 16×16 is visually identical at this render size, half the vertex count */}
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
}

export default function FloatingCircle({
  position = { top: '50%', right: '2rem' },
  size = 200,
  color = '#505BE6',
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
