import { Suspense, useRef, useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { fetchBio } from '../api/portfolio';
import { useResponsive } from '../hooks/useResponsive';

const BIO_FALLBACK = {
  name: 'Nushrat Jahan',
  description:
    "I'm a passionate game developer with a background in Computer Science and Engineering " +
    'and over 3 years of hands-on experience in the industry. ' +
    'I specialize in building engaging and immersive game experiences, blending technical expertise ' +
    'with creative problem-solving. From prototyping mechanics to polishing final builds, I enjoy ' +
    'crafting interactive worlds that tell compelling stories and captivate players. ' +
    "Crafting Worlds, One Line at a Time.",
};

const HANDLE = 'bluePomegranate';

// ─── Player HUD Card ──────────────────────────────────────────────────────────

function PlayerHUDCard({ bio, isMobile, isTablet }) {
  const [typedHandle, setTypedHandle] = useState('');
  const [cursorOn, setCursorOn] = useState(true);
  const [xpReady, setXpReady] = useState(false);
  const [bioVisible, setBioVisible] = useState(false);

  // Typewriter on the handle
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i += 1;
        setTypedHandle(HANDLE.slice(0, i));
        if (i >= HANDLE.length) {
          clearInterval(iv);
          setTimeout(() => setCursorOn(false), 700);
        }
      }, 60);
      return () => clearInterval(iv);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Cursor blink while typing
  useEffect(() => {
    if (!cursorOn) return;
    const iv = setInterval(() => setCursorOn(v => !v), 520);
    return () => clearInterval(iv);
  }, [cursorOn]);

  // XP bar + bio text reveal
  useEffect(() => {
    const t1 = setTimeout(() => setXpReady(true), 2000);
    const t2 = setTimeout(() => setBioVisible(true), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    // Position wrapper — separates layout from motion
    <div style={{
      position: 'absolute',
      zIndex: 20,
      left: isMobile ? '1rem' : 'max(1.5rem, calc(50% - 440px))',
      right: isMobile ? '1rem' : 'auto',
      top: isMobile ? 'auto' : '50%',
      bottom: isMobile ? '1rem' : 'auto',
      transform: isMobile ? 'none' : 'translateY(-50%)',
      maxWidth: isMobile ? undefined : isTablet ? 'min(400px, 50vw - 1rem)' : '460px',
      width: isMobile ? undefined : isTablet ? 'min(400px, 50vw - 1rem)' : '460px',
      maxHeight: isMobile ? '65vh' : 'calc(100vh - 2rem)',
    }}>
      {/* Entrance animation */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 30 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
      >
        {/* Float — mirrors the 3D model's <Float> component */}
        <motion.div
          animate={{ y: [0, -9, 0, 9, 0] }}
          transition={{ delay: 1.5, duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative' }}
        >
          {/* Ambient glow behind card */}
          <motion.div
            style={glowAura}
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* ── Card ── */}
          <div style={cardStyle}>

            {/* Texture overlays */}
            <div style={scanlines} />
            <motion.div
              style={scanSweep}
              animate={{ y: ['-12px', '520px'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6, ease: 'linear' }}
            />

            {/* HUD corner brackets */}
            <div style={{ ...corner, top: 6, left: 6, borderTop: cb, borderLeft: cb }} />
            <div style={{ ...corner, top: 6, right: 6, borderTop: cb, borderRight: cb }} />
            <div style={{ ...corner, bottom: 6, left: 6, borderBottom: cb, borderLeft: cb }} />
            <div style={{ ...corner, bottom: 6, right: 6, borderBottom: cb, borderRight: cb }} />

            <div style={inner}>

              {/* ── Header ── */}
              <div style={headerRow}>
                <span style={sysLabel}>◈ CHARACTER FILE</span>
                <span style={activeBadge}>
                  <motion.span
                    style={activeDot}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  SYS:ACTIVE
                </span>
              </div>

              {/* Animated gold rule */}
              <motion.div
                style={goldRule}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
              />

              {/* ── Identity block ── */}
              <div style={identityRow}>
                {/* Avatar with breathing ring */}
                <div style={avatarWrap}>
                  <motion.div
                    style={avatarRing}
                    animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.14, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div style={avatarImg} />
                </div>

                <div style={nameBlock}>
                  {/* Real name — large title */}
                  <motion.p
                    style={realName}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    {bio.name}
                  </motion.p>

                  {/* Handle — typewriter */}
                  <p style={handleStyle}>
                    <span style={handlePrefix}>@</span>
                    {typedHandle}
                    {typedHandle.length < HANDLE.length && (
                      <span style={{ opacity: cursorOn ? 1 : 0, color: '#9C1FE8' }}>█</span>
                    )}
                  </p>

                  <p style={classTag}>◆ Game Programmer</p>
                </div>

                {/* Level badge */}
                <motion.div
                  style={lvlBadge}
                  initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 2.5, type: 'spring', stiffness: 280, damping: 16 }}
                >
                  <span style={lvlNum}>99</span>
                  <span style={lvlLbl}>LVL</span>
                </motion.div>
              </div>

              {/* ── Bio section ── */}
              <motion.div
                style={bioSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: bioVisible ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <div style={bioHeader}>
                  <div style={bioRule} />
                  <span style={bioLabel}>CHARACTER BIO</span>
                  <div style={bioRule} />
                </div>
                <p style={bioText}>{bio.description}</p>
              </motion.div>

              {/* ── XP bar ── */}
              <div style={xpRow}>
                <span style={xpLabel}>XP</span>
                <div style={xpTrack}>
                  <motion.div
                    style={xpFill}
                    initial={{ width: 0 }}
                    animate={{ width: xpReady ? '87%' : 0 }}
                    transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                  />
                  {xpReady && (
                    <motion.div
                      style={xpTip}
                      animate={{
                        boxShadow: [
                          '0 0 4px 2px rgba(156,31,232,0.5)',
                          '0 0 12px 4px rgba(156,31,232,0.95)',
                          '0 0 4px 2px rgba(156,31,232,0.5)',
                        ]
                      }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </div>
                <span style={xpPct}>87%</span>
              </div>

              {/* ── Stat chip ── */}
              <motion.div
                style={statChip}
                initial={{ opacity: 0, y: 8 }}
                animate={xpReady ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <span style={chipIcon}>⚔</span>
                <span style={chipNum}>3+</span>
                <span style={chipSub}>YEARS OF EXPERIENCE</span>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Three.js helpers ─────────────────────────────────────────────────────────

function CameraIntro({ isMobile }) {
  const { camera } = useThree();
  const progress = useRef(0);
  const startPos = useRef(new THREE.Vector3(0, 4, 12));
  const endPos = useRef(isMobile
    ? new THREE.Vector3(0, 1.5, 7)
    : new THREE.Vector3(0, 1.5, 6)
  );

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.4, 1);
      const t = 1 - Math.pow(1 - progress.current, 3);
      camera.position.lerpVectors(startPos.current, endPos.current, t);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

function GamingConsole(props) {
  const { scene } = useGLTF('/models/me.glb');
  return <primitive object={scene.clone()} scale={2} {...props} />;
}
useGLTF.preload('/models/me.glb');

function LoadingFallback() {
  return <Html center><div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading...</div></Html>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingScene() {
  const [bio, setBio] = useState(BIO_FALLBACK);
  const { isMobile, isTablet } = useResponsive();
  const isNarrow = isMobile || isTablet;

  useEffect(() => {
    fetchBio().then(data => setBio(data)).catch(() => { });
  }, []);

  // Character-select composition: card center-left, model center-right
  const modelPos = isMobile ? [0, 0, 0] : isTablet ? [0.8, 0, 0] : [1.2, 0, 0];

  return (
    <div style={pageStyle}>
      <PlayerHUDCard bio={bio} isMobile={isMobile} isTablet={isTablet} />

      <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>
          <CameraIntro isMobile={isNarrow} />

          <Environment preset="sunset" environmentIntensity={0.4} />
          <directionalLight position={[2, 5, 3]} intensity={1.2} />
          <pointLight position={[-3, 2, -2]} intensity={2} color="#e8965a" />
          <pointLight position={[4, 1, -3]} intensity={1.5} color="#5a8ce8" />
          <ambientLight intensity={0.3} />

          <Sparkles count={isNarrow ? 40 : 80} scale={12} size={2}
            speed={0.3} color="#c8d0ff" opacity={0.4} />

          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
            <group position={modelPos}>
              <GamingConsole />
            </group>
          </Float>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.5} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>

          <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const pageStyle = {
  width: '100vw', height: '100vh',
  background: 'linear-gradient(145deg, #121D30, #121D30, #271198, #505BE6)',
  position: 'relative', overflow: 'hidden',
};

const glowAura = {
  position: 'absolute', inset: '-12px', borderRadius: '22px',
  background: 'radial-gradient(ellipse at 30% 50%, rgba(156,31,232,0.22) 0%, transparent 65%)',
  pointerEvents: 'none', zIndex: 0,
};

const cardStyle = {
  position: 'relative',
  background: 'linear-gradient(160deg, rgba(10,13,25,0.96) 0%, rgba(15,12,40,0.98) 55%, rgba(10,13,25,0.96) 100%)',
  border: '1px solid rgba(156,31,232,0.38)',
  borderRadius: '14px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 0 40px rgba(156,31,232,0.14), 0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(156,31,232,0.18)',
  overflow: 'hidden',
};

const scanlines = {
  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.09) 3px, rgba(0,0,0,0.09) 4px)',
};

const scanSweep = {
  position: 'absolute', left: 0, right: 0, height: '32px',
  background: 'linear-gradient(to bottom, transparent, rgba(156,31,232,0.07) 50%, transparent)',
  pointerEvents: 'none', zIndex: 1,
};

const cb = '1.5px solid rgba(156,31,232,0.65)';
const corner = { position: 'absolute', width: 13, height: 13, pointerEvents: 'none', zIndex: 5 };

const inner = {
  position: 'relative', zIndex: 2,
  padding: '1rem 1.1rem 1rem',
  display: 'flex', flexDirection: 'column', gap: '0.75rem',
};

// Header
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

const sysLabel = {
  fontSize: '0.6rem', letterSpacing: '0.16em',
  color: 'rgba(156,31,232,0.55)', textTransform: 'uppercase', fontFamily: 'monospace',
};

const activeBadge = {
  display: 'flex', alignItems: 'center', gap: '4px',
  fontSize: '0.55rem', letterSpacing: '0.1em', fontFamily: 'monospace',
  color: '#4caf50', background: 'rgba(76,175,80,0.1)',
  border: '1px solid rgba(76,175,80,0.3)', borderRadius: '3px', padding: '1px 6px',
};

const activeDot = {
  display: 'inline-block', width: 5, height: 5,
  borderRadius: '50%', background: '#4caf50', flexShrink: 0,
};

const goldRule = {
  height: '1px',
  background: 'linear-gradient(90deg, rgba(156,31,232,0.8), rgba(156,31,232,0.15), transparent)',
  transformOrigin: 'left',
};

// Identity
const identityRow = { display: 'flex', alignItems: 'flex-start', gap: '0.85rem' };

const avatarWrap = { position: 'relative', flexShrink: 0, width: 64, height: 64 };

const avatarRing = {
  position: 'absolute', inset: -5, borderRadius: '12px',
  border: '2px solid rgba(156,31,232,0.55)', background: 'transparent', pointerEvents: 'none',
};

const avatarImg = {
  width: 64, height: 64, borderRadius: '9px',
  backgroundImage: 'url("public/images/logo2.png")',
  backgroundSize: 'cover', backgroundPosition: 'center',
  border: '1px solid rgba(156,31,232,0.35)',
};

const nameBlock = { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 };

const realName = {
  margin: 0,
  fontSize: '1.2rem', fontWeight: 800, color: '#e8e0ff',
  letterSpacing: '0.03em', lineHeight: 1.15,
};

const handleStyle = {
  margin: 0,
  fontSize: '0.82rem', fontWeight: 600, color: '#9C1FE8',
  letterSpacing: '0.02em', fontFamily: 'monospace',
  minHeight: '1.1em',
};

const handlePrefix = {
  color: 'rgba(156,31,232,0.45)', marginRight: '1px',
};

const classTag = {
  margin: 0,
  fontSize: '0.7rem', color: '#224D75', letterSpacing: '0.06em',
};

const lvlBadge = {
  flexShrink: 0, alignSelf: 'flex-start',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  width: 46, height: 46,
  background: 'linear-gradient(135deg, rgba(156,31,232,0.22), rgba(156,31,232,0.06))',
  border: '1px solid rgba(156,31,232,0.55)',
  borderRadius: '8px',
  boxShadow: '0 0 14px rgba(156,31,232,0.2)',
};

const lvlNum = { fontSize: '1.15rem', fontWeight: 900, color: '#9C1FE8', lineHeight: 1, fontFamily: 'monospace' };
const lvlLbl = { fontSize: '0.42rem', letterSpacing: '0.16em', color: 'rgba(156,31,232,0.55)', textTransform: 'uppercase', fontFamily: 'monospace' };

// Bio
const bioSection = {
  background: 'rgba(156,31,232,0.04)',
  border: '1px solid rgba(156,31,232,0.14)',
  borderRadius: '8px',
  padding: '0.65rem 0.75rem',
};

const bioHeader = {
  display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem',
};

const bioRule = {
  flex: 1, height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(156,31,232,0.35))',
};

const bioLabel = {
  fontSize: '0.52rem', letterSpacing: '0.18em',
  color: 'rgba(156,31,232,0.5)', textTransform: 'uppercase', fontFamily: 'monospace',
  flexShrink: 0,
};

const bioText = {
  margin: 0,
  fontSize: '0.82rem', lineHeight: 1.65,
  color: 'rgba(200,210,255,0.75)',
  fontStyle: 'italic',
};

// XP
const xpRow = { display: 'flex', alignItems: 'center', gap: '0.6rem' };

const xpLabel = {
  fontSize: '0.56rem', letterSpacing: '0.14em',
  color: 'rgba(200,210,255,0.4)', textTransform: 'uppercase', flexShrink: 0,
};

const xpTrack = {
  flex: 1, height: '7px',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '4px', overflow: 'visible', position: 'relative',
};

const xpFill = {
  height: '100%',
  background: 'linear-gradient(90deg, #271198, #224D75, #9C1FE8)',
  borderRadius: '4px', position: 'relative',
};

const xpTip = {
  position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)',
  width: 10, height: 10, borderRadius: '50%', background: '#9C1FE8',
};

const xpPct = {
  fontSize: '0.62rem', fontWeight: 700, color: '#9C1FE8',
  letterSpacing: '0.05em', flexShrink: 0, fontFamily: 'monospace',
};

// Stat chip
const statChip = {
  display: 'flex', alignItems: 'center', gap: '0.55rem',
  padding: '0.4rem 0.8rem',
  background: 'rgba(156,31,232,0.07)',
  border: '1px solid rgba(156,31,232,0.2)',
  borderRadius: '7px',
};

const chipIcon = { fontSize: '0.8rem', color: '#9C1FE8' };
const chipNum = { fontSize: '0.95rem', fontWeight: 800, color: '#c8d0ff', fontFamily: 'monospace' };
const chipSub = { fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(200,210,255,0.5)', textTransform: 'uppercase' };
