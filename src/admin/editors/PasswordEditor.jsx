import { useState } from 'react';
import { changePassword } from '../../api/portfolio';
import { fieldStyle, labelStyle, inputStyle, btnPrimary, statusMsg } from '../adminStyles';

export default function PasswordEditor() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [status, setStatus] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setStatus('error:New passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      setStatus('error:New password must be at least 6 characters');
      return;
    }
    setStatus('saving');
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setStatus('success:Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={sectionTitle}>Change Password</h2>
      <p style={helpText}>Update your admin panel password.</p>

      {[
        { name: 'currentPassword', label: 'Current Password' },
        { name: 'newPassword', label: 'New Password' },
        { name: 'confirm', label: 'Confirm New Password' },
      ].map(({ name, label }) => (
        <div key={name} style={fieldStyle}>
          <label style={labelStyle}>{label}</label>
          <input
            name={name}
            type="password"
            value={form[name]}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      ))}

      {status && (
        <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
          {statusText}
        </p>
      )}

      <button type="submit" style={btnPrimary}>Change Password</button>
    </form>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '400px' };
const sectionTitle = { margin: '0 0 0.2rem', fontSize: '1.4rem', color: '#e4d4c8' };
const helpText = { margin: '0 0 0.5rem', color: '#666', fontSize: '0.88rem' };
