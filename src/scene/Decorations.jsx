/* =============================================================
   Decorations.jsx
   Scatter of non-interactive decorative cubes using InstancedMesh
   so the draw-call count stays low even with many objects.
   ============================================================= */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/** Fixed decoration data — tweak freely
 *  [x, yOff, z, scaleX, scaleY, scaleZ, colorHex]
 */
const DECORATIONS = [
  [-8, 0,  -8, 0.5, 1.2, 0.5, "#2d2b55"],
  [-8, 0,   8, 0.4, 0.8, 0.4, "#3d2b55"],
  [ 8, 0,  -8, 0.6, 1.5, 0.6, "#2b3d55"],
  [ 8, 0,   8, 0.5, 1.0, 0.5, "#2b552d"],
  [-3, 0,   8, 0.3, 0.6, 0.3, "#55452b"],
  [ 3, 0,  -8, 0.4, 1.0, 0.4, "#552b2b"],
  [-8, 0,   2, 0.5, 0.7, 0.5, "#1e3a5f"],
  [ 8, 0,   0, 0.3, 0.5, 0.3, "#3f1e5f"],
  [ 0, 0,  -9, 0.7, 0.4, 0.7, "#1e5f3f"],
  [-5, 0,  -2, 0.3, 0.9, 0.3, "#5f3f1e"],
];

/** Group decoration entries by color hex so each InstancedMesh
 *  shares a single material — keeps draw calls minimal. */
function groupByColor(decorations) {
  const map = {};
  decorations.forEach((d, i) => {
    const hex = d[6];
    if (!map[hex]) map[hex] = [];
    map[hex].push(d);
  });
  return Object.entries(map);
}

const COLOR_GROUPS = groupByColor(DECORATIONS);

/** Shared BoxGeometry — one instance reused by all groups */
const SHARED_GEO = new THREE.BoxGeometry(1, 1, 1);

export default function Decorations() {
  return (
    <group>
      {COLOR_GROUPS.map(([hex, items]) => (
        <DecorGroup key={hex} hex={hex} items={items} />
      ))}
    </group>
  );
}

function DecorGroup({ hex, items }) {
  const meshRef  = useRef();
  const count    = items.length;

  // Memoize material per color
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.7,
        metalness: 0.1,
      }),
    [hex]
  );

  // Set instance matrices once after mount
  useEffect(() => {
    const mesh  = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach(([x, yOff, z, sx, sy, sz], i) => {
      dummy.position.set(x, sy / 2 + yOff, z);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[SHARED_GEO, material, count]}
      castShadow
      receiveShadow
    />
  );
}
