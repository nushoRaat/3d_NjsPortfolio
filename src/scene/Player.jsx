/* =============================================================
   Player.jsx
   The player capsule. All per-frame logic lives in useFrame refs
   — nothing is stored in React state, so there are zero re-renders
   caused by movement.

   Props:
     positionRef  — shared THREE.Vector3 ref so other systems can
                    read the player's world position (for proximity)
     inputRef     — ref to the current input directions { x, z }
     modalOpen    — boolean; pauses movement when true
   ============================================================= */
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// World bounds — must match the ground plane half-size (10) minus player radius
const HALF = 9.3;

// Movement tuning
const MAX_SPEED = 6.5;   // units per second
const ACCELERATION = 30;    // how quickly we reach max speed
const DECELERATION = 20;    // how quickly we stop


// Pre-allocated constants — avoids GC pressure in the render loop
const UNIT_SCALE = new THREE.Vector3(1, 1, 1);

export default function Player({ positionRef, inputRef, modalOpen }) {

  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const desiredVel = useRef(new THREE.Vector3());

  // Memoise geometry + material — never recreated
  const geometry = useMemo(() => new THREE.CapsuleGeometry(0.3, 0.7, 4, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a78bfa",
        roughness: 0.4,
        metalness: 0.3,
        emissive: "#4c1d95",
        emissiveIntensity: 0.3,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // ── Input → Desired velocity ──────────────────────────────
    const input = inputRef.current;
    if (!modalOpen && (input.x !== 0 || input.z !== 0)) {
      // Normalise diagonals
      const len = Math.sqrt(input.x * input.x + input.z * input.z);
      desiredVel.current.set(
        (input.x / len) * MAX_SPEED,
        0,
        (input.z / len) * MAX_SPEED
      );
    } else {
      desiredVel.current.set(0, 0, 0);
    }

    // ── Smooth acceleration / deceleration ────────────────────
    const isMoving =
      desiredVel.current.x !== 0 || desiredVel.current.z !== 0;
    const rate = isMoving ? ACCELERATION : DECELERATION;

    velocity.current.lerp(desiredVel.current, Math.min(1, rate * delta));

    // ── Apply & clamp to bounds ───────────────────────────────
    const pos = meshRef.current.position;
    pos.x = THREE.MathUtils.clamp(pos.x + velocity.current.x * delta, -HALF, HALF);
    pos.z = THREE.MathUtils.clamp(pos.z + velocity.current.z * delta, -HALF, HALF);

    // ── Sync shared positionRef so other systems can read it ──
    positionRef.current.copy(pos);

    // ── Subtle body bob while moving ─────────────────────────
    const speed = velocity.current.length();
    pos.y = 0.65 + Math.sin(Date.now() * 0.008) * (speed / MAX_SPEED) * 0.05;

    // ── Face direction of travel (rotate capsule) ─────────────
    if (speed > 0.1) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        angle,
        Math.min(1, 12 * delta)
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0.65, 0]}
      castShadow
    />
  );
}
