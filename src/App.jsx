/* =============================================================
   App.jsx — root application component
   Renders:
     - <Scene>       : the full-viewport R3F canvas
     - <HUD>         : top-left overlay
     - <Modal>       : portfolio section modal
     - <TouchControls>: mobile virtual joystick
     - <ControlsHint>: first-time movement prompt
   
   Modal state lives here so it can pause player input.
   ============================================================= */
import { useState, useCallback, Suspense } from "react";

import Scene          from "./scene/Scene";
import HUD            from "./ui/HUD";
import Modal          from "./ui/Modal";
import TouchControls  from "./ui/TouchControls";
import ControlsHint   from "./ui/ControlsHint";
import LoadingScreen  from "./ui/LoadingScreen";
import { PORTFOLIO_SECTIONS } from "./data/portfolio";
import useInput       from "./hooks/useInput";

import "./App.css";

export default function App() {
  const [activeSection, setActiveSection] = useState(null);

  // Expose setTouchInput so TouchControls can feed into the shared hook
  // NOTE: useInput is called here and passed down so Scene & TouchControls
  //       share the exact same inputRef instance.
  const { inputRef, setTouchInput } = useInput();

  const handleSectionActivate = useCallback((id) => {
    setActiveSection((prev) => (prev === id ? prev : id));
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveSection(null);
  }, []);

  const section = activeSection
    ? PORTFOLIO_SECTIONS.find((s) => s.id === activeSection)
    : null;

  const modalOpen = !!section;

  return (
    <div className="app-root">
      {/* ── 3D Canvas ──────────────────────────────── */}
      <div className="canvas-container">
        <Suspense fallback={<LoadingScreen />}>
          <Scene
            inputRef={inputRef}
            onSectionActivate={handleSectionActivate}
            activeSection={activeSection}
            modalOpen={modalOpen}
          />
        </Suspense>
      </div>

      {/* ── Persistent UI overlays ─────────────────── */}
      <HUD />
      <ControlsHint />

      {/* ── Portfolio modal ────────────────────────── */}
      <Modal section={section} onClose={handleModalClose} />

      {/* ── Mobile touch joystick ──────────────────── */}
      <TouchControls setTouchInput={setTouchInput} />
    </div>
  );
}
