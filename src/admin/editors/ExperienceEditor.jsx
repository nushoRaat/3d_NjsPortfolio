import { useState, useEffect } from 'react';
import {
  fetchSkills, updateExperience, updateEducation, updateSoftSkills,
} from '../../api/portfolio';
import {
  fieldStyle, labelStyle, inputStyle, textareaStyle, btnPrimary, statusMsg,
} from '../adminStyles';

const SECTIONS = [
  { key: 'experience', label: 'Experience', save: updateExperience },
  { key: 'education', label: 'Education', save: updateEducation },
  { key: 'softSkills', label: 'Soft Skills', save: updateSoftSkills },
];

export default function ExperienceEditor() {
  const [data, setData] = useState({
    experience: { description: '', items: [] },
    education: { description: '', items: [] },
    softSkills: { description: '', items: [] },
  });
  const [activeTab, setActiveTab] = useState('experience');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills()
      .then(({ experience, education, softSkills }) => {
        setData({
          experience: experience || { description: '', items: [] },
          education: education || { description: '', items: [] },
          softSkills: softSkills || { description: '', items: [] },
        });
      })
      .catch(() => setStatus('error:Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  function setSection(key, patch) {
    setData(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function updateItem(key, idx, value) {
    setData(prev => {
      const items = [...(prev[key].items || [])];
      items[idx] = value;
      return { ...prev, [key]: { ...prev[key], items } };
    });
  }

  function addItem(key) {
    setData(prev => ({
      ...prev,
      [key]: { ...prev[key], items: [...(prev[key].items || []), ''] },
    }));
  }

  function removeItem(key, idx) {
    setData(prev => ({
      ...prev,
      [key]: { ...prev[key], items: prev[key].items.filter((_, i) => i !== idx) },
    }));
  }

  async function handleSave(e, sectionKey, saveFn) {
    e.preventDefault();
    setStatus('saving');
    try {
      await saveFn(data[sectionKey]);
      setStatus('success:Saved!');
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  if (loading) return <p style={{ color: '#666' }}>Loading…</p>;

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];
  const current = SECTIONS.find(s => s.key === activeTab);
  const section = data[activeTab];

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitle}>Experience & Background</h2>
      <p style={helpText}>Edit the content shown in the Skills page tabs.</p>

      {/* Tab switcher */}
      <div style={tabRow}>
        {SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setStatus(''); }}
            style={{ ...tabBtn, ...(activeTab === key ? tabBtnActive : {}) }}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={e => handleSave(e, activeTab, current.save)} style={formStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Section Description</label>
          <textarea
            value={section.description}
            onChange={e => setSection(activeTab, { description: e.target.value })}
            style={{ ...textareaStyle, minHeight: '70px' }}
            placeholder="A brief description for this section…"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Bullet Points</label>
          <div style={itemsContainer}>
            {(section.items || []).map((item, idx) => (
              <div key={idx} style={itemRow}>
                <input
                  value={item}
                  onChange={e => updateItem(activeTab, idx, e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Item ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeItem(activeTab, idx)}
                  style={removeBtnStyle}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addItem(activeTab)} style={addItemBtn}>
              + Add Item
            </button>
          </div>
        </div>

        {status && (
          <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
            {statusText}
          </p>
        )}

        <button type="submit" style={btnPrimary}>Save {current.label}</button>
      </form>
    </div>
  );
}

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '700px' };
const sectionTitle = { margin: '0 0 0.2rem', fontSize: '1.4rem', color: '#e4d4c8' };
const helpText = { margin: '0 0 0.5rem', color: '#666', fontSize: '0.88rem' };
const tabRow = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' };
const tabBtn = { background: 'transparent', border: '1px solid #2a2a2a', color: '#666', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.15s' };
const tabBtnActive = { background: '#1a1a1a', border: '1px solid #a3785b', color: '#e4d4c8' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const itemsContainer = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const itemRow = { display: 'flex', gap: '0.5rem', alignItems: 'center' };
const removeBtnStyle = { background: 'transparent', border: '1px solid #e53e3e', color: '#e53e3e', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '1rem', flexShrink: 0, lineHeight: 1, padding: 0 };
const addItemBtn = { background: 'transparent', border: '1px dashed #444', color: '#666', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', alignSelf: 'flex-start' };
