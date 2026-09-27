/* =============================================================
   useInput.js
   Centralised hook that tracks WASD / arrow key state and
   exposes an inputRef ({ x, z }) read each frame inside useFrame.
   Also supports touch joystick (from TouchControls) and
   mouse-click-to-move target (clickTarget).

   Returns:
     inputRef      — { x, z } desired direction (-1..1)
     clickTargetRef — THREE.Vector3 | null for click-to-move
   ============================================================= */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const KEY_MAP = {
  ArrowUp:    { x:  0, z: -1 },
  ArrowDown:  { x:  0, z:  1 },
  ArrowLeft:  { x: -1, z:  0 },
  ArrowRight: { x:  1, z:  0 },
  w: { x:  0, z: -1 },
  s: { x:  0, z:  1 },
  a: { x: -1, z:  0 },
  d: { x:  1, z:  0 },
  W: { x:  0, z: -1 },
  S: { x:  0, z:  1 },
  A: { x: -1, z:  0 },
  D: { x:  1, z:  0 },
};

export default function useInput() {
  const inputRef       = useRef({ x: 0, z: 0 });
  const heldKeys       = useRef(new Set());
  const touchRef       = useRef({ x: 0, z: 0 });  // from virtual joystick

  // Recompute net direction from all currently-held keys + touch
  function recalc() {
    let x = touchRef.current.x;
    let z = touchRef.current.z;
    for (const key of heldKeys.current) {
      const m = KEY_MAP[key];
      if (m) { x += m.x; z += m.z; }
    }
    // Clamp to -1..1
    inputRef.current.x = Math.max(-1, Math.min(1, x));
    inputRef.current.z = Math.max(-1, Math.min(1, z));
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (KEY_MAP[e.key]) {
        e.preventDefault();
        heldKeys.current.add(e.key);
        recalc();
      }
    }
    function onKeyUp(e) {
      heldKeys.current.delete(e.key);
      recalc();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
    };
  }, []);

  /** Called by TouchControls to set virtual joystick direction */
  function setTouchInput(x, z) {
    touchRef.current = { x, z };
    recalc();
  }

  return { inputRef, setTouchInput };
}
