import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import RippleLine from './RippleLine';
import ContactInfo from './ContactInfo';
import { useResponsive } from '../hooks/useResponsive';

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export default function ContactMe() {
  const formRef = useRef(null);
  const [fields, setFields] = useState({ from_name: '', from_email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const { isMobile, isTablet } = useResponsive();
  const isNarrow = isMobile || isTablet;

  const handleChange = (e) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        setFields({ from_name: '', from_email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      });
  };

  const isSending = status === 'sending';

  const pageStyle = {
    ...contactPageStyle,
    padding: isNarrow ? '1rem' : '2rem',
    alignItems: isNarrow ? 'flex-start' : 'center',
    overflowY: isNarrow ? 'auto' : 'hidden',
  };

  const rowStyle = {
    ...contactRow,
    flexDirection: isNarrow ? 'column' : 'row',
    padding: isNarrow ? '1.5rem 1rem' : '2rem',
    gap: isNarrow ? '1.5rem' : '2rem',
    transform: isNarrow ? 'none' : 'rotateX(1deg) rotateY(2deg)',
    minHeight: isNarrow ? 'auto' : '500px',
  };

  const leftStyle = {
    ...contactLeft,
    minWidth: isNarrow ? '100%' : '320px',
    flex: 1,
  };

  const rightStyle = {
    ...contactRight,
    minWidth: isNarrow ? '100%' : '250px',
    alignItems: isNarrow ? 'flex-start' : 'center',
    borderTop: isNarrow ? '1px solid rgba(255,255,255,0.1)' : 'none',
    paddingTop: isNarrow ? '1.5rem' : 0,
  };

  return (
    <motion.div
      style={pageStyle}
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
        color="#505BE6"
        waveAmplitude={10}
        waveFrequency={0.15}
        speed={0.25}
        waveStart={0}
        waveEnd={1}
      />

      <motion.div
        style={rowStyle}
        whileHover={isNarrow ? {} : { rotateX: 0, rotateY: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
      >
        <div style={leftStyle}>
          <h1 style={contactTitle}>Contact Me</h1>
          <p style={contactSubText}>
            I'm always excited to connect! Drop me a message and I'll get back to you soon.
          </p>

          <form ref={formRef} style={formStyle} onSubmit={handleSubmit}>
            <input
              type="text"
              name="from_name"
              placeholder="Your Name"
              style={inputStyle}
              value={fields.from_name}
              onChange={handleChange}
              required
              disabled={isSending}
            />
            <input
              type="email"
              name="from_email"
              placeholder="Your Email"
              style={inputStyle}
              value={fields.from_email}
              onChange={handleChange}
              required
              disabled={isSending}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              style={textareaStyle}
              value={fields.message}
              onChange={handleChange}
              required
              disabled={isSending}
            />

            <motion.button
              type="submit"
              style={{
                ...submitButton,
                opacity: isSending ? 0.6 : 1,
                cursor: isSending ? 'not-allowed' : 'pointer',
              }}
              whileHover={isSending ? {} : { scale: 1.05, backgroundColor: '#c8d0ff', color: '#000' }}
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Send Message'}
            </motion.button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  style={feedbackStyle('#4caf50')}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✓ Message sent! I'll get back to you soon.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  style={feedbackStyle('#f44336')}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✕ Something went wrong. Please try again or email me directly.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div style={rightStyle}>
          <ContactInfo />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const feedbackStyle = (color) => ({
  margin: 0,
  fontSize: '0.9rem',
  color,
  padding: '0.5rem 0.75rem',
  borderRadius: '5px',
  background: `${color}18`,
  border: `1px solid ${color}44`,
});

const contactPageStyle = {
  width: '100%',
  minHeight: '100vh',
  padding: '2rem',
  background: `
    linear-gradient(
      to right,
      #121D30 0%,
      #121D30 15%,
      #271198 30%,
      #271198 40%,
      #4F229E 52%,
      #4F229E 65%,
      #505BE6 85%,
      #505BE6 100%
    )
  `,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
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
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',
  transform: 'rotateX(1deg) rotateY(2deg)',
  perspective: '1000px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box',
};

const contactLeft = {
  flex: 1,
  minWidth: '280px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const contactRight = {
  flex: 1,
  minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  height: '100%',
};

const contactTitle = {
  fontSize: 'clamp(1.4rem, 4vw, 2rem)',
  marginBottom: '0.5rem',
  marginTop: 0,
  color: '#c8d0ff',
};

const contactSubText = {
  fontSize: '1rem',
  color: '#ccc',
  marginBottom: '1rem',
  margin: 0,
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '5px',
  border: '1px solid #505BE6',
  background: 'transparent',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
};

const submitButton = {
  padding: '0.75rem 1rem',
  borderRadius: '5px',
  border: '1px solid #505BE6',
  backgroundColor: 'transparent',
  color: '#505BE6',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
};
