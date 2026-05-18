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
                whileHover={{ backgroundColor: '#505BE622', color: '#fff' }}
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

            {/* ── Role ── */}
            {project.role && (
              <motion.div
                style={roleRow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.26 }}
              >
                <span style={roleLabel}>ROLE</span>
                <span style={roleValue}>{project.role}</span>
              </motion.div>
            )}

            {/* ── Description ── */}
            <motion.p
              style={descText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span style={{ color: '#505BE6', marginRight: '0.4rem' }}>▸</span>
              {project.description}
            </motion.p>

            {/* ── Image gallery grid ── */}
            {project.images && project.images.length > 0 && (
              <motion.div
                style={galleryWrapper}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
              >
                <span style={videoCaption}>◫ GALLERY</span>
                <div style={galleryGrid}>
                  <div style={galleryLeft}>
                    <img src={project.images[0]} alt={`${project.title} screenshot 1`} style={galleryImgFill} />
                  </div>
                  <div style={galleryRight}>
                    {project.images[1] && (
                      <div style={galleryRightCell}>
                        <img src={project.images[1]} alt={`${project.title} screenshot 2`} style={galleryImgFill} />
                      </div>
                    )}
                    {project.images[2] && (
                      <div style={galleryRightCell}>
                        <img src={project.images[2]} alt={`${project.title} screenshot 3`} style={galleryImgFill} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

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
                    boxShadow: '0 0 24px #505BE655, 0 0 8px #505BE688',
                    color: '#fff',
                    borderColor: '#c8d0ff',
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
  backgroundColor: 'rgba(5, 8, 18,0.85)',
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
  background: 'linear-gradient(160deg, #0d1025 0%, #0a0d1a 100%)',
  border: '1px solid #224D75',
  borderRadius: '4px',
  boxShadow:
    '0 0 35px #224D7544, 0 0 70px #52291522, inset 0 0 40px rgba(0,0,0,0.55)',
  padding: '2rem',
};

// L-shaped HUD corner brackets
const cornerBase = { position: 'absolute', width: '18px', height: '18px' };
const cornerTL = { ...cornerBase, top: 10, left: 10, borderTop: '2px solid #505BE6', borderLeft: '2px solid #505BE6' };
const cornerTR = { ...cornerBase, top: 10, right: 10, borderTop: '2px solid #505BE6', borderRight: '2px solid #505BE6' };
const cornerBL = { ...cornerBase, bottom: 10, left: 10, borderBottom: '2px solid #505BE6', borderLeft: '2px solid #505BE6' };
const cornerBR = { ...cornerBase, bottom: 10, right: 10, borderBottom: '2px solid #505BE6', borderRight: '2px solid #505BE6' };

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
  color: '#224D75',
};

const escButton = {
  background: 'transparent',
  border: '1px solid #224D75',
  color: '#224D75',
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
  background: 'linear-gradient(90deg, #505BE6, #224D75)',
  borderRadius: '2px',
  marginBottom: '0.5rem',
};

const titleText = {
  margin: '0 0 0.6rem',
  fontSize: '1.85rem',
  fontWeight: 700,
  color: '#c8d0ff',
  letterSpacing: '0.02em',
  lineHeight: 1.1,
};

const langBadge = {
  display: 'inline-block',
  background: 'rgba(80,91,230,0.1)',
  border: '1px solid rgba(80,91,230,0.35)',
  color: '#505BE6',
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '3px 12px',
  borderRadius: '2px',
};

const hrLine = {
  height: '1px',
  background: 'linear-gradient(90deg, #224D75 0%, transparent 100%)',
  marginBottom: '1.1rem',
  transformOrigin: 'left',
};

const roleRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '0.8rem',
};

const roleLabel = {
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  letterSpacing: '0.14em',
  color: '#224D75',
  background: 'rgba(34,77,117,0.12)',
  border: '1px solid rgba(34,77,117,0.3)',
  padding: '2px 8px',
  borderRadius: '2px',
};

const roleValue = {
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  color: '#c8d0ff',
  letterSpacing: '0.04em',
};

const descText = {
  color: '#bbb',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  margin: '0 0 0.5rem',
};

const videoWrapper = {
  marginTop: '1rem',
  border: '1px solid rgba(34,77,117,0.35)',
  borderRadius: '3px',
  overflow: 'hidden',
  background: '#000',
};

const videoCaption = {
  display: 'block',
  padding: '5px 12px',
  background: '#080c18',
  borderBottom: '1px solid rgba(34,77,117,0.3)',
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  letterSpacing: '0.18em',
  color: '#224D75',
};

const videoEl = {
  display: 'block',
  width: '100%',
};

const galleryWrapper = {
  marginTop: '1rem',
  border: '1px solid rgba(34,77,117,0.35)',
  borderRadius: '3px',
  overflow: 'hidden',
  background: '#000',
};

const galleryGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '3px',
  padding: '3px',
  background: '#080c18',
};

const galleryLeft = {
  gridRow: '1 / 2',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '2px',
  aspectRatio: '3 / 4',
};

const galleryRight = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
};

const galleryRightCell = {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '2px',
};

const galleryImgFill = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const playBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.7rem 2rem',
  background: 'transparent',
  border: '1px solid #505BE6',
  color: '#505BE6',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'color 0.2s ease, border-color 0.2s ease',
};
