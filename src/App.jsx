// src/App.jsx
import React from 'react';
import Sidebar from './Components/SideBar.jsx';
import LandingScene from './Components/LandingScene.jsx';
import ProjectsShowcase from './Components/Projects.jsx';
import AboutScene from './Components/About.jsx';
import SkillScene from './Components/SkillsPage.jsx';

import { motion } from 'framer-motion';


export default function App() {


    
  return (
    <div style={appStyle}>
      {/* Sticky Sidebar */}
      <Sidebar />

      {/* Scrollable main content */}
      <div style={contentStyle}>
        <Section>
          <LandingScene />
        </Section>

        <Section>
          <ProjectsShowcase />
        </Section>

        <Section>
          <AboutScene />
        </Section>

        <Section>
          <SkillScene />
        </Section>
      </div>
    </div>
  );
}

// Section Component with scroll animation
function Section({ children }) {
  return (
    <motion.section
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
