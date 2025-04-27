// src/App.jsx
import React from 'react';
import Sidebar from './Components/SideBar.jsx';
import LandingScene from './Components/LandingScene.jsx';
import ProjectsShowcase from './Components/Projects.jsx';
import AboutScene from './Components/About.jsx';
import SkillScene from './Components/SkillsPage.jsx';

export default function App() {
   return (
    // <div style={appStyle}>
    //   < LandingScene />
    // </div>
    <div style={appStyle}>
      {/* Always visible Sidebar */}
      <Sidebar />

      {/* Main scrollable content */}
      <div style={contentStyle}>
        <section style={sectionStyle}>
          <LandingScene />
        </section>

        <section style={sectionStyle}>
          <ProjectsShowcase />
        </section>

        <section style={sectionStyle}>
          <AboutScene />
        </section>

        <section style={sectionStyle}>
          <SkillScene />
        </section>
      </div>
    </div>
   );
}

// Styles
const appStyle = {
  display: 'flex',
  overflowX: 'hidden',
  height: '100vh',
  backgroundColor: '#111', // Added background
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  height: '100vh',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth', // smooth scroll!
};

const sectionStyle = {
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  overflow: 'hidden',
};
