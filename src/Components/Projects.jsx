import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectOverlay from './ProjectOverlay';
import FloatingRectangle from './FloatingRectangle';
import { fetchProjects } from '../api/portfolio';
import { useResponsive } from '../hooks/useResponsive';

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { isMobile, isTablet } = useResponsive();
  const isNarrow = isMobile || isTablet;

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  const swooshRef = useRef(null);
  const clickRef = useRef(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    fetchProjects().then(data => setProjects(data)).catch(() => { });
  }, []);

  useEffect(() => {
    swooshRef.current = new Audio('/sounds/hover.mp3');
    clickRef.current = new Audio('/sounds/click.mp3');
  }, []);

  useEffect(() => {
    const handleWheel = () => {
      if (throttleRef.current) return;
      throttleRef.current = true;
      if (swooshRef.current) {
        swooshRef.current.currentTime = 0;
        swooshRef.current.play().catch(() => { });
      }
      setTimeout(() => { throttleRef.current = false; }, 150);
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleCardClick = useCallback((project) => {
    setSelectedProject(project);
    if (clickRef.current) {
      clickRef.current.currentTime = 0;
      clickRef.current.play().catch(() => { });
    }
  }, []);

  // Scale cards down on smaller screens
  const cardWidth = isMobile ? 90 : isTablet ? 105 : 120;
  const cardHeight = isMobile ? 135 : isTablet ? 158 : 180;
  const tableGap = isMobile ? '1.2rem' : isTablet ? '1.8rem' : '3rem';
  const tableBorder = isMobile ? '8px' : isTablet ? '12px' : '20px';

  const tableStyle = {
    backgroundImage: 'url("/images/pokerBoardTexture3.jpg"), radial-gradient(circle at center, #35654d 60%, #2a4b3d 100%)',
    backgroundBlendMode: 'overlay',
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tableGap,
    flexWrap: 'wrap',
    padding: isNarrow ? '1rem' : '2rem',
    position: 'relative',
    border: `${tableBorder} solid #505BE6`,
    borderRadius: isNarrow ? '16px' : '30px',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5)',
  };

  return (
    <div ref={ref} style={tableStyle}>
      {/* Floating decorative card — hidden on narrow screens to avoid overlap */}
      {!isNarrow && (
        <FloatingRectangle
          position={{ top: '25%', left: '12rem' }}
          size={500}
          textureUrl="/images/card2.jpg"
          spin={true}
        />
      )}

      {/* ── Flip cue ── */}
      <motion.div
        style={flipCueStyle}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: projects.length * 0.2 + 0.3, duration: 0.5 }}
      >
        <motion.span
          style={flipCueIcon}
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        >
          ♠
        </motion.span>
        <span style={flipCueText}>{isMobile ? 'Tap to flip' : 'Hover to flip'}</span>
      </motion.div>

      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ y: -200, opacity: 0, rotate: (index - projects.length / 2) * 8 }}
          animate={inView ? { y: 0, opacity: 1, rotate: (index - projects.length / 2) * 8 } : { y: -200, opacity: 0 }}
          transition={{ delay: index * 0.2, type: 'spring', stiffness: 120 }}
          style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, perspective: 1000 }}
        >
          <div
            style={{
              ...flipCardStyle,
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              transform: hovered === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onMouseEnter={() => !isMobile && setHovered(index)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            onClick={() => {
              if (isMobile) setHovered(hovered === index ? null : index);
              handleCardClick(project);
            }}
          >
            {/* Back of Card */}
            <div style={cardBackFace} />

            {/* Front of Card */}
            <div style={cardFrontFace}>
              <div style={cardInnerBorder}>
                <div style={cardCornerTL}>
                  <span style={cardCornerNum}>{index + 1}</span>
                  <span style={cardCornerStar}>★</span>
                </div>
                <div style={cardCenter}>
                  <p style={cardCenterTitle}>{project.title}</p>
                  <div style={cardDividerLine} />
                  <p style={cardCenterLang}>{project.language}</p>
                </div>
                <div style={cardCornerBR}>
                  <span style={cardCornerStar}>★</span>
                  <span style={cardCornerNum}>{index + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const flipCardStyle = {
  width: '120px',
  height: '180px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.8s',
  cursor: 'pointer',
};

const cardBackFace = {
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/images/card2.jpg")',
  boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  border: '2px ',
  backfaceVisibility: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
};

const cardFrontFace = {
  width: '100%',
  height: '100%',
  backgroundColor: '#fdf6ee',
  borderRadius: '12px',
  backfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)',
  position: 'absolute',
  top: 0,
  left: 0,
  fontFamily: "'Fira Mono', serif",
  color: '#1a1a1a',
  boxSizing: 'border-box',
  padding: '6px',
};

const cardInnerBorder = {
  width: '100%',
  height: '100%',
  border: '1.5px solid #c8a882',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: '5px',
  boxSizing: 'border-box',
};

const cardCornerTL = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  lineHeight: 1.1,
};

const cardCornerBR = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  lineHeight: 1.1,
  transform: 'rotate(180deg)',
};

const cardCornerNum = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#523a28',
};

const cardCornerStar = {
  fontSize: '9px',
  color: '#a3785b',
};

const cardCenter = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: '4px',
  padding: '0 2px',
};

const cardCenterTitle = {
  margin: 0,
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  textAlign: 'center',
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

const cardDividerLine = {
  width: '60%',
  height: '1px',
  background: '#c8a882',
  borderRadius: '1px',
};

const cardCenterLang = {
  margin: 0,
  fontSize: '8px',
  color: '#a3785b',
  textAlign: 'center',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
};

const flipCueStyle = {
  position: 'absolute',
  bottom: '8%',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  zIndex: 10,
  pointerEvents: 'none',
};

const flipCueIcon = {
  display: 'inline-block',
  fontSize: '1.2rem',
  color: '#9C1FE8',
  textShadow: '0 0 6px rgba(156,31,232,0.4)',
};

const flipCueText = {
  fontFamily: "'Fira Mono', monospace",
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
};
