/* =============================================================
   HUD.jsx
   Persistent game-style HUD panel in the top-left corner.
   Always rendered above the canvas as a normal React overlay.
   Edit PLAYER_NAME / PLAYER_TAGLINE in /data/portfolio.js.
   ============================================================= */
import { PLAYER_NAME, PLAYER_TAGLINE, PLAYER_AVATAR_INITIAL } from "../data/portfolio";

export default function HUD() {
  return (
    <div className="hud-panel" aria-label="Player HUD">
      <div className="hud-avatar" aria-hidden="true">
        {PLAYER_AVATAR_INITIAL}
      </div>
      <div className="hud-info">
        <div className="hud-name">{PLAYER_NAME}</div>
        <div className="hud-tagline">{PLAYER_TAGLINE}</div>
      </div>
      <div className="hud-status">
        <span className="hud-dot" />
        <span>Online</span>
      </div>
    </div>
  );
}
