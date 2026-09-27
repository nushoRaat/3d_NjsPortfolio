/* =============================================================
   IsometricCamera.jsx
   Orthographic camera locked to a classic 2:1 isometric angle.
   The camera position lerps to follow the player but NEVER
   rotates or tilts — it's always parallel-projected.

   Props:
     playerPosRef — shared THREE.Vector3 ref
   ============================================================= */
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Classic isometric elevation / azimuth
const ISO_ELEVATION = Math.atan(1 / Math.sqrt(2)); // ~35.26°
const ISO_AZIMUTH   = Math.PI / 4;                 // 45°
const CAMERA_DIST   = 18;
const LERP_SPEED    = 6; // smoothness of follow (higher = snappier)

// Compute the static offset direction of the camera from any target
const OFFSET = new THREE.Vector3(
  Math.sin(ISO_AZIMUTH) * Math.cos(ISO_ELEVATION),
  Math.sin(ISO_ELEVATION),
  Math.cos(ISO_AZIMUTH) * Math.cos(ISO_ELEVATION)
).normalize().multiplyScalar(CAMERA_DIST);

export default function IsometricCamera({ playerPosRef }) {
  const { camera, size } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Switch to orthographic and set the frustum size on mount / resize
  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const aspect = size.width / size.height;
    const frustumHalf = 9; // how many world units are visible vertically
    camera.left   = -frustumHalf * aspect;
    camera.right  =  frustumHalf * aspect;
    camera.top    =  frustumHalf;
    camera.bottom = -frustumHalf;
    camera.near   = 0.1;
    camera.far    = 200;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, delta) => {
    if (!playerPosRef.current) return;

    const player = playerPosRef.current;

    // Snap to player on first frame
    if (!initialized.current) {
      targetPos.current.copy(player).add(OFFSET);
      camera.position.copy(targetPos.current);
      camera.lookAt(player);
      initialized.current = true;
    }

    // Lerp camera position toward player + offset
    const desired = player.clone().add(OFFSET);
    camera.position.lerp(desired, Math.min(1, LERP_SPEED * delta));

    // Always look at the player (parallel projection → no distortion)
    camera.lookAt(player);
  });

  return null; // no JSX output — operates on the camera via useThree
}
