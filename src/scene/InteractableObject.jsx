/* =============================================================
   InteractableObject.jsx
   One of the 5 portfolio cubes. Pulses and shows a label when
   the player is within INTERACTION_RADIUS units.

   Props:
     section      — one entry from PORTFOLIO_SECTIONS
     playerPosRef — shared THREE.Vector3 ref (player world pos)
     onActivate   — called with section.id when player is near
     isNear       — boolean set by parent; drives pulse effect
   ============================================================= */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export const INTERACTION_RADIUS = 2.2; // world units

const CUBE_SIZE = 1.1;
const CUBE_HEIGHT = 1.1;

export default function InteractableObject({ section, playerPosRef, onActivate, isNear }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const pulseTime = useRef(0);
  const activated = useRef(false);

  const [px, pz] = section.position;

  // Memoised materials
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: section.color,
        roughness: 0.35,
        metalness: 0.4,
        emissive: section.color,
        emissiveIntensity: 0.15,
      }),
    [section.color]
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: section.color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: section.color,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,  // renders inside-out → visible glow shell
      }),
    [section.color]
  );

  const geometry = useMemo(
    () => new THREE.BoxGeometry(CUBE_SIZE, CUBE_HEIGHT, CUBE_SIZE),
    []
  );
  const glowGeometry = useMemo(
    () => new THREE.BoxGeometry(CUBE_SIZE * 1.4, CUBE_HEIGHT * 1.4, CUBE_SIZE * 1.4),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current || !glowRef.current) return;

    pulseTime.current += delta;

    if (isNear) {
      // Pulsing scale
      const pulse = 1 + Math.sin(pulseTime.current * 4) * 0.06;
      meshRef.current.scale.setScalar(pulse);

      // Glow fade in
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        0.35 + Math.sin(pulseTime.current * 3) * 0.15,
        Math.min(1, 6 * delta)
      );

      // Emit activation once when player is near (fire-and-forget)
      if (!activated.current) {
        activated.current = true;
        onActivate(section.id);
      }
    } else {
      // Reset
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), Math.min(1, 6 * delta));
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        0,
        Math.min(1, 6 * delta)
      );
      activated.current = false;
    }

    // Gentle hover float
    meshRef.current.position.y =
      CUBE_HEIGHT / 2 + Math.sin(pulseTime.current * 1.5 + px) * 0.08;
  });

  return (
    <group position={[px, 0, pz]}>
      {/* Main cube */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={baseMaterial}
        position={[0, CUBE_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      />

      {/* Glow shell (BackSide box slightly larger) */}
      <mesh
        ref={glowRef}
        geometry={glowGeometry}
        material={glowMaterial}
        position={[0, CUBE_HEIGHT / 2, 0]}
      />

      {/* HTML label shown when near — rendered above the cube in screen space */}
      {!isNear && (
        <Html
          position={[0, CUBE_HEIGHT + 0.1, 0]}
          center
          distanceFactor={1}
          style={{ pointerEvents: "none" }}
        >
          <div className="proximity-label">
            <span>{section.icon}</span> {section.label}
            {/* <div className="proximity-hint">Press E or walk closer</div> */}
          </div>
        </Html>
      )}
    </group>
  );
}
