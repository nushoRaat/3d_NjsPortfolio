import { useState } from 'react';
import { login } from '../api/portfolio';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(password);
      localStorage.setItem('admin_token', token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <span style={logoIconStyle}>◈</span>
          <h1 style={titleStyle}>Portfolio Admin</h1>
        </div>
        <p style={subtitleStyle}>Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={inputStyle}
              autoFocus
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={hintStyle}>Default password: <code style={codeStyle}>admin123</code></p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#0d0d0d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', sans-serif",
};

const cardStyle = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '16px',
  padding: '2.5rem',
  width: '100%',
  maxWidth: '380px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '0.4rem',
};

const logoIconStyle = {
  fontSize: '1.6rem',
  color: '#e4d4c8',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  color: '#e4d4c8',
  fontWeight: 700,
};

const subtitleStyle = {
  margin: '0 0 2rem',
  color: '#666',
  fontSize: '0.9rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const labelStyle = {
  fontSize: '0.85rem',
  color: '#aaa',
};

const inputStyle = {
  background: '#111',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  color: '#e4d4c8',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const errorStyle = {
  color: '#e53e3e',
  fontSize: '0.85rem',
  margin: 0,
};

const btnStyle = {
  background: '#e4d4c8',
  color: '#0d0d0d',
  border: 'none',
  borderRadius: '8px',
  padding: '0.85rem',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const hintStyle = {
  marginTop: '1.5rem',
  color: '#444',
  fontSize: '0.8rem',
  textAlign: 'center',
};

const codeStyle = {
  color: '#a3785b',
  background: '#111',
  padding: '2px 6px',
  borderRadius: '4px',
};
