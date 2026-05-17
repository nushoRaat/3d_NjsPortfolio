import { useState, useEffect, useRef } from 'react';
import {
  fetchProjects, createProject, updateProject, deleteProject, uploadFile,
} from '../../api/portfolio';
import {
  fieldStyle, labelStyle, inputStyle, textareaStyle, btnPrimary,
  btnSecondary, btnDanger, btnSmall, cardStyle, statusMsg,
} from '../adminStyles';

const EMPTY = {
  title: '', role: '', description: '', language: '', link: '', video: '', images: [],
};

export default function ProjectsEditor() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setStatus('error:Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  function startNew() {
    setEditing('new');
    setForm(EMPTY);
    setStatus('');
  }

  function startEdit(project) {
    setEditing(project.id);
    setForm({ ...project });
    setStatus('');
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY);
    setStatus('');
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
    } catch (err) {
      setStatus(`error:${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      if (editing === 'new') {
        const created = await createProject(form);
        setProjects(prev => [...prev, created]);
      } else {
        const updated = await updateProject(editing, form);
        setProjects(prev => prev.map(p => p.id === editing ? updated : p));
      }
      setStatus('success:Saved!');
      setEditing(null);
      setForm(EMPTY);
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (editing === id) cancelEdit();
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  const [statusType, statusText] = status.includes(':') ? status.split(':') : ['', status];

  return (
    <div style={containerStyle}>
      <div style={headerRow}>
        <h2 style={sectionTitle}>Projects</h2>
        {editing === null && (
          <button onClick={startNew} style={btnPrimary}>+ Add Project</button>
        )}
      </div>

      {status && editing === null && (
        <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
          {statusText}
        </p>
      )}

      {/* Project list */}
      {editing === null && (
        <div style={listStyle}>
          {loading && <p style={{ color: '#666' }}>Loading…</p>}
          {!loading && projects.length === 0 && (
            <p style={{ color: '#555' }}>No projects yet. Add one!</p>
          )}
          {projects.map(p => (
            <div key={p.id} style={cardStyle}>
              <div style={cardRow}>
                <div>
                  <p style={projectTitle}>{p.title}</p>
                  <p style={projectMeta}>{p.language}</p>
                </div>
                <div style={btnRow}>
                  <button style={btnSmall} onClick={() => startEdit(p)}>Edit</button>
                  <button style={btnDanger} onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / New form */}
      {editing !== null && (
        <form onSubmit={handleSave} style={formStyle}>
          <h3 style={formTitle}>{editing === 'new' ? 'New Project' : 'Edit Project'}</h3>

          {[
            { name: 'title', label: 'Title', placeholder: 'e.g. Time Looop' },
            { name: 'language', label: 'Tech / Language', placeholder: 'e.g. Unity / C#' },
            { name: 'role', label: 'Your Role', placeholder: 'e.g. Game Designer, Programmer' },
            { name: 'link', label: 'Project Link (URL)', placeholder: 'https://...' },
            { name: 'video', label: 'Video Path (optional)', placeholder: '/videos/project1.mp4' },
          ].map(({ name, label, placeholder }) => (
            <div key={name} style={fieldStyle}>
              <label style={labelStyle}>{label}</label>
              <input name={name} value={form[name] || ''} onChange={handleChange} style={inputStyle} placeholder={placeholder} />
            </div>
          ))}

          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              style={{ ...textareaStyle, minHeight: '80px' }}
              placeholder="Describe this project…"
            />
          </div>

          {/* Images */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Images</label>
            <div style={imageGrid}>
              {(form.images || []).map((img, i) => (
                <div key={i} style={imageThumb}>
                  <img src={img} alt="" style={thumbImg} onError={e => { e.target.style.opacity = 0.3; }} />
                  <button type="button" style={removeImgBtn} onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
              <button
                type="button"
                style={addImgBtn}
                onClick={() => fileRef.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : '+ Upload Image'}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            <p style={hintText}>Or enter image paths manually (comma-separated):</p>
            <input
              style={inputStyle}
              placeholder="src/assets/images/img.png, /uploads/img2.jpg"
              value={(form.images || []).join(', ')}
              onChange={e => setForm(prev => ({
                ...prev,
                images: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
              }))}
            />
          </div>

          {status && (
            <p style={{ ...statusMsg, color: statusType === 'error' ? '#e53e3e' : '#48bb78' }}>
              {statusText}
            </p>
          )}

          <div style={btnRow}>
            <button type="submit" style={btnPrimary}>
              {editing === 'new' ? 'Add Project' : 'Save Changes'}
            </button>
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
const listStyle = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const cardRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' };
const projectTitle = { margin: '0 0 0.2rem', color: '#e0e0e0', fontWeight: 600 };
const projectMeta = { margin: 0, color: '#666', fontSize: '0.82rem' };
const btnRow = { display: 'flex', gap: '0.5rem', flexShrink: 0 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px' };
const formTitle = { margin: '0 0 0.5rem', color: '#a3785b', fontSize: '1.1rem' };
const imageGrid = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' };
const imageThumb = { position: 'relative', width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #333' };
const thumbImg = { width: '100%', height: '100%', objectFit: 'cover' };
const removeImgBtn = { position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '4px', width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', lineHeight: 1, padding: 0 };
const addImgBtn = { background: '#111', border: '1px dashed #444', borderRadius: '6px', color: '#666', padding: '0 0.8rem', fontSize: '0.82rem', cursor: 'pointer', height: '60px', minWidth: '100px' };
const hintText = { margin: '0.3rem 0 0.3rem', color: '#555', fontSize: '0.78rem' };
