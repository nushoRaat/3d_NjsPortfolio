import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectOverlay from './ProjectOverlay';
import projects from './ProjectList';
import FloatingRectangle from './FloatingRectangle';
import HoverTextArrow from './HoverTextArrow';

// const projects = [
//   { title: 'Project 1', description: 'Amazing VR Experience' },
//   { title: 'Project 2', description: '3D Portfolio World' },
//   { title: 'Project 3', description: 'Multiplayer Card Game' },
//   { title: 'Project 4', description: 'AI Adventure Game' },
//   // Add more projects here
// ];

export default function ProjectsShowcase() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.2,
  });

  // Cache audio objects on mount — avoids creating a new instance on every event
  const swooshRef = useRef(null);
  const clickRef = useRef(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    swooshRef.current = new Audio('/sounds/hover.mp3');
    clickRef.current = new Audio('/sounds/click.mp3');
  }, []);

  useEffect(() => {
    const handleWheel = () => {
      // Throttle to ~150ms so trackpad rapid-fire doesn't flood Audio.play()
      if (throttleRef.current) return;
      throttleRef.current = true;
      if (swooshRef.current) {
        swooshRef.current.currentTime = 0;
        swooshRef.current.play().catch(() => {});
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
      clickRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div ref={ref} style={tableStyle}>
      {/* Deck of cards on top-left */}

      <FloatingRectangle position={{ top: '25%', left: '12rem' }} size={500} textureUrl="/images/card2.jpg" spin={true} />
      {/*<HoverTextArrow text ={"click the cards!"}  x = '60%' y = '30% ' arrowSize = '50%' />*/}

      {projects.map((project, index) => (
        <motion.div
        key={index}
        initial={{ y: -200, opacity: 0, rotate: (index - projects.length / 2) * 8 }}
        animate={inView ? { y: 0, opacity: 1, rotate: (index - projects.length / 2) * 8 } : { y: -200, opacity: 0 }}
        transition={{ delay: index * 0.2, type: 'spring', stiffness: 120 }}
        style={{
          width: '120px',
          height: '180px',
          perspective: 1000,
        }}
        >
        <div
          style={{
            ...flipCardStyle,
            transform: hovered === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleCardClick(project)}
          >
          {/* Back of Card */}
          <div style={cardBackFace}></div>
      
          {/* Front of Card */}
          <div style={cardFrontFace}>
            {/* Inner border frame */}
            <div style={cardInnerBorder}>
              {/* Top-left corner */}
              <div style={cardCornerTL}>
                <span style={cardCornerNum}>{index + 1}</span>
                <span style={cardCornerStar}>★</span>
              </div>

              {/* Center content */}
              <div style={cardCenter}>
                <p style={cardCenterTitle}>{project.title}</p>
                <div style={cardDividerLine} />
                <p style={cardCenterLang}>{project.language}</p>
              </div>

              {/* Bottom-right corner (mirrored) */}
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


// Styles
const tableStyle = {
  backgroundImage: 'url("/images/pokerBoardTexture3.jpg"), radial-gradient(circle at center, #35654d 60%, #2a4b3d 100%)',
  backgroundBlendMode: 'overlay',
  height: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '3rem',
  flexWrap: 'wrap',
  padding: '2rem',
  position: 'relative',
  border: '20px solid #523a28',
  borderRadius: '30px',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5)'

};


const flipCardStyle = {
  width: '120px',
  height: '180px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.8s', // Smooth flip
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
  backfaceVisibility: 'hidden', // Important
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
  fontFamily: '"Sensation", serif',
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
const deckStyle = {
  position: 'absolute',
  top: '15%',
  left: '20%',
  transform: 'translate(0, 0)',
  width: '80px',
  height: '130px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 5,
};


const deckCardStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
};
