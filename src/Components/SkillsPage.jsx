import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCircle from './FloatingCircle';

export default function SkillScene() {
  const [activeSection, setActiveSection] = useState('Experience');

  const whyHireMeDetails = {
    Experience: {
      description: 'I have over 2 years of experience delivering data-driven solutions, building web apps, and automating tasks.',
      items: [
        'Developed 15+ automation scripts in Python',
        'Built interactive dashboards in Power BI',
        'Led a team of 3 junior developers',
        'Optimized supply chain processes with data insights',
         'Optimized supply chain processes with data insights',
          'Optimized supply chain processes with data insights',
           'Optimized supply chain processes with data insights',
      ],
    },
    Skills: {
      description: 'Here are some of the key skills I bring to the table:',
    },
    Education: {
      description: 'Bachelor’s in Computer Science Engineering with strong academic record and practical exposure.',
      items: [
        'Graduated with honors from XYZ University',
        'Completed capstone on machine learning pipelines',
        'Won 1st prize in university coding challenge',
        'Participated in open-source projects',
      ],
    },
    Filler: {
      description: 'I am passionate, a quick learner, and always eager to take on new challenges and contribute meaningfully.',
      items: [
        'Strong problem-solving mindset',
        'Excellent communication skills',
        'Highly adaptable to new technologies',
        'Always learning and improving',
      ],
    },
  };

  const skills = [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'React', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'Power BI', level: 'Intermediate' },
    { name: 'Unity (C#)', level: 'Intermediate' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'HTML/CSS', level: 'Advanced' },
    { name: 'Data Analysis', level: 'Intermediate' },
    { name: 'Data Analysis', level: 'Intermediate' },
    { name: 'Data Analysis', level: 'Intermediate' },
  ];

  return (
    <motion.div 
      style={skillsPageStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      
<FloatingCircle 
  position={{ top: '30%', right: '3rem' }} 
  size={400}
  color="#e4d4c8"
/>
<FloatingCircle 
  position={{ bottom: '10%', left: '2rem' }} 
  size={150}
  color="#D0B49F"
/>


      <div style={twoColumnContainer}>
        {/* Left Buttons */}
        <div style={leftColumn}>
          <h1 style={whyHireMeTitle}>Why Hire Me</h1>
          <p style={subText}>Discover what makes me a strong candidate</p>
          <div style={buttonGroup}>
            {['Experience', 'Skills', 'Education', 'Filler'].map(section => (
              <motion.button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  ...buttonStyle,
                  backgroundColor: activeSection === section ? '#e4d4c8' : 'transparent',
                  color: activeSection === section ? '#000' : '#e4d4c8',
                }}
                whileHover={{ scale: 1.1 }}
              >
                {section}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Dynamic Content */}
        <div style={rightColumn}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h2 style={activeTitle}>{"My " + activeSection}</h2>
              <p style={detailsText}>{whyHireMeDetails[activeSection].description}</p>

              {activeSection === 'Skills' ? (
                <div style={skillsGrid}>
                  {skills.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      style={skillCardStyle}
                      whileHover={{ scale: 1.1, boxShadow: '0 0 20px #d0b49f #e4d4c8' }}
                    >
                      <h4 style={{ margin: '0 0 0.5rem' }}>{skill.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc' }}>{skill.level}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={detailGrid}>
                  {whyHireMeDetails[activeSection].items?.map((item, idx) => (
                    <div key={idx} style={detailCard}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Styles
const skillsPageStyle = {
  width: '100%',
  minHeight: '100vh',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background:'#523a28',
  //background: 'radial-gradient(circle at center,rgb(1, 39, 18) 40%, #111 100%)',
  color: '#fff',
};


const twoColumnContainer = {
  display: 'flex',
  width: '100%',
  maxWidth: '1000px',
  gap: '2rem',
};

const leftColumn = {
  flex: 1,
  borderRight: '1px solid #d0b49f',
  paddingRight: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
};

const whyHireMeTitle = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
};

const subText = {
  color: '#ccc',
  marginBottom: '1.5rem',
};

const buttonGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  borderRadius: '5px',
  border: '1px solid #d0b49f',
  backgroundColor: 'transparent',
  color: '#d0b49f',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
};

const rightColumn = {
  flex: 2,
  paddingLeft: '1.5rem',
  paddingBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  height: '400px', // Fixed height so grids scroll inside
  overflow: 'hidden',
};

const activeTitle = {
  fontSize: '1.8rem',
  color: '#e4d4c8',
  marginBottom: '1rem',
};

const detailsText = {
  color: '#ccc',
  fontSize: '1.1rem',
  marginBottom: '1rem',
  lineHeight: 1.5,
};

const skillsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '1rem',
  paddingRight: '0.5rem',
  flex: 1,
};

const skillCardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '1rem',
  borderRadius: '10px',
  textAlign: 'center',
  color: '#fff',
  transition: 'all 0.3s ease',
};

const detailGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  overflowY: 'auto',
  paddingRight: '0.5rem',
  flex: 1,
};

const detailCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  color: '#ccc',
};
