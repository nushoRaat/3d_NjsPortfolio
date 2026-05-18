import React, { useRef, Component } from 'react';
import Sidebar from './Components/SideBar.jsx';
import LandingScene from './Components/LandingScene.jsx';
import ProjectsShowcase from './Components/Projects.jsx';
import AboutScene from './Components/ContactMe.jsx';
import SkillScene from './Components/SkillsPage.jsx';
import AdminApp from './admin/AdminApp.jsx';

import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { crashed: false, message: '' };
  static getDerivedStateFromError(error) { return { crashed: true, message: error?.message || String(error) }; }
  render() {
    if (this.state.crashed) return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#121D30', color:'#c8d0ff', fontFamily:"'Fira Mono', monospace", flexDirection:'column', gap:'1rem', padding:'2rem' }}>
        <span style={{ fontSize:'2rem' }}>⚠</span>
        <p style={{ margin:0 }}>Something went wrong. Please refresh.</p>
        <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(200,210,255,0.4)', maxWidth:'600px', textAlign:'center' }}>{this.state.message}</p>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<Portfolio />} />
        </Routes>
      </Router>
    </ErrorBoundary>
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
