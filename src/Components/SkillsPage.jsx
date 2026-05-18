import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCircle from './FloatingCircle';
import { FaCode } from 'react-icons/fa';
import { ICON_MAP } from '../admin/iconMap';
import { fetchSkills } from '../api/portfolio';
import { useResponsive } from '../hooks/useResponsive';

// ─── Data ────────────────────────────────────────────────────────────────────

const TABS = ['Experience', 'Skills', 'Education', 'Soft Skills'];

const DETAILS_FALLBACK = {
  Experience: {
    description: 'Over 3 years of hands-on industry experience building games and interactive applications.',
    items: [
      'Designed and implemented multiple core game functions, ensuring smooth gameplay',
      'Led gameplay systems design for prototypes',
      'Implemented UI/UX for player-facing features',
      'Created and integrated visual effects to enhance immersion and overall game aesthetics.',
      'Collaborated in Agile cross-functional teams',
    ],
  },
  Skills: { description: 'Core technologies and tools I work with daily:' },
  Education: {
    description: "Bachelor's in Computer Science & Engineering — strong academic foundation with practical project exposure.",
    items: [
      'Graduated from Ahsanullah University of Science and Technology',
      'Served as the Joint Secretary of the AUST Innovation and Design Club',
      'Thesis Publication : Depression Detection Through Smartphone Sensing: A Federated Learning Approach',
    ],
  },
  'Soft Skills': {
    description: 'Beyond the technical — qualities that make me a strong team member.',
    items: [
      'Creative problem-solving mindset',
      'Clear and concise communicator',
      'Highly adaptable to new technologies',
      'Detail-oriented and self-driven',
      'Comfortable in fast-paced environments',
    ],
  },
};

const SKILLS_FALLBACK = [];

