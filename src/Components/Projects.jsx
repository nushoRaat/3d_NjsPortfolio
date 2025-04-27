import React from 'react';

// Dummy project data
const projects = [
  { title: 'GameVerse', description: 'A 3D gaming hub built with Three.js and WebGL.', link: '#' },
  { title: 'DevPortfolio', description: 'A stunning developer portfolio using React and Tailwind.', link: '#' },
  { title: 'VR World', description: 'A virtual reality experience accessible via web browsers.', link: '#' },
  { title: 'Motion UI Kit', description: 'Reusable motion-based UI components for React apps.', link: '#' },
];

export default function ProjectsShowcase() {
  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>Projects</h2>
      <div style={projectsGridStyle}>
        {projects.map((project, index) => (
          <div key={index} style={projectCardStyle}>
            <h3 style={projectTitleStyle}>{project.title}</h3>
            <p style={projectDescStyle}>{project.description}</p>
            <a href={project.link} style={buttonStyle}>View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}

// Styles
const sectionStyle = {
  padding: '4rem 2rem',
  minHeight: '100vh',
  backgroundColor: '#111827', // Dark background
  color: '#ffffff',
};

const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: '2rem',
  textAlign: 'center',
  fontFamily: 'Sensation, sans-serif',
};

const projectsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
};

const projectCardStyle = {
  background: '#1f2937',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
};

const projectTitleStyle = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  fontFamily: 'Sensation, sans-serif',
};

const projectDescStyle = {
  fontSize: '1rem',
  marginBottom: '1.5rem',
  fontWeight: '300',
  fontFamily: 'Sensation, sans-serif',
};

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#00ffff',
  color: '#000',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  transition: 'background 0.3s ease',
};

