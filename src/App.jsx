// src/App.jsx
import React from 'react';
import Sidebar from './Components/SideBar.jsx';
import LandingScene from './Components/LandingScene.jsx';
import ProjectsShowcase from './Components/Projects.jsx';
import AboutScene from './Components/ContactMe.jsx';
import SkillScene from './Components/SkillsPage.jsx';

import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {


    
  return (
   
    <div style={appStyle}>
      {/* Sticky Sidebar */}
      <Sidebar />

      {/* Scrollable main content */}
      <div style={contentStyle}>
        <Section id="home"> 
          <LandingScene />
        </Section>

        <Section id = "projects">
          <ProjectsShowcase />
        </Section>

        <Section id = "skills">
          <SkillScene />
        </Section>
        
        <Section id = "contact">
          <AboutScene />
        </Section>
        
        {/* <Routes>
        <Route path="/" element={<LandingScene />} />
          <Route path="/projects" element={<ProjectsShowcase />} />
          <Route path="/about" element={<AboutScene />} />
          <Route path="/skills" element={<SkillScene />} />
        </Routes> */}
      </div>
    </div>
   
  );
}

// Section Component with scroll animation
function Section({ id, children }) {
  return (
    <motion.section
      id={id}
      style={sectionStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.5 }}
    >
      {children}
    </motion.section>
  );
}


// Styles
const appStyle = {
  display: 'flex',
  overflowX: 'hidden',
  height: '100vh',
  backgroundColor: '#111',
};

const contentStyle = {
  flex: 1,
  overflowY: 'scroll',
  height: '100vh',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
};

const sectionStyle = {
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
