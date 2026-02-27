import React from 'react';
import { motion } from 'framer-motion';
import RippleLine from './RippleLine';
import ContactInfo from './ContactInfo';


export default function ContactMe() {
  return (
    <motion.div 
      style={contactPageStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
    <RippleLine
        x="50%"
        y="85%"
        width={1980}
        height={50}
        color="#d0b49f"
        waveAmplitude={10}
        waveFrequency={0.15}
        speed={0.25}
        waveStart={0}   // Wave starts at 40%
        waveEnd={1}     // Wave ends at 60%
    />

    <motion.div style={contactRow} 
     whileHover={{ rotateX: 0, rotateY: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} > 
        <div style={contactLeft}>
          <h1 style={contactTitle}>Contact Me</h1>
            <p style={contactSubText}>
            I'm always excited to connect! Drop me a message and I’ll get back to you soon.
            </p>

            <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" style={inputStyle} required />
            <input type="email" placeholder="Your Email" style={inputStyle} required />
            <textarea placeholder="Your Message" style={textareaStyle} required></textarea>
            <motion.button 
                type="submit" 
                style={submitButton}
                whileHover={{ scale: 1.1, backgroundColor: '#e4d4c8', color: '#000' }}
            >
                Send Message
            </motion.button>
            </form>
        </div>

        <div style={contactRight}>

           <ContactInfo />
         
        </div>
    </motion.div>

 
    </motion.div>
  );
}

// Styles
const contactPageStyle = {
  width: '100%',
  minHeight: '100vh',
  padding: '2rem',
background: `
  linear-gradient(
    to right,
    #523a28 0%,
    #523a28 20%,
    #6d4e35 30%,
    #6d4e35 45%,
    #A47551 55%,
    #A47551 75%,
    #D0B49F 85%,
    #D0B49F 100%
  )
  `,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


const contactRow = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1000px',
  minHeight: '500px',
  padding: '2rem',
  gap: '2rem',

  // Glassmorphism
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',

  // Optional 3D effect
  transform: 'rotateX(1deg) rotateY(2deg)',
  perspective: '1000px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};


const contactLeft = {
  flex: 1,
  minWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const contactRight = {
  flex: 1,
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',         // Center horizontally
  justifyContent: 'center',     // Center vertically
  gap: '1rem',
  height: '100%',               // Make sure it fills the parent height
};




const contactTitle = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
  color: '#e4d4c8',
};

const contactSubText = {
  fontSize: '1rem',
  color: '#ccc',
  marginBottom: '1rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '5px',
  border: '1px solid #d0b49f',
  background: 'transparent',
  color: '#fff',
  fontSize: '1rem',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
};

const submitButton = {
  padding: '0.75rem 1rem',
  borderRadius: '5px',
  border: '1px solid #d0b49f',
  backgroundColor: 'transparent',
  color: '#d0b49f',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
