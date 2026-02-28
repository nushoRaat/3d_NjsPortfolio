import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCircle from './FloatingCircle';
import {
  SiUnity, SiCplusplus, SiGit, SiUnrealengine, SiFigma, SiOpenai, SiDotnet,
} from 'react-icons/si';
import { FaJava, FaCode } from 'react-icons/fa';

// ─── Data ────────────────────────────────────────────────────────────────────

const TABS = ['Experience', 'Skills', 'Education', 'Soft Skills'];

const DETAILS = {
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
  Skills: {
    description: 'Core technologies and tools I work with daily:',
  },
  Education: {
    description: "Bachelor's in Computer Science & Engineering — strong academic foundation with practical project exposure.",
    items: [
      'Graduated from Ahsanullah University of Science and Technology',
      'Served as the Joint Secretary of the AUST Innovation and Design Club',
      'Thesis Publication : Depression Detection Through Smartphone Sensing: A Federated Learning Approach ',
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

const SKILLS = [
  { name: 'Unity', level: 'Advanced', pct: 88, Icon: SiUnity, tooltip: '3 years professional experience' },
  { name: 'C#', level: 'Advanced', pct: 85, Icon: SiDotnet, tooltip: 'Primary language in Unity' },
  { name: 'C++', level: 'Intermediate', pct: 82, Icon: SiCplusplus, tooltip: 'Systems & game logic' },
  { name: 'Java', level: 'Intermediate', pct: 90, Icon: FaJava, tooltip: 'OOP, data structures' },
  { name: 'Git', level: 'Advanced', pct: 65, Icon: SiGit, tooltip: 'Version control, branching' },
  { name: 'Unreal Engine', level: 'Basic', pct: 60, Icon: SiUnrealengine, tooltip: 'Blueprints, level design' },
  { name: 'Visual Studio', level: 'Advanced', pct: 92, Icon: FaCode, tooltip: 'Primary IDE' },
  { name: 'Figma', level: 'Intermediate', pct: 55, Icon: SiFigma, tooltip: 'UI/UX prototyping' },
  { name: 'Generative AI Tools', level: 'Advanced', pct: 55, Icon: SiOpenai, tooltip: 'ChatGPT, Claude, Midjourney' },
];

const LEVEL_COLOR = {
  Advanced: '#e4d4c8',
  Intermediate: '#a3785b',
  Basic: '#917463ff',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SkillCard({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const { name, level, pct, Icon, tooltip } = skill;

  return (
    <motion.div
      style={{
        ...skillCardStyle,
        border: hovered
          ? '1px solid rgba(228,212,200,0.35)'
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
      {/* Icon */}
      <Icon size={28} color={LEVEL_COLOR[level]} style={{ marginBottom: '0.5rem' }} />

      {/* Name */}
      <h4 style={skillNameStyle}>{name}</h4>

      {/* Proficiency bar */}
      <div style={barTrackStyle}>
        <motion.div
          style={{ ...barFillStyle, background: LEVEL_COLOR[level] }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Level label */}
      <p style={{ ...levelLabelStyle, color: LEVEL_COLOR[level] }}>{level}</p>

      {/* Tooltip */}
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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SkillScene() {
  const [activeSection, setActiveSection] = useState('Experience');

  return (
    <motion.div
      style={skillsPageStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <FloatingCircle position={{ top: '30%', right: '3rem' }} size={400} color="#e4d4c8" />
      <FloatingCircle position={{ bottom: '10%', left: '2rem' }} size={150} color="#D0B49F" />

      <div style={twoColumnContainer}>
        {/* ── Left Column ── */}
        <div style={leftColumn}>
          {/* Title with decorative accent */}
          <div style={titleBlockStyle}>
            <p style={nameTagStyle}>Nushrat Jahan</p>
            <h1 style={whyHireMeTitle}>Why Hire Me</h1>
            <div style={titleDivider} />
            <p style={subText}>Discover what makes me a strong candidate</p>
          </div>

          {/* Tab buttons with sliding pill indicator */}
          <div style={buttonGroup} role="tablist" aria-label="Sections">
            {TABS.map(section => (
              <motion.button
                key={section}
                role="tab"
                aria-selected={activeSection === section}
                onClick={() => setActiveSection(section)}
                style={{
                  ...buttonStyle,
                  color: activeSection === section ? '#000' : '#e4d4c8',
                  borderColor: activeSection === section ? 'transparent' : '#d0b49f',
                  borderLeftColor: activeSection === section ? '#e4d4c8' : '#d0b49f',
                  borderLeftWidth: activeSection === section ? '3px' : '1px',
                }}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Sliding pill background */}
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
        <div style={rightColumn} role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h2 style={activeTitle}>My {activeSection}</h2>
              <p style={detailsText}>{DETAILS[activeSection].description}</p>

              {activeSection === 'Skills' ? (
                <div style={skillsGrid} role="list">
                  {SKILLS.map((skill, i) => (
                    <SkillCard key={skill.name} skill={skill} index={i} />
                  ))}
                </div>
              ) : (
                <div style={detailGrid}>
                  {DETAILS[activeSection].items?.map((item, idx) => (
                    <DetailCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
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
  background: '#523a28',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
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
  borderRight: '1px solid rgba(208,180,159,0.4)',
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
  color: '#a3785b',
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
  background: 'linear-gradient(90deg, #e4d4c8, #a3785b)',
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
  border: '1px solid #d0b49f',
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
  background: '#e4d4c8',
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
  color: '#e4d4c8',
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
  border: '1px solid rgba(228,212,200,0.2)',
  color: '#e4d4c8',
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
  color: '#e4d4c8',
  fontSize: '0.7rem',
  flexShrink: 0,
};
