export const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

export const labelStyle = {
  fontSize: '0.82rem',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

export const inputStyle = {
  background: '#111',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '0.65rem 0.9rem',
  color: '#e0e0e0',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

export const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
  lineHeight: 1.6,
};

export const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

export const btnPrimary = {
  background: '#e4d4c8',
  color: '#0d0d0d',
  border: 'none',
  borderRadius: '8px',
  padding: '0.7rem 1.4rem',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  alignSelf: 'flex-start',
};

export const btnSecondary = {
  background: 'transparent',
  color: '#aaa',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '0.6rem 1.2rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export const btnDanger = {
  background: 'transparent',
  color: '#e53e3e',
  border: '1px solid #e53e3e',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  fontSize: '0.82rem',
  cursor: 'pointer',
};

export const btnSmall = {
  background: 'transparent',
  color: '#a3785b',
  border: '1px solid #a3785b',
  borderRadius: '6px',
  padding: '0.4rem 0.8rem',
  fontSize: '0.8rem',
  cursor: 'pointer',
};

export const cardStyle = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '12px',
  padding: '1.25rem',
};

export const statusMsg = {
  margin: 0,
  fontSize: '0.88rem',
};
