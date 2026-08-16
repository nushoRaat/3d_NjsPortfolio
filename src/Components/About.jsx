import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '4rem 2rem', color: '#ffffff', background: '#121D30', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#646cff' }}>About Me</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'rgba(200, 210, 255, 0.85)' }}>
          Crafting Worlds & High-Performance Web Applications, One Line at a Time.
        </p>
      </motion.div>
    </div>
  );
}
