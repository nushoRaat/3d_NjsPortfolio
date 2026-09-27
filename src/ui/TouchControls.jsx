/* =============================================================
   TouchControls.jsx
   Virtual joystick for mobile. Renders a fixed joystick pad in
   the bottom-right corner. Completely hidden on desktop (media
   query in CSS).

   Props:
     setTouchInput(x, z) — from useInput hook
   ============================================================= */
import { useRef, useCallback } from "react";

const JOYSTICK_RADIUS = 48; // px — half the outer circle

export default function TouchControls({ setTouchInput }) {
  const baseRef  = useRef();
  const thumbRef = useRef();
  const activeTouch = useRef(null);
  const origin = useRef({ x: 0, y: 0 });

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onTouchStart = useCallback((e) => {
    if (activeTouch.current !== null) return;
    const t = e.changedTouches[0];
    activeTouch.current = t.identifier;
    const rect = baseRef.current.getBoundingClientRect();
    origin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top  + rect.height / 2,
    };
  }, []);

  const onTouchMove = useCallback((e) => {
    for (const t of e.changedTouches) {
      if (t.identifier !== activeTouch.current) continue;
      const dx = t.clientX - origin.current.x;
      const dy = t.clientY - origin.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx   = dist > 0 ? dx / dist : 0;
      const ny   = dist > 0 ? dy / dist : 0;
      const ratio = Math.min(1, dist / JOYSTICK_RADIUS);

      // Move thumb visually
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate(${nx * ratio * JOYSTICK_RADIUS}px, ${ny * ratio * JOYSTICK_RADIUS}px)`;
      }

      // dy maps to z (forward/back), dx maps to x (strafe)
      setTouchInput(clamp(nx * ratio, -1, 1), clamp(ny * ratio, -1, 1));
    }
  }, [setTouchInput]);

  const onTouchEnd = useCallback((e) => {
    for (const t of e.changedTouches) {
      if (t.identifier !== activeTouch.current) continue;
      activeTouch.current = null;
      if (thumbRef.current) {
        thumbRef.current.style.transform = "translate(0px, 0px)";
      }
      setTouchInput(0, 0);
    }
  }, [setTouchInput]);

  return (
    <div className="touch-controls" aria-hidden="true">
      <div
        ref={baseRef}
        className="joystick-base"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div ref={thumbRef} className="joystick-thumb" />
      </div>
    </div>
  );
}
