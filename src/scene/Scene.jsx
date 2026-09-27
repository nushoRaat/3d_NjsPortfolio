/* =============================================================
   Scene.jsx
   The root R3F Canvas component. Wires together:
     - Lights
     - Ground + Decorations
     - Player
     - 5 InteractableObjects
     - IsometricCamera
   
   Proximity checks run inside a useFrame loop here (not in each
   child) so we only do one distance-check pass per frame.

   Props:
     inputRef              — shared input ref from App (via useInput)
     onSectionActivate(id) — called when player enters an object's radius
     activeSection         — id of currently active section (or null)
     modalOpen             — true while a modal is shown
   ============================================================= */
import { useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Ground               from "./Ground";
import Decorations          from "./Decorations";
import Player               from "./Player";
import InteractableObject, { INTERACTION_RADIUS } from "./InteractableObject";
import IsometricCamera      from "./IsometricCamera";
import { PORTFOLIO_SECTIONS } from "../data/portfolio";

// Clamp devicePixelRatio to 2 for performance
const DPR = Math.min(window.devicePixelRatio, 2);

/* ----------------------------------------------------------
   ProximityTracker — lives inside Canvas so it can useFrame
   ---------------------------------------------------------- */
function ProximityTracker({ playerPosRef, onNearChange }) {
  const nearRef = useRef(null);

  useFrame(() => {
    if (!playerPosRef.current) return;
    const pp = playerPosRef.current;
    let closest = null;
    let closestDist = Infinity;

    for (const s of PORTFOLIO_SECTIONS) {
      const dx = pp.x - s.position[0];
      const dz = pp.z - s.position[1];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < INTERACTION_RADIUS && dist < closestDist) {
        closestDist = dist;
        closest = s.id;
      }
    }

    // Only fire React state update when the nearest section changes
    if (closest !== nearRef.current) {
      nearRef.current = closest;
      onNearChange(closest);
    }
  });

  return null;
}

/* ----------------------------------------------------------
   SceneContent — all 3D objects inside the Canvas
   ---------------------------------------------------------- */
function SceneContent({ playerPosRef, inputRef, onNearChange, nearSection, onActivate, modalOpen }) {
  return (
    <>
      {/* ── Lighting ─────────────────────────────────────── */}
      <ambientLight intensity={0.45} color="#c8d8ff" />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.4}
        color="#fffbe8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      {/* ── Camera ──────────────────────────────────────── */}
      <IsometricCamera playerPosRef={playerPosRef} />

      {/* ── Environment ─────────────────────────────────── */}
      <Ground />
      <Decorations />

      {/* ── Interactive portfolio objects ────────────────── */}
      {PORTFOLIO_SECTIONS.map((section) => (
        <InteractableObject
          key={section.id}
          section={section}
          playerPosRef={playerPosRef}
          onActivate={onActivate}
          isNear={nearSection === section.id}
        />
      ))}

      {/* ── Player ──────────────────────────────────────── */}
      <Player
        positionRef={playerPosRef}
        inputRef={inputRef}
        modalOpen={modalOpen}
      />

      {/* ── Proximity tracker (fires React updates on section change) */}
      <ProximityTracker
        playerPosRef={playerPosRef}
        onNearChange={onNearChange}
      />
    </>
  );
}

/* ----------------------------------------------------------
   Scene — exported component used in App.jsx
   ---------------------------------------------------------- */
export default function Scene({ inputRef, onSectionActivate, activeSection, modalOpen }) {
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const [nearSection, setNearSection] = useState(null);

  const handleNearChange = useCallback((id) => {
    setNearSection(id);
  }, []);

  const handleActivate = useCallback((id) => {
    onSectionActivate(id);
  }, [onSectionActivate]);

  return (
    <Canvas
      orthographic
      dpr={DPR}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContent
        playerPosRef={playerPosRef}
        inputRef={inputRef}
        onNearChange={handleNearChange}
        nearSection={nearSection}
        onActivate={handleActivate}
        modalOpen={modalOpen}
      />
    </Canvas>
  );
}