const LEVEL_COLOR = {
  Advanced: '#9C1FE8',
  Intermediate: '#505BE6',
  Basic: '#4d8ccc',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SkillCard({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const { name, level, pct, iconKey, tooltip } = skill;
  const Icon = ICON_MAP[iconKey] || FaCode;

  return (
    <motion.div
      style={{
        ...skillCardStyle,
        border: hovered
          ? '1px solid rgba(200,210,255,0.35)'
          : '1px solid rgba(255,255,255,0.08)',
        background: hovered
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(255,255,255,0.06)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="listitem"
    >
      <Icon size={28} color={LEVEL_COLOR[level]} style={{ marginBottom: '0.5rem' }} />
      <h4 style={skillNameStyle}>{name}</h4>
      <div style={barTrackStyle}>
        <motion.div
          style={{ ...barFillStyle, background: LEVEL_COLOR[level] }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
        />
      </div>
      <p style={{ ...levelLabelStyle, color: LEVEL_COLOR[level] }}>{level}</p>
      <AnimatePresence>
        {hovered && (
          <motion.div
            style={tooltipStyle}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailCard({ item, index }) {
  return (
    <motion.div
      style={detailCard}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      <span style={detailBullet}>▸</span>
      {item}
    </motion.div>
  );
}

// ─── Gamification Components ─────────────────────────────────────────────────

function BackgroundGrid() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(rgba(200,210,255,0.07) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

function Scanlines() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
      pointerEvents: 'none', zIndex: 3,
    }} />
  );
}

function HUDCorners() {
  return (
    <>
      <div style={{ ...hudCornerBase, top: '1rem', left: '1rem', borderTop: '2px solid rgba(156,31,232,0.5)', borderLeft: '2px solid rgba(156,31,232,0.5)' }} />
      <div style={{ ...hudCornerBase, top: '1rem', right: '1rem', borderTop: '2px solid rgba(156,31,232,0.5)', borderRight: '2px solid rgba(156,31,232,0.5)' }} />
      <div style={{ ...hudCornerBase, bottom: '1rem', left: '1rem', borderBottom: '2px solid rgba(156,31,232,0.5)', borderLeft: '2px solid rgba(156,31,232,0.5)' }} />
      <div style={{ ...hudCornerBase, bottom: '1rem', right: '1rem', borderBottom: '2px solid rgba(156,31,232,0.5)', borderRight: '2px solid rgba(156,31,232,0.5)' }} />
    </>
  );
}

const ACHIEVEMENT_NAMES = {
  Experience: 'EXPERIENCE UNLOCKED',
  Skills: 'SKILL TREE OPENED',
  Education: 'LORE DISCOVERED',
  'Soft Skills': 'PERK EQUIPPED',
};

function AchievementToast({ section }) {
  return (
    <motion.div
      style={achievementToastStyle}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span style={{ fontSize: '1.4rem' }}>🏆</span>
      <div>
        <p style={achievementTitleStyle}>ACHIEVEMENT</p>
        <p style={achievementNameStyle}>{ACHIEVEMENT_NAMES[section] || section.toUpperCase()}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SkillScene() {
  const [activeSection, setActiveSection] = useState('Experience');
  const [skills, setSkills] = useState(SKILLS_FALLBACK);
  const [details, setDetails] = useState(DETAILS_FALLBACK);
  const { isMobile, isTablet } = useResponsive();
  const isNarrow = isMobile || isTablet;

  useEffect(() => {
    fetchSkills().then(data => {
      if (data.skills) setSkills(data.skills);
      if (data.experience || data.education || data.softSkills) {
        setDetails({
          Experience: data.experience || DETAILS_FALLBACK.Experience,
          Skills: { description: 'Core technologies and tools I work with daily:' },
          Education: data.education || DETAILS_FALLBACK.Education,
          'Soft Skills': data.softSkills || DETAILS_FALLBACK['Soft Skills'],
        });
      }
    }).catch(() => { });
  }, []);

  const isMounted = useRef(false);
  const [toastSection, setToastSection] = useState(null);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    setToastSection(activeSection);
    const t = setTimeout(() => setToastSection(null), 2200);
    return () => clearTimeout(t);
  }, [activeSection]);

  const twoColStyle = {
    ...twoColumnContainer,
    flexDirection: isNarrow ? 'column' : 'row',
    gap: isNarrow ? '1rem' : '2rem',
    overflowY: isNarrow ? 'auto' : 'visible',
    flex: isNarrow ? 1 : undefined,
    width: '100%',
  };

  const leftColStyle = {
    ...leftColumn,
    borderRight: isNarrow ? 'none' : '1px solid rgba(80,91,230,0.4)',
    borderBottom: isNarrow ? '1px solid rgba(80,91,230,0.3)' : 'none',
    paddingRight: isNarrow ? 0 : '1.5rem',
    paddingBottom: isNarrow ? '1rem' : 0,
    flex: isNarrow ? 'none' : 1,
  };

  const tabGroupStyle = {
    ...buttonGroup,
    flexDirection: isNarrow ? 'row' : 'column',
    flexWrap: isNarrow ? 'wrap' : 'nowrap',
    gap: isNarrow ? '0.4rem' : '0.6rem',
  };

  const rightColStyle = {
    ...rightColumn,
    height: isNarrow ? 'auto' : '420px',
    flex: isNarrow ? 1 : 2,
    minHeight: isNarrow ? '280px' : undefined,
    maxHeight: isNarrow ? '50vh' : undefined,
    paddingLeft: isNarrow ? 0 : '1.5rem',
  };

  const pageStyle = {
    ...skillsPageStyle,
    padding: isNarrow ? '1rem' : '2rem',
  };

  return (
    <motion.div
      style={pageStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <BackgroundGrid />
      <Scanlines />
      <HUDCorners />

      {/* Decorative spheres — hidden on mobile to avoid overlap */}
      {!isMobile && (
        <FloatingCircle position={{ top: '30%', right: '3rem' }} size={400} color="#c8d0ff" />
      )}
      {!isNarrow && (
        <FloatingCircle position={{ bottom: '10%', left: '2rem' }} size={150} color="#505BE6" />
      )}

      <div style={twoColStyle}>
        {/* ── Left Column ── */}
        <div style={leftColStyle}>
          <div style={titleBlockStyle}>
            <p style={nameTagStyle}>Nushrat Jahan</p>
            <h1 style={{ ...whyHireMeTitle, fontSize: isNarrow ? '1.5rem' : '2rem' }}>Why Hire Me</h1>
            <div style={titleDivider} />
            <p style={subText}>Discover what makes me a strong candidate</p>
          </div>

          <div style={tabGroupStyle} role="tablist" aria-label="Sections">
            {TABS.map(section => (
              <motion.button
                key={section}
                role="tab"
                aria-selected={activeSection === section}
                onClick={() => setActiveSection(section)}
                style={{
                  ...buttonStyle,
                  color: activeSection === section ? '#fff' : '#c8d0ff',
                  borderColor: activeSection === section ? 'transparent' : '#505BE6',
                  borderLeftColor: activeSection === section ? '#9C1FE8' : '#505BE6',
                  borderLeftWidth: activeSection === section ? '3px' : '1px',
                  fontSize: isNarrow ? '0.82rem' : '0.95rem',
                  padding: isNarrow ? '0.45rem 0.8rem' : '0.65rem 1.2rem',
                }}
                whileHover={{ x: isNarrow ? 0 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {activeSection === section && (
                  <motion.span
                    layoutId="activePill"
                    style={pillStyle}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{section}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={rightColStyle} role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h2 style={{ ...activeTitle, fontSize: isNarrow ? '1.3rem' : '1.6rem' }}>
                My {activeSection}
              </h2>
              <p style={detailsText}>{details[activeSection]?.description}</p>

              {activeSection === 'Skills' ? (
                <div style={skillsGrid} role="list">
                  {skills.map((skill, i) => (
                    <SkillCard key={skill.id || skill.name} skill={skill} index={i} />
                  ))}
                </div>
              ) : (
                <div style={detailGrid}>
                  {details[activeSection]?.items?.map((item, idx) => (
                    <DetailCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toastSection && <AchievementToast key={toastSection} section={toastSection} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const skillsPageStyle = {
  width: '100%',
  minHeight: '100vh',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#121D30',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const twoColumnContainer = {
  display: 'flex',
  width: '100%',
  maxWidth: '1000px',
  gap: '2rem',
  zIndex: 1,
};

const leftColumn = {
  flex: 1,
  borderRight: '1px solid rgba(80,91,230,0.4)',
  paddingRight: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
};

const titleBlockStyle = {
  marginBottom: '1.5rem',
};

const nameTagStyle = {
  fontSize: '0.8rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#9C1FE8',
  margin: '0 0 0.3rem',
};

const whyHireMeTitle = {
  fontSize: '2rem',
  margin: '0 0 0.6rem',
  lineHeight: 1.1,
};

const titleDivider = {
  width: '40px',
  height: '3px',
  background: 'linear-gradient(90deg, #9C1FE8, #505BE6)',
  borderRadius: '2px',
  marginBottom: '0.6rem',
};

const subText = {
  color: '#ccc',
  fontSize: '0.9rem',
  margin: 0,
};

const buttonGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const buttonStyle = {
  position: 'relative',
  padding: '0.65rem 1.2rem',
  borderRadius: '6px',
  border: '1px solid #505BE6',
  backgroundColor: 'transparent',
  fontSize: '0.95rem',
  cursor: 'pointer',
  textAlign: 'left',
  overflow: 'hidden',
  transition: 'border-color 0.2s ease, color 0.2s ease',
};

const pillStyle = {
  position: 'absolute',
  inset: 0,
  background: '#505BE6',
  borderRadius: '5px',
  zIndex: 0,
};

const rightColumn = {
  flex: 2,
  paddingLeft: '1.5rem',
  paddingBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  height: '420px',
  overflow: 'hidden',
};

const activeTitle = {
  fontSize: '1.6rem',
  color: '#c8d0ff',
  marginBottom: '0.4rem',
  marginTop: 0,
};

const detailsText = {
  color: '#bbb',
  fontSize: '0.95rem',
  marginBottom: '1rem',
  lineHeight: 1.6,
};

const skillsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
  gap: '0.75rem',
  overflowY: 'auto',
  paddingRight: '0.25rem',
  flex: 1,
};

const skillCardStyle = {
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  padding: '0.85rem 0.6rem',
  borderRadius: '10px',
  textAlign: 'center',
  color: '#fff',
  cursor: 'default',
  position: 'relative',
  transition: 'background 0.2s ease, border 0.2s ease',
};

const skillNameStyle = {
  margin: '0 0 0.5rem',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
};

const barTrackStyle = {
  width: '100%',
  height: '3px',
  background: 'rgba(255,255,255,0.12)',
  borderRadius: '2px',
  overflow: 'hidden',
  marginBottom: '0.4rem',
};

const barFillStyle = {
  height: '100%',
  borderRadius: '2px',
};

const levelLabelStyle = {
  margin: 0,
  fontSize: '0.68rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const tooltipStyle = {
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(20,12,8,0.92)',
  border: '1px solid rgba(200,210,255,0.2)',
  color: '#c8d0ff',
  fontSize: '0.7rem',
  padding: '4px 8px',
  borderRadius: '5px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 10,
};

const detailGrid = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem',
  overflowY: 'auto',
  paddingRight: '0.5rem',
  flex: 1,
};

const detailCard = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  color: '#ddd',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

const detailBullet = {
  color: '#c8d0ff',
  fontSize: '0.7rem',
  flexShrink: 0,
};

// ─── Gamification Styles ─────────────────────────────────────────────────────

const hudCornerBase = {
  position: 'absolute',
  width: '20px',
  height: '20px',
  pointerEvents: 'none',
  zIndex: 4,
};

const achievementToastStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: 'rgba(20,12,8,0.92)',
  border: '1px solid rgba(156,31,232,0.4)',
  borderLeft: '3px solid #9C1FE8',
  borderRadius: '8px',
  padding: '0.7rem 1rem',
  zIndex: 100,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  minWidth: '180px',
  maxWidth: 'calc(100vw - 2rem)',
};

const achievementTitleStyle = {
  margin: 0,
  fontSize: '0.6rem',
  letterSpacing: '0.15em',
  color: '#9C1FE8',
  textTransform: 'uppercase',
};

const achievementNameStyle = {
  margin: 0,
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#c8d0ff',
  letterSpacing: '0.05em',
};
