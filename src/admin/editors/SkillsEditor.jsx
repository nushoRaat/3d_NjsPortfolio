import { useState, useEffect } from 'react';
import {
  fetchSkills, createSkill, updateSkill, deleteSkill,
} from '../../api/portfolio';
import { ICON_MAP, ICON_OPTIONS } from '../iconMap';
import {
  fieldStyle, labelStyle, inputStyle, selectStyle, btnPrimary,
  btnSecondary, btnDanger, btnSmall, cardStyle, statusMsg,
} from '../adminStyles';

const LEVELS = ['Basic', 'Intermediate', 'Advanced'];

const EMPTY = { name: '', level: 'Intermediate', pct: 50, iconKey: 'FaCode', tooltip: '' };

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills()
      .then(data => setSkills(data.skills || []))
      .catch(() => setStatus('error:Failed to load skills'))
      .finally(() => setLoading(false));
  }, []);

  function startNew() { setEditing('new'); setForm(EMPTY); setStatus(''); }
  function startEdit(s) { setEditing(s.id); setForm({ ...s }); setStatus(''); }
  function cancelEdit() { setEditing(null); setForm(EMPTY); setStatus(''); }

  function handleChange(e) {
    const value = e.target.name === 'pct' ? Number(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      if (editing === 'new') {
        const created = await createSkill(form);
        setSkills(prev => [...prev, created]);
      } else {
        const updated = await updateSkill(editing, form);
        setSkills(prev => prev.map(s => s.id === editing ? updated : s));
      }
      setStatus('success:Saved!');
      setEditing(null);
      setForm(EMPTY);
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      if (editing === id) cancelEdit();
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];
  const PreviewIcon = ICON_MAP[form.iconKey] || ICON_MAP.FaCode;

  return (
    <div style={containerStyle}>
      <div style={headerRow}>
        <h2 style={sectionTitle}>Skills</h2>
        {editing === null && (
          <button onClick={startNew} style={btnPrimary}>+ Add Skill</button>
        )}
      </div>

      {status && editing === null && (
        <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
          {statusText}
        </p>
      )}

      {editing === null && (
        <div style={gridStyle}>
          {loading && <p style={{ color: '#666' }}>Loading…</p>}
          {!loading && skills.length === 0 && <p style={{ color: '#555' }}>No skills yet.</p>}
          {skills.map(s => {
            const Icon = ICON_MAP[s.iconKey] || ICON_MAP.FaCode;
            return (
              <div key={s.id} style={skillCard}>
                <div style={skillTop}>
                  <Icon size={22} color="#a3785b" />
                  <div style={skillActions}>
                    <button style={btnSmall} onClick={() => startEdit(s)}>Edit</button>
                    <button style={btnDanger} onClick={() => handleDelete(s.id)}>×</button>
                  </div>
                </div>
                <p style={skillName}>{s.name}</p>
                <div style={barTrack}>
                  <div style={{ ...barFill, width: `${s.pct}%` }} />
                </div>
                <p style={skillLevel}>{s.level} · {s.pct}%</p>
              </div>
            );
          })}
        </div>
      )}

      {editing !== null && (
        <form onSubmit={handleSave} style={formStyle}>
          <h3 style={formTitle}>{editing === 'new' ? 'New Skill' : 'Edit Skill'}</h3>

          <div style={fieldStyle}>
            <label style={labelStyle}>Skill Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Unity" />
          </div>

          <div style={twoCol}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Level</label>
              <select name="level" value={form.level} onChange={handleChange} style={selectStyle}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Proficiency % ({form.pct}%)</label>
              <input
                name="pct"
                type="range"
                min="1"
                max="100"
                value={form.pct}
                onChange={handleChange}
                style={{ width: '100%', accentColor: '#a3785b' }}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Icon — preview: <PreviewIcon size={16} style={{ verticalAlign: 'middle', marginLeft: '6px' }} /></label>
            <select name="iconKey" value={form.iconKey} onChange={handleChange} style={selectStyle}>
              {ICON_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tooltip (hover text)</label>
            <input name="tooltip" value={form.tooltip} onChange={handleChange} style={inputStyle} placeholder="e.g. 3 years professional experience" />
          </div>

          {status && (
            <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
              {statusText}
            </p>
          )}

          <div style={btnRowStyle}>
            <button type="submit" style={btnPrimary}>{editing === 'new' ? 'Add Skill' : 'Save Changes'}</button>
            <button type="button" onClick={cancelEdit} style={btnSecondary}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const sectionTitle = { margin: 0, fontSize: '1.4rem', color: '#e4d4c8' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' };
const skillCard = { ...cardStyle, display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const skillTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const skillActions = { display: 'flex', gap: '0.3rem' };
const skillName = { margin: 0, color: '#e0e0e0', fontSize: '0.88rem', fontWeight: 600 };
const barTrack = { height: '3px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' };
const barFill = { height: '100%', background: '#a3785b', borderRadius: '2px' };
const skillLevel = { margin: 0, color: '#555', fontSize: '0.75rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' };
const formTitle = { margin: '0 0 0.5rem', color: '#a3785b', fontSize: '1.1rem' };
const twoCol = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const btnRowStyle = { display: 'flex', gap: '0.75rem' };
