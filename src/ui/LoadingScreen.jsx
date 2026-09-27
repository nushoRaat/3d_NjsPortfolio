/* =============================================================
   LoadingScreen.jsx
   Shown while the R3F scene is initializing (Suspense fallback).
   ============================================================= */
export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-cube">
        <div className="cube-face cube-face--top"    />
        <div className="cube-face cube-face--left"   />
        <div className="cube-face cube-face--right"  />
      </div>
      <div className="loading-text">Initialising world<span className="loading-dots" /></div>
    </div>
  );
}
