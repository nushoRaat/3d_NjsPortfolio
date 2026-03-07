import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, useGLTF, Preload, ContactShadows, Environment } from '@react-three/drei';

function Model({ url, ...props }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} {...props} />;
}

export default function ThreeDObject() {
  return (
    <div style={{ width: '30vw', height: '30vh' }}>
       <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[2, 8, 4]}
          angle={0.2}
          penumbra={0.5}
          intensity={1}
          castShadow
        />



        <Model url="/models/chair/scene.gltf" scale={3} position={[2, -2, 0]} />
          {/* Soft shadows below the object */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={5}
        />

        {/* Controls without zoom */}
        <OrbitControls enableZoom={false} />
        {/* Preload all assets */}
                <Preload all />
      </Canvas>
    </div>
  );
}
