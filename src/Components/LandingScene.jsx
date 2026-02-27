// src/components/LandingScene.jsx

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, useGLTF, Preload } from '@react-three/drei';

// 3D Gaming Console Component
function GamingConsole(props) {
  const { scene } = useGLTF('/models/me.glb');
  return <primitive object={scene} scale={2} {...props} />;
}

export default function LandingScene() {
  return (

    <div style={landingPageStyle}>
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
 {/* <FloatingShowcaseModel
  modelPath="/models/me.glb"
  scale={0.005}
  position={[2, 0, 0]}
  floatSpeed={2}
  floatIntensity={1.5}
  rotationIntensity={2}
/>*/}

  {/* Text following rotation but more dynamic now */}
  <Html center distanceFactor={8} position={[-4, 0, 0]}>
    <div style={{
        textAlign: 'left',
        color: '#ffffff',
        width: '600px', // Make it wider
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        lineHeight: 1.6,
    }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>Hi! I am Nushrat Jahan</h1>
      <p style={{ fontSize: '1rem', opacity: 0.7 }}>
        I'm a passionate game developer with a background in Computer Science and Engineering and over 2.5 years of hands-on experience in the industry. 
        I specialize in building engaging and immersive game experiences, blending technical expertise with creative problem-solving. 
        From prototyping mechanics to polishing final builds, I enjoy crafting interactive worlds that tell compelling stories and captivate players.
        Driven by curiosity and continuous learning, I thrive in collaborative environments and take pride in writing clean, efficient code. 
        Whether it's gameplay systems, UI/UX, or performance optimization, I bring a developer’s precision and a gamer’s intuition to every project I work on. 
        Crafting Worlds, One Line at a Time.
      </p>
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

// Styles
//#E4D4C8
//#D0B49F
//#A47551
//#523A28
const landingPageStyle = {
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(145deg, #523a28, #6d4e35, #a3785b, #e4d4c8)',


};

