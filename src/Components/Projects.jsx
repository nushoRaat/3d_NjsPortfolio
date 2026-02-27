import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const swooshSound = new Audio('/sounds/hover.mp3'); 

    const handleWheel = () => {
      swooshSound.currentTime = 0;
      swooshSound.play().catch(() => {});
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
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
          onClick={() => {
            setSelectedProject(project)
            const clickSound = new Audio('/sounds/click.mp3');
            clickSound.play().catch(() => {});
          }}
          >
          {/* Back of Card */}
          <div style={cardBackFace}></div>
      
          {/* Front of Card */}
          <div style={cardFrontFace}>
            <h3 style={{ margin: '0', fontSize: '1rem' }}>{project.title}</h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem' }}>{project.description}</p>
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
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  border: '2px ',
  backfaceVisibility: 'hidden', // Important
  transform: 'rotateY(180deg)', // Front is rotated
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  textAlign: 'center',
  fontFamily: '"Sensation", serif',
  color: '#111',
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
