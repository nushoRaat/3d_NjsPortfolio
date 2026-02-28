import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectOverlay({ project, onClose }) {
  const [videoError, setVideoError] = useState(false);

  // Reset video error state whenever a different project is opened
  useEffect(() => { setVideoError(false); }, [project]);

  // Close on ESC key — feels like a real game menu
  useEffect(() => {
    if (!project) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            style={panelStyle}
            initial={{ opacity: 0, scale: 0.72, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.72, y: 40 }}
            transition={{ type: 'spring', stiffness: 250, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── HUD corner brackets ── */}
            <div style={cornerTL} />
            <div style={cornerTR} />
            <div style={cornerBL} />
            <div style={cornerBR} />

            {/* ── Top status bar ── */}
            <div style={topBar}>
              <span style={systemTag}>// PROJECT_FILE</span>
              <motion.button
                style={escButton}
                onClick={onClose}
                whileHover={{ backgroundColor: '#d0b49f22', color: '#fff' }}
                whileTap={{ scale: 0.93 }}
              >
                [ ESC ]
              </motion.button>
            </div>

            {/* ── Title + tech badge ── */}
            <motion.div
              style={titleBlock}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              <div style={titleAccentBar} />
              <h2 style={titleText}>{project.title}</h2>
              <span style={langBadge}>{project.language}</span>
            </motion.div>

            {/* ── Animated divider ── */}
            <motion.div
              style={hrLine}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.22, duration: 0.45, ease: 'easeOut' }}
            />

            {/* ── Description ── */}
            <motion.p
              style={descText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span style={{ color: '#d0b49f', marginRight: '0.4rem' }}>▸</span>
              {project.description}
            </motion.p>

            {/* ── Video viewport ── */}
            {project.video && !videoError && (
              <motion.div
                style={videoWrapper}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <span style={videoCaption}>◉ LIVE&nbsp;&nbsp;PREVIEW</span>
                <video
                  controls
                  width="100%"
                  style={videoEl}
                  onError={() => setVideoError(true)}
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              </motion.div>
            )}

            {/* ── Action button ── */}
            {project.link && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                style={{ marginTop: '1.5rem' }}
              >
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={playBtn}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: '0 0 24px #d0b49f55, 0 0 8px #d0b49f88',
                    color: '#fff',
                    borderColor: '#e4d4c8',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  ▶&nbsp;&nbsp;PLAY
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

// Scanline pattern on the backdrop gives a retro-monitor feel
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(5, 3, 2, 0.85)',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const panelStyle = {
  position: 'relative',
  width: '90%',
  maxWidth: '640px',
  maxHeight: '85vh',
  overflowY: 'auto',
  background: 'linear-gradient(160deg, #1c100a 0%, #0e0906 100%)',
  border: '1px solid #a3785b',
  borderRadius: '4px',
  boxShadow:
    '0 0 35px #a3785b44, 0 0 70px #52291522, inset 0 0 40px rgba(0,0,0,0.55)',
  padding: '2rem',
};

// L-shaped HUD corner brackets
const cornerBase = { position: 'absolute', width: '18px', height: '18px' };
const cornerTL = { ...cornerBase, top: 10, left: 10, borderTop: '2px solid #d0b49f', borderLeft: '2px solid #d0b49f' };
const cornerTR = { ...cornerBase, top: 10, right: 10, borderTop: '2px solid #d0b49f', borderRight: '2px solid #d0b49f' };
const cornerBL = { ...cornerBase, bottom: 10, left: 10, borderBottom: '2px solid #d0b49f', borderLeft: '2px solid #d0b49f' };
const cornerBR = { ...cornerBase, bottom: 10, right: 10, borderBottom: '2px solid #d0b49f', borderRight: '2px solid #d0b49f' };

const topBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.25rem',
};

const systemTag = {
  fontFamily: 'monospace',
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  color: '#a3785b',
};

const escButton = {
  background: 'transparent',
  border: '1px solid #a3785b',
  color: '#a3785b',
  fontFamily: 'monospace',
  fontSize: '0.68rem',
  letterSpacing: '0.08em',
  padding: '4px 12px',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const titleBlock = {
  marginBottom: '1rem',
};

const titleAccentBar = {
  width: '36px',
  height: '3px',
  background: 'linear-gradient(90deg, #d0b49f, #a3785b)',
  borderRadius: '2px',
  marginBottom: '0.5rem',
};

const titleText = {
  margin: '0 0 0.6rem',
  fontSize: '1.85rem',
  fontWeight: 700,
  color: '#e4d4c8',
  letterSpacing: '0.02em',
  lineHeight: 1.1,
};

const langBadge = {
  display: 'inline-block',
  background: 'rgba(208,180,159,0.1)',
  border: '1px solid rgba(208,180,159,0.35)',
  color: '#d0b49f',
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '3px 12px',
  borderRadius: '2px',
};

const hrLine = {
  height: '1px',
  background: 'linear-gradient(90deg, #a3785b 0%, transparent 100%)',
  marginBottom: '1.1rem',
  transformOrigin: 'left',
};

const descText = {
  color: '#bbb',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  margin: '0 0 0.5rem',
};

const videoWrapper = {
  marginTop: '1rem',
  border: '1px solid rgba(163,120,91,0.35)',
  borderRadius: '3px',
  overflow: 'hidden',
  background: '#000',
};

const videoCaption = {
  display: 'block',
  padding: '5px 12px',
  background: '#110a06',
  borderBottom: '1px solid rgba(163,120,91,0.3)',
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  letterSpacing: '0.18em',
  color: '#a3785b',
};

const videoEl = {
  display: 'block',
  width: '100%',
};

const playBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.7rem 2rem',
  background: 'transparent',
  border: '1px solid #d0b49f',
  color: '#d0b49f',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'color 0.2s ease, border-color 0.2s ease',
};
