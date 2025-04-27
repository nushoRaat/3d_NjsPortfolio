// src/Components/Projects.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';


// Import sounds
//import hoverSoundFile from '../assets/sounds/hover.mp3';
import clickSoundFile from '../assets/sounds/click.mp3';

// Project data
const projects = [
  {
    title: "Game Portal",
    description: "A 3D game marketplace made with Three.js and React.",
    link: "#"
  },
  {
    title: "Portfolio Universe",
    description: "A sci-fi personal portfolio with cosmic 3D elements.",
    link: "#"
  },
  {
    title: "Racing Rush",
    description: "Multiplayer futuristic racing game with WebGL.",
    link: "#"
  },
];

// Sound setup
//const hoverSound = new Audio(hoverSoundFile);
const clickSound = new Audio(clickSoundFile);

// Animation for card entrance
const cardVariants = {
  offscreen: {
    y: 100,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export default function ProjectsShowcase() {
  return (
    <div style={containerStyle}>
      {projects.map((project, index) => (
        <motion.div
          key={index}
          className="project-card"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          {/* Tilt effect wrapper */}
          <Tilt
            options={{ max: 10, scale: 1.02, speed: 400, glare: true, "max-glare": 0.2 }}
            style={tiltCardStyle}
          >
            <div
              style={cardInnerStyle}
              //onMouseEnter={() => hoverSound.play()}
              onClick={() => clickSound.play()}
            >
              <h2 style={titleStyle}>{project.title}</h2>
              <p style={descStyle}>{project.description}</p>
            </div>
          </Tilt>
        </motion.div>
      ))}
    </div>
  );
}

// Styles
const containerStyle = {
  height: '100vh',
  padding: '6rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3rem',
  background: '#111',
};

const tiltCardStyle = {
  width: '260px',
};

const cardInnerStyle = {
  background: 'linear-gradient(145deg, #1e1e1e, #2c2c2c)',
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
  cursor: 'pointer',
  color: '#fff',
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.5rem',
};

const descStyle = {
  fontSize: '1rem',
  color: '#aaa',
};
