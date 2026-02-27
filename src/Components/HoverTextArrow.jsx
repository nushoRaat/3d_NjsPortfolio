import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function HoverTextArrow({ text = "Learn More", x = '50%', y = '50%', arrowSize = 20 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        padding: '1rem 2rem',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
    >
      <span style={{ fontSize: '1.2rem' }}>{text}</span>
      <motion.span
        style={{
          display: 'inline-block',
          width: `${arrowSize}px`,
          height: `${arrowSize}px`,
        }}
        animate={{ rotate: hovered ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        ➜
      </motion.span>
    </motion.div>
  );
}
