import { useState, useEffect } from 'react';
import { fetchContact, updateContact } from '../../api/portfolio';
import { fieldStyle, labelStyle, inputStyle, btnPrimary, statusMsg } from '../adminStyles';

export default function ContactEditor() {
  const [form, setForm] = useState({ phone: '', email: '', address: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContact()
      .then(data => setForm(data))
      .catch(() => setStatus('error:Failed to load contact info'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateContact(form);
      setStatus('success:Contact info updated!');
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  if (loading) return <p style={{ color: '#666' }}>Loading…</p>;

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];

  return (
    <form onSubmit={handleSave} style={formStyle}>
      <h2 style={sectionTitle}>Contact Information</h2>
      <p style={helpText}>Displayed in the contact section of your portfolio.</p>

      {[
        { name: 'phone', label: 'Phone Number', placeholder: '+880 1234567890' },
        { name: 'email', label: 'Email Address', placeholder: 'your@email.com' },
        { name: 'address', label: 'Location / Address', placeholder: 'City, Country' },
      ].map(({ name, label, placeholder }) => (
        <div key={name} style={fieldStyle}>
          <label style={labelStyle}>{label}</label>
          <input
            name={name}
            value={form[name] || ''}
            onChange={handleChange}
            style={inputStyle}
            placeholder={placeholder}
          />
        </div>
      ))}

      {status && (
        <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
          {statusText}
        </p>
      )}

      <button type="submit" style={btnPrimary}>Save Changes</button>
    </form>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px' };
const sectionTitle = { margin: '0 0 0.2rem', fontSize: '1.4rem', color: '#e4d4c8' };
const helpText = { margin: '0 0 0.5rem', color: '#666', fontSize: '0.88rem' };
