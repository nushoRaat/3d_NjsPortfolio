// Components/ProjectOverlay.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectOverlay({ project, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
    {project && (
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.3 }}
        style={overlayStyle}
        onClick={onClose}
      >
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButton}>✖</button>
        <h2 style={titleStyle}>{project.title}</h2>
        <p style={descriptionStyle}><strong>Language:</strong> {project.language}</p>
        <p style={descriptionStyle}><strong>Description:</strong> {project.description}</p>
        {project.link && (
          <p style={descriptionStyle}>
            <strong>Link:</strong> <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a>
          </p>
        )}
        {project.video && (
          <video controls width="100%" style={{ borderRadius: '10px', marginTop: '10px' }}>
            <source src={project.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '2rem',
  borderRadius: '12px',
  width: '80%',
  maxWidth: '600px',
  position: 'relative',
  color: '#111',
};

const closeButton = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};
const titleStyle = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: 'rgb(255, 255, 255)', // Gold or any color you like
};

const descriptionStyle = {
  fontSize: '1rem',
  color: 'rgba(226, 224, 224, 0.9)', // Lighter gray or any readable color
  marginBottom: '1rem',
};

