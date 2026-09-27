/* =============================================================
   Controls hint shown in the bottom-center.
   Disappears after the player moves for the first time.
   ============================================================= */
import { useEffect, useState } from "react";

export default function ControlsHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function hide() { setVisible(false); }
    window.addEventListener("keydown", hide, { once: true });
    // Also hide on first touch
    window.addEventListener("touchstart", hide, { once: true });
    return () => {
      window.removeEventListener("keydown", hide);
      window.removeEventListener("touchstart", hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="controls-hint" aria-label="Controls hint">
      <div className="hint-keys">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
        <span className="hint-sep">or</span>
        <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
      </div>
      <div className="hint-text">to move · walk near objects to interact</div>
    </div>
  );
}
