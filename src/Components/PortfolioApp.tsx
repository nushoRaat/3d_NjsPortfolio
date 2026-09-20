import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import RoomSkeleton from './RoomSkeleton';
import DialogueModal from './DialogueModal';
import TouchJoystick from './TouchJoystick';
import { GameEngine } from '../game/engine/GameEngine';
import { InputVector } from '../game/engine/InputManager';
import { HOTSPOTS } from '../game/data/hotspots';
import { FaTrophy, FaDownload, FaKeyboard } from 'react-icons/fa';

const GameCanvas = lazy(() => import('./GameCanvas'));

export default function PortfolioApp() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [nearSpotLabel, setNearSpotLabel] = useState<string | null>(null);

  // Progression Tracking
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBonusModal, setShowBonusModal] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const gameEngineRef = useRef<GameEngine | null>(null);
  const totalHotspots = HOTSPOTS.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHotspotTrigger = (id: string) => {
    setActiveDialogueId(id);

    // Track progression
    setVisitedSpots((prev) => {
      if (!prev.has(id)) {
        const updated = new Set(prev).add(id);
        const spot = HOTSPOTS.find((s) => s.id === id);
        triggerToast(`EXPLORED ${spot?.label.toUpperCase() || id.toUpperCase()}! (${updated.size}/${totalHotspots})`);

        // 6/6 Celebration unlock
        if (updated.size === totalHotspots) {
          setTimeout(() => {
            setShowBonusModal(true);
          }, 600);
        }
        return updated;
      }
      return prev;
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleJoystickMove = (vec: InputVector) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.inputManager.setJoystickVector(vec);
    }
  };

  const progressPercentage = Math.round((visitedSpots.size / totalHotspots) * 100);

  return (
    <div style={appContainerStyle}>
      {/* Suspense fallback using RoomSkeleton */}
      <Suspense fallback={<RoomSkeleton progress={loadProgress} />}>
        <GameCanvas
          onProgress={setLoadProgress}
          onHotspotTrigger={handleHotspotTrigger}
          onHotspotNear={setNearSpotLabel}
          gameEngineRef={gameEngineRef}
        />
      </Suspense>

      {/* Top HUD Bar */}
      <header style={hudHeaderStyle}>
        {/* HUD Top-Left Player Card */}
        <div style={hudPlayerCardStyle}>
          <div style={avatarBoxStyle}>
            <span style={{ fontSize: '18px', lineHeight: '1' }}>👾</span>
          </div>
          <div style={playerInfoStyle}>
            <div style={playerNameStyle}>PLAYER 1</div>
            <div style={playerRoleStyle}>LEVEL 99 DEVELOPER</div>

            {/* Thin Progress Bar */}
            <div style={progressBarTrackStyle}>
              <div style={{ ...progressBarFillStyle, width: `${progressPercentage}%` }} />
            </div>

            {/* Quest Dots Row */}
            <div style={questDotsRowStyle}>
              {HOTSPOTS.map((spot) => {
                const isVisited = visitedSpots.has(spot.id);
                return (
                  <span
                    key={spot.id}
                    title={spot.label}
                    style={{
                      ...questDotStyle,
                      color: isVisited ? 'var(--accent-gold)' : 'var(--accent-blue)',
                      opacity: isVisited ? 1 : 0.4,
                      textShadow: isVisited ? '0 0 6px #ffd23f' : 'none',
                    }}
                  >
                    ●
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Controls Hint */}
        {!isMobile && (
          <div style={hintBoxStyle}>
            <FaKeyboard style={{ marginRight: '8px', color: 'var(--accent-teal)' }} />
            <span><strong style={boldKeywordStyle}>WASD / ARROWS</strong> TO MOVE • <strong style={boldKeywordStyle}>E</strong> TO INTERACT</span>
          </div>
        )}
      </header>

      {/* Proximity Interaction Prompt */}
      {nearSpotLabel && !activeDialogueId && (
        <div style={proximityPromptStyle}>
          <span style={proximityTextStyle}>INSPECT <strong style={{ color: 'var(--accent-gold)' }}>{nearSpotLabel.toUpperCase()}</strong></span>
          <span style={keyBadgeStyle}>{isMobile ? 'TAP' : 'PRESS E'}</span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={toastStyle}>
          <div style={toastTitleStyle}>★ QUEST UPDATE</div>
          <div style={toastSubtextStyle}>{toastMessage}</div>
        </div>
      )}

      {/* Mobile Touch Joystick */}
      {isMobile && <TouchJoystick onMove={handleJoystickMove} />}

      {/* Dialogue Modal */}
      {activeDialogueId && (
        <DialogueModal
          sectionId={activeDialogueId}
          onClose={() => setActiveDialogueId(null)}
        />
      )}

      {/* 6/6 Quest-Complete Celebration Overlay */}
      {showBonusModal && (
        <div style={bonusBackdropStyle} onClick={() => setShowBonusModal(false)}>
          <div style={bonusModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🏆</div>
            <h2 style={bonusTitleStyle}>
              100% PORTFOLIO UNLOCKED!
            </h2>
            <p style={bonusBodyStyle}>
              CONGRATULATIONS! YOU HAVE EXPLORED ALL 6 PORTFOLIO HOTSPOTS IN THE ROOM. YOU MAY NOW DOWNLOAD THE COMPLETE RESUME BELOW.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                style={downloadBtnStyle}
              >
                <FaDownload style={{ marginRight: '8px' }} /> ▶ DOWNLOAD RESUME
              </a>
              <button style={closeBonusBtnStyle} onClick={() => setShowBonusModal(false)}>
                ✕ CONTINUE EXPLORING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const appContainerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
  userSelect: 'none',
  backgroundColor: 'var(--bg-deep)',
};

const hudHeaderStyle: React.CSSProperties = {
  position: 'fixed',
  top: '1rem',
  left: '1rem',
  right: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  zIndex: 800,
  pointerEvents: 'none',
};

const hudPlayerCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '2px solid var(--accent-gold)',
  boxShadow: '3px 3px 0 #000',
  padding: '10px 14px',
  pointerEvents: 'auto',
};

const avatarBoxStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  backgroundColor: 'var(--bg-deep)',
  border: '2px solid var(--accent-gold)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const playerInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
};

const playerNameStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '11px',
  color: 'var(--parchment)',
  letterSpacing: '0.5px',
};

const playerRoleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '8px',
  color: 'var(--accent-teal)',
};

const progressBarTrackStyle: React.CSSProperties = {
  width: '130px',
  height: '8px',
  backgroundColor: 'var(--bg-deep)',
  border: '1px solid var(--accent-gold)',
  marginTop: '2px',
  overflow: 'hidden',
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--accent-pink)',
  transition: 'width 0.3s ease-in-out',
};

const questDotsRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  marginTop: '2px',
};

const questDotStyle: React.CSSProperties = {
  fontSize: '10px',
  lineHeight: '1',
  transition: 'all 0.2s ease',
};

const hintBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '2px solid var(--accent-teal)',
  boxShadow: '3px 3px 0 #000',
  padding: '8px 14px',
  color: 'var(--parchment)',
  fontSize: '16px',
  fontFamily: "'VT323', monospace",
  pointerEvents: 'auto',
};

const boldKeywordStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  color: 'var(--accent-gold)',
};

const proximityPromptStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '2px solid var(--accent-gold)',
  boxShadow: '4px 4px 0 #000',
  color: 'var(--parchment)',
  padding: '10px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  zIndex: 850,
};

const proximityTextStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '18px',
  letterSpacing: '0.5px',
};

const keyBadgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-pink)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  padding: '4px 8px',
  boxShadow: '2px 2px 0 #000',
};

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  top: '14px',
  left: '50%',
  transform: 'translate(-50%, 0%)', /* in-view — slideDown animation brings it from -160% */
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '2px solid var(--accent-gold)',
  boxShadow: '4px 4px 0 #000',
  padding: '10px 20px',
  textAlign: 'center',
  zIndex: 950,
  animation: 'slideDown 0.3s cubic-bezier(.2,.9,.3,1.3) both',
};

const toastTitleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  color: 'var(--accent-gold)',
  marginBottom: '4px',
};

const toastSubtextStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '17px',
  color: 'var(--parchment)',
};

const bonusBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(8, 17, 25, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1100,
  padding: '1rem',
};

const bonusModalStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '3px solid var(--accent-gold)',
  boxShadow: '6px 6px 0 #000',
  maxWidth: '520px',
  width: '100%',
  padding: '2rem 1.8rem',
  textAlign: 'center',
  color: 'var(--parchment)',
};

const bonusTitleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '14px',
  color: 'var(--accent-gold)',
  margin: '0 0 1rem 0',
  lineHeight: '1.4',
};

const bonusBodyStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '18px',
  lineHeight: '1.35',
  color: 'var(--parchment)',
  marginBottom: '1.5rem',
};

const downloadBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-gold)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  padding: '10px 16px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  boxShadow: '2px 2px 0 #000',
  border: 'none',
  cursor: 'pointer',
};

const closeBonusBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-teal)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  padding: '10px 16px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '2px 2px 0 #000',
};
