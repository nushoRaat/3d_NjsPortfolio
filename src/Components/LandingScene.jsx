import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Float,
  Html,
  useGLTF,
  Preload,
  Environment,
  ContactShadows,
  Sparkles,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import * as THREE from 'three';

const BIO_TEXT = {
  name: 'Nushrat Jahan',
  description:
    "I'm a passionate game developer with a background in Computer Science and Engineering " +
    'and over 2.5 years of hands-on experience in the industry. ' +
    'I specialize in building engaging and immersive game experiences, blending technical expertise ' +
    'with creative problem-solving. From prototyping mechanics to polishing final builds, I enjoy ' +
    'crafting interactive worlds that tell compelling stories and captivate players. ' +
    'Driven by curiosity and continuous learning, I thrive in collaborative environments and take ' +
    "pride in writing clean, efficient code. Whether it's gameplay systems, UI/UX, or performance " +
    "optimization, I bring a developer's precision and a gamer's intuition to every project I work on. " +
    'Crafting Worlds, One Line at a Time.',
};

// Styles
const landingPageStyle = {
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(145deg, #523a28, #6d4e35, #a3785b, #e4d4c8)',
};

const textContainerStyle = {
  textAlign: 'left',
  color: '#ffffff',
  maxWidth: '600px',
  width: '90vw',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  lineHeight: 1.6,
};

const headingStyle = {
  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
  margin: 0,
};

const paragraphStyle = {
  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
  opacity: 0.7,
};

const loaderStyle = {
  color: '#ffffff',
  fontSize: '1.2rem',
};

// Animated camera that smoothly moves into position on mount
function CameraIntro() {
  const { camera } = useThree();
  const progress = useRef(0);
  const startPos = useRef(new THREE.Vector3(0, 4, 12));
  const endPos = useRef(new THREE.Vector3(0, 1.5, 6));

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.4, 1);
      const t = 1 - Math.pow(1 - progress.current, 3); // ease-out cubic
      camera.position.lerpVectors(startPos.current, endPos.current, t);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// 3D Model Component
function GamingConsole(props) {
  const { scene } = useGLTF('/models/me.glb');
  return <primitive object={scene.clone()} scale={2} {...props} />;
}

useGLTF.preload('/models/me.glb');

function LoadingFallback() {
  return (
    <Html center>
      <div style={loaderStyle}>Loading...</div>
    </Html>
  );
}

export default function LandingScene() {
  return (
    <div style={landingPageStyle}>
      <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>
          {/* Animated camera fly-in */}
          <CameraIntro />

          {/* Environment map for realistic reflections */}
          <Environment preset="sunset" environmentIntensity={0.4} />

          {/* Key light */}
          <directionalLight position={[2, 5, 3]} intensity={1.2} />

          {/* Warm rim light (back-left) */}
          <pointLight position={[-3, 2, -2]} intensity={2} color="#e8965a" />

          {/* Cool accent light (back-right) */}
          <pointLight position={[4, 1, -3]} intensity={1.5} color="#5a8ce8" />

          {/* Subtle fill light */}
          <ambientLight intensity={0.3} />

          {/* Floating particles for atmosphere */}
          <Sparkles
            count={80}
            scale={12}
            size={2}
            speed={0.3}
            color="#e4d4c8"
            opacity={0.4}
          />

          {/* Floating Console shifted right */}
          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
            <group position={[2, 0, 0]}>
              <GamingConsole />

              {/* Bio text positioned to the left of the model */}
              <Html center distanceFactor={8} position={[-4, 0, 0]}>
                <div style={textContainerStyle}>
                  <h1 style={headingStyle}>Hi! I am {BIO_TEXT.name}</h1>
                  <p style={paragraphStyle}>{BIO_TEXT.description}</p>
                </div>
              </Html>
            </group>
          </Float>

          {/* Soft ground shadow */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
          />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              intensity={0.5}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>

          {/* Orbit Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
