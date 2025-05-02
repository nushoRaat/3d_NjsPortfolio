import React, { useState, useEffect } from 'react';

export default function Sidebar() {
    const [activeSection, setActiveSection] = useState('projects');

    useEffect(() => {
      const handleScroll = () => {
        const sections = ['projects', 'experience', 'skills', 'contact'];
        let current = 'projects';
  
        sections.forEach(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              current = section;
            }
          }
        });
  
        setActiveSection(current);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <div style={sidebarStyle}>
      
      {/* Logo Section */}
      <div style={logoSpaceStyle}>
        <div style={logoPlaceholderStyle}>🎮</div>
      </div>

      {/* Links Section */}
      <nav style={navStyle}>
        <SidebarLink text="Projects" href="#projects" />
        <SidebarLink text="Experience" href="#home" />
        <SidebarLink text="Skills" href="#skills" />
        <SidebarLink text="Contact" href="#contact" />
      </nav>

    </div>
  );
}

function SidebarLink({ text, href }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        ...linkStyle,
        color: hovered ? '#00ffff' : '#ccc',
        textShadow: hovered ? '0 0 5px #00ffff, 0 0 10px #00ffff' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        
        {/* Vertical underline */}
        <div
          style={{
            width: '2px',
            height: hovered ? '20px' : '0px',
            backgroundColor: '#00ffff',
            marginRight: '5px',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Text */}
        {text}
      </div>
    </a>
  );
}

// Styles
const sidebarStyle = {
  position: 'fixed',
  top: '2%',
  left: '2%',  // Sidebar moved to the right slightly
  height: '100vh',
  width: '100px',
  backgroundColor: 'transparent',
  padding: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 20,
};

const logoSpaceStyle = {
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoPlaceholderStyle = {
  fontSize: '1.8rem',
  color: '#fff',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3rem',  // Increased gap between links
  marginTop: '2rem',
};

const linkStyle = {
  textDecoration: 'none',
  fontSize: '0.9rem',
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  fontFamily: 'Sensation, sans-serif',  // Updated font to Sensation
};
