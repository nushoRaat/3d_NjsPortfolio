// src/components/LandingScene.jsx

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, useGLTF, Preload } from '@react-three/drei';

// 3D Gaming Console Component
function GamingConsole(props) {
  const { scene } = useGLTF('/models/chair/scene.gltf');
  return <primitive object={scene} scale={1} {...props} />;
}

export default function SkillScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0e0e0e' }}>
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 3]} intensity={1} />

        {/* Floating Console shifted right */}
        <Float
          speed={2}
          rotationIntensity={2.5} // 💥 Make rotation a bit stronger
          floatIntensity={2}
        >
          <group position={[2, 0, 0]}>
            {/* Move model to right */}
            <GamingConsole />

            {/* Text following rotation but more dynamic now */}
            <Html center distanceFactor={8} position={[-4, 0, 0]}>
              <div style={{ textAlign: 'left', color: '#ffffff' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>My Portfolio</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Crafting Worlds, One Line at a Time</p>
              </div>
            </Html>
          </group>
        </Float>

        {/* Orbit Controls - allow mouse rotation */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
        />

        {/* Preload all assets */}
        <Preload all />
      </Canvas>
    </div>
  );
}
