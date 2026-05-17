import { useState, useEffect } from 'react';
import { fetchBio, updateBio } from '../../api/portfolio';
import { fieldStyle, labelStyle, inputStyle, textareaStyle, btnPrimary, btnDanger, statusMsg } from '../adminStyles';

export default function AboutEditor() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBio()
      .then(data => setForm(data))
      .catch(() => setStatus('error:Failed to load bio'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateBio(form);
      setStatus('success:Bio updated successfully!');
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  if (loading) return <p style={{ color: '#666' }}>Loading…</p>;

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];

  return (
    <form onSubmit={handleSave} style={formStyle}>
      <h2 style={sectionTitle}>About / Bio</h2>
      <p style={helpText}>This text appears in the landing section of your portfolio.</p>

      <div style={fieldStyle}>
        <label style={labelStyle}>Your Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          placeholder="e.g. Nushrat Jahan"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Bio Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          style={{ ...textareaStyle, minHeight: '160px' }}
          placeholder="Write something about yourself…"
        />
      </div>

      {status && (
        <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
          {statusText}
        </p>
      )}

      <button type="submit" style={btnPrimary}>Save Changes</button>
    </form>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '700px' };
const sectionTitle = { margin: '0 0 0.2rem', fontSize: '1.4rem', color: '#e4d4c8' };
const helpText = { margin: '0 0 0.5rem', color: '#666', fontSize: '0.88rem' };
