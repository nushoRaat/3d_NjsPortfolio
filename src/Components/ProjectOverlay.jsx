import React from 'react';

// ProjectOverlay Component
export default function ProjectOverlay({ project, onClose }) {
  if (!project) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={overlayContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>{project.title}</h2>
        <p><strong>Language:</strong> {project.language || 'JavaScript / React'}</p>
        <p><strong>Description:</strong> {project.description}</p>

        {project.video && (
          <video
            src={project.video}
            controls
            style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }}
          />
        )}

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Visit Project 🚀
          </a>
        )}
      </div>
    </div>
  );
}

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(5px)',
};

const overlayContentStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '600px',
  textAlign: 'center',
  color: '#111',
  fontFamily: '"Sensation", sans-serif',
};

const linkStyle = {
  marginTop: '1rem',
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#ffd700',
  color: '#111',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
};
