/* =============================================================
   Ground.jsx
   A flat 20x20 ground plane with a subtle grid pattern.
   Uses a canvas-generated texture so there are no external assets.
   ============================================================= */
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Build a canvas texture with a subtle dark grid */
function makeGridTexture(size = 512, cells = 20) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Base fill
  ctx.fillStyle = "#9f9fecff";
  ctx.fillRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  const step = size / cells;
  for (let i = 0; i <= cells; i++) {
    const x = i * step;
    const y = i * step;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

export default function Ground() {
  const texture = useMemo(() => makeGridTexture(), []);
  const meshRef = useRef();

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      {/* 20 x 20 unit plane */}
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0.0}
        color="#2c2c4cff"
      />
    </mesh>
  );
}
