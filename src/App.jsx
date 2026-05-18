import React, { useRef } from 'react';
import Sidebar from './Components/SideBar.jsx';
import LandingScene from './Components/LandingScene.jsx';
import ProjectsShowcase from './Components/Projects.jsx';
import AboutScene from './Components/ContactMe.jsx';
import SkillScene from './Components/SkillsPage.jsx';
import AdminApp from './admin/AdminApp.jsx';

import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

function Portfolio() {
  const scrollRef = useRef(null);

  return (
    <div style={appStyle}>
      <Sidebar />
      <div ref={scrollRef} style={contentStyle}>
        <Section id="home" scrollRef={scrollRef}>
          <LandingScene />
        </Section>
        <Section id="projects" scrollRef={scrollRef}>
          <ProjectsShowcase />
        </Section>
        <Section id="skills" scrollRef={scrollRef}>
          <SkillScene />
        </Section>
        <Section id="contact" scrollRef={scrollRef}>
          <AboutScene />
        </Section>
      </div>
    </div>
  );
}

function Section({ id, scrollRef, children }) {
  return (
    <motion.section
      id={id}
      style={sectionStyle}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ root: scrollRef, once: false, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}

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
