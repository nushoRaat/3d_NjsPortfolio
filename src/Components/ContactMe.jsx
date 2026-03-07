import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import RippleLine from './RippleLine';
import ContactInfo from './ContactInfo';

// ─── Replace these three values with your EmailJS credentials ────────────────
// Sign up free at https://www.emailjs.com/
// 1. Create a service (Gmail/Outlook etc.) → copy the Service ID
// 2. Create an email template with variables: {{from_name}}, {{from_email}}, {{message}}
//    → copy the Template ID
// 3. Account → API Keys → copy the Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactMe() {
  const formRef = useRef(null);
  const [fields, setFields] = useState({ from_name: '', from_email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    /*To activate it, you need to do 3 things on emailjs.com (free):
    
    Create a service — connect your Gmail/Outlook → copy the Service ID
    Create a template — use these exact variable names in the template body:
    {{from_name}}, {{from_email}}, {{message}} → copy the Template ID
    Account → API Keys → copy your Public Key
    Then replace the three placeholder values at the top of ContactMe.jsx:
    
    
    const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
     */
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
        waveStart={0}
        waveEnd={1}
      />

      <motion.div
        style={contactRow}
        whileHover={{ rotateX: 0, rotateY: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
      >
        <div style={contactLeft}>
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
              whileHover={isSending ? {} : { scale: 1.05, backgroundColor: '#e4d4c8', color: '#000' }}
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Send Message'}
            </motion.button>

            {/* Feedback messages */}
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

        <div style={contactRight}>
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
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',
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
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  height: '100%',
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
  outline: 'none',
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
  transition: 'all 0.3s ease',
};
