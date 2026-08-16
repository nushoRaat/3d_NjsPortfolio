import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaCode, FaEnvelope } from 'react-icons/fa';

export default function HeroSection() {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={contentBoxStyle}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={badgeStyle}
        >
          <FaCode style={{ marginRight: '8px', color: '#646cff' }} />
          Portfolio
        </motion.div>

        <h1 style={titleStyle}>
          Crafting Digital Experience & <span style={gradientTextStyle}>Interactive Web</span>
        </h1>

        <p style={subtitleStyle}>
          Welcome to my portfolio. Explore my skills, featured projects, and get in touch.
        </p>

        <div style={buttonGroupStyle}>
          <button style={primaryBtnStyle} onClick={() => handleScroll('projects')}>
            View Projects
          </button>
          <button style={secondaryBtnStyle} onClick={() => handleScroll('contact')}>
            <FaEnvelope style={{ marginRight: '8px' }} />
            Contact Me
          </button>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={scrollIndicatorStyle}
        onClick={() => handleScroll('projects')}
      >
        <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Scroll Down</span>
        <FaArrowDown style={{ color: '#646cff', marginTop: '6px' }} />
      </motion.div>
    </div>
  );
}

const containerStyle = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  background: 'radial-gradient(circle at center, #1b2a47 0%, #121D30 100%)',
  color: '#fff',
  padding: '2rem',
  boxSizing: 'border-box',
};

const contentBoxStyle = {
  maxWidth: '800px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(100, 108, 255, 0.1)',
  border: '1px solid rgba(100, 108, 255, 0.3)',
  color: '#c8d0ff',
  fontSize: '0.9rem',
  fontWeight: '500',
};

const titleStyle = {
  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
  fontWeight: '800',
  lineHeight: '1.2',
  margin: '0',
  letterSpacing: '-0.02em',
};

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #646cff 0%, #00d2ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const subtitleStyle = {
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  color: 'rgba(200, 210, 255, 0.75)',
  margin: '0',
  maxWidth: '600px',
  lineHeight: '1.6',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const primaryBtnStyle = {
  backgroundColor: '#646cff',
  color: '#fff',
  border: 'none',
  padding: '12px 28px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s, background-color 0.2s',
  boxShadow: '0 4px 14px rgba(100, 108, 255, 0.4)',
};

const secondaryBtnStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '12px 28px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'transform 0.2s, background-color 0.2s',
};

const scrollIndicatorStyle = {
  position: 'absolute',
  bottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
};
